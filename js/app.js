const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const MAIL='agcmtechnicaldepartment2021@gmail.com';
const inTools=location.pathname.includes('/tools/');
const ROOT=inTools?'../':'';
const NAV=[["index.html","🏠","Home"],["executives.html","👥","Executives"],["gallery.html","🖼️","Gallery"],["tools/foh-portal.html","🎚️","Audio Portal"]];
const rawPage=location.pathname.split('/').pop()||'index.html';
const page=inTools?'tools/'+rawPage:rawPage;
document.documentElement.classList.add('js');

/* Shared sticky horizontal top navigation + footer across ALL pages including Audio Portal */
(function(){
  const h=document.createElement('header'),f=document.createElement('footer');
  h.className='topnav';f.className='foot';
  h.innerHTML=`<div class="tn-brand"><button class="logo-btn" id="logo" aria-label="View logo larger"><img src="${ROOT}assets/logo.png" alt="AGCM-KNUST Technical Department logo"></button><a href="${ROOT}index.html" style="text-decoration:none"><h1>AGCM - KNUST</h1><p>Technical Department</p></a></div><nav class="tn-tabs" aria-label="Main">${NAV.map(([u,i,t])=>`<a class="nav-pill${u===page?' active':''}" href="${ROOT}${u}"${u===page?' aria-current="page"':''}><span>${i}</span><span>${t}</span></a>`).join('')}</nav><div class="tn-r"><a class="btn-subtle mail" href="mailto:${MAIL}">✉️ Contact</a><button class="btn-subtle sq theme-btn" aria-label="Switch light or dark mode"></button></div>`;
  f.innerHTML=`<span>AGCM - KNUST Technical Department • Audio Mixing, Mastering, Recording, Editing &amp; Conveyance</span><a href="mailto:${MAIL}">${MAIL}</a>`;
  document.body.prepend(h);document.body.append(f);
  document.body.insertAdjacentHTML('beforeend','<div class="modal" id="lm" hidden><img alt="AGCM-KNUST Technical Department logo"></div><div id="toast" role="status"></div>');
  const act=$('.nav-pill.active',h);if(act&&act.scrollIntoView)act.scrollIntoView({inline:'center',block:'nearest'});
})();

function toast(m){const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)}

/* Shared light/dark theme across main site and Audio Portal */
function setTheme(t){
  document.documentElement.dataset.theme=t;
  store.set('sdu_theme_v35',t);
  $$('.theme-btn').forEach(b=>b.textContent=t==='light'?'☀️':'🌙');
  window.dispatchEvent(new CustomEvent('agcm-theme-change',{detail:t}));
}
$$('.theme-btn').forEach(b=>b.onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
setTheme(store.get('sdu_theme_v35')==='dark'?'dark':'light');

/* Read-only enlarged logo viewer */
const lm=$('#lm');
if($('#logo')&&lm){
  $('#logo').onclick=()=>{$('img',lm).src=ROOT+'assets/logo-lg.png';lm.hidden=false};
  lm.onclick=()=>lm.hidden=true;
  addEventListener('keydown',e=>{if(e.key==='Escape')lm.hidden=true});
}

/* Top bar tucks away while scrolling down, returns on scroll up */
let ly=0;
addEventListener('scroll',()=>{const y=scrollY;const tn=$('.topnav');if(tn)tn.classList.toggle('hide',y>ly&&y>140);ly=y},{passive:true});

/* Press ripple */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.ch-btn');if(!b||calm)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';s.style.left=e.clientX-r.left+'px';s.style.top=e.clientY-r.top+'px';b.appendChild(s);setTimeout(()=>s.remove(),600)});

/* Hero level meter */
const meter=$('.meter');
if(meter){const N=32;meter.innerHTML='<i></i>'.repeat(N);const bars=$$('i',meter);let px=-1,t=0;
 const at=e=>{const r=meter.getBoundingClientRect();px=(e.clientX-r.left)/r.width};
 meter.addEventListener('pointermove',at);meter.addEventListener('pointerdown',at);meter.addEventListener('pointerleave',()=>px=-1);
 (function f(){t+=.04;bars.forEach((b,i)=>{let v=.25+.2*Math.sin(t+i*.5)+.12*Math.sin(t*2.3+i);if(px>=0)v+=.6*Math.exp(-(((i/N-px)*7)**2));b.style.setProperty('--h',Math.min(1,Math.max(.06,v)))});if(!calm)requestAnimationFrame(f)})()}

/* Executives page with constitutional role bios (Review #3) */
const exg=$('#ex-grid');
if(exg&&window.EXECS){let g='';EXECS.forEach(r=>{if(r.group!==g){g=r.group;exg.insertAdjacentHTML('beforeend',`<div class="grp">${g}</div>`)}
 const ps=r.people&&r.people.length?r.people:[{}];
 exg.insertAdjacentHTML('beforeend',`<div class="dept-card-compact ex rv"><h3>${r.role}</h3>${r.bio?`<p class="ex-bio">${r.bio}</p>`:''}${ps.map(p=>`<div class="person"><div class="av">${p.photo?`<img src="${p.photo}" alt="">`:p.name?p.name.split(' ').map(w=>w[0]).slice(0,2).join(''):'👤'}</div><span${p.name?'':' class="tbd"'}>${p.name||'Name to be added'}</span></div>`).join('')}</div>`)})}

/* Gallery page placeholders & category filter */
const galGrid=$('#gal-grid');
if(galGrid&&window.GALLERY_ITEMS){
  let activeCat='ALL';
  const filterWrap=$('#gal-filters');
  const cats=['ALL','FOH & Console','Campus Venues','Ministry & Events','Crew & Setup'];
  function renderGallery(){
    if(filterWrap){
      filterWrap.innerHTML=cats.map(c=>`<button type="button" class="ch-btn${c===activeCat?' active':''}" data-cat="${c}">${c==='ALL'?'All Photos':c}</button>`).join('');
      $$('button',filterWrap).forEach(b=>b.onclick=()=>{activeCat=b.dataset.cat;renderGallery()});
    }
    const items=GALLERY_ITEMS.filter(x=>activeCat==='ALL'||x.cat===activeCat);
    galGrid.innerHTML=items.map((it,idx)=>`<article class="gal-card rv"><div class="gal-thumb" id="gal-thumb-${idx}">${it.photo?`<img src="${it.photo}" alt="${it.title}">`:`<span class="gal-icon">${it.icon}</span><span class="text-mut" style="font-size:.75rem;font-weight:600">Photo Placeholder • Ready for Upload</span>`}<span class="gal-tag">${it.cat}</span></div><div class="gal-body"><div class="kicker">${it.venue}</div><h3>${it.title}</h3><p class="sm text-sec">${it.desc}</p></div></article>`).join('');
  }
  renderGallery();
  const upInput=$('#gal-upload-input');
  if(upInput){
    upInput.onchange=e=>{
      const f=e.target.files&&e.target.files[0];if(!f)return;
      const rd=new FileReader();
      rd.onload=ev=>{
        GALLERY_ITEMS[0].photo=ev.target.result;
        GALLERY_ITEMS[0].title=f.name.replace(/\.[^/.]+$/,'');
        renderGallery();
        toast('Previewed photo in Gallery slot 1');
      };
      rd.readAsDataURL(f);
    };
  }
}

/* Scroll reveal */
const rvs=$$('.rv');
if(rvs.length&&window.IntersectionObserver){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);setTimeout(()=>e.target.classList.remove('rv','in'),1300)}}),{threshold:.12});rvs.forEach((c,i)=>{c.style.setProperty('--d',(i%4)*.06+'s');io.observe(c)})}else rvs.forEach(c=>c.classList.remove('rv'));

/* Leads handover workspace with .txt export & saved timestamp (Review #7) */
const tabs=$('#tabs');
if(tabs&&window.ROLES){let cur=0;const panel=$('#panel');
 tabs.innerHTML=ROLES.map(r=>`<button class="ch-btn" role="tab">${r.name}</button>`).join('');const btns=$$('.ch-btn',tabs);
 function show(i,dir){cur=(i+ROLES.length)%ROLES.length;const r=ROLES[cur];btns.forEach((b,j)=>{b.classList.toggle('active',j===cur);b.setAttribute('aria-selected',j===cur)});
  panel.style.setProperty('--dir',dir||1);panel.style.animation='none';panel.offsetWidth;panel.style.animation='';
  const savedAt=store.get('note-time-'+r.id);
  panel.innerHTML=`<div class="kicker">Role Handover &amp; Constitutional Duties</div><h3 class="title">${r.name}</h3><ul class="sm text-sec">${r.duties.map(d=>`<li>${d}</li>`).join('')}</ul><textarea class="dept-input" aria-label="Handover notes" placeholder="Handover notes for ${r.name}"></textarea><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:6px"><span id="note-stamp" class="text-mut" style="font-size:.75rem">${savedAt?'Last saved on this device: '+savedAt:'Notes save on this device. Use Export (.txt) to share.'}</span><button type="button" id="btn-dl-note" class="btn-subtle" style="padding:6px 12px;border-radius:8px;font-size:.75rem;font-weight:700">⬇ Export Notes (.txt)</button></div>`;
  const ta=$('textarea',panel);ta.value=store.get('note-'+r.id)||'';
  ta.oninput=()=>{const now=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});store.set('note-'+r.id,ta.value);store.set('note-time-'+r.id,now);const st=$('#note-stamp');if(st)st.textContent='Last saved on this device: '+now;clearTimeout(show.t);show.t=setTimeout(()=>toast('Saved'),700)};
  const dlBtn=$('#btn-dl-note',panel);if(dlBtn)dlBtn.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([`# ${r.name} — Handover Notes\n\n`+(ta.value||'No notes entered.')],{type:'text/plain'}));a.download=`${r.id}-handover-notes.txt`;a.click();toast('Exported notes .txt')}}
 btns.forEach((b,i)=>b.onclick=()=>show(i,i>cur?1:-1));
 show(0)}
