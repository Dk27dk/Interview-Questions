/* =========================================================
   InterviewClear — script.js
   Shared site behaviour: header/footer injection, dark mode,
   mobile nav, bookmarks, recently-viewed, site search, and a
   generic question-list renderer used by every topic page.
   All data is loaded from /data/*.json via fetch().
   ========================================================= */

const SITE = {
  name: "InterviewClear",
  tagline: "Crack Your Dream IT Job Interview",
  root: (() => {
    // Works whether the current page lives at site root or one folder deep (/company, /programming)
    const depth = location.pathname.split('/').filter(Boolean);
    const inSubfolder = depth.length > 0 && ['company', 'programming'].includes(depth[depth.length - 2]);
    return inSubfolder ? '../' : './';
  })()
};

const NAV_LINKS = [
  { label: 'Home', href: 'index.html' },
  { label: 'Companies', href: '#', dropdown: [
      { label: 'TCS', href: 'company/tcs.html' },
      { label: 'Infosys', href: 'company/infosys.html' },
      { label: 'Cognizant', href: 'company/cognizant.html' },
      { label: 'Accenture', href: 'company/accenture.html' },
      { label: 'Wipro', href: 'company/wipro.html' }
    ] },
  { label: 'Programming', href: '#', dropdown: [
      { label: 'Java', href: 'programming/java.html' },
      { label: 'Python', href: 'programming/python.html' },
      { label: 'SQL', href: 'programming/sql.html' },
      { label: 'JavaScript', href: 'programming/javascript.html' },
      { label: 'React', href: 'programming/react.html' }
    ] },
  { label: 'HR Prep', href: 'hr.html' },
  { label: 'Aptitude', href: 'aptitude.html' },
  { label: 'Resume & Career', href: 'resume.html' }
];

/* ---------------------------------------------------------
   HEADER / FOOTER INJECTION
   --------------------------------------------------------- */
function renderHeader() {
  const mount = document.getElementById('site-header');
  if (!mount) return;
  const r = SITE.root;
  const navHTML = NAV_LINKS.map(link => {
    if (link.dropdown) {
      const items = link.dropdown.map(d => `<a href="${r}${d.href}">${d.label}</a>`).join('');
      return `<div class="nav-dropdown"><a href="#" role="button">${link.label} ▾</a><div class="nav-dropdown-panel">${items}</div></div>`;
    }
    return `<a href="${r}${link.href}">${link.label}</a>`;
  }).join('');

  mount.innerHTML = `
    <div class="header-inner">
      <a href="${r}index.html" class="brand"><span class="brand-mark">IC</span>${SITE.name}</a>
      <nav class="main-nav" id="main-nav">${navHTML}</nav>
      <div class="header-actions">
        <div class="header-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" id="global-search" placeholder="Search 500+ questions..." autocomplete="off">
          <div id="search-results" class="sidebar-box" style="display:none; position:absolute; top:calc(100% + 8px); right:0; width:340px; max-height:400px; overflow-y:auto; z-index:200; box-shadow: var(--shadow-lg);"></div>
        </div>
        <button class="icon-btn" id="theme-toggle" aria-label="Toggle dark mode">🌙</button>
        <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Toggle menu">☰</button>
      </div>
    </div>`;
}

function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  const r = SITE.root;
  mount.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <a href="${r}index.html" class="brand" style="margin-bottom:14px;"><span class="brand-mark">IC</span>${SITE.name}</a>
          <p style="color:var(--color-slate); font-size:0.88rem; max-width:260px;">Free interview questions, answers, and downloadable PDFs to help students and freshers crack IT job interviews.</p>
        </div>
        <div class="footer-col"><h4>Companies</h4>
          <a href="${r}company/tcs.html">TCS</a><a href="${r}company/infosys.html">Infosys</a><a href="${r}company/cognizant.html">Cognizant</a><a href="${r}company/accenture.html">Accenture</a><a href="${r}company/wipro.html">Wipro</a>
        </div>
        <div class="footer-col"><h4>Programming</h4>
          <a href="${r}programming/java.html">Java</a><a href="${r}programming/python.html">Python</a><a href="${r}programming/sql.html">SQL</a><a href="${r}programming/javascript.html">JavaScript</a><a href="${r}programming/react.html">React</a>
        </div>
        <div class="footer-col"><h4>Preparation</h4>
          <a href="${r}hr.html">HR Questions</a><a href="${r}aptitude.html">Aptitude</a><a href="${r}resume.html">Resume & Career</a><a href="${r}bookmarks.html">My Bookmarks</a>
        </div>
        <div class="footer-col"><h4>Company</h4>
          <a href="${r}about.html">About Us</a><a href="${r}contact.html">Contact</a><a href="${r}privacy.html">Privacy Policy</a><a href="${r}terms.html">Terms & Conditions</a><a href="${r}disclaimer.html">Disclaimer</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span id="footer-year"></span> ${SITE.name}. All rights reserved.</span>
        <span>Made for students & freshers preparing for IT interviews.</span>
      </div>
    </div>`;
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   THEME (DARK MODE)
   --------------------------------------------------------- */
function initTheme() {
  const saved = localStorage.getItem('if_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = saved === 'dark' ? '☀️' : '🌙';
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('if_theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

/* ---------------------------------------------------------
   MOBILE NAV
   --------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
  });
  nav.querySelectorAll('.nav-dropdown > a').forEach(a => {
    a.addEventListener('click', (e) => {
      if (window.innerWidth <= 720) {
        e.preventDefault();
        a.parentElement.classList.toggle('open');
      }
    });
  });
}

/* ---------------------------------------------------------
   TOAST
   --------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ---------------------------------------------------------
   DATA LOADING (with in-memory cache)
   --------------------------------------------------------- */
const _dataCache = {};
async function loadJSON(path) {
  const key = SITE.root + path;
  if (_dataCache[key]) return _dataCache[key];
  const res = await fetch(key);
  if (!res.ok) throw new Error('Failed to load ' + key);
  const data = await res.json();
  _dataCache[key] = data;
  return data;
}

/* ---------------------------------------------------------
   BOOKMARKS (localStorage)
   Key format: "company:tcs:1"  or  "lang:java:5" etc.
   --------------------------------------------------------- */
function bookmarkKey(catType, catId, qId) { return `${catType}:${catId}:${qId}`; }

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('if_bookmarks') || '{}'); }
  catch (e) { return {}; }
}
function isBookmarked(catType, catId, qId) {
  return !!getBookmarks()[bookmarkKey(catType, catId, qId)];
}
function toggleBookmark(catType, catId, qId, meta) {
  const marks = getBookmarks();
  const key = bookmarkKey(catType, catId, qId);
  if (marks[key]) {
    delete marks[key];
  } else {
    marks[key] = { ...meta, savedAt: Date.now() };
  }
  localStorage.setItem('if_bookmarks', JSON.stringify(marks));
  return !!marks[key];
}

/* ---------------------------------------------------------
   RECENTLY VIEWED (localStorage, capped at 8)
   --------------------------------------------------------- */
function trackRecentlyViewed(entry) {
  let list = [];
  try { list = JSON.parse(localStorage.getItem('if_recent') || '[]'); } catch (e) { list = []; }
  list = list.filter(i => i.url !== entry.url);
  list.unshift(entry);
  list = list.slice(0, 8);
  localStorage.setItem('if_recent', JSON.stringify(list));
}
function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem('if_recent') || '[]'); } catch (e) { return []; }
}

/* ---------------------------------------------------------
   PROGRESS TRACKER — counts unique questions opened
   --------------------------------------------------------- */
function trackProgress(catType, catId, qId) {
  let seen = {};
  try { seen = JSON.parse(localStorage.getItem('if_progress') || '{}'); } catch (e) { seen = {}; }
  seen[bookmarkKey(catType, catId, qId)] = true;
  localStorage.setItem('if_progress', JSON.stringify(seen));
}
function getProgressCount() {
  try { return Object.keys(JSON.parse(localStorage.getItem('if_progress') || '{}')).length; }
  catch (e) { return 0; }
}

/* ---------------------------------------------------------
   DIFFICULTY BADGE HELPER
   --------------------------------------------------------- */
function difficultyBadge(level) {
  const l = (level || 'Easy').toLowerCase();
  const cls = l === 'hard' ? 'badge-hard' : l === 'medium' ? 'badge-medium' : 'badge-easy';
  return `<span class="badge ${cls}">${level}</span>`;
}

/* ---------------------------------------------------------
   GENERIC QUESTION-LIST RENDERER
   Renders an array of Q&A objects into an accordion list.
   Works for company, programming, HR, and aptitude datasets
   since it only reads fields that exist on each item.
   --------------------------------------------------------- */
function renderQuestionList(container, items, opts) {
  opts = opts || {};
  const catType = opts.catType, catId = opts.catId;
  if (!items.length) {
    container.innerHTML = `<div class="no-results">No questions match your filters. Try a different category or difficulty.</div>`;
    return;
  }
  container.innerHTML = items.map((q, idx) => {
    const title = q.title;
    const bodyParts = [];
    if (q.answer) bodyParts.push(`<h5>Answer</h5><p>${q.answer}</p>`);
    if (q.steps) bodyParts.push(`<h5>Step-by-step Solution</h5><p style="white-space:pre-line;">${q.steps}</p>`);
    if (q.example) bodyParts.push(`<h5>Example</h5><pre>${escapeHTML(q.example)}</pre>`);
    if (q.tips) bodyParts.push(`<h5>Interview Tip</h5><p>${q.tips}</p>`);
    const bookmarked = isBookmarked(catType, catId, q.id);
    return `
    <details class="qa-item" data-qid="${q.id}">
      <summary class="qa-summary">
        <span class="qa-number">Q${idx + 1}</span>
        <span class="qa-title">${title}</span>
        ${difficultyBadge(q.difficulty)}
        <button class="bookmark-btn ${bookmarked ? 'active' : ''}" type="button" title="Bookmark this question" onclick="event.preventDefault(); event.stopPropagation(); handleBookmarkClick(this, '${catType}', '${catId}', ${q.id}, ${JSON.stringify(title).replace(/"/g, '&quot;')})">${bookmarked ? '★' : '☆'}</button>
        <svg class="qa-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </summary>
      <div class="qa-body">${bodyParts.join('')}</div>
    </details>`;
  }).join('');

  container.querySelectorAll('.qa-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        trackProgress(catType, catId, Number(item.dataset.qid));
      }
    });
  });
}

function handleBookmarkClick(btn, catType, catId, qId, title) {
  const active = toggleBookmark(catType, catId, qId, { title, catType, catId, url: currentPageURL() });
  btn.classList.toggle('active', active);
  btn.textContent = active ? '★' : '☆';
  showToast(active ? 'Question bookmarked' : 'Bookmark removed');
}

function currentPageURL() {
  return location.pathname.split('/').pop();
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------------------------------------------------------
   SITE SEARCH — loads every dataset once, then filters client-side
   --------------------------------------------------------- */
let _searchIndex = null;
async function buildSearchIndex() {
  if (_searchIndex) return _searchIndex;
  const catalog = await loadJSON('data/catalog.json');
  const sources = [
    ...catalog.companies.map(c => ({ type: 'company', id: c.id, name: c.name, file: c.file, page: `company/${c.id}.html` })),
    ...catalog.programming.map(p => ({ type: 'lang', id: p.id, name: p.name, file: p.file, page: `programming/${p.id}.html` })),
    { type: 'hr', id: 'hr', name: 'HR Questions', file: catalog.hr.file, page: 'hr.html' },
    { type: 'aptitude', id: 'aptitude', name: 'Aptitude', file: catalog.aptitude.file, page: 'aptitude.html' }
  ];
  const index = [];
  await Promise.all(sources.map(async src => {
    try {
      const items = await loadJSON(src.file);
      items.forEach(q => index.push({ ...q, sourceName: src.name, sourceType: src.type, page: src.page }));
    } catch (e) { /* skip missing file */ }
  }));
  _searchIndex = index;
  return index;
}

function initSearch() {
  const input = document.getElementById('global-search');
  const panel = document.getElementById('search-results');
  if (!input || !panel) return;
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (q.length < 2) { panel.style.display = 'none'; return; }
    debounceTimer = setTimeout(async () => {
      const index = await buildSearchIndex();
      const results = index.filter(item =>
        item.title.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 8);
      if (!results.length) {
        panel.innerHTML = `<div style="padding:14px; font-size:0.85rem; color:var(--color-slate);">No matches for "${escapeHTML(q)}"</div>`;
      } else {
        panel.innerHTML = results.map(r => `
          <a href="${SITE.root}${r.page}" style="display:block; padding:10px 8px; border-bottom:1px solid var(--color-border); font-size:0.86rem;">
            <strong>${escapeHTML(r.title)}</strong><br>
            <span style="color:var(--color-slate); font-size:0.78rem;">${r.sourceName}</span>
          </a>`).join('');
      }
      panel.style.display = 'block';
    }, 220);
  });
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== input) panel.style.display = 'none';
  });
}

/* ---------------------------------------------------------
   SEO: FAQ + BREADCRUMB SCHEMA INJECTION
   --------------------------------------------------------- */
function injectFAQSchema(items) {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.slice(0, 10).map(q => ({
      "@type": "Question",
      "name": q.title,
      "acceptedAnswer": { "@type": "Answer", "text": (q.answer || '').replace(/<[^>]+>/g, '') }
    }))
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(faq);
  document.head.appendChild(script);
}

function injectBreadcrumbSchema(crumbs) {
  const bc = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((c, i) => ({
      "@type": "ListItem", "position": i + 1, "name": c.name, "item": c.url
    }))
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(bc);
  document.head.appendChild(script);
}

/* ---------------------------------------------------------
   NEWSLETTER + CONTACT FORM (front-end only demo handlers)
   --------------------------------------------------------- */
function initForms() {
  const newsletter = document.getElementById('newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Subscribed! Check your inbox for a confirmation email.');
      newsletter.reset();
    });
  }
  const contact = document.getElementById('contact-form');
  if (contact) {
    contact.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent — we will get back to you within 2 business days.');
      contact.reset();
    });
  }
}

/* ---------------------------------------------------------
   INIT — runs on every page
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  initTheme();
  initMobileNav();
  initSearch();
  initForms();
  if (typeof onPageReady === 'function') onPageReady();
});
