# 🚀 Deployment Guide - Hapetus Backend

## ✅ Step 1: Deploy Backend (DONE!)

Your backend is now live at:
- **Worker URL**: https://hapetus-api.toni-joronen.workers.dev
- **Custom Domain**: api.hapetus.info/* (pending DNS setup)
- **Version ID**: db16ced7-7372-4023-b6f6-b1fbf7706b77

---

## 🔐 Step 2: Configure Firebase Secrets

You need to set up Firebase Authentication secrets for the backend to verify user tokens.

### Option A: Using Existing Firebase Project

If you already have a Firebase project for the Android app:

1. **Get Service Account Credentials**:
   ```bash
   # Go to Firebase Console
   # https://console.firebase.google.com
   
   # Navigate to: Project Settings > Service Accounts > Generate New Private Key
   # This downloads a JSON file with your credentials
   ```

2. **Set Wrangler Secrets**:
   ```bash
   cd backend
   
   # From the downloaded JSON file, extract and set:
   wrangler secret put FIREBASE_PROJECT_ID
   # Enter: your-project-id
   
   wrangler secret put FIREBASE_CLIENT_EMAIL
   # Enter: firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   
   wrangler secret put FIREBASE_PRIVATE_KEY
   # Enter: -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
   # Note: Copy the entire key including the BEGIN/END lines
   ```

### Option B: Create New Firebase Project

If you don't have a Firebase project yet:

1. **Create Firebase Project**:
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Name it "Hapetus" or "SpO2-Seuranta"
   - Disable Google Analytics (optional)
   - Click "Create project"

2. **Enable Authentication**:
   - Go to Build > Authentication
   - Click "Get started"
   - Enable "Email/Password" sign-in method
   - Enable "Google" sign-in method (optional)

3. **Get Web App Config** (for website and Android):
   - Go to Project Settings > General
   - Under "Your apps", click web icon (</>) to add web app
   - Register app as "Hapetus Web"
   - Copy the firebaseConfig values

4. **Get Service Account** (for backend):
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file
   - Use values to set secrets (see Option A step 2)

---

## 🌐 Step 3: Configure DNS

Point your custom domain to the Cloudflare Workers:

### DNS Records to Add:

```
Type: CNAME
Name: api.hapetus.info
Target: hapetus-api.toni-joronen.workers.dev
Proxy: Enabled (Orange cloud)
```

Or if using Cloudflare for DNS:

1. Go to Cloudflare Dashboard > Workers & Pages
2. Click on "hapetus-api"
3. Go to Settings > Triggers > Custom Domains
4. Click "Add Custom Domain"
5. Enter: `api.hapetus.info`
6. Cloudflare will automatically configure DNS

### Verify DNS:
```bash
# Wait a few minutes, then test:
curl https://api.hapetus.info/health

# Should return:
# {"status":"ok","timestamp":"..."}
```

---

## 🧪 Step 4: Test the API

### Test Health Check (No Auth Required):
```bash
curl https://api.hapetus.info/health
```

### Test Info Endpoint (No Auth Required):
```bash
curl https://api.hapetus.info/api/info
```

### Test with Authentication:

First, you need a Firebase auth token. You can get one by:

1. **Using Firebase Auth in Browser**:
   ```javascript
   // In browser console after logging in:
   firebase.auth().currentUser.getIdToken().then(token => console.log(token));
   ```

2. **Test API with Token**:
   ```bash
   curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     https://api.hapetus.info/api/user/profile
   ```

---

## 📱 Step 5: Update Website Configuration

Update the website's `.env.local` file:

```env
# Firebase Configuration (from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Configuration
NEXT_PUBLIC_API_URL=https://api.hapetus.info
```

---

## 🤖 Step 6: Update Android App Configuration

Update Android app to use the production API:

1. **Update `app/build.gradle.kts`**:
   ```kotlin
   buildConfigField("String", "API_BASE_URL", "\"https://api.hapetus.info\"")
   ```

2. **Add Firebase to Android** (if not already done):
   - Download `google-services.json` from Firebase Console
   - Place in `android/app/` directory
   - Add Firebase SDK dependencies

---

## 🔍 Step 7: Monitor and Debug

### View Logs:
```bash
cd backend
wrangler tail
```

### View Analytics:
- Go to Cloudflare Dashboard
- Workers & Pages > hapetus-api
- View metrics, requests, errors

### Common Issues:

**Issue: "Firebase token verification failed"**
- Check that secrets are set correctly
- Verify FIREBASE_PRIVATE_KEY includes `\n` for newlines
- Test token is not expired (tokens expire after 1 hour)

**Issue: "CORS error"**
- Check CORS_ORIGIN matches your website domain
- Ensure website is using HTTPS

**Issue: "Database error"**
- Verify migrations were applied: `npm run db:migrations:apply:remote`
- Check D1 database binding in wrangler.toml

---

## 📊 Current Status

✅ **Backend Deployed**: https://hapetus-api.toni-joronen.workers.dev  
⏳ **Custom Domain**: Pending DNS configuration  
⏳ **Firebase Secrets**: Needs configuration  
⏳ **Website**: Ready to deploy  
⏳ **Android App**: Ready for API integration  

---

## 🎯 Next Immediate Actions

1. **Set up Firebase secrets** (highest priority - enables authentication)
2. **Configure DNS** for api.hapetus.info (enables custom domain)
3. **Test API** with Firebase token (verify everything works)
4. **Deploy website** to Cloudflare Pages (Phase 2B)
5. **Update Android app** to use API (Phase 2C)

---

## 🆘 Need Help?

### Firebase Setup Issues:
- Documentation: https://firebase.google.com/docs/admin/setup
- Service Account: https://firebase.google.com/docs/admin/setup#initialize-sdk

### Cloudflare Workers Issues:
- Documentation: https://developers.cloudflare.com/workers/
- Secrets: https://developers.cloudflare.com/workers/configuration/secrets/

### DNS Issues:
- Custom Domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/

---

<div align="center">

**🎉 Backend Successfully Deployed! 🎉**

Your API is live and ready to handle requests!

[View API Docs](./API.md) • [View Completion Summary](./COMPLETION.md)

</div>
