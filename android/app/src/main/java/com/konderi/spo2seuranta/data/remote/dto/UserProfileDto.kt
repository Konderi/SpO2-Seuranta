package com.konderi.spo2seuranta.data.remote.dto

import com.google.gson.annotations.SerializedName

/**
 * Data Transfer Object for User Profile
 * Matches the backend API format
 */
data class UserProfileDto(
    @SerializedName("id")
    val id: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("display_name")
    val displayName: String?,
    
    @SerializedName("created_at")
    val createdAt: Long,
    
    @SerializedName("updated_at")
    val updatedAt: Long,
    
    @SerializedName("last_login")
    val lastLogin: Long
)
