// DOM Elements (initialized after modules load)
let timeDisplay, timerRing, startBtn, pauseBtn, resetBtn, creditCountEl, perksListEl, addPerkBtn;
let addPerkModal, perkNameModalInput, perkCostModalInput, perkInventoryModalInput, perkModalSave, perkModalCancel;
let timerStatusEl, taskInput, breakdownBtn, subtasksContainer, subtaskProgressEl, addSubtaskBtn, timerModesContainer;
let themeToggleBtn, themeToggleDarkIcon, themeToggleLightIcon, debugStartTimeEl;
let messageModal, modalMessage, modalEmojis, modalSubMessage, modalCountdown, modalCountdownTimer, modalCloseBtn, modalActions;
let customTimerModal, customFocusInput, customBreakInput, customTimerSave, customTimerCancel;
let addSubtaskModal, subtaskModalTitle, subtaskInput, subtaskModalSave, subtaskModalCancel;
let sessionHistoryBtn, newSessionBtn, sessionHistoryModal, sessionHistoryClose, sessionsListEl;
let clearAllSessionsBtn, exportSessionsBtn;
let settingsModal, settingsModalCancel, settingsModalSave, googleApiKeyInput;

// Function to initialize DOM elements after modules are loaded
function initializeDOMElements() {
    // Timer Elements
    timeDisplay = document.getElementById('time-display');
    timerRing = document.getElementById('timer-ring');
    startBtn = document.getElementById('start-btn');
    pauseBtn = document.getElementById('pause-btn');
    resetBtn = document.getElementById('reset-btn');
    timerStatusEl = document.getElementById('timer-status');
    timerModesContainer = document.getElementById('timer-modes');
    debugStartTimeEl = document.getElementById('debug-start-time');
    
    // Credits & Perks Elements
    creditCountEl = document.getElementById('credit-count');
    perksListEl = document.getElementById('perks-list');
    addPerkBtn = document.getElementById('add-perk-btn');
    
    // Add Perk Modal Elements
    addPerkModal = document.getElementById('add-perk-modal');
    perkNameModalInput = document.getElementById('perk-name-modal-input');
    perkCostModalInput = document.getElementById('perk-cost-modal-input');
    perkInventoryModalInput = document.getElementById('perk-inventory-modal-input');
    perkModalSave = document.getElementById('perk-modal-save');
    perkModalCancel = document.getElementById('perk-modal-cancel');
    
    // Task Management Elements
    taskInput = document.getElementById('task-input');
    breakdownBtn = document.getElementById('breakdown-btn');
    subtasksContainer = document.getElementById('subtasks-container');
    subtaskProgressEl = document.getElementById('subtask-progress');
    addSubtaskBtn = document.getElementById('add-subtask-btn');
    
    // Theme Elements
    themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    
    // Modal Elements
    messageModal = document.getElementById('message-modal');
    modalMessage = document.getElementById('modal-message');
    modalEmojis = document.getElementById('modal-emojis');
    modalSubMessage = document.getElementById('modal-sub-message');
    modalCountdown = document.getElementById('modal-countdown');
    modalCountdownTimer = document.getElementById('modal-countdown-timer');
    modalCloseBtn = document.getElementById('modal-close-btn');
    modalActions = document.getElementById('modal-actions');
    customTimerModal = document.getElementById('custom-timer-modal');
    customFocusInput = document.getElementById('custom-focus-input');
    customBreakInput = document.getElementById('custom-break-input');
    customTimerSave = document.getElementById('custom-timer-save');
    customTimerCancel = document.getElementById('custom-timer-cancel');
    
    // Add Subtask Modal Elements
    addSubtaskModal = document.getElementById('add-subtask-modal');
    subtaskModalTitle = document.getElementById('subtask-modal-title');
    subtaskInput = document.getElementById('subtask-input');
    subtaskModalSave = document.getElementById('subtask-modal-save');
    subtaskModalCancel = document.getElementById('subtask-modal-cancel');
    
    // Session Management Elements
    sessionHistoryBtn = document.getElementById('session-history-btn');
    newSessionBtn = document.getElementById('new-session-btn');
    sessionHistoryModal = document.getElementById('session-history-modal');
    sessionHistoryClose = document.getElementById('session-history-close');
    sessionsListEl = document.getElementById('sessions-list');
    clearAllSessionsBtn = document.getElementById('clear-all-sessions');
    exportSessionsBtn = document.getElementById('export-sessions');
    
    // Menu Elements
    menuToggle = document.getElementById('menu-toggle');
    menuDropdown = document.getElementById('menu-dropdown');
    menuNewSession = document.getElementById('menu-new-session');
    menuHistory = document.getElementById('menu-history');
    menuSettings = document.getElementById('menu-settings');
    menuRestorePerks = document.getElementById('menu-restore-perks');
    
    // Settings Modal Elements
    settingsModal = document.getElementById('settings-modal');
    settingsModalCancel = document.getElementById('settings-modal-cancel');
    settingsModalSave = document.getElementById('settings-modal-save');
    googleApiKeyInput = document.getElementById('google-api-key-input');
    
    console.log('🔗 DOM elements initialized after module loading');
}


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

// Default perks function
function getDefaultPerks() {
    return [
        { name: '15 mins social media', cost: 1, inventory: 3 },
        { name: '15 mins watching movies', cost: 1, inventory: 3 },
        { name: '30 mins workout', cost: 2, inventory: 2 },
        { name: '30 mins walk', cost: 2, inventory: 2 },
        { name: 'Premium Netflix session', cost: 3, inventory: 0 }, // Sold out for testing
        { name: 'Expensive coffee break', cost: 5, inventory: 0 }   // Another sold out for testing
    ];
}

// App State
let credits = 0;
let perks = getDefaultPerks();
let subtasks = [];
let sessionHistory = [];

// Session Management State
let sessions = [];
let currentSessionId = null;
let currentSessionData = null;

function loadSessionsFromLocalStorage() {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    if (savedSessions) {
        sessions = JSON.parse(savedSessions);
        const currentSessionIdSaved = localStorage.getItem('pomodoroCurrentSessionId');
        if (currentSessionIdSaved) {
            currentSessionId = currentSessionIdSaved;
            currentSessionData = sessions.find(s => s.id === currentSessionId) || null;
        }
    }
    console.log('📂 Sessions loaded from localStorage.');
}

function renderSessionHistory() {
    if (!sessionsListEl) {
        // This can happen if the session history modal is not yet loaded/visible
        console.warn('Session list element not found, skipping render.');
        return;
    }

    sessionsListEl.innerHTML = ''; // Clear existing list

    // Use the `sessions` array as the source of truth
    const sessionsToRender = sessions || [];

    if (sessionsToRender.length === 0) {
        sessionsListEl.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 italic p-4">No sessions recorded yet.</p>';
        return;
    }

    // Sort sessions by start time, newest first
    const sortedSessions = [...sessionsToRender].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    sortedSessions.forEach(session => {
        const sessionEl = document.createElement('div');
        sessionEl.className = 'p-3 border-b border-gray-200 dark:border-gray-700';

        const startTime = new Date(session.startTime).toLocaleString();
        const endTime = session.endTime ? new Date(session.endTime).toLocaleString() : 'In Progress';
        const duration = session.endTime ? `${Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)} mins` : '-';
        const pomodoros = session.pomodorosCompleted || 0;

        sessionEl.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-semibold text-gray-800 dark:text-gray-200">${session.task || 'Untitled Session'}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${startTime}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium">${pomodoros} 🍅</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">${duration}</p>
                </div>
            </div>
        `;
        sessionsListEl.appendChild(sessionEl);
    });
}

// --- LocalStorage Functions ---
function saveToLocalStorage() {
    try {
        const appData = {
            credits: credits,
            perks: perks,
            subtasks: subtasks,
            mainTask: taskInput ? taskInput.value : '',
            activeMode: activeMode,
            customMode: timerModes.custom,
            timerState: {
                timeLeft: timeLeft,
                isRunning: isRunning,
                isPaused: isPaused,
                isBreak: isBreak,
                sessionStartTime: sessionStartTime
            },
            sessionHistory: sessionHistory // Add session history to saved data
        };
        localStorage.setItem('pomodoroAppData', JSON.stringify(appData));
        console.log('💾 Data saved to localStorage:', appData);
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('pomodoroAppData');
        console.log('🔍 Checking localStorage for saved data...');
        
        if (saved) {
            const appData = JSON.parse(saved);
            console.log('📖 Found saved data:', appData);
            
            // Restore credits and perks
            credits = appData.credits || 0;
            perks = appData.perks || getDefaultPerks();
            
            // Migrate existing perks to add inventory if missing
            perks = perks.map(perk => {
                if (perk.inventory === undefined) {
                    // Add default inventory to existing perks
                    return { ...perk, inventory: 3 };
                }
                return perk;
            });
            
            console.log('💰 Loaded credits:', credits);
            console.log('🎁 Loaded perks (with inventory):', perks);
            
            // Restore subtasks
            subtasks = appData.subtasks || [];
            
            // Restore main task (only if taskInput is available)
            if (appData.mainTask && taskInput) {
                taskInput.value = appData.mainTask;
            }
            
            // Restore active mode
            activeMode = appData.activeMode || 'pomodoro';
            
            // Restore custom timer settings
            if (appData.customMode) {
                timerModes.custom = appData.customMode;
            }
            
            // Restore timer state
            if (appData.timerState) {
                timeLeft = appData.timerState.timeLeft || (timerModes[activeMode].focus * 60);
                isRunning = appData.timerState.isRunning || false;
                isPaused = appData.timerState.isPaused || false;
                isBreak = appData.timerState.isBreak || false;
                sessionStartTime = appData.timerState.sessionStartTime || null;
                
                console.log('⏰ Restored timer state:', {
                    timeLeft,
                    isRunning,
                    isPaused,
                    isBreak,
                    sessionStartTime
                });
                
                // If timer was running when saved, calculate elapsed time and resume
                if (isRunning && sessionStartTime) {
                    const elapsedTime = (Date.now() - sessionStartTime) / 1000;
                    const totalDuration = (isBreak ? timerModes[activeMode].break : timerModes[activeMode].focus) * 60;
                    timeLeft = Math.max(0, Math.round(totalDuration - elapsedTime));
                    
                    if (timeLeft > 0) {
                        console.log(`🔄 Resuming timer with ${Math.floor(timeLeft / 60)}:${String(Math.floor(timeLeft % 60)).padStart(2, '0')} remaining`);
                        // Will resume after DOM elements are initialized
                    } else {
                        console.log('⏰ Timer would have finished, completing session');
                        isRunning = false;
                        isPaused = false;
                        // Will complete after DOM elements are initialized
                        setTimeout(() => handleTimerEnd(), 100);
                    }
                }
            } else {
                // No saved timer state, ensure we're in default state
                timeLeft = timerModes[activeMode].focus * 60;
                isRunning = false;
                isPaused = false;
                isBreak = false;
                sessionStartTime = null;
            }
            
            // Restore session history
            sessionHistory = appData.sessionHistory || [];
            renderSessionHistory();

            console.log('✅ App data loaded from localStorage successfully');
        } else {
            console.log('📝 No saved data found, using defaults');
        }
    } catch (error) {
        console.error('❌ Error loading from localStorage:', error);
    }
}

function clearLocalStorage() {
    localStorage.removeItem('pomodoroAppData');
    console.log('🗑️ LocalStorage cleared');
}

// Debug function to reset all data (can be called from console)
function resetAllData() {
    credits = 0;
    perks = getDefaultPerks();
    subtasks = [];
    sessionHistory = [];
    if (taskInput) taskInput.value = '';
    clearLocalStorage();
    updateCredits();
    renderPerks();
    renderSubtasks();
    renderSessionHistory(); // Reset session history display
    console.log('🔄 All data reset to defaults');
}

// Test function to verify localStorage is working
function testLocalStorage() {
    console.log('🧪 Testing localStorage...');
    
    // Test basic localStorage
    try {
        localStorage.setItem('test', 'working');
        const test = localStorage.getItem('test');
        localStorage.removeItem('test');
        console.log('✅ Basic localStorage works:', test);
    } catch (e) {
        console.error('❌ Basic localStorage failed:', e);
        return;
    }
    
    // Test our save function
    console.log('💾 Testing saveToLocalStorage...');
    saveToLocalStorage();
    
    // Check what was saved
    const saved = localStorage.getItem('pomodoroAppData');
    if (saved) {
        console.log('✅ Data saved successfully:', JSON.parse(saved));
    } else {
        console.error('❌ No data was saved');
    }
}

// Debug function to test perks display (call from console)
function debugPerks() {
    console.log('🔍 Debug Perks Info:');
    console.log('Credits:', credits);
    console.log('Perks array:', perks);
    console.log('creditCountEl element:', creditCountEl);
    console.log('perksListEl element:', perksListEl);
    console.log('Perks list innerHTML:', perksListEl ? perksListEl.innerHTML : 'Element not found');
    
    console.log('🔄 Forcing re-render...');
    updateCredits();
    renderPerks();
}

// --- Gemini API ---
let API_KEY = null;

async function initializeAPI() {
    if (!API_KEY) {
        // First try localStorage
        API_KEY = localStorage.getItem('google_api_key');
        
        // If not in localStorage, try environment variables as fallback
        if (!API_KEY) {
            await window.envLoader.load();
            API_KEY = window.envLoader.get('GOOGLE_API_KEY');
        }
        
        if (!API_KEY) {
            console.log('Google API key not configured. AI features will be disabled.');
            throw new Error('API key not configured');
        }
    }
}

async function callGemini(prompt) {
    await initializeAPI();
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    try {
        const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API call failed: ${response.status}`);
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response.";
    } catch (error) {
        console.error('Gemini API Error:', error);
        return "Error contacting AI. Check console.";
    }
}

async function generateSubtasks() {
    const mainTask = taskInput.value.trim();
    if (!mainTask) { 
        showMessage({
            text: "Please enter a task first",
            subText: "Add a task description above to generate subtasks",
            emojis: "📝"
        }); 
        return; 
    }
    
    // Check if API key is available
    const apiKey = localStorage.getItem('google_api_key');
    if (!apiKey) {
        showMessage({
            text: "Google API key required",
            subText: "Set your API key in Settings to use AI features",
            emojis: "🔑⚙️",
            actions: [
                {
                    text: "Open Settings",
                    action: () => {
                        hideMessage();
                        showSettingsModal();
                    }
                }
            ]
        });
        return;
    }
    
    breakdownBtn.disabled = true;
    breakdownBtn.innerHTML = `<span class="spinner"></span> Generating...`;
    
    try {
        const prompt = `Break down the following task into a short list of actionable sub-tasks. Each sub-task should be something that can be focused on for a 25-minute pomodoro session. Return ONLY the list as plain text, with each sub-task on a new line. Do not use markdown, numbering, or any introductory text. The task is: "${mainTask}"`;
        const resultText = await callGemini(prompt);
        subtasks = resultText.split('\n').filter(task => task.trim() !== '').map(task => ({ text: task, completed: false }));
        renderSubtasks();
        saveToLocalStorage(); // Save after generating subtasks
        
        showMessage({
            text: "Subtasks generated successfully!",
            subText: "AI broke down your task into focused sessions",
            emojis: "✨🎯"
        });
    } catch (error) {
        console.error('Error generating subtasks:', error);
        showMessage({
            text: "Failed to generate subtasks",
            subText: "Check your API key in Settings or try again",
            emojis: "❌🔧"
        });
    } finally {
        breakdownBtn.disabled = false;
        breakdownBtn.innerHTML = '<span class="text-xl">✨</span> Generate Sub-tasks from above';
    }
}

// --- Timer Functions ---
function selectTimerMode(modeKey) {
    if (activeMode === modeKey && !timerModes[modeKey].isCustom) return; 

    if (timerModes[modeKey].isCustom) {
        showCustomTimerModal();
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
        } else {
            debugStartTimeEl.textContent = 'No active session';
        }
    }
    
    // Update button states based on timer state
    if (startBtn && pauseBtn && timerStatusEl) {
        if (isRunning) {
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            timerStatusEl.textContent = isBreak ? 'Break Time!' : 'Focus Time!';
        } else if (isPaused) {
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            startBtn.textContent = 'Resume';
            timerStatusEl.textContent = (isBreak ? 'Break Time!' : 'Focus Time!') + ' (Paused)';
        } else {
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
    console.log('▶️ startTimer called, isRunning:', isRunning, 'isBreak:', isBreak, 'timeLeft:', timeLeft);
    
    if (isRunning) {
        console.log('⚠️ Timer already running, skipping start');
        return;
    }
    
    // Create new session if none exists and we're starting a focus timer
    if (!currentSessionData && !isBreak) {
        createNewSession();
    }
    
    console.log('🚀 Starting timer...', isBreak ? 'BREAK' : 'FOCUS');
    isRunning = true;
    isPaused = false;
    sessionStartTime = Date.now() - ((isBreak ? timerModes[activeMode].break * 60 : timerModes[activeMode].focus * 60) - timeLeft) * 1000;
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    timerStatusEl.textContent = isBreak ? 'Break Time!' : 'Focus Time!';
    timerRing.classList.remove('text-green-500', 'text-indigo-500');
    timerRing.classList.add(isBreak ? 'text-green-500' : 'text-indigo-500');
    
    // Save timer state
    saveToLocalStorage();
    
    console.log('✅ Timer started successfully');
    
    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                console.log('⏰ Timer reached 0, clearing interval and handling timer end...');
                clearInterval(timer);
                timer = null; // Clear the timer reference
                handleTimerEnd();
            }
        }
    }, 1000);
}

function pauseTimer() {
    console.log('⏸️ pauseTimer called');
    isPaused = true;
    isRunning = false;
    clearInterval(timer);
    timer = null; // Clear the timer reference
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    startBtn.textContent = 'Resume';
    timerStatusEl.textContent += ' (Paused)';
    console.log('✅ Timer paused successfully');
    
    // Save timer state
    saveToLocalStorage();
    
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
    saveToLocalStorage();
}

async function handleTimerEnd() {
    console.log('🎯 handleTimerEnd called, isBreak:', isBreak);
    
    if (!isBreak) {
        console.log('⏸️ Focus session ended, pausing timer state...');
        // Pause the timer state properly
        isPaused = true;
        isRunning = false;
        
        const sessionDuration = (Date.now() - sessionStartTime) / 1000;
        const plannedDuration = timerModes[activeMode].focus * 60;
        
        const textPrompt = sessionDuration > plannedDuration + 2
            ? "Generate a funny and witty congratulations for someone who finished a task but took longer than planned. Be sarcastic but encouraging, with emojis. One sentence."
            : "Generate a funny and witty congratulations for finishing a Pomodoro session on time. Celebrate the focus! Include emojis. One sentence.";

        const funnyMessage = await callGemini(textPrompt);
        
        const creditsEarned = Math.floor(timerModes[activeMode].focus / 25);
        credits += creditsEarned;
        updateCredits();
        
        // Update session with completed pomodoro
        if (currentSessionData) {
            currentSessionData.pomodorosCompleted += 1;
            updateCurrentSession();
        }
        
        // Prepare for break timer (but don't start yet)
        console.log('🔄 Switching to break mode...');
        isBreak = true;
        timeLeft = timerModes[activeMode].break * 60;
        sessionStartTime = null; // Reset for break timer
        
        // Keep timer in paused state until modal closes
        isPaused = true;
        isRunning = false;
        
        // Update UI to show break is ready and paused
        updateDisplay();
        
        console.log('📱 Showing completion modal...');
        // Show completion message and auto-start break when modal closes
        showMessage({
            mainText: `You've earned ${creditsEarned} credit(s)! 🎉`,
            subText: `${funnyMessage} Break time will start when you close this!`,
            autoClose: true,
            onClose: () => {
                console.log('🚪 Modal closed, starting break timer...');
                console.log('📊 Timer state before start: isPaused=', isPaused, 'isRunning=', isRunning, 'isBreak=', isBreak);
                // Simulate start button click to properly start the timer
                if (startBtn) {
                    console.log('🟢 Clicking start button to begin break...');
                    startBtn.click();
                } else {
                    console.error('❌ Start button not found!');
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
        sessionHistory.push(sessionLog);
        saveToLocalStorage(); // Save session history to localStorage
    } else {
        // Break is over - pause the timer properly
        console.log('⏸️ Break session ended, pausing timer state...');
        isPaused = true;
        isRunning = false;
        
        // Prepare for focus
        console.log('🔄 Switching to focus mode...');
        isBreak = false;
        timeLeft = timerModes[activeMode].focus * 60;
        sessionStartTime = null;
        
        // Keep timer in paused state
        isPaused = true;
        isRunning = false;
        
        // Update UI
        updateDisplay();
        
        console.log('📱 Showing break-over modal...');
        showMessage({ 
            mainText: "Break's over! Ready for another focus session?", 
            subText: "🔥 Click Start when you're ready to work! 💪",
            autoClose: true,
            onClose: () => {
                // Don't auto-start focus timer, let user start manually
                console.log('🚪 Modal closed. Ready for next focus session.');
                // Reset to fresh state - not paused, ready to start
                if (startBtn) {
                    isPaused = false;
                    isRunning = false;
                    startBtn.textContent = 'Start';
                    updateDisplay();
                    console.log('✅ Focus timer ready to start manually');
                }
            }
        });
    }
}


// --- Task & Sub-task Functions ---
function updateSubtaskProgress() {
    const totalTasks = subtasks.length;
    if (totalTasks === 0) {
        subtaskProgressEl.textContent = '0%';
        return;
    }
    const completedTasks = subtasks.filter(task => task.completed).length;
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    subtaskProgressEl.textContent = `${percentage}%`;
}

function renderSubtasks() {
    subtasksContainer.innerHTML = '';
    if (subtasks.length === 0) {
        subtasksContainer.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 italic">No sub-tasks yet. Generate them or add one manually!</p>`;
    } else {
        subtasks.forEach((task, index) => {
            const taskEl = document.createElement('div');
            taskEl.className = 'flex items-center bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-600 p-3 rounded-lg gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
            taskEl.draggable = true;
            taskEl.dataset.index = index;
            taskEl.innerHTML = `
                <div class="drag-handle cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 shrink-0" title="Drag to reorder">
                    <i class="fa-solid fa-grip-vertical"></i>
                </div>
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-500 shrink-0" onchange="toggleSubtask(${index})">
                <span class="flex-grow text-gray-800 dark:text-gray-200 ${task.completed ? 'line-through text-gray-500' : ''} cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-2 py-1 transition-colors" onclick="editSubtask(${index})" title="Click to edit">${task.text}</span>
                 <button class="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-full text-red-500 shrink-0" onclick="deleteSubtask(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            subtasksContainer.appendChild(taskEl);
        });
        subtasksContainer.innerHTML += `<p class="text-xs text-center text-gray-400 dark:text-gray-500 italic">Click a task to edit it. Drag the handle to reorder.</p>`;
        
        // Add drag and drop event listeners
        setupDragAndDrop();
    }
    updateSubtaskProgress();
}

function showAddSubtaskModal() {
    if (addSubtaskModal) {
        subtaskModalTitle.textContent = 'Add New Sub-task';
        subtaskInput.value = '';
        delete addSubtaskModal.dataset.editingIndex;
        addSubtaskModal.classList.remove('hidden');
        subtaskInput.focus();
    }
}

function showEditSubtaskModal(index) {
    if (addSubtaskModal && subtasks[index]) {
        subtaskModalTitle.textContent = 'Edit Sub-task';
        subtaskInput.value = subtasks[index].text;
        addSubtaskModal.dataset.editingIndex = index;
        addSubtaskModal.classList.remove('hidden');
        subtaskInput.focus();
    }
}

function addManualSubtask() {
    showAddSubtaskModal();
}

function hideAddSubtaskModal() {
    if (addSubtaskModal) {
        addSubtaskModal.classList.add('hidden');
        // Clear input and editing state
        subtaskInput.value = '';
        delete addSubtaskModal.dataset.editingIndex;
    }
}

function editSubtask(index) {
    showEditSubtaskModal(index);
}
function updateSubtaskText(index, newText) { 
    subtasks[index].text = newText; 
    saveToLocalStorage(); // Save when subtask text is updated
}
function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
    saveToLocalStorage(); // Save when subtask is deleted
}
function toggleSubtask(index) {
    subtasks[index].completed = !subtasks[index].completed;
    renderSubtasks();
    saveToLocalStorage(); // Save when subtask completion status changes
}

// --- Drag and Drop Functions ---
let draggedElement = null;
let draggedIndex = null;

function setupDragAndDrop() {
    const taskElements = subtasksContainer.querySelectorAll('[draggable="true"]');
    
    taskElements.forEach((element, index) => {
        // Handle drag start
        element.addEventListener('dragstart', (e) => {
            draggedElement = e.target.closest('[draggable="true"]');
            draggedIndex = parseInt(draggedElement.dataset.index, 10);
            e.dataTransfer.effectAllowed = 'move';
            // Add a slight delay to allow the browser to render the drag image
            setTimeout(() => {
                if (draggedElement) {
                    draggedElement.classList.add('dragging');
                }
            }, 0);
        });

        // Handle drag end
        element.addEventListener('dragend', (e) => {
            if (draggedElement) {
                draggedElement.classList.remove('dragging');
                draggedElement = null;
                draggedIndex = null;
            }
        });
    });
}

function renderSessionHistory() {
    if (!sessionsListEl) return;
    
    if (sessions.length === 0) {
        sessionsListEl.innerHTML = `
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <i class="fa-solid fa-exclamation-circle text-6xl mx-auto mb-4 opacity-50"></i>
                <p class="text-lg mb-2">No sessions yet</p>
                <p class="text-sm">Start a new session to see your history here</p>
            </div>
        `;
        return;
    }
    
    sessionsListEl.innerHTML = sessions.map(session => {
        const startDate = new Date(session.startTime);
        const isActive = session.id === currentSessionId;
        const statusIcon = session.status === 'completed' ? '✅' : '🔄';
        
        return `
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border ${isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-grow">
                        <h4 class="font-semibold text-lg ${isActive ? 'text-blue-700 dark:text-blue-300' : ''} flex items-center gap-2">
                            ${statusIcon} ${session.title}
                            ${isActive ? '<span class="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Current</span>' : ''}
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString()}
                        </p>
                    </div>
                    <div class="flex gap-2 ml-4">
                        <button onclick="restoreSession('${session.id}')" class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                            Restore
                        </button>
                        <button onclick="deleteSession('${session.id}')" class="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                            Delete
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                        <span class="text-gray-500 dark:text-gray-400">Duration:</span>
                        <div class="font-medium">${session.duration ? formatDuration(session.duration) : 'In progress'}</div>
                    </div>
                    <div>
                        <span class="text-gray-500 dark:text-gray-400">Tasks:</span>
                        <div class="font-medium">${session.tasksCompleted}/${session.totalTasks}</div>
                    </div>
                    <div>
                        <span class="text-gray-500 dark:text-gray-400">Pomodoros:</span>
                        <div class="font-medium">${session.pomodorosCompleted}</div>
                    </div>
                    <div>
                        <span class="text-gray-500 dark:text-gray-400">Mode:</span>
                        <div class="font-medium">${timerModes[session.timerMode]?.name || session.timerMode}</div>
                    </div>
                </div>
                
                ${session.summary ? `<p class="text-sm text-gray-600 dark:text-gray-400 italic">"${session.summary}"</p>` : ''}
                
                ${session.mainTask ? `
                    <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Main Task:</div>
                        <div class="text-sm font-medium">${session.mainTask}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function saveSubtaskFromModal() {
    const newText = subtaskInput.value.trim();
    if (!newText) return;

    const editingIndex = addSubtaskModal.dataset.editingIndex;

    if (editingIndex !== undefined && editingIndex !== null) {
        // Editing existing subtask
        subtasks[editingIndex].text = newText;
    } else {
        // Adding new subtask
        subtasks.push({ text: newText, completed: false });
    }
    
    renderSubtasks();
    saveToLocalStorage();
    hideAddSubtaskModal();
}

// --- Credits & Perks Functions ---
function updateCredits() {
    if (creditCountEl) {
        creditCountEl.textContent = credits; 
    }
    renderPerks(); 
    saveToLocalStorage(); // Save when credits change
}
function renderPerks() {
    if (!perksListEl) {
        console.error('❌ perksListEl not found!');
        return;
    }
    
    // Sort perks: available items first (by cost ascending, then alphabetically), sold out items last
    const sortedPerks = [...perks].sort((a, b) => {
        const aOutOfStock = a.inventory !== undefined && a.inventory <= 0;
        const bOutOfStock = b.inventory !== undefined && b.inventory <= 0;
        
        // Move sold out items to the bottom
        if (aOutOfStock && !bOutOfStock) return 1;  // a is sold out, b is not -> a goes after b
        if (!aOutOfStock && bOutOfStock) return -1; // a is not sold out, b is -> a goes before b
        
        // For items with same availability status, sort by cost first, then alphabetically
        if (a.cost !== b.cost) {
            return a.cost - b.cost; // Cost ascending
        }
        
        return a.name.localeCompare(b.name); // Alphabetical ascending
    });
    
    console.log('🔄 Sorted perks:', sortedPerks.map(p => `${p.name} (${p.cost}c, ${p.inventory || 0} left)`));
    
    perksListEl.innerHTML = '';
    sortedPerks.forEach((perk) => {
        // Find original index for the onclick handler
        const originalIndex = perks.findIndex(p => p === perk);
        
        const perkEl = document.createElement('div');
        const isOutOfStock = perk.inventory !== undefined && perk.inventory <= 0;
        const cannotAfford = credits < perk.cost;
        const isDisabled = isOutOfStock || cannotAfford;
        
        // Enhanced styling for different states with better backgrounds
        perkEl.className = `flex items-center justify-between p-4 rounded-lg gap-3 transition-all cursor-pointer ${
            isOutOfStock 
                ? 'bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700' 
                : cannotAfford
                ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
                : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:shadow-md'
        }`;
        
        // Clean circular inventory badge
        let inventoryBadge = '';
        if (perk.inventory !== undefined) {
            if (perk.inventory === 0) {
                inventoryBadge = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-red-500 text-white text-center leading-none" title="Sold Out">×</span>`;
            } else if (perk.inventory <= 2) {
                inventoryBadge = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-orange-500 text-white text-center leading-none" title="${perk.inventory} Left">${perk.inventory}</span>`;
            } else {
                inventoryBadge = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-green-500 text-white text-center leading-none" title="${perk.inventory} Left">${perk.inventory}</span>`;
            }
        }
        
        const buttonText = isOutOfStock ? 'Sold Out' : 'Purchase';
        const buttonClass = isOutOfStock 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400' 
            : cannotAfford 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400' 
                : 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-600 hover:border-blue-700';
        
        perkEl.innerHTML = `
            <div class="flex-grow">
                <div class="flex items-center gap-2 mb-1">
                    <span class="font-semibold text-lg ${isOutOfStock ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}">${perk.name}</span>
                    ${inventoryBadge}
                </div>
                <div class="text-sm ${isOutOfStock ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}">
                    💰 ${perk.cost} credit${perk.cost > 1 ? 's' : ''}
                </div>
            </div>
            <button onclick="purchasePerk(${originalIndex})" class="${buttonClass} font-bold py-2 px-4 rounded-lg shrink-0 transition-all transform hover:scale-105" ${isDisabled ? 'disabled' : ''}>${buttonText}</button>
        `;
        perksListEl.appendChild(perkEl);
    });
}
function addPerk() {
    // Open the Add Perk modal
    addPerkModal.classList.remove('hidden');
    addPerkModal.classList.add('flex');
    perkNameModalInput.focus();
}

function savePerkFromModal() {
    const name = perkNameModalInput.value.trim();
    const cost = parseInt(perkCostModalInput.value);
    const inventory = parseInt(perkInventoryModalInput.value);
    
    if (name && cost > 0 && inventory > 0) { 
        perks.push({ name, cost, inventory }); 
        renderPerks(); 
        closePerkModal();
        saveToLocalStorage(); // Save when perk is added
        showMessage({mainText: `Perk "${name}" added successfully! (${inventory} available)`});
    } 
    else { showMessage({mainText: 'Please enter a valid perk name, cost, and inventory.'}); }
}

function closePerkModal() {
    addPerkModal.classList.add('hidden');
    addPerkModal.classList.remove('flex');
    perkNameModalInput.value = '';
    perkCostModalInput.value = '';
    perkInventoryModalInput.value = '3'; // Reset to default
}
function purchasePerk(index) {
    const perk = perks[index];
    
    // Check if out of stock
    if (perk.inventory !== undefined && perk.inventory <= 0) {
        showMessage({mainText: "This perk is out of stock!"});
        return;
    }
    
    // Check if user has enough credits
    if (credits < perk.cost) {
        showMessage({mainText: "You don't have enough credits."});
        return;
    }
    
    // Purchase the perk
    credits -= perk.cost;
    
    // Reduce inventory if it exists
    if (perk.inventory !== undefined) {
        perk.inventory -= 1;
    }
    
    updateCredits();
    renderPerks(); // Re-render to update inventory display
    saveToLocalStorage(); // Save the updated inventory
    
    const inventoryMessage = perk.inventory !== undefined && perk.inventory === 0 
        ? " This perk is now out of stock!" 
        : "";
    
    showMessage({
        mainText: `You've purchased "${perk.name}"! Enjoy your break.${inventoryMessage}`
    });
}

function restoreDefaultPerks() {
    if (confirm('Are you sure you want to restore default perks? This will remove all custom perks you have added.')) {
        perks = getDefaultPerks();
        renderPerks();
        saveToLocalStorage();
        
        showMessage({
            mainText: "Default Perks Restored!",
            subText: "All custom perks have been removed and default perks restored.",
            emojis: "🔄✨"
        });
        
        console.log('🔄 Perks restored to default values');
    }
}

// --- Modal Functions ---
let autoCloseTimer = null;
let countdownInterval = null;
let modalOnCloseCallback = null;
let modalClosing = false; // Flag to prevent double execution

function showMessage({ mainText, text, subText = '', emojis = '', autoClose = true, onClose = null, actions = [] }) {
    // Support both old format (mainText) and new format (text)
    const messageText = text || mainText;
    
    console.log('📱 showMessage called:', messageText);
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
    } else {
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
    setTimeout(() => modalMessage.querySelector('div').classList.remove('scale-95'), 10);
    
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
    } else {
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
    console.log('🚪 hideMessage called, modalClosing=', modalClosing);
    
    // Prevent double execution
    if (modalClosing) {
        console.log('⚠️ Modal already closing, ignoring call');
        return;
    }
    modalClosing = true;
    
    console.log('📊 Current timer state: isRunning=', isRunning, 'isPaused=', isPaused, 'isBreak=', isBreak, 'timeLeft=', timeLeft);
    
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
        console.log('🔄 Executing onClose callback...');
        const callback = modalOnCloseCallback;
        modalOnCloseCallback = null; // Clear the callback
        try {
            callback();
        } catch (error) {
            console.error('❌ Error in onClose callback:', error);
        }
    } else {
        console.log('ℹ️ No onClose callback to execute');
    }
    
    // Reset the flag after a short delay
    setTimeout(() => {
        modalClosing = false;
        console.log('✅ hideMessage completed, modal ready for next use');
    }, 100);
}
function showCustomTimerModal() {
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
         if (isRunning && !isPaused && !isBreak) {
            const initialDuration = timerModes[activeMode].focus * 60;
            const elapsedTime = initialDuration - timeLeft;

            timerModes.custom.focus = focus;
            timerModes.custom.break = breakT;
            timerModes.custom.name = `${focus}/${breakT}`;
            activeMode = 'custom';
            
            const newTotalDuration = timerModes[activeMode].focus * 60;
            timeLeft = Math.round(newTotalDuration - elapsedTime);
            if (timeLeft < 0) timeLeft = 0;
        } else {
            timerModes.custom.focus = focus;
            timerModes.custom.break = breakT;
            timerModes.custom.name = `${focus}/${breakT}`;
            activeMode = 'custom'; 
            resetTimer();
        }
        renderTimerModeButtons();
        updateDisplay();
        hideCustomTimerModal();
    } else {
        showMessage({mainText: "Please enter valid numbers for focus and break time."});
    }
}

// --- Session Management Functions ---
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function createNewSession() {
    const sessionId = generateSessionId();
    const now = new Date();
    
    currentSessionData = {
        id: sessionId,
        title: taskInput.value.trim() || `Session ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
        summary: '',
        startTime: now.toISOString(),
        endTime: null,
        duration: 0,
        pomodorosCompleted: 0,
        tasksCompleted: 0,
        totalTasks: subtasks.length,
        mainTask: taskInput.value.trim(),
        subtasks: [...subtasks],
        timerMode: activeMode,
        credits: credits,
        status: 'active'
    };
    
    currentSessionId = sessionId;
    // currentSessionData is already set above
    
    // Add to sessions array
    sessions.push(currentSessionData);

    console.log(`✨ New session created: ${sessionId}`);

    saveToLocalStorage(); // Corrected function call

    renderSessionHistory();
    console.log('✅ Session created and saved successfully');
}

function updateCurrentSession() {
    if (!currentSessionData) return;
    
    const now = new Date();
    currentSessionData.endTime = isRunning ? null : now.toISOString();
    currentSessionData.duration = currentSessionData.endTime ? Math.round((new Date(currentSessionData.endTime) - new Date(currentSessionData.startTime)) / 1000) : 0;
    
    // Update in sessions array
    const sessionIndex = sessions.findIndex(s => s.id === currentSessionId);
    if (sessionIndex !== -1) {
        sessions[sessionIndex] = { ...currentSessionData };
        saveToLocalStorage();
    }
}

function restoreSession(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    // Clear current data
    resetTimer();
    credits = session.credits;
    updateCredits();
    subtasks = session.subtasks;
    activeMode = session.timerMode;
    timeLeft = (session.duration || timerModes[activeMode].focus * 60) - (Date.now() - new Date(session.startTime)) / 1000;
    isRunning = false;
    isPaused = false;
    isBreak = false;
    sessionStartTime = null;
    
    // Set as current session
    currentSessionData = { ...session };
    currentSessionId = sessionId;
    
    console.log('🔄 Session restored:', session);
    hideSessionHistoryModal();
    
    showMessage({
        mainText: "Session Restored!",
        subText: `Loaded: ${session.title}`,
        emojis: "🔄✨"
    });
}

function deleteSession(sessionId) {
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return;
    
    const session = sessions[sessionIndex];
    if (confirm(`Are you sure you want to delete "${session.title}"?`)) {
        sessions.splice(sessionIndex, 1);
        saveToLocalStorage();
        renderSessionHistory();
        
        // If this was the current session, clear it
        if (currentSessionId === sessionId) {
            currentSessionId = null;
            currentSessionData = null;
        }
        
        showMessage({
            mainText: "Session Deleted",
            subText: "Session removed from history",
            emojis: "🗑️"
        });
    }
}

function clearAllSessions() {
    if (sessions.length === 0) {
        showMessage({
            mainText: "No Sessions",
            subText: "There are no sessions to clear",
            emojis: "📝"
        });
        return;
    }
    
    if (confirm(`Are you sure you want to delete all ${sessions.length} sessions? This cannot be undone.`)) {
        sessions = [];
        currentSessionId = null;
        currentSessionData = null;
        saveToLocalStorage();
        renderSessionHistory();
        
        showMessage({
            mainText: "All Sessions Cleared",
            subText: "Session history has been reset",
            emojis: "🗑️✨"
        });
    }
}

function exportSessions() {
    if (sessions.length === 0) {
        showMessage({
            mainText: "No Sessions",
            subText: "There are no sessions to export",
            emojis: "📝"
        });
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        totalSessions: sessions.length,
        sessions: sessions
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pomodoro-sessions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showMessage({
        mainText: "Sessions Exported!",
        subText: `${sessions.length} sessions downloaded`,
        emojis: "📊💾"
    });
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

function renderSessionHistory() {
    if (!sessionsListEl) return;
    
    if (sessions.length === 0) {
        sessionsListEl.innerHTML = `
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <i class="fa-solid fa-exclamation-circle text-6xl mx-auto mb-4 opacity-50"></i>
                <p class="text-lg mb-2">No sessions yet</p>
                <p class="text-sm">Start a new session to see your history here</p>
            </div>
        `;
        return;
    }
    
    sessionsListEl.innerHTML = sessions.map(session => {
        const startDate = new Date(session.startTime);
        const isActive = session.id === currentSessionId;
        const statusIcon = session.status === 'completed' ? '✅' : '🔄';
        
        return `
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border ${isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-grow">
                        <h4 class="font-semibold text-lg ${isActive ? 'text-blue-700 dark:text-blue-300' : ''} flex items-center gap-2">
                            ${statusIcon} ${session.title}
                            ${isActive ? '<span class="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Current</span>' : ''}
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString()}
                        </p>
                    </div>
                    <div class="flex gap-2 ml-4">
                        <button onclick="restoreSession('${session.id}')" class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                            Restore
                        </button>
                        <button onclick="deleteSession('${session.id}')" class="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                            Delete
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                        <span class="text-gray-500 dark:text-gray-400">Duration:</span>
                        <div class="font-medium">${session.duration ? formatDuration(session.duration) : 'In progress'}</div>
                    </div>
                    <div>
                        <span class="text-gray-500 dark:text-gray-400">Tasks:</span>
                        <div class="font-medium">${session.tasksCompleted}/${session.totalTasks}</div>
                    </div>
                    <div>
                        <span class="text-gray-500 dark:text-gray-400">Pomodoros:</span>
                        <div class="font-medium">${session.pomodorosCompleted}</div>
                    </div>
                    <div>
                        <span class="text-gray-500 dark:text-gray-400">Mode:</span>
                        <div class="font-medium">${timerModes[session.timerMode]?.name || session.timerMode}</div>
                    </div>
                </div>
                
                ${session.summary ? `<p class="text-sm text-gray-600 dark:text-gray-400 italic">"${session.summary}"</p>` : ''}
                
                ${session.mainTask ? `
                    <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Main Task:</div>
                        <div class="text-sm font-medium">${session.mainTask}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function showSessionHistoryModal() {
    renderSessionHistory();
    sessionHistoryModal.classList.remove('hidden');
    sessionHistoryModal.classList.add('flex');
}

function hideSessionHistoryModal() {
    sessionHistoryModal.classList.add('hidden');
    sessionHistoryModal.classList.remove('flex');
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
        API_KEY = null;
        console.log('✅ Google API key saved successfully');
        
        showMessage({
            text: "Settings saved successfully!",
            subText: "AI features are now available",
            emojis: "⚙️✅"
        });
    } else {
        localStorage.removeItem('google_api_key');
        API_KEY = null;
        console.log('🗑️ Google API key removed');
        
        showMessage({
            text: "API key removed",
            subText: "AI features will be disabled",
            emojis: "⚙️🚫"
        });
    }
    
    hideSettingsModal();
}

// --- Initialize Functions ---
function initializeApp() {
    console.log('🎯 Initializing FocusFlow...');
    
    // Initialize DOM elements first (after modules are loaded)
    initializeDOMElements();
    
    // Initialize theme icons function
    const updateThemeIcons = () => {
        if (document.documentElement.classList.contains('dark')) {
            if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
            if (themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
        } else {
            if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
            if (themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
        }
    };
    
    // Make updateThemeIcons available globally for setupEventListeners
    window.updateThemeIcons = updateThemeIcons;
    
    // Load saved data from localStorage
    loadFromLocalStorage();
    loadSessionsFromLocalStorage();
    
    // Update displays and render components
    renderTimerModeButtons();
    updateDisplay(); // Update timer display instead of reset
    updateCredits();
    renderPerks();
    renderSubtasks();
    renderSessionHistory(); // Initial render of session history
    
    // Setup event listeners
    setupEventListeners();
    
    // After everything is initialized, handle timer restoration
    handleTimerRestoration();
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    }
    
    console.log('✅ Pomodoro App initialized successfully');
}

// Handle timer restoration after app initialization
function handleTimerRestoration() {
    // Check if we need to resume a running timer
    if (isRunning && sessionStartTime && timeLeft > 0) {
        console.log('🔄 Resuming running timer...');
        
        // Start the countdown interval directly since isRunning is already true
        timer = setInterval(() => {
            if (!isPaused) {
                timeLeft--;
                updateDisplay();
                if (timeLeft <= 0) {
                    console.log('⏰ Timer reached 0, clearing interval and handling timer end...');
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
        
        console.log('✅ Timer resumed successfully');
    } else if (isRunning && sessionStartTime && timeLeft <= 0) {
        console.log('⏰ Timer would have finished during offline time, completing session');
        isRunning = false;
        isPaused = false;
        setTimeout(() => handleTimerEnd(), 100);
    }
    
    // Update timer ring color for break/focus state
    if (timerRing) {
        timerRing.classList.remove('text-green-500', 'text-indigo-500');
        timerRing.classList.add(isBreak ? 'text-green-500' : 'text-indigo-500');
    }
    
    console.log('✅ Timer restoration complete');
}

// Setup all event listeners
function setupEventListeners() {
    // Theme management
    updateThemeIcons();
    
    // Timer controls
    if (startBtn) startBtn.addEventListener('click', () => { 
        console.log('🔘 Start button clicked, isRunning:', isRunning, 'isPaused:', isPaused);
        if (isRunning) {
            console.log('⚠️ Timer already running, ignoring click');
        } else {
            console.log('▶️ Starting/resuming timer');
            startTimer();
        }
    });
    if (pauseBtn) pauseBtn.addEventListener('click', () => {
        console.log('⏸️ Pause button clicked');
        pauseTimer();
    });
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
    
    // Task management
    if (breakdownBtn) breakdownBtn.addEventListener('click', generateSubtasks);
    if (addSubtaskBtn) addSubtaskBtn.addEventListener('click', addManualSubtask);
    if (taskInput) {
        taskInput.addEventListener('input', () => {
            saveToLocalStorage();
        });
    }
    
    // Credits and perks
    if (addPerkBtn) addPerkBtn.addEventListener('click', addPerk);
    
    // Theme toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            updateThemeIcons();
        });
    }
    
    // Modals
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent any form submission or page reload
        e.stopPropagation(); // Prevent event bubbling
        console.log('🔘 Modal close button clicked');
        hideMessage();
    });
    if (customTimerSave) customTimerSave.addEventListener('click', saveCustomTimer);
    if (customTimerCancel) customTimerCancel.addEventListener('click', hideCustomTimerModal);
    if (subtaskModalSave) subtaskModalSave.addEventListener('click', saveSubtaskFromModal);
    if (subtaskModalCancel) subtaskModalCancel.addEventListener('click', hideAddSubtaskModal);
    
    // Add Perk Modal event listeners
    if (perkModalSave) perkModalSave.addEventListener('click', savePerkFromModal);
    if (perkModalCancel) perkModalCancel.addEventListener('click', closePerkModal);

    // Close perk modal when clicking outside
    if (addPerkModal) {
        addPerkModal.addEventListener('click', (e) => {
            if (e.target === addPerkModal) {
                closePerkModal();
            }
        });
    }

    // Handle Enter key in perk modal inputs
    if (perkNameModalInput) {
        perkNameModalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (perkCostModalInput) perkCostModalInput.focus();
            }
        });
    }

    if (perkCostModalInput) {
        perkCostModalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (perkInventoryModalInput) perkInventoryModalInput.focus();
            }
        });
    }

    if (perkInventoryModalInput) {
        perkInventoryModalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                savePerkFromModal();
            }
        });
    }
    
    // Handle Enter key in subtask input
    if (subtaskInput) {
        subtaskInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveSubtaskFromModal();
            }
        });
    }
    
    // Session management
    if (sessionHistoryBtn) sessionHistoryBtn.addEventListener('click', showSessionHistoryModal);
    if (sessionHistoryClose) {
        sessionHistoryClose.addEventListener('click', () => {
            sessionHistoryModal.classList.add('hidden');
            sessionHistoryModal.classList.remove('flex');
        });
    }
    if (clearAllSessionsBtn) clearAllSessionsBtn.addEventListener('click', clearAllSessions);
    if (exportSessionsBtn) exportSessionsBtn.addEventListener('click', exportSessions);
    
    // Settings modal event listeners
    if (settingsModalCancel) settingsModalCancel.addEventListener('click', hideSettingsModal);
    if (settingsModalSave) settingsModalSave.addEventListener('click', saveSettings);
    
    // Session management - New Session button
    if (newSessionBtn) {
        newSessionBtn.addEventListener('click', () => {
            if (currentSessionData) {
                if (confirm('Start a new session? This will finish your current session and clear all tasks and subtasks. Credits and perks will be preserved.')) {
                    finishCurrentSession();
                    resetToDefaults();
                    createNewSession();
                    showMessage({
                        mainText: "New Session Started!",
                        subText: "Previous session saved to history. Ready for a fresh start!",
                        emojis: "🆕✨"
                    });
                }
            } else {
                if (confirm('Start a new session? This will clear all tasks and subtasks. Credits and perks will be preserved.')) {
                    resetToDefaults();
                    createNewSession();
                    showMessage({
                        mainText: "New Session Started!",
                        subText: "Fresh start with clean slate!",
                        emojis: "🚀📝"
                    });
                }
            }
        });
    }
    
    // Menu event listeners
    if (menuToggle) menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the window click listener from firing immediately


        toggleMenu();
    });
    if (menuSettings) menuSettings.addEventListener('click', () => {
        hideMenu();
        showSettingsModal();
    });
    if (menuHistory) menuHistory.addEventListener('click', () => {
        hideMenu();
        if (sessionHistoryModal) sessionHistoryModal.classList.remove('hidden');
    });
    if (menuNewSession) menuNewSession.addEventListener('click', () => {
        hideMenu();
        createNewSession();
    });
    if (menuRestorePerks) menuRestorePerks.addEventListener('click', () => {
        hideMenu();
        restoreDefaultPerks();
    });
    
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
            console.log('Form submitted, but prevented page reload');
        });
    });
}

function setupTimerModeButtons() {
    const timerModeButtons = document.querySelectorAll('[data-focus][data-break]');
    timerModeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const focusDuration = parseInt(btn.dataset.focus);
            const breakDuration = parseInt(btn.dataset.break);
            setTimerMode(focusDuration, breakDuration);
        });
    });
    
    // Custom timer button
    const customTimerBtn = document.querySelector('[onclick="showCustomTimerModal()"]');
    if (customTimerBtn) {
        customTimerBtn.removeAttribute('onclick');
        customTimerBtn.addEventListener('click', showCustomTimerModal);
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Space bar to start/pause timer
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            if (isActive) {
                pauseTimer();
            } else {
                startTimer();
            }
        }
        
        // R key to reset timer
        if (e.code === 'KeyR' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            resetTimer();
        }
        
        // Escape key to close modals
        if (e.code === 'Escape') {
            closeModal();
            closeCustomTimerModal();
            hideAddSubtaskModal();
            closeSessionHistory();
        }
    });
}

// --- Menu Functions ---
function toggleMenu() {
    if (menuDropdown) {
        menuDropdown.classList.toggle('hidden');
        console.log('Menu toggled');
    }
}

function hideMenu() {
    if (menuDropdown && !menuDropdown.classList.contains('hidden')) {
        menuDropdown.classList.add('hidden');
        console.log('Menu hidden');
    }
}

function restoreDefaultPerks() {
    perks = getDefaultPerks();
    saveToLocalStorage();
    renderPerks();
    showMessage({
        text: "Default perks restored",
        subText: "Your perks list has been reset.",
        emojis: "🔄🎁"
    });
    console.log('🎁 Default perks restored.');
}

// --- Initialization ---
function addEventListeners() {
    // Timer controls
    if (startBtn) startBtn.addEventListener('click', () => { 
        console.log('🔘 Start button clicked, isRunning:', isRunning, 'isPaused:', isPaused);
        if (isRunning) {
            console.log('⚠️ Timer already running, ignoring click');
        } else {
            console.log('▶️ Starting/resuming timer');
            startTimer();
        }
    });
    if (pauseBtn) pauseBtn.addEventListener('click', () => {
        console.log('⏸️ Pause button clicked');
        pauseTimer();
    });
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
    
    // Task management
    if (breakdownBtn) breakdownBtn.addEventListener('click', generateSubtasks);
    if (addSubtaskBtn) addSubtaskBtn.addEventListener('click', addManualSubtask);
    if (taskInput) {
        taskInput.addEventListener('input', () => {
            saveToLocalStorage();
        });
    }
    
    // Credits and perks
    if (addPerkBtn) addPerkBtn.addEventListener('click', addPerk);
    
    // Theme toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            updateThemeIcons();
        });
    }
    
    // Modals
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent any form submission or page reload
       
        e.stopPropagation(); // Prevent event bubbling
        console.log('🔘 Modal close button clicked');
        hideMessage();
    });
    if (customTimerSave) customTimerSave.addEventListener('click', saveCustomTimer);
    if (customTimerCancel) customTimerCancel.addEventListener('click', hideCustomTimerModal);
    if (subtaskModalSave) subtaskModalSave.addEventListener('click', saveSubtaskFromModal);
    if (subtaskModalCancel) subtaskModalCancel.addEventListener('click', hideAddSubtaskModal);
    
    // Add Perk Modal event listeners
    if (perkModalSave) perkModalSave.addEventListener('click', savePerkFromModal);
    if (perkModalCancel) perkModalCancel.addEventListener('click', closePerkModal);

    // Close perk modal when clicking outside
    if (addPerkModal) {
        addPerkModal.addEventListener('click', (e) => {
            if (e.target === addPerkModal) {
                closePerkModal();
            }
        });
    }

    // Handle Enter key in perk modal inputs
    if (perkNameModalInput) {
        perkNameModalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (perkCostModalInput) perkCostModalInput.focus();
            }
        });
    }

    if (perkCostModalInput) {
        perkCostModalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (perkInventoryModalInput) perkInventoryModalInput.focus();
            }
        });
    }

    if (perkInventoryModalInput) {
        perkInventoryModalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                savePerkFromModal();
            }
        });
    }
    
    // Handle Enter key in subtask input
    if (subtaskInput) {
        subtaskInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveSubtaskFromModal();
            }
        });
    }
    
    // Session management
    if (sessionHistoryBtn) sessionHistoryBtn.addEventListener('click', showSessionHistoryModal);
    if (sessionHistoryClose) {
        sessionHistoryClose.addEventListener('click', () => {
            sessionHistoryModal.classList.add('hidden');
            sessionHistoryModal.classList.remove('flex');
        });
    }
    if (clearAllSessionsBtn) clearAllSessionsBtn.addEventListener('click', clearAllSessions);
    if (exportSessionsBtn) exportSessionsBtn.addEventListener('click', exportSessions);
    
    // Settings modal event listeners
    if (settingsModalCancel) settingsModalCancel.addEventListener('click', hideSettingsModal);
    if (settingsModalSave) settingsModalSave.addEventListener('click', saveSettings);
    
    // Session management - New Session button
    if (newSessionBtn) {
        newSessionBtn.addEventListener('click', () => {
            if (currentSessionData) {
                if (confirm('Start a new session? This will finish your current session and clear all tasks and subtasks. Credits and perks will be preserved.')) {
                    finishCurrentSession();
                    resetToDefaults();
                    createNewSession();
                    showMessage({
                        mainText: "New Session Started!",
                        subText: "Previous session saved to history. Ready for a fresh start!",
                        emojis: "🆕✨"
                    });
                }
            } else {
                if (confirm('Start a new session? This will clear all tasks and subtasks. Credits and perks will be preserved.')) {
                    resetToDefaults();
                    createNewSession();
                    showMessage({
                        mainText: "New Session Started!",
                        subText: "Fresh start with clean slate!",
                        emojis: "🚀📝"
                    });
                }
            }
        });
    }
    
    // Menu event listeners
    if (menuToggle) menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the window click listener from firing immediately

        toggleMenu();
    });
    if (menuSettings) menuSettings.addEventListener('click', () => {
        hideMenu();
        showSettingsModal();
    });
    if (menuHistory) menuHistory.addEventListener('click', () => {
        hideMenu();
        if (sessionHistoryModal) sessionHistoryModal.classList.remove('hidden');
    });
    if (menuNewSession) menuNewSession.addEventListener('click', () => {
        hideMenu();
        createNewSession();
    });
    if (menuRestorePerks) menuRestorePerks.addEventListener('click', () => {
        hideMenu();
        restoreDefaultPerks();
    });
    
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
            console.log('Form submitted, but prevented page reload');
        });
    });
}

