# Docker Deployment Guide

This guide covers deploying the Tem_vaga application using Docker.

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- `.env` file configured with all required environment variables

## Quick Start

### 1. Build and Start

```bash
./docker-start.sh
```

This script will:
- Check for the `.env` file
- Build the Docker image
- Start the containers
- Verify the application is running

### 2. Access the Application

Once started, access the application at:
- **Local**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

### 3. Stop the Application

```bash
./docker-stop.sh
```

## Manual Docker Commands

### Build the Image

```bash
docker build -t tem-vaga:latest .
```

### Run with Docker Compose

```bash
# Start in detached mode
docker-compose up -d

# Start with logs visible
docker-compose up

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs

```bash
# All logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Logs for specific service
docker-compose logs -f app
```

### Restart the Application

```bash
docker-compose restart
```

### Rebuild After Code Changes

```bash
docker-compose up -d --build
```

## Environment Variables

The following environment variables are required in your `.env` file:

### Authentication
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Base URL of your application

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

### Google Calendar (Optional)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### WhatsApp (Optional)
- `WHATSAPP_ACCESS_TOKEN` - Meta Graph API access token
- `WHATSAPP_PHONE_NUMBER_ID` - WhatsApp Business phone number ID
- `WHATSAPP_VERIFY_TOKEN` - Webhook verification token

## Production Deployment

### Using Docker Hub

1. **Tag the image**:
```bash
docker tag tem-vaga:latest yourusername/tem-vaga:latest
```

2. **Push to Docker Hub**:
```bash
docker push yourusername/tem-vaga:latest
```

3. **Pull and run on production server**:
```bash
docker pull yourusername/tem-vaga:latest
docker run -d -p 3000:3000 --env-file .env yourusername/tem-vaga:latest
```

### Using a Cloud Provider

#### AWS ECS
1. Push image to Amazon ECR
2. Create an ECS task definition
3. Deploy to ECS Fargate or EC2

#### Google Cloud Run
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/tem-vaga

# Deploy to Cloud Run
gcloud run deploy tem-vaga \
  --image gcr.io/PROJECT_ID/tem-vaga \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### DigitalOcean App Platform
1. Connect your GitHub repository
2. Select Dockerfile deployment
3. Configure environment variables
4. Deploy

## Health Checks

The application includes a health check endpoint at `/api/health`.

Docker Compose is configured to automatically check the health of the container:
- **Interval**: Every 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 attempts
- **Start Period**: 40 seconds

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose logs app
```

### Port already in use

Change the port in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Environment variables not loading

Ensure `.env` file exists and is in the same directory as `docker-compose.yml`.

### Build fails

Clear Docker cache and rebuild:
```bash
docker-compose build --no-cache
```

### Application is slow

Check resource allocation:
```bash
docker stats
```

Consider increasing Docker's memory limit in Docker Desktop settings.

## Performance Optimization

### Multi-stage Build

The Dockerfile uses a multi-stage build to:
- Reduce final image size
- Separate build and runtime dependencies
- Improve security by not including build tools in production

### Standalone Output

Next.js is configured with `output: 'standalone'` which:
- Creates a minimal production server
- Reduces image size by ~80%
- Includes only necessary dependencies

### Layer Caching

The Dockerfile is optimized for layer caching:
1. Dependencies are installed first (changes less frequently)
2. Source code is copied later (changes more frequently)
3. Build happens in a separate stage

## Security Best Practices

1. **Non-root user**: The container runs as a non-root user (`nextjs`)
2. **Minimal base image**: Uses Alpine Linux for smaller attack surface
3. **No secrets in image**: Environment variables are passed at runtime
4. **Health checks**: Automatic container health monitoring

## Monitoring

### View Container Stats

```bash
docker stats tem-vaga-app-1
```

### Export Logs

```bash
docker-compose logs > logs.txt
```

### Container Inspection

```bash
docker inspect tem-vaga-app-1
```

## Backup and Restore

Since the application uses Supabase (external database), no local data backup is needed. Ensure your Supabase project has:
- Regular automated backups enabled
- Point-in-time recovery configured
- Export scripts for critical data

## Scaling

### Horizontal Scaling

To run multiple instances:

```yaml
services:
  app:
    # ... existing config
    deploy:
      replicas: 3
```

Then use a load balancer (nginx, Traefik, etc.) to distribute traffic.

### Vertical Scaling

Increase container resources:

```yaml
services:
  app:
    # ... existing config
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## CI/CD Integration

See `.github/workflows/` for GitHub Actions examples that:
- Build Docker images
- Run tests in containers
- Push to container registries
- Deploy to production

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Supabase Documentation](https://supabase.com/docs)
