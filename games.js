// games.js - Fully working version with Premium Games Support
class GamesManager {
    constructor() {
        this.games = [];
        this.filteredGames = [];
        this.currentSort = 'default';

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

        // Add play stats if available
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

        this.filteredGames = [...this.games];
    }

    setupEventListeners() {
        if (this.gameSearch) {
            this.gameSearch.addEventListener('input', () => this.filterGames());
        }
        if (this.clearSearchBtn) {
            this.clearSearchBtn.addEventListener('click', () => {
                if (this.gameSearch) this.gameSearch.value = '';
                this.filterGames();
            });
        }
        if (this.genreFilter) {
            this.genreFilter.addEventListener('change', () => this.filterGames());
        }
    }

    filterGames() {
        const searchTerm = this.gameSearch?.value.toLowerCase() || '';
        const genre = this.genreFilter?.value || 'all';

        this.filteredGames = this.games.filter(game => {
            const matchesSearch = game.name.toLowerCase().includes(searchTerm);
            const matchesGenre = genre === 'all' || game.genre === genre;
            return matchesSearch && matchesGenre;
        });

        this.renderGames();
    }

    renderGames() {
        if (!this.gamesGrid) return;

        this.gamesGrid.innerHTML = '';

        if (this.filteredGames.length === 0) {
            if (this.noResults) this.noResults.style.display = 'block';
            return;
        } else {
            if (this.noResults) this.noResults.style.display = 'none';
        }

        this.filteredGames.forEach(game => {
            const card = document.createElement('div');
            card.className = `game-card${game.premium ? ' premium-game' : ''}`;
            card.innerHTML = `
                <div class="game-icon">${game.icon}</div>
                <div class="game-content">
                    <h3>${game.name}</h3>
                    <p>${game.description}</p>
                    ${game.premium ? '<span class="premium-label">Premium</span>' : ''}
                </div>
            `;
            card.addEventListener('click', () => this.playGame(game));
            this.gamesGrid.appendChild(card);
        });
    }

    playGame(game) {
        if (game.premium && !this.userHasAccess(game)) {
            this.showPremiumRequired();
            return;
        }
        window.location.href = game.file;
        game.playCount = (game.playCount || 0) + 1;
        game.lastPlayed = Date.now();
    }

    userHasAccess(game) {
        // Replace this with your actual premium access logic
        return !game.premium; 
    }

    showPremiumRequired() {
        alert("This is a premium game! Please upgrade to play.");
    }

    getGameById(id) {
        return this.games.find(g => g.id === id);
    }

    getPremiumGames() {
        return this.games.filter(g => g.premium);
    }

    getFreeGames() {
        return this.games.filter(g => !g.premium);
    }
}

// Initialize games manager
let gamesManager;

document.addEventListener('DOMContentLoaded', () => {
    gamesManager = new GamesManager();
});
