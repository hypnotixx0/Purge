// search-history.js - Search history and autocomplete
class SearchHistory {
    constructor() {
        this.STORAGE_KEY = 'purge_search_history';
        this.maxHistory = 10;
        this.history = this.loadHistory();
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            window.debug?.error('Error loading search history:', e);
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history));
        } catch (e) {
            window.debug?.error('Error saving search history:', e);
        }
    }

    addSearch(term) {
        if (!term || term.trim().length === 0) return;
        term = term.trim().toLowerCase();
        
        // Remove if already exists
        this.history = this.history.filter(h => h !== term);
        
        // Add to beginning
        this.history.unshift(term);
        
        // Keep only max history
        if (this.history.length > this.maxHistory) {
            this.history = this.history.slice(0, this.maxHistory);
        }
        
        this.saveHistory();
    }

    getHistory() {
        return [...this.history];
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    getSuggestions(term, games) {
        if (!term || term.length < 2) return [];
        
        const lowerTerm = term.toLowerCase();
        const suggestions = new Set();
        
        // Search in game names, descriptions, genres
        games.forEach(game => {
            if (game.name.toLowerCase().includes(lowerTerm)) {
                suggestions.add(game.name);
            }
            if (game.description.toLowerCase().includes(lowerTerm)) {
                suggestions.add(game.description.substring(0, 50));
            }
            if (game.genre.toLowerCase().includes(lowerTerm)) {
                suggestions.add(game.genre);
            }
        });
        
        // Add matching history items
        this.history.forEach(h => {
            if (h.includes(lowerTerm)) {
                suggestions.add(h);
            }
        });
        
        return Array.from(suggestions).slice(0, 5);
    }
}

const searchHistory = new SearchHistory();
window.searchHistory = searchHistory;

