// Simple environment variable loader for client-side apps
class EnvLoader {
    constructor() {
        this.env = {};
        this.loaded = false;
    }

    async load() {
        if (this.loaded) return this.env;
        
        try {
            const response = await fetch('./.env');
            if (!response.ok) {
                throw new Error('Could not load .env file');
            }
            
            const text = await response.text();
            const lines = text.split('\n');
            
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const [key, ...valueParts] = trimmed.split('=');
                    if (key && valueParts.length > 0) {
                        this.env[key.trim()] = valueParts.join('=').trim();
                    }
                }
            }
            
            this.loaded = true;
            return this.env;
        } catch (error) {
            console.warn('Could not load environment variables:', error);
            // Fallback to empty object
            this.loaded = true;
            return this.env;
        }
    }

    get(key, defaultValue = null) {
        return this.env[key] || defaultValue;
    }
}

// Global instance
window.envLoader = new EnvLoader();
