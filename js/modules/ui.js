// UI Module
// Handles all UI-related functionality like theme management and menu

// DOM Elements
let themeToggleBtn, themeToggleDarkIcon, themeToggleLightIcon;
let menuToggle, menuDropdown, menuNewSession, menuHistory, menuSettings, menuRestorePerks;

// UI Functions
function updateThemeIcons() {
    if (document.documentElement.classList.contains('dark')) {
        if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
    }
    else {
        if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
        if (themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    }
    else {
        localStorage.setItem('theme', 'light');
    }
    updateThemeIcons();
}

// Menu Functions
function toggleMenu() {
    if (menuDropdown) {
        menuDropdown.classList.toggle('hidden');
    }
}

function hideMenu() {
    if (menuDropdown && !menuDropdown.classList.contains('hidden')) {
        menuDropdown.classList.add('hidden');
    }
}

function handleNewSession() {
    hideMenu();
    const currentSessionData = window.sessionManager.getCurrentSessionData();
    if (currentSessionData) {
        window.modalManager.showConfirmationModal({
            title: 'Start a new session?',
            message: 'This will finish your current session and clear all tasks and subtasks. Credits and perks will be preserved.',
            onConfirm: () => {
                window.sessionManager.finishCurrentSession();
                window.sessionManager.resetToDefaults();
                window.sessionManager.createNewSession();
                window.modalManager.showMessage({
                    mainText: "New Session Started!",
                    subText: "Previous session saved to history. Ready for a fresh start!",
                    emojis: "🆕✨"
                });
            }
        });
    }
    else {
        window.modalManager.showConfirmationModal({
            title: 'Start a new session?',
            message: 'This will clear all tasks and subtasks. Credits and perks will be preserved.',
            onConfirm: () => {
                window.sessionManager.resetToDefaults();
                window.sessionManager.createNewSession();
                window.modalManager.showMessage({
                    mainText: "New Session Started!",
                    subText: "Fresh start with clean slate!",
                    emojis: "🚀📝"
                });
            }
        });
    }
}

function handleHistory() {
    hideMenu();
    window.sessionManager.showSessionHistoryModal();
}

function handleSettings() {
    hideMenu();
    window.modalManager.showSettingsModal();
}

function handleRestorePerks() {
    hideMenu();
    window.creditsManager.restoreDefaultPerks();
}

// Setup UI event listeners
function setupUIEventListeners() {
    // Theme toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Menu event listeners
    if (menuToggle) menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the window click listener from firing immediately
        toggleMenu();
    });
    if (menuSettings) menuSettings.addEventListener('click', handleSettings);
    if (menuHistory) menuHistory.addEventListener('click', handleHistory);
    if (menuNewSession) menuNewSession.addEventListener('click', handleNewSession);
    if (menuRestorePerks) menuRestorePerks.addEventListener('click', handleRestorePerks);
    
    // Global listener to hide menu when clicking outside
    window.addEventListener('click', (e) => {
        if (menuDropdown && !menuDropdown.contains(e.target) && !menuToggle.contains(e.target)) {
            hideMenu();
        }
    });
    
    // Prevent form submission from reloading the page
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    });
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Space bar to start/pause timer
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            if (window.timerManager.isRunning()) {
                window.timerManager.pauseTimer();
            }
            else {
                window.timerManager.startTimer();
            }
        }
        
        // R key to reset timer
        if (e.code === 'KeyR' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            window.timerManager.resetTimer();
        }
        
        // Escape key to close modals
        if (e.code === 'Escape') {
            window.modalManager.hideMessage();
            window.modalManager.hideCustomTimerModal();
            window.taskManager.hideAddSubtaskModal();
            window.sessionManager.hideSessionHistoryModal();
            window.modalManager.hideConfirmationModal();
        }
    });
}

// Initialize UI DOM elements
function initializeUIElements(elements) {
    themeToggleBtn = elements.themeToggleBtn;
    themeToggleDarkIcon = elements.themeToggleDarkIcon;
    themeToggleLightIcon = elements.themeToggleLightIcon;
    menuToggle = elements.menuToggle;
    menuDropdown = elements.menuDropdown;
    menuNewSession = elements.menuNewSession;
    menuHistory = elements.menuHistory;
    menuSettings = elements.menuSettings;
    menuRestorePerks = elements.menuRestorePerks;
}

// Initialize UI
function initializeUI() {
    updateThemeIcons();
    setupUIEventListeners();
    setupKeyboardShortcuts();
}

// Export UI functions
window.uiManager = {
    updateThemeIcons,
    toggleTheme,
    toggleMenu,
    hideMenu,
    handleNewSession,
    handleHistory,
    handleSettings,
    handleRestorePerks,
    initializeUIElements,
    initializeUI
}; 