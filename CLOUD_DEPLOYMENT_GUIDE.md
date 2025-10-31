# Complete Cloud Deployment Guide (No Local Setup)

## Overview
- **Frontend (Next.js)** → Vercel
- **Backend (Express.js)** → Render.com or Railway.app
- **Database** → Supabase (already using)

---

## Part 1: Deploy Backend to Render.com (Free)

### Step 1: Push Code to GitHub
1. Go to https://github.com and create a new repository named `file-converter-app`
2. Clone your v0 project to GitHub (click the GitHub button in v0 top right)
3. Push the code

### Step 2: Deploy Backend to Render
1. Go to https://render.com
2. Sign up with GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Fill in the form:
   - **Name:** `quickconvert-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Region:** Choose closest to you

### Step 3: Add Environment Variables to Render
In the Render dashboard, go to your service → Environment:
\`\`\`
UPLOAD_DIR=/tmp/uploads
\`\`\`

### Step 4: Copy Your Backend URL
After deployment (takes 2-3 minutes), you'll get a URL like:
\`\`\`
https://quickconvert-backend.onrender.com
\`\`\`
**Save this URL** - you'll need it for the frontend!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Import Your GitHub Repository
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Select your `file-converter-app` repository
5. Click "Import"

### Step 2: Add Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_API_URL=https://quickconvert-backend.onrender.com
\`\`\`

**Important:** Replace the backend URL with YOUR Render URL from Part 1!

### Step 3: Deploy
Click "Deploy" - Vercel will automatically build and deploy your frontend!

After deployment (1-2 minutes), you'll get a live URL like:
\`\`\`
https://file-converter-app.vercel.app
\`\`\`

---

## Part 3: Update Backend to Point to Vercel Frontend

Since your frontend is now on Vercel, you need to allow CORS requests:

### Step 1: Update Backend CORS Settings
In your `server/index.js`, update the CORS:

\`\`\`javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://file-converter-app.vercel.app', // Your Vercel frontend URL
    'http://localhost:3000' // Keep for local testing
  ],
  credentials: true
}));
\`\`\`

### Step 2: Redeploy Backend
- Push your changes to GitHub
- Render will automatically redeploy

---

## Part 4: Enable Automatic Deployments

### For Backend (Render)
- Already automatic - redeploys when you push to GitHub

### For Frontend (Vercel)
- Already automatic - redeploys when you push to GitHub

**You can now make changes and have them live automatically!**

---

## Troubleshooting

### Office Conversions Not Working?
1. Check backend URL in Vercel environment variables
2. Verify Render service is running (check Render dashboard)
3. Make sure backend has LibreOffice installed (Render provides this)

### CORS Errors?
Update backend CORS to include your actual Vercel URL

### File Upload Fails?
Render provides `/tmp` directory - backend uses this for temporary files

---

## Testing Your Deployment

1. Go to your Vercel URL: `https://file-converter-app.vercel.app`
2. Try file conversions:
   - Images (works immediately)
   - CSV/JSON (works immediately)
   - PDF ↔ Word/PowerPoint (requires backend - wait 30 seconds first time)

---

## Cost Breakdown
- **Vercel Frontend:** FREE (with generous limits)
- **Render Backend:** FREE (with 750 hours/month, auto-sleeps after 15 min inactivity)
- **Supabase Database:** FREE (with 500MB storage)
- **Total:** 100% FREE forever!

---

## Next Steps
1. Create GitHub repo and push code
2. Deploy backend to Render (5 minutes)
3. Deploy frontend to Vercel (5 minutes)
4. Add environment variables
5. Update CORS in backend
6. Done! ✓

Your app is now live and fully functional online!
