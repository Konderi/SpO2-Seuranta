package com.konderi.spo2seuranta.presentation.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.konderi.spo2seuranta.domain.model.DailyMeasurement
import com.konderi.spo2seuranta.domain.model.ExerciseMeasurement
import com.patrykandpatrick.vico.compose.axis.horizontal.rememberBottomAxis
import com.patrykandpatrick.vico.compose.axis.vertical.rememberStartAxis
import com.patrykandpatrick.vico.compose.chart.Chart
import com.patrykandpatrick.vico.compose.chart.line.lineChart
import com.patrykandpatrick.vico.compose.m3.style.m3ChartStyle
import com.patrykandpatrick.vico.compose.style.ProvideChartStyle
import com.patrykandpatrick.vico.core.entry.ChartEntryModelProducer
import com.patrykandpatrick.vico.core.entry.FloatEntry
import java.time.format.DateTimeFormatter

@Composable
fun DailyMeasurementChart(measurements: List<DailyMeasurement>) {
    // Filter measurements that have SpO2 and heart rate data
    val validMeasurements = measurements.filter { it.spo2 != null && it.heartRate != null }
    
    if (validMeasurements.isEmpty()) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant
            )
        ) {
            Text(
                text = "Ei mittauksia näytettäväksi",
                style = MaterialTheme.typography.bodyLarge,
                modifier = Modifier.padding(24.dp)
            )
        }
        return
    }

    val sortedMeasurements = validMeasurements.sortedBy { it.timestamp }
    
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // SpO2 Chart
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "SpO2 Trendi",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                
                ProvideChartStyle(m3ChartStyle()) {
                    val entries = sortedMeasurements.mapIndexed { index, measurement ->
                        FloatEntry(x = index.toFloat(), y = measurement.spo2!!.toFloat())
                    }
                    val model = ChartEntryModelProducer(entries).getModel() ?: return@ProvideChartStyle
                    
                    Chart(
                        chart = lineChart(),
                        model = model,
                        startAxis = rememberStartAxis(),
                        bottomAxis = rememberBottomAxis(
                            valueFormatter = { value, _ ->
                                if (value.toInt() < sortedMeasurements.size) {
                                    sortedMeasurements[value.toInt()].timestamp
                                        .format(DateTimeFormatter.ofPattern("dd.MM"))
                                } else ""
                            }
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                    )
                }
            }
        }
        
        // Heart Rate Chart
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "Syke Trendi",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                
                ProvideChartStyle(m3ChartStyle()) {
                    val entries = sortedMeasurements.mapIndexed { index, measurement ->
                        FloatEntry(x = index.toFloat(), y = measurement.heartRate!!.toFloat())
                    }
                    val model = ChartEntryModelProducer(entries).getModel() ?: return@ProvideChartStyle
                    
                    Chart(
                        chart = lineChart(),
                        model = model,
                        startAxis = rememberStartAxis(),
                        bottomAxis = rememberBottomAxis(
                            valueFormatter = { value, _ ->
                                if (value.toInt() < sortedMeasurements.size) {
                                    sortedMeasurements[value.toInt()].timestamp
                                        .format(DateTimeFormatter.ofPattern("dd.MM"))
                                } else ""
                            }
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun ExerciseMeasurementChart(measurements: List<ExerciseMeasurement>) {
    if (measurements.isEmpty()) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant
            )
        ) {
            Text(
                text = "Ei mittauksia näytettäväksi",
                style = MaterialTheme.typography.bodyLarge,
                modifier = Modifier.padding(24.dp)
            )
        }
        return
    }

    val sortedMeasurements = measurements.sortedBy { it.timestamp }
    
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // SpO2 Before/After Chart
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "SpO2 Ennen/Jälkeen Liikunta",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                
                ProvideChartStyle(m3ChartStyle()) {
                    val beforeEntries = sortedMeasurements.mapIndexed { index, measurement ->
                        FloatEntry(x = index.toFloat(), y = measurement.spo2Before.toFloat())
                    }
                    val afterEntries = sortedMeasurements.mapIndexed { index, measurement ->
                        FloatEntry(x = index.toFloat(), y = measurement.spo2After.toFloat())
                    }
                    val model = ChartEntryModelProducer(beforeEntries, afterEntries).getModel()
                    
                    if (model != null) {
                        Chart(
                            chart = lineChart(),
                            model = model,
                            startAxis = rememberStartAxis(),
                            bottomAxis = rememberBottomAxis(
                                valueFormatter = { value, _ ->
                                    if (value.toInt() < sortedMeasurements.size) {
                                        sortedMeasurements[value.toInt()].timestamp
                                            .format(DateTimeFormatter.ofPattern("dd.MM"))
                                    } else ""
                                }
                            ),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(200.dp)
                        )
                    } else {
                        Text(
                            text = "Kuvaajan luonti epäonnistui",
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(16.dp)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center
                ) {
                    LegendItem(color = Color(0xFF43A047), label = "Ennen")
                    Spacer(modifier = Modifier.width(16.dp))
                    LegendItem(color = Color(0xFF1E88E5), label = "Jälkeen")
                }
            }
        }
        
        // Heart Rate Before/After Chart
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "Syke Ennen/Jälkeen Liikunta",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                
                ProvideChartStyle(m3ChartStyle()) {
                    val beforeEntries = sortedMeasurements.mapIndexed { index, measurement ->
                        FloatEntry(x = index.toFloat(), y = measurement.heartRateBefore.toFloat())
                    }
                    val afterEntries = sortedMeasurements.mapIndexed { index, measurement ->
                        FloatEntry(x = index.toFloat(), y = measurement.heartRateAfter.toFloat())
                    }
                    val model = ChartEntryModelProducer(beforeEntries, afterEntries).getModel()
                    
                    if (model != null) {
                        Chart(
                            chart = lineChart(),
                            model = model,
                            startAxis = rememberStartAxis(),
                            bottomAxis = rememberBottomAxis(
                                valueFormatter = { value, _ ->
                                    if (value.toInt() < sortedMeasurements.size) {
                                        sortedMeasurements[value.toInt()].timestamp
                                            .format(DateTimeFormatter.ofPattern("dd.MM"))
                                    } else ""
                                }
                            ),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(200.dp)
                        )
                    } else {
                        Text(
                            text = "Kuvaajan luonti epäonnistui",
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(16.dp)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center
                ) {
                    LegendItem(color = Color(0xFFFB8C00), label = "Ennen")
                    Spacer(modifier = Modifier.width(16.dp))
                    LegendItem(color = Color(0xFFE53935), label = "Jälkeen")
                }
            }
        }
    }
}

@Composable
private fun LegendItem(color: Color, label: String) {
    Row {
        Surface(
            modifier = Modifier.size(16.dp),
            color = color,
            shape = MaterialTheme.shapes.small
        ) {}
        Spacer(modifier = Modifier.width(4.dp))
        Text(text = label, style = MaterialTheme.typography.bodySmall)
    }
}
