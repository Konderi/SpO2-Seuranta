package com.konderi.spo2seuranta.domain.model

/**
 * User settings for the application
 */
data class UserSettings(
    val lowSpo2AlertThreshold: Int = 90, // Default alert threshold
    val largeFontEnabled: Boolean = false,
    val userId: String? = null,
    val userName: String? = null,
    val userEmail: String? = null
) {
    init {
        require(lowSpo2AlertThreshold in 70..95) { "Alert threshold must be between 70 and 95" }
    }
}
