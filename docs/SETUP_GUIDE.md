# Hapetus - Setup Guide

Complete setup instructions for the Hapetus SpO2 monitoring platform.

## 🏗️ Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Android App    │◀───────▶│   Firebase Auth  │◀───────▶│     Website     │
└─────────────────┘         └──────────────────┘         └─────────────────┘
         │                           │                            │
         │                           ▼                            │
         │                  ┌──────────────────┐                 │
         └─────────────────▶│ Cloudflare API   │◀────────────────┘
                            │    (Workers)     │
                            └──────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │ Cloudflare D1    │
                            │   (Database)     │
                            └──────────────────┘
```

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Wrangler CLI**: `npm install -g wrangler`
- **Cloudflare Account** (free tier is sufficient)
- **Firebase Project** (already set up)
- **Android Studio** (for Android app development)

## 🚀 Phase 2A: Backend Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
wrangler d1 create hapetus-db
```

**Important:** Copy the `database_id` from the output and update `backend/wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "hapetus-db"
database_id = "YOUR_DATABASE_ID_HERE"  # ← Paste here
```

### 4. Run Database Migrations

```bash
# Local development database
npm run db:migrations:apply

# Production database (after deployment)
npm run db:migrations:apply:remote
```

### 5. Configure Environment Variables

**For Local Development:**

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` and add your Firebase credentials:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
CORS_ORIGIN=http://localhost:3000
```

**For Production:**

```bash
wrangler secret put FIREBASE_PROJECT_ID
wrangler secret put FIREBASE_PRIVATE_KEY
wrangler secret put FIREBASE_CLIENT_EMAIL
```

### 6. Start Local Development Server

```bash
npm run dev
```

API will be available at: `http://localhost:8787`

### 7. Deploy to Production

```bash
npm run deploy
```

After deployment, update your `wrangler.toml` route to use your domain:

```toml
route = "api.hapetus.info/*"
```

## 🌐 Phase 2B: Website Setup

### 1. Install Website Dependencies

```bash
cd web
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Firebase and API configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_API_URL=https://api.hapetus.info
```

### 3. Start Local Development Server

```bash
npm run dev
```

Website will be available at: `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

### 5. Deploy to Cloudflare Pages

```bash
# Build for Cloudflare Pages
npm run pages:build

# Deploy
npm run pages:deploy
```

**Or use Cloudflare Dashboard:**

1. Go to Cloudflare Dashboard → Pages
2. Create new project
3. Connect your GitHub repository
4. Set build settings:
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`
5. Add environment variables from `.env.local`
6. Deploy!

## 📱 Phase 2C: Android App Updates

### 1. Add Retrofit Dependency

Edit `android/app/build.gradle.kts`:

```kotlin
dependencies {
    // Existing dependencies...
    
    // Retrofit for API calls
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
}
```

### 2. Create API Service

Create new file: `android/app/src/main/java/com/konderi/spo2seuranta/data/remote/ApiService.kt`

```kotlin
interface ApiService {
    @GET("api/daily")
    suspend fun getDailyMeasurements(): Response<List<DailyMeasurement>>
    
    @POST("api/daily")
    suspend fun createDailyMeasurement(@Body measurement: DailyMeasurement): Response<Unit>
    
    // Add other endpoints...
}
```

### 3. Update Repositories

Modify repositories to use API instead of Room directly:

```kotlin
class DailyMeasurementRepository @Inject constructor(
    private val apiService: ApiService,
    private val localDao: DailyMeasurementDao  // Keep for offline caching
) {
    suspend fun getMeasurements(): List<DailyMeasurement> {
        return try {
            // Try to fetch from API
            val response = apiService.getDailyMeasurements()
            if (response.isSuccessful) {
                response.body()?.also { measurements ->
                    // Cache locally
                    localDao.insertAll(measurements)
                } ?: emptyList()
            } else {
                // Fallback to local cache
                localDao.getAll()
            }
        } catch (e: Exception) {
            // Offline mode: use local cache
            localDao.getAll()
        }
    }
}
```

### 4. Test Integration

1. Start backend locally: `cd backend && npm run dev`
2. Update `local.properties` with API URL: `API_URL=http://10.0.2.2:8787` (for emulator)
3. Run Android app and test API calls

## 🔧 Domain Configuration

### 1. Configure DNS (Cloudflare Dashboard)

Add these DNS records:

```
Type: A
Name: @
Content: [Cloudflare Pages IP]
Proxied: Yes

Type: CNAME
Name: api
Content: [Your Workers subdomain]
Proxied: Yes

Type: CNAME
Name: www
Content: hapetus.info
Proxied: Yes
```

### 2. Update SSL/TLS Settings

- SSL/TLS encryption mode: **Full (strict)**
- Always Use HTTPS: **On**
- Minimum TLS Version: **TLS 1.2**

## ✅ Verification Checklist

- [ ] Backend API running locally
- [ ] Database migrations applied
- [ ] Website running locally
- [ ] Firebase Auth working on website
- [ ] API calls from website working
- [ ] Android app making API calls
- [ ] Data syncing between Android and web
- [ ] Backend deployed to Cloudflare Workers
- [ ] Website deployed to Cloudflare Pages
- [ ] DNS configured correctly
- [ ] SSL/HTTPS working

## 📊 Monitoring & Maintenance

### View Logs

```bash
# Backend logs
cd backend
wrangler tail

# Website logs (Cloudflare Pages Dashboard)
```

### Database Management

```bash
# Query database
wrangler d1 execute hapetus-db --command="SELECT * FROM users LIMIT 5"

# Export data
wrangler d1 export hapetus-db --output=backup.sql
```

## 🆘 Troubleshooting

### Backend Issues

- **CORS errors**: Check `wrangler.toml` CORS_ORIGIN setting
- **Auth errors**: Verify Firebase credentials in secrets
- **Database errors**: Ensure migrations ran successfully

### Website Issues

- **Build errors**: Check Node.js version (18+)
- **Auth not working**: Verify Firebase config in `.env.local`
- **API calls failing**: Check NEXT_PUBLIC_API_URL

### Android App Issues

- **API timeout**: Check network permissions in AndroidManifest.xml
- **Auth token**: Ensure Firebase Auth token is being sent
- **Offline mode**: Verify Room database fallback

## 📝 Next Steps

1. ✅ Complete backend setup
2. ✅ Complete website setup
3. ⏳ Update Android app to use API
4. ⏳ Test end-to-end flow
5. ⏳ Deploy to production
6. ⏳ Monitor and optimize

## 🔗 Useful Links

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Next.js Docs](https://nextjs.org/docs)

## 💰 Cost Estimate (10 users)

- **Cloudflare Workers**: FREE (well under limits)
- **Cloudflare D1**: FREE (well under limits)
- **Cloudflare Pages**: FREE (unlimited bandwidth)
- **Firebase Auth**: FREE (under 3K MAU)
- **Domain (hapetus.info)**: ~$10-15/year

**Total Monthly Cost: $0** 🎉
