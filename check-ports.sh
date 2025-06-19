#!/bin/bash

echo "🔍 Checking Port Availability for Pomodoro PWA"
echo "=============================================="

# Check port 8081
if lsof -i :8081 >/dev/null 2>&1; then
    echo "❌ Port 8081 is currently in use:"
    lsof -i :8081
    echo ""
    echo "🔧 You can:"
    echo "   1. Stop the service using port 8081"
    echo "   2. Change the port in docker-compose.yml"
    echo "   3. Run: ./stop-server.sh (if it's our container)"
else
    echo "✅ Port 8081 is available!"
    echo ""
    echo "🚀 Ready to start the server with: ./start-server.sh"
fi

echo ""
echo "📋 Other ports status:"
for port in 8080 8082 8083 9000; do
    if lsof -i :$port >/dev/null 2>&1; then
        echo "   Port $port: ❌ In use"
    else
        echo "   Port $port: ✅ Available"
    fi
done
