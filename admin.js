(function(){
  'use strict';

  const KEY = 'unhiindev';

  const keyGate = document.getElementById('admin-key-gate');
  const keyInput = document.getElementById('admin-key-input');
  const keySubmit = document.getElementById('admin-key-submit');
  const content = document.getElementById('admin-content');

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

  // Form elements
  const el = (id)=>document.getElementById(id);

  function toBool(v){ return !!v; }
  function safe(s){ return (s||'').replace(/`/g,'\`'); }

  function generateJsSnippet(data){
    const tags = data.tags
      .split(',')
      .map(t=>t.trim())
      .filter(Boolean)
      .map(t=>`"${t}"`)
      .join(', ');

    const idLine = data.id ? `id: ${data.id},` : `// Choose the next available integer ID
                id: 0, // TODO: replace with next ID`;

    return `{
                ${idLine}
                name: "${safe(data.name)}",
                description: "${safe(data.description)}",
                category: "${safe(data.category)}",
                genre: "${safe(data.genre)}",
                icon: "${safe(data.icon || '🎮')}",
                file: "${safe(data.file)}",
                featured: false,
                premium: ${toBool(data.premium)},
                earlyAccess: ${toBool(data.early)},
                tags: [${tags}]
            },`;
  }

  function generateHtmlSnippet(data){
    const title = safe(data.name || 'New Game');
    const pathInfo = `<!-- Save this file at: ${safe(data.file)} -->`;
    return `${pathInfo}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - /Purge</title>
  <link rel="icon" href="../assets/e1bc9dd5-25b2-4626-9afc-694f3188bac0.ico" type="image/x-icon">
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <div class="background"></div>
  <div class="container">
    <h1>${title}</h1>
    <p class="subtitle">Wrapper page for ${title}. Replace this content with your game embed or redirect.</p>
    <div style="margin-top:1rem;">
      <a class="btn btn-primary" href="../index.html">Back to Home</a>
      <a class="btn btn-secondary" href="../games.html">Back to Games</a>
    </div>
  </div>
</body>
</html>`;
  }

  function generate(){
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
      id: parseInt(el('game-id').value, 10) || null,
    };

    if (!data.name || !data.description || !data.genre || !data.file) {
      alert('Please fill out Name, Description, Genre, and File Path');
      return;
    }

    el('snippet-js').textContent = generateJsSnippet(data);
    el('snippet-html').textContent = generateHtmlSnippet(data);
  }

  function reset(){
    ['game-name','game-description','game-genre','game-icon','game-file','game-tags','game-id'].forEach(id=>{ el(id).value=''; });
    el('game-category').value = 'idle';
    el('game-premium').checked = false;
    el('game-early').checked = false;
    el('snippet-js').textContent = '';
    el('snippet-html').textContent = '';
  }

  document.getElementById('generate-snippets').addEventListener('click', generate);
  document.getElementById('reset-form').addEventListener('click', reset);

  // Copy buttons
  document.querySelectorAll('.admin-btn.copy').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = btn.getAttribute('data-copy-target');
      const pre = document.querySelector(target);
      if (!pre) return;
      const text = pre.textContent;
      navigator.clipboard.writeText(text).then(()=>{
        btn.innerHTML = '<i class="fas fa-check"></i> Copied';
        setTimeout(()=>{ btn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 1200);
      });
    });
  });
})();