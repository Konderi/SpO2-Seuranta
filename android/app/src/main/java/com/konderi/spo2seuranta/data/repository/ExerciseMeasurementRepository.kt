package com.konderi.spo2seuranta.data.repository

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
        // Save locally first
        val localId = dao.insert(measurement)
        
        // Try to sync to cloud
        try {
            val userId = settingsRepository.getUserId()
            if (userId != null) {
                val measurementWithId = measurement.copy(id = localId)
                val response = apiService.createExerciseMeasurement(
                    token = "",
                    measurement = measurementWithId.toDto(userId)
                )
                
                // Update with server ID if different
                if (response.isSuccessful && response.body()?.data?.id != null) {
                    val serverId = response.body()!!.data!!.id
                    if (serverId != localId) {
                        dao.update(measurementWithId.copy(id = serverId))
                        return serverId
                    }
                }
            }
        } catch (e: Exception) {
            // Offline - local save is enough
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
        
        // Try to delete from cloud
        try {
            if (measurement.id > 0) {
                apiService.deleteExerciseMeasurement(
                    token = "",
                    id = measurement.id.toString()
                )
            }
        } catch (e: Exception) {
            // Offline - local delete is enough
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
            
            val response = apiService.getExerciseMeasurements(token = "")
            
            if (response.isSuccessful && response.body()?.success == true) {
                val cloudMeasurements = response.body()?.data ?: emptyList()
                
                cloudMeasurements.forEach { dto ->
                    try {
                        val entity = dto.toEntity()
                        val existing = dao.getMeasurementById(entity.id)
                        
                        if (existing != null) {
                            dao.update(entity)
                        } else {
                            dao.insert(entity)
                        }
                    } catch (e: Exception) {
                        // Skip individual errors
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
    
    suspend fun getMeasurementById(id: Long): ExerciseMeasurement? {
        return dao.getMeasurementById(id)
    }
    
    suspend fun getAverages(startDate: LocalDateTime): Pair<Double, Double>? {
        val avgBefore = dao.getAverageSpo2BeforeSince(startDate) ?: return null
        val avgAfter = dao.getAverageSpo2AfterSince(startDate) ?: return null
        return Pair(avgBefore, avgAfter)
    }
}
