package com.konderi.spo2seuranta.data.repository

import com.konderi.spo2seuranta.data.local.DailyMeasurementDao
import com.konderi.spo2seuranta.domain.model.DailyMeasurement
import com.konderi.spo2seuranta.domain.model.MeasurementStatistics
import com.konderi.spo2seuranta.domain.model.StatisticsPeriod
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import java.time.LocalDateTime
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for daily measurements
 */
@Singleton
class DailyMeasurementRepository @Inject constructor(
    private val dao: DailyMeasurementDao
) {
    fun getAllMeasurements(): Flow<List<DailyMeasurement>> = dao.getAllMeasurements()
    
    fun getMeasurementsByDateRange(
        startDate: LocalDateTime,
        endDate: LocalDateTime
    ): Flow<List<DailyMeasurement>> = dao.getMeasurementsByDateRange(startDate, endDate)
    
    suspend fun insertMeasurement(measurement: DailyMeasurement): Long {
        return dao.insert(measurement)
    }
    
    suspend fun updateMeasurement(measurement: DailyMeasurement) {
        dao.update(measurement)
    }
    
    suspend fun deleteMeasurement(measurement: DailyMeasurement) {
        dao.delete(measurement)
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
