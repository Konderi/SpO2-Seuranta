# 🚀 Quick Custom Domain Setup - hapetus.info

**Status**: Domain registered ✅ | Cloudflare DNS ✅ | Ready to configure!

---

## ⚡ Quick Setup (5 minutes)

Since your domain is already on Cloudflare, this will be super easy!

### Method 1: Automatic via Workers Dashboard (EASIEST) 🌟

1. **In the Cloudflare dashboard that just opened:**
   - Click on "Workers & Pages" in the left sidebar
   - Click on "hapetus-api" service
   - Go to "Settings" tab
   - Click "Triggers" (or "Domains & Routes")
   
2. **Add Custom Domain:**
   - Scroll to "Custom Domains" section
   - Click "Add Custom Domain"
   - Enter: `api.hapetus.info`
   - Click "Add Domain"
   
3. **Cloudflare will automatically:**
   - ✅ Create DNS CNAME record for `api`
   - ✅ Provision SSL certificate
   - ✅ Route traffic to your Worker
   - ✅ Takes 1-2 minutes max

4. **Done!** Test it:
   ```bash
   curl https://api.hapetus.info/health
   ```

---

### Method 2: Manual DNS (If Method 1 doesn't work)

1. **Go to DNS settings:**
   - In Cloudflare dashboard
   - Click on `hapetus.info` domain
   - Go to "DNS" > "Records"

2. **Add CNAME record:**
   ```
   Type: CNAME
   Name: api
   Target: hapetus-api.toni-joronen.workers.dev
   Proxy: Enabled (orange cloud) ✅
   TTL: Auto
   ```

3. **Click "Save"**

4. **Wait 1-5 minutes for propagation**

5. **Test:**
   ```bash
   curl https://api.hapetus.info/health
   ```

---

## 🎯 What to Do Right Now

1. **Follow Method 1 in the Cloudflare dashboard I just opened**
2. **Come back here when done**
3. **I'll test the domain and we'll proceed to website deployment!**

---

## ✅ After Domain is Working

We'll immediately:
1. ✅ Test all API endpoints on new domain
2. ✅ Update project documentation
3. ✅ Deploy website to `hapetus.info`
4. ✅ Configure website to use `api.hapetus.info`
5. ✅ Full production setup complete!

---

**Let me know when you've added the custom domain and I'll verify it's working!** 🚀
