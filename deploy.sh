#!/bin/bash

# Tem Vaga - Quick Deploy Script
# This script helps you quickly build and deploy your application

set -e

echo "🚀 Tem Vaga Deployment Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    echo "Please create a .env file with your environment variables."
    echo "You can use .env.example as a template:"
    echo "  cp .env.example .env"
    exit 1
fi

print_success ".env file found"

# Menu
echo ""
echo "What would you like to do?"
echo "1) Build Docker image"
echo "2) Run with Docker Compose (local)"
echo "3) Stop Docker Compose"
echo "4) Deploy to Vercel"
echo "5) Deploy to Railway"
echo "6) View logs"
echo "7) Run health check"
echo "8) Exit"
echo ""

read -p "Enter your choice [1-8]: " choice

case $choice in
    1)
        print_info "Building Docker image..."
        docker build -t tem-vaga:latest .
        print_success "Docker image built successfully!"
        echo ""
        print_info "To run the image:"
        echo "  docker run -p 3000:3000 --env-file .env tem-vaga:latest"
        ;;
    2)
        print_info "Starting application with Docker Compose..."
        docker-compose up -d
        print_success "Application started!"
        echo ""
        print_info "Application is running at: http://localhost:3000"
        print_info "Health check: http://localhost:3000/api/health"
        echo ""
        print_info "To view logs: docker-compose logs -f"
        print_info "To stop: docker-compose down"
        ;;
    3)
        print_info "Stopping Docker Compose..."
        docker-compose down
        print_success "Application stopped!"
        ;;
    4)
        print_info "Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            print_error "Vercel CLI not found. Installing..."
            npm i -g vercel
        fi
        vercel --prod
        print_success "Deployment initiated!"
        ;;
    5)
        print_info "Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            print_error "Railway CLI not found. Installing..."
            npm i -g @railway/cli
        fi
        railway up
        print_success "Deployment initiated!"
        ;;
    6)
        print_info "Viewing Docker Compose logs..."
        docker-compose logs -f
        ;;
    7)
        print_info "Running health check..."
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            print_success "Health check passed!"
            curl http://localhost:3000/api/health | jq '.' 2>/dev/null || curl http://localhost:3000/api/health
        else
            print_error "Health check failed!"
            echo "Make sure the application is running: docker-compose up -d"
        fi
        ;;
    8)
        print_info "Goodbye! 👋"
        exit 0
        ;;
    *)
        print_error "Invalid option!"
        exit 1
        ;;
esac

echo ""
print_success "Done!"
