# Firebase Setup - Complete Step-by-Step Guide

## 🎯 Current Status
✅ Firebase project created  
✅ Android app added to Firebase  
✅ google-services.json downloaded and placed in `app/` folder  

## 📝 Next Steps: Add Firebase SDK

You're now at **Step 3** in the Firebase setup wizard. Here's what to do:

---

## Step 1: Verify google-services.json Location ✅

Your file is already correctly placed! Verify:
```
SpO2-Seuranta/
└── app/
    └── google-services.json  ← Should be here ✅
```

**Important**: The file should be in the `app/` folder, NOT the root folder!

---

## Step 2: Update Root-Level build.gradle.kts ✅

**Good news!** This is already done in your project. The file `build.gradle.kts` at the root level already includes:

```kotlin
plugins {
    id("com.google.gms.google-services") version "4.4.0" apply false
}
```

You don't need to change anything here - it's already configured! ✅

---

## Step 3: Update App-Level build.gradle.kts ✅

**Good news again!** Your `app/build.gradle.kts` already has everything configured:

1. ✅ Google services plugin is already applied
2. ✅ Firebase dependencies are already added
3. ✅ Firebase Auth is included
4. ✅ Firebase Firestore is included

Your current `app/build.gradle.kts` already has:
```kotlin
plugins {
    // ...
    id("com.google.gms.google-services")  ← Already there ✅
}

dependencies {
    // ...
    implementation(platform("com.google.firebase:firebase-bom:32.7.1"))  ← Already there ✅
    implementation("com.google.firebase:firebase-auth-ktx")              ← Already there ✅
    implementation("com.google.firebase:firebase-firestore-ktx")         ← Already there ✅
}
```

You don't need to add anything! ✅

---

## Step 4: Sync Your Project with Gradle Files

This is the step you need to do NOW:

### In Android Studio:

1. **Click the "Sync Now" button** that appears at the top of the editor when you open the build.gradle.kts file

   OR

2. **Click the elephant icon** 🐘 in the toolbar (Sync Project with Gradle Files)

   OR

3. **Go to menu**: `File` → `Sync Project with Gradle Files`

### What will happen:
- Gradle will download Firebase libraries (~50 MB)
- This takes 2-5 minutes on first sync
- You'll see progress in the bottom status bar
- When done, you'll see "BUILD SUCCESSFUL" in the Build output

### If you see errors:
- Make sure you have internet connection
- Wait for the sync to fully complete
- If it fails, try: `Build` → `Clean Project` → then sync again

---

## Step 5: Enable Google Sign-In in Firebase Console

Now go back to your Firebase Console and enable authentication:

### 5.1 Go to Authentication

1. In Firebase Console, click **"Authentication"** in the left menu
2. Click **"Get started"** button

### 5.2 Enable Google Sign-In Provider

1. Click on the **"Sign-in method"** tab
2. Find **"Google"** in the list of providers
3. Click on **"Google"**
4. Toggle the **"Enable"** switch to ON
5. Enter a **support email** (your email address)
6. Click **"Save"**

---

## Step 6: Get Your Web Client ID

This is CRITICAL for Google Sign-In to work!

### 6.1 Find the Web Client ID

1. In Firebase Console, click the **⚙️ gear icon** (Settings) → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Find your Android app (`com.konderi.spo2seuranta`)
4. Look for **"Web client (auto created by Google Service)"**
5. You'll see a Client ID that looks like:
   ```
   511544546057-xxxxxxxxxxxxxxxxx.apps.googleusercontent.com
   ```
6. **COPY THIS ENTIRE CLIENT ID** (including .apps.googleusercontent.com)

### 6.2 Update Your App Configuration

1. Open file: `app/src/main/res/values/config.xml`

2. Replace the placeholder with your REAL Web Client ID:

   **BEFORE:**
   ```xml
   <string name="default_web_client_id">YOUR_WEB_CLIENT_ID.apps.googleusercontent.com</string>
   ```

   **AFTER:**
   ```xml
   <string name="default_web_client_id">511544546057-xxxxxxxxxxxxxxxxx.apps.googleusercontent.com</string>
   ```

3. Save the file

---

## Step 7: Build and Run Your App

### 7.1 Clean and Rebuild

1. In Android Studio: `Build` → `Clean Project`
2. Wait for it to finish
3. Then: `Build` → `Rebuild Project`
4. Wait for "BUILD SUCCESSFUL" message

### 7.2 Connect Your Device

**Option A: Physical Android Device (Recommended)**

1. Enable Developer Options on your phone:
   - Go to `Settings` → `About phone`
   - Tap `Build number` 7 times
   - You'll see "You are now a developer!"

2. Enable USB Debugging:
   - Go to `Settings` → `Developer options`
   - Turn ON `USB debugging`

3. Connect phone to computer via USB cable

4. On your phone, tap "Allow" when asked about USB debugging

5. In Android Studio, you should see your device in the device dropdown at the top

**Option B: Android Emulator**

1. In Android Studio: `Tools` → `Device Manager`
2. If you don't have an emulator, click `Create Device`
3. Select `Pixel 6` → `Next`
4. Download and select `API 34` system image → `Next`
5. Click `Finish`
6. Click the ▶️ play button next to your emulator to start it

### 7.3 Run the App

1. Make sure your device/emulator is selected in the device dropdown (top toolbar)
2. Click the green **▶️ Run button** (or press `Shift+F10`)
3. Wait for the app to install and launch

---

## Step 8: Test Google Sign-In

### What Should Happen:

1. **App launches** and shows the authentication screen with:
   - App logo (heart icon)
   - "SpO2 Seuranta" title
   - "Kirjaudu Google-tilillä" button

2. **Tap the button** → Google Sign-In dialog appears

3. **Select your Google account** → Grant permissions

4. **Success!** You should be redirected to the main app (Daily Measurements screen)

### If It Doesn't Work:

**Error: "Sign-in failed"**
- Check that you copied the correct Web Client ID
- Make sure it's in `app/src/main/res/values/config.xml`
- Verify Google Sign-In is enabled in Firebase Console

**Error: "Developer error"**
- Your SHA-1 fingerprint might not match
- Get your SHA-1: Run in terminal: `cd android && ./gradlew signingReport`
- Copy the SHA-1 under "Variant: debug"
- Add it to Firebase: Project Settings → Your app → Add fingerprint

**Nothing happens when clicking button**
- Check Logcat for error messages: `View` → `Tool Windows` → `Logcat`
- Look for red error messages
- Search the error message online

---

## Step 9: Verify Everything Works

### Test Checklist:

1. ✅ **Sign in** with Google account works
2. ✅ **Add a daily measurement**:
   - SpO2: `95`
   - Heart Rate: `72`
   - Notes: `Test mittaus`
   - Tap "Tallenna mittaus"
3. ✅ **Navigate tabs** - Tap each bottom navigation icon
4. ✅ **View reports** - Should show your measurement
5. ✅ **Check settings** - See your Google account info
6. ✅ **Sign out and sign in again** - Should remember you

### Data Persistence Test:

1. Add a measurement
2. Close the app completely
3. Reopen the app
4. Check if measurement is still there ✅

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "Gradle sync failed"

**Solution:**
```bash
# In Android Studio terminal:
./gradlew clean
./gradlew build --refresh-dependencies
```

Then click "Sync Project with Gradle Files" again.

### Issue 2: "Cannot resolve symbol 'R'"

**Solution:**
1. `Build` → `Clean Project`
2. `Build` → `Rebuild Project`
3. If still broken: `File` → `Invalidate Caches` → `Invalidate and Restart`

### Issue 3: "google-services.json not found"

**Solution:**
- Make sure file is at: `SpO2-Seuranta/app/google-services.json`
- NOT at: `SpO2-Seuranta/google-services.json` (wrong!)

### Issue 4: Google Sign-In shows "Error 10"

**Solution:**
- Your SHA-1 fingerprint doesn't match
- Get SHA-1:
  ```bash
  cd android
  ./gradlew signingReport
  ```
- Add it to Firebase Console under Project Settings

### Issue 5: Build takes forever

**Solution:**
- First build always takes 5-10 minutes (downloads dependencies)
- Make sure you have good internet connection
- Gradle is downloading ~200 MB of libraries

---

## ✅ Success Checklist

After completing all steps, you should have:

- [x] google-services.json in app/ folder
- [x] Gradle sync completed successfully
- [x] Google Sign-In enabled in Firebase
- [x] Web Client ID added to config.xml
- [x] App builds without errors
- [x] App runs on device/emulator
- [x] Google Sign-In works
- [x] Can add and view measurements
- [x] Data persists after app restart

---

## 📞 Still Having Issues?

### Check These:

1. **Logcat Output**: `View` → `Tool Windows` → `Logcat`
   - Look for red error messages
   - Search the error on Stack Overflow

2. **Build Output**: `View` → `Tool Windows` → `Build`
   - Shows compilation errors clearly

3. **File Locations**:
   ```
   app/google-services.json              ✅
   app/src/main/res/values/config.xml    ✅ (updated with Web Client ID)
   app/build.gradle.kts                  ✅ (has google-services plugin)
   build.gradle.kts                      ✅ (has google-services in plugins)
   ```

4. **Firebase Console**:
   - Authentication → Sign-in method → Google is ENABLED ✅
   - Project Settings → Your app → SHA-1 is added ✅

---

## 🎉 You're Done!

Once the app runs and you can sign in with Google, you have successfully:

✅ Integrated Firebase  
✅ Configured Google Sign-In  
✅ Built a working Android app  
✅ Ready to use all features  

**Next**: Try adding measurements and exploring all the features!

---

## 📚 Quick Reference

### Important Files:
- `app/google-services.json` - Firebase configuration
- `app/src/main/res/values/config.xml` - Web Client ID
- `app/build.gradle.kts` - App dependencies

### Important Commands:
```bash
# Get SHA-1 fingerprint
./gradlew signingReport

# Clean project
./gradlew clean

# Build project
./gradlew build

# Install debug APK
./gradlew installDebug
```

### Firebase Console Links:
- Authentication: `https://console.firebase.google.com/project/spo2-seuranta/authentication`
- Project Settings: `https://console.firebase.google.com/project/spo2-seuranta/settings/general`

---

**Last Updated**: February 11, 2026  
**Your Project ID**: spo2-seuranta  
**Package Name**: com.konderi.spo2seuranta
