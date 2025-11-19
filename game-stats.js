// game-stats.js - Track game statistics
class GameStats {
    constructor() {
        this.STORAGE_KEY = 'purge_game_stats';
        this.stats = this.loadStats();
    }

    loadStats() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? JSON.parse(saved) : {
                gamesPlayed: {},
                totalPlays: 0,
                totalPlayTime: 0,
                lastPlayed: null
            };
        } catch (e) {
            window.debug?.error('Error loading game stats:', e);
            return {
                gamesPlayed: {},
                totalPlays: 0,
                totalPlayTime: 0,
                lastPlayed: null
            };
        }
    }

    saveStats() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats));
        } catch (e) {
            window.debug?.error('Error saving game stats:', e);
        }
    }

    recordGamePlay(gameId, gameName) {
        if (!this.stats.gamesPlayed[gameId]) {
            this.stats.gamesPlayed[gameId] = {
                name: gameName,
                playCount: 0,
                totalTime: 0,
                lastPlayed: null
            };
        }
        this.stats.gamesPlayed[gameId].playCount++;
        this.stats.gamesPlayed[gameId].lastPlayed = Date.now();
        this.stats.totalPlays++;
        this.stats.lastPlayed = Date.now();
        this.saveStats();
    }

    recordPlayTime(gameId, timeMs) {
        if (this.stats.gamesPlayed[gameId]) {
            this.stats.gamesPlayed[gameId].totalTime += timeMs;
            this.stats.totalPlayTime += timeMs;
            this.saveStats();
        }
    }

    getMostPlayedGames(limit = 5) {
        return Object.entries(this.stats.gamesPlayed)
            .sort((a, b) => b[1].playCount - a[1].playCount)
            .slice(0, limit)
            .map(([id, data]) => ({ id: parseInt(id), ...data }));
    }

    getTotalStats() {
        return {
            totalPlays: this.stats.totalPlays,
            totalPlayTime: this.stats.totalPlayTime,
            uniqueGames: Object.keys(this.stats.gamesPlayed).length
        };
    }

    getGameStats(gameId) {
        return this.stats.gamesPlayed[gameId] || null;
    }
}

const gameStats = new GameStats();
window.gameStats = gameStats;

