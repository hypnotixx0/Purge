// key-system.js - SIMPLE WORKING VERSION WITH TIERED KEYS
// Global function to show popup - MUST BE BEFORE DOMContentLoaded
window.showKeyPopup = function(category) {
    console.log('🎯 Showing popup for:', category);
    window.currentCategory = category; // Set this FIRST
    
    const keyPopup = document.getElementById('key-popup');
    const keyInput = document.getElementById('key-input');
    const categoryName = document.getElementById('category-name');
    const keyStatus = document.getElementById('key-status');
    const showKeyBtn = document.getElementById('show-key');
    
    if (!keyPopup) {
        console.error('❌ Key popup element not found!');
        return;
    }
    
    if (categoryName) categoryName.textContent = getCategoryDisplayName(category);
    if (keyInput) {
        keyInput.value = '';
        keyInput.setAttribute('type', 'password');
    }
    if (showKeyBtn) showKeyBtn.innerHTML = '<i class="fas fa-eye"></i>';
    if (keyStatus) {
        keyStatus.className = 'key-status';
        keyStatus.textContent = '';
    }
    keyPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        if (keyInput) keyInput.focus();
    }, 100);
};

const getCategoryDisplayName = (cat) => ({
    'games': 'Games', 'apps': 'Apps', 'tools': 'Tools', 'roadmap': 'Roadmap', 'themes': 'Themes', 'chat': 'Premium Chat'
})[cat] || cat;

// Initialize global variable
window.currentCategory = '';

// Now the DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🚀 /Purge Key System Loading...');
        
        // Cache DOM elements
        const keyInput = document.getElementById('key-input');
        const showKeyBtn = document.getElementById('show-key');
        const submitKeyBtn = document.getElementById('submit-key');
        const closeKeyPopup = document.getElementById('close-key-popup');
        const keyPopup = document.getElementById('key-popup');
        const keyStatus = document.getElementById('key-status');
        
        const freeKeys = ['IMPOOR'];
        const premiumKeys = ['PURGED'];
        
        if (!keyInput || !keyPopup) {
            console.warn('⚠️ Key system elements missing');
            return;
        }

        console.log('✅ Key system elements found');

        // Show/hide password
        if (showKeyBtn) {
            showKeyBtn.addEventListener('click', function() {
                const type = keyInput.getAttribute('type') === 'password' ? 'text' : 'password';
                keyInput.setAttribute('type', type);
                showKeyBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }

        // Define hideKeyPopup BEFORE using it
        const hideKeyPopup = () => {
            keyPopup.classList.remove('active');
            document.body.style.overflow = '';
            // Reset submit button state on close to avoid stuck loading icon
            if (submitKeyBtn) {
                submitKeyBtn.innerHTML = '<i class="fas fa-key"></i> Access Content';
                submitKeyBtn.disabled = false;
            }
        };

        // Submit key
        const validateKey = () => {
            console.log('🔍 Validating key:', window.currentCategory);
            
            const key = keyInput.value.trim().toUpperCase();
            if (!key) {
                showError('Please enter a key');
                return;
            }

            if (!window.currentCategory) {
                showError('No category selected. Please try again.');
                return;
            }

            submitKeyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validating...';
            submitKeyBtn.disabled = true;

            // IMMEDIATE validation - NO DELAY
            if (premiumKeys.includes(key)) {
                console.log('✅ Premium key valid!');
                grantAccess(key, 'premium');
                return;
            } 
            
            if (freeKeys.includes(key)) {
                if (window.currentCategory === 'games') {
                    console.log('✅ Free key valid for games!');
                    grantAccess(key, 'free');
                    return;
                } else {
                    console.log('❌ Free key cannot access:', window.currentCategory);
                    showError(`Free key "IMPOOR" only works for Games section!`);
                }
            } else {
                console.log('❌ Invalid key:', key);
                showError('Invalid key. Free key: IMPOOR (Games only)');
            }
            
            submitKeyBtn.innerHTML = '<i class="fas fa-key"></i> Access Content';
            submitKeyBtn.disabled = false;
        };

        if (submitKeyBtn) submitKeyBtn.addEventListener('click', validateKey);
        
        // FIXED: Close button event listener
        if (closeKeyPopup) {
            closeKeyPopup.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                hideKeyPopup();
            });
        }
        
        keyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                validateKey();
            }
        });

        keyPopup.addEventListener('click', (e) => {
            if (e.target === keyPopup) hideKeyPopup();
        });

        const grantAccess = (key, level) => {
            console.log('✅ Access granted! Level:', level, 'Category:', window.currentCategory);
            
            // Generate hash for integrity check
            const timestamp = Date.now().toString();
            const SALT = 'p' + 'u' + 'r' + 'g' + 'e' + '_' + 's' + 'e' + 'c' + 'r' + 'e' + 't' + '_' + '2' + '0' + '2' + '5';
            const data = `${key}_${level}_${timestamp}_${SALT}`;
            let hash = 0;
            for (let i = 0; i < data.length; i++) {
                const char = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            const authHash = Math.abs(hash).toString(36);
            
            // Set all auth data with hash
            sessionStorage.setItem('purge_auth', 'authenticated');
            sessionStorage.setItem('purge_auth_level', level);
            sessionStorage.setItem('purge_auth_timestamp', timestamp);
            sessionStorage.setItem('purge_auth_key', key);
            sessionStorage.setItem('purge_auth_hash', authHash);
            
            if (keyStatus) {
                const levelText = level === 'premium' ? 'Premium' : 'Free';
                keyStatus.className = 'key-status success show';
                keyStatus.textContent = `✅ ${levelText} access granted! Redirecting...`;
            }
            
            // Redirect immediately
            setTimeout(() => {
                let redirectUrl = 'index.html';
                
                if (level === 'free') {
                    redirectUrl = 'games.html';
                } else if (level === 'premium') {
                    // Handle special cases
                    const category = window.currentCategory;
                    if (category === 'themes') {
                        redirectUrl = 'themes.html';
                    } else if (category === 'apps') {
                        redirectUrl = 'apps.html';
                    } else if (category === 'chat') {
                        // Special handling for chat - grant session access and initialize
                        console.log('💬 Initializing premium chat...');
                        sessionStorage.setItem('purge_chat_access', 'true');
                        if (typeof window.initPremiumChat === 'function') {
                            window.initPremiumChat();
                        } else {
                            console.error('❌ Premium chat not loaded');
                        }
                        // Reset button state before closing to avoid stuck loading state
                        submitKeyBtn.innerHTML = '<i class="fas fa-key"></i> Access Content';
                        submitKeyBtn.disabled = false;
                        hideKeyPopup();
                        return; // Don't redirect
                    } else {
                        redirectUrl = category + '.html';
                    }
                }
                
                console.log('🔄 Redirecting to:', redirectUrl);
                try {
                    window.location.href = redirectUrl;
                } catch (e) {
                    console.error('Error redirecting:', e);
                    window.location.href = 'index.html';
                }
            }, 800);
        };

        const showError = (message) => {
            console.log('❌ Error:', message);
            if (keyStatus) {
                keyStatus.className = 'key-status error show';
                keyStatus.textContent = `❌ ${message}`;
            }
            
            submitKeyBtn.innerHTML = '<i class="fas fa-key"></i> Access Content';
            submitKeyBtn.disabled = false;
        };

        console.log('✅ /Purge Key System Ready!');
        console.log('🔑 Free key: IMPOOR (Games only)');
        console.log('🔑 Premium key: PURGED (All access)');
    } catch (e) {
        console.error('❌ Key system error:', e);
    }
});

// Test function - run this in browser console
function testKey(key) {
    const freeKeys = ['IMPOOR'];
    const premiumKeys = ['PURGED'];
    
    if (premiumKeys.includes(key.toUpperCase())) return 'premium';
    if (freeKeys.includes(key.toUpperCase())) return 'free';
    return 'invalid';
}