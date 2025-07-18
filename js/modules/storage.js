// Storage Module
// Handles all localStorage operations

// --- LocalStorage Functions ---
function saveToLocalStorage() {
    try {
        const appData = {
            credits: window.creditsManager.getCredits(),
            perks: window.creditsManager.getPerks(),
            subtasks: window.taskManager.getSubtasks(),
            mainTask: window.taskManager.getMainTask(),
            activeMode: window.timerManager.getActiveMode(),
            customMode: window.timerManager.getTimerModes().custom,
            timerState: {
                timeLeft: window.timerManager.getTimeLeft(),
                isRunning: window.timerManager.isRunning(),
                isPaused: window.timerManager.isPaused(),
                isBreak: window.timerManager.isBreak(),
                sessionStartTime: window.timerManager.getSessionStartTime()
            },
            sessionHistory: window.sessionManager.getSessionHistory()
        };
        localStorage.setItem('pomodoroAppData', JSON.stringify(appData));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('pomodoroAppData');
        
        if (saved) {
            const appData = JSON.parse(saved);
            
            // Restore credits and perks
            window.creditsManager.setCredits(appData.credits || 0);
            window.creditsManager.setPerks(appData.perks || window.creditsManager.getDefaultPerks());
            
            // Migrate existing perks to add inventory if missing
            const perks = window.creditsManager.getPerks();
            const migratedPerks = perks.map(perk => {
                if (perk.inventory === undefined) {
                    // Add default inventory to existing perks
                    return { ...perk, inventory: 3 };
                }
                return perk;
            });
            window.creditsManager.setPerks(migratedPerks);
            
            // Restore subtasks
            window.taskManager.setSubtasks(appData.subtasks || []);
            
            // Restore main task
            if (appData.mainTask) {
                window.taskManager.setMainTask(appData.mainTask);
            }
            
            // Restore active mode
            if (appData.activeMode) {
                window.timerManager.setActiveMode(appData.activeMode);
            }
            
            // Restore custom timer settings
            if (appData.customMode) {
                const timerModes = window.timerManager.getTimerModes();
                timerModes.custom = appData.customMode;
            }
            
            // Restore timer state
            if (appData.timerState) {
                window.timerManager.setTimeLeft(appData.timerState.timeLeft || (window.timerManager.getTimerModes()[window.timerManager.getActiveMode()].focus * 60));
                window.timerManager.setRunning(appData.timerState.isRunning || false);
                window.timerManager.setPaused(appData.timerState.isPaused || false);
                window.timerManager.setBreak(appData.timerState.isBreak || false);
                window.timerManager.setSessionStartTime(appData.timerState.sessionStartTime || null);
                
                // If timer was running when saved, calculate elapsed time and resume
                if (appData.timerState.isRunning && appData.timerState.sessionStartTime) {
                    const elapsedTime = (Date.now() - appData.timerState.sessionStartTime) / 1000;
                    const totalDuration = (appData.timerState.isBreak ? 
                        window.timerManager.getTimerModes()[window.timerManager.getActiveMode()].break : 
                        window.timerManager.getTimerModes()[window.timerManager.getActiveMode()].focus) * 60;
                    const timeLeft = Math.max(0, Math.round(totalDuration - elapsedTime));
                    window.timerManager.setTimeLeft(timeLeft);
                    
                    if (timeLeft > 0) {
                        // Will resume after DOM elements are initialized
                    } else {
                        window.timerManager.setRunning(false);
                        window.timerManager.setPaused(false);
                        // Will complete after DOM elements are initialized
                        setTimeout(() => window.timerManager.handleTimerEnd(), 100);
                    }
                }
            } else {
                // No saved timer state, ensure we're in default state
                const activeMode = window.timerManager.getActiveMode();
                window.timerManager.setTimeLeft(window.timerManager.getTimerModes()[activeMode].focus * 60);
                window.timerManager.setRunning(false);
                window.timerManager.setPaused(false);
                window.timerManager.setBreak(false);
                window.timerManager.setSessionStartTime(null);
            }
            
            // Restore session history
            window.sessionManager.setSessionHistory(appData.sessionHistory || []);
            window.sessionManager.renderSessionHistory();

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

function loadSessionsFromLocalStorage() {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    if (savedSessions) {
        const sessions = JSON.parse(savedSessions);
        window.sessionManager.setSessions(sessions);
        
        const currentSessionIdSaved = localStorage.getItem('pomodoroCurrentSessionId');
        if (currentSessionIdSaved) {
            window.sessionManager.setCurrentSessionId(currentSessionIdSaved);
            const currentSessionData = sessions.find(s => s.id === currentSessionIdSaved) || null;
            window.sessionManager.setCurrentSessionData(currentSessionData);
        }
    }
}

function saveSessionsToLocalStorage() {
    try {
        const sessions = window.sessionManager.getSessions();
        localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
        
        const currentSessionId = window.sessionManager.getCurrentSessionId();
        if (currentSessionId) {
            localStorage.setItem('pomodoroCurrentSessionId', currentSessionId);
        }
    } catch (error) {
        console.error('Error saving sessions to localStorage:', error);
    }
}

// Export storage functions
window.storageManager = {
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    loadSessionsFromLocalStorage,
    saveSessionsToLocalStorage
}; 