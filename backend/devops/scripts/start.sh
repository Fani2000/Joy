#!/bin/bash

# Joy Backend - Start Script
# This script starts all backend services using Docker Compose

set -e

echo "🚀 Starting Joy Backend Services..."
echo ""

# Change to docker directory
cd "$(dirname "$0")/../docker"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from env.template..."
    cp env.template .env
    echo "✅ Created .env file. Please update it with your configuration."
    echo ""
fi

# Pull latest images
echo "📦 Pulling latest Docker images..."
docker-compose pull

# Build the API
echo "🔨 Building Joy.Api Docker image..."
docker-compose build

# Start services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be ready..."
echo ""

# Wait for MongoDB
until docker-compose exec -T mongodb mongosh --quiet --eval "db.runCommand('ping').ok" > /dev/null 2>&1; do
  echo "⏳ Waiting for MongoDB..."
  sleep 2
done
echo "✅ MongoDB is ready"

# Wait for RabbitMQ
until docker-compose exec -T rabbitmq rabbitmq-diagnostics -q ping > /dev/null 2>&1; do
  echo "⏳ Waiting for RabbitMQ..."
  sleep 2
done
echo "✅ RabbitMQ is ready"

# Wait for API
until curl -f http://localhost:5000/graphql > /dev/null 2>&1; do
  echo "⏳ Waiting for Joy.Api..."
  sleep 3
done
echo "✅ Joy.Api is ready"

echo ""
echo "🎉 All services are up and running!"
echo ""
echo "📊 Service URLs:"
echo "  - GraphQL API:       http://localhost:5000/graphql"
echo "  - RabbitMQ Management: http://localhost:15672 (guest/guest)"
echo "  - MongoDB:           mongodb://admin:admin123@localhost:27017"
echo ""
echo "📝 Useful commands:"
echo "  - View logs:         docker-compose logs -f"
echo "  - Stop services:     docker-compose down"
echo "  - Restart services:  docker-compose restart"
echo ""

