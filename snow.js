// snow.js - Improved Christmas Snow Effect
class SnowEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.snowflakes = [];
        this.isActive = false;
        this.animationId = null;
        this.resizeListener = () => this.resizeCanvas();
        this.init();
    }

    init() {
        // Don't run if already active
        if (this.isActive) {
            console.log('❄️ Snow already active, skipping init');
            return;
        }
        
        try {
            if (!document.body) {
                console.warn('❄️ Body not ready, retrying in 100ms');
                setTimeout(() => this.init(), 100);
                return;
            }
            
            this.createCanvas();
            if (!this.canvas || !this.ctx) {
                console.error('❌ Failed to create canvas');
                return;
            }
            
            this.createSnowflakes();
            if (this.snowflakes.length === 0) {
                console.error('❌ No snowflakes created');
                return;
            }
            
            this.animate();
            this.isActive = true;
            
            console.log('❄️ Snow effect activated!', this.snowflakes.length, 'snowflakes');
        } catch (e) {
            console.error('❌ Error initializing snow:', e);
            this.isActive = false;
        }
    }

    createCanvas() {
        // Remove existing canvas
        const existingCanvas = document.getElementById('snow-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        if (!document.body) {
            console.error('❌ Cannot create snow canvas - body not ready');
            return;
        }
        
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'snow-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('❌ Cannot get canvas context');
            return;
        }
        
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeListener);
        
        console.log('✅ Snow canvas created:', this.canvas.width, 'x', this.canvas.height);
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth || 1920;
        this.canvas.height = window.innerHeight || 1080;
        
        // Recreate snowflakes if canvas was resized
        if (this.snowflakes.length > 0) {
            this.createSnowflakes();
        }
    }

    createSnowflakes() {
        if (!this.canvas) {
            console.error('❌ Cannot create snowflakes - canvas not ready');
            return;
        }
        
        const snowflakeCount = Math.min(120, Math.floor((window.innerWidth || 1920) / 10));
        this.snowflakes = [];
        
        const width = this.canvas.width || window.innerWidth || 1920;
        const height = this.canvas.height || window.innerHeight || 1080;
        
        for (let i = 0; i < snowflakeCount; i++) {
            this.snowflakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 4 + 2,
                speed: Math.random() * 2.5 + 1,
                wind: (Math.random() * 0.5) - 0.25,
                opacity: Math.random() * 0.8 + 0.4,
                swing: Math.random() * 0.04,
                swingOffset: Math.random() * Math.PI * 2
            });
        }
        
        console.log('❄️ Created', this.snowflakes.length, 'snowflakes');
    }

    animate() {
        if (!this.isActive || !this.canvas || !this.ctx) {
            console.warn('❄️ Snow animation stopped - not active or canvas missing');
            return;
        }
        
        try {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            const time = Date.now() * 0.001;
            
            for (let i = 0; i < this.snowflakes.length; i++) {
                const flake = this.snowflakes[i];
                
                // Draw snowflake with gradient and glow
                const gradient = this.ctx.createRadialGradient(
                    flake.x, flake.y, 0,
                    flake.x, flake.y, flake.radius * 1.5
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${flake.opacity})`);
                gradient.addColorStop(0.5, `rgba(255, 255, 255, ${flake.opacity * 0.6})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                
                // Add glow effect
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                this.ctx.shadowBlur = 4;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Reset shadow
                this.ctx.shadowBlur = 0;
                this.ctx.shadowColor = 'transparent';
                
                // Update position with swinging motion
                flake.y += flake.speed;
                flake.x += flake.wind + Math.sin(time + flake.swingOffset) * flake.swing;
                
                // Reset if out of bounds
                if (flake.y > this.canvas.height) {
                    flake.y = -5;
                    flake.x = Math.random() * this.canvas.width;
                }
                if (flake.x > this.canvas.width + 10) flake.x = -10;
                if (flake.x < -10) flake.x = this.canvas.width + 10;
            }
            
            this.animationId = requestAnimationFrame(() => this.animate());
        } catch (e) {
            console.error('❌ Error in snow animation:', e);
            this.isActive = false;
        }
    }

    destroy() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            this.canvas = null;
        }
        window.removeEventListener('resize', this.resizeListener);
        this.snowflakes = [];
        console.log('❄️ Snow effect destroyed');
    }
}

// Global snow control
window.snowEffect = null;

function initSnow() {
    // Check if snow is already active
    if (window.snowEffect && window.snowEffect.isActive) {
        console.log('❄️ Snow already active');
        return;
    }
    
    // Check theme from localStorage or themeManager
    let currentTheme = localStorage.getItem('purge_theme');
    if (!currentTheme && window.themeManager) {
        currentTheme = window.themeManager.getCurrentTheme();
    }
    
    if (currentTheme === 'christmas') {
        console.log('❄️ Initializing snow for Christmas theme');
        // Destroy any existing snow first
        if (window.snowEffect) {
            destroySnow();
        }
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            try {
                window.snowEffect = new SnowEffect();
                console.log('✅ Snow effect created successfully');
            } catch (e) {
                console.error('❌ Error creating snow effect:', e);
            }
        }, 200);
    } else {
        console.log('❄️ Not Christmas theme, skipping snow');
    }
}

function destroySnow() {
    if (window.snowEffect) {
        window.snowEffect.destroy();
        window.snowEffect = null;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check theme and initialize snow
    function checkAndInitSnow() {
        let currentTheme = localStorage.getItem('purge_theme');
        if (!currentTheme && window.themeManager) {
            currentTheme = window.themeManager.getCurrentTheme();
        }
        
        console.log('🔍 Checking theme for snow:', currentTheme);
        
        if (currentTheme === 'christmas') {
            console.log('🎄 Christmas theme detected, initializing snow...');
            initSnow();
        } else {
            console.log('❄️ Not Christmas theme, no snow needed');
        }
    }
    
    // Check immediately
    setTimeout(checkAndInitSnow, 500);
    
    // Also check after theme manager loads
    setTimeout(checkAndInitSnow, 1500);
    
    // Force check when window loads completely
    if (document.readyState === 'complete') {
        setTimeout(checkAndInitSnow, 300);
    } else {
        window.addEventListener('load', () => {
            setTimeout(checkAndInitSnow, 500);
        });
    }
});

// Re-initialize when theme changes
window.addEventListener('themeChanged', (event) => {
    setTimeout(() => {
        destroySnow();
        // Check if new theme is Christmas
        const newTheme = event.detail || localStorage.getItem('purge_theme');
        if (newTheme === 'christmas') {
            setTimeout(() => initSnow(), 200);
        }
    }, 100);
});

// Also listen for storage changes (in case theme is changed in another tab)
window.addEventListener('storage', (e) => {
    if (e.key === 'purge_theme') {
        destroySnow();
        if (e.newValue === 'christmas') {
            setTimeout(() => initSnow(), 200);
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', destroySnow);
window.addEventListener('beforeunload', destroySnow);