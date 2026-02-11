# Hapetus Backend

**Cloudflare Workers & D1 Database (Optional)**

## 📋 Status: Optional / Not Currently Needed

This directory is reserved for potential Cloudflare Workers backend if we decide to migrate away from Firebase in the future.

---

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
