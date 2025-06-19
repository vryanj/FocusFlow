#!/bin/bash

echo "🍎 Replacing PWA icons with iOS versions..."
echo "==========================================="

# Function to replace icon if iOS version exists
replace_with_ios() {
    local ios_file="$1"
    local target_file="$2"
    local description="$3"
    
    if [ -f "ios/$ios_file" ]; then
        cp "ios/$ios_file" "$target_file"
        echo "✅ Replaced: $target_file with ios/$ios_file ($description)"
    else
        echo "⚠️  iOS version not found: ios/$ios_file (keeping current $target_file)"
    fi
}

echo "📱 Replacing favicon and small icons..."
replace_with_ios "16.png" "favicon-16x16.png" "16x16 favicon"
replace_with_ios "32.png" "favicon-32x32.png" "32x32 favicon"
replace_with_ios "32.png" "favicon.ico" "favicon.ico"

echo ""
echo "📱 Replacing standard PWA icons..."
replace_with_ios "72.png" "icon-72x72.png" "72x72 icon"
replace_with_ios "76.png" "icon-96x96.png" "96x96 icon (using 76px as closest)"
replace_with_ios "128.png" "icon-128x128.png" "128x128 icon"
replace_with_ios "144.png" "icon-144x144.png" "144x144 icon"
replace_with_ios "152.png" "icon-152x152.png" "152x152 icon"
replace_with_ios "192.png" "icon-192x192.png" "192x192 icon"
replace_with_ios "512.png" "icon-512x512.png" "512x512 icon"

echo ""
echo "📱 Replacing Apple-specific icons..."
replace_with_ios "180.png" "apple-touch-icon.png" "Apple touch icon"

echo ""
echo "📱 Handling missing sizes with closest iOS alternatives..."

# For 384x384, use 512px (closest available)
if [ -f "ios/512.png" ]; then
    cp "ios/512.png" "icon-384x384.png"
    echo "✅ Replaced: icon-384x384.png with ios/512.png (384x384 using 512px)"
fi

# For 96x96, if 76px wasn't good enough, try 100px
if [ -f "ios/100.png" ]; then
    cp "ios/100.png" "icon-96x96.png"
    echo "✅ Replaced: icon-96x96.png with ios/100.png (96x96 using 100px)"
fi

# For Microsoft tile, use 144px
if [ -f "ios/144.png" ]; then
    cp "ios/144.png" "ms-icon-144x144.png"
    echo "✅ Replaced: ms-icon-144x144.png with ios/144.png"
fi

echo ""
echo "🎉 Icon replacement complete!"
echo ""
echo "📋 Updated icon checklist:"
ls -la *.png *.ico 2>/dev/null | grep -E "(favicon|icon-|apple-touch|ms-icon)" | awk '{print $9, "(" $5 "bytes)"}'

echo ""
echo "📱 iOS folder contents (remaining icons):"
echo "Available sizes: $(ls ios/*.png | sed 's/ios\///g' | sed 's/\.png//g' | sort -n | tr '\n' ' ')"

echo ""
echo "🔧 Next steps:"
echo "   1. Test your PWA to ensure all icons display properly"
echo "   2. Check icon quality in browser tabs and when installed"
echo "   3. The iOS versions should provide better quality and consistency"
echo ""
echo "💡 Tip: You can run this script again anytime to re-apply iOS icons"
