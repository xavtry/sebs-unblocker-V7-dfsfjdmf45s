
// client-side tabs manager (keeps original behavior but modular)
document.addEventListener('DOMContentLoaded', () => {
  const tabBar = document.getElementById('tabBar');
  const newTabBtn = document.getElementById('newTabBtn');
  const tabContainer = document.getElementById('tabContainer');
  let tabCount = 0;

  function activateTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tabContent').forEach(tc => tc.classList.remove('active'));
    const btn = document.getElementById(tabId + '-btn');
    const content = document.getElementById(tabId);
    if (btn) btn.classList.add('active');
    if (content) content.classList.add('active');
  }

  function closeTab(tabId) {
    const btn = document.getElementById(tabId + '-btn');
    const content = document.getElementById(tabId);
    if (btn) btn.remove();
    if (content) content.remove();
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length > 0) {
      const lastTabId = tabs[tabs.length - 1].id.replace('-btn', '');
      activateTab(lastTabId);
    } else {
      createHomeTab();
    }
  }

  function createHomeTab() {
    tabCount++;
    const tabId = 'tab' + tabCount;
    const tabButton = document.createElement('div');
    tabButton.className = 'tab active';
    tabButton.id = tabId + '-btn';
    tabButton.textContent = 'Home';
    tabButton.addEventListener('click', () => activateTab(tabId));

    const closeBtn = document.createElement('button');
    closeBtn.className = 'closeTab';
    closeBtn.textContent = 'x';
    closeBtn.onclick = (e) => { e.stopPropagation(); closeTab(tabId); };
    tabButton.appendChild(closeBtn);
    tabBar.insertBefore(tabButton, newTabBtn);

    const tabContent = document.createElement('div');
    tabContent.className = 'tabContent active';
    tabContent.id = tabId;
    tabContent.innerHTML = `
      <h1 class="glow-text" style="text-align:center; margin-top:20px;">Seb's Unblocker<sup>V7</sup></h1>
      <div class="search-container">
        <input type="text" placeholder="Enter website URL..." class="urlInput" />
        <button class="goBtn">Go</button>
      </div>
    `;
    tabContainer.appendChild(tabContent);

    const goBtn = tabContent.querySelector('.goBtn');
    const urlInput = tabContent.querySelector('.urlInput');
    goBtn.addEventListener('click', () => {
      let url = urlInput.value.trim();
      if (!url) return;
      if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
      createWebTab(url);
    });
    urlInput.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); goBtn.click(); } });

    activateTab(tabId);
  }

  function createWebTab(url) {
    tabCount++;
    const tabId = 'tab' + tabCount;
    const label = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

    const tabButton = document.createElement('div');
    tabButton.className = 'tab active';
    tabButton.id = tabId + '-btn';
    tabButton.textContent = label;
    tabButton.addEventListener('click', () => activateTab(tabId));
    const closeBtn = document.createElement('button');
    closeBtn.className = 'closeTab';
    closeBtn.textContent = 'x';
    closeBtn.onclick = (e) => { e.stopPropagation(); closeTab(tabId); };
    tabButton.appendChild(closeBtn);
    tabBar.insertBefore(tabButton, newTabBtn);

    const tabContent = document.createElement('div');
    tabContent.className = 'tabContent active';
    tabContent.id = tabId;
    tabContent.innerHTML = `<iframe src="/proxy?url=${encodeURIComponent(url)}" style="flex:1;width:100%;height:100%;"></iframe>`;
    tabContainer.appendChild(tabContent);

    activateTab(tabId);
  }

  newTabBtn.addEventListener('click', createHomeTab);
  createHomeTab();
});
