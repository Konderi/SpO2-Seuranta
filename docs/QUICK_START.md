# Hapetus - Android App Quick Start

## ✅ What's Been Done

### Brand Updates
- ✅ **App name**: "SpO2 Seuranta" → **"Hapetus"**
- ✅ **Package ID**: `com.konderi.spo2seuranta` → `com.konderi.hapetus`
- ✅ **Primary color**: `#1565C0` → `#0070E6` (matches website)
- ✅ **Color scheme**: Now matches the website's darker, professional blue theme

### Files Updated
1. `android/app/build.gradle.kts` - Changed applicationId and namespace
2. `android/app/src/main/res/values/strings.xml` - Changed app_name to "Hapetus"
3. `android/app/src/main/java/com/konderi/hapetus/presentation/theme/Color.kt` - Updated primary colors

## 🚀 Quick Start (3 Steps)

### Step 1: Install Android Studio
Download from: https://developer.android.com/studio
- Choose "Standard Installation"
- Accept all licenses
- Wait for SDK download (~10 minutes)

### Step 2: Prepare Your Phone
1. **Enable Developer Mode**: Settings → About Phone → Tap "Build Number" 7 times
2. **Enable USB Debugging**: Settings → Developer Options → USB Debugging ON
3. **Connect USB cable** to your Mac

### Step 3: Run the App
```bash
# Open Terminal and run:
cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
./gradlew installDebug
```

**OR** in Android Studio:
1. Open project: `/Users/tonijoronen/.../SpO2-Seuranta/android`
2. Wait for Gradle sync
3. Click ▶ Run button (green triangle)

## 📱 What You'll See

The app will have:
- **Name**: Hapetus
- **Primary color**: Darker blue (#0070E6) - same as website
- **Theme**: Material Design 3 with soft rounded corners
- **Language**: Finnish throughout

## 📖 Full Guide

For detailed instructions, troubleshooting, and Firebase setup, see:
**`android/TESTING_GUIDE.md`** (in Finnish)

Covers:
- Detailed Android Studio setup
- Phone preparation steps
- Firebase configuration
- Common problems & solutions
- How to view logs
- Release build instructions

## 🔗 Current Status

**Website**: ✅ Live at https://hapetus.info
- Dark blue theme (#0070E6)
- Soft rounded corners (rounded-3xl)
- All pages complete (login, dashboard, measurements, history, statistics)

**Android App**: ✅ Ready for testing
- Colors match website
- Name updated to Hapetus
- Needs: Firebase `google-services.json` file
- Needs: Test on physical device

## ⚠️ Before First Run

You need to add Firebase configuration:

1. Go to: https://console.firebase.google.com
2. Select project: **spo2-seuranta**
3. Project Settings → Your Apps → Add Android app (if not exists)
4. Package name: `com.konderi.hapetus`
5. Download `google-services.json`
6. Copy to: `android/app/google-services.json`

Then rebuild:
```bash
./gradlew clean
./gradlew installDebug
```

## 🎨 Design Consistency

Both website and app now share:
- **Primary Blue**: #0070E6 (HSL 210, 100%, 45%)
- **Primary Dark**: #0059B3 (HSL 210, 100%, 35%)
- **Primary Light**: #E6F4FF (HSL 210, 100%, 95%)
- **Rounded corners**: 32px (3xl) for modern, soft look
- **Typography**: Large, elderly-friendly fonts
- **Language**: Finnish

## 🐛 Common Issues

**"Device not found"**
```bash
cd ~/Library/Android/sdk/platform-tools
./adb kill-server
./adb start-server
./adb devices
```

**"Gradle sync failed"**
- Android Studio: File → Invalidate Caches → Invalidate and Restart
- Or: `./gradlew clean`

**"Google Sign-In not working"**
- Make sure `google-services.json` is in `android/app/`
- Check Firebase Console: Authentication → Google is enabled
- Add SHA-1 fingerprint (see TESTING_GUIDE.md)

## 📊 Next Steps

1. **Test on physical device** (follow TESTING_GUIDE.md)
2. **Verify Google Sign-In** works
3. **Test all features**:
   - Daily measurements
   - Exercise tracking
   - Reports/statistics
   - Settings (large font toggle)
4. **Create app icon** (currently using default)
5. **Take screenshots** for future Play Store listing

## 📞 Need Help?

Full troubleshooting guide in: **`android/TESTING_GUIDE.md`**

Or ask me (GitHub Copilot) in chat for:
- Specific error messages
- Build issues
- Firebase configuration help
- Any other questions

---

**Ready to test!** Follow TESTING_GUIDE.md for step-by-step instructions. 🚀
