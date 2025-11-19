// keyboard-shortcuts.js - Global Keyboard Shortcuts
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        console.log('⌨️ Keyboard shortcuts initialized');
    }

    handleKeyPress(e) {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        // Escape key - close modals/popups
        if (e.key === 'Escape') {
            this.handleEscape();
        }

        // Ctrl/Cmd + K - Quick search (games page)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.handleQuickSearch();
        }

        // Ctrl/Cmd + T - Open themes
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            this.handleOpenThemes();
        }

        // Ctrl/Cmd + H - Go home
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            this.handleGoHome();
        }

        // Number keys 1-4 for quick category access (on home page)
        if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (currentPage === 'index.html' || currentPage === '' || currentPage.endsWith('/')) {
                this.handleCategoryShortcut(parseInt(e.key));
            }
        }
    }

    handleEscape() {
        // Close key popup
        const keyPopup = document.getElementById('key-popup');
        if (keyPopup && keyPopup.classList.contains('active')) {
            const closeBtn = document.getElementById('close-key-popup');
            if (closeBtn) closeBtn.click();
            return;
        }

        // Close discord popup
        const discordPopup = document.getElementById('popup');
        if (discordPopup && discordPopup.classList.contains('active')) {
            const closeBtn = document.getElementById('close-popup');
            if (closeBtn) closeBtn.click();
            return;
        }

        // Close premium modal
        const premiumModal = document.getElementById('premium-required-modal');
        if (premiumModal && premiumModal.classList.contains('active')) {
            if (typeof closePremiumModal === 'function') {
                closePremiumModal();
            }
            return;
        }

        // Close tooltip
        if (window.tooltipManager && window.tooltipManager.tooltip) {
            window.tooltipManager.hideTooltip();
        }
    }

    handleQuickSearch() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === 'games.html') {
            const searchInput = document.getElementById('game-search');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    }

    handleOpenThemes() {
        window.location.href = 'themes.html';
    }

    handleGoHome() {
        window.location.href = 'index.html';
    }

    handleCategoryShortcut(number) {
        const categories = ['games', 'apps', 'tools', 'roadmap'];
        const category = categories[number - 1];
        if (category) {
            if (typeof showKeyPopup === 'function') {
                showKeyPopup(category);
            }
        }
    }
}

// Initialize keyboard shortcuts
const keyboardShortcuts = new KeyboardShortcuts();
window.keyboardShortcuts = keyboardShortcuts;

