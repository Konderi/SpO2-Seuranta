package com.konderi.spo2seuranta.data.repository

import android.util.Log
import com.konderi.spo2seuranta.data.local.DailyMeasurementDao
import com.konderi.spo2seuranta.data.remote.ApiService
import com.konderi.spo2seuranta.data.remote.dto.toDto
import com.konderi.spo2seuranta.data.remote.dto.toEntity
import com.konderi.spo2seuranta.domain.model.DailyMeasurement
import com.konderi.spo2seuranta.domain.model.MeasurementStatistics
import com.konderi.spo2seuranta.domain.model.StatisticsPeriod
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext
import java.time.LocalDateTime
import java.time.ZoneId
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for daily measurements with cloud sync
 */
@Singleton
class DailyMeasurementRepository @Inject constructor(
    private val dao: DailyMeasurementDao,
    private val apiService: ApiService,
    private val settingsRepository: SettingsRepository
) {
    fun getAllMeasurements(): Flow<List<DailyMeasurement>> = dao.getAllMeasurements()
    
    fun getMeasurementsByDateRange(
        startDate: LocalDateTime,
        endDate: LocalDateTime
    ): Flow<List<DailyMeasurement>> = dao.getMeasurementsByDateRange(startDate, endDate)
    
    suspend fun insertMeasurement(measurement: DailyMeasurement): Long {
        // Save locally first (offline-first) - mark as not synced
        val unsyncedMeasurement = measurement.copy(syncedToServer = false, serverId = null)
        val localId = dao.insert(unsyncedMeasurement)
        Log.d("SYNC_TEST", "✅ Saved locally: ID=$localId, SpO2=${measurement.spo2}%, HR=${measurement.heartRate}")
        
        // Try to sync to cloud immediately
        try {
            val userId = settingsRepository.getUserId()
            if (userId != null) {
                Log.d("SYNC_TEST", "🌐 Syncing to cloud for user: $userId")
                
                // Ensure user profile exists first
                try {
                    apiService.getUserProfile(token = "")
                } catch (e: Exception) {
                    // Ignore profile check errors
                }
                
                val measurementWithId = unsyncedMeasurement.copy(id = localId)
                val response = apiService.createDailyMeasurement(
                    token = "", // Token added by interceptor
                    measurement = measurementWithId.toDto(userId)
                )
                
                Log.d("SYNC_TEST", "📡 API Response: ${response.code()} ${if (response.isSuccessful) "✅ SUCCESS" else "❌ FAILED"}")
                
                // Log error body if failed
                if (!response.isSuccessful) {
                    val errorBody = response.errorBody()?.string()
                    Log.e("SYNC_TEST", "❌ Error body: $errorBody")
                }
                
                // Mark as synced and store server ID
                if (response.isSuccessful && response.body()?.data?.id != null) {
                    val serverId = response.body()!!.data!!.id
                    Log.d("SYNC_TEST", "🎉 Cloud sync complete! Server ID: $serverId")
                    
                    // Update with sync status and server ID
                    dao.update(measurementWithId.copy(
                        syncedToServer = true,
                        serverId = serverId
                    ))
                }
            } else {
                Log.w("SYNC_TEST", "⚠️ No userId - skipping cloud sync")
            }
        } catch (e: Exception) {
            Log.e("SYNC_TEST", "❌ Sync failed: ${e.message}", e)
            // Offline or network error - local save is enough, will sync later
        }
        
        return localId
    }
    
    suspend fun updateMeasurement(measurement: DailyMeasurement) {
        // Update locally
        dao.update(measurement)
        
        // Try to sync to cloud
        try {
            val userId = settingsRepository.getUserId()
            if (userId != null && measurement.id > 0) {
                apiService.updateDailyMeasurement(
                    token = "",
                    id = measurement.id.toString(),
                    measurement = measurement.toDto(userId)
                )
            }
        } catch (e: Exception) {
            // Offline or network error - local update is enough
        }
    }
    
    suspend fun deleteMeasurement(measurement: DailyMeasurement) {
        // Delete locally
        dao.delete(measurement)
        
        // Try to delete from cloud
        try {
            if (measurement.id > 0) {
                apiService.deleteDailyMeasurement(
                    token = "",
                    id = measurement.id.toString()
                )
            }
        } catch (e: Exception) {
            // Offline or network error - local delete is enough
        }
    }
    
    /**
     * Sync with cloud - two-way sync (upload unsynced, then download latest)
     */
    suspend fun syncWithCloud(): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val userId = settingsRepository.getUserId()
            if (userId == null) {
                return@withContext Result.failure(Exception("User not logged in"))
            }
            
            // STEP 0: Ensure user profile exists in database (for foreign key constraint)
            try {
                Log.d("SYNC_TEST", "👤 Ensuring user profile exists...")
                val profileResponse = apiService.getUserProfile(token = "")
                if (profileResponse.isSuccessful) {
                    Log.d("SYNC_TEST", "✅ User profile confirmed")
                } else {
                    Log.w("SYNC_TEST", "⚠️ User profile check failed: ${profileResponse.code()}")
                }
            } catch (e: Exception) {
                Log.w("SYNC_TEST", "⚠️ User profile check error: ${e.message}")
                // Continue anyway - might be network issue
            }
            
            // STEP 1: Upload unsynced local measurements to server
            val unsyncedMeasurements = dao.getUnsyncedMeasurements()
            Log.d("SYNC_TEST", "📤 Uploading ${unsyncedMeasurements.size} unsynced measurements")
            
            unsyncedMeasurements.forEach { measurement ->
                try {
                    val response = apiService.createDailyMeasurement(
                        token = "",
                        measurement = measurement.toDto(userId)
                    )
                    
                    if (response.isSuccessful && response.body()?.data?.id != null) {
                        val serverId = response.body()!!.data!!.id
                        // Mark as synced with server ID
                        dao.update(measurement.copy(
                            syncedToServer = true,
                            serverId = serverId
                        ))
                        Log.d("SYNC_TEST", "✅ Uploaded measurement ID ${measurement.id} → Server ID: $serverId")
                    }
                } catch (e: Exception) {
                    Log.e("SYNC_TEST", "❌ Failed to upload measurement ${measurement.id}: ${e.message}")
                    // Continue with other measurements
                }
            }
            
            // STEP 2: Download latest from server and merge
            val response = apiService.getDailyMeasurements(token = "")
            
            if (response.isSuccessful && response.body()?.success == true) {
                val cloudMeasurements = response.body()?.data ?: emptyList()
                Log.d("SYNC_TEST", "📥 Downloaded ${cloudMeasurements.size} measurements from server")
                
                // Convert DTOs to entities and insert/update
                cloudMeasurements.forEach { dto ->
                    try {
                        val entity = dto.toEntity().copy(
                            syncedToServer = true,
                            serverId = dto.id
                        )
                        
                        // Check if we already have this measurement by server ID
                        val existingByServerId = entity.serverId?.let { dao.getMeasurementByServerId(it) }
                        
                        if (existingByServerId != null) {
                            // Update existing measurement
                            dao.update(entity.copy(id = existingByServerId.id))
                        } else {
                            // Insert new from cloud
                            dao.insert(entity)
                        }
                    } catch (e: Exception) {
                        Log.e("SYNC_TEST", "❌ Failed to process cloud measurement: ${e.message}")
                        // Skip individual measurement errors
                    }
                }
                
                Log.d("SYNC_TEST", "✅ Sync complete!")
                Result.success(Unit)
            } else {
                Result.failure(Exception("Sync failed: ${response.code()}"))
            }
        } catch (e: Exception) {
            Log.e("SYNC_TEST", "❌ Sync error: ${e.message}", e)
            Result.failure(e)
        }
    }
    
    suspend fun getMeasurementById(id: Long): DailyMeasurement? {
        return dao.getMeasurementById(id)
    }
    
    suspend fun getStatistics(period: StatisticsPeriod, threshold: Int): MeasurementStatistics? {
        val endDate = LocalDateTime.now()
        val startDate = when (period) {
            StatisticsPeriod.SEVEN_DAYS -> endDate.minusDays(7)
            StatisticsPeriod.THIRTY_DAYS -> endDate.minusDays(30)
            StatisticsPeriod.THREE_MONTHS -> endDate.minusMonths(3)
            StatisticsPeriod.ALL_TIME -> LocalDateTime.of(2020, 1, 1, 0, 0)
        }
        
        val avgSpo2 = dao.getAverageSpo2Since(startDate)
        val avgHR = dao.getAverageHeartRateSince(startDate)
        val lowOxygenCount = dao.getLowOxygenCountSince(threshold, startDate)
        
        // Return null if no data
        if (avgSpo2 == null || avgHR == null) return null
        
        // Get measurements for min/max calculation using first() instead of collect()
        val measurements = dao.getMeasurementsByDateRange(startDate, endDate).first()
        
        if (measurements.isEmpty()) return null
        
        // Filter out measurements with null values for statistics
        val validSpo2 = measurements.mapNotNull { it.spo2 }
        val validHR = measurements.mapNotNull { it.heartRate }
        
        if (validSpo2.isEmpty() || validHR.isEmpty()) return null
        
        // Calculate blood pressure statistics
        val validSystolic = measurements.mapNotNull { it.systolic }
        val validDiastolic = measurements.mapNotNull { it.diastolic }
        
        val avgSystolic = if (validSystolic.isNotEmpty()) validSystolic.average() else null
        val avgDiastolic = if (validDiastolic.isNotEmpty()) validDiastolic.average() else null
        val bpMeasurementCount = measurements.count { it.systolic != null && it.diastolic != null }
        val highBpCount = measurements.count { 
            (it.systolic != null && it.systolic >= 140) || 
            (it.diastolic != null && it.diastolic >= 90)
        }
        
        return MeasurementStatistics(
            averageSpo2 = avgSpo2,
            averageHeartRate = avgHR,
            minSpo2 = validSpo2.minOrNull() ?: 0,
            maxSpo2 = validSpo2.maxOrNull() ?: 0,
            minHeartRate = validHR.minOrNull() ?: 0,
            maxHeartRate = validHR.maxOrNull() ?: 0,
            measurementCount = measurements.size,
            lowOxygenCount = lowOxygenCount,
            period = period,
            startDate = startDate,
            endDate = endDate,
            // Blood pressure stats
            averageSystolic = avgSystolic,
            averageDiastolic = avgDiastolic,
            minSystolic = validSystolic.minOrNull(),
            maxSystolic = validSystolic.maxOrNull(),
            minDiastolic = validDiastolic.minOrNull(),
            maxDiastolic = validDiastolic.maxOrNull(),
            bpMeasurementCount = bpMeasurementCount,
            highBpCount = highBpCount
        )
    }
}
