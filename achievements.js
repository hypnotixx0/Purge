// achievements.js - Achievement System
class AchievementSystem {
    constructor() {
        this.STORAGE_KEY = 'purge_achievements';
        this.achievements = this.loadAchievements();
        this.unlockedAchievements = this.loadUnlocked();
        this.init();
    }

    init() {
        this.checkAchievements();
        // Listen for game plays
        window.addEventListener('gamePlayed', (e) => {
            this.checkAchievements();
        });
    }

    loadAchievements() {
        return {
            firstGame: {
                id: 'firstGame',
                name: 'First Steps',
                description: 'Play your first game',
                icon: '🎮',
                points: 10
            },
            gameMaster: {
                id: 'gameMaster',
                name: 'Game Master',
                description: 'Play 10 different games',
                icon: '👑',
                points: 50
            },
            collector: {
                id: 'collector',
                name: 'Collector',
                description: 'Add 5 games to favorites',
                icon: '⭐',
                points: 30
            },
            explorer: {
                id: 'explorer',
                name: 'Explorer',
                description: 'Play games from 3 different categories',
                icon: '🗺️',
                points: 40
            },
            dedicated: {
                id: 'dedicated',
                name: 'Dedicated',
                description: 'Play the same game 10 times',
                icon: '🔥',
                points: 25
            },
            themeMaster: {
                id: 'themeMaster',
                name: 'Theme Master',
                description: 'Try 5 different themes',
                icon: '🎨',
                points: 20
            },
            speedRunner: {
                id: 'speedRunner',
                name: 'Speed Runner',
                description: 'Play 5 games in one session',
                icon: '⚡',
                points: 35
            },
            tabMaster: {
                id: 'tabMaster',
                name: 'Tab Master',
                description: 'Open 5 games in tabs',
                icon: '📑',
                points: 30
            }
        };
    }

    loadUnlocked() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveUnlocked() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.unlockedAchievements));
        } catch (e) {
            console.error('Error saving achievements:', e);
        }
    }

    unlockAchievement(achievementId) {
        if (this.unlockedAchievements.includes(achievementId)) {
            return false; // Already unlocked
        }

        const achievement = this.achievements[achievementId];
        if (!achievement) return false;

        this.unlockedAchievements.push(achievementId);
        this.saveUnlocked();
        this.showAchievementNotification(achievement);
        return true;
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
                <div class="achievement-points">+${achievement.points} points</div>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    checkAchievements() {
        // Check first game
        if (window.gameStats) {
            const stats = window.gameStats.getTotalStats();
            if (stats.totalPlays > 0 && !this.unlockedAchievements.includes('firstGame')) {
                this.unlockAchievement('firstGame');
            }
            if (stats.uniqueGames >= 10 && !this.unlockedAchievements.includes('gameMaster')) {
                this.unlockAchievement('gameMaster');
            }
        }

        // Check favorites
        if (window.favoritesManager) {
            const favorites = window.favoritesManager.getFavorites();
            if (favorites.length >= 5 && !this.unlockedAchievements.includes('collector')) {
                this.unlockAchievement('collector');
            }
        }

        // Check tabs
        if (window.tabManager && window.tabManager.tabs.length >= 5 && !this.unlockedAchievements.includes('tabMaster')) {
            this.unlockAchievement('tabMaster');
        }
    }

    getUnlockedCount() {
        return this.unlockedAchievements.length;
    }

    getTotalPoints() {
        return this.unlockedAchievements.reduce((total, id) => {
            const achievement = this.achievements[id];
            return total + (achievement ? achievement.points : 0);
        }, 0);
    }

    getAllAchievements() {
        return Object.values(this.achievements).map(achievement => ({
            ...achievement,
            unlocked: this.unlockedAchievements.includes(achievement.id)
        }));
    }
}

const achievementSystem = new AchievementSystem();
window.achievementSystem = achievementSystem;

