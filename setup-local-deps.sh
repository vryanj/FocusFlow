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

echo "📦 Installing Node.js dependencies..."
npm install

echo "📝 Building Tailwind CSS..."
npm run build-css

echo "🔤 Downloading Inter fonts..."
npm run download-fonts

echo "✅ Setup complete!"
echo ""
echo "Available commands:"
echo "  npm run build     - Build CSS and download fonts"
echo "  npm run build-css - Build Tailwind CSS only"
echo "  npm run watch-css - Watch and rebuild CSS on changes"
echo "  npm run dev       - Start development mode (watch CSS)"
echo ""
echo "📝 Don't forget to update your index.html to use local assets!"
