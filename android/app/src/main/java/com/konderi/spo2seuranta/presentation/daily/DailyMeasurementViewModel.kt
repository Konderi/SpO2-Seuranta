package com.konderi.spo2seuranta.presentation.daily

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.konderi.spo2seuranta.data.repository.DailyMeasurementRepository
import com.konderi.spo2seuranta.data.repository.SettingsRepository
import com.konderi.spo2seuranta.domain.model.DailyMeasurement
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import javax.inject.Inject

/**
 * ViewModel for daily measurements screen
 */
@HiltViewModel
class DailyMeasurementViewModel @Inject constructor(
    private val repository: DailyMeasurementRepository,
    private val settingsRepository: SettingsRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(DailyMeasurementUiState())
    val uiState: StateFlow<DailyMeasurementUiState> = _uiState.asStateFlow()
    
    init {
        loadMeasurements()
    }
    
    private fun loadMeasurements() {
        viewModelScope.launch {
            repository.getAllMeasurements().collect { measurements ->
                val settings = settingsRepository.userSettings.first()
                _uiState.value = _uiState.value.copy(
                    measurements = measurements,
                    isLoading = false,
                    alertThreshold = settings.lowSpo2AlertThreshold
                )
            }
        }
    }
    
    fun saveMeasurement(spo2: Int?, heartRate: Int?, systolic: Int?, diastolic: Int?, notes: String) {
        viewModelScope.launch {
            try {
                val settings = settingsRepository.userSettings.first()
                val measurement = DailyMeasurement(
                    spo2 = spo2,  // Keep as null if not measured
                    heartRate = heartRate,  // Keep as null if not measured
                    systolic = systolic,
                    diastolic = diastolic,
                    notes = notes,
                    timestamp = LocalDateTime.now(),
                    userId = settings.userId
                )
                
                repository.insertMeasurement(measurement)
                
                // Check for low oxygen alert (only if SpO2 was actually measured)
                if (spo2 != null && measurement.isLowOxygen(settings.lowSpo2AlertThreshold)) {
                    _uiState.value = _uiState.value.copy(
                        showLowOxygenAlert = true,
                        lastMeasurement = measurement
                    )
                }
                
                // Check for high blood pressure alert (only if BP was actually measured)
                if (systolic != null && diastolic != null && (systolic >= 140 || diastolic >= 90)) {
                    _uiState.value = _uiState.value.copy(
                        showHighBpAlert = true,
                        lastMeasurement = measurement
                    )
                }
                
                _uiState.value = _uiState.value.copy(
                    saveSuccess = true,
                    errorMessage = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Mittauksen tallennus epäonnistui: ${e.message}",
                    saveSuccess = false
                )
            }
        }
    }
    
    fun deleteMeasurement(measurement: DailyMeasurement) {
        viewModelScope.launch {
            repository.deleteMeasurement(measurement)
        }
    }
    
    fun syncNow() {
        viewModelScope.launch {
            try {
                _uiState.value = _uiState.value.copy(isLoading = true)
                val result = repository.syncWithCloud()
                if (result.isSuccess) {
                    // Data will update automatically through Flow
                    _uiState.value = _uiState.value.copy(
                        errorMessage = null
                    )
                } else {
                    _uiState.value = _uiState.value.copy(
                        errorMessage = "Synkronointi epäonnistui",
                        isLoading = false
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = "Synkronointivirhe: ${e.message}",
                    isLoading = false
                )
            }
        }
    }
    
    fun dismissAlert() {
        _uiState.value = _uiState.value.copy(
            showLowOxygenAlert = false,
            showHighBpAlert = false
        )
    }
    
    fun resetSaveStatus() {
        _uiState.value = _uiState.value.copy(saveSuccess = false, errorMessage = null)
    }
}

data class DailyMeasurementUiState(
    val measurements: List<DailyMeasurement> = emptyList(),
    val isLoading: Boolean = true,
    val saveSuccess: Boolean = false,
    val errorMessage: String? = null,
    val showLowOxygenAlert: Boolean = false,
    val showHighBpAlert: Boolean = false,
    val lastMeasurement: DailyMeasurement? = null,
    val alertThreshold: Int = 90
)
