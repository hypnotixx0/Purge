// achievements-display.js - Display achievements over category boxes
function updateAchievementsDisplay() {
    const display = document.getElementById('achievements-display');
    if (!display || !window.achievementSystem) return;

    const achievements = window.achievementSystem.getAllAchievements();
    
    // Show only unlocked achievements, or show locked ones too (you can change this)
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    
    if (unlockedAchievements.length === 0) {
        display.style.display = 'none';
        return;
    }

    display.style.display = 'flex';
    
    // Show top 6 achievements (or all if less than 6)
    const achievementsToShow = unlockedAchievements.slice(0, 6);
    
    display.innerHTML = achievementsToShow.map(achievement => `
        <div class="achievement-badge unlocked" title="${achievement.description}">
            <div class="achievement-badge-icon">${achievement.icon}</div>
            <div class="achievement-badge-content">
                <div class="achievement-badge-name">${achievement.name}</div>
                <div class="achievement-badge-desc">${achievement.description}</div>
            </div>
            <div class="achievement-badge-points">+${achievement.points}</div>
        </div>
    `).join('');
}

// Update on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(updateAchievementsDisplay, 1500);
    });
} else {
    setTimeout(updateAchievementsDisplay, 1500);
}

// Update when achievements are unlocked
window.addEventListener('achievementUnlocked', () => {
    setTimeout(updateAchievementsDisplay, 500);
});

// Also check periodically
setInterval(updateAchievementsDisplay, 5000);

