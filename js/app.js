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

/* ── Light / dark segmented pill toggle ── */
function setTheme(t) {
  const mode = t === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = mode;
  store.set('agcm_theme', mode);
  $$('.theme-btn').forEach(b => {
    b.setAttribute('aria-checked', mode === 'dark' ? 'true' : 'false');
    b.setAttribute('aria-label', mode === 'light' ? 'Light mode active (click to switch to Dark mode)' : 'Dark mode active (click to switch to Light mode)');
  });
  window.dispatchEvent(new CustomEvent('agcm-theme-change', { detail: mode }));
}
$$('.theme-btn').forEach(b => {
  b.onclick = e => {
    const cur = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    const seg = e.target.closest('[data-theme-target]');
    const target = seg ? seg.getAttribute('data-theme-target') : null;
    if (target && target !== cur) setTheme(target);
    else setTheme(cur === 'dark' ? 'light' : 'dark');
  };
});
setTheme(store.get('agcm_theme') === 'dark' ? 'dark' : 'light');

/* ── Accessible Modal / Lightbox with Focus, Keyboard & Touch Swipe Navigation ── */
const lm = $('#lm');
const lmImg = $('#lm-img');
const lmClose = $('#lm-close');
let lastFocusedEl = null;
let lbPlaylist = [];
let lbIndex = -1;
let lbCaptionEl = null;
let lbPrevBtn = null;
let lbNextBtn = null;

if (lm && lmClose) {
  lbCaptionEl = document.createElement('div');
  lbCaptionEl.className = 'modal-caption';
  lbCaptionEl.id = 'lm-caption';
  const navRow = document.createElement('div');
  navRow.className = 'modal-nav-row';
  lbPrevBtn = document.createElement('button');
  lbPrevBtn.type = 'button';
  lbPrevBtn.className = 'modal-step-btn';
  lbPrevBtn.id = 'lm-prev';
  lbPrevBtn.setAttribute('aria-label', 'Previous gallery image');
  lbPrevBtn.textContent = '◀ Prev';
  lbNextBtn = document.createElement('button');
  lbNextBtn.type = 'button';
  lbNextBtn.className = 'modal-step-btn';
  lbNextBtn.id = 'lm-next';
  lbNextBtn.setAttribute('aria-label', 'Next gallery image');
  lbNextBtn.textContent = 'Next ▶';
  lmClose.parentNode.insertBefore(lbCaptionEl, lmClose);
  lmClose.parentNode.insertBefore(navRow, lmClose);
  navRow.appendChild(lbPrevBtn);
  navRow.appendChild(lmClose);
  navRow.appendChild(lbNextBtn);
  lbPrevBtn.onclick = e => { e.stopPropagation(); stepLightbox(-1); };
  lbNextBtn.onclick = e => { e.stopPropagation(); stepLightbox(1); };
}

function renderLightboxItem() {
  if (!lm || !lmImg) return;
  const hasList = lbPlaylist.length > 1 && lbIndex >= 0;
  if (lbPrevBtn) lbPrevBtn.hidden = !hasList;
  if (lbNextBtn) lbNextBtn.hidden = !hasList;
  if (hasList) {
    const item = lbPlaylist[lbIndex];
    lmImg.src = item.src;
    lmImg.alt = item.alt || item.title || 'Gallery preview';
    if (lbCaptionEl) lbCaptionEl.textContent = `${lbIndex + 1} / ${lbPlaylist.length} • ${item.title || item.alt || ''}`;
    if (!calm) {
      lmImg.classList.remove('tab-anim');
      void lmImg.offsetWidth;
      lmImg.classList.add('tab-anim');
    }
  } else if (lbCaptionEl) {
    lbCaptionEl.textContent = lmImg.alt || '';
  }
}

function stepLightbox(delta) {
  if (lbPlaylist.length <= 1 || lbIndex < 0) return;
  lbIndex = (lbIndex + delta + lbPlaylist.length) % lbPlaylist.length;
  renderLightboxItem();
}

function openModalImage(src, altText, playlist = null, index = -1) {
  if (!lm || !lmImg) return;
  lastFocusedEl = document.activeElement;
  if (Array.isArray(playlist) && playlist.length > 0 && index >= 0) {
    lbPlaylist = playlist;
    lbIndex = index;
  } else {
    lbPlaylist = [];
    lbIndex = -1;
    lmImg.src = src;
    lmImg.alt = altText || 'AGCM-KNUST Technical Department preview';
  }
  renderLightboxItem();
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
window.stepLightbox = stepLightbox;

if ($('#logo')) {
  $('#logo').onclick = () => openModalImage(ROOT + 'assets/logo.png', 'AGCM-KNUST Technical Department crest');
}
if (lm) {
  lm.onclick = e => { if (e.target === lm || e.target === lmClose) closeModalImage(); };
  addEventListener('keydown', e => {
    if (lm.hidden) return;
    if (e.key === 'Escape') closeModalImage();
    else if (e.key === 'ArrowLeft') stepLightbox(-1);
    else if (e.key === 'ArrowRight') stepLightbox(1);
    else if (e.key === 'Tab' && lmClose && lbPlaylist.length <= 1) {
      e.preventDefault();
      lmClose.focus();
    }
  });
  let touchX0 = 0, touchY0 = 0, touchT0 = 0;
  lm.addEventListener('touchstart', e => {
    if (!e.touches || e.touches.length !== 1) return;
    touchX0 = e.touches[0].clientX;
    touchY0 = e.touches[0].clientY;
    touchT0 = Date.now();
  }, { passive: true });
  lm.addEventListener('touchend', e => {
    if (!e.changedTouches || e.changedTouches.length !== 1 || !touchT0) return;
    const dx = e.changedTouches[0].clientX - touchX0;
    const dy = e.changedTouches[0].clientY - touchY0;
    const dt = Date.now() - touchT0;
    touchT0 = 0;
    if (dt <= 650 && Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      stepLightbox(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
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
    const initialsEsc = escapeHTML(getInitials(ex.name));
    const avHtml = ex.photo
      ? `<img src="${escapeHTML(ex.photo)}" width="56" height="56" loading="lazy" decoding="async" alt="${nameEsc}" data-initials="${initialsEsc}">`
      : `<span class="ex-av-initials" aria-hidden="true">${initialsEsc}</span>`;
    html += `
      <article class="ex-card rv">
        <div class="ex-av" title="${nameEsc} (${portEsc})">${avHtml}</div>
        <div class="ex-info">
          <h3 class="ex-name">${nameEsc}</h3>
          <span class="ex-port-badge">${portEsc}</span>
        </div>
      </article>`;
  });
  exg.innerHTML = html;
  $$('.ex-av img', exg).forEach(img => {
    img.addEventListener('error', () => {
      const init = img.getAttribute('data-initials') || 'EX';
      img.parentNode.innerHTML = `<span class="ex-av-initials" aria-hidden="true">${escapeHTML(init)}</span>`;
    }, { once: true });
  });
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
    function buildGalleryPlaceholderSVG(it) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="55%" stop-color="#312e81"/>
            <stop offset="100%" stop-color="#4338ca"/>
          </linearGradient>
        </defs>
        <rect width="960" height="540" rx="28" fill="url(#bg)"/>
        <g stroke="#f59e0b" stroke-width="6" stroke-linecap="round" opacity="0.85">
          <line x1="380" y1="220" x2="380" y2="180"/><line x1="405" y1="220" x2="405" y2="145"/>
          <line x1="430" y1="220" x2="430" y2="165"/><line x1="455" y1="220" x2="455" y2="120"/>
          <line x1="480" y1="220" x2="480" y2="100"/><line x1="505" y1="220" x2="505" y2="135"/>
          <line x1="530" y1="220" x2="530" y2="160"/><line x1="555" y1="220" x2="555" y2="150"/>
          <line x1="580" y1="220" x2="580" y2="185"/>
        </g>
        <text x="480" y="295" text-anchor="middle" fill="#fde68a" font-family="Inter, sans-serif" font-size="20" font-weight="800">${escapeHTML(it.venue.toUpperCase())}</text>
        <text x="480" y="345" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-size="30" font-weight="800">${escapeHTML(it.title)}</text>
        <text x="480" y="395" text-anchor="middle" fill="#cbd5e1" font-family="Inter, sans-serif" font-size="17" font-weight="600">AGCM - KNUST Technical Department • ${escapeHTML(it.cat)}</text>
      </svg>`;
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    const items = window.GALLERY_ITEMS.filter(x => activeCat === 'ALL' || x.cat === activeCat);
    const playlist = items.map(it => ({
      src: it.photo ? it.photo : buildGalleryPlaceholderSVG(it),
      title: `${it.title} (${it.venue})`,
      alt: it.title
    }));

    galGrid.innerHTML = items.map((it, idx) => {
      const titleEsc = escapeHTML(it.title);
      const venueEsc = escapeHTML(it.venue);
      const descEsc  = escapeHTML(it.desc);
      const catEsc   = escapeHTML(it.cat);
      const hasPhoto = Boolean(it.photo);
      return `
        <article class="gal-card has-photo rv" tabindex="0" role="button" aria-label="View in lightbox: ${titleEsc}" data-idx="${idx}">
          <div class="gal-thumb">
            ${hasPhoto
              ? `<img src="${escapeHTML(it.photo)}" width="640" height="360" loading="lazy" decoding="async" alt="${titleEsc}">`
              : `<div class="gal-placeholder-art">
                   <span class="gal-icon" aria-hidden="true">${escapeHTML(it.icon)}</span>
                   <div class="gal-eq-bars" aria-hidden="true">
                     <i style="height:45%"></i><i style="height:80%"></i><i style="height:60%"></i><i style="height:100%"></i><i style="height:70%"></i><i style="height:90%"></i><i style="height:50%"></i>
                   </div>
                   <span class="gal-venue-pill">${venueEsc}</span>
                 </div>`}
            <span class="gal-tag">${catEsc}</span>
          </div>
          <div class="gal-body">
            <div class="kicker">${venueEsc}</div>
            <h2>${titleEsc}</h2>
            <p class="sm text-sec">${descEsc}</p>
          </div>
        </article>`;
    }).join('');

    $$('.gal-card', galGrid).forEach(card => {
      const idx = parseInt(card.dataset.idx || '0', 10);
      const openCard = () => openModalImage(playlist[idx].src, playlist[idx].alt, playlist, idx);
      card.onclick = openCard;
      card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); } };
    });

    if (!calm) {
      galGrid.classList.remove('tab-anim');
      void galGrid.offsetWidth;
      galGrid.classList.add('tab-anim');
    }
    attachReveal($$('.gal-card.rv', galGrid));
  }
  renderGallery();
}

/* ── Role Handover Notes Workspace (Inside Audio Portal #handover tab) ── */
const tabs = $('#tabs');
if (tabs && window.ROLES) {
  let cur = parseInt(store.get('agcm_active_role_v1') || '0', 10) || 0;
  const panel = $('#panel');

  tabs.innerHTML = window.ROLES.map((r, idx) =>
    `<button type="button" class="ch-btn" role="tab" id="role-tab-${idx}" aria-selected="${idx === 0}">${escapeHTML(r.name)}</button>`
  ).join('');
  const btns = $$('.ch-btn', tabs);

  function showRole(i) {
    cur = (i + window.ROLES.length) % window.ROLES.length;
    store.set('agcm_active_role_v1', String(cur));
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

    if (!calm) { panel.classList.remove('tab-anim'); void panel.offsetWidth; panel.classList.add('tab-anim'); }
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
  window.refreshHandoverRoleView = () => showRole(cur);
  showRole(cur);
}

