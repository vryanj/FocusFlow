# Changelog

All notable changes to FocusFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- PWA auto-update functionality with user notifications
- Enhanced service worker with version detection
- Update notification system with "Update Now" button

### Changed
- Improved service worker cache management
- Better error handling in service worker registration

## [1.1.0] - 2025-01-XX

### Added
- **PWA Auto-Update System**: Automatic update detection and user notifications
- **Enhanced Service Worker**: Version-based caching with automatic cleanup
- **Update Notifications**: Users are notified when new versions are available
- **Seamless Updates**: One-click update process without data loss

### Changed
- **App Name**: Updated from "Focus Pomo" to "FocusFlow" throughout the app
- **Service Worker**: Improved cache management and update detection
- **README**: Completely rewritten with professional formatting and screenshots

### Fixed
- **Dark Mode**: Fixed subtask background colors in dark mode (gray-750 → gray-800)
- **App Name**: Fixed app name display on iPhone home screen
- **Repository Cleanup**: Removed unused index files and unnecessary dependencies

### Removed
- **Unused Files**: Removed `index-monolithic.html`, `index-modular.html`, `index-new.html`
- **Migration Scripts**: Removed `migrate-to-modular.js` (no longer needed)
- **Documentation**: Removed `MODULAR_REFACTOR.md` (migration complete)

## [1.0.0] - 2025-01-XX

### Added
- **Core Pomodoro Timer**: 25/5, 50/10, and custom timer modes
- **Gamification System**: Credit rewards for completed sessions
- **AI Task Breakdown**: Google Gemini integration for smart subtask generation
- **Session Management**: Complete session history and analytics
- **Custom Rewards**: User-defined perks and break activities
- **Dark/Light Themes**: Beautiful theme switching with smooth transitions
- **Progressive Web App**: Full PWA functionality with offline support
- **Drag & Drop**: Reorder subtasks with intuitive drag and drop
- **Auto-Save**: Automatic state persistence with localStorage
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Space to start/pause, R to reset, Escape to close modals
- **Session Export**: Export session data as JSON
- **Settings Management**: Google API key configuration
- **Menu System**: Hamburger menu with quick access to features

### Technical Features
- **Modular Architecture**: Clean separation of concerns with dedicated modules
- **Service Worker**: Offline functionality and caching
- **Tailwind CSS**: Modern, utility-first styling
- **Font Awesome Icons**: Beautiful iconography throughout
- **Inter Font**: Clean, readable typography
- **LocalStorage**: Persistent data storage
- **Error Handling**: Comprehensive error handling and user feedback

### Initial Release Features
- Timer with visual progress ring
- Task input and AI-powered subtask generation
- Credit system with purchasable perks
- Session history with detailed analytics
- Dark/light theme switching
- Mobile-responsive design
- PWA installation support
- Offline functionality

---

## Version History

- **1.1.0**: PWA auto-updates, app name fixes, repository cleanup
- **1.0.0**: Initial release with core Pomodoro functionality

## Contributing

When adding new features or making changes, please update this changelog following the format above.

### Categories:
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes 