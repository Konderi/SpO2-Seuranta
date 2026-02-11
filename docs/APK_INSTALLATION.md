# Installing Hapetus APK Directly

**File:** `hapetus.apk` (21 MB)  
**Version:** Debug build  
**Package:** com.konderi.hapetus

## 📱 Quick Install Methods

### Method 1: Direct Install on Connected Device (ADB)

If your phone is connected via USB:

```bash
~/Library/Android/sdk/platform-tools/adb install -r hapetus.apk
```

The `-r` flag reinstalls the app if it's already installed, keeping user data.

### Method 2: Transfer APK to Phone

1. **Copy APK to phone:**
   ```bash
   # Via ADB
   ~/Library/Android/sdk/platform-tools/adb push hapetus.apk /sdcard/Download/
   
   # Or use file transfer, email, cloud storage, etc.
   ```

2. **On your phone:**
   - Open **Files** or **Downloads** app
   - Find `hapetus.apk`
   - Tap to install

3. **Allow installation from unknown sources:**
   - Android will prompt: "For your security, your phone is not allowed to install unknown apps from this source"
   - Tap **Settings**
   - Enable **Allow from this source**
   - Go back and tap **Install**

### Method 3: Share via Cloud/Email

1. **Upload APK:**
   - Upload `hapetus.apk` to Google Drive, Dropbox, etc.
   - Or email it to yourself

2. **On target phone:**
   - Download the APK
   - Open and install
   - Enable "Install from unknown sources" if prompted

### Method 4: Local Network Transfer

1. **Start simple HTTP server:**
   ```bash
   cd "/Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta"
   python3 -m http.server 8000
   ```

2. **On phone's browser:**
   - Connect to same WiFi network
   - Go to: `http://YOUR_MAC_IP:8000/hapetus.apk`
   - Download and install

## 🔒 Security Notes

### Debug vs Release APK

**Current APK (hapetus.apk) is a DEBUG build:**
- ✅ Good for testing
- ✅ Works with debug SHA-1 fingerprint (Google Sign-In)
- ⚠️ **NOT** for production/distribution
- ⚠️ Signed with debug keystore (not secure)
- ⚠️ Includes debugging information (larger file size)

**For Production:**
You'll need to create a **release build** signed with a production keystore. See instructions below.

### Install Unknown Apps Permission

When installing APK directly (not from Play Store), Android requires:
- **Android 8.0+:** "Install unknown apps" permission per app
- **Android 7.x and below:** "Unknown sources" global setting

This is normal and safe when you trust the APK source.

## 📋 Step-by-Step: Installing on New Phone

### Step 1: Enable Installation from Files App

1. Connect phone to Mac via USB (or use any transfer method)
2. Copy APK to phone:
   ```bash
   ~/Library/Android/sdk/platform-tools/adb push hapetus.apk /sdcard/Download/
   ```

### Step 2: Install APK

1. **On phone, open Files app** (or Downloads)
2. **Navigate to Downloads folder**
3. **Tap `hapetus.apk`**
4. **If prompted about unknown sources:**
   - Android will show: "For your security..."
   - Tap **Settings**
   - Toggle **Allow from this source** ON
   - Press back button
   - Tap `hapetus.apk` again

5. **Tap Install**
6. **Wait for installation** (a few seconds)
7. **Tap Open** or find app in app drawer

### Step 3: First Launch

1. **Grant permissions if prompted:**
   - None required by default
   - Location/Storage if you add those features later

2. **Google Sign-In:**
   - Works if SHA-1 is configured in Firebase
   - Same debug keystore SHA-1 works for all test devices

## 🔄 Updating the App

### If app is already installed:

**Option A: Reinstall via ADB (keeps data):**
```bash
~/Library/Android/sdk/platform-tools/adb install -r hapetus.apk
```

**Option B: Uninstall first (loses data):**
```bash
# Uninstall old version
~/Library/Android/sdk/platform-tools/adb uninstall com.konderi.hapetus

# Install new version
~/Library/Android/sdk/platform-tools/adb install hapetus.apk
```

**Option C: Manual update on phone:**
- Install new APK over old one (if signing key matches)
- Or uninstall old app first from Settings → Apps

## 🏗️ Building APK from Source

### Debug APK (current)

```bash
cd android
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
./gradlew assembleDebug
```

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (for production)

1. **Create signing keystore:**
   ```bash
   keytool -genkey -v -keystore ~/hapetus-release-key.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias hapetus-release
   ```

2. **Create `android/keystore.properties`:**
   ```properties
   storePassword=YOUR_STORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=hapetus-release
   storeFile=/Users/tonijoronen/hapetus-release-key.jks
   ```

3. **Update `android/app/build.gradle.kts`:**
   ```kotlin
   signingConfigs {
       create("release") {
           val keystorePropertiesFile = rootProject.file("keystore.properties")
           val keystoreProperties = Properties()
           keystoreProperties.load(FileInputStream(keystorePropertiesFile))
           
           keyAlias = keystoreProperties["keyAlias"] as String
           keyPassword = keystoreProperties["keyPassword"] as String
           storeFile = file(keystoreProperties["storeFile"] as String)
           storePassword = keystoreProperties["storePassword"] as String
       }
   }
   
   buildTypes {
       release {
           signingConfig = signingConfigs.getByName("release")
           // ... rest of config
       }
   }
   ```

4. **Build release APK:**
   ```bash
   ./gradlew assembleRelease
   ```

5. **Get release SHA-1 and add to Firebase:**
   ```bash
   keytool -list -v -keystore ~/hapetus-release-key.jks -alias hapetus-release
   ```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

## 📤 Distributing APK

### Internal Testing (Current)

- ✅ Share `hapetus.apk` directly with testers
- ✅ Install via ADB or file transfer
- ✅ Use debug build for quick iteration

### Beta Testing

**Option 1: Firebase App Distribution**
- Upload APK to Firebase Console
- Invite testers via email
- They get download link
- Automatic update notifications

**Option 2: Google Play Internal Testing**
- Upload to Play Console
- Manage testers
- Install via Play Store (small user groups)

### Production

- ✅ Use release build
- ✅ Upload to Google Play Store
- ✅ Or distribute as APK with proper signing

## 🎯 Testing Checklist

When distributing APK to testers:

- [ ] Verify APK installs correctly
- [ ] Test Google Sign-In works
- [ ] Check all features function properly
- [ ] Verify no crashes on target devices
- [ ] Test different Android versions
- [ ] Document any device-specific issues

## 🛠️ Troubleshooting

### "App not installed" Error

**Causes:**
1. **Signing key mismatch:** Previous version signed with different key
2. **Corrupted APK:** Re-download or rebuild
3. **Insufficient storage:** Free up space on device
4. **Incompatible architecture:** APK built for wrong CPU architecture

**Solutions:**
- Uninstall old version completely
- Clear Downloads folder and re-transfer APK
- Check device architecture (should be arm64-v8a or armeabi-v7a)

### "Parse Error" Message

**Causes:**
1. **Corrupted download:** APK file damaged during transfer
2. **Incomplete download:** Transfer interrupted
3. **Incompatible Android version:** APK requires API 26+ (Android 8.0+)

**Solutions:**
- Re-download/transfer APK
- Verify file size matches (should be ~21 MB)
- Check Android version on device

### Google Sign-In Not Working

**Cause:** SHA-1 fingerprint not in Firebase for this keystore

**Solution:**
1. Get APK's signing certificate SHA-1:
   ```bash
   keytool -printcert -jarfile hapetus.apk | grep SHA1
   ```

2. Add to Firebase Console (com.konderi.hapetus app)

3. Wait 2-3 minutes for changes to propagate

## 📚 Related Documentation

- [ADD_NEW_TEST_DEVICE.md](./docs/ADD_NEW_TEST_DEVICE.md) - Adding test devices
- [TEST_DEVICE_SETUP.md](./docs/TEST_DEVICE_SETUP.md) - Device setup guide
- [FIX_GOOGLE_SIGNIN.md](./docs/FIX_GOOGLE_SIGNIN.md) - Authentication troubleshooting
- [SHA1_SETUP.md](./docs/SHA1_SETUP.md) - SHA-1 fingerprint guide

## 📝 Summary

**Quick Install:**
```bash
# Connected device via ADB
adb install -r hapetus.apk

# Or push to phone and install manually
adb push hapetus.apk /sdcard/Download/
# Then open Files app on phone and tap APK
```

**Build Fresh APK:**
```bash
cd android
./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk ../hapetus.apk
```

**Share with Others:**
- Email, cloud storage, or direct transfer
- They need to enable "Install from unknown sources"
- Works on any Android 8.0+ device

---

**Last Updated:** 11.2.2026  
**APK Version:** Debug build from main branch  
**File Location:** Project root directory
