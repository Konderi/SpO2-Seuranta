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
    val id: String? = null, // Server returns UUID strings
    
    @SerializedName("user_id")
    val userId: String,
    
    @SerializedName("spo2")
    val spo2: Int,
    
    @SerializedName("heart_rate")
    val heartRate: Int,
    
    @SerializedName("systolic")
    val systolic: Int? = null,
    
    @SerializedName("diastolic")
    val diastolic: Int? = null,
    
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
fun DailyMeasurementDto.toEntity(): DailyMeasurement {
    return DailyMeasurement(
        id = 0, // Local ID will be set by Room
        spo2 = this.spo2,
        heartRate = this.heartRate,
        systolic = this.systolic,
        diastolic = this.diastolic,
        notes = this.notes ?: "",
        timestamp = LocalDateTime.ofInstant(
            Instant.ofEpochSecond(this.measuredAt),
            ZoneId.systemDefault()
        ),
        userId = this.userId,
        serverId = this.id,
        syncedToServer = true
    )
}

/**
 * Convert Domain Model to DTO
 */
fun DailyMeasurement.toDto(userId: String): DailyMeasurementDto {
    return DailyMeasurementDto(
        id = this.serverId, // Use serverId if it exists (for updates)
        userId = userId,
        spo2 = this.spo2,
        heartRate = this.heartRate,
        systolic = this.systolic,
        diastolic = this.diastolic,
        notes = this.notes.ifEmpty { null },
        measuredAt = this.timestamp.atZone(ZoneId.systemDefault()).toEpochSecond()
    )
}
