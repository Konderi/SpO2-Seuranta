# 🔐 Firebase Setup Guide - Step by Step

This guide will help you configure Firebase authentication for the Hapetus backend API.

---

## 📋 Prerequisites

You need a Firebase project. Let's check what you have:

### Option A: You already have a Firebase project (for Android app)

If you created a Firebase project when setting up the Android app, we can use that same project!

### Option B: You need to create a new Firebase project

We'll create one together now.

---

## 🚀 Step 1: Access Firebase Console

1. Open your browser
2. Go to: https://console.firebase.google.com
3. Sign in with your Google account

---

## 🎯 Step 2: Check for Existing Project or Create New

### If you see a project (likely named "SpO2-Seuranta" or similar):
✅ **Great!** Click on it and skip to Step 3.

### If you don't have a project:
1. Click **"Add project"** or **"Create a project"**
2. **Project name**: Enter `Hapetus` (or `SpO2-Seuranta`)
3. **Google Analytics**: You can disable this (optional for health monitoring)
4. Click **"Create project"**
5. Wait for project creation (takes ~30 seconds)
6. Click **"Continue"**

---

## 🔑 Step 3: Generate Service Account Key

This is what we need for the backend API to verify user tokens.

1. In Firebase Console, click the **⚙️ gear icon** (top left, next to "Project Overview")
2. Click **"Project settings"**
3. Go to the **"Service accounts"** tab (top menu)
4. You should see: "Firebase Admin SDK"
5. Click the button **"Generate new private key"**
6. A popup appears warning you to keep it secure
7. Click **"Generate key"**
8. A JSON file downloads to your computer (something like `hapetus-xxxxx-firebase-adminsdk-xxxxx.json`)

⚠️ **IMPORTANT**: Keep this file safe! Don't share it publicly.

---

## 📝 Step 4: Extract Credentials from JSON

Open the downloaded JSON file with a text editor. You'll see something like:

```json
{
  "type": "service_account",
  "project_id": "hapetus-xxxxx",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@hapetus-xxxxx.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  ...
}
```

You need these three values:
1. **`project_id`**: Example: `hapetus-xxxxx`
2. **`client_email`**: Example: `firebase-adminsdk-xxxxx@hapetus-xxxxx.iam.gserviceaccount.com`
3. **`private_key`**: The entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

---

## 💻 Step 5: Set Secrets in Cloudflare Workers

Now we'll configure these as secrets in your deployed backend.

### Open Terminal and navigate to backend:

```bash
cd "/Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/backend"
```

### Set each secret:

#### 1. Set Project ID:
```bash
wrangler secret put FIREBASE_PROJECT_ID
```
When prompted, paste your `project_id` value and press Enter.

#### 2. Set Client Email:
```bash
wrangler secret put FIREBASE_CLIENT_EMAIL
```
When prompted, paste your `client_email` value and press Enter.

#### 3. Set Private Key:
```bash
wrangler secret put FIREBASE_PRIVATE_KEY
```
When prompted, paste the ENTIRE `private_key` value (including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines) and press Enter.

⚠️ **Important for Private Key**: 
- Copy the ENTIRE key including newlines (`\n`)
- If it doesn't work, try replacing `\n` with actual newlines

---

## ✅ Step 6: Verify Secrets Are Set

Check that all secrets are configured:

```bash
wrangler secret list
```

You should see:
```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

---

## 🧪 Step 7: Test the API

Let's test that authentication works!

### First, get a test token from Firebase:

You can use the Firebase Auth Emulator or get a token from your Android app when you sign in.

For quick testing, you can use this approach:

1. Go to: https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication
2. Click "Users" tab
3. If no users exist, click "Add user" and create a test user
4. To get a token, you'll need to sign in through your Android app or use Firebase SDK

### Test an authenticated endpoint:

```bash
curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  https://hapetus-api.toni-joronen.workers.dev/api/user/profile
```

If it works, you'll get a response creating/fetching the user profile!

---

## 🎉 Success!

Once the secrets are set and tested, your backend API is fully operational with authentication!

**Next steps:**
- Configure custom domain (api.hapetus.info)
- Deploy website
- Integrate Android app with API

---

## 🆘 Troubleshooting

### "Error: Failed to verify token"
- Check that you copied the entire private key
- Ensure the key includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Try replacing `\n` in the key with actual newline characters

### "Error: Invalid project ID"
- Verify you copied the correct `project_id` from the JSON
- Check for extra spaces or quotes

### "Secret not found"
- Run `wrangler secret list` to verify secrets are set
- If missing, set them again with `wrangler secret put`

---

## 📞 Need Help?

If you encounter issues, we can debug together! Just let me know what error message you're seeing.

---

**Ready to set the secrets? Let me know when you have the JSON file!**
