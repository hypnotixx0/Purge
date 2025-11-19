// theme-manager.js - Global Theme System
class ThemeManager {
    constructor() {
        this.THEME_KEY = 'purge_theme';
        this.CUSTOM_THEMES_KEY = 'purge_custom_themes';
        this.themes = {
            'dark': {
                name: 'Dark',
                colors: {
                    '--primary': '#8B5CF6',
                    '--primary-dark': '#7C3AED',
                    '--primary-light': '#A78BFA',
                    '--black': '#0a0a0a',
                    '--dark': '#111113',
                    '--gray': '#1f1f23',
                    '--light-gray': '#2a2a30',
                    '--white': '#f8fafc',
                    '--text': '#cbd5e1',
                    '--glow-color': 'rgba(139, 92, 246, 0.4)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'christmas': {
                name: 'Seasonal',
                colors: {
                    '--primary': '#dc2626',
                    '--primary-dark': '#b91c1c',
                    '--primary-light': '#ef4444',
                    '--black': '#0a0a0a',
                    '--dark': '#1a0f0f',
                    '--gray': '#2a1a1a',
                    '--light-gray': '#3a2a2a',
                    '--white': '#fef2f2',
                    '--text': '#fecaca',
                    '--glow-color': 'rgba(220, 38, 38, 0.4)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'ocean': {
                name: 'Ocean',
                colors: {
                    '--primary': '#06b6d4',
                    '--primary-dark': '#0891b2',
                    '--primary-light': '#22d3ee',
                    '--black': '#0a0a0a',
                    '--dark': '#0e1e2e',
                    '--gray': '#1a2e3e',
                    '--light-gray': '#2a3e4e',
                    '--white': '#f0f9ff',
                    '--text': '#bae6fd',
                    '--glow-color': 'rgba(6, 182, 212, 0.4)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'sunset': {
                name: 'Sunset',
                colors: {
                    '--primary': '#f97316',
                    '--primary-dark': '#ea580c',
                    '--primary-light': '#fb923c',
                    '--black': '#0a0a0a',
                    '--dark': '#2e1a0e',
                    '--gray': '#3e2a1a',
                    '--light-gray': '#4e3a2a',
                    '--white': '#fff7ed',
                    '--text': '#fed7aa',
                    '--glow-color': 'rgba(249, 115, 22, 0.4)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'neon': {
                name: 'Neon',
                colors: {
                    '--primary': '#ec4899',
                    '--primary-dark': '#db2777',
                    '--primary-light': '#f472b6',
                    '--black': '#0a0a0a',
                    '--dark': '#1e0e1e',
                    '--gray': '#2e1a2e',
                    '--light-gray': '#3e2a3e',
                    '--white': '#fdf2f8',
                    '--text': '#fce7f3',
                    '--glow-color': 'rgba(236, 72, 153, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'forest': {
                name: 'Forest',
                colors: {
                    '--primary': '#10b981',
                    '--primary-dark': '#059669',
                    '--primary-light': '#34d399',
                    '--black': '#0a0a0a',
                    '--dark': '#0e1e0e',
                    '--gray': '#1a2e1a',
                    '--light-gray': '#2a3e2a',
                    '--white': '#f0fdf4',
                    '--text': '#bbf7d0',
                    '--glow-color': 'rgba(16, 185, 129, 0.4)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'midnight': {
                name: 'Midnight',
                colors: {
                    '--primary': '#6366f1',
                    '--primary-dark': '#4f46e5',
                    '--primary-light': '#818cf8',
                    '--black': '#0a0a0a',
                    '--dark': '#0e0e1e',
                    '--gray': '#1a1a2e',
                    '--light-gray': '#2a2a3e',
                    '--white': '#f5f3ff',
                    '--text': '#ddd6fe',
                    '--glow-color': 'rgba(99, 102, 241, 0.4)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'fire': {
                name: 'Fire',
                colors: {
                    '--primary': '#ef4444',
                    '--primary-dark': '#dc2626',
                    '--primary-light': '#f87171',
                    '--black': '#0a0a0a',
                    '--dark': '#1e0e0e',
                    '--gray': '#2e1a1a',
                    '--light-gray': '#3e2a2a',
                    '--white': '#fef2f2',
                    '--text': '#fecaca',
                    '--glow-color': 'rgba(239, 68, 68, 0.4)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'cyberpunk': {
                name: 'Cyberpunk',
                colors: {
                    '--primary': '#00ff41',
                    '--primary-dark': '#00cc33',
                    '--primary-light': '#33ff66',
                    '--black': '#0a0a0a',
                    '--dark': '#0a1a0a',
                    '--gray': '#1a2a1a',
                    '--light-gray': '#2a3a2a',
                    '--white': '#f0fff0',
                    '--text': '#ccffcc',
                    '--glow-color': 'rgba(0, 255, 65, 0.6)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'aurora': {
                name: 'Aurora',
                colors: {
                    '--primary': '#00d4ff',
                    '--primary-dark': '#00a8cc',
                    '--primary-light': '#33e0ff',
                    '--black': '#0a0a0a',
                    '--dark': '#0a0e1a',
                    '--gray': '#1a1e2a',
                    '--light-gray': '#2a2e3a',
                    '--white': '#f0f9ff',
                    '--text': '#ccf0ff',
                    '--glow-color': 'rgba(0, 212, 255, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'lavender': {
                name: 'Lavender',
                colors: {
                    '--primary': '#a855f7',
                    '--primary-dark': '#9333ea',
                    '--primary-light': '#c084fc',
                    '--black': '#0a0a0a',
                    '--dark': '#1a0e1a',
                    '--gray': '#2a1e2a',
                    '--light-gray': '#3a2e3a',
                    '--white': '#faf5ff',
                    '--text': '#e9d5ff',
                    '--glow-color': 'rgba(168, 85, 247, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'matrix': {
                name: 'Matrix',
                colors: {
                    '--primary': '#00ff00',
                    '--primary-dark': '#00cc00',
                    '--primary-light': '#33ff33',
                    '--black': '#000000',
                    '--dark': '#001100',
                    '--gray': '#002200',
                    '--light-gray': '#003300',
                    '--white': '#00ff00',
                    '--text': '#00cc00',
                    '--glow-color': 'rgba(0, 255, 0, 0.7)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'rose': {
                name: 'Rose',
                colors: {
                    '--primary': '#f43f5e',
                    '--primary-dark': '#e11d48',
                    '--primary-light': '#fb7185',
                    '--black': '#0a0a0a',
                    '--dark': '#1a0a0e',
                    '--gray': '#2a1a1e',
                    '--light-gray': '#3a2a2e',
                    '--white': '#fff1f2',
                    '--text': '#ffe4e6',
                    '--glow-color': 'rgba(244, 63, 94, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'emerald': {
                name: 'Emerald',
                colors: {
                    '--primary': '#10b981',
                    '--primary-dark': '#059669',
                    '--primary-light': '#34d399',
                    '--black': '#0a0a0a',
                    '--dark': '#0a1a0e',
                    '--gray': '#1a2a1e',
                    '--light-gray': '#2a3a2e',
                    '--white': '#f0fdf4',
                    '--text': '#d1fae5',
                    '--glow-color': 'rgba(16, 185, 129, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'amethyst': {
                name: 'Amethyst',
                colors: {
                    '--primary': '#8b5cf6',
                    '--primary-dark': '#7c3aed',
                    '--primary-light': '#a78bfa',
                    '--black': '#0a0a0a',
                    '--dark': '#0e0a1a',
                    '--gray': '#1e1a2a',
                    '--light-gray': '#2e2a3a',
                    '--white': '#faf5ff',
                    '--text': '#e9d5ff',
                    '--glow-color': 'rgba(139, 92, 246, 0.6)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'sakura': {
                name: 'Sakura',
                colors: {
                    '--primary': '#f472b6',
                    '--primary-dark': '#ec4899',
                    '--primary-light': '#f9a8d4',
                    '--black': '#0a0a0a',
                    '--dark': '#1a0a14',
                    '--gray': '#2a1a24',
                    '--light-gray': '#3a2a34',
                    '--white': '#fdf2f8',
                    '--text': '#fce7f3',
                    '--glow-color': 'rgba(244, 114, 182, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'galaxy': {
                name: 'Galaxy',
                colors: {
                    '--primary': '#6366f1',
                    '--primary-dark': '#4f46e5',
                    '--primary-light': '#818cf8',
                    '--black': '#000000',
                    '--dark': '#0a0a1a',
                    '--gray': '#1a1a2a',
                    '--light-gray': '#2a2a3a',
                    '--white': '#f5f3ff',
                    '--text': '#ddd6fe',
                    '--glow-color': 'rgba(99, 102, 241, 0.6)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'coral': {
                name: 'Coral',
                colors: {
                    '--primary': '#ff6b6b',
                    '--primary-dark': '#ee5a6f',
                    '--primary-light': '#ff8787',
                    '--black': '#0a0a0a',
                    '--dark': '#1a0e0e',
                    '--gray': '#2a1e1e',
                    '--light-gray': '#3a2e2e',
                    '--white': '#fff5f5',
                    '--text': '#ffe0e0',
                    '--glow-color': 'rgba(255, 107, 107, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'mint': {
                name: 'Mint',
                colors: {
                    '--primary': '#14b8a6',
                    '--primary-dark': '#0d9488',
                    '--primary-light': '#5eead4',
                    '--black': '#0a0a0a',
                    '--dark': '#0a1a18',
                    '--gray': '#1a2a28',
                    '--light-gray': '#2a3a38',
                    '--white': '#f0fdfa',
                    '--text': '#ccfbf1',
                    '--glow-color': 'rgba(20, 184, 166, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'amber': {
                name: 'Amber',
                colors: {
                    '--primary': '#f59e0b',
                    '--primary-dark': '#d97706',
                    '--primary-light': '#fbbf24',
                    '--black': '#0a0a0a',
                    '--dark': '#1a140a',
                    '--gray': '#2a241a',
                    '--light-gray': '#3a342a',
                    '--white': '#fffbeb',
                    '--text': '#fef3c7',
                    '--glow-color': 'rgba(245, 158, 11, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'violet': {
                name: 'Violet',
                colors: {
                    '--primary': '#7c3aed',
                    '--primary-dark': '#6d28d9',
                    '--primary-light': '#8b5cf6',
                    '--black': '#0a0a0a',
                    '--dark': '#0e0a1a',
                    '--gray': '#1e1a2a',
                    '--light-gray': '#2e2a3a',
                    '--white': '#faf5ff',
                    '--text': '#e9d5ff',
                    '--glow-color': 'rgba(124, 58, 237, 0.6)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'slate': {
                name: 'Slate',
                colors: {
                    '--primary': '#64748b',
                    '--primary-dark': '#475569',
                    '--primary-light': '#94a3b8',
                    '--black': '#0a0a0a',
                    '--dark': '#0f172a',
                    '--gray': '#1e293b',
                    '--light-gray': '#334155',
                    '--white': '#f8fafc',
                    '--text': '#cbd5e1',
                    '--glow-color': 'rgba(100, 116, 139, 0.4)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'sunrise': {
                name: 'Sunrise',
                colors: {
                    '--primary': '#f97316',
                    '--primary-dark': '#ea580c',
                    '--primary-light': '#fb923c',
                    '--black': '#0a0a0a',
                    '--dark': '#1a0e0a',
                    '--gray': '#2a1e1a',
                    '--light-gray': '#3a2e2a',
                    '--white': '#fff7ed',
                    '--text': '#fed7aa',
                    '--glow-color': 'rgba(249, 115, 22, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'twilight': {
                name: 'Twilight',
                colors: {
                    '--primary': '#8b5cf6',
                    '--primary-dark': '#7c3aed',
                    '--primary-light': '#a78bfa',
                    '--black': '#000000',
                    '--dark': '#0a0a1a',
                    '--gray': '#1a1a2a',
                    '--light-gray': '#2a2a3a',
                    '--white': '#f5f3ff',
                    '--text': '#ddd6fe',
                    '--glow-color': 'rgba(139, 92, 246, 0.7)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'lime': {
                name: 'Lime',
                colors: {
                    '--primary': '#84cc16',
                    '--primary-dark': '#65a30d',
                    '--primary-light': '#a3e635',
                    '--black': '#0a0a0a',
                    '--dark': '#0e1a0a',
                    '--gray': '#1e2a1a',
                    '--light-gray': '#2e3a2a',
                    '--white': '#f7fee7',
                    '--text': '#ecfccb',
                    '--glow-color': 'rgba(132, 204, 22, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'peach': {
                name: 'Peach',
                colors: {
                    '--primary': '#fb923c',
                    '--primary-dark': '#f97316',
                    '--primary-light': '#fdba74',
                    '--black': '#0a0a0a',
                    '--dark': '#1a0e0a',
                    '--gray': '#2a1e1a',
                    '--light-gray': '#3a2e2a',
                    '--white': '#fff7ed',
                    '--text': '#fed7aa',
                    '--glow-color': 'rgba(251, 146, 60, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            },
            'storm': {
                name: 'Storm',
                colors: {
                    '--primary': '#475569',
                    '--primary-dark': '#334155',
                    '--primary-light': '#64748b',
                    '--black': '#000000',
                    '--dark': '#0f172a',
                    '--gray': '#1e293b',
                    '--light-gray': '#334155',
                    '--white': '#f1f5f9',
                    '--text': '#cbd5e1',
                    '--glow-color': 'rgba(71, 85, 105, 0.5)'
                },
                favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
                backgroundImage: null,
                backgroundType: 'gradient'
            }
        };
        
        // Load custom themes
        this.loadCustomThemes();
        this.currentTheme = 'dark';
        this.glowUpdateTimer = null;
        this.init();
    }

    init() {
        try {
            this.loadTheme();
            this.applyCurrentTheme();
        } catch (e) {
            console.error('Theme init error:', e);
        }
    }

    loadTheme() {
        const saved = localStorage.getItem(this.THEME_KEY);
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        }
    }

    applyCurrentTheme() {
        const theme = this.themes[this.currentTheme];
        if (!theme) return;
        
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        
        // Apply theme background
        this.applyThemeBackground(theme);
        
        // Apply theme to browser tab (favicon and title)
        this.applyTabTheme(theme);
        
        this.handleChristmasTheme(this.currentTheme);
        
        // Debounce glow updates
        clearTimeout(this.glowUpdateTimer);
        this.glowUpdateTimer = setTimeout(() => this.updateGlowEffects(), 150);
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: this.currentTheme }));
    }
    
    applyThemeBackground(theme) {
        // Update background element with theme colors
        const background = document.querySelector('.background');
        if (background) {
            const primary = theme.colors['--primary'];
            const dark = theme.colors['--dark'];
            const primaryLight = theme.colors['--primary-light'];
            const backgroundImage = theme.backgroundImage;
            const backgroundType = theme.backgroundType || 'gradient';
            
            // Handle background image
            if (backgroundImage && backgroundType === 'image') {
                background.style.backgroundImage = `url(${backgroundImage})`;
                background.style.backgroundSize = 'cover';
                background.style.backgroundPosition = 'center';
                background.style.backgroundRepeat = 'no-repeat';
                // Add overlay for readability
                background.style.background = `
                    linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
                    url(${backgroundImage})
                `;
                background.style.backgroundSize = 'cover';
                background.style.backgroundPosition = 'center';
            } else if (backgroundImage && backgroundType === 'image-overlay') {
                // Image with gradient overlay
                background.style.background = `
                    radial-gradient(circle at 20% 80%, ${primary}25 0%, transparent 60%),
                    radial-gradient(circle at 80% 20%, ${primaryLight}15 0%, transparent 60%),
                    linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
                    url(${backgroundImage})
                `;
                background.style.backgroundSize = 'cover';
                background.style.backgroundPosition = 'center';
            } else {
                // Gradient background
                // Special handling for Christmas theme - more contrast
                if (this.currentTheme === 'christmas') {
                    background.style.background = `
                        radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.25) 0%, transparent 60%),
                        radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 60%),
                        radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 70%),
                        linear-gradient(135deg, #1a0f0f 0%, #0f0a0a 50%, #1a0f0f 100%)
                    `;
                } else {
                    // Create gradient background based on theme
                    background.style.background = `
                        radial-gradient(circle at 20% 80%, ${primary}15 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, ${primaryLight}08 0%, transparent 50%),
                        ${dark}
                    `;
                }
                background.style.backgroundSize = '';
                background.style.backgroundPosition = '';
            }
        }
        
        // Also update body background if needed
        document.body.style.background = theme.colors['--black'];
    }
    
    applyTabTheme(theme) {
        // Check if tab cloaking is active - if so, don't modify title/favicon
        if (window.tabCloaking && window.tabCloaking.isCloaked()) {
            // Only apply favicon if it's a kindergarden game (special case)
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const isKindergarden = currentPage.includes('kindergarden');
            if (isKindergarden) {
                this.createEmojiFavicon('🍎');
            }
            return; // Don't modify title/favicon if cloaking is active
        }
        
        // Create apple emoji favicon for kindergarden games
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isKindergarden = currentPage.includes('kindergarden');
        
        if (isKindergarden) {
            // Create apple emoji favicon using data URI
            this.createEmojiFavicon('🍎');
        } else if (theme.favicon) {
            // Use regular favicon for other pages
            const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
            existingFavicons.forEach(link => {
                if (link.href.includes('e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico') || link.href.includes('assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico')) {
                    link.href = theme.favicon;
                }
            });
            
            // Ensure favicon exists
            let favicon = document.querySelector('link[rel="icon"]');
            if (!favicon) {
                favicon = document.createElement('link');
                favicon.rel = 'icon';
                document.head.appendChild(favicon);
            }
            favicon.href = theme.favicon;
        }
        
        // Update title with theme indicator for games page
        if (currentPage === 'games.html' || currentPage.includes('game') || currentPage.includes('kindergarden')) {
            const baseTitle = document.title.split(' - ')[0] || 'Games';
            if (isKindergarden) {
                document.title = `🍎 ${baseTitle} - ${theme.name} Theme - /Purge`;
            } else {
                document.title = `${baseTitle} - ${theme.name} Theme`;
            }
        }
    }
    
    createEmojiFavicon(emoji) {
        // Remove existing emoji favicons
        const existingEmojiFavicons = document.querySelectorAll('link[rel="icon"][data-emoji]');
        existingEmojiFavicons.forEach(link => link.remove());
        
        // Create canvas for emoji favicon
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Draw emoji on canvas
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 16, 16);
        
        // Convert to data URI and set as favicon
        const dataURI = canvas.toDataURL('image/png');
        
        let favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.href = dataURI;
        favicon.setAttribute('data-emoji', 'true');
    }

    updateGlowEffects() {
        const glowColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--glow-color').trim();
        
        // Enhanced glow effects with multiple layers
        const glowStyle = `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 10px 30px ${glowColor}`;
        
        // Batch update selectors to reduce reflows
        const selectors = ['.category-box', '.game-card', '.tool-card', '.btn-primary', '.discord-btn'];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Only apply on hover or for specific elements
                if (selector === '.btn-primary' || selector === '.discord-btn') {
                    el.style.boxShadow = glowStyle;
                } else {
                    // Store original for hover effects
                    if (!el.dataset.originalGlow) {
                        el.dataset.originalGlow = glowColor;
                    }
                }
            });
        });
        
        // Update CSS custom property for hover effects
        document.documentElement.style.setProperty('--hover-glow', glowStyle);
    }

    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn('Theme not found:', themeName);
            return false;
        }
        this.currentTheme = themeName;
        try {
            localStorage.setItem(this.THEME_KEY, themeName);
        } catch (e) {
            console.error('Error saving theme:', e);
        }
        this.applyCurrentTheme();
        return true;
    }

    handleChristmasTheme(themeName) {
        if (themeName === 'christmas') {
            // Destroy existing snow first
            if (typeof destroySnow === 'function') {
                destroySnow();
            }
            // Initialize snow after a short delay to ensure DOM is ready
            setTimeout(() => {
                if (typeof initSnow === 'function') {
                    console.log('🎄 Initializing snow for Christmas theme');
                    initSnow();
                } else {
                    console.warn('initSnow function not available - make sure snow.js is loaded');
                    // Try to load it if not available
                    if (!window.snowEffect) {
                        const script = document.createElement('script');
                        script.src = 'snow.js';
                        script.onload = () => {
                            setTimeout(() => initSnow(), 100);
                        };
                        document.head.appendChild(script);
                    }
                }
            }, 500);
        } else {
            // Destroy snow for non-Christmas themes
            if (typeof destroySnow === 'function') {
                destroySnow();
            }
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemes() {
        return this.themes;
    }

    // Custom theme methods
    loadCustomThemes() {
        try {
            const saved = localStorage.getItem(this.CUSTOM_THEMES_KEY);
            if (saved) {
                const customThemes = JSON.parse(saved);
                Object.assign(this.themes, customThemes);
            }
        } catch (e) {
            window.debug?.error('Error loading custom themes:', e);
        }
    }

    saveCustomThemes() {
        try {
            const customThemes = {};
            Object.keys(this.themes).forEach(key => {
                if (key.startsWith('custom_')) {
                    customThemes[key] = this.themes[key];
                }
            });
            localStorage.setItem(this.CUSTOM_THEMES_KEY, JSON.stringify(customThemes));
        } catch (e) {
            window.debug?.error('Error saving custom themes:', e);
        }
    }

    createCustomTheme(name, colors, backgroundImage = null, backgroundType = 'gradient') {
        const themeId = 'custom_' + Date.now();
        const customTheme = {
            name: name,
            colors: colors,
            favicon: 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico',
            backgroundImage: backgroundImage,
            backgroundType: backgroundType
        };
        this.themes[themeId] = customTheme;
        this.saveCustomThemes();
        return themeId;
    }

    deleteCustomTheme(themeId) {
        if (themeId.startsWith('custom_') && this.themes[themeId]) {
            delete this.themes[themeId];
            this.saveCustomThemes();
            if (this.currentTheme === themeId) {
                this.setTheme('dark');
            }
            return true;
        }
        return false;
    }
}

// Initialize theme manager on every page
const themeManager = new ThemeManager();
window.themeManager = themeManager;

// Apply theme when page loads
document.addEventListener('DOMContentLoaded', () => {
    themeManager.applyCurrentTheme();
});