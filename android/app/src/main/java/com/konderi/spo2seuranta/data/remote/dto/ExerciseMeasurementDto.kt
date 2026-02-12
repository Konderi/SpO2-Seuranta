package com.konderi.spo2seuranta.data.remote.dto

import com.google.gson.annotations.SerializedName
import com.konderi.spo2seuranta.domain.model.ExerciseMeasurement
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

/**
 * Data Transfer Object for Exercise Measurements
 * Matches the backend API format (snake_case, Unix timestamps)
 */
data class ExerciseMeasurementDto(
    @SerializedName("id")
    val id: Long = 0,
    
    @SerializedName("user_id")
    val userId: String,
    
    @SerializedName("spo2_before")
    val spo2Before: Int,
    
    @SerializedName("heart_rate_before")
    val heartRateBefore: Int,
    
    @SerializedName("spo2_after")
    val spo2After: Int,
    
    @SerializedName("heart_rate_after")
    val heartRateAfter: Int,
    
    @SerializedName("exercise_details")
    val exerciseDetails: String,
    
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
fun ExerciseMeasurementDto.toEntity(): ExerciseMeasurement {
    return ExerciseMeasurement(
        id = this.id,
        spo2Before = this.spo2Before,
        heartRateBefore = this.heartRateBefore,
        spo2After = this.spo2After,
        heartRateAfter = this.heartRateAfter,
        exerciseDetails = this.exerciseDetails,
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
fun ExerciseMeasurement.toDto(userId: String): ExerciseMeasurementDto {
    return ExerciseMeasurementDto(
        id = this.id,
        userId = userId,
        spo2Before = this.spo2Before,
        heartRateBefore = this.heartRateBefore,
        spo2After = this.spo2After,
        heartRateAfter = this.heartRateAfter,
        exerciseDetails = this.exerciseDetails,
        notes = this.notes.ifEmpty { null },
        timestamp = this.timestamp.atZone(ZoneId.systemDefault()).toEpochSecond(),
        createdAt = System.currentTimeMillis() / 1000
    )
}
