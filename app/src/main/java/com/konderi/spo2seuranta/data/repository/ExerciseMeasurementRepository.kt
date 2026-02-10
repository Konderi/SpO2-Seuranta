package com.konderi.spo2seuranta.data.repository

import com.konderi.spo2seuranta.data.local.ExerciseMeasurementDao
import com.konderi.spo2seuranta.domain.model.ExerciseMeasurement
import kotlinx.coroutines.flow.Flow
import java.time.LocalDateTime
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for exercise measurements
 */
@Singleton
class ExerciseMeasurementRepository @Inject constructor(
    private val dao: ExerciseMeasurementDao
) {
    fun getAllMeasurements(): Flow<List<ExerciseMeasurement>> = dao.getAllMeasurements()
    
    fun getMeasurementsByDateRange(
        startDate: LocalDateTime,
        endDate: LocalDateTime
    ): Flow<List<ExerciseMeasurement>> = dao.getMeasurementsByDateRange(startDate, endDate)
    
    suspend fun insertMeasurement(measurement: ExerciseMeasurement): Long {
        return dao.insert(measurement)
    }
    
    suspend fun updateMeasurement(measurement: ExerciseMeasurement) {
        dao.update(measurement)
    }
    
    suspend fun deleteMeasurement(measurement: ExerciseMeasurement) {
        dao.delete(measurement)
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
