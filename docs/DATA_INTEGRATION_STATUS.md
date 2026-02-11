# Hapetus - Data Flow & Integration Status

## 📊 Current Data Architecture

### ✅ Backend API (DEPLOYED & READY)
- **URL**: https://api.hapetus.info
- **Status**: Live and functional
- **Database**: Cloudflare D1 (SQLite in the cloud)
- **Authentication**: Firebase token verification
- **Endpoints**: 15 REST APIs for daily/exercise measurements, statistics, user settings

### ⚠️ Website (LIVE BUT USING MOCK DATA)
- **URL**: https://hapetus.info
- **Status**: Live with UI complete
- **Current Data**: **MOCK DATA** (hardcoded in components)
- **API Client**: Created but **NOT CONNECTED**
- **Issue**: Pages show placeholder data, don't fetch from backend

### ⚠️ Android App (LOCAL DATABASE ONLY)
- **Status**: Fully functional
- **Current Data**: **Room database (local only)**
- **Backend Connection**: **NOT IMPLEMENTED**
- **Issue**: Data stays on device, no cloud sync

---

## 🔴 THE PROBLEM: Data is NOT Synced

### Current State:
```
Android App ─────────┐
                     │
                     ├──> Uses LOCAL Room database only
                     │    (Data stays on phone)
                     │
                     ✗ NOT CONNECTED to backend
                     

Backend API ─────────┐
                     │
                     ├──> Live at api.hapetus.info
                     │    Empty database (no data)
                     │
                     ✗ NOT RECEIVING data from Android
                     ✗ NOT SENDING data to website
                     

Website ─────────────┐
                     │
                     ├──> Shows MOCK/FAKE data
                     │    (Not real user data)
                     │
                     ✗ NOT FETCHING from backend
```

### What This Means:
1. **Android users CAN add measurements** → Saved to phone's Room database ✅
2. **Website CANNOT see Android data** → Shows fake placeholder data ❌
3. **Data is NOT synced** between devices ❌
4. **Backend API exists** but nobody is using it yet ❌

---

## 🔧 What Needs to be Done: Connect Everything

### Step 1: Connect Website to Backend API

**Files to Update:**

**1. `web/src/pages/dashboard.tsx`**
```typescript
// CURRENT (Mock data):
const latestMeasurements = {
  spo2: 96,
  heartRate: 72,
  trend: '+2%',
  date: new Date().toLocaleDateString('fi-FI'),
}

// SHOULD BE (Real data from API):
import { apiClient } from '@/lib/api'
import { useEffect, useState } from 'react'

const [measurements, setMeasurements] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await apiClient.getDailyMeasurements()
      setMeasurements(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch measurements:', error)
      setLoading(false)
    }
  }
  fetchData()
}, [])
```

**2. `web/src/pages/history.tsx`**
```typescript
// CURRENT:
const measurements = [
  { id: 1, type: 'daily', spo2: 96, /* mock data */ },
  { id: 2, type: 'daily', spo2: 94, /* mock data */ },
]

// SHOULD BE:
const [measurements, setMeasurements] = useState([])
useEffect(() => {
  const fetchHistory = async () => {
    const daily = await apiClient.getDailyMeasurements()
    const exercise = await apiClient.getExerciseMeasurements()
    setMeasurements([...daily, ...exercise])
  }
  fetchHistory()
}, [])
```

**3. `web/src/pages/add-daily.tsx`**
```typescript
// CURRENT:
const handleSave = async () => {
  // TODO: Actually save to API
  console.log('Saving measurement...')
}

// SHOULD BE:
const handleSave = async () => {
  try {
    await apiClient.createDailyMeasurement({
      spo2: spo2Value,
      heart_rate: heartRateValue,
      notes: notes,
      measured_at: Date.now(),
    })
    router.push('/dashboard')
  } catch (error) {
    setError('Tallennus epäonnistui')
  }
}
```

**4. `web/src/pages/add-exercise.tsx`** - Same pattern
**5. `web/src/pages/statistics.tsx`** - Fetch stats from API

---

### Step 2: Connect Android App to Backend API

**Current Android Setup:**
- ✅ Room database (local storage)
- ❌ NO API integration
- ❌ NO HTTP client (Retrofit/Ktor)
- ❌ NO network layer

**What Needs to be Added:**

**1. Add Dependencies (`android/app/build.gradle.kts`)**
```kotlin
dependencies {
    // HTTP Client
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Coroutines for async
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
```

**2. Create API Service (`data/remote/ApiService.kt`)**
```kotlin
interface ApiService {
    @GET("/api/daily")
    suspend fun getDailyMeasurements(
        @Header("Authorization") token: String
    ): Response<List<DailyMeasurement>>
    
    @POST("/api/daily")
    suspend fun createDailyMeasurement(
        @Header("Authorization") token: String,
        @Body measurement: DailyMeasurement
    ): Response<Unit>
    
    @GET("/api/exercise")
    suspend fun getExerciseMeasurements(
        @Header("Authorization") token: String
    ): Response<List<ExerciseMeasurement>>
    
    @POST("/api/exercise")
    suspend fun createExerciseMeasurement(
        @Header("Authorization") token: String,
        @Body measurement: ExerciseMeasurement
    ): Response<Unit>
}
```

**3. Update Repository (`data/repository/DailyMeasurementRepository.kt`)**
```kotlin
class DailyMeasurementRepository @Inject constructor(
    private val dao: DailyMeasurementDao,
    private val apiService: ApiService,  // NEW
    private val auth: FirebaseAuth       // NEW
) {
    suspend fun insertMeasurement(measurement: DailyMeasurement): Long {
        // Save locally first
        val id = dao.insert(measurement)
        
        // Sync to cloud
        try {
            val token = auth.currentUser?.getIdToken(false)?.await()
            if (token != null) {
                apiService.createDailyMeasurement(
                    "Bearer ${token.token}",
                    measurement
                )
            }
        } catch (e: Exception) {
            // Failed to sync, but data is saved locally
            Log.e("Repository", "Failed to sync: ${e.message}")
        }
        
        return id
    }
    
    suspend fun syncFromCloud() {
        try {
            val token = auth.currentUser?.getIdToken(false)?.await()
            if (token != null) {
                val response = apiService.getDailyMeasurements("Bearer ${token.token}")
                if (response.isSuccessful) {
                    response.body()?.let { measurements ->
                        // Update local database with cloud data
                        measurements.forEach { dao.insert(it) }
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("Repository", "Failed to sync from cloud: ${e.message}")
        }
    }
}
```

**4. Add Base URL Configuration**
```kotlin
// In build.gradle.kts:
buildConfigField("String", "API_BASE_URL", "\"https://api.hapetus.info\"")
```

---

## 📋 Integration Checklist

### Website → Backend API
- [ ] Update `dashboard.tsx` to fetch real measurements
- [ ] Update `history.tsx` to fetch real data
- [ ] Update `add-daily.tsx` to POST to API
- [ ] Update `add-exercise.tsx` to POST to API
- [ ] Update `statistics.tsx` to fetch real stats
- [ ] Remove all mock data
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test authentication flow
- [ ] Test create/read operations

**Estimated Time**: 2-3 hours

### Android → Backend API
- [ ] Add Retrofit dependencies
- [ ] Create ApiService interface
- [ ] Create Retrofit client with auth interceptor
- [ ] Update DailyMeasurementRepository
- [ ] Update ExerciseMeasurementRepository
- [ ] Add background sync worker (optional)
- [ ] Add offline-first pattern (save local, sync when online)
- [ ] Test authentication with Firebase token
- [ ] Test create/read operations
- [ ] Test offline mode

**Estimated Time**: 4-6 hours

---

## 🎯 Recommended Integration Order

### Option A: Website First (EASIER)
1. **Connect website to API** (2-3 hours)
   - Users can add measurements via website
   - Data goes to backend database
   - Can verify API works correctly
2. **Then connect Android** (4-6 hours)
   - Android syncs with backend
   - Both website and Android see same data

### Option B: Android First
1. **Connect Android to API** (4-6 hours)
   - More complex (offline-first pattern)
   - Users can add via phone
2. **Then connect website** (2-3 hours)
   - Website displays Android data

**Recommendation**: **Option A** - Website first is easier to implement and test.

---

## 🔍 How to Verify Integration Works

### Test Scenario:
1. **Website**: Add a daily measurement (SpO2: 95, Heart Rate: 70)
2. **Backend**: Check that data is in D1 database
   ```bash
   cd backend
   wrangler d1 execute hapetus-db --command="SELECT * FROM daily_measurements"
   ```
3. **Website**: Refresh dashboard, should show the measurement
4. **Android**: Open app, should sync and show same measurement
5. **Android**: Add new measurement (SpO2: 97, Heart Rate: 72)
6. **Website**: Refresh, should show both measurements

---

## 💡 Quick Win: Connect Website First

If you want to see progress quickly, I can:

1. **Update website pages** to use API instead of mock data (30 minutes)
2. **Deploy to Cloudflare Pages** (5 minutes)
3. **Test adding measurements** via website
4. **Verify data in backend** database

Then you'll have a working web app, and can tackle Android integration later.

**Would you like me to do this now?** Just say "yes, connect website to API" and I'll update all the pages!

---

## 📊 Final Architecture (After Integration)

```
┌─────────────────┐
│  Android App    │
│  (Phone/Tablet) │
└────────┬────────┘
         │
         │ HTTPS + Firebase Token
         │
         ▼
┌─────────────────────────┐
│   Backend API           │
│   api.hapetus.info      │
│   ┌─────────────────┐   │
│   │ Cloudflare D1   │   │
│   │ Database        │   │
│   │ (SQLite Cloud)  │   │
│   └─────────────────┘   │
└────────┬────────────────┘
         │
         │ HTTPS + Firebase Token
         │
         ▼
┌─────────────────┐
│    Website      │
│  hapetus.info   │
└─────────────────┘

✅ All devices see same data
✅ Real-time sync
✅ Offline support (Android)
✅ Multi-device access
```

---

## 🆘 Current Status Summary

| Component | Status | Data Source | Action Needed |
|-----------|--------|-------------|---------------|
| **Backend API** | ✅ Live | Cloudflare D1 (empty) | None - ready to receive data |
| **Website** | ⚠️ Live | Mock data | Connect to API (2-3 hours) |
| **Android App** | ⚠️ Working | Room (local only) | Connect to API (4-6 hours) |
| **Data Sync** | ❌ Not working | N/A | Implement integration |

**Bottom Line**: Everything is built and works independently, but they're not talking to each other yet. The "glue" (API calls) needs to be added.

---

## 🚀 Next Step: Your Choice

**Want me to:**
1. **Connect website to API now?** (I can do this in ~30 minutes)
2. **Guide you through Android integration?** (Provide detailed code)
3. **Both?** (Website first, then Android)

Just let me know what you prefer! 🎯
