# Android API Integration Guide - Complete Implementation

## Overview
This guide provides step-by-step instructions to connect the Android app to the backend API at `https://api.hapetus.info`, enabling full cross-platform data synchronization with the website.

**Current Status:**
- ✅ Website: Fully connected to API
- ✅ Backend API: Live at https://api.hapetus.info
- ✅ Firebase Auth: Configured for both web and Android
- ❌ Android App: Currently uses local Room database only

**Goal:** Add network layer to Android app while keeping offline-first functionality.

---

## Part 1: Add Dependencies (15 minutes)

### 1.1 Update `android/app/build.gradle.kts`

Add these dependencies to the `dependencies` block:

```kotlin
dependencies {
    // Existing dependencies...
    
    // Network - Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp (for logging and interceptors)
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Coroutines (if not already added)
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // Gson (for JSON parsing)
    implementation("com.google.code.gson:gson:2.10.1")
}
```

### 1.2 Add Internet Permission

In `android/app/src/main/AndroidManifest.xml`, add before `<application>` tag:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### 1.3 Add Network Security Config (Optional but Recommended)

Create `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Trust default CAs (Let's Encrypt, etc.) -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    
    <!-- For development: Allow localhost (remove in production) -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

Update `AndroidManifest.xml` `<application>` tag:

```xml
<application
    ...
    android:networkSecurityConfig="@xml/network_security_config"
    android:usesCleartextTraffic="false">
```

### 1.4 Sync Gradle

```bash
# In Android Studio, click "Sync Now" or run:
./gradlew build
```

---

## Part 2: Create API Service Layer (30 minutes)

### 2.1 Create API Models

Create `android/app/src/main/java/com/konderi/hapetus/data/remote/ApiModels.kt`:

```kotlin
package com.konderi.hapetus.data.remote

import com.google.gson.annotations.SerializedName

// Generic API Response
data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val error: String?
)

// Daily Measurement (matches website format)
data class DailyMeasurementDto(
    val id: String? = null,
    @SerializedName("user_id")
    val userId: String? = null,
    val spo2: Int,
    @SerializedName("heart_rate")
    val heartRate: Int,
    val notes: String? = null,
    @SerializedName("measured_at")
    val measuredAt: Long,  // Unix timestamp in seconds
    @SerializedName("created_at")
    val createdAt: Long,
    @SerializedName("updated_at")
    val updatedAt: Long
)

// Exercise Measurement (matches website format)
data class ExerciseMeasurementDto(
    val id: String? = null,
    @SerializedName("user_id")
    val userId: String? = null,
    @SerializedName("exercise_type")
    val exerciseType: String,
    @SerializedName("exercise_duration")
    val exerciseDuration: Int? = null,
    @SerializedName("spo2_before")
    val spo2Before: Int,
    @SerializedName("heart_rate_before")
    val heartRateBefore: Int,
    @SerializedName("spo2_after")
    val spo2After: Int,
    @SerializedName("heart_rate_after")
    val heartRateAfter: Int,
    val notes: String? = null,
    @SerializedName("measured_at")
    val measuredAt: Long,  // Unix timestamp in seconds
    @SerializedName("created_at")
    val createdAt: Long,
    @SerializedName("updated_at")
    val updatedAt: Long
)

// Statistics (from API)
data class StatisticsDto(
    @SerializedName("avg_spo2")
    val avgSpo2: Double,
    @SerializedName("avg_heart_rate")
    val avgHeartRate: Double,
    @SerializedName("min_spo2")
    val minSpo2: Int,
    @SerializedName("max_spo2")
    val maxSpo2: Int,
    @SerializedName("min_heart_rate")
    val minHeartRate: Int,
    @SerializedName("max_heart_rate")
    val maxHeartRate: Int,
    val count: Int
)
```

### 2.2 Create Retrofit API Service

Create `android/app/src/main/java/com/konderi/hapetus/data/remote/HapetusApiService.kt`:

```kotlin
package com.konderi.hapetus.data.remote

import retrofit2.Response
import retrofit2.http.*

interface HapetusApiService {
    
    // Daily Measurements
    @GET("/api/daily")
    suspend fun getDailyMeasurements(
        @Header("Authorization") token: String
    ): Response<ApiResponse<List<DailyMeasurementDto>>>
    
    @POST("/api/daily")
    suspend fun createDailyMeasurement(
        @Header("Authorization") token: String,
        @Body measurement: DailyMeasurementDto
    ): Response<ApiResponse<Unit>>
    
    @PUT("/api/daily/{id}")
    suspend fun updateDailyMeasurement(
        @Header("Authorization") token: String,
        @Path("id") id: String,
        @Body measurement: DailyMeasurementDto
    ): Response<ApiResponse<Unit>>
    
    @DELETE("/api/daily/{id}")
    suspend fun deleteDailyMeasurement(
        @Header("Authorization") token: String,
        @Path("id") id: String
    ): Response<ApiResponse<Unit>>
    
    // Exercise Measurements
    @GET("/api/exercise")
    suspend fun getExerciseMeasurements(
        @Header("Authorization") token: String
    ): Response<ApiResponse<List<ExerciseMeasurementDto>>>
    
    @POST("/api/exercise")
    suspend fun createExerciseMeasurement(
        @Header("Authorization") token: String,
        @Body measurement: ExerciseMeasurementDto
    ): Response<ApiResponse<Unit>>
    
    @PUT("/api/exercise/{id}")
    suspend fun updateExerciseMeasurement(
        @Header("Authorization") token: String,
        @Path("id") id: String,
        @Body measurement: ExerciseMeasurementDto
    ): Response<ApiResponse<Unit>>
    
    @DELETE("/api/exercise/{id}")
    suspend fun deleteExerciseMeasurement(
        @Header("Authorization") token: String,
        @Path("id") id: String
    ): Response<ApiResponse<Unit>>
    
    // Statistics
    @GET("/api/stats/week")
    suspend fun getWeeklyStats(
        @Header("Authorization") token: String
    ): Response<ApiResponse<StatisticsDto>>
    
    @GET("/api/stats/daily")
    suspend fun getDailyStats(
        @Header("Authorization") token: String,
        @Query("days") days: Int = 30
    ): Response<ApiResponse<List<StatisticsDto>>>
}
```

### 2.3 Create Retrofit Client

Create `android/app/src/main/java/com/konderi/hapetus/data/remote/RetrofitClient.kt`:

```kotlin
package com.konderi.hapetus.data.remote

import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.tasks.await
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    private const val BASE_URL = "https://api.hapetus.info"
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    // Auth interceptor to automatically add Firebase token
    private val authInterceptor = Interceptor { chain ->
        val originalRequest = chain.request()
        
        // Skip auth for certain endpoints if needed
        if (originalRequest.url.encodedPath.contains("/health")) {
            return@Interceptor chain.proceed(originalRequest)
        }
        
        // Get Firebase token synchronously (note: this blocks!)
        val token = try {
            FirebaseAuth.getInstance().currentUser?.getIdToken(false)?.await()?.token
        } catch (e: Exception) {
            null
        }
        
        val newRequest = if (token != null) {
            originalRequest.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
        } else {
            originalRequest
        }
        
        chain.proceed(newRequest)
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val apiService: HapetusApiService = retrofit.create(HapetusApiService::class.java)
}
```

---

## Part 3: Create Mapper Functions (20 minutes)

### 3.1 Create Data Mappers

Create `android/app/src/main/java/com/konderi/hapetus/data/remote/Mappers.kt`:

```kotlin
package com.konderi.hapetus.data.remote

import com.konderi.hapetus.data.local.entity.DailyMeasurement
import com.konderi.hapetus.data.local.entity.ExerciseMeasurement

// Convert Room entity to API DTO
fun DailyMeasurement.toDto(): DailyMeasurementDto {
    return DailyMeasurementDto(
        id = id.takeIf { it > 0 }?.toString(),
        userId = null, // Server will set this
        spo2 = spo2,
        heartRate = heartRate,
        notes = notes,
        measuredAt = timestamp / 1000, // Convert millis to seconds
        createdAt = System.currentTimeMillis() / 1000,
        updatedAt = System.currentTimeMillis() / 1000
    )
}

// Convert API DTO to Room entity
fun DailyMeasurementDto.toEntity(): DailyMeasurement {
    return DailyMeasurement(
        id = id?.toLongOrNull() ?: 0,
        spo2 = spo2,
        heartRate = heartRate,
        notes = notes,
        timestamp = measuredAt * 1000 // Convert seconds to millis
    )
}

// Convert Room entity to API DTO
fun ExerciseMeasurement.toDto(): ExerciseMeasurementDto {
    return ExerciseMeasurementDto(
        id = id.takeIf { it > 0 }?.toString(),
        userId = null,
        exerciseType = exerciseType,
        exerciseDuration = duration,
        spo2Before = spo2Before,
        heartRateBefore = heartRateBefore,
        spo2After = spo2After,
        heartRateAfter = heartRateAfter,
        notes = notes,
        measuredAt = timestamp / 1000,
        createdAt = System.currentTimeMillis() / 1000,
        updatedAt = System.currentTimeMillis() / 1000
    )
}

// Convert API DTO to Room entity
fun ExerciseMeasurementDto.toEntity(): ExerciseMeasurement {
    return ExerciseMeasurement(
        id = id?.toLongOrNull() ?: 0,
        exerciseType = exerciseType,
        duration = exerciseDuration,
        spo2Before = spo2Before,
        heartRateBefore = heartRateBefore,
        spo2After = spo2After,
        heartRateAfter = heartRateAfter,
        notes = notes,
        timestamp = measuredAt * 1000
    )
}
```

---

## Part 4: Update Repositories (45 minutes)

### 4.1 Update Daily Measurement Repository

Update `android/app/src/main/java/com/konderi/hapetus/data/repository/DailyMeasurementRepository.kt`:

```kotlin
package com.konderi.hapetus.data.repository

import android.util.Log
import com.konderi.hapetus.data.local.dao.DailyMeasurementDao
import com.konderi.hapetus.data.local.entity.DailyMeasurement
import com.konderi.hapetus.data.remote.RetrofitClient
import com.konderi.hapetus.data.remote.toDto
import com.konderi.hapetus.data.remote.toEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext

class DailyMeasurementRepository(private val dao: DailyMeasurementDao) {
    
    companion object {
        private const val TAG = "DailyMeasurementRepo"
    }
    
    // Get all measurements (from local database)
    fun getAllMeasurements(): Flow<List<DailyMeasurement>> {
        return dao.getAllMeasurements()
    }
    
    // Get measurements by date range
    fun getMeasurementsByDateRange(startDate: Long, endDate: Long): Flow<List<DailyMeasurement>> {
        return dao.getMeasurementsByDateRange(startDate, endDate)
    }
    
    // Get latest measurements
    fun getLatestMeasurements(limit: Int): Flow<List<DailyMeasurement>> {
        return dao.getLatestMeasurements(limit)
    }
    
    // Insert measurement (offline-first)
    suspend fun insertMeasurement(measurement: DailyMeasurement): Result<Long> = withContext(Dispatchers.IO) {
        try {
            // 1. Save to local database first (offline-first)
            val localId = dao.insert(measurement)
            Log.d(TAG, "Saved measurement locally with ID: $localId")
            
            // 2. Try to sync to cloud
            try {
                val measurementWithId = measurement.copy(id = localId)
                val response = RetrofitClient.apiService.createDailyMeasurement(
                    token = "", // Token added by interceptor
                    measurement = measurementWithId.toDto()
                )
                
                if (response.isSuccessful) {
                    Log.d(TAG, "Synced measurement to cloud successfully")
                } else {
                    Log.w(TAG, "Failed to sync to cloud: ${response.code()}")
                    // Still return success since local save worked
                }
            } catch (e: Exception) {
                Log.w(TAG, "Failed to sync to cloud (offline?): ${e.message}")
                // Still return success since local save worked
            }
            
            Result.success(localId)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to save measurement: ${e.message}")
            Result.failure(e)
        }
    }
    
    // Update measurement
    suspend fun updateMeasurement(measurement: DailyMeasurement): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            // Update locally
            dao.update(measurement)
            
            // Try to sync to cloud
            try {
                if (measurement.id > 0) {
                    RetrofitClient.apiService.updateDailyMeasurement(
                        token = "",
                        id = measurement.id.toString(),
                        measurement = measurement.toDto()
                    )
                }
            } catch (e: Exception) {
                Log.w(TAG, "Failed to sync update to cloud: ${e.message}")
            }
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Delete measurement
    suspend fun deleteMeasurement(measurement: DailyMeasurement): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            // Delete locally
            dao.delete(measurement)
            
            // Try to delete from cloud
            try {
                if (measurement.id > 0) {
                    RetrofitClient.apiService.deleteDailyMeasurement(
                        token = "",
                        id = measurement.id.toString()
                    )
                }
            } catch (e: Exception) {
                Log.w(TAG, "Failed to delete from cloud: ${e.message}")
            }
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Sync with cloud (fetch latest data)
    suspend fun syncWithCloud(): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            Log.d(TAG, "Starting sync with cloud...")
            
            val response = RetrofitClient.apiService.getDailyMeasurements(token = "")
            
            if (response.isSuccessful && response.body()?.success == true) {
                val cloudMeasurements = response.body()?.data ?: emptyList()
                Log.d(TAG, "Fetched ${cloudMeasurements.size} measurements from cloud")
                
                // Convert DTOs to entities
                val entities = cloudMeasurements.map { it.toEntity() }
                
                // Insert or update each measurement
                entities.forEach { measurement ->
                    try {
                        // Check if exists locally
                        val existing = dao.getMeasurementById(measurement.id)
                        if (existing != null) {
                            // Update if cloud version is newer
                            dao.update(measurement)
                        } else {
                            // Insert new measurement from cloud
                            dao.insert(measurement)
                        }
                    } catch (e: Exception) {
                        Log.w(TAG, "Failed to sync individual measurement: ${e.message}")
                    }
                }
                
                Log.d(TAG, "Sync completed successfully")
                Result.success(Unit)
            } else {
                Log.e(TAG, "Sync failed: ${response.code()}")
                Result.failure(Exception("Sync failed with code: ${response.code()}"))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Sync error: ${e.message}")
            Result.failure(e)
        }
    }
}
```

### 4.2 Update Exercise Measurement Repository

Similarly update `ExerciseMeasurementRepository.kt` with the same pattern:
- Save locally first (offline-first)
- Try to sync to cloud
- Add `syncWithCloud()` method
- Handle network errors gracefully

---

## Part 5: Add Sync Manager (30 minutes)

### 5.1 Create Sync Manager

Create `android/app/src/main/java/com/konderi/hapetus/data/sync/SyncManager.kt`:

```kotlin
package com.konderi.hapetus.data.sync

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.util.Log
import com.konderi.hapetus.data.repository.DailyMeasurementRepository
import com.konderi.hapetus.data.repository.ExerciseMeasurementRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class SyncManager(
    private val context: Context,
    private val dailyRepo: DailyMeasurementRepository,
    private val exerciseRepo: ExerciseMeasurementRepository
) {
    companion object {
        private const val TAG = "SyncManager"
    }
    
    private val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    private val syncScope = CoroutineScope(Dispatchers.IO)
    
    // Check if network is available
    fun isNetworkAvailable(): Boolean {
        val network = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
        
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
    }
    
    // Sync all data with cloud
    fun syncAll() {
        if (!isNetworkAvailable()) {
            Log.d(TAG, "No network available, skipping sync")
            return
        }
        
        syncScope.launch {
            Log.d(TAG, "Starting full sync...")
            
            // Sync daily measurements
            val dailyResult = dailyRepo.syncWithCloud()
            if (dailyResult.isSuccess) {
                Log.d(TAG, "Daily measurements synced successfully")
            } else {
                Log.e(TAG, "Failed to sync daily measurements: ${dailyResult.exceptionOrNull()?.message}")
            }
            
            // Sync exercise measurements
            val exerciseResult = exerciseRepo.syncWithCloud()
            if (exerciseResult.isSuccess) {
                Log.d(TAG, "Exercise measurements synced successfully")
            } else {
                Log.e(TAG, "Failed to sync exercise measurements: ${exerciseResult.exceptionOrNull()?.message}")
            }
            
            Log.d(TAG, "Full sync completed")
        }
    }
    
    // Register network callback to auto-sync when online
    fun registerNetworkCallback() {
        val networkRequest = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()
        
        connectivityManager.registerNetworkCallback(networkRequest, object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                Log.d(TAG, "Network available, triggering sync")
                syncAll()
            }
            
            override fun onLost(network: Network) {
                Log.d(TAG, "Network lost")
            }
        })
    }
}
```

---

## Part 6: Update ViewModels (20 minutes)

### 6.1 Update MainViewModel

Update your `MainViewModel` to trigger sync on app start:

```kotlin
class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getDatabase(application)
    private val dailyRepo = DailyMeasurementRepository(database.dailyMeasurementDao())
    private val exerciseRepo = ExerciseMeasurementRepository(database.exerciseMeasurementDao())
    private val syncManager = SyncManager(application, dailyRepo, exerciseRepo)
    
    init {
        // Register network callback for auto-sync
        syncManager.registerNetworkCallback()
        
        // Trigger initial sync
        viewModelScope.launch {
            syncManager.syncAll()
        }
    }
    
    // Rest of your ViewModel code...
}
```

---

## Part 7: Testing (30 minutes)

### 7.1 Test Offline-First Behavior

1. **Airplane Mode Test**:
   ```
   - Turn on airplane mode
   - Add a measurement
   - Verify it saves locally
   - Turn off airplane mode
   - Verify it syncs to cloud automatically
   ```

2. **Website Cross-Check**:
   ```
   - Add measurement on Android
   - Open https://hapetus.info
   - Sign in with same Google account
   - Verify measurement appears
   ```

3. **Reverse Sync Test**:
   ```
   - Add measurement on website
   - Open Android app
   - Pull to refresh or restart app
   - Verify measurement appears
   ```

### 7.2 Check Logs

```bash
# Filter logs for sync activity
adb logcat | grep -E "(Sync|API|Retrofit)"
```

---

## Part 8: Production Checklist

### 8.1 Before Release

- [ ] Remove or reduce logging in production
- [ ] Add ProGuard rules for Retrofit/Gson
- [ ] Test on slow networks (3G simulation)
- [ ] Test with no network (airplane mode)
- [ ] Test sync after app restart
- [ ] Test with large datasets (100+ measurements)
- [ ] Verify Firebase token refresh
- [ ] Test account switching
- [ ] Add error messages to UI
- [ ] Add pull-to-refresh functionality

### 8.2 ProGuard Rules

Add to `android/app/proguard-rules.pro`:

```proguard
# Retrofit
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Your API models
-keep class com.konderi.hapetus.data.remote.** { *; }
```

---

## Timeline Summary

| Task | Time | Difficulty |
|------|------|------------|
| Add dependencies | 15 min | Easy |
| Create API service | 30 min | Medium |
| Create mappers | 20 min | Easy |
| Update repositories | 45 min | Hard |
| Add sync manager | 30 min | Medium |
| Update ViewModels | 20 min | Easy |
| Testing | 30 min | Medium |
| **Total** | **~3 hours** | **Medium** |

---

## Troubleshooting

### Common Issues

**1. "Unable to resolve host"**
- Check internet permission in manifest
- Verify network connectivity
- Check Firebase authentication

**2. "401 Unauthorized"**
- Firebase token might be expired
- Call `getIdToken(true)` to force refresh
- Check if user is signed in

**3. "Data not syncing"**
- Check logcat for errors
- Verify API endpoint is correct
- Test API with Postman first
- Check timestamp conversion (millis vs seconds)

**4. "Duplicate entries"**
- Check ID handling in mappers
- Verify upsert logic in sync
- Use unique constraints in Room

---

## Next Steps

After implementing Android sync:

1. **Add Pull-to-Refresh**: SwipeRefreshLayout to manually trigger sync
2. **Add Sync Indicator**: Show syncing status in UI
3. **Conflict Resolution**: Handle when local and cloud differ
4. **Background Sync**: Use WorkManager for periodic sync
5. **Selective Sync**: Only sync recent data initially

---

## Resources

- **Backend API Docs**: See `api/README.md` in repository
- **Website Integration**: See `WEBSITE_API_INTEGRATION_COMPLETE.md`
- **Retrofit Docs**: https://square.github.io/retrofit/
- **Firebase Auth**: https://firebase.google.com/docs/auth/android/start

---

**Last Updated**: February 11, 2026  
**Status**: Ready for implementation  
**Estimated Completion**: 3-4 hours for experienced developer
