// tab-manager.js - Tab system for opening multiple games
class TabManager {
    constructor() {
        this.tabs = [];
        this.activeTabId = null;
        this.tabCounter = 0;
        // Mapping of wrapper pages to actual game files
        this.wrapperGameMap = {
            'games/cookieclicker.html': 'games/cookieclicker/Cookie Clicker (1).html',
            'games/balatro.html': 'https://smartsteps.eduarmor.com/balatro/index.html',
            'games/kindergarden1.html': 'games/kindergarden1/story.html',
            'games/kindergarden2.html': 'games/kindergarden2/story.html'
        };
        this.init();
    }

    init() {
        this.isFullscreen = false;
        this.createTabBar();
        // Listen for theme changes to update tab styling
        window.addEventListener('themeChanged', () => {
            this.updateTabTheme();
        });
        // Listen for fullscreen change events
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                this.isFullscreen = false;
                const fullscreenBtn = document.getElementById('fullscreen-btn');
                if (fullscreenBtn) {
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    fullscreenBtn.title = 'Fullscreen';
                }
            }
        });
        // Set initial theme
        setTimeout(() => this.updateTabTheme(), 100);
    }

    updateTabTheme() {
        // Update glow color for tabs
        const tabBar = document.getElementById('tab-bar');
        if (tabBar && window.themeManager) {
            const theme = window.themeManager.getCurrentTheme();
            const themes = window.themeManager.getThemes();
            const currentTheme = themes[theme];
            if (currentTheme) {
                const root = document.documentElement;
                const glowColor = currentTheme.colors['--glow-color'] || currentTheme.colors['--primary'] || '#8B5CF6';
                // Set glow color CSS variable
                root.style.setProperty('--glow-color', glowColor);
            }
        }
    }

    createTabBar() {
        // Check if tab bar already exists
        if (document.getElementById('tab-bar')) return;
        
        const tabBar = document.createElement('div');
        tabBar.id = 'tab-bar';
        tabBar.className = 'tab-bar';
        tabBar.style.display = 'none'; // Hidden by default
        tabBar.innerHTML = `
            <div class="tabs-container" id="tabs-container"></div>
            <div class="tab-toolbar">
                <button class="tab-toolbar-btn" id="reload-btn" title="Reload">
                    <i class="fas fa-redo"></i>
                </button>
                <button class="tab-toolbar-btn" id="home-btn" title="Home">
                    <i class="fas fa-home"></i>
                </button>
                <button class="tab-toolbar-btn" id="popout-btn" title="Pop Out">
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button class="tab-toolbar-btn" id="fullscreen-btn" title="Fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        `;
        document.body.insertBefore(tabBar, document.body.firstChild);
        
        // Add event listeners for toolbar buttons
        document.getElementById('reload-btn').addEventListener('click', () => {
            this.reloadCurrentTab();
        });
        document.getElementById('home-btn').addEventListener('click', () => {
            this.goHome();
        });
        document.getElementById('popout-btn').addEventListener('click', () => {
            this.popoutCurrentTab();
        });
        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    openNewTab(gameUrl = null, gameName = 'New Tab') {
        // Show tab bar if hidden
        const tabBar = document.getElementById('tab-bar');
        if (tabBar) {
            tabBar.style.display = 'flex';
            document.body.classList.add('has-tabs');
        }
        
        const tabId = `tab-${++this.tabCounter}`;
        const tab = {
            id: tabId,
            name: gameName,
            url: gameUrl,
            element: null,
            iframe: null,
            isActive: false
        };

        this.tabs.push(tab);
        this.createTabElement(tab);
        this.switchToTab(tabId);
        
        // If gameUrl is provided, load it
        if (gameUrl) {
            this.loadGameInTab(tabId, gameUrl);
        } else {
            // Show game selection interface
            this.showGameSelector(tabId);
        }

        return tabId;
    }

    createTabElement(tab) {
        const tabsContainer = document.getElementById('tabs-container');
        const tabElement = document.createElement('div');
        tabElement.className = 'tab-item';
        tabElement.dataset.tabId = tab.id;
        tabElement.innerHTML = `
            <span class="tab-name">${tab.name}</span>
            <button class="tab-close" onclick="tabManager.closeTab('${tab.id}')" aria-label="Close tab">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        tabElement.addEventListener('click', (e) => {
            if (!e.target.closest('.tab-close')) {
                this.switchToTab(tab.id);
            }
        });

        tabsContainer.appendChild(tabElement);
        tab.element = tabElement;
    }

    switchToTab(tabId) {
        // Deactivate all tabs
        this.tabs.forEach(t => {
            t.isActive = false;
            if (t.element) {
                t.element.classList.remove('active');
            }
            if (t.iframe) {
                t.iframe.style.display = 'none';
            }
        });

        // Activate selected tab
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            tab.isActive = true;
            this.activeTabId = tabId;
            if (tab.element) {
                tab.element.classList.add('active');
            }
            if (tab.iframe) {
                tab.iframe.style.display = 'block';
            } else {
                // Create iframe if it doesn't exist
                this.createTabContent(tab);
            }
        }
    }

    createTabContent(tab) {
        // Remove existing content area if any
        let contentArea = document.getElementById('tab-content-area');
        if (!contentArea) {
            contentArea = document.createElement('div');
            contentArea.id = 'tab-content-area';
            contentArea.className = 'tab-content-area';
            const mainContent = document.querySelector('.container, .games-container, .themes-container, .tools-container, .roadmap-container');
            if (mainContent) {
                mainContent.parentNode.insertBefore(contentArea, mainContent);
            } else {
                document.body.appendChild(contentArea);
            }
        }

        // Hide main content when tabs are active
        const mainContent = document.querySelector('.container, .games-container, .themes-container, .tools-container, .roadmap-container');
        if (mainContent && this.tabs.length > 0) {
            mainContent.style.display = 'none';
        }

        // Ensure content area is visible when adding tab content
        contentArea.style.display = 'block';

        // Create iframe for this tab
        const iframe = document.createElement('iframe');
        iframe.id = `iframe-${tab.id}`;
        iframe.className = 'tab-iframe';
        iframe.style.display = tab.isActive ? 'block' : 'none';
        iframe.setAttribute('allowfullscreen', 'true');
        
        if (tab.url) {
            // Resolve wrapper pages to actual game URLs
            const actualUrl = this.resolveGameUrl(tab.url);
            iframe.src = actualUrl;
        } else {
            // Show game selector
            iframe.src = 'games.html';
        }

        contentArea.appendChild(iframe);
        tab.iframe = iframe;
    }

    /**
     * Resolve wrapper pages to actual game URLs
     * @param {string} gameUrl - The game URL (may be a wrapper page)
     * @returns {string} - The actual game URL
     */
    resolveGameUrl(gameUrl) {
        if (!gameUrl) return gameUrl;
        
        // Normalize the URL (remove leading slash if present for comparison)
        const normalizedUrl = gameUrl.startsWith('/') ? gameUrl.substring(1) : gameUrl;
        
        // Check if this is a known wrapper page
        if (this.wrapperGameMap[normalizedUrl]) {
            const actualUrl = this.wrapperGameMap[normalizedUrl];
            // If it's an external URL (http/https), return as-is
            if (actualUrl.startsWith('http://') || actualUrl.startsWith('https://')) {
                return actualUrl;
            }
            // Use relative path for static hosting
            return actualUrl.replace(/^\//, '');
        }
        
        // For cookieclicker specifically, also check if it's in the games folder
        if (normalizedUrl.includes('cookieclicker.html') && !normalizedUrl.includes('Cookie Clicker')) {
            return 'games/cookieclicker/Cookie Clicker (1).html';
        }
        
        // Prefer relative paths for static hosting; pass through external URLs
        if (gameUrl.startsWith('http://') || gameUrl.startsWith('https://')) {
            return gameUrl;
        }
        // Strip leading slash to keep relative
        return gameUrl.replace(/^\//, '');
    }

    loadGameInTab(tabId, gameUrl) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab && tab.iframe) {
            // Resolve wrapper pages to actual game URLs
            const actualGameUrl = this.resolveGameUrl(gameUrl);
            tab.iframe.src = actualGameUrl;
            
            // Update tab name from URL (use original name if available, otherwise derive from URL)
            if (tab.name && tab.name !== 'New Tab') {
                // Keep the original name
            } else {
                const gameName = actualGameUrl.split('/').pop().replace('.html', '').replace(/-/g, ' ').replace(/\(1\)/g, '').trim();
                tab.name = gameName.charAt(0).toUpperCase() + gameName.slice(1);
                if (tab.element) {
                    tab.element.querySelector('.tab-name').textContent = tab.name;
                }
            }
        } else if (tab) {
            // If iframe doesn't exist yet, create it
            this.createTabContent(tab);
            // Then load the game
            setTimeout(() => this.loadGameInTab(tabId, gameUrl), 100);
        }
    }

    showGameSelector(tabId) {
        // Create a game selector overlay for this tab
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab) return;

        // For now, just load games.html in the iframe
        if (!tab.iframe) {
            this.createTabContent(tab);
        }
        tab.iframe.src = 'games.html';
    }

    closeTab(tabId) {
        const tabIndex = this.tabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;

        const tab = this.tabs[tabIndex];
        
        // Remove iframe
        if (tab.iframe) {
            tab.iframe.remove();
        }
        
        // Remove tab element
        if (tab.element) {
            tab.element.remove();
        }
        
        // Remove from array
        this.tabs.splice(tabIndex, 1);

        // If this was the active tab, switch to another
        if (this.activeTabId === tabId) {
            if (this.tabs.length > 0) {
                // Switch to the tab that was before this one, or the first tab
                const newActiveIndex = Math.max(0, tabIndex - 1);
                this.switchToTab(this.tabs[newActiveIndex].id);
            } else {
                // No tabs left, hide tab bar and show main content
                this.activeTabId = null;
                const tabBar = document.getElementById('tab-bar');
                if (tabBar) {
                    tabBar.style.display = 'none';
                }
                document.body.classList.remove('has-tabs');
                const contentArea = document.getElementById('tab-content-area');
                if (contentArea) {
                    contentArea.style.display = 'none';
                }
                const mainContent = document.querySelector('.container, .games-container, .themes-container, .tools-container, .roadmap-container');
                if (mainContent) {
                    mainContent.style.display = '';
                }
            }
        }
    }

    openGameInNewTab(gameUrl, gameName) {
        return this.openNewTab(gameUrl, gameName);
    }

    reloadCurrentTab() {
        const activeTab = this.tabs.find(t => t.id === this.activeTabId);
        if (activeTab && activeTab.iframe) {
            activeTab.iframe.src = activeTab.iframe.src;
            this.showNotification('Reloading...', 'info');
        }
    }

    goHome() {
        // Navigate to games library
        window.location.href = 'games.html';
    }

    popoutCurrentTab() {
        const activeTab = this.tabs.find(t => t.id === this.activeTabId);
        if (activeTab && activeTab.iframe) {
            const gameUrl = activeTab.iframe.src;
            window.open(gameUrl, '_blank');
        }
    }

    toggleFullscreen() {
        const contentArea = document.getElementById('tab-content-area');
        if (!contentArea) return;
        
        if (!this.isFullscreen) {
            // Enter fullscreen
            if (contentArea.requestFullscreen) {
                contentArea.requestFullscreen();
            } else if (contentArea.webkitRequestFullscreen) {
                contentArea.webkitRequestFullscreen();
            } else if (contentArea.msRequestFullscreen) {
                contentArea.msRequestFullscreen();
            }
            
            this.isFullscreen = true;
            const fullscreenBtn = document.getElementById('fullscreen-btn');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenBtn.title = 'Exit Fullscreen';
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            this.isFullscreen = false;
            const fullscreenBtn = document.getElementById('fullscreen-btn');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = 'Fullscreen';
            }
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.tab-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `tab-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 2 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize tab manager
const tabManager = new TabManager();
window.tabManager = tabManager;

// Override playGame to open in tab if on games page
const originalPlayGame = window.playGame;
if (typeof originalPlayGame === 'function') {
    window.playGame = function(gameFile, isEarlyAccess = false, gameId = null, gameName = null) {
        // Check if we're on games page and tab manager is available
        if (window.tabManager && window.location.pathname.includes('games.html')) {
            window.tabManager.openGameInNewTab(gameFile, gameName || 'Game');
            return;
        }
        // Otherwise use original function
        originalPlayGame(gameFile, isEarlyAccess, gameId, gameName);
    };
}

