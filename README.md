# Pomodoro Focus App - Local Dependencies Setup

This project has been updated to use local dependencies instead of CDN resources for better performance, offline capability, and reduced external dependencies.

## Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Quick Setup

Run the setup script to install all dependencies and build assets:

```bash
./setup-local-deps.sh
```

## Manual Setup

If you prefer to run commands manually:

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Build CSS assets:**
   ```bash
   npm run build-css
   ```

3. **Download font files:**
   ```bash
   npm run download-fonts
   ```

4. **Or run everything at once:**
   ```bash
   npm run build
   ```

## Development

For active development with auto-rebuilding CSS:

```bash
npm run dev
```

This will watch for changes in your Tailwind classes and rebuild the CSS automatically.

## Available Scripts

- `npm run build` - Build CSS and download fonts
- `npm run build-css` - Build Tailwind CSS only
- `npm run watch-css` - Watch and rebuild CSS on changes
- `npm run download-fonts` - Download Inter font files
- `npm run dev` - Start development mode (watch CSS)

## What Changed

### Before (CDN Dependencies)
- ❌ Tailwind CSS from `cdn.tailwindcss.com`
- ❌ Inter font from Google Fonts CDN
- ❌ Required internet connection
- ❌ External dependency risks

### After (Local Dependencies)
- ✅ Tailwind CSS compiled locally in `assets/css/output.css`
- ✅ Inter font files stored in `assets/fonts/`
- ✅ Works completely offline
- ✅ Faster loading (no external requests)
- ✅ Better caching control
- ✅ No external dependency risks

## File Structure

```
my-pomodoro/
├── assets/
│   ├── css/
│   │   └── output.css          # Compiled Tailwind CSS
│   └── fonts/
│       ├── inter-400.woff2     # Inter Regular
│       ├── inter-500.woff2     # Inter Medium
│       ├── inter-600.woff2     # Inter SemiBold
│       └── inter-700.woff2     # Inter Bold
├── src/
│   └── input.css               # Source CSS with Tailwind directives
├── scripts/
│   └── download-fonts.js       # Font download script
├── node_modules/               # Node.js dependencies
├── package.json                # Project dependencies
├── tailwind.config.js          # Tailwind configuration
└── setup-local-deps.sh         # Setup script
```

## Docker Integration

The local assets work seamlessly with your existing Docker setup. The Docker container will serve the local files from the `assets/` directory.

## Troubleshooting

**Node.js not found:**
```bash
# Install Node.js from https://nodejs.org/
# Or using package managers:
# macOS: brew install node
# Ubuntu: sudo apt install nodejs npm
```

**Permission denied on setup script:**
```bash
chmod +x setup-local-deps.sh
```

**Build fails:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Benefits

1. **Performance** - No external HTTP requests for CSS/fonts
2. **Reliability** - No dependency on external CDNs
3. **Offline** - App works completely offline
4. **Customization** - Full control over Tailwind configuration
5. **Caching** - Better browser caching for assets
6. **Security** - No external resource loading risks
