// utils.js - Utility functions
class Utils {
    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Validate URL
    static isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    // Sanitize HTML
    static sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Show error message to user
    static showError(message, duration = 5000) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, duration);
    }

    // Show success message
    static showSuccess(message, duration = 3000) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(successDiv);
        setTimeout(() => {
            successDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => successDiv.remove(), 300);
        }, duration);
    }

    // Show loading indicator
    static showLoading(message = 'Loading...') {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'utils-loading';
        loadingDiv.className = 'utils-loading';
        loadingDiv.innerHTML = `
            <div class="utils-loading-content">
                <div class="utils-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        loadingDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        document.body.appendChild(loadingDiv);
        return loadingDiv;
    }

    // Hide loading indicator
    static hideLoading() {
        const loading = document.getElementById('utils-loading');
        if (loading) loading.remove();
    }

    // Safe localStorage operations
    static safeLocalStorageGet(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            window.debug?.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    }

    static safeLocalStorageSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            window.debug?.error('Error writing to localStorage:', e);
            if (e.name === 'QuotaExceededError') {
                Utils.showError('Storage quota exceeded. Please clear some data.');
            }
            return false;
        }
    }

    // Export settings
    static exportSettings() {
        const settings = {
            theme: localStorage.getItem('purge_theme'),
            cloaker: localStorage.getItem('purge_cloaker_settings'),
            favorites: localStorage.getItem('angst_favorites'),
            recentGames: localStorage.getItem('purge_recent_games'),
            timestamp: Date.now()
        };
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `purge-settings-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Utils.showSuccess('Settings exported successfully!');
    }

    // Import settings
    static importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);
                if (settings.theme) localStorage.setItem('purge_theme', settings.theme);
                if (settings.cloaker) localStorage.setItem('purge_cloaker_settings', settings.cloaker);
                if (settings.favorites) localStorage.setItem('angst_favorites', settings.favorites);
                if (settings.recentGames) localStorage.setItem('purge_recent_games', settings.recentGames);
                Utils.showSuccess('Settings imported successfully! Reloading...');
                setTimeout(() => window.location.reload(), 1000);
            } catch (e) {
                Utils.showError('Invalid settings file');
            }
        };
        reader.readAsText(file);
    }
}

window.Utils = Utils;

