package com.konderi.spo2seuranta.domain.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDateTime

/**
 * Domain model for daily SpO2 and heart rate measurements
 */
@Entity(tableName = "daily_measurements")
data class DailyMeasurement(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val spo2: Int, // 50-100%
    val heartRate: Int, // BPM
    val notes: String = "",
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val userId: String? = null // Google account ID for sync
) {
    init {
        require(spo2 in 50..100) { "SpO2 must be between 50 and 100" }
        require(heartRate in 30..220) { "Heart rate must be between 30 and 220" }
    }

    fun isLowOxygen(threshold: Int): Boolean = spo2 < threshold
}
