package com.konderi.spo2seuranta.presentation.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.konderi.spo2seuranta.presentation.auth.AuthScreen
import com.konderi.spo2seuranta.presentation.auth.AuthState
import com.konderi.spo2seuranta.presentation.auth.AuthViewModel
import com.konderi.spo2seuranta.presentation.daily.DailyMeasurementScreen
import com.konderi.spo2seuranta.presentation.exercise.ExerciseMeasurementScreen
import com.konderi.spo2seuranta.presentation.reports.ReportsScreen
import com.konderi.spo2seuranta.presentation.settings.SettingsScreen

/**
 * Main navigation for the app
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppNavigation(
    authViewModel: AuthViewModel = hiltViewModel()
) {
    val authState by authViewModel.authState.collectAsState()
    
    // Show auth screen if not authenticated, otherwise show main app
    when (authState) {
        is AuthState.Loading -> {
            LoadingScreen()
        }
        is AuthState.NotAuthenticated, is AuthState.Error -> {
            // Show auth screen for both not authenticated and error states
            AuthScreen(authViewModel = authViewModel)
        }
        is AuthState.Authenticated -> {
            MainApp(authViewModel = authViewModel)
        }
    }
}

@Composable
fun LoadingScreen() {
    Surface {
        // Simple loading screen
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainApp(
    authViewModel: AuthViewModel = hiltViewModel()
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            NavigationBar(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
                    .shadow(8.dp, RoundedCornerShape(24.dp))
                    .clip(RoundedCornerShape(24.dp)),
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 0.dp
            ) {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Favorite, contentDescription = "Päivittäinen") },
                    selected = currentRoute == Screen.Daily.route,
                    onClick = {
                        navController.navigate(Screen.Daily.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.DirectionsRun, contentDescription = "Liikunta") },
                    selected = currentRoute == Screen.Exercise.route,
                    onClick = {
                        navController.navigate(Screen.Exercise.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Assessment, contentDescription = "Raportit") },
                    selected = currentRoute == Screen.Reports.route,
                    onClick = {
                        navController.navigate(Screen.Reports.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Asetukset") },
                    selected = currentRoute == Screen.Settings.route,
                    onClick = {
                        navController.navigate(Screen.Settings.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = Screen.Daily.route,
            modifier = Modifier.padding(top = paddingValues.calculateTopPadding())
        ) {
            composable(Screen.Daily.route) {
                DailyMeasurementScreen()
            }
            composable(Screen.Exercise.route) {
                ExerciseMeasurementScreen()
            }
            composable(Screen.Reports.route) {
                ReportsScreen()
            }
            composable(Screen.Settings.route) {
                SettingsScreen()
            }
        }
    }
}

sealed class Screen(val route: String) {
    object Daily : Screen("daily")
    object Exercise : Screen("exercise")
    object Reports : Screen("reports")
    object Settings : Screen("settings")
}
