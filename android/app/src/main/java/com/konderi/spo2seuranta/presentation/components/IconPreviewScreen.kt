package com.konderi.spo2seuranta.presentation.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.konderi.hapetus.R

/**
 * Test screen to preview all custom SpO2 icons
 * Shows all 6 custom icon options side by side
 */
@Composable
fun IconPreviewScreen() {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            Text(
                text = "SpO2 Icon Options",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            
            Text(
                text = "Choose the icon that best represents oxygen saturation monitoring:",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            // Icon 1: O2 Symbol
            IconPreviewCard(
                number = "1",
                title = "O₂ Symbol",
                description = "Clean medical oxygen representation with O₂ text in circle",
                iconRes = R.drawable.ic_oxygen_symbol
            )
            
            // Icon 2: Pulse Oximeter
            IconPreviewCard(
                number = "2",
                title = "Pulse Oximeter Device",
                description = "Finger clip device with display screen - most recognizable",
                iconRes = R.drawable.ic_pulse_oximeter
            )
            
            // Icon 3: Blood Oxygen
            IconPreviewCard(
                number = "3",
                title = "Blood Drop + O₂",
                description = "Blood drop shape with O₂ symbol inside",
                iconRes = R.drawable.ic_blood_oxygen
            )
            
            // Icon 4: Lungs
            IconPreviewCard(
                number = "4",
                title = "Lungs with Oxygen",
                description = "Anatomical lungs with O₂ molecules - respiratory focus",
                iconRes = R.drawable.ic_lungs_oxygen
            )
            
            // Icon 5: Heartbeat O2
            IconPreviewCard(
                number = "5",
                title = "ECG Wave + O₂",
                description = "Pulse waveform combined with O₂ circle - dynamic feel",
                iconRes = R.drawable.ic_heartbeat_oxygen
            )
            
            // Icon 6: Blood Saturation
            IconPreviewCard(
                number = "6",
                title = "Blood Saturation Level",
                description = "Blood drop with fill level and pulse wave",
                iconRes = R.drawable.ic_blood_saturation
            )
            
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun IconPreviewCard(
    number: String,
    title: String,
    description: String,
    iconRes: Int
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Large icon preview
            Surface(
                modifier = Modifier.size(72.dp),
                color = MaterialTheme.colorScheme.primaryContainer,
                shape = MaterialTheme.shapes.medium
            ) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        painter = painterResource(iconRes),
                        contentDescription = title,
                        modifier = Modifier.size(48.dp),
                        tint = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }
            
            // Description
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = MaterialTheme.colorScheme.primary,
                        shape = MaterialTheme.shapes.small
                    ) {
                        Text(
                            text = number,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onPrimary,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                }
                
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
