package com.konderi.spo2seuranta.data.sync

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import com.konderi.spo2seuranta.data.repository.DailyMeasurementRepository
import com.konderi.spo2seuranta.data.repository.ExerciseMeasurementRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Manager for syncing data with cloud
 */
@Singleton
class SyncManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val dailyRepo: DailyMeasurementRepository,
    private val exerciseRepo: ExerciseMeasurementRepository
) {
    private val syncScope = CoroutineScope(Dispatchers.IO)
    private val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    
    /**
     * Check if network is available
     */
    fun isNetworkAvailable(): Boolean {
        val network = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
    }
    
    /**
     * Sync all data with cloud
     */
    fun syncAll(onComplete: ((Boolean) -> Unit)? = null) {
        if (!isNetworkAvailable()) {
            onComplete?.invoke(false)
            return
        }
        
        syncScope.launch {
            try {
                // Sync daily measurements
                val dailyResult = dailyRepo.syncWithCloud()
                
                // Sync exercise measurements
                val exerciseResult = exerciseRepo.syncWithCloud()
                
                // Success if at least one succeeded
                val success = dailyResult.isSuccess || exerciseResult.isSuccess
                onComplete?.invoke(success)
            } catch (e: Exception) {
                onComplete?.invoke(false)
            }
        }
    }
    
    /**
     * Sync only daily measurements
     */
    fun syncDaily(onComplete: ((Boolean) -> Unit)? = null) {
        if (!isNetworkAvailable()) {
            onComplete?.invoke(false)
            return
        }
        
        syncScope.launch {
            val result = dailyRepo.syncWithCloud()
            onComplete?.invoke(result.isSuccess)
        }
    }
    
    /**
     * Sync only exercise measurements
     */
    fun syncExercise(onComplete: ((Boolean) -> Unit)? = null) {
        if (!isNetworkAvailable()) {
            onComplete?.invoke(false)
            return
        }
        
        syncScope.launch {
            val result = exerciseRepo.syncWithCloud()
            onComplete?.invoke(result.isSuccess)
        }
    }
}
