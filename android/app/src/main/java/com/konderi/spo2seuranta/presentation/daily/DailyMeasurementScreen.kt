package com.konderi.spo2seuranta.presentation.daily

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.konderi.spo2seuranta.domain.model.DailyMeasurement
import com.konderi.spo2seuranta.presentation.components.AlertDialog
import com.konderi.spo2seuranta.presentation.components.LargeButton
import com.konderi.spo2seuranta.presentation.components.NumberInputField
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DailyMeasurementScreen(
    viewModel: DailyMeasurementViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    var spo2Value by remember { mutableStateOf("") }
    var heartRateValue by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }
    
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
                    modifier = Modifier.fillMaxWidth(),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.secondaryContainer
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Text(
                            text = "Uusi mittaus",
                            style = MaterialTheme.typography.headlineSmall,
                            color = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                        
                        NumberInputField(
                            value = spo2Value,
                            onValueChange = { spo2Value = it },
                            label = "SpO2 (%)",
                            minValue = 50,
                            maxValue = 100
                        )
                        
                        NumberInputField(
                            value = heartRateValue,
                            onValueChange = { heartRateValue = it },
                            label = "Syke (BPM)",
                            minValue = 30,
                            maxValue = 220
                        )
                        
                        OutlinedTextField(
                            value = notes,
                            onValueChange = { notes = it },
                            label = { Text("Muistiinpanot (vapaehtoinen)") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 3
                        )
                        
                        LargeButton(
                            text = "Tallenna mittaus",
                            onClick = {
                                val spo2 = spo2Value.toIntOrNull()
                                val hr = heartRateValue.toIntOrNull()
                                
                                if (spo2 != null && spo2 in 50..100 && hr != null && hr in 30..220) {
                                    viewModel.saveMeasurement(spo2, hr, null, null, notes)
                                    spo2Value = ""
                                    heartRateValue = ""
                                    notes = ""
                                }
                            },
                            enabled = spo2Value.toIntOrNull() != null && heartRateValue.toIntOrNull() != null
                        )
                    }
                }
            }
            
            item {
                Text(
                    text = "Viimeisimmät mittaukset",
                    style = MaterialTheme.typography.headlineSmall,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
            }
            
            items(uiState.measurements.take(10)) { measurement ->
                MeasurementCard(
                    measurement = measurement,
                    onDelete = { viewModel.deleteMeasurement(measurement) }
                )
            }
        }
    }
    
    // Show alert if SpO2 is low
    if (uiState.showLowOxygenAlert) {
        AlertDialog(
            title = "Matala happisaturaatio!",
            message = "SpO2-arvosi (${uiState.lastMeasurement?.spo2}%) on alle asetetun raja-arvon (${uiState.alertThreshold}%). Ole yhteydessä lääkäriin jos oireet jatkuvat.",
            onDismiss = { viewModel.dismissAlert() }
        )
    }
    
    // Show alert if BP is high
    if (uiState.showHighBpAlert) {
        AlertDialog(
            title = "Kohonnut verenpaine!",
            message = "Verenpainearvo (${uiState.lastMeasurement?.systolic}/${uiState.lastMeasurement?.diastolic} mmHg) on koholla. Keskustele säännöllisesti lääkärin kanssa verenpaineen seurannasta.",
            onDismiss = { viewModel.dismissAlert() }
        )
    }
}

@Composable
fun MeasurementCard(
    measurement: DailyMeasurement,
    onDelete: () -> Unit
) {
    val formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")
    var showDeleteDialog by remember { mutableStateOf(false) }
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header row with title and delete button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Determine measurement type
                val hasSpO2 = measurement.spo2 != null
                val hasBP = measurement.systolic != null && measurement.diastolic != null
                
                // Show title based on measurement type
                Text(
                    text = when {
                        hasSpO2 && hasBP -> "SpO2 & Verenpaine"
                        hasBP -> "Verenpaine"
                        hasSpO2 -> "SpO2-mittaus"
                        else -> "Mittaus"
                    },
                    style = MaterialTheme.typography.titleSmall,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.weight(1f)
                )
                
                // Delete button
                IconButton(
                    onClick = { showDeleteDialog = true },
                    modifier = Modifier.size(40.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Poista mittaus",
                        tint = MaterialTheme.colorScheme.error
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Determine measurement type for layout
            val hasSpO2 = measurement.spo2 != null
            val hasBP = measurement.systolic != null && measurement.diastolic != null
            
            // SpO2 and Heart Rate
            if (hasSpO2) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    if (measurement.spo2 != null) {
                        Text(
                            text = "SpO2: ${measurement.spo2}%",
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                    if (measurement.heartRate != null) {
                        Text(
                            text = "Syke: ${measurement.heartRate} BPM",
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                }
            }
            
            // Blood Pressure
            if (hasBP) {
                Text(
                    text = "Verenpaine: ${measurement.systolic}/${measurement.diastolic} mmHg",
                    style = if (hasSpO2) MaterialTheme.typography.bodyLarge else MaterialTheme.typography.titleMedium
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = measurement.timestamp.format(formatter),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            if (measurement.notes.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = measurement.notes,
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
    
    // Delete confirmation dialog
    if (showDeleteDialog) {
        androidx.compose.material3.AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Poista mittaus") },
            text = { Text("Haluatko varmasti poistaa tämän mittauksen? Tätä toimintoa ei voi perua.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        showDeleteDialog = false
                        onDelete()
                    }
                ) {
                    Text("Poista", color = MaterialTheme.colorScheme.error)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) {
                    Text("Peruuta")
                }
            }
        )
    }
}
