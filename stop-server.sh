#!/bin/bash

echo "🛑 Stopping Pomodoro PWA Docker Container"
echo "========================================="

# Stop and remove containers
docker-compose down

echo "✅ Docker container stopped successfully!"
echo ""
echo "🔧 Other useful commands:"
echo "   Start again:    ./start-server.sh"
echo "   View logs:      docker-compose logs"
echo "   Remove images:  docker-compose down --rmi all"
