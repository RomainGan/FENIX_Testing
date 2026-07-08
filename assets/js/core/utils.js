// Fenix Toulouse — core/utils.js
// Utilitaires : calcul scores, rendu liste joueurs, helpers UI
// ─── UTILS ────────────────────────────────────────────────
const ini = (n,p) => ((p||'?')[0]+(n||'?')[0]).toUpperCase();
function sColor(s){ return s===3?'green':s===2?'yellow':s===1?'orange':'red'; }

// ─── FORMATAGE DES NOMS ───────────────────────────────────
// Nom en MAJUSCULES, prénom avec Initiale Majuscule (gère les composés : Jean-Marc, Anne Marie)
function fmtNom(n){ return (n||'').trim().toUpperCase(); }
function fmtPrenom(pr){
  return (pr||'').trim().toLowerCase().replace(/(^|[\s\-'’])([\p{L}])/gu, (m,sep,ch)=>sep+ch.toUpperCase());
}
function fmtName(n, pr){
  const N=fmtNom(n), P=fmtPrenom(pr);
  return (N+' '+P).trim();
}

// ─── SCORE ────────────────────────────────────────────────
function calcScoreFromData(d){
  let s3=0,s2=0,s1=0,s0=0,f=0;const secs={};const TOTAL_MAX=60;let totalPts=0;
  TESTS.forEach(sec=>{
    let secPts=0,secFilled=0;
    sec.tests.forEach(t=>{
      if(t.bilateral){
        const vg=d[t.id+'_g'],vd=d[t.id+'_d'];
        const ng=(vg!==null&&vg!==undefined&&vg!=='')?parseInt(vg):null;
        const nd=(vd!==null&&vd!==undefined&&vd!=='')?parseInt(vd):null;
        const gOk=ng!==null&&!isNaN(ng),dOk=nd!==null&&!isNaN(nd);
        if(gOk&&dOk){secPts+=(ng+nd)/2;secFilled++;[ng,nd].forEach(n=>{f++;if(n===3)s3++;else if(n===2)s2++;else if(n===1)s1++;else s0++;});}
        else if(gOk){secPts+=ng;secFilled++;f++;if(ng===3)s3++;else if(ng===2)s2++;else if(ng===1)s1++;else s0++;}
        else if(dOk){secPts+=nd;secFilled++;f++;if(nd===3)s3++;else if(nd===2)s2++;else if(nd===1)s1++;else s0++;}
      } else {
        const v=d[t.id];if(v!==null&&v!==undefined&&v!==''){const n=parseInt(v);if(isNaN(n))return;secPts+=n;secFilled++;f++;if(n===3)s3++;else if(n===2)s2++;else if(n===1)s1++;else s0++;}
      }
    });
    secs[sec.id]={pts:secPts,max:sec.tests.length*3,filled:secFilled};totalPts+=secPts;
  });
  return{s3,s2,s1,s0,t:Math.round(totalPts/TOTAL_MAX*100),f,secs};
}
function calcScore(pid,sidx){
  const p=players.find(x=>x.id===pid);
  if(!p)return{s3:0,s2:0,s1:0,s0:0,t:0,f:0,secs:{}};
  return calcScoreFromData(getSess(p,sidx!==undefined?sidx:null).d||{});
}

function ghostSVG(sz){
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="opacity:.4"><circle cx="20" cy="14" r="8" fill="#9cb3d4"/><path d="M4 36 Q4 24 20 24 Q36 24 36 36Z" fill="#9cb3d4"/></svg>`;
}

// ─── PLAYER LIST ──────────────────────────────────────────
// État des sections de groupe repliées (true = ouvert). Par défaut tout replié.
const _grpOpen = {};

function _loadSessGroups(){
  try{ return JSON.parse(localStorage.getItem('ftph_groups')||'[]')||[]; }catch(e){ return []; }
}

// Génère la carte HTML d'un joueur pour la barre latérale
function _playerCard(p){
  const latestSidx = p.sessions ? p.sessions.length-1 : null;
  const s = calcScore(p.id, latestSidx);
  const cls = s.t>=70?'pill-green':s.t>=40?'pill-orange':'pill-red';
  const fc = s.t>=70?'var(--green)':s.t>=40?'var(--orange)':'var(--red)';
  const pos = p.facePos ? `${p.facePos.x}% ${p.facePos.y}%` : '50% 25%';
  const av = p.photo ? `<img src="${p.photo}" alt="${p.pr}" style="object-position:${pos}">` : (p.essai ? ghostSVG(22) : ini(p.n,p.pr));
  const avCls = `player-avatar${p.photo?' has-photo':''}`;
  return `<div class="player-item${cPid===p.id?' active':''}" onclick="selPlayer('${p.id}')" style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);transition:background .1s${cPid===p.id?';background:var(--navy-3)':''}">
    <div class="${avCls}">${av}</div>
    <div style="flex:1;min-width:0">
      <div class="player-name">${fmtName(p.n,p.pr)}${p.essai?'<span style="font-size:9px;color:var(--gold);font-family:\'Barlow Condensed\',sans-serif;letter-spacing:1px;margin-left:6px">ESSAI</span>':''}</div>
      <div class="player-group">${p.gr||'—'}</div>
      ${s.f>0?`<div class="player-prog"><div class="player-prog-fill" style="width:${s.t}%;background:${fc}"></div></div>`:''}
    </div>
    ${s.f>0?`<span class="player-score-pill ${cls}">${s.t}%</span>`:''}
  </div>`;
}

// Un en-tête de section repliable
function _grpSection(key, title, count, innerHtml){
  const open = _grpOpen[key]===true;
  return `<div class="grp-section" style="border-bottom:1px solid var(--border)">
    <div onclick="toggleGrpSection('${key}')" style="display:flex;align-items:center;gap:8px;padding:11px 14px;cursor:pointer;background:var(--navy-2);user-select:none">
      <span style="transition:transform .15s;transform:rotate(${open?'90':'0'}deg);color:var(--cyan);font-size:11px">▶</span>
      <span style="flex:1;font-family:'Barlow Condensed',sans-serif;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:var(--text)">${title}</span>
      <span style="font-size:11px;color:var(--text-3)">${count}</span>
    </div>
    <div style="display:${open?'block':'none'}">${open?innerHtml:''}</div>
  </div>`;
}

function toggleGrpSection(key){
  _grpOpen[key] = _grpOpen[key]===true ? false : true;
  renderList();
}

// ─── GESTION DES GROUPES (modale depuis la barre latérale) ──
let _grpMgrEditId = null;
function openGroupManager(){
  _grpMgrEditId = null;
  let modal = document.getElementById('grpMgrModal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'grpMgrModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(3,8,18,.85);'
      +'z-index:2147483000;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto;'
      +'-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)';
    modal.onclick = function(e){ if(e.target===modal) closeGroupManager(); };
    document.body.appendChild(modal);
  }
  modal.innerHTML = '<div style="background:#0a1424;border:1px solid var(--border-2);border-radius:16px;padding:22px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.8);margin:auto" onclick="event.stopPropagation()">'+_grpMgrInner()+'</div>';
  modal.style.display = 'flex';
}
function closeGroupManager(){
  const modal = document.getElementById('grpMgrModal');
  if(modal){ modal.style.display='none'; modal.remove(); }
  renderList();
}
function _grpMgrRefresh(){
  const modal = document.getElementById('grpMgrModal');
  if(modal){ modal.querySelector('div').innerHTML = _grpMgrInner(); }
}
function _grpMgrInner(){
  const groups = _loadSessGroups();
  const sorted = [...players].sort((a,b)=>(a.n||'').localeCompare(b.n||'','fr'));

  let editor = '';
  if(_grpMgrEditId){
    const g = groups.find(x=>x.id===_grpMgrEditId);
    if(g){
      const checks = sorted.map(p=>{
        const on = g.memberIds.includes(p.id);
        return `<div id="grpmem_${p.id}" onclick="grpMgrToggleMember('${p.id}')" style="cursor:pointer;display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;border:1px solid ${on?'var(--cyan)':'var(--border)'};background:${on?'rgba(0,200,230,.1)':'transparent'}">
          <div class="grpmem-box" style="width:18px;height:18px;border-radius:5px;flex-shrink:0;border:2px solid ${on?'var(--cyan)':'var(--border-2)'};background:${on?'var(--cyan)':'transparent'};display:flex;align-items:center;justify-content:center;color:#0a1628;font-weight:800;font-size:11px">${on?'✓':''}</div>
          <span style="font-size:12px;color:var(--text)">${fmtName(p.n,p.pr)}</span>
        </div>`;
      }).join('');
      editor = `<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <input id="grpMgrName" value="${(g.name||'').replace(/"/g,'&quot;')}" onchange="grpMgrRename(this.value)"
            style="flex:1;background:rgba(0,0,0,.3);border:1px solid var(--border-2);border-radius:8px;padding:8px 12px;color:var(--text);font-size:14px;font-weight:600">
          <button class="btn btn-outline" onclick="grpMgrCloseEditor()" style="font-size:12px">✓ Terminé</button>
        </div>
        <div style="font-size:11px;color:var(--text-3);margin-bottom:8px">Coche les membres (<span id="grpMgrCount">${g.memberIds.length}</span> sélectionné(s))</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px;max-height:320px;overflow-y:auto">${checks}</div>
      </div>`;
    }
  }

  const list = groups.map(g=>{
    const count = g.memberIds.filter(id=>players.find(p=>p.id===id)).length;
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;background:var(--navy-3);margin-bottom:6px">
      <span style="flex:1;font-size:13px;font-weight:600;color:var(--text)">👥 ${g.name}</span>
      <span style="font-size:12px;color:var(--text-3)">${count}</span>
      <button class="btn btn-outline" onclick="grpMgrEdit('${g.id}')" style="font-size:11px;padding:4px 10px">✏️ Membres</button>
      <button class="btn btn-outline" onclick="grpMgrDelete('${g.id}')" style="font-size:11px;padding:4px 10px;color:var(--red);border-color:var(--red-border)">🗑</button>
    </div>`;
  }).join('');

  return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <span style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1.5px;color:var(--cyan)">GESTION DES GROUPES</span>
      <div style="flex:1"></div>
      <button onclick="closeGroupManager()" style="background:none;border:none;color:var(--text-3);font-size:22px;cursor:pointer;padding:0 4px">✕</button>
    </div>
    <div style="font-size:12px;color:var(--text-3);margin-bottom:14px">Crée des groupes (ex : « FENIX Saison 2024/2025 ») pour organiser ta barre latérale et le Mode Séance.</div>
    <button class="btn btn-cyan" onclick="grpMgrNew()" style="font-size:12px;margin-bottom:14px">＋ Nouveau groupe</button>
    ${list||'<div style="font-size:12px;color:var(--text-3);font-style:italic;padding:6px 0">Aucun groupe pour l\'instant.</div>'}
    ${editor}`;
}
function grpMgrNew(){
  const groups=_loadSessGroups();
  const g={id:'grp_'+Date.now(), name:'Nouveau groupe', memberIds:[]};
  groups.push(g); localStorage.setItem('ftph_groups',JSON.stringify(groups));
  _grpMgrEditId=g.id; _grpMgrRefresh();
}
function grpMgrEdit(gid){ _grpMgrEditId=gid; _grpMgrRefresh(); }
function grpMgrCloseEditor(){ _grpMgrEditId=null; _grpMgrRefresh(); }
function grpMgrRename(name){
  const groups=_loadSessGroups(); const g=groups.find(x=>x.id===_grpMgrEditId);
  if(g){ g.name=(name.trim()||'Sans nom'); localStorage.setItem('ftph_groups',JSON.stringify(groups)); }
}
function grpMgrDelete(gid){
  if(!confirm('Supprimer ce groupe ? (les joueurs ne sont pas supprimés)')) return;
  let groups=_loadSessGroups().filter(g=>g.id!==gid);
  localStorage.setItem('ftph_groups',JSON.stringify(groups));
  if(_grpMgrEditId===gid) _grpMgrEditId=null;
  _grpMgrRefresh();
}
function grpMgrToggleMember(pid){
  const groups=_loadSessGroups(); const g=groups.find(x=>x.id===_grpMgrEditId);
  if(!g) return;
  const i=g.memberIds.indexOf(pid);
  const on = i<0; // sera coché après toggle
  if(i>=0) g.memberIds.splice(i,1); else g.memberIds.push(pid);
  localStorage.setItem('ftph_groups',JSON.stringify(groups));
  // Mise à jour ciblée de la case (sans redessiner toute la modale → préserve le scroll)
  const row=document.getElementById('grpmem_'+pid);
  if(row){
    row.style.border='1px solid '+(on?'var(--cyan)':'var(--border)');
    row.style.background=on?'rgba(0,200,230,.1)':'transparent';
    const box=row.querySelector('.grpmem-box');
    if(box){ box.style.border='2px solid '+(on?'var(--cyan)':'var(--border-2)'); box.style.background=on?'var(--cyan)':'transparent'; box.textContent=on?'✓':''; }
  }
  // Mettre à jour le compteur
  const cnt=document.getElementById('grpMgrCount');
  if(cnt) cnt.textContent=g.memberIds.length;
}

function renderList(){
  const el = document.getElementById('playerList');
  if(!players.length){ el.innerHTML='<div style="padding:8px 12px;font-size:12px;color:var(--text-3)">Aucun joueur</div>'; return; }

  const sortFn = (a,b)=>{
    const na=(a.n||'').toLowerCase(), nb=(b.n||'').toLowerCase();
    if(na!==nb) return na.localeCompare(nb,'fr');
    return (a.pr||'').toLowerCase().localeCompare((b.pr||'').toLowerCase(),'fr');
  };
  const sortedAll = [...players].sort(sortFn);
  const groups = _loadSessGroups();

  let html = '';

  // Section "Tous les joueurs"
  const allInner = sortedAll.map(_playerCard).join('');
  html += _grpSection('__all__', 'Tous les joueurs', sortedAll.length, allInner);

  // Une section par groupe créé
  groups.forEach(g=>{
    const members = sortedAll.filter(p=>g.memberIds.includes(p.id));
    const inner = members.length
      ? members.map(_playerCard).join('')
      : '<div style="padding:10px 14px;font-size:12px;color:var(--text-3);font-style:italic">Aucun membre dans ce groupe.</div>';
    html += _grpSection(g.id, g.name, members.length, inner);
  });

  el.innerHTML = html;
}

// ─── FICHE SECTION TOGGLE ─────────────────────────────────
const fsSt = {};
function toggleFicheSection(id){
  fsSt[id] = fsSt[id]===false ? true : false;
  const body = document.getElementById('fsb_'+id);
  const chev  = document.getElementById('chev_'+id);
  if(body) body.classList.toggle('collapsed', fsSt[id]===false);
  if(chev) chev.classList.toggle('open', fsSt[id]!==false);
}

// ─── JP7 REFRESH ──────────────────────────────────────────
// ─── FORMULES %MG ─────────────────────────────────────────
const FORMULES_PLIS = {
  jp3: {
    label: 'Jackson & Pollock — 3 plis',
    plis_H: ['pliPectoral','pliAbdomen','pliCuisse'],
    plis_F: ['pliTriceps','pliSupraIli','pliCuisse'],
    labels_H: ['Pectoral','Abdomen','Cuisse'],
    labels_F: ['Triceps','Supra-Iliaque','Cuisse'],
    calc: (sum, age, sexe) => {
      let D;
      if(sexe==='F') D = 1.0994921 - 0.0009929*sum + 0.0000023*sum*sum - 0.0001392*age;
      else           D = 1.10938   - 0.0008267*sum + 0.0000016*sum*sum - 0.0002574*age;
      return {D, pct: (495/D)-450, sites: 3};
    }
  },
  durnin4: {
    label: 'Durnin & Womersley — 4 plis',
    plis_H: ['pliBiceps','pliTriceps','pliSousScap','pliSupraIli'],
    plis_F: ['pliBiceps','pliTriceps','pliSousScap','pliSupraIli'],
    labels_H: ['Biceps','Triceps','Sous-Scap.','Supra-Iliaque'],
    labels_F: ['Biceps','Triceps','Sous-Scap.','Supra-Iliaque'],
    calc: (sum, age, sexe) => {
      // Coefficients Durnin & Womersley (log10 du Σ4)
      const logS = Math.log10(sum);
      let c, m;
      if(sexe==='F'){
        if(age<20)      {c=1.1549;m=0.0678;}
        else if(age<30) {c=1.1599;m=0.0717;}
        else if(age<40) {c=1.1423;m=0.0632;}
        else if(age<50) {c=1.1333;m=0.0612;}
        else            {c=1.1339;m=0.0645;}
      } else {
        if(age<20)      {c=1.1620;m=0.0630;}
        else if(age<30) {c=1.1631;m=0.0632;}
        else if(age<40) {c=1.1422;m=0.0544;}
        else if(age<50) {c=1.1620;m=0.0700;}
        else            {c=1.1715;m=0.0779;}
      }
      const D = c - m*logS;
      return {D, pct: (495/D)-450, sites: 4};
    }
  },
  jp7: {
    label: 'Jackson & Pollock — 7 plis',
    plis_H: ['pliPectoral','pliAxillaire','pliTriceps','pliSousScap','pliAbdomen','pliSupraIli','pliCuisse'],
    plis_F: ['pliPectoral','pliAxillaire','pliTriceps','pliSousScap','pliAbdomen','pliSupraIli','pliCuisse'],
    labels_H: ['Pectoral','Axillaire','Triceps','Sous-Scap.','Abdomen','Supra-Iliaque','Cuisse'],
    labels_F: ['Pectoral','Axillaire','Triceps','Sous-Scap.','Abdomen','Supra-Iliaque','Cuisse'],
    calc: (sum, age, sexe) => {
      let D;
      if(sexe==='F') D = 1.097 - 0.00046971*sum + 0.00000056*sum*sum - 0.00012828*age;
      else           D = 1.112 - 0.00043499*sum + 0.00000055*sum*sum - 0.00028826*age;
      return {D, pct: (495/D)-450, sites: 7};
    }
  }
};

function selectFormulePlis(val){
  if(!cPid) return;
  const _p=players.find(x=>x.id===cPid); if(!_p) return;
  const sess=getCurrSess(_p);
  sess.formulePlis=val; save();

  // Mettre à jour visuellement les boutons sans re-render complet
  document.querySelectorAll('.formule-btn').forEach(btn=>{
    const active = btn.dataset.formule===val;
    btn.style.borderColor  = active?'var(--cyan)':'var(--border-2)';
    btn.style.background   = active?'var(--cyan-dim)':'none';
    btn.style.color        = active?'var(--cyan)':'var(--text-3)';
  });

  // Mettre à jour le label de la formule active
  const lbl=document.getElementById('formuleLabelActif');
  if(lbl) lbl.textContent=FORMULES_PLIS[val]?.label||'';

  updatePliGrid(val, _p.sexe||'H', sess);
  refreshJP7();
}

function updatePliGrid(formuleCle, sexe, sess){
  const grid=document.getElementById('pliGridContainer'); if(!grid) return;
  const f=FORMULES_PLIS[formuleCle];
  if(!f) return;
  const plis = sexe==='F' ? f.plis_F : f.plis_H;
  const labels = sexe==='F' ? f.labels_F : f.labels_H;
  grid.innerHTML = plis.map((k,i)=>`
    <div class="pli-field">
      <div class="pli-label">${'①②③④⑤⑥⑦'[i]} ${labels[i]}</div>
      <input class="pli-input" type="number" step="0.1" value="${sess[k]||''}"
        placeholder="—" data-key="${k}"
        onchange="uf('${k}',this.value);refreshJP7()">
      <div class="pli-unit">mm</div>
    </div>`).join('');
}

function refreshJP7(){
  if(!cPid) return;
  const _p=players.find(x=>x.id===cPid); if(!_p) return;
  const sess=getCurrSess(_p);
  const age = _p.ddn ? Math.floor((Date.now()-new Date(_p.ddn))/(365.25*24*3600*1000)) : null;
  const sexe = _p.sexe||'H';
  const formuleCle = sess.formulePlis||'jp7';
  const f = FORMULES_PLIS[formuleCle];
  const el = document.getElementById('jp7Result'); if(!el) return;

  if(!age){ el.innerHTML=`<div style="font-size:12px;color:var(--text-3);font-family:'Barlow',sans-serif">Renseignez la date de naissance pour calculer.</div>`; return; }

  const plis = sexe==='F' ? f.plis_F : f.plis_H;
  const vals = plis.map(k=>parseFloat(sess[k]||'')).filter(v=>!isNaN(v)&&v>0);

  if(vals.length < plis.length){
    const manque = plis.length - vals.length;
    el.innerHTML=`<div style="font-size:12px;color:var(--text-3);font-family:'Barlow',sans-serif">
      ${manque} pli${manque>1?'s':''} manquant${manque>1?'s':''} — renseignez tous les ${plis.length} plis pour calculer.
    </div>`;
    return;
  }

  const sum = vals.reduce((a,b)=>a+b,0);
  const {D, pct: pctRaw, sites} = f.calc(sum, age, sexe);
  const pct = Math.round(pctRaw*10)/10;
  const c = pct<10?'var(--cyan)':pct<15?'var(--green)':pct<20?'#eab308':pct<25?'var(--orange)':'var(--red)';
  const niv = pct<10?'💪 Très faible (Elite)':pct<15?'✅ Excellent':pct<20?'🟡 Correct':pct<25?'⚠️ À surveiller':'🔴 Élevé';

  sess.mgPct=String(pct); save();
  el.innerHTML=`
    <div class="jp7-score">
      <div class="jp7-pct" style="color:${c}">${pct}%</div>
      <div class="jp7-lbl">Masse Grasse</div>
    </div>
    <div class="jp7-detail">
      <div>Σ ${sites} plis : <strong style="color:var(--text)">${Math.round(sum*10)/10} mm</strong></div>
      <div>Densité corporelle : <strong style="color:var(--text)">${Math.round(D*1000)/1000}</strong></div>
      <div style="margin-top:4px">${niv}</div>
      <div class="jp7-formula">${f.label} — ${sexe==='F'?'Femme':'Homme'} · ${age} ans</div>
    </div>`;
}
