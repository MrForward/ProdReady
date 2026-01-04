# 🚀 ProdReady Deployment Checklist

**Status:** In Progress  
**Started:** January 4, 2026

---

## ✅ Pre-Deployment (Complete)
- [x] All code changes complete
- [x] Rebranding to ProdReady
- [x] Error handling fixed
- [x] Documentation updated
- [x] Language scope clarified
- [x] GitHub access clarified

---

## 📋 Deployment Steps

### Step 1: Create Supabase Project (5 minutes)

**Instructions:**
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" → Sign in with GitHub
3. Click "New Project"
4. Fill in:
   - **Name:** prodready
   - **Database Password:** (generate strong password - SAVE THIS!)
   - **Region:** Choose closest to your users (e.g., US East, EU West)
5. Click "Create new project"
6. ⏳ Wait 2-3 minutes for provisioning

**Status:** [ ] Complete

---

### Step 2: Run Database Migration (2 minutes)

**Instructions:**
1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from your project
4. Paste into SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. ✅ Should see "Success. No rows returned"

**Verification:**
- Go to "Table Editor" → Should see 3 tables: `email_leads`, `scans`, `votes`

**Status:** [ ] Complete

---

### Step 3: Get Supabase API Credentials (1 minute)

**Instructions:**
1. Click "Settings" (gear icon in left sidebar)
2. Click "API" under Project Settings
3. Copy these two values:

**📋 Copy These:**
```
Project URL: https://[your-project].supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Status:** [ ] Complete

---

### Step 4: Test Locally with Supabase (3 minutes)

**Instructions:**
1. Create `.env.local` file in project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Restart dev server:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

3. Test email capture:
   - Go to http://localhost:3000
   - Scan a repository (e.g., https://github.com/facebook/react)
   - Click "Unlock Full Report"
   - Enter your email
   - Check Supabase → Table Editor → `email_leads` → Should see your email!

**Status:** [ ] Complete

---

### Step 5: Build for Production (2 minutes)

**Instructions:**
```bash
# Build the production bundle
npm run build

# Test production build locally (optional)
npm start
# Visit http://localhost:3000 to verify
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**Status:** [ ] Complete

---

### Step 6: Deploy to Vercel (5 minutes)

**Option A: Deploy via Vercel CLI**

1. Install Vercel CLI (if not installed):
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy to preview:
```bash
vercel
```
Follow prompts:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- Project name? **prodready** (or your choice)
- Directory? **./
- Override settings? **No**

4. Deploy to production:
```bash
vercel --prod
```

**Option B: Deploy via Vercel Dashboard**

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import Git Repository
3. Connect your GitHub account
4. Select the ProdReady repository
5. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: **./
   - Build Command: **npm run build**
   - Output Directory: **.next**
6. Click "Deploy"

**Status:** [ ] Complete

---

### Step 7: Add Environment Variables to Vercel (2 minutes)

**Instructions:**
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project (prodready)
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar
5. Add both variables:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: (paste from Step 3)
- Environment: ✅ Production, ✅ Preview, ✅ Development
- Click "Save"

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: (paste from Step 3)
- Environment: ✅ Production, ✅ Preview, ✅ Development
- Click "Save"

6. Redeploy to apply environment variables:
```bash
vercel --prod
```

**Status:** [ ] Complete

---

### Step 8: Verify Production Deployment (5 minutes)

**Your Production URL:**
```
https://prodready.vercel.app
(or your custom domain)
```

**Test Checklist:**
- [ ] Homepage loads correctly
- [ ] Branding shows "ProdReady" (not "ShipReady")
- [ ] Scan a repository: https://github.com/facebook/react
- [ ] Scan completes successfully
- [ ] Score and issues display correctly
- [ ] Click "Unlock Full Report"
- [ ] Enter email
- [ ] Check Supabase → `email_leads` table → Email appears!
- [ ] Test error: Try https://github.com/user/nonexistent-repo
- [ ] Should show "Repository not found" error
- [ ] Test OG image on Twitter Card Validator: https://cards-dev.twitter.com/validator

**Status:** [ ] Complete

---

### Step 9: Configure Custom Domain (Optional)

**If you have a custom domain:**

1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., prodready.dev)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)
5. Test: https://your-domain.com

**Status:** [ ] Complete (or N/A)

---

### Step 10: Post-Deployment Setup (Optional)

**Analytics (Recommended):**
1. Enable Vercel Analytics:
   - Dashboard → Analytics → Enable
   - Free tier: 100k events/month

**Error Tracking (Recommended):**
1. Set up Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Monitoring:**
1. Set up Uptime monitoring (UptimeRobot, Better Stack)
2. Monitor Supabase database size
3. Track scan completion rate

**Status:** [ ] Complete (or N/A)

---

## ✅ Deployment Complete!

**Your Live URLs:**
- Production: https://prodready.vercel.app
- Supabase: https://[your-project].supabase.co

**Next Steps:**
1. Share on Twitter/X
2. Post on Product Hunt
3. Share in developer communities
4. Monitor analytics and user feedback
5. Iterate based on usage

---

## 🐛 Troubleshooting

**Issue: "Supabase connection failed"**
- Check environment variables are set correctly in Vercel
- Verify Supabase project is active
- Check browser console for errors

**Issue: "Email not saving"**
- Check Supabase → Table Editor → `email_leads`
- Verify RLS policies are enabled
- Check Supabase logs for errors

**Issue: "Scan failing"**
- Check GitHub API rate limits
- Verify repository is public
- Check Vercel function logs

**Issue: "OG image not showing"**
- Clear social media cache
- Verify `/public/og-image.png` exists
- Test on Twitter Card Validator

---

**Deployment Guide Version:** 1.0  
**Last Updated:** January 4, 2026
