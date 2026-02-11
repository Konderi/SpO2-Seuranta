#!/bin/bash

# SpO2 Seuranta - Android App Launcher and Logger
# This script launches the app and shows real-time logs

JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export JAVA_HOME

ANDROID_DIR="/Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android"
ADB="$HOME/Library/Android/sdk/platform-tools/adb"

echo "🚀 SpO2 Seuranta - Launch & Debug"
echo "=================================="
echo ""

# Check device connection
echo "📱 Checking device..."
DEVICE=$($ADB devices | tail -n +2 | head -1)
if [ -z "$DEVICE" ]; then
    echo "❌ No device connected!"
    echo "Please connect your device and enable USB debugging."
    exit 1
fi
echo "✅ Device connected: $DEVICE"
echo ""

# Check if app is installed
echo "📦 Checking app installation..."
APP=$($ADB shell pm list packages | grep hapetus)
if [ -z "$APP" ]; then
    echo "❌ App not installed!"
    echo "Installing app..."
    cd "$ANDROID_DIR"
    ./gradlew installDebug
else
    echo "✅ App installed: $APP"
fi
echo ""

# Clear previous logs
echo "🧹 Clearing old logs..."
$ADB logcat -c
echo ""

# Launch app
echo "🚀 Launching app..."
$ADB shell am start -n com.konderi.hapetus/.presentation.MainActivity
sleep 2
echo ""

# Show logs
echo "📋 App logs (Press Ctrl+C to stop):"
echo "===================================="
$ADB logcat | grep -E "hapetus|konderi|spo2seuranta|SpO2|AndroidRuntime|FATAL|ERROR"
