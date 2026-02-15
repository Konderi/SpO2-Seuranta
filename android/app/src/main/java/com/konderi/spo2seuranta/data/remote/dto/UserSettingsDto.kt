package com.konderi.spo2seuranta.data.remote.dto

import com.google.gson.annotations.SerializedName

/**
 * DTO for user settings API communication
 */
data class UserSettingsDto(
    @SerializedName("user_id")
    val userId: String? = null,
    
    @SerializedName("spo2_low_threshold")
    val spo2LowThreshold: Int? = null,
    
    @SerializedName("spo2_high_threshold")
    val spo2HighThreshold: Int? = null,
    
    @SerializedName("heart_rate_low_threshold")
    val heartRateLowThreshold: Int? = null,
    
    @SerializedName("heart_rate_high_threshold")
    val heartRateHighThreshold: Int? = null,
    
    @SerializedName("large_font_enabled")
    val largeFontEnabled: Boolean? = null,
    
    @SerializedName("manual_entry_enabled")
    val manualEntryEnabled: Boolean? = null,
    
    @SerializedName("notifications_enabled")
    val notificationsEnabled: Boolean? = null,
    
    @SerializedName("gender")
    val gender: String? = null,
    
    @SerializedName("birth_year")
    val birthYear: Int? = null,
    
    @SerializedName("created_at")
    val createdAt: Long? = null,
    
    @SerializedName("updated_at")
    val updatedAt: Long? = null
)

/**
 * Request body for updating user settings
 */
data class UpdateUserSettingsRequest(
    @SerializedName("spo2_low_threshold")
    val spo2LowThreshold: Int? = null,
    
    @SerializedName("large_font_enabled")
    val largeFontEnabled: Boolean? = null,
    
    @SerializedName("manual_entry_enabled")
    val manualEntryEnabled: Boolean? = null,
    
    @SerializedName("gender")
    val gender: String? = null,
    
    @SerializedName("birth_year")
    val birthYear: Int? = null
)
