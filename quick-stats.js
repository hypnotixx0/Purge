// quick-stats.js - Update quick stats on homepage
function updateQuickStats() {
    // Total games - check if gamesManager exists, otherwise use a default or load games
    const checkGames = () => {
        if (window.gamesManager && window.gamesManager.games && window.gamesManager.games.length > 0) {
            const totalGames = window.gamesManager.games.length;
            const gamesStat = document.getElementById('total-games-stat');
            if (gamesStat) {
                animateValue(gamesStat, parseInt(gamesStat.textContent) || 0, totalGames, 1000);
            }
        } else if (typeof GamesManager !== 'undefined') {
            // Try to create a temporary instance to get game count
            try {
                const tempManager = new GamesManager();
                if (tempManager.games && tempManager.games.length > 0) {
                    const totalGames = tempManager.games.length;
                    const gamesStat = document.getElementById('total-games-stat');
                    if (gamesStat) {
                        animateValue(gamesStat, parseInt(gamesStat.textContent) || 0, totalGames, 1000);
                    }
                }
            } catch (e) {
                // Fallback: use a default count or load from localStorage
                const gamesStat = document.getElementById('total-games-stat');
                if (gamesStat && gamesStat.textContent === '0') {
                    // Try to get from cached data or use default
                    const defaultGames = 4; // Based on the games we know exist
                    animateValue(gamesStat, 0, defaultGames, 1000);
                }
            }
        } else {
            // Retry after a delay
            let retries = 0;
            const maxRetries = 20;
            const retryCheck = () => {
                if (window.gamesManager && window.gamesManager.games) {
                    const totalGames = window.gamesManager.games.length;
                    const gamesStat = document.getElementById('total-games-stat');
                    if (gamesStat) {
                        animateValue(gamesStat, parseInt(gamesStat.textContent) || 0, totalGames, 1000);
                    }
                } else if (retries < maxRetries) {
                    retries++;
                    setTimeout(retryCheck, 200);
                }
            };
            setTimeout(retryCheck, 200);
        }
    };
    checkGames();

    // Favorites
    const checkFavorites = () => {
        if (window.favoritesManager) {
            const favorites = window.favoritesManager.getFavorites().length;
            const favoritesStat = document.getElementById('favorites-stat');
            if (favoritesStat) {
                animateValue(favoritesStat, parseInt(favoritesStat.textContent) || 0, favorites, 1000);
            }
        } else {
            setTimeout(checkFavorites, 100);
        }
    };
    checkFavorites();

    // Achievements removed from stats - now displayed separately

    // Total plays
    const checkPlays = () => {
        if (window.gameStats) {
            const stats = window.gameStats.getTotalStats();
            const playsStat = document.getElementById('plays-stat');
            if (playsStat) {
                animateValue(playsStat, parseInt(playsStat.textContent) || 0, stats.totalPlays, 1000);
            }
        } else {
            setTimeout(checkPlays, 100);
        }
    };
    checkPlays();
}

function animateValue(element, start, end, duration) {
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end;
        }
    };
    window.requestAnimationFrame(step);
}

// Update stats on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for all managers to load
        setTimeout(updateQuickStats, 1000);
        // Also update periodically
        setInterval(updateQuickStats, 5000);
    });
} else {
    setTimeout(updateQuickStats, 1000);
    setInterval(updateQuickStats, 5000);
}

// Update stats when achievements are unlocked
window.addEventListener('achievementUnlocked', updateQuickStats);

// Update stats when games are played
window.addEventListener('gamePlayed', () => {
    setTimeout(updateQuickStats, 500);
});

// Update stats when favorites change
window.addEventListener('favoritesChanged', () => {
    setTimeout(updateQuickStats, 500);
});

