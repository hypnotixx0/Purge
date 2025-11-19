// recent-games.js - Track Recently Played Games
class RecentGamesManager {
    constructor() {
        this.STORAGE_KEY = 'purge_recent_games';
        this.maxRecent = 5;
        this.recentGames = [];
        this.loadRecentGames();
    }

    loadRecentGames() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                this.recentGames = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading recent games:', e);
            this.recentGames = [];
        }
    }

    saveRecentGames() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.recentGames));
        } catch (e) {
            console.error('Error saving recent games:', e);
        }
    }

    addGame(gameId, gameName, gameFile) {
        // Remove if already exists
        this.recentGames = this.recentGames.filter(g => g.id !== gameId);
        
        // Add to beginning
        this.recentGames.unshift({
            id: gameId,
            name: gameName,
            file: gameFile,
            timestamp: Date.now()
        });
        
        // Keep only max recent
        if (this.recentGames.length > this.maxRecent) {
            this.recentGames = this.recentGames.slice(0, this.maxRecent);
        }
        
        this.saveRecentGames();
    }

    getRecentGames() {
        return this.recentGames;
    }

    clearRecentGames() {
        this.recentGames = [];
        this.saveRecentGames();
    }
}

// Initialize recent games manager
const recentGamesManager = new RecentGamesManager();
window.recentGamesManager = recentGamesManager;

