// themes.js - Advanced Theme System
class ThemeManager {
    constructor() {
        this.themes = {
            'default': {
                name: 'Default Purple',
                description: 'The original /Purge theme',
                colors: {
                    '--primary': '#8B5CF6',
                    '--primary-dark': '#7C3AED',
                    '--primary-light': '#A78BFA',
                    '--black': '#0a0a0a',
                    '--dark': '#111113',
                    '--gray': '#1f1f23',
                    '--light-gray': '#2a2a30',
                    '--white': '#f8fafc',
                    '--text': '#cbd5e1'
                },
                premium: false
            },
            'dark-blue': {
                name: 'Deep Blue',
                description: 'Professional blue theme',
                colors: {
                    '--primary': '#3B82F6',
                    '--primary-dark': '#2563EB',
                    '--primary-light': '#60A5FA',
                    '--black': '#0f172a',
                    '--dark': '#1e293b',
                    '--gray': '#334155',
                    '--light-gray': '#475569',
                    '--white': '#f1f5f9',
                    '--text': '#cbd5e1'
                },
                premium: false
            },
            'green-terminal': {
                name: 'Green Terminal',
                description: 'Matrix-style green theme',
                colors: {
                    '--primary': '#10B981',
                    '--primary-dark': '#059669',
                    '--primary-light': '#34D399',
                    '--black': '#000000',
                    '--dark': '#0a0a0a',
                    '--gray': '#1a1a1a',
                    '--light-gray': '#2a2a2a',
                    '--white': '#00ff00',
                    '--text': '#00cc00'
                },
                premium: false
            },
            'sunset': {
                name: 'Sunset Orange',
                description: 'Warm orange and red theme',
                colors: {
                    '--primary': '#F59E0B',
                    '--primary-dark': '#D97706',
                    '--primary-light': '#FBBF24',
                    '--black': '#1c1917',
                    '--dark': '#292524',
                    '--gray': '#44403c',
                    '--light-gray': '#57534e',
                    '--white': '#fef3c7',
                    '--text': '#fde68a'
                },
                premium: false
            },
            'neon-pink': {
                name: 'Neon Pink',
                description: 'Vibrant pink cyber theme',
                colors: {
                    '--primary': '#EC4899',
                    '--primary-dark': '#DB2777',
                    '--primary-light': '#F472B6',
                    '--black': '#000000',
                    '--dark': '#1a001a',
                    '--gray': '#2a002a',
                    '--light-gray': '#3a003a',
                    '--white': '#ffffff',
                    '--text': '#f0f0f0'
                },
                premium: true
            },
            'midnight': {
                name: 'Midnight',
                description: 'Ultra dark theme for night owls',
                colors: {
                    '--primary': '#6366F1',
                    '--primary-dark': '#4F46E5',
                    '--primary-light': '#818CF8',
                    '--black': '#000000',
                    '--dark': '#050505',
                    '--gray': '#0a0a0a',
                    '--light-gray': '#1a1a1a',
                    '--white': '#e5e5e5',
                    '--text': '#a3a3a3'
                },
                premium: false
            },
            // Updated Christmas theme with better colors
'christmas': {
    name: 'Christmas',
    description: 'Festive holiday theme with snow',
    colors: {
        '--primary': '#16a34a', // Christmas green
        '--primary-dark': '#15803d',
        '--primary-light': '#22c55e', 
        '--black': '#0a0a0a',
        '--dark': '#14532d', // Dark green
        '--gray': '#1e3a2e',
        '--light-gray': '#2a4a38',
        '--white': '#f0fdf4', // Light mint
        '--text': '#bbf7d0' // Light green text
    },
    premium: false
}
        };
        
        this.currentTheme = 'default';
        this.customThemes = {};
        this.init();
    }

    init() {
        this.loadTheme();
        this.renderThemes();
        this.updateCurrentThemePreview();
        console.log('🎨 Theme manager initialized');
    }

    loadTheme() {
        try {
            const savedTheme = localStorage.getItem('purge_theme');
            const savedCustomThemes = localStorage.getItem('purge_custom_themes');
            
            if (savedTheme) {
                this.currentTheme = savedTheme;
                this.applyTheme(this.currentTheme);
            }
            
            if (savedCustomThemes) {
                this.customThemes = JSON.parse(savedCustomThemes);
            }
        } catch (e) {
            console.error('Error loading theme:', e);
        }
    }

    // In the applyTheme method, remove the premium check:
applyTheme(themeName) {
    let theme;
    
    if (this.themes[themeName]) {
        theme = this.themes[themeName];
    } else if (this.customThemes[themeName]) {
        theme = this.customThemes[themeName];
    } else {
        console.warn('Theme not found:', themeName);
        return;
    }

    // Apply CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });

    this.currentTheme = themeName;
    localStorage.setItem('purge_theme', themeName);
    
    this.updateCurrentThemePreview();
    this.updateActiveThemeCard();
    
    console.log('🎨 Applied theme:', themeName);
}

// Remove the hasPremiumAccess and showPremiumMessage methods entirely

    renderThemes() {
        const themesGrid = document.getElementById('themes-grid');
        if (!themesGrid) return;

        // Clear existing themes
        themesGrid.innerHTML = '';

        // Render built-in themes
        Object.entries(this.themes).forEach(([id, theme]) => {
            const themeCard = this.createThemeCard(id, theme);
            themesGrid.appendChild(themeCard);
        });

        // Render custom themes
        Object.entries(this.customThemes).forEach(([id, theme]) => {
            const themeCard = this.createThemeCard(id, theme, true);
            themesGrid.appendChild(themeCard);
        });
    }

    createThemeCard(id, theme, isCustom = false) {
        const card = document.createElement('div');
        card.className = `theme-card ${this.currentTheme === id ? 'active' : ''}`;
        
        // Create gradient background for preview
        const primaryColor = theme.colors['--primary'] || '#8B5CF6';
        const darkColor = theme.colors['--dark'] || '#111113';
        
        card.innerHTML = `
            <div class="theme-preview" style="background: linear-gradient(135deg, ${primaryColor}, ${darkColor})">
                ${theme.name}
            </div>
            <div class="theme-info">
                <h4>${theme.name}</h4>
                <p>${theme.description}</p>
                <div class="theme-actions">
                    <button class="theme-btn primary" onclick="themeManager.applyTheme('${id}')">
                        <i class="fas fa-palette"></i>
                        Apply
                    </button>
                    ${isCustom ? `
                    <button class="theme-btn secondary" onclick="themeManager.deleteCustomTheme('${id}')">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                    ` : ''}
                </div>
            </div>
            ${isCustom ? '<div class="theme-badge" style="background: #10B981;">Custom</div>' : ''}
        `;

        return card;
    }

    updateCurrentThemePreview() {
        const preview = document.getElementById('current-theme-preview');
        if (!preview) return;

        const currentTheme = this.themes[this.currentTheme] || this.customThemes[this.currentTheme];
        if (!currentTheme) return;

        const primaryColor = currentTheme.colors['--primary'] || '#8B5CF6';
        const darkColor = currentTheme.colors['--dark'] || '#111113';
        const textColor = currentTheme.colors['--text'] || '#cbd5e1';

        preview.style.setProperty('--primary', primaryColor);
        preview.style.setProperty('--dark', darkColor);
        preview.style.setProperty('--text', textColor);
        
        // Update preview header background
        const header = preview.querySelector('.preview-header');
        if (header) {
            header.style.background = primaryColor;
        }
        
        // Update preview title gradient
        const title = preview.querySelector('.preview-title');
        if (title) {
            const primaryLight = currentTheme.colors['--primary-light'] || '#A78BFA';
            title.style.background = `linear-gradient(135deg, ${primaryLight}, ${primaryColor})`;
            title.style.webkitBackgroundClip = 'text';
            title.style.webkitTextFillColor = 'transparent';
            title.style.backgroundClip = 'text';
        }
        
        // Update preview subtitle color
        const subtitle = preview.querySelector('.preview-subtitle');
        if (subtitle) {
            subtitle.style.color = textColor;
        }
        
        // Update preview cards background
        const cards = preview.querySelectorAll('.preview-card');
        cards.forEach(card => {
            card.style.background = currentTheme.colors['--light-gray'] || '#2a2a30';
        });
    }

    updateActiveThemeCard() {
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const activeCard = document.querySelector(`.theme-card:nth-child(${Object.keys(this.themes).indexOf(this.currentTheme) + 1})`);
        if (activeCard) {
            activeCard.classList.add('active');
        }
    }

    previewCustomTheme() {
        const primaryColor = document.getElementById('primary-color').value;
        const bgColor = document.getElementById('bg-color').value;
        const textColor = document.getElementById('text-color').value;
        const accentColor = document.getElementById('accent-color').value;

        // Create temporary theme object
        const tempTheme = {
            colors: {
                '--primary': primaryColor,
                '--primary-dark': this.darkenColor(primaryColor, 20),
                '--primary-light': this.lightenColor(primaryColor, 20),
                '--black': bgColor,
                '--dark': this.lightenColor(bgColor, 5),
                '--gray': this.lightenColor(bgColor, 10),
                '--light-gray': this.lightenColor(bgColor, 15),
                '--white': textColor,
                '--text': this.darkenColor(textColor, 20)
            }
        };

        // Apply preview
        Object.entries(tempTheme.colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });

        console.log('🎨 Custom theme preview applied');
    }

    saveCustomTheme() {
        const primaryColor = document.getElementById('primary-color').value;
        const bgColor = document.getElementById('bg-color').value;
        const textColor = document.getElementById('text-color').value;
        const accentColor = document.getElementById('accent-color').value;

        const themeName = prompt('Enter a name for your custom theme:');
        if (!themeName) return;

        const themeId = 'custom-' + Date.now();

        this.customThemes[themeId] = {
            name: themeName,
            description: 'Custom created theme',
            colors: {
                '--primary': primaryColor,
                '--primary-dark': this.darkenColor(primaryColor, 20),
                '--primary-light': this.lightenColor(primaryColor, 20),
                '--black': bgColor,
                '--dark': this.lightenColor(bgColor, 5),
                '--gray': this.lightenColor(bgColor, 10),
                '--light-gray': this.lightenColor(bgColor, 15),
                '--white': textColor,
                '--text': this.darkenColor(textColor, 20)
            },
            premium: false
        };

        // Save to localStorage
        localStorage.setItem('purge_custom_themes', JSON.stringify(this.customThemes));
        
        // Re-render themes
        this.renderThemes();
        
        // Apply the new theme
        this.applyTheme(themeId);
        
        alert('✅ Custom theme saved successfully!');
    }

    deleteCustomTheme(themeId) {
        if (confirm('Are you sure you want to delete this custom theme?')) {
            delete this.customThemes[themeId];
            localStorage.setItem('purge_custom_themes', JSON.stringify(this.customThemes));
            
            // If deleted theme was current, switch to default
            if (this.currentTheme === themeId) {
                this.applyTheme('default');
            }
            
            this.renderThemes();
        }
    }

    resetCustomTheme() {
        document.getElementById('primary-color').value = '#8B5CF6';
        document.getElementById('bg-color').value = '#0a0a0a';
        document.getElementById('text-color').value = '#f8fafc';
        document.getElementById('accent-color').value = '#7C3AED';
        
        // Re-apply current theme
        this.applyTheme(this.currentTheme);
    }

    // Utility functions for color manipulation
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
}

// Initialize theme manager
let themeManager;

document.addEventListener('DOMContentLoaded', function() {
    themeManager = new ThemeManager();
});

// Global functions for HTML onclick
function previewCustomTheme() {
    themeManager.previewCustomTheme();
}

function saveCustomTheme() {
    themeManager.saveCustomTheme();
}

function resetCustomTheme() {
    themeManager.resetCustomTheme();
}

// Navigate back to home
function goHome() {
    window.location.href = 'index.html';
}