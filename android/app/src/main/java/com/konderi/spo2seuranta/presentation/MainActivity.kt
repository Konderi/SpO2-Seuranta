package com.konderi.spo2seuranta.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.konderi.spo2seuranta.data.sync.SyncManager
import com.konderi.spo2seuranta.presentation.navigation.AppNavigation
import com.konderi.spo2seuranta.presentation.theme.SpO2SeurantaTheme
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    @Inject
    lateinit var syncManager: SyncManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Trigger background sync on app start
        syncManager.syncAll()
        
        setContent {
            SpO2SeurantaTheme {
                // Observe lifecycle events and sync when app resumes
                val lifecycleOwner = LocalLifecycleOwner.current
                var isAppInForeground by remember { mutableStateOf(true) }
                
                DisposableEffect(lifecycleOwner) {
                    val observer = LifecycleEventObserver { _, event ->
                        when (event) {
                            Lifecycle.Event.ON_RESUME -> {
                                // Sync when app comes to foreground
                                if (!isAppInForeground) {
                                    syncManager.syncAll()
                                }
                                isAppInForeground = true
                            }
                            Lifecycle.Event.ON_PAUSE -> {
                                isAppInForeground = false
                            }
                            else -> {}
                        }
                    }
                    
                    lifecycleOwner.lifecycle.addObserver(observer)
                    
                    onDispose {
                        lifecycleOwner.lifecycle.removeObserver(observer)
                    }
                }
                
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppNavigation(
                        onRefresh = { syncManager.syncAll() }
                    )
                }
            }
        }
    }
}
