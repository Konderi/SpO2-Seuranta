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
    
    fun updateLowSpo2Threshold(threshold: Int) {
        viewModelScope.launch {
            try {
                repository.updateLowSpo2Threshold(threshold)
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
    val saveSuccess: Boolean = false,
    val errorMessage: String? = null
)
