# Fix Google Sign-In - Package Name Mismatch

## Problem
Google Sign-In is failing because the package name in `google-services.json` doesn't match the app's package name.

**Current situation:**
- App package name: `com.konderi.spo2seuranta`
- google-services.json package: `com.konderi.hapetus`
- Result: Google Sign-In cannot authenticate

## Solution: Update Firebase Configuration

### Option 1: Add New Package Name to Existing Firebase Project (RECOMMENDED)

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select your project

2. **Add New Android App**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"
   - Scroll down to "Your apps"
   - Click "Add app" → Select Android (robot icon)

3. **Register App**
   - Android package name: `com.konderi.spo2seuranta`
   - App nickname: "SpO2 Seuranta" (optional)
   - Click "Register app"

4. **Download google-services.json**
   - Download the new `google-services.json` file
   - Replace the existing file in your project:
     ```bash
     # Backup old file first
     mv "android/app/google-services.json" "android/app/google-services.json.backup"
     
     # Copy new file from Downloads
     cp ~/Downloads/google-services.json "android/app/google-services.json"
     ```

5. **Add SHA-1 Fingerprint (For Google Sign-In)**
   - In Firebase Console, go to Project Settings → Your apps
   - Find "SpO2 Seuranta" app
   - Scroll to "SHA certificate fingerprints"
   - Click "Add fingerprint"
   
   Get your debug SHA-1:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore \
     -alias androiddebugkey -storepass android -keypass android | \
     grep "SHA1:"
   ```
   
   - Copy the SHA-1 value and paste in Firebase
   - Click "Save"

6. **Rebuild and Install**
   ```bash
   cd "android"
   export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
   ./gradlew clean installDebug
   ./launch.sh
   ```

### Option 2: Quick Fix - Revert Package Name (NOT RECOMMENDED)

If you want a quick fix for testing, you can revert the package name back to `com.konderi.hapetus`:

**android/app/build.gradle.kts:**
```kotlin
android {
    namespace = "com.konderi.hapetus"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.konderi.hapetus"
        // ...
    }
}
```

But this is NOT recommended because:
- Package name `spo2seuranta` is more descriptive
- You'd need to change all Kotlin package declarations back
- It's better to fix Firebase configuration properly

## Current Status

✅ App builds and runs
✅ Google Sign-In dialog appears
✅ Account selected (toni.joronen@gmail.com)
❌ **Authentication fails due to package mismatch**

## After Fixing

Once you update `google-services.json` with the correct package name and SHA-1:

1. Rebuild the app
2. Uninstall old app: `adb uninstall com.konderi.spo2seuranta`
3. Install new app: `./gradlew installDebug`
4. Launch: `./launch.sh`
5. Try Google Sign-In again

**Expected result:**
- Sign-In completes successfully
- App navigates to Dashboard
- User info saved in settings
- App remembers you on restart

## Verify It's Working

After sign-in, check logs:
```bash
~/Library/Android/sdk/platform-tools/adb logcat | grep -E "AuthViewModel|AuthScreen"
```

You should see:
```
AuthViewModel: Saving user info: userId=..., userName=..., email=...
AuthViewModel: Auth state updated to Authenticated
```

## Troubleshooting

### If sign-in still fails after updating google-services.json:

1. **Check SHA-1 is added in Firebase Console**
2. **Wait 5-10 minutes** (Firebase updates can take time)
3. **Clear app data:**
   ```bash
   ~/Library/Android/sdk/platform-tools/adb shell pm clear com.konderi.spo2seuranta
   ```
4. **Reinstall app:**
   ```bash
   ./gradlew clean installDebug
   ```

### Common Errors:

**"API_NOT_CONNECTED"** → SHA-1 fingerprint not added to Firebase

**"DEVELOPER_ERROR"** → Package name mismatch or wrong google-services.json

**"SIGN_IN_FAILED"** → Google Play Services not properly configured on device

## Additional Notes

The app currently shows Google Sign-In as the only authentication method. Once this is fixed:
- Users can sign in with their Google account
- Data will sync across devices (when backend is implemented)
- User preferences and measurements will be saved locally
- Sign-out feature available in settings
