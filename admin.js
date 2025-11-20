(function(){
  'use strict';

  const KEY = 'unhiindev';

  // Elements
  const keyGate   = document.getElementById('admin-key-gate');
  const keyInput  = document.getElementById('admin-key-input');
  const keySubmit = document.getElementById('admin-key-submit');
  const content   = document.getElementById('admin-content');

  function unlock() {
    keyGate.style.display = 'none';
    content.style.display = '';
    sessionStorage.setItem('purge_admin_access', 'true');
  }

  function validateKey() {
    const val = (keyInput.value || '').trim();
    if (val === KEY) {
      unlock();
    } else {
      alert('Invalid developer key');
    }
  }

  if (sessionStorage.getItem('purge_admin_access') === 'true') {
    unlock();
  }

  keySubmit.addEventListener('click', validateKey);
  keyInput.addEventListener('keypress', (e)=>{ if(e.key==='Enter') validateKey(); });

  // Helper functions
  const el   = (id)=>document.getElementById(id);
  const safe = (s)=> (s||'').replace(/`/g,'\\`');


  // --------------------------------------------------------
  // HTML FILE GENERATOR (your game browser template)
  // --------------------------------------------------------
  function buildBrowserTabHtml(data){
    const title = safe(data.name || 'New Game');
    const icon  = safe(data.icon || '🎮');
    const src   = safe(data.embed || '');
    const addr  = (data.file && data.file.split('/').pop()) || (src ? src.split('/').pop() : '');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" href="/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico" type="image/x-icon">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - /Purge</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/games/game-browser.css">

    <script src="/tab-cloaking.js"></script>
    <script src="/theme-manager.js"></script>
</head>
<body>
    <div class="browser-container">
        
        <!-- Browser Tabs -->
        <div class="browser-tabs">
            <div class="tab active">
                <span class="tab-icon">${icon}</span>
                <span>${title}</span>
                <button class="tab-close" onclick="closeGame()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        
        <!-- Browser Toolbar -->
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
                    <span id="current-url">${addr}</span>
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
        
        <!-- Game Content -->
        <div class="browser-content">
            <iframe 
                src="${src}" 
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
                document.title = \`${title} - \${themeName} Theme - /Purge\`;
            }
        });
    </script>
</body>
</html>`;
  }


  // Download helper
  function download(filename, content){
    const blob = new Blob([content], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }


  // Generate final HTML
  function onGenerate(){
    const data = {
      name: el('game-name').value,
      description: el('game-description').value,
      category: el('game-category').value,
      genre: el('game-genre').value,
      icon: el('game-icon').value,
      file: el('game-file').value,
      premium: el('game-premium').checked,
      early: el('game-early').checked,
      tags: el('game-tags').value,
      embed: el('game-embed-url')?.value || '',
      id: parseInt(el('game-id').value, 10) || null,
    };

    if(!data.name || !data.description || !data.file){
      alert('Please fill out required fields.');
      return;
    }

    const filename = (data.file.endsWith('.html') ? data.file : `${data.file}.html`).split('/').pop();
    const html = buildBrowserTabHtml(data);

    // Put into output window
    el('snippet-html').textContent = html;

    alert('HTML generated. Copy from Output or Download.');
  }


  // Reset form
  function onReset(){
    [
      'game-name','game-description','game-genre',
      'game-icon','game-file','game-tags',
      'game-id','game-embed-url'
    ].forEach(id => { const i = el(id); if(i) i.value=''; });

    el('game-category').value = 'idle';
    el('game-premium').checked = false;
    el('game-early').checked  = false;
  }


  // Bind buttons
  const genBtn   = document.getElementById('generate-snippets');
  const resetBtn = document.getElementById('reset-form');
  
  if (genBtn)  genBtn.addEventListener('click', onGenerate);
  if (resetBtn) resetBtn.addEventListener('click', onReset);

})();
