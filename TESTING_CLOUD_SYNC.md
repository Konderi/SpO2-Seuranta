# 🧪 Cloud Sync Testing Checklist

**App Installed**: ✅ SM-G960F (Samsung S9)  
**Build**: d2fb595  
**Date**: February 12, 2026

---

## ⚡ Quick Test (5 minutes)

### Test 1: Add Measurement on Android → Check Website
1. **Open app on phone**
2. **Add daily measurement**:
   - SpO2: 95%
   - Heart Rate: 72 BPM
   - Notes: "Cloud sync test"
3. **On computer, open**: https://hapetus.info
4. **Sign in** with same Google account
5. **Expected**: Measurement appears within 2-5 seconds ✅

**Result**: ⬜ PASS / ⬜ FAIL

---

### Test 2: Offline Mode
1. **Enable Airplane Mode** on phone
2. **Add measurement**:
   - SpO2: 94%
   - Heart Rate: 70 BPM
3. **Expected**: Measurement saves successfully ✅
4. **Disable Airplane Mode**
5. **Wait 10 seconds**
6. **Check website**: Measurement appears ✅

**Result**: ⬜ PASS / ⬜ FAIL

---

## 🔍 Detailed Test (15 minutes)

### Test 3: Website → Android Sync
1. **On website**, add new measurement:
   - SpO2: 97%
   - Heart Rate: 68 BPM
2. **Close Android app** completely
3. **Reopen Android app** (triggers sync)
4. **Expected**: Website measurement appears in list ✅

**Result**: ⬜ PASS / ⬜ FAIL

---

### Test 4: Exercise Measurement Sync
1. **On Android**, add exercise:
   - Before: SpO2 96%, HR 70
   - After: SpO2 92%, HR 110
   - Details: "Walking 15 min"
2. **Check website**
3. **Expected**: Exercise appears in history ✅

**Result**: ⬜ PASS / ⬜ FAIL

---

### Test 5: Delete Sync
1. **On Android**, long-press a measurement
2. **Delete it**
3. **Check website**
4. **Expected**: Measurement deleted there too ✅

**Result**: ⬜ PASS / ⬜ FAIL

---

### Test 6: Initial Data Sync
1. **On website**, add 2-3 measurements
2. **On Android**, sign out
3. **Sign in again** (or clear app data and sign in fresh)
4. **Expected**: All website measurements appear ✅

**Result**: ⬜ PASS / ⬜ FAIL

---

## 📱 Performance Check

### App Responsiveness:
- Saving measurement feels instant: ⬜ YES / ⬜ NO
- No loading spinners blocking UI: ⬜ YES / ⬜ NO
- App works in Airplane Mode: ⬜ YES / ⬜ NO

### Sync Speed:
- Data appears on website within 5 seconds: ⬜ YES / ⬜ NO
- Data from website syncs on app start: ⬜ YES / ⬜ NO

### Battery:
- No noticeable battery drain: ⬜ YES / ⬜ NO
- App doesn't feel "heavy": ⬜ YES / ⬜ NO

---

## 🐛 If Something Fails

### Check Logs:
```bash
# In terminal on your Mac:
~/Library/Android/sdk/platform-tools/adb logcat | grep -E "Retrofit|ApiService|SyncManager|HTTP"
```

### Expected Success Logs:
```
POST https://api.hapetus.info/api/daily → 200 OK
Sync completed successfully
```

### Common Issues:

**401 Unauthorized**:
- Sign out and sign in again
- Firebase token might be expired

**Network Timeout**:
- Check internet connection
- Try again (should work offline anyway)

**Data not appearing on website**:
- Make sure signed in with SAME Google account
- Wait up to 10 seconds
- Check browser refresh

---

## ✅ Success Criteria

All 6 tests should PASS:
- [ ] Test 1: Android → Website sync
- [ ] Test 2: Offline mode works
- [ ] Test 3: Website → Android sync
- [ ] Test 4: Exercise sync
- [ ] Test 5: Delete sync
- [ ] Test 6: Initial data sync

If all pass: **Cloud sync is working perfectly!** 🎉

---

## 📊 Testing Notes

**Date**: _________________  
**Time**: _________________  
**Network**: WiFi / Mobile Data / Both tested  
**Battery before**: ________%  
**Battery after 30 min**: ________%  

**Overall Result**: ⬜ PASS / ⬜ FAIL  
**Notes**:
_______________________________________________
_______________________________________________
_______________________________________________

---

## 🎯 Next Steps After Testing

### If All Tests Pass:
1. ✅ Cloud sync confirmed working
2. ✅ Start using app normally
3. ✅ Monitor for any issues
4. ✅ Consider deploying to other users

### If Any Test Fails:
1. Document which test failed
2. Copy error logs from adb logcat
3. Report findings
4. We'll troubleshoot together

---

**Quick Start Testing Now**:
```bash
# 1. App is already installed on your phone
# 2. Open the app
# 3. Add a measurement
# 4. Check https://hapetus.info
# 5. See your data! 🎉
```
