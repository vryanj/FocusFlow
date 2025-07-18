// Credits & Perks Module
// Handles all credits and perks functionality

// App State
let credits = 0;
let perks = getDefaultPerks();

// DOM Elements
let creditCountEl, perksListEl, addPerkBtn;
let addPerkModal, perkNameModalInput, perkCostModalInput, perkInventoryModalInput, perkModalSave, perkModalCancel;

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

// Credits & Perks Functions
function updateCredits() {
    if (creditCountEl) {
        creditCountEl.textContent = credits; 
    }
    renderPerks(); 
    window.storageManager.saveToLocalStorage(); // Save when credits change
}

function addCredits(amount) {
    credits += amount;
    updateCredits();
}

function renderPerks() {
    if (!perksListEl) {
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
                ? 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700' 
                : cannotAfford
                ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
                : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:shadow-md'
        }`;
        
        // Clean circular inventory badge
        let inventoryBadge = '';
        if (perk.inventory !== undefined) {
            if (perk.inventory === 0) {
                inventoryBadge = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-red-500 text-white text-center leading-none" title="Sold Out">×</span>`;
            }
            else if (perk.inventory <= 2) {
                inventoryBadge = `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-orange-500 text-white text-center leading-none" title="${perk.inventory} Left">${perk.inventory}</span>`;
            }
            else {
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
            <button onclick="window.creditsManager.purchasePerk(${originalIndex})" class="${buttonClass} font-bold py-2 px-4 rounded-lg shrink-0 transition-all transform hover:scale-105" ${isDisabled ? 'disabled' : ''}>${buttonText}</button>
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
        window.storageManager.saveToLocalStorage(); // Save when perk is added
        window.modalManager.showMessage({mainText: `Perk "${name}" added successfully! (${inventory} available)`});
    }
    else { window.modalManager.showMessage({mainText: 'Please enter a valid perk name, cost, and inventory.'}); }
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
        window.modalManager.showMessage({mainText: "This perk is out of stock!"});
        return;
    }
    
    // Check if user has enough credits
    if (credits < perk.cost) {
        window.modalManager.showMessage({mainText: "You don't have enough credits."});
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
    window.storageManager.saveToLocalStorage(); // Save the updated inventory
    
    const inventoryMessage = perk.inventory !== undefined && perk.inventory === 0 
        ? " This perk is now out of stock!" 
        : "";
    
    window.modalManager.showMessage({
        mainText: `You've purchased "${perk.name}"! Enjoy your break.${inventoryMessage}`
    });
}

function restoreDefaultPerks() {
    window.modalManager.showConfirmationModal({
        title: 'Restore Default Perks?',
        message: 'Are you sure you want to restore default perks? This will remove all custom perks you have added.',
        onConfirm: () => {
            perks = getDefaultPerks();
            renderPerks();
            window.storageManager.saveToLocalStorage();
            
            window.modalManager.showMessage({
                mainText: "Default Perks Restored!",
                subText: "All custom perks have been removed and default perks restored.",
                emojis: "🔄✨"
            });
        }
    });
}

// Setup credits event listeners
function setupCreditsEventListeners() {
    if (addPerkBtn) addPerkBtn.addEventListener('click', addPerk);
    
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
}

// Initialize credits DOM elements
function initializeCreditsElements(elements) {
    creditCountEl = elements.creditCountEl;
    perksListEl = elements.perksListEl;
    addPerkBtn = elements.addPerkBtn;
    addPerkModal = elements.addPerkModal;
    perkNameModalInput = elements.perkNameModalInput;
    perkCostModalInput = elements.perkCostModalInput;
    perkInventoryModalInput = elements.perkInventoryModalInput;
    perkModalSave = elements.perkModalSave;
    perkModalCancel = elements.perkModalCancel;
}

// Initialize credits
function initializeCredits() {
    updateCredits();
    renderPerks();
    setupCreditsEventListeners();
}

// Export credits state and functions
window.creditsManager = {
    // State
    getCredits: () => credits,
    setCredits: (value) => { credits = value; },
    getPerks: () => perks,
    setPerks: (value) => { perks = value; },
    getDefaultPerks,
    
    // Functions
    addCredits,
    updateCredits,
    renderPerks,
    addPerk,
    savePerkFromModal,
    closePerkModal,
    purchasePerk,
    restoreDefaultPerks,
    initializeCreditsElements,
    initializeCredits
}; 