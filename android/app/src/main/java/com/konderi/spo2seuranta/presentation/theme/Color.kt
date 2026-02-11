package com.konderi.spo2seuranta.presentation.theme

import androidx.compose.ui.graphics.Color

// Primary colors - Hapetus Brand (matching website)
val Primary = Color(0xFF0070E6) // Darker professional blue - matches website
val PrimaryLight = Color(0xFFE6F4FF) // Light blue for backgrounds
val PrimaryDark = Color(0xFF0059B3) // Even darker for hover/pressed states
val Secondary = Color(0xFF5C6BC0) // Soft indigo for secondary actions
val SecondaryLight = Color(0xFFE8EAF6) // Very light indigo for containers
val Tertiary = Color(0xFF00897B) // Teal for positive values

// Surface colors - Clean and modern
val SurfaceLight = Color(0xFFF5F7FA) // Very light blue-gray
val SurfaceCard = Color(0xFFFFFFFF) // Pure white for cards
val Background = Color(0xFFFFFFFF)
val BackgroundGradientStart = Color(0xFFF5F7FA)
val BackgroundGradientEnd = Color(0xFFFFFFFF)

// Status colors
val Error = Color(0xFFE53935) // Bright red for errors
val Warning = Color(0xFFFB8C00) // Vibrant orange for warnings
val Success = Color(0xFF43A047) // Green for success

// Text colors
val OnPrimary = Color(0xFFFFFFFF)
val OnSecondary = Color(0xFF000000)
val OnBackground = Color(0xFF1A1A1A)
val OnSurface = Color(0xFF1A1A1A)
val OnSurfaceVariant = Color(0xFF49454F)
val OnError = Color(0xFFFFFFFF)

// SpO2 specific colors - More vibrant
val HighSpo2 = Color(0xFF43A047) // Vibrant green for healthy levels (95-100%)
val MediumSpo2 = Color(0xFFFB8C00) // Vibrant orange for concerning levels (90-94%)
val LowSpo2 = Color(0xFFE53935) // Vibrant red for dangerous levels (<90%)

// Heart rate colors
val NormalHeartRate = Color(0xFF1E88E5) // Bright blue
val ElevatedHeartRate = Color(0xFFFB8C00) // Orange for elevated

// Accent colors
val AccentCyan = Color(0xFF00BCD4)
val AccentPurple = Color(0xFF7E57C2)
val AccentTeal = Color(0xFF009688)
