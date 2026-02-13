package com.konderi.spo2seuranta.presentation.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.konderi.spo2seuranta.data.repository.SettingsRepository
import com.konderi.spo2seuranta.domain.model.UserSettings
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for settings screen
 */
@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val repository: SettingsRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(SettingsUiState())
    val uiState: StateFlow<SettingsUiState> = _uiState.asStateFlow()
    
    init {
        loadSettings()
        syncSettingsFromCloud()
    }
    
    private fun loadSettings() {
        viewModelScope.launch {
            repository.userSettings.collect { settings ->
                _uiState.value = _uiState.value.copy(
                    settings = settings,
                    isLoading = false
                )
            }
        }
    }
    
    private fun syncSettingsFromCloud() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSyncing = true)
            val result = repository.syncFromCloud()
            _uiState.value = _uiState.value.copy(
                isSyncing = false,
                syncError = if (result.isFailure) result.exceptionOrNull()?.message else null
            )
        }
    }
    
    fun updateLowSpo2Threshold(threshold: Int) {
        viewModelScope.launch {
            try {
                repository.updateLowSpo2Threshold(threshold)
                // Sync to cloud
                repository.syncToCloud()
                _uiState.value = _uiState.value.copy(
                    saveSuccess = true,
                    errorMessage = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Asetuksen tallennus epäonnistui: ${e.message}"
                )
            }
        }
    }
    
    fun updateLargeFontEnabled(enabled: Boolean) {
        viewModelScope.launch {
            try {
                repository.updateLargeFontEnabled(enabled)
                // Sync to cloud
                repository.syncToCloud()
                _uiState.value = _uiState.value.copy(
                    saveSuccess = true,
                    errorMessage = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Asetuksen tallennus epäonnistui: ${e.message}"
                )
            }
        }
    }
    
    fun updateGender(gender: String) {
        viewModelScope.launch {
            try {
                repository.updateGender(gender)
                // Sync to cloud
                repository.syncToCloud()
                _uiState.value = _uiState.value.copy(
                    saveSuccess = true,
                    errorMessage = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Asetuksen tallennus epäonnistui: ${e.message}"
                )
            }
        }
    }
    
    fun updateBirthYear(birthYear: Int) {
        viewModelScope.launch {
            try {
                repository.updateBirthYear(birthYear)
                // Sync to cloud
                repository.syncToCloud()
                _uiState.value = _uiState.value.copy(
                    saveSuccess = true,
                    errorMessage = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Asetuksen tallennus epäonnistui: ${e.message}"
                )
            }
        }
    }
    
    fun resetSaveStatus() {
        _uiState.value = _uiState.value.copy(saveSuccess = false, errorMessage = null)
    }
}

data class SettingsUiState(
    val settings: UserSettings = UserSettings(),
    val isLoading: Boolean = true,
    val isSyncing: Boolean = false,
    val saveSuccess: Boolean = false,
    val errorMessage: String? = null,
    val syncError: String? = null
)
