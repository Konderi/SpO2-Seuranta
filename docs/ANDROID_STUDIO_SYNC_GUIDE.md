# Android Studio Gradle Sync Guide

## Current Status
✅ Gradle wrapper files created successfully
✅ Samsung S9 connected and authorized
⚠️ Android Studio showing "not a Gradle-based project"

## Solution: Force Android Studio to Re-import Project

### Step 1: Close Current Project
1. In Android Studio, click **File → Close Project**
2. This returns you to the welcome screen

### Step 2: Import Project (Not Open!)
1. On the welcome screen, click **"Import Project"** (or "Open")
2. Navigate to: `/Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android`
3. Select the **`android`** folder (not any file inside it)
4. Click **"Open"**

### Step 3: Wait for Gradle Sync
1. Android Studio will detect it's a Gradle project
2. Bottom panel shows "Gradle Sync" progress
3. First sync takes **3-5 minutes** (downloads dependencies)
4. Watch for:
   - "Gradle sync finished in X s" ✅ Success
   - "Gradle sync failed" ❌ Error (report the error message)

### Step 4: Configure Project JDK (If Prompted)
If Android Studio asks about JDK:
1. Click "Set JDK location" or "Configure"
2. Select Android Studio's embedded JDK:
   - Path should be: `/Applications/Android Studio.app/Contents/jbr/Contents/Home`
   - Or click "Download JDK" and select JDK 17 or 18
3. Click "OK"

### Step 5: Build and Run
Once sync succeeds:
1. Click green **Run** button ▶️ (top right toolbar)
2. Select "app" configuration if prompted
3. Select your Samsung S9 from device list
4. Click "OK"
5. Wait for build (2-4 minutes first time)
6. App should install and launch on your phone! 🎉

## Alternative: Use Terminal Build (If Android Studio Issues Persist)

If Android Studio sync keeps failing, you can build from terminal using Android Studio's Java:

```bash
# Set Java home to Android Studio's JDK
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"

# Navigate to project
cd "/Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android"

# Build and install
./gradlew installDebug

# Launch app
~/Library/Android/sdk/platform-tools/adb shell am start -n fi.hapetus.spo2seuranta/.MainActivity
```

## Common Issues

### "Project JDK is not defined"
**Solution**: File → Project Structure → SDK Location → Set JDK to Android Studio's embedded JDK

### "Gradle version X.X.X is required"
**Solution**: Android Studio will offer to upgrade wrapper - click "Upgrade"

### "SDK location not found"
**Solution**: File → Project Structure → SDK Location → Set Android SDK path to:
`/Users/tonijoronen/Library/Android/sdk`

### Build fails with "compileSdkVersion not found"
**Solution**: Tools → SDK Manager → Install Android SDK 34

## Success Indicators
✅ Gradle sync completes without errors
✅ Project structure appears in left panel
✅ No red errors in files
✅ Run button (▶️) is enabled
✅ Device "Samsung SM-G960F" appears in device dropdown

## Next Steps After Successful Build
1. Test app launches
2. Test Google Sign-In
3. Add test measurement
4. Check reports screen
5. Review Logcat for any errors

## Need Help?
If you see any error messages during sync or build, copy the exact error text and we'll troubleshoot it!
