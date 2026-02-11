# SpO2 Seuranta - Setup Guide

## 🎯 Quick Start Guide

This guide will help you set up and run the SpO2 Seuranta application on your development machine.

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Android Studio** (Hedgehog 2023.1.1 or later)
- [ ] **Java Development Kit (JDK) 17**
- [ ] **Android SDK 34** installed via Android Studio
- [ ] **Google Account** for Firebase setup
- [ ] **Physical Android device** or emulator (API 26+)

## 🔧 Step-by-Step Setup

### 1. Install Android Studio

1. Download from [https://developer.android.com/studio](https://developer.android.com/studio)
2. Install with default components
3. Open Android Studio and complete the setup wizard
4. Install Android SDK 34 via SDK Manager

### 2. Clone the Project

```bash
git clone https://github.com/yourusername/SpO2-Seuranta.git
cd SpO2-Seuranta
```

### 3. Configure Firebase & Google Sign-In

#### A. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: **SpO2-Seuranta**
4. Disable Google Analytics (optional)
5. Click "Create project"

#### B. Add Android App to Firebase

1. In Firebase Console, click "Add app" → Android icon
2. Enter package name: `com.konderi.spo2seuranta`
3. App nickname: **SpO2 Seuranta**
4. Get SHA-1 certificate fingerprint:

   **For Debug Build (Development):**
   ```bash
   cd android
   ./gradlew signingReport
   ```
   
   Look for **SHA-1** under `Variant: debug` and copy it
   
   Or use keytool:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

5. Paste SHA-1 in Firebase
6. Click "Register app"

#### C. Download Configuration File

1. Download `google-services.json`
2. Place it in: `SpO2-Seuranta/app/google-services.json`
3. **Important**: This file contains your Firebase configuration

#### D. Enable Google Sign-In

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Google** sign-in provider
4. Set support email
5. Click "Save"

#### E. Get Web Client ID

1. In Firebase Console → **Project Settings**
2. Scroll down to **Your apps**
3. Find your Android app
4. Look for **Web client (auto created by Google Service)**
5. Copy the **Web client ID** (format: `xxxxx.apps.googleusercontent.com`)

#### F. Update Configuration

Open `app/src/main/res/values/config.xml` and replace:
```xml
<string name="default_web_client_id">YOUR_WEB_CLIENT_ID.apps.googleusercontent.com</string>
```

With your actual Web Client ID:
```xml
<string name="default_web_client_id">123456789-xxxxxxxxxxxxx.apps.googleusercontent.com</string>
```

### 4. Open Project in Android Studio

1. Launch Android Studio
2. Click **"Open"**
3. Navigate to `SpO2-Seuranta` folder
4. Click **"OK"**
5. Wait for Gradle sync to complete (first time may take 5-10 minutes)

### 5. Verify Dependencies

Check that `google-services.json` is properly placed:
- Should be at: `app/google-services.json`
- **Not** at root level

### 6. Build the Project

```bash
./gradlew build
```

Or in Android Studio: **Build** → **Make Project** (Ctrl+F9 / Cmd+F9)

### 7. Run the Application

#### Option A: Using Physical Device (Recommended)

1. Enable **Developer Options** on your Android device:
   - Go to Settings → About phone
   - Tap "Build number" 7 times
   - Go back → Developer options → Enable USB debugging

2. Connect device via USB
3. In Android Studio, select your device from dropdown
4. Click **Run** ▶️ (Shift+F10 / Ctrl+R)

#### Option B: Using Android Emulator

1. In Android Studio: **Tools** → **Device Manager**
2. Click **"Create Device"**
3. Select **Pixel 6** (or similar)
4. Download and select **API 34** system image
5. Finish setup
6. Click **Run** ▶️ and select emulator

## 🎨 First Launch

### Expected Behavior

1. **Auth Screen** appears with:
   - App logo (heart icon)
   - "SpO2 Seuranta" title
   - "Kirjaudu Google-tilillä" button

2. Tap **"Kirjaudu Google-tilillä"**
3. Select your Google account
4. Grant permissions
5. You'll be redirected to **Daily Measurements** screen

### Test the App

1. **Add a Daily Measurement**:
   - Enter SpO2: `95`
   - Enter Heart Rate: `72`
   - Add note: `Aamumittaus`
   - Tap "Tallenna mittaus"

2. **Navigate to Reports**:
   - Tap "Raportit" in bottom navigation
   - View statistics

3. **Try Settings**:
   - Tap "Asetukset"
   - Toggle "Suuri fontti" to see effect
   - Change alert threshold

## 🐛 Troubleshooting

### Issue: Build Fails with "google-services.json not found"

**Solution**: Ensure `google-services.json` is at `app/google-services.json`, not root directory.

### Issue: Google Sign-In Fails

**Solutions**:
1. Verify SHA-1 is correct in Firebase Console
2. Check that Web Client ID in `config.xml` matches Firebase
3. Ensure Google Sign-In is enabled in Firebase Authentication
4. Try on real device instead of emulator

### Issue: Gradle Sync Failed

**Solution**:
```bash
./gradlew clean
./gradlew build --refresh-dependencies
```

### Issue: "Cannot resolve symbol R"

**Solution**:
1. **Build** → **Clean Project**
2. **Build** → **Rebuild Project**
3. **File** → **Invalidate Caches** → **Invalidate and Restart**

### Issue: App Crashes on Launch

**Solutions**:
1. Check Logcat for error messages
2. Ensure all dependencies are synced
3. Verify minimum SDK version (API 26)
4. Clear app data on device

## 📦 Production Build

### Generate Release APK

1. In Android Studio: **Build** → **Generate Signed Bundle/APK**
2. Select **APK**
3. Create or select keystore
4. Fill in key details
5. Select **release** build variant
6. Click **Finish**

APK will be at: `app/release/app-release.apk`

### Optional: ProGuard Configuration

For production, ProGuard rules are already configured in `app/proguard-rules.pro`.

## 🔐 Security Notes

### Important Files (DO NOT COMMIT)

- `google-services.json` - Contains Firebase keys
- `local.properties` - Contains SDK path
- `.idea/` folder - IDE settings

These are already in `.gitignore`.

### Google Services JSON

For team collaboration:
1. Share `google-services.json` securely (not via Git)
2. Each developer needs their own copy
3. Or use different Firebase projects for dev/prod

## 📱 Testing on Different Devices

### Minimum Testing Matrix

- ✅ Android 8.0 (API 26) - Minimum supported
- ✅ Android 10 (API 29) - Common version
- ✅ Android 13 (API 33) - Recent version
- ✅ Android 14 (API 34) - Latest

### Screen Sizes

- Small (5.0") - phones
- Medium (6.0") - phones
- Large (7.0"+) - tablets

## 🚀 Next Steps

After successful setup:

1. **Explore the codebase** - Check architecture in `/app/src/main/java`
2. **Read documentation** - See README.md for features
3. **Customize** - Modify colors in `presentation/theme/Color.kt`
4. **Add features** - Follow MVVM pattern
5. **Test thoroughly** - Add unit tests in `/app/src/test`

## 📚 Additional Resources

- [Android Developer Docs](https://developer.android.com/)
- [Jetpack Compose Tutorial](https://developer.android.com/jetpack/compose/tutorial)
- [Material Design 3](https://m3.material.io/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Kotlin Documentation](https://kotlinlang.org/docs/home.html)

## 💬 Get Help

If you encounter issues:

1. Check **Logcat** in Android Studio (View → Tool Windows → Logcat)
2. Review error messages carefully
3. Search Stack Overflow
4. Open an issue on GitHub

## ✅ Setup Complete!

If you can:
- Launch the app ✅
- Sign in with Google ✅
- Add a measurement ✅
- View reports ✅

**Congratulations! You're ready to develop!** 🎉

---

*Last updated: 2026-02-10*
