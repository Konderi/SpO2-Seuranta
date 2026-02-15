package com.konderi.spo2seuranta.data.repository

import android.content.Context
import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.google.firebase.auth.FirebaseAuth
import com.konderi.spo2seuranta.data.remote.ApiService
import com.konderi.spo2seuranta.data.remote.dto.UpdateUserSettingsRequest
import com.konderi.spo2seuranta.domain.model.UserSettings
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_settings")

/**
 * Repository for user settings using DataStore and API sync
 */
@Singleton
class SettingsRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val apiService: ApiService,
    private val firebaseAuth: FirebaseAuth
) {
    private object PreferencesKeys {
        val LOW_SPO2_THRESHOLD = intPreferencesKey("low_spo2_threshold")
        val LARGE_FONT_ENABLED = booleanPreferencesKey("large_font_enabled")
        val MANUAL_ENTRY_ENABLED = booleanPreferencesKey("manual_entry_enabled")
        val USER_ID = stringPreferencesKey("user_id")
        val USER_NAME = stringPreferencesKey("user_name")
        val USER_EMAIL = stringPreferencesKey("user_email")
        val GENDER = stringPreferencesKey("gender")
        val BIRTH_YEAR = intPreferencesKey("birth_year")
        val DATE_OF_BIRTH = stringPreferencesKey("date_of_birth")
    }
    
    val userSettings: Flow<UserSettings> = context.dataStore.data.map { preferences ->
        UserSettings(
            lowSpo2AlertThreshold = preferences[PreferencesKeys.LOW_SPO2_THRESHOLD] ?: 90,
            largeFontEnabled = preferences[PreferencesKeys.LARGE_FONT_ENABLED] ?: false,
            manualEntryEnabled = preferences[PreferencesKeys.MANUAL_ENTRY_ENABLED] ?: false,
            userId = preferences[PreferencesKeys.USER_ID],
            userName = preferences[PreferencesKeys.USER_NAME],
            userEmail = preferences[PreferencesKeys.USER_EMAIL],
            gender = preferences[PreferencesKeys.GENDER],
            birthYear = preferences[PreferencesKeys.BIRTH_YEAR],
            dateOfBirth = preferences[PreferencesKeys.DATE_OF_BIRTH]
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
    
    suspend fun updateManualEntryEnabled(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.MANUAL_ENTRY_ENABLED] = enabled
        }
    }
    
    suspend fun updateGender(gender: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.GENDER] = gender
        }
    }
    
    suspend fun updateBirthYear(birthYear: Int) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.BIRTH_YEAR] = birthYear
        }
    }
    
    suspend fun updateDateOfBirth(dateOfBirth: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.DATE_OF_BIRTH] = dateOfBirth
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
    
    /**
     * Sync settings with backend API (download from cloud)
     */
    suspend fun syncFromCloud(): Result<Unit> {
        return try {
            val currentUser = firebaseAuth.currentUser
            if (currentUser == null) {
                Log.w("SettingsRepository", "⚠️ No user logged in, skipping settings sync")
                return Result.success(Unit)
            }
            
            val token = currentUser.getIdToken(false).await().token
            if (token == null) {
                Log.e("SettingsRepository", "❌ Failed to get Firebase token")
                return Result.failure(Exception("No auth token available"))
            }
            
            Log.d("SettingsRepository", "🔄 Syncing settings from cloud...")
            val response = apiService.getUserSettings("Bearer $token")
            
            if (response.isSuccessful && response.body()?.success == true) {
                val cloudSettings = response.body()?.data
                Log.d("SettingsRepository", "📥 Downloaded settings: $cloudSettings")
                
                if (cloudSettings != null) {
                    // Update local DataStore with cloud values
                    context.dataStore.edit { preferences ->
                        cloudSettings.spo2LowThreshold?.let {
                            preferences[PreferencesKeys.LOW_SPO2_THRESHOLD] = it
                        }
                        cloudSettings.largeFontEnabled?.let {
                            preferences[PreferencesKeys.LARGE_FONT_ENABLED] = it
                        }
                        cloudSettings.manualEntryEnabled?.let {
                            preferences[PreferencesKeys.MANUAL_ENTRY_ENABLED] = it
                        }
                        cloudSettings.gender?.let {
                            preferences[PreferencesKeys.GENDER] = it
                        }
                        cloudSettings.birthYear?.let {
                            preferences[PreferencesKeys.BIRTH_YEAR] = it
                        }
                    }
                    Log.d("SettingsRepository", "✅ Settings synced from cloud")
                }
                Result.success(Unit)
            } else {
                val errorMsg = "Settings sync failed: ${response.code()}"
                Log.e("SettingsRepository", "❌ $errorMsg")
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Log.e("SettingsRepository", "❌ Settings sync error", e)
            Result.failure(e)
        }
    }
    
    /**
     * Upload current settings to backend API
     */
    suspend fun syncToCloud(): Result<Unit> {
        return try {
            val currentUser = firebaseAuth.currentUser
            if (currentUser == null) {
                Log.w("SettingsRepository", "⚠️ No user logged in, skipping settings upload")
                return Result.success(Unit)
            }
            
            val token = currentUser.getIdToken(false).await().token
            if (token == null) {
                Log.e("SettingsRepository", "❌ Failed to get Firebase token")
                return Result.failure(Exception("No auth token available"))
            }
            
            // Get current local settings
            val currentSettings = userSettings.first()
            
            val request = UpdateUserSettingsRequest(
                spo2LowThreshold = currentSettings.lowSpo2AlertThreshold,
                largeFontEnabled = currentSettings.largeFontEnabled,
                manualEntryEnabled = currentSettings.manualEntryEnabled,
                gender = currentSettings.gender,
                birthYear = currentSettings.birthYear
            )
            
            Log.d("SettingsRepository", "📤 Uploading settings to cloud: $request")
            val response = apiService.updateUserSettings("Bearer $token", request)
            
            if (response.isSuccessful && response.body()?.success == true) {
                Log.d("SettingsRepository", "✅ Settings uploaded to cloud")
                Result.success(Unit)
            } else {
                val errorMsg = "Settings upload failed: ${response.code()}"
                Log.e("SettingsRepository", "❌ $errorMsg")
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Log.e("SettingsRepository", "❌ Settings upload error", e)
            Result.failure(e)
        }
    }
}
