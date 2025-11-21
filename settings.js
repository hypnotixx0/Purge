// settings.js - Settings page functionality
(function() {
    'use strict';

    const SETTINGS_KEY = 'purge_settings';

    function loadSettings() {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            return saved ? JSON.parse(saved) : {
                autoClearData: false,
                disableTracking: false,
                lazyLoading: true,
                enableCache: true,
                achievementNotifications: true,
                gameNotifications: true,
                chatTips: true,
                chatNotifications: true
            };
        } catch (e) {
            return {
                autoClearData: false,
                disableTracking: false,
                lazyLoading: true,
                enableCache: true,
                achievementNotifications: true,
                gameNotifications: true,
                chatTips: true,
                chatNotifications: true
            };
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }

    function updateCurrentTheme() {
        const preview = document.getElementById('current-theme-preview');
        const name = document.getElementById('current-theme-name');
        if (preview && name && window.themeManager) {
            const theme = window.themeManager.getCurrentTheme();
            const themes = window.themeManager.getThemes();
            const currentTheme = themes[theme];
            if (currentTheme) {
                name.textContent = currentTheme.name || theme;
                preview.style.background = `linear-gradient(135deg, ${currentTheme.colors['--primary']}, ${currentTheme.colors['--dark']})`;
            }
        }
    }

    function toggleAutoClear() {
        const checkbox = document.getElementById('auto-clear-data');
        const settings = loadSettings();
        settings.autoClearData = checkbox.checked;
        saveSettings(settings);
    }

    function toggleTracking() {
        const checkbox = document.getElementById('disable-tracking');
        const settings = loadSettings();
        settings.disableTracking = checkbox.checked;
        saveSettings(settings);
    }

    function toggleLazyLoading() {
        const checkbox = document.getElementById('lazy-loading');
        const settings = loadSettings();
        settings.lazyLoading = checkbox.checked;
        saveSettings(settings);
    }

    function toggleCache() {
        const checkbox = document.getElementById('enable-cache');
        const settings = loadSettings();
        settings.enableCache = checkbox.checked;
        saveSettings(settings);
        
        if (checkbox.checked && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(() => {
                console.log('Service Worker registered');
            });
        }
    }

    function toggleAchievementNotifications() {
        const checkbox = document.getElementById('achievement-notifications');
        const settings = loadSettings();
        settings.achievementNotifications = checkbox.checked;
        saveSettings(settings);
    }

    function toggleGameNotifications() {
        const checkbox = document.getElementById('game-notifications');
        const settings = loadSettings();
        settings.gameNotifications = checkbox.checked;
        saveSettings(settings);
    }

    function toggleChatTips() {
        const checkbox = document.getElementById('chat-tips');
        const settings = loadSettings();
        settings.chatTips = checkbox.checked;
        saveSettings(settings);
    }

    function toggleChatNotifications() {
        const checkbox = document.getElementById('chat-notifications');
        const settings = loadSettings();
        settings.chatNotifications = checkbox && checkbox.checked;
        saveSettings(settings);
    }

    function exportSettings() {
        const settings = loadSettings();
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'purge-settings.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    function importSettings() {
        document.getElementById('import-file').click();
    }

    function handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);
                saveSettings(settings);
                location.reload();
            } catch (err) {
                alert('Invalid settings file');
            }
        };
        reader.readAsText(file);
    }

    function resetAllSettings() {
        if (!confirm('Reset all settings to default? This cannot be undone.')) return;
        
        localStorage.removeItem(SETTINGS_KEY);
        location.reload();
    }

    // Initialize settings page
    document.addEventListener('DOMContentLoaded', () => {
        const settings = loadSettings();
        
        // Set checkbox states
        document.getElementById('auto-clear-data').checked = settings.autoClearData;
        document.getElementById('disable-tracking').checked = settings.disableTracking;
        document.getElementById('lazy-loading').checked = settings.lazyLoading;
        document.getElementById('enable-cache').checked = settings.enableCache;
        document.getElementById('achievement-notifications').checked = settings.achievementNotifications;
        document.getElementById('game-notifications').checked = settings.gameNotifications;
        const chatTipsEl = document.getElementById('chat-tips');
        if (chatTipsEl) chatTipsEl.checked = settings.chatTips;
        const chatNotifsEl = document.getElementById('chat-notifications');
        if (chatNotifsEl) chatNotifsEl.checked = settings.chatNotifications;
        
        // Update theme preview
        setTimeout(updateCurrentTheme, 100);
        
        // Listen for theme changes
        window.addEventListener('themeChanged', updateCurrentTheme);
    });

    // Expose functions globally
    window.toggleAutoClear = toggleAutoClear;
    window.toggleTracking = toggleTracking;
    window.toggleLazyLoading = toggleLazyLoading;
    window.toggleCache = toggleCache;
    window.toggleAchievementNotifications = toggleAchievementNotifications;
    window.toggleGameNotifications = toggleGameNotifications;
    window.toggleChatTips = toggleChatTips;
    window.toggleChatNotifications = toggleChatNotifications;
    window.exportSettings = exportSettings;
    window.importSettings = importSettings;
    window.handleImportFile = handleImportFile;
    window.resetAllSettings = resetAllSettings;
})();

