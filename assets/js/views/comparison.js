// Fenix Toulouse — views/comparison.js
// Vues : Comparaison 1v1, Vue Équipe, Récapitulatif
// Dépendances : core/state.js (players, cPid, compPid*, compSidx*, equipeFilter, equipeSort)
//               core/utils.js (calcScore, ini), core/data-tests.js (TESTS)

// ─── COMPARAISON ──────────────────────────────────────────
function renderComp(){
  window._currentView='comp';
  document.getElementById('topbarTitle').textContent='COMPARAISON';
  document.getElementById('topbarMeta').textContent='1v1 · Équipe';
  document.getElementById('topbarAvatar').innerHTML='📈';
  document.getElementById('topbarAvatar').classList.remove('has-photo');
  document.getElementById('dateChip').textContent=new Date().toLocaleDateString('fr-FR');
  if(compTab==='1v1') renderComp1v1();
  else renderCompEquipe();
}

function compPlayerOptions(selectedId){
  return players.map(p=>`<option value="${p.id}" ${p.id===selectedId?'selected':''}>${fmtName(p.n,p.pr)} — ${p.pos||'—'}</option>`).join('');
}
function compSessionOptions(pid, selectedSidx){
  const p=players.find(x=>x.id===pid); if(!p||!p.sessions) return '';
  return (p.sessions||[]).map((s,i)=>{
    const sd=s.dt?new Date(s.dt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}):`Session ${i+1}`;
    const sc=calcScore(p.id,i);
    return `<option value="${i}" ${i===(selectedSidx??p.sessions.length-1)?'selected':''}>${sd} — ${sc.t}%</option>`;
  }).join('');
}

function onCompChange(){
  const pa=document.getElementById('compSelA')?.value, sb=document.getElementById('compSelB')?.value;
  const sa=document.getElementById('compSessA')?.value, sd=document.getElementById('compSessD')?.value;
  if(pa) compPidA=pa;
  if(sb) compPidB=sb;
  if(sa!==undefined) compSidxA=parseInt(sa);
  if(sd!==undefined) compSidxB=parseInt(sd);
  const selA=document.getElementById('compSessA'), selB=document.getElementById('compSessD');
  if(selA&&pa){ selA.innerHTML=compSessionOptions(pa,compSidxA); compSidxA=parseInt(selA.value); }
  if(selB&&sb){ selB.innerHTML=compSessionOptions(sb,compSidxB); compSidxB=parseInt(selB.value); }
  renderComp1v1Body();
}

function renderComp1v1(){
  if(!compPidA) compPidA=players[0]?.id||null;
  if(!compPidB) compPidB=players[1]?.id||players[0]?.id||null;
  const pA=players.find(x=>x.id===compPidA), pB=players.find(x=>x.id===compPidB);
  if(compSidxA===null||compSidxA===undefined) compSidxA=pA?(pA.sessions.length-1):0;
  if(compSidxB===null||compSidxB===undefined) compSidxB=pB?(pB.sessions.length-1):0;

  document.getElementById('mainContent').innerHTML=`<div class="comp-wrap">
    <div class="comp-tabs">
      <button class="comp-tab active" onclick="compTab='1v1';renderComp()">📊 Comparaison 1v1</button>
      <button class="comp-tab" onclick="compTab='equipe';renderComp()">👥 Vue Équipe</button>
    </div>
    <div class="comp-selectors">
      <div class="comp-selector-panel panel-a">
        <div class="comp-selector-label" style="color:var(--cyan)">JOUEUR A</div>
        <select class="comp-select" id="compSelA" onchange="onCompChange()">${compPlayerOptions(compPidA)}</select>
        <select class="comp-select" id="compSessA" onchange="onCompChange()">${compSessionOptions(compPidA,compSidxA)}</select>
      </div>
      <div class="comp-vs-badge">VS</div>
      <div class="comp-selector-panel panel-b">
        <div class="comp-selector-label" style="color:var(--gold)">JOUEUR B</div>
        <select class="comp-select" id="compSelB" onchange="onCompChange()">${compPlayerOptions(compPidB)}</select>
        <select class="comp-select" id="compSessD" onchange="onCompChange()">${compSessionOptions(compPidB,compSidxB)}</select>
      </div>
    </div>
    <div id="comp1v1Body"></div>
  </div>`;
  renderComp1v1Body();
}

function renderComp1v1Body(){
  const pA=players.find(x=>x.id===compPidA), pB=players.find(x=>x.id===compPidB);
  const el=document.getElementById('comp1v1Body'); if(!el) return;
  if(!pA||!pB){el.innerHTML='<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-title">Sélectionnez deux joueurs</div></div>';return;}

  const scA=calcScore(pA.id,compSidxA), scB=calcScore(pB.id,compSidxB);
  const sessA=getSess(pA,compSidxA), sessB=getSess(pB,compSidxB);
  const dtA=sessA.dt?new Date(sessA.dt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}):'—';
  const dtB=sessB.dt?new Date(sessB.dt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}):'—';

  const delta=(a,b,suffix='')=>{
    if(a===null||b===null) return `<span class="comp-delta delta-eq">—</span>`;
    const d=a-b;
    if(d===0) return `<span class="comp-delta delta-eq">≡</span>`;
    return `<span class="comp-delta ${d>0?'delta-pos':'delta-neg'}">${d>0?'+':''}${Math.round(d*10)/10}${suffix}</span>`;
  };
  const dotStyle=(s)=>{
    if(s===null||s===undefined) return `style="background:var(--border-2);color:var(--text-3)"`;
    return `style="background:${s===3?'var(--green-dim)':s===2?'rgba(234,179,8,.12)':s===1?'var(--orange-dim)':'var(--red-dim)'};color:${s===3?'var(--green)':s===2?'#eab308':s===1?'var(--orange)':'var(--red)'}"`;
  };

  let h=`
  <div class="comp-score-block">
    <div class="comp-score-block-title">SCORE GLOBAL & SECTIONS</div>
    <div class="comp-score-row">
      <div class="comp-score-bar-wrap comp-bar-a">
        <span class="comp-val comp-val-a">${scA.t}%</span>
        <div class="comp-bar-track"><div class="comp-bar-fill-a" style="width:${scA.t}%"></div></div>
      </div>
      <div class="comp-label">Score Global</div>
      ${delta(scA.t,scB.t,'%')}
      <div class="comp-label" style="text-align:right">Score Global</div>
      <div class="comp-score-bar-wrap comp-bar-b">
        <div class="comp-bar-track"><div class="comp-bar-fill-b" style="width:${scB.t}%"></div></div>
        <span class="comp-val comp-val-b">${scB.t}%</span>
      </div>
    </div>`;

  const catDefs=[
    {id:'mob_inf',label:'Mob. Inférieure'},
    {id:'mob_sup',label:'Mob. Supérieure'},
    {id:'stab',   label:'Stabilité'},
    {id:'fonc',   label:'Fonctionnel'},
  ];
  catDefs.forEach(cat=>{
    const sA=scA.secs[cat.id]||{pts:0,max:1};
    const sB=scB.secs[cat.id]||{pts:0,max:1};
    const pA2=Math.round(sA.pts/sA.max*100);
    const pB2=Math.round(sB.pts/sB.max*100);
    h+=`<div class="comp-score-row">
      <div class="comp-score-bar-wrap comp-bar-a">
        <span class="comp-val comp-val-a" style="font-size:14px">${Math.round(sA.pts*10)/10}/${sA.max}</span>
        <div class="comp-bar-track"><div class="comp-bar-fill-a" style="width:${pA2}%"></div></div>
      </div>
      <div class="comp-label">${cat.label}</div>
      ${delta(sA.pts,sB.pts)}
      <div class="comp-label" style="text-align:right">${cat.label}</div>
      <div class="comp-score-bar-wrap comp-bar-b">
        <div class="comp-bar-track"><div class="comp-bar-fill-b" style="width:${pB2}%"></div></div>
        <span class="comp-val comp-val-b" style="font-size:14px">${Math.round(sB.pts*10)/10}/${sB.max}</span>
      </div>
    </div>`;
  });
  h+=`</div>`;

  h+=`<div class="comp-score-block">
    <div class="comp-score-block-title">TEST PAR TEST — ${fmtName(pA.n,pA.pr)} (${dtA}) vs ${fmtName(pB.n,pB.pr)} (${dtB})</div>
    <table class="comp-test-table">
      <thead><tr>
        <th>Test</th>
        <th class="center" style="color:var(--cyan)">${pA.pr} ${pA.n[0]}.</th>
        <th class="center">Δ</th>
        <th class="center" style="color:var(--gold)">${pB.pr} ${pB.n[0]}.</th>
      </tr></thead>
      <tbody>`;

  TESTS.forEach(sec=>{
    h+=`<tr><td colspan="4" style="padding:6px 10px;background:var(--navy-3);font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:2px;color:var(--text-3)">${sec.title}</td></tr>`;
    sec.tests.forEach(t=>{
      let valA, valB, rawA='', rawB='';
      if(t.bilateral){
        const gA=sessA.d[t.id+'_g'],dA=sessA.d[t.id+'_d'];
        const gB=sessB.d[t.id+'_g'],dB=sessB.d[t.id+'_d'];
        const ngA=(gA!==null&&gA!==undefined&&gA!=='')?parseInt(gA):null;
        const ndA=(dA!==null&&dA!==undefined&&dA!=='')?parseInt(dA):null;
        const ngB=(gB!==null&&gB!==undefined&&gB!=='')?parseInt(gB):null;
        const ndB=(dB!==null&&dB!==undefined&&dB!=='')?parseInt(dB):null;
        if(ngA!==null&&ndA!==null) valA=(ngA+ndA)/2; else if(ngA!==null) valA=ngA; else if(ndA!==null) valA=ndA; else valA=null;
        if(ngB!==null&&ndB!==null) valB=(ngB+ndB)/2; else if(ngB!==null) valB=ngB; else if(ndB!==null) valB=ndB; else valB=null;
        const rawGA=sessA.d[t.id+'_g_raw']||'', rawDA=sessA.d[t.id+'_d_raw']||'';
        const rawGB=sessB.d[t.id+'_g_raw']||'', rawDB=sessB.d[t.id+'_d_raw']||'';
        if(rawGA||rawDA) rawA=`G:${rawGA||'—'} D:${rawDA||'—'}`;
        if(rawGB||rawDB) rawB=`G:${rawGB||'—'} D:${rawDB||'—'}`;
      } else {
        const vA=sessA.d[t.id],vB=sessB.d[t.id];
        valA=(vA!==null&&vA!==undefined&&vA!=='')?parseInt(vA):null;
        valB=(vB!==null&&vB!==undefined&&vB!=='')?parseInt(vB):null;
        if(sessA.d[t.id+'_raw']) rawA=`${sessA.d[t.id+'_raw']} ${t.unit||''}`;
        if(sessB.d[t.id+'_raw']) rawB=`${sessB.d[t.id+'_raw']} ${t.unit||''}`;
      }
      const showValA=valA!==null?`${Math.round(valA*10)/10}/3`:'—';
      const showValB=valB!==null?`${Math.round(valB*10)/10}/3`:'—';
      const floorA=valA!==null?Math.round(valA):null;
      const floorB=valB!==null?Math.round(valB):null;
      h+=`<tr>
        <td><div style="font-family:'Barlow',sans-serif;font-size:12px;font-weight:600;color:var(--text)">${t.name}</div>${rawA?`<div style="font-size:10px;color:var(--cyan)">${rawA}</div>`:''}</td>
        <td style="text-align:center"><span class="comp-score-dot" ${dotStyle(floorA)}>${showValA}</span></td>
        <td style="text-align:center">${delta(valA,valB)}</td>
        <td style="text-align:center"><span class="comp-score-dot" ${dotStyle(floorB)}>${showValB}</span>${rawB?`<div style="font-size:10px;color:var(--gold)">${rawB}</div>`:''}</td>
      </tr>`;
    });
  });
  h+=`</tbody></table></div>`;

  if(pA.id===pB.id && (pA.sessions||[]).length>=2){
    h+=`<div class="comp-evo-wrap">
      <div class="comp-evo-title">ÉVOLUTION DANS LE TEMPS — ${fmtName(pA.n,pA.pr)}</div>
      <canvas id="evoChart" height="120"></canvas>
    </div>`;
  }

  el.innerHTML=h;

  if(pA.id===pB.id && (pA.sessions||[]).length>=2){
    setTimeout(()=>{
      const canvas=document.getElementById('evoChart'); if(!canvas) return;
      const ctx=canvas.getContext('2d');
      const labels=(pA.sessions||[]).map((s,i)=>s.dt?new Date(s.dt).toLocaleDateString('fr-FR',{month:'short',year:'2-digit'}):`S${i+1}`);
      const scores=(pA.sessions||[]).map((_,i)=>calcScore(pA.id,i).t);
      const catScores={
        mob_inf:(pA.sessions||[]).map((_,i)=>{const sc=calcScore(pA.id,i);return sc.secs.mob_inf?Math.round(sc.secs.mob_inf.pts/sc.secs.mob_inf.max*100):0;}),
        stab:   (pA.sessions||[]).map((_,i)=>{const sc=calcScore(pA.id,i);return sc.secs.stab?Math.round(sc.secs.stab.pts/sc.secs.stab.max*100):0;}),
        fonc:   (pA.sessions||[]).map((_,i)=>{const sc=calcScore(pA.id,i);return sc.secs.fonc?Math.round(sc.secs.fonc.pts/sc.secs.fonc.max*100):0;}),
      };
      new Chart(ctx,{type:'line',data:{labels,datasets:[
        {label:'Score Global',data:scores,borderColor:'#00c8e6',backgroundColor:'rgba(0,200,230,.08)',tension:.3,pointBackgroundColor:'#00c8e6',pointRadius:4},
        {label:'Mobilité Inf.',data:catScores.mob_inf,borderColor:'#22c55e',backgroundColor:'transparent',tension:.3,pointRadius:3,borderDash:[4,3]},
        {label:'Stabilité',data:catScores.stab,borderColor:'#ef4444',backgroundColor:'transparent',tension:.3,pointRadius:3,borderDash:[4,3]},
        {label:'Fonctionnel',data:catScores.fonc,borderColor:'#f59e0b',backgroundColor:'transparent',tension:.3,pointRadius:3,borderDash:[4,3]},
      ]},options:{responsive:true,plugins:{legend:{labels:{color:'#9cb3d4',font:{size:10}}}},scales:{y:{min:0,max:100,ticks:{color:'#4d6a9a'},grid:{color:'rgba(255,255,255,.06)'}},x:{ticks:{color:'#4d6a9a'},grid:{color:'rgba(255,255,255,.04)'}}}}});
    },100);
  }
}

function renderCompEquipe(){
  document.getElementById('mainContent').innerHTML=`<div class="comp-wrap">
    <div class="comp-tabs">
      <button class="comp-tab" onclick="compTab='1v1';renderComp()">📊 Comparaison 1v1</button>
      <button class="comp-tab active" onclick="compTab='equipe';renderComp()">👥 Vue Équipe</button>
    </div>
    <div class="equipe-controls">
      <span class="equipe-filter-label">Filtrer :</span>
      <select class="comp-select" style="width:auto;min-width:160px" id="equipeFilterSel" onchange="equipeFilter=this.value;renderCompEquipe()">
        <option value="">Tous les postes</option>
        ${[...new Set(players.map(p=>p.pos||'').filter(Boolean))].sort().map(pos=>`<option value="${pos}" ${equipeFilter===pos?'selected':''}>${pos}</option>`).join('')}
      </select>
      <span class="equipe-filter-label" style="margin-left:12px">Trier :</span>
      <select class="comp-select" style="width:auto;min-width:140px" id="equipeSort" onchange="equipeSort=this.value;renderCompEquipe()">
        <option value="score" ${equipeSort==='score'?'selected':''}>Score global ↓</option>
        <option value="nom" ${equipeSort==='nom'?'selected':''}>Nom A→Z</option>
        <option value="poste" ${equipeSort==='poste'?'selected':''}>Poste A→Z</option>
      </select>
    </div>
    ${buildEquipeTable()}
  </div>`;
}

function buildEquipeTable(){
  let list=players.map(p=>({p,sc:calcScore(p.id,null),sess:getSess(p,null)}));
  if(equipeFilter) list=list.filter(x=>(x.p.pos||'')==equipeFilter);
  if(equipeSort==='nom') list.sort((a,b)=>a.p.n.localeCompare(b.p.n));
  else if(equipeSort==='poste') list.sort((a,b)=>(a.p.pos||'').localeCompare(b.p.pos||''));
  else list.sort((a,b)=>b.sc.t-a.sc.t);
  if(!list.length) return '<div class="empty-state"><div class="empty-icon">👥</div><div class="empty-title">Aucun joueur</div></div>';

  const catDefs=[{id:'mob_inf',l:'Mob.Inf'},{id:'mob_sup',l:'Mob.Sup'},{id:'stab',l:'Stab.'},{id:'fonc',l:'Fonc.'}];
  let h=`<div class="comp-score-block"><table class="comp-test-table" style="font-size:11px">
    <thead><tr>
      <th>#</th><th>Joueur</th><th>Poste</th><th>Date</th>
      ${catDefs.map(c=>`<th class="center">${c.l}</th>`).join('')}
      <th class="center">Global</th><th class="center">Séances</th>
    </tr></thead><tbody>`;
  list.forEach(({p,sc,sess},i)=>{
    const cls=sc.t>=70?'var(--green)':sc.t>=40?'var(--orange)':'var(--red)';
    const dt=sess.dt?new Date(sess.dt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'2-digit'}):'—';
    const nbSess=(p.sessions||[]).length;
    h+=`<tr onclick="cPid='${p.id}';cSessionIdx=null;showView('testing')" style="cursor:pointer">
      <td style="color:var(--text-3);font-family:'DM Mono',monospace">${i+1}</td>
      <td><div style="font-weight:700;color:var(--text)">${fmtName(p.n,p.pr)}</div></td>
      <td style="color:var(--text-3)">${p.pos||'—'}</td>
      <td style="color:var(--text-3)">${dt}</td>
      ${catDefs.map(c=>{
        const s=sc.secs[c.id]||{pts:0,max:1};
        const pct=Math.round(s.pts/s.max*100);
        const cc=pct>=70?'var(--green)':pct>=40?'var(--orange)':'var(--red)';
        return `<td style="text-align:center;font-family:'Bebas Neue',sans-serif;font-size:13px;color:${cc}">${s.filled>0?pct+'%':'—'}</td>`;
      }).join('')}
      <td style="text-align:center"><span style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:${cls}">${sc.t}%</span></td>
      <td style="text-align:center;color:var(--text-3)">${nbSess}</td>
    </tr>`;
  });
  h+=`</tbody></table></div>`;
  return h;
}

// ─── RÉCAPITULATIF ────────────────────────────────────────
function renderRecap(){
  document.getElementById('topbarTitle').textContent='RÉCAPITULATIF ÉQUIPE';
  document.getElementById('topbarMeta').textContent='Vue globale de l\'effectif';
  document.getElementById('topbarAvatar').innerHTML='FT';
  document.getElementById('topbarAvatar').classList.remove('has-photo');
  document.getElementById('dateChip').textContent=new Date().toLocaleDateString('fr-FR');
  if(!players.length){ document.getElementById('mainContent').innerHTML='<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-title">Aucun Joueur</div></div>'; return; }
  const sorted=[...players].map(p=>({...p,sc:calcScore(p.id,null)})).sort((a,b)=>b.sc.t-a.sc.t);
  let h=`<div class="test-section"><div class="section-header sh-mob" style="cursor:default">
    <span class="section-badge badge-mob">FENIX TOULOUSE</span>
    <span class="section-title">Classement Effectif — Score Global</span>
  </div><div class="section-body"><table class="test-table">
  <thead><tr><th>#</th><th>Joueur</th><th>Groupe</th><th class="center">Score</th><th class="center" style="color:var(--green)">●3</th><th class="center" style="color:var(--yellow)">●2</th><th class="center" style="color:var(--red)">●0-1</th><th class="center">Tests</th><th class="center">Blessures</th></tr></thead>
  <tbody>`;
  sorted.forEach((p,i)=>{
    const cls=p.sc.t>=70?'pill-green':p.sc.t>=40?'pill-orange':'pill-red';
    const nbInj=(p.injuries||[]).length;
    h+=`<tr class="test-row" onclick="selPlayer('${p.id}');showView('testing')" style="cursor:pointer">
      <td class="test-num">${i+1}</td>
      <td><div style="display:flex;align-items:center;gap:10px"><div class="player-avatar" style="width:32px;height:32px;font-size:12px">${ini(p.n,p.pr)}</div><div><div class="test-name">${fmtName(p.n,p.pr)}</div><div class="player-group">${p.pos||'—'}</div></div></div></td>
      <td><span style="font-size:12px;color:var(--text-3)">${p.gr||'—'}</span></td>
      <td class="center"><span class="player-score-pill ${cls}">${p.sc.t}%</span></td>
      <td class="center" style="color:var(--green);font-family:'Bebas Neue',sans-serif;font-size:16px">${p.sc.s3}</td>
      <td class="center" style="color:var(--yellow);font-family:'Bebas Neue',sans-serif;font-size:16px">${p.sc.s2}</td>
      <td class="center" style="color:var(--red);font-family:'Bebas Neue',sans-serif;font-size:16px">${p.sc.s1+p.sc.s0}</td>
      <td class="center" style="color:var(--text-3);font-size:12px">${p.sc.f}</td>
      <td class="center">${nbInj>0?`<span style="color:var(--red);font-family:'Bebas Neue',sans-serif;font-size:14px">🩹 ${nbInj}</span>`:'—'}</td>
    </tr>`;
  });
  h+=`</tbody></table></div></div>`;
  document.getElementById('mainContent').innerHTML=h;
}
