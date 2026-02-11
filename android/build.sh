#!/bin/bash

# Quick Android build commands
# Usage: ./build.sh [command]

JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export JAVA_HOME

ANDROID_DIR="/Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android"

case "$1" in
  "build")
    echo "🔨 Building Android app..."
    cd "$ANDROID_DIR" && ./gradlew assembleDebug
    ;;
  "install")
    echo "📱 Installing app on device..."
    cd "$ANDROID_DIR" && ./gradlew installDebug
    ;;
  "run")
    echo "🚀 Building, installing, and launching..."
    cd "$ANDROID_DIR" && ./gradlew installDebug
    ~/Library/Android/sdk/platform-tools/adb shell am start -n fi.hapetus.spo2seuranta/.MainActivity
    ;;
  "clean")
    echo "🧹 Cleaning build..."
    cd "$ANDROID_DIR" && ./gradlew clean
    ;;
  "logs")
    echo "📋 Showing app logs (Ctrl+C to stop)..."
    ~/Library/Android/sdk/platform-tools/adb logcat | grep -E "SpO2|hapetus|AndroidRuntime"
    ;;
  *)
    echo "Android Build Helper"
    echo ""
    echo "Commands:"
    echo "  ./build.sh build     - Build APK"
    echo "  ./build.sh install   - Build and install on device"
    echo "  ./build.sh run       - Build, install, and launch app"
    echo "  ./build.sh clean     - Clean build cache"
    echo "  ./build.sh logs      - Show app logs"
    echo ""
    echo "Device: $(~/Library/Android/sdk/platform-tools/adb devices | tail -n +2 | head -1)"
    ;;
esac
