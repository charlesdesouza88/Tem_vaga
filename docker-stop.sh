#!/bin/bash

# Docker Stop Script for Tem_vaga
# This script stops and removes the Docker containers

set -e

echo "🛑 Stopping Tem_vaga Docker Environment..."

# Stop and remove containers
docker-compose down

echo "✅ Containers stopped and removed"
echo ""
echo "💡 To remove volumes as well, use: docker-compose down -v"
echo "💡 To start again, use: ./docker-start.sh"
