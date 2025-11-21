// Game Browser Functionality
class GameBrowser {
    constructor() {
        this.gameFrame = document.getElementById('game-frame');
        this.currentUrl = document.getElementById('current-url');
        this.isFullscreen = false;
        this.history = [];
        this.currentHistoryIndex = -1;
        
        this.init();
    }

    init() {
        console.log('🎮 Game browser initialized');
        
        // Set initial URL based on current page
        let initialUrl = 'game.html';
        if (window.location.pathname.includes('balatro')) {
            initialUrl = 'balatro-game.html';
        } else if (window.location.pathname.includes('cookieclicker')) {
            initialUrl = 'cookie-clicker.html';
        } else if (window.location.pathname.includes('kindergarden1')) {
            initialUrl = 'kindergarden-1.html';
        } else if (window.location.pathname.includes('kindergarden2')) {
            initialUrl = 'kindergarden-2.html';
        }
        
        // Add initial URL to history
        this.addToHistory(initialUrl);
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup game frame event listeners
        this.setupGameFrameListeners();
    }

    setupGameFrameListeners() {
        if (this.gameFrame) {
            this.gameFrame.addEventListener('load', () => {
                console.log('✅ Game loaded successfully');
                this.showNotification('Game loaded!', 'success');
            });

            this.gameFrame.addEventListener('error', () => {
                console.error('❌ Failed to load game');
                this.showNotification('Failed to load game', 'error');
            });
        }
    }

    addToHistory(url) {
        // Remove any future history if we're not at the end
        this.history = this.history.slice(0, this.currentHistoryIndex + 1);
        
        // Add new URL to history
        this.history.push(url);
        this.currentHistoryIndex = this.history.length - 1;
        
        this.updateAddressBar(url);
        this.updateNavigationButtons();
    }

    updateAddressBar(url) {
        if (this.currentUrl) {
            this.currentUrl.textContent = url;
        }
    }

    updateNavigationButtons() {
        const backBtn = document.querySelector('.toolbar-btn:nth-child(1)');
        const forwardBtn = document.querySelector('.toolbar-btn:nth-child(2)');
        
        if (backBtn) {
            backBtn.disabled = this.currentHistoryIndex <= 0;
        }
        if (forwardBtn) {
            forwardBtn.disabled = this.currentHistoryIndex >= this.history.length - 1;
        }
    }

    goBack() {
        if (this.currentHistoryIndex > 0) {
            this.currentHistoryIndex--;
            const url = this.history[this.currentHistoryIndex];
            if (this.gameFrame) {
                this.gameFrame.src = this.gameFrame.src; // Refresh current page for demo
            }
            this.updateAddressBar(url);
            this.updateNavigationButtons();
        }
    }

    goForward() {
        if (this.currentHistoryIndex < this.history.length - 1) {
            this.currentHistoryIndex++;
            const url = this.history[this.currentHistoryIndex];
            if (this.gameFrame) {
                this.gameFrame.src = this.gameFrame.src; // Refresh current page for demo
            }
            this.updateAddressBar(url);
            this.updateNavigationButtons();
        }
    }

    refreshGame() {
        if (this.gameFrame) {
            this.gameFrame.src = this.gameFrame.src;
            this.showNotification('Refreshing game...', 'info');
        }
    }

    goHome() {
        // Navigate to games library
        window.location.href = '../games.html';
    }

    getHomeUrl() {
        return '../games.html';
    }

    closeGame() {
        // Close this tab and go back to games library
        window.location.href = '../games.html';
    }

    openInNewTab() {
        // Open current game in a new tab without browser interface
        const gameUrl = this.gameFrame ? this.gameFrame.src : window.location.href;
        window.open(gameUrl, '_blank');
    }

    toggleFullscreen() {
        const browserContainer = document.querySelector('.browser-container');
        
        if (!this.isFullscreen) {
            // Enter fullscreen
            if (browserContainer.requestFullscreen) {
                browserContainer.requestFullscreen();
            } else if (browserContainer.webkitRequestFullscreen) {
                browserContainer.webkitRequestFullscreen();
            } else if (browserContainer.msRequestFullscreen) {
                browserContainer.msRequestFullscreen();
            }
            
            browserContainer.classList.add('fullscreen');
            this.isFullscreen = true;
            
            // Update button icon
            const fullscreenBtn = document.querySelector('.toolbar-btn:nth-last-child(1)');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
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
            
            browserContainer.classList.remove('fullscreen');
            this.isFullscreen = false;
            
            // Update button icon
            const fullscreenBtn = document.querySelector('.toolbar-btn:nth-last-child(1)');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.browser-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `browser-notification ${type}`;
        notification.textContent = message;
        
        // Add styles if not already added
        if (!document.querySelector('#browser-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'browser-notification-styles';
            styles.textContent = `
                .browser-notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--dark);
                    border: 1px solid var(--light-gray);
                    border-radius: 8px;
                    padding: 1rem 1.5rem;
                    color: var(--white);
                    font-weight: 600;
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 300px;
                }
                .browser-notification.show {
                    transform: translateX(0);
                }
                .browser-notification.success {
                    border-color: #22c55e;
                    background: rgba(34, 197, 94, 0.1);
                }
                .browser-notification.error {
                    border-color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                }
                .browser-notification.info {
                    border-color: #3b82f6;
                    background: rgba(59, 130, 246, 0.1);
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + R to refresh
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.refreshGame();
            }
            
            // F5 to refresh
            if (e.key === 'F5') {
                e.preventDefault();
                this.refreshGame();
            }
            
            // Alt + Left Arrow to go back
            if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                this.goBack();
            }
            
            // Alt + Right Arrow to go forward
            if (e.altKey && e.key === 'ArrowRight') {
                e.preventDefault();
                this.goForward();
            }
            
            // F11 for fullscreen
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
            
            // Escape to exit fullscreen
            if (e.key === 'Escape' && this.isFullscreen) {
                this.toggleFullscreen();
            }
            
            // Ctrl/Cmd + L to focus address bar (simulated)
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                this.showNotification('Address bar focused', 'info');
            }
        });
    }
}

// Global functions for HTML onclick
function goBack() {
    if (gameBrowser) gameBrowser.goBack();
}

function goForward() {
    if (gameBrowser) gameBrowser.goForward();
}

function refreshGame() {
    if (gameBrowser) gameBrowser.refreshGame();
}

function goHome() {
    if (gameBrowser) gameBrowser.goHome();
}

function closeGame() {
    if (gameBrowser) gameBrowser.closeGame();
}

function openInNewTab() {
    if (gameBrowser) gameBrowser.openInNewTab();
}

function toggleFullscreen() {
    if (gameBrowser) gameBrowser.toggleFullscreen();
}

// Initialize game browser when page loads
let gameBrowser;

document.addEventListener('DOMContentLoaded', function() {
    gameBrowser = new GameBrowser();
    
    // Update button states based on history
    const backBtn = document.querySelector('.toolbar-btn:nth-child(1)');
    const forwardBtn = document.querySelector('.toolbar-btn:nth-child(2)');
    
    // Initially disable back/forward buttons
    if (backBtn) backBtn.disabled = true;
    if (forwardBtn) forwardBtn.disabled = true;
    
    console.log('🎮 Game browser ready!');
    console.log('📍 Current page:', window.location.pathname);
});