package com.konderi.spo2seuranta.presentation.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.DirectionsRun
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import com.konderi.hapetus.R
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.konderi.spo2seuranta.presentation.auth.AuthScreen
import com.konderi.spo2seuranta.presentation.auth.AuthState
import com.konderi.spo2seuranta.presentation.auth.AuthViewModel
import com.konderi.spo2seuranta.presentation.bloodpressure.BloodPressureScreen
import com.konderi.spo2seuranta.presentation.daily.DailyMeasurementScreen
import com.konderi.spo2seuranta.presentation.daily.DailyMeasurementViewModel
import com.konderi.spo2seuranta.presentation.exercise.ExerciseMeasurementScreen
import com.konderi.spo2seuranta.presentation.reports.ReportsScreen
import com.konderi.spo2seuranta.presentation.settings.SettingsScreen
import kotlinx.coroutines.launch

/**
 * Main navigation for the app
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppNavigation(
    authViewModel: AuthViewModel = hiltViewModel(),
    onRefresh: () -> Unit = {}
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
            MainApp(authViewModel = authViewModel, onRefresh = onRefresh)
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
    @Suppress("UNUSED_PARAMETER") // Needed for proper recomposition on auth state changes
    authViewModel: AuthViewModel = hiltViewModel(),
    onRefresh: () -> Unit = {}
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val scope = rememberCoroutineScope()

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                ),
                title = {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Left: App icon (Health beat/monitor icon)
                        Icon(
                            imageVector = Icons.Default.MonitorHeart,
                            contentDescription = "Hapetus",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(start = 8.dp)
                        )
                        
                        // Center: Current screen title
                        Text(
                            text = when (currentRoute) {
                                Screen.Daily.route -> "Päivittäinen"
                                Screen.BloodPressure.route -> "Verenpaine"
                                Screen.Exercise.route -> "Liikunta"
                                Screen.Reports.route -> "Raportit"
                                Screen.Settings.route -> "Asetukset"
                                else -> "Hapetus"
                            },
                            fontSize = 20.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        
                        // Right: Refresh button
                        IconButton(
                            onClick = {
                                scope.launch {
                                    onRefresh()
                                }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Päivitä",
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            )
        },
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
                    icon = { 
                        Icon(
                            painter = painterResource(R.drawable.ic_lungs_oxygen),
                            contentDescription = "Päivittäinen"
                        )
                    },
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
                    icon = { Icon(Icons.Default.Bloodtype, contentDescription = "Verenpaine") },
                    selected = currentRoute == Screen.BloodPressure.route,
                    onClick = {
                        navController.navigate(Screen.BloodPressure.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.AutoMirrored.Filled.DirectionsRun, contentDescription = "Liikunta") },
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
            composable(Screen.BloodPressure.route) {
                BloodPressureScreen()
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
    object BloodPressure : Screen("bloodpressure")
    object Exercise : Screen("exercise")
    object Reports : Screen("reports")
    object Settings : Screen("settings")
}
