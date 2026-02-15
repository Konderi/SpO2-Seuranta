# Manual Entry Feature

## Overview
Added manual date/time entry feature allowing users to enter historical measurements that were taken on paper or with other devices.

## Date: February 15, 2026

## Implementation Details

### 1. Settings Toggle
**Location**: Settings screen in both Android app and website

- **Android**: Under "Näyttö" section after "Suuri fontti"
- **Website**: Under "Näyttö ja syöttö" section

**Label**: "Manuaalinen syöttö"  
**Description**: "Valitse päivämäärä ja aika manuaalisesti"

### 2. Database Changes

**Backend Migration**: `0005_add_manual_entry_enabled.sql`
```sql
ALTER TABLE user_settings ADD COLUMN manual_entry_enabled INTEGER DEFAULT 0;
```

**Applied to**: Production database (hapetus-db)

### 3. Code Changes

#### Android App
1. **UserSettings.kt**: Added `manualEntryEnabled: Boolean = false`
2. **SettingsScreen.kt**: Added toggle UI
3. **SettingsViewModel.kt**: Added `updateManualEntryEnabled()` function
4. **SettingsRepository.kt**: 
   - Added `MANUAL_ENTRY_ENABLED` preference key
   - Added `updateManualEntryEnabled()` function
   - Updated `syncFromCloud()` and `syncToCloud()` to include the field
5. **UserSettingsDto.kt**: Added `manual_entry_enabled` field to both DTO and request

#### Backend API
1. **index.ts**: Added support for `manual_entry_enabled` in PUT `/api/user/settings`
2. **Migration**: Created and applied database migration

#### Website
1. **api.ts**: Added `manual_entry_enabled: boolean` to `UserSettings` interface
2. **settings.tsx**: 
   - Added to form state
   - Added toggle UI
   - Included in save payload

### 4. Synchronization
The manual entry setting syncs automatically across all platforms:
- Android ↔ Backend API ↔ Website
- Changes on any platform immediately sync to the cloud
- Other devices receive the update on next app start or settings page load

### 5. Future Enhancement (Not Yet Implemented)
The next step is to use this setting to modify the Daily Measurement Screen:

When `manualEntryEnabled = true`:
- Show date picker to select measurement date
- Show time picker to select measurement time
- Allow users to choose measurement type (SpO2/HR or BP)
- Submit with custom timestamp instead of current time

When `manualEntryEnabled = false` (default):
- Use current date/time automatically
- Normal measurement flow

## Files Modified

### Android
- `domain/model/UserSettings.kt`
- `presentation/settings/SettingsScreen.kt`
- `presentation/settings/SettingsViewModel.kt`
- `data/repository/SettingsRepository.kt`
- `data/remote/dto/UserSettingsDto.kt`

### Backend
- `src/index.ts`
- `migrations/0005_add_manual_entry_enabled.sql`

### Website
- `src/lib/api.ts`
- `src/pages/settings.tsx`
- `src/pages/add-daily.tsx` ✅ NEW
- `src/pages/add-bloodpressure.tsx` ✅ NEW

## Website Implementation Details

### Add Daily Measurement Page
**File**: `web/src/pages/add-daily.tsx`

**Features**:
1. Loads user settings on page load to check `manual_entry_enabled`
2. Shows info banner at top of form:
   - **Manual mode**: Blue banner explaining manual entry is active
   - **Automatic mode**: Gray banner with link to settings
3. Date/time inputs:
   - **Disabled** in automatic mode (uses current date/time)
   - **Enabled** in manual mode (user can select any past date/time)
   - Max date set to today (prevents future dates)
   - Auto-updates to current time when switching to automatic mode
4. Visual labels show "(automaattinen)" when inputs are disabled

### Add Blood Pressure Page
**File**: `web/src/pages/add-bloodpressure.tsx`

Same implementation as daily measurement page, with additional BP classification features preserved.

## User Experience Flow

### Automatic Mode (Default)
1. User opens measurement page
2. Gray info banner: "Automaattinen ajankohta" with settings link
3. Date and time fields show current date/time and are disabled (grayed out)
4. User enters measurement values and saves
5. Measurement is saved with current timestamp

### Manual Mode (After Enabling in Settings)
1. User enables "Manuaalinen syöttö" in settings
2. User opens measurement page
3. Blue info banner: "Manuaalinen syöttö käytössä"
4. Date and time fields are fully editable
5. User can select any past date and time
6. Date picker prevents selection of future dates
7. User enters measurement values and saves
8. Measurement is saved with selected timestamp

## Code Examples

### Loading Settings State
```typescript
const [manualEntryEnabled, setManualEntryEnabled] = useState(false)
const [loadingSettings, setLoadingSettings] = useState(true)

useEffect(() => {
  const loadSettings = async () => {
    try {
      const settings = await apiClient.getUserSettings()
      setManualEntryEnabled(settings.manual_entry_enabled || false)
    } catch (error) {
      console.error('Failed to load settings:', error)
      setManualEntryEnabled(false)
    } finally {
      setLoadingSettings(false)
    }
  }

  if (user) {
    loadSettings()
  }
}, [user])
```

### Auto-Update Date/Time in Automatic Mode
```typescript
useEffect(() => {
  if (!manualEntryEnabled && !loadingSettings) {
    const now = new Date()
    setFormData(prev => ({
      ...prev,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
    }))
  }
}, [manualEntryEnabled, loadingSettings])
```

### Info Banner Component
```tsx
{!loadingSettings && (
  <div className={`border-l-4 p-4 ${manualEntryEnabled ? 'bg-blue-50 border-primary' : 'bg-gray-50 border-gray-400'}`}>
    <div className="flex items-start gap-3">
      <Info className={`w-6 h-6 flex-shrink-0 mt-0.5 ${manualEntryEnabled ? 'text-primary' : 'text-gray-600'}`} />
      <div>
        {manualEntryEnabled ? (
          <>
            <p className="font-semibold text-text-primary mb-1">Manuaalinen syöttö käytössä</p>
            <p className="text-sm text-text-secondary">
              Voit valita mittauksen päivämäärän ja ajan vapaasti.
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-text-primary mb-1">Automaattinen ajankohta</p>
            <p className="text-sm text-text-secondary">
              Mittaus tallennetaan nykyisellä ajankohdalla. 
              <Link href="/settings" className="text-primary hover:underline">Ota käyttöön manuaalinen syöttö asetuksista</Link>.
            </p>
          </>
        )}
      </div>
    </div>
  </div>
)}
```

### Date/Time Inputs with Conditional Disable
```tsx
<input
  type="date"
  value={formData.date}
  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
  className="input w-full"
  disabled={!manualEntryEnabled}
  max={new Date().toISOString().split('T')[0]}
  required
/>

<input
  type="time"
  value={formData.time}
  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
  className="input w-full"
  disabled={!manualEntryEnabled}
  required
/>
```

## Deployment Status
- ✅ Backend deployed (Version: 5098d623)
- ✅ Database migration applied
- ✅ Android app built and installed (SM-A546B)
- ✅ Website deployed (Cloudflare Pages auto-deploy triggered)

## Implementation Status

### Phase 1: Settings Toggle ✅ COMPLETE
- **Android**: Toggle added to settings screen
- **Website**: Toggle added to settings page
- **Backend**: Database migration applied, API endpoints updated
- **Status**: Fully functional, syncs across all platforms

### Phase 2: Website Date/Time Pickers ✅ COMPLETE
- **add-daily.tsx**: Date/time pickers with manual entry mode
- **add-bloodpressure.tsx**: Date/time pickers with manual entry mode
- **Features Implemented**:
  - Info banner showing current mode (manual vs automatic)
  - Disabled date/time inputs in automatic mode
  - Auto-refresh date/time when manual mode is disabled
  - Max date validation (no future dates)
  - Link to settings page to enable manual entry
  - "(automaattinen)" label on disabled inputs
- **Status**: Deployed to production

### Phase 3: Android Date/Time Pickers ✅ COMPLETE
- **DailyMeasurementScreen.kt**: Date/time picker implementation complete
- **BloodPressureScreen.kt**: Date/time picker implementation complete
- **DailyMeasurementViewModel.kt**: Updated to accept custom timestamp parameter
- **Features Implemented**:
  - DatePickerDialog for date selection with max date = today
  - TimePickerDialog for time selection (24-hour format)
  - Info banner showing current mode (blue for manual, gray for automatic)
  - Date/time pickers shown as buttons when manual mode enabled
  - Disabled text fields showing current date/time when automatic mode
  - Auto-refresh date/time when manual mode is disabled
  - Measurement saved with selected timestamp in manual mode
  - Visual feedback with "(automaattinen)" labels
- **Status**: Built and installed on SM-A546B (Android 15)

## Next Steps
1. ~~Deploy website with manual entry toggle~~ ✅ COMPLETE
2. ~~Implement date/time picker UI in website measurement pages~~ ✅ COMPLETE
3. ~~Implement date/time picker UI in Android Daily Measurement screen~~ ✅ COMPLETE
4. ~~Implement date/time picker UI in Android Blood Pressure screen~~ ✅ COMPLETE
5. ~~Update Android measurement submission logic to respect manual entry mode~~ ✅ COMPLETE
6. ~~Add visual indicators in Android showing when manual mode is active~~ ✅ COMPLETE
7. Test end-to-end flow on all platforms
8. Gather user feedback

## Testing Checklist
### Settings Sync
- [x] Enable manual entry in settings (Android)
- [x] Verify setting syncs to website
- [x] Disable in website, verify syncs back to Android

### Website Testing
- [x] Website: Verify date/time pickers disabled in automatic mode
- [x] Website: Verify date/time pickers enabled in manual mode
- [x] Website: Verify future dates are blocked
- [x] Website: Verify auto-update of date/time when switching to automatic

### Android Testing
- [x] Android: Date/time picker dialogs implemented
- [ ] Android: Test DatePickerDialog opens and selects date correctly
- [ ] Android: Test TimePickerDialog opens and selects time correctly
- [ ] Android: Verify future dates are blocked in DatePickerDialog
- [ ] Android: Verify measurement saves with selected timestamp
- [ ] Android: Verify info banner shows correct mode
- [ ] Android: Test switching from manual to automatic mode resets date/time

### End-to-End Testing
- [ ] Enter manual measurement on Android with past date
- [ ] Verify measurement appears in history with correct timestamp
- [ ] Verify measurement syncs to website with correct timestamp
- [ ] Enter manual measurement on website with past date
- [ ] Verify measurement syncs to Android with correct timestamp
- [ ] Android: Test manual entry flow
- [ ] Test with different users
- [ ] Verify setting persists after app restart
- [ ] Test offline changes sync when back online
- [ ] Verify measurements saved with correct timestamps in manual mode
