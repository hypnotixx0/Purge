// tools.js - Complete with Blob Cloaking and Tab Cloaking
class ToolsManager {
    constructor() {
        this.currentPreset = null;
        this.cloakedWindows = new Map();
        this.init();
    }

    init() {
        console.log('🛠️ Tools manager initialized');
        this.setupTabCloaker();
        this.setupBlobCloaking();
        this.updateActiveWindows();
    }

    // BLOB CLOAKING FUNCTIONS
    setupBlobCloaking() {
        console.log('🔒 Blob cloaking initialized');
        this.loadActiveWindows();
    }

    createBlobWindow(customUrl = null, customTitle = null) {
        let url, title;
        
        try {
            url = customUrl || (document.getElementById('blob-url')?.value.trim());
            title = customTitle || (document.getElementById('blob-title')?.value.trim()) || 'Document';
        } catch (e) {
            window.debug?.error('Error getting blob window inputs:', e);
            this.showStatus('Error: Could not read input values', 'error');
            return null;
        }

        if (!url) {
            this.showStatus('Please enter a URL', 'error');
            return null;
        }
        
        // Validate URL format and security
        if (window.Utils && !window.Utils.isValidUrl(url)) {
            // Try adding https://
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            
            // Validate again
            if (!window.Utils.isValidUrl(url)) {
                this.showStatus('Invalid URL. Please enter a valid http:// or https:// URL', 'error');
                return null;
            }
        } else {
            // Additional security check - prevent javascript: and data: URLs
            if (url.toLowerCase().startsWith('javascript:') || url.toLowerCase().startsWith('data:')) {
                this.showStatus('Security: javascript: and data: URLs are not allowed', 'error');
                return null;
            }
            
            try {
                new URL(url);
            } catch (e) {
                // If not a valid URL, try adding https://
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
            }
        }

        const cloakingHTML = this.generateCloakingPage(url, title);
        const blob = new Blob([cloakingHTML], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);

        const features = `
            width=1200,height=800,
            left=${window.screenX + 100},
            top=${window.screenY + 100},
            menubar=no,
            toolbar=no,
            location=no,
            status=no,
            resizable=yes,
            scrollbars=yes
        `;

        const newWindow = window.open(blobUrl, '_blank', features);

        if (newWindow) {
            const windowId = 'window_' + Date.now();
            
            this.cloakedWindows.set(windowId, {
                window: newWindow,
                originalUrl: url,
                title: title,
                blobUrl: blobUrl,
                createdAt: new Date(),
                alive: true
            });

            this.monitorWindow(windowId, newWindow);
            this.updateActiveWindows();
            this.saveActiveWindows();
            this.showStatus(`Cloaked window created: ${title}`, 'success');
            
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 1000);
            
            return newWindow;
        } else {
            URL.revokeObjectURL(blobUrl);
            this.showStatus('Popup blocked! Please allow popups.', 'error');
            return null;
        }
    }

    generateCloakingPage(targetUrl, title) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            background: #0a0a0a;
            color: white;
            height: 100vh;
            overflow: hidden;
        }
        .cloak-header {
            background: #1a1a1a;
            padding: 10px 15px;
            border-bottom: 1px solid #2a2a2a;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }
        .cloak-title {
            color: #8B5CF6;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .purge-brand {
            font-weight: 800;
            background: linear-gradient(135deg, #A78BFA, #8B5CF6, #7C3AED);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 14px;
        }
        .cloak-controls {
            display: flex;
            gap: 5px;
        }
        .cloak-btn {
            width: 32px;
            height: 32px;
            border: 1px solid #333;
            background: #2a2a2a;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            transition: all 0.3s ease;
        }
        .cloak-btn:hover {
            border-color: #8B5CF6;
            background: #3a2a5a;
            transform: scale(1.1);
        }
        .cloak-btn i {
            font-size: 12px;
        }
        #cloakedFrame {
            width: 100%;
            height: calc(100vh - 41px);
            border: none;
            background: white;
        }
        .status-bar {
            background: #1a1a1a;
            padding: 5px 15px;
            border-top: 1px solid #2a2a2a;
            font-size: 11px;
            color: #8B5CF6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .purge-watermark {
            font-weight: 600;
            opacity: 0.7;
        }
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #22c55e;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <div class="cloak-header">
        <div class="cloak-title">
            <span class="purge-brand">/Purge</span>
            <span>📄 ${title}</span>
        </div>
        <div class="cloak-controls">
            <button class="cloak-btn" onclick="refreshFrame()" title="Refresh">
                <i class="fas fa-redo"></i>
            </button>
            <button class="cloak-btn" onclick="openOriginal()" title="Open Original">
                <i class="fas fa-external-link-alt"></i>
            </button>
            <button class="cloak-btn" onclick="closeWindow()" title="Close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>
    
    <iframe 
        src="${targetUrl}" 
        id="cloakedFrame"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
    ></iframe>

    <div class="status-bar">
        <span class="purge-watermark">/Purge Cloaked View</span>
        <div class="status-indicator">
            <div class="status-dot"></div>
            <span id="status">Ready</span>
        </div>
    </div>

    <script>
        let refreshCount = 0;
        
        function refreshFrame() {
            const frame = document.getElementById('cloakedFrame');
            frame.src = frame.src;
            refreshCount++;
            updateStatus('Refreshed');
        }
        
        function openOriginal() {
            window.open('${targetUrl}', '_blank');
        }
        
        function closeWindow() {
            // Redirect to home page instead of closing
            window.location.href = 'index.html';
        }
        
        function updateStatus(message) {
            document.getElementById('status').textContent = message;
        }
        
        const frame = document.getElementById('cloakedFrame');
        frame.onload = function() {
            updateStatus('Loaded');
        };
        
        frame.onerror = function() {
            updateStatus('Error');
        };
        
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + R to refresh
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                refreshFrame();
            }
            // Escape to close
            if (e.key === 'Escape') {
                closeWindow();
            }
        });
    </script>
</body>
</html>`;
    }

    monitorWindow(windowId, win) {
        const checkInterval = setInterval(() => {
            if (win.closed) {
                clearInterval(checkInterval);
                const windowData = this.cloakedWindows.get(windowId);
                if (windowData) {
                    windowData.alive = false;
                    this.updateActiveWindows();
                    this.saveActiveWindows();
                }
            }
        }, 1000);
    }

    updateActiveWindows() {
        const container = document.getElementById('windows-list');
        if (!container) return;

        const activeWindows = Array.from(this.cloakedWindows.entries())
            .filter(([id, data]) => data.alive);

        if (activeWindows.length === 0) {
            container.innerHTML = '<div class="no-windows">No active cloaked windows</div>';
            return;
        }

        container.innerHTML = activeWindows.map(([id, data]) => `
            <div class="window-item">
                <div class="window-info">
                    <div class="window-title">${data.title}</div>
                    <div class="window-url">${data.originalUrl}</div>
                </div>
                <div class="window-actions">
                    <button class="window-btn" onclick="toolsManager.focusWindow('${id}')" title="Focus">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="window-btn" onclick="toolsManager.closeSpecificWindow('${id}')" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    focusWindow(windowId) {
        const windowData = this.cloakedWindows.get(windowId);
        if (windowData && windowData.window && !windowData.window.closed) {
            windowData.window.focus();
        } else {
            this.cloakedWindows.delete(windowId);
            this.updateActiveWindows();
        }
    }

    closeSpecificWindow(windowId) {
        const windowData = this.cloakedWindows.get(windowId);
        if (windowData) {
            if (windowData.window && !windowData.window.closed) {
                windowData.window.close();
            }
            this.cloakedWindows.delete(windowId);
            this.updateActiveWindows();
            this.saveActiveWindows();
        }
    }

    closeAllWindows() {
        this.cloakedWindows.forEach((data, id) => {
            if (data.window && !data.window.closed) {
                data.window.close();
            }
        });
        this.cloakedWindows.clear();
        this.updateActiveWindows();
        this.saveActiveWindows();
    }

    saveActiveWindows() {
        const saveData = {};
        this.cloakedWindows.forEach((data, id) => {
            if (data.alive) {
                saveData[id] = {
                    originalUrl: data.originalUrl,
                    title: data.title,
                    createdAt: data.createdAt,
                    alive: data.alive
                };
            }
        });
        localStorage.setItem('purge_active_windows', JSON.stringify(saveData));
    }

    loadActiveWindows() {
        try {
            const saved = localStorage.getItem('purge_active_windows');
            if (saved) {
                const windowsData = JSON.parse(saved);
                Object.entries(windowsData).forEach(([id, data]) => {
                    if (data.alive) {
                        this.cloakedWindows.set(id, {
                            ...data,
                            window: null,
                            blobUrl: null,
                            alive: false
                        });
                    }
                });
                this.updateActiveWindows();
            }
        } catch (e) {
            console.error('Error loading active windows:', e);
        }
    }

    // TAB CLOAKING FUNCTIONS
    setupTabCloaker() {
        // Tab cloaking is now handled by the global tab-cloaking.js module
        // This function is kept for compatibility but does nothing
    }

    openTabCloaker() {
        const modal = document.getElementById('tab-cloaker-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeTabCloaker() {
        const modal = document.getElementById('tab-cloaker-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    selectPreset(preset) {
        this.currentPreset = preset;
        console.log('🎭 Selected preset:', preset.name);
    }

    applyCloaking() {
        if (!this.currentPreset) {
            this.showStatus('Please select a cloaking preset first!', 'error');
            return;
        }

        const preset = this.currentPreset;
        // Use the global tab cloaking module
        if (window.tabCloaking) {
            window.tabCloaking.applyTabCloaking(preset);
            window.tabCloaking.saveCloakerSettings(preset);
        }
        this.closeTabCloaker();
        this.showStatus(`Tab cloaked as ${preset.name}!`, 'success');
    }

    removeCloaking() {
        // Use the global tab cloaking module
        if (window.tabCloaking) {
            window.tabCloaking.removeCloaking();
        }
        this.currentPreset = null;
        
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.showStatus('Tab cloaking removed!', 'success');
    }

    showStatus(message, type = 'success') {
        const existingStatus = document.querySelector('.status-message');
        if (existingStatus) {
            existingStatus.remove();
        }

        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message status-${type}`;
        statusDiv.textContent = message;
        
        const toolsHeader = document.querySelector('.tools-header');
        if (toolsHeader) {
            toolsHeader.parentNode.insertBefore(statusDiv, toolsHeader.nextSibling);
        }

        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.remove();
            }
        }, 4000);
    }
}

// Tab Cloaker Presets - Get from global tab cloaking module
function getCloakerPresets() {
    if (window.tabCloaking) {
        return window.tabCloaking.getPresets();
    }
    return [];
}

// Initialize tools manager
let toolsManager;

document.addEventListener('DOMContentLoaded', function() {
    toolsManager = new ToolsManager();
    // Wait a bit for tab-cloaking.js to load if it hasn't already
    setTimeout(() => {
        setupTabCloakerModal();
    }, 100);
});

function setupTabCloakerModal() {
    const modal = document.getElementById('tab-cloaker-modal');
    if (!modal) return;
    
    const presetsGrid = modal.querySelector('.cloaker-presets');
    if (presetsGrid) {
        // Get presets from global tab cloaking module
        const presets = window.tabCloaking ? window.tabCloaking.getPresets() : [];
        presetsGrid.innerHTML = presets.map(preset => `
            <div class="preset-btn" onclick="selectCloakerPreset('${preset.name}')" data-preset="${preset.name}">
                <span class="preset-icon">${preset.icon}</span>
                <span class="preset-name">${preset.name}</span>
            </div>
        `).join('');
        
        // Add click listeners for visual feedback
        presetsGrid.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            toolsManager.closeTabCloaker();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            toolsManager.closeTabCloaker();
        }
    });
}

// Global functions for HTML onclick
function openTabCloaker() {
    toolsManager.openTabCloaker();
}

function closeTabCloaker() {
    toolsManager.closeTabCloaker();
}

function selectCloakerPreset(presetName) {
    const presets = window.tabCloaking ? window.tabCloaking.getPresets() : [];
    const preset = presets.find(p => p.name === presetName);
    if (preset) {
        toolsManager.selectPreset(preset);
    }
}

function applyCloaking() {
    toolsManager.applyCloaking();
}

function removeCloaking() {
    toolsManager.removeCloaking();
}

// Blob Cloaking Functions
function createBlobWindow() {
    toolsManager.createBlobWindow();
}

function cloakCurrentSite() {
    toolsManager.createBlobWindow(window.location.href, 'Document');
}

function quickCloak(url, title) {
    toolsManager.createBlobWindow(url, title);
}

// Utility Functions
function clearSessionData() {
    localStorage.removeItem('purge_cloaker_settings');
    localStorage.removeItem('purge_active_windows');
    toolsManager.showStatus('Session data cleared!', 'success');
}

function reloadSite() {
    window.location.reload();
}

function goHome() {
    window.location.href = 'index.html';
}

// User Agent Switcher
const userAgents = {
    chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    mobile: 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
};

function applyUserAgent() {
    const select = document.getElementById('user-agent-select');
    const selected = select?.value;
    
    if (!selected || !userAgents[selected]) {
        toolsManager.showStatus('Please select a user agent', 'error');
        return;
    }
    
    // Store user agent preference
    localStorage.setItem('purge_user_agent', userAgents[selected]);
    localStorage.setItem('purge_user_agent_type', selected);
    
    toolsManager.showStatus('User agent saved! Will apply to new windows.', 'success');
    
    // Update select to show current selection
    if (select) {
        const firstOption = select.querySelector('option[value=""]');
        if (firstOption) {
            firstOption.textContent = `Current: ${userAgents[selected].substring(0, 50)}...`;
        }
    }
}

function resetUserAgent() {
    localStorage.removeItem('purge_user_agent');
    localStorage.removeItem('purge_user_agent_type');
    
    const select = document.getElementById('user-agent-select');
    if (select) {
        select.value = '';
        const firstOption = select.querySelector('option[value=""]');
        if (firstOption) {
            firstOption.textContent = 'Select User Agent...';
        }
    }
    
    toolsManager.showStatus('User agent reset to default', 'success');
}

// Privacy Cleaner
function clearCookies() {
    // Note: Can't directly clear cookies via JavaScript for security, but can clear localStorage/sessionStorage
    const confirmed = confirm('This will clear all site data. Continue?');
    if (!confirmed) return;
    
    // Clear localStorage (except important settings)
    const keepKeys = ['purge_theme', 'purge_auth', 'purge_auth_level', 'purge_auth_hash'];
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keepKeys.includes(key)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage (except auth)
    const sessionKeepKeys = ['purge_auth', 'purge_auth_level', 'purge_auth_hash'];
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && !sessionKeepKeys.includes(key)) {
            sessionKeysToRemove.push(key);
        }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
    
    toolsManager.showStatus('Cookies and storage cleared!', 'success');
}

function clearLocalStorage() {
    const confirmed = confirm('Clear all local storage data?');
    if (!confirmed) return;
    
    const keepKeys = ['purge_theme', 'purge_auth', 'purge_auth_level', 'purge_auth_hash'];
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keepKeys.includes(key)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    toolsManager.showStatus('Local storage cleared!', 'success');
}

function clearAllTraces() {
    const confirmed = confirm('Clear ALL browsing traces? This will log you out and reset settings.');
    if (!confirmed) return;
    
    localStorage.clear();
    sessionStorage.clear();
    
    toolsManager.showStatus('All traces cleared! Reloading...', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// About:Blank Cloaker
function createAboutBlank() {
    const urlInput = document.getElementById('about-blank-url');
    const titleInput = document.getElementById('about-blank-title');
    
    const url = urlInput?.value.trim();
    const title = titleInput?.value.trim() || 'Blank Document';
    
    if (!url) {
        toolsManager.showStatus('Please enter a URL', 'error');
        return;
    }
    
    // Validate URL
    let targetUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        targetUrl = 'https://' + url;
    }
    
    try {
        new URL(targetUrl);
    } catch (e) {
        toolsManager.showStatus('Invalid URL format', 'error');
        return;
    }
    
    // Create about:blank window
    const blankWindow = window.open('about:blank', '_blank');
    if (blankWindow) {
        blankWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            background: #0a0a0a;
            color: white;
            height: 100vh;
            overflow: hidden;
        }
        iframe {
            width: 100%;
            height: 100vh;
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="${targetUrl}" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
</body>
</html>
        `);
        blankWindow.document.close();
        toolsManager.showStatus('About:blank window created!', 'success');
    } else {
        toolsManager.showStatus('Popup blocked! Please allow popups.', 'error');
    }
}

// Browser Info
function showBrowserInfo() {
    const display = document.getElementById('browser-info-display');
    const text = document.getElementById('browser-info-text');
    
    if (!display || !text || !window.browserInfo) return;
    
    const info = window.browserInfo.getFormattedInfo();
    text.textContent = Object.entries(info)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    
    display.style.display = 'block';
    toolsManager.showStatus('Browser info displayed', 'success');
}

function copyBrowserInfo() {
    if (!window.browserInfo) return;
    
    const info = window.browserInfo.getFormattedInfo();
    const infoText = Object.entries(info)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    
    navigator.clipboard.writeText(infoText).then(() => {
        toolsManager.showStatus('Browser info copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = infoText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toolsManager.showStatus('Browser info copied!', 'success');
    });
}
