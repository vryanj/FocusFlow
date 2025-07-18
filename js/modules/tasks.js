// Task Management Module
// Handles all task and subtask functionality

// Task State
let subtasks = [];

// DOM Elements
let taskInput, breakdownBtn, subtasksContainer, subtaskProgressEl, addSubtaskBtn;
let addSubtaskModal, subtaskModalTitle, subtaskInput, subtaskModalSave, subtaskModalCancel;

// Task & Sub-task Functions
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
    if (!subtasksContainer) return;
    
    subtasksContainer.innerHTML = '';
    if (subtasks.length === 0) {
        subtasksContainer.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 italic">No sub-tasks yet. Generate them or add one manually!</p>`;
    }
    else {
        subtasks.forEach((task, index) => {
            const taskEl = document.createElement('div');
            taskEl.className = 'flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
            taskEl.draggable = true;
            taskEl.dataset.index = index;
            taskEl.innerHTML = `
                <div class="drag-handle cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 shrink-0" title="Drag to reorder">
                    <i class="fa-solid fa-grip-vertical"></i>
                </div>
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-500 shrink-0" onchange="window.taskManager.toggleSubtask(${index})">
                <span class="flex-grow text-gray-800 dark:text-gray-100 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''} cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-2 py-1 transition-colors" onclick="window.taskManager.editSubtask(${index})" title="Click to edit">${task.text}</span>
                 <button class="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-full text-red-500 shrink-0" onclick="window.taskManager.deleteSubtask(${index})">
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
    window.storageManager.saveToLocalStorage(); // Save when subtask text is updated
}

function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
    window.storageManager.saveToLocalStorage(); // Save when subtask is deleted
}

function toggleSubtask(index) {
    subtasks[index].completed = !subtasks[index].completed;
    renderSubtasks();
    window.storageManager.saveToLocalStorage(); // Save when subtask completion status changes
}

function saveSubtaskFromModal() {
    const newText = subtaskInput.value.trim();
    if (!newText) return;

    const editingIndex = addSubtaskModal.dataset.editingIndex;

    if (editingIndex !== undefined && editingIndex !== null) {
        // Editing existing subtask
        subtasks[editingIndex].text = newText;
    }
    else {
        // Adding new subtask
        subtasks.push({ text: newText, completed: false });
    }
    
    renderSubtasks();
    window.storageManager.saveToLocalStorage();
    hideAddSubtaskModal();
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

// Setup task event listeners
function setupTaskEventListeners() {
    if (breakdownBtn) breakdownBtn.addEventListener('click', generateSubtasks);
    if (addSubtaskBtn) addSubtaskBtn.addEventListener('click', addManualSubtask);
    if (taskInput) {
        taskInput.addEventListener('input', () => {
            window.storageManager.saveToLocalStorage();
        });
    }
    
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
}

// Initialize task DOM elements
function initializeTaskElements(elements) {
    taskInput = elements.taskInput;
    breakdownBtn = elements.breakdownBtn;
    subtasksContainer = elements.subtasksContainer;
    subtaskProgressEl = elements.subtaskProgressEl;
    addSubtaskBtn = elements.addSubtaskBtn;
    addSubtaskModal = elements.addSubtaskModal;
    subtaskModalTitle = elements.subtaskModalTitle;
    subtaskInput = elements.subtaskInput;
    subtaskModalSave = elements.subtaskModalSave;
    subtaskModalCancel = elements.subtaskModalCancel;
}

// Initialize tasks
function initializeTasks() {
    renderSubtasks();
    setupTaskEventListeners();
}

// Export task state and functions
window.taskManager = {
    // State
    getSubtasks: () => subtasks,
    setSubtasks: (value) => { subtasks = value; },
    getMainTask: () => taskInput ? taskInput.value : '',
    setMainTask: (value) => { if (taskInput) taskInput.value = value; },
    
    // Functions
    updateSubtaskProgress,
    renderSubtasks,
    showAddSubtaskModal,
    showEditSubtaskModal,
    addManualSubtask,
    hideAddSubtaskModal,
    editSubtask,
    updateSubtaskText,
    deleteSubtask,
    toggleSubtask,
    saveSubtaskFromModal,
    setupDragAndDrop,
    initializeTaskElements,
    initializeTasks
}; 