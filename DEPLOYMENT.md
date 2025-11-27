# 🚀 Docker & Deployment Guide

## 📦 Docker Implementation

This project now includes full Docker support with a multi-stage build process for optimal production deployments.

### What's Included

- **Dockerfile** - Multi-stage build for minimal production image
- **docker-compose.yml** - Easy orchestration with health checks
- **.dockerignore** - Optimized build context
- **Health Check API** - `/api/health` endpoint for container monitoring

---

## 🏗️ Building and Running with Docker

### Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (usually comes with Docker Desktop)

### Local Development with Docker

1. **Build the Docker image:**
   ```bash
   docker build -t tem-vaga:latest .
   ```

2. **Run with docker-compose (recommended):**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the containers:**
   ```bash
   docker-compose down
   ```

### Manual Docker Run

```bash
docker run -p 3000:3000 \
  --env-file .env \
  tem-vaga:latest
```

### Health Check

Once running, verify the container health:
```bash
curl http://localhost:3000/api/health
```

---

## ☁️ Deployment Options

### Option 1: Vercel (Recommended for Next.js) ⚡

Vercel is the easiest option for Next.js apps and offers excellent performance.

#### Steps:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables:**
   - Go to your project settings on vercel.com
   - Add all variables from `.env`:
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `WHATSAPP_ACCESS_TOKEN`
     - `WHATSAPP_PHONE_NUMBER_ID`
     - `WHATSAPP_VERIFY_TOKEN`

#### Continuous Deployment:
Connect your GitHub repository to Vercel for automatic deployments on push.

---

### Option 2: Docker on Railway 🚂

Railway offers great Docker support with simple deployments.

#### Steps:

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize project:**
   ```bash
   railway init
   ```

4. **Add environment variables:**
   ```bash
   railway variables set NEXTAUTH_SECRET="your-secret"
   railway variables set NEXTAUTH_URL="https://your-app.railway.app"
   # ... add all other variables
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

---

### Option 3: Render 🎨

Render provides free hosting with Docker support.

#### Steps:

1. Go to [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Environment**: Docker
   - **Region**: Choose closest to your users
   - **Branch**: main
5. Add environment variables in the Render dashboard
6. Click **Create Web Service**

---

### Option 4: Google Cloud Run ☁️

Containerized deployments on Google Cloud Platform.

#### Steps:

1. **Install gcloud CLI** ([instructions](https://cloud.google.com/sdk/docs/install))

2. **Authenticate:**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Build and push to Google Container Registry:**
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/tem-vaga
   ```

4. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy tem-vaga \
     --image gcr.io/YOUR_PROJECT_ID/tem-vaga \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

5. **Set environment variables:**
   ```bash
   gcloud run services update tem-vaga \
     --update-env-vars NEXTAUTH_SECRET="your-secret",NEXTAUTH_URL="https://your-url"
   ```

---

### Option 5: AWS (EC2 + Docker) 🌐

For full control with AWS infrastructure.

#### Steps:

1. **Launch EC2 instance** (Ubuntu 22.04 recommended)

2. **SSH into instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker ubuntu
   ```

4. **Clone your repository:**
   ```bash
   git clone https://github.com/your-repo/tem-vaga.git
   cd tem-vaga
   ```

5. **Create .env file:**
   ```bash
   nano .env
   # Add all your environment variables
   ```

6. **Run with docker-compose:**
   ```bash
   docker-compose up -d
   ```

7. **Configure security group** to allow traffic on port 3000

8. **Optional: Set up nginx as reverse proxy**

---

### Option 6: DigitalOcean App Platform 🌊

Simple container deployment with DigitalOcean.

#### Steps:

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click **Create App**
3. Connect your GitHub repository
4. Select **Dockerfile** as the build method
5. Add environment variables
6. Choose your plan and region
7. Click **Launch Your App**

---

## 🔒 Environment Variables Checklist

Before deploying, ensure these are set:

### Required:
- ✅ `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- ✅ `NEXTAUTH_URL` - Your production URL
- ✅ `NEXT_PUBLIC_APP_URL` - Your production URL
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - From Supabase dashboard
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase dashboard
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - From Supabase dashboard

### Optional (for full features):
- ⚪ `GOOGLE_CLIENT_ID` - For Google Calendar integration
- ⚪ `GOOGLE_CLIENT_SECRET` - For Google Calendar integration
- ⚪ `WHATSAPP_ACCESS_TOKEN` - For WhatsApp notifications
- ⚪ `WHATSAPP_PHONE_NUMBER_ID` - For WhatsApp notifications
- ⚪ `WHATSAPP_VERIFY_TOKEN` - For WhatsApp webhook verification

---

## 🧪 Testing the Deployment

After deployment, test these endpoints:

1. **Health Check:**
   ```bash
   curl https://your-app.com/api/health
   ```

2. **Homepage:**
   ```bash
   curl https://your-app.com
   ```

3. **API Routes:**
   - Test authentication
   - Test booking endpoints
   - Verify Supabase connection

---

## 📊 Monitoring

### Docker Logs
```bash
docker-compose logs -f app
```

### Container Stats
```bash
docker stats
```

### Health Monitoring
Set up automated monitoring by hitting `/api/health` regularly:
```bash
# Example with cron
*/5 * * * * curl -f https://your-app.com/api/health || echo "Health check failed"
```

---

## 🚀 Performance Tips

1. **Use CDN** - Vercel includes this automatically
2. **Enable caching** - Configure in your deployment platform
3. **Monitor performance** - Use Vercel Analytics or similar
4. **Database connection pooling** - Supabase handles this
5. **Set resource limits** - Configure in your platform

---

## 🔧 Troubleshooting

### Build fails
- Check Node version matches Dockerfile (20)
- Verify all dependencies in package.json
- Ensure .env variables are set

### Container won't start
- Check logs: `docker logs container-id`
- Verify environment variables
- Check port 3000 isn't already in use

### Health check fails
- Ensure app is fully started (may take 30-60s)
- Check network connectivity
- Verify no firewall blocking

### Database connection issues
- Verify Supabase credentials
- Check network allows outbound connections
- Ensure Supabase project is active

---

## 📝 Quick Deploy Commands

### Build
```bash
docker build -t tem-vaga:latest .
```

### Run locally
```bash
docker-compose up -d
```

### Push to registry
```bash
docker tag tem-vaga:latest your-registry/tem-vaga:latest
docker push your-registry/tem-vaga:latest
```

### Deploy to production (example with Railway)
```bash
railway up
```

---

## 🎯 Recommended Choice

For this Next.js + Supabase application, I recommend:

1. **🥇 Vercel** - Best for Next.js, zero config, excellent DX
2. **🥈 Railway** - Great Docker support, simple pricing
3. **🥉 Render** - Free tier available, good for testing

Choose based on your needs:
- **Simplicity** → Vercel
- **Docker control** → Railway or Render
- **Enterprise/Scale** → Google Cloud Run or AWS

---

## 💰 Estimated Costs

- **Vercel**: Free hobby plan, Pro at $20/month
- **Railway**: ~$5-20/month based on usage
- **Render**: Free tier available, paid plans from $7/month
- **Google Cloud Run**: Pay per use, ~$5-10/month for small apps
- **AWS EC2**: t2.micro ~$8/month
- **DigitalOcean**: From $5/month

---

## 🎉 You're Ready!

Your application is now containerized and ready for deployment. Choose your platform and follow the steps above!

For questions or issues, check the troubleshooting section or review the platform-specific documentation.
