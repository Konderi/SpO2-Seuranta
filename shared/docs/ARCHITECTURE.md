# Hapetus - Technical Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Website    │  │   Android    │  │     iOS      │     │
│  │  (Next.js)   │  │   (Kotlin)   │  │   (Swift)    │     │
│  │              │  │              │  │              │     │
│  │ hapetus.info │  │ Play Store   │  │  App Store   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
          ┌─────────────────▼─────────────────┐
          │      AUTHENTICATION LAYER          │
          │                                    │
          │    Firebase Authentication         │
          │    - Google Sign-In                │
          │    - JWT Tokens                    │
          │    - Multi-device Support          │
          └─────────────────┬─────────────────┘
                            │
          ┌─────────────────▼─────────────────┐
          │         API LAYER                  │
          │                                    │
          │   Backend Options:                 │
          │   Option A: Firebase               │
          │   Option B: Cloudflare Workers     │
          │                                    │
          └─────────────────┬─────────────────┘
                            │
          ┌─────────────────▼─────────────────┐
          │       DATABASE LAYER               │
          │                                    │
          │   Database Options:                │
          │   Option A: Firebase Firestore     │
          │   Option B: Cloudflare D1 (SQLite) │
          │                                    │
          └────────────────────────────────────┘
```

---

## 🤔 Architecture Decision: Firebase vs. Cloudflare

### Current State
- ✅ **Android App**: Already using Firebase Authentication
- ✅ **Firebase Project**: Already set up in Google Cloud

### Option A: Firebase Ecosystem (Recommended for your use case)

#### Pros
1. ✅ **Already Integrated**: Android app uses Firebase Auth
2. ✅ **Zero Migration**: No need to change existing app
3. ✅ **Generous Free Tier**: Perfect for 10 users
4. ✅ **Real-time Sync**: Firestore provides real-time updates
5. ✅ **Easy Setup**: Firebase Hosting for website
6. ✅ **Integrated Analytics**: Firebase Analytics included

#### Cons
1. ❌ **Vendor Lock-in**: Tied to Google ecosystem
2. ❌ **Scaling Costs**: Expensive at scale (not relevant for 10 users)

#### Cost Estimate (10 users)
```
Firebase Free Tier ("Spark Plan"):
├─ Authentication:     Unlimited (FREE)
├─ Firestore:
│  ├─ Reads:           50,000/day (FREE)
│  ├─ Writes:          20,000/day (FREE)
│  ├─ Storage:         1 GB (FREE)
│  └─ Estimated usage: ~500 reads/day, ~100 writes/day
├─ Hosting:            10 GB/month (FREE)
└─ Functions:          125K invocations/month (FREE)

💰 TOTAL COST: $0/month (within free tier)
```

**Realistic Monthly Usage (10 active users):**
- Daily measurements: 10 users × 2 measurements = 20 writes/day
- Reports viewed: 10 users × 10 views = 100 reads/day
- Storage: ~10 MB (years of data)

**Result**: You'll stay within the free tier indefinitely.

---

### Option B: Cloudflare Workers + D1

#### Pros
1. ✅ **Modern Stack**: Latest serverless technology
2. ✅ **Edge Performance**: Faster global response times
3. ✅ **Lower Long-term Costs**: Cheaper at scale
4. ✅ **Full Control**: SQL database (D1)

#### Cons
1. ❌ **Migration Required**: Must change Android app auth
2. ❌ **More Complex**: Build custom API layer
3. ❌ **No Real-time**: Must implement polling
4. ❌ **Learning Curve**: New stack to learn

#### Cost Estimate (10 users)
```
Cloudflare Workers Free Tier:
├─ Workers:            100,000 requests/day (FREE)
├─ D1 Database:        
│  ├─ Reads:           5M rows/day (FREE)
│  ├─ Writes:          100K rows/day (FREE)
│  └─ Storage:         5 GB (FREE)
└─ Pages (hosting):    Unlimited (FREE)

💰 TOTAL COST: $0/month (within free tier)
```

---

## 🎯 Recommendation: Firebase (Option A)

### Why Firebase is Better for Your Project

1. **No Migration**: Android app already uses Firebase Auth
2. **Faster Development**: Focus on features, not infrastructure
3. **Real-time Updates**: Automatic sync across devices
4. **Perfect for 10 Users**: Will stay free forever
5. **Easy Website Integration**: Firebase SDK for web is excellent
6. **Future-Proof**: Can migrate later if needed (10 users → 10,000 users)

### When to Consider Cloudflare
- If you expect rapid scaling (1000+ users)
- If you need edge computing features
- If you want SQL database structure
- If you're building a brand new project from scratch

---

## 🏗️ Recommended Architecture (Firebase)

### Tech Stack

```yaml
Frontend (Web):
  Framework: Next.js 14+ (App Router)
  Language: TypeScript
  Styling: Tailwind CSS
  UI Components: shadcn/ui + custom components
  Charts: Recharts
  Authentication: Firebase Auth SDK
  Database: Firebase Firestore SDK
  Hosting: Firebase Hosting
  
Backend:
  Platform: Firebase
  Authentication: Firebase Authentication
  Database: Cloud Firestore
  Functions: Cloud Functions (if needed)
  Storage: Cloud Storage (for future features)
  
Mobile Apps:
  Android: Kotlin + Jetpack Compose (existing)
  iOS: Swift + SwiftUI (future)
  Auth: Firebase Auth SDK
  Database: Firestore SDK with offline persistence
```

---

## 📊 Database Schema (Firestore)

### Collections Structure

```typescript
// Collection: users
users/{userId}
  ├─ email: string
  ├─ displayName: string
  ├─ photoURL: string
  ├─ createdAt: timestamp
  ├─ lastLoginAt: timestamp
  └─ settings: {
      alertThreshold: number (70-95)
      largeFont: boolean
      language: string
    }

// Collection: dailyMeasurements
dailyMeasurements/{measurementId}
  ├─ userId: string (indexed)
  ├─ spo2: number (50-100)
  ├─ heartRate: number (30-220)
  ├─ notes: string?
  ├─ timestamp: timestamp (indexed)
  └─ createdAt: timestamp

// Collection: exerciseMeasurements
exerciseMeasurements/{measurementId}
  ├─ userId: string (indexed)
  ├─ exerciseDescription: string
  ├─ beforeMeasurement: {
  │   spo2: number
  │   heartRate: number
  │   timestamp: timestamp
  │ }
  ├─ afterMeasurement: {
  │   spo2: number
  │   heartRate: number
  │   timestamp: timestamp
  │ }
  ├─ spo2Change: number (calculated)
  ├─ heartRateChange: number (calculated)
  └─ createdAt: timestamp (indexed)
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function: Check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function: Check if user owns the document
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
    }
    
    // Daily measurements
    match /dailyMeasurements/{measurementId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isSignedIn() && 
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.spo2 >= 50 &&
                       request.resource.data.spo2 <= 100 &&
                       request.resource.data.heartRate >= 30 &&
                       request.resource.data.heartRate <= 220;
      allow update, delete: if isOwner(resource.data.userId);
    }
    
    // Exercise measurements
    match /exerciseMeasurements/{measurementId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isSignedIn() && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
  }
}
```

---

## 🌐 Website Architecture (Next.js + Firebase)

### Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── measurements/
│   │   │   ├── exercise/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── RecentMeasurements.tsx
│   │   │   └── TrendChart.tsx
│   │   └── forms/
│   │       ├── MeasurementForm.tsx
│   │       └── ExerciseForm.tsx
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts       # Firebase initialization
│   │   │   ├── auth.ts         # Auth helpers
│   │   │   └── firestore.ts    # Firestore helpers
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useMeasurements.ts
│   │   │   └── useStatistics.ts
│   │   └── utils/
│   │       ├── validation.ts
│   │       └── formatting.ts
│   │
│   └── types/
│       ├── measurement.ts
│       ├── user.ts
│       └── statistics.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── firebase.json               # Firebase config
├── .firebaserc                 # Firebase project
├── firestore.rules             # Security rules
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

---

## 🔐 Authentication Flow

### Web Application

```typescript
// lib/firebase/auth.ts
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut 
} from 'firebase/auth';

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

// Custom hook
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  
  return { user, loading, signInWithGoogle, signOut };
};
```

### Android Application (Already Implemented)

- Uses Firebase Auth SDK
- Google Sign-In integration
- Token refresh handled automatically
- Offline authentication persistence

---

## 📱 Real-time Synchronization

### Firestore Real-time Listeners

```typescript
// lib/hooks/useMeasurements.ts
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';

export const useMeasurements = (userId: string) => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!userId) return;
    
    const q = query(
      collection(db, 'dailyMeasurements'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMeasurements(data);
      setLoading(false);
    });
    
    return unsubscribe;
  }, [userId]);
  
  return { measurements, loading };
};
```

**Benefits**:
- Automatic updates when Android app adds data
- No need for manual refresh
- Works across all devices simultaneously

---

## 🚀 Deployment Strategy

### Website Deployment (Firebase Hosting)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in web directory
cd web
firebase init hosting

# Build Next.js
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

**Result**: Website at `hapetus.info` (custom domain) or `hapetus-app.web.app`

### Android App Deployment
- Existing: Google Play Store (already set up)

### Future: iOS App
- App Store Connect
- TestFlight for beta testing

---

## 📊 Cost Analysis & Scalability

### Current Usage (10 Users)

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| Firebase Auth | Unlimited | 10 users | $0 |
| Firestore Reads | 50K/day | ~500/day | $0 |
| Firestore Writes | 20K/day | ~100/day | $0 |
| Firestore Storage | 1 GB | <10 MB | $0 |
| Firebase Hosting | 10 GB/month | <1 GB/month | $0 |
| **TOTAL** | | | **$0/month** |

### Future Growth Scenarios

**100 Users**:
- Still within free tier
- Cost: $0/month

**1,000 Users**:
- Firestore: ~$10/month
- Hosting: $0 (still within limit)
- Total: ~$10/month

**10,000 Users**:
- Firestore: ~$100/month
- Hosting: ~$10/month
- Total: ~$110/month

**At this scale, consider**:
- Caching layer (Redis)
- CDN optimization
- Database indexing optimization
- Consider migration to Cloudflare or self-hosted

---

## 🔄 Data Migration Strategy (If Needed Later)

### Firebase → Cloudflare D1

```typescript
// migration/firebase-to-d1.ts
// Export from Firestore
const exportFromFirestore = async () => {
  const measurements = await getDocs(collection(db, 'dailyMeasurements'));
  return measurements.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Import to D1
const importToD1 = async (data) => {
  // SQL INSERT statements for D1
  // Minimal downtime with parallel operation
};
```

**Estimated Downtime**: <1 hour for 10,000 records

---

## 🛡️ Security Best Practices

### API Security
1. ✅ Firebase Security Rules (already covered)
2. ✅ Rate limiting (Firebase App Check)
3. ✅ Input validation on client and server
4. ✅ HTTPS only (enforced by Firebase)

### Data Privacy
1. ✅ GDPR compliant (Firebase is GDPR compliant)
2. ✅ User data deletion on request
3. ✅ Encrypted in transit and at rest
4. ✅ No sharing with third parties

### Authentication
1. ✅ OAuth 2.0 (Google Sign-In)
2. ✅ JWT tokens with short expiry
3. ✅ Automatic token refresh
4. ✅ Logout from all devices option

---

## 📈 Monitoring & Analytics

### Firebase Analytics (Free)
- User engagement metrics
- Screen view tracking
- Error reporting with Crashlytics

### Performance Monitoring
- Firebase Performance Monitoring
- Page load times
- API response times

### Custom Dashboards
- Firebase Console
- Google Analytics 4 integration
- Custom BigQuery exports (if needed)

---

## 🎯 Phase 2 Development Plan

### Week 1-2: Setup & Infrastructure
- [ ] Initialize Next.js project
- [ ] Configure Firebase SDK
- [ ] Set up Tailwind CSS + design system
- [ ] Create component library
- [ ] Deploy basic landing page

### Week 3-4: Authentication & Dashboard
- [ ] Implement Google Sign-In
- [ ] Build dashboard layout
- [ ] Create measurement forms
- [ ] Implement real-time data display
- [ ] Add loading states and error handling

### Week 5-6: Reports & Visualization
- [ ] Build statistics calculations
- [ ] Implement chart components
- [ ] Add filtering and time range selection
- [ ] Create export functionality
- [ ] Mobile responsive design

### Week 7-8: Polish & Launch
- [ ] Accessibility testing
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] User testing
- [ ] Production deployment

---

**Last Updated**: February 11, 2026  
**Version**: 1.0.0  
**Recommended**: Firebase Architecture
