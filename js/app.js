/* =========================================================
   AGCM – KNUST Technical Department  |  app.js  v6
   Shared theme, modal, scroll-reveal, meter, roster & gallery
   ========================================================= */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;

const store = {
  get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
};

function escapeHTML(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
window.escapeHTML = escapeHTML;
window.agcmStore = store;

const inTools = location.pathname.includes('/tools/');
const ROOT = inTools ? '../' : '';

/* ── Active nav tab detection (supports both .html and cleanUrls) ── */
(function syncActiveNav() {
  const path = location.pathname.replace(/\/$/, '');
  const slug = path.split('/').pop() || 'index';
  const norm = slug.replace(/\.html$/, '');
  $$('.topnav .tn-tabs .nav-pill').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop().replace(/\.html$/, '');
    const isMatch = (inTools && href === 'foh-portal') || (!inTools && href === norm);
    a.classList.toggle('active', isMatch);
    if (isMatch) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
})();

/* ── Toast notification (shared across site & Audio Portal) ── */
function toast(m) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('on'), 2400);
}
window.toast = toast;

/* ── Light / dark theme ── */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  store.set('agcm_theme', t);
  store.set('sdu_theme_v35', t);
  $$('.theme-btn').forEach(b => {
    b.innerHTML = t === 'light' ? '<span class="theme-star" aria-hidden="true">✦</span><span class="theme-lbl">Dark</span>' : '<span class="theme-star" aria-hidden="true">✧</span><span class="theme-lbl">Light</span>';
    b.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  });
  window.dispatchEvent(new CustomEvent('agcm-theme-change', { detail: t }));
}
$$('.theme-btn').forEach(b => b.onclick = () =>
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
setTheme((store.get('agcm_theme') || store.get('sdu_theme_v35')) === 'dark' ? 'dark' : 'light');

/* ── Accessible Modal / Lightbox with Focus Management ── */
const lm = $('#lm');
const lmImg = $('#lm-img');
const lmClose = $('#lm-close');
let lastFocusedEl = null;

function openModalImage(src, altText) {
  if (!lm || !lmImg) return;
  lastFocusedEl = document.activeElement;
  lmImg.src = src;
  lmImg.alt = altText || 'AGCM-KNUST Technical Department preview';
  lm.hidden = false;
  if (lmClose) lmClose.focus();
}
function closeModalImage() {
  if (!lm || lm.hidden) return;
  lm.hidden = true;
  if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
}
window.openModalImage = openModalImage;
window.closeModalImage = closeModalImage;

if ($('#logo')) {
  $('#logo').onclick = () => openModalImage(ROOT + 'assets/logo-lg.png', 'AGCM-KNUST Technical Department crest');
}
if (lm) {
  lm.onclick = e => { if (e.target === lm || e.target === lmClose) closeModalImage(); };
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lm.hidden) closeModalImage();
    if (e.key === 'Tab' && !lm.hidden && lmClose) {
      e.preventDefault();
      lmClose.focus();
    }
  });
}

/* ── Auto-hide top bar on scroll down, restore on scroll up ── */
let ly = 0;
addEventListener('scroll', () => {
  const y  = scrollY;
  const tn = $('.topnav');
  if (tn) tn.classList.toggle('hide', y > ly && y > 140);
  ly = y;
}, { passive: true });

/* ── Ripple on buttons ── */
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn,.ch-btn');
  if (!b || calm) return;
  const r = b.getBoundingClientRect();
  const s = document.createElement('span');
  s.className = 'rip';
  s.style.left = e.clientX - r.left + 'px';
  s.style.top  = e.clientY - r.top  + 'px';
  b.appendChild(s);
  setTimeout(() => s.remove(), 600);
});

/* ── Hero VU level meter (Pauses automatically via IntersectionObserver when offscreen) ── */
const meter = $('.meter');
if (meter) {
  const N = 32;
  meter.innerHTML = '<i></i>'.repeat(N);
  const bars = $$('i', meter);
  let px = -1, t = 0, running = false, rafId = 0;
  const at = e => { const r = meter.getBoundingClientRect(); px = (e.clientX - r.left) / r.width; };
  meter.addEventListener('pointermove', at);
  meter.addEventListener('pointerdown', at);
  meter.addEventListener('pointerleave', () => px = -1);

  function tickMeter() {
    if (!running) return;
    t += .04;
    bars.forEach((b, i) => {
      let v = .25 + .2 * Math.sin(t + i * .5) + .12 * Math.sin(t * 2.3 + i);
      if (px >= 0) v += .6 * Math.exp(-(((i / N - px) * 7) ** 2));
      b.style.setProperty('--h', Math.min(1, Math.max(.06, v)));
    });
    if (!calm) rafId = requestAnimationFrame(tickMeter);
  }

  if (window.IntersectionObserver && !calm) {
    const mio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !running) {
          running = true;
          rafId = requestAnimationFrame(tickMeter);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      });
    }, { threshold: 0.05 });
    mio.observe(meter);
  } else {
    running = true;
    tickMeter();
  }
}

/* ── Scroll reveal (shared helper) ── */
function attachReveal(els) {
  if (!els.length || !window.IntersectionObserver || calm) {
    els.forEach(c => c.classList.remove('rv'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
        setTimeout(() => e.target.classList.remove('rv', 'in'), 1100);
      }
    });
  }, { threshold: .1 });
  els.forEach((c, i) => { c.style.setProperty('--d', (i % 4) * .06 + 's'); io.observe(c); });
}
attachReveal($$('.rv'));

/* ── Executives page: 15 Officers Grouped by Team (No rank numbers, no public admin controls) ── */
const exg = $('#ex-grid');
if (exg && window.EXECS) {
  const yearBadge = $('#exec-year-badge');
  if (yearBadge && window.EXEC_YEAR) yearBadge.textContent = window.EXEC_YEAR;

  function getInitials(fullName) {
    const parts = String(fullName || '').trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0] ? parts[0].slice(0, 2) : 'EX').toUpperCase();
  }

  let currentGroup = '';
  let html = '';
  window.EXECS.forEach(ex => {
    const grp = ex.group || 'Department Leadership';
    if (grp !== currentGroup) {
      currentGroup = grp;
      html += `<h2 class="grp">${escapeHTML(grp)}</h2>`;
    }
    const nameEsc = escapeHTML(ex.name);
    const portEsc = escapeHTML(ex.portfolio || 'Executive Officer');
    const avHtml = ex.photo
      ? `<img src="${escapeHTML(ex.photo)}" width="52" height="52" loading="lazy" alt="${nameEsc}">`
      : `<span aria-hidden="true">${escapeHTML(getInitials(ex.name))}</span>`;
    html += `
      <article class="ex-card rv">
        <div class="ex-av">${avHtml}</div>
        <div class="ex-info">
          <h3 class="ex-name">${nameEsc}</h3>
          <span class="ex-port-badge">${portEsc}</span>
        </div>
      </article>`;
  });
  exg.innerHTML = html;
  attachReveal($$('.ex-card.rv', exg));
}

/* ── Gallery page: Category Filter + Lightbox on Clickable Photos ── */
const galGrid = $('#gal-grid');
if (galGrid && window.GALLERY_ITEMS) {
  let activeCat = 'ALL';
  const filterWrap = $('#gal-filters');
  const cats = ['ALL', 'FOH & Console', 'Campus Venues', 'Ministry & Events', 'Crew & Setup'];

  function renderGallery() {
    if (filterWrap) {
      filterWrap.innerHTML = cats.map(c =>
        `<button type="button" class="ch-btn${c === activeCat ? ' active' : ''}" role="tab" aria-selected="${c === activeCat}" data-cat="${escapeHTML(c)}">
          ${c === 'ALL' ? 'All Categories' : escapeHTML(c)}
        </button>`
      ).join('');
      $$('button', filterWrap).forEach(b => b.onclick = () => { activeCat = b.dataset.cat; renderGallery(); });
    }
    const items = window.GALLERY_ITEMS.filter(x => activeCat === 'ALL' || x.cat === activeCat);
    galGrid.innerHTML = items.map(it => {
      const titleEsc = escapeHTML(it.title);
      const venueEsc = escapeHTML(it.venue);
      const descEsc  = escapeHTML(it.desc);
      const catEsc   = escapeHTML(it.cat);
      const hasPhoto = Boolean(it.photo);
      return `
        <article class="gal-card${hasPhoto ? ' has-photo' : ''} rv"${hasPhoto ? ` tabindex="0" role="button" aria-label="View full photo: ${titleEsc}" data-photo="${escapeHTML(it.photo)}" data-title="${titleEsc}"` : ''}>
          <div class="gal-thumb">
            ${hasPhoto
              ? `<img src="${escapeHTML(it.photo)}" width="640" height="360" loading="lazy" alt="${titleEsc}">`
              : `<span class="gal-icon" aria-hidden="true">${escapeHTML(it.icon)}</span>
                 <span class="text-mut" style="font-size:.74rem;font-weight:700">${venueEsc}</span>`}
            <span class="gal-tag">${catEsc}</span>
          </div>
          <div class="gal-body">
            <div class="kicker">${venueEsc}</div>
            <h2>${titleEsc}</h2>
            <p class="sm text-sec">${descEsc}</p>
          </div>
        </article>`;
    }).join('');

    $$('.gal-card.has-photo', galGrid).forEach(card => {
      const openCard = () => openModalImage(card.dataset.photo, card.dataset.title);
      card.onclick = openCard;
      card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); } };
    });

    attachReveal($$('.gal-card.rv', galGrid));
  }
  renderGallery();
}

/* ── Role Handover Notes Workspace (Inside Audio Portal #handover tab) ── */
const tabs = $('#tabs');
if (tabs && window.ROLES) {
  let cur = 0;
  const panel = $('#panel');

  tabs.innerHTML = window.ROLES.map((r, idx) =>
    `<button type="button" class="ch-btn" role="tab" id="role-tab-${idx}" aria-selected="${idx === 0}">${escapeHTML(r.name)}</button>`
  ).join('');
  const btns = $$('.ch-btn', tabs);

  function showRole(i) {
    cur = (i + window.ROLES.length) % window.ROLES.length;
    const r = window.ROLES[cur];
    btns.forEach((b, j) => {
      b.classList.toggle('active', j === cur);
      b.setAttribute('aria-selected', j === cur);
    });

    const savedAt = store.get('agcm_note_time_' + r.id) || store.get('note-time-' + r.id);
    panel.innerHTML = `
      <div class="kicker">Constitutional Duties &amp; Device-Local Handover Notes</div>
      <h3 class="title">${escapeHTML(r.name)}</h3>
      <ul class="sm text-sec" style="padding-left:18px">${r.duties.map(d => `<li>${escapeHTML(d)}</li>`).join('')}</ul>
      <textarea class="dept-input" aria-label="Handover notes for ${escapeHTML(r.name)}" placeholder="Record handover notes for ${escapeHTML(r.name)} (saved in this browser)..."></textarea>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:6px">
        <span id="note-stamp" class="text-mut" style="font-size:.75rem">
          ${savedAt ? 'Saved on this browser at ' + escapeHTML(savedAt) : 'Saved on this browser only (localStorage). Export .txt to share with another lead.'}
        </span>
        <button type="button" id="btn-dl-note" class="btn-subtle">⬇ Export Notes (.txt)</button>
      </div>`;

    const ta = $('textarea', panel);
    ta.value = store.get('agcm_note_' + r.id) || store.get('note-' + r.id) || '';

    ta.oninput = () => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      store.set('agcm_note_' + r.id, ta.value);
      store.set('agcm_note_time_' + r.id, now);
      const st = $('#note-stamp');
      if (st) st.textContent = 'Saved on this browser at ' + now;
      clearTimeout(showRole._t);
      showRole._t = setTimeout(() => toast('Handover note saved on this device'), 700);
    };

    const dlBtn = $('#btn-dl-note', panel);
    if (dlBtn) dlBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(
        [`# ${r.name} — AGCM-KNUST Technical Handover Notes\n\n` + (ta.value || 'No notes entered.')],
        { type: 'text/plain' }
      ));
      a.download = `${r.id}-handover-notes.txt`;
      a.click();
      toast('Exported handover notes (.txt)');
    };
  }

  btns.forEach((b, i) => b.onclick = () => showRole(i));
  showRole(0);
}

