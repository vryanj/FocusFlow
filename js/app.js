// DOM Elements
const timeDisplay = document.getElementById('time-display');
const timerRing = document.getElementById('timer-ring');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const creditCountEl = document.getElementById('credit-count');
const perksListEl = document.getElementById('perks-list');
const perkNameInput = document.getElementById('perk-name-input');
const perkCostInput = document.getElementById('perk-cost-input');
const addPerkBtn = document.getElementById('add-perk-btn');
const timerStatusEl = document.getElementById('timer-status');
const taskInput = document.getElementById('task-input');
const breakdownBtn = document.getElementById('breakdown-btn');
const subtasksContainer = document.getElementById('subtasks-container');
const subtaskProgressEl = document.getElementById('subtask-progress');
const addSubtaskBtn = document.getElementById('add-subtask-btn');
const timerModesContainer = document.getElementById('timer-modes');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Modal Elements
const messageModal = document.getElementById('message-modal');
const modalMessage = document.getElementById('modal-message');
const modalEmojis = document.getElementById('modal-emojis');
const modalSubMessage = document.getElementById('modal-sub-message');
const modalCountdown = document.getElementById('modal-countdown');
const modalCountdownTimer = document.getElementById('modal-countdown-timer');
const modalCloseBtn = document.getElementById('modal-close-btn');
const customTimerModal = document.getElementById('custom-timer-modal');
const customFocusInput = document.getElementById('custom-focus-input');
const customBreakInput = document.getElementById('custom-break-input');
const customTimerSave = document.getElementById('custom-timer-save');
const customTimerCancel = document.getElementById('custom-timer-cancel');

// Add Subtask Modal Elements
const addSubtaskModal = document.getElementById('add-subtask-modal');
const subtaskModalTitle = document.getElementById('subtask-modal-title');
const subtaskInput = document.getElementById('subtask-input');
const subtaskModalSave = document.getElementById('subtask-modal-save');
const subtaskModalCancel = document.getElementById('subtask-modal-cancel');

// Session Management Elements
const sessionHistoryBtn = document.getElementById('session-history-btn');
const newSessionBtn = document.getElementById('new-session-btn');
const sessionHistoryModal = document.getElementById('session-history-modal');
const sessionHistoryClose = document.getElementById('session-history-close');
const sessionsListEl = document.getElementById('sessions-list');
const clearAllSessionsBtn = document.getElementById('clear-all-sessions');
const exportSessionsBtn = document.getElementById('export-sessions');

// Menu Elements
const menuToggle = document.getElementById('menu-toggle');
const menuDropdown = document.getElementById('menu-dropdown');
const menuNewSession = document.getElementById('menu-new-session');
const menuHistory = document.getElementById('menu-history');
const menuRestorePerks = document.getElementById('menu-restore-perks');


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
        { name: '15 mins social media', cost: 1 },
        { name: '15 mins watching movies', cost: 1 },
        { name: '30 mins workout', cost: 2 },
        { name: '30 mins walk', cost: 2 }
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
                timeRemaining: typeof timeRemaining !== 'undefined' ? timeRemaining : 0,
                isRunning: typeof isRunning !== 'undefined' ? isRunning : false,
                isPaused: typeof isPaused !== 'undefined' ? isPaused : false,
                isBreak: typeof isBreak !== 'undefined' ? isBreak : false,
                startTime: typeof startTime !== 'undefined' ? startTime : null
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
            
            console.log('💰 Loaded credits:', credits);
            console.log('🎁 Loaded perks:', perks);
            
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
const API_KEY = "AIzaSyA10ij9R7C0ZqMKUPmjpAvCrAoy5gGmivE";

async function callGemini(prompt) {
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
    if (!mainTask) { showMessage({mainText: "Please enter a task in the text area first."}); return; }
    breakdownBtn.disabled = true;
    breakdownBtn.innerHTML = `<span class="spinner"></span> Generating...`;
    const prompt = `Break down the following task into a short list of actionable sub-tasks. Each sub-task should be something that can be focused on for a 25-minute pomodoro session. Return ONLY the list as plain text, with each sub-task on a new line. Do not use markdown, numbering, or any introductory text. The task is: "${mainTask}"`;
    const resultText = await callGemini(prompt);
    subtasks = resultText.split('\n').filter(task => task.trim() !== '').map(task => ({ text: task, completed: false }));
    renderSubtasks();
    saveToLocalStorage(); // Save after generating subtasks
    breakdownBtn.disabled = false;
    breakdownBtn.innerHTML = '<span class="text-xl">✨</span> Generate Sub-tasks from above';
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
        timeLeft = newTotalDuration - elapsedTime;
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
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const totalDuration = (isBreak ? timerModes[activeMode].break : timerModes[activeMode].focus) * 60;
    const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
    const dashoffset = ringCircumference * (1 - progress);
    timerRing.style.strokeDashoffset = dashoffset;
}

function startTimer() {
    if (isRunning) return;
    
    // Create new session if none exists and we're starting a focus timer
    if (!currentSessionData && !isBreak) {
        createNewSession();
    }
    
    isRunning = true;
    isPaused = false;
    sessionStartTime = Date.now() - ((isBreak ? timerModes[activeMode].break * 60 : timerModes[activeMode].focus * 60) - timeLeft) * 1000;
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    timerStatusEl.textContent = isBreak ? 'Break Time!' : 'Focus Time!';
    timerRing.classList.remove('text-green-500', 'text-indigo-500');
    timerRing.classList.add(isBreak ? 'text-green-500' : 'text-indigo-500');
    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleTimerEnd();
            }
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = true;
    isRunning = false;
    clearInterval(timer);
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    startBtn.textContent = 'Resume';
    timerStatusEl.textContent += ' (Paused)';
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    isBreak = false;
    timeLeft = timerModes[activeMode].focus * 60;
    updateDisplay();
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
    startBtn.textContent = 'Start';
    timerStatusEl.textContent = '';
    timerRing.classList.remove('text-green-500');
    timerRing.classList.add('text-indigo-500');
}

async function handleTimerEnd() {
    if (!isBreak) {
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
        
        showMessage({
            mainText: `You've earned ${creditsEarned} credit(s)!`,
            subText: funnyMessage,
            autoClose: false
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

        isBreak = true;
        timeLeft = timerModes[activeMode].break * 60;
        startTimer();
    } else {
        showMessage({ mainText: "Break's over! Back to the grind.", subText: "🔥 Let's get back to work! 💪" });
        resetTimer();
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
            taskEl.className = 'flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-lg gap-2';
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
function addManualSubtask() {
    showAddSubtaskModal();
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
            draggedElement = element;
            draggedIndex = parseInt(element.dataset.index);
            element.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
        });

        // Handle drag end
        element.addEventListener('dragend', (e) => {
            element.style.opacity = '1';
            draggedElement = null;
            draggedIndex = null;
            
            // Remove all drop indicators
            subtasksContainer.querySelectorAll('.drop-indicator').forEach(indicator => {
                indicator.remove();
            });
        });

        // Handle drag over
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            if (draggedElement && element !== draggedElement) {
                const rect = element.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                const dropPosition = e.clientY < midY ? 'before' : 'after';
                
                // Remove existing indicators
                subtasksContainer.querySelectorAll('.drop-indicator').forEach(indicator => {
                    indicator.remove();
                });
                
                // Add drop indicator
                const indicator = document.createElement('div');
                indicator.className = 'drop-indicator h-0.5 bg-indigo-500 mx-4 rounded-full transition-all';
                
                if (dropPosition === 'before') {
                    element.parentNode.insertBefore(indicator, element);
                } else {
                    element.parentNode.insertBefore(indicator, element.nextSibling);
                }
            }
        });

        // Handle drop
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            
            if (draggedElement && element !== draggedElement) {
                const targetIndex = parseInt(element.dataset.index);
                const rect = element.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                const dropPosition = e.clientY < midY ? 'before' : 'after';
                
                // Calculate new index
                let newIndex;
                if (dropPosition === 'before') {
                    newIndex = targetIndex;
                } else {
                    newIndex = targetIndex + 1;
                }
                
                // Adjust for dragging from higher index to lower
                if (draggedIndex < newIndex) {
                    newIndex--;
                }
                
                // Reorder the subtasks array
                const [movedTask] = subtasks.splice(draggedIndex, 1);
                subtasks.splice(newIndex, 0, movedTask);
                
                // Re-render and save
                renderSubtasks();
                saveToLocalStorage();
            }
            
            // Clean up
            subtasksContainer.querySelectorAll('.drop-indicator').forEach(indicator => {
                indicator.remove();
            });
        });
    });
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
    console.log('🎁 Rendering perks:', perks);
    console.log('📍 perksListEl:', perksListEl);
    
    if (!perksListEl) {
        console.error('❌ perksListEl not found!');
        return;
    }
    
    perksListEl.innerHTML = '';
    perks.forEach((perk, index) => {
        const perkEl = document.createElement('div');
        perkEl.className = 'flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg gap-2';
        perkEl.innerHTML = `
            <div class="flex-grow"><span class="font-medium">${perk.name}</span> <span class="text-sm text-gray-500 dark:text-gray-400">(${perk.cost} credits)</span></div>
            <button onclick="purchasePerk(${index})" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed shrink-0" ${credits < perk.cost ? 'disabled' : ''}>Purchase</button>
        `;
        perksListEl.appendChild(perkEl);
    });
    
    console.log('✅ Rendered', perks.length, 'perks');
}
function addPerk() {
    const name = perkNameInput.value.trim();
    const cost = parseInt(perkCostInput.value);
    if (name && cost > 0) { 
        perks.push({ name, cost }); 
        renderPerks(); 
        perkNameInput.value = ''; 
        perkCostInput.value = ''; 
        saveToLocalStorage(); // Save when perk is added
    } 
    else { showMessage({mainText: 'Please enter a valid perk name and cost.'}); }
}
function purchasePerk(index) {
    const perk = perks[index];
    if (credits >= perk.cost) { credits -= perk.cost; updateCredits(); showMessage({mainText: `You've purchased "${perk.name}"! Enjoy your break.`}); } 
    else { showMessage({mainText: "You don't have enough credits."}); }
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

function showMessage({ mainText, subText = '', emojis = '', autoClose = true }) {
    modalMessage.textContent = mainText;
    
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
    
    // Handle auto-close countdown
    if (autoClose) {
        modalCountdown.classList.remove('hidden');
        modalCountdown.classList.add('flex');
        let timeLeft = 5;
        modalCountdownTimer.textContent = timeLeft;
        
        countdownInterval = setInterval(() => {
            timeLeft--;
            modalCountdownTimer.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                hideMessage();
            }
        }, 1000);
        
        autoCloseTimer = setTimeout(() => {
            hideMessage();
        }, 5000);
    } else {
        modalCountdown.classList.add('hidden');
        modalCountdown.classList.remove('flex');
    }
    
    messageModal.classList.remove('hidden');
    messageModal.classList.add('flex');
    setTimeout(() => messageModal.querySelector('div').classList.remove('scale-95'), 10);
}
function hideMessage() {
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
            timeLeft = newTotalDuration - elapsedTime;
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
    console.log('📝 New session created:', currentSessionData);
    saveSessionsToLocalStorage();
    return currentSessionData;
}

function generateSessionSummary() {
    if (!currentSessionData) return '';
    
    const completedTasks = currentSessionData.subtasks.filter(task => task.completed).length;
    const totalTasks = currentSessionData.subtasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    if (completedTasks === 0) {
        return `No tasks completed yet`;
    } else if (completedTasks === totalTasks) {
        return `All ${totalTasks} tasks completed! 🎉`;
    } else {
        return `${completedTasks}/${totalTasks} tasks completed (${completionRate}%)`;
    }
}

function finishCurrentSession() {
    if (!currentSessionData) return;
    
    const now = new Date();
    currentSessionData.endTime = now.toISOString();
    currentSessionData.duration = Math.round((now.getTime() - new Date(currentSessionData.startTime).getTime()) / 1000);
    currentSessionData.summary = generateSessionSummary();
    currentSessionData.tasksCompleted = currentSessionData.subtasks.filter(task => task.completed).length;
    currentSessionData.status = 'completed';
    
    // Add to sessions history
    const existingIndex = sessions.findIndex(s => s.id === currentSessionData.id);
    if (existingIndex >= 0) {
        sessions[existingIndex] = { ...currentSessionData };
    } else {
        sessions.unshift({ ...currentSessionData });
    }
    
    console.log('✅ Session finished:', currentSessionData);
    saveSessionsToLocalStorage();
}

function updateCurrentSession() {
    if (!currentSessionData) return;
    
    currentSessionData.mainTask = taskInput.value.trim();
    currentSessionData.subtasks = [...subtasks];
    currentSessionData.totalTasks = subtasks.length;
    currentSessionData.tasksCompleted = subtasks.filter(task => task.completed).length;
    currentSessionData.credits = credits;
    currentSessionData.summary = generateSessionSummary();
    
    // Update in sessions array if it exists
    const existingIndex = sessions.findIndex(s => s.id === currentSessionData.id);
    if (existingIndex >= 0) {
        sessions[existingIndex] = { ...currentSessionData };
    }
    
    saveSessionsToLocalStorage();
}

function restoreSession(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
        console.error('❌ Session not found:', sessionId);
        return;
    }
    
    // Restore task and subtasks
    taskInput.value = session.mainTask || '';
    subtasks = [...session.subtasks];
    
    // Restore credits (optional - you might want to keep current credits)
    // credits = session.credits;
    
    // Update UI
    renderSubtasks();
    updateCredits();
    saveToLocalStorage();
    
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
        saveSessionsToLocalStorage();
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
        saveSessionsToLocalStorage();
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

function saveSessionsToLocalStorage() {
    try {
        localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
        localStorage.setItem('currentSessionId', currentSessionId || '');
        localStorage.setItem('currentSessionData', JSON.stringify(currentSessionData || {}));
        console.log('💾 Sessions saved to localStorage');
    } catch (error) {
        console.error('❌ Error saving sessions to localStorage:', error);
    }
}

function loadSessionsFromLocalStorage() {
    try {
        const savedSessions = localStorage.getItem('pomodoroSessions');
        const savedCurrentId = localStorage.getItem('currentSessionId');
        const savedCurrentData = localStorage.getItem('currentSessionData');
        
        if (savedSessions) {
            sessions = JSON.parse(savedSessions);
            console.log('📖 Loaded sessions from localStorage:', sessions.length);
        }
        
        if (savedCurrentId && savedCurrentId !== '') {
            currentSessionId = savedCurrentId;
        }
        
        if (savedCurrentData && savedCurrentData !== '{}') {
            currentSessionData = JSON.parse(savedCurrentData);
        }
        
        console.log('✅ Session data loaded from localStorage');
    } catch (error) {
        console.error('❌ Error loading sessions from localStorage:', error);
        sessions = [];
        currentSessionId = null;
        currentSessionData = null;
    }
}

// --- Reset Functions ---
function resetToDefaults() {
    // Clear main task
    if (taskInput) {
        taskInput.value = '';
    }
    
    // Clear subtasks
    subtasks = [];
    
    // Update UI (keeping credits and perks intact)
    renderSubtasks();
    saveToLocalStorage();
    
    console.log('🔄 App reset (tasks cleared, credits and perks preserved)');
}

// --- Menu Functions ---
function toggleMenu() {
    menuDropdown.classList.toggle('hidden');
}

function hideMenu() {
    menuDropdown.classList.add('hidden');
}

// Menu close functionality will be handled in setupEventListeners()

// Initialize the application
function initializeApp() {
    console.log('🎯 Initializing Pomodoro App...');
    
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
    resetTimer();
    updateCredits();
    renderPerks();
    renderSubtasks();
    renderSessionHistory(); // Initial render of session history
    
    // Setup event listeners
    setupEventListeners();
    
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
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('✅ Pomodoro App initialized successfully');
}

// Setup all event listeners
function setupEventListeners() {
    // Theme management
    updateThemeIcons();
    
    // Timer controls
    if (startBtn) startBtn.addEventListener('click', () => { isPaused ? startTimer() : startTimer(); });
    if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
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
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideMessage);
    if (customTimerSave) customTimerSave.addEventListener('click', saveCustomTimer);
    if (customTimerCancel) customTimerCancel.addEventListener('click', hideCustomTimerModal);
    if (subtaskModalSave) subtaskModalSave.addEventListener('click', saveSubtaskFromModal);
    if (subtaskModalCancel) subtaskModalCancel.addEventListener('click', hideAddSubtaskModal);
    
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
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuNewSession) {
        menuNewSession.addEventListener('click', () => {
            hideMenu();
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
    if (menuHistory) {
        menuHistory.addEventListener('click', () => {
            hideMenu();
            showSessionHistoryModal();
        });
    }
    if (menuRestorePerks) {
        menuRestorePerks.addEventListener('click', () => {
            hideMenu();
            restoreDefaultPerks();
        });
    }
    
    // Timer mode buttons (need to be set up after modules are loaded)
    setupTimerModeButtons();
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Global click handler for menu
    document.addEventListener('click', (event) => {
        if (menuToggle && menuDropdown) {
            if (!menuToggle.contains(event.target) && !menuDropdown.contains(event.target)) {
                hideMenu();
            }
        }
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

// Make the initialization function available globally
window.initializeApp = initializeApp;

// --- Focused Subtask Functions ---
let editingSubtaskIndex = -1; // -1 means adding new, >= 0 means editing existing

function showAddSubtaskModal() {
    editingSubtaskIndex = -1;
    subtaskModalTitle.textContent = 'Add New Subtask';
    subtaskModalSave.textContent = 'Add Task';
    subtaskInput.value = '';
    addSubtaskModal.classList.remove('hidden');
    addSubtaskModal.classList.add('flex');
    setTimeout(() => {
        subtaskInput.focus();
    }, 100);
}

function showEditSubtaskModal(index) {
    editingSubtaskIndex = index;
    subtaskModalTitle.textContent = 'Edit Subtask';
    subtaskModalSave.textContent = 'Save Changes';
    subtaskInput.value = subtasks[index].text;
    addSubtaskModal.classList.remove('hidden');
    addSubtaskModal.classList.add('flex');
    setTimeout(() => {
        subtaskInput.focus();
        subtaskInput.select(); // Select all text for easy editing
    }, 100);
}

function hideAddSubtaskModal() {
    addSubtaskModal.classList.add('hidden');
    addSubtaskModal.classList.remove('flex');
    editingSubtaskIndex = -1;
}

function saveSubtaskFromModal() {
    const taskText = subtaskInput.value.trim();
    if (taskText) {
        if (editingSubtaskIndex === -1) {
            // Adding new subtask
            subtasks.push({ text: taskText, completed: false });
        } else {
            // Editing existing subtask
            subtasks[editingSubtaskIndex].text = taskText;
        }
        renderSubtasks();
        saveToLocalStorage();
        hideAddSubtaskModal();
    }
}

