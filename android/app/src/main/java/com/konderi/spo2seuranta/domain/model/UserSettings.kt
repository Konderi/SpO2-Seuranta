package com.konderi.spo2seuranta.domain.model

import com.konderi.spo2seuranta.utils.BPGuidelinesUtil

/**
 * User settings for the application
 */
data class UserSettings(
    val lowSpo2AlertThreshold: Int = 90, // Default alert threshold
    val largeFontEnabled: Boolean = false,
    val userId: String? = null,
    val userName: String? = null,
    val userEmail: String? = null,
    val gender: String? = null, // "male", "female", "other"
    val birthYear: Int? = null, // For age calculation
    val dateOfBirth: String? = null // ISO 8601 format: YYYY-MM-DD (more precise than birthYear)
) {
    init {
        require(lowSpo2AlertThreshold in 70..95) { "Alert threshold must be between 70 and 95" }
        if (birthYear != null) {
            require(birthYear in 1900..2026) { "Birth year must be between 1900 and 2026" }
        }
        if (gender != null) {
            require(gender in listOf("male", "female", "other")) { "Gender must be male, female, or other" }
        }
    }
    
    /**
     * Calculate user's age from birth year
     */
    fun getAge(): Int? {
        return birthYear?.let { BPGuidelinesUtil.calculateAge(it) }
    }
    
    /**
     * Get display text for gender
     */
    fun getGenderDisplay(): String? {
        return when (gender) {
            "male" -> "Mies"
            "female" -> "Nainen"
            "other" -> "Muu"
            else -> null
        }
    }
}
