// admin.js - Admin Console for /Purge

document.addEventListener('DOMContentLoaded', () => {
    const adminKeyInput = document.getElementById('admin-key-input');
    const adminKeySubmit = document.getElementById('admin-key-submit');
    const adminContent = document.getElementById('admin-content');
    const gameNameInput = document.getElementById('game-name');
    const gameDescriptionInput = document.getElementById('game-description');
    const gameCategorySelect = document.getElementById('game-category');
    const gameGenreInput = document.getElementById('game-genre');
    const gameIconInput = document.getElementById('game-icon');
    const gameFileInput = document.getElementById('game-file');
    const gamePremiumCheckbox = document.getElementById('game-premium');
    const gameEarlyCheckbox = document.getElementById('game-early');
    const gameTagsInput = document.getElementById('game-tags');
    const gameIdInput = document.getElementById('game-id');
    const generateBtn = document.getElementById('generate-snippets');
    const resetBtn = document.getElementById('reset-form');
    const snippetJS = document.getElementById('snippet-js');
    const snippetHTML = document.getElementById('snippet-html');

    // Unlock console
    adminKeySubmit.addEventListener('click', () => {
        if (adminKeyInput.value === 'unhiindev') {
            adminContent.style.display = 'block';
            document.getElementById('admin-key-gate').style.display = 'none';
        } else {
            alert('Incorrect key!');
        }
    });

    // Reset form
    resetBtn.addEventListener('click', () => {
        gameNameInput.value = '';
        gameDescriptionInput.value = '';
        gameCategorySelect.value = 'idle';
        gameGenreInput.value = '';
        gameIconInput.value = '';
        gameFileInput.value = '';
        gamePremiumCheckbox.checked = false;
        gameEarlyCheckbox.checked = false;
        gameTagsInput.value = '';
        gameIdInput.value = '';
        snippetJS.textContent = '';
        snippetHTML.textContent = '';
    });

    // Generate JS / HTML snippet
    generateBtn.addEventListener('click', () => {
        let games = JSON.parse(localStorage.getItem('gamesList') || '[]');

        // Determine next ID automatically
        const nextId = gameIdInput.value
            ? parseInt(gameIdInput.value)
            : (games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1);

        // Collect game data
        const newGame = {
            id: nextId,
            name: gameNameInput.value,
            description: gameDescriptionInput.value,
            category: gameCategorySelect.value,
            genre: gameGenreInput.value,
            icon: gameIconInput.value,
            file: gameFileInput.value,
            premium: gamePremiumCheckbox.checked,
                       access: gameEarlyCheckbox.checked,
            tags: gameTagsInput.value.split(',').map(t => t.trim()).filter(t => t),
            theme: window.themeManager?.currentTheme || 'default', // Add current theme
            popup: true // automatically include popup support
        };

        // Add game to local cache
        games.push(newGame);
        localStorage.setItem('gamesList', JSON.stringify(games));

        // Generate JS snippet for games.js
        const jsEntry = `
{
    id: ${newGame.id},
    name: "${newGame.name.replace(/"/g, '\\"')}",
    description: "${newGame.description.replace(/"/g, '\\"')}",
    category: "${newGame.category}",
    genre: "${newGame.genre.replace(/"/g, '\\"')}",
    icon: "${newGame.icon}",
    file: "${newGame.file}",
    premium: ${newGame.premium},
    earlyAccess: ${newGame.earlyAccess},
    tags: [${newGame.tags.map(tag => `"${tag}"`).join(', ')}],
    theme: "${newGame.theme}",
    popup: ${newGame.popup}
}
        `.trim();

        snippetJS.textContent = jsEntry;

        // Optional wrapper HTML snippet (to save to game file path)
        const htmlWrapper = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${newGame.name}</title>
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/games.css">
<script src="/games.js"></script>
</head>
<body class="${newGame.theme}">
<div id="game-container"></div>
<script>
    // Automatically show popup when game loads
    if (${newGame.popup}) {
        window.addEventListener('DOMContentLoaded', () => {
            const modal = document.createElement('div');
            modal.className = 'game-popup';
            modal.innerHTML = '<h2>${newGame.name}</h2><p>${newGame.description}</p><button onclick="this.parentElement.remove()">Close</button>';
            document.body.appendChild(modal);
        });
    }
</script>
</body>
</html>
        `.trim();

        snippetHTML.textContent = htmlWrapper;

        alert('✅ Game snippet generated! Copy the JS to games.js and save the HTML wrapper.');
    });
});
