#!/bin/bash

echo "🚀 Starting Pomodoro PWA with Docker + PHP 8.2"
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "📦 Building Docker container..."
docker-compose down 2>/dev/null
docker-compose up --build -d

# Wait for container to be ready
echo "⏳ Waiting for server to start..."
sleep 3

# Check if container is running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Pomodoro PWA is now running!"
    echo ""
    echo "🌐 Access your app at: http://localhost:8081"
    echo ""
    echo "📱 PWA Features Available:"
    echo "   • Service Worker registration"
    echo "   • Web App Manifest"
    echo "   • Install prompt"
    echo "   • Offline functionality"
    echo ""
    echo "� Development Commands:"
    echo "   Stop server:    docker-compose down"
    echo "   View logs:      docker-compose logs -f"
    echo "   Restart:        docker-compose restart"
    echo ""
    echo "💡 Tip: Open Chrome DevTools → Application → Manifest to test PWA features"
    
    # Try to open in browser (macOS)
    if command -v open > /dev/null; then
        echo ""
        read -p "🚀 Open in browser now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open http://localhost:8080
        fi
    fi
else
    echo "❌ Failed to start container. Check the logs:"
    docker-compose logs
    exit 1
fi
