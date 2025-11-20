// ===============================
// Admin Console Script - /Purge
// Automatic ID, Popup Support
// ===============================

// Utility shortcut
function el(id){ return document.getElementById(id); }

// -------------------------------
// DEVELOPER KEY CHECK
// -------------------------------
function unlockAdmin(){
  const input = el("admin-key-input").value.trim();
  if (input === "unhiindev"){
    el("admin-key-gate").style.display = "none";
    el("admin-content").style.display = "block";
    computeNextIdAndSetPlaceholder();
  } else {
    alert("Invalid developer key.");
  }
}

el("admin-key-submit").addEventListener("click", unlockAdmin);

// Allow ENTER key
el("admin-key-input").addEventListener("keydown", e=>{
  if(e.key === "Enter"){ unlockAdmin(); }
});

// -------------------------------
// AUTO-ID SYSTEM
// -------------------------------
let nextGameId = 1;

function computeNextId(){
  try{
    if(window.gamesManager && Array.isArray(window.gamesManager.games)){
      const ids = window.gamesManager.games
        .map(g=>g.id)
        .filter(id=>Number.isInteger(id));

      const max = ids.length ? Math.max(...ids) : 0;
      return max + 1;
    }
  }catch(e){}

  return 1;
}

function computeNextIdAndSetPlaceholder(){
  nextGameId = computeNextId();
  const idField = el("game-id");
  if(idField){
    idField.placeholder = `Auto: ${nextGameId}`;
  }
}

// -------------------------------
// BUILD GAME BROWSER PAGE
// Uses a universal tab UI like your sample
// -------------------------------
function buildBrowserTabHtml(data){
return `<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" href="/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico" type="image/x-icon">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - /Purge</title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/games/game-browser.css">
    <script src="/tab-cloaking.js"></script>
    <script src="/theme-manager.js"></script>
</head>
<body>
  <div class="browser-container">

      <div class="browser-tabs">
          <div class="tab active">
              <span class="tab-icon">${data.icon}</span>
              <span>${data.name}</span>
              <button class="tab-close" onclick="closeGame()">
                  <i class="fas fa-times"></i>
              </button>
          </div>
      </div>

      <div class="browser-toolbar">
          <div class="toolbar-left">
              <button class="toolbar-btn" onclick="goBack()">
                  <i class="fas fa-arrow-left"></i>
              </button>
              <button class="toolbar-btn" onclick="goForward()">
                  <i class="fas fa-arrow-right"></i>
              </button>
              <button class="toolbar-btn" onclick="refreshGame()">
                  <i class="fas fa-redo"></i>
              </button>
              <button class="toolbar-btn" onclick="goHome()">
                  <i class="fas fa-home"></i>
              </button>
          </div>

          <div class="toolbar-center">
              <div class="address-bar">
                  <i class="fas fa-lock"></i>
                  <span id="current-url">${data.file}</span>
              </div>
          </div>

          <div class="toolbar-right">
              <button class="toolbar-btn" onclick="openInNewTab()" title="Open in new tab">
                  <i class="fas fa-external-link-alt"></i>
              </button>
              <button class="toolbar-btn" onclick="toggleFullscreen()" title="Fullscreen">
                  <i class="fas fa-expand"></i>
              </button>
          </div>
      </div>

      <div class="browser-content">
          <iframe 
              src="${data.file}" 
              id="game-frame"
              frameborder="0"
              allowfullscreen
          ></iframe>
      </div>
  </div>

  <script src="/games/game-browser.js"></script>
  <script src="/games/theme-tab-updater.js"></script>
  <script>
      document.addEventListener('DOMContentLoaded', function() {
          if (window.themeManager) {
              const theme = window.themeManager.getCurrentTheme();
              const themeName = window.themeManager.getThemes()[theme]?.name || 'Dark';
              document.title = "${data.name} - " + themeName + " Theme - /Purge";
          }
      });
  </script>
</body>
</html>`;
}


// -------------------------------
// GENERATE GAME ENTRY + HTML
// -------------------------------
function generate(){
  const data = {
    name: el("game-name").value.trim(),
    description: el("game-description").value.trim(),
    category: el("game-category").value,
    genre: el("game-genre").value.trim(),
    icon: el("game-icon").value.trim() || "🎮",
    file: el("game-file").value.trim(),
    premium: el("game-premium").checked,
    earlyAccess: el("game-early").checked,
    tags: el("game-tags").value.split(",").map(t=>t.trim()).filter(t=>t),
    id: parseInt(el("game-id").value,10) || nextGameId
  };

  // Basic validation
  if(!data.name || !data.description || !data.file){
    alert("Game Name, Description, and File Path are required.");
    return;
  }

  // JS SNIPPET FOR games.js
  const jsEntry = `{
    id: ${data.id},
    name: "${data.name.replace(/"/g,'\\"')}",
    description: "${data.description.replace(/"/g,'\\"')}",
    category: "${data.category}",
    genre: "${data.genre}",
    icon: "${data.icon}",
    file: "${data.file}",
    premium: ${data.premium},
    earlyAccess: ${data.earlyAccess},
    tags: [${data.tags.map(t=>`"${t.replace(/"/g,'\\"')}"`).join(', ')}]
  }`;

  // HTML Wrapper Output
  const htmlWrapper = buildBrowserTabHtml(data);

  // Show output
  el("snippet-js").textContent = jsEntry;
  el("snippet-html").textContent = htmlWrapper;

  // Increment next ID
  nextGameId++;
  el("game-id").value = "";
  el("game-id").placeholder = `Auto: ${nextGameId}`;
}

el("generate-snippets").addEventListener("click", generate);


// -------------------------------
// RESET FORM
// -------------------------------
el("reset-form").addEventListener("click", ()=>{
  document.querySelectorAll(".admin-form input").forEach(i=>i.value="");
  computeNextIdAndSetPlaceholder();
});
