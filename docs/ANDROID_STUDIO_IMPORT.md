# How to Open Android Project in Android Studio

## The Issue
Android Studio is showing "The project 'SpO2Seuranta' is not a Gradle-based project" even though all Gradle files are present.

## Solution: Proper Import Steps

### Step 1: Close Everything in Android Studio
1. Close any open projects in Android Studio
2. You should see the welcome screen

### Step 2: Import Project (Not "Open")
1. On the welcome screen, look for **"Open"** button
2. Navigate to the project folder:
   ```
   /Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
   ```
3. **IMPORTANT**: Select the **`android`** folder itself (not any file inside)
4. Click "Open"

### Step 3: Let Android Studio Detect the Project
When you open the folder, Android Studio should:
1. Detect it's a Gradle project automatically
2. Start "Gradle Sync" in the background
3. Show progress in the bottom status bar

### Step 4: Configure SDK (If Asked)
If Android Studio prompts about SDK:
1. Accept the default Android SDK location: `/Users/tonijoronen/Library/Android/sdk`
2. If asked about JDK, select the embedded JDK (usually auto-detected)

### Step 5: Wait for Gradle Sync
- First sync takes 2-5 minutes
- Watch the bottom progress bar
- You'll see messages like:
  - "Gradle sync in progress..."
  - "Indexing..."
  - "Gradle sync completed successfully" ✅

### Step 6: Select Device and Run
Once sync completes:
1. Look at the top toolbar
2. Select device: "Samsung SM-G960F" (your S9)
3. Click green Run button ▶️
4. App will build and launch on your phone

## Alternative: Use Command Line (Current Working Method)

Since the command line build works, you can continue using terminal commands:

### Build:
```bash
cd "/Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android"
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
./gradlew assembleDebug
```

### Install:
```bash
./gradlew installDebug
```

### Launch:
```bash
~/Library/Android/sdk/platform-tools/adb shell am start -n com.konderi.hapetus/.MainActivity
```

### View Logs:
```bash
~/Library/Android/sdk/platform-tools/adb logcat -c  # Clear logs
~/Library/Android/sdk/platform-tools/adb logcat | grep -E "hapetus|konderi|AndroidRuntime"
```

## Quick Debug Commands

### Check if device is connected:
```bash
~/Library/Android/sdk/platform-tools/adb devices
```

### Check if app is installed:
```bash
~/Library/Android/sdk/platform-tools/adb shell pm list packages | grep hapetus
```

### Uninstall app:
```bash
~/Library/Android/sdk/platform-tools/adb uninstall com.konderi.hapetus
```

### Clear app data:
```bash
~/Library/Android/sdk/platform-tools/adb shell pm clear com.konderi.hapetus
```

## If Android Studio Still Doesn't Work

You can use the helper script I created:

```bash
cd "/Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android"
./build.sh run
```

Or use VS Code with the Android extension for editing files while using terminal for building.

## Current Status

✅ **Gradle wrapper files created**
✅ **local.properties configured**  
✅ **SDK installed (Android 34)**
✅ **App builds successfully from terminal**
✅ **App installed on Samsung S9**
⚠️ **Android Studio import needs proper steps above**

The app is functional and can be developed using terminal commands even if Android Studio UI has import issues.
