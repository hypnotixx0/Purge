// games.js - With Premium Games Support
class GamesManager {
    constructor() {
        this.games = [];
        this.filteredGames = [];
        this.currentSearch = '';
        this.currentCategory = 'all';
        // Cache DOM elements
        this.gamesGrid = document.getElementById('games-grid');
        this.noResults = document.getElementById('no-results');
        this.gameSearch = document.getElementById('game-search');
        this.clearSearchBtn = document.getElementById('clear-search');
        this.genreFilter = document.getElementById('genre-filter');
        this.init();
    }

    init() {
        this.loadGames();
        // Only setup event listeners and render if on games page
        if (this.gamesGrid) {
            this.setupEventListeners();
            this.renderGames();
            console.log('🎮 Games manager initialized');
        } else {
            console.log('🎮 Games manager initialized (stats only)');
        }
    }

    loadGames() {
        this.games = [
            {
                id: 1,
                name: "Cookie Clicker",
                description: "Addictive clicking game with upgrades",
                category: "idle",
                genre: "Clicker",
                icon: "🍪",
                file: "games/cookieclicker.html",
                featured: true,
                premium: false,
                earlyAccess: false,
                tags: ["idle", "clicker", "incremental", "popular"]
            },
            {
                id: 7,
                name: "Balatro",
                description: "Poker-inspired roguelike deck builder",
                category: "strategy",
                genre: "Card Game",
                icon: "🃏",
                file: "games/balatro.html",
                featured: true,
                premium: true,
                earlyAccess: true,
                tags: ["strategy", "card", "roguelike", "premium"]
            },
            {
                id: 8,
                name: "Kindergarden 1",
                description: "Fun story game for kids",
                category: "story",
                genre: "Story Game",
                icon: "🍎",
                file: "games/kindergarden1.html",
                featured: true,
                premium: false,
                earlyAccess: true,
                tags: ["story", "kids", "adventure", "educational"]
            },
            {
                id: 9,
                name: "Kindergarden 2",
                description: "Premium story game with more adventures",
                category: "story",
                genre: "Story Game",
                icon: "🍎",
                file: "games/kindergarden2.html",
                featured: true,
                premium: true,
                earlyAccess: true,
                tags: ["story", "kids", "adventure", "premium", "educational"]
            }
        ];

        // Add play counts from stats
        this.games.forEach(game => {
            if (window.gameStats) {
                const stats = window.gameStats.getGameStats(game.id);
                game.playCount = stats ? stats.playCount : 0;
                game.lastPlayed = stats ? stats.lastPlayed : null;
            } else {
                game.playCount = 0;
                game.lastPlayed = null;
            }
        });

        this.sortGames();
        this.filteredGames = [...this.games];
        this.currentSort = 'default';
    }

    sortGames(sortType = 'default') {
        this.currentSort = sortType;
        const games = [...this.games];
        
        switch(sortType) {
            case 'popularity':
                games.sort((a, b) => {
                    const aPlays = a.playCount || 0;
                    const bPlays = b.playCount || 0;
                    return bPlays - aPlays;
                });
                break;
            case 'recent':
                games.sort((a, b) => {
                    const aTime = a.lastPlayed || 0;
                    const bTime = b.lastPlayed || 0;
                    return bTime - aTime;
                });
                break;
            case 'alphabetical':
                games.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'playCount':
                games.sort((a, b) => {
                    const aPlays = a.playCount || 0;
                    const bPlays = b.playCount || 0;
                    return bPlays - aPlays;
                });
                break;
            default:
                // Default: favorites first, then alphabetical
                games.sort((a, b) => {
                    if (typeof favoritesManager !== 'undefined') {
                        const aFavorite = favoritesManager.isFavorite(a.id);
                        const bFavorite = favoritesManager.isFavorite(b.id);
                        
                        if (aFavorite && !bFavorite) return -1;
                        if (!aFavorite && bFavorite) return 1;
                    }
                    return a.name.localeCompare(b.name);
                });
        }
        
        this.games = games;
    }

    sortFilteredGames(sortType = 'default') {
        this.currentSort = sortType;
        const games = [...this.filteredGames];
        
        switch(sortType) {
            case 'popularity':
            case 'playCount':
                games.sort((a, b) => {
                    const aPlays = a.playCount || 0;
                    const bPlays = b.playCount || 0;
                    return bPlays - aPlays;
                });
                break;
            case 'recent':
                games.sort((a, b) => {
                    const aTime = a.lastPlayed || 0;
                    const bTime = b.lastPlayed || 0;
                    return bTime - aTime;
                });
                break;
            case 'alphabetical':
                games.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                games.sort((a, b) => {
                    if (typeof favoritesManager !== 'undefined') {
                        const aFavorite = favoritesManager.isFavorite(a.id);
                        const bFavorite = favoritesManager.isFavorite(b.id);
                        if (aFavorite && !bFavorite) return -1;
                        if (!aFavorite && bFavorite) return 1;
                    }
                    return a.name.localeCompare(b.name);
                });
        }
        
        this.filteredGames = games;
        this.renderGames();
    }

    setupEventListeners() {
        if (this.gameSearch) {
            // Debounced search
            const debouncedFilter = window.Utils ? window.Utils.debounce(() => {
                this.filterGames();
            }, 300) : () => this.filterGames();

            this.gameSearch.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                this.toggleClearButton(e.target.value);
                
                // Add to search history
                if (window.searchHistory && e.target.value.trim()) {
                    // Don't add while typing, only on blur or enter
                }
                
                debouncedFilter();
                
                // Show suggestions
                if (window.searchHistory && this.games) {
                    this.showSuggestions(e.target.value);
                }
            });

            // Add search to history on blur or enter
            this.gameSearch.addEventListener('blur', () => {
                if (this.currentSearch.trim() && window.searchHistory) {
                    window.searchHistory.addSearch(this.currentSearch);
                }
                this.hideSuggestions();
            });

            this.gameSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && this.currentSearch.trim() && window.searchHistory) {
                    window.searchHistory.addSearch(this.currentSearch);
                    this.hideSuggestions();
                } else if (e.key === 'Escape') {
                    this.hideSuggestions();
                }
            });
        }

        if (this.clearSearchBtn) {
            this.clearSearchBtn.addEventListener('click', () => {
                this.gameSearch.value = '';
                this.currentSearch = '';
                this.filterGames();
                this.toggleClearButton('');
                this.hideSuggestions();
                this.gameSearch.focus();
            });
        }

        if (this.genreFilter) {
            this.genreFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.filterGames();
            });
        }

        // Sort filter
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.sortFilteredGames(e.target.value);
            });
        }
    }

    showSuggestions(term) {
        if (!term || term.length < 2) {
            this.hideSuggestions();
            return;
        }

        if (!window.searchHistory || !this.games) return;

        const suggestions = window.searchHistory.getSuggestions(term, this.games);
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        let suggestionsDiv = document.getElementById('search-suggestions');
        if (!suggestionsDiv) {
            suggestionsDiv = document.createElement('div');
            suggestionsDiv.id = 'search-suggestions';
            suggestionsDiv.className = 'search-suggestions';
            this.gameSearch.parentElement.appendChild(suggestionsDiv);
        }

        suggestionsDiv.innerHTML = suggestions.map(s => `
            <div class="suggestion-item" onclick="gamesManager.selectSuggestion('${s.replace(/'/g, "\\'")}')">
                ${s}
            </div>
        `).join('');
        suggestionsDiv.style.display = 'block';
    }

    hideSuggestions() {
        const suggestionsDiv = document.getElementById('search-suggestions');
        if (suggestionsDiv) {
            suggestionsDiv.style.display = 'none';
        }
    }

    selectSuggestion(suggestion) {
        this.gameSearch.value = suggestion;
        this.currentSearch = suggestion;
        this.filterGames();
        this.toggleClearButton(suggestion);
        this.hideSuggestions();
        if (window.searchHistory) {
            window.searchHistory.addSearch(suggestion);
        }
    }

    toggleClearButton(searchText) {
        if (this.clearSearchBtn) {
            this.clearSearchBtn.classList.toggle('show', searchText.length > 0);
        }
    }

    filterGames() {
        let filtered = [...this.games];

        if (this.currentSearch.trim()) {
            const term = this.currentSearch.toLowerCase();
            filtered = filtered.filter(game => 
                game.name.toLowerCase().includes(term) ||
                game.description.toLowerCase().includes(term) ||
                game.genre.toLowerCase().includes(term)
            );
        }

        if (this.currentCategory !== 'all') {
            if (this.currentCategory === 'favorites') {
                filtered = filtered.filter(game => 
                    typeof favoritesManager !== 'undefined' && favoritesManager.isFavorite(game.id)
                );
            } else {
                filtered = filtered.filter(game => game.category === this.currentCategory);
            }
        }

        this.filteredGames = filtered;
        this.renderGames();
    }

    renderGames() {
        // Don't render if games-grid doesn't exist (e.g., on index page)
        if (!this.gamesGrid || !this.noResults) {
            // Still load games for stats purposes
            return;
        }

        // Update game count badge
        this.updateGameCount();
        
        // Update continue playing section
        this.updateContinuePlaying();

        if (this.filteredGames.length === 0) {
            this.gamesGrid.style.display = 'none';
            this.noResults.style.display = 'block';
            return;
        }

        this.gamesGrid.style.display = 'grid';
        this.noResults.style.display = 'none';

        const userLevel = sessionStorage.getItem('purge_auth_level') || 'none';
        const hasPremiumAccess = userLevel === 'premium';
        
        // Update recent games badge
        this.updateRecentGamesBadge();
        
        // Show loading skeletons first
        this.showLoadingSkeletons();
        
        // Then render games with lazy loading
        setTimeout(() => {
            this.gamesGrid.innerHTML = this.filteredGames.map((game, index) => {
                const isFavorited = typeof favoritesManager !== 'undefined' && favoritesManager.isFavorite(game.id);
                const canPlayGame = !game.premium || hasPremiumAccess;
                const isEarlyAccess = game.earlyAccess === true;
                const playCount = game.playCount || 0;
                const tags = game.tags || [];
                
                return `
                <div class="game-card ${isFavorited ? 'favorite-game' : ''} ${!canPlayGame ? 'premium-game' : ''} ${isEarlyAccess ? 'early-access-game' : ''}" 
                     data-game-id="${game.id}"
                     data-index="${index}"
                     onclick="${canPlayGame ? `playGame('${game.file}', ${isEarlyAccess}, ${game.id}, '${game.name.replace(/'/g, "\\'")}')` : 'showPremiumRequired()'}"
                     onmouseenter="showGamePreview(${game.id})"
                     onmouseleave="hideGamePreview()">
                    ${!canPlayGame ? `<div class="premium-overlay"><div class="premium-lock"><i class="fas fa-crown"></i><span>Premium Required</span></div></div>` : ''}
                    ${isEarlyAccess ? `<div class="early-access-overlay"><div class="early-access-warning"><i class="fas fa-exclamation-triangle"></i><span>Early Access</span><small>This game is in development and may have bugs</small></div></div>` : ''}
                    <div class="game-icon">${game.icon}</div>
                    <div class="game-content">
                        <h3>${game.name}</h3>
                        <p>${game.description}</p>
                        <div class="game-meta">
                            <span class="game-category">${game.genre}</span>
                            ${playCount > 0 ? `<span class="play-count"><i class="fas fa-play"></i> ${playCount}</span>` : ''}
                            ${typeof favoritesManager !== 'undefined' ? `<button class="favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite(${game.id})" title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}"><i class="fas fa-heart"></i></button>` : ''}
                        </div>
                        ${tags.length > 0 ? `<div class="game-tags">${tags.slice(0, 3).map(tag => `<span class="game-tag">${tag}</span>`).join('')}</div>` : ''}
                        ${game.premium ? '<div class="premium-badge"><i class="fas fa-crown"></i> Premium</div>' : ''}
                        ${isEarlyAccess ? '<div class="early-access-badge"><i class="fas fa-flask"></i> Early Access</div>' : ''}
                    </div>
                </div>`;
            }).join('');
            
            // Initialize lazy loading
            this.initLazyLoading();
        }, 100);
    }

    updateContinuePlaying() {
        const section = document.getElementById('continue-playing-section');
        const grid = document.getElementById('continue-games-grid');
        if (!section || !grid) return;

        if (!window.recentGamesManager) {
            section.style.display = 'none';
            return;
        }

        const recentGames = window.recentGamesManager.getRecentGames().slice(0, 4);
        if (recentGames.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        const userLevel = sessionStorage.getItem('purge_auth_level') || 'none';
        const hasPremiumAccess = userLevel === 'premium';

        grid.innerHTML = recentGames.map(recent => {
            const game = this.games.find(g => g.id === recent.gameId);
            if (!game) return '';
            
            const canPlay = !game.premium || hasPremiumAccess;
            return `
                <div class="continue-game-card" onclick="${canPlay ? `playGame('${game.file}', ${game.earlyAccess}, ${game.id}, '${game.name.replace(/'/g, "\\'")}')` : 'showPremiumRequired()'}">
                    <div class="continue-game-icon">${game.icon}</div>
                    <div class="continue-game-info">
                        <h4>${game.name}</h4>
                        <p>Click to continue</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    showLoadingSkeletons() {
        if (!this.gamesGrid) return;
        const skeletonCount = Math.min(this.filteredGames.length, 12);
        this.gamesGrid.innerHTML = Array(skeletonCount).fill(0).map(() => `
            <div class="game-card skeleton">
                <div class="skeleton-icon"></div>
                <div class="skeleton-content">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-meta"></div>
                </div>
            </div>
        `).join('');
    }

    initLazyLoading() {
        const gameCards = document.querySelectorAll('.game-card:not(.skeleton)');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '50px' });

        gameCards.forEach(card => {
            card.classList.add('lazy-load');
            observer.observe(card);
        });
    }

    getUserAccessLevel() {
        return sessionStorage.getItem('purge_auth_level') || 'none';
    }

    // Method to refresh games after favorite toggle
    refreshGames() {
        this.sortGames(); // Re-sort with favorites first
        this.filterGames(); // Re-apply current filters
    }

    getGameById(gameId) {
        return this.games.find(game => game.id === gameId);
    }

    getFeaturedGames() {
        return this.games.filter(game => game.featured);
    }

    getGamesByCategory(category) {
        return this.games.filter(game => game.category === category);
    }

    getFreeGames() {
        return this.games.filter(game => !game.premium);
    }

    getPremiumGames() {
        return this.games.filter(game => game.premium);
    }
    
    updateRecentGamesBadge() {
        const header = document.querySelector('.games-header');
        if (!header) return;
        
        // Remove existing badge
        const existingBadge = header.querySelector('.recent-games-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add badge if there are recent games
        if (typeof recentGamesManager !== 'undefined') {
            const recentGames = recentGamesManager.getRecentGames();
            if (recentGames.length > 0) {
                const badge = document.createElement('div');
                badge.className = 'recent-games-badge';
                badge.innerHTML = `
                    <i class="fas fa-clock"></i>
                    <span>${recentGames.length} recent game${recentGames.length > 1 ? 's' : ''}</span>
                `;
                header.appendChild(badge);
            }
        }
    }

    updateGameCount() {
        let countBadge = document.getElementById('game-count-badge');
        if (!countBadge) {
            const header = document.querySelector('.games-header');
            if (header) {
                countBadge = document.createElement('div');
                countBadge.id = 'game-count-badge';
                countBadge.className = 'game-count-badge';
                header.appendChild(countBadge);
            }
        }
        if (countBadge) {
            const total = this.games.length;
            const showing = this.filteredGames.length;
            countBadge.textContent = showing === total 
                ? `${total} game${total !== 1 ? 's' : ''}`
                : `Showing ${showing} of ${total} game${total !== 1 ? 's' : ''}`;
        }
    }
}

// Global functions
function playGame(gameFile, isEarlyAccess = false, gameId = null, gameName = null) {
    window.debug?.log('🎮 Playing game:', gameFile);
    if (!gameFile) {
        window.debug?.error('No game file provided');
        if (window.Utils) {
            window.Utils.showError('No game file provided');
        }
        return;
    }
    
    // Show early access warning if needed
    if (isEarlyAccess) {
        const proceed = confirm('⚠️ EARLY ACCESS WARNING\n\nThis game is in early access and may have bugs, incomplete features, or performance issues.\n\nDo you want to continue?');
        if (!proceed) {
            return;
        }
    }
    
    // Track recent game
    if (gameId && gameName && window.recentGamesManager) {
        window.recentGamesManager.addGame(gameId, gameName, gameFile);
    }
    
    // Track game stats
    if (gameId && gameName && window.gameStats) {
        window.gameStats.recordGamePlay(gameId, gameName);
        // Trigger achievement check
        if (window.achievementSystem) {
            window.achievementSystem.checkAchievements();
        }
        // Dispatch event for other systems
        window.dispatchEvent(new CustomEvent('gamePlayed', { detail: { gameId, gameName } }));
    }
    
    // Check if tab manager is available - use tabs if on games page
    if (window.tabManager && window.location.pathname.includes('games.html')) {
        window.tabManager.openGameInNewTab(gameFile, gameName || 'Game');
        return;
    }
    
    // Otherwise navigate normally
    try {
        window.location.href = gameFile;
    } catch (e) {
        window.debug?.error('Error navigating to game:', e);
        if (window.Utils) {
            window.Utils.showError('Error loading game. Please try again.');
        } else {
            alert('Error loading game. Please try again.');
        }
    }
}

function showPremiumRequired() {
    // Create or show premium required modal
    const modal = document.getElementById('premium-required-modal') || createPremiumModal();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function createPremiumModal() {
    const modalHTML = `
        <div id="premium-required-modal" class="premium-modal">
            <div class="premium-modal-content">
                <div class="premium-header">
                    <i class="fas fa-crown"></i>
                    <h2>Premium Game</h2>
                </div>
                <div class="premium-body">
                    <p>This game requires a premium key to play.</p>
                    <div class="premium-features">
                        <div class="feature">
                            <i class="fas fa-gamepad"></i>
                            <span>Access to premium games</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-tools"></i>
                            <span>All tools and features</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-star"></i>
                            <span>Future updates and content</span>
                        </div>
                    </div>
                </div>
                <div class="premium-actions">
                    <button class="premium-btn primary" onclick="goToDiscord()">
                        <i class="fab fa-discord"></i>
                        Get Premium Key
                    </button>
                    <button class="premium-btn secondary" onclick="closePremiumModal()">
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.getElementById('premium-required-modal');
}

function closePremiumModal() {
    const modal = document.getElementById('premium-required-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function goToDiscord() {
    window.open('https://discord.gg/bS7Xgvyuu5', '_blank');
    closePremiumModal();
}

function toggleFavorite(gameId) {
    if (typeof favoritesManager !== 'undefined' && typeof gamesManager !== 'undefined') {
        const isNowFavorite = favoritesManager.toggleFavorite(gameId);
        const btn = event.target.closest('.favorite-btn');
        
        if (btn) {
            // Update button appearance immediately
            btn.classList.toggle('favorited', isNowFavorite);
            btn.title = isNowFavorite ? 'Remove from favorites' : 'Add to favorites';
            
            // Update the parent game card appearance immediately
            const gameCard = btn.closest('.game-card');
            if (gameCard) {
                gameCard.classList.toggle('favorite-game', isNowFavorite);
            }
            
            console.log(`❤️ Favorite ${isNowFavorite ? 'added' : 'removed'} for game ${gameId}`);
            
            // Refresh the games display to re-sort and re-filter
            gamesManager.refreshGames();
        }
    } else {
        console.warn('⚠️ Favorites manager or games manager not available');
    }
}

// Navigate back to home
function goHome() {
    window.location.href = 'index.html';
}

// Game Preview Functions
let previewTimeout = null;
function showGamePreview(gameId) {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
        const modal = document.getElementById('game-preview-modal');
        const content = document.getElementById('preview-content');
        if (!modal || !content || !gamesManager) return;

        const game = gamesManager.games.find(g => g.id === gameId);
        if (!game) return;

        const stats = window.gameStats ? window.gameStats.getGameStats(gameId) : null;
        const playCount = stats ? stats.playCount : 0;
        const tags = game.tags || [];

        content.innerHTML = `
            <div class="preview-header">
                <div class="preview-icon">${game.icon}</div>
                <div class="preview-title">
                    <h3>${game.name}</h3>
                    <p>${game.description}</p>
                </div>
            </div>
            <div class="preview-details">
                <div class="preview-stat">
                    <i class="fas fa-tag"></i>
                    <span>${game.genre}</span>
                </div>
                ${playCount > 0 ? `
                <div class="preview-stat">
                    <i class="fas fa-play"></i>
                    <span>${playCount} plays</span>
                </div>
                ` : ''}
                ${game.premium ? '<div class="preview-badge premium"><i class="fas fa-crown"></i> Premium</div>' : ''}
                ${game.earlyAccess ? '<div class="preview-badge early"><i class="fas fa-flask"></i> Early Access</div>' : ''}
            </div>
            ${tags.length > 0 ? `
            <div class="preview-tags">
                ${tags.map(tag => `<span class="preview-tag">${tag}</span>`).join('')}
            </div>
            ` : ''}
            <div class="preview-actions">
                <button class="preview-btn primary" onclick="playGame('${game.file}', ${game.earlyAccess}, ${game.id}, '${game.name.replace(/'/g, "\\'")}'); hideGamePreview();">
                    <i class="fas fa-play"></i> Play Now
                </button>
            </div>
        `;
        modal.classList.add('active');
    }, 500);
}

function hideGamePreview() {
    clearTimeout(previewTimeout);
    const modal = document.getElementById('game-preview-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize games manager
let gamesManager;

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on games page, or create a minimal instance for stats
    if (document.getElementById('games-grid')) {
        gamesManager = new GamesManager();
        
        // Close preview on click outside
        const previewModal = document.getElementById('game-preview-modal');
        if (previewModal) {
            previewModal.addEventListener('click', (e) => {
                if (e.target === previewModal) {
                    hideGamePreview();
                }
            });
        }
    } else {
        // On other pages (like index), create a minimal instance just for stats
        try {
            gamesManager = new GamesManager();
            // Don't render games if we're not on the games page
            if (gamesManager.gamesGrid) {
                gamesManager.gamesGrid = null;
            }
        } catch (e) {
            console.log('Games manager not needed on this page');
        }
    }
});

// Function to open new tab from games page
function openNewTabFromGames() {
    if (window.tabManager) {
        window.tabManager.openNewTab();
    }
}