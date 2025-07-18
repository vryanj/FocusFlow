// API Module
// Handles all API-related functionality

// API State
let API_KEY = null;

// API Functions
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
        return "Error contacting AI. Check console.";
    }
}

async function generateSubtasks() {
    const mainTask = window.taskManager.getMainTask();
    if (!mainTask) { 
        window.modalManager.showMessage({
            text: "Please enter a task first",
            subText: "Add a task description above to generate subtasks",
            emojis: "📝"
        }); 
        return; 
    }
    
    // Check if API key is available
    const apiKey = localStorage.getItem('google_api_key');
    if (!apiKey) {
        window.modalManager.showMessage({
            text: "Google API key required",
            subText: "Set your API key in Settings to use AI features",
            emojis: "🔑⚙️",
            actions: [
                {
                    text: "Open Settings",
                    action: () => {
                        window.modalManager.hideMessage();
                        window.modalManager.showSettingsModal();
                    }
                }
            ]
        });
        return;
    }
    
    const breakdownBtn = document.getElementById('breakdown-btn');
    breakdownBtn.disabled = true;
    breakdownBtn.innerHTML = `<span class="spinner"></span> Generating...`;
    
    try {
        const prompt = `Break down the following task into a short list of actionable sub-tasks. Each sub-task should be something that can be focused on for a 25-minute pomodoro session. Return ONLY the list as plain text, with each sub-task on a new line. Do not use markdown, numbering, or any introductory text. The task is: "${mainTask}"`;
        const resultText = await callGemini(prompt);
        const subtasks = resultText.split('\n').filter(task => task.trim() !== '').map(task => ({ text: task, completed: false }));
        window.taskManager.setSubtasks(subtasks);
        window.taskManager.renderSubtasks();
        window.storageManager.saveToLocalStorage(); // Save after generating subtasks
        
        window.modalManager.showMessage({
            text: "Subtasks generated successfully!",
            subText: "AI broke down your task into focused sessions",
            emojis: "✨🎯"
        });
    } catch (error) {
        window.modalManager.showMessage({
            text: "Failed to generate subtasks",
            subText: "Check your API key in Settings or try again",
            emojis: "❌🔧"
        });
    }
    finally {
        breakdownBtn.disabled = false;
        breakdownBtn.innerHTML = '<span class="text-xl">✨</span> Generate Sub-tasks from above';
    }
}

function clearApiKey() {
    API_KEY = null;
}

// Export API functions
window.apiManager = {
    callGemini,
    generateSubtasks,
    clearApiKey
}; 