# Website Deployment Guide - Cloudflare Pages

**Date:** February 11, 2026  
**Target Domain:** hapetus.info  
**API:** https://api.hapetus.info ✅

---

## Prerequisites

- ✅ Backend API deployed and secured
- ✅ Custom domain `hapetus.info` in Cloudflare
- ✅ Firebase project `spo2-seuranta` configured
- 🔄 Website ready to deploy

---

## Step 1: Install Dependencies

```bash
cd web
npm install
```

---

## Step 2: Get Firebase Configuration

You need the Firebase web app configuration. Get it from:

**Firebase Console**: https://console.firebase.google.com/

1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. If you don't have a web app yet:
   - Click "Add app" → Choose Web (</> icon)
   - Register app name: "Hapetus Web"
   - Enable Firebase Hosting: No (we're using Cloudflare)
   - Click "Register app"
4. Copy the `firebaseConfig` values

You'll need:
- API Key
- Auth Domain
- Project ID
- Storage Bucket
- Messaging Sender ID
- App ID

---

## Step 3: Configure Environment Variables

Create `.env.local` for local development:

```bash
# In web directory
cp .env.example .env.local
```

Edit `.env.local` with your Firebase values:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=spo2-seuranta.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=spo2-seuranta
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=spo2-seuranta.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# API Configuration
NEXT_PUBLIC_API_URL=https://api.hapetus.info
```

---

## Step 4: Test Build Locally

Before deploying, test that the build works:

```bash
# Still in web directory
npm run build
```

This should create an `out` directory with static files.

---

## Step 5: Deploy to Cloudflare Pages

### Option A: Using Cloudflare Dashboard (Recommended for First Deployment)

1. **Login to Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com/
   - Navigate to "Workers & Pages"

2. **Create New Pages Project**
   - Click "Create application"
   - Choose "Pages" tab
   - Click "Connect to Git"

3. **Connect GitHub Repository**
   - Authorize Cloudflare to access your GitHub account
   - Select repository: `Konderi/SpO2-Seuranta`
   - Click "Begin setup"

4. **Configure Build Settings**
   ```
   Project name: hapetus-web
   Production branch: main
   Framework preset: Next.js
   Build command: cd web && npm install && npm run build
   Build output directory: web/out
   Root directory: (leave empty or set to /)
   ```

5. **Set Environment Variables**
   Click "Add environment variable" for each:
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = [your-api-key]
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = spo2-seuranta.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = spo2-seuranta
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = spo2-seuranta.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [your-sender-id]
   NEXT_PUBLIC_FIREBASE_APP_ID = [your-app-id]
   NEXT_PUBLIC_API_URL = https://api.hapetus.info
   ```

6. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete (3-5 minutes)
   - You'll get a temporary URL like: `hapetus-web.pages.dev`

7. **Configure Custom Domain**
   - Go to your Pages project → "Custom domains"
   - Click "Set up a custom domain"
   - Enter: `hapetus.info`
   - Click "Continue"
   - Cloudflare will automatically configure DNS (since domain is already in Cloudflare)
   - Also add `www.hapetus.info` to redirect to main domain

### Option B: Using Wrangler CLI

If you prefer command-line deployment:

```bash
# Install wrangler globally if not already
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the site
npm run build

# Deploy to Pages
wrangler pages deploy out --project-name=hapetus-web

# Set environment variables (do this once)
wrangler pages secret put NEXT_PUBLIC_FIREBASE_API_KEY --project-name=hapetus-web
wrangler pages secret put NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN --project-name=hapetus-web
wrangler pages secret put NEXT_PUBLIC_FIREBASE_PROJECT_ID --project-name=hapetus-web
wrangler pages secret put NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET --project-name=hapetus-web
wrangler pages secret put NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --project-name=hapetus-web
wrangler pages secret put NEXT_PUBLIC_FIREBASE_APP_ID --project-name=hapetus-web
wrangler pages secret put NEXT_PUBLIC_API_URL --project-name=hapetus-web
```

---

## Step 6: Configure Firebase Authentication Domains

After deploying, you need to add your domain to Firebase's authorized domains:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: `spo2-seuranta`
3. Go to "Authentication" → "Settings" → "Authorized domains"
4. Add these domains:
   - `hapetus.info`
   - `www.hapetus.info`
   - `hapetus-web.pages.dev` (your Cloudflare Pages URL)
   - `localhost` (for local development)

---

## Step 7: Test the Deployment

### Test Basic Access
```bash
curl -I https://hapetus.info
# Should return 200 OK
```

### Test Pages
1. **Home Page**: https://hapetus.info
   - Should show landing page
2. **Login Page**: https://hapetus.info/login
   - Should show login form
3. **Dashboard**: https://hapetus.info/dashboard
   - Should redirect to login if not authenticated

### Test Authentication Flow
1. Click "Kirjaudu" (Login)
2. Try Google Sign-In
3. After login, should redirect to dashboard
4. Should be able to add measurements

### Test API Integration
Open browser console and check:
- No CORS errors
- API calls go to `https://api.hapetus.info`
- Firebase token is sent in Authorization header

---

## Step 8: Configure Redirect Rules (Optional)

If you want to redirect www to non-www (or vice versa):

1. In Cloudflare Pages project settings
2. Go to "Functions" → "Redirects"
3. Add redirect rule:
   ```
   /www.hapetus.info/* → /hapetus.info/:splat
   ```

---

## Troubleshooting

### Build Fails

**Problem**: Build fails with module errors  
**Solution**: Make sure all dependencies are in `package.json`, not just `devDependencies`

**Problem**: Environment variables not working  
**Solution**: In Cloudflare Pages, variables must start with `NEXT_PUBLIC_` to be available in browser

### CORS Errors

**Problem**: API calls blocked by CORS  
**Solution**: Make sure `hapetus.info` is in the backend CORS whitelist (already done ✅)

### Authentication Fails

**Problem**: Firebase auth doesn't work  
**Solution**: Check that domain is added to Firebase authorized domains

**Problem**: "Invalid API key"  
**Solution**: Double-check all Firebase environment variables in Cloudflare Pages settings

### Routing Issues

**Problem**: Direct navigation to `/dashboard` returns 404  
**Solution**: Configure Cloudflare Pages "Redirects & Headers":
- Add `_redirects` file in `public/`:
  ```
  /* /index.html 200
  ```

---

## Deployment Checklist

Before going live:

- [ ] Build succeeds locally (`npm run build`)
- [ ] All environment variables set in Cloudflare Pages
- [ ] Custom domain `hapetus.info` configured
- [ ] DNS pointing to Cloudflare Pages (automatic if domain in Cloudflare)
- [ ] SSL certificate active (automatic with Cloudflare)
- [ ] Firebase authorized domains include `hapetus.info`
- [ ] Google Sign-In tested and working
- [ ] Can create/view measurements
- [ ] API integration working (no CORS errors)
- [ ] Mobile responsive design tested
- [ ] Analytics configured (optional)

---

## Post-Deployment

### Continuous Deployment

Cloudflare Pages will automatically rebuild and deploy when you:
- Push to `main` branch on GitHub
- Changes are detected in the `web/` directory

### Monitoring

- **Cloudflare Dashboard**: Monitor traffic and analytics
- **Firebase Console**: Monitor authentication and users
- **Cloudflare Workers**: Monitor API performance at api.hapetus.info

### Updates

To update the website:
```bash
# Make changes in web/
git add web/
git commit -m "Update website"
git push origin main

# Cloudflare Pages will auto-deploy
```

---

## Expected Timeline

- Install dependencies: 2-3 minutes
- Get Firebase config: 5 minutes
- Local build test: 2 minutes
- Cloudflare Pages setup: 10 minutes
- First deployment: 5 minutes
- Custom domain DNS: Instant (domain already in Cloudflare)
- Firebase auth setup: 3 minutes
- Testing: 10 minutes

**Total: ~35-40 minutes**

---

## Success Criteria

✅ Website accessible at https://hapetus.info  
✅ SSL certificate active (HTTPS)  
✅ Google Sign-In working  
✅ Can create daily measurements  
✅ Can create exercise measurements  
✅ Dashboard shows statistics  
✅ Data syncs with API  
✅ No console errors  
✅ Mobile responsive  

---

## Support

If you encounter issues:

1. Check Cloudflare Pages build logs
2. Check browser console for errors
3. Check Firebase Console for auth errors
4. Verify API is responding: `curl https://api.hapetus.info/health`
5. Check environment variables in Cloudflare Pages settings

---

**Ready to deploy? Let's start with getting your Firebase configuration!**
