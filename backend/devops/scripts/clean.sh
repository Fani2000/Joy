#!/bin/bash

# Joy Backend - Clean Script
# This script stops services and removes all volumes (complete cleanup)

set -e

echo "🗑️  Cleaning Joy Backend..."
echo ""
echo "⚠️  WARNING: This will delete all data (MongoDB, RabbitMQ)!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Cleanup cancelled"
  exit 0
fi

cd "$(dirname "$0")/../docker"

echo "🛑 Stopping services..."
docker-compose down -v

echo "🗑️  Removing Docker images..."
docker-compose down --rmi local

echo ""
echo "✅ Cleanup complete!"
echo "💡 To start fresh, run: ./devops/scripts/start.sh"
echo ""

