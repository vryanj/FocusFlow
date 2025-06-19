#!/bin/bash

echo "🚀 Setting up local dependencies for Pomodoro App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "🧹 Cleaning up existing dependencies..."
rm -rf node_modules package-lock.json

echo "📦 Installing fresh Node.js dependencies..."
echo "   - Tailwind CSS"
echo "   - Font Awesome"
echo "   - Inter font download utilities"
npm install

echo "🏗️ Building all assets (CSS + Fonts)..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "🎉 Your Pomodoro app now uses local dependencies:"
echo "   ✓ Tailwind CSS (compiled locally)"
echo "   ✓ Font Awesome icons + webfonts (self-hosted)"
echo "   ✓ Inter font (downloaded locally)"
echo ""
echo "Available commands:"
echo "  npm run build     - Build CSS and download fonts"
echo "  npm run build-css - Build Tailwind CSS only"
echo "  npm run watch-css - Watch and rebuild CSS on changes"
echo "  npm run dev       - Start development mode (watch CSS)"
