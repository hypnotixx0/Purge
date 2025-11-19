// page-transitions.js - Seamless page transitions
class PageTransitions {
    constructor() {
        this.init();
    }

    init() {
        // Add transition overlay
        this.createTransitionOverlay();
        
        // Intercept link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.shouldTransition(link)) {
                e.preventDefault();
                this.transitionTo(link.href);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.showTransition();
        });
    }

    createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'page-transition-overlay';
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = `
            <div class="transition-loader">
                <div class="transition-spinner"></div>
                <div class="transition-text">Loading...</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    shouldTransition(link) {
        // Don't transition for external links, mailto, tel, etc.
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
            return false;
        }
        
        // Don't transition for same page
        const currentPath = window.location.pathname;
        const linkPath = new URL(href, window.location.origin).pathname;
        return currentPath !== linkPath;
    }

    showTransition() {
        const overlay = document.getElementById('page-transition-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    hideTransition() {
        const overlay = document.getElementById('page-transition-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    transitionTo(url) {
        this.showTransition();
        
        // Small delay for smooth transition
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PageTransitions();
    });
} else {
    new PageTransitions();
}

// Hide transition when page is fully loaded
window.addEventListener('load', () => {
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
});

