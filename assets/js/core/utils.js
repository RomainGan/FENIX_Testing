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
function renderList(){
  const el = document.getElementById('playerList');
  if(!players.length){ el.innerHTML='<div style="padding:8px 12px;font-size:12px;color:var(--text-3)">Aucun joueur</div>'; return; }
  const sorted = [...players].sort((a,b)=>{
    const na=(a.n||'').toLowerCase(), nb=(b.n||'').toLowerCase();
    if(na!==nb) return na.localeCompare(nb,'fr');
    return (a.pr||'').toLowerCase().localeCompare((b.pr||'').toLowerCase(),'fr');
  });
  el.innerHTML = sorted.map(p=>{
    const latestSidx = p.sessions ? p.sessions.length-1 : null;
    const s = calcScore(p.id, latestSidx);
    const cls = s.t>=70?'pill-green':s.t>=40?'pill-orange':'pill-red';
    const fc = s.t>=70?'var(--green)':s.t>=40?'var(--orange)':'var(--red)';
    const pos = p.facePos ? `${p.facePos.x}% ${p.facePos.y}%` : '50% 25%';
    const av = p.photo ? `<img src="${p.photo}" alt="${p.pr}" style="object-position:${pos}">` : (p.essai ? ghostSVG(22) : ini(p.n,p.pr));
    const avCls = `player-avatar${p.photo?' has-photo':''}`;
    return `<div class="${avCls==='player-avatar has-photo'?'player-item':'player-item'}${cPid===p.id?' active':''}" onclick="selPlayer('${p.id}')" style="display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);transition:background .1s${cPid===p.id?';background:var(--navy-3)':''}">
      <div class="${avCls}">${av}</div>
      <div style="flex:1;min-width:0">
        <div class="player-name">${fmtName(p.n,p.pr)}${p.essai?'<span style="font-size:9px;color:var(--gold);font-family:\'Barlow Condensed\',sans-serif;letter-spacing:1px;margin-left:6px">ESSAI</span>':''}</div>
        <div class="player-group">${p.gr||'—'}</div>
        ${s.f>0?`<div class="player-prog"><div class="player-prog-fill" style="width:${s.t}%;background:${fc}"></div></div>`:''}
      </div>
      ${s.f>0?`<span class="player-score-pill ${cls}">${s.t}%</span>`:''}
    </div>`;
  }).join('');
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
