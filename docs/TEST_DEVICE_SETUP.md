# Android App - Test Device Setup & First Run

**Date**: February 11, 2026  
**Device Status**: Connected but unauthorized  
**Next Steps**: Authorize USB debugging and run app

---

## Current Status

### ✅ Completed
- Android Studio installed
- Android SDK installed (~/Library/Android/sdk)
- ADB working (platform-tools)
- Test phone connected via USB
- Developer Mode enabled on phone
- USB Debugging enabled on phone

### ⏳ Next Step Required
**Your phone is showing "unauthorized"** - You need to authorize USB debugging:

1. **Look at your phone screen now**
2. You should see a popup: "Allow USB debugging?"
3. **Check the box**: "Always allow from this computer"
4. **Tap "OK" or "Allow"**

If you don't see the popup:
- Disconnect and reconnect the USB cable
- Try a different USB cable
- Make sure "USB for file transfer" mode is selected (not just charging)

---

## Step 1: Authorize USB Debugging

### On Your Phone

When you see this dialog:
```
Allow USB debugging?
The computer's RSA key fingerprint is:
XX:XX:XX:XX...

[ ] Always allow from this computer
[Cancel] [OK]
```

**Actions:**
1. ✅ Check "Always allow from this computer"
2. ✅ Tap "OK"

---

## Step 2: Verify Connection

After authorizing, run this command to verify:

```bash
~/Library/Android/sdk/platform-tools/adb devices
```

**Expected output:**
```
List of devices attached
2324ba793a057ece        device
```

The status should change from `unauthorized` to `device`.

---

## Step 3: Check Device Info

Once authorized, let's get device information:

```bash
# Device model and Android version
~/Library/Android/sdk/platform-tools/adb shell getprop ro.product.model
~/Library/Android/sdk/platform-tools/adb shell getprop ro.build.version.release

# SDK version (API level)
~/Library/Android/sdk/platform-tools/adb shell getprop ro.build.version.sdk
```

This helps verify compatibility (app requires API 26+).

---

## Step 4: Open Project in Android Studio

### Option A: From Terminal

```bash
cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
open -a "Android Studio" .
```

### Option B: From Android Studio

1. Open Android Studio
2. Click "Open"
3. Navigate to: `~/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android`
4. Click "OK"

### First-Time Project Load

Android Studio will:
- Sync Gradle dependencies (2-5 minutes)
- Download required SDK components
- Index project files
- Build configuration

**Be patient** - first sync can take time. Look for:
- Bottom right: Progress bar
- Bottom status: "Gradle sync" or "Indexing"
- Wait for "Gradle sync finished" message

---

## Step 5: Configure Run Configuration

### In Android Studio:

1. **Top toolbar**: Find device dropdown (should show your phone model)
2. **Run configuration**: Should show "app" (green play button icon)
3. **Device**: Should show your connected phone

If device doesn't appear:
- File → Invalidate Caches → Restart
- Tools → Device Manager → Refresh
- Check USB cable connection

---

## Step 6: Build and Run

### Method 1: Using Run Button

1. Click green **"Run"** button (▶️) in toolbar
2. Or: Run → Run 'app'
3. Or: Keyboard: Shift + F10 (Windows/Linux) or Control + R (Mac)

### Method 2: Using Gradle

```bash
cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
./gradlew installDebug
```

### What Happens:

1. **Gradle Build** (2-5 minutes first time)
   - Compiles Kotlin code
   - Processes resources
   - Generates APK file
   
2. **APK Installation**
   - Transfers APK to phone via ADB
   - Installs on device
   
3. **App Launch**
   - Opens Hapetus app
   - Shows authentication screen

---

## Step 7: First Run Testing

### Expected Behavior

**Launch Screen:**
- ✅ Hapetus logo
- ✅ "Aloita" button
- ✅ Material 3 design

**After Clicking "Aloita":**
- ✅ Google Sign-In screen appears
- ✅ Choose Google account
- ✅ App requests permissions (if needed)
- ✅ Redirects to Dashboard

### Test Checklist

#### Authentication
- [ ] Google Sign-In button visible
- [ ] Can tap button (touch target size OK)
- [ ] Google account picker appears
- [ ] Can select account
- [ ] Returns to app after sign-in
- [ ] Shows dashboard after successful auth

#### Dashboard
- [ ] Navigation bar visible (top)
- [ ] Welcome message with username
- [ ] Latest measurements card
- [ ] 7-day statistics card
- [ ] Quick action buttons visible
- [ ] All buttons respond to touch
- [ ] Icons render correctly

#### Add Daily Measurement
- [ ] Navigate to "Lisää mittaus"
- [ ] SpO2 input field (50-100)
- [ ] Heart rate input field
- [ ] Notes field (optional)
- [ ] Date/time auto-filled
- [ ] Can edit date/time
- [ ] "Tallenna" button enabled when valid
- [ ] Saves successfully
- [ ] Returns to dashboard
- [ ] New measurement appears

#### Add Exercise Measurement
- [ ] Navigate to exercise screen
- [ ] Before/After measurement sections
- [ ] Exercise type selector
- [ ] Duration input
- [ ] Intensity selector
- [ ] All validations work
- [ ] Saves successfully

#### Reports Screen
- [ ] Statistics cards show data
- [ ] 7-day averages displayed
- [ ] Charts render (Vico Charts)
- [ ] Can scroll through chart
- [ ] Data updates when new measurement added

#### Settings Screen
- [ ] User info displayed
- [ ] Alert thresholds configurable
- [ ] Large font toggle works
- [ ] Can sign out
- [ ] Returns to auth screen after sign-out

---

## Step 8: Debugging Issues

### App Crashes on Launch

**Check Logcat in Android Studio:**
1. View → Tool Windows → Logcat
2. Select your device
3. Filter: "com.konderi.spo2seuranta"
4. Look for red error lines

**Common Issues:**
- Firebase not configured → See FIREBASE_SETUP.md
- Permissions missing → Check AndroidManifest.xml
- Google Play Services not available → Update on device

### Build Fails

**Check Build Output:**
1. View → Tool Windows → Build
2. Read error messages
3. Common fixes:
   - File → Invalidate Caches → Restart
   - Build → Clean Project
   - Build → Rebuild Project

**Gradle Issues:**
```bash
# Clean build
./gradlew clean

# Build fresh
./gradlew assembleDebug
```

### Device Not Detected

**Troubleshooting:**
```bash
# Restart ADB server
~/Library/Android/sdk/platform-tools/adb kill-server
~/Library/Android/sdk/platform-tools/adb start-server

# Check devices again
~/Library/Android/sdk/platform-tools/adb devices

# If still not showing:
# 1. Unplug and replug USB cable
# 2. Change USB port
# 3. Restart phone
# 4. Disable and re-enable USB debugging
```

### Firebase Authentication Issues

**Symptoms:**
- Google Sign-In button doesn't work
- "Error 12501" or similar
- Can't select account

**Fixes:**
1. Verify google-services.json is present
2. Check SHA-1 fingerprint matches Firebase console
3. Ensure package name is correct: `com.konderi.spo2seuranta`
4. Check device has Google Play Services

**Get SHA-1 for debug:**
```bash
cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android

keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Copy SHA-1 and add to Firebase Console:
- Project Settings → General → Your apps
- Add fingerprint

---

## Step 9: Performance Testing

### Check App Performance

**In Android Studio:**
1. View → Tool Windows → Profiler
2. Select your device and app
3. Monitor:
   - CPU usage
   - Memory usage
   - Network activity

**Expected Performance:**
- CPU: <20% idle, <60% during scrolling
- Memory: 50-150 MB
- Smooth 60fps UI
- Quick database queries (<50ms)

---

## Step 10: Test Offline Functionality

### Test Room Database (Offline)

1. **Add measurement while online**
2. **Enable Airplane Mode** on phone
3. **Add another measurement**
4. **Check if saved** (should work offline)
5. **View reports** (should show local data)
6. **Disable Airplane Mode**
7. **Future**: Data should sync to API

**Current Status:**
- ✅ Local storage works (Room database)
- ⏳ API sync pending (integration guide ready)

---

## Useful ADB Commands

### Install APK
```bash
# Install debug APK
~/Library/Android/sdk/platform-tools/adb install app/build/outputs/apk/debug/app-debug.apk

# Install and replace existing
~/Library/Android/sdk/platform-tools/adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### View Logs
```bash
# Continuous log stream
~/Library/Android/sdk/platform-tools/adb logcat | grep "SpO2"

# Clear logs
~/Library/Android/sdk/platform-tools/adb logcat -c

# Save logs to file
~/Library/Android/sdk/platform-tools/adb logcat -d > logcat.txt
```

### App Management
```bash
# Uninstall app
~/Library/Android/sdk/platform-tools/adb uninstall com.konderi.spo2seuranta

# Clear app data (keeps app installed)
~/Library/Android/sdk/platform-tools/adb shell pm clear com.konderi.spo2seuranta

# Launch app manually
~/Library/Android/sdk/platform-tools/adb shell am start -n com.konderi.spo2seuranta/.MainActivity
```

### Database Inspection
```bash
# Access device shell
~/Library/Android/sdk/platform-tools/adb shell

# Navigate to app's database (on device)
cd /data/data/com.konderi.spo2seuranta/databases/

# Pull database to computer
~/Library/Android/sdk/platform-tools/adb pull /data/data/com.konderi.spo2seuranta/databases/spo2_database.db ~/Desktop/
```

### Screenshots
```bash
# Take screenshot
~/Library/Android/sdk/platform-tools/adb shell screencap -p /sdcard/screenshot.png

# Pull to computer
~/Library/Android/sdk/platform-tools/adb pull /sdcard/screenshot.png ~/Desktop/
```

### Performance
```bash
# Check app memory usage
~/Library/Android/sdk/platform-tools/adb shell dumpsys meminfo com.konderi.spo2seuranta

# Check app CPU usage
~/Library/Android/sdk/platform-tools/adb shell top -n 1 | grep spo2
```

---

## Expected First Run Timeline

1. **USB Authorization**: 30 seconds
2. **Android Studio Load**: 1-2 minutes
3. **Gradle Sync**: 3-5 minutes (first time)
4. **First Build**: 3-5 minutes
5. **APK Install**: 30 seconds
6. **App Launch**: 5 seconds
7. **Google Sign-In**: 30 seconds
8. **Total**: ~10-15 minutes

**Subsequent runs**: 30 seconds (incremental builds)

---

## Next Steps After Successful Run

### Phase 1: Local Testing ✅
- [x] App builds successfully
- [x] Runs on physical device
- [x] Google authentication works
- [x] Can add measurements
- [x] Room database stores data
- [x] UI is responsive

### Phase 2: API Integration ⏳
- [ ] Follow ANDROID_API_INTEGRATION_GUIDE.md
- [ ] Add Retrofit dependencies
- [ ] Create API service layer
- [ ] Implement sync manager
- [ ] Test with backend at api.hapetus.info

### Phase 3: Testing & Polish
- [ ] Add more test measurements
- [ ] Test all features thoroughly
- [ ] Check accessibility
- [ ] Verify large font mode
- [ ] Test alert thresholds
- [ ] Performance optimization

### Phase 4: Production Build
- [ ] Generate signed APK
- [ ] Configure release build
- [ ] Test release build
- [ ] Prepare for distribution

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| "unauthorized" | Accept USB debugging dialog on phone |
| Device not detected | Restart ADB server, check USB cable |
| Gradle sync fails | File → Invalidate Caches → Restart |
| Build errors | ./gradlew clean && ./gradlew build |
| App crashes | Check Logcat for errors |
| Firebase errors | Verify google-services.json and SHA-1 |
| Slow first build | Normal - wait for completion |
| APK install fails | Uninstall old version first |

---

## Success Indicators

You'll know everything is working when:

✅ Device shows as "device" in `adb devices`  
✅ Android Studio detects your phone  
✅ Build completes without errors  
✅ App installs on phone  
✅ App launches and shows auth screen  
✅ Google Sign-In works  
✅ Can add measurements  
✅ Data persists after app restart  
✅ All screens are accessible  
✅ UI is smooth and responsive

---

## Getting Help

**If you encounter issues:**

1. **Check Logcat** (Android Studio → View → Tool Windows → Logcat)
2. **Check Build Output** (View → Tool Windows → Build)
3. **Review Error Messages** (usually very specific)
4. **Check Documentation**:
   - FIREBASE_SETUP.md
   - TESTING_GUIDE.md
   - ANDROID_API_INTEGRATION_GUIDE.md

**Share these if you need help:**
- Full error message from Logcat
- Build output
- Device info (model, Android version)
- Steps that led to the issue

---

## Ready to Start!

**Your immediate next action:**

1. **Look at your phone screen**
2. **Accept the USB debugging dialog**
3. **Run**: `~/Library/Android/sdk/platform-tools/adb devices`
4. **Verify status changes to "device"**
5. **Then open Android Studio and load the project**

Good luck! 🚀
