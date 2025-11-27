# 🚀 Quick Deployment Reference

## Local Docker Testing

```bash
# Using the interactive script (easiest)
./deploy.sh

# Manual Docker commands
docker build -t tem-vaga:latest .
docker run -p 3000:3000 --env-file .env tem-vaga:latest

# Using Docker Compose (recommended for local)
docker-compose up -d
docker-compose logs -f
docker-compose down
```

## Vercel (Easiest for Next.js)

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Railway

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

## Render

1. Go to render.com
2. New > Web Service
3. Connect GitHub repo
4. Select Docker
5. Add environment variables
6. Deploy

## Google Cloud Run

```bash
gcloud auth login
gcloud builds submit --tag gcr.io/PROJECT_ID/tem-vaga
gcloud run deploy tem-vaga --image gcr.io/PROJECT_ID/tem-vaga --platform managed --allow-unauthenticated
```

## Health Check

```bash
curl https://your-app.com/api/health
```

## Environment Variables Checklist

- [ ] NEXTAUTH_SECRET (generate: `openssl rand -base64 32`)
- [ ] NEXTAUTH_URL (your production URL)
- [ ] NEXT_PUBLIC_APP_URL (your production URL)
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] GOOGLE_CLIENT_ID (optional)
- [ ] GOOGLE_CLIENT_SECRET (optional)
- [ ] WHATSAPP_ACCESS_TOKEN (optional)
- [ ] WHATSAPP_PHONE_NUMBER_ID (optional)
- [ ] WHATSAPP_VERIFY_TOKEN (optional)

## Need Help?

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed step-by-step guides!
