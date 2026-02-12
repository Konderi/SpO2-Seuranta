package com.konderi.spo2seuranta.presentation.exercise

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.konderi.spo2seuranta.domain.model.ExerciseMeasurement
import com.konderi.spo2seuranta.presentation.components.AlertDialog
import com.konderi.spo2seuranta.presentation.components.LargeButton
import com.konderi.spo2seuranta.presentation.components.NumberInputField
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExerciseMeasurementScreen(
    viewModel: ExerciseMeasurementViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    var spo2Before by remember { mutableStateOf("") }
    var heartRateBefore by remember { mutableStateOf("") }
    var spo2After by remember { mutableStateOf("") }
    var heartRateAfter by remember { mutableStateOf("") }
    var exerciseDetails by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Liikuntamittaus") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
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
                        
                        Text(
                            text = "Ennen liikuntaa",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                        
                        NumberInputField(
                            value = spo2Before,
                            onValueChange = { spo2Before = it },
                            label = "SpO2 ennen (%)",
                            minValue = 50,
                            maxValue = 100
                        )
                        
                        NumberInputField(
                            value = heartRateBefore,
                            onValueChange = { heartRateBefore = it },
                            label = "Syke ennen (BPM)",
                            minValue = 30,
                            maxValue = 220
                        )
                        
                        HorizontalDivider()
                        
                        Text(
                            text = "Liikunnan jälkeen",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                        
                        NumberInputField(
                            value = spo2After,
                            onValueChange = { spo2After = it },
                            label = "SpO2 jälkeen (%)",
                            minValue = 50,
                            maxValue = 100
                        )
                        
                        NumberInputField(
                            value = heartRateAfter,
                            onValueChange = { heartRateAfter = it },
                            label = "Syke jälkeen (BPM)",
                            minValue = 30,
                            maxValue = 220
                        )
                        
                        OutlinedTextField(
                            value = exerciseDetails,
                            onValueChange = { exerciseDetails = it },
                            label = { Text("Liikunnan kuvaus") },
                            placeholder = { Text("Esim. Kävely 15 minuuttia") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        
                        OutlinedTextField(
                            value = notes,
                            onValueChange = { notes = it },
                            label = { Text("Muistiinpanot (vapaaehtoinen)") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 2
                        )
                        
                        LargeButton(
                            text = "Tallenna mittaus",
                            onClick = {
                                val spo2B = spo2Before.toIntOrNull()
                                val hrB = heartRateBefore.toIntOrNull()
                                val spo2A = spo2After.toIntOrNull()
                                val hrA = heartRateAfter.toIntOrNull()
                                
                                if (spo2B != null && spo2B in 50..100 &&
                                    hrB != null && hrB in 30..220 &&
                                    spo2A != null && spo2A in 50..100 &&
                                    hrA != null && hrA in 30..220 &&
                                    exerciseDetails.isNotBlank()
                                ) {
                                    viewModel.saveMeasurement(
                                        spo2B, hrB, spo2A, hrA, exerciseDetails, notes
                                    )
                                    spo2Before = ""
                                    heartRateBefore = ""
                                    spo2After = ""
                                    heartRateAfter = ""
                                    exerciseDetails = ""
                                    notes = ""
                                }
                            },
                            enabled = spo2Before.toIntOrNull() != null && 
                                     heartRateBefore.toIntOrNull() != null &&
                                     spo2After.toIntOrNull() != null &&
                                     heartRateAfter.toIntOrNull() != null &&
                                     exerciseDetails.isNotBlank()
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
                ExerciseMeasurementCard(measurement = measurement)
            }
        }
    }
    
    // Show warning if SpO2 dropped significantly
    if (uiState.showSpo2DropWarning) {
        AlertDialog(
            title = "Huomio: SpO2 laski merkittävästi",
            message = "Happisaturaatiosi laski ${uiState.lastMeasurement?.getSpo2Change()}% liikunnan aikana. Pidä tauko ja seuraa vointiasi.",
            onDismiss = { viewModel.dismissWarning() }
        )
    }
}

@Composable
fun ExerciseMeasurementCard(measurement: ExerciseMeasurement) {
    val formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = measurement.exerciseDetails,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.primary
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Ennen:", style = MaterialTheme.typography.bodySmall)
                    Text("SpO2: ${measurement.spo2Before}%")
                    Text("Syke: ${measurement.heartRateBefore}")
                }
                Column {
                    Text("Jälkeen:", style = MaterialTheme.typography.bodySmall)
                    Text("SpO2: ${measurement.spo2After}%")
                    Text("Syke: ${measurement.heartRateAfter}")
                }
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
}
