// tooltip-manager.js - Customizable Tooltip System
class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.message = "Don't forget to check our new Christmas theme! 🎄";
        this.duration = 10000; // 10 seconds
        this.hasShown = false;
        this.timeoutId = null;
        this.init();
    }

    init() {
        // Load custom message from localStorage if available
        const savedMessage = localStorage.getItem('purge_tooltip_message');
        if (savedMessage) {
            this.message = savedMessage;
        }
        
        // Check if tooltip was already shown in this session
        const sessionShown = sessionStorage.getItem('purge_tooltip_shown');
        if (sessionShown === 'true') {
            console.log('💡 Tooltip already shown this session');
            return;
        }
        
        // Only show on index page (home page)
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isHomePage = currentPage === 'index.html' || currentPage === '' || currentPage.endsWith('/');
        
        if (!isHomePage) {
            console.log('💡 Not home page, skipping tooltip');
            return;
        }
        
        // Wait for page to load, then show tooltip
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.showTooltip(), 1500);
            });
        } else {
            setTimeout(() => this.showTooltip(), 1500);
        }
    }

    createTooltip() {
        // Remove existing tooltip if any
        const existing = document.getElementById('custom-tooltip');
        if (existing) {
            existing.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.id = 'custom-tooltip';
        tooltip.className = 'custom-tooltip';
        
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <span class="tooltip-message">${this.message}</span>
                <button class="tooltip-close" onclick="tooltipManager.hideTooltip()" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        this.tooltip = tooltip;
        
        // Apply theme colors
        this.applyThemeColors();
        
        // Animate in
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 100);
    }

    applyThemeColors() {
        if (!this.tooltip) return;
        
        const root = getComputedStyle(document.documentElement);
        const primary = root.getPropertyValue('--primary').trim() || '#8B5CF6';
        const dark = root.getPropertyValue('--dark').trim() || '#111113';
        const lightGray = root.getPropertyValue('--light-gray').trim() || '#2a2a30';
        const text = root.getPropertyValue('--text').trim() || '#cbd5e1';
        const glowColor = root.getPropertyValue('--glow-color').trim() || 'rgba(139, 92, 246, 0.3)';
        
        this.tooltip.style.setProperty('--tooltip-primary', primary);
        this.tooltip.style.setProperty('--tooltip-dark', dark);
        this.tooltip.style.setProperty('--tooltip-light-gray', lightGray);
        this.tooltip.style.setProperty('--tooltip-text', text);
        this.tooltip.style.setProperty('--tooltip-glow', glowColor);
    }

    showTooltip() {
        // Don't show if already shown or currently showing
        if (this.hasShown || this.tooltip) {
            console.log('💡 Tooltip already shown or currently displaying');
            return;
        }
        
        // Mark as shown in session
        sessionStorage.setItem('purge_tooltip_shown', 'true');
        this.hasShown = true;
        
        this.createTooltip();
        
        // Auto-hide after duration
        this.timeoutId = setTimeout(() => {
            this.hideTooltip();
        }, this.duration);
    }

    hideTooltip() {
        // Clear timeout if exists
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        
        if (this.tooltip) {
            this.tooltip.classList.remove('show');
            setTimeout(() => {
                if (this.tooltip && this.tooltip.parentNode) {
                    this.tooltip.remove();
                }
                this.tooltip = null;
            }, 300);
        }
    }

    setMessage(message) {
        this.message = message;
        localStorage.setItem('purge_tooltip_message', message);
        
        // If tooltip is currently showing, update it
        if (this.tooltip) {
            const messageEl = this.tooltip.querySelector('.tooltip-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
        }
    }

    getMessage() {
        return this.message;
    }
    
    // Read global settings and default chatTips to true if missing
    getSettings() {
        try {
            const saved = localStorage.getItem('purge_settings');
            const settings = saved ? JSON.parse(saved) : {};
            if (typeof settings.chatTips !== 'boolean') settings.chatTips = true;
            return settings;
        } catch (e) {
            return { chatTips: true };
        }
    }

    // Show a theme-aware tooltip triggered by chat send
    // Respects settings (chatTips) and shows at most once per session for chat
    showChatTip(message = null) {
        const settings = this.getSettings();
        if (settings && settings.chatTips === false) {
            return; // disabled in settings
        }

        if (sessionStorage.getItem('purge_chat_tip_shown') === 'true') {
            return; // already shown this session for chat
        }

        if (message) {
            this.setMessage(message);
        }

        // Do not mark general tooltip shown; only mark chat tip session flag
        this.createTooltip();
        sessionStorage.setItem('purge_chat_tip_shown', 'true');

        // Auto-hide after configured duration
        this.timeoutId = setTimeout(() => {
            this.hideTooltip();
        }, this.duration);
    }
    
    // Show tooltip manually (useful for testing or custom triggers)
    show(message = null, force = false) {
        if (message) {
            this.setMessage(message);
        }
        
        // Allow forcing to show again if needed
        if (force) {
            this.hasShown = false;
            sessionStorage.removeItem('purge_tooltip_shown');
        }
        
        this.showTooltip();
    }
    
    // Reset tooltip state (useful for testing)
    reset() {
        this.hasShown = false;
        this.hideTooltip();
        sessionStorage.removeItem('purge_tooltip_shown');
    }
}

// Global function to set tooltip message
window.setTooltipMessage = function(message) {
    if (window.tooltipManager) {
        window.tooltipManager.setMessage(message);
    }
};

// Initialize tooltip manager
const tooltipManager = new TooltipManager();
window.tooltipManager = tooltipManager;

// Optional global helper for triggering from other modules
window.showChatTip = function(message) {
    if (window.tooltipManager && typeof window.tooltipManager.showChatTip === 'function') {
        window.tooltipManager.showChatTip(message);
    }
};

// Listen for theme changes to update tooltip colors
window.addEventListener('themeChanged', () => {
    if (tooltipManager.tooltip) {
        tooltipManager.applyThemeColors();
    }
});

