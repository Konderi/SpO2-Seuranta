package com.konderi.spo2seuranta.presentation.settings

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.konderi.spo2seuranta.presentation.auth.AuthViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: SettingsViewModel = hiltViewModel(),
    authViewModel: AuthViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var showThresholdDialog by remember { mutableStateOf(false) }
    var thresholdValue by remember { mutableStateOf(uiState.settings.lowSpo2AlertThreshold.toString()) }
    var showGenderDialog by remember { mutableStateOf(false) }
    var showBirthYearDialog by remember { mutableStateOf(false) }
    var birthYearValue by remember { mutableStateOf(uiState.settings.birthYear?.toString() ?: "") }
    
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
                            text = "Hälytykset",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.primary
                        )
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Matalan SpO2:n raja-arvo",
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = "Nykyinen: ${uiState.settings.lowSpo2AlertThreshold}%",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Button(onClick = { showThresholdDialog = true }) {
                                Text("Muuta")
                            }
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
                            text = "Näyttö",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.primary
                        )
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Suuri fontti",
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = "Käytä suurempaa tekstikokoa",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Switch(
                                checked = uiState.settings.largeFontEnabled,
                                onCheckedChange = { viewModel.updateLargeFontEnabled(it) }
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Manuaalinen syöttö",
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = "Valitse päivämäärä ja aika manuaalisesti",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Switch(
                                checked = uiState.settings.manualEntryEnabled,
                                onCheckedChange = { viewModel.updateManualEntryEnabled(it) }
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
                            text = "Tili",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.primary
                        )
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        if (uiState.settings.userName != null) {
                            Text(
                                text = "Kirjautunut sisään:",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = uiState.settings.userName ?: "",
                                style = MaterialTheme.typography.titleMedium
                            )
                            Text(
                                text = uiState.settings.userEmail ?: "",
                                style = MaterialTheme.typography.bodyMedium
                            )
                            
                            Spacer(modifier = Modifier.height(16.dp))
                            
                            Button(
                                onClick = { authViewModel.signOut() },
                                modifier = Modifier.fillMaxWidth(),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = MaterialTheme.colorScheme.error
                                )
                            ) {
                                Text("Kirjaudu ulos")
                            }
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
                            text = "Henkilötiedot",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.primary
                        )
                        
                        Text(
                            text = "Tiedot auttavat antamaan ikä- ja sukupuolikohtaisia suosituksia verenpaineelle",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        // Gender setting
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Sukupuoli",
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = uiState.settings.getGenderDisplay() ?: "Ei asetettu",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Button(onClick = { showGenderDialog = true }) {
                                Text("Muuta")
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(12.dp))
                        
                        // Birth year setting
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Syntymävuosi",
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = if (uiState.settings.birthYear != null) {
                                        "${uiState.settings.birthYear} (Ikä: ${uiState.settings.getAge()} v)"
                                    } else {
                                        "Ei asetettu"
                                    },
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Button(onClick = { showBirthYearDialog = true }) {
                                Text("Muuta")
                            }
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
                            text = "Tietoja sovelluksesta",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.primary
                        )
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        Text(
                            text = "Hapetus v1.0.0",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        Text(
                            text = "Happisaturaation, sykkeen ja verenpaineen seuranta",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
    
    if (showThresholdDialog) {
        AlertDialog(
            onDismissRequest = { showThresholdDialog = false },
            title = { Text("Aseta raja-arvo") },
            text = {
                Column {
                    Text("Aseta SpO2-raja-arvo (70-95%)")
                    Spacer(modifier = Modifier.height(16.dp))
                    OutlinedTextField(
                        value = thresholdValue,
                        onValueChange = { 
                            if (it.isEmpty() || it.all { char -> char.isDigit() }) {
                                thresholdValue = it
                            }
                        },
                        label = { Text("Raja-arvo (%)") },
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        val value = thresholdValue.toIntOrNull()
                        if (value != null && value in 70..95) {
                            viewModel.updateLowSpo2Threshold(value)
                            showThresholdDialog = false
                        }
                    }
                ) {
                    Text("Tallenna")
                }
            },
            dismissButton = {
                TextButton(onClick = { showThresholdDialog = false }) {
                    Text("Peruuta")
                }
            }
        )
    }
    
    if (showGenderDialog) {
        AlertDialog(
            onDismissRequest = { showGenderDialog = false },
            title = { Text("Valitse sukupuoli") },
            text = {
                Column {
                    Text("Sukupuoli auttaa antamaan tarkempia suosituksia verenpaineelle")
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    listOf(
                        "male" to "Mies",
                        "female" to "Nainen",
                        "other" to "Muu"
                    ).forEach { (value, label) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    viewModel.updateGender(value)
                                    showGenderDialog = false
                                }
                                .padding(vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = uiState.settings.gender == value,
                                onClick = {
                                    viewModel.updateGender(value)
                                    showGenderDialog = false
                                }
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(label)
                        }
                    }
                }
            },
            confirmButton = {},
            dismissButton = {
                TextButton(onClick = { showGenderDialog = false }) {
                    Text("Sulje")
                }
            }
        )
    }
    
    if (showBirthYearDialog) {
        AlertDialog(
            onDismissRequest = { showBirthYearDialog = false },
            title = { Text("Aseta syntymävuosi") },
            text = {
                Column {
                    Text("Ikä auttaa antamaan ikäkohtaisia suosituksia verenpaineelle")
                    Spacer(modifier = Modifier.height(16.dp))
                    OutlinedTextField(
                        value = birthYearValue,
                        onValueChange = { 
                            if (it.isEmpty() || (it.all { char -> char.isDigit() } && it.length <= 4)) {
                                birthYearValue = it
                            }
                        },
                        label = { Text("Syntymävuosi (esim. 1960)") },
                        singleLine = true,
                        placeholder = { Text("1960") }
                    )
                }
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        val value = birthYearValue.toIntOrNull()
                        if (value != null && value in 1900..2026) {
                            viewModel.updateBirthYear(value)
                            showBirthYearDialog = false
                        }
                    }
                ) {
                    Text("Tallenna")
                }
            },
            dismissButton = {
                TextButton(onClick = { showBirthYearDialog = false }) {
                    Text("Peruuta")
                }
            }
        )
    }
}

