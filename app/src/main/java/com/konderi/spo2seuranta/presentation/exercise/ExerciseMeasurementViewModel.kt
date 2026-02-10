package com.konderi.spo2seuranta.presentation.exercise

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.konderi.spo2seuranta.data.repository.ExerciseMeasurementRepository
import com.konderi.spo2seuranta.data.repository.SettingsRepository
import com.konderi.spo2seuranta.domain.model.ExerciseMeasurement
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import javax.inject.Inject

/**
 * ViewModel for exercise measurements screen
 */
@HiltViewModel
class ExerciseMeasurementViewModel @Inject constructor(
    private val repository: ExerciseMeasurementRepository,
    private val settingsRepository: SettingsRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(ExerciseMeasurementUiState())
    val uiState: StateFlow<ExerciseMeasurementUiState> = _uiState.asStateFlow()
    
    init {
        loadMeasurements()
    }
    
    private fun loadMeasurements() {
        viewModelScope.launch {
            repository.getAllMeasurements().collect { measurements ->
                _uiState.value = _uiState.value.copy(
                    measurements = measurements,
                    isLoading = false
                )
            }
        }
    }
    
    fun saveMeasurement(
        spo2Before: Int,
        heartRateBefore: Int,
        spo2After: Int,
        heartRateAfter: Int,
        exerciseDetails: String,
        notes: String
    ) {
        viewModelScope.launch {
            try {
                val settings = settingsRepository.userSettings.first()
                val measurement = ExerciseMeasurement(
                    spo2Before = spo2Before,
                    heartRateBefore = heartRateBefore,
                    spo2After = spo2After,
                    heartRateAfter = heartRateAfter,
                    exerciseDetails = exerciseDetails,
                    notes = notes,
                    timestamp = LocalDateTime.now(),
                    userId = settings.userId
                )
                
                repository.insertMeasurement(measurement)
                
                // Check for significant drops
                if (measurement.isSignificantSpo2Drop()) {
                    _uiState.value = _uiState.value.copy(
                        showSpo2DropWarning = true,
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
    
    fun deleteMeasurement(measurement: ExerciseMeasurement) {
        viewModelScope.launch {
            repository.deleteMeasurement(measurement)
        }
    }
    
    fun dismissWarning() {
        _uiState.value = _uiState.value.copy(showSpo2DropWarning = false)
    }
    
    fun resetSaveStatus() {
        _uiState.value = _uiState.value.copy(saveSuccess = false, errorMessage = null)
    }
}

data class ExerciseMeasurementUiState(
    val measurements: List<ExerciseMeasurement> = emptyList(),
    val isLoading: Boolean = true,
    val saveSuccess: Boolean = false,
    val errorMessage: String? = null,
    val showSpo2DropWarning: Boolean = false,
    val lastMeasurement: ExerciseMeasurement? = null
)
