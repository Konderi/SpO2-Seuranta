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
    val systolicBefore: Int? = null, // 80-200 mmHg (optional)
    val diastolicBefore: Int? = null, // 50-130 mmHg (optional)
    
    // After exercise
    val spo2After: Int, // 50-100%
    val heartRateAfter: Int, // BPM
    val systolicAfter: Int? = null, // 80-200 mmHg (optional)
    val diastolicAfter: Int? = null, // 50-130 mmHg (optional)
    
    // Exercise details
    val exerciseDetails: String = "", // What exercise was performed
    val notes: String = "",
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val userId: String? = null, // Google account ID for sync
    val serverId: String? = null, // Server UUID for synced measurements
    val syncedToServer: Boolean = false // Track if uploaded to server
) {
    init {
        require(spo2Before in 50..100) { "SpO2 before must be between 50 and 100" }
        require(spo2After in 50..100) { "SpO2 after must be between 50 and 100" }
        require(heartRateBefore in 30..220) { "Heart rate before must be between 30 and 220" }
        require(heartRateAfter in 30..220) { "Heart rate after must be between 30 and 220" }
        systolicBefore?.let { require(it in 80..200) { "Systolic before must be between 80 and 200" } }
        diastolicBefore?.let { require(it in 50..130) { "Diastolic before must be between 50 and 130" } }
        systolicAfter?.let { require(it in 80..200) { "Systolic after must be between 80 and 200" } }
        diastolicAfter?.let { require(it in 50..130) { "Diastolic after must be between 50 and 130" } }
        if (systolicBefore != null && diastolicBefore != null) {
            require(systolicBefore > diastolicBefore) { "Systolic must be greater than diastolic (before)" }
        }
        if (systolicAfter != null && diastolicAfter != null) {
            require(systolicAfter > diastolicAfter) { "Systolic must be greater than diastolic (after)" }
        }
    }

    fun getSpo2Change(): Int = spo2After - spo2Before
    fun getHeartRateChange(): Int = heartRateAfter - heartRateBefore
    fun getSystolicChange(): Int? = if (systolicBefore != null && systolicAfter != null) systolicAfter - systolicBefore else null
    fun getDiastolicChange(): Int? = if (diastolicBefore != null && diastolicAfter != null) diastolicAfter - diastolicBefore else null
    fun isSignificantSpo2Drop(): Boolean = getSpo2Change() < -5
    
    /**
     * Check if this measurement needs to be synced to server
     */
    fun needsSync(): Boolean = !syncedToServer && serverId == null
}
