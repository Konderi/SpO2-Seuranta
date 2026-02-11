# Google Sign-In SHA-1 Setup

## Problem
Google Sign-In dialog opens but authentication silently fails with no result being returned to the app.

## Root Cause
SHA-1 fingerprint not added to Firebase Console. Google Sign-In requires SHA-1 certificate fingerprint for Android authentication.

## Your Debug Keystore SHA-1 Fingerprint

```
SHA1: E5:4A:B8:5C:C1:74:2B:24:2B:88:EF:8F:C2:20:BC:E1:C5:D7:96:F6
SHA256: 80:81:E8:2C:6A:10:22:84:7C:E7:96:C6:20:2F:AB:D7:CA:29:B3:5D:8D:4A:18:3E:78:72:BD:4A:9A:58:CF:F8
```

## Steps to Add SHA-1 to Firebase

### 1. Open Firebase Console
Go to: https://console.firebase.google.com/

### 2. Select Your Project
Click on your project (SpO2-Seuranta or similar)

### 3. Go to Project Settings
- Click the gear icon ⚙️ in the top left
- Select "Project Settings"

### 4. Find Your Android App
- Scroll down to "Your apps" section
- Find the Android app with package name: **com.konderi.hapetus**

### 5. Add SHA-1 Fingerprint
- Under "SHA certificate fingerprints" section
- Click "Add fingerprint" button
- Paste this SHA-1:
  ```
  E5:4A:B8:5C:C1:74:2B:24:2B:88:EF:8F:C2:20:BC:E1:C5:D7:96:F6
  ```
- Click "Save" button

### 6. Wait for Firebase to Update
Wait 2-3 minutes for the changes to propagate.

### 7. Download New google-services.json (Optional but Recommended)
- Download the updated `google-services.json` from Firebase Console
- Replace `android/app/google-services.json` with the new file
- Rebuild the app

## Testing After Adding SHA-1

### 1. Rebuild and Install
```bash
cd android
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
./gradlew clean installDebug
```

### 2. Launch App
```bash
./launch.sh
```

### 3. Monitor Logs (in another terminal)
```bash
~/Library/Android/sdk/platform-tools/adb logcat | grep -E "AuthViewModel|AuthScreen|ApiException"
```

### 4. Try Sign-In
- Click "Kirjaudu Google-tilillä" button
- Select your Google account
- You should see these logs:
  ```
  AuthScreen: Result received: resultCode=-1
  AuthScreen: Account: email=your.email@gmail.com
  AuthViewModel: Saving user info: userId=...
  AuthViewModel: Auth state updated to Authenticated
  ```

## Expected Outcome

✅ Sign-in completes successfully
✅ AuthScreen logs appear in logcat
✅ User is redirected to Dashboard
✅ User's name appears in the UI

## If It Still Doesn't Work

### Check SHA-256 Too
Some Firebase configurations require SHA-256. Add it as well:
```
SHA256: 80:81:E8:2C:6A:10:22:84:7C:E7:96:C6:20:2F:AB:D7:CA:29:B3:5D:8D:4A:18:3E:78:72:BD:4A:9A:58:CF:F8
```

### Verify google-services.json
Make sure `android/app/google-services.json` has:
- `"package_name": "com.konderi.hapetus"`
- Matches your Firebase project

### Check Google Play Services
On your device:
1. Open Settings → Apps
2. Find "Google Play Services"
3. Verify it's updated (should be version 24.x.x or newer)

## Why This Fix Works

**Without SHA-1:**
- Sign-in dialog opens (doesn't require SHA-1)
- User selects account
- Google servers reject authentication (no SHA-1)
- No result returned to app
- Silent failure

**With SHA-1:**
- Sign-in dialog opens
- User selects account
- Google servers validate SHA-1 fingerprint
- Authentication succeeds
- Result delivered to ActivityResultLauncher
- handleSignInResult() called
- User authenticated successfully

## Production Release Note

When building a release APK (not debug), you'll need to:
1. Generate a release keystore
2. Get its SHA-1 fingerprint
3. Add that SHA-1 to Firebase as well

Different keystores = different SHA-1 fingerprints!
