// Fenix Toulouse — ui/form-actions.js
// Interactions du formulaire et navigation.
// Ce fichier contient les clics, mises à jour et changements de vue.

// ─── INTERACTIONS ─────────────────────────────────────────
function togCrit(tid){
  openCrit[tid]=!openCrit[tid];
  const row=document.getElementById('crit_'+tid);
  const btn=document.getElementById('crtbtn_'+tid);
  if(row)row.classList.toggle('open',openCrit[tid]);
  if(btn){btn.classList.toggle('active',openCrit[tid]);btn.innerHTML=(openCrit[tid]?'▲':'📖')+' Critères';}
}
function togSec(id){
  secSt[id] = secSt[id]===false ? true : false;
  const b=document.getElementById('sec_'+id);
  if(b){
    b.classList.toggle('collapsed',!secSt[id]);
    const ch=b.previousElementSibling.querySelector('.section-chevron');
    if(ch) ch.classList.toggle('open',secSt[id]);
  }
}

function uScore(key,val,tid,isNote=false){
  if(!cPid) return;
  const p=players.find(x=>x.id===cPid); if(!p) return;
  const sess=getCurrSess(p);
  if(!sess.d) sess.d={};
  sess.d[key] = isNote ? val : parseInt(val);
  save();
  if(!isNote){
    updateScoreSummary();
    renderList();
    document.querySelectorAll(`button.sb[onclick*="'${key}'"]`).forEach(btn=>{
      btn.classList.remove('sel');
      if(btn.textContent==String(val)) btn.classList.add('sel');
    });
    updateSectionProgress(tid);
  }
}

function uRaw(scoreKey,rawKey,rawVal,tid){
  if(!cPid) return;
  const p=players.find(x=>x.id===cPid); if(!p) return;
  const sess=getCurrSess(p);
  if(!sess.d) sess.d={};
  sess.d[rawKey]=rawVal;
  let test=null; TESTS.forEach(s=>s.tests.forEach(t=>{if(t.id===tid)test=t;}));
  if(test&&test.auto){
    const autoS=test.auto(rawVal, sess);
    if(autoS!==null){
      sess.d[scoreKey]=autoS;
      document.querySelectorAll(`button.sb[onclick*="'${scoreKey}'"]`).forEach(btn=>{
        btn.classList.remove('sel');
        if(parseInt(btn.textContent)===autoS) btn.classList.add('sel');
      });
      updateScoreSummary(); updateSectionProgress(tid); renderList();
    }
  }
  save();
}

function updateScoreSummary(){
  if(!cPid) return;
  const p=players.find(x=>x.id===cPid); if(!p) return;
  const s=calcScore(cPid,getCurrSidx(p));
  const st=document.getElementById('sc_t'), s3=document.getElementById('sc_3'), s2=document.getElementById('sc_2'), s01=document.getElementById('sc_01');
  if(st) st.innerHTML=s.t+'<span style="font-size:22px">%</span>';
  if(s3) s3.textContent=s.s3; if(s2) s2.textContent=s.s2; if(s01) s01.textContent=s.s1+s.s0;
}

function updateSectionProgress(tid){
  if(!cPid) return;
  const p=players.find(x=>x.id===cPid); if(!p) return;
  const d=getCurrSess(p).d||{};
  let sec=null; TESTS.forEach(s=>{if(s.tests.find(t=>t.id===tid))sec=s;});
  if(!sec) return;
  const filled=sec.tests.reduce((a,t)=>a+((t.bilateral?[t.id+'_g',t.id+'_d']:[t.id]).filter(k=>d[k]!==null&&d[k]!==undefined&&d[k]!=='').length),0);
  const total=sec.tests.reduce((a,t)=>a+(t.bilateral?2:1),0);
  const pct=Math.round(filled/total*100);
  const secEl=document.getElementById('sec_'+sec.id);
  if(secEl){
    const fill=secEl.previousElementSibling.querySelector('.section-prog-fill');
    const txt=secEl.previousElementSibling.querySelector('.section-prog-text');
    if(fill) fill.style.width=pct+'%'; if(txt) txt.textContent=`${filled}/${total}`;
  }
}

const SESSION_FIELDS=new Set(['dt','ta','po',
  'pliPectoral','pliAxillaire','pliTriceps','pliSousScap','pliAbdomen','pliSupraIli','pliCuisse','pliBiceps',
  'formulePlis','mgPct',
  'tourCuisse','tourBras','tourTaille','tourBuste',
  'pliBiceps','pliTriceps','pliSousScap','pliSupraIli',
  'lgMainDom',
  'gn','aiPrevention']);
function uf(f,v){
  if(!cPid) return;
  const p=players.find(x=>x.id===cPid); if(!p) return;
  if(SESSION_FIELDS.has(f)){
    const sess=getCurrSess(p); sess[f]=v;
    if(f==='dt'){ const ds=v?new Date(v).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}):'—'; document.getElementById('dateChip').textContent=ds; renderList(); }
  } else {
    p[f]=v;
  }
  save(); renderList();
  if(f==='essai') renderForm(p);
}

function selPlayer(id){
  cPid=id; injFormOpen=false; cSessionIdx=null;
  renderList();
  const p=players.find(x=>x.id===id);
  const curView = window._currentView||'testing';
  if(p){
    if(curView==='rapport') renderRapport(p);
    else if(curView==='comp') renderComp();
    else renderForm(p);
  }
  const navBtns=document.querySelectorAll('.nav-btn');
  navBtns.forEach((b,i)=>b.classList.toggle('active',(curView==='testing'&&i===0)||(curView==='rapport'&&i===1)||(curView==='comp'&&i===2)||(curView==='recap'&&i===3)));
  document.getElementById('sidebar').classList.remove('mobile-open');
}

function showView(v){
  window._currentView=v;
  const navBtns=document.querySelectorAll('.nav-btn');
  navBtns.forEach((b,i)=>b.classList.toggle('active',(v==='testing'&&i===0)||(v==='rapport'&&i===1)||(v==='comp'&&i===2)||(v==='recap'&&i===3)));
  if(v==='recap'){ cPid=null; renderList(); renderRecap(); }
  else if(v==='comp'){ renderComp(); }
  else if(v==='rapport'){
    if(cPid){ const p=players.find(x=>x.id===cPid); if(p) renderRapport(p); }
    else { document.getElementById('mainContent').innerHTML='<div class="empty-state"><div class="empty-icon">📑</div><div class="empty-title">Sélectionnez un joueur</div><div class="empty-desc">Choisissez un joueur dans la barre latérale pour afficher son rapport.</div></div>'; }
  }
  else if(cPid){ const p=players.find(x=>x.id===cPid); if(p) renderForm(p); }
}
