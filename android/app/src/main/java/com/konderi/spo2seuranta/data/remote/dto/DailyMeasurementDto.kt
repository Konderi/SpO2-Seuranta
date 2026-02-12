package com.konderi.spo2seuranta.data.remote.dto

import com.google.gson.annotations.SerializedName
import com.konderi.spo2seuranta.domain.model.DailyMeasurement
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

/**
 * Data Transfer Object for Daily Measurements
 * Matches the backend API format (snake_case, Unix timestamps)
 */
data class DailyMeasurementDto(
    @SerializedName("id")
    val id: Long = 0,
    
    @SerializedName("user_id")
    val userId: String,
    
    @SerializedName("spo2")
    val spo2: Int,
    
    @SerializedName("heart_rate")
    val heartRate: Int,
    
    @SerializedName("notes")
    val notes: String? = null,
    
    @SerializedName("timestamp")
    val timestamp: Long, // Unix timestamp in seconds
    
    @SerializedName("created_at")
    val createdAt: Long? = null
)

/**
 * Convert DTO to Domain Model
 */
fun DailyMeasurementDto.toEntity(): DailyMeasurement {
    return DailyMeasurement(
        id = this.id,
        spo2 = this.spo2,
        heartRate = this.heartRate,
        notes = this.notes ?: "",
        timestamp = LocalDateTime.ofInstant(
            Instant.ofEpochSecond(this.timestamp),
            ZoneId.systemDefault()
        )
    )
}

/**
 * Convert Domain Model to DTO
 */
fun DailyMeasurement.toDto(userId: String): DailyMeasurementDto {
    return DailyMeasurementDto(
        id = this.id,
        userId = userId,
        spo2 = this.spo2,
        heartRate = this.heartRate,
        notes = this.notes.ifEmpty { null },
        timestamp = this.timestamp.atZone(ZoneId.systemDefault()).toEpochSecond(),
        createdAt = System.currentTimeMillis() / 1000
    )
}
