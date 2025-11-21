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

// Listen for theme changes to update tooltip colors
window.addEventListener('themeChanged', () => {
    if (tooltipManager.tooltip) {
        tooltipManager.applyThemeColors();
    }
});

