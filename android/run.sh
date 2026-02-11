#!/bin/bash
# Hapetus Android App - Quick Run Script
# Simplifies common development tasks

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Android SDK path
ADB="$HOME/Library/Android/sdk/platform-tools/adb"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Hapetus - Android App Development Helper${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if ADB exists
if [ ! -f "$ADB" ]; then
    echo -e "${RED}✗ ADB not found at $ADB${NC}"
    echo -e "${YELLOW}  Please install Android Studio and SDK${NC}"
    exit 1
fi

# Function to check device connection
check_device() {
    echo -e "${BLUE}Checking device connection...${NC}"
    
    DEVICES=$("$ADB" devices | grep -v "List" | grep "device$" | wc -l)
    
    if [ "$DEVICES" -eq 0 ]; then
        echo -e "${RED}✗ No device connected${NC}"
        echo ""
        echo -e "${YELLOW}Please connect your device and enable USB debugging:${NC}"
        echo "  1. Connect USB cable"
        echo "  2. Accept 'Allow USB debugging' on phone"
        echo "  3. Run this script again"
        echo ""
        "$ADB" devices
        exit 1
    else
        echo -e "${GREEN}✓ Device connected${NC}"
        
        # Get device info
        MODEL=$("$ADB" shell getprop ro.product.model 2>/dev/null | tr -d '\r')
        ANDROID=$("$ADB" shell getprop ro.build.version.release 2>/dev/null | tr -d '\r')
        SDK=$("$ADB" shell getprop ro.build.version.sdk 2>/dev/null | tr -d '\r')
        
        echo -e "  Model: ${GREEN}$MODEL${NC}"
        echo -e "  Android: ${GREEN}$ANDROID${NC} (SDK $SDK)"
        
        if [ "$SDK" -lt 26 ]; then
            echo -e "${RED}✗ Warning: SDK version $SDK is below minimum required (26)${NC}"
        fi
        echo ""
    fi
}

# Function to build and install
build_install() {
    echo -e "${BLUE}Building and installing app...${NC}"
    
    if [ ! -f "gradlew" ]; then
        echo -e "${RED}✗ Not in android project directory${NC}"
        echo -e "${YELLOW}  Please run this script from the android/ directory${NC}"
        exit 1
    fi
    
    # Clean and build
    echo -e "${YELLOW}→ Cleaning project...${NC}"
    ./gradlew clean
    
    echo -e "${YELLOW}→ Building debug APK...${NC}"
    ./gradlew assembleDebug
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Build successful${NC}"
        
        # Install
        echo -e "${YELLOW}→ Installing on device...${NC}"
        ./gradlew installDebug
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ App installed successfully${NC}"
            echo ""
            
            # Launch app
            echo -e "${BLUE}Launching app...${NC}"
            "$ADB" shell am start -n com.konderi.spo2seuranta/.MainActivity
            echo -e "${GREEN}✓ App launched${NC}"
        else
            echo -e "${RED}✗ Installation failed${NC}"
            exit 1
        fi
    else
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    fi
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}Showing app logs (Ctrl+C to stop)...${NC}"
    echo ""
    "$ADB" logcat | grep --color=always -E "SpO2|Hapetus|konderi"
}

# Function to clear app data
clear_data() {
    echo -e "${YELLOW}Clearing app data...${NC}"
    "$ADB" shell pm clear com.konderi.spo2seuranta
    echo -e "${GREEN}✓ App data cleared${NC}"
}

# Function to uninstall app
uninstall() {
    echo -e "${YELLOW}Uninstalling app...${NC}"
    "$ADB" uninstall com.konderi.spo2seuranta
    echo -e "${GREEN}✓ App uninstalled${NC}"
}

# Function to take screenshot
screenshot() {
    echo -e "${BLUE}Taking screenshot...${NC}"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    FILENAME="screenshot_$TIMESTAMP.png"
    
    "$ADB" shell screencap -p /sdcard/screen.png
    "$ADB" pull /sdcard/screen.png "$FILENAME"
    "$ADB" shell rm /sdcard/screen.png
    
    echo -e "${GREEN}✓ Screenshot saved: $FILENAME${NC}"
}

# Function to show APK info
apk_info() {
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    
    if [ -f "$APK_PATH" ]; then
        SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
        echo -e "${GREEN}Debug APK found:${NC}"
        echo -e "  Path: $APK_PATH"
        echo -e "  Size: ${GREEN}$SIZE${NC}"
        echo ""
        
        # Show package info
        "$ADB" shell dumpsys package com.konderi.spo2seuranta | grep -A 5 "versionName" | head -6
    else
        echo -e "${YELLOW}No APK found. Run 'build' first.${NC}"
    fi
}

# Main menu
if [ "$1" == "" ]; then
    check_device
    
    echo -e "${BLUE}Available commands:${NC}"
    echo "  ${GREEN}build${NC}       - Build and install app"
    echo "  ${GREEN}run${NC}         - Build, install, and launch app"
    echo "  ${GREEN}logs${NC}        - Show app logs"
    echo "  ${GREEN}clear${NC}       - Clear app data"
    echo "  ${GREEN}uninstall${NC}   - Uninstall app"
    echo "  ${GREEN}screenshot${NC}  - Take screenshot"
    echo "  ${GREEN}info${NC}        - Show APK info"
    echo "  ${GREEN}device${NC}      - Show device info"
    echo ""
    echo "Usage: ./run.sh [command]"
    echo "Example: ./run.sh run"
    
elif [ "$1" == "device" ]; then
    check_device
    
elif [ "$1" == "build" ]; then
    check_device
    build_install
    
elif [ "$1" == "run" ]; then
    check_device
    build_install
    
elif [ "$1" == "logs" ]; then
    check_device
    show_logs
    
elif [ "$1" == "clear" ]; then
    check_device
    clear_data
    
elif [ "$1" == "uninstall" ]; then
    check_device
    uninstall
    
elif [ "$1" == "screenshot" ]; then
    check_device
    screenshot
    
elif [ "$1" == "info" ]; then
    apk_info
    
else
    echo -e "${RED}Unknown command: $1${NC}"
    echo "Run without arguments to see available commands"
    exit 1
fi
