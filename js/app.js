const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const MAIL='agcmtechnicaldepartment2021@gmail.com';
const NAV=[["index.html","🏠","Home"],["executives.html","👥","Executives"],["leads.html","📝","Leads"],["tools/foh-portal.html","🎚️","Audio Portal"]];
const page=location.pathname.split('/').pop()||'index.html';
document.documentElement.classList.add('js');
/* top navigation + footer, built once for every page */
(function(){const h=document.createElement('header'),f=document.createElement('footer');h.className='topnav';f.className='foot';
h.innerHTML=`<div class="tn-brand"><button class="logo-btn" id="logo" aria-label="View logo larger"><img src="assets/logo.png" alt="AGCM-KNUST Technical Department logo"></button><div><h1>AGCM - KNUST</h1><p>Technical Department</p></div></div><nav class="tn-tabs" aria-label="Main">${NAV.map(([u,i,t])=>`<a class="nav-pill${u===page?' active':''}" href="${u}"${u===page?' aria-current="page"':''}><span>${i}</span><span>${t}</span></a>`).join('')}</nav><div class="tn-r"><a class="btn-subtle mail" href="mailto:${MAIL}">✉️ Contact</a><button class="btn-subtle sq theme-btn" aria-label="Switch light or dark mode"></button></div>`;
f.innerHTML=`<span>AGCM - KNUST Technical Department • Audio Mixing, Mastering, Recording, Editing &amp; Conveyance</span><a href="mailto:${MAIL}">${MAIL}</a>`;
document.body.prepend(h);document.body.append(f);
document.body.insertAdjacentHTML('beforeend','<div class="modal" id="lm" hidden><img alt="AGCM-KNUST Technical Department logo"></div><div id="toast" role="status"></div>');
const act=$('.nav-pill.active',h);if(act&&act.scrollIntoView)act.scrollIntoView({inline:'center',block:'nearest'})})();
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)}
/* light/dark, same storage key as the original portal */
function setTheme(t){document.documentElement.dataset.theme=t;store.set('sdu_theme_v35',t);$$('.theme-btn').forEach(b=>b.textContent=t==='light'?'☀️':'🌙')}
$$('.theme-btn').forEach(b=>b.onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));setTheme(store.get('sdu_theme_v35')==='dark'?'dark':'light');
/* logo viewer */
const lm=$('#lm');$('#logo').onclick=()=>{$('img',lm).src='assets/logo-lg.png';lm.hidden=false};lm.onclick=()=>lm.hidden=true;
addEventListener('keydown',e=>{if(e.key==='Escape')lm.hidden=true});
/* top bar tucks away while scrolling down, returns on scroll up */
let ly=0;addEventListener('scroll',()=>{const y=scrollY;$('.topnav').classList.toggle('hide',y>ly&&y>140);ly=y},{passive:true});
/* press ripple */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.ch-btn');if(!b||calm)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';s.style.left=e.clientX-r.left+'px';s.style.top=e.clientY-r.top+'px';b.appendChild(s);setTimeout(()=>s.remove(),600)});
/* hero level meter: idles on its own, follows finger or cursor */
const meter=$('.meter');
if(meter){const N=32;meter.innerHTML='<i></i>'.repeat(N);const bars=$$('i',meter);let px=-1,t=0;
 const at=e=>{const r=meter.getBoundingClientRect();px=(e.clientX-r.left)/r.width};
 meter.addEventListener('pointermove',at);meter.addEventListener('pointerdown',at);meter.addEventListener('pointerleave',()=>px=-1);
 (function f(){t+=.04;bars.forEach((b,i)=>{let v=.25+.2*Math.sin(t+i*.5)+.12*Math.sin(t*2.3+i);if(px>=0)v+=.6*Math.exp(-(((i/N-px)*7)**2));b.style.setProperty('--h',Math.min(1,Math.max(.06,v)))});if(!calm)requestAnimationFrame(f)})()}
/* executives: people cards (photo or initials, name or placeholder) */
const exg=$('#ex-grid');
if(exg&&window.EXECS){let g='';EXECS.forEach(r=>{if(r.group!==g){g=r.group;exg.insertAdjacentHTML('beforeend',`<div class="grp">${g}</div>`)}
 const ps=r.people&&r.people.length?r.people:[{}];
 exg.insertAdjacentHTML('beforeend',`<div class="dept-card-compact ex rv"><h3>${r.role}</h3>${ps.map(p=>`<div class="person"><div class="av">${p.photo?`<img src="${p.photo}" alt="">`:p.name?p.name.split(' ').map(w=>w[0]).slice(0,2).join(''):'👤'}</div><span${p.name?'':' class="tbd"'}>${p.name||'Name to be added'}</span></div>`).join('')}</div>`)})}
/* cards ease in as they scroll into view, then drop the effect so hover lift works */
const rvs=$$('.rv');
if(rvs.length&&window.IntersectionObserver){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);setTimeout(()=>e.target.classList.remove('rv','in'),1300)}}),{threshold:.12});rvs.forEach((c,i)=>{c.style.setProperty('--d',(i%4)*.06+'s');io.observe(c)})}else rvs.forEach(c=>c.classList.remove('rv'));
/* leads: role tabs, swipe between roles, notes saved on this device */
const tabs=$('#tabs');
if(tabs&&window.ROLES){let cur=0;const panel=$('#panel');
 tabs.innerHTML=ROLES.map(r=>`<button class="ch-btn" role="tab">${r.name}</button>`).join('');const btns=$$('.ch-btn',tabs);
 function show(i,dir){cur=(i+ROLES.length)%ROLES.length;const r=ROLES[cur];btns.forEach((b,j)=>{b.classList.toggle('active',j===cur);b.setAttribute('aria-selected',j===cur)});
  panel.style.setProperty('--dir',dir||1);panel.style.animation='none';panel.offsetWidth;panel.style.animation='';
  panel.innerHTML=`<div class="kicker">Role notes</div><h3 class="title">${r.name}</h3><ul class="sm text-sec">${r.duties.map(d=>`<li>${d}</li>`).join('')}</ul><textarea class="dept-input" aria-label="Handover notes" placeholder="Handover notes for ${r.name}"></textarea><p class="text-mut" style="font-size:.75rem">Notes save on this device only. Swipe or use the arrow keys to change role.</p>`;
  const ta=$('textarea',panel);ta.value=store.get('note-'+r.id)||'';ta.oninput=()=>{store.set('note-'+r.id,ta.value);clearTimeout(show.t);show.t=setTimeout(()=>toast('Saved'),700)}}
 btns.forEach((b,i)=>b.onclick=()=>show(i,i>cur?1:-1));
 let x0=null;panel.addEventListener('pointerdown',e=>{if(e.target.tagName!=='TEXTAREA')x0=e.clientX});
 addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>70)show(cur+(dx<0?1:-1),dx<0?1:-1)});
 addEventListener('keydown',e=>{if(!/^(TEXTAREA|INPUT)$/.test(e.target.tagName)&&/Arrow(Left|Right)/.test(e.key))show(cur+(e.key==='ArrowRight'?1:-1),e.key==='ArrowRight'?1:-1)});
 show(0)}
