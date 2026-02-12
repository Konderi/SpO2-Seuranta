# Age and Gender-Based Blood Pressure Guidelines Feature

## Overview

This feature adds personalized blood pressure (BP) assessment based on user demographics (age and gender). The system provides age-appropriate BP ranges, personalized recommendations, and color-coded status indicators that adapt to the user's profile.

## Medical Guidelines

The implementation is based on international medical guidelines:
- **American Heart Association (AHA)** recommendations
- **European Society of Cardiology (ESC)** guidelines
- **WHO Blood Pressure Standards**

### Age Groups

Blood pressure targets vary by age group:

#### Young Adults (18-39 years)
- **Optimal**: <120/80 mmHg
- **Normal**: 120-129/80-84 mmHg
- **High-Normal**: 130-139/85-89 mmHg
- **Hypertension Grade 1**: 140-159/90-99 mmHg
- **Hypertension Grade 2**: ≥160/100 mmHg

#### Middle Age (40-59 years)
- **Optimal**: <120/80 mmHg
- **Normal**: 120-129/80-84 mmHg
- **High-Normal**: 130-139/85-89 mmHg
- **Hypertension Grade 1**: 140-159/90-99 mmHg
- **Target**: <140/90 mmHg

#### Older Adults (60-79 years)
- **Optimal**: <130/85 mmHg
- **Normal**: 130-139/85-89 mmHg
- **High-Normal**: 140-149/90-94 mmHg
- **Target**: <150/90 mmHg
- Note: More relaxed targets to avoid hypotension risks

#### Elderly (80+ years)
- **Optimal**: <140/90 mmHg
- **Normal**: 140-149/90-94 mmHg
- **High-Normal**: 150-159/95-99 mmHg
- **Target**: <150/90 mmHg
- Note: Emphasis on avoiding too low BP (fall risks)

### Gender Considerations

- **Women**: 
  - Generally lower BP before menopause
  - BP increases after menopause (45+)
  - Pregnancy considerations (not implemented yet)
  
- **Men**:
  - Higher cardiovascular risk at younger ages
  - Generally higher BP baseline

## Database Schema

### Migration 0003: User Demographics

```sql
-- Add gender column (male/female/other)
ALTER TABLE user_settings 
ADD COLUMN gender TEXT CHECK(gender IS NULL OR gender IN ('male', 'female', 'other'));

-- Add birth_year column (for age calculation)
ALTER TABLE user_settings 
ADD COLUMN birth_year INTEGER CHECK(birth_year IS NULL OR (birth_year >= 1900 AND birth_year <= 2026));

-- Add date_of_birth as alternative (more precise)
ALTER TABLE user_settings 
ADD COLUMN date_of_birth TEXT;
```

**Design Decision**: Store birth year/date instead of age because:
1. Age changes every year, birth date doesn't
2. Calculate age dynamically based on current date
3. More accurate for medical thresholds
4. No need for periodic updates

## Implementation Details

### Backend (TypeScript)

**File**: `backend/src/utils/bpGuidelines.ts`

Key functions:
```typescript
getBPGuidelines(age: number, gender: string): BPGuidelines
classifyBP(systolic, diastolic, age, gender): BPClassification
calculateAge(birthYear: number): number
getBPRecommendations(age, gender, currentSystolic?, currentDiastolic?): string[]
```

**Features**:
- Age-stratified BP ranges
- Gender-specific adjustments
- Color-coded status (green/blue/orange/red)
- Personalized health messages
- Lifestyle recommendations

### Android (Kotlin)

**Files**:
1. `utils/BPGuidelinesUtil.kt` - Medical guidelines logic
2. `domain/model/UserSettings.kt` - User demographics model
3. `data/repository/SettingsRepository.kt` - Settings persistence
4. `presentation/settings/SettingsScreen.kt` - Demographics UI
5. `presentation/bloodpressure/BloodPressureScreen.kt` - BP monitoring with personalization

**Key Components**:

```kotlin
// Calculate age
fun getAge(): Int? = birthYear?.let { BPGuidelinesUtil.calculateAge(it) }

// Get personalized classification
val classification = BPGuidelinesUtil.classifyBP(
    systolic, diastolic, userAge, userGender
)

// Display age-appropriate message
Text(classification.message)  // "✓ Verenpaineesi on optimaalinen ikäryhmällesi (65 v)"
```

## User Interface

### Settings Screen

New "Henkilötiedot" (Personal Information) card with:

1. **Gender Selection**
   - Options: Mies (Male), Nainen (Female), Muu (Other)
   - Radio button dialog
   - Explanation: "Sukupuoli auttaa antamaan tarkempia suosituksia verenpaineelle"

2. **Birth Year Input**
   - 4-digit year field (1900-2026)
   - Displays: "1960 (Ikä: 66 v)"
   - Explanation: "Ikä auttaa antamaan ikäkohtaisia suosituksia verenpaineelle"

### Blood Pressure Screen

Enhanced with personalized feedback:

#### Real-time Status Indicator
```
[Input: 135/85 for 65-year-old]
🟢 "✓ Verenpaineesi on optimaalinen ikäryhmällesi (65 v)"
```

#### Measurement Cards
Color-coded badges adapt to user age:
- **Optimaalinen** (Optimal) - Green
- **Normaali** (Normal) - Light green
- **Tyydyttävä** (High-normal) - Orange
- **Korkea** (Grade 1) - Dark orange
- **Hyvin korkea** (Grade 2) - Red
- **Matala** (Hypotension) - Blue

## Color Coding System

```kotlin
enum class BPStatus {
    GOOD,      // Green shades - Optimal/Normal
    WARNING,   // Orange/Blue - High-normal or Low
    DANGER     // Red - Hypertension Grade 2+
}
```

**Color Values**:
- `#2E7D32` - Optimal (Dark Green)
- `#558B2F` - Normal (Light Green)  
- `#F57C00` - High-Normal (Orange)
- `#E65100` - Grade 1 (Dark Orange)
- `#C62828` - Grade 2+ (Red)
- `#0288D1` - Hypotension (Blue)

## Personalized Recommendations

System provides age and status-specific lifestyle advice:

### Young Adults (<40)
- "Rakenna terveet elintavat nyt - ne maksavat itsensä takaisin myöhemmin"
- "Säännöllinen liikunta 150 min/viikko"

### Middle Age (40-59)
- "Seuraa verenpainetta säännöllisesti"
- "Vähennä suolan käyttöä (alle 5g/päivä)"
- "Painonhallinta on tärkeää"

### Older Adults (60+)
- "Mittaa verenpaine samaan aikaan päivästä"
- "Älä nouse nopeasti ylös istuma- tai makuuasennosta"
- "Huomioi lääkityksen vaikutus verenpaineeseen"

### Gender-Specific
- Women 45+: "Vaihdevuodet voivat nostaa verenpainetta - keskustele lääkärin kanssa"

### Status-Based
- **High BP**: "Rajoita alkoholin käyttöä", "Vähennä stressiä", "Lisää kasviksia"
- **Low BP**: "Juo riittävästi nesteitä", "Nosta jalkapäätä", "Vältä pitkää seisomista"

## Data Storage

### Android (DataStore)
```kotlin
PreferencesKeys {
    GENDER = stringPreferencesKey("gender")
    BIRTH_YEAR = intPreferencesKey("birth_year")
    DATE_OF_BIRTH = stringPreferencesKey("date_of_birth")
}
```

Local, encrypted preference storage.

### Backend (Cloudflare D1)
```sql
user_settings {
    gender TEXT CHECK(gender IN ('male', 'female', 'other'))
    birth_year INTEGER CHECK(birth_year BETWEEN 1900 AND 2026)
    date_of_birth TEXT  -- ISO 8601: YYYY-MM-DD
}
```

Cloud-synced with user account.

## Testing Scenarios

### Scenario 1: Young Adult Female
```
Age: 25, Gender: Female
BP: 115/75 → "Optimaalinen" (Green)
BP: 135/85 → "Tyydyttävä" (Orange) - Earlier warning than elderly
```

### Scenario 2: Middle-Age Male  
```
Age: 52, Gender: Male
BP: 125/82 → "Normaali" (Light Green)
BP: 142/92 → "Korkea" (Orange) - Grade 1 warning
```

### Scenario 3: Elderly Person
```
Age: 75, Gender: Female
BP: 138/85 → "Optimaalinen" (Green) - Relaxed target
BP: 148/90 → "Normaali" (Light Green) - Still acceptable
BP: 162/95 → "Korkea" (Orange)
```

### Scenario 4: No Age Set
```
Age: null
BP: 125/80 → Uses default age (50) for classification
Message: "✓ Verenpaineesi on normaalilla alueella"
```

## Privacy & Security

- **Optional**: Users can skip gender/age
- **Local Storage**: DataStore encrypted on device
- **Cloud Sync**: Stored in user_settings table with user_id foreign key
- **No Sharing**: Demographics never shared with third parties
- **Purpose**: Solely for personalized health feedback

## Future Enhancements

### Planned Features
1. **Date of Birth Support**: More precise age calculation
2. **Pregnancy Mode**: Special BP targets for pregnant women
3. **Medical Conditions**: Diabetes, kidney disease adjustments
4. **Medication Tracking**: BP medication reminders
5. **Trends Analysis**: Age-adjusted BP trends over time
6. **Doctor Reports**: Export with age-appropriate context

### Website Integration
- Similar gender/age settings in web app
- Age-appropriate BP charts and statistics
- Downloadable PDF reports with demographic context

## Medical Disclaimer

⚠️ **Important**: These are general medical guidelines. Individual BP targets may vary based on:
- Existing medical conditions (diabetes, kidney disease, etc.)
- Current medications
- Cardiovascular risk factors
- Doctor's recommendations

**Always consult a healthcare provider for personalized medical advice.**

## References

1. American Heart Association: Understanding Blood Pressure Readings
2. European Society of Cardiology: 2018 ESC/ESH Guidelines for Management of Arterial Hypertension
3. WHO: Guideline for the pharmacological treatment of hypertension in adults
4. Finnish Medical Society Duodecim: Current Care Guidelines - Hypertension

## Code Locations

### Backend
- `backend/migrations/0003_add_user_demographics.sql` - Database schema
- `backend/src/utils/bpGuidelines.ts` - Medical guidelines (420 lines)

### Android
- `android/.../utils/BPGuidelinesUtil.kt` - Guidelines logic (320 lines)
- `android/.../domain/model/UserSettings.kt` - Model with demographics
- `android/.../data/repository/SettingsRepository.kt` - Data persistence
- `android/.../presentation/settings/SettingsScreen.kt` - Settings UI
- `android/.../presentation/bloodpressure/BloodPressureScreen.kt` - Personalized BP screen

## Migration Status

- ✅ Backend database migration applied (local)
- ✅ Backend database migration applied (production)
- ✅ Android code implementation complete
- ✅ Android UI updated
- ⏳ Website implementation pending
- ⏳ Testing on device pending

---

**Version**: 1.0  
**Last Updated**: 2026-02-12  
**Authors**: Development Team
