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
    val id: String? = null, // Server returns UUID
    
    @SerializedName("user_id")
    val userId: String,
    
    @SerializedName("spo2_before")
    val spo2Before: Int,
    
    @SerializedName("heart_rate_before")
    val heartRateBefore: Int,
    
    @SerializedName("systolic_before")
    val systolicBefore: Int? = null,
    
    @SerializedName("diastolic_before")
    val diastolicBefore: Int? = null,
    
    @SerializedName("spo2_after")
    val spo2After: Int,
    
    @SerializedName("heart_rate_after")
    val heartRateAfter: Int,
    
    @SerializedName("systolic_after")
    val systolicAfter: Int? = null,
    
    @SerializedName("diastolic_after")
    val diastolicAfter: Int? = null,
    
    @SerializedName("exercise_details")
    val exerciseDetails: String,
    
    @SerializedName("notes")
    val notes: String? = null,
    
    @SerializedName("measured_at")
    val measuredAt: Long, // Unix timestamp in seconds
    
    @SerializedName("created_at")
    val createdAt: Long? = null,
    
    @SerializedName("updated_at")
    val updatedAt: Long? = null
)

/**
 * Convert DTO to Domain Model
 */
fun ExerciseMeasurementDto.toEntity(): ExerciseMeasurement {
    return ExerciseMeasurement(
        id = 0, // Local Room ID, auto-generated
        serverId = this.id, // Server UUID
        spo2Before = this.spo2Before,
        heartRateBefore = this.heartRateBefore,
        systolicBefore = this.systolicBefore,
        diastolicBefore = this.diastolicBefore,
        spo2After = this.spo2After,
        heartRateAfter = this.heartRateAfter,
        systolicAfter = this.systolicAfter,
        diastolicAfter = this.diastolicAfter,
        exerciseDetails = this.exerciseDetails,
        notes = this.notes ?: "",
        timestamp = LocalDateTime.ofInstant(
            Instant.ofEpochSecond(this.measuredAt),
            ZoneId.systemDefault()
        ),
        syncedToServer = true // Downloaded from server, already synced
    )
}

/**
 * Convert Domain Model to DTO
 */
fun ExerciseMeasurement.toDto(userId: String): ExerciseMeasurementDto {
    return ExerciseMeasurementDto(
        id = this.serverId, // Use serverId if it exists (for updates)
        userId = userId,
        spo2Before = this.spo2Before,
        heartRateBefore = this.heartRateBefore,
        systolicBefore = this.systolicBefore,
        diastolicBefore = this.diastolicBefore,
        spo2After = this.spo2After,
        heartRateAfter = this.heartRateAfter,
        systolicAfter = this.systolicAfter,
        diastolicAfter = this.diastolicAfter,
        exerciseDetails = this.exerciseDetails,
        notes = this.notes.ifEmpty { null },
        measuredAt = this.timestamp.atZone(ZoneId.systemDefault()).toEpochSecond()
    )
}
