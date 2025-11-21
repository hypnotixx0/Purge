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
            },
            {
                id: 10,
                name: "Slope",
                description: "High-speed 3D ball rolling game",
                category: "arcade",
                genre: "Action",
                icon: "⛰️",
                file: "games/slope/slopegame.html",
                featured: true,
                premium: false,
                earlyAccess: false,
                tags: ["arcade", "action", "3d", "popular"]
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
                games.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
                break;
            case 'recent':
                games.sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
                break;
            case 'alphabetical':
                games.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'playCount':
                games.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
                break;
            default:
                games.sort((a, b) => {
                    if (typeof favoritesManager !== 'undefined') {
                        const aFav = favoritesManager.isFavorite(a.id);
                        const bFav = favoritesManager.isFavorite(b.id);
                        if (aFav && !bFav) return -1;
                        if (!aFav && bFav) return 1;
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
                games.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
                break;
            case 'recent':
                games.sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
                break;
            case 'alphabetical':
                games.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                games.sort((a, b) => {
                    if (typeof favoritesManager !== 'undefined') {
                        const aFav = favoritesManager.isFavorite(a.id);
                        const bFav = favoritesManager.isFavorite(b.id);
                        if (aFav && !bFav) return -1;
                        if (!aFav && bFav) return 1;
                    }
                    return a.name.localeCompare(b.name);
                });
        }
        
        this.filteredGames = games;
        this.renderGames();
    }

    setupEventListeners() {
        // ... keep all event listener code as before
    }

    showSuggestions(term) { /* unchanged */ }
    hideSuggestions() { /* unchanged */ }
    selectSuggestion(suggestion) { /* unchanged */ }
    toggleClearButton(searchText) { /* unchanged */ }
    filterGames() { /* unchanged */ }
    renderGames() { /* unchanged */ }
    updateContinuePlaying() { /* unchanged */ }
    showLoadingSkeletons() { /* unchanged */ }
    initLazyLoading() { /* unchanged */ }
    getUserAccessLevel() { /* unchanged */ }
    refreshGames() { /* unchanged */ }
    getGameById(gameId) { return this.games.find(game => game.id === gameId); }
    getFeaturedGames() { return this.games.filter(game => game.featured); }
    getGamesByCategory(category) { return this.games.filter(game => game.category === category); }
    getFreeGames() { return this.games.filter(game => !game.premium); }
    getPremiumGames() { return this.games.filter(game => game.premium); }
    updateRecentGamesBadge() { /* unchanged */ }
    updateGameCount() { /* unchanged */ }
}

// Global functions (playGame, showPremiumRequired, closePremiumModal, toggleFavorite, etc.) remain unchanged

// Initialize games manager
let gamesManager;

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('games-grid')) {
        gamesManager = new GamesManager();
        window.addEventListener('gamePlayed', (e) => {
            const d = e.detail || {};
            if (gamesManager && d.gameId) {
                const g = gamesManager.getGameById(d.gameId);
                if (g) {
                    g.playCount = (g.playCount || 0) + 1;
                    g.lastPlayed = Date.now();
                    gamesManager.refreshGames();
                }
            }
        });
        
        const previewModal = document.getElementById('game-preview-modal');
        if (previewModal) {
            previewModal.addEventListener('click', (e) => {
                if (e.target === previewModal) hideGamePreview();
            });
        }
    } else {
        gamesManager = new GamesManager();
        if (gamesManager.gamesGrid) gamesManager.gamesGrid = null;
    }
});
