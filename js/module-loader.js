// Module Loader for Pomodoro App
// This script loads HTML modules and then initializes the main application

class ModuleLoader {
    constructor() {
        this.modules = [
            { name: 'navigation', container: 'navigation-container', path: 'modules/navigation.html' },
            { name: 'timer', container: 'timer-container', path: 'modules/timer.html' },
            { name: 'credits-perks', container: 'credits-perks-container', path: 'modules/credits-perks.html' },
            { name: 'task-management', container: 'task-management-container', path: 'modules/task-management.html' },
            { name: 'modals', container: 'modals-container', path: 'modules/modals.html' }
        ];
        this.loadedModules = 0;
        this.totalModules = this.modules.length;
    }

    async loadModule(module) {
        try {
            const response = await fetch(module.path);
            if (!response.ok) {
                throw new Error(`Failed to load ${module.name}: ${response.status}`);
            }
            const html = await response.text();
            const container = document.getElementById(module.container);
            if (container) {
                container.innerHTML = html;
                console.log(`✓ Loaded module: ${module.name}`);
            } else {
                console.error(`Container not found: ${module.container}`);
            }
        } catch (error) {
            console.error(`Error loading module ${module.name}:`, error);
        }
    }

    async loadAllModules() {
        console.log('🚀 Loading Pomodoro App modules...');
        
        // Load all modules in parallel
        const loadPromises = this.modules.map(module => this.loadModule(module));
        
        try {
            await Promise.all(loadPromises);
            console.log('✅ All modules loaded successfully');
            
            // Now load the main application JavaScript
            await this.loadMainScript();
            
        } catch (error) {
            console.error('❌ Error loading modules:', error);
        }
    }

    async loadMainScript() {
        try {
            // Load environment loader first
            await this.loadScript('js/env-loader.js');
            console.log('✓ Environment loader loaded');
            
            // Then load the main script
            const script = document.createElement('script');
            script.src = 'js/app.js';
            script.onload = () => {
                console.log('✅ Main application script loaded');
                // Initialize the app if there's an init function
                if (typeof window.initializeApp === 'function') {
                    window.initializeApp();
                }
            };
            script.onerror = () => {
                console.error('❌ Failed to load main application script');
            };
            document.head.appendChild(script);
        } catch (error) {
            console.error('Error loading main script:', error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}

// Initialize the module loader when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ModuleLoader();
    await loader.loadAllModules();
});
