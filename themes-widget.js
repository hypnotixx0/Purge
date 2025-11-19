// themes-widget.js - Creative themes widget for homepage
class ThemesWidget {
    constructor() {
        this.currentThemeIndex = 0;
        this.themes = [];
        this.init();
    }

    init() {
        // Get themes from theme manager
        if (window.themeManager) {
            this.themes = Object.entries(window.themeManager.getThemes())
                .filter(([key]) => !key.startsWith('custom_'));
            // Show all themes
        }
        
        // Wait a bit longer to ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.createWidget(), 100);
            });
        } else {
            setTimeout(() => this.createWidget(), 100);
        }
        this.startRotation();
    }

    createWidget() {
        const container = document.getElementById('canvas-container');
        if (!container) {
            console.warn('canvas-container not found');
            return;
        }

        // Clear any existing styles and content
        container.innerHTML = '';
        container.className = 'themes-widget-container';
        container.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; width: 100%; z-index: 1000;';
        
        // Add class to body for padding
        document.body.classList.add('has-themes-bar');
        
        container.innerHTML = `
            <div class="themes-widget" onclick="goToThemes()">
                <div class="themes-widget-header">
                    <i class="fas fa-palette"></i>
                    <span class="themes-label">Themes</span>
                </div>
                <div class="themes-preview-scroll" id="themes-preview-scroll" onclick="event.stopPropagation();">
                    <div class="themes-preview-container" id="themes-preview">
                        ${this.createThemePreviews()}
                    </div>
                </div>
                <div class="themes-widget-actions" onclick="event.stopPropagation();">
                    <button class="themes-nav-btn prev" onclick="themesWidget.prevTheme()" aria-label="Previous theme">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="themes-dots" id="themes-dots"></div>
                    <button class="themes-nav-btn next" onclick="themesWidget.nextTheme()" aria-label="Next theme">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;

        this.updateDots();
        this.updatePreview();
    }

    createThemePreviews() {
        // Show all themes in the preview
        return this.themes.map(([key, theme], index) => {
            const glowColor = theme.colors['--glow-color'] || theme.colors['--primary'] || 'rgba(139, 92, 246, 0.6)';
            return `
            <div class="theme-preview-item ${index === 0 ? 'active' : ''}" 
                 data-theme-key="${key}" 
                 data-index="${index}"
                 onclick="event.stopPropagation(); themesWidget.selectTheme('${key}')"
                 title="Click to apply ${theme.name} theme"
                 style="--glow-color: ${glowColor}">
                <div class="theme-preview-gradient" style="background: linear-gradient(135deg, ${theme.colors['--primary']}, ${theme.colors['--dark']})">
                    <div class="theme-preview-name">${theme.name}</div>
                    <div class="theme-preview-glow" style="background: ${glowColor}; box-shadow: 0 0 30px ${glowColor}"></div>
                </div>
            </div>
        `;
        }).join('');
    }

    updateDots() {
        const dotsContainer = document.getElementById('themes-dots');
        if (!dotsContainer) return;

        // Show dots for visible themes (limit to 10 for UI)
        const visibleThemes = Math.min(this.themes.length, 10);
        dotsContainer.innerHTML = Array.from({ length: visibleThemes }, (_, index) => `
            <span class="theme-dot ${index === this.currentThemeIndex ? 'active' : ''}" 
                  onclick="event.stopPropagation(); themesWidget.goToTheme(${index})"></span>
        `).join('');
    }

    updatePreview() {
        const previews = document.querySelectorAll('.theme-preview-item');
        const container = document.getElementById('themes-preview');
        
        previews.forEach((preview, index) => {
            if (index === this.currentThemeIndex) {
                preview.classList.add('active');
            } else {
                preview.classList.remove('active');
            }
        });
        
        // Scroll to active theme
        if (container && previews[this.currentThemeIndex]) {
            const activePreview = previews[this.currentThemeIndex];
            const scrollContainer = document.getElementById('themes-preview-scroll');
            if (scrollContainer) {
                const scrollLeft = activePreview.offsetLeft - (scrollContainer.offsetWidth / 2) + (activePreview.offsetWidth / 2);
                scrollContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
        
        this.updateDots();
    }

    nextTheme() {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
        this.updatePreview();
        this.resetRotation();
    }

    prevTheme() {
        this.currentThemeIndex = (this.currentThemeIndex - 1 + this.themes.length) % this.themes.length;
        this.updatePreview();
        this.resetRotation();
    }

    goToTheme(index) {
        this.currentThemeIndex = index;
        this.updatePreview();
        this.resetRotation();
    }

    selectTheme(themeKey) {
        if (window.themeManager) {
            window.themeManager.setTheme(themeKey);
            if (window.Utils) {
                window.Utils.showSuccess(`Theme changed to ${window.themeManager.getThemes()[themeKey].name}!`);
            }
            // Reload after a short delay to show the change
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    }

    startRotation() {
        this.rotationInterval = setInterval(() => {
            this.nextTheme();
        }, 4000); // Rotate every 4 seconds
    }

    resetRotation() {
        clearInterval(this.rotationInterval);
        this.startRotation();
    }
}

// Function to navigate to themes page
function goToThemes() {
    window.location.href = 'themes.html';
}

// Initialize themes widget
let themesWidget;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for theme manager to load
    const initWidget = () => {
        if (window.themeManager) {
            themesWidget = new ThemesWidget();
            window.themesWidget = themesWidget;
        } else {
            // Retry if theme manager not loaded yet
            setTimeout(initWidget, 100);
        }
    };
    setTimeout(initWidget, 300);
});

