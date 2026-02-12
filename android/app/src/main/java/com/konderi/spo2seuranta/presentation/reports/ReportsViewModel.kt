package com.konderi.spo2seuranta.presentation.reports

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.konderi.spo2seuranta.data.repository.DailyMeasurementRepository
import com.konderi.spo2seuranta.data.repository.ExerciseMeasurementRepository
import com.konderi.spo2seuranta.data.repository.SettingsRepository
import com.konderi.spo2seuranta.domain.model.DailyMeasurement
import com.konderi.spo2seuranta.domain.model.ExerciseMeasurement
import com.konderi.spo2seuranta.domain.model.MeasurementStatistics
import com.konderi.spo2seuranta.domain.model.StatisticsPeriod
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import javax.inject.Inject

/**
 * ViewModel for reports and statistics screen
 */
@HiltViewModel
class ReportsViewModel @Inject constructor(
    private val dailyRepository: DailyMeasurementRepository,
    private val exerciseRepository: ExerciseMeasurementRepository,
    private val settingsRepository: SettingsRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(ReportsUiState())
    val uiState: StateFlow<ReportsUiState> = _uiState.asStateFlow()
    
    init {
        loadStatistics(StatisticsPeriod.SEVEN_DAYS)
    }
    
    fun loadStatistics(period: StatisticsPeriod) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            try {
                val settings = settingsRepository.userSettings.first()
                
                val stats = dailyRepository.getStatistics(period, settings.lowSpo2AlertThreshold)
                
                // Load raw measurements for the period
                val endDate = LocalDateTime.now()
                val startDate = when (period) {
                    StatisticsPeriod.SEVEN_DAYS -> endDate.minusDays(7)
                    StatisticsPeriod.THIRTY_DAYS -> endDate.minusDays(30)
                    StatisticsPeriod.THREE_MONTHS -> endDate.minusMonths(3)
                    StatisticsPeriod.ALL_TIME -> LocalDateTime.of(2020, 1, 1, 0, 0)
                }
                
                val dailyMeasurements = dailyRepository.getMeasurementsByDateRange(startDate, endDate).first()
                val exerciseMeasurements = exerciseRepository.getMeasurementsByDateRange(startDate, endDate).first()
                
                _uiState.value = _uiState.value.copy(
                    statistics = stats,
                    dailyMeasurements = dailyMeasurements,
                    exerciseMeasurements = exerciseMeasurements,
                    selectedPeriod = period,
                    isLoading = false
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = "Tilastojen lataus epäonnistui: ${e.message}"
                )
            }
        }
    }
    
    fun selectMeasurementType(type: MeasurementType) {
        _uiState.value = _uiState.value.copy(selectedMeasurementType = type)
        // Recalculate statistics when measurement type changes
        calculateStatisticsForSelectedType()
    }
    
    private fun calculateStatisticsForSelectedType() {
        viewModelScope.launch {
            try {
                val currentState = _uiState.value
                val settings = settingsRepository.userSettings.first()
                
                val stats = when (currentState.selectedMeasurementType) {
                    MeasurementType.DAILY -> {
                        dailyRepository.getStatistics(currentState.selectedPeriod, settings.lowSpo2AlertThreshold)
                    }
                    MeasurementType.EXERCISE -> {
                        // Calculate exercise statistics from exercise measurements
                        calculateExerciseStatistics(currentState.exerciseMeasurements, settings.lowSpo2AlertThreshold)
                    }
                }
                
                _uiState.value = _uiState.value.copy(statistics = stats)
            } catch (e: Exception) {
                // Error calculating statistics - maintain previous state
            }
        }
    }
    
    private fun calculateExerciseStatistics(measurements: List<ExerciseMeasurement>, threshold: Int): MeasurementStatistics? {
        if (measurements.isEmpty()) return null
        
        // Calculate before/after averages (may be used for future detailed analytics)
        @Suppress("UNUSED_VARIABLE")
        val avgSpo2Before = measurements.map { it.spo2Before }.average()
        val avgSpo2After = measurements.map { it.spo2After }.average()
        @Suppress("UNUSED_VARIABLE")
        val avgHeartRateBefore = measurements.map { it.heartRateBefore }.average()
        val avgHeartRateAfter = measurements.map { it.heartRateAfter }.average()
        
        // Use "after exercise" values as primary metrics
        val allSpo2 = measurements.flatMap { listOf(it.spo2Before, it.spo2After) }
        val allHeartRates = measurements.flatMap { listOf(it.heartRateBefore, it.heartRateAfter) }
        
        val lowOxygenCount = measurements.count { it.spo2After < threshold || it.spo2Before < threshold }
        
        return MeasurementStatistics(
            averageSpo2 = avgSpo2After,
            averageHeartRate = avgHeartRateAfter,
            minSpo2 = allSpo2.minOrNull() ?: 0,
            maxSpo2 = allSpo2.maxOrNull() ?: 0,
            minHeartRate = allHeartRates.minOrNull() ?: 0,
            maxHeartRate = allHeartRates.maxOrNull() ?: 0,
            measurementCount = measurements.size,
            lowOxygenCount = lowOxygenCount,
            period = _uiState.value.selectedPeriod,
            startDate = measurements.minOfOrNull { it.timestamp } ?: LocalDateTime.now(),
            endDate = measurements.maxOfOrNull { it.timestamp } ?: LocalDateTime.now()
        )
    }
    
    fun selectViewMode(mode: ViewMode) {
        _uiState.value = _uiState.value.copy(selectedViewMode = mode)
    }
}

data class ReportsUiState(
    val statistics: MeasurementStatistics? = null,
    val dailyMeasurements: List<DailyMeasurement> = emptyList(),
    val exerciseMeasurements: List<ExerciseMeasurement> = emptyList(),
    val selectedPeriod: StatisticsPeriod = StatisticsPeriod.SEVEN_DAYS,
    val selectedMeasurementType: MeasurementType = MeasurementType.DAILY,
    val selectedViewMode: ViewMode = ViewMode.STATISTICS,
    val isLoading: Boolean = true,
    val errorMessage: String? = null
)

enum class MeasurementType {
    DAILY,
    EXERCISE
}

enum class ViewMode {
    STATISTICS,  // Shows averages and statistics
    RAW_DATA,    // Shows list of measurements
    GRAPH        // Shows trend graph
}
