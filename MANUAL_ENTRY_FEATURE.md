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

## Deployment Status
- ✅ Backend deployed (Version: 5098d623)
- ✅ Database migration applied
- ✅ Android app built and installed (SM-A546B)
- ⏳ Website needs deployment (changes ready)

## Next Steps
1. Deploy website with manual entry toggle
2. Implement date/time picker UI in Daily Measurement screen (Android)
3. Implement date/time picker UI in dashboard (Website)
4. Update measurement submission logic to use custom timestamps when enabled
5. Add validation to prevent future dates
6. Add UI indicators showing when manual mode is active

## Testing Checklist
- [ ] Enable manual entry in settings (Android)
- [ ] Verify setting syncs to website
- [ ] Disable in website, verify syncs back to Android
- [ ] Test with different users
- [ ] Verify setting persists after app restart
- [ ] Test offline changes sync when back online
