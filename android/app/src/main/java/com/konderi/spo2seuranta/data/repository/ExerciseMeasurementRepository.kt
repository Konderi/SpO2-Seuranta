package com.konderi.spo2seuranta.data.repository

import android.util.Log
import com.konderi.spo2seuranta.data.local.ExerciseMeasurementDao
import com.konderi.spo2seuranta.data.remote.ApiService
import com.konderi.spo2seuranta.data.remote.dto.toDto
import com.konderi.spo2seuranta.data.remote.dto.toEntity
import com.konderi.spo2seuranta.domain.model.ExerciseMeasurement
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import java.time.LocalDateTime
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for exercise measurements with cloud sync
 */
@Singleton
class ExerciseMeasurementRepository @Inject constructor(
    private val dao: ExerciseMeasurementDao,
    private val apiService: ApiService,
    private val settingsRepository: SettingsRepository
) {
    fun getAllMeasurements(): Flow<List<ExerciseMeasurement>> = dao.getAllMeasurements()
    
    fun getMeasurementsByDateRange(
        startDate: LocalDateTime,
        endDate: LocalDateTime
    ): Flow<List<ExerciseMeasurement>> = dao.getMeasurementsByDateRange(startDate, endDate)
    
    suspend fun insertMeasurement(measurement: ExerciseMeasurement): Long {
        Log.d("SYNC_TEST", "📝 ExerciseRepository: Inserting measurement...")
        
        // Save locally first with syncedToServer=false
        val unsyncedMeasurement = measurement.copy(syncedToServer = false, serverId = null)
        val localId = dao.insert(unsyncedMeasurement)
        
        // Try immediate sync to cloud
        try {
            val userId = settingsRepository.getUserId()
            if (userId != null) {
                Log.d("SYNC_TEST", "🌐 ExerciseRepository: Attempting immediate cloud sync for measurement $localId...")
                
                val measurementWithId = unsyncedMeasurement.copy(id = localId)
                val response = apiService.createExerciseMeasurement(
                    token = "",
                    measurement = measurementWithId.toDto(userId)
                )
                
                if (response.isSuccessful && response.body()?.data?.id != null) {
                    val serverId = response.body()!!.data!!.id
                    Log.d("SYNC_TEST", "✅ ExerciseRepository: Successfully synced to cloud with serverId: $serverId")
                    
                    // Update with serverId and mark as synced
                    dao.update(measurementWithId.copy(
                        syncedToServer = true,
                        serverId = serverId
                    ))
                } else {
                    Log.w("SYNC_TEST", "❌ ExerciseRepository: Failed to sync - response unsuccessful")
                }
            } else {
                Log.d("SYNC_TEST", "⚠️ ExerciseRepository: User not logged in, measurement saved locally")
            }
        } catch (e: Exception) {
            Log.d("SYNC_TEST", "📡 ExerciseRepository: Network unavailable - measurement saved locally (will sync later)")
        }
        
        return localId
    }
    
    suspend fun updateMeasurement(measurement: ExerciseMeasurement) {
        dao.update(measurement)
        // Note: API doesn't support exercise update, only delete/create
    }
    
    suspend fun deleteMeasurement(measurement: ExerciseMeasurement) {
        // Delete locally
        dao.delete(measurement)
        
        // Try to delete from cloud if it was synced
        try {
            if (measurement.serverId != null) {
                apiService.deleteExerciseMeasurement(
                    token = "",
                    id = measurement.serverId
                )
                Log.d("SYNC_TEST", "✅ ExerciseRepository: Deleted measurement from cloud: serverId=${measurement.serverId}")
            }
        } catch (e: Exception) {
            Log.d("SYNC_TEST", "❌ ExerciseRepository: Failed to delete from cloud: ${e.message}")
        }
    }
    
    /**
     * Two-way sync with cloud:
     * 1. Upload unsynced measurements
     * 2. Download latest from server and merge
     */
    suspend fun syncWithCloud(): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val userId = settingsRepository.getUserId()
            if (userId == null) {
                Log.w("SYNC_TEST", "❌ ExerciseRepository: Cannot sync - user not logged in")
                return@withContext Result.failure(Exception("User not logged in"))
            }
            
            Log.d("SYNC_TEST", "🔄 ExerciseRepository: Starting two-way sync...")
            
            // STEP 1: Upload unsynced measurements
            val unsyncedMeasurements = dao.getUnsyncedMeasurements()
            Log.d("SYNC_TEST", "📤 ExerciseRepository: Uploading ${unsyncedMeasurements.size} unsynced measurements...")
            
            unsyncedMeasurements.forEach { measurement ->
                try {
                    val response = apiService.createExerciseMeasurement(
                        token = "",
                        measurement = measurement.toDto(userId)
                    )
                    
                    if (response.isSuccessful && response.body()?.data?.id != null) {
                        val serverId = response.body()!!.data!!.id
                        dao.update(measurement.copy(
                            syncedToServer = true,
                            serverId = serverId
                        ))
                        Log.d("SYNC_TEST", "✅ ExerciseRepository: Uploaded measurement (localId=${measurement.id}) → serverId=$serverId")
                    } else {
                        Log.w("SYNC_TEST", "❌ ExerciseRepository: Failed to upload measurement ${measurement.id}")
                    }
                } catch (e: Exception) {
                    Log.e("SYNC_TEST", "❌ ExerciseRepository: Error uploading measurement ${measurement.id}: ${e.message}")
                }
            }
            
            // STEP 2: Download and merge from server
            Log.d("SYNC_TEST", "📥 ExerciseRepository: Downloading measurements from cloud...")
            val response = apiService.getExerciseMeasurements(token = "")
            
            if (response.isSuccessful && response.body()?.success == true) {
                val cloudMeasurements = response.body()?.data ?: emptyList()
                Log.d("SYNC_TEST", "📥 ExerciseRepository: Downloaded ${cloudMeasurements.size} measurements from cloud")
                
                cloudMeasurements.forEach { dto ->
                    try {
                        val entity = dto.toEntity()
                        
                        // Check if we already have this measurement by serverId
                        val existingByServerId = if (dto.id != null) {
                            dao.getMeasurementByServerId(dto.id)
                        } else {
                            null
                        }
                        
                        if (existingByServerId != null) {
                            // Update existing measurement
                            dao.update(entity.copy(id = existingByServerId.id))
                            Log.d("SYNC_TEST", "🔄 ExerciseRepository: Updated measurement serverId=${dto.id}")
                        } else {
                            // Insert new measurement from server
                            dao.insert(entity)
                            Log.d("SYNC_TEST", "➕ ExerciseRepository: Inserted new measurement serverId=${dto.id}")
                        }
                    } catch (e: Exception) {
                        Log.e("SYNC_TEST", "❌ ExerciseRepository: Error processing measurement: ${e.message}")
                    }
                }
                
                Log.d("SYNC_TEST", "✅ ExerciseRepository: Two-way sync completed successfully")
                Result.success(Unit)
            } else {
                Log.w("SYNC_TEST", "❌ ExerciseRepository: Download failed: ${response.code()}")
                Result.failure(Exception("Sync failed: ${response.code()}"))
            }
        } catch (e: Exception) {
            Log.e("SYNC_TEST", "❌ ExerciseRepository: Sync failed with exception: ${e.message}")
            Result.failure(e)
        }
    }
    
    suspend fun getMeasurementById(id: Long): ExerciseMeasurement? {
        return dao.getMeasurementById(id)
    }
    
    suspend fun getAverages(startDate: LocalDateTime): Pair<Double, Double>? {
        val avgBefore = dao.getAverageSpo2BeforeSince(startDate) ?: return null
        val avgAfter = dao.getAverageSpo2AfterSince(startDate) ?: return null
        return Pair(avgBefore, avgAfter)
    }
}
