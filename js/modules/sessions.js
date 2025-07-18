// Session Management Module
// Handles all session-related functionality

// Session Management State
let sessions = [];
let currentSessionId = null;
let currentSessionData = null;
let sessionHistory = [];

// DOM Elements
let sessionHistoryBtn, sessionHistoryModal, sessionHistoryClose, sessionsListEl;
let clearAllSessionsBtn, exportSessionsBtn;

// Session Management Functions
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function createNewSession() {
    const sessionId = generateSessionId();
    const now = new Date();
    
    currentSessionData = {
        id: sessionId,
        title: window.taskManager.getMainTask() || `Session ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
        summary: '',
        startTime: now.toISOString(),
        endTime: null,
        duration: 0,
        pomodorosCompleted: 0,
        tasksCompleted: 0,
        totalTasks: window.taskManager.getSubtasks().length,
        mainTask: window.taskManager.getMainTask(),
        subtasks: [...window.taskManager.getSubtasks()],
        timerMode: window.timerManager.getActiveMode(),
        credits: window.creditsManager.getCredits(),
        status: 'active'
    };
    
    currentSessionId = sessionId;
    
    // Add to sessions array
    sessions.push(currentSessionData);

    window.storageManager.saveSessionsToLocalStorage();
    renderSessionHistory();
}

function updateCurrentSession() {
    if (!currentSessionData) return;
    
    const now = new Date();
    currentSessionData.endTime = window.timerManager.isRunning() ? null : now.toISOString();
    currentSessionData.duration = currentSessionData.endTime ? Math.round((new Date(currentSessionData.endTime) - new Date(currentSessionData.startTime)) / 1000) : 0;
    
    // Update in sessions array
    const sessionIndex = sessions.findIndex(s => s.id === currentSessionId);
    if (sessionIndex !== -1) {
        sessions[sessionIndex] = { ...currentSessionData };
        window.storageManager.saveSessionsToLocalStorage();
    }
}

function restoreSession(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    // Clear current data
    window.timerManager.resetTimer();
    window.creditsManager.setCredits(session.credits);
    window.creditsManager.updateCredits();
    window.taskManager.setSubtasks(session.subtasks);
    window.timerManager.setActiveMode(session.timerMode);
    window.timerManager.setTimeLeft((session.duration || window.timerManager.getTimerModes()[session.timerMode].focus * 60) - (Date.now() - new Date(session.startTime)) / 1000);
    window.timerManager.setRunning(false);
    window.timerManager.setPaused(false);
    window.timerManager.setBreak(false);
    window.timerManager.setSessionStartTime(null);
    
    // Set as current session
    currentSessionData = { ...session };
    currentSessionId = sessionId;
    
    hideSessionHistoryModal();
    
    window.modalManager.showMessage({
        mainText: "Session Restored!",
        subText: `Loaded: ${session.title}`,
        emojis: "🔄✨"
    });
}

function deleteSession(sessionId) {
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return;
    
    const session = sessions[sessionIndex];
    window.modalManager.showConfirmationModal({
        title: `Delete Session?`,
        message: `Are you sure you want to delete "${session.title}"?`,
        onConfirm: () => {
            sessions.splice(sessionIndex, 1);
            window.storageManager.saveSessionsToLocalStorage();
            renderSessionHistory();
            
            // If this was the current session, clear it
            if (currentSessionId === sessionId) {
                currentSessionId = null;
                currentSessionData = null;
            }
            
            window.modalManager.showMessage({
                mainText: "Session Deleted",
                subText: "Session removed from history",
                emojis: "🗑️"
            });
        }
    });
}

function clearAllSessions() {
    if (sessions.length === 0) {
        window.modalManager.showMessage({
            mainText: "No Sessions",
            subText: "There are no sessions to clear",
            emojis: "📝"
        });
        return;
    }
    
    window.modalManager.showConfirmationModal({
        title: 'Delete All Sessions?',
        message: `Are you sure you want to delete all ${sessions.length} sessions? This cannot be undone.`,
        onConfirm: () => {
            sessions = [];
            currentSessionId = null;
            currentSessionData = null;
            window.storageManager.saveSessionsToLocalStorage();
            renderSessionHistory();
            
            window.modalManager.showMessage({
                mainText: "All Sessions Cleared",
                subText: "Session history has been reset",
                emojis: "🗑️✨"
            });
        }
    });
}

function exportSessions() {
    if (sessions.length === 0) {
        window.modalManager.showMessage({
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
    
    window.modalManager.showMessage({
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
    }
    else {
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
                        <button onclick="window.sessionManager.restoreSession('${session.id}')" class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                            Restore
                        </button>
                        <button onclick="window.sessionManager.deleteSession('${session.id}')" class="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full">
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
                        <div class="font-medium">${window.timerManager.getTimerModes()[session.timerMode]?.name || session.timerMode}</div>
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

function addSessionLog(sessionLog) {
    sessionHistory.push(sessionLog);
}

function finishCurrentSession() {
    if (!currentSessionData) return;
    
    // Update the current session with completion time
    const now = new Date();
    currentSessionData.endTime = now.toISOString();
    currentSessionData.duration = Math.round((now - new Date(currentSessionData.startTime)) / 1000);
    currentSessionData.status = 'completed';
    
    // Update in sessions array
    const sessionIndex = sessions.findIndex(s => s.id === currentSessionId);
    if (sessionIndex !== -1) {
        sessions[sessionIndex] = { ...currentSessionData };
        window.storageManager.saveSessionsToLocalStorage();
    }
}

function resetToDefaults() {
    // Reset timer
    window.timerManager.resetTimer();
    
    // Clear current session data
    currentSessionData = null;
    currentSessionId = null;
    
    // Clear tasks and subtasks
    window.taskManager.setSubtasks([]);
    window.taskManager.setMainTask('');
    
    // Re-render components
    window.taskManager.renderSubtasks();
    renderSessionHistory();
}

// Setup session event listeners
function setupSessionEventListeners() {
    if (sessionHistoryBtn) sessionHistoryBtn.addEventListener('click', showSessionHistoryModal);
    if (sessionHistoryClose) {
        sessionHistoryClose.addEventListener('click', () => {
            sessionHistoryModal.classList.add('hidden');
            sessionHistoryModal.classList.remove('flex');
        });
    }
    if (clearAllSessionsBtn) clearAllSessionsBtn.addEventListener('click', clearAllSessions);
    if (exportSessionsBtn) exportSessionsBtn.addEventListener('click', exportSessions);
}

// Initialize session DOM elements
function initializeSessionElements(elements) {
    sessionHistoryBtn = elements.sessionHistoryBtn;
    sessionHistoryModal = elements.sessionHistoryModal;
    sessionHistoryClose = elements.sessionHistoryClose;
    sessionsListEl = elements.sessionsListEl;
    clearAllSessionsBtn = elements.clearAllSessionsBtn;
    exportSessionsBtn = elements.exportSessionsBtn;
}

// Initialize sessions
function initializeSessions() {
    renderSessionHistory();
    setupSessionEventListeners();
}

// Export session state and functions
window.sessionManager = {
    // State
    getSessions: () => sessions,
    setSessions: (value) => { sessions = value; },
    getCurrentSessionId: () => currentSessionId,
    setCurrentSessionId: (value) => { currentSessionId = value; },
    getCurrentSessionData: () => currentSessionData,
    setCurrentSessionData: (value) => { currentSessionData = value; },
    getSessionHistory: () => sessionHistory,
    setSessionHistory: (value) => { sessionHistory = value; },
    
    // Functions
    generateSessionId,
    createNewSession,
    updateCurrentSession,
    restoreSession,
    deleteSession,
    clearAllSessions,
    exportSessions,
    formatDuration,
    renderSessionHistory,
    showSessionHistoryModal,
    hideSessionHistoryModal,
    addSessionLog,
    finishCurrentSession,
    resetToDefaults,
    initializeSessionElements,
    initializeSessions
}; 