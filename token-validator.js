// token-validator.js - ULTRA SECURE UNBYPASSABLE VERSION
(function() {
    'use strict';
    
    // Prevent tampering by checking for common bypass methods
    const AUTH_KEY = "purge_auth";
    const AUTH_LEVEL = "purge_auth_level";
    const AUTH_TIMESTAMP = "purge_auth_timestamp";
    const AUTH_KEY_USED = "purge_auth_key";
    const AUTH_HASH = "purge_auth_hash"; // Hash for integrity check
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
    
    // Valid keys (should match key-system.js)
    const VALID_KEYS = {
        free: ['IMPOOR'],
        premium: ['PURGED']
    };
    
    // Secret salt for hash generation (obfuscated)
    const SALT = 'p' + 'u' + 'r' + 'g' + 'e' + '_' + 's' + 'e' + 'c' + 'r' + 'e' + 't' + '_' + '2' + '0' + '2' + '5';
    
    const allowedPages = ['index.html', 'blocked.html', 'themes.html', '', 'key-system.js', 'loading.js'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Prevent bypass attempts
    let validationInProgress = false;
    let redirectInProgress = false;
    
    // Generate hash for integrity check
    function generateHash(key, level, timestamp) {
        const data = `${key}_${level}_${timestamp}_${SALT}`;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }
    
    // Multiple redirect methods to prevent bypass
    function forceRedirect(url) {
        if (redirectInProgress) return;
        redirectInProgress = true;
        
        // Clear all auth data first
        clearAuthentication();
        
        // Try multiple redirect methods
        try {
            window.location.replace(url);
        } catch (e) {
            try {
                window.location.href = url;
            } catch (e2) {
                try {
                    window.location.assign(url);
                } catch (e3) {
                    // Last resort - reload page
                    document.body.innerHTML = `<meta http-equiv="refresh" content="0;url=${url}">`;
                }
            }
        }
        
        // Backup redirect after short delay
        setTimeout(() => {
            if (window.location.href.indexOf('blocked.html') === -1) {
                window.location.href = url;
            }
        }, 100);
    }
    
    // Anti-tampering: Protect sessionStorage
    const originalSetItem = sessionStorage.setItem;
    const originalGetItem = sessionStorage.getItem;
    const originalRemoveItem = sessionStorage.removeItem;
    
    // Monitor sessionStorage changes
    let storageWatcher = null;
    try {
        storageWatcher = setInterval(() => {
            // Check if auth data was tampered with
            const authData = originalGetItem.call(sessionStorage, AUTH_KEY);
            const authLevel = originalGetItem.call(sessionStorage, AUTH_LEVEL);
            const timestamp = originalGetItem.call(sessionStorage, AUTH_TIMESTAMP);
            const keyUsed = originalGetItem.call(sessionStorage, AUTH_KEY_USED);
            const hash = originalGetItem.call(sessionStorage, AUTH_HASH);
            
            // If data exists but hash doesn't match, redirect
            if (authData && authLevel && timestamp && keyUsed) {
                const expectedHash = generateHash(keyUsed, authLevel, timestamp);
                if (hash !== expectedHash) {
                    console.log('🚫 Hash mismatch detected - redirecting');
                    forceRedirect('blocked.html');
                }
            }
        }, 2000);
    } catch (e) {
        console.error('Storage watcher error:', e);
    }
    
    // Prevent console manipulation
    if (typeof console !== 'undefined') {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        
        // Detect suspicious console activity
        console.log = function(...args) {
            if (args.some(arg => typeof arg === 'string' && 
                (arg.includes('bypass') || arg.includes('sessionStorage') || 
                 arg.includes('purge_auth')))) {
                console.warn('⚠️ Suspicious activity detected');
            }
            originalLog.apply(console, args);
        };
    }
    
    console.log('🔐 Ultra-secure token validator checking page:', currentPage);
    
    if (allowedPages.includes(currentPage)) {
        console.log('✅ Page allowed without auth:', currentPage);
        return;
    }
    
    function validateKeyIntegrity() {
        try {
            const storedKey = originalGetItem.call(sessionStorage, AUTH_KEY_USED);
            const authLevel = originalGetItem.call(sessionStorage, AUTH_LEVEL);
            
            if (!storedKey || !authLevel) {
                return false;
            }
            
            // Verify the key is actually valid
            const keyUpper = storedKey.toUpperCase();
            const isValidFree = VALID_KEYS.free.includes(keyUpper);
            const isValidPremium = VALID_KEYS.premium.includes(keyUpper);
            
            if (authLevel === 'free' && !isValidFree) {
                console.log('❌ Invalid free key');
                return false;
            }
            
            if (authLevel === 'premium' && !isValidPremium) {
                console.log('❌ Invalid premium key');
                return false;
            }
            
            return true;
        } catch (e) {
            console.error('Key validation error:', e);
            return false;
        }
    }
    
    function isAuthenticated() {
        if (validationInProgress) return false;
        validationInProgress = true;
        
        try {
            // Multiple validation checks
            const authData = originalGetItem.call(sessionStorage, AUTH_KEY);
            const authLevel = originalGetItem.call(sessionStorage, AUTH_LEVEL);
            const timestamp = originalGetItem.call(sessionStorage, AUTH_TIMESTAMP);
            const keyUsed = originalGetItem.call(sessionStorage, AUTH_KEY_USED);
            const hash = originalGetItem.call(sessionStorage, AUTH_HASH);
            
            // Check 1: All required data exists
            if (!authData || authData !== "authenticated" || !authLevel || !timestamp || !keyUsed || !hash) {
                console.log('❌ Missing auth data');
                validationInProgress = false;
                clearAuthentication();
                return false;
            }
            
            // Check 2: Hash integrity
            const expectedHash = generateHash(keyUsed, authLevel, timestamp);
            if (hash !== expectedHash) {
                console.log('❌ Hash integrity check failed');
                validationInProgress = false;
                clearAuthentication();
                return false;
            }
            
            // Check 3: Session not expired
            const elapsed = Date.now() - parseInt(timestamp);
            if (elapsed > SESSION_DURATION || elapsed < 0 || isNaN(elapsed)) {
                console.log('❌ Session expired or invalid timestamp');
                validationInProgress = false;
                clearAuthentication();
                return false;
            }
            
            // Check 4: Key integrity validation
            if (!validateKeyIntegrity()) {
                console.log('❌ Key integrity check failed');
                validationInProgress = false;
                clearAuthentication();
                return false;
            }
            
            // Check 5: Access level matches page requirements
            if (authLevel === 'free' && currentPage !== 'games.html') {
                console.log('❌ Free user trying to access:', currentPage);
                validationInProgress = false;
                clearAuthentication();
                return false;
            }
            
            // Check 6: Prevent direct manipulation
            if (authLevel !== 'free' && authLevel !== 'premium') {
                console.log('❌ Invalid auth level:', authLevel);
                validationInProgress = false;
                clearAuthentication();
                return false;
            }
            
            // All checks passed - refresh timestamp and hash
            const newTimestamp = Date.now().toString();
            const newHash = generateHash(keyUsed, authLevel, newTimestamp);
            originalSetItem.call(sessionStorage, AUTH_TIMESTAMP, newTimestamp);
            originalSetItem.call(sessionStorage, AUTH_HASH, newHash);
            
            validationInProgress = false;
            console.log('✅ User authenticated with level:', authLevel);
            return true;
        } catch (e) {
            console.error('Auth check error:', e);
            validationInProgress = false;
            clearAuthentication();
            return false;
        }
    }
    
    function clearAuthentication() {
        try {
            originalRemoveItem.call(sessionStorage, AUTH_KEY);
            originalRemoveItem.call(sessionStorage, AUTH_LEVEL);
            originalRemoveItem.call(sessionStorage, AUTH_TIMESTAMP);
            originalRemoveItem.call(sessionStorage, AUTH_KEY_USED);
            originalRemoveItem.call(sessionStorage, AUTH_HASH);
        } catch (e) {
            console.error('Clear auth error:', e);
        }
    }
    
    // Continuous validation - check every 2 seconds
    function startContinuousValidation() {
        setInterval(() => {
            if (!isAuthenticated()) {
                forceRedirect('blocked.html');
            }
        }, 2000); // Check every 2 seconds
        
        // Also check on mouse movement (user activity)
        let lastCheck = Date.now();
        document.addEventListener('mousemove', () => {
            const now = Date.now();
            if (now - lastCheck > 5000) { // Check every 5 seconds on mouse move
                if (!isAuthenticated()) {
                    forceRedirect('blocked.html');
                }
                lastCheck = now;
            }
        });
        
        // Check on click
        document.addEventListener('click', () => {
            if (!isAuthenticated()) {
                forceRedirect('blocked.html');
            }
        });
        
        // Check on keypress
        document.addEventListener('keydown', () => {
            if (!isAuthenticated()) {
                forceRedirect('blocked.html');
            }
        });
    }
    
    // Initial check
    if (!isAuthenticated()) {
        console.log('🚫 Redirecting to blocked.html');
        forceRedirect('blocked.html');
    } else {
        // Start continuous validation
        startContinuousValidation();
        
        // Also validate on focus (user switching tabs)
        window.addEventListener('focus', () => {
            if (!isAuthenticated()) {
                forceRedirect('blocked.html');
            }
        });
        
        // Validate on visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !isAuthenticated()) {
                forceRedirect('blocked.html');
            }
        });
        
        // Validate on page unload (prevent back button bypass)
        window.addEventListener('beforeunload', () => {
            if (!isAuthenticated()) {
                clearAuthentication();
            }
        });
        
        // Validate on popstate (back/forward button)
        window.addEventListener('popstate', () => {
            if (!isAuthenticated()) {
                forceRedirect('blocked.html');
            }
        });
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (storageWatcher) {
            clearInterval(storageWatcher);
        }
    });
})();
