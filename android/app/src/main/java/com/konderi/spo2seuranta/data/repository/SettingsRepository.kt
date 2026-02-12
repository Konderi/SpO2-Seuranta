package com.konderi.spo2seuranta.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.konderi.spo2seuranta.domain.model.UserSettings
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_settings")

/**
 * Repository for user settings using DataStore
 */
@Singleton
class SettingsRepository @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private object PreferencesKeys {
        val LOW_SPO2_THRESHOLD = intPreferencesKey("low_spo2_threshold")
        val LARGE_FONT_ENABLED = booleanPreferencesKey("large_font_enabled")
        val USER_ID = stringPreferencesKey("user_id")
        val USER_NAME = stringPreferencesKey("user_name")
        val USER_EMAIL = stringPreferencesKey("user_email")
    }
    
    val userSettings: Flow<UserSettings> = context.dataStore.data.map { preferences ->
        UserSettings(
            lowSpo2AlertThreshold = preferences[PreferencesKeys.LOW_SPO2_THRESHOLD] ?: 90,
            largeFontEnabled = preferences[PreferencesKeys.LARGE_FONT_ENABLED] ?: false,
            userId = preferences[PreferencesKeys.USER_ID],
            userName = preferences[PreferencesKeys.USER_NAME],
            userEmail = preferences[PreferencesKeys.USER_EMAIL]
        )
    }
    
    suspend fun updateLowSpo2Threshold(threshold: Int) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.LOW_SPO2_THRESHOLD] = threshold
        }
    }
    
    suspend fun updateLargeFontEnabled(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.LARGE_FONT_ENABLED] = enabled
        }
    }
    
    suspend fun updateUserInfo(userId: String?, userName: String?, userEmail: String?) {
        context.dataStore.edit { preferences ->
            userId?.let { preferences[PreferencesKeys.USER_ID] = it }
            userName?.let { preferences[PreferencesKeys.USER_NAME] = it }
            userEmail?.let { preferences[PreferencesKeys.USER_EMAIL] = it }
        }
    }
    
    suspend fun clearUserInfo() {
        context.dataStore.edit { preferences ->
            preferences.remove(PreferencesKeys.USER_ID)
            preferences.remove(PreferencesKeys.USER_NAME)
            preferences.remove(PreferencesKeys.USER_EMAIL)
        }
    }
    
    /**
     * Get current user ID synchronously
     */
    suspend fun getUserId(): String? {
        return context.dataStore.data
            .map { preferences -> preferences[PreferencesKeys.USER_ID] }
            .first()  // Get first value and complete
    }
}
