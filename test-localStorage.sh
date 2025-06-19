#!/bin/bash

echo "🔍 Testing Pomodoro PWA localStorage functionality"
echo "================================================"

# Check if the server is running
if curl -s http://localhost:8081 > /dev/null; then
    echo "✅ Server is running on http://localhost:8081"
    echo ""
    echo "🧪 To test localStorage manually:"
    echo "   1. Open http://localhost:8081 in Chrome"
    echo "   2. Open DevTools (F12) → Console tab"
    echo "   3. Run: testLocalStorage()"
    echo "   4. Add a task and generate subtasks"
    echo "   5. Check DevTools → Application → Local Storage"
    echo "   6. Refresh the page to see if data persists"
    echo ""
    echo "🔧 Debug commands in console:"
    echo "   testLocalStorage()    - Test if localStorage works"
    echo "   saveToLocalStorage()  - Manually save current state"
    echo "   loadFromLocalStorage() - Manually load saved state"
    echo "   resetAllData()        - Clear all data and reset"
    echo ""
    
    # Open browser automatically on macOS
    if command -v open >/dev/null 2>&1; then
        echo "🌐 Opening browser..."
        open "http://localhost:8081"
    fi
else
    echo "❌ Server is not running. Start it with: ./start-server.sh"
fi
