package com.konderi.spo2seuranta.presentation.bloodpressure

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.konderi.spo2seuranta.domain.model.DailyMeasurement
import com.konderi.spo2seuranta.presentation.components.LargeButton
import com.konderi.spo2seuranta.presentation.components.NumberInputField
import com.konderi.spo2seuranta.presentation.daily.DailyMeasurementViewModel
import com.konderi.spo2seuranta.presentation.settings.SettingsViewModel
import com.konderi.spo2seuranta.utils.BPGuidelinesUtil
import java.time.format.DateTimeFormatter

/**
 * Dedicated Blood Pressure Measurement Screen
 * Focuses exclusively on tracking blood pressure
 */
@Composable
fun BloodPressureScreen(
    viewModel: DailyMeasurementViewModel = hiltViewModel(),
    settingsViewModel: SettingsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val settingsUiState by settingsViewModel.uiState.collectAsState()
    
    val userAge = settingsUiState.settings.getAge()
    val userGender = settingsUiState.settings.gender
    
    var systolicValue by remember { mutableStateOf("") }
    var diastolicValue by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }
    
    // Reset form on success
    LaunchedEffect(uiState.saveSuccess) {
        if (uiState.saveSuccess) {
            systolicValue = ""
            diastolicValue = ""
            notes = ""
            viewModel.resetSaveStatus()
        }
    }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
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
                        text = "Verenpainemittaus",
                        style = MaterialTheme.typography.headlineSmall,
                        color = MaterialTheme.colorScheme.onSecondaryContainer
                    )
                    
                    Text(
                        text = "Seuraa verenpaineesi kehitystä säännöllisesti.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSecondaryContainer
                    )
                    
                    Divider(modifier = Modifier.padding(vertical = 8.dp))
                    
                    // Blood Pressure Section
                    Text(
                        text = "Verenpaine",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        NumberInputField(
                            value = systolicValue,
                            onValueChange = { systolicValue = it },
                            label = "Yläpaine (mmHg)",
                            minValue = 80,
                            maxValue = 200,
                            modifier = Modifier.weight(1f)
                        )
                        
                        NumberInputField(
                            value = diastolicValue,
                            onValueChange = { diastolicValue = it },
                            label = "Alapaine (mmHg)",
                            minValue = 50,
                            maxValue = 130,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    
                    // BP Status Indicator
                    val systolic = systolicValue.toIntOrNull()
                    val diastolic = diastolicValue.toIntOrNull()
                    if (systolic != null && diastolic != null) {
                        val classification = BPGuidelinesUtil.classifyBP(systolic, diastolic, userAge, userGender)
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            color = Color(android.graphics.Color.parseColor(classification.colorHex))
                        ) {
                            Text(
                                text = classification.message,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onPrimary,
                                modifier = Modifier.padding(12.dp)
                            )
                        }
                    }
                    
                    OutlinedTextField(
                        value = notes,
                        onValueChange = { notes = it },
                        label = { Text("Muistiinpanot (valinnainen)") },
                        placeholder = { Text("esim. 'aamulla ennen lääkettä'") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2
                    )
                    
                    LargeButton(
                        text = "Tallenna mittaus",
                        onClick = {
                            val sys = systolicValue.toIntOrNull()
                            val dia = diastolicValue.toIntOrNull()
                            
                            // Validate BP fields
                            if (sys != null && dia != null &&
                                sys in 80..200 && dia in 50..130 && sys > dia) {
                                
                                // BP only - no SpO2/HR
                                viewModel.saveMeasurement(
                                    null,  // No SpO2
                                    null,  // No HR
                                    sys, 
                                    dia, 
                                    notes
                                )
                            }
                        },
                        enabled = systolicValue.toIntOrNull() != null && 
                                  diastolicValue.toIntOrNull() != null
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
        
        // Show only measurements with BP data
        val bpMeasurements = uiState.measurements.filter { 
            it.systolic != null && it.diastolic != null 
        }.take(10)
        
        if (bpMeasurements.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Ei verenpainemittauksia",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Aloita seuranta tallentamalla ensimmäinen mittauksesi",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        } else {
            items(bpMeasurements) { measurement ->
                BloodPressureCard(
                    measurement = measurement,
                    userAge = userAge,
                    userGender = userGender
                )
            }
        }
    }
}

@Composable
fun BloodPressureCard(
    measurement: DailyMeasurement,
    userAge: Int? = null,
    userGender: String? = null
) {
    val formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")
    val classification = BPGuidelinesUtil.classifyBP(
        measurement.systolic!!, 
        measurement.diastolic!!, 
        userAge, 
        userGender
    )
    
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
            // Blood Pressure - Prominent
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Verenpaine",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${measurement.systolic}/${measurement.diastolic} mmHg",
                        style = MaterialTheme.typography.headlineMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(android.graphics.Color.parseColor(classification.colorHex))
                ) {
                    Text(
                        text = when (classification.category) {
                            com.konderi.spo2seuranta.utils.BPCategory.OPTIMAL -> "Optimaalinen"
                            com.konderi.spo2seuranta.utils.BPCategory.NORMAL -> "Normaali"
                            com.konderi.spo2seuranta.utils.BPCategory.HIGH_NORMAL -> "Tyydyttävä"
                            com.konderi.spo2seuranta.utils.BPCategory.HYPERTENSION_GRADE1 -> "Korkea"
                            com.konderi.spo2seuranta.utils.BPCategory.HYPERTENSION_GRADE2 -> "Hyvin korkea"
                            com.konderi.spo2seuranta.utils.BPCategory.HYPOTENSION -> "Matala"
                        },
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Additional Vitals
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                VitalChip(label = "SpO2", value = "${measurement.spo2}%")
                VitalChip(label = "Syke", value = "${measurement.heartRate} BPM")
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
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun VitalChip(label: String, value: String) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = value,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}
