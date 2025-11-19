class PremiumChat {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyCuDjWifyobeL01UZVvE7tB5VChypqEnT0",
            authDomain: "purgechat.firebaseapp.com",
            databaseURL: "https://purgechat-default-rtdb.firebaseio.com",
            projectId: "purgechat",
            storageBucket: "purgechat.firebasestorage.app",
            messagingSenderId: "629569155958",
            appId: "1:629569155958:web:6c30b522a4301ce1810057"
        };
        
        this.messages = [];
        this.username = localStorage.getItem('chat_username') || '';
        this.isModerator = localStorage.getItem('chat_is_moderator') === 'true';
        this.lastMessageTime = 0;
        this.rateLimitMs = 3000; // 3 seconds between messages
        this.maxMessageLength = 500;
        this.maxMessages = 100; // Keep only last 100 messages
        
        // Basic profanity list and notification throttle
        this.badWords = [
            'fuck','shit','bitch','asshole','dick','pussy','cunt','bastard','slut','whore','douche','bollocks','wanker','prick','twat'
        ];
        this.lastNotify = 0;
        
        // Connection state
        this.isConnected = false;
        this.childAddedHandler = null;
        this.seenMessageIds = new Set();
        
        this.init();
    }
    
    init() {
        this.createChatHTML();
        this.bindEvents();
        this.loadUsername();
        
        // Initialize Firebase (using mock for demo)
        this.initFirebase();
    }
    
    createChatHTML() {
        const chatHTML = `
            <div class="chat-overlay" id="chat-overlay"></div>
            <div class="chat-container" id="chat-container">
                <div class="chat-header">
                    <div class="chat-title">
                        <i class="fas fa-comments"></i>
                        <span>Premium Chat</span>
                        <span class="moderator-badge" id="moderator-badge" style="display: none;">MOD</span>
                    </div>
                    <button class="chat-close" id="chat-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chat-status" id="chat-status">Connecting...</div>
                
                <div class="username-setup" id="username-setup">
                    <h3>Choose Your Username</h3>
                    <p>This will be your anonymous identity in chat</p>
                    <input type="text" class="username-input" id="username-input" placeholder="Enter username..." maxlength="20">
                    <br>
                    <button class="btn btn-primary" id="save-username">Start Chatting</button>
                </div>
                
                <div class="chat-messages" id="chat-messages" style="display: none;">
                    <!-- Messages will be loaded here -->
                </div>
                
                <div class="chat-input-container" id="chat-input-container" style="display: none;">
                    <input type="text" class="chat-input" id="chat-input" placeholder="Type a message..." maxlength="${this.maxMessageLength}">
                    <button class="chat-send" id="chat-send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }
    
    bindEvents() {
        // Close chat
        document.getElementById('chat-close').addEventListener('click', () => this.hide());
        document.getElementById('chat-overlay').addEventListener('click', () => this.hide());
        
        // Username setup
        document.getElementById('save-username').addEventListener('click', () => this.saveUsername());
        document.getElementById('username-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveUsername();
        });
        
        // Message input
        document.getElementById('chat-send').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Moderator mode toggle (Ctrl+Shift+M)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                this.toggleModeratorMode();
            }
        });
    }
    
    loadUsername() {
        if (this.username) {
            this.showChatInterface();
            this.connectToChat();
        }
    }
    
    saveUsername() {
        const input = document.getElementById('username-input');
        const username = input.value.trim();
        
        if (username.length < 2) {
            this.showError('Username must be at least 2 characters');
            return;
        }
        
        if (username.length > 20) {
            this.showError('Username must be 20 characters or less');
            return;
        }
        
        this.username = username;
        localStorage.setItem('chat_username', username);
        
        this.showChatInterface();
        this.connectToChat();
    }
    
    showChatInterface() {
        document.getElementById('username-setup').style.display = 'none';
        document.getElementById('chat-messages').style.display = 'block';
        document.getElementById('chat-input-container').style.display = 'flex';
        
        if (this.isModerator) {
            document.getElementById('moderator-badge').style.display = 'inline-block';
        }
    }
    
    initFirebase() {
        try {
            if (!firebase.apps || firebase.apps.length === 0) {
                firebase.initializeApp(this.firebaseConfig);
            }
        } catch (e) {
            // already initialized or failed; continue
        }

        // Ensure anonymous sign-in (optional now, required if you tighten rules)
        if (firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                if (!user) {
                    firebase.auth().signInAnonymously().catch(() => {});
                }
            });
        }

        this.db = firebase.database();
        this.messagesRef = this.db.ref('rooms/global/messages');
        this.updateStatus('connected', 'Connected to chat');
    }
    
    connectToChat() {
        if (!this.messagesRef) return;
        if (this.isConnected) return; // already streaming

        this.isConnected = true;

        // Stable handler to avoid duplicate listeners
        this.childAddedHandler = (snap) => {
            const val = snap.val();
            if (!val) return;
            const id = snap.key;
            if (this.seenMessageIds.has(id)) return; // skip duplicates
            this.seenMessageIds.add(id);
            const msg = {
                id,
                username: val.username,
                text: val.text,
                timestamp: val.timestamp || Date.now(),
                isModerator: !!val.isModerator
            };
            this.messages.push(msg);
            // Keep only last maxMessages in cache
            if (this.messages.length > this.maxMessages) {
                this.messages = this.messages.slice(-this.maxMessages);
            }
            this.renderMessages();
        };

        // Load last N and stream new ones
        this.messagesRef.limitToLast(this.maxMessages).on('child_added', this.childAddedHandler);
    }
    
    addDemoMessages() {
        // Intentionally empty - no filler users/messages
    }
    
    renderMessages() {
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        
        this.messages.forEach(message => {
            const messageEl = this.createMessageElement(message);
            container.appendChild(messageEl);
        });
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }
    
    createMessageElement(message) {
        const div = document.createElement('div');
        div.className = 'chat-message';
        div.dataset.messageId = message.id;
        
        const avatar = this.generateAvatar(message.username);
        const time = new Date(message.timestamp).toLocaleTimeString();
        const isOwnMessage = message.username === this.username;
        const canDelete = isOwnMessage || this.isModerator;
        
        div.innerHTML = `
            <div class="message-avatar" style="background-color: ${avatar.color}">
                ${avatar.initials}
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-username">${message.username}</span>
                    ${message.isModerator ? '<span class="moderator-badge">MOD</span>' : ''}
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${this.escapeHtml(message.text)}</div>
            </div>
            ${canDelete ? `<button class="message-delete" onclick="window.premiumChat.deleteMessage('${message.id}')">Delete</button>` : ''}
        `;
        
        return div;
    }
    
    generateAvatar(username) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
        ];
        
        const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const color = colors[hash % colors.length];
        const initials = username.substring(0, 2).toUpperCase();
        
        return { color, initials };
    }

    // Normalize text for profanity matching
    normalizeForFilter(text) {
        return text
            .toLowerCase()
            .replace(/0/g, 'o')
            .replace(/@/g, 'a')
            .replace(/1/g, 'i')
            .replace(/3/g, 'e')
            .replace(/4/g, 'a')
            .replace(/5/g, 's')
            .replace(/\$/g, 's')
            .replace(/7/g, 't');
    }

    // Replace inner characters with asterisks, keep first/last
    maskWord(word) {
        if (word.length <= 2) return '*'.repeat(word.length);
        const first = word[0];
        const last = word[word.length - 1];
        return first + '*'.repeat(word.length - 2) + last;
    }

    // Filter profanity in a token-aware manner while preserving original characters
    filterProfanity(text) {
        const parts = text.split(/(\s+)/);
        return parts.map(part => {
            if (!part.trim()) return part;
            const norm = this.normalizeForFilter(part);
            const hasBad = this.badWords.some(w => norm.includes(w));
            return hasBad ? this.maskWord(part) : part;
        }).join('');
    }

    // Read settings for chat notifications; default to true
    getSettings() {
        try {
            const saved = localStorage.getItem('purge_settings');
            const settings = saved ? JSON.parse(saved) : {};
            if (typeof settings.chatNotifications !== 'boolean') settings.chatNotifications = true;
            return settings;
        } catch (e) {
            return { chatNotifications: true };
        }
    }

    // Show a user notification with fallback and throttling
    notify(title, body) {
        const settings = this.getSettings();
        const now = Date.now();
        if (!settings.chatNotifications) return;
        if (now - this.lastNotify < 2000) return; // throttle 2s
        this.lastNotify = now;

        const icon = 'assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico';
        try {
            if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                    new Notification(title, { body, icon });
                    return;
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then((perm) => {
                        if (perm === 'granted') new Notification(title, { body, icon });
                    });
                }
            }
        } catch (e) {
            // fall through to tooltip fallback
        }
        if (window.tooltipManager && typeof window.tooltipManager.show === 'function') {
            window.tooltipManager.show(`${title}: ${body}`, true);
        }
    }
    
    sendMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        
        if (!text) return;
        
        // Rate limiting
        const now = Date.now();
        if (now - this.lastMessageTime < this.rateLimitMs) {
            this.showRateLimitWarning();
            return;
        }
        
        // Anti-spam: check for duplicate messages
        const lastMessage = this.messages[this.messages.length - 1];
        if (lastMessage && lastMessage.text === text && lastMessage.username === this.username) {
            this.showError('Please don\'t send the same message twice');
            return;
        }
        
        // Profanity filtering
        const filtered = this.filterProfanity(text);

        // Create message
        const message = {
            username: this.username,
            text: filtered,
            timestamp: now,
            isModerator: this.isModerator
        };
        
        // Send to Firebase
        if (this.messagesRef) {
            this.messagesRef.push({
                username: message.username,
                text: message.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                isModerator: message.isModerator
            });
        }
        
        // Notify user on send
        this.notify('Message sent', 'Your message has been posted');
        
        // Clear input and update rate limit
        input.value = '';
        this.lastMessageTime = now;
        
        // Update send button state
        this.updateSendButton();
    }
    
    deleteMessage(messageId) {
        if (!confirm('Are you sure you want to delete this message?')) return;
        
        if (this.messagesRef) {
            this.messagesRef.child(messageId).remove();
        }
    }
    
    showRateLimitWarning() {
        const existing = document.querySelector('.rate-limit-warning');
        if (existing) existing.remove();
        
        const warning = document.createElement('div');
        warning.className = 'rate-limit-warning';
        warning.textContent = `Please wait ${Math.ceil(this.rateLimitMs / 1000)} seconds before sending another message`;
        
        const container = document.getElementById('chat-container');
        container.insertBefore(warning, container.querySelector('.chat-input-container'));
        
        setTimeout(() => warning.remove(), 3000);
    }
    
    showError(message) {
        const status = document.getElementById('chat-status');
        status.className = 'chat-status error';
        status.textContent = message;
        
        setTimeout(() => {
            this.updateStatus('connected', 'Connected to chat');
        }, 3000);
    }
    
    updateStatus(status, message) {
        const statusEl = document.getElementById('chat-status');
        statusEl.className = `chat-status ${status}`;
        statusEl.textContent = message;
    }
    
    updateSendButton() {
        const btn = document.getElementById('chat-send');
        const now = Date.now();
        const timeSinceLastMessage = now - this.lastMessageTime;
        
        if (timeSinceLastMessage < this.rateLimitMs) {
            btn.disabled = true;
            const remaining = Math.ceil((this.rateLimitMs - timeSinceLastMessage) / 1000);
            btn.innerHTML = `<i class="fas fa-clock"></i> ${remaining}`;
            
            setTimeout(() => this.updateSendButton(), 1000);
        } else {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }
    }
    
    toggleModeratorMode() {
        const code = prompt('Enter moderator code:');
        if (code === 'ADMIN123') {
            this.isModerator = !this.isModerator;
            localStorage.setItem('chat_is_moderator', this.isModerator);
            
            const badge = document.getElementById('moderator-badge');
            badge.style.display = this.isModerator ? 'inline-block' : 'none';
            
            this.updateStatus('connected', this.isModerator ? 'Moderator mode enabled' : 'Moderator mode disabled');
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    show() {
        document.getElementById('chat-overlay').classList.add('active');
        document.getElementById('chat-container').classList.add('active');
        document.body.style.overflow = 'hidden';

        // Render cached messages immediately so history appears on reopen
        this.renderMessages();
        
        // Focus input if username is set
        if (this.username) {
            setTimeout(() => {
                const input = document.getElementById('chat-input');
                if (input) input.focus();
            }, 300);
        }
    }
    
    hide() {
        document.getElementById('chat-overlay').classList.remove('active');
        document.getElementById('chat-container').classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Global instance
let premiumChat;

// Initialize when premium key is validated
window.initPremiumChat = function() {
    // If user has already validated chat this session, bypass key popup logic
    if (sessionStorage.getItem('purge_chat_access') === 'true') {
        if (!premiumChat) {
            premiumChat = new PremiumChat();
            window.premiumChat = premiumChat;
        }
        premiumChat.show();
        return;
    }
    if (!premiumChat) {
        premiumChat = new PremiumChat();
        window.premiumChat = premiumChat;
    }
    premiumChat.show();
};

// Export for global access
window.premiumChat = null;
