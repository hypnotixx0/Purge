// accessibility.js - Accessibility improvements
class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        // Add ARIA labels to buttons without them
        this.addAriaLabels();
        
        // Add keyboard navigation
        this.addKeyboardNavigation();
        
        // Add focus indicators
        this.addFocusIndicators();
    }

    addAriaLabels() {
        // Search input
        const searchInput = document.getElementById('game-search');
        if (searchInput && !searchInput.getAttribute('aria-label')) {
            searchInput.setAttribute('aria-label', 'Search games');
        }

        // Clear search button
        const clearBtn = document.getElementById('clear-search');
        if (clearBtn && !clearBtn.getAttribute('aria-label')) {
            clearBtn.setAttribute('aria-label', 'Clear search');
        }

        // Genre filter
        const genreFilter = document.getElementById('genre-filter');
        if (genreFilter && !genreFilter.getAttribute('aria-label')) {
            genreFilter.setAttribute('aria-label', 'Filter games by genre');
        }

        // Favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                const isFavorited = btn.classList.contains('favorited');
                btn.setAttribute('aria-label', isFavorited ? 'Remove from favorites' : 'Add to favorites');
            }
        });
    }

    addKeyboardNavigation() {
        // Make all interactive elements keyboard accessible
        document.querySelectorAll('.game-card, .category-box, .tool-card').forEach(element => {
            if (!element.getAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    addFocusIndicators() {
        // Add CSS for focus indicators if not already present
        if (!document.getElementById('accessibility-styles')) {
            const style = document.createElement('style');
            style.id = 'accessibility-styles';
            style.textContent = `
                *:focus-visible {
                    outline: 2px solid var(--primary);
                    outline-offset: 2px;
                }
                
                button:focus-visible,
                a:focus-visible,
                input:focus-visible,
                select:focus-visible {
                    outline: 2px solid var(--primary);
                    outline-offset: 2px;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize accessibility
document.addEventListener('DOMContentLoaded', () => {
    new Accessibility();
});

