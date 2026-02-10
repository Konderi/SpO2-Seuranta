package com.konderi.spo2seuranta.domain.model

import java.time.LocalDateTime

/**
 * Statistics model for reports
 */
data class MeasurementStatistics(
    val averageSpo2: Double,
    val averageHeartRate: Double,
    val minSpo2: Int,
    val maxSpo2: Int,
    val minHeartRate: Int,
    val maxHeartRate: Int,
    val measurementCount: Int,
    val lowOxygenCount: Int, // Count of measurements below threshold
    val period: StatisticsPeriod,
    val startDate: LocalDateTime,
    val endDate: LocalDateTime
)

enum class StatisticsPeriod {
    SEVEN_DAYS,
    THIRTY_DAYS,
    THREE_MONTHS,
    ALL_TIME
}
