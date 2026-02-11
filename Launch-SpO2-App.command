#!/bin/bash
# SpO2 Seuranta - Quick Launch Script
# Copy this to your Desktop and double-click to launch app on phone

echo "╔════════════════════════════════════════╗"
echo "║   SpO2 Seuranta - Quick Launcher       ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🔍 Checking device connection..."
~/Library/Android/sdk/platform-tools/adb devices | grep -v "List of devices"

if [ $? -ne 0 ]; then
    echo "❌ No device connected!"
    echo "   Please connect your phone via USB"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo ""
echo "📱 Launching SpO2 Seuranta..."
~/Library/Android/sdk/platform-tools/adb shell am start -n com.konderi.hapetus/.presentation.MainActivity

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ App launched successfully!"
    echo ""
    echo "📋 Options:"
    echo "   1. Press Enter to exit"
    echo "   2. Type 'logs' to view app logs"
    read -p "Your choice: " choice
    
    if [ "$choice" = "logs" ]; then
        echo ""
        echo "📊 Showing app logs (Ctrl+C to stop)..."
        ~/Library/Android/sdk/platform-tools/adb logcat | grep -E "hapetus|SpO2"
    fi
else
    echo ""
    echo "❌ Failed to launch app"
    echo "   Make sure the app is installed"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi
