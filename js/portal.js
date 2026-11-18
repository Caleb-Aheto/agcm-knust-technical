const _memStore = {};
function safeGetItem(k) {
  try { const v = window.localStorage.getItem(k); return v !== null ? v : (_memStore[k] || null); } catch (e) { return _memStore[k] || null; }
}
function safeSetItem(k, v) {
  _memStore[k] = String(v); try { window.localStorage.setItem(k, String(v)); } catch (e) {}
}

const CFG = window.PORTAL_CONFIG || {};
const PDATA = window.PORTAL_DATA || {};
const DEFAULT_EVENTS = PDATA.DEFAULT_EVENTS || [];
const CHANNELS = PDATA.CHANNELS || {};
const BEFORE_AFTER_DATA = PDATA.BEFORE_AFTER_DATA || {};
const CHECKLIST_PHASES = PDATA.CHECKLIST_PHASES || [];
const MATRIX_ZONES = PDATA.MATRIX_ZONES || [];
const SNAKE_MAP = PDATA.SNAKE_MAP || {};
const AUDIOLINK_OUTPUTS = PDATA.AUDIOLINK_OUTPUTS || [];
const CONSOLE_OUTPUTS = PDATA.CONSOLE_OUTPUTS || [];
const DEFAULT_STRATEGIES = PDATA.DEFAULT_STRATEGIES || [];
const DEFAULT_GEAR = PDATA.DEFAULT_GEAR || [];
const ALL_32_INPUTS = PDATA.ALL_32_INPUTS || [];
const HEALTHY_SNAKE_PORTS = PDATA.HEALTHY_SNAKE_PORTS || [];
const RECORDING_CHECKLIST = PDATA.RECORDING_CHECKLIST || [];
const AUDITION_RACK_PRESETS = PDATA.AUDITION_RACK_PRESETS || {};
const DEPT_DOCS = PDATA.DEPT_DOCS || {};

    function safeParseJSON(raw, fallback) {
      if (!raw) return fallback;
      try { const v = JSON.parse(raw); return v !== null && v !== undefined ? v : fallback; } catch (e) { return fallback; }
    }

    let currentView = (location.hash && document.getElementById('view-' + location.hash.slice(1)))
      ? location.hash.slice(1)
      : (safeGetItem('agcm_portal_view_v1') || 'planner');
    let currentChannelId = safeGetItem('sdu_active_ch') || 'lv';
    let showProblemGhost = safeGetItem('agcm_eq_ghost_v1') !== 'false';
    let checklistFilter = safeGetItem('agcm_chk_filter_v1') || 'ALL';
    let matrixFilter = safeGetItem('agcm_matrix_filter_v1') || 'ALL';
    let activeBeforeAfterKey = safeGetItem('agcm_ba_key_v1') || 'lv';
    let channelEqOverrides = safeParseJSON(safeGetItem('agcm_eq_overrides_v1'), {});
    let eventsList = safeParseJSON(safeGetItem('agcm_events_v4'), null) || DEFAULT_EVENTS;
    let activeEventId = safeGetItem('agcm_active_ev_v4') || eventsList[0].id;
    let checkedItems = safeParseJSON(safeGetItem('sdu_checked_v35'), {});
    let recCheckedItems = safeParseJSON(safeGetItem('agcm_rec_checked_v1'), {});
    let activeAuditionPreset = safeGetItem('agcm_audition_preset_v1') || 'sermon';
    let customStrategies = safeParseJSON(safeGetItem('sdu_custom_strats_v35'), []);
    let gearInventory = safeParseJSON(safeGetItem('sdu_gear_v35'), null) || DEFAULT_GEAR;
    let tapTimes = [];

    function showToast(msg) {
      if (typeof window.toast === 'function') window.toast(msg);
    }

    const PORTAL_TAB_ORDER = ['planner', 'channels', 'checklist', 'patch', 'mastering', 'recording', 'matrix', 'forensics', 'calculators', 'sop'];
    const PORTAL_TAB_LABELS = {
      planner: '📅 Service Planner',
      channels: '🎛️ Channels',
      checklist: '✅ Soundcheck',
      patch: '🔌 Patch',
      mastering: '🎚️ Mixing & Mastering',
      recording: '🎙️ Recording & Editing',
      matrix: '🌊 Frequency Masking',
      forensics: '📊 Audio Reference',
      calculators: '📐 Venue Calculators',
      sop: '🎤 Gear'
    };

    function switchView(viewName, direction = 0) {
      if (!PORTAL_TAB_ORDER.includes(viewName)) viewName = 'planner';
      const prevIdx = PORTAL_TAB_ORDER.indexOf(currentView);
      const nextIdx = PORTAL_TAB_ORDER.indexOf(viewName);
      const dir = direction !== 0 ? direction : (prevIdx !== -1 && nextIdx !== -1 && prevIdx !== nextIdx ? (nextIdx > prevIdx ? 1 : -1) : 0);
      currentView = viewName;
      safeSetItem('agcm_portal_view_v1', viewName);
      try { if (location.hash !== '#' + viewName) history.replaceState(null, '', '#' + viewName); } catch (e) {}

      PORTAL_TAB_ORDER.forEach(v => {
        const sec = document.getElementById('view-' + v);
        const btn = document.getElementById('tab-btn-' + v);
        if (sec) {
          if (v === viewName) {
            sec.classList.add('active-view');
            sec.style.display = 'block';
            sec.classList.remove('view-animate', 'view-slide-next', 'view-slide-prev');
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              void sec.offsetWidth;
              sec.classList.add(dir > 0 ? 'view-slide-next' : (dir < 0 ? 'view-slide-prev' : 'view-animate'));
            }
          } else {
            sec.classList.remove('active-view');
            sec.style.display = 'none';
          }
        }
        if (btn) {
          btn.classList.toggle('active', v === viewName);
          btn.setAttribute('aria-selected', v === viewName ? 'true' : 'false');
        }
      });

      document.querySelectorAll('[data-mob-tab]').forEach(mb => {
        mb.classList.toggle('active', mb.getAttribute('data-mob-tab') === viewName);
      });
      const mobLbl = document.getElementById('portal-mobile-active-label');
      if (mobLbl && PORTAL_TAB_LABELS[viewName]) mobLbl.textContent = PORTAL_TAB_LABELS[viewName];
      const mobKicker = document.getElementById('portal-mobile-kicker');
      const tabIdx = PORTAL_TAB_ORDER.indexOf(viewName);
      if (mobKicker && tabIdx !== -1) mobKicker.textContent = `Active Module (${tabIdx + 1} / ${PORTAL_TAB_ORDER.length})`;

      if (viewName === 'channels') setTimeout(drawEQCurve, 30);
    }

    function stepPortalView(delta) {
      const idx = PORTAL_TAB_ORDER.indexOf(currentView);
      const nextIdx = ((idx === -1 ? 0 : idx) + delta + PORTAL_TAB_ORDER.length) % PORTAL_TAB_ORDER.length;
      closeMobilePortalGrid();
      switchView(PORTAL_TAB_ORDER[nextIdx], delta);
    }

    function toggleMobilePortalGrid() {
      const g = document.getElementById('portal-mobile-grid');
      const b = document.getElementById('btn-portal-mob-toggle');
      if (!g) return;
      g.hidden = !g.hidden;
      if (b) b.setAttribute('aria-expanded', String(!g.hidden));
    }
    function closeMobilePortalGrid() {
      const g = document.getElementById('portal-mobile-grid');
      const b = document.getElementById('btn-portal-mob-toggle');
      if (g) g.hidden = true;
      if (b) b.setAttribute('aria-expanded', 'false');
    }

    function getActiveEvent() {
      return eventsList.find(e => e.id === activeEventId) || eventsList[0];
    }

    function saveEvents() {
      safeSetItem('agcm_events_v4', JSON.stringify(eventsList));
      safeSetItem('agcm_active_ev_v4', activeEventId);
    }

    function renderPlanner() {
      const sel = document.getElementById('event-selector');
      if (sel) {
        sel.innerHTML = eventsList.map(e => `<option value="${e.id}" ${e.id === activeEventId ? 'selected' : ''}>${e.name}</option>`).join('');
      }
      const ev = getActiveEvent();
      if (!ev) return;

      document.getElementById('planner-event-type').textContent = ev.type;
      document.getElementById('ev-name').value = ev.name;
      document.getElementById('ev-venue').value = ev.venue;
      document.getElementById('ev-time').value = ev.time;
      document.getElementById('ev-notes').value = ev.notes;

      const crewGrid = document.getElementById('crew-roster-grid');
      if (crewGrid) {
        crewGrid.innerHTML = ev.crew.map((c, idx) => `
          <div class="dept-subtle-box flex flex-col gap-1">
            <label class="text-[11px] font-bold uppercase text-blue-600">${c.role}</label>
            <input type="text" value="${escapeHTML(c.person)}" data-input-action="update-crew-member" data-arg="${idx}" class="dept-input text-xs font-semibold" />
          </div>
        `).join('');
      }

      const cueBody = document.getElementById('cue-sheet-body');
      if (cueBody) {
        cueBody.innerHTML = ev.cues.map((c, idx) => {
          const pill = c.status === 'LIVE NOW'
            ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
            : (c.status === 'Done' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-blue-50 text-blue-800 border-blue-200');
          return `
            <tr>
              <td class="font-bold text-main whitespace-nowrap tabular">${c.time}</td>
              <td class="font-bold text-main">${c.seg}</td>
              <td class="text-sec">${c.lead}</td>
              <td class="text-sec max-w-xs">${c.audio}</td>
              <td class="text-sec max-w-xs">${c.media}</td>
              <td>
                <button data-action="cycle-cue" data-arg="${idx}" class="px-3 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap ${pill} transition">
                  ${c.status}
                </button>
              </td>
              <td>
                <button data-action="remove-cue" data-arg="${idx}" class="text-xs font-bold text-rose-600 hover:underline">Remove</button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    function selectEvent(id) {
      activeEventId = id;
      saveEvents();
      renderPlanner();
    }

    function updateActiveEventMeta() {
      const ev = getActiveEvent();
      ev.name = document.getElementById('ev-name').value;
      ev.venue = document.getElementById('ev-venue').value;
      ev.time = document.getElementById('ev-time').value;
      ev.notes = document.getElementById('ev-notes').value;
      saveEvents();
      const sel = document.getElementById('event-selector');
      if (sel) sel.options[sel.selectedIndex].textContent = ev.name;
    }

    function updateCrewMember(idx, val) {
      const ev = getActiveEvent();
      ev.crew[idx].person = val;
      saveEvents();
    }

    function cycleCueStatus(idx) {
      const states = ['Upcoming', 'LIVE NOW', 'Done'];
      const ev = getActiveEvent();
      const cur = ev.cues[idx].status;
      ev.cues[idx].status = states[(states.indexOf(cur) + 1) % states.length];
      saveEvents();
      renderPlanner();
    }

    function removeCue(idx) {
      const ev = getActiveEvent();
      ev.cues.splice(idx, 1);
      saveEvents();
      renderPlanner();
    }

    function openNewEventModal() { const m = document.getElementById('modal-new-event'); m.classList.remove('hidden'); m.classList.add('flex'); }
    function closeNewEventModal() { const m = document.getElementById('modal-new-event'); m.classList.add('hidden'); m.classList.remove('flex'); }
    function createNewEvent() {
      const name = document.getElementById('new-ev-name').value.trim();
      if (!name) return;
      const newEv = {
        id: 'ev_' + Date.now(),
        name,
        type: document.getElementById('new-ev-type').value.trim() || 'Special Event',
        venue: document.getElementById('new-ev-venue').value.trim() || CFG.primaryVenue,
        time: document.getElementById('new-ev-time').value.trim() || 'Call: TBD',
        notes: 'Run 15-sec vocal mic scratch check & color-tape verification.',
        crew: (CFG.defaultCrewRoles || []).map(r => ({ ...r })),
        cues: [
          { time: '00:00', seg: 'Soundcheck & Line Check', lead: 'Technical Crew', audio: 'Verify all inputs & 32x8 snake ports', media: 'Verify Capture recording & conveyance checklist', status: 'Upcoming' }
        ]
      };
      eventsList.push(newEv);
      activeEventId = newEv.id;
      saveEvents();
      closeNewEventModal();
      renderPlanner();
      showToast('Created new service plan: ' + name);
    }

    function openAddCueModal() { const m = document.getElementById('modal-add-cue'); m.classList.remove('hidden'); m.classList.add('flex'); }
    function closeAddCueModal() { const m = document.getElementById('modal-add-cue'); m.classList.add('hidden'); m.classList.remove('flex'); }
    function saveNewCue() {
      const seg = document.getElementById('cue-seg').value.trim();
      if (!seg) return;
      const ev = getActiveEvent();
      ev.cues.push({
        time: document.getElementById('cue-time').value.trim() || 'TBD',
        seg,
        lead: document.getElementById('cue-lead').value.trim() || 'TBD',
        audio: document.getElementById('cue-audio').value.trim() || 'Standard mix',
        media: document.getElementById('cue-media').value.trim() || '—',
        status: 'Upcoming'
      });
      saveEvents();
      closeAddCueModal();
      renderPlanner();
      showToast('Added cue to ' + ev.name);
    }

    function copyEventRunSheetWhatsApp() {
      const ev = getActiveEvent();
      const crewLines = ev.crew.map(c => `• ${c.role}: ${c.person}`).join('\n');
      const cueLines = ev.cues.map(c => `• [${c.time}] ${c.seg} (${c.lead}) → ${c.audio}`).join('\n');
      const txt = `*AGCM - KNUST TECHNICAL — ${ev.name.toUpperCase()}*\n📍 ${ev.venue} | ⏰ ${ev.time}\n\n*CREW ROSTER:*\n${crewLines}\n\n*ORDER OF SERVICE CUES:*\n${cueLines}`;
      navigator.clipboard?.writeText(txt);
      showToast('Copied crew run-sheet for WhatsApp!');
    }

    // =========================================================================
    // OTHER MODULE RENDERERS
    // =========================================================================
    function renderForensicCharts() {
      const container = document.getElementById('chart-forensic-stems');
      if (!container) return;
      container.innerHTML = Object.values(CHANNELS).map(ch => {
        const rmsPct = Math.max(8, Math.min(100, ((ch.rmsNum + 45) / 45) * 100));
        const peakPct = Math.max(10, Math.min(100, ((ch.peakNum + 45) / 45) * 100));
        const barColor = ch.severity === 'CRITICAL' ? 'bg-blue-600' : (ch.severity === 'PHASE' ? 'bg-amber-500' : 'bg-emerald-500');
        return `
          <div class="space-y-1 tabular">
            <div class="flex justify-between text-xs"><span class="font-bold text-main">${ch.shortName}</span><span class="text-mut">RMS ${ch.rms} • Peak ${ch.peak}</span></div>
            <div class="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
              <div class="h-full ${barColor} rounded-full" style="width:${rmsPct.toFixed(1)}%"></div>
              <div class="w-1 h-full bg-rose-600 absolute top-0" style="left:calc(${peakPct.toFixed(1)}% - 2px)"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderBeforeAfterChart(key) {
      activeBeforeAfterKey = BEFORE_AFTER_DATA[key] ? key : 'lv';
      safeSetItem('agcm_ba_key_v1', activeBeforeAfterKey);
      const data = BEFORE_AFTER_DATA[activeBeforeAfterKey] || BEFORE_AFTER_DATA.lv;
      const btnLv = document.getElementById('btn-ba-lv');
      const btnKick = document.getElementById('btn-ba-kick');
      if (btnLv && btnKick) {
        btnLv.className = key === 'lv' ? 'px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white transition' : 'px-3.5 py-2 rounded-lg text-xs font-bold btn-subtle transition';
        btnKick.className = key === 'kick' ? 'px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white transition' : 'px-3.5 py-2 rounded-lg text-xs font-bold btn-subtle transition';
      }
      const container = document.getElementById('chart-before-after');
      if (!container) return;
      container.innerHTML = `
        <div class="dept-subtle-box mb-3"><div class="text-xs font-bold text-main">${data.title}</div><div class="text-xs text-sec mt-0.5">${data.subtitle}</div></div>
        ${data.bands.map(b => `
          <div class="space-y-1.5 tabular">
            <div class="flex justify-between text-xs"><span class="font-semibold text-main">${b.name}</span><span class="text-blue-600 font-bold">Raw ${b.before}% → Mastered ${b.after}% (${b.delta})</span></div>
            <div class="grid grid-cols-2 gap-2">
              <div class="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-rose-400 rounded-full" style="width:${Math.min(100, b.before * 1.3)}%"></div></div>
              <div class="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width:${Math.min(100, b.after * 1.3)}%"></div></div>
            </div>
          </div>
        `).join('')}
      `;
    }

    function renderForensicTable() {
      const tbody = document.getElementById('forensic-table-body');
      if (!tbody) return;
      const q = (document.getElementById('forensic-search')?.value || '').toLowerCase();
      const f = document.getElementById('forensic-band-filter')?.value || 'ALL';
      const rows = Object.values(CHANNELS).filter(ch => {
        if (f === 'CRITICAL' && ch.severity !== 'CRITICAL') return false;
        if (f === 'PHASE' && ch.severity !== 'PHASE') return false;
        if (f === 'VOCAL' && !ch.isVocal) return false;
        if (q && !(ch.name.toLowerCase().includes(q) || ch.forensicSummary.toLowerCase().includes(q) || ch.domFreq.toLowerCase().includes(q))) return false;
        return true;
      });
      tbody.innerHTML = rows.map(ch => {
        const badge = ch.severity === 'CRITICAL'
          ? '<span class="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">CRITICAL</span>'
          : (ch.severity === 'PHASE' ? '<span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">PHASE Ø</span>' : '<span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">VERIFIED</span>');
        return `
          <tr class="tabular">
            <td><div class="font-bold text-main">${ch.shortName}</div><div class="text-xs mt-0.5">${badge}</div></td>
            <td class="text-xs"><div class="font-bold text-main">Peak: ${ch.peak}</div><div class="text-sec">Active: ${ch.rms}</div></td>
            <td class="text-xs font-semibold text-main">${ch.gatePct}</td>
            <td class="text-xs"><div class="font-bold text-blue-600">${ch.domFreq}</div><div class="text-sec">${ch.phase}</div></td>
            <td class="text-xs text-sec max-w-xs">${ch.bands7}</td>
            <td class="text-sm text-sec max-w-md leading-relaxed">${ch.forensicSummary}</td>
            <td><button data-action="load-channel-editor" data-arg="${ch.id}" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold whitespace-nowrap shadow-sm">Load in ${CFG.consoleShort} Editor →</button></td>
          </tr>
        `;
      }).join('');
    }

    function formatFreqLabel(hz) {
      const f = Number(hz) || 0;
      return f >= 1000 ? (f / 1000).toFixed(f % 1000 === 0 ? 1 : 2) + ' kHz' : Math.round(f) + ' Hz';
    }

    function syncBandLabelsAndSliders(n, freq, gain, q, desc) {
      const gStr = (gain >= 0 ? '+' : '') + Number(gain).toFixed(1) + ' dB';
      const qStr = Number(q).toFixed(1);
      const fStr = formatFreqLabel(freq);
      const lblFreq = document.getElementById(`lbl-b${n}-freq`);
      const lblGain = document.getElementById(`lbl-b${n}-gain`);
      const lblDesc = document.getElementById(`lbl-b${n}-desc`);
      const valGain = document.getElementById(`val-b${n}-gain`);
      const valFreq = document.getElementById(`val-b${n}-freq`);
      const valQ    = document.getElementById(`val-b${n}-q`);
      if (lblFreq) lblFreq.textContent = `Band ${n}: ${Math.round(freq)} Hz (Q ${qStr})`;
      if (lblGain) lblGain.textContent = gStr;
      if (lblDesc && desc !== undefined) lblDesc.textContent = desc;
      if (valGain) valGain.textContent = gStr;
      if (valFreq) valFreq.textContent = fStr;
      if (valQ)    valQ.textContent    = qStr;

      const slGain = document.getElementById(`slider-b${n}`);
      const slFreq = document.getElementById(`slider-b${n}-freq`);
      const slQ    = document.getElementById(`slider-b${n}-q`);
      if (slGain) slGain.value = gain;
      if (slFreq) {
        if (freq < parseFloat(slFreq.min)) slFreq.min = Math.max(20, Math.floor(freq));
        if (freq > parseFloat(slFreq.max)) slFreq.max = Math.min(20000, Math.ceil(freq));
        slFreq.value = Math.round(freq);
      }
      if (slQ) slQ.value = q;
    }

    function getActiveBandParams(ch) {
      return [1, 2, 3, 4].map((n, idx) => {
        const def = ch.eq[idx] || { freq: 1000, q: 1.0, gain: 0, desc: '' };
        const slG = document.getElementById(`slider-b${n}`);
        const slF = document.getElementById(`slider-b${n}-freq`);
        const slQ = document.getElementById(`slider-b${n}-q`);
        return {
          freq: slF ? parseFloat(slF.value) : def.freq,
          gain: slG ? parseFloat(slG.value) : def.gain,
          q:    slQ ? parseFloat(slQ.value) : def.q,
          desc: def.desc
        };
      });
    }

    function selectChannel(id) {
      if (!CHANNELS[id]) return;
      currentChannelId = id;
      safeSetItem('sdu_active_ch', id);
      const ch = CHANNELS[id];
      const ov = channelEqOverrides[id] || null;
      document.querySelectorAll('#channel-selector-bar .ch-btn').forEach(btn => btn.classList.toggle('active', btn.id === id));
      document.getElementById('selected-channel-badge').textContent = ch.shortName;
      document.getElementById('ch-title').textContent = ch.name;
      document.getElementById('ch-routing-badge').textContent = ch.snakeCh;
      document.getElementById('ch-forensic-summary').textContent = ch.forensicSummary;
      document.getElementById('ch-stat-peak').textContent = ch.peak;
      document.getElementById('ch-stat-rms').textContent = ch.rms;
      document.getElementById('ch-stat-gate').textContent = ch.gatePct;
      document.getElementById('ch-stat-dom').textContent = ch.domFreq;
      document.getElementById('ch-preamp-val').textContent = ch.preamp;
      document.getElementById('ch-gate-val').textContent = ch.gate;
      document.getElementById('ch-comp-val').textContent = ch.comp;
      document.getElementById('ch-stage-tip').textContent = ch.stageTip;
      const hpfVal = (ov && typeof ov.hpf === 'number') ? ov.hpf : ch.hpf;
      document.getElementById('slider-hpf').value = hpfVal;
      document.getElementById('lbl-hpf').textContent = Math.round(hpfVal) + ' Hz';
      ch.eq.forEach((b, idx) => {
        const n = idx + 1;
        const gVal = (ov && Array.isArray(ov.gains) && typeof ov.gains[idx] === 'number') ? ov.gains[idx] : b.gain;
        const fVal = (ov && Array.isArray(ov.freqs) && typeof ov.freqs[idx] === 'number') ? ov.freqs[idx] : b.freq;
        const qVal = (ov && Array.isArray(ov.qs) && typeof ov.qs[idx] === 'number') ? ov.qs[idx] : b.q;
        syncBandLabelsAndSliders(n, fVal, gVal, qVal, b.desc);
      });
      const ghostBtn = document.getElementById('btn-toggle-problem-Ghost');
      if (ghostBtn) ghostBtn.textContent = 'Show Raw Problem Peak: ' + (showProblemGhost ? 'ON' : 'OFF');
      drawEQCurve();
    }

    function onEQSliderChange() {
      const ch = CHANNELS[currentChannelId];
      if (!ch) return;
      const hpf = parseFloat(document.getElementById('slider-hpf').value);
      document.getElementById('lbl-hpf').textContent = Math.round(hpf) + ' Hz';
      const gains = [], freqs = [], qs = [];
      for (let i = 1; i <= 4; i++) {
        const g = parseFloat(document.getElementById(`slider-b${i}`).value);
        const f = parseFloat(document.getElementById(`slider-b${i}-freq`)?.value || ch.eq[i - 1].freq);
        const q = parseFloat(document.getElementById(`slider-b${i}-q`)?.value || ch.eq[i - 1].q);
        gains.push(g);
        freqs.push(f);
        qs.push(q);
        syncBandLabelsAndSliders(i, f, g, q);
      }
      channelEqOverrides[currentChannelId] = { hpf, gains, freqs, qs };
      safeSetItem('agcm_eq_overrides_v1', JSON.stringify(channelEqOverrides));
      drawEQCurve();
    }

    function resetCurrentChannelEQ() {
      delete channelEqOverrides[currentChannelId];
      safeSetItem('agcm_eq_overrides_v1', JSON.stringify(channelEqOverrides));
      selectChannel(currentChannelId);
      showToast('Restored preset for ' + CHANNELS[currentChannelId].shortName);
    }

    function toggleProblemGhost() {
      showProblemGhost = !showProblemGhost;
      safeSetItem('agcm_eq_ghost_v1', String(showProblemGhost));
      const btn = document.getElementById('btn-toggle-problem-Ghost');
      if (btn) btn.textContent = 'Show Raw Problem Peak: ' + (showProblemGhost ? 'ON' : 'OFF');
      drawEQCurve();
    }

    let _eqHoverX = -1, _eqHoverY = -1, _eqHoverBand = -1, _eqDragBand = -1, _eqDragStartY = 0, _eqDragStartQ = 1, _eqEventsBound = false;
    function drawEQCurve() {
      const canvas = document.getElementById('eq-curve-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width, H = canvas.height;
      const padL = 44, padR = 22, padT = 28, padB = 30;
      const plotW = W - padL - padR, plotH = H - padT - padB;
      ctx.clearRect(0, 0, W, H);

      const ch = CHANNELS[currentChannelId];
      if (!ch) return;
      const hpf = parseFloat(document.getElementById('slider-hpf').value || ch.hpf);
      const bands = getActiveBandParams(ch);

      const fToX = f => padL + (Math.log10(Math.max(20, Math.min(20000, f)) / 20) / 3) * plotW;
      const xToF = x => 20 * Math.pow(1000, Math.max(0, Math.min(1, (x - padL) / plotW)));
      const dbToY = db => padT + (plotH / 2) - (db / 16) * (plotH / 2 - 6);
      const yToDb = y => Math.max(-15, Math.min(15, ((padT + plotH / 2 - y) / (plotH / 2 - 6)) * 16));

      const evalBandDb = (b, idx, f) => {
        const g = b.gain;
        if (Math.abs(g) < 0.05) return 0;
        if (idx === 3 && b.q <= 0.75) {
          // Smooth high-shelf response when Band 4 Q is low
          const ratio = Math.pow(f / Math.max(20, b.freq), 2 * Math.max(0.4, b.q));
          return g * (ratio / (1 + ratio));
        }
        const oct = Math.log2(f / Math.max(20, b.freq));
        const bw = 1 / Math.max(0.3, b.q);
        return g * Math.exp(-(oct * oct) / (0.18 * bw * bw));
      };

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#090d1a');
      bgGrad.addColorStop(1, '#05070f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Acoustic spectrum zone headers
      const zones = [
        { name: 'SUB', f1: 20, f2: 60 },
        { name: 'BASS', f1: 60, f2: 250 },
        { name: 'LOW-MID', f1: 250, f2: 500 },
        { name: 'MID', f1: 500, f2: 2000 },
        { name: 'PRESENCE', f1: 2000, f2: 6000 },
        { name: 'AIR', f1: 6000, f2: 20000 }
      ];
      ctx.font = '600 9px Inter, sans-serif';
      zones.forEach((z, idx) => {
        const x1 = fToX(z.f1), x2 = fToX(z.f2);
        if (idx % 2 === 1) {
          ctx.fillStyle = 'rgba(255,255,255,0.018)';
          ctx.fillRect(x1, padT, x2 - x1, plotH);
        }
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        ctx.fillText(z.name, (x1 + x2) / 2, 16);
      });

      // Frequency & dB grid
      ctx.lineWidth = 1;
      [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000].forEach(f => {
        const x = fToX(f);
        ctx.strokeStyle = 'rgba(148,163,184,0.10)';
        ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, H - padB); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '600 10px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(f >= 1000 ? (f / 1000) + 'k' : f, x, H - 10);
      });
      [-12, -6, 0, 6, 12].forEach(db => {
        const y = dbToY(db);
        ctx.strokeStyle = db === 0 ? 'rgba(148,163,184,0.32)' : 'rgba(148,163,184,0.10)';
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '600 10px Inter, sans-serif'; ctx.textAlign = 'right';
        ctx.fillText((db > 0 ? '+' : '') + db + 'dB', padL - 6, y + 3);
      });

      const bandColors = ['#10b981', '#f59e0b', '#a855f7', '#38bdf8'];
      const bandFillColors = ['rgba(16,185,129,0.16)', 'rgba(245,158,11,0.16)', 'rgba(168,85,247,0.16)', 'rgba(56,189,248,0.16)'];
      const zeroY = dbToY(0);

      // Individual band shaded responses (smooth 1.5px step)
      bands.forEach((b, idx) => {
        if (Math.abs(b.gain) < 0.08) return;
        ctx.beginPath();
        ctx.moveTo(padL, zeroY);
        for (let px = padL; px <= W - padR; px += 1.5) {
          const f = xToF(px);
          ctx.lineTo(px, dbToY(evalBandDb(b, idx, f)));
        }
        ctx.lineTo(W - padR, zeroY);
        ctx.closePath();
        ctx.fillStyle = bandFillColors[idx];
        ctx.fill();
        if (_eqHoverBand === idx + 1 || _eqDragBand === idx + 1) {
          ctx.strokeStyle = bandColors[idx];
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      });

      // Raw problem resonance ghost curve
      if (showProblemGhost && ch.problemFreq) {
        ctx.beginPath();
        for (let px = padL; px <= W - padR; px += 1.5) {
          const f = xToF(px);
          const octDist = Math.log2(f / ch.problemFreq);
          const db = ch.problemGain * Math.exp(-(octDist * octDist) / 0.08);
          const y = dbToY(db);
          if (px === padL) ctx.moveTo(px, y); else ctx.lineTo(px, y);
        }
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.78)';
        ctx.setLineDash([5, 4]); ctx.lineWidth = 1.8; ctx.stroke(); ctx.setLineDash([]);
      }

      // Composite curve + under-curve glow fill (1px smooth resolution)
      const pts = [];
      for (let px = padL; px <= W - padR; px += 1) {
        const f = xToF(px);
        let totalDb = 0;
        if (f < hpf * 1.55) {
          const ratio = hpf / Math.max(10, f);
          if (ratio > 1) totalDb -= 18 * Math.log2(ratio);
        }
        bands.forEach((b, idx) => {
          totalDb += evalBandDb(b, idx, f);
        });
        totalDb = Math.max(-15.5, Math.min(15.5, totalDb));
        pts.push({ x: px, y: dbToY(totalDb) });
      }

      ctx.beginPath();
      ctx.moveTo(padL, zeroY);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(W - padR, zeroY);
      ctx.closePath();
      const compFill = ctx.createLinearGradient(0, padT, 0, H - padB);
      compFill.addColorStop(0, 'rgba(99,102,241,0.24)');
      compFill.addColorStop(0.5, 'rgba(56,189,248,0.05)');
      compFill.addColorStop(1, 'rgba(244,63,94,0.22)');
      ctx.fillStyle = compFill;
      ctx.fill();

      ctx.beginPath();
      pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2.6;
      ctx.shadowColor = 'rgba(56,189,248,0.55)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // HPF marker node (Band 0)
      const hpfX = fToX(hpf), hpfY = dbToY(-3);
      if (_eqHoverBand === 0 || _eqDragBand === 0) {
        ctx.fillStyle = 'rgba(99,102,241,0.28)';
        ctx.beginPath(); ctx.arc(hpfX, hpfY, 12, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#6366f1';
      ctx.beginPath(); ctx.arc(hpfX, hpfY, 6.5, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#090d1a'; ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.font = '700 8px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('H', hpfX, hpfY + 2.8);

      // Interactive Band Nodes (1-4)
      bands.forEach((b, idx) => {
        const bx = fToX(b.freq), by = dbToY(b.gain);
        const isActive = (_eqHoverBand === idx + 1 || _eqDragBand === idx + 1);
        if (isActive) {
          ctx.fillStyle = bandFillColors[idx].replace('0.16', '0.36');
          ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = bandColors[idx];
        ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = '#090d1a'; ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = '700 9.5px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(String(idx + 1), bx, by + 3.2);
      });

      // Live cursor / active band HUD readout
      if (_eqHoverX >= padL && _eqHoverX <= W - padR && _eqHoverY >= padT && _eqHoverY <= H - padB) {
        const activeIdx = (_eqDragBand > 0 ? _eqDragBand : (_eqHoverBand > 0 ? _eqHoverBand : -1));
        ctx.strokeStyle = 'rgba(255,255,255,0.16)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(_eqHoverX, padT); ctx.lineTo(_eqHoverX, H - padB); ctx.stroke();

        let hudText = '';
        if (activeIdx >= 1 && activeIdx <= 4) {
          const ab = bands[activeIdx - 1];
          const gTxt = (ab.gain >= 0 ? '+' : '') + ab.gain.toFixed(1) + ' dB';
          hudText = `Band ${activeIdx}  •  ${formatFreqLabel(ab.freq)}  •  ${gTxt}  •  Q ${ab.q.toFixed(1)}`;
        } else if (_eqDragBand === 0 || _eqHoverBand === 0) {
          hudText = `HPF (18dB/oct)  •  ${Math.round(hpf)} Hz`;
        } else {
          const hf = xToF(_eqHoverX), hdb = yToDb(_eqHoverY);
          const dTxt = (hdb >= 0 ? '+' : '') + hdb.toFixed(1) + ' dB';
          hudText = `${formatFreqLabel(hf)}  •  ${dTxt}`;
        }

        ctx.font = '700 10px Inter, sans-serif';
        const boxW = Math.max(136, ctx.measureText(hudText).width + 22);
        const boxX = W - padR - boxW - 4;
        ctx.fillStyle = 'rgba(15,23,42,0.92)';
        ctx.fillRect(boxX, padT + 4, boxW, 22);
        ctx.strokeStyle = 'rgba(148,163,184,0.32)';
        ctx.strokeRect(boxX, padT + 4, boxW, 22);
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(hudText, boxX + boxW / 2, padT + 18);
      }

      if (!_eqEventsBound) {
        _eqEventsBound = true;
        const getCanvasPos = e => {
          const r = canvas.getBoundingClientRect();
          return {
            x: (e.clientX - r.left) * (canvas.width / r.width),
            y: (e.clientY - r.top) * (canvas.height / r.height)
          };
        };
        const hitTestNode = pos => {
          const curCh = CHANNELS[currentChannelId];
          if (!curCh) return -1;
          const curBands = getActiveBandParams(curCh);
          for (let idx = 0; idx < curBands.length; idx++) {
            const bx = fToX(curBands[idx].freq), by = dbToY(curBands[idx].gain);
            if (Math.hypot(pos.x - bx, pos.y - by) <= 16) return idx + 1;
          }
          const curHpf = parseFloat(document.getElementById('slider-hpf').value || curCh.hpf);
          if (Math.hypot(pos.x - fToX(curHpf), pos.y - dbToY(-3)) <= 15) return 0;
          return -1;
        };

        canvas.style.cursor = 'crosshair';
        canvas.style.touchAction = 'none';

        canvas.addEventListener('pointerdown', e => {
          const pos = getCanvasPos(e);
          const hit = hitTestNode(pos);
          if (hit >= 0) {
            _eqDragBand = hit;
            _eqDragStartY = pos.y;
            if (hit >= 1) {
              _eqDragStartQ = parseFloat(document.getElementById(`slider-b${hit}-q`)?.value || 1.0);
            }
            if (canvas.setPointerCapture) {
              try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
            }
            e.preventDefault();
          }
        });

        canvas.addEventListener('pointermove', e => {
          const pos = getCanvasPos(e);
          _eqHoverX = pos.x;
          _eqHoverY = pos.y;
          if (_eqDragBand === 0) {
            const newHpf = Math.round(Math.max(20, Math.min(400, xToF(pos.x))));
            const slHpf = document.getElementById('slider-hpf');
            if (slHpf) { slHpf.value = newHpf; onEQSliderChange(); return; }
          } else if (_eqDragBand >= 1 && _eqDragBand <= 4) {
            const n = _eqDragBand;
            if (e.shiftKey) {
              // Shift + vertical drag adjusts Q / Width
              const dy = _eqDragStartY - pos.y;
              const newQ = Math.round(Math.max(0.3, Math.min(10, _eqDragStartQ + dy * 0.04)) * 10) / 10;
              const slQ = document.getElementById(`slider-b${n}-q`);
              if (slQ) slQ.value = newQ;
            } else {
              const newFreq = Math.round(Math.max(20, Math.min(20000, xToF(pos.x))));
              const newDb = Math.round(yToDb(pos.y) * 2) / 2;
              const slG = document.getElementById(`slider-b${n}`);
              const slF = document.getElementById(`slider-b${n}-freq`);
              if (slG) slG.value = newDb;
              if (slF) {
                if (newFreq < parseFloat(slF.min)) slF.min = Math.max(20, newFreq);
                if (newFreq > parseFloat(slF.max)) slF.max = Math.min(20000, newFreq);
                slF.value = newFreq;
              }
            }
            onEQSliderChange();
            return;
          } else {
            _eqHoverBand = hitTestNode(pos);
            canvas.style.cursor = _eqHoverBand >= 0 ? 'grab' : 'crosshair';
          }
          drawEQCurve();
        });

        // Mousewheel on a band node adjusts Q / Bandwidth smoothly
        canvas.addEventListener('wheel', e => {
          const pos = getCanvasPos(e);
          const hit = _eqDragBand > 0 ? _eqDragBand : hitTestNode(pos);
          if (hit >= 1 && hit <= 4) {
            e.preventDefault();
            const slQ = document.getElementById(`slider-b${hit}-q`);
            if (slQ) {
              const curQ = parseFloat(slQ.value || 1.0);
              const step = e.deltaY < 0 ? 0.2 : -0.2;
              slQ.value = Math.round(Math.max(0.3, Math.min(10.0, curQ + step)) * 10) / 10;
              onEQSliderChange();
            }
          }
        }, { passive: false });

        // Double-click a node to reset that specific band (or HPF) to channel preset
        canvas.addEventListener('dblclick', e => {
          const pos = getCanvasPos(e);
          const hit = hitTestNode(pos);
          const curCh = CHANNELS[currentChannelId];
          if (!curCh || hit < 0) return;
          if (hit === 0) {
            document.getElementById('slider-hpf').value = curCh.hpf;
          } else if (hit >= 1 && hit <= 4) {
            const def = curCh.eq[hit - 1];
            syncBandLabelsAndSliders(hit, def.freq, def.gain, def.q, def.desc);
          }
          onEQSliderChange();
        });

        window.addEventListener('pointerup', () => {
          _eqDragBand = -1;
          canvas.style.cursor = _eqHoverBand >= 0 ? 'grab' : 'crosshair';
        });
        canvas.addEventListener('pointerleave', () => {
          _eqHoverX = -1; _eqHoverY = -1; _eqHoverBand = -1;
          drawEQCurve();
        });
      }
    }

    function setChecklistFilter(f) {
      checklistFilter = f;
      safeSetItem('agcm_chk_filter_v1', f);
      const map = { ALL: 'chk-filter-all', TODO: 'chk-filter-todo', SDU: 'chk-filter-sdu' };
      Object.entries(map).forEach(([k, id]) => {
        const b = document.getElementById(id);
        if (!b) return;
        if (k === f) b.className = 'px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white';
        else if (k === 'SDU') b.className = 'px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900';
        else b.className = 'px-3.5 py-2 rounded-xl text-xs font-bold btn-subtle';
      });
      renderChecklist();
    }
    function toggleCheckItem(id) { checkedItems[id] = !checkedItems[id]; safeSetItem('sdu_checked_v35', JSON.stringify(checkedItems)); renderChecklist(); }
    function resetChecklist() { checkedItems = {}; safeSetItem('sdu_checked_v35', '{}'); renderChecklist(); showToast('Soundcheck checklist reset'); }

    function renderChecklist() {
      const container = document.getElementById('checklist-phases-container');
      if (!container) return;
      let total = 0, done = 0;
      CHECKLIST_PHASES.forEach(p => p.items.forEach(it => { total++; if (checkedItems[it.id]) done++; }));
      const pct = total ? Math.round((done / total) * 100) : 0;
      document.getElementById('checklist-progress-text').textContent = `${done} / ${total} Steps Completed (${pct}%)`;
      document.getElementById('checklist-progress-bar').style.width = pct + '%';
      container.innerHTML = CHECKLIST_PHASES.map(p => {
        const items = p.items.filter(it => !(checklistFilter === 'TODO' && checkedItems[it.id]) && !(checklistFilter === 'SDU' && !it.sdu));
        return `
          <div class="dept-card space-y-4">
            <h3 class="text-base font-bold text-main border-b border-slate-200 dark:border-slate-800 pb-3">${p.phase}</h3>
            <div class="space-y-3">
              ${items.map(it => {
                const isDone = !!checkedItems[it.id];
                return `
                  <label class="flex items-start gap-3 p-3 rounded-xl border ${isDone ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-700'} cursor-pointer transition">
                    <input type="checkbox" ${isDone ? 'checked' : ''} data-change-action="toggle-check-item" data-arg="${it.id}" class="mt-1 w-4 h-4 accent-blue-600 rounded" />
                    <div class="text-sm ${isDone ? 'line-through text-mut' : 'text-main'} leading-relaxed">
                      ${it.text}
                      ${it.sdu ? '<span class="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">CRITICAL</span>' : ''}
                    </div>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');
    }

    function filterMatrix(group) {
      matrixFilter = group;
      safeSetItem('agcm_matrix_filter_v1', group);
      document.querySelectorAll('#matrix-band-pills button').forEach(btn => {
        const g = btn.getAttribute('data-matrix-grp') || (btn.textContent.includes('Sub') ? 'LOW' : (btn.textContent.includes('Mud') ? 'MID' : (btn.textContent.includes('Honk') ? 'HIGH' : 'ALL')));
        btn.className = (g === group)
          ? 'px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white'
          : 'px-3.5 py-2 rounded-xl text-xs font-bold btn-subtle';
      });
      renderMatrix();
    }
    function renderMatrix() {
      const container = document.getElementById('matrix-cards-container');
      if (!container) return;
      const rows = MATRIX_ZONES.filter(z => matrixFilter === 'ALL' || z.group === matrixFilter);
      container.innerHTML = rows.map(z => `
        <div class="dept-card space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-main">${z.zone}</h3>
            <span class="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 text-xs font-bold">${z.group} BAND</span>
          </div>
          <div class="dept-subtle-box"><div class="text-xs font-bold uppercase text-emerald-600">Dominant Band Owner (Fundamental / Formant)</div><div class="text-sm font-semibold text-main mt-0.5">${z.owner}</div></div>
          <div class="dept-subtle-box"><div class="text-xs font-bold uppercase text-rose-600">Masking Culprit &amp; Acoustic Overlap</div><div class="text-sm text-sec mt-0.5">${z.conflict}</div></div>
          <div class="dept-subtle-box border-l-4 border-l-blue-600"><div class="text-xs font-bold uppercase text-blue-600">Complementary EQ &amp; Unmasking Fix (${CFG.consoleShort})</div><div class="text-sm text-sec mt-0.5">${z.fix}</div></div>
        </div>
      `).join('');
    }

    function renderSnakeGrid() {
      const grid = document.getElementById('snake-grid');
      if (grid) {
        let html = '';
        for (let i = 1; i <= 32; i++) {
          const info = SNAKE_MAP[i] || { label: 'Open', ch: 'Ch ' + i, status: 'SPARE' };
          const chShort = info.ch === 'Route → Ch 32' ? '→ Ch 32' : info.ch;
          let badge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">${chShort}</span>`;
          let cardCls = 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-main';
          if (info.status === 'DEAD') {
            cardCls = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200';
            badge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shrink-0 bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100">FAULT</span>`;
          } else if (info.status === 'ACTIVE') {
            cardCls = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100';
            badge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shrink-0 bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">${chShort}</span>`;
          }
          html += `
            <div class="p-3 rounded-xl border ${cardCls} flex flex-col justify-between min-h-[88px] overflow-hidden">
              <div class="flex items-center justify-between gap-1">
                <span class="text-[11px] font-extrabold tracking-tight whitespace-nowrap">Port ${String(i).padStart(2, '0')}</span>
                ${badge}
              </div>
              <div class="text-xs font-bold mt-2 leading-snug">${info.label}</div>
            </div>
          `;
        }
        grid.innerHTML = html;
      }

      const outGrid = document.getElementById('snake-outputs-grid');
      if (outGrid && AUDIOLINK_OUTPUTS.length) {
        outGrid.innerHTML = AUDIOLINK_OUTPUTS.map(o => `
          <div class="dept-subtle-box flex flex-col justify-between gap-1.5 border-l-4 border-l-blue-600">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2.5 py-0.5 rounded bg-blue-600 text-white text-xs font-extrabold whitespace-nowrap shrink-0">OUT ${escapeHTML(o.port)}</span>
              <span class="text-[11px] font-bold text-blue-600">${escapeHTML(o.consoleOut)}</span>
            </div>
            <div class="text-sm font-extrabold text-main mt-0.5">${escapeHTML(o.name)}</div>
            <div class="text-xs text-sec">${escapeHTML(o.role)}</div>
          </div>
        `).join('');
      }

      const conOutGrid = document.getElementById('console-outputs-grid');
      if (conOutGrid && CONSOLE_OUTPUTS.length) {
        conOutGrid.innerHTML = CONSOLE_OUTPUTS.map(m => {
          const isOpen = m.status === 'OPEN';
          return `
            <div class="dept-subtle-box flex flex-col justify-between gap-1.5 ${isOpen ? 'opacity-80 border-amber-300' : 'border-l-4 border-l-emerald-600'}">
              <div class="flex items-center justify-between gap-2">
                <span class="px-2.5 py-0.5 rounded whitespace-nowrap shrink-0 ${isOpen ? 'bg-amber-100 text-amber-900' : 'bg-emerald-600 text-white'} text-xs font-extrabold">${escapeHTML(m.mix)}</span>
                <span class="text-[11px] font-bold ${isOpen ? 'text-amber-700' : 'text-emerald-600'}">${escapeHTML(m.snakeOut)}</span>
              </div>
              <div class="text-sm font-extrabold text-main mt-0.5">${escapeHTML(m.name)}</div>
              <div class="text-xs text-sec">${escapeHTML(m.note)}</div>
            </div>
          `;
        }).join('');
      }
    }

    function copyCrewPatchWhatsApp() {
      const text = `*${CFG.departmentName.toUpperCase()} — OFFICIAL AUDIOLINK & CONSOLE MASTER PATCH*

*PHYSICAL AUDIOLINK INPUTS (1–32):*
1 - Kick In | 2 - Kick Out | 3 - Snare Top | 4 - Snare Bottom (Ø)
5 - Rack Tom 1 (Ø) | 6 - Rack Tom 2 | 7 - Rack Tom 3 | 8 - Floor Tom (Ø)
9 - Bass Guitar (Ø) | 10 - Electric Guitar | 11 - Main Keys | 12 - Aux Keys
13 - Saxophone | 14 - Trumpet | 15 - Loops / Stems | 16 - Pastor | 17 - Lead Vocal
18–21 - ❌ BROKEN (Leave Console Ch 18–21 Open)
22 - BV 1 (Soprano) | 23 - BV 2 (Soprano) | 24 - BV 3 (Alto) | 25 - BV 4 (Alto) | 26 - BV 5 (Tenor) | 27 - BV 6 (Tenor)
28 - Open | 29 - Playback (Soft-Patched → Console Ch 32)
30–32 - ❌ BROKEN (Leave Console Ch 29–31 Open)

*AUDIOLINK OUTPUTS (A–H) & CONSOLE MIXES (MIX 1–8):*
• Out A ← MIX 5 (Main PA Left)
• Out B ← MIX 6 (Main PA Right)
• Out C ← MIX 1 (Subs)
• Out D ← MIX 7 (Delay Left)
• Out E ← MIX 8 (Delay Right)
• Out F ← MIX 4 (BV Monitors)
• Out G ← Front Fills / IEMs (Event dependent)
• Out H ← MIX 3 (Band Monitor) | MIX 2 = Open`;
      navigator.clipboard?.writeText(text);
      showToast('Copied Official AudioLink & Console Patch List!');
    }

    function setQuickDistance(m) { document.getElementById('calc-dist').value = m; updateAcousticCalc(); }
    function saveCalcState() {
      const state = {
        dist: parseFloat(document.getElementById('calc-dist')?.value || 3.2),
        temp: parseFloat(document.getElementById('calc-temp')?.value || 28),
        xover: parseFloat(document.getElementById('calc-xover')?.value || 90),
        bpm: parseFloat(document.getElementById('calc-bpm')?.value || 76)
      };
      safeSetItem('agcm_calc_v1', JSON.stringify(state));
    }

    function restoreCalcState() {
      const saved = safeParseJSON(safeGetItem('agcm_calc_v1'), null);
      if (saved) {
        if (typeof saved.dist === 'number' && document.getElementById('calc-dist')) document.getElementById('calc-dist').value = saved.dist;
        if (typeof saved.temp === 'number' && document.getElementById('calc-temp')) document.getElementById('calc-temp').value = saved.temp;
        if (typeof saved.xover === 'number' && document.getElementById('calc-xover')) document.getElementById('calc-xover').value = saved.xover;
      }
      updateAcousticCalc(false);
      updateBPMCalc(saved && typeof saved.bpm === 'number' ? saved.bpm : 76, false);
    }

    function updateAcousticCalc(persist = true) {
      const dist = parseFloat(document.getElementById('calc-dist')?.value || 3.2);
      const temp = parseFloat(document.getElementById('calc-temp')?.value || 28);
      const xover = parseFloat(document.getElementById('calc-xover')?.value || 90);
      const speed = 331.3 + 0.606 * temp;
      const delayMs = (dist / speed) * 1000;
      document.getElementById('out-delay-ms').textContent = delayMs.toFixed(2) + ' ms';
      document.getElementById('out-delay-smp').textContent = Math.round((delayMs / 1000) * 44100) + ' smp';
      document.getElementById('out-speed').textContent = speed.toFixed(1) + ' m/s';
      document.getElementById('out-wavelength').textContent = (speed / Math.max(20, xover)).toFixed(2) + ' m';
      if (persist) saveCalcState();
    }

    function updateBPMCalc(val, persist = true) {
      const bpm = Math.max(40, Math.min(220, parseFloat(val || 76)));
      document.getElementById('calc-bpm').value = bpm;
      document.getElementById('slider-bpm').value = bpm;
      const q = 60000 / bpm;
      document.getElementById('bpm-quarter').textContent = Math.round(q) + ' ms';
      document.getElementById('bpm-dotted8').textContent = Math.round(q * 0.75) + ' ms';
      document.getElementById('bpm-eighth').textContent = Math.round(q * 0.5) + ' ms';
      document.getElementById('bpm-predelay').textContent = Math.round(q / 16) + ' ms';
      document.getElementById('bpm-decay').textContent = ((q * 2) / 1000).toFixed(2) + ' s';
      if (persist) saveCalcState();
    }

    function tapTempo() {
      const now = performance.now();
      tapTimes.push(now);
      if (tapTimes.length > 5) tapTimes.shift();
      if (tapTimes.length >= 2) {
        let sum = 0;
        for (let i = 1; i < tapTimes.length; i++) sum += (tapTimes[i] - tapTimes[i - 1]);
        const bpm = Math.round(60000 / (sum / (tapTimes.length - 1)));
        if (bpm >= 45 && bpm <= 210) updateBPMCalc(bpm);
      }
    }

    function renderStrategies() {
      const grid = document.getElementById('strategy-cards-grid');
      if (!grid) return;
      const cat = document.getElementById('strategy-cat-filter')?.value || 'ALL';
      const all = [...DEFAULT_STRATEGIES, ...customStrategies].filter(s => cat === 'ALL' || s.cat === cat);
      grid.innerHTML = all.map(s => `<div class="dept-card space-y-2.5"><span class="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 text-xs font-bold">${s.cat}</span><h4 class="text-base font-bold text-main">${s.title}</h4><p class="text-sm text-sec leading-relaxed">${s.body}</p></div>`).join('');
    }
    function openStrategyModal() { const m = document.getElementById('modal-strategy'); m.classList.remove('hidden'); m.classList.add('flex'); }
    function closeStrategyModal() { const m = document.getElementById('modal-strategy'); m.classList.add('hidden'); m.classList.remove('flex'); }
    function saveCustomStrategy() {
      const title = document.getElementById('strat-title').value.trim(), cat = document.getElementById('strat-cat').value, body = document.getElementById('strat-body').value.trim();
      if (!title || !body) return;
      customStrategies.push({ id: 'cust_' + Date.now(), cat, title, body });
      safeSetItem('sdu_custom_strats_v35', JSON.stringify(customStrategies));
      closeStrategyModal(); renderStrategies(); showToast('Added strategy to Vault!');
    }

    function toggleGearStatus(idx) {
      const states = ['Healthy', 'Needs Attention', 'Faulty / Bypassed'];
      gearInventory[idx].status = states[(states.indexOf(gearInventory[idx].status) + 1) % states.length];
      safeSetItem('sdu_gear_v35', JSON.stringify(gearInventory));
      renderGearInventory();
      showToast(`${gearInventory[idx].id} status updated`);
    }
    function renderGearInventory() {
      const tbody = document.getElementById('gear-inventory-body');
      if (!tbody) return;
      tbody.innerHTML = gearInventory.map((g, idx) => {
        const pill = g.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : (g.status === 'Needs Attention' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-rose-100 text-rose-800 border-rose-300');
        return `<tr><td class="text-xs font-bold text-blue-600">${g.id}</td><td class="font-bold text-main">${g.name}</td><td class="text-sec">${g.role}</td><td class="text-sec max-w-md">${g.note}</td><td><button data-action="toggle-gear-status" data-arg="${idx}" class="px-3 py-1.5 rounded-full border text-xs font-bold ${pill} transition">${g.status}</button></td></tr>`;
      }).join('');
    }

    function collectHandoverNotes() {
      const notes = {};
      (window.ROLES || []).forEach(r => {
        const v = safeGetItem('agcm_note_' + r.id);
        const t = safeGetItem('agcm_note_time_' + r.id);
        if (v) notes[r.id] = { text: v, savedAt: t || '' };
      });
      return notes;
    }


    // =========================================================================
    // RECORDING & EDITING STUDIO (PRESONUS CAPTURE + ADOBE AUDITION)
    // =========================================================================
    function updateRecordingCalc(persist = true) {
      const trEl = document.getElementById('rec-tracks');
      const minEl = document.getElementById('rec-mins');
      const srEl = document.getElementById('rec-sr');
      const bitEl = document.getElementById('rec-bits');
      if (!trEl || !minEl || !srEl || !bitEl) return;

      const tracks = Math.max(1, Math.min(32, parseInt(trEl.value || '24', 10)));
      const mins = Math.max(1, Math.min(600, parseFloat(minEl.value || '120')));
      const sr = parseInt(srEl.value || '48000', 10);
      const bits = parseInt(bitEl.value || '24', 10);

      const bytesPerSecPerTrack = sr * (bits / 8);
      const totalBytesPerSec = bytesPerSecPerTrack * tracks;
      const mbPerSec = totalBytesPerSec / (1024 * 1024);
      const totalSecs = mins * 60;
      const totalGb = (totalBytesPerSec * totalSecs) / (1024 * 1024 * 1024);
      const mp3SpotifyMb = ((320000 / 8) * totalSecs) / (1024 * 1024);
      const mp3TelegramMb = ((96000 / 8) * totalSecs) / (1024 * 1024);

      const outWav = document.getElementById('rec-out-wav-gb');
      const outRate = document.getElementById('rec-out-rate');
      const outMp3Hi = document.getElementById('rec-out-mp3-hi');
      const outMp3Tg = document.getElementById('rec-out-mp3-tg');
      if (outWav) outWav.textContent = totalGb.toFixed(2) + ' GB';
      if (outRate) outRate.textContent = mbPerSec.toFixed(2) + ' MB/s';
      if (outMp3Hi) outMp3Hi.textContent = mp3SpotifyMb.toFixed(1) + ' MB';
      if (outMp3Tg) outMp3Tg.textContent = mp3TelegramMb.toFixed(1) + ' MB';

      if (persist) {
        safeSetItem('agcm_rec_calc_v1', JSON.stringify({ tracks, mins, sr, bits }));
      }
    }

    function restoreRecordingCalc() {
      const saved = safeParseJSON(safeGetItem('agcm_rec_calc_v1'), null);
      if (saved) {
        if (saved.tracks && document.getElementById('rec-tracks')) document.getElementById('rec-tracks').value = saved.tracks;
        if (saved.mins && document.getElementById('rec-mins')) document.getElementById('rec-mins').value = saved.mins;
        if (saved.sr && document.getElementById('rec-sr')) document.getElementById('rec-sr').value = saved.sr;
        if (saved.bits && document.getElementById('rec-bits')) document.getElementById('rec-bits').value = saved.bits;
      }
      updateRecordingCalc(false);
    }

    function renderAuditionRackPreset(presetKey) {
      const key = AUDITION_RACK_PRESETS[presetKey] ? presetKey : 'sermon';
      activeAuditionPreset = key;
      safeSetItem('agcm_audition_preset_v1', key);
      const p = AUDITION_RACK_PRESETS[key];
      if (!p) return;

      document.querySelectorAll('[data-aud-btn]').forEach(btn => {
        const isAct = btn.getAttribute('data-aud-btn') === key;
        btn.className = isAct
          ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white'
          : 'px-3 py-1.5 rounded-lg text-xs font-bold btn-subtle';
      });

      const container = document.getElementById('audition-rack-container');
      if (!container) return;
      container.innerHTML = `
        <div class="dept-subtle-box flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="text-sm font-extrabold text-main">${escapeHTML(p.title)}</div>
            <div class="text-xs text-sec mt-0.5">${escapeHTML(p.subtitle)}</div>
          </div>
          <div class="flex flex-wrap items-center gap-2 tabular">
            <span class="blueprint-pill bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200">Target: ${escapeHTML(p.targetLufs)}</span>
            <span class="blueprint-pill bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200">Ceiling: ${escapeHTML(p.truePeak)}</span>
          </div>
        </div>
        <div class="space-y-2">
          ${p.slots.map(s => `
            <div class="dept-subtle-box flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div class="text-xs font-extrabold text-blue-600">${escapeHTML(s.slot)}</div>
                <div class="text-xs font-bold text-main mt-0.5">${escapeHTML(s.setting)}</div>
              </div>
              <div class="text-xs text-sec sm:text-right max-w-xs">${escapeHTML(s.purpose)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function toggleRecCheckItem(id) {
      recCheckedItems[id] = !recCheckedItems[id];
      safeSetItem('agcm_rec_checked_v1', JSON.stringify(recCheckedItems));
      renderRecordingChecklist();
    }

    function resetRecordingChecklist() {
      recCheckedItems = {};
      safeSetItem('agcm_rec_checked_v1', '{}');
      renderRecordingChecklist();
      showToast('Recording & Editing checklist reset');
    }

    function renderRecordingChecklist() {
      const container = document.getElementById('rec-checklist-container');
      if (!container) return;
      const total = RECORDING_CHECKLIST.length;
      const done = RECORDING_CHECKLIST.filter(it => recCheckedItems[it.id]).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      const txtEl = document.getElementById('rec-checklist-progress-text');
      const barEl = document.getElementById('rec-checklist-progress-bar');
      if (txtEl) txtEl.textContent = `${done} / ${total} Recording & Editing Steps Completed (${pct}%)`;
      if (barEl) barEl.style.width = pct + '%';

      container.innerHTML = RECORDING_CHECKLIST.map(it => {
        const isDone = !!recCheckedItems[it.id];
        return `
          <label class="flex items-start gap-3 p-3 rounded-xl border ${isDone ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-700'} cursor-pointer transition">
            <input type="checkbox" ${isDone ? 'checked' : ''} data-change-action="toggle-rec-check" data-arg="${it.id}" class="mt-1 w-4 h-4 accent-blue-600 rounded" />
            <div class="text-xs sm:text-sm ${isDone ? 'line-through text-mut' : 'text-main'} leading-relaxed">
              <span class="font-bold text-blue-600 block text-[11px] uppercase">${escapeHTML(it.phase)}</span>
              ${escapeHTML(it.text)}
            </div>
          </label>
        `;
      }).join('');
    }

    function exportStateJSON() {
      const payload = {
        eventsList,
        activeEventId,
        checkedItems,
        recCheckedItems,
        customStrategies,
        gearInventory,
        selectedServiceChannels,
        channelEqOverrides,
        masteringState: safeParseJSON(safeGetItem('agcm_mastering_v1'), null),
        calcState: safeParseJSON(safeGetItem('agcm_calc_v1'), null),
        handoverNotes: collectHandoverNotes()
      };
      const jsonStr = JSON.stringify(payload, null, 2);
      navigator.clipboard?.writeText(jsonStr);
      showToast('Copied full Vault JSON state to clipboard!');
    }
    function openImportModal() { const m = document.getElementById('modal-import'); m.classList.remove('hidden'); m.classList.add('flex'); }
    function closeImportModal() { const m = document.getElementById('modal-import'); m.classList.add('hidden'); m.classList.remove('flex'); }
    function confirmImportJSON() {
      try {
        const data = JSON.parse(document.getElementById('import-json-textarea').value);
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid root');
        if (Array.isArray(data.eventsList) && data.eventsList.length) {
          eventsList = data.eventsList;
          if (data.activeEventId) activeEventId = data.activeEventId;
          saveEvents();
          renderPlanner();
        }
        if (data.recCheckedItems && typeof data.recCheckedItems === 'object') {
          recCheckedItems = data.recCheckedItems;
          safeSetItem('agcm_rec_checked_v1', JSON.stringify(recCheckedItems));
          renderRecordingChecklist();
        }
        if (data.checkedItems && typeof data.checkedItems === 'object') {
          checkedItems = data.checkedItems;
          safeSetItem('sdu_checked_v35', JSON.stringify(checkedItems));
          renderChecklist();
        }
        if (Array.isArray(data.customStrategies)) {
          customStrategies = data.customStrategies;
          safeSetItem('sdu_custom_strats_v35', JSON.stringify(customStrategies));
          renderStrategies();
        }
        if (Array.isArray(data.gearInventory)) {
          gearInventory = data.gearInventory;
          safeSetItem('sdu_gear_v35', JSON.stringify(gearInventory));
          renderGearInventory();
        }
        if (Array.isArray(data.selectedServiceChannels)) {
          selectedServiceChannels = data.selectedServiceChannels;
          safeSetItem('agcm_sel_ch_v6', JSON.stringify(selectedServiceChannels));
          renderServicePatchBuilder();
        }
        if (data.channelEqOverrides && typeof data.channelEqOverrides === 'object') {
          channelEqOverrides = data.channelEqOverrides;
          safeSetItem('agcm_eq_overrides_v1', JSON.stringify(channelEqOverrides));
          selectChannel(currentChannelId);
        }
        if (data.masteringState && typeof data.masteringState === 'object') {
          safeSetItem('agcm_mastering_v1', JSON.stringify(data.masteringState));
          restoreMasteringSim();
      restoreRecordingCalc();
      renderAuditionRackPreset(activeAuditionPreset);
      renderRecordingChecklist();
        }
        if (data.calcState && typeof data.calcState === 'object') {
          safeSetItem('agcm_calc_v1', JSON.stringify(data.calcState));
          restoreCalcState();
        }
        if (data.handoverNotes && typeof data.handoverNotes === 'object') {
          Object.entries(data.handoverNotes).forEach(([roleId, obj]) => {
            if (obj && typeof obj.text === 'string') {
              safeSetItem('agcm_note_' + roleId, obj.text);
              if (obj.savedAt) safeSetItem('agcm_note_time_' + roleId, obj.savedAt);
            }
          });
          if (typeof window.refreshHandoverRoleView === 'function') window.refreshHandoverRoleView();
        }
        closeImportModal();
        showToast('Validated & restored Department Vault state');
      } catch (e) {
        showToast('Invalid JSON backup structure');
      }
    }


    let selectedServiceChannels = JSON.parse(safeGetItem('agcm_sel_ch_v6') || 'null') || ALL_32_INPUTS.filter(x => x.defaultOn).map(x => x.ch);

    function filterChannelButtons(grp) {
      ['ALL', 'DRUMS', 'BAND', 'VOCALS', 'SPEECH'].forEach(g => {
        const b = document.getElementById('ch-grp-' + g);
        if (b) {
          b.className = (g === grp)
            ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white'
            : 'px-3 py-1.5 rounded-lg text-xs font-bold btn-subtle';
        }
      });
      document.querySelectorAll('#channel-selector-bar .ch-btn').forEach(btn => {
        const bGrp = btn.getAttribute('data-grp') || 'ALL';
        btn.style.display = (grp === 'ALL' || bGrp === grp) ? 'inline-block' : 'none';
      });
    }

    function computeServicePatchAssignments() {
      const usedPorts = new Set();
      const assignments = [];
      const activeList = ALL_32_INPUTS.filter(item => selectedServiceChannels.includes(item.ch));

      // Pass 1: Honor preferred healthy port (Ports 1–17 -> Ch 1–17, Ports 22–28 -> Ch 22–28, Port 29 -> Ch 32)
      activeList.forEach(item => {
        if (item.prefPort && HEALTHY_SNAKE_PORTS.includes(item.prefPort) && !usedPorts.has(item.prefPort)) {
          usedPorts.add(item.prefPort);
          assignments.push({
            ...item,
            assignedPort: item.prefPort,
            mode: item.prefPort === item.ch ? '1:1 Direct' : `Soft-Patch (Port ${item.prefPort} → Ch ${item.ch})`
          });
        } else {
          assignments.push({ ...item, assignedPort: null, mode: '' });
        }
      });

      // Pass 2: Fallback for any manually enabled Open slot
      assignments.forEach(a => {
        if (a.assignedPort === null) {
          const freePort = HEALTHY_SNAKE_PORTS.find(p => !usedPorts.has(p));
          if (freePort) {
            usedPorts.add(freePort);
            a.assignedPort = freePort;
            a.mode = freePort === a.ch ? '1:1 Direct' : `Soft-Patch (Port ${freePort} → Ch ${a.ch})`;
          } else {
            a.assignedPort = `Local In ${a.ch}`;
            a.mode = `Console Local Input ${a.ch}`;
          }
        }
      });

      return { assignments, usedPortsCount: usedPorts.size };
    }

    function toggleServiceChannelSelection(chNum) {
      const item = ALL_32_INPUTS.find(x => x.ch === chNum);
      if (item && item.openSlot && !item.prefPort) {
        showToast(`Ch ${chNum} is an Open console slot (AudioLink port is broken)`);
        return;
      }
      if (selectedServiceChannels.includes(chNum)) {
        selectedServiceChannels = selectedServiceChannels.filter(c => c !== chNum);
      } else {
        selectedServiceChannels.push(chNum);
        selectedServiceChannels.sort((a, b) => a - b);
      }
      safeSetItem('agcm_sel_ch_v6', JSON.stringify(selectedServiceChannels));
      renderServicePatchBuilder();
    }

    function applyPatchPreset(preset) {
      if (preset === 'full_sunday') {
        selectedServiceChannels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 26, 27, 32];
      } else if (preset === 'midweek_compact') {
        selectedServiceChannels = [1, 3, 5, 8, 9, 10, 11, 12, 16, 17, 22, 23, 24, 25, 26, 27, 32];
      } else if (preset === 'acoustic_prayer') {
        selectedServiceChannels = [9, 11, 16, 17, 22, 23, 24, 26, 32];
      } else if (preset === 'all_31') {
        selectedServiceChannels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 26, 27, 28, 32];
      }
      safeSetItem('agcm_sel_ch_v6', JSON.stringify(selectedServiceChannels));
      renderServicePatchBuilder();
      showToast('Applied event patch preset');
    }

    function renderServicePatchBuilder() {
      const selGrid = document.getElementById('service-input-selector-grid');
      const tbody = document.getElementById('generated-service-patch-tbody');
      if (!selGrid || !tbody) return;

      const { assignments, usedPortsCount } = computeServicePatchAssignments();
      const freeCount = Math.max(0, HEALTHY_SNAKE_PORTS.length - usedPortsCount);

      const cntBadge = document.getElementById('patch-active-count-badge');
      const freeBadge = document.getElementById('patch-spare-ports-badge');
      if (cntBadge) cntBadge.textContent = `${assignments.length} Inputs Active`;
      if (freeBadge) freeBadge.textContent = `${freeCount} / ${HEALTHY_SNAKE_PORTS.length} Healthy Ports Free`;

      selGrid.innerHTML = ALL_32_INPUTS.map(item => {
        const isLockedOpen = item.openSlot && !item.prefPort;
        const isSelected = selectedServiceChannels.includes(item.ch) && !isLockedOpen;
        if (isLockedOpen) {
          return `
            <button type="button" data-action="toggle-patch-ch" data-arg="${item.ch}" class="p-2.5 rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-left opacity-80 cursor-not-allowed">
              <div class="flex items-center justify-between text-[11px] font-extrabold text-amber-800 dark:text-amber-300">
                <span>CH ${String(item.ch).padStart(2, '0')}</span><span>OPEN</span>
              </div>
              <div class="text-xs font-bold text-amber-900 dark:text-amber-200 truncate mt-1">${item.name}</div>
            </button>
          `;
        }
        return `
          <button type="button" data-action="toggle-patch-ch" data-arg="${item.ch}" class="p-2.5 rounded-xl border text-left transition ${
            isSelected
              ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/50 text-main shadow-sm'
              : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-mut hover:border-blue-400'
          }">
            <div class="flex items-center justify-between text-[11px] font-extrabold">
              <span class="${isSelected ? 'text-blue-600' : 'text-mut'}">CH ${String(item.ch).padStart(2, '0')}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-mut'}">${isSelected ? 'ON' : 'OFF'}</span>
            </div>
            <div class="text-xs font-bold truncate mt-1 ${isSelected ? 'text-main' : 'text-mut'}">${item.name}</div>
          </button>
        `;
      }).join('');

      tbody.innerHTML = assignments.map(a => {
        const isSoft = String(a.mode).includes('Soft-Patch');
        const portBadge = typeof a.assignedPort === 'number'
          ? `<span class="px-2.5 py-1 rounded-lg font-extrabold text-xs whitespace-nowrap ${isSoft ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200'}">Port ${String(a.assignedPort).padStart(2, '0')}</span>`
          : `<span class="px-2.5 py-1 rounded-lg font-extrabold text-xs whitespace-nowrap bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200">${a.assignedPort}</span>`;
        return `
          <tr>
            <td class="font-extrabold text-blue-600 whitespace-nowrap">Ch ${String(a.ch).padStart(2, '0')}</td>
            <td>
              <div class="font-bold text-main">${a.name}</div>
              <div class="text-xs text-mut">${a.mic}</div>
            </td>
            <td>${portBadge}</td>
            <td class="text-xs font-semibold ${isSoft ? 'text-amber-600 font-bold' : 'text-sec'}">${a.mode}</td>
            <td class="text-xs text-sec">HPF ${a.hpf} • Pol: ${a.pol} • Gate: ${a.gateKey}</td>
            <td class="text-xs font-semibold text-main">${a.bus}</td>
          </tr>
        `;
      }).join('');
    }

    function downloadServicePatchCSV() {
      const ev = getActiveEvent();
      const { assignments } = computeServicePatchAssignments();
      const rows = [
        [`${CFG.departmentName} — AudioLink & Console Master Patch Sheet`],
        ['Event', ev.name, 'Venue', ev.venue, 'Time', ev.time],
        ['Broken AudioLink Ports (DO NOT USE)', `Ports ${CFG.deadSnakePorts.join(', ')}`],
        ['Console Open Channels', 'Ch 18–21, Ch 28–31 (Port 29 Playback -> Ch 32); MIX 2 Open'],
        [],
        ['Console Ch', 'Input Source', 'Mic / DI', 'Physical Port', 'Console Patch Mode', 'HPF', 'Polarity', 'Gate Key', 'Bus Routing']
      ];
      assignments.forEach(a => {
        rows.push([
          `Ch ${String(a.ch).padStart(2, '0')}`,
          a.name,
          a.mic,
          typeof a.assignedPort === 'number' ? `Port ${String(a.assignedPort).padStart(2, '0')}` : a.assignedPort,
          a.mode,
          a.hpf,
          a.pol,
          a.gateKey,
          a.bus
        ]);
      });
      rows.push([], ['AUDIOLINK OUTPUTS (A-H)', 'Destination', 'Console Mix Source', 'Role']);
      AUDIOLINK_OUTPUTS.forEach(o => rows.push([`Out ${o.port}`, o.name, o.consoleOut, o.role]));
      rows.push([], ['CONSOLE OUTPUTS (MIX 1-8)', 'Bus Name', 'AudioLink Return', 'Notes']);
      CONSOLE_OUTPUTS.forEach(m => rows.push([m.mix, m.name, m.snakeOut, m.note]));

      const csvContent = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `AGCM_Patch_${ev.name.replace(/[^a-zA-Z0-9]+/g, '_')}.csv`;
      a.click();
      showToast('Downloaded Service Patch CSV');
    }

    function downloadServicePatchHTML() {
      const ev = getActiveEvent();
      const { assignments } = computeServicePatchAssignments();
      const rowsHtml = assignments.map(a => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;font-weight:700;color:#1d4ed8;">Ch ${String(a.ch).padStart(2, '0')}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;"><strong>${a.name}</strong><br><small style="color:#64748b">${a.mic}</small></td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;font-weight:700;">${typeof a.assignedPort === 'number' ? 'Port ' + String(a.assignedPort).padStart(2, '0') : a.assignedPort}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;">${a.mode}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;">HPF ${a.hpf} | Pol ${a.pol} | ${a.gateKey}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;">${a.bus}</td>
        </tr>
      `).join('');

      const outRowsHtml = CONSOLE_OUTPUTS.map(m => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;font-weight:700;">${m.mix}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;font-weight:700;">${m.name}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;">${m.snakeOut}</td>
          <td style="padding:8px 12px;border:1px solid #cbd5e1;">${m.note}</td>
        </tr>
      `).join('');

      const docHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>AGCM Patch Sheet — ${ev.name}</title>
      <style>body{font-family:Inter,system-ui,sans-serif;padding:32px;color:#0f172a;max-width:1050px;margin:0 auto;}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px;}th{background:#f1f5f9;padding:10px 12px;border:1px solid #cbd5e1;text-align:left;text-transform:uppercase;font-size:11px;}.warn{background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:12px 16px;border-radius:10px;margin-top:12px;font-size:13px;}</style></head>
      <body>
        <h1 style="margin:0;font-size:22px;">AGCM - KNUST Technical Department — AudioLink &amp; Console Patch Sheet</h1>
        <p style="margin:4px 0 0;color:#475569;font-size:14px;"><strong>Service:</strong> ${ev.name} &nbsp;|&nbsp; <strong>Venue:</strong> ${ev.venue} &nbsp;|&nbsp; <strong>Schedule:</strong> ${ev.time}</p>
        <div class="warn"><strong>HARDWARE GUARDRAILS:</strong> Broken AudioLink Ports: <strong>${CFG.deadSnakePorts.join(', ')}</strong> (Leave Console Ch 18–21 &amp; Ch 28–31 Open; Port 29 Playback routes to Ch 32). AudioLink Outputs: <strong>A</strong>=Main L (MIX 5), <strong>B</strong>=Main R (MIX 6), <strong>C</strong>=Subs (MIX 1), <strong>D</strong>=Delay L (MIX 7), <strong>E</strong>=Delay R (MIX 8), <strong>F</strong>=BV Monitors (MIX 4), <strong>G</strong>=Front Fills/IEMs, <strong>H</strong>=Band Monitor (MIX 3).</div>
        <h2 style="margin-top:20px;font-size:16px;">1. Input Patch (AudioLink Ports 1–32 → Console Ch 1–32)</h2>
        <table><thead><tr><th>Console Ch</th><th>Input Source &amp; Mic</th><th>Physical Port</th><th>Console Patch Mode</th><th>HPF / Polarity / Gate</th><th>Bus &amp; Monitor</th></tr></thead><tbody>${rowsHtml}</tbody></table>
        <h2 style="margin-top:24px;font-size:16px;">2. Output Patch (Console MIX 1–8 → AudioLink Returns A–H)</h2>
        <table><thead><tr><th>Console Output</th><th>Bus Name</th><th>AudioLink Output</th><th>Routing Note</th></tr></thead><tbody>${outRowsHtml}</tbody></table>
      </body></html>`;
      const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `AGCM_Patch_${ev.name.replace(/[^a-zA-Z0-9]+/g, '_')}.html`;
      a.click();
      showToast('Downloaded Printable Service Patch Sheet');
    }


    function previewHomeGalleryPhoto(input) {
      if (!input || !input.files || !input.files[0]) return;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.getElementById('gallery-preview-img');
        const title = document.getElementById('gallery-preview-title');
        if (img) {
          img.src = e.target.result;
          img.className = 'w-full h-28 object-cover rounded-lg mb-3';
        }
        if (title) title.textContent = file.name.replace(/\.[^/.]+$/, '');
        showToast('Loaded photo preview on Home page!');
      };
      reader.readAsDataURL(file);
    }

    function downloadDeptDoc(docKey) {
      const d = DEPT_DOCS[docKey];
      if (!d) return;
      const blob = new Blob([d.content], { type: 'text/markdown;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = d.fname;
      a.click();
      showToast('Downloaded ' + d.fname);
    }

    function restoreMasteringSim() {
      const saved = safeParseJSON(safeGetItem('agcm_mastering_v1'), null);
      if (saved) {
        const driveEl = document.getElementById('slider-mast-drive');
        const compEl = document.getElementById('slider-mast-comp');
        const widthEl = document.getElementById('slider-mast-width');
        const ceilEl = document.getElementById('slider-mast-ceiling');
        if (driveEl && typeof saved.drive === 'number') driveEl.value = saved.drive;
        if (compEl && typeof saved.comp === 'number') compEl.value = saved.comp;
        if (widthEl && typeof saved.width === 'number') widthEl.value = saved.width;
        if (ceilEl && typeof saved.ceil === 'number') ceilEl.value = saved.ceil;
      }
      updateMasteringSim(false);
    }

    function updateMasteringSim(persist = true) {
      const driveEl = document.getElementById('slider-mast-drive');
      const compEl = document.getElementById('slider-mast-comp');
      const widthEl = document.getElementById('slider-mast-width');
      const ceilEl = document.getElementById('slider-mast-ceiling');
      if (!driveEl || !compEl || !widthEl || !ceilEl) return;

      const drive = parseFloat(driveEl.value);
      const comp = parseFloat(compEl.value);
      const width = parseInt(widthEl.value, 10);
      const ceil = parseFloat(ceilEl.value);

      document.getElementById('lbl-mast-drive').textContent = (drive >= 0 ? '+' : '') + drive.toFixed(1) + ' dB';
      document.getElementById('lbl-mast-comp').textContent = comp.toFixed(1) + ':1 ' + (comp <= 2.5 ? '(Glue)' : '(Dense)');
      document.getElementById('lbl-mast-width').textContent = width + '%';
      document.getElementById('lbl-mast-ceiling').textContent = ceil.toFixed(1) + ' dBTP';

      const gr = -Math.min(6.5, Math.max(0.5, (drive + 6) * 0.18 * (comp / 2)));
      const lufs = Math.min(-6.5, Math.max(-22.0, -17.5 + drive + (gr * 0.35)));
      document.getElementById('mast-lufs-readout').textContent = lufs.toFixed(1) + ' LUFS';
      document.getElementById('mast-gr-readout').textContent = gr.toFixed(1) + ' dB';
      document.getElementById('mast-tp-readout').textContent = ceil.toFixed(1) + ' dBTP';

      const pct = Math.min(98, Math.max(18, Math.round(((lufs + 24) / 18) * 100)));
      const fill = document.getElementById('mast-meter-fill');
      if (fill) fill.style.width = pct + '%';

      if (persist) {
        safeSetItem('agcm_mastering_v1', JSON.stringify({ drive, comp, width, ceil }));
      }
      const verdict = document.getElementById('mast-profile-verdict');
      if (verdict) {
        if (lufs > -10.5) {
          verdict.textContent = 'Hot / Competitive Loudness — watch for transient squashing on drums.';
          verdict.className = 'text-amber-600 font-bold';
        } else if (lufs >= -15.0) {
          verdict.textContent = 'Optimal Streaming & Broadcast Sweet Spot (-14 to -12 LUFS) with clean punch.';
          verdict.className = 'text-emerald-600 font-bold';
        } else {
          verdict.textContent = 'Wide Dynamic / Sermon Broadcast Headroom (-16 LUFS range).';
          verdict.className = 'text-blue-600 font-bold';
        }
      }
    }

    function applyMasteringPreset(mode) {
      const driveEl = document.getElementById('slider-mast-drive');
      const compEl = document.getElementById('slider-mast-comp');
      const widthEl = document.getElementById('slider-mast-width');
      const ceilEl = document.getElementById('slider-mast-ceiling');
      if (!driveEl) return;
      if (mode === 'streaming') {
        driveEl.value = 4.2; compEl.value = 2.0; widthEl.value = 112; ceilEl.value = -1.0;
      } else if (mode === 'sermon') {
        driveEl.value = 2.0; compEl.value = 1.5; widthEl.value = 100; ceilEl.value = -1.5;
      } else {
        driveEl.value = 6.5; compEl.value = 3.0; widthEl.value = 118; ceilEl.value = -0.8;
      }
      updateMasteringSim();
      showToast('Loaded ' + mode.replace('_', ' ') + ' mastering chain preset');
    }

    

    // =========================================================================
    // CLIENT-SIDE TECH LEAD ACCESS GATE
    // =========================================================================
    const GATE_STORAGE_KEY = 'agcm_portal_auth_v1';

    async function sha256Hex(str) {
      const clean = String(str || '').trim().toLowerCase();
      if (window.crypto && window.crypto.subtle && window.TextEncoder) {
        const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(clean));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      }
      return clean === 'agcm2026' ? '96d57a668a1eb0c38b79d28ec8b0a05dbe5180a1ab6791d01fb01ebb394e060f' : clean;
    }

    function isPortalUnlocked() {
      const gateCfg = CFG.accessGate || {};
      if (gateCfg.enabled === false) return true;
      try {
        const raw = safeGetItem(GATE_STORAGE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        if (!parsed || parsed.hash !== gateCfg.passcodeHash) return false;
        if (parsed.exp && Date.now() > parsed.exp) return false;
        return true;
      } catch (e) {
        return false;
      }
    }

    function syncPortalGateUI() {
      const gateEl = document.getElementById('portal-auth-gate');
      const hintEl = document.getElementById('portal-gate-hint');
      const gateCfg = CFG.accessGate || {};
      if (hintEl && gateCfg.hint) hintEl.textContent = gateCfg.hint;
      if (!gateEl) return;
      const unlocked = isPortalUnlocked();
      gateEl.hidden = unlocked;
      document.body.classList.toggle('portal-locked', !unlocked);
      if (!unlocked) {
        const inp = document.getElementById('portal-gate-input');
        if (inp) setTimeout(() => inp.focus(), 40);
      }
    }

    async function submitPortalGate(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      const inp = document.getElementById('portal-gate-input');
      const err = document.getElementById('portal-gate-error');
      const gateCfg = CFG.accessGate || {};
      const val = inp ? inp.value : '';
      const digest = await sha256Hex(val);
      if (digest === gateCfg.passcodeHash) {
        const ttl = gateCfg.sessionTtlMs || (12 * 60 * 60 * 1000);
        safeSetItem(GATE_STORAGE_KEY, JSON.stringify({ hash: digest, exp: Date.now() + ttl }));
        if (inp) inp.value = '';
        if (err) err.textContent = '';
        syncPortalGateUI();
        showToast('Audio Portal unlocked');
      } else {
        if (err) err.textContent = 'Incorrect passcode. Ask the Technical Head or Console Head.';
        if (inp) inp.select();
      }
    }

    function lockPortalGate() {
      safeSetItem(GATE_STORAGE_KEY, '');
      try { window.localStorage.removeItem(GATE_STORAGE_KEY); } catch (e) {}
      syncPortalGateUI();
      showToast('Audio Portal locked');
    }

    function hydratePortalConfigDOM() {
      // Populate venue <select> elements from CFG.venues
      ['ev-venue', 'new-ev-venue'].forEach(selId => {
        const sel = document.getElementById(selId);
        if (sel && Array.isArray(CFG.venues)) {
          const curVal = sel.value;
          sel.innerHTML = CFG.venues.map(v => `<option value="${escapeHTML(v)}">${escapeHTML(v)}</option>`).join('');
          if (curVal && CFG.venues.includes(curVal)) sel.value = curVal;
        }
      });
      // Populate quick distance buttons in calculators
      const qdWrap = document.getElementById('calc-quick-distances');
      if (qdWrap && Array.isArray(CFG.quickDistances)) {
        qdWrap.innerHTML = CFG.quickDistances.map(d =>
          `<button type="button" data-action="quick-distance" data-arg="${d.m}" class="px-3 py-1.5 rounded-lg btn-subtle text-xs font-semibold">${escapeHTML(d.label)}</button>`
        ).join('');
      }
      // Hydrate text/html elements tagged with data-cfg-tpl
      document.querySelectorAll('[data-cfg-tpl]').forEach(el => {
        const tpl = el.getAttribute('data-cfg-tpl') || '';
        const rendered = tpl
          .replace(/\{consoleShort\}/g, CFG.consoleShort || '')
          .replace(/\{consoleName\}/g, CFG.consoleName || '')
          .replace(/\{consoleModel\}/g, CFG.consoleModel || '')
          .replace(/\{consoleFull\}/g, CFG.consoleFull || '')
          .replace(/\{channelCount\}/g, String(CFG.channelCount || 32))
          .replace(/\{brokenFaderCh\}/g, String(CFG.brokenFaderCh || 18))
          .replace(/\{brokenMix\}/g, CFG.brokenMix || '')
          .replace(/\{snakeBrand\}/g, CFG.snakeBrand || '')
          .replace(/\{snakeSpec\}/g, CFG.snakeSpec || '')
          .replace(/\{deadSnakePorts\}/g, (CFG.deadSnakePorts || []).join(', '))
          .replace(/\{dspShort\}/g, CFG.dspShort || '')
          .replace(/\{captureApp\}/g, CFG.captureApp || 'PreSonus Capture')
          .replace(/\{primaryVenue\}/g, CFG.primaryVenue || '');
        if (el.hasAttribute('data-cfg-html')) el.innerHTML = rendered;
        else el.textContent = rendered;
      });
    }


    // Centralized Event Delegation (Replaces 140+ inline onclick/oninput/onchange handlers)
    function bindPortalDelegatedEvents() {
      document.addEventListener('click', e => {
        const el = e.target.closest('[data-action]');
        if (!el) return;
        const action = el.getAttribute('data-action');
        const arg = el.getAttribute('data-arg');
        switch (action) {
          case 'switch-view': switchView(arg); break;
          case 'switch-view-mob': switchView(arg); closeMobilePortalGrid(); break;
          case 'step-view': stepPortalView(parseInt(arg, 10)); break;
          case 'toggle-mobile-grid': toggleMobilePortalGrid(); break;
          case 'copy-run-sheet': copyEventRunSheetWhatsApp(); break;
          case 'download-patch-html': downloadServicePatchHTML(); break;
          case 'download-patch-csv': downloadServicePatchCSV(); break;
          case 'lock-portal': lockPortalGate(); break;
          case 'export-json': exportStateJSON(); break;
          case 'open-import-modal': openImportModal(); break;
          case 'close-import-modal': closeImportModal(); break;
          case 'confirm-import-json': confirmImportJSON(); break;
          case 'open-new-event-modal': openNewEventModal(); break;
          case 'close-new-event-modal': closeNewEventModal(); break;
          case 'create-new-event': createNewEvent(); break;
          case 'open-add-cue-modal': openAddCueModal(); break;
          case 'close-add-cue-modal': closeAddCueModal(); break;
          case 'save-new-cue': saveNewCue(); break;
          case 'open-strategy-modal': openStrategyModal(); break;
          case 'close-strategy-modal': closeStrategyModal(); break;
          case 'save-custom-strategy': saveCustomStrategy(); break;
          case 'mastering-preset': applyMasteringPreset(arg); break;
          case 'audition-preset': renderAuditionRackPreset(arg); break;
          case 'reset-rec-checklist': resetRecordingChecklist(); break;
          case 'before-after': renderBeforeAfterChart(arg); break;
          case 'toggle-problem-ghost': toggleProblemGhost(); break;
          case 'reset-channel-eq': resetCurrentChannelEQ(); break;
          case 'filter-channels': filterChannelButtons(arg); break;
          case 'select-channel': selectChannel(arg); break;
          case 'load-channel-editor':
            safeSetItem('sdu_active_ch', arg);
            selectChannel(arg);
            switchView('channels');
            break;
          case 'checklist-filter': setChecklistFilter(arg); break;
          case 'reset-checklist': resetChecklist(); break;
          case 'matrix-filter': filterMatrix(arg); break;
          case 'copy-crew-patch': copyCrewPatchWhatsApp(); break;
          case 'patch-preset': applyPatchPreset(arg); break;
          case 'toggle-patch-ch': toggleServiceChannelSelection(parseInt(arg, 10)); break;
          case 'quick-distance': setQuickDistance(parseFloat(arg)); break;
          case 'tap-tempo': tapTempo(); break;
          case 'download-doc': downloadDeptDoc(arg); break;
          case 'cycle-cue': cycleCueStatus(parseInt(arg, 10)); break;
          case 'remove-cue': removeCue(parseInt(arg, 10)); break;
          case 'toggle-gear-status': toggleGearStatus(parseInt(arg, 10)); break;
        }
      });

      document.addEventListener('input', e => {
        const el = e.target.closest('[data-input-action]');
        if (!el) return;
        const action = el.getAttribute('data-input-action');
        const arg = el.getAttribute('data-arg');
        switch (action) {
          case 'update-mastering-sim': updateMasteringSim(); break;
          case 'update-event-meta': updateActiveEventMeta(); break;
          case 'update-crew-member': updateCrewMember(parseInt(arg, 10), el.value); break;
          case 'render-forensic-table': renderForensicTable(); break;
          case 'eq-slider-change': onEQSliderChange(); break;
          case 'update-acoustic-calc': updateAcousticCalc(); break;
          case 'update-bpm-calc': updateBPMCalc(el.value); break;
          case 'update-rec-calc': updateRecordingCalc(); break;
        }
      });

      document.addEventListener('change', e => {
        const el = e.target.closest('[data-change-action]');
        if (!el) return;
        const action = el.getAttribute('data-change-action');
        const arg = el.getAttribute('data-arg');
        switch (action) {
          case 'select-event': selectEvent(el.value); break;
          case 'update-event-meta': updateActiveEventMeta(); break;
          case 'render-forensic-table': renderForensicTable(); break;
          case 'render-strategies': renderStrategies(); break;
          case 'preview-photo': previewHomeGalleryPhoto(el); break;
          case 'toggle-check-item': toggleCheckItem(arg); break;
          case 'toggle-rec-check': toggleRecCheckItem(arg); break;
          case 'update-rec-calc': updateRecordingCalc(); break;
        }
      });

      document.addEventListener('submit', e => {
        const el = e.target.closest('[data-submit-action]');
        if (!el) return;
        if (el.getAttribute('data-submit-action') === 'submit-portal-gate') {
          submitPortalGate(e);
        }
      });
    }

    window.addEventListener('DOMContentLoaded', () => {
      bindPortalDelegatedEvents();
      hydratePortalConfigDOM();
      syncPortalGateUI();
      restoreMasteringSim();
      restoreRecordingCalc();
      renderAuditionRackPreset(activeAuditionPreset);
      renderRecordingChecklist();
      renderPlanner();
      renderForensicCharts();
      renderBeforeAfterChart(activeBeforeAfterKey);
      renderForensicTable();
      selectChannel(currentChannelId);
      setChecklistFilter(checklistFilter);
      filterMatrix(matrixFilter);
      renderSnakeGrid();
      renderServicePatchBuilder();
      restoreCalcState();
      renderStrategies();
      renderGearInventory();
      
      switchView(currentView);
      // Touch swipe gesture to switch between portal modules (ignores sliders, inputs, canvas & horizontal tables)
    (function initPortalTouchSwipe() {
      const col = document.getElementById('portal-workspace-col');
      if (!col) return;
      let startX = 0, startY = 0, startT = 0, ignoreSwipe = false;
      col.addEventListener('touchstart', e => {
        if (!e.touches || e.touches.length !== 1) return;
        const t = e.target;
        if (t && t.closest('input, textarea, select, canvas, .overflow-x-auto, #tabs')) {
          ignoreSwipe = true;
          return;
        }
        ignoreSwipe = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startT = Date.now();
      }, { passive: true });

      col.addEventListener('touchend', e => {
        if (ignoreSwipe || !startT || !e.changedTouches || e.changedTouches.length !== 1) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        const dt = Date.now() - startT;
        startT = 0;
        if (dt <= 600 && Math.abs(dx) >= 64 && Math.abs(dx) > Math.abs(dy) * 1.8) {
          stepPortalView(dx < 0 ? 1 : -1);
        }
      }, { passive: true });
    })();
    });
  
    (function(){function go(){var v=location.hash.slice(1);if(v&&document.getElementById('view-'+v))switchView(v);}go();window.addEventListener('hashchange',go);})();

window.addEventListener('agcm-theme-change', () => {
  try { drawEQCurve(); } catch (e) {}
});

