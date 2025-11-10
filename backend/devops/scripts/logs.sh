#!/bin/bash

# Joy Backend - Logs Script
# This script shows logs from all services

cd "$(dirname "$0")/../docker"

if [ -z "$1" ]; then
  echo "📋 Showing logs from all services..."
  echo "Press Ctrl+C to stop"
  echo ""
  docker-compose logs -f
else
  echo "📋 Showing logs from $1..."
  echo "Press Ctrl+C to stop"
  echo ""
  docker-compose logs -f "$1"
fi

