# Hapetus API Documentation

## 🚀 Base URL

- **Development**: `http://localhost:8787`
- **Production**: `https://api.hapetus.info`

## 🔐 Authentication

All `/api/*` endpoints require Firebase Authentication. Include the Firebase ID token in the `Authorization` header:

```http
Authorization: Bearer <firebase-id-token>
```

## 📡 Endpoints

### Public Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok"
}
```

#### API Info
```http
GET /
```
**Response:**
```json
{
  "name": "Hapetus API",
  "version": "1.0.0",
  "status": "healthy",
  "timestamp": "2026-02-11T10:30:00.000Z"
}
```

---

### Daily Measurements

#### Get All Daily Measurements
```http
GET /api/daily
Authorization: Bearer <token>
```
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "user123",
      "spo2": 98,
      "heart_rate": 72,
      "notes": "Feeling good",
      "measured_at": 1707648000,
      "created_at": 1707648000,
      "updated_at": 1707648000
    }
  ]
}
```

#### Get Daily Measurements by Date Range
```http
GET /api/daily/range?start=1707561600&end=1707648000
Authorization: Bearer <token>
```
**Query Parameters:**
- `start` (required): Unix timestamp
- `end` (required): Unix timestamp

#### Create Daily Measurement
```http
POST /api/daily
Authorization: Bearer <token>
Content-Type: application/json

{
  "spo2": 98,
  "heart_rate": 72,
  "notes": "Optional notes",
  "measured_at": 1707648000
}
```
**Validation:**
- `spo2`: 50-100
- `heart_rate`: 30-250

**Response:**
```json
{
  "message": "Measurement created successfully",
  "data": {
    "id": "uuid",
    "spo2": 98,
    "heart_rate": 72,
    "notes": "Optional notes",
    "measured_at": 1707648000
  }
}
```

#### Update Daily Measurement
```http
PUT /api/daily/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "spo2": 99,
  "heart_rate": 70,
  "notes": "Updated notes"
}
```

#### Delete Daily Measurement
```http
DELETE /api/daily/:id
Authorization: Bearer <token>
```

---

### Exercise Measurements

#### Get All Exercise Measurements
```http
GET /api/exercise
Authorization: Bearer <token>
```

#### Create Exercise Measurement
```http
POST /api/exercise
Authorization: Bearer <token>
Content-Type: application/json

{
  "exercise_type": "Walking",
  "exercise_duration": 1800,
  "spo2_before": 98,
  "heart_rate_before": 72,
  "spo2_after": 96,
  "heart_rate_after": 110,
  "notes": "Optional notes",
  "measured_at": 1707648000
}
```

**Response:**
```json
{
  "message": "Exercise measurement created successfully",
  "data": {
    "id": "uuid",
    "exercise_type": "Walking",
    "spo2_before": 98,
    "heart_rate_before": 72,
    "spo2_after": 96,
    "heart_rate_after": 110
  }
}
```

#### Delete Exercise Measurement
```http
DELETE /api/exercise/:id
Authorization: Bearer <token>
```

---

### Statistics

#### Get 7-Day Averages
```http
GET /api/stats/week
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "avg_spo2": 97.5,
    "avg_heart_rate": 75.2,
    "min_spo2": 94,
    "max_spo2": 100,
    "min_heart_rate": 65,
    "max_heart_rate": 85,
    "count": 42
  }
}
```

#### Get Statistics for Custom Date Range
```http
GET /api/stats/range?start=1707561600&end=1707648000
Authorization: Bearer <token>
```

**Query Parameters:**
- `start` (required): Unix timestamp
- `end` (required): Unix timestamp

#### Get Daily Aggregates for Charting
```http
GET /api/stats/daily?days=30
Authorization: Bearer <token>
```

**Query Parameters:**
- `days` (optional): Number of days (default: 30)

**Response:**
```json
{
  "data": [
    {
      "date": "2026-02-11",
      "avg_spo2": 98.0,
      "avg_heart_rate": 72.0,
      "min_spo2": 96,
      "max_spo2": 100,
      "count": 3
    }
  ]
}
```

---

### User Profile & Settings

#### Get or Create User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "display_name": "John Doe",
    "created_at": 1707648000,
    "updated_at": 1707648000,
    "last_login": 1707648000
  }
}
```

#### Get User Settings
```http
GET /api/user/settings
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "user_id": "user123",
    "spo2_low_threshold": 90,
    "spo2_high_threshold": 100,
    "heart_rate_low_threshold": 50,
    "heart_rate_high_threshold": 120,
    "large_font_enabled": 0,
    "notifications_enabled": 1,
    "created_at": 1707648000,
    "updated_at": 1707648000
  }
}
```

#### Update User Settings
```http
PUT /api/user/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "spo2_low_threshold": 92,
  "spo2_high_threshold": 100,
  "heart_rate_low_threshold": 55,
  "heart_rate_high_threshold": 115,
  "large_font_enabled": true,
  "notifications_enabled": true
}
```

---

## 🔥 Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (not owner of resource)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## 🧪 Testing with cURL

### Get health status
```bash
curl http://localhost:8787/health
```

### Create daily measurement (with auth)
```bash
curl -X POST http://localhost:8787/api/daily \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "spo2": 98,
    "heart_rate": 72,
    "measured_at": 1707648000
  }'
```

### Get weekly statistics
```bash
curl http://localhost:8787/api/stats/week \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

## 📊 Database Schema

### Tables

- **users**: User profiles
- **user_settings**: User preferences and thresholds
- **daily_measurements**: Daily SpO2 and heart rate measurements
- **exercise_measurements**: Before/after exercise measurements

See `migrations/0001_initial_schema.sql` for complete schema.

---

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Deploy to Production
```bash
npm run deploy
```

### Apply Migrations
```bash
# Local
npm run db:migrations:apply

# Production
npm run db:migrations:apply:remote
```

---

## 📝 Notes

- All timestamps are Unix timestamps (seconds since epoch)
- SpO2 values: 50-100 (%)
- Heart rate values: 30-250 (BPM)
- Firebase Auth tokens expire after 1 hour
- Database connection is automatically managed by Cloudflare D1
