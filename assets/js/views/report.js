// Fenix Toulouse — report.js
// Extrait de app.js (lignes 2187-2965)
// ─── RAPPORT ATHLÈTE ──────────────────────────────────────
function gaugeArc(pct, size, stroke, colorCls){
  const r = (size-stroke)/2;
  const cx = size/2, cy = size/2;
  const circ = 2*Math.PI*r;
  const arc = circ * 0.75; // 270° arc
  const filled = arc * (pct/100);
  const color = pct>=70?'var(--green)':pct>=40?'var(--orange)':'var(--red)';
  // Rotation: start at -225deg (bottom-left)
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border-2)" stroke-width="${stroke}"
      stroke-dasharray="${arc} ${circ-arc}"
      stroke-dashoffset="0"
      stroke-linecap="round"
      transform="rotate(135 ${cx} ${cy})"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
      stroke-dasharray="${filled} ${circ-filled}"
      stroke-dashoffset="0"
      stroke-linecap="round"
      transform="rotate(135 ${cx} ${cy})"
      style="filter:drop-shadow(0 0 6px ${color})"/>
    <text x="${cx}" y="${cy+4}" text-anchor="middle"
      font-family="'Bebas Neue',sans-serif" font-size="${size*0.22}" fill="${color}" letter-spacing="1">${pct}%</text>
    <text x="${cx}" y="${cy+size*0.2}" text-anchor="middle"
      font-family="'Barlow Condensed',sans-serif" font-size="${size*0.09}" fill="var(--text-3)" letter-spacing="1">SCORE</text>
  </svg>`;
}

function rptBarRow(name, desc, score, maxScore, bilateral){
  if(score===null) return '';
  const pct = Math.round(score/maxScore*100);
  const cls = score>=maxScore*0.9?'c3':score>=maxScore*0.6?'c2':score>=maxScore*0.3?'c1':'c0';
  const valStr = bilateral ? (score%1===0?score:score.toFixed(1)) : score;
  return `<div class="rpt-test-row">
    <div class="rpt-test-name">${name}${desc?`<span>${desc}</span>`:''}  </div>
    <div class="rpt-bar-wrap">
      <div class="rpt-bar-track"><div class="rpt-bar-fill ${cls}" style="width:${pct}%"></div></div>
      <div class="rpt-bar-val ${cls}">${valStr}<span style="font-size:9px;opacity:.6">/${maxScore}</span></div>
    </div>
  </div>`;
}

function rptBilateralRow(name, desc, scoreG, scoreD){
  if(scoreG===null && scoreD===null) return '';
  const row = (side, val) => {
    if(val===null) return '';
    const cls = val===3?'c3':val===2?'c2':val===1?'c1':'c0';
    const pct = Math.round(val/3*100);
    return `<div class="rpt-bar-sub-row">
      <div class="rpt-bar-side-label">${side}</div>
      <div class="rpt-bar-track" style="flex:1"><div class="rpt-bar-fill ${cls}" style="width:${pct}%"></div></div>
      <div class="rpt-bar-val ${cls}" style="font-size:12px">${val}<span style="font-size:9px;opacity:.6">/3</span></div>
    </div>`;
  };
  return `<div class="rpt-test-row">
    <div class="rpt-test-name">${name}${desc?`<span>${desc}</span>`:''}  </div>
    <div class="rpt-bar-bilateral">
      ${row('G', scoreG)}
      ${row('D', scoreD)}
    </div>
  </div>`;
}

function buildRptBodySVG(p){
  const bc = p.bodyChart||{};
  const hasPain = Object.values(bc).some(v=>v>0);
  // Static mini body silhouettes with colored zones
  const col = id => {
    const lvl = bc[id]||0;
    if(lvl===0) return 'rgba(255,255,255,0.04)';
    if(lvl===1) return 'rgba(245,158,11,0.6)';
    if(lvl===2) return 'rgba(239,68,68,0.7)';
    return 'rgba(239,68,68,0.9)';
  };

  const svgF = `<svg viewBox="0 0 768 1024" xmlns="http://www.w3.org/2000/svg" style="width:110px;height:147px">
    <circle cx="384" cy="132" r="90" fill="${col('tete')}"/>
    <path d="M308,260 C308,240 340,222 384,222 C428,222 460,240 460,260 L468,320 L300,320Z" fill="${col('cou')}"/>
    <path d="M300,320 L176,380 L168,440 L212,460 L300,380 L360,340Z" fill="${col('epaule_d')}"/>
    <path d="M468,320 L592,380 L600,440 L556,460 L468,380 L408,340Z" fill="${col('epaule_g')}"/>
    <path d="M298,392 C270,416 264,448 278,468 C314,472 346,430 342,416Z" fill="${col('pec_d')}"/>
    <path d="M470,392 C498,416 504,448 490,468 C454,472 422,430 426,416Z" fill="${col('pec_g')}"/>
    <path d="M300,478 C286,506 288,538 310,558 L384,562 L458,558 C478,538 480,506 468,478 C450,470 418,466 384,466 C350,466 318,470 300,478Z" fill="${col('abdo_h')}"/>
    <path d="M292,564 C282,596 284,628 310,650 L384,654 L458,650 C482,628 484,596 476,564 L384,566Z" fill="${col('abdo_b')}"/>
    <path d="M236,424 C214,454 214,490 232,514 C250,490 256,452 248,422Z" fill="${col('biceps_d')}"/>
    <path d="M532,424 C554,454 554,490 536,514 C518,490 512,452 520,422Z" fill="${col('biceps_g')}"/>
    <path d="M286,654 C262,680 262,710 280,728 L342,732 L340,656Z" fill="${col('hanche_d')}"/>
    <path d="M482,654 C506,680 506,710 488,728 L426,732 L428,656Z" fill="${col('hanche_g')}"/>
    <path d="M304,730 C286,760 284,800 290,840 C310,848 330,842 344,828 L348,730Z" fill="${col('quad_d')}"/>
    <path d="M464,730 C482,760 484,800 478,840 C458,848 438,842 424,828 L420,730Z" fill="${col('quad_g')}"/>
    <path d="M290,844 C282,876 284,908 294,930 C310,940 330,936 342,922 L348,840Z" fill="${col('genou_d')}"/>
    <path d="M478,844 C486,876 484,908 474,930 C458,940 438,936 426,922 L420,840Z" fill="${col('genou_g')}"/>
    <path d="M294,934 C284,964 284,996 294,1016 L348,1016 L348,930Z" fill="${col('tibia_d')}"/>
    <path d="M474,934 C484,964 484,996 474,1016 L420,1016 L420,930Z" fill="${col('tibia_g')}"/>
  </svg>`;

  const svgB = `<svg viewBox="0 0 768 1024" xmlns="http://www.w3.org/2000/svg" style="width:110px;height:147px">
    <circle cx="384" cy="132" r="90" fill="${col('tete_b')}"/>
    <path d="M308,260 C308,240 340,222 384,222 C428,222 460,240 460,260 L468,320 L300,320Z" fill="${col('nuque')}"/>
    <path d="M300,320 L176,380 L168,440 L212,460 L300,380 L360,340Z" fill="${col('trap_d')}"/>
    <path d="M468,320 L592,380 L600,440 L556,460 L468,380 L408,340Z" fill="${col('trap_g')}"/>
    <path d="M298,350 L360,340 L408,340 L468,350 L460,490 L384,510 L308,490Z" fill="${col('scapula_d')}"/>
    <path d="M308,510 L384,530 L460,510 L450,620 L384,640 L318,620Z" fill="${col('lombaire_d')}"/>
    <path d="M304,730 C286,760 284,800 290,840 L348,840 L348,730Z" fill="${col('ischio_d')}"/>
    <path d="M464,730 C482,760 484,800 478,840 L420,840 L420,730Z" fill="${col('ischio_g')}"/>
    <path d="M286,654 C262,680 262,710 280,728 L342,732 L340,656Z" fill="${col('fess_d')}"/>
    <path d="M482,654 C506,680 506,710 488,728 L426,732 L428,656Z" fill="${col('fess_g')}"/>
    <path d="M294,844 C284,876 286,910 296,932 L348,930 L348,840Z" fill="${col('mollet_d')}"/>
    <path d="M474,844 C484,876 482,910 472,932 L420,930 L420,840Z" fill="${col('mollet_g')}"/>
    <path d="M294,934 C284,964 284,996 294,1016 L348,1016 L348,930Z" fill="${col('talon_d')}"/>
    <path d="M474,934 C484,964 484,996 474,1016 L420,1016 L420,930Z" fill="${col('talon_g')}"/>
  </svg>`;

  // Zone legend
  const zones = Object.entries(bc).filter(([,lvl])=>lvl>0)
    .sort(([,a],[,b])=>b-a)
    .map(([zid,lvl])=>{
      const m = ZONES_META2[zid];
      if(!m) return '';
      const label = lvl===1?'Gêne':lvl===2?'Douleur':'Vive douleur';
      return `<div class="rpt-zone-item lv${lvl}">
        <div class="rpt-zone-dot"></div>
        <span style="flex:1">${m.l}</span>
        <span style="font-size:10px;opacity:.7">${label}</span>
      </div>`;
    }).join('');

  return {svgF, svgB, zones, hasPain};
}

// ─── BODY CHART READ-ONLY POUR RAPPORT ───────────────────
// Réutilise buildBodySVG() de bodychart.js (ZONES_META2 / bz2 classes)
// en mode lecture seule : les deux vues face+dos rendues simultanément.
function buildReportBodySVGs(p, w) {
  w = w || 90;
  const h = Math.round(w * 1024 / 768);
  // Sauvegarder la vue courante et forcer 'f' pour que les deux SVGs soient générés
  const saved = typeof bodyChartView !== 'undefined' ? bodyChartView : 'f';
  bodyChartView = 'f';
  const svgs = buildBodySVG(p);
  bodyChartView = saved;
  // Post-traitement : rendre les deux visibles, ajuster la taille, éviter les conflits d'ID
  const uid = Math.random().toString(36).slice(2, 7);
  const process = (svg) =>
    svg.replace('id="bc-front"', 'id="rpt-bc-front-' + uid + '"')
       .replace('id="bc-back"',  'id="rpt-bc-back-' + uid + '"')
       .replace('display:none',   'display:block')
       .replace('width:200px',    'width:' + w + 'px')
       .replace('height:267px',   'height:' + h + 'px');
  return { front: process(svgs.front), back: process(svgs.back) };
}

function renderRapport(_p){
  window._currentView='rapport';
  const sidx = getCurrSidx(_p);
  const sess = getSess(_p, sidx);
  const p = { ..._p, ...sess, d:sess.d||{}, bodyChart:sess.bodyChart||{} };
  const sc  = calcScore(_p.id, sidx);
  const age = _p.ddn ? Math.floor((Date.now()-new Date(_p.ddn))/(365.25*24*3600*1000)) : null;
  const ds  = p.dt  ? new Date(p.dt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—';
  const morpho = buildProfilMorpho(p, sc);

  // Topbar
  document.getElementById('topbarTitle').textContent = (_p.pr+' '+_p.n).toUpperCase()+' — RAPPORT';
  document.getElementById('topbarMeta').textContent  = (_p.gr||'')+(_p.pos?' — '+_p.pos:'');
  document.getElementById('dateChip').textContent    = ds;
  const tb=document.getElementById('topbarAvatar');
  const fpos=_p.facePos?`${_p.facePos.x}% ${_p.facePos.y}%`:'50% 25%';
  if(_p.photo){tb.innerHTML=`<img src="${_p.photo}" alt="${_p.pr}" style="object-position:${fpos}">`;tb.classList.add('has-photo');}
  else{tb.innerHTML=ini(_p.n,_p.pr);tb.classList.remove('has-photo');}

  // Helpers
  const gs=(id,side)=>{const k=side?id+'_'+side:id;const v=p.d[k];return(v!==null&&v!==undefined&&v!=='')?parseInt(v):null;};
  const raw=(id,side)=>p.d[id+(side?'_'+side:'')+'_raw']||null;
  const scColor=s=>s===3?'var(--green)':s===2?'#eab308':s===1?'var(--orange)':'var(--red)';
  const scBg=s=>s===3?'var(--green-dim)':s===2?'rgba(234,179,8,.12)':s===1?'var(--orange-dim)':'var(--red-dim)';
  const scBorder=s=>s===3?'var(--green-border)':s===2?'rgba(234,179,8,.3)':s===1?'var(--orange-border)':'var(--red-border)';

  const scoreLvl=sc.t>=70?{c:'var(--green)',l:'Excellent'}
    :sc.t>=60?{c:'#eab308',l:'Très bon'}
    :sc.t>=50?{c:'var(--cyan)',l:'Bon'}
    :sc.t>=40?{c:'var(--orange)',l:'Correct — déficits ciblés'}
    :{c:'var(--red)',l:'Risque élevé'};

  // ── Commentaires catégories ───────────────────────────────
  function catComment(id, pct){
    if(id==='mob_inf'){
      const ank=Math.min(gs('t1','g')??3,gs('t1','d')??3);
      if(pct>=85) return 'Excellente mobilité globale — aucun déficit notable.';
      if(pct>=65) return ank<=1?'Bonne mobilité globale. Légère restriction de dorsiflexion à corriger.':'Bonne mobilité générale avec quelques ajustements possibles.';
      return ank<=1?'Mobilité à travailler — restriction de dorsiflexion prioritaire.':'Déficits de mobilité inférieure identifiés.';
    }
    if(id==='mob_sup'){
      const g10=gs('t10','g'),d10=gs('t10','d');
      const asym=(g10!==null&&d10!==null)?Math.abs(g10-d10):0;
      if(asym>=2) return `Asymétrie Shoulder FMS (G:${g10}/3 — D:${d10}/3) — risque surcharge tendineuse côté déficitaire.`;
      if(pct>=80) return 'Bonne mobilité des membres supérieurs, symétrie satisfaisante.';
      return 'Mobilité des membres supérieurs à optimiser, notamment en rotation.';
    }
    if(id==='stab'){
      const nor=gs('t12',null),cpMin=Math.min(gs('t14','g')??3,gs('t14','d')??3);
      let t=pct>=75?'Bonne stabilité articulaire.':pct>=50?'Stabilité correcte avec déficits ciblés.':'Déficits de stabilité — priorité de travail.';
      if(nor!==null&&nor<=1) t+=' Force excentrique ischio-jambiers insuffisante (Nordic).';
      if(cpMin<=1) t+=' Faiblesse adducteurs au Copenhagen Plank.';
      return t;
    }
    if(id==='fonc'){
      const ud=gs('t19','d'),vd=gs('t20','d');
      let t=pct>=80?'Bon profil fonctionnel.':pct>=55?'Profil fonctionnel correct — points à améliorer.':'Profil fonctionnel à renforcer.';
      if(ud!==null&&ud<=1) t+=' Instabilité unipodale marquée côté droit.';
      if(vd!==null&&vd<=1) t+=' Contrôle du valgus insuffisant à droite — surveiller LCA.';
      return t;
    }
    return '';
  }

  // ── Analyse risques automatique ───────────────────────────
  function buildRisks(){
    const risks=[];
    // Cheville
    const a1g=gs('t1','g'),a1d=gs('t1','d');
    if((a1g!==null&&a1g<=1)||(a1d!==null&&a1d<=1)){
      const z=a1d!==null&&a1d<=(a1g??3)?'droite':'gauche';
      risks.push({lvl:'danger',zone:'Cheville '+z,icon:'🦶',
        desc:`Dorsiflexion réduite côté ${z}${raw('t1',z==='gauche'?'g':'d')?' ('+raw('t1',z==='gauche'?'g':'d')+' cm)':''} — risque entorse récidivante, compensation genou/hanche.`,
        travail:'Mobilisation quotidienne (lunge wall 3×30s), renforcement excentrique mollet, proprioception unipodale.'});
    }
    // Stabilité unipodale
    const u19g=gs('t19','g'),u19d=gs('t19','d');
    if((u19g!==null&&u19g<=1)||(u19d!==null&&u19d<=1)){
      const side=u19d!==null&&u19d<=(u19g??3)?'droit':'gauche';
      risks.push({lvl:'danger',zone:'Stabilité unipodale '+side,icon:'⚖️',
        desc:`Score ${side==='droit'?u19d:u19g}/3${raw('t19',side==='droit'?'d':'g')?' — '+raw('t19',side==='droit'?'d':'g')+'s':''} — déficit proprioceptif majeur.`,
        travail:'Travail unipodale sur plan instable (3×30s), star excursion, hop test progressif.'});
    }
    // Nordic / ischio
    const nor=gs('t12',null);
    if(nor!==null&&nor<=1) risks.push({lvl:'warning',zone:'Ischio-jambiers',icon:'💪',
      desc:`Nordic Hamstring : ${nor}/3 — force excentrique insuffisante, 1er facteur de claquage.`,
      travail:'Nordic progressif 2×/sem (5 reps +1/sem sur 8 sem), hip hinge excentrique, pont fessier unilatéral.'});
    // Copenhagen
    const cpg=gs('t14','g'),cpd=gs('t14','d');
    const cpMin=(cpg!==null&&cpd!==null)?Math.min(cpg,cpd):cpg??cpd??null;
    if(cpMin!==null&&cpMin<=1) risks.push({lvl:'warning',zone:'Adducteurs',icon:'⚡',
      desc:`Copenhagen Plank G:${cpg??'—'}/3 D:${cpd??'—'}/3${raw('t14','g')?' (G:'+raw('t14','g')+'s':''}${raw('t14','d')?', D:'+raw('t14','d')+'s)':''} — risque pubalgie / groin pain.`,
      travail:'Copenhagen progressif 2×/sem, adductions élastiques en chaîne fermée 3×15, excentrique adducteurs assis.'});
    // Drop Valgus
    const v20g=gs('t20','g'),v20d=gs('t20','d');
    const vMin=(v20g!==null&&v20d!==null)?Math.min(v20g,v20d):v20g??v20d??null;
    if(vMin!==null&&vMin<=1) risks.push({lvl:'danger',zone:'Contrôle valgus genou',icon:'🦵',
      desc:`Drop Valgus G:${v20g??'—'}/3 D:${v20d??'—'}/3 — risque LCA, mécanisme principal en handball.`,
      travail:'Renforcement fessier moyen (clamshells 3×20), squat unipodal miroir, réception 2 jambes → 1 jambe.'});
    // Shoulder FMS asymétrie
    const s10g=gs('t10','g'),s10d=gs('t10','d');
    if(s10g!==null&&s10d!==null&&Math.abs(s10g-s10d)>=2) risks.push({lvl:'warning',zone:'Épaule — asymétrie',icon:'🤾',
      desc:`Shoulder FMS G:${s10g}/3 D:${s10d}/3 — asymétrie ${Math.abs(s10g-s10d)} pts, risque surcharge côté déficitaire.`,
      travail:'Sleeper stretch côté déficitaire 3×30s, mobilisation capsule postérieure, renforcement RE/RI (ratio ≥65%).'});
    // Antécédents actifs
    (p.injuries||[]).forEach(inj=>{
      const d=inj.date?new Date(inj.date):null;
      const yr=d?Math.floor((Date.now()-d)/31557600000):null;
      if(yr!==null&&yr<=2) risks.push({lvl:'warning',zone:'Antécédent récent',icon:'🩹',
        desc:`${inj.desc||'Blessure'} ${d?'('+d.toLocaleDateString('fr-FR',{month:'short',year:'numeric'})+')':''} — surveiller les zones associées.`,
        travail:'Maintenir le protocole préventif spécifique. Réévaluer à chaque testing.'});
    });
    if(!risks.length) risks.push({lvl:'ok',zone:'Profil sain',icon:'✅',
      desc:'Aucun risque majeur identifié. Profil fonctionnel globalement satisfaisant.',travail:'Maintenir un programme d\'entretien préventif hebdomadaire.'});
    return risks;
  }

  // ── Body chart read-only : fusion bodyChart session + zones blessures ────
  const sessionChart = p.bodyChart||{};
  const mergedChart = Object.assign({}, sessionChart);
  const injZoneIds = new Set();
  (_p.injuries||[]).forEach(inj=>{
    (inj.zones||[]).forEach(z=>{
      if(!z.id) return;
      if(sessionChart[z.id]){
        // Zone aussi dans la session → garder la couleur de douleur active
        mergedChart[z.id] = Math.max(mergedChart[z.id]||0, z.lvl);
      } else {
        // Zone uniquement dans l'antécédent → rouge pointillé
        injZoneIds.add(z.id);
      }
    });
  });
  const rptBM2 = buildBM2ReadOnlySVG({...p, bodyChart: mergedChart}, 420, injZoneIds);

  const avInner=p.photo?`<img src="${p.photo}" alt="${p.pr}" style="object-position:${fpos}">`:(p.essai?ghostSVG(52):ini(p.n,p.pr));
  const risks=buildRisks();
  const hasPainZones=Object.values(mergedChart).some(v=>v>0)||injZoneIds.size>0;

  // ── 4 catégories pills ────────────────────────────────────
  const catPills=[
    {id:'mob_inf',label:'Mob. Inf.',  color:'var(--cyan)'},
    {id:'mob_sup',label:'Mob. Sup.',  color:'var(--cyan)'},
    {id:'stab',   label:'Stabilité', color:'var(--red)'},
    {id:'fonc',   label:'Fonctionnel',color:'var(--green)'},
  ];

  let h=`<div class="rapport-wrap" id="rapportContent">

  <!-- ══ HEADER ══ -->
  <div style="display:flex;align-items:flex-start;gap:18px;padding:20px 22px 16px;
    background:linear-gradient(135deg,var(--navy-3),var(--navy-2));
    border:1px solid var(--border);border-radius:var(--radius-lg);margin-bottom:12px;
    position:relative;overflow:hidden">
    <div style="position:absolute;top:0;right:0;font-family:'Bebas Neue',sans-serif;
      font-size:110px;letter-spacing:6px;color:rgba(0,200,230,.04);line-height:1;pointer-events:none;
      transform:translateY(-10px)">FENIX</div>
    <div style="position:absolute;bottom:0;left:0;right:0;height:2px;
      background:linear-gradient(to right,var(--cyan),transparent)"></div>

    <!-- Avatar -->
    <div style="width:72px;height:72px;border-radius:50%;flex-shrink:0;
      background:linear-gradient(135deg,var(--cyan),#0070a0);
      display:flex;align-items:center;justify-content:center;
      font-family:'Bebas Neue',sans-serif;font-size:24px;color:var(--navy);
      box-shadow:0 0 20px rgba(0,200,230,.25);border:2px solid rgba(0,200,230,.2);
      overflow:hidden;position:relative">${avInner}</div>

    <!-- Identité -->
    <div style="flex:1">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:3px;
        color:var(--text);line-height:1">${p.pr} ${p.n}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;
        letter-spacing:1.5px;color:var(--cyan);text-transform:uppercase;margin-bottom:8px">
        ${p.gr||'Fenix Toulouse'}${p.pos?' · '+p.pos:''}</div>
      <!-- Chips anthropo -->
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${p.ta?`<span style="background:var(--navy-4);border:1px solid var(--border-2);border-radius:5px;padding:3px 10px;font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1px;color:var(--text-2)">📏 ${p.ta} cm</span>`:''}
        ${p.po?`<span style="background:var(--navy-4);border:1px solid var(--border-2);border-radius:5px;padding:3px 10px;font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1px;color:var(--text-2)">⚖️ ${p.po} kg</span>`:''}
        ${morpho.imcVal?`<span style="background:var(--navy-4);border:1px solid var(--border-2);border-radius:5px;padding:3px 10px;font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1px;color:${morpho.imcColor}">IMC ${morpho.imcVal} — ${morpho.imcLabel}</span>`:''}
        ${!isNaN(morpho.mg)?`<span style="background:var(--navy-4);border:1px solid var(--border-2);border-radius:5px;padding:3px 10px;font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1px;color:${morpho.mgColor}">🔬 ${morpho.mg}% MG — ${morpho.mgLabel}</span>`:''}
        ${age?`<span style="background:var(--navy-4);border:1px solid var(--border-2);border-radius:5px;padding:3px 10px;font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1px;color:var(--text-3)">🎂 ${age} ans</span>`:''}
        <span style="background:var(--navy-4);border:1px solid var(--border-2);border-radius:5px;padding:3px 10px;font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:1px;color:var(--text-3)">📅 ${ds}</span>
      </div>
    </div>

    <!-- Score global + archétype -->
    <div style="text-align:center;flex-shrink:0">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;letter-spacing:2px;
        color:${scoreLvl.c};line-height:1;text-shadow:0 0 20px ${scoreLvl.c}40">${sc.t}%</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:2px;
        color:${scoreLvl.c};margin-bottom:4px">${scoreLvl.l}</div>

      <!-- Archétype mini -->
      <div style="margin-top:8px;background:var(--navy-3);border:1px solid var(--border);
        border-radius:7px;padding:6px 10px;font-size:11px;color:var(--text-2);
        font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px;max-width:140px">
        ${morpho.archetype.icon} ${morpho.archetype.name}
      </div>
      <!-- Boutons -->
      <div style="display:flex;gap:6px;margin-top:8px;justify-content:center" class="rpt-actions">
        <button class="btn btn-cyan" onclick="exportRapportPDF()" style="font-size:11px;padding:6px 12px">📄 PDF</button>
        <button class="btn btn-outline" onclick="shareRapportPDF()" style="font-size:11px;padding:6px 12px">📤 Envoyer</button>
      </div>
    </div>
  </div>

  <!-- ══ LIGNE 2 : ANALYSE PAR CATÉGORIE + CORPS ══ -->
  <!-- Écran : catégories à gauche, corps à droite -->
  <div id="rpt-screen-row2" style="display:grid;grid-template-columns:1fr auto;gap:12px;margin-bottom:12px">

    <!-- Bloc catégories écran -->
    <div style="background:var(--navy-2);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden">
      <div style="padding:10px 16px;background:var(--navy-3);border-bottom:1px solid var(--border);
        display:flex;align-items:center;gap:8px;position:relative">
        <div style="position:absolute;bottom:0;left:0;right:0;height:2px;
          background:linear-gradient(to right,var(--gold),transparent)"></div>
        <span class="section-badge badge-puiss">② ANALYSE</span>
        <span style="font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:2px;color:var(--text)">Évaluation par Catégorie</span>
      </div>
      <div style="padding:12px 16px;display:flex;flex-direction:column;gap:10px">`;

  const catMeta={
    mob_inf:{label:'Mobilité Membre Inférieur',icon:'🦵',color:'var(--cyan)'},
    mob_sup:{label:'Mobilité Membre Supérieur',icon:'💪',color:'var(--cyan)'},
    stab:   {label:'Stabilité Articulaire',     icon:'⚙️',color:'var(--red)'},
    fonc:   {label:'Fonctionnel',               icon:'🎯',color:'var(--green)'},
  };

  TESTS.forEach(sec=>{
    const s=sc.secs[sec.id];
    if(!s||s.filled===0)return;
    const pct=Math.round(s.pts/s.max*100);
    const c=pct>=70?'var(--green)':pct>=40?'var(--orange)':'var(--red)';
    const cm=catMeta[sec.id]||{label:sec.title,icon:'📋',color:'var(--cyan)'};
    h+=`<div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
        <span style="font-size:14px">${cm.icon}</span>
        <span style="font-family:'Barlow',sans-serif;font-size:12px;font-weight:700;color:var(--text);flex:1">${cm.label}</span>
        <span style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;color:${c}">${pct}%</span>
        <span style="font-family:'DM Mono',monospace;font-size:10px;color:var(--text-3)">${Math.round(s.pts*10)/10}/${s.max}</span>
      </div>
      <div style="height:6px;background:var(--border-2);border-radius:3px;overflow:hidden;margin-bottom:4px">
        <div style="height:100%;width:${pct}%;background:${c};border-radius:3px;
          box-shadow:${pct>=70?'0 0 6px '+c:'none'};transition:width .4s"></div>
      </div>
      <div style="font-size:11px;color:var(--text-3);line-height:1.5">${catComment(sec.id,pct)}</div>
    </div>`;
  });

  h+=`</div></div>

    <!-- Bloc corps écran -->
    <div style="background:var(--navy-2);border:1px solid var(--border);border-radius:var(--radius-lg);
      overflow:hidden;min-width:440px">
      <div style="padding:10px 16px;background:var(--navy-3);border-bottom:1px solid var(--border);
        position:relative">
        <div style="position:absolute;bottom:0;left:0;right:0;height:2px;
          background:linear-gradient(to right,var(--orange),transparent)"></div>
        <span class="section-badge" style="background:rgba(245,158,11,.15);color:var(--orange);border:1px solid rgba(245,158,11,.3)">ÉTAT CORPOREL</span>
      </div>
      <div style="padding:10px;overflow-x:auto">
        ${rptBM2}
      </div>
      <div style="padding:0 14px 12px;display:flex;flex-direction:column;gap:4px">
        ${hasPainZones
          ? Object.entries(mergedChart).filter(([,l])=>l>0).sort(([,a],[,b])=>b-a).map(([zid,lvl])=>{
              const m=ZONES_META2[zid];
              const lbl=lvl===1?'Gêne':lvl===2?'Douleur':'Vive douleur';
              const cc=lvl===1?'var(--orange)':lvl===2?'var(--red)':'#ff6b6b';
              return m?`<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:${cc}">
                <span style="width:6px;height:6px;border-radius:50%;background:${cc};flex-shrink:0"></span>
                ${m.l} — ${lbl}</div>`:'';
            }).join('')
          : '<div style="font-size:11px;color:var(--green)">✅ Aucune zone déclarée</div>'}
      </div>
    </div>
  </div>
`;

  // ── PAGE 1 PRINT : Éval catégories + Détail des tests (masqué sur écran) ──────
  {
    const catMetaP = {
      mob_inf:{label:'Mobilité Membre Inférieur',icon:'🦵'},
      mob_sup:{label:'Mobilité Membre Supérieur',icon:'💪'},
      stab:   {label:'Stabilité Articulaire',    icon:'⚙️'},
      fonc:   {label:'Fonctionnel',              icon:'🎯'},
    };
    var p1html = '<div id="rpt-print-p1" style="display:none">';
    (typeof TESTS !== 'undefined' ? TESTS : []).forEach(function(sec){
      var s = sc.secs[sec.id];
      if(!s || s.filled===0) return;
      var pct = Math.round(s.pts/s.max*100);
      var c   = pct>=70?'#22c55e':pct>=40?'#f59e0b':'#ef4444';
      var cm  = catMetaP[sec.id]||{label:sec.title||sec.id, icon:'📋'};
      var note = catComment(sec.id, pct);
      var rows = '';
      var tests = sec.tests||sec.items||[];
      tests.forEach(function(t){
        var tId=t.id, tName=t.name||t.label||t.titre||tId, tMax=t.max||t.maxScore||3;
        var sg=gs(tId,'g'), sd=gs(tId,'d'), sv=gs(tId,null);
        var rg=raw(tId,'g'), rd=raw(tId,'d'), rv=raw(tId,null);
        function scoreCol(v){ return v===3?'#22c55e':v===2?'#eab308':v===1?'#f59e0b':'#ef4444'; }
        var bars='';
        if(sg!==null){
          var cG=scoreCol(sg);
          bars+='<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">'
            +'<span style="font-size:8px;color:#4d6a9a;width:8px">G</span>'
            +'<div style="flex:1;height:3px;background:#1e3158;border-radius:2px;overflow:hidden">'
            +'<div style="height:100%;width:'+Math.round(sg/tMax*100)+'%;background:'+cG+'"></div></div>'
            +'<span style="font-size:9px;font-weight:700;color:'+cG+'">'+sg+'/'+tMax+'</span>'
            +(rg?'<span style="font-size:8px;color:#4d6a9a">('+rg+')</span>':'')+'</div>';
        }
        if(sd!==null){
          var cD=scoreCol(sd);
          bars+='<div style="display:flex;align-items:center;gap:4px">'
            +'<span style="font-size:8px;color:#4d6a9a;width:8px">D</span>'
            +'<div style="flex:1;height:3px;background:#1e3158;border-radius:2px;overflow:hidden">'
            +'<div style="height:100%;width:'+Math.round(sd/tMax*100)+'%;background:'+cD+'"></div></div>'
            +'<span style="font-size:9px;font-weight:700;color:'+cD+'">'+sd+'/'+tMax+'</span>'
            +(rd?'<span style="font-size:8px;color:#4d6a9a">('+rd+')</span>':'')+'</div>';
        }
        if(sv!==null && sg===null && sd===null){
          var cV=scoreCol(sv);
          bars='<div style="display:flex;align-items:center;gap:4px">'
            +'<div style="flex:1;height:3px;background:#1e3158;border-radius:2px;overflow:hidden">'
            +'<div style="height:100%;width:'+Math.round(sv/tMax*100)+'%;background:'+cV+'"></div></div>'
            +'<span style="font-size:9px;font-weight:700;color:'+cV+'">'+sv+'/'+tMax+'</span>'
            +(rv?'<span style="font-size:8px;color:#4d6a9a">('+rv+')</span>':'')+'</div>';
        }
        if(bars){
          rows+='<div style="background:#0a1628;border:1px solid #1a2e52;border-radius:4px;padding:5px 7px">'
            +'<div style="font-size:8px;font-weight:700;color:#9cb3d4;margin-bottom:4px;text-transform:uppercase;letter-spacing:.3px">'+tName+'</div>'
            +bars+'</div>';
        }
      });
      if(rows){
        p1html += '<div style="background:#0c1830;border:1px solid #1e3158;border-radius:8px;overflow:hidden;margin-bottom:8px">'
          +'<div style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:#112040;border-bottom:1px solid #1e3158">'
          +'<span style="font-size:11px">'+cm.icon+'</span>'
          +'<span style="font-size:10px;font-weight:700;color:#e8eef8;flex:1">'+cm.label+'</span>'
          +'<span style="font-size:13px;font-weight:800;color:'+c+'">'+pct+'%</span>'
          +'<span style="font-size:9px;color:#4d6a9a">'+Math.round(s.pts*10)/10+'/'+s.max+'</span>'
          +'</div>'
          +(note?'<div style="padding:5px 12px 2px;font-size:9px;color:#4d6a9a;font-style:italic">'+note+'</div>':'')
          +'<div style="padding:6px 12px 8px;display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:4px">'+rows+'</div>'
          +'</div>';
      }
    });
    p1html += '</div>';
    h += p1html;
  }

  // ── PAGE 2 : corps + risques + notes dans un seul wrapper ──────────────────
  h += '<div id="rpt-p2">';

  // Mini en-tête page 2
  const gn = p.gn || _p.gn || '';
  const scoreLvlColor = scoreLvl.c;
  h += '<div style="display:flex;align-items:center;justify-content:space-between;'
    + 'padding:10px 16px;background:linear-gradient(135deg,var(--navy-3),var(--navy-2));'
    + 'border:1px solid var(--border);border-radius:var(--radius-lg);margin-bottom:10px;'
    + 'position:relative;overflow:hidden">'
    + '<div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(to right,var(--cyan),transparent)"></div>'
    + '<div style="position:absolute;top:0;right:0;font-family:\'Bebas Neue\',sans-serif;font-size:60px;'
    + 'letter-spacing:4px;color:rgba(0,200,230,.04);line-height:1;pointer-events:none">FENIX</div>'
    + '<div>'
    + '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:20px;letter-spacing:2px;color:var(--text);line-height:1">'
    + p.pr+' '+p.n+'</div>'
    + '<div style="font-size:10px;color:var(--cyan);letter-spacing:1px;text-transform:uppercase;margin-top:2px">'
    + (p.gr||'Fenix Toulouse')+(p.pos?' · '+p.pos:'')+'</div>'
    + '</div>'
    + '<div style="text-align:right">'
    + '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:28px;color:'+scoreLvlColor+';line-height:1">'+sc.t+'%</div>'
    + '<div style="font-size:10px;color:'+scoreLvlColor+';letter-spacing:1px">'+scoreLvl.l+'</div>'
    + '<div style="font-size:10px;color:var(--text-3);margin-top:2px">📅 '+ds+'</div>'
    + '</div>'
    + '</div>';

  // Corps (masqué sur écran, visible à l'impression)
  h += '<div id="rpt-corps-p2" style="display:none;background:var(--navy-2);border:1px solid var(--border);'
    + 'border-radius:var(--radius-lg);overflow:hidden;margin-bottom:8px">'
    + '<div style="padding:8px 14px;background:var(--navy-3);border-bottom:1px solid var(--border);position:relative">'
    + '<span class="section-badge" style="background:rgba(245,158,11,.15);color:#f59e0b;border:1px solid rgba(245,158,11,.3)">ÉTAT CORPOREL</span>'
    + '</div>'
    + '<div style="padding:8px;display:flex;gap:12px;align-items:flex-start">'
    + '<div style="flex-shrink:0">' + buildBM2ReadOnlySVG({...p, bodyChart: mergedChart}, 180, injZoneIds) + '</div>'
    + '<div style="flex:1;display:flex;flex-direction:column;gap:3px;padding-top:4px">'
    + (hasPainZones
        ? Object.entries(mergedChart).filter(([,l])=>l>0).sort(([,a],[,b])=>b-a).map(([zid,lvl])=>{
            const m=ZONES_META2[zid];
            const lbl=lvl===1?'Gêne':lvl===2?'Douleur':'Vive douleur';
            const cc=lvl===1?'#f59e0b':lvl===2?'#ef4444':'#ff6b6b';
            return m?'<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:'+cc+'"><span style="width:5px;height:5px;border-radius:50%;background:'+cc+';flex-shrink:0"></span>'+m.l+' — '+lbl+'</div>':'';
          }).join('')
        : '<div style="font-size:11px;color:#22c55e">✅ Aucune zone déclarée</div>')
    + '</div></div></div>';

  h += `
  <!-- ══ RISQUES + NOTES ══ -->
  <div style="background:var(--navy-2);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden">
    <div style="padding:10px 16px;background:var(--navy-3);border-bottom:1px solid var(--border);
      position:relative;display:flex;align-items:center;gap:8px">
      <div style="position:absolute;bottom:0;left:0;right:0;height:2px;
        background:linear-gradient(to right,var(--red),var(--orange),transparent)"></div>
      <span class="section-badge badge-force">③ RISQUES</span>
      <span style="font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:2px;color:var(--text)">Récap des Risques &amp; Tendances de Travail</span>
    </div>
    <div style="padding:12px 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">`;

  risks.forEach(r=>{
    const brd=r.lvl==='danger'?'var(--red)':r.lvl==='warning'?'var(--orange)':'var(--green)';
    h+=`<div style="background:var(--navy-3);border:1px solid var(--border);border-left:3px solid ${brd};
      border-radius:8px;padding:12px 14px">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:1.5px;
        color:${brd};margin-bottom:6px;display:flex;align-items:center;gap:6px">
        ${r.icon} ${r.zone}
      </div>
      <div style="font-size:11px;color:var(--text-2);line-height:1.6">${r.desc}</div>
    </div>`;
  });

  // Notes générales sur page 2 (écran) — également en page 2 print
  if(gn){
    h+=`<div style="background:var(--navy-3);border:1px solid var(--border);border-left:3px solid var(--cyan);
      border-radius:8px;padding:12px 14px;grid-column:1/-1">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:1.5px;
        color:var(--cyan);margin-bottom:6px">📝 NOTES GÉNÉRALES</div>
      <div style="font-size:11px;color:var(--text-2);line-height:1.7;white-space:pre-wrap">${gn}</div>
    </div>`;
  }

  // Antécédents recap compact
  if(p.injuries&&p.injuries.length){
    h+=`<div style="background:var(--navy-3);border:1px solid var(--border);border-left:3px solid var(--text-3);
      border-radius:8px;padding:12px 14px;grid-column:1/-1">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:1.5px;
        color:var(--text-3);margin-bottom:8px">🩹 ANTÉCÉDENTS TRAUMATIQUES</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${p.injuries.map(inj=>{
          const d=inj.date?new Date(inj.date).toLocaleDateString('fr-FR',{month:'short',year:'numeric'}):'—';
          return `<span style="background:var(--navy-4);border:1px solid var(--border-2);
            border-radius:5px;padding:3px 10px;font-size:11px;color:var(--text-2);
            font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px">
            ${inj.desc||'—'} <span style="color:var(--text-3)">(${d}${inj.duration?' · '+inj.duration:''})</span>
          </span>`;
        }).join('')}
      </div>
    </div>`;
  }

  h+=`</div></div>

  <!-- Footer -->
  <div style="text-align:center;padding:14px 0 4px;font-family:'Barlow Condensed',sans-serif;
    font-size:10px;letter-spacing:2px;color:var(--text-3);text-transform:uppercase">
    Fenix Toulouse Handball · Testing Physique · ${new Date().toLocaleDateString('fr-FR')}
    <br><span style="letter-spacing:1px;text-transform:none;color:var(--text-3);opacity:.7">
      GANOT Romain — Préparateur Physique · romain.ganot@gmail.com
    </span>
  </div>
  </div><!-- /rpt-p2 -->
  </div>`;

  document.getElementById('mainContent').innerHTML=h;
}


// ─── BUILD A4 LAYOUT ──────────────────────────────────────
function buildA4Dom(p){
  // A4 = 794px wide @ 96dpi — tout le layout est calibré pour cette largeur
  const sc     = calcScore(p.id, null);
  const morpho = buildProfilMorpho(p, sc);
  const age    = p.ddn ? Math.floor((Date.now()-new Date(p.ddn))/(365.25*24*3600*1000)) : null;
  const ds     = p.dt  ? new Date(p.dt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—';

  const gs=(id,side)=>{const k=side?id+'_'+side:id;const v=p.d[k];return(v!==null&&v!==undefined&&v!=='')?parseInt(v):null;};
  const scoreLvl=sc.t>=70?{c:'#22c55e',l:'Excellent'}:sc.t>=60?{c:'#eab308',l:'Très bon'}:sc.t>=50?{c:'#00c8e6',l:'Bon'}:sc.t>=40?{c:'#f59e0b',l:'Correct — déficits ciblés'}:{c:'#ef4444',l:'Risque élevé'};

  // Catégories
  function catLine(id, pct){
    if(id==='mob_inf'){const ank=Math.min(gs('t1','g')??3,gs('t1','d')??3);if(pct>=85)return'Excellente mobilité globale.';if(pct>=65)return ank<=1?'Bonne mobilité. Légère restriction dorsiflexion.':'Bonne mobilité générale.';return ank<=1?'Restriction dorsiflexion — priorité.':'Déficits mobilité inférieure.';}
    if(id==='mob_sup'){const g10=gs('t10','g'),d10=gs('t10','d');const a=(g10!==null&&d10!==null)?Math.abs(g10-d10):0;if(a>=2)return`Asymétrie Shoulder FMS (G:${g10} — D:${d10}/3).`;if(pct>=80)return'Bonne mobilité sup., symétrie satisfaisante.';return'Mobilité sup. à optimiser en rotation.';}
    if(id==='stab'){const nor=gs('t12',null),cp=Math.min(gs('t14','g')??3,gs('t14','d')??3);let t=pct>=75?'Bonne stabilité.':pct>=50?'Stabilité correcte — déficits ciblés.':'Déficits de stabilité — priorité.';if(nor!==null&&nor<=1)t+=' Nordic insuffisant.';if(cp<=1)t+=' Copenhagen faible.';return t;}
    if(id==='fonc'){const ud=gs('t19','d'),vd=gs('t20','d');let t=pct>=80?'Bon profil fonctionnel.':pct>=55?'Fonctionnel correct — à améliorer.':'Fonctionnel à renforcer.';if(ud!==null&&ud<=1)t+=' Instabilité unipodale D.';if(vd!==null&&vd<=1)t+=' Valgus genou D insuffisant.';return t;}
    return '';
  }

  // Risques
  const risks=[];
  const a1g=gs('t1','g'),a1d=gs('t1','d');
  if((a1g!==null&&a1g<=1)||(a1d!==null&&a1d<=1)){const z=a1d!==null&&a1d<=(a1g??3)?'D':'G';risks.push({lvl:'danger',zone:'Cheville '+z,icon:'🦶',desc:`Dorsiflexion réduite côté ${z}.`,travail:'Lunge wall 3×30s, excentrique mollet, proprioception unipodale.'});}
  const u19g=gs('t19','g'),u19d=gs('t19','d');
  if((u19g!==null&&u19g<=1)||(u19d!==null&&u19d<=1)){const s=u19d!==null&&u19d<=(u19g??3)?'D':'G';risks.push({lvl:'danger',zone:'Stabilité unipodale '+s,icon:'⚖️',desc:`Score ${s==='D'?u19d:u19g}/3 — déficit proprioceptif majeur.`,travail:'Plan instable 3×30s, star excursion, hop test progressif.'});}
  const nor=gs('t12',null);
  if(nor!==null&&nor<=1)risks.push({lvl:'warning',zone:'Ischio-jambiers',icon:'💪',desc:`Nordic ${nor}/3 — force excentrique insuffisante.`,travail:'Nordic progressif 2×/sem, hip hinge excentrique.'});
  const cpg=gs('t14','g'),cpd=gs('t14','d'),cpMin=(cpg!==null&&cpd!==null)?Math.min(cpg,cpd):cpg??cpd??null;
  if(cpMin!==null&&cpMin<=1)risks.push({lvl:'warning',zone:'Adducteurs',icon:'⚡',desc:`Copenhagen G:${cpg??'—'} D:${cpd??'—'}/3 — risque pubalgie.`,travail:'Copenhagen progressif, adductions élastiques 3×15.'});
  const v20g=gs('t20','g'),v20d=gs('t20','d'),vMin=(v20g!==null&&v20d!==null)?Math.min(v20g,v20d):v20g??v20d??null;
  if(vMin!==null&&vMin<=1)risks.push({lvl:'danger',zone:'Valgus genou',icon:'🦵',desc:`Drop Valgus G:${v20g??'—'} D:${v20d??'—'}/3 — risque LCA.`,travail:'Renforcement fessier moyen, squat unipodal miroir.'});
  const s10g=gs('t10','g'),s10d=gs('t10','d');
  if(s10g!==null&&s10d!==null&&Math.abs(s10g-s10d)>=2)risks.push({lvl:'warning',zone:'Épaule asymétrie',icon:'🤾',desc:`Shoulder FMS G:${s10g} D:${s10d}/3.`,travail:'Sleeper stretch 3×30s, renforcement RE/RI ≥65%.'});
  if(!risks.length)risks.push({lvl:'ok',zone:'Profil sain',icon:'✅',desc:'Aucun risque majeur identifié.',travail:'Entretien préventif hebdomadaire.'});

  // Body SVG inline (A4) — BM2 (même que fiche testing)
  const svgBM2 = buildBM2ReadOnlySVG(p, 360);

  const catDefs=[
    {id:'mob_inf',label:'Mobilité Membre Inférieur',color:'#00c8e6'},
    {id:'mob_sup',label:'Mobilité Membre Supérieur',color:'#00c8e6'},
    {id:'stab',   label:'Stabilité Articulaire',    color:'#ef4444'},
    {id:'fonc',   label:'Fonctionnel',              color:'#22c55e'},
  ];

  // Construire le HTML A4 complet (self-contained, pas de var CSS)
  const wrap = document.createElement('div');
  wrap.style.cssText = `
    position:fixed; left:-9999px; top:0;
    width:794px; background:#060d1b;
    font-family:'Barlow',sans-serif; font-size:13px; color:#e8eef8;
    padding:24px; box-sizing:border-box;
  `;

  const injMeta = (p.injuries||[]).map(inj=>{
    const d=inj.date?new Date(inj.date).toLocaleDateString('fr-FR',{month:'short',year:'numeric'}):'—';
    return `<span style="background:#1a2e52;border:1px solid #2a4070;border-radius:4px;padding:2px 8px;font-size:10px;color:#9cb3d4;margin:2px">${inj.desc||'—'} (${d})</span>`;
  }).join('');

  const catHTML = catDefs.map(cat=>{
    const s=sc.secs[cat.id];
    if(!s||s.filled===0)return'';
    const pct=Math.round(s.pts/s.max*100);
    return `<div style="margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
        <span style="font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;color:#e8eef8;flex:1">${cat.label}</span>
        <span style="font-family:'Barlow',sans-serif;font-size:12px;font-weight:800;color:${pct>=70?'#22c55e':pct>=40?'#f59e0b':'#ef4444'}">${pct}%</span>
        <span style="font-size:10px;color:#4d6a9a">${Math.round(s.pts*10)/10}/${s.max}</span>
      </div>
      <div style="height:5px;background:#1e3158;border-radius:3px;overflow:hidden;margin-bottom:3px">
        <div style="height:100%;width:${pct}%;background:${pct>=70?'#22c55e':pct>=40?'#f59e0b':'#ef4444'};border-radius:3px"></div>
      </div>
      <div style="font-size:10px;color:#9cb3d4;line-height:1.4">${catLine(cat.id,pct)}</div>
    </div>`;
  }).join('');

  const risksHTML = risks.map(r=>{
    const brd=r.lvl==='danger'?'#ef4444':r.lvl==='warning'?'#f59e0b':'#22c55e';
    return `<div style="border-left:3px solid ${brd};background:#112040;border-radius:0 6px 6px 0;padding:8px 10px;margin-bottom:6px">
      <div style="font-size:11px;font-weight:700;color:${brd};margin-bottom:3px">${r.icon} ${r.zone}</div>
      <div style="font-size:10px;color:#9cb3d4;line-height:1.4">${r.desc}</div>
    </div>`;
  }).join('');

  const notesHTML = p.gn ? `<div style="border-left:3px solid #00c8e6;background:#112040;border-radius:0 6px 6px 0;padding:8px 10px;margin-top:6px">
    <div style="font-size:11px;font-weight:700;color:#00c8e6;margin-bottom:4px">📝 NOTES GÉNÉRALES</div>
    <div style="font-size:10px;color:#9cb3d4;line-height:1.6;white-space:pre-wrap">${p.gn}</div>
  </div>` : '';

  // bc est toujours nécessaire pour la légende des zones
  const bc = p.bodyChart || {};
  const painZones = Object.entries(bc).filter(([,l])=>l>0).sort(([,a],[,b])=>b-a).map(([zid,lvl])=>{
    const m=ZONES_META2[zid];const cc=lvl===1?'#f59e0b':lvl===2?'#ef4444':'#ff6b6b';
    const lbl=lvl===1?'Gêne':lvl===2?'Douleur':'Vive douleur';
    return m?`<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:${cc};margin-bottom:3px"><span style="width:5px;height:5px;border-radius:50%;background:${cc};flex-shrink:0;display:inline-block"></span>${m.l} — ${lbl}</div>`:'';
  }).join('');

  wrap.innerHTML = `
  <!-- HEADER -->
  <div style="display:flex;align-items:flex-start;gap:14px;padding:14px 16px;
    background:linear-gradient(135deg,#112040,#0c1830);
    border:1px solid #1e3158;border-radius:10px;margin-bottom:10px;
    position:relative;overflow:hidden">
    <div style="position:absolute;bottom:0;left:0;right:0;height:2px;
      background:linear-gradient(to right,#00c8e6,transparent)"></div>
    <div style="position:absolute;top:0;right:0;font-family:'Barlow',sans-serif;
      font-size:80px;font-weight:900;letter-spacing:4px;color:rgba(0,200,230,0.04);
      line-height:1;pointer-events:none">FENIX</div>

    <div style="flex:1">
      <div style="font-size:22px;font-weight:800;letter-spacing:2px;color:#e8eef8;line-height:1;margin-bottom:2px">${p.pr} ${p.n}</div>
      <div style="font-size:11px;letter-spacing:1px;color:#00c8e6;margin-bottom:8px;text-transform:uppercase">${p.gr||'Fenix Toulouse'}${p.pos?' · '+p.pos:''}</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px">
        ${p.ta?`<span style="background:#1a2e52;border:1px solid #2a4070;border-radius:4px;padding:2px 8px;font-size:10px;color:#9cb3d4">📏 ${p.ta} cm</span>`:''}
        ${p.po?`<span style="background:#1a2e52;border:1px solid #2a4070;border-radius:4px;padding:2px 8px;font-size:10px;color:#9cb3d4">⚖️ ${p.po} kg</span>`:''}
        ${morpho.imcVal?`<span style="background:#1a2e52;border:1px solid #2a4070;border-radius:4px;padding:2px 8px;font-size:10px;color:${morpho.imcColor}">IMC ${morpho.imcVal} — ${morpho.imcLabel}</span>`:''}
        ${!isNaN(morpho.mg)?`<span style="background:#1a2e52;border:1px solid #2a4070;border-radius:4px;padding:2px 8px;font-size:10px;color:${morpho.mgColor}">🔬 ${morpho.mg}% MG — ${morpho.mgLabel}</span>`:''}
        ${age?`<span style="background:#1a2e52;border:1px solid #2a4070;border-radius:4px;padding:2px 8px;font-size:10px;color:#9cb3d4">🎂 ${age} ans</span>`:''}
        <span style="background:#1a2e52;border:1px solid #2a4070;border-radius:4px;padding:2px 8px;font-size:10px;color:#9cb3d4">📅 ${ds}</span>
      </div>
    </div>

    <div style="text-align:center;flex-shrink:0">
      <div style="font-size:42px;font-weight:900;color:${scoreLvl.c};line-height:1">${sc.t}%</div>
      <div style="font-size:10px;font-weight:700;color:${scoreLvl.c};letter-spacing:1px;margin-bottom:2px">${scoreLvl.l}</div>

      <div style="margin-top:6px;background:#112040;border:1px solid #1e3158;border-radius:6px;padding:4px 8px;font-size:10px;color:#9cb3d4">
        ${morpho.archetype.icon} ${morpho.archetype.name}
      </div>
    </div>
  </div>

  <!-- LIGNE 2 : CATÉGORIES + CORPS -->
  <div style="display:flex;gap:10px;margin-bottom:10px">

    <!-- Catégories -->
    <div style="flex:1;background:#0c1830;border:1px solid #1e3158;border-radius:10px;overflow:hidden">
      <div style="padding:8px 12px;background:#112040;border-bottom:1px solid #1e3158;
        font-size:10px;font-weight:700;letter-spacing:2px;color:#e8a820;text-transform:uppercase">
        ② Évaluation par Catégorie
      </div>
      <div style="padding:12px">${catHTML}</div>
    </div>

    <!-- Corps -->
    <div style="width:370px;flex-shrink:0;background:#0c1830;border:1px solid #1e3158;border-radius:10px;overflow:hidden">
      <div style="padding:8px 12px;background:#112040;border-bottom:1px solid #1e3158;
        font-size:10px;font-weight:700;letter-spacing:2px;color:#f59e0b;text-transform:uppercase">
        Zones Douloureuses
      </div>
      <div style="padding:8px;overflow-x:auto">
        ${svgBM2}
      </div>
      <div style="padding:0 10px 10px">
        ${painZones||'<div style="font-size:10px;color:#22c55e">✅ Aucune zone déclarée</div>'}
      </div>
    </div>
  </div>

  <!-- RISQUES -->
  <div style="background:#0c1830;border:1px solid #1e3158;border-radius:10px;overflow:hidden;margin-bottom:8px">
    <div style="padding:8px 12px;background:#112040;border-bottom:1px solid #1e3158;
      font-size:10px;font-weight:700;letter-spacing:2px;color:#ef4444;text-transform:uppercase">
      ③ Risques &amp; Tendances de Travail
    </div>
    <div style="padding:12px;columns:2;column-gap:10px">${risksHTML}</div>
    <div style="padding:0 12px 12px">${notesHTML}</div>
  </div>

  ${(p.injuries&&p.injuries.length)?`
  <!-- ANTÉCÉDENTS -->
  <div style="background:#0c1830;border:1px solid #1e3158;border-radius:10px;padding:8px 12px;margin-bottom:8px">
    <div style="font-size:10px;font-weight:700;letter-spacing:2px;color:#4d6a9a;text-transform:uppercase;margin-bottom:6px">🩹 Antécédents</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">${injMeta}</div>
  </div>`:''}

  <!-- FOOTER -->
  <div style="text-align:center;font-size:9px;letter-spacing:2px;color:#4d6a9a;text-transform:uppercase;padding-top:4px">
    Fenix Toulouse Handball · Testing Physique · Généré le ${new Date().toLocaleDateString('fr-FR')}
    <br><span style="letter-spacing:1px;text-transform:none;opacity:.7">GANOT Romain — Préparateur Physique · romain.ganot@gmail.com</span>
  </div>
  `;

  return wrap;
}

async function exportRapportPDF(){
  const actions = document.querySelectorAll('.rpt-actions');
  actions.forEach(el => el.style.visibility='hidden');
  if(!document.getElementById('rpt-print-style')){
    const s = document.createElement('style');
    s.id = 'rpt-print-style';
    s.textContent = `@media print {
      *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
      .rpt-actions{display:none!important}
      #rpt-screen-row2{display:none!important}
      #rpt-print-p1{display:block!important}
      #rpt-p2{page-break-before:always}
      #rpt-corps-p2{display:block!important}
    }`;
    document.head.appendChild(s);
  }
  window.print();
  setTimeout(()=>{ actions.forEach(el=>el.style.visibility=''); },1000);
}

function shareRapportPDF(){ exportRapportPDF(); }
