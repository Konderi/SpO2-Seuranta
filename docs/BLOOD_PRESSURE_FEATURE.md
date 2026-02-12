# Blood Pressure Monitoring Feature

**Status**: ✅ Backend Complete | ✅ Android Data Layer Complete | 🚧 UI In Progress  
**Created**: 2026-02-12  
**Last Updated**: 2026-02-12

## Overview

Added comprehensive blood pressure (BP) monitoring to complement SpO2 and heart rate tracking. Users can now optionally record systolic and diastolic blood pressure with both daily and exercise measurements.

## Technical Specifications

### Blood Pressure Ranges
- **Systolic**: 80-200 mmHg (normal: 90-120)
- **Diastolic**: 50-130 mmHg (normal: 60-80)
- **Display Format**: "120/80 mmHg"
- **Validation**: Systolic must be greater than diastolic

### Alert Thresholds
- **High BP (Hypertension)**: Systolic ≥140 OR Diastolic ≥90
- **Normal BP**: Systolic 90-120 AND Diastolic 60-80
- **Low BP (Hypotension)**: Systolic <90 OR Diastolic <60

## Implementation Status

### ✅ Phase 1: Backend (COMPLETE)

#### Database Migration
- **File**: `backend/migrations/0002_add_blood_pressure.sql`
- **Changes**:
  - Added `systolic` and `diastolic` columns to `daily_measurements`
  - Added `systolic_before/after` and `diastolic_before/after` to `exercise_measurements`
  - Added BP threshold settings to `user_settings` table
  - All BP fields are nullable (optional)

#### API Updates
**Daily Measurements** (`backend/src/routes/daily.ts`):
- POST `/api/daily` - Accepts optional `systolic` and `diastolic` fields
- PUT `/api/daily/:id` - Updates BP values
- Validates BP ranges and systolic > diastolic relationship

**Exercise Measurements** (`backend/src/routes/exercise.ts`):
- POST `/api/exercise` - Accepts BP before/after fields
- Validates all BP values independently

**Statistics** (`backend/src/routes/stats.ts`):
- `/api/stats/week` - Includes `avg_systolic`, `avg_diastolic`, min/max
- `/api/stats/range` - BP statistics for custom date ranges
- `/api/stats/daily` - Daily BP averages for charting

#### Deployment
- ✅ Migration applied to local D1 database
- ✅ Migration applied to production D1 database
- ✅ Backend API deployed to Cloudflare Workers
- ✅ 10 SQL commands executed successfully

### ✅ Phase 2: Android Data Layer (COMPLETE)

#### Database
**File**: `android/app/src/main/java/com/konderi/spo2seuranta/data/local/SpO2Database.kt`
- Updated version from 2 to 3
- Migration safely preserves existing data

**Migration**: `MIGRATION_2_3` in `DatabaseModule.kt`
```kotlin
ALTER TABLE daily_measurements ADD COLUMN systolic INTEGER
ALTER TABLE daily_measurements ADD COLUMN diastolic INTEGER
ALTER TABLE exercise_measurements ADD COLUMN systolicBefore INTEGER
ALTER TABLE exercise_measurements ADD COLUMN diastolicBefore INTEGER
ALTER TABLE exercise_measurements ADD COLUMN systolicAfter INTEGER
ALTER TABLE exercise_measurements ADD COLUMN diastolicAfter INTEGER
```

#### Domain Models

**DailyMeasurement.kt**:
```kotlin
val systolic: Int? = null,      // 80-200 mmHg (optional)
val diastolic: Int? = null,     // 50-130 mmHg (optional)

// Helper methods
fun isHighBloodPressure(): Boolean
fun isLowBloodPressure(): Boolean
```

**ExerciseMeasurement.kt**:
```kotlin
val systolicBefore: Int? = null,
val diastolicBefore: Int? = null,
val systolicAfter: Int? = null,
val diastolicAfter: Int? = null,

// Helper methods
fun getSystolicChange(): Int?
fun getDiastolicChange(): Int?
```

#### DTOs
- `DailyMeasurementDto` - Added BP fields with proper serialization
- `ExerciseMeasurementDto` - Added BP before/after fields
- Both include proper null handling for optional fields

### 🚧 Phase 3: Android UI (IN PROGRESS)

#### Screens to Update

**1. DailyMeasurementScreen.kt** (Pending)
```kotlin
// Add after heart rate input:
OutlinedTextField(
    label = "Systolinen (yläpaine)",
    placeholder = "esim. 120",
    suffix = "mmHg",
    // Optional field
)

OutlinedTextField(
    label = "Diastolinen (alapaine)",
    placeholder = "esim. 80",
    suffix = "mmHg",
    // Optional field
)
```

**2. ExerciseMeasurementScreen.kt** (Pending)
- Add BP fields in "Ennen" (Before) section
- Add BP fields in "Jälkeen" (After) section
- Side-by-side layout for systolic/diastolic

**3. ReportsScreen.kt** (Pending)
- Add BP statistics card showing average and range
- Display format: "120/80 mmHg"
- Show warnings for high/low BP

**4. SettingsScreen.kt** (Pending)
- Add BP threshold settings
- Default high: 140/90
- Default low: 90/60

#### ViewModels to Update
- `DailyMeasurementViewModel` - Add BP state and validation
- `ExerciseMeasurementViewModel` - Add BP before/after state
- `ReportsViewModel` - Include BP in statistics calculations

### 📝 Phase 4: Website (PENDING)

#### TypeScript Interfaces
**web/src/lib/api.ts**:
```typescript
export interface DailyMeasurement {
  // ... existing fields
  systolic?: number;
  diastolic?: number;
}

export interface Statistics {
  // ... existing fields
  avg_systolic?: number;
  avg_diastolic?: number;
  min_systolic?: number;
  max_systolic?: number;
}
```

#### Forms to Update
1. **add-daily.tsx** - Add BP input fields
2. **add-exercise.tsx** - Add BP before/after inputs
3. **dashboard.tsx** - Display latest BP value
4. **statistics.tsx** - Add BP trend chart
5. **history.tsx** - Add BP column to table

#### Demo Data
**web/src/lib/demoData.ts**:
```typescript
const generateBloodPressure = () => ({
  systolic: Math.round(110 + Math.random() * 20),
  diastolic: Math.round(70 + Math.random() * 15)
});
```

## Data Flow

### Adding a Measurement with BP

1. **User Input** (Android/Web)
   - Enters SpO2: 97%
   - Enters Heart Rate: 72 BPM
   - (Optional) Enters BP: 120/80 mmHg

2. **Validation**
   - SpO2: 50-100 ✓
   - Heart Rate: 30-250 ✓
   - Systolic: 80-200 ✓
   - Diastolic: 50-130 ✓
   - Systolic > Diastolic ✓

3. **Local Storage** (Android Room)
   ```sql
   INSERT INTO daily_measurements 
   (spo2, heart_rate, systolic, diastolic, ...) 
   VALUES (97, 72, 120, 80, ...)
   ```

4. **Cloud Sync** (API)
   ```json
   POST /api/daily
   {
     "spo2": 97,
     "heart_rate": 72,
     "systolic": 120,
     "diastolic": 80,
     "measured_at": 1707750000
   }
   ```

5. **Statistics Update**
   - Weekly averages include BP
   - Daily aggregates include BP
   - Trend charts show BP over time

### Backward Compatibility

**Existing measurements without BP**:
- `systolic = NULL`
- `diastolic = NULL`
- No validation errors
- Statistics skip NULL values in averages

**New measurements without BP**:
- User can leave BP fields empty
- API accepts NULL values
- Database stores NULL
- UI shows "-" or hides BP sections

## Testing Checklist

### Backend
- ✅ Migration applied successfully
- ✅ API accepts BP values
- ✅ API validates BP ranges
- ✅ API validates systolic > diastolic
- ✅ Statistics include BP averages
- ✅ Deployed to production

### Android
- ✅ Database migration successful
- ✅ Models compile with BP fields
- ✅ DTOs serialize/deserialize BP
- ⏳ UI allows BP input
- ⏳ Validation works on UI
- ⏳ BP displays in lists/reports
- ⏳ Cloud sync includes BP
- ⏳ App builds and installs

### Website
- ⏳ Forms accept BP input
- ⏳ Dashboard shows BP
- ⏳ Statistics include BP
- ⏳ Charts display BP trends
- ⏳ History table shows BP
- ⏳ Demo mode includes BP

## User Guide

### How to Record Blood Pressure

**Daily Measurement**:
1. Open "Päivittäinen" tab
2. Enter SpO2 and heart rate (required)
3. (Optional) Enter blood pressure:
   - Yläpaine (Systolic): e.g., 120
   - Alapaine (Diastolic): e.g., 80
4. Tap "Tallenna"

**Exercise Measurement**:
1. Open "Liikunta" tab
2. Enter before-exercise values
3. (Optional) Enter BP before exercise
4. Enter after-exercise values
5. (Optional) Enter BP after exercise
6. Tap "Tallenna"

### Understanding Your BP

**Normal**: 90-120 / 60-80 mmHg  
✅ Your blood pressure is in a healthy range

**High (Hypertension)**: ≥140 / ≥90 mmHg  
⚠️ Consider consulting a healthcare professional

**Low (Hypotension)**: <90 / <60 mmHg  
⚠️ May indicate dehydration or other issues

## Future Enhancements

1. **BP Alerts**: Notify when BP exceeds thresholds
2. **BP Medication Tracking**: Log BP medication times
3. **BP Goals**: Set and track personal BP targets
4. **BP Correlation**: Analyze BP vs exercise/time of day
5. **Export BP Reports**: PDF export for doctor visits
6. **BP Reminders**: Scheduled BP measurement reminders

## Resources

- **Medical Reference**: [American Heart Association - Understanding Blood Pressure Readings](https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings)
- **WHO Guidelines**: Normal adult BP: <120/<80 mmHg
- **Database**: Cloudflare D1 (SQLite)
- **Backend**: Hono.js on Cloudflare Workers
- **Android**: Room Database, Jetpack Compose
- **Web**: Next.js, TypeScript, Recharts

## Migration Safety

✅ **Existing Data Protected**:
- Migration uses `ALTER TABLE ADD COLUMN` (safe)
- All BP columns are nullable
- No data loss or corruption
- Backward compatible with old app versions
- Old measurements continue to work

✅ **Rollback Strategy**:
- Can deploy old backend version (ignores new columns)
- Old Android app continues to work (ignores new columns)
- No breaking changes to existing functionality

---

**Next Steps**:
1. ✅ Backend deployment - COMPLETE
2. ✅ Android data layer - COMPLETE
3. 🚧 Android UI updates - IN PROGRESS
4. ⏳ Website updates - PENDING
5. ⏳ Testing and validation - PENDING
6. ⏳ Documentation and user guide - PENDING
