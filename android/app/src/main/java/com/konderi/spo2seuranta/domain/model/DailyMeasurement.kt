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
    val systolic: Int? = null, // 80-200 mmHg (optional)
    val diastolic: Int? = null, // 50-130 mmHg (optional)
    val notes: String = "",
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val userId: String? = null, // Google account ID for sync
    val serverId: String? = null, // Server UUID for synced measurements
    val syncedToServer: Boolean = false // Track if uploaded to server
) {
    init {
        require(spo2 in 50..100) { "SpO2 must be between 50 and 100" }
        require(heartRate in 30..220) { "Heart rate must be between 30 and 220" }
        systolic?.let { require(it in 80..200) { "Systolic pressure must be between 80 and 200" } }
        diastolic?.let { require(it in 50..130) { "Diastolic pressure must be between 50 and 130" } }
        if (systolic != null && diastolic != null) {
            require(systolic > diastolic) { "Systolic must be greater than diastolic" }
        }
    }

    fun isLowOxygen(threshold: Int): Boolean = spo2 < threshold
    
    fun isHighBloodPressure(): Boolean = 
        (systolic != null && systolic >= 140) || (diastolic != null && diastolic >= 90)
    
    fun isLowBloodPressure(): Boolean = 
        (systolic != null && systolic < 90) || (diastolic != null && diastolic < 60)
    
    /**
     * Check if this measurement needs to be synced to server
     */
    fun needsSync(): Boolean = !syncedToServer && serverId == null
}
