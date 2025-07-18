// Migration Script for Pomodoro App
// This script helps migrate from the monolithic app.js to the modular structure

console.log('🚀 Starting migration to modular structure...');

// Check if we're running the modular version
function isModularVersion() {
    return window.timerManager && 
           window.storageManager && 
           window.creditsManager && 
           window.taskManager && 
           window.sessionManager && 
           window.modalManager && 
           window.apiManager && 
           window.uiManager;
}

// Migration function
function migrateToModular() {
    if (isModularVersion()) {
        console.log('✅ Modular version detected! Migration complete.');
        return;
    }
    
    console.log('📦 Loading modular structure...');
    
    // Create script elements for each module
    const modules = [
        { src: 'js/modules/storage.js', name: 'Storage' },
        { src: 'js/modules/timer.js', name: 'Timer' },
        { src: 'js/modules/credits.js', name: 'Credits' },
        { src: 'js/modules/tasks.js', name: 'Tasks' },
        { src: 'js/modules/sessions.js', name: 'Sessions' },
        { src: 'js/modules/modals.js', name: 'Modals' },
        { src: 'js/modules/api.js', name: 'API' },
        { src: 'js/modules/ui.js', name: 'UI' }
    ];
    
    let loadedModules = 0;
    
    modules.forEach(module => {
        const script = document.createElement('script');
        script.src = module.src;
        script.onload = () => {
            loadedModules++;
            console.log(`✅ Loaded ${module.name} module`);
            
            if (loadedModules === modules.length) {
                console.log('🎉 All modules loaded! Initializing app...');
                initializeModularApp();
            }
        };
        script.onerror = () => {
            console.error(`❌ Failed to load ${module.name} module`);
        };
        document.head.appendChild(script);
    });
}

// Initialize the modular app
function initializeModularApp() {
    // Initialize DOM elements
    initializeDOMElements();
    
    // Load saved data
    window.storageManager.loadFromLocalStorage();
    window.storageManager.loadSessionsFromLocalStorage();
    
    // Initialize all modules
    window.timerManager.initializeTimer();
    window.creditsManager.initializeCredits();
    window.taskManager.initializeTasks();
    window.sessionManager.initializeSessions();
    window.modalManager.initializeModals();
    window.uiManager.initializeUI();
    
    // Handle timer restoration
    window.timerManager.handleTimerRestoration();
    
    console.log('🎯 Modular app initialized successfully!');
}

// Function to initialize DOM elements (copied from app-modular.js)
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

// Auto-migrate when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', migrateToModular);
} else {
    migrateToModular();
}

// Export migration function for manual use
window.migrateToModular = migrateToModular; 