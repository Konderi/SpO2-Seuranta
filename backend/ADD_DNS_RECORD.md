# ✅ Add DNS Record for api.hapetus.info

**Status**: Route configured ✅ | DNS record needed ⏳

---

## 🎯 Quick Setup (2 minutes)

I just opened the Cloudflare DNS page for hapetus.info. Here's what to do:

### Step 1: Add CNAME Record

In the DNS Records page that just opened:

1. **Click "Add record" button**

2. **Fill in the form:**
   ```
   Type:    CNAME
   Name:    api
   Target:  hapetus-api.toni-joronen.workers.dev
   Proxy:   ✅ Proxied (orange cloud)
   TTL:     Auto
   ```

3. **Click "Save"**

---

## 📋 Details

### What Each Field Means:

- **Type: CNAME** - Creates an alias (api.hapetus.info → worker)
- **Name: api** - Creates the subdomain `api.hapetus.info`
- **Target: hapetus-api.toni-joronen.workers.dev** - Points to your Worker
- **Proxy: Proxied** - Routes through Cloudflare (enables CDN, SSL, DDoS protection)
- **TTL: Auto** - Cloudflare manages cache timing

---

## ✅ After Adding the Record

### Wait 1-2 Minutes

DNS propagation is usually instant with Cloudflare, but can take up to 5 minutes.

### Test the Domain

```bash
# Test DNS resolution
dig api.hapetus.info

# Test the API
curl https://api.hapetus.info/health
# Should return: {"status":"ok"}

# Test the main endpoint
curl https://api.hapetus.info/
# Should return API info with version
```

---

## 🎉 Once Working

**Let me know when the DNS record is added!** I'll:

1. ✅ Test all API endpoints
2. ✅ Update project documentation
3. ✅ Deploy the website to `hapetus.info`
4. ✅ Configure website to use `api.hapetus.info`
5. ✅ Full production setup complete!

---

## 🆘 Troubleshooting

### If DNS doesn't resolve after 5 minutes:

1. **Check the record was saved:**
   - Go back to DNS page
   - Look for `api` CNAME record in the list
   - Verify target is correct

2. **Check Proxy status:**
   - Orange cloud = Proxied ✅ (correct)
   - Grey cloud = DNS only (won't work with Workers)

3. **Flush your DNS cache:**
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Test again
   curl https://api.hapetus.info/health
   ```

---

**Add the DNS record and let me know when it's done!** 🚀
