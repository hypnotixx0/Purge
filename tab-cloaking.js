// tab-cloaking.js - Global Tab Cloaking System for All Pages
class TabCloaking {
    constructor() {
        this.SETTINGS_KEY = 'purge_cloaker_settings';
        this.currentPreset = null;
        this.originalTitle = document.title;
        this.originalFavicon = this.getCurrentFavicon();
        this.init();
    }

    init() {
        // Load and apply saved cloaking settings on page load
        this.loadCloakerSettings();
        
        // Listen for storage changes (when cloaking is changed in another tab)
        window.addEventListener('storage', (e) => {
            if (e.key === this.SETTINGS_KEY) {
                this.loadCloakerSettings();
            }
        });
        
        // Also listen for custom events (same-tab changes)
        window.addEventListener('cloakingChanged', () => {
            this.loadCloakerSettings();
        });
    }

    getCurrentFavicon() {
        const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
        return favicon ? favicon.href : 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico';
    }

    loadCloakerSettings() {
        try {
            const saved = localStorage.getItem(this.SETTINGS_KEY);
            if (saved) {
                const settings = JSON.parse(saved);
                this.currentPreset = settings.preset;
                
                // Apply cloaking if settings are less than 24 hours old
                if (Date.now() - settings.timestamp < 24 * 60 * 60 * 1000) {
                    this.applyTabCloaking(this.currentPreset);
                } else {
                    // Settings expired, remove them
                    this.removeCloaking();
                }
            } else {
                // No cloaking settings, restore original
                this.restoreOriginal();
            }
        } catch (e) {
            console.error('Error loading cloaker settings:', e);
        }
    }

    applyTabCloaking(preset) {
        if (!preset) return;
        
        // Store original title if not already stored
        if (!this.originalTitle || this.originalTitle.includes(' - /Purge')) {
            const currentTitle = document.title;
            // Only store if it's not already a cloaked title
            if (!this.isCloakedTitle(currentTitle)) {
                this.originalTitle = currentTitle;
            }
        }
        
        // Apply cloaked title
        document.title = preset.title;
        
        // Apply cloaked favicon
        this.changeFavicon(preset.favicon);
        
        this.currentPreset = preset;
        console.log('🎭 Tab cloaking applied:', preset.name);
    }

    isCloakedTitle(title) {
        // Check if title matches any preset title
        const presets = this.getPresets();
        return presets.some(preset => title === preset.title);
    }

    changeFavicon(favicon) {
        // Remove existing favicons
        const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
        existingFavicons.forEach(link => link.remove());
        
        // Create new favicon link
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = favicon;
        document.head.appendChild(link);
    }

    removeCloaking() {
        this.restoreOriginal();
        localStorage.removeItem(this.SETTINGS_KEY);
        this.currentPreset = null;
        
        // Dispatch event to notify other tabs
        window.dispatchEvent(new CustomEvent('cloakingChanged'));
        
        console.log('🎭 Tab cloaking removed');
    }

    restoreOriginal() {
        // Restore original title based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        let defaultTitle = '/Purge';
        
        if (currentPage === 'games.html') {
            defaultTitle = 'Games - /Purge';
        } else if (currentPage === 'tools.html') {
            defaultTitle = 'Tools - /Purge';
        } else if (currentPage === 'themes.html') {
            defaultTitle = 'Themes - /Purge';
        } else if (currentPage === 'roadmap.html') {
            defaultTitle = 'Roadmap - /Purge';
        } else if (currentPage === 'index.html' || currentPage === '') {
            defaultTitle = '/Purge';
        } else if (currentPage.includes('kindergarden')) {
            defaultTitle = currentPage.includes('kindergarden1') ? 'Kindergarden 1 - /Purge' : 'Kindergarden 2 - /Purge';
        } else if (currentPage.includes('balatro')) {
            defaultTitle = 'Balatro - /Purge';
        } else if (currentPage.includes('cookieclicker')) {
            defaultTitle = 'Cookie Clicker - /Purge';
        } else if (currentPage === 'blocked.html') {
            defaultTitle = 'Access Blocked - /Purge';
        }
        
        document.title = defaultTitle;
        
        // Restore original favicon
        this.restoreOriginalFavicon();
    }

    restoreOriginalFavicon() {
        const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
        existingFavicons.forEach(link => link.remove());
        
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico';
        document.head.appendChild(link);
    }

    saveCloakerSettings(preset) {
        const settings = {
            preset: preset,
            timestamp: Date.now()
        };
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        
        // Dispatch event to notify other tabs
        window.dispatchEvent(new CustomEvent('cloakingChanged'));
    }

    getPresets() {
        const presets = [
            {
                name: 'Google Drive',
                title: 'My Drive - Google Drive',
                favicon: 'https://drive.google.com/favicon.ico',
                icon: '📁'
            },
            {
                name: 'Google Docs',
                title: 'Document - Google Docs',
                favicon: 'https://docs.google.com/favicon.ico',
                icon: '📄'
            },
            {
                name: 'Google Classroom',
                title: 'Classes - Google Classroom',
                favicon: 'https://classroom.google.com/favicon.ico',
                icon: '🏫'
            },
            {
                name: 'Clever',
                title: 'Clever | Portal',
                favicon: 'https://clever.com/favicon.ico',
                icon: '🎓'
            },
            {
                name: 'Khan Academy',
                title: 'Khan Academy',
                favicon: 'https://www.khanacademy.org/favicon.ico',
                icon: '📚'
            },
            {
                name: 'Zoom',
                title: 'Zoom',
                favicon: 'https://zoom.us/favicon.ico',
                icon: '💻'
            },
            {
                name: 'Canvas',
                title: 'Canvas LMS',
                favicon: 'https://instructure.com/favicon.ico',
                icon: '🎨'
            },
            {
                name: 'Microsoft Teams',
                title: 'Microsoft Teams',
                favicon: 'https://teams.microsoft.com/favicon.ico',
                icon: '💬'
            }
        ];
        
        // Load custom presets
        const customPresets = this.loadCustomPresets();
        return [...presets, ...customPresets];
    }

    loadCustomPresets() {
        try {
            const saved = localStorage.getItem('purge_custom_cloaker_presets');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            window.debug?.error('Error loading custom cloaker presets:', e);
            return [];
        }
    }

    saveCustomPresets(presets) {
        try {
            localStorage.setItem('purge_custom_cloaker_presets', JSON.stringify(presets));
        } catch (e) {
            window.debug?.error('Error saving custom cloaker presets:', e);
        }
    }

    addCustomPreset(name, title, favicon, icon = '🎭') {
        const customPresets = this.loadCustomPresets();
        customPresets.push({ name, title, favicon, icon });
        this.saveCustomPresets(customPresets);
    }

    removeCustomPreset(name) {
        const customPresets = this.loadCustomPresets();
        const filtered = customPresets.filter(p => p.name !== name);
        this.saveCustomPresets(filtered);
    }

    getCurrentPreset() {
        return this.currentPreset;
    }

    isCloaked() {
        return this.currentPreset !== null;
    }
}

// Initialize tab cloaking on every page
const tabCloaking = new TabCloaking();
window.tabCloaking = tabCloaking;

// Apply cloaking when page loads (after DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure theme manager has run first, then cloaking takes priority
    setTimeout(() => {
        tabCloaking.loadCloakerSettings();
    }, 100);
});

