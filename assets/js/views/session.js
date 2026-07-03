// Fenix Toulouse — views/session.js
// ─── MODE SÉANCE (grille de testing multi-joueurs) ────────
// Permet de tester un groupe d'athlètes sur un test donné, façon "grille Polar".
// Flux : 1) cocher les joueurs 2) choisir un test 3) grille colorée 4) saisie popup.

let _sessSelectedIds = [];   // joueurs participant à la séance
let _sessTestId = null;      // test en cours
let _sessStep = 'select';    // 'select' | 'grid'
let _sessSide = 'g';         // pour tests bilatéraux : côté en cours de saisie

// Initiales d'un joueur
function _sessIni(n, pr){
  const a=(pr||'').trim()[0]||'';
  const b=(n||'').trim()[0]||'';
  return (a+b).toUpperCase()||'—';
}

// Récupérer l'objet test complet par son id
function _sessGetTest(tid){
  let found=null;
  TESTS.forEach(sec=>sec.tests.forEach(t=>{ if(t.id===tid) found={...t,secId:sec.id,secTitle:sec.title}; }));
  return found;
}

// Liste plate de tous les tests dans l'ordre (1→20)
function _sessAllTests(){
  const arr=[];
  TESTS.forEach(sec=>sec.tests.forEach(t=>arr.push({...t,secId:sec.id,secTitle:sec.title})));
  return arr.sort((a,b)=>(a.num||0)-(b.num||0));
}

// Couleur d'un score 0/1/2/3
function _sessScoreColor(v){
  if(v===3) return '#22c55e';
  if(v===2) return '#eab308';
  if(v===1) return '#f59e0b';
  if(v===0) return '#ef4444';
  return null;
}

// ─── VUE PRINCIPALE ───────────────────────────────────────
function renderSession(){
  window._currentView='session';
  const navBtns=document.querySelectorAll('.nav-btn');
  navBtns.forEach(b=>b.classList.remove('active'));
  const el=document.getElementById('mainContent');
  if(!el) return;
  if(_sessStep==='select') el.innerHTML=_sessRenderSelect();
  else el.innerHTML=_sessRenderGrid();
}

// ─── ÉTAPE 1 : SÉLECTION DES JOUEURS ──────────────────────
function _sessRenderSelect(){
  const sorted=[...players].sort((a,b)=>(a.n||'').localeCompare(b.n||''));
  const cards=sorted.map(p=>{
    const checked=_sessSelectedIds.includes(p.id);
    return `<div onclick="sessToggle('${p.id}')" style="cursor:pointer;display:flex;align-items:center;gap:10px;
      padding:10px 14px;border-radius:10px;border:2px solid ${checked?'var(--cyan)':'var(--border)'};
      background:${checked?'rgba(0,200,230,.1)':'var(--navy-2)'};transition:all .12s">
      <div style="width:22px;height:22px;border-radius:6px;flex-shrink:0;border:2px solid ${checked?'var(--cyan)':'var(--border-2)'};
        background:${checked?'var(--cyan)':'transparent'};display:flex;align-items:center;justify-content:center;
        color:#0a1628;font-weight:800;font-size:13px">${checked?'✓':''}</div>
      <div style="width:34px;height:34px;border-radius:50%;flex-shrink:0;background:var(--navy-4);
        display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:var(--cyan)">
        ${_sessIni(p.n,p.pr)}</div>
      <div style="min-width:0">
        <div style="font-weight:700;font-size:13px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.n} ${p.pr}</div>
        <div style="font-size:11px;color:var(--text-3)">${p.gr||'—'}${p.pos?' · '+p.pos:''}</div>
      </div>
    </div>`;
  }).join('');

  const n=_sessSelectedIds.length;
  return `<div style="max-width:1100px;margin:0 auto;padding:8px 4px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">
      <span class="section-badge" style="background:rgba(0,200,230,.15);color:var(--cyan);border:1px solid rgba(0,200,230,.3)">MODE SÉANCE</span>
      <span style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;color:var(--text)">Testing de Groupe</span>
    </div>
    <div style="font-size:13px;color:var(--text-3);margin-bottom:18px">Coche les athlètes qui participent à la séance, puis démarre.</div>

    <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
      <button class="btn btn-outline" onclick="sessSelectAll()" style="font-size:12px">✓ Tout sélectionner</button>
      <button class="btn btn-outline" onclick="sessSelectNone()" style="font-size:12px">✕ Tout désélectionner</button>
      <div style="flex:1"></div>
      <button class="btn btn-cyan" onclick="sessStart()" style="font-size:13px"${n===0?' disabled style="opacity:.4;font-size:13px"':''}>
        ▶ Démarrer la séance (${n})</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">
      ${cards||'<div style="color:var(--text-3);padding:20px">Aucun joueur. Ajoute des joueurs d\'abord.</div>'}
    </div>
  </div>`;
}

function sessToggle(pid){
  const i=_sessSelectedIds.indexOf(pid);
  if(i>=0) _sessSelectedIds.splice(i,1); else _sessSelectedIds.push(pid);
  renderSession();
}
function sessSelectAll(){ _sessSelectedIds=players.map(p=>p.id); renderSession(); }
function sessSelectNone(){ _sessSelectedIds=[]; renderSession(); }
function sessStart(){
  if(_sessSelectedIds.length===0) return;
  if(!_sessTestId) _sessTestId=_sessAllTests()[0]?.id;
  _sessStep='grid';
  renderSession();
}
function sessBackToSelect(){ _sessStep='select'; renderSession(); }

// ─── ÉTAPE 2 : GRILLE DE TESTING ──────────────────────────
function _sessRenderGrid(){
  const test=_sessGetTest(_sessTestId);
  const allTests=_sessAllTests();
  const idx=allTests.findIndex(t=>t.id===_sessTestId);

  // Sélecteur de test
  const testOptions=allTests.map(t=>
    `<option value="${t.id}"${t.id===_sessTestId?' selected':''}>${t.num}. ${t.name}</option>`
  ).join('');

  // Grille des joueurs
  const parts=players.filter(p=>_sessSelectedIds.includes(p.id))
    .sort((a,b)=>(a.n||'').localeCompare(b.n||''));

  const cells=parts.map(p=>{
    const sess=getSess(p, p.sessions.length-1);
    const d=sess.d||{};
    let scoreDisplay='', bg='var(--navy-3)', txtCol='var(--text)';

    if(test.bilateral){
      const sg=d[test.id+'_g'], sd=d[test.id+'_d'];
      const hasG=(sg!==undefined&&sg!==null&&sg!==''), hasD=(sd!==undefined&&sd!==null&&sd!=='');
      if(hasG||hasD){
        const cg=_sessScoreColor(parseInt(sg)), cd=_sessScoreColor(parseInt(sd));
        scoreDisplay=`<div style="display:flex;gap:6px;justify-content:center;font-size:20px;font-weight:800">
          <span style="color:${cg||'var(--text-3)'}">${hasG?sg:'–'}</span>
          <span style="color:var(--text-3);font-size:14px">/</span>
          <span style="color:${cd||'var(--text-3)'}">${hasD?sd:'–'}</span></div>`;
        if(hasG&&hasD){ const avg=(parseInt(sg)+parseInt(sd))/2; bg=_sessCellBg(avg); }
      } else {
        scoreDisplay='<div style="font-size:13px;color:var(--text-3)">Non testé</div>';
      }
    } else {
      const s=d[test.id];
      const has=(s!==undefined&&s!==null&&s!=='');
      if(has){
        const c=_sessScoreColor(parseInt(s));
        scoreDisplay=`<div style="font-size:26px;font-weight:800;color:${c||'var(--text)'}">${s}</div>`;
        bg=_sessCellBg(parseInt(s));
      } else {
        scoreDisplay='<div style="font-size:13px;color:var(--text-3)">Non testé</div>';
      }
    }

    return `<div onclick="sessOpenEntry('${p.id}')" style="cursor:pointer;background:${bg};
      border:1px solid var(--border);border-radius:12px;padding:12px;min-height:96px;
      display:flex;flex-direction:column;justify-content:space-between;transition:transform .1s"
      onmousedown="this.style.transform='scale(.97)'" onmouseup="this.style.transform='scale(1)'"
      onmouseleave="this.style.transform='scale(1)'">
      <div style="font-weight:700;font-size:13px;color:${txtCol};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
        ${p.n} ${p.pr}</div>
      ${scoreDisplay}
    </div>`;
  }).join('');

  const prevDis=idx<=0?' disabled style="opacity:.35"':'';
  const nextDis=idx>=allTests.length-1?' disabled style="opacity:.35"':'';

  return `<div style="max-width:1200px;margin:0 auto;padding:8px 4px">
    <!-- Barre supérieure -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
      <button class="btn btn-outline" onclick="sessBackToSelect()" style="font-size:12px">← Joueurs</button>
      <div style="flex:1;min-width:200px">
        <select onchange="sessChangeTest(this.value)" style="width:100%;background:var(--navy-3);
          border:1px solid var(--border-2);border-radius:8px;padding:10px 12px;color:var(--text);
          font-family:'Barlow',sans-serif;font-size:14px;font-weight:600">${testOptions}</select>
      </div>
      <button class="btn btn-outline" onclick="sessPrevTest()"${prevDis} style="font-size:16px;padding:8px 14px">‹</button>
      <button class="btn btn-outline" onclick="sessNextTest()"${nextDis} style="font-size:16px;padding:8px 14px">›</button>
    </div>

    <!-- Infos test -->
    <div style="background:var(--navy-2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;margin-bottom:14px">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1.5px;color:var(--cyan)">
        Test ${test.num} — ${test.name}</div>
      <div style="font-size:12px;color:var(--text-3);margin-top:2px">${test.desc||''}${test.unit?' · Unité : '+test.unit:''}${test.bilateral?' · Bilatéral (G/D)':''}</div>
    </div>

    <!-- Grille -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">
      ${cells}
    </div>
  </div>

  <!-- Popup de saisie -->
  <div id="sessEntryModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);
    z-index:9999;align-items:center;justify-content:center;padding:20px" onclick="if(event.target===this)sessCloseEntry()">
    <div id="sessEntryBox" style="background:var(--navy-1);border:1px solid var(--border-2);border-radius:16px;
      padding:22px;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.5)"></div>
  </div>`;
}

function _sessCellBg(avgScore){
  if(avgScore>=2.5) return 'rgba(34,197,94,.14)';
  if(avgScore>=1.5) return 'rgba(234,179,8,.14)';
  if(avgScore>=0.5) return 'rgba(245,158,11,.14)';
  return 'rgba(239,68,68,.14)';
}

function sessChangeTest(tid){ _sessTestId=tid; renderSession(); }
function sessPrevTest(){
  const all=_sessAllTests(); const i=all.findIndex(t=>t.id===_sessTestId);
  if(i>0){ _sessTestId=all[i-1].id; renderSession(); }
}
function sessNextTest(){
  const all=_sessAllTests(); const i=all.findIndex(t=>t.id===_sessTestId);
  if(i<all.length-1){ _sessTestId=all[i+1].id; renderSession(); }
}

// ─── ÉTAPE 3 : POPUP DE SAISIE ────────────────────────────
function sessOpenEntry(pid){
  const p=players.find(x=>x.id===pid); if(!p) return;
  const test=_sessGetTest(_sessTestId);
  const sess=getSess(p, p.sessions.length-1);
  const d=sess.d||{};
  const box=document.getElementById('sessEntryBox');
  const modal=document.getElementById('sessEntryModal');
  if(!box||!modal) return;

  // Barème (thresholds) pour aide visuelle
  const thrHtml=(test.thr||[]).map(t=>
    `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--text-3);margin-right:10px">
      <span style="width:9px;height:9px;border-radius:50%;background:${_sessScoreColor(t.s)};display:inline-block"></span>
      ${t.s} = ${t.l}</span>`
  ).join('');

  // Boutons de score 0/1/2/3
  function scoreButtons(sideKey, currentVal){
    return [0,1,2,3].map(v=>{
      const sel=(currentVal!==undefined&&currentVal!==null&&currentVal!==''&&parseInt(currentVal)===v);
      const c=_sessScoreColor(v);
      return `<button onclick="sessSetScore('${pid}','${sideKey}',${v})" style="flex:1;padding:14px 0;
        border-radius:10px;border:2px solid ${sel?c:'var(--border-2)'};
        background:${sel?c:'transparent'};color:${sel?'#0a1628':'var(--text)'};
        font-weight:800;font-size:20px;cursor:pointer;transition:all .1s">${v}</button>`;
    }).join('');
  }

  // Champ valeur brute (si test numérique)
  function rawField(sideKey){
    if(test.type!=='numeric') return '';
    const rawKey=test.id+(sideKey?'_'+sideKey:'')+'_raw';
    const val=d[rawKey]||'';
    return `<div style="margin-bottom:10px">
      <label style="display:block;font-size:11px;color:var(--text-3);margin-bottom:4px">Mesure (${test.unit||''})${test.hint?' — '+test.hint:''}</label>
      <input type="text" inputmode="decimal" value="${val}" 
        oninput="sessSetRaw('${pid}','${sideKey}',this.value)"
        style="width:100%;background:rgba(0,0,0,.3);border:1px solid var(--border-2);border-radius:8px;
        padding:10px 12px;color:var(--text);font-size:15px;box-sizing:border-box"
        placeholder="Ex: 12.5">
    </div>`;
  }

  let bodyHtml='';
  if(test.bilateral){
    const sg=d[test.id+'_g'], sd=d[test.id+'_d'];
    bodyHtml=`
      <div style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:700;color:var(--cyan);margin-bottom:6px;letter-spacing:1px">◄ GAUCHE</div>
        ${rawField('g')}
        <div style="display:flex;gap:8px">${scoreButtons('g',sg)}</div>
      </div>
      <div style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:700;color:var(--cyan);margin-bottom:6px;letter-spacing:1px">DROITE ►</div>
        ${rawField('d')}
        <div style="display:flex;gap:8px">${scoreButtons('d',sd)}</div>
      </div>`;
  } else {
    const s=d[test.id];
    bodyHtml=`
      <div style="margin-bottom:16px">
        ${rawField('')}
        <div style="display:flex;gap:8px">${scoreButtons('',s)}</div>
      </div>`;
  }

  // Commentaire
  const noteKey=test.id+'_nt';
  const noteVal=d[noteKey]||'';

  box.innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
      <div style="width:40px;height:40px;border-radius:50%;background:var(--navy-4);flex-shrink:0;
        display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--cyan)">${_sessIni(p.n,p.pr)}</div>
      <div style="flex:1">
        <div style="font-weight:800;font-size:16px;color:var(--text)">${p.n} ${p.pr}</div>
        <div style="font-size:11px;color:var(--text-3)">${test.num}. ${test.name}</div>
      </div>
      <button onclick="sessCloseEntry()" style="background:none;border:none;color:var(--text-3);
        font-size:22px;cursor:pointer;padding:0 4px">✕</button>
    </div>
    <div style="margin:10px 0 14px;padding:8px 10px;background:var(--navy-3);border-radius:8px;line-height:1.9">${thrHtml}</div>
    ${bodyHtml}
    <div style="margin-bottom:14px">
      <label style="display:block;font-size:11px;color:var(--text-3);margin-bottom:4px">💬 Commentaire (optionnel)</label>
      <input type="text" value="${noteVal.replace(/"/g,'&quot;')}" oninput="sessSetNote('${pid}',this.value)"
        style="width:100%;background:rgba(0,0,0,.3);border:1px solid var(--border-2);border-radius:8px;
        padding:9px 12px;color:var(--text);font-size:13px;box-sizing:border-box" placeholder="Note libre…">
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-cyan" onclick="sessCloseEntry()" style="flex:1;font-size:14px">✓ Valider</button>
      ${_sessNextPlayerBtn(pid)}
    </div>`;

  modal.style.display='flex';
}

function _sessNextPlayerBtn(pid){
  const parts=players.filter(p=>_sessSelectedIds.includes(p.id)).sort((a,b)=>(a.n||'').localeCompare(b.n||''));
  const i=parts.findIndex(p=>p.id===pid);
  if(i<parts.length-1){
    return `<button class="btn btn-outline" onclick="sessOpenEntry('${parts[i+1].id}')" style="font-size:14px">Suivant →</button>`;
  }
  return '';
}

function sessCloseEntry(){
  const modal=document.getElementById('sessEntryModal');
  if(modal) modal.style.display='none';
  renderSession();
}

// Sauvegarde d'un score depuis la séance (sur la dernière session du joueur)
function sessSetScore(pid, side, val){
  const p=players.find(x=>x.id===pid); if(!p) return;
  const sess=getSess(p, p.sessions.length-1);
  if(!sess.d) sess.d={};
  const key=_sessTestId+(side?'_'+side:'');
  sess.d[key]=val;
  save();
  sessOpenEntry(pid); // refresh popup (met à jour la sélection visuelle)
}

// Sauvegarde d'une valeur brute + calcul auto éventuel
function sessSetRaw(pid, side, rawVal){
  const p=players.find(x=>x.id===pid); if(!p) return;
  const sess=getSess(p, p.sessions.length-1);
  if(!sess.d) sess.d={};
  const rawKey=_sessTestId+(side?'_'+side:'')+'_raw';
  const scoreKey=_sessTestId+(side?'_'+side:'');
  sess.d[rawKey]=rawVal;
  const test=_sessGetTest(_sessTestId);
  if(test&&test.auto){
    const autoS=test.auto(rawVal, sess);
    if(autoS!==null){
      sess.d[scoreKey]=autoS;
      // Rafraîchir les boutons de score dans la popup
      save();
      sessOpenEntry(pid);
      return;
    }
  }
  save();
}

function sessSetNote(pid, val){
  const p=players.find(x=>x.id===pid); if(!p) return;
  const sess=getSess(p, p.sessions.length-1);
  if(!sess.d) sess.d={};
  sess.d[_sessTestId+'_nt']=val;
  save();
}
