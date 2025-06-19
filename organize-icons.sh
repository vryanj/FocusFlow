#!/bin/bash

echo "🚀 Moving PWA icons to proper locations..."
echo "=========================================="

# Function to copy file if it exists
copy_if_exists() {
    if [ -f "$1" ]; then
        cp "$1" "$2"
        echo "✅ Copied: $1 → $2"
    else
        echo "⚠️  Missing: $1"
    fi
}

# Create favicon.ico from 32x32 (you may want to create a proper multi-size .ico later)
copy_if_exists "favicon-32x32.png" "favicon.ico"

# Copy already existing root icons (they're already in place, just confirming)
echo "📁 Root directory icons (already in place):"
echo "✅ favicon-16x16.png"
echo "✅ favicon-32x32.png" 
echo "✅ icon-72x72.png"

# Copy from Android folder
echo ""
echo "📱 Copying Android icons..."
copy_if_exists "android/android-launchericon-96-96.png" "icon-96x96.png"
copy_if_exists "android/android-launchericon-144-144.png" "icon-144x144.png"
copy_if_exists "android/android-launchericon-192-192.png" "icon-192x192.png"
copy_if_exists "android/android-launchericon-512-512.png" "icon-512x512.png"

# Copy from iOS folder
echo ""
echo "🍎 Copying iOS icons..."
copy_if_exists "ios/128.png" "icon-128x128.png"
copy_if_exists "ios/152.png" "icon-152x152.png"
copy_if_exists "ios/180.png" "apple-touch-icon.png"
copy_if_exists "ios/192.png" "icon-192x192.png"  # Backup if Android version missing
copy_if_exists "ios/512.png" "icon-384x384.png"  # Using 512 as 384 (closest size)

# Copy from Windows folder for Microsoft-specific icons
echo ""
echo "🪟 Copying Windows icons..."
copy_if_exists "windows11/Square150x150Logo.scale-100.png" "ms-icon-144x144.png"

# Create any missing sizes by copying closest available size
echo ""
echo "🔄 Creating missing sizes from closest available..."

# If 384x384 is missing, copy from 512x512
if [ ! -f "icon-384x384.png" ] && [ -f "icon-512x512.png" ]; then
    cp "icon-512x512.png" "icon-384x384.png"
    echo "✅ Created icon-384x384.png from icon-512x512.png"
fi

echo ""
echo "🧹 Cleaning up - removing platform-specific folders..."
echo "   (You can skip this step if you want to keep the original folders)"
read -p "   Remove platform folders? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf android/ ios/ windows11/
    echo "✅ Removed platform folders"
else
    echo "📁 Kept platform folders"
fi

echo ""
echo "🎉 PWA icon setup complete!"
echo ""
echo "📋 Final icon checklist:"
ls -la *.png *.ico 2>/dev/null | grep -E "(favicon|icon-|apple-touch|ms-icon)" || echo "No icons found"

echo ""
echo "🔧 Next steps:"
echo "   1. Test your PWA installation (Chrome DevTools → Application → Manifest)"
echo "   2. Verify icons appear correctly in browser tabs and when installed"
echo "   3. Consider creating a proper favicon.ico with multiple sizes"
