// Timer Module
// Handles all timer-related functionality

// Timer State
let timer;
let timeLeft = 25 * 60;
let isRunning = false;
let isPaused = false;
let isBreak = false;
let sessionStartTime;
const ringCircumference = 2 * Math.PI * 45;

const timerModes = {
    pomodoro: { name: '25/5', focus: 25, break: 5 },
    longPomodoro: { name: '50/10', focus: 50, break: 10 },
    custom: { name: 'Custom', focus: 45, break: 15, isCustom: true }
};
let activeMode = 'pomodoro';

// DOM Elements
let timeDisplay, timerRing, startBtn, pauseBtn, resetBtn, timerStatusEl, timerModesContainer, debugStartTimeEl;

// Timer Functions
function selectTimerMode(modeKey) {
    if (activeMode === modeKey && !timerModes[modeKey].isCustom) return; 

    if (timerModes[modeKey].isCustom) {
        window.modalManager.showCustomTimerModal();
        return;
    }

    if (isRunning && !isPaused && !isBreak) {
        const initialDuration = timerModes[activeMode].focus * 60;
        const elapsedTime = initialDuration - timeLeft;
        
        activeMode = modeKey;
        const newTotalDuration = timerModes[activeMode].focus * 60;
        timeLeft = Math.round(newTotalDuration - elapsedTime);
        if (timeLeft < 0) timeLeft = 0;
        updateDisplay();
    } else {
        activeMode = modeKey;
        resetTimer();
    }

    renderTimerModeButtons();
}

function renderTimerModeButtons() {
    if (!timerModesContainer) return;
    
    timerModesContainer.innerHTML = '';
    for (const key in timerModes) {
        const mode = timerModes[key];
        const btn = document.createElement('button');
        btn.textContent = mode.name;
        btn.className = `px-3 py-1 rounded-full text-sm font-medium transition-colors bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600`;
        if (key === activeMode) { btn.classList.add('btn-mode-selected'); }
        btn.onclick = () => selectTimerMode(key);
        timerModesContainer.appendChild(btn);
    }
}

function updateDisplay() {
    // Ensure timeLeft is always an integer to prevent fractional seconds display
    timeLeft = Math.round(timeLeft);
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    if (timeDisplay) {
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (timerRing) {
        const totalDuration = (isBreak ? timerModes[activeMode].break : timerModes[activeMode].focus) * 60;
        const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
        const dashoffset = ringCircumference * (1 - progress);
        timerRing.style.strokeDashoffset = dashoffset;
    }
    
    // Update debug start time display
    if (debugStartTimeEl) {
        if (sessionStartTime) {
            const startDate = new Date(sessionStartTime);
            debugStartTimeEl.textContent = `Started: ${startDate.toLocaleTimeString()} | Elapsed: ${Math.floor((Date.now() - sessionStartTime) / 1000)}s`;
        }
        else {
            debugStartTimeEl.textContent = 'No active session';
        }
    }
    
    // Update button states based on timer state
    if (startBtn && pauseBtn && timerStatusEl) {
        if (isRunning) {
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            timerStatusEl.textContent = isBreak ? 'Break Time!' : 'Focus Time!';
        }
        else if (isPaused) {
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            startBtn.textContent = 'Resume';
            timerStatusEl.textContent = (isBreak ? 'Break Time!' : 'Focus Time!') + ' (Paused)';
        }
        else {
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            startBtn.textContent = 'Start';
            timerStatusEl.textContent = '';
        }
    }
    
    // Update timer ring color based on break/focus state
    if (timerRing) {
        timerRing.classList.remove('text-green-500', 'text-indigo-500');
        timerRing.classList.add(isBreak ? 'text-green-500' : 'text-indigo-500');
    }
}

function startTimer() {
    if (isRunning) {
        return;
    }
    
    // Create new session if none exists and we're starting a focus timer
    if (!window.sessionManager.getCurrentSessionData() && !isBreak) {
        window.sessionManager.createNewSession();
    }
    
    isRunning = true;
    isPaused = false;
    sessionStartTime = Date.now() - ((isBreak ? timerModes[activeMode].break * 60 : timerModes[activeMode].focus * 60) - timeLeft) * 1000;
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    timerStatusEl.textContent = isBreak ? 'Break Time!' : 'Focus Time!';
    timerRing.classList.remove('text-green-500', 'text-indigo-500');
    timerRing.classList.add(isBreak ? 'text-green-500' : 'text-indigo-500');
    
    // Save timer state
    window.storageManager.saveToLocalStorage();
    
    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                timer = null; // Clear the timer reference
                handleTimerEnd();
            }
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = true;
    isRunning = false;
    clearInterval(timer);
    timer = null; // Clear the timer reference
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    startBtn.textContent = 'Resume';
    timerStatusEl.textContent += ' (Paused)';
    
    // Save timer state
    window.storageManager.saveToLocalStorage();
    
    // Update display to ensure UI is in sync
    updateDisplay();
}

function resetTimer() {
    clearInterval(timer);
    timer = null; // Clear the timer reference
    isRunning = false;
    isPaused = false;
    isBreak = false;
    sessionStartTime = null;
    timeLeft = timerModes[activeMode].focus * 60;
    updateDisplay();
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
    startBtn.textContent = 'Start';
    timerStatusEl.textContent = '';
    timerRing.classList.remove('text-green-500');
    timerRing.classList.add('text-indigo-500');
    
    // Save timer state
    window.storageManager.saveToLocalStorage();
}

async function handleTimerEnd() {
    if (!isBreak) {
        // Pause the timer state properly
        isPaused = true;
        isRunning = false;
        
        const sessionDuration = (Date.now() - sessionStartTime) / 1000;
        const plannedDuration = timerModes[activeMode].focus * 60;
        
        const textPrompt = sessionDuration > plannedDuration + 2
            ? "Generate a funny and witty congratulations for someone who finished a task but took longer than planned. Be sarcastic but encouraging, with emojis. One sentence."
            : "Generate a funny and witty congratulations for finishing a Pomodoro session on time. Celebrate the focus! Include emojis. One sentence.";

        const funnyMessage = await window.apiManager.callGemini(textPrompt);
        
        const creditsEarned = Math.floor(timerModes[activeMode].focus / 25);
        window.creditsManager.addCredits(creditsEarned);
        
        // Update session with completed pomodoro
        const currentSessionData = window.sessionManager.getCurrentSessionData();
        if (currentSessionData) {
            currentSessionData.pomodorosCompleted += 1;
            window.sessionManager.updateCurrentSession();
        }
        
        // Prepare for break timer (but don't start yet)
        isBreak = true;
        timeLeft = timerModes[activeMode].break * 60;
        sessionStartTime = null; // Reset for break timer
        
        // Keep timer in paused state until modal closes
        isPaused = true;
        isRunning = false;
        
        // Update UI to show break is ready and paused
        updateDisplay();
        
        // Show completion message and auto-start break when modal closes
        window.modalManager.showMessage({
            mainText: `You've earned ${creditsEarned} credit(s)! 🎉`,
            subText: `${funnyMessage} Break time will start when you close this!`,
            autoClose: false,
            onClose: () => {
                // Simulate start button click to properly start the timer
                if (startBtn) {
                    startBtn.click();
                }
            }
        });
        
        // --- Session History Logging ---
        const sessionLog = {
            mode: activeMode,
            duration: timerModes[activeMode].focus,
            breakDuration: timerModes[activeMode].break,
            creditsEarned: creditsEarned,
            timestamp: new Date().toISOString()
        };
        window.sessionManager.addSessionLog(sessionLog);
        window.storageManager.saveToLocalStorage();
    }
    else {
        // Break is over - pause the timer properly
        isPaused = true;
        isRunning = false;
        
        // Prepare for focus
        isBreak = false;
        timeLeft = timerModes[activeMode].focus * 60;
        sessionStartTime = null;
        
        // Keep timer in paused state
        isPaused = true;
        isRunning = false;
        
        // Update UI
        updateDisplay();
        
        window.modalManager.showMessage({ 
            mainText: "Break's over! Ready for another focus session?", 
            subText: "🔥 Click Start when you're ready to work! 💪",
            autoClose: false,
            onClose: () => {
                // Don't auto-start focus timer, let user start manually
                // Reset to fresh state - not paused, ready to start
                if (startBtn) {
                    isPaused = false;
                    isRunning = false;
                    startBtn.textContent = 'Start';
                    updateDisplay();
                }
            }
        });
    }
}

// Handle timer restoration after app initialization
function handleTimerRestoration() {
    // Check if we need to resume a running timer
    if (isRunning && sessionStartTime && timeLeft > 0) {
        
        // Start the countdown interval directly since isRunning is already true
        timer = setInterval(() => {
            if (!isPaused) {
                timeLeft--;
                updateDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    timer = null;
                    handleTimerEnd();
                }
            }
        }, 1000);
        
        // Update UI to show running state
        if (startBtn) startBtn.classList.add('hidden');
        if (pauseBtn) pauseBtn.classList.remove('hidden');
        if (timerStatusEl) timerStatusEl.textContent = isBreak ? 'Break Time!' : 'Focus Time!';
        
    }
    else if (isRunning && sessionStartTime && timeLeft <= 0) {
        isRunning = false;
        isPaused = false;
        setTimeout(() => handleTimerEnd(), 100);
    }
    
    // Update timer ring color for break/focus state
    if (timerRing) {
        timerRing.classList.remove('text-green-500', 'text-indigo-500');
        timerRing.classList.add(isBreak ? 'text-green-500' : 'text-indigo-500');
    }
}

// Setup timer event listeners
function setupTimerEventListeners() {
    if (startBtn) startBtn.addEventListener('click', () => { 
        if (isRunning) {
            // Do nothing if already running
        }
        else {
            startTimer();
        }
    });
    if (pauseBtn) pauseBtn.addEventListener('click', () => {
        pauseTimer();
    });
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
}

// Initialize timer DOM elements
function initializeTimerElements(elements) {
    timeDisplay = elements.timeDisplay;
    timerRing = elements.timerRing;
    startBtn = elements.startBtn;
    pauseBtn = elements.pauseBtn;
    resetBtn = elements.resetBtn;
    timerStatusEl = elements.timerStatusEl;
    timerModesContainer = elements.timerModesContainer;
    debugStartTimeEl = elements.debugStartTimeEl;
}

// Initialize timer
function initializeTimer() {
    renderTimerModeButtons();
    updateDisplay();
    setupTimerEventListeners();
}

// Export timer state and functions
window.timerManager = {
    // State
    getTimeLeft: () => timeLeft,
    setTimeLeft: (value) => { timeLeft = value; },
    isRunning: () => isRunning,
    setRunning: (value) => { isRunning = value; },
    isPaused: () => isPaused,
    setPaused: (value) => { isPaused = value; },
    isBreak: () => isBreak,
    setBreak: (value) => { isBreak = value; },
    getActiveMode: () => activeMode,
    setActiveMode: (value) => { activeMode = value; },
    getTimerModes: () => timerModes,
    getSessionStartTime: () => sessionStartTime,
    setSessionStartTime: (value) => { sessionStartTime = value; },
    
    // Functions
    selectTimerMode,
    startTimer,
    pauseTimer,
    resetTimer,
    updateDisplay,
    renderTimerModeButtons,
    handleTimerRestoration,
    initializeTimerElements,
    initializeTimer
}; 