// theme-tab-updater.js - Update browser tabs with theme colors
(function() {
    'use strict';
    
    function updateTabsWithTheme() {
        if (!window.themeManager) {
            setTimeout(updateTabsWithTheme, 100);
            return;
        }
        
        const theme = window.themeManager.getCurrentTheme();
        const themes = window.themeManager.getThemes();
        const currentTheme = themes[theme];
        
        if (!currentTheme) return;
        
        // Get theme colors
        const root = document.documentElement;
        const primary = getComputedStyle(root).getPropertyValue('--primary').trim() || currentTheme.colors.primary;
        const glowColor = currentTheme.glowColor || primary;
        
        // Update all tabs with theme colors
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            if (tab.classList.contains('active')) {
                // Update active tab glow
                const afterStyle = window.getComputedStyle(tab, '::after');
                tab.style.setProperty('--tab-glow', glowColor);
            }
        });
        
        // Update browser tabs container
        const browserTabs = document.querySelector('.browser-tabs');
        if (browserTabs) {
            browserTabs.style.setProperty('--tabs-glow', glowColor);
        }
        
        // Update toolbar buttons
        const toolbarBtns = document.querySelectorAll('.toolbar-btn');
        toolbarBtns.forEach(btn => {
            btn.style.setProperty('--btn-glow', glowColor);
        });
        
        // Update address bar
        const addressBar = document.querySelector('.address-bar');
        if (addressBar) {
            addressBar.style.setProperty('--address-glow', glowColor);
        }
    }
    
    // Update on theme change
    window.addEventListener('themeChanged', () => {
        updateTabsWithTheme();
    });
    
    // Initial update
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(updateTabsWithTheme, 500);
        });
    } else {
        setTimeout(updateTabsWithTheme, 500);
    }
    
    // Update when tabs change
    const observer = new MutationObserver(() => {
        updateTabsWithTheme();
    });
    
    // Observe tab container for changes
    const tabsContainer = document.querySelector('.browser-tabs');
    if (tabsContainer) {
        observer.observe(tabsContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }
})();

