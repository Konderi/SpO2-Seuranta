# Hapetus API Backend

**Cloudflare Workers** backend for the Hapetus SpO2 monitoring application.

## 🚀 Tech Stack

- **Cloudflare Workers**: Serverless API
- **Cloudflare D1**: SQL Database
- **Hono**: Fast web framework
- **TypeScript**: Type-safe development
- **Firebase Auth**: Authentication

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

## 🛠️ Setup

### 1. Install Dependencies

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

Copy the database ID from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "hapetus-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 4. Run Migrations

```bash
# Local development
npm run db:migrations:apply

# Production
npm run db:migrations:apply:remote
```

### 5. Set Environment Variables

Create `.dev.vars` file (for local development):

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` and add your Firebase credentials.

For production, use Wrangler secrets:

```bash
wrangler secret put FIREBASE_PROJECT_ID
wrangler secret put FIREBASE_PRIVATE_KEY
wrangler secret put FIREBASE_CLIENT_EMAIL
```

## 🏃 Development

```bash
# Start local development server
npm run dev
```

API will be available at `http://localhost:8787`

## 🚀 Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

## 📡 API Endpoints

### Public

- `GET /` - API info
- `GET /health` - Health check

### Authentication Required

**Daily Measurements**
- `GET /api/daily` - Get all daily measurements
- `GET /api/daily/range?start=&end=` - Get measurements by date range
- `POST /api/daily` - Create new measurement
- `PUT /api/daily/:id` - Update measurement
- `DELETE /api/daily/:id` - Delete measurement

**Exercise Measurements**
- `GET /api/exercise` - Get all exercise measurements
- `POST /api/exercise` - Create new measurement
- `DELETE /api/exercise/:id` - Delete measurement

**Statistics**
- `GET /api/stats/week` - 7-day averages
- `GET /api/stats/range?start=&end=` - Custom range statistics
- `GET /api/stats/daily?days=30` - Daily aggregates for charting

**User**
- `GET /api/user/profile` - Get or create user profile
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update user settings

## 🔒 Authentication

All `/api/*` endpoints require Firebase authentication token in the `Authorization` header:

```
Authorization: Bearer <firebase-id-token>
```

## 📊 Database Schema

See `migrations/0001_initial_schema.sql` for the complete database schema.

**Tables:**
- `users` - User profiles
- `user_settings` - User preferences and thresholds
- `daily_measurements` - Daily SpO2 and heart rate measurements
- `exercise_measurements` - Before/after exercise measurements

## 🔧 Configuration

Edit `wrangler.toml` to configure:
- Routes
- Environment variables
- Database bindings
- Workers settings

## 📝 License

MIT


## 🎯 Current Architecture

**We are currently using Firebase**, which provides:
- ✅ Authentication (Google Sign-In)
- ✅ Database (Cloud Firestore)
- ✅ Hosting (Firebase Hosting)
- ✅ Real-time sync
- ✅ $0/month cost for current usage

**This backend directory is for future consideration only.**

---

## 🤔 When Would We Use This?

Consider Cloudflare Workers + D1 if:
- We exceed Firebase free tier (>100 active users)
- We need edge computing for better global performance
- We want more control over the database schema (SQL)
- We need custom API logic that doesn't fit Firestore

---

## 🏗️ Potential Architecture

If we migrate to Cloudflare:

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts        # Authentication endpoints
│   │   ├── measurements.ts # Measurement CRUD
│   │   ├── statistics.ts  # Statistics calculations
│   │   └── users.ts       # User management
│   │
│   ├── db/
│   │   ├── schema.sql     # D1 database schema
│   │   └── queries.ts     # SQL queries
│   │
│   ├── middleware/
│   │   ├── auth.ts        # JWT verification
│   │   └── validation.ts  # Input validation
│   │
│   └── index.ts           # Main Worker entry point
│
├── wrangler.toml          # Cloudflare configuration
├── schema.sql             # Database migrations
├── package.json
└── tsconfig.json
```

---

## 📊 Cost Comparison

### Firebase (Current)
- 10 users: **$0/month**
- 100 users: **$0/month**
- 1,000 users: **~$10/month**

### Cloudflare (Potential)
- 10 users: **$0/month**
- 100 users: **$0/month**
- 1,000 users: **~$5/month**

**Recommendation**: Stay with Firebase until you have 100+ users.

---

## 🚀 Migration Plan (If Needed)

### Step 1: Parallel Operation
- Deploy Cloudflare Workers alongside Firebase
- Dual-write to both databases
- Test with subset of users

### Step 2: Data Migration
- Export data from Firestore
- Transform to SQL schema
- Import to D1 database
- Verify data integrity

### Step 3: Cutover
- Update mobile apps to use new API
- Monitor for issues
- Decommission Firebase after validation

**Estimated Effort**: 2-4 weeks  
**Estimated Downtime**: <1 hour

---

## 📖 Documentation

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

---

**Last Updated**: February 11, 2026  
**Status**: 📋 Optional / Future Consideration  
**Recommendation**: Stay with Firebase for now
