# Cloud Deployment Checklist (Vercel + Render)

## Before You Start
- [ ] GitHub account created
- [ ] Vercel account created (sign up with GitHub)
- [ ] Render account created (sign up with GitHub)
- [ ] Your Supabase credentials ready

---

## Step 1: Push Code to GitHub

1. Click the **GitHub icon** (top right of v0) to push your project
2. Create a new repository named `file-converter-app`
3. Code is now on GitHub at: `https://github.com/YOUR_USERNAME/file-converter-app`

---

## Step 2: Deploy Backend to Render (5 minutes)

### 2a. Create Render Service
1. Go to https://render.com
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select repository: `file-converter-app`
5. Fill configuration:
   - **Name:** `quickconvert-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Instance Type:** Free

### 2b. Add Environment Variables to Render
In Render dashboard → Your Service → Environment:
\`\`\`
FRONTEND_URL=https://file-converter-app.vercel.app
NODE_ENV=production
ENABLE_PDF_CONVERSION=true
ENABLE_OFFICE_CONVERSION=true
\`\`\`

### 2c. Get Backend URL
After deployment (2-3 min), copy your Render URL:
- Format: `https://quickconvert-backend.onrender.com`
- **Save this URL!**

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

### 3a. Import to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New"** → **"Project"**
4. Select: `file-converter-app`
5. Click **"Import"**

### 3b. Add Environment Variables to Vercel
Settings → Environment Variables, add:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_API_URL=https://quickconvert-backend.onrender.com
\`\`\`

**IMPORTANT:** Replace the backend URL with YOUR Render URL from Step 2c!

### 3c. Deploy
Click **"Deploy"** and wait 1-2 minutes

Your frontend URL:
- Format: `https://file-converter-app.vercel.app`

---

## Step 4: Verify Everything Works

1. Visit your Vercel URL
2. Test image conversion (works immediately)
3. Test office conversion (waits for backend):
   - First time: Wait 30 seconds (Render wakes up from sleep)
   - Should now show "Converting..." then download file
4. Check Supabase - conversion history should save

---

## If Something Doesn't Work

### Office conversions fail?
- Check Render service status at render.com dashboard
- Verify `NEXT_PUBLIC_API_URL` in Vercel env vars matches your Render URL
- Wait 30 seconds on first try (Render cold start)

### CORS error?
- Update `server/index.js` CORS to include your Vercel URL
- Update `FRONTEND_URL` env var in Render
- Commit and push to GitHub (auto-redeploy)

### File uploads fail?
- Check file size limit (50MB default)
- Verify Render service is running

---

## Cost Summary
| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | Yes | 100GB/mo bandwidth |
| **Render** | Yes | 750 hours/mo (auto-sleep) |
| **Supabase** | Yes | 500MB storage |
| **TOTAL** | **FREE** | ✓ |

---

## Auto Deployment
- Push changes to GitHub
- Vercel auto-deploys frontend (2 min)
- Render auto-deploys backend (3 min)
- Both have staging/preview URLs for testing

---

## Next: Custom Domain (Optional)
Once everything works:
1. Buy domain at Namecheap / GoDaddy
2. Add to Vercel → Settings → Domains
3. Add to Render for API (if desired)

---

## Support
- Vercel docs: https://vercel.com/docs
- Render docs: https://render.com/docs
- v0 help: https://v0.dev/help
