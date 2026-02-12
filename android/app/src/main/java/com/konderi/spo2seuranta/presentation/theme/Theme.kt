package com.konderi.spo2seuranta.presentation.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.graphics.Color
import androidx.hilt.navigation.compose.hiltViewModel
import com.konderi.spo2seuranta.presentation.settings.SettingsViewModel

private val DarkColorScheme = darkColorScheme(
    primary = Primary,
    secondary = Secondary,
    tertiary = Warning,
    background = Color(0xFF121212),
    surface = Color(0xFF1E1E1E),
    error = Error,
    onPrimary = OnPrimary,
    onSecondary = OnSecondary,
    onTertiary = OnPrimary,
    onBackground = Color(0xFFE1E1E1),
    onSurface = Color(0xFFE1E1E1),
    onError = OnError
)

private val LightColorScheme = lightColorScheme(
    primary = Primary,
    onPrimary = OnPrimary,
    primaryContainer = PrimaryLight,
    onPrimaryContainer = PrimaryDark,
    
    secondary = Secondary,
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = SecondaryLight,
    onSecondaryContainer = Color(0xFF1A237E),
    
    tertiary = Tertiary,
    onTertiary = OnPrimary,
    tertiaryContainer = Color(0xFFB2DFDB),
    onTertiaryContainer = Color(0xFF004D40),
    
    background = BackgroundGradientStart,
    onBackground = OnBackground,
    
    surface = SurfaceCard,
    onSurface = OnSurface,
    surfaceVariant = SurfaceLight,
    onSurfaceVariant = OnSurfaceVariant,
    
    error = Error,
    onError = OnError,
    errorContainer = Color(0xFFFFDAD6),
    onErrorContainer = Color(0xFF410002),
    
    outline = Color(0xFFCAC4D0),
    outlineVariant = Color(0xFF79747E)
)

@Composable
fun HapetusTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    largeFontEnabled: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    
    val typography = if (largeFontEnabled) LargeTypography else NormalTypography

    MaterialTheme(
        colorScheme = colorScheme,
        typography = typography,
        content = content
    )
}

/**
 * Theme wrapper that automatically applies large font setting
 */
@Composable
fun HapetusThemeWrapper(
    settingsViewModel: SettingsViewModel = hiltViewModel(),
    content: @Composable () -> Unit
) {
    val uiState by settingsViewModel.uiState.collectAsState()
    
    HapetusTheme(
        largeFontEnabled = uiState.settings.largeFontEnabled,
        content = content
    )
}
