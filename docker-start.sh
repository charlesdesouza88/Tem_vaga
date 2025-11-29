#!/bin/bash

# Docker Start Script for Tem_vaga
# This script builds and starts the Docker containers

set -e

echo "🐳 Starting Tem_vaga Docker Environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your environment variables."
    echo "You can use .env.example as a template."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker-compose build

# Start the containers
echo "🚀 Starting containers..."
docker-compose up -d

# Wait for the application to be ready
echo "⏳ Waiting for application to be ready..."
sleep 5

# Check if the application is running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Application is running!"
    echo "🌐 Access the application at: http://localhost:3000"
    echo ""
    echo "📊 View logs with: docker-compose logs -f"
    echo "🛑 Stop with: docker-compose down"
else
    echo "❌ Failed to start the application"
    echo "Check logs with: docker-compose logs"
    exit 1
fi
