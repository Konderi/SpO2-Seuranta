# Bidirectional Sync Test Plan

## Current Status
✅ **Android → Backend**: Implemented (uploads unsynced measurements, marks as synced)
✅ **Backend → Android**: Implemented (downloads from server, merges with local)
✅ **Website → Backend**: Implemented (directly calls API, no local storage)
✅ **Backend → Website**: Implemented (fetches from API on page load)
✅ **Settings Sync (Android)**: Implemented (downloads on startup, uploads on change)
✅ **Settings Sync (Website)**: Implemented (loads from API, saves to API)

## Architecture Summary

### Android App (Offline-First)
- **Local Storage**: Room database (SQLite)
- **Sync Strategy**: 
  1. Save locally first (immediate)
  2. Upload to server (background)
  3. Download from server periodically
  4. Merge: Server ID matching, prevent duplicates
- **Sync Triggers**:
  - After adding new measurement
  - Manual sync button
  - App startup (via ViewModel initialization)

### Website (API-Only)
- **Local Storage**: None (always fetches from API)
- **Data Flow**: Direct API calls (GET/POST/DELETE)
- **Page Loads**: Fresh data from server every time

## Test Scenarios

### Test 1: Android → Website Sync
**Objective**: Verify measurements added in Android appear on website

**Steps**:
1. ✅ Open Android app
2. ✅ Add a daily measurement (e.g., SpO2: 95%, HR: 75)
3. ✅ Wait 2 seconds (auto-sync should complete)
4. ✅ Open website (hapetus.info)
5. ✅ Check if the measurement appears in Dashboard/History

**Expected Result**: 
- ✅ Measurement visible on website within seconds
- ✅ All fields match (SpO2, HR, timestamp, notes)
- ✅ Logcat shows: "🎉 Cloud sync complete! Server ID: [uuid]"

**Status**: ✅ WORKING (confirmed in previous session)

---

### Test 2: Website → Android Sync
**Objective**: Verify measurements added on website appear in Android

**Steps**:
1. ⏳ Open website (hapetus.info)
2. ⏳ Add a daily measurement (e.g., SpO2: 97%, HR: 70)
3. ⏳ Wait for save confirmation
4. ⏳ Open Android app (or pull to refresh if already open)
5. ⏳ Check if the measurement appears in Mittaukset (Measurements) list

**Expected Result**:
- ⏳ Measurement should appear in Android list
- ⏳ All fields should match
- ⏳ Logcat should show: "📥 Downloaded X measurements from server"
- ⏳ Logcat should show: "→ Inserting as new measurement"

**Status**: ⏳ NEEDS TESTING

---

### Test 3: Delete Sync (Android → Website)
**Objective**: Verify deletions in Android are reflected on website

**Steps**:
1. ⏳ Find a measurement that exists on both Android and website
2. ⏳ Delete it in Android app
3. ⏳ Refresh website
4. ⏳ Verify measurement is gone from website

**Expected Result**:
- ⏳ Measurement deleted from server
- ⏳ Website shows updated list without deleted item
- ⏳ Logcat shows: "🗑️ Deleted from server: [server_id]"

**Status**: ⏳ NEEDS TESTING

---

### Test 4: Delete Sync (Website → Android)
**Objective**: Verify deletions on website are reflected in Android

**Steps**:
1. ⏳ Find a measurement that exists on both website and Android
2. ⏳ Delete it on website
3. ⏳ Open Android app or use manual sync button
4. ⏳ Verify measurement is gone from Android

**Expected Result**:
- ⏳ Measurement should disappear from Android list
- ⏳ Requires implementing "delete detection" in Android sync

**Status**: ⚠️ **POTENTIAL ISSUE** - Android sync downloads but doesn't check for deletions

---

### Test 5: Settings Sync (Android → Website)
**Objective**: Verify settings changes in Android appear on website

**Steps**:
1. ⏳ Open Android app → Settings
2. ⏳ Change birth year to 1985
3. ⏳ Change gender to "Mies" (Male)
4. ⏳ Save settings
5. ⏳ Open website → Settings
6. ⏳ Check if birth year shows 1985 and gender shows Male

**Expected Result**:
- ⏳ Website settings match Android changes
- ⏳ Logcat shows: "📤 Uploading settings to cloud"
- ⏳ Logcat shows: "✅ Settings uploaded successfully"

**Status**: ⏳ NEEDS TESTING (just implemented)

---

### Test 6: Settings Sync (Website → Android)
**Objective**: Verify settings changes on website appear in Android

**Steps**:
1. ⏳ Open website → Settings
2. ⏳ Change SpO2 low threshold to 88%
3. ⏳ Enable large font
4. ⏳ Save settings
5. ⏳ Force close Android app
6. ⏳ Open Android app
7. ⏳ Go to Settings
8. ⏳ Check if threshold is 88% and large font is enabled

**Expected Result**:
- ⏳ Android settings match website changes on startup
- ⏳ Logcat shows: "🔄 Syncing settings from cloud..."
- ⏳ Logcat shows: "📥 Downloaded settings"
- ⏳ Logcat shows: "✅ Settings synced from cloud"

**Status**: ⏳ NEEDS TESTING (just implemented)

---

### Test 7: Blood Pressure Sync
**Objective**: Verify BP measurements sync correctly both ways

**Steps**:
1. ⏳ Add measurement with BP on Android (e.g., 120/80)
2. ⏳ Check website shows BP values
3. ⏳ Add measurement with BP on website (e.g., 130/85)
4. ⏳ Check Android shows BP values
5. ⏳ Verify BP chart displays on both platforms

**Expected Result**:
- ⏳ BP values appear on both platforms
- ⏳ BP charts display correctly
- ⏳ All BP fields (systolic/diastolic) are preserved

**Status**: ⏳ NEEDS TESTING

---

### Test 8: Concurrent Updates
**Objective**: Test conflict resolution when both platforms are updated

**Steps**:
1. ⏳ Add measurement on Android while offline
2. ⏳ Add different measurement on website
3. ⏳ Bring Android online and trigger sync
4. ⏳ Check both measurements exist on both platforms

**Expected Result**:
- ⏳ No data loss
- ⏳ Both measurements preserved
- ⏳ No duplicate entries

**Status**: ⏳ NEEDS TESTING

---

### Test 9: Offline Mode (Android)
**Objective**: Verify Android works offline and syncs when online

**Steps**:
1. ⏳ Turn off WiFi/Mobile data on Android
2. ⏳ Add multiple measurements
3. ⏳ Verify they're saved locally
4. ⏳ Turn on connectivity
5. ⏳ Trigger sync (manual or automatic)
6. ⏳ Check website shows all measurements

**Expected Result**:
- ⏳ Measurements saved locally while offline
- ⏳ All measurements upload when online
- ⏳ Website receives all measurements
- ⏳ Logcat shows: "📤 Uploading X unsynced measurements"

**Status**: ⏳ NEEDS TESTING

---

## Known Issues

### Issue 1: Delete Sync (Website → Android) ⚠️
**Problem**: Android sync only adds/updates measurements, doesn't detect deletions
**Impact**: If you delete on website, Android keeps showing the deleted measurement
**Solution Needed**: Implement "full sync" approach:
- Option A: Compare full lists and delete locally what's not on server
- Option B: Add deleted_at timestamp and soft deletes
- Option C: Send list of server IDs and delete local items not in list

### Issue 2: Birth Year Conversion Bug 🐛
**Problem**: User enters 1983, but it changes to 1978/1979
**Status**: Logging added, awaiting test results
**Impact**: Settings may not save correctly

## Testing Instructions

### For User Testing:
1. Start with Test 2 (Website → Android Sync)
2. Then Test 5 & 6 (Settings Sync both ways)
3. Then Test 7 (Blood Pressure Sync)
4. Report any issues with:
   - Screenshots of data on both platforms
   - Logcat output (if available)
   - Browser console logs (F12)

### For Developer Testing:
```bash
# Watch Android logs
~/Library/Android/sdk/platform-tools/adb logcat | grep "SYNC_TEST\|SettingsRepository"

# Watch specific sync operations
~/Library/Android/sdk/platform-tools/adb logcat | grep "📤\|📥\|✅\|❌"
```

## Success Criteria

All tests must pass with:
- ✅ Data appears on both platforms within 5 seconds
- ✅ All fields preserved (no data loss)
- ✅ No duplicate entries
- ✅ Deletions propagate correctly
- ✅ Settings sync bidirectionally
- ✅ Offline mode works (Android only)
- ✅ No crashes or errors

## Next Steps

1. ⏳ Run Test 2-9 and document results
2. ⏳ Fix Issue 1 (delete sync)
3. ⏳ Debug Issue 2 (birth year bug)
4. ⏳ Add automatic periodic sync (every 5 minutes?)
5. ⏳ Add sync status indicator in UI
6. ⏳ Add conflict resolution strategy documentation
