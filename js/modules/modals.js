// Modal Management Module
// Handles all modal functionality

// DOM Elements
let messageModal, modalMessage, modalEmojis, modalSubMessage, modalCountdown, modalCountdownTimer, modalCloseBtn, modalActions;
let customTimerModal, customFocusInput, customBreakInput, customTimerSave, customTimerCancel;
let settingsModal, settingsModalCancel, settingsModalSave, googleApiKeyInput;
let confirmationModal, confirmationTitle, confirmationMessage, confirmationCancel, confirmationConfirm;

// Modal State
let autoCloseTimer = null;
let countdownInterval = null;
let modalOnCloseCallback = null;
let modalClosing = false; // Flag to prevent double execution
let confirmationCallback = null;

// Modal Functions
function showMessage({ mainText, text, subText = '', emojis = '', autoClose = true, onClose = null, actions = [] }) {
    // Support both old format (mainText) and new format (text)
    const messageText = text || mainText;
    
    modalClosing = false; // Reset the flag for new message
    
    modalMessage.textContent = messageText;
    
    // Store the onClose callback
    modalOnCloseCallback = onClose;
    
    // Clear any existing timers
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    // If emojis are explicitly passed, use them
    if (emojis) {
        modalEmojis.textContent = emojis;
        modalSubMessage.textContent = subText;
        modalEmojis.classList.remove('hidden');
    }
    else {
        // Regex to find all emoji characters, including newer ones
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
        const foundEmojis = subText.match(emojiRegex);
        const textOnly = subText.replace(emojiRegex, '').trim();
        
        modalEmojis.textContent = foundEmojis ? foundEmojis.join(' ') : '';
        modalSubMessage.textContent = textOnly;
        modalEmojis.classList.toggle('hidden', !foundEmojis);
    }
    
    modalMessage.classList.remove('hidden');
    modalMessage.classList.add('flex');
    setTimeout(() => {
        const modalDiv = modalMessage.querySelector('div');
        if (modalDiv) modalDiv.classList.remove('scale-95');
    }, 10);
    
    if (autoClose) {
        // Auto-close after 3 seconds
        autoCloseTimer = setTimeout(() => {
            hideMessage();
        }, 3000);
    }
    
    // Start countdown animation
    if (modalCountdown && actions.length > 0) {
        modalCountdown.classList.remove('hidden');
        modalCountdown.classList.add('flex');
        let remainingTime = 5;
        modalCountdownTimer.textContent = remainingTime;
        countdownInterval = setInterval(() => {
            remainingTime--;
            modalCountdownTimer.textContent = remainingTime;
            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                hideMessage();
            }
        }, 1000);
    }
    else {
        // Ensure countdown is hidden if not needed
        modalCountdown.classList.add('hidden');
        modalCountdown.classList.remove('flex');
    }
    
    // Setup action buttons
    const actionButtons = actions.map(action => {
        const button = document.createElement('button');
        button.textContent = action.text;
        button.className = 'bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg';
        button.onclick = () => {
            if (action.action) action.action();
            hideMessage();
        };
        return button;
    });
    
    // Clear existing actions
    modalActions.innerHTML = '';
    
    // Add new action buttons
    actionButtons.forEach(button => {
        modalActions.appendChild(button);
    });
    
    // Add OK button
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.className = 'bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg';
    okButton.onclick = hideMessage;
    modalActions.appendChild(okButton);
    
    messageModal.classList.remove('hidden');
    messageModal.classList.add('flex');
    setTimeout(() => messageModal.querySelector('div').classList.remove('scale-95'), 10);
}

function hideMessage() {
    // Prevent double execution
    if (modalClosing) {
        return;
    }
    modalClosing = true;
    
    // Clear any active timers
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    messageModal.querySelector('div').classList.add('scale-95');
    messageModal.classList.add('hidden');
    messageModal.classList.remove('flex');
    modalCountdown.classList.add('hidden');
    modalCountdown.classList.remove('flex');
    
    // Execute onClose callback if it exists
    if (modalOnCloseCallback) {
        const callback = modalOnCloseCallback;
        modalOnCloseCallback = null; // Clear the callback
        try {
            callback();
        }
        catch (error) {
            console.error('Error in modal onClose callback:', error);
        }
    }
    
    // Reset the flag after a short delay
    setTimeout(() => {
        modalClosing = false;
    }, 100);
}

function showCustomTimerModal() {
    const timerModes = window.timerManager.getTimerModes();
    customFocusInput.value = timerModes.custom.focus;
    customBreakInput.value = timerModes.custom.break;
    customTimerModal.classList.remove('hidden');
    customTimerModal.classList.add('flex');
}

function hideCustomTimerModal() {
    customTimerModal.classList.add('hidden');
    customTimerModal.classList.remove('flex');
}

function saveCustomTimer() {
    const focus = parseInt(customFocusInput.value);
    const breakT = parseInt(customBreakInput.value);
    if (focus > 0 && breakT > 0) {
         if (window.timerManager.isRunning() && !window.timerManager.isPaused() && !window.timerManager.isBreak()) {
            const timerModes = window.timerManager.getTimerModes();
            const activeMode = window.timerManager.getActiveMode();
            const initialDuration = timerModes[activeMode].focus * 60;
            const elapsedTime = initialDuration - window.timerManager.getTimeLeft();

            timerModes.custom.focus = focus;
            timerModes.custom.break = breakT;
            timerModes.custom.name = `${focus}/${breakT}`;
            window.timerManager.setActiveMode('custom');
            
            const newTotalDuration = timerModes.custom.focus * 60;
            const timeLeft = Math.round(newTotalDuration - elapsedTime);
            window.timerManager.setTimeLeft(timeLeft < 0 ? 0 : timeLeft);
        }
        else {
            const timerModes = window.timerManager.getTimerModes();
            timerModes.custom.focus = focus;
            timerModes.custom.break = breakT;
            timerModes.custom.name = `${focus}/${breakT}`;
            window.timerManager.setActiveMode('custom'); 
            window.timerManager.resetTimer();
        }
        window.timerManager.renderTimerModeButtons();
        window.timerManager.updateDisplay();
        hideCustomTimerModal();
    }
    else {
        showMessage({mainText: "Please enter valid numbers for focus and break time."});
    }
}

// Settings Modal Functions
function showSettingsModal() {
    // Load current API key (masked for security)
    const currentApiKey = localStorage.getItem('google_api_key');
    if (googleApiKeyInput && currentApiKey) {
        // Show masked version for security
        googleApiKeyInput.value = '•'.repeat(currentApiKey.length);
        googleApiKeyInput.setAttribute('data-original', currentApiKey);
    }
    
    settingsModal.classList.remove('hidden');
    settingsModal.classList.add('flex');
    
    // Focus on the API key input
    if (googleApiKeyInput) {
        setTimeout(() => {
            googleApiKeyInput.focus();
        }, 100);
    }
}

function hideSettingsModal() {
    settingsModal.classList.add('hidden');
    settingsModal.classList.remove('flex');
    
    // Clear the input
    if (googleApiKeyInput) {
        googleApiKeyInput.value = '';
        googleApiKeyInput.removeAttribute('data-original');
    }
}

function saveSettings() {
    if (!googleApiKeyInput) return;
    
    const apiKeyValue = googleApiKeyInput.value.trim();
    const originalValue = googleApiKeyInput.getAttribute('data-original');
    
    // If the value is masked dots, keep the original value
    if (apiKeyValue === '•'.repeat(apiKeyValue.length) && originalValue) {
        // User didn't change the API key, keep the existing one
        hideSettingsModal();
        return;
    }
    
    // Save the new API key (or clear it if empty)
    if (apiKeyValue) {
        localStorage.setItem('google_api_key', apiKeyValue);
        // Clear the cached API key so it gets reloaded
        window.apiManager.clearApiKey();
        
        showMessage({
            text: "Settings saved successfully!",
            subText: "AI features are now available",
            emojis: "⚙️✅"
        });
    }
    else {
        localStorage.removeItem('google_api_key');
        window.apiManager.clearApiKey();
        
        showMessage({
            text: "API key removed",
            subText: "AI features will be disabled",
            emojis: "⚙️🚫"
        });
    }
    
    hideSettingsModal();
}

// Confirmation Modal Functions
function showConfirmationModal({ title, message, onConfirm }) {
    confirmationTitle.textContent = title;
    confirmationMessage.textContent = message;
    confirmationCallback = onConfirm;
    confirmationModal.classList.remove('hidden');
    confirmationModal.classList.add('flex');
}

function hideConfirmationModal() {
    confirmationModal.classList.add('hidden');
    confirmationModal.classList.remove('flex');
    confirmationCallback = null;
}

// Setup modal event listeners
function setupModalEventListeners() {
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent any form submission or page reload
        e.stopPropagation(); // Prevent event bubbling
        hideMessage();
    });
    if (customTimerSave) customTimerSave.addEventListener('click', saveCustomTimer);
    if (customTimerCancel) customTimerCancel.addEventListener('click', hideCustomTimerModal);
    
    // Settings modal event listeners
    if (settingsModalCancel) settingsModalCancel.addEventListener('click', hideSettingsModal);
    if (settingsModalSave) settingsModalSave.addEventListener('click', saveSettings);
    
    // Confirmation Modal event listeners
    if (confirmationCancel) confirmationCancel.addEventListener('click', hideConfirmationModal);
    if (confirmationConfirm) confirmationConfirm.addEventListener('click', () => {
        if (confirmationCallback) {
            confirmationCallback();
        }
        hideConfirmationModal();
    });
}

// Initialize modal DOM elements
function initializeModalElements(elements) {
    messageModal = elements.messageModal;
    modalMessage = elements.modalMessage;
    modalEmojis = elements.modalEmojis;
    modalSubMessage = elements.modalSubMessage;
    modalCountdown = elements.modalCountdown;
    modalCountdownTimer = elements.modalCountdownTimer;
    modalCloseBtn = elements.modalCloseBtn;
    modalActions = elements.modalActions;
    customTimerModal = elements.customTimerModal;
    customFocusInput = elements.customFocusInput;
    customBreakInput = elements.customBreakInput;
    customTimerSave = elements.customTimerSave;
    customTimerCancel = elements.customTimerCancel;
    settingsModal = elements.settingsModal;
    settingsModalCancel = elements.settingsModalCancel;
    settingsModalSave = elements.settingsModalSave;
    googleApiKeyInput = elements.googleApiKeyInput;
    confirmationModal = elements.confirmationModal;
    confirmationTitle = elements.confirmationTitle;
    confirmationMessage = elements.confirmationMessage;
    confirmationCancel = elements.confirmationCancel;
    confirmationConfirm = elements.confirmationConfirm;
}

// Initialize modals
function initializeModals() {
    setupModalEventListeners();
}

// Export modal functions
window.modalManager = {
    showMessage,
    hideMessage,
    showCustomTimerModal,
    hideCustomTimerModal,
    saveCustomTimer,
    showSettingsModal,
    hideSettingsModal,
    saveSettings,
    showConfirmationModal,
    hideConfirmationModal,
    initializeModalElements,
    initializeModals
}; 