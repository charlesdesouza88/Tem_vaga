# 🚀 CI/CD Setup Guide - Vercel Deployment

This guide will help you set up automated deployments to Vercel with GitHub Actions.

## 📋 Prerequisites

- ✅ GitHub repository (already set up: `charlesdesouza88/Tem_vaga`)
- ✅ Vercel account ([Sign up here](https://vercel.com/signup))
- ✅ Environment variables ready

---

## 🎯 Quick Setup (5 minutes)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser for authentication.

### Step 3: Link Your Project

```bash
vercel link
```

Answer the prompts:
- **Set up and deploy?** → `yes`
- **Which scope?** → Select your account
- **Link to existing project?** → `no` (first time)
- **Project name?** → `tem-vaga` or your preferred name
- **Directory with code?** → `./` (press Enter)

### Step 4: Get Your Vercel Credentials

```bash
# Get your Vercel Token
# Go to: https://vercel.com/account/tokens
# Create a new token named "GitHub Actions"
# Copy the token (you'll only see it once!)

# Get your Organization ID
cat .vercel/project.json | grep orgId

# Get your Project ID  
cat .vercel/project.json | grep projectId
```

### Step 5: Add GitHub Secrets

1. Go to your GitHub repository: https://github.com/charlesdesouza88/Tem_vaga
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these three secrets:

   | Name | Value | How to Get |
   |------|-------|------------|
   | `VERCEL_TOKEN` | Your token | From https://vercel.com/account/tokens |
   | `VERCEL_ORG_ID` | Your org ID | From `.vercel/project.json` |
   | `VERCEL_PROJECT_ID` | Your project ID | From `.vercel/project.json` |

### Step 6: Add Environment Variables to Vercel

Go to your Vercel project dashboard and add these environment variables:

**Required:**
```bash
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-project.vercel.app
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_SUPABASE_URL=<from Supabase dashboard>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard>
```

**Optional (for full features):**
```bash
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
WHATSAPP_ACCESS_TOKEN=<from Meta Business>
WHATSAPP_PHONE_NUMBER_ID=<from Meta Business>
WHATSAPP_VERIFY_TOKEN=<your custom token>
```

### Step 7: Deploy! 🚀

**Option A: Manual Deployment (first time)**
```bash
vercel --prod
```

**Option B: Automatic Deployment (after setup)**
Just push to your `main` branch:
```bash
git add .
git commit -m "feat: add CI/CD pipeline"
git push origin main
```

GitHub Actions will automatically:
1. Run linting and type checking
2. Build your application
3. Test Docker image build
4. Deploy to Vercel production

---

## 🔄 How CI/CD Works

### Continuous Integration (CI)

**Triggered on:** Every push and pull request to `main` or `develop`

**What it does:**
1. ✅ Runs ESLint to check code quality
2. ✅ Runs TypeScript type checking
3. ✅ Builds your Next.js application
4. ✅ Tests Docker image build
5. ✅ Catches errors before deployment

**File:** `.github/workflows/ci.yml`

### Continuous Deployment (CD)

**Triggered on:** Every push to `main` branch

**What it does:**
1. 🏗️ Builds your application
2. 🚀 Deploys to Vercel production
3. 📊 Creates deployment summary with URL

**File:** `.github/workflows/deploy-vercel.yml`

---

## 📊 Monitoring Deployments

### View Workflow Runs

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You'll see all workflow runs with status (✅ success, ❌ failed)

### View Vercel Deployments

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. View all deployments with URLs and logs

### Check Build Logs

**In GitHub:**
- Actions tab → Click on a workflow run → View logs

**In Vercel:**
- Project → Deployments → Click deployment → View Function Logs

---

## 🔧 Configuration Files

### `.github/workflows/ci.yml`
Runs on every push/PR:
- Linting
- Type checking
- Build testing
- Docker build testing

### `.github/workflows/deploy-vercel.yml`
Runs on push to `main`:
- Automated Vercel deployment
- Environment management
- Deployment summaries

### `vercel.json`
Vercel-specific configuration:
- Security headers
- Brazilian region (GRU1 - São Paulo)
- API routing
- Build settings

---

## 🎯 Deployment Workflow

```
┌─────────────────┐
│  Developer      │
│  Commits Code   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Push to       │
│   GitHub        │
└────────┬────────┘
         │
         ├──────────────────────────────┐
         ▼                              ▼
┌─────────────────┐          ┌──────────────────┐
│   CI Workflow   │          │  Deploy Workflow │
│   (All Branches)│          │  (Main Only)     │
└────────┬────────┘          └────────┬─────────┘
         │                            │
         ▼                            ▼
   ✅ Lint Check              🏗️ Build on Vercel
   ✅ Type Check              
   ✅ Build Test                      │
   ✅ Docker Test                     ▼
                              🚀 Deploy to Production
                                     │
                                     ▼
                              📊 Live on Vercel!
                              🔗 https://your-app.vercel.app
```

---

## 🎛️ Managing Deployments

### Preview Deployments

Every branch and PR gets a preview deployment automatically:
```
https://tem-vaga-<branch>-charlesdesouza88.vercel.app
```

### Production Deployment

Only the `main` branch deploys to production:
```
https://tem-vaga.vercel.app
```

### Rollback a Deployment

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Find a previous successful deployment
5. Click "⋯" → "Promote to Production"

---

## 🔐 Security Best Practices

### ✅ Implemented

- Environment variables stored securely in Vercel
- GitHub secrets for CI/CD credentials
- Security headers in `vercel.json`
- No sensitive data in repository
- Automatic HTTPS by Vercel

### ⚠️ Important

- Never commit `.env` files
- Rotate tokens periodically
- Use different tokens for CI/CD vs local development
- Review Vercel deployment logs regularly

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Check:**
1. Environment variables are set correctly
2. Build logs in Vercel dashboard
3. Test build locally: `npm run build`

### GitHub Actions Fails

**Check:**
1. GitHub secrets are set correctly
2. Workflow permissions (Settings → Actions → General)
3. Action logs for specific error

### Deployment Succeeds but App Doesn't Work

**Check:**
1. Environment variables in Vercel match requirements
2. Function logs in Vercel dashboard
3. Browser console for errors
4. Health check: `https://your-app.vercel.app/api/health`

### NEXTAUTH_URL Mismatch

**Fix:**
1. Update `NEXTAUTH_URL` in Vercel to match your domain
2. Redeploy (or automatically deploys on next push)

### Google OAuth Redirect Error

**Fix:**
1. Add production URL to Google Cloud Console:
   - Go to Google Cloud Console
   - APIs & Services → Credentials
   - Add redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

---

## 📈 Optimization Tips

### Faster Builds

1. Use Vercel's build cache (automatic)
2. Optimize dependencies in `package.json`
3. Use `npm ci` instead of `npm install`

### Better Performance

1. Enable Vercel Analytics (free tier available)
2. Use Vercel Image Optimization (automatic)
3. Monitor Core Web Vitals in Vercel dashboard

### Cost Optimization

1. **Hobby Plan** (Free):
   - 100GB bandwidth
   - Unlimited deployments
   - Perfect for MVP/testing

2. **Pro Plan** ($20/month):
   - 1TB bandwidth
   - Better performance
   - Team features
   - Consider when you have real users

---

## ✅ Post-Deployment Checklist

After your first successful deployment:

- [ ] Test the production URL
- [ ] Verify `/api/health` endpoint works
- [ ] Test user registration and login
- [ ] Test booking flow
- [ ] Verify Google Calendar integration (if configured)
- [ ] Test WhatsApp webhook (if configured)
- [ ] Update Google OAuth redirect URIs
- [ ] Update WhatsApp webhook URL
- [ ] Set up custom domain (optional)
- [ ] Configure Vercel Analytics (optional)
- [ ] Set up error monitoring (Sentry, etc.)

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: https://github.com/charlesdesouza88/Tem_vaga/actions
- **Vercel Documentation**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Environment Variables**: https://vercel.com/docs/environment-variables

---

## 🎉 You're All Set!

Your project now has:
- ✅ Automated testing on every commit
- ✅ Automated deployments to Vercel
- ✅ Preview deployments for every branch
- ✅ Production deployments from main branch
- ✅ Security headers configured
- ✅ Brazilian region (GRU1) for low latency

**Next Command:**
```bash
git add .
git commit -m "feat: add CI/CD pipeline with Vercel deployment"
git push origin main
```

🎊 Your app will automatically deploy to Vercel!
