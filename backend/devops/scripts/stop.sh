#!/bin/bash

# Joy Backend - Stop Script
# This script stops all backend services

set -e

echo "🛑 Stopping Joy Backend Services..."
echo ""

# Change to docker directory
cd "$(dirname "$0")/../docker"

# Stop services
docker-compose down

echo ""
echo "✅ All services stopped successfully!"
echo ""
echo "💡 To start again, run: ./devops/scripts/start.sh"
echo "🗑️  To remove volumes, run: docker-compose down -v"
echo ""

