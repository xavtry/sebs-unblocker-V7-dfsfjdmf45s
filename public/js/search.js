
// small search client used by Home tab; calls /search?q= and renders results
document.addEventListener('submit', async function (e) {
  const form = e.target;
  if (!form.classList || !form.classList.contains('searchForm')) return;
  e.preventDefault();
  const q = form.querySelector('#query').value.trim();
  if (!q) return;
  const resultsPanel = document.getElementById('resultsPanel') || document.createElement('div');
  resultsPanel.id = 'resultsPanel';
  const parent = form.closest('.tabContent') || document.body;
  parent.appendChild(resultsPanel);
  resultsPanel.innerHTML = '<p style="color:#00ff7f">Searching…</p>';

  try {
    const resp = await fetch('/search?q=' + encodeURIComponent(q));
    const json = await resp.json();
    resultsPanel.innerHTML = json.map(r => `
      <div style="background:rgba(0,0,0,0.3); padding:10px; margin:8px; border-radius:6px;">
        <a href="${r.url}" target="_blank" style="color:#00ff7f; font-weight:bold;">${r.title}</a>
        <p style="color:#cfefd2">${r.description || ''}</p>
        <div>
          <button onclick="window.location.href='/proxy?url=${encodeURIComponent(r.url)}'">Open via Proxy</button>
          <button onclick="window.open('${r.url}','_blank')">Open in New Tab</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    resultsPanel.innerHTML = '<p style="color:#ff7777">Search failed</p>';
  }
});
