# Adding New Android Test Devices

**Last Updated:** 11.2.2026  
**Purpose:** Guide for adding physical Android devices or emulators for testing the Hapetus SpO2 app

## 📱 Overview

This guide covers how to add new Android devices for testing, whether they are:
- Physical phones (Samsung, Pixel, etc.)
- Android emulators in Android Studio
- VS Code Android emulator integration

## 🎯 Prerequisites

Before adding a new device, ensure you have:

- ✅ Android Studio installed
- ✅ Android SDK platform-tools installed
- ✅ USB debugging enabled (physical devices)
- ✅ ADB (Android Debug Bridge) accessible
- ✅ VS Code with Android extensions (optional for emulator management)

## 📋 Method 1: Physical Android Phone

### Step 1: Enable Developer Options

1. **On your Android phone:**
   - Go to **Settings** → **About phone**
   - Find **Build number**
   - Tap **Build number** 7 times
   - You'll see: "You are now a developer!"

### Step 2: Enable USB Debugging

1. **Go to Settings → Developer options**
2. **Enable "USB debugging"**
3. **Optional but recommended:**
   - Enable "Stay awake" (screen stays on while charging)
   - Enable "USB debugging (Security settings)" (for Google Sign-In testing)

### Step 3: Connect Phone to Mac

1. **Connect via USB cable**
   - Use original or quality USB cable
   - Some cables are charge-only (won't work for data)

2. **Accept USB Debugging prompt**
   - Phone will show: "Allow USB debugging?"
   - Check "Always allow from this computer"
   - Tap **OK**

### Step 4: Verify Connection

Open Terminal and run:

```bash
~/Library/Android/sdk/platform-tools/adb devices
```

**Expected output:**
```
List of devices attached
ABC123456789    device
```

If you see `unauthorized`, disconnect and reconnect the USB cable, then accept the prompt on your phone.

### Step 5: Get Device Information

```bash
# Get device model
~/Library/Android/sdk/platform-tools/adb shell getprop ro.product.model

# Get Android version
~/Library/Android/sdk/platform-tools/adb shell getprop ro.build.version.release

# Get API level
~/Library/Android/sdk/platform-tools/adb shell getprop ro.build.version.sdk
```

**Example output:**
```
SM-G960F          # Samsung Galaxy S9
10                # Android 10
29                # API Level 29
```

### Step 6: Install and Test App

1. **Build and install:**
   ```bash
   cd "/Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android"
   export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
   ./gradlew clean installDebug
   ```

2. **Launch app:**
   ```bash
   ~/Library/Android/sdk/platform-tools/adb shell am start -n com.konderi.hapetus/.MainActivity
   ```

3. **View logs:**
   ```bash
   ~/Library/Android/sdk/platform-tools/adb logcat -c  # Clear logs
   ~/Library/Android/sdk/platform-tools/adb logcat | grep hapetus
   ```

## 🖥️ Method 2: Android Emulator (Android Studio)

### Step 1: Open Android Studio Device Manager

1. **Open Android Studio**
2. **Click on Device Manager** (phone icon in toolbar)
   - Or: **Tools → Device Manager**

### Step 2: Create New Virtual Device

1. **Click "Create Device"**

2. **Select Hardware:**
   - **Phone:** Pixel 6, Pixel 4, etc.
   - **Tablet:** Pixel Tablet, Nexus 9, etc.
   - **Wear OS:** For smartwatch testing (future)
   
   **Recommended for testing:**
   - **Pixel 6** (popular modern device)
   - **Pixel 4** (smaller screen)
   - **Nexus 5** (older device simulation)

3. **Select System Image:**
   - **API Level:** Choose based on your needs
     - **API 34** (Android 14) - Latest
     - **API 33** (Android 13)
     - **API 29** (Android 10) - Like Samsung S9
     - **API 26** (Android 8.0) - Minimum supported
   
   - **ABI:** x86_64 (faster on Intel Macs) or arm64-v8a (for ARM Macs)
   - **Target:** Google APIs (for Google Sign-In testing)

4. **Configure AVD:**
   - **Name:** Give it a descriptive name
     - Example: "Pixel_6_API_34" or "Galaxy_S9_API_29"
   - **Orientation:** Portrait (default)
   - **Device Frame:** Enable (shows device bezels)
   
5. **Advanced Settings (optional):**
   - **RAM:** 2048 MB (minimum), 4096 MB (recommended)
   - **Internal Storage:** 2048 MB (minimum)
   - **SD Card:** 512 MB (optional)
   - **Emulated Performance:**
     - Graphics: Hardware (faster)
     - Boot option: Cold boot (more realistic)

6. **Click "Finish"**

### Step 3: Start Emulator

**Option A: From Android Studio**
1. Click ▶️ play button next to the device
2. Wait for emulator to boot (first time is slow)

**Option B: From Terminal**
```bash
# List available emulators
~/Library/Android/sdk/emulator/emulator -list-avds

# Start specific emulator
~/Library/Android/sdk/emulator/emulator -avd Pixel_6_API_34
```

### Step 4: Verify Emulator Connection

```bash
~/Library/Android/sdk/platform-tools/adb devices
```

**Expected output:**
```
List of devices attached
emulator-5554    device
```

### Step 5: Install and Test App

Same as physical device (Step 6 above).

## 🆚 Method 3: VS Code Android Emulator Integration

### Step 1: Install VS Code Extension

1. **Open VS Code**
2. **Install extension:**
   - Search for: "Android iOS Emulator"
   - Or: "Android Emulator" by DiemasMichiels
   - Install the extension

### Step 2: Configure Extension

1. **Open Settings** (Cmd+,)
2. **Search for:** "android emulator"
3. **Set paths:**
   - **Android SDK:** `/Users/YOUR_USERNAME/Library/Android/sdk`
   - **Emulator Path:** `/Users/YOUR_USERNAME/Library/Android/sdk/emulator/emulator`

### Step 3: Launch Emulator from VS Code

1. **Open Command Palette** (Cmd+Shift+P)
2. **Type:** "Android Emulator"
3. **Select:** "Android: Launch Emulator"
4. **Choose device** from list

### Step 4: Use VS Code for Testing

**Benefits:**
- Launch emulators without leaving VS Code
- Quick access to multiple emulators
- Integrated with your development workflow

## 🔧 Configuration for Google Sign-In

### Important: SHA-1 Fingerprint

For Google Sign-In to work on **ANY** device (physical or emulator), you need:

1. **Get your debug keystore SHA-1:**
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1
   ```

2. **Add SHA-1 to Firebase:**
   - Open [Firebase Console](https://console.firebase.google.com)
   - Select project: **Hapetus**
   - Go to: **Project Settings** → **Your apps**
   - Select: **Android app** (com.konderi.hapetus)
   - Scroll to: **SHA certificate fingerprints**
   - Click: **Add fingerprint**
   - Paste your SHA-1
   - **Wait 2-3 minutes** for changes to propagate

3. **Download new google-services.json:**
   - Download from Firebase Console
   - Replace: `android/app/google-services.json`
   - Rebuild app

**Note:** The same SHA-1 works for **ALL** devices using the same debug keystore (your Mac's `~/.android/debug.keystore`).

## 📊 Testing Checklist for New Device

When you add a new test device, verify:

### Basic Functionality
- [ ] App installs successfully
- [ ] App launches without crashes
- [ ] UI displays correctly (no layout issues)
- [ ] Navigation works (all screens accessible)

### Authentication
- [ ] Google Sign-In works
- [ ] User can log out
- [ ] Session persists after app restart

### Core Features
- [ ] Add daily measurement
- [ ] Add exercise measurement
- [ ] View dashboard
- [ ] View statistics
- [ ] View history
- [ ] Export data (CSV/JSON)

### Device-Specific
- [ ] Screen size appropriate (no overflow)
- [ ] Touch targets adequate (minimum 44x44dp)
- [ ] Text readable (font sizes appropriate)
- [ ] Colors display correctly
- [ ] Performance acceptable (no lag)

### Network Conditions
- [ ] Works with WiFi
- [ ] Works with mobile data
- [ ] Handles offline mode
- [ ] Syncs when back online

## 🎯 Recommended Test Device Matrix

### Minimum Coverage

| Device Type | Model | Android | API | Screen | Purpose |
|------------|-------|---------|-----|--------|---------|
| Physical | Samsung Galaxy S9 | 10 | 29 | 1440x2960 | Current test device |
| Emulator | Pixel 6 | 14 | 34 | 1080x2400 | Latest Android |
| Emulator | Pixel 4 | 10 | 29 | 1080x2280 | Mid-range |
| Emulator | Nexus 5 | 8.0 | 26 | 1080x1920 | Minimum supported |

### Expanded Coverage (Optional)

| Device Type | Model | Android | API | Screen | Purpose |
|------------|-------|---------|-----|--------|---------|
| Physical | Samsung Galaxy S21 | 13 | 33 | 1080x2400 | Modern Samsung |
| Physical | Google Pixel 4a | 13 | 33 | 1080x2340 | Stock Android |
| Emulator | Pixel Tablet | 14 | 34 | 2560x1600 | Tablet support |
| Emulator | Pixel C | 8.0 | 26 | 2560x1800 | Tablet (old) |

## 🚀 Quick Start Scripts

### Add to Your Shell Profile

Add these aliases to `~/.zshrc`:

```bash
# Hapetus Android Development Aliases
alias hapetus-devices='~/Library/Android/sdk/platform-tools/adb devices'
alias hapetus-install='cd "/Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android" && export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" && ./gradlew clean installDebug'
alias hapetus-launch='~/Library/Android/sdk/platform-tools/adb shell am start -n com.konderi.hapetus/.MainActivity'
alias hapetus-logs='~/Library/Android/sdk/platform-tools/adb logcat -c && ~/Library/Android/sdk/platform-tools/adb logcat | grep hapetus'
alias hapetus-uninstall='~/Library/Android/sdk/platform-tools/adb uninstall com.konderi.hapetus'
```

**Usage:**
```bash
hapetus-devices    # List connected devices
hapetus-install    # Build and install app
hapetus-launch     # Launch app on device
hapetus-logs       # View app logs
```

## 📱 Device-Specific Notes

### Samsung Devices
- **Knox Security:** May interfere with debugging
- **Game Launcher:** Disable for testing (can affect performance)
- **Battery Optimization:** Disable for Hapetus app
- **One UI:** Test layout on Samsung's modified Android

### Google Pixel Devices
- **Stock Android:** Best for general testing
- **Quick Updates:** Test latest Android versions
- **Clean UI:** No manufacturer modifications

### Emulators
- **Performance:** x86_64 images are faster on Intel Macs
- **Google Play:** Use "Google APIs" images for Play Services
- **Cold Boot:** More realistic but slower
- **Snapshots:** Quick boot but may cause issues

## 🐛 Troubleshooting

### Device Not Detected

**Problem:** `adb devices` shows empty list

**Solutions:**
1. Check USB cable (try different cable)
2. Restart ADB server:
   ```bash
   ~/Library/Android/sdk/platform-tools/adb kill-server
   ~/Library/Android/sdk/platform-tools/adb start-server
   ```
3. Re-enable USB debugging on phone
4. Try different USB port
5. Restart phone

### Device Shows "Unauthorized"

**Problem:** Device listed as `unauthorized`

**Solutions:**
1. Disconnect USB cable
2. On phone: Settings → Developer options → Revoke USB debugging authorizations
3. Reconnect USB
4. Accept new authorization prompt

### Emulator Won't Start

**Problem:** Emulator fails to launch

**Solutions:**
1. Check available disk space (need ~5GB free)
2. Increase RAM allocation (AVD settings)
3. Change Graphics to "Software" (slower but more compatible)
4. Delete and recreate AVD
5. Update Android Emulator in SDK Manager

### App Installation Fails

**Problem:** `INSTALL_FAILED` errors

**Solutions:**
1. Uninstall old version first:
   ```bash
   ~/Library/Android/sdk/platform-tools/adb uninstall com.konderi.hapetus
   ```
2. Clean build:
   ```bash
   cd android && ./gradlew clean
   ```
3. Check device storage (need ~100MB free)
4. Verify APK is for correct architecture

### Google Sign-In Fails

**Problem:** Sign-in dialog closes without authentication

**Solutions:**
1. Verify SHA-1 added to Firebase (correct app: com.konderi.hapetus)
2. Wait 2-3 minutes after adding SHA-1
3. Download latest google-services.json
4. Rebuild app completely
5. Clear app data on device
6. See: [FIX_GOOGLE_SIGNIN.md](./FIX_GOOGLE_SIGNIN.md)

## 📚 Related Documentation

- [TEST_DEVICE_SETUP.md](./TEST_DEVICE_SETUP.md) - Detailed device setup
- [USB_CONNECTION_GUIDE.md](./USB_CONNECTION_GUIDE.md) - USB debugging guide
- [FIX_GOOGLE_SIGNIN.md](./FIX_GOOGLE_SIGNIN.md) - Google Sign-In troubleshooting
- [SHA1_SETUP.md](./SHA1_SETUP.md) - SHA-1 fingerprint guide
- [ANDROID_STUDIO_IMPORT.md](./ANDROID_STUDIO_IMPORT.md) - Android Studio setup

## 🎓 Best Practices

1. **Test on Real Devices:**
   - Emulators can't replicate everything (performance, sensors, etc.)
   - Always test on at least one physical device

2. **Keep Devices Updated:**
   - Test on latest Android version
   - Test on minimum supported version (API 26)
   - Test on popular versions (API 29-33)

3. **Multiple Screen Sizes:**
   - Small phone (≤5 inches)
   - Normal phone (5-6 inches)
   - Large phone (≥6.5 inches)
   - Tablet (future consideration)

4. **Network Conditions:**
   - Test on WiFi
   - Test on mobile data
   - Test offline mode
   - Test slow connections

5. **Clean Test Environment:**
   - Uninstall old versions before testing
   - Clear app data between tests
   - Test fresh installs (first-time user experience)

## ✅ Summary Checklist

When adding a new test device:

- [ ] Enable Developer Options on device
- [ ] Enable USB Debugging
- [ ] Connect and authorize device
- [ ] Verify with `adb devices`
- [ ] Get device information (model, Android version, API)
- [ ] Ensure SHA-1 is in Firebase (for Google Sign-In)
- [ ] Build and install app
- [ ] Run through testing checklist
- [ ] Document any device-specific issues
- [ ] Add device to test matrix documentation

---

**Last Updated:** 11.2.2026  
**Maintained By:** Development Team  
**Questions?** Check related documentation or Firebase Console
