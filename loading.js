// loading.js - Loading Screen Management
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.minLoadingTime = 2000; // Minimum 2 seconds loading time
        this.startTime = Date.now();
        this.init();
    }

    init() {
        // Simulate loading process
        this.simulateLoading();
        
        // Also hide when everything is actually loaded
        window.addEventListener('load', () => {
            this.hideLoadingScreen();
        });

        // Fallback: hide after max time
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 5000);
    }

    simulateLoading() {
        // Simulate various loading stages
        const stages = [
            { time: 300, text: "Initializing..." },
            { time: 800, text: "Loading assets..." },
            { time: 1200, text: "Preparing interface..." },
            { time: 1800, text: "Almost ready..." }
        ];

        stages.forEach((stage, index) => {
            setTimeout(() => {
                this.updateLoadingText(stage.text);
            }, stage.time);
        });
    }

    updateLoadingText(text) {
        const subtitle = document.querySelector('.loading-subtitle');
        if (subtitle) {
            subtitle.textContent = text;
        }
    }

    hideLoadingScreen() {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.minLoadingTime - elapsed);

        setTimeout(() => {
            this.loadingScreen.classList.add('fade-out');
            
            // Remove from DOM after animation
            setTimeout(() => {
                this.loadingScreen.remove();
                // Trigger tooltip after loading screen is gone (only on index page)
                const currentPath = window.location.pathname;
                const isIndexPage = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/');
                if (window.tooltipManager && isIndexPage) {
                    setTimeout(() => {
                        if (window.tooltipManager && !window.tooltipManager.hasShown) {
                            window.tooltipManager.showTooltip();
                        }
                    }, 500);
                }
            }, 500);
        }, remaining);
    }
}

// Initialize loading manager when DOM is ready
let loadingManager;

document.addEventListener('DOMContentLoaded', function() {
    loadingManager = new LoadingManager();
});