const routes = {
  welcome: 'docs/welcome.html',
  study_plan: 'docs/study_plan.html',
  timeline: 'docs/timeline.html',
  company_profile: 'docs/company_profile.html',
  ramani_profile: 'docs/ramani_profile.html',
  elevator_pitch: 'docs/elevator_pitch.html',
  plan_30_60_90: 'docs/plan_30_60_90.html',
  role_overview: 'docs/role_overview.html',
  interview_prep: 'docs/interview_prep.html',
  technical_qa: 'docs/technical_qa.html',
  behavioral_answers: 'docs/behavioral_answers.html',
  compliance: 'docs/compliance.html',
  data_model: 'docs/data_model.html',
  cpq_conga: 'docs/cpq_conga.html',
  checklists: 'docs/checklists.html',
  resources: 'docs/resources.html'
};
// Add LabConnect pages
routes['labconnect_overview'] = 'docs/labconnect_overview.html';
routes['labconnect_hiring'] = 'docs/labconnect_hiring.html';
routes['labconnect_hiring_process'] = 'docs/labconnect_hiring_process.html';
routes['labconnect_research'] = 'docs/labconnect_research.html';
routes['labconnect_complete'] = 'docs/labconnect_complete.html';

const contentEl = document.getElementById('doc-content');
const bookmarksEl = document.getElementById('bookmarks-list');
const notesPanel = document.getElementById('notes-panel');
const notesText = document.getElementById('notes-text');
const toggleNotesBtn = document.getElementById('toggle-notes');
const clearNotesBtn = document.getElementById('clear-notes');
const notesTabs = document.querySelectorAll('.notes-tabs .tab');
const openGlobalBtn = document.getElementById('open-global-search');
const closeGlobalBtn = document.getElementById('close-global-search');
const overlay = document.getElementById('global-search-overlay');
const gsInput = document.getElementById('global-search-input');
const gsResults = document.getElementById('global-search-results');
const exportNotesBtn = document.getElementById('export-notes');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const layoutEl = document.querySelector('.layout');
// Display controls
const themeToggleBtn = document.getElementById('theme-toggle');
const fontIncBtn = document.getElementById('font-inc');
const fontDecBtn = document.getElementById('font-dec');

let currentDocKey = null;
let notesScope = 'doc';

async function loadDoc(key) {
  const url = routes[key];
  if (!url) return;
  try {
    const res = await fetch(url);
    const html = await res.text();
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const body = parsed.querySelector('body');
    const main = body ? body.innerHTML : html;
    contentEl.innerHTML = main;
    currentDocKey = key;
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const active = document.querySelector(`.nav-link[data-doc="${key}"]`);
    if (active) active.classList.add('active');
    // hash
    const frag = getFragmentFromHash();
    const hash = frag ? `#${key}::${frag}` : `#${key}`;
    history.replaceState(null, '', hash);
    enhanceHeadingsForBookmarks();
    loadNotes();
  } catch (e) {
    contentEl.innerHTML = `<p style="color:var(--danger-fg)">Failed to load document.</p>`;
  }
}

document.querySelectorAll('.nav-link[data-doc]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      document.body.classList.remove('sidebar-open');
      updateSidebarAria(false);
    }
    loadDoc(btn.dataset.doc);
  });
});

document.getElementById('search').addEventListener('input', (e) => {
  const q = e.target.value.trim();
  contentEl.querySelectorAll('mark').forEach(m => {
    const t = document.createTextNode(m.textContent);
    m.replaceWith(t);
  });
  if (!q) return;
  const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT, null, false);
  const ranges = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const idx = node.nodeValue.toLowerCase().indexOf(q.toLowerCase());
    if (idx !== -1 && node.nodeValue.trim().length) {
      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + q.length);
      ranges.push(range);
    }
  }
  ranges.forEach(r => {
    const m = document.createElement('mark');
    r.surroundContents(m);
  });
});

const initialHash = location.hash?.slice(1) || 'welcome';
const { doc: initialDoc, frag: initialFrag } = parseHash(initialHash);
loadDoc(initialDoc || 'welcome').then(() => {
  if (initialFrag) {
    const target = document.getElementById(initialFrag);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

function parseHash(hash) {
  if (!hash) return { doc: null, frag: null };
  const [doc, frag] = hash.split('::');
  return { doc, frag };
}
function getFragmentFromHash() {
  const hash = location.hash?.slice(1) || '';
  return parseHash(hash).frag;
}

function slugify(text) { return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80); }
function enhanceHeadingsForBookmarks() {
  const heads = contentEl.querySelectorAll('h1, h2, h3');
  heads.forEach(h => {
    if (!h.id) {
      const id = slugify(h.textContent || 'section');
      let unique = id, i = 2;
      while (document.getElementById(unique)) unique = `${id}-${i++}`;
      h.id = unique;
    }
    if (!h.querySelector('.bookmark-btn')) {
      const btn = document.createElement('button');
      btn.className = 'bookmark-btn';
      btn.textContent = 'Bookmark';
      btn.addEventListener('click', () => addBookmark(h.id, h.textContent || h.id));
      h.appendChild(btn);
    }
  });
}

function loadBookmarks() { try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch { return []; } }
function saveBookmarks(list) { localStorage.setItem('bookmarks', JSON.stringify(list)); }
function addBookmark(fragmentId, title) {
  const list = loadBookmarks();
  const item = { doc: currentDocKey, fragmentId, title, createdAt: Date.now() };
  if (!list.find(b => b.doc === item.doc && b.fragmentId === item.fragmentId)) {
    list.push(item); saveBookmarks(list); renderBookmarks();
  }
}
function removeBookmark(idx) {
  const list = loadBookmarks();
  list.splice(idx, 1); saveBookmarks(list); renderBookmarks();
}
function renderBookmarks() {
  const list = loadBookmarks();
  const container = document.getElementById('bookmarks-list');
  if (!container) return;
  container.innerHTML = '';
  list.forEach((b, idx) => {
    const wrap = document.createElement('div'); wrap.className = 'bookmark-item';
    const link = document.createElement('a'); link.href = `#${b.doc}::${b.fragmentId}`; link.className = 'link'; link.textContent = b.title;
    link.addEventListener('click', (e) => { e.preventDefault(); if (currentDocKey === b.doc) { document.getElementById(b.fragmentId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } else { loadDoc(b.doc).then(() => document.getElementById(b.fragmentId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })); } });
    const meta = document.createElement('div'); meta.className = 'bm-meta'; meta.textContent = b.doc;
    const actions = document.createElement('div'); actions.className = 'bm-actions';
    const remove = document.createElement('button'); remove.className = 'remove'; remove.textContent = 'Remove'; remove.addEventListener('click', () => removeBookmark(idx));
    wrap.appendChild(link); wrap.appendChild(meta); actions.appendChild(remove); wrap.appendChild(actions); container.appendChild(wrap);
  });
}
renderBookmarks();

function notesKey() { return notesScope === 'global' ? 'notes:global' : `notes:${currentDocKey || 'welcome'}`; }
function loadNotes() { const key = notesKey(); notesText.value = localStorage.getItem(key) || ''; }
function saveNotes() { localStorage.setItem(notesKey(), notesText.value); }
notesText && notesText.addEventListener('input', saveNotes);
clearNotesBtn && clearNotesBtn.addEventListener('click', () => { notesText.value = ''; saveNotes(); });
notesTabs.forEach(tab => tab.addEventListener('click', () => { notesTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); notesScope = tab.dataset.scope; loadNotes(); }));
toggleNotesBtn && toggleNotesBtn.addEventListener('click', () => { const visible = notesPanel.style.display !== 'none' && getComputedStyle(notesPanel).display !== 'none'; notesPanel.style.display = visible ? 'none' : 'grid'; });

function updateSidebarAria(expanded) {
  sidebarToggle?.setAttribute('aria-expanded', String(expanded));
  sidebarClose?.setAttribute('aria-expanded', String(expanded));
}
function isMobileView() { return window.matchMedia('(max-width: 900px)').matches; }
sidebarToggle && sidebarToggle.addEventListener('click', () => { if (isMobileView()) { const open = !document.body.classList.contains('sidebar-open'); document.body.classList.toggle('sidebar-open', open); updateSidebarAria(open); } else { const collapsed = document.querySelector('.layout').classList.toggle('sidebar-collapsed'); updateSidebarAria(!collapsed); } });
sidebarClose && sidebarClose.addEventListener('click', () => { document.body.classList.remove('sidebar-open'); updateSidebarAria(false); });
sidebarBackdrop && sidebarBackdrop.addEventListener('click', () => { document.body.classList.remove('sidebar-open'); updateSidebarAria(false); });
function syncSidebarState() { if (isMobileView()) { const open = document.body.classList.contains('sidebar-open'); updateSidebarAria(open); } else { const collapsed = document.querySelector('.layout')?.classList.contains('sidebar-collapsed'); updateSidebarAria(!collapsed); } }
window.addEventListener('resize', syncSidebarState); syncSidebarState();

// ---------- Theme & Font Size Controls ----------
const PREF_THEME = 'pref:theme'; // 'light' | 'dark'
const PREF_FONT = 'pref:fontScale'; // number (e.g., 1, 1.1)

function applyTheme(theme) {
  const root = document.documentElement;
  if (!theme) {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem(PREF_THEME, theme); } catch {}
  if (themeToggleBtn) themeToggleBtn.setAttribute('aria-pressed', theme === 'dark');
}

function applyFontScale(scale) {
  const clamped = Math.min(1.35, Math.max(0.85, scale || 1));
  document.documentElement.style.setProperty('--font-scale', clamped);
  try { localStorage.setItem(PREF_FONT, String(clamped)); } catch {}
}

function initDisplayPrefs() {
  let theme = null, scale = 1;
  try { theme = localStorage.getItem(PREF_THEME); } catch {}
  try { const s = parseFloat(localStorage.getItem(PREF_FONT)); if (!isNaN(s)) scale = s; } catch {}
  applyTheme(theme);
  applyFontScale(scale);
}

themeToggleBtn && themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});
fontIncBtn && fontIncBtn.addEventListener('click', () => {
  const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-scale')) || 1;
  applyFontScale(cur + 0.05);
});
fontDecBtn && fontDecBtn.addEventListener('click', () => {
  const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-scale')) || 1;
  applyFontScale(cur - 0.05);
});

initDisplayPrefs();

// Global search (simple index)
const docTitles = {
  welcome: 'Welcome', study_plan: 'Study Plan', timeline: 'Timeline', company_profile: 'Company Profile', ramani_profile: 'Ramani Profile', elevator_pitch: 'Elevator Pitch', plan_30_60_90: '30/60/90 Plan', role_overview: 'Role Overview', interview_prep: 'Interview Prep', technical_qa: 'Technical Q&A', behavioral_answers: 'Behavioral Answers', compliance: 'Compliance', data_model: 'Data Model', cpq_conga: 'CPQ & Conga', checklists: 'Checklists', resources: 'Resources'
};
docTitles['labconnect_overview'] = 'LabConnect — Company Overview';
docTitles['labconnect_hiring'] = 'LabConnect — Hiring Style';
docTitles['labconnect_research'] = 'LabConnect — Research Plan';
docTitles['labconnect_complete'] = 'LabConnect — Complete Guide';
let searchIndex = null;
async function buildSearchIndex() {
  if (searchIndex) return searchIndex;
  const entries = [];
  for (const [key, url] of Object.entries(routes)) {
    try {
      const res = await fetch(url); const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const title = doc.querySelector('h1')?.textContent || docTitles[key] || key;
      entries.push({ key, title, text: doc.body?.innerText || '' });
    } catch {}
  }
  searchIndex = { entries };
  return searchIndex;
}
function searchAll(q) {
  if (!searchIndex) return [];
  const term = q.toLowerCase();
  const results = [];
  searchIndex.entries.forEach(e => {
    const idx = e.text.toLowerCase().indexOf(term);
    if (idx !== -1) {
      const start = Math.max(0, idx - 60); const end = Math.min(e.text.length, idx + 140);
      const snippet = e.text.slice(start, end).replaceAll('\n', ' ');
      results.push({ key: e.key, title: e.title, snippet });
    }
  });
  return results.slice(0, 50);
}
function renderGlobalResults(items) {
  gsResults.innerHTML = '';
  if (!items.length) { gsResults.innerHTML = '<div class="gs-meta">No results</div>'; return; }
  items.forEach(it => {
    const div = document.createElement('div'); div.className = 'gs-item';
    div.innerHTML = `<div class="gs-title">${it.title}</div><div class="gs-snippet">${it.snippet}</div>`;
    div.addEventListener('click', () => { overlay.setAttribute('aria-hidden','true'); loadDoc(it.key); });
    gsResults.appendChild(div);
  });
}
let gsBuilt = false; let gsActive = 0;
openGlobalBtn && openGlobalBtn.addEventListener('click', async () => { overlay.setAttribute('aria-hidden', 'false'); gsInput.value=''; gsResults.innerHTML='<div class="gs-meta">Building index…</div>'; await buildSearchIndex(); gsInput.focus(); gsResults.innerHTML='<div class="gs-meta">Type to search…</div>'; });
closeGlobalBtn && closeGlobalBtn.addEventListener('click', () => { overlay.setAttribute('aria-hidden', 'true'); });
gsInput && gsInput.addEventListener('input', (e) => { const q = e.target.value.trim(); if (!q) { gsResults.innerHTML = '<div class="gs-meta">Type to search…</div>'; return; } const items = searchAll(q); renderGlobalResults(items); });
document.addEventListener('keydown', (e) => { if (e.key === '/' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openGlobalBtn?.click(); } else if (e.key === 'Escape') { overlay?.setAttribute('aria-hidden','true'); if (document.body.classList.contains('sidebar-open')) { document.body.classList.remove('sidebar-open'); updateSidebarAria(false); } } });

// Export notes
function collectNotes() {
  const out = { global: localStorage.getItem('notes:global') || '', docs: {}, bookmarks: [] };
  Object.keys(routes).forEach(k => { const v = localStorage.getItem(`notes:${k}`); if (v) out.docs[k] = v; });
  try { out.bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch { out.bookmarks = []; }
  return out;
}
function toMarkdown(exported) {
  const lines = ['# Notes Export'];
  if (exported.global) { lines.push('\n## Global Notes'); lines.push(exported.global); }
  const docKeys = Object.keys(exported.docs);
  if (docKeys.length) { lines.push('\n## Per-Document Notes'); docKeys.forEach(k => { lines.push(`\n### ${docTitles[k] || k}`); lines.push(exported.docs[k]); }); }
  if (exported.bookmarks.length) { lines.push('\n## Bookmarks'); exported.bookmarks.forEach(b => { lines.push(`- ${docTitles[b.doc] || b.doc} — ${b.title} (#${b.fragmentId})`); }); }
  return lines.join('\n');
}
exportNotesBtn && exportNotesBtn.addEventListener('click', () => { const data = collectNotes(); const md = toMarkdown(data); const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'prep-notes-export.md'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); });
