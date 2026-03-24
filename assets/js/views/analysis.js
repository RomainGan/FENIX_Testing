// Fenix Toulouse — views/analysis.js
// Prévention blessures, analyse IA, profil morphologique
// ─── PREVENTION / AI ANALYSIS ───────────────────────────────
function renderPreventionSection(p){
  const hasResult = p.aiPrevention && p.aiPrevention.length > 0;
  const isLoading = window._aiLoading === p.id;
  let h = `<div class="prevention-section">
  <div class="prevention-header">
    <span class="section-badge badge-ai">IA</span>
    <span class="section-title" style="font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:2px">Analyse & Prévention des Blessures</span>
  </div>
  <div class="prevention-body">`;
  if(isLoading){
    h += `<div style="text-align:center;padding:20px;color:var(--text-3)">
      <div class="ai-spinner" style="margin:0 auto 12px"></div>
      <div style="font-family:'Barlow',sans-serif;font-size:13px">Analyse en cours…</div>
    </div>`;
  } else if(hasResult){
    h += `<div class="ai-result">${p.aiPrevention}</div>`;
    h += `<div style="margin-top:12px;display:flex;gap:8px">
      <button class="ai-analyze-btn" onclick="runAIAnalysis('${p.id}')" style="flex:1;padding:10px">🔄 Relancer l'analyse</button>
      <button class="btn btn-outline" onclick="clearAI('${p.id}')" style="padding:10px 14px;font-size:12px;color:var(--text-3)">✕ Effacer</button>
    </div>`;
  } else {
    h += `<div style="margin-bottom:14px;font-family:'Barlow',sans-serif;font-size:12px;color:var(--text-3);line-height:1.7">
      L'IA analyse les résultats des tests, les asymétries gauche/droite et les antécédents de blessures pour identifier les tendances et proposer des protocoles de prévention personnalisés.
    </div>
    <button class="ai-analyze-btn" onclick="runAIAnalysis('${p.id}')">
      ✦ Analyser et générer les recommandations de prévention
    </button>`;
  }
  h += `</div></div>`;
  return h;
}

function clearAI(pid){
  const p=players.find(x=>x.id===pid); if(!p)return;
  const sess=getCurrSess(p); delete sess.aiPrevention; save(); renderForm(p);
}

// ── Contexte spécifique par poste ────────────────────────
function _posteContext(poste){
  const p=(poste||'').toLowerCase();
  if(/ailier|ail\.|wing/i.test(p)) return {
    label:'Ailier',
    risques:'entorses de cheville récidivantes (réceptions en coins), déchirures ischio-jambiers (sprints répétés), blessures doigts/poignet (blocages)',
    qualites:'explosivité, coordination membres inférieurs, proprioception cheville, souplesse hanche',
    focus:'mobilité cheville et hanche, asymétries membres inférieurs, stabilité unipodale'
  };
  if(/pivot|line/i.test(p)) return {
    label:'Pivot',
    risques:'pubalgie (contacts fréquents), blessures genou (changements de direction sous charge), lombalgies (gainage sous pression)',
    qualites:'résistance au contact, stabilité articulaire, puissance musculaire, gainage profond',
    focus:'adducteurs, ratio ischio-jambiers/quadriceps, stabilité lombopelvienne, contrôle du valgus'
  };
  if(/arrière|back|arriè/i.test(p)) return {
    label:'Arrière',
    risques:'tendinopathie épaule (volume de tirs élevé), déchirures ischio-jambiers (sauts en suspension), surcharge lombaire',
    qualites:'puissance tir, explosivité verticale, endurance musculaire épaule',
    focus:'équilibre rotateurs épaule RE/RI, membres inférieurs pour la suspension, lombaires'
  };
  if(/demi.centre|meneur|playmaker/i.test(p)) return {
    label:'Demi-Centre',
    risques:'surcharge rachidienne (rotation tronc répétée), blessures genou (pivots fréquents), sollicitation épaule dominante',
    qualites:'coordination fine, mobilité globale, gestion de la charge sur la durée',
    focus:'mobilité thoracique et rachis, symétrie membres inférieurs, stabilité rotatoire du tronc'
  };
  if(/gardien|goal|gk/i.test(p)) return {
    label:'Gardien',
    risques:'déchirures adducteurs (grands écarts), luxations épaule (réceptions en extension), blessures genou (déplacements latéraux explosifs)',
    qualites:'amplitude articulaire maximale, réactivité, stabilité unipodale, puissance membres supérieurs',
    focus:'adducteurs, mobilité épaule et hanche, proprioception, contrôle valgus en déplacement latéral'
  };
  return {
    label:'Joueur',
    risques:'blessures classiques handball : cheville, genou, épaule, lombaires',
    qualites:'équilibre général des qualités physiques',
    focus:'asymétries bilatérales, points déficitaires identifiés aux tests'
  };
}

async function runAIAnalysis(pid){
  const _p=players.find(x=>x.id===pid); if(!_p)return;
  const sess=getCurrSess(_p);
  const p={..._p,...sess,d:sess.d||{},bodyChart:sess.bodyChart||{}};

  window._aiLoading=pid; renderForm(_p);

  const testResults=[];
  TESTS.forEach(sec=>{
    sec.tests.forEach(t=>{
      if(t.bilateral){
        const sg=p.d[t.id+'_g'], sd=p.d[t.id+'_d'];
        const ng=(sg!==null&&sg!==undefined&&sg!=='')?parseInt(sg):null;
        const nd=(sd!==null&&sd!==undefined&&sd!=='')?parseInt(sd):null;
        if(ng!==null) testResults.push(`${t.name} Gauche: ${ng}/3`);
        if(nd!==null) testResults.push(`${t.name} Droit: ${nd}/3`);
        if(ng!==null&&nd!==null&&Math.abs(ng-nd)>=1)
          testResults.push(`  ⚠ Asymétrie ${t.name}: G=${ng} vs D=${nd}`);
      } else {
        const sv=p.d[t.id];
        if(sv!==null&&sv!==undefined&&sv!=='') testResults.push(`${t.name}: ${parseInt(sv)}/3`);
      }
      const nt=p.d[t.id+'_nt'];
      if(nt&&nt.trim()) testResults.push(`  Remarque: ${nt}`);
    });
  });

  const injuries=(_p.injuries||[]).map(inj=>{
    const d=inj.date?new Date(inj.date).toLocaleDateString('fr-FR',{month:'long',year:'numeric'}):'date inconnue';
    const zones=(inj.zones||[]).map(z=>{const m=ZONES_META[z.id];return `${m?m.l:z.id}(niv.${z.lvl})`;}).join(', ')||'zone inconnue';
    const resolu=inj.perturbeEncore===false||inj.perturbeEncore==='false'?'résolu':'perturbe encore';
    return `- ${inj.desc||'Blessure'} (${d}, ${resolu}) zones: ${zones}${inj.duration?' durée: '+inj.duration:''}`;
  }).join('\n');

  const bodyPain=Object.entries(p.bodyChart||{}).filter(([,lvl])=>lvl>0).map(([id,lvl])=>{
    const m=ZONES_META[id];
    return `${m?m.l:id}: ${lvl===1?'Gêne':lvl===2?'Douleur':'Vive douleur'}`;
  }).join(', ');

  const age=_p.ddn?Math.floor((new Date()-new Date(_p.ddn))/31557600000)+'ans':'?';
  const ctx=_posteContext(_p.pos);
  const sc=calcScore(_p.id, null);

  const prompt=`Tu es préparateur physique expert en handball de haut niveau (Starligue / Pro D2).
Tu analyses le profil d'un athlète pour générer des recommandations de prévention des blessures et d'optimisation de la préparation physique.

PROFIL ATHLÈTE:
Nom: ${_p.pr} ${_p.n} | Poste: ${ctx.label} | Âge: ${age} | ${p.ta||'?'}cm / ${p.po||'?'}kg
Score fonctionnel global: ${sc.t}%

CONTEXTE POSTE — ${ctx.label}:
- Risques spécifiques au poste: ${ctx.risques}
- Qualités physiques prioritaires: ${ctx.qualites}
- Zones à surveiller en priorité: ${ctx.focus}

TESTS FONCTIONNELS (0=blessure/impossible, 1=insuffisant, 2=correct, 3=parfait):
${testResults.join('\n')||'Aucun test renseigné'}

ANTÉCÉDENTS BLESSURES:
${injuries||'Aucun'}

DOULEURS ACTUELLES (body chart):
${bodyPain||'Aucune'}

NOTES DU PRATICIEN:
${p.gn||'Aucune'}

INSTRUCTIONS:
- Analyse les données en tenant compte du poste (${ctx.label}) et de ses contraintes spécifiques en handball
- Croise les résultats des tests avec les antécédents et les douleurs actuelles
- Identifie les asymétries bilatérales et leur impact sur le risque de blessure à ce poste
- Propose des protocoles concrets avec exercices, séries, répétitions et fréquences
- Sois très spécifique handball : mentionne les gestes techniques concernés (tir en suspension, réception, changement de direction...)

Réponds UNIQUEMENT en JSON valide sans markdown ni texte avant ou après:
{"trends":[{"level":"danger|warning|ok","icon":"emoji","title":"titre court (max 8 mots)","body":"analyse du problème + protocole concret avec exercices et fréquences spécifiques handball"}]}
Maximum 5 tendances, classées du plus urgent au moins urgent.`;

  // ── Appel API Claude ─────────────────────────────────────
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if(!resp.ok) throw new Error('API error '+resp.status);
    const data = await resp.json();
    const raw = data.content?.map(c=>c.text||'').join('').trim();
    const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim());
    const trends = parsed.trends || [];
    let html='';
    trends.forEach(t=>{
      const cls=t.level==='danger'?'t-danger':t.level==='warning'?'t-warning':'t-ok';
      html+=`<div class="ai-trend ${cls}"><div class="ai-trend-title">${t.icon} ${t.title}</div><div class="ai-trend-body">${t.body}</div></div>`;
    });
    html += `<div style="margin-top:10px;font-size:10px;color:var(--text-3);text-align:right;font-family:'Barlow Condensed',sans-serif;letter-spacing:1px">✦ Analyse IA · ${ctx.label}</div>`;
    const _sess=getCurrSess(_p); _sess.aiPrevention=html; save();
    window._aiLoading=null; renderForm(_p);
    setTimeout(()=>{const el=document.querySelector('.prevention-section');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},200);
    return;
  } catch(e) {
    console.warn('API Claude indisponible, analyse locale activée :', e.message);
  }

  // ── Fallback : Analyse locale ─────────────────────────────
  const trends=[];

  const getScore=(id,side)=>{
    const k=side?id+'_'+side:id;
    const v=p.d[k];
    return(v!==null&&v!==undefined&&v!=='')?parseInt(v):null;
  };
  const asym=(id)=>{
    const g=getScore(id,'g'),d=getScore(id,'d');
    if(g===null&&d===null)return null;
    return{g:g??null,d:d??null,diff:(g!==null&&d!==null)?Math.abs(g-d):null,worst:(g!==null&&d!==null)?Math.min(g,d):g??d};
  };

  // 1. Dorsiflexion cheville (T1)
  const a1=asym('t1');
  if(a1){
    if(a1.diff!==null&&a1.diff>=2)
      trends.push({level:'danger',icon:'🦶',title:'Asymétrie sévère de dorsiflexion cheville',body:`Knee To Wall : G=${a1.g}/3 vs D=${a1.d}/3 (écart ${a1.diff} pts). Risque élevé d\'entorse récidivante, compensation lombaire et pathologie genou. <strong>Protocole :</strong> Mobilisation quotidienne cheville déficitaire (lunge wall stretch 3×30s, cercles actifs), renforcement excentrique mollet en unipodalisme (3×12 reps), proprioception sur plan instable 3×/semaine. Réévaluation à 6 semaines.`});
    else if((a1.diff!==null&&a1.diff===1)||(a1.worst!==null&&a1.worst<=1))
      trends.push({level:'warning',icon:'🦶',title:'Restriction de dorsiflexion — à corriger',body:`Knee To Wall : G=${a1.g??'—'}/3 D=${a1.d??'—'}/3. Restriction qui compromet les réceptions et changements de direction. <strong>Protocole :</strong> Étirements soléaire + gastrocnémien 2×/jour (3×45s), mobilisation en charge progressive, vérifier la cicatrisation de tout antécédent sur cette zone.`});
  }

  // 2. Antécédents de blessures croisés avec les tests
  (_p.injuries||[]).forEach(inj=>{
    const zones=(inj.zones||[]).map(z=>z.id);
    const d=inj.date?new Date(inj.date):null;
    const yearsAgo=d?Math.floor((new Date()-d)/31557600000):null;
    const zoneLabels=zones.map(id=>{const m=ZONES_META[id];return m?m.l:id;}).join(', ')||'zone inconnue';
    const recent=yearsAgo!==null&&yearsAgo<=2;
    const activePain=Object.keys(p.bodyChart||{}).some(id=>zones.includes(id));
    const isAnkle=zones.some(z=>z.includes('pied')||z.includes('cheville')||z.includes('talon'));
    const isKnee=zones.some(z=>z.includes('genou'));
    const isShoulder=zones.some(z=>z.includes('epaule')||z.includes('del')||z.includes('trap'));
    const isBack=zones.some(z=>z.includes('lombaire')||z.includes('dos'));
    let body=`Antécédent : <strong>${inj.desc||'blessure'}</strong>${yearsAgo!==null?' (il y a '+yearsAgo+' an'+(yearsAgo>1?'s':'')+')':', date inconnue'} — ${zoneLabels}.`;
    if(activePain) body+=' <strong style="color:var(--red)">⚠ Douleur encore signalée sur cette zone.</strong>';
    if(inj.duration) body+=` Indisponibilité : ${inj.duration}.`;
    if(isAnkle){
      const t1g=getScore('t1','g'),t1d=getScore('t1','d');
      const deficit=(t1g!==null&&t1g<=1)||(t1d!==null&&t1d<=1);
      body+=` <strong>Protocole :</strong> ${deficit?'Déficit de mobilité confirmé par le Knee To Wall — ':''} Renforcement proprioceptif progressif (appui unipodal → BOSU → saut-réception), mobilité dorsiflexion quotidienne, renforcement excentrique mollet. ${recent?'Progression sur 8-12 semaines.':'Maintien préventif 1×/semaine minimum.'}`;
    } else if(isKnee){
      body+=` <strong>Protocole :</strong> Ratio IJ/Q à surveiller, contrôle valgus en réception (cf. Drop Valgus), renforcement fessier moyen, proprioception unipodal.`;
    } else if(isShoulder){
      body+=` <strong>Protocole :</strong> Équilibre rotateurs RE/RI (objectif ratio ≥65%), renforcement coiffe 3×/semaine, mobilité rotation interne (Sleeper stretch 3×30s).`;
    } else if(isBack){
      body+=` <strong>Protocole :</strong> Gainage profond (planche, bird-dog 3×10), mobilité thoracique, étirements fléchisseurs hanche, contrôle bascule pelvienne.`;
    }
    trends.push({level:activePain?'danger':recent?'warning':'ok',icon:isAnkle?'🦶':isKnee?'🦵':isShoulder?'💪':'🔴',title:`${inj.desc||'Antécédent'} — suivi préventif`,body});
  });

  // 3. Copenhagen Plank / adducteurs (T14)
  const a14=asym('t14');
  if(a14&&a14.worst!==null&&a14.worst<=1)
    trends.push({level:'warning',icon:'⚡',title:'Faiblesse adducteurs — risque pubalgie',body:`Copenhagen Plank G:${a14.g??'—'}/3 D:${a14.d??'—'}/3. Principal facteur de risque de pubalgie en handball. <strong>Protocole :</strong> Copenhagen Plank progressif 2×/sem (genoux fléchis → jambe tendue sur 6 sem), adductions élastiques en chaîne fermée 3×15, renforcement excentrique adducteurs assis.`});

  // 4. Drop Valgus (T20)
  const a20=asym('t20');
  if(a20&&(( a20.diff!==null&&a20.diff>=1)||(a20.worst!==null&&a20.worst<=1)))
    trends.push({level:a20.worst!==null&&a20.worst<=1?'danger':'warning',icon:'🦵',title:'Contrôle du valgus insuffisant — risque LCA',body:`Drop Valgus Step G:${a20.g??'—'}/3 D:${a20.d??'—'}/3. Mécanisme principal de blessure du LCA en handball. <strong>Protocole :</strong> Renforcement fessier moyen (clamshells 3×20, abduction élastique), squats unipodaux contrôlés miroir, progression réception 2 jambes → 1 jambe avec activation fessiers.`});

  // 5. Nordic Hamstring (T12)
  const v12=getScore('t12',null);
  if(v12!==null&&v12<=1)
    trends.push({level:'warning',icon:'💪',title:'Faiblesse ischio-jambiers — prévention claquage',body:`Nordic Hamstring : ${v12}/3. Premier facteur de claquage en handball (sprint, tir, écart). <strong>Protocole :</strong> Nordic Hamstring progressif 2×/sem (5 reps → +1/sem sur 8 sem), pont fessier unilatéral 3×15, renforcement excentrique en sprint contrôlé.`});

  // 6. Rotary Stability asymétrie (T13)
  const a13=asym('t13');
  if(a13&&a13.diff!==null&&a13.diff>=1)
    trends.push({level:'warning',icon:'🔄',title:'Asymétrie stabilité rotatoire du tronc',body:`Rotary Stability G:${a13.g}/3 D:${a13.d}/3. Facteur de risque lombaire et tendineux en torsion (tirs, passes en handball). <strong>Protocole :</strong> Bird-dog unilatéral côté déficitaire 3×10, Pallof press élastique, travail en rotation avec charge légère 2×/sem.`});

  // 7. Shoulder asymétrie (T10 ou T8)
  const a10=asym('t10');
  if(a10&&a10.diff!==null&&a10.diff>=1)
    trends.push({level:'warning',icon:'🤾',title:'Asymétrie mobilité épaule',body:`Shoulder FMS G:${a10.g}/3 D:${a10.d}/3. L\'épaule dominante perd souvent sa rotation interne en handball. <strong>Protocole :</strong> Sleeper stretch côté déficitaire 3×30s, mobilisation capsule postérieure, ratio RE/RI ≥65% (bandes élastiques RE 3×15).`});

  // 8. Bilan positif
  const totalPts=Object.values(sc.secs||{}).reduce((a,s)=>a+s.pts,0);
  if(sc.f>=15&&totalPts>=45)
    trends.push({level:'ok',icon:'✅',title:'Profil fonctionnel globalement satisfaisant',body:`Score ${Math.round(totalPts*10)/10}/60 (${sc.t}%). Les fondamentaux sont solides. Maintenir un programme d\'entretien préventif hebdomadaire et surveiller les points identifiés ci-dessus lors des prochains tests.`});

  if(!trends.length)
    trends.push({level:'ok',icon:'📊',title:'Complétez les données pour une analyse',body:'Renseignez les scores des tests fonctionnels et les éventuels antécédents pour obtenir des recommandations personnalisées.'});

  let html='';
  trends.forEach(t=>{
    const cls=t.level==='danger'?'t-danger':t.level==='warning'?'t-warning':'t-ok';
    html+=`<div class="ai-trend ${cls}"><div class="ai-trend-title">${t.icon} ${t.title}</div><div class="ai-trend-body">${t.body}</div></div>`;
  });
  const _sess=getCurrSess(p); _sess.aiPrevention=html; save();
  window._aiLoading=null; renderForm(p);
  setTimeout(()=>{const el=document.querySelector('.prevention-section');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},200);
}

// ─── INJURY MANAGEMENT ───────────────────────────────────
function openInjuryForm(){
  injFormOpen=true; _injEditIdx=null; _injPerturbe=true;
  const p=players.find(x=>x.id===cPid); if(p) renderForm(p);
  setTimeout(()=>{ const el=document.getElementById('injDate'); if(el) el.focus(); },100);
}
function openEditInjury(pid, idx){
  injFormOpen=true; _injEditIdx=idx;
  const p=players.find(x=>x.id===pid); if(!p) return;
  const inj=p.injuries[idx]; if(!inj) return;
  _injPerturbe = inj.perturbeEncore===true||inj.perturbeEncore==='true';
  _injCote = inj.cote||'';
  renderForm(p);
  setTimeout(()=>{
    const d=document.getElementById('injDate');
    const cat=document.getElementById('injCategorie');
    const t=document.getElementById('injType');
    const loc=document.getElementById('injLocalisation');
    const desc=document.getElementById('injDesc');
    const note=document.getElementById('injPerturbeNote');
    if(d&&inj.date) d.value=inj.date.slice(0,7);
    if(cat&&inj.categorie) cat.value=inj.categorie;
    if(t&&inj.type) t.value=inj.type;
    if(loc&&inj.localisation) loc.value=inj.localisation;
    if(desc) desc.value=inj.desc||'';
    if(note) note.value=inj.perturbeNote||'';
    // Durée : parser "3 semaine(s)" ou "2 mois"
    if(inj.duration){
      const parts=inj.duration.split(' ');
      const nb=document.getElementById('injDurNb');
      const unit=document.getElementById('injDurUnit');
      if(nb&&parts[0]) nb.value=parts[0];
      if(unit&&parts[1]) unit.value=parts[1];
    }
    // Côté
    if(_injCote) setInjCote(_injCote);
    setInjPerturbe(_injPerturbe);
  },80);
}
function cancelInjury(){
  injFormOpen=false; _injEditIdx=null; _injPerturbe=true;
  const p=players.find(x=>x.id===cPid); if(p) renderForm(p);
}
// Mapping localisation + côté → IDs zones SVG BM2
const LOC_TO_ZONES = {
  'Pied':              {G:['pied_g','chev_g'],    D:['pied_d','chev_d'],    B:['pied_g','chev_g','pied_d','chev_d']},
  'Cheville':          {G:['chev_g','jambe_g'],   D:['chev_d','jambe_d'],   B:['chev_g','jambe_g','chev_d','jambe_d']},
  'Tibia / Péroné':    {G:['jambe_g'],            D:['jambe_d'],            B:['jambe_g','jambe_d']},
  'Genou':             {G:['genou_g','poplit_g'],  D:['genou_d','poplit_d'], B:['genou_g','poplit_g','genou_d','poplit_d']},
  'Cuisse':            {G:['ischio_g','quad_g'],   D:['ischio_d','quad_d'],  B:['ischio_g','quad_g','ischio_d','quad_d']},
  'Hanche':            {G:['fessier_g'],           D:['fessier_d'],          B:['fessier_g','fessier_d']},
  'Aine / Adducteurs': {G:['adduct_g','adduct_g2'],D:['adduct_d','adduct_d2'],B:['adduct_g','adduct_g2','adduct_d','adduct_d2']},
  'Fessier':           {G:['fessier_g'],           D:['fessier_d'],          B:['fessier_g','fessier_d']},
  'Lombaires':         {G:['lombaire_d'],          D:['lombaire_d'],         B:['lombaire_d']},
  'Abdominaux':        {G:['abdomen'],             D:['abdomen'],            B:['abdomen']},
  'Côtes':             {G:['cote_g'],              D:['cote_d'],             B:['cote_g','cote_d']},
  'Colonne vertébrale':{G:['lombaire_d'],          D:['lombaire_d'],         B:['lombaire_d']},
  'Épaule':            {G:['epaule_g','epaule_g_b'],D:['epaule_d','epaule_d_b'],B:['epaule_g','epaule_g_b','epaule_d','epaule_d_b']},
  'Coude':             {G:['coude_g'],             D:['coude_d'],            B:['coude_g','coude_d']},
  'Avant-bras':        {G:['avbras_g','avbras_g_b'],D:['avbras_d','avbras_d_b'],B:['avbras_g','avbras_g_b','avbras_d','avbras_d_b']},
  'Poignet':           {G:['poignet_g'],           D:['poignet_d'],          B:['poignet_g','poignet_d']},
  'Main / Doigts':     {G:['main_g','main_g_b'],   D:['main_d','main_d_b'],  B:['main_g','main_g_b','main_d','main_d_b']},
  'Nuque / Cou':       {G:['nuque','cou_f'],       D:['nuque','cou_f'],      B:['nuque','cou_f']},
  'Tête':              {G:['tete_f','tete_b'],     D:['tete_f','tete_b'],    B:['tete_f','tete_b']},
  'Pectoraux':         {G:['pec_g'],               D:['pec_d'],              B:['pec_g','pec_d']},
  'Omoplate':          {G:['omoplate_g'],          D:['omoplate_d'],         B:['omoplate_g','omoplate_d']},
  'Grand Dorsal':      {G:['dorsal'],              D:['dorsal'],             B:['dorsal']},
};

function saveInjury(pid){
  const p=players.find(x=>x.id===pid); if(!p) return;
  if(!p.injuries) p.injuries=[];
  const date=document.getElementById('injDate')?.value;
  const categorie=document.getElementById('injCategorie')?.value||'';
  const type=document.getElementById('injType')?.value||'';
  const localisation=document.getElementById('injLocalisation')?.value||'';
  const cote=_injCote||'';
  const durNb=document.getElementById('injDurNb')?.value||'';
  const durUnit=document.getElementById('injDurUnit')?.value||'semaine(s)';
  const duration=durNb?(durNb+' '+durUnit):'';
  const desc=document.getElementById('injDesc')?.value.trim()||'';
  const perturbeNote=document.getElementById('injPerturbeNote')?.value.trim()||'';

  // Construire un libellé automatique si desc vide
  const autoDesc = [type, localisation, cote==='G'?'Gauche':cote==='D'?'Droite':cote==='B'?'Bilatéral':''].filter(Boolean).join(' ');
  if(!autoDesc && !desc){ alert('Veuillez renseigner au minimum une appellation ou une localisation.'); return; }

  const dateVal=date?(date+'-01'):'';
  const bc=getCurrSess(p).bodyChart||{};
  const zonesFromChart=Object.entries(bc).filter(([,lvl])=>lvl>0).map(([id,lvl])=>({id,lvl}));

  // Zones automatiques depuis localisation + côté
  const coteKey=cote==='G'?'G':cote==='D'?'D':cote==='B'?'B':'D';
  const autoZoneIds=(LOC_TO_ZONES[localisation]||{})[coteKey]||[];
  const autoZones=autoZoneIds.filter(id=>!bc[id]).map(id=>({id,lvl:1}));
  const zones=[...zonesFromChart,...autoZones].filter((z,i,arr)=>arr.findIndex(x=>x.id===z.id)===i);

  const entry={
    date:dateVal, categorie, type, localisation, cote,
    desc: desc || autoDesc,
    duration, perturbeEncore:_injPerturbe, perturbeNote, zones
  };
  if(_injEditIdx!==null&&_injEditIdx<p.injuries.length){
    entry.id=p.injuries[_injEditIdx].id;
    p.injuries[_injEditIdx]=entry;
  } else {
    entry.id=Date.now().toString();
    p.injuries.push(entry);
  }
  _injPerturbe=true; _injCote=''; _injEditIdx=null;
  injFormOpen=false; save(); renderForm(p);
}
function delInjury(pid,idx){
  const p=players.find(x=>x.id===pid); if(!p||!p.injuries) return;
  const btn=event?.currentTarget;
  if(btn&&btn._confirmPending){
    clearTimeout(btn._confirmTimer);
    p.injuries.splice(idx,1); save(); renderForm(p);
  } else if(btn){
    btn._confirmPending=true;
    const orig=btn.innerHTML; btn.innerHTML='❓'; btn.style.background='var(--red)'; btn.style.color='#fff';
    btn._confirmTimer=setTimeout(()=>{btn._confirmPending=false;btn.innerHTML=orig;btn.style.background='';btn.style.color='var(--red)';},3000);
  } else {
    p.injuries.splice(idx,1); save(); renderForm(p);
  }
}

// ─── PROFIL MORPHOLOGIQUE AUTO ────────────────────────────
function buildProfilMorpho(p, sc){

  // ── 1. Archétype selon le poste ───────────────────────────
  const poste = (p.pos||'').toLowerCase();
  let archetype = { icon:'🤾', name:'Joueur Polyvalent', desc:'Profil généraliste — toutes qualités sollicitées.' };

  if(/ailier|ail\.|wing/i.test(poste)){
    archetype = { icon:'⚡', name:'Profil Ailier — Vitesse & Explosivité',
      desc:'Poste axé sur l\'accélération, la coordination et les appuis rapides. La légèreté corporelle et la mobilité des membres inférieurs sont des atouts clés.' };
  } else if(/pivot|line/i.test(poste)){
    archetype = { icon:'💪', name:'Profil Pivot — Force & Résistance au Contact',
      desc:'Poste axé sur la résistance physique, la stabilité articulaire et la puissance musculaire. La solidité du gainage et des membres inférieurs est primordiale.' };
  } else if(/arrière|back|arriè/i.test(poste)){
    archetype = { icon:'🏋️', name:'Profil Arrière — Puissance & Polyvalence',
      desc:'Poste combinant force de frappe, explosivité et endurance. L\'épaule et les membres inférieurs sont fortement sollicités lors des tirs en suspension.' };
  } else if(/demi.centre|meneur|playmaker/i.test(poste)){
    archetype = { icon:'🎯', name:'Profil Demi-Centre — Technique & Vision',
      desc:'Poste exigeant coordination fine, mobilité globale et gestion de l\'effort. L\'intégrité rachidienne et des membres supérieurs est centrale.' };
  } else if(/gardien|goal|gk/i.test(poste)){
    archetype = { icon:'🧤', name:'Profil Gardien — Réactivité & Amplitude',
      desc:'Poste nécessitant une mobilité globale maximale, des membres supérieurs et une stabilité unipodale importante pour les déplacements latéraux.' };
  }

  // ── 2. IMC ─────────────────────────────────────────────────
  const ta = parseFloat(p.ta), po = parseFloat(p.po);
  let imcVal = null, imcLabel = '—', imcColor = 'var(--text-3)';
  if(ta>0 && po>0){
    imcVal = Math.round(po/(ta/100)**2 * 10)/10;
    if(imcVal < 18.5)      { imcLabel='Sous-poids';              imcColor='var(--orange)'; }
    else if(imcVal < 22)   { imcLabel='Morphotype léger';        imcColor='var(--cyan)'; }
    else if(imcVal < 25)   { imcLabel='Morphotype équilibré';    imcColor='var(--green)'; }
    else if(imcVal < 28)   { imcLabel='Morphotype puissant';     imcColor='var(--cyan)'; }
    else                   { imcLabel='IMC élevé';               imcColor='var(--orange)'; }
  }

  // ── 3. %MG ─────────────────────────────────────────────────
  const mg = parseFloat(p.mgPct);
  let mgLabel = '—', mgColor = 'var(--text-3)', mgNote = '';
  if(!isNaN(mg)){
    if(mg < 8)       { mgLabel='Très faible'; mgColor='var(--orange)'; mgNote='Risque de déficit énergétique'; }
    else if(mg < 12) { mgLabel='Excellent'; mgColor='var(--green)'; mgNote='Optimal pour sport d\'explosivité'; }
    else if(mg < 15) { mgLabel='Correct'; mgColor='var(--cyan)'; mgNote='Favorable aux postes dynamiques'; }
    else if(mg < 20) { mgLabel='Acceptable'; mgColor='var(--orange)'; mgNote='Marge de progression possible'; }
    else             { mgLabel='À améliorer'; mgColor='var(--red)'; mgNote='Impact sur les performances explosives'; }
  }

  // ── 4. Tableau score global ────────────────────────────────
  const scoreRanges = [
    { min:0,  max:39,  label:'Risque élevé',          desc:'Déficits importants, priorité préventive',   color:'var(--red)' },
    { min:40, max:49,  label:'Correct — déficits ciblés', desc:'Base solide avec zones à corriger',      color:'var(--orange)' },
    { min:50, max:59,  label:'Bon niveau fonctionnel', desc:'Profil stable, optimisation possible',       color:'var(--cyan)' },
    { min:60, max:69,  label:'Très bon niveau',        desc:'Athlète performant, entretien préventif',    color:'#eab308' },
    { min:70, max:100, label:'Excellent',               desc:'Profil fonctionnel optimal',                color:'var(--green)' },
  ];
  const activeRange = scoreRanges.find(r => sc.t >= r.min && sc.t <= r.max);

  // ── 5. Forces & faiblesses par section ────────────────────
  const forces = [], faiblesses = [];
  TESTS.forEach(sec => {
    const s = sc.secs[sec.id];
    if(!s || s.filled === 0) return;
    const pct = Math.round(s.pts / s.max * 100);
    if(pct >= 80) forces.push({ label: sec.title, pct, color:'var(--green)' });
    else if(pct <= 50) faiblesses.push({ label: sec.title, pct, color: pct<=30?'var(--red)':'var(--orange)' });
  });

  // ── 6. Tags morpho ────────────────────────────────────────
  const tags = [];
  if(imcVal !== null) tags.push({ label: `IMC ${imcVal}`, cls: imcVal<22?'rpt-tag-cyan':imcVal<25?'rpt-tag-green':'rpt-tag-orange' });
  if(!isNaN(mg))      tags.push({ label: `${mg}% MG — ${mgLabel}`, cls: mg<12?'rpt-tag-green':mg<15?'rpt-tag-cyan':'rpt-tag-orange' });
  if(ta>0&&po>0)      tags.push({ label:`${ta} cm / ${po} kg`, cls:'rpt-tag-cyan' });
  const scoreCls = sc.t>=70?'rpt-tag-green':sc.t>=50?'rpt-tag-cyan':sc.t>=40?'rpt-tag-orange':'rpt-tag-red';
  tags.push({ label: `Score ${sc.t}% — ${activeRange?.label||''}`, cls: scoreCls });

  return { archetype, imcVal, imcLabel, imcColor, mg, mgLabel, mgColor, mgNote, scoreRanges, activeRange, forces, faiblesses, tags };
}

function renderProfilSection(p, sc){
  const d = buildProfilMorpho(p, sc);
  const age = p.ddn ? Math.floor((Date.now()-new Date(p.ddn))/(365.25*24*3600*1000)) : null;

  const tagsHtml = d.tags.map(t=>`<span class="rpt-tag ${t.cls}">${t.label}</span>`).join('');

  const tableRows = d.scoreRanges.map(r=>{
    const isActive = d.sc === r || (d.activeRange && d.activeRange.min===r.min);
    const active = d.activeRange && d.activeRange.min===r.min;
    return `<tr class="${active?'active-row':''}">
      <td style="font-family:'Bebas Neue',sans-serif;letter-spacing:1px;color:${r.color}">
        ${active?'▶ ':''} ${r.min}–${r.max===100?'+':r.max}
      </td>
      <td style="font-weight:600;color:${active?r.color:'var(--text-2)'}">${r.label}</td>
      <td style="color:var(--text-3)">${r.desc}</td>
    </tr>`;
  }).join('');

  const forcesHtml = d.forces.length
    ? d.forces.map(f=>`<div class="rpt-ff-item"><div class="rpt-ff-dot" style="background:${f.color}"></div>${f.label} <span style="margin-left:auto;font-family:'Bebas Neue',sans-serif;color:${f.color}">${f.pct}%</span></div>`).join('')
    : '<div style="font-size:12px;color:var(--text-3);padding:4px 0">Données insuffisantes</div>';

  const faiblessesHtml = d.faiblesses.length
    ? d.faiblesses.map(f=>`<div class="rpt-ff-item"><div class="rpt-ff-dot" style="background:${f.color}"></div>${f.label} <span style="margin-left:auto;font-family:'Bebas Neue',sans-serif;color:${f.color}">${f.pct}%</span></div>`).join('')
    : '<div style="font-size:12px;color:var(--green);padding:4px 0">✅ Aucune faiblesse majeure</div>';

  return `<div class="rpt-profil-section">
    <div class="rpt-profil-hd">
      <span class="section-badge" style="background:linear-gradient(135deg,rgba(0,200,230,.15),rgba(232,168,32,.1));color:var(--cyan);border:1px solid rgba(0,200,230,.25)">PROFIL</span>
      <span class="rpt-section-title">Interprétation du Profil Morphologique</span>
    </div>
    <div class="rpt-profil-body">

      <!-- Archétype -->
      <div class="rpt-archetype">
        <div class="rpt-archetype-icon">${d.archetype.icon}</div>
        <div class="rpt-archetype-info">
          <div class="rpt-archetype-label">Archétype · ${p.pos||'Poste non renseigné'}</div>
          <div class="rpt-archetype-name">${d.archetype.name}</div>
          <div class="rpt-archetype-desc">${d.archetype.desc}</div>
          <div class="rpt-archetype-tags">${tagsHtml}</div>
        </div>
      </div>

      <!-- Indicateurs physiques -->
      <div class="rpt-indicators">
        <div class="rpt-indic-card">
          <div class="rpt-indic-label">IMC</div>
          <div class="rpt-indic-val" style="color:${d.imcColor}">${d.imcVal??'—'}</div>
          <div class="rpt-indic-sub">${d.imcLabel}</div>
        </div>
        <div class="rpt-indic-card">
          <div class="rpt-indic-label">Masse Grasse</div>
          <div class="rpt-indic-val" style="color:${d.mgColor}">${!isNaN(d.mg)?d.mg+'%':'—'}</div>
          <div class="rpt-indic-sub">${d.mgNote||d.mgLabel}</div>
        </div>
        <div class="rpt-indic-card">
          <div class="rpt-indic-label">Score global</div>
          <div class="rpt-indic-val" style="color:${d.activeRange?.color||'var(--text)'}">
            ${sc.t}%
          </div>
          <div class="rpt-indic-sub">${d.activeRange?.label||'—'}</div>
        </div>
      </div>

      <!-- Tableau d'interprétation -->
      <div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:2px;color:var(--text-3);margin-bottom:8px">GRILLE D'INTERPRÉTATION DU SCORE</div>
        <table class="rpt-score-table">
          <thead><tr><th>Score</th><th>Niveau</th><th>Interprétation</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>

      <!-- Forces / Faiblesses -->
      <div class="rpt-ff-grid">
        <div class="rpt-ff-card">
          <div class="rpt-ff-title" style="color:var(--green)">✅ Points Forts</div>
          ${forcesHtml}
        </div>
        <div class="rpt-ff-card">
          <div class="rpt-ff-title" style="color:var(--orange)">⚠️ Points à Améliorer</div>
          ${faiblessesHtml}
        </div>
      </div>

    </div>
  </div>`;
}
