// back-to-top.js - Back to top button
class BackToTop {
    constructor() {
        this.button = null;
        this.init();
    }

    init() {
        // Create button
        this.button = document.createElement('button');
        this.button.id = 'back-to-top';
        this.button.className = 'back-to-top';
        this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        this.button.setAttribute('aria-label', 'Back to top');
        this.button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            border: none;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(this.button);

        // Scroll handler
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.button.style.display = 'flex';
            } else {
                this.button.style.display = 'none';
            }
        });

        // Click handler
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover effect
        this.button.addEventListener('mouseenter', () => {
            this.button.style.transform = 'translateY(-4px)';
            this.button.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.5)';
        });

        this.button.addEventListener('mouseleave', () => {
            this.button.style.transform = 'translateY(0)';
            this.button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });
    }
}

// Initialize back to top
document.addEventListener('DOMContentLoaded', () => {
    new BackToTop();
});

