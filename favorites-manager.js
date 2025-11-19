// favorites-manager.js - Enhanced Version
class FavoritesManager {
    constructor() {
        this.favoritesKey = 'angst_favorites';
        this.favorites = new Set();
        this.loadFavorites();
    }

    loadFavorites() {
        try {
            const saved = localStorage.getItem(this.favoritesKey);
            if (saved) {
                this.favorites = new Set(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Error loading favorites:', e);
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem(this.favoritesKey, JSON.stringify([...this.favorites]));
        } catch (e) {
            console.error('Error saving favorites:', e);
        }
    }

    toggleFavorite(gameId) {
        if (this.favorites.has(gameId)) {
            this.favorites.delete(gameId);
            console.log('💔 Removed from favorites:', gameId);
        } else {
            this.favorites.add(gameId);
            console.log('❤️ Added to favorites:', gameId);
        }
        this.saveFavorites();
        return this.favorites.has(gameId);
    }

    isFavorite(gameId) {
        return this.favorites.has(gameId);
    }

    getFavorites() {
        return [...this.favorites];
    }

    // New method to check if a game should be sorted as favorite
    getFavoriteSortOrder(gameId) {
        return this.isFavorite(gameId) ? 0 : 1; // 0 for favorites (top), 1 for non-favorites
    }
}

const favoritesManager = new FavoritesManager();