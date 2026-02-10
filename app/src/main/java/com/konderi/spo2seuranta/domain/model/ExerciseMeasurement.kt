package com.konderi.spo2seuranta.domain.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDateTime

/**
 * Domain model for exercise-related SpO2 and heart rate measurements
 */
@Entity(tableName = "exercise_measurements")
data class ExerciseMeasurement(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    
    // Before exercise
    val spo2Before: Int, // 50-100%
    val heartRateBefore: Int, // BPM
    
    // After exercise
    val spo2After: Int, // 50-100%
    val heartRateAfter: Int, // BPM
    
    // Exercise details
    val exerciseDetails: String = "", // What exercise was performed
    val notes: String = "",
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val userId: String? = null // Google account ID for sync
) {
    init {
        require(spo2Before in 50..100) { "SpO2 before must be between 50 and 100" }
        require(spo2After in 50..100) { "SpO2 after must be between 50 and 100" }
        require(heartRateBefore in 30..220) { "Heart rate before must be between 30 and 220" }
        require(heartRateAfter in 30..220) { "Heart rate after must be between 30 and 220" }
    }

    fun getSpo2Change(): Int = spo2After - spo2Before
    fun getHeartRateChange(): Int = heartRateAfter - heartRateBefore
    fun isSignificantSpo2Drop(): Boolean = getSpo2Change() < -5
}
