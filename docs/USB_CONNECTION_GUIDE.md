# USB Connection Mode Quick Guide

## Problem
Phone shows as "unauthorized" in `adb devices`

## Solution

### Step 1: Change USB Mode
When you plug in your phone, you need to change from "Charging only" to "File Transfer":

1. **Connect USB cable**
2. **Pull down notification shade** on phone
3. **Tap "Charging this device via USB"** notification
4. **Select "File Transfer"** or "Transfer files (MTP)"

### Step 2: Accept USB Debugging Dialog

After changing to File Transfer mode, you should see a popup:

```
Allow USB debugging?
The computer's RSA key fingerprint is:
XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX

☐ Always allow from this computer

[Cancel]  [OK]
```

**Actions:**
1. ✅ **Check the box** "Always allow from this computer"
2. ✅ **Tap "OK"**

### Step 3: Verify Connection

Run the helper script again:
```bash
cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
./run.sh device
```

**Expected output:**
```
✓ Device connected
  Model: [Your Phone Model]
  Android: [Version]
```

---

## Troubleshooting

### If Dialog Doesn't Appear

**Try:**
1. Unplug and replug USB cable
2. Change USB port on laptop
3. Try a different USB cable (some cables are charge-only!)
4. Disable and re-enable USB debugging on phone:
   - Settings → Developer Options
   - Toggle "USB debugging" OFF then ON

### If Still Shows "unauthorized"

**Revoke and try again:**
1. On phone: Settings → Developer Options
2. Tap "Revoke USB debugging authorizations"
3. Confirm
4. Unplug and replug USB cable
5. Accept the dialog again

### If No Developer Options

Enable it:
1. Settings → About Phone
2. Tap "Build number" 7 times
3. You'll see "You are now a developer!"
4. Go back to Settings → Developer Options
5. Enable "USB debugging"

---

## USB Mode by Phone Brand

### Samsung
- Notification: "Charging"
- Options: File transfer, USB tethering, MIDI, Charging only
- **Select: File transfer**

### Google Pixel
- Notification: "Charging this device via USB"
- Options: File transfer, USB tethering, PTP, No data transfer
- **Select: File transfer**

### OnePlus / Xiaomi / Huawei
- Notification: "USB for charging"
- Options: Transfer files (MTP), Transfer photos (PTP), Charge only
- **Select: Transfer files (MTP)**

### Sony / LG / Others
- Notification: "USB"
- Options: MTP, PTP, Charging
- **Select: MTP**

---

## Quick Commands

After authorizing:

```bash
# Check device is connected
./run.sh device

# Build and run app
./run.sh run

# Just build and install
./run.sh build

# Watch logs
./run.sh logs

# Clear app data (fresh start)
./run.sh clear
```

---

## Next Steps

Once device shows as "connected":
1. Open Android Studio
2. Load project from `android/` folder
3. Wait for Gradle sync
4. Click green "Run" button ▶️
5. App will build and install on your phone!

Good luck! 🚀
