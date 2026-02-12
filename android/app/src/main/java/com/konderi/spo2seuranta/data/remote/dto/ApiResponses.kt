package com.konderi.spo2seuranta.data.remote.dto

import com.google.gson.annotations.SerializedName

/**
 * Generic API response wrapper
 */
data class ApiResponse<T>(
    @SerializedName("success")
    val success: Boolean,
    
    @SerializedName("data")
    val data: T? = null,
    
    @SerializedName("error")
    val error: String? = null,
    
    @SerializedName("message")
    val message: String? = null
)

/**
 * Response for list endpoints
 */
data class ListResponse<T>(
    @SerializedName("success")
    val success: Boolean,
    
    @SerializedName("data")
    val data: List<T> = emptyList(),
    
    @SerializedName("count")
    val count: Int = 0,
    
    @SerializedName("error")
    val error: String? = null
)

/**
 * Statistics response from API
 */
data class StatisticsDto(
    @SerializedName("average_spo2")
    val averageSpo2: Double,
    
    @SerializedName("average_heart_rate")
    val averageHeartRate: Double,
    
    @SerializedName("min_spo2")
    val minSpo2: Int,
    
    @SerializedName("max_spo2")
    val maxSpo2: Int,
    
    @SerializedName("min_heart_rate")
    val minHeartRate: Int,
    
    @SerializedName("max_heart_rate")
    val maxHeartRate: Int,
    
    @SerializedName("measurement_count")
    val measurementCount: Int,
    
    @SerializedName("period_start")
    val periodStart: Long,
    
    @SerializedName("period_end")
    val periodEnd: Long
)
