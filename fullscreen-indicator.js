// fullscreen-indicator.js - Fullscreen mode indicator
class FullscreenIndicator {
    constructor() {
        this.indicator = null;
        this.init();
    }

    init() {
        this.createIndicator();
        this.setupListeners();
    }

    createIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'fullscreen-indicator';
        indicator.className = 'fullscreen-indicator';
        indicator.innerHTML = `
            <div class="fullscreen-content">
                <i class="fas fa-expand"></i>
                <span>Fullscreen Mode</span>
                <small>Press ESC to exit</small>
            </div>
        `;
        document.body.appendChild(indicator);
        this.indicator = indicator;
    }

    setupListeners() {
        document.addEventListener('fullscreenchange', () => {
            this.updateIndicator();
        });
        document.addEventListener('webkitfullscreenchange', () => {
            this.updateIndicator();
        });
        document.addEventListener('mozfullscreenchange', () => {
            this.updateIndicator();
        });
        document.addEventListener('MSFullscreenChange', () => {
            this.updateIndicator();
        });
    }

    updateIndicator() {
        const isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );

        if (this.indicator) {
            if (isFullscreen) {
                this.indicator.classList.add('active');
                setTimeout(() => {
                    this.indicator.classList.remove('active');
                }, 2000);
            }
        }
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FullscreenIndicator();
    });
} else {
    new FullscreenIndicator();
}

