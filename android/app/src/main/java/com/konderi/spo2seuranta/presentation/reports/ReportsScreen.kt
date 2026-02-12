package com.konderi.spo2seuranta.presentation.reports

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.konderi.spo2seuranta.domain.model.StatisticsPeriod
import com.konderi.spo2seuranta.presentation.components.DailyMeasurementChart
import com.konderi.spo2seuranta.presentation.components.ExerciseMeasurementChart
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportsScreen(
    viewModel: ReportsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 100.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Aikaväli",
                            style = MaterialTheme.typography.titleMedium
                        )
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            FilterChip(
                                selected = uiState.selectedPeriod == StatisticsPeriod.SEVEN_DAYS,
                                onClick = { viewModel.loadStatistics(StatisticsPeriod.SEVEN_DAYS) },
                                label = { Text("7 pv") }
                            )
                            FilterChip(
                                selected = uiState.selectedPeriod == StatisticsPeriod.THIRTY_DAYS,
                                onClick = { viewModel.loadStatistics(StatisticsPeriod.THIRTY_DAYS) },
                                label = { Text("30 pv") }
                            )
                            FilterChip(
                                selected = uiState.selectedPeriod == StatisticsPeriod.THREE_MONTHS,
                                onClick = { viewModel.loadStatistics(StatisticsPeriod.THREE_MONTHS) },
                                label = { Text("3 kk") }
                            )
                            FilterChip(
                                selected = uiState.selectedPeriod == StatisticsPeriod.ALL_TIME,
                                onClick = { viewModel.loadStatistics(StatisticsPeriod.ALL_TIME) },
                                label = { Text("Kaikki") }
                            )
                        }
                    }
                }
            }
            
            item {
                Card(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Mittaustyyppi",
                            style = MaterialTheme.typography.titleMedium
                        )
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            FilterChip(
                                selected = uiState.selectedMeasurementType == MeasurementType.DAILY,
                                onClick = { viewModel.selectMeasurementType(MeasurementType.DAILY) },
                                label = { Text("Päivittäinen") }
                            )
                            FilterChip(
                                selected = uiState.selectedMeasurementType == MeasurementType.EXERCISE,
                                onClick = { viewModel.selectMeasurementType(MeasurementType.EXERCISE) },
                                label = { Text("Liikunta") }
                            )
                        }
                    }
                }
            }
            
            item {
                Card(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Näkymä",
                            style = MaterialTheme.typography.titleMedium
                        )
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            FilterChip(
                                selected = uiState.selectedViewMode == ViewMode.STATISTICS,
                                onClick = { viewModel.selectViewMode(ViewMode.STATISTICS) },
                                label = { Text("Tilastot") }
                            )
                            FilterChip(
                                selected = uiState.selectedViewMode == ViewMode.RAW_DATA,
                                onClick = { viewModel.selectViewMode(ViewMode.RAW_DATA) },
                                label = { Text("Lista") }
                            )
                            FilterChip(
                                selected = uiState.selectedViewMode == ViewMode.GRAPH,
                                onClick = { viewModel.selectViewMode(ViewMode.GRAPH) },
                                label = { Text("Kuvaaja") }
                            )
                        }
                    }
                }
            }
            
            when (uiState.selectedViewMode) {
                ViewMode.STATISTICS -> {
                    item {
                        StatisticsView(uiState = uiState)
                    }
                }
                ViewMode.RAW_DATA -> {
                    if (uiState.selectedMeasurementType == MeasurementType.DAILY) {
                        items(uiState.dailyMeasurements) { measurement ->
                            DailyMeasurementItemCard(measurement)
                        }
                    } else {
                        items(uiState.exerciseMeasurements) { measurement ->
                            ExerciseMeasurementItemCard(measurement)
                        }
                    }
                }
                ViewMode.GRAPH -> {
                    item {
                        if (uiState.selectedMeasurementType == MeasurementType.DAILY) {
                            DailyMeasurementChart(measurements = uiState.dailyMeasurements)
                        } else {
                            ExerciseMeasurementChart(measurements = uiState.exerciseMeasurements)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StatisticsView(uiState: ReportsUiState) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = "Tilastot",
                style = MaterialTheme.typography.headlineSmall
            )
            
            if (uiState.statistics != null) {
                val stats = uiState.statistics
                
                StatRow("Keskiarvo SpO2", "${String.format("%.1f", stats.averageSpo2)}%")
                StatRow("Keskiarvo syke", "${String.format("%.0f", stats.averageHeartRate)} BPM")
                StatRow("Alin SpO2", "${stats.minSpo2}%")
                StatRow("Ylin SpO2", "${stats.maxSpo2}%")
                StatRow("Mittausten määrä", "${stats.measurementCount}")
                StatRow("Matala happisaturaatio", "${stats.lowOxygenCount}")
            } else {
                Text(
                    text = "Ei mittauksia valitulla aikavälillä",
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }
    }
}

@Composable
fun StatRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, style = MaterialTheme.typography.bodyMedium)
        Text(
            text = value,
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary
        )
    }
}

@Composable
fun DailyMeasurementItemCard(measurement: com.konderi.spo2seuranta.domain.model.DailyMeasurement) {
    val formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")
    
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(text = measurement.timestamp.format(formatter))
                if (measurement.notes.isNotEmpty()) {
                    Text(
                        text = measurement.notes,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
            Column {
                if (measurement.spo2 != null) {
                    Text("SpO2: ${measurement.spo2}%")
                }
                if (measurement.heartRate != null) {
                    Text("Syke: ${measurement.heartRate}")
                }
                if (measurement.systolic != null && measurement.diastolic != null) {
                    Text("Verenpaine: ${measurement.systolic}/${measurement.diastolic}")
                }
            }
        }
    }
}

@Composable
fun ExerciseMeasurementItemCard(measurement: com.konderi.spo2seuranta.domain.model.ExerciseMeasurement) {
    val formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")
    
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(text = measurement.exerciseDetails, style = MaterialTheme.typography.titleSmall)
            Text(text = measurement.timestamp.format(formatter), style = MaterialTheme.typography.bodySmall)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("${measurement.spo2Before}% → ${measurement.spo2After}%")
                Text("${measurement.heartRateBefore} → ${measurement.heartRateAfter} BPM")
            }
        }
    }
}
