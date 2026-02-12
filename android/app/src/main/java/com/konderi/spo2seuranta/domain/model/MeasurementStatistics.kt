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
    val endDate: LocalDateTime,
    // Blood Pressure statistics
    val averageSystolic: Double? = null,
    val averageDiastolic: Double? = null,
    val minSystolic: Int? = null,
    val maxSystolic: Int? = null,
    val minDiastolic: Int? = null,
    val maxDiastolic: Int? = null,
    val bpMeasurementCount: Int = 0,
    val highBpCount: Int = 0 // Count of measurements with systolic ≥140 or diastolic ≥90
)

enum class StatisticsPeriod {
    SEVEN_DAYS,
    THIRTY_DAYS,
    THREE_MONTHS,
    ALL_TIME
}

