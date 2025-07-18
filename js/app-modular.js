// Main App Module
// Coordinates all other modules and handles initialization

// Function to initialize DOM elements after modules are loaded
function initializeDOMElements() {
    // Timer Elements
    const timerElements = {
        timeDisplay: document.getElementById('time-display'),
        timerRing: document.getElementById('timer-ring'),
        startBtn: document.getElementById('start-btn'),
        pauseBtn: document.getElementById('pause-btn'),
        resetBtn: document.getElementById('reset-btn'),
        timerStatusEl: document.getElementById('timer-status'),
        timerModesContainer: document.getElementById('timer-modes'),
        debugStartTimeEl: document.getElementById('debug-start-time')
    };
    
    // Credits & Perks Elements
    const creditsElements = {
        creditCountEl: document.getElementById('credit-count'),
        perksListEl: document.getElementById('perks-list'),
        addPerkBtn: document.getElementById('add-perk-btn'),
        addPerkModal: document.getElementById('add-perk-modal'),
        perkNameModalInput: document.getElementById('perk-name-modal-input'),
        perkCostModalInput: document.getElementById('perk-cost-modal-input'),
        perkInventoryModalInput: document.getElementById('perk-inventory-modal-input'),
        perkModalSave: document.getElementById('perk-modal-save'),
        perkModalCancel: document.getElementById('perk-modal-cancel')
    };
    
    // Task Management Elements
    const taskElements = {
        taskInput: document.getElementById('task-input'),
        breakdownBtn: document.getElementById('breakdown-btn'),
        subtasksContainer: document.getElementById('subtasks-container'),
        subtaskProgressEl: document.getElementById('subtask-progress'),
        addSubtaskBtn: document.getElementById('add-subtask-btn'),
        addSubtaskModal: document.getElementById('add-subtask-modal'),
        subtaskModalTitle: document.getElementById('subtask-modal-title'),
        subtaskInput: document.getElementById('subtask-input'),
        subtaskModalSave: document.getElementById('subtask-modal-save'),
        subtaskModalCancel: document.getElementById('subtask-modal-cancel')
    };
    
    // Session Management Elements
    const sessionElements = {
        sessionHistoryBtn: document.getElementById('session-history-btn'),
        sessionHistoryModal: document.getElementById('session-history-modal'),
        sessionHistoryClose: document.getElementById('session-history-close'),
        sessionsListEl: document.getElementById('sessions-list'),
        clearAllSessionsBtn: document.getElementById('clear-all-sessions'),
        exportSessionsBtn: document.getElementById('export-sessions')
    };
    
    // Modal Elements
    const modalElements = {
        messageModal: document.getElementById('message-modal'),
        modalMessage: document.getElementById('modal-message'),
        modalEmojis: document.getElementById('modal-emojis'),
        modalSubMessage: document.getElementById('modal-sub-message'),
        modalCountdown: document.getElementById('modal-countdown'),
        modalCountdownTimer: document.getElementById('modal-countdown-timer'),
        modalCloseBtn: document.getElementById('modal-close-btn'),
        modalActions: document.getElementById('modal-actions'),
        customTimerModal: document.getElementById('custom-timer-modal'),
        customFocusInput: document.getElementById('custom-focus-input'),
        customBreakInput: document.getElementById('custom-break-input'),
        customTimerSave: document.getElementById('custom-timer-save'),
        customTimerCancel: document.getElementById('custom-timer-cancel'),
        settingsModal: document.getElementById('settings-modal'),
        settingsModalCancel: document.getElementById('settings-modal-cancel'),
        settingsModalSave: document.getElementById('settings-modal-save'),
        googleApiKeyInput: document.getElementById('google-api-key-input'),
        confirmationModal: document.getElementById('confirmation-modal'),
        confirmationTitle: document.getElementById('confirmation-title'),
        confirmationMessage: document.getElementById('confirmation-message'),
        confirmationCancel: document.getElementById('confirmation-cancel'),
        confirmationConfirm: document.getElementById('confirmation-confirm')
    };
    
    // UI Elements
    const uiElements = {
        themeToggleBtn: document.getElementById('theme-toggle'),
        themeToggleDarkIcon: document.getElementById('theme-toggle-dark-icon'),
        themeToggleLightIcon: document.getElementById('theme-toggle-light-icon'),
        menuToggle: document.getElementById('menu-toggle'),
        menuDropdown: document.getElementById('menu-dropdown'),
        menuNewSession: document.getElementById('menu-new-session'),
        menuHistory: document.getElementById('menu-history'),
        menuSettings: document.getElementById('menu-settings'),
        menuRestorePerks: document.getElementById('menu-restore-perks')
    };
    
    // Initialize all modules with their DOM elements
    window.timerManager.initializeTimerElements(timerElements);
    window.creditsManager.initializeCreditsElements(creditsElements);
    window.taskManager.initializeTaskElements(taskElements);
    window.sessionManager.initializeSessionElements(sessionElements);
    window.modalManager.initializeModalElements(modalElements);
    window.uiManager.initializeUIElements(uiElements);
}

// --- Initialize Functions ---
function initializeApp() {
    // Initialize DOM elements first (after modules are loaded)
    initializeDOMElements();
    
    // Load saved data from localStorage
    window.storageManager.loadFromLocalStorage();
    window.storageManager.loadSessionsFromLocalStorage();
    
    // Initialize all modules
    window.timerManager.initializeTimer();
    window.creditsManager.initializeCredits();
    window.taskManager.initializeTasks();
    window.sessionManager.initializeSessions();
    window.modalManager.initializeModals();
    window.uiManager.initializeUI();
    
    // After everything is initialized, handle timer restoration
    window.timerManager.handleTimerRestoration();
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully');
            })
            .catch((registrationError) => {
                console.error('Service Worker registration failed:', registrationError);
            });
    }
}

// Load modules in the correct order
async function loadModules() {
    // Load modules in dependency order
    const modules = [
        'js/modules/storage.js',
        'js/modules/timer.js',
        'js/modules/credits.js',
        'js/modules/tasks.js',
        'js/modules/sessions.js',
        'js/modules/modals.js',
        'js/modules/api.js',
        'js/modules/ui.js'
    ];
    
    for (const module of modules) {
        const script = document.createElement('script');
        script.src = module;
        script.async = false; // Load synchronously to maintain order
        document.head.appendChild(script);
        
        // Wait for script to load
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
        });
    }
    
    // Initialize app after all modules are loaded
    initializeApp();
}

// Start loading modules when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadModules);
} else {
    loadModules();
} 