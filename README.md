# Pomodoro Focus App 🍅

A modern, feature-rich Pomodoro timer Progressive Web App (PWA) designed to boost productivity through focused work sessions, smart task management, and a motivating rewards system.

## Why Use This Pomodoro App?

**Enhanced Focus & Productivity**
- Break work into manageable, timed intervals to maintain concentration
- Reduce mental fatigue with structured break periods
- Stay in the flow state longer with customizable timer modes

**Smart Task Management**
- AI-powered task breakdown using Google's Gemini API
- Automatically generate sub-tasks from complex projects
- Visual progress tracking with drag-and-drop reordering
- Never lose track of what needs to be done

**Motivating Rewards System**
- Earn credits for completed Pomodoro sessions
- Redeem credits for personal rewards and treats
- Limited inventory system creates urgency and excitement
- Custom perks tailored to your preferences

**Delightful User Experience**
- Witty, encouraging popup messages at the end of each session
- Beautiful dark/light mode themes
- Responsive design works on any device
- Offline capability as a Progressive Web App

## Key Features

### 🎯 **Smart Timer Modes**
- **25/5 Pomodoro**: Classic 25-minute focus, 5-minute break
- **50/10 Extended**: Longer sessions for deep work
- **Custom Mode**: Set your own focus and break durations
- Visual timer ring with smooth animations

### 📋 **Intelligent Task Management**
- Manual task entry with sub-task breakdown
- AI-powered task generation using Google Gemini
- Drag-and-drop reordering of sub-tasks
- Progress tracking with completion checkboxes
- Click-to-edit functionality for easy updates

### 🎁 **Motivating Perks System**
- Earn 1 credit per completed Pomodoro session
- Create custom rewards (coffee breaks, social media time, treats)
- Limited inventory creates scarcity and motivation
- Smart sorting: affordable perks first, sold-out items last
- Visual inventory badges with hover tooltips

### 🎨 **Beautiful Interface**
- Clean, modern design with Tailwind CSS
- Seamless dark/light mode switching
- Responsive layout works on desktop, tablet, and mobile
- Smooth animations and hover effects
- Color-coded visual feedback for different states

### 📱 **Progressive Web App**
- Install on any device like a native app
- Works completely offline
- Fast loading with service worker caching
- Push notifications (when supported)

## Installation

### Quick Start

1. **Clone or download** this repository
2. **Set up Google API** (optional, for AI task generation):
   ```bash
   cp .env.example .env
   # Edit .env and add your Google API key
   ```
3. **Serve the app** using any web server:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
4. **Open** `http://localhost:8000` in your browser
5. **Install as PWA** (optional): Click the install button in your browser

### Google API Setup (Optional)

For AI-powered task breakdown feature:

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Get a Google API key:
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key for Gemini
   - Enable the Gemini API

3. Add your API key to `.env`:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

The app works perfectly without the API key - you just won't have AI-powered task generation.

## How It Works

1. **Set Your Task**: Enter what you want to work on
2. **Generate Sub-tasks**: Use AI or add manually for better organization
3. **Start Timer**: Choose your preferred Pomodoro mode
4. **Stay Focused**: Work until the timer ends with a delightful message
5. **Earn Credits**: Get rewarded for completed sessions
6. **Redeem Perks**: Spend credits on motivating rewards
7. **Repeat**: Build a productive habit with the satisfying cycle

## File Structure

```
my-pomodoro/
├── index.html              # Main app (single file version)
├── index-modular.html      # Modular version entry point
├── modules/                # HTML modules for organization
│   ├── timer.html
│   ├── task-management.html
│   ├── credits-perks.html
│   ├── modals.html
│   └── navigation.html
├── js/                     # JavaScript modules
│   ├── app.js             # Main application logic
│   ├── module-loader.js   # Dynamic module loading
│   └── env-loader.js      # Environment variable handling
├── manifest.json          # PWA manifest
├── sw.js                  # Service worker for offline support
├── .env.example           # Environment template
└── README.md
```

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

**Start your focused work journey today!** 🚀
