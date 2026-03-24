// Fenix Toulouse — core/state.js
// État global, joueurs, sessions, migration données
// ─── STATE ────────────────────────────────────────────────
function _migrateToV3(p){
  if(p.sessions) return p;
  return {...p,sessions:[{sid:p.id+'_s0',dt:p.dt||'',ta:p.ta||'',po:p.po||'',
    pliBiceps:p.pliBiceps||'',pliTriceps:p.pliTriceps||'',pliSousScap:p.pliSousScap||'',
    pliSupraIli:p.pliSupraIli||'',mgPct:p.mgPct||'',bodyChart:p.bodyChart||{},
    d:p.d||{},gn:p.gn||'',aiPrevention:p.aiPrevention||''}]};
}
let players = [];
(function(){
  // 1. Charger v3
  try{ const v3=localStorage.getItem('ftph_v3'); if(v3) players=JSON.parse(v3)||[]; }catch(e){}

  // 2. TOUJOURS fusionner depuis v2 (même si v3 existe déjà)
  try{
    const v2raw=localStorage.getItem('ftph_v2');
    if(v2raw){
      const v2=JSON.parse(v2raw)||[];
      const existingIds=new Set(players.map(p=>p.id));
      const toAdd=v2.filter(p=>!existingIds.has(p.id)).map(_migrateToV3);
      if(toAdd.length){ players=[...players,...toAdd]; localStorage.setItem('ftph_v3',JSON.stringify(players)); }
    }
  }catch(e){}

  // 3. Fusionner depuis v1 si besoin
  try{
    const v1raw=localStorage.getItem('ftph_v1');
    if(v1raw){
      const v1=JSON.parse(v1raw)||[];
      const existingIds=new Set(players.map(p=>p.id));
      const toAdd=v1.filter(p=>!existingIds.has(p.id)).map(p=>{if(!p.d)p.d={};if(!p.injuries)p.injuries=[];return _migrateToV3(p);});
      if(toAdd.length){ players=[...players,...toAdd]; localStorage.setItem('ftph_v3',JSON.stringify(players)); }
    }
  }catch(e){}

  // 4. Seed démo si vraiment vide
  if(!players.length){
    players=[
      {id:'1735000000001',pr:'Isaac',n:'MAURICE',gr:'Fenix Toulouse',pos:'Ailier Gauche',ddn:'2008-11-10',essai:false,
       injuries:[{id:'1735000000002',date:'2021-12-01',zones:[{id:'pied_d',lvl:3}],desc:'Entorse de Chopart sur la cheville Droite',duration:''}],
       sessions:[
         {sid:'sess_im_1',dt:'2025-06-01',ta:'173',po:'75',pliBiceps:'',pliTriceps:'',pliSousScap:'',pliSupraIli:'',mgPct:'13.8',bodyChart:{pied_d:2},gn:'Bilan début de saison.\n- Restriction cheville D notable\n- Adducteurs à surveiller',aiPrevention:'',d:{t1_g:1,'t1_g_raw':'9',t1_d:1,'t1_d_raw':'8',t2_g:3,t2_d:3,t3_g:2,t3_d:2,t4_g:3,t4_d:3,t5:2,t6:2,'t6_raw':'36',t7_g:1,'t7_g_raw':'18',t7_d:1,'t7_d_raw':'20',t8_g:1,t8_d:1,t9:3,t10_g:2,'t10_g_raw':'3',t10_d:2,'t10_d_raw':'15',t11:2,t12:1,t13_g:2,t13_d:2,t14_g:0,'t14_g_raw':'24',t14_d:1,'t14_d_raw':'35',t15:3,t16:2,t17:2,t18:2,t19_g:1,'t19_g_raw':'38',t19_d:2,'t19_d_raw':'50',t20_g:1,t20_d:1}},
         {sid:'sess_im_2',dt:'2025-12-19',ta:'174',po:'76',pliBiceps:'',pliTriceps:'',pliSousScap:'',pliSupraIli:'',mgPct:'12.5',bodyChart:{pied_d:1},gn:'PROTOCOLE :\n- Manque de Mobilité sur la cheville D — PROTOCOLE DE MOBILITÉ CHEVILLE\n- Manque de Force sur les adducteurs — PROTOCOLE PUBALGIE',aiPrevention:'',d:{t1_g:2,'t1_g_raw':'11',t1_d:1,'t1_d_raw':'8.5',t2_g:3,t2_d:3,t3_g:3,t3_d:3,t4_g:3,t4_d:3,t5:3,t6:3,'t6_raw':'42',t7_g:2,'t7_g_raw':'22',t7_d:2,'t7_d_raw':'23',t8_g:1,t8_d:2,t9:3,t10_g:3,'t10_g_raw':'3.5',t10_d:3,'t10_d_raw':'17',t11:3,t12:2,t13_g:2,t13_d:2,t14_g:1,'t14_g_raw':'30',t14_d:1,'t14_d_raw':'39',t15:3,t16:3,t17:2,'t17_nt':'Manque mobilité Cheville',t18:3,t19_g:2,'t19_g_raw':'55',t19_d:3,t20_g:2,t20_d:1}}
       ]},
      {id:'1735000000010',pr:'Gabriel',n:'MARCHIS',gr:'Fenix Toulouse',pos:'Gardien',ddn:'',essai:false,
       injuries:[{id:'1735000000011',date:'2024-08-01',zones:[{id:'genou_gb',lvl:2}],desc:'Contracture Poplité Gauche',duration:''},{id:'1735000000012',date:'2024-09-01',zones:[{id:'quad_d',lvl:2},{id:'quad_g',lvl:1}],desc:'Tendinopathie du Tendon Quadricipital',duration:'Saison 2024/2025'}],
       sessions:[{sid:'sess_gm_1',dt:'2025-07-21',ta:'194',po:'100.5',pliBiceps:'',pliTriceps:'',pliSousScap:'',pliSupraIli:'',mgPct:'22.6',bodyChart:{genou_gb:2,quad_d:2,quad_g:1,pied_g:1},gn:'PROTOCOLE :\n- Manque de Souplesse sur la chaîne antérieure — PROTOCOLE SOUPLESSE CHAÎNE ANTÉRIEURE\n- Manque de Force sur les muscles de la cuisse — PROTOCOLE DE RENFORCEMENT CHAÎNE ANTÉRIEURE ET POSTÉRIEURE\n- Manque de Stabilité Cheville Gauche — PROTOCOLE STABILITÉ CHEVILLE',aiPrevention:'',d:{t1_g:3,'t1_g_raw':'18.5',t1_d:3,'t1_d_raw':'16',t2_g:3,t2_d:3,t3_g:1,t3_d:2,t4_g:3,t4_d:3,t5:2,t6:3,'t6_raw':'37',t7_g:2,'t7_g_raw':'26',t7_d:3,'t7_d_raw':'37',t8_g:3,t8_d:3,t9:3,t10_g:3,'t10_g_raw':'12',t10_d:1,'t10_d_raw':'26',t11:2,t12:1,t13_g:2,t13_d:2,t14_g:3,t14_d:2,t15:3,t16:3,t17:3,t18:2,t19_g:2,'t19_g_raw':'53',t19_d:0,'t19_d_raw':'6',t20_g:2,t20_d:2}}]}
    ];
    localStorage.setItem('ftph_v3',JSON.stringify(players));
  }
})();

let cPid = null;
let cSessionIdx = null; // null = dernière session
let secSt = {mob_inf:true, mob_sup:true, stab:true, fonc:true, injury:true};
let injFormOpen = false;
let _injEditIdx = null; // null = création, number = édition
let bodyChartView = 'f';
let openCrit = {};
let compPidA=null,compSidxA=null,compPidB=null,compSidxB=null;
let compTab='1v1',equipeFilter='',equipeSort='score';

document.getElementById('mDate').value = new Date().toISOString().split('T')[0];

// ─── SESSIONS HELPERS ─────────────────────────────────────
function getSess(p,idx){if(!p||!p.sessions||!p.sessions.length)return{d:{},bodyChart:{}};const i=(idx!==null&&idx!==undefined)?idx:p.sessions.length-1;return p.sessions[Math.min(Math.max(i,0),p.sessions.length-1)];}
function getCurrSess(p){return getSess(p,cSessionIdx);}
function getCurrSidx(p){return cSessionIdx!==null?Math.min(cSessionIdx,p.sessions.length-1):p.sessions.length-1;}
function newSession(pid){const p=players.find(x=>x.id===pid);if(!p)return;const last=getCurrSess(p);const sess={sid:Date.now().toString(),dt:new Date().toISOString().split('T')[0],ta:last.ta||'',po:last.po||'',pliBiceps:'',pliTriceps:'',pliSousScap:'',pliSupraIli:'',mgPct:last.mgPct||'',bodyChart:{},d:{},gn:'',aiPrevention:''};p.sessions.push(sess);cSessionIdx=p.sessions.length-1;save();renderList();renderForm(p);}
function selSession(pid,idx){cSessionIdx=idx;const p=players.find(x=>x.id===pid);if(!p)return;renderForm(p);}
function delSession(pid,idx){
  const p=players.find(x=>x.id===pid);
  if(!p||p.sessions.length<=1){ alert('Impossible de supprimer la seule session.'); return; }
  // Confirmation inline — évite le blocage de confirm() sur fichier local
  const btn=event.currentTarget;
  if(btn._confirmPending){
    clearTimeout(btn._confirmTimer);
    p.sessions.splice(idx,1);
    cSessionIdx=Math.max(0,p.sessions.length-1);
    save(); renderList(); renderForm(p);
  } else {
    btn._confirmPending=true;
    const orig=btn.innerHTML;
    btn.innerHTML='❓ Confirmer ?';
    btn.style.background='var(--red)';
    btn.style.color='#fff';
    btn.style.borderColor='var(--red)';
    btn._confirmTimer=setTimeout(()=>{
      btn._confirmPending=false;
      btn.innerHTML=orig;
      btn.style.background='none';
      btn.style.color='var(--red)';
      btn.style.borderColor='var(--red-border)';
    },3000);
  }
}
