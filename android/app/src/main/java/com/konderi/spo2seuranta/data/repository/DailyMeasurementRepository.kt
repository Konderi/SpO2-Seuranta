package com.konderi.spo2seuranta.data.repository

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
        // Save locally first (offline-first)
        val localId = dao.insert(measurement)
        
        // Try to sync to cloud
        try {
            val userId = settingsRepository.getUserId()
            if (userId != null) {
                val measurementWithId = measurement.copy(id = localId)
                val response = apiService.createDailyMeasurement(
                    token = "", // Token added by interceptor
                    measurement = measurementWithId.toDto(userId)
                )
                
                // Update local ID with server ID if different
                if (response.isSuccessful && response.body()?.data?.id != null) {
                    val serverId = response.body()!!.data!!.id
                    if (serverId != localId) {
                        dao.update(measurementWithId.copy(id = serverId))
                        return serverId
                    }
                }
            }
        } catch (e: Exception) {
            // Offline or network error - local save is enough
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
     * Sync with cloud - download latest measurements
     */
    suspend fun syncWithCloud(): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val userId = settingsRepository.getUserId()
            if (userId == null) {
                return@withContext Result.failure(Exception("User not logged in"))
            }
            
            val response = apiService.getDailyMeasurements(token = "")
            
            if (response.isSuccessful && response.body()?.success == true) {
                val cloudMeasurements = response.body()?.data ?: emptyList()
                
                // Convert DTOs to entities and insert/update
                cloudMeasurements.forEach { dto ->
                    try {
                        val entity = dto.toEntity()
                        val existing = dao.getMeasurementById(entity.id)
                        
                        if (existing != null) {
                            // Update if exists
                            dao.update(entity)
                        } else {
                            // Insert new from cloud
                            dao.insert(entity)
                        }
                    } catch (e: Exception) {
                        // Skip individual measurement errors
                    }
                }
                
                Result.success(Unit)
            } else {
                Result.failure(Exception("Sync failed: ${response.code()}"))
            }
        } catch (e: Exception) {
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
        
        return MeasurementStatistics(
            averageSpo2 = avgSpo2,
            averageHeartRate = avgHR,
            minSpo2 = measurements.minOf { it.spo2 },
            maxSpo2 = measurements.maxOf { it.spo2 },
            minHeartRate = measurements.minOf { it.heartRate },
            maxHeartRate = measurements.maxOf { it.heartRate },
            measurementCount = measurements.size,
            lowOxygenCount = lowOxygenCount,
            period = period,
            startDate = startDate,
            endDate = endDate
        )
    }
}
