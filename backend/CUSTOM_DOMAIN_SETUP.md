# 🌐 Custom Domain Setup - api.hapetus.info

**Goal**: Configure `api.hapetus.info` to point to your Cloudflare Workers API

---

## 📋 Prerequisites

- ✅ Cloudflare account (you already have this)
- ✅ Domain: `hapetus.info` (need to verify if you own this)
- ✅ Backend deployed to Cloudflare Workers
- ⏳ DNS access to hapetus.info domain

---

## 🎯 Two Methods to Set Up Custom Domain

### Method 1: Automatic Setup via Cloudflare Dashboard (EASIEST) ⭐

This is the **recommended method** - Cloudflare handles everything automatically!

#### Steps:

1. **Open Cloudflare Workers Dashboard**
   ```bash
   # I'll open it for you
   open "https://dash.cloudflare.com/?to=/:account/workers/services/view/hapetus-api/production/settings/triggers"
   ```

2. **In the browser:**
   - Go to the "Triggers" tab (should already be open)
   - Scroll to "Custom Domains" section
   - Click "Add Custom Domain"
   - Enter: `api.hapetus.info`
   - Click "Add Custom Domain"
   
3. **Cloudflare automatically:**
   - ✅ Creates DNS records
   - ✅ Provisions SSL certificate
   - ✅ Routes traffic to your Worker
   - ✅ Takes ~1-2 minutes

4. **Test:**
   ```bash
   curl https://api.hapetus.info/health
   ```

---

### Method 2: Manual DNS Setup

If you prefer manual control or Method 1 doesn't work:

#### Step 1: Check Domain Ownership

First, verify you own `hapetus.info`:

```bash
# Check current DNS records
dig hapetus.info
nslookup hapetus.info
```

#### Step 2: Add DNS Record

If `hapetus.info` is on Cloudflare:

1. Go to Cloudflare Dashboard > DNS
2. Add a CNAME record:
   - **Type**: CNAME
   - **Name**: `api`
   - **Target**: `hapetus-api.toni-joronen.workers.dev`
   - **Proxy status**: Proxied (orange cloud) ✅
   - **TTL**: Auto

3. Save the record

#### Step 3: Wait for DNS Propagation

```bash
# Check DNS propagation (can take 5 minutes to 24 hours)
dig api.hapetus.info
nslookup api.hapetus.info
```

#### Step 4: Test

```bash
curl https://api.hapetus.info/health
```

---

## ⚠️ Important: Domain Ownership

### Do you own `hapetus.info`?

**If YES** ✅:
- Follow Method 1 or Method 2 above
- You're all set!

**If NO** ❌:
- You need to register `hapetus.info` first
- Options:
  1. Register at Cloudflare Registrar (~$10/year)
  2. Register at any domain registrar (Namecheap, GoDaddy, etc.)
  3. Use a different domain you already own
  4. Use a free subdomain service temporarily

### Checking Domain Ownership

```bash
# Check who owns the domain
whois hapetus.info

# Check if it's available
# Go to: https://www.cloudflare.com/products/registrar/
```

---

## 🚀 Let's Do This!

### Step 1: Open Cloudflare Dashboard

I'll open the Cloudflare Workers dashboard for you. Just say "yes" and I'll execute the command!

### Step 2: Quick Questions

1. **Do you own `hapetus.info`?**
   - If yes → We'll set up the custom domain
   - If no → We can register it or use a different domain

2. **Is `hapetus.info` using Cloudflare DNS?**
   - If yes → Method 1 will work perfectly
   - If no → You'll need to add it to Cloudflare first

---

## 🎯 Alternative: Use Workers.dev Temporarily

If you want to test everything first before setting up a custom domain:

**Current working URL**: https://hapetus-api.toni-joronen.workers.dev

You can:
- Use this URL in your apps temporarily
- Test all API endpoints
- Switch to custom domain later (just update the URL)

**Update Android app to use:**
```kotlin
const val API_BASE_URL = "https://hapetus-api.toni-joronen.workers.dev"
```

**Update website to use:**
```typescript
const API_URL = "https://hapetus-api.toni-joronen.workers.dev"
```

---

## ✅ After Custom Domain is Set Up

Once `api.hapetus.info` is working, update:

### 1. Backend CORS Configuration

Already configured in `wrangler.toml`:
```toml
CORS_ORIGIN = "https://hapetus.info"
```

### 2. Website Configuration

Update `web/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.hapetus.info
```

### 3. Android App Configuration

Update `android/app/build.gradle.kts`:
```kotlin
buildConfigField("String", "API_BASE_URL", "\"https://api.hapetus.info\"")
```

### 4. Test All Endpoints

```bash
# Health check
curl https://api.hapetus.info/health

# API info
curl https://api.hapetus.info/

# With authentication (once you have a token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.hapetus.info/api/user/profile
```

---

## 🆘 Troubleshooting

### "DNS_PROBE_FINISHED_NXDOMAIN"
- Domain doesn't exist or DNS not configured
- Check domain ownership
- Verify DNS records are created

### "SSL Certificate Error"
- Wait a few minutes for Cloudflare to provision certificate
- Ensure proxy (orange cloud) is enabled in DNS

### "502 Bad Gateway"
- Worker might not be deployed
- Check worker status in dashboard
- Verify route configuration

### "CORS Error"
- Update CORS_ORIGIN in wrangler.toml
- Redeploy worker

---

## 📞 Next Steps

**Tell me:**
1. Do you own `hapetus.info` domain?
2. Should I open the Cloudflare dashboard for you?
3. Or would you prefer to use the workers.dev URL for now?

I'm ready to help you set this up! 🚀

---

<div align="center">

**🌐 Custom Domain = Professional API Endpoint**

api.hapetus.info is much better than workers.dev!

</div>
