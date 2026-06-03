// Fenix Toulouse — ui/form-render.js
// Affichage principal du formulaire.
// Ce fichier ne contient que le rendu.
function renderForm(_p){
  // Rebind vers la session courante
  const sidx = getCurrSidx(_p);
  const sess = getSess(_p, sidx);
  const p = { ..._p, ...sess, d:sess.d||{}, bodyChart:sess.bodyChart||{} };

  const s = calcScore(_p.id, sidx);
  const ds = p.dt ? new Date(p.dt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—';
  document.getElementById('topbarTitle').textContent = (_p.pr+' '+_p.n).toUpperCase();
  document.getElementById('topbarMeta').textContent = (_p.gr||'')+(_p.pos?' — '+_p.pos:'');
  document.getElementById('dateChip').textContent = ds;
  const tb = document.getElementById('topbarAvatar');
  const fpos = _p.facePos ? `${_p.facePos.x}% ${_p.facePos.y}%` : '50% 25%';
  if(_p.photo){ tb.innerHTML=`<img src="${_p.photo}" alt="${_p.pr}" style="object-position:${fpos}">`; tb.classList.add('has-photo'); }
  else { tb.innerHTML=ini(_p.n,_p.pr); tb.classList.remove('has-photo'); }

  let avatarInner;
  if(_p.photo){ const aPos=_p.facePos?`${_p.facePos.x}% ${_p.facePos.y}%`:'50% 25%'; avatarInner=`<img src="${_p.photo}" alt="${_p.pr}" style="object-position:${aPos}"><div class="avatar-overlay"><div class="avatar-overlay-icon">📷</div><div class="avatar-overlay-text">Changer</div></div>`; }
  else if(_p.essai){ avatarInner=`<div class="avatar-ghost">${ghostSVG(52)}</div><div class="avatar-overlay"><div class="avatar-overlay-icon">📷</div><div class="avatar-overlay-text">Ajouter photo</div></div>`; }
  else { avatarInner=`${ini(_p.n,_p.pr)}<div class="avatar-overlay"><div class="avatar-overlay-icon">📷</div><div class="avatar-overlay-text">Ajouter photo</div></div>`; }

  // Session pills
  const sessBar = (_p.sessions||[]).map((sx,i)=>{
    const sd=sx.dt?new Date(sx.dt).toLocaleDateString('fr-FR',{month:'short',year:'2-digit'}):`S${i+1}`;
    const sc=calcScore(_p.id,i);
    const cc=sc.t>=70?'var(--green)':sc.t>=40?'var(--orange)':'var(--red)';
    return `<button class="sess-pill${i===sidx?' active':''}" onclick="selSession('${_p.id}',${i})">
      <span class="sess-pill-date">${sd}</span>
      <span class="sess-pill-score" style="color:${cc}">${sc.t}%</span>
    </button>`;
  }).join('');

  // ── Calcul %MG selon la formule choisie ──────────────────
  function calcJP7(){
    const age = _p.ddn ? Math.floor((Date.now()-new Date(_p.ddn))/(365.25*24*3600*1000)) : null;
    const sexe = _p.sexe||'H';
    const formuleCle = p.formulePlis||'jp7';
    const f = FORMULES_PLIS[formuleCle];
    if(!f||!age) return null;
    const plis = sexe==='F' ? f.plis_F : f.plis_H;
    const vals = plis.map(k=>parseFloat(p[k]||'')).filter(v=>!isNaN(v)&&v>0);
    if(vals.length < plis.length) return null;
    const sum = vals.reduce((a,b)=>a+b,0);
    const {D, pct, sites} = f.calc(sum, age, sexe);
    return {sum:Math.round(sum*10)/10, pct:Math.round(pct*10)/10, D:Math.round(D*1000)/1000, label:f.label, sites};
  }
  const jp7 = calcJP7();
  const jp7Color = jp7 ? (jp7.pct<10?'var(--cyan)':jp7.pct<15?'var(--green)':jp7.pct<20?'#eab308':jp7.pct<25?'var(--orange)':'var(--red)') : 'var(--text-3)';

  // ── Âge calculé ───────────────────────────────────────────
  const ageCalc = _p.ddn ? Math.floor((Date.now()-new Date(_p.ddn))/(365.25*24*3600*1000)) : null;

  // ── Zones à surveiller depuis antécédents ─────────────────
  const injZoneIds = new Set();
  (_p.injuries||[]).forEach(inj=>{
    (inj.zones||[]).forEach(z=>{ if(z.id) injZoneIds.add(z.id); });
  });

  let h = `
  <!-- SESSION SELECTOR -->
  <div class="session-selector">
    <div class="sess-label">📅 Sessions</div>
    <div class="sess-pills">${sessBar}</div>
    <div style="display:flex;gap:4px;margin-left:auto">
      <button class="sess-new-btn" onclick="newSession('${_p.id}')" title="Nouvelle session">＋</button>
      ${(_p.sessions||[]).length>1?`<button onclick="delSession('${_p.id}',${sidx})" title="Supprimer cette session"
        style="padding:5px 10px;border:1px solid var(--red-border);background:none;
          color:var(--red);border-radius:6px;cursor:pointer;font-size:14px;
          transition:all .15s;line-height:1"
        onmouseover="this.style.background='var(--red-dim)'"
        onmouseout="this.style.background='none'">🗑</button>`:''}
    </div>
  </div>

  <!-- ══════════ ① IDENTITÉ ══════════ -->
  <div class="fiche-section" id="fs_id">
    <div class="fiche-section-hd fiche-hd-id" onclick="toggleFicheSection('id')">
      <span class="section-badge badge-mob">① IDENTITÉ</span>
      <span class="fiche-section-title">${(_p.pr||_p.n) ? (_p.pr+' '+_p.n).toUpperCase() : 'Identité du Joueur'}</span>
      <div class="athlete-avatar-big" onclick="event.stopPropagation();triggerPhoto('${_p.id}')" title="Photo" style="width:44px;height:44px;font-size:16px;flex-shrink:0">${avatarInner}</div>
      <span class="section-chevron open" id="chev_id" style="margin-left:8px">▼</span>
    </div>
    <div class="fiche-section-body" id="fsb_id">
      <div class="fiche-grid" style="margin-bottom:12px">
        <div class="fiche-field">
          <div class="fiche-label">Prénom</div>
          <input class="fiche-input" value="${_p.pr}" onchange="uf('pr',this.value)" placeholder="Thomas">
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Nom</div>
          <input class="fiche-input" value="${_p.n}" onchange="uf('n',this.value)" placeholder="MARTIN">
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Sexe</div>
          <select class="fiche-select" onchange="uf('sexe',this.value)">
            <option value="H" ${(_p.sexe||'H')==='H'?'selected':''}>Homme</option>
            <option value="F" ${_p.sexe==='F'?'selected':''}>Femme</option>
          </select>
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Date de naissance</div>
          <input class="fiche-input" type="date" value="${_p.ddn||''}" onchange="uf('ddn',this.value)">
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Âge</div>
          <div class="fiche-age-display">${ageCalc!==null?ageCalc+' ans':'—'}</div>
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Groupe</div>
          <select class="fiche-select" onchange="uf('gr',this.value)">
            <option value="" ${!_p.gr?'selected':''}>— Sélectionner —</option>
            <option value="PRO A" ${_p.gr==='PRO A'?'selected':''}>PRO A</option>
            <option value="-18" ${_p.gr==='-18'?'selected':''}>-18</option>
            <option value="CF" ${_p.gr==='CF'?'selected':''}>CF</option>
            <option value="Essai" ${_p.gr==='Essai'?'selected':''}>Essai</option>
          </select>
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Poste</div>
          <input class="fiche-input" value="${_p.pos||''}" onchange="uf('pos',this.value)" placeholder="Ailier Gauche">
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Main Dominante</div>
          <select class="fiche-select" onchange="uf('mainDom',this.value)">
            <option value="" ${!_p.mainDom?'selected':''}>— Sélectionner —</option>
            <option value="Droitier" ${_p.mainDom==='Droitier'?'selected':''}>Droitier</option>
            <option value="Gaucher" ${_p.mainDom==='Gaucher'?'selected':''}>Gaucher</option>
            <option value="Ambidextre" ${_p.mainDom==='Ambidextre'?'selected':''}>Ambidextre</option>
          </select>
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Date du Test</div>
          <input class="fiche-input" type="date" value="${p.dt||''}" onchange="uf('dt',this.value)">
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end">
        ${_p.photo?`<button class="btn btn-outline" style="padding:4px 10px;font-size:11px;color:var(--red);border-color:var(--red-border)" onclick="removePhoto('${_p.id}')">✕ Supprimer photo</button>`:''}
        <button class="btn btn-danger" onclick="delPlayer('${_p.id}')">🗑 Supprimer le joueur</button>
      </div>
    </div>
  </div>

  <!-- SCORES (toujours visibles) -->
  <div class="score-summary">
    <div class="score-card s-cyan"><div class="score-card-num" id="sc_t">${s.t}<span style="font-size:22px">%</span></div><div class="score-card-label">Score Global</div></div>
    <div class="score-card s-green"><div class="score-card-num" id="sc_3">${s.s3}</div><div class="score-card-label">● Score 3</div></div>
    <div class="score-card" style="border-bottom:3px solid var(--yellow)"><div class="score-card-num" id="sc_2" style="color:var(--yellow)">${s.s2}</div><div class="score-card-label">● Score 2</div></div>
    <div class="score-card s-red"><div class="score-card-num" id="sc_01">${s.s1+s.s0}</div><div class="score-card-label">● Score 0–1</div></div>
  </div>

  <!-- ══════════ ② ANTHROPOMÉTRIE ══════════ -->
  <div class="fiche-section" id="fs_anthro">
    <div class="fiche-section-hd fiche-hd-anthro" onclick="toggleFicheSection('anthro')">
      <span class="section-badge badge-puiss">② ANTHROPO</span>
      <span class="fiche-section-title">Anthropométrie & Composition Corporelle</span>
      <span class="section-chevron open" id="chev_anthro" style="margin-left:auto">▼</span>
    </div>
    <div class="fiche-section-body" id="fsb_anthro">

      <!-- Taille / Poids -->
      <div class="fiche-grid" style="margin-bottom:16px">
        <div class="fiche-field">
          <div class="fiche-label">Taille (cm)</div>
          <input class="fiche-input" type="number" value="${p.ta||''}" placeholder="184" onchange="uf('ta',this.value)">
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Poids (kg)</div>
          <input class="fiche-input" type="number" step="0.1" value="${p.po||''}" placeholder="82.5" onchange="uf('po',this.value)">
        </div>
      </div>

      <!-- Sélecteur de formule + Plis cutanés dynamiques -->
      ${(()=>{
        const formuleCle = p.formulePlis||'jp7';
        const f = FORMULES_PLIS[formuleCle];
        const sexe = _p.sexe||'H';
        const plis = sexe==='F' ? f.plis_F : f.plis_H;
        const labels = sexe==='F' ? f.labels_F : f.labels_H;

        const selectorHtml = `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap">
            <div style="font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:2.5px;color:var(--text-3)">PLIS CUTANÉS — FORMULE</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              ${Object.entries(FORMULES_PLIS).map(([k,v])=>`
                <button class="formule-btn" data-formule="${k}" onclick="selectFormulePlis('${k}')"
                  style="padding:5px 12px;border-radius:6px;cursor:pointer;font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:1px;border:1px solid ${formuleCle===k?'var(--cyan)':'var(--border-2)'};background:${formuleCle===k?'var(--cyan-dim)':'none'};color:${formuleCle===k?'var(--cyan)':'var(--text-3)'};transition:all .15s">
                  ${k==='jp3'?'JP 3 plis':k==='durnin4'?'Durnin 4 plis':'JP 7 plis'}
                </button>`).join('')}
            </div>
            <div id="formuleLabelActif" style="font-size:11px;color:var(--text-3);font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px">${f.label}</div>
          </div>`;

        const gridHtml = plis.map((k,i)=>`
          <div class="pli-field">
            <div class="pli-label">${'①②③④⑤⑥⑦'[i]} ${labels[i]}</div>
            <input class="pli-input" type="number" step="0.1" value="${p[k]||''}"
              placeholder="—" data-key="${k}"
              onchange="uf('${k}',this.value);refreshJP7()">
            <div class="pli-unit">mm</div>
          </div>`).join('');

        return selectorHtml + `<div class="pli-grid" id="pliGridContainer">${gridHtml}</div>`;
      })()}

      <!-- Résultat %MG -->
      <div class="jp7-result" id="jp7Result">
        ${jp7 ? `
          <div class="jp7-score">
            <div class="jp7-pct" style="color:${jp7Color}">${jp7.pct}%</div>
            <div class="jp7-lbl">Masse Grasse</div>
          </div>
          <div class="jp7-detail">
            <div>Σ ${jp7.sites} plis : <strong style="color:var(--text)">${jp7.sum} mm</strong></div>
            <div>Densité corporelle : <strong style="color:var(--text)">${jp7.D}</strong></div>
            <div style="margin-top:4px">${jp7.pct<10?'💪 Très faible (Elite)':jp7.pct<15?'✅ Excellent':jp7.pct<20?'🟡 Correct':jp7.pct<25?'⚠️ À surveiller':'🔴 Élevé'}</div>
            <div class="jp7-formula">${jp7.label} — ${_p.sexe==='F'?'Femme':'Homme'} · ${ageCalc} ans</div>
          </div>` :
          `<div style="font-size:12px;color:var(--text-3);font-family:'Barlow',sans-serif">
            Renseignez tous les plis requis et la date de naissance pour calculer automatiquement.
          </div>`}
      </div>

      <!-- Tours de membres -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:2.5px;color:var(--text-3);margin:16px 0 8px">
        PÉRIMÈTRES
      </div>
      <div class="tour-grid">
        <div class="fiche-field">
          <div class="fiche-label">Tour de Cuisse (cm)</div>
          <input class="fiche-input" type="number" step="0.5" value="${p.tourCuisse||''}" placeholder="—" onchange="uf('tourCuisse',this.value)">
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Tour de Bras (cm)</div>
          <input class="fiche-input" type="number" step="0.5" value="${p.tourBras||''}" placeholder="—" onchange="uf('tourBras',this.value)">
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Tour de Taille (cm)</div>
          <input class="fiche-input" type="number" step="0.5" value="${p.tourTaille||''}" placeholder="—" onchange="uf('tourTaille',this.value)">
        </div>
        <div class="fiche-field">
          <div class="fiche-label">Tour de Buste (cm)</div>
          <input class="fiche-input" type="number" step="0.5" value="${p.tourBuste||''}" placeholder="—" onchange="uf('tourBuste',this.value)">
        </div>
      </div>

      <!-- Longueur main dominante -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:2.5px;color:var(--text-3);margin:16px 0 8px">
        MESURE MAIN DOMINANTE
      </div>
      <div class="fiche-grid" style="margin-bottom:0">
        <div class="fiche-field">
          <div class="fiche-label">Longueur main dominante (cm) <span style="font-size:10px;color:var(--text-3)">— Réf. Shoulder FMS</span></div>
          <input class="fiche-input" type="number" step="0.1" value="${p.lgMainDom||''}" placeholder="Ex: 19.5" onchange="uf('lgMainDom',this.value)">
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════ ③ ANTÉCÉDENTS MÉDICAUX ══════════ -->
  <div class="fiche-section" id="fs_med">
    <div class="fiche-section-hd fiche-hd-med" onclick="toggleFicheSection('med')">
      <span class="section-badge badge-force">③ ATCD MED</span>
      <span class="fiche-section-title">Antécédents Médicaux — Blessures</span>
      <span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text-3);margin-left:auto">${(_p.injuries||[]).length} blessure(s)</span>
      <span class="section-chevron open" id="chev_med" style="margin-left:10px">▼</span>
    </div>
    <div class="fiche-section-body" id="fsb_med">
      <div class="inj-list" id="injList">
        ${(_p.injuries||[]).length===0?`<div style="font-size:12px;color:var(--text-3);padding:4px 0">Aucun antécédent enregistré.</div>`:
          (_p.injuries||[]).map((inj,idx)=>{
            const d=inj.date?new Date(inj.date).toLocaleDateString('fr-FR',{month:'long',year:'numeric'}):'—';
            const resolved = inj.perturbeEncore===false||inj.perturbeEncore==='false';
            return `<div class="inj-card${resolved?' inj-resolved':''}">
              <div class="inj-card-top">
                <div class="inj-card-info">
                  <div class="inj-card-desc">${inj.desc||'—'}</div>
                  <div class="inj-card-meta">
                    <span>📅 ${d}</span>
                    ${inj.type?`<span>🏷 ${inj.type}</span>`:''}
                    ${inj.localisation?`<span>📍 ${inj.localisation}</span>`:''}
                    ${inj.duration?`<span>⏱ ${inj.duration}</span>`:''}
                    <span class="inj-perturbe-badge ${inj.perturbeEncore===true||inj.perturbeEncore==='true'?'inj-perturbe-oui':'inj-perturbe-non'}">
                      ${inj.perturbeEncore===true||inj.perturbeEncore==='true'?'⚠ Perturbe encore':'✓ Résolu'}
                    </span>
                    ${inj.perturbeNote?`<span style="font-size:11px;color:var(--orange);font-style:italic">${inj.perturbeNote}</span>`:''}
                  </div>
                </div>
                <div style="display:flex;gap:4px;flex-shrink:0">
                  <button class="btn btn-outline" style="padding:4px 8px;font-size:11px;color:var(--cyan);border-color:rgba(0,200,230,.3)" onclick="openEditInjury('${_p.id}',${idx})">✏️</button>
                  <button class="btn btn-outline" style="padding:4px 8px;font-size:11px;color:var(--red);border-color:var(--red-border)" onclick="delInjury('${_p.id}',${idx})">✕</button>
                </div>
              </div>
            </div>`;
          }).join('')}
      </div>
      ${injFormOpen ? renderInjFormHTML(_p.id) : `<button class="add-injury-btn" onclick="openInjuryForm()">＋ Enregistrer un antécédent</button>`}
    </div>
  </div>

  <!-- ══════════ ④ BLESSURES ACTUELLES ══════════ -->
  <div class="fiche-section" id="fs_corp">
    <div class="fiche-section-hd fiche-hd-corp" onclick="toggleFicheSection('corp')">
      <span class="section-badge" style="background:rgba(245,158,11,.15);color:var(--orange);border:1px solid rgba(245,158,11,.3)">④ CORP</span>
      <span class="fiche-section-title">État Corporel Actuel</span>
      <span class="section-chevron open" id="chev_corp" style="margin-left:auto">▼</span>
    </div>
    <div class="fiche-section-body" id="fsb_corp">
      <div style="font-size:11px;color:var(--text-3);margin-bottom:10px;font-family:'Barlow',sans-serif;line-height:1.6">
        Cliquez sur les zones pour indiquer l'intensité de la douleur (1 clic = gêne, 2 = douleur, 3 = vive douleur, 4 = effacer).
        <span style="color:rgba(239,68,68,.8)"> Zones en rouge pointillé = antécédents.</span>
      </div>
      <div id="bm2SvgWrap" style="max-width:100%;overflow-x:auto">
        <svg id="bm2Svg" viewBox="0 0 1366 1024" width="736" height="552" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:100%;cursor:pointer;background:#fff">
  <image href="assets/img/datauri_2.png" x="-137" y="-7" width="768" height="1024"/>
  <image href="assets/img/datauri_3.png"  x="728"  y="-7" width="768" height="1024"/>
  <text x="302"  y="1010" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#bbb">FACE</text>
  <text x="1068" y="1010" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#bbb">DOS</text>
  <path class="bz2 bz2-0" id="bz2_cou_f" data-zone="cou_f" onclick="clickBodyZone2(event,'cou_f')" d="M284.08 185.424L275 138L302.743 153.808L332 138L322.92 185.424L302.743 215L284.08 185.424Z"><title>Cou</title></path>
  <path class="bz2 bz2-0" id="bz2_tete_f" data-zone="tete_f" onclick="clickBodyZone2(event,'tete_f')" d="M263.5 50.5L261 83.5L255 86V95.5L258 106.5L266 110.5L275 139.5L291.5 150.5H313.5L333.5 137L339.5 110.5L349 102.5V86L342.5 83.5L339.5 50.5L327 35.5L301.5 28.5L282.5 32.5L263.5 50.5Z"><title>Tête</title></path>
  <path class="bz2 bz2-0" id="bz2_trap_d" data-zone="trap_d" onclick="clickBodyZone2(event,'trap_d')" d="M272 163L275 138.5L283.5 185.5L299.5 212L260.5 201L236 198H216L272 163Z"><title>Trapèze D</title></path>
  <path class="bz2 bz2-0" id="bz2_trap_g" data-zone="trap_g" onclick="clickBodyZone2(event,'trap_g')" d="M321 205L303.5 215L323 185L332.5 138.5V154.5L338 167.5L383 195.5L343 199.5L321 205Z"><title>Trapèze G</title></path>
  <path class="bz2 bz2-0" id="bz2_epaule_d" data-zone="epaule_d" onclick="clickBodyZone2(event,'epaule_d')" d="M218.5 206.5L215 200L189 206.5L170 220L158 242V279.5L179 268L186.5 258.5L206 242L218.5 220V206.5Z"><title>Épaule D</title></path>
  <path class="bz2 bz2-0" id="bz2_epaule_g" data-zone="epaule_g" onclick="clickBodyZone2(event,'epaule_g')" d="M386.5 215.5L390.5 199L417 206L436 218.5L447.5 240.5V280L428.5 267L394.5 235L386.5 215.5Z"><title>Épaule G</title></path>
  <path class="bz2 bz2-0" id="bz2_pec_d" data-zone="pec_d" onclick="clickBodyZone2(event,'pec_d')" d="M207.5 271L205 243.5L215.5 226.5L219 214L215.5 201.5L221 198L264 201.5L303 214V287.5L290.5 291L247.5 294L223.5 287.5L207.5 271Z"><title>Pectoral D</title></path>
  <path class="bz2 bz2-0" id="bz2_pec_g" data-zone="pec_g" onclick="clickBodyZone2(event,'pec_g')" d="M320 205.5L304 215V287.5L332 293H368.5L386.5 287.5L398 272.5L400.5 242L394 234L386.5 215L390.5 200L381.5 195.5L341.5 200L320 205.5Z"><title>Pectoral G</title></path>
  <path class="bz2 bz2-0" id="bz2_cote_d" data-zone="cote_d" onclick="clickBodyZone2(event,'cote_d')" d="M179 268L158 279L151.5 306.5L147 341.5L162 360.5H179L190 353.5L205.5 316L207.5 272.5L194 268H179Z"><title>Côtes D</title></path>
  <path class="bz2 bz2-0" id="bz2_cote_g" data-zone="cote_g" onclick="clickBodyZone2(event,'cote_g')" d="M408 267L398.5 274V311L411.5 348.5L421.5 358L440.5 361L448 356L458.5 340.5L448 280L427.5 267H408Z"><title>Côtes G</title></path>
  <path class="bz2 bz2-0" id="bz2_avbras_d" data-zone="avbras_d" onclick="clickBodyZone2(event,'avbras_d')" d="M132 365L147 343L162.5 359.5H179L189.5 354.5V379L179 405.5L155.5 446.5L132 482.5L106 474.5L118 434.5L124 394L132 365Z"><title>Avant-bras D</title></path>
  <path class="bz2 bz2-0" id="bz2_avbras_g" data-zone="avbras_g" onclick="clickBodyZone2(event,'avbras_g')" d="M415.5 375V353L420.5 358.5L440.5 360.5L449 356.5L459 342L476 370L486 412L494.5 456L500.5 476L472.5 480.5L436 421L415.5 375Z"><title>Avant-bras G</title></path>
  <path class="bz2 bz2-0" id="bz2_poignet_d" data-zone="poignet_d" onclick="clickBodyZone2(event,'poignet_d')" d="M133.5 483L107.5 473L99.5 479L133.5 491.5V483Z"><title>Poignet D</title></path>
  <path class="bz2 bz2-0" id="bz2_poignet_g" data-zone="poignet_g" onclick="clickBodyZone2(event,'poignet_g')" d="M499.5 476L472.5 480.5V488.5L508 480.5L499.5 476Z"><title>Poignet G</title></path>
  <path class="bz2 bz2-0" id="bz2_main_d" data-zone="main_d" onclick="clickBodyZone2(event,'main_d')" d="M56.5 514.5L97 480L134 493L119.5 556.5L108 566.5L81.5 556.5V514.5L61 519.5L56.5 514.5Z"><title>Main D</title></path>
  <path class="bz2 bz2-0" id="bz2_main_g" data-zone="main_g" onclick="clickBodyZone2(event,'main_g')" d="M485.5 557.5L473 488.5L505.5 480L523.5 488.5L548 513V519L523.5 513L528.5 551.5L523.5 562.5L505.5 567L485.5 557.5Z"><title>Main G</title></path>
  <path class="bz2 bz2-0" id="bz2_oblique_d" data-zone="oblique_d" onclick="clickBodyZone2(event,'oblique_d')" d="M251.5 327.5L228 362.5L209.5 305.5V274.5L243.5 294.5L302.5 288V305.5L251.5 327.5Z"><title>Oblique D</title></path>
  <path class="bz2 bz2-0" id="bz2_oblique_g" data-zone="oblique_g" onclick="clickBodyZone2(event,'oblique_g')" d="M304.5 306V287L327.5 293.5H369.5L384 287L398 274.5V313L375.5 358.5L354 326L304.5 306Z"><title>Oblique G</title></path>
  <path class="bz2 bz2-0" id="bz2_abdomen" data-zone="abdomen" onclick="clickBodyZone2(event,'abdomen')" d="M256.5 449L247 336L302 305.5L350 324L360 336L350 454L311.5 524H292L256.5 449Z"><title>Abdomen</title></path>
  <path class="bz2 bz2-0" id="bz2_adduct_d" data-zone="adduct_d" onclick="clickBodyZone2(event,'adduct_d')" d="M247 335L230 361.5L216 463L293 525L259 451L247 335Z"><title>Adducteurs D</title></path>
  <path class="bz2 bz2-0" id="bz2_adduct_g" data-zone="adduct_g" onclick="clickBodyZone2(event,'adduct_g')" d="M350.5 454.5L361.5 338L375 359.5V392L389.5 464.5L312 525.5L350.5 454.5Z"><title>Adducteurs G</title></path>
  <path class="bz2 bz2-0" id="bz2_adduct_d2" data-zone="adduct_d2" onclick="clickBodyZone2(event,'adduct_d2')" d="M277.5 669L258 495.5L298 528V571.5L277.5 669Z"><title>Adducteurs D</title></path>
  <path class="bz2 bz2-0" id="bz2_adduct_g2" data-zone="adduct_g2" onclick="clickBodyZone2(event,'adduct_g2')" d="M350.5 493L310 527V570.5L327.5 673.5L345.5 589L350.5 493Z"><title>Adducteurs G</title></path>
  <path class="bz2 bz2-0" id="bz2_quad_d" data-zone="quad_d" onclick="clickBodyZone2(event,'quad_d')" d="M259 495.5L215.5 463L200 563.5L215.5 669.5H222.5L243.5 646L279 675L259 495.5Z"><title>Quadriceps D</title></path>
  <path class="bz2 bz2-0" id="bz2_quad_g" data-zone="quad_g" onclick="clickBodyZone2(event,'quad_g')" d="M391 462L351.5 494L346 587L331.5 668V676.5L365.5 648.5L386 668L395.5 664.5L407.5 593.5V538L391 462Z"><title>Quadriceps G</title></path>
  <path class="bz2 bz2-0" id="bz2_genou_d" data-zone="genou_d" onclick="clickBodyZone2(event,'genou_d')" d="M239 734.5L215.5 710.5V667.5H224L244 647.5L279.5 676.5L268.5 725H259L239 734.5Z"><title>Genou D</title></path>
  <path class="bz2 bz2-0" id="bz2_genou_g" data-zone="genou_g" onclick="clickBodyZone2(event,'genou_g')" d="M348.5 724.5H336.5L330 676.5L336.5 672.5L366 650.5L386.5 666H394V712L366 734.5L348.5 724.5Z"><title>Genou G</title></path>
  <path class="bz2 bz2-0" id="bz2_jambe_d" data-zone="jambe_d" onclick="clickBodyZone2(event,'jambe_d')" d="M239.5 733L216 711L211.5 747.5V811.5L231.5 915L239.5 907.5L255 903L275 915L270 876L283.5 771.5L270 723.5L239.5 733Z"><title>Tibia/Péroné D</title></path>
  <path class="bz2 bz2-0" id="bz2_jambe_g" data-zone="jambe_g" onclick="clickBodyZone2(event,'jambe_g')" d="M347 726H338L325.5 774L333 830.5L338 912.5L347 907L358 903L376.5 912.5L381.5 876.5L394 816L401.5 761.5L394 712L365.5 734.5L347 726Z"><title>Tibia/Péroné G</title></path>
  <path class="bz2 bz2-0" id="bz2_chev_d" data-zone="chev_d" onclick="clickBodyZone2(event,'chev_d')" d="M225.5 932.5L231 913.5L239.5 904H256L274.5 913.5L268.5 938L246.5 926L225.5 932.5Z"><title>Cheville D</title></path>
  <path class="bz2 bz2-0" id="bz2_chev_g" data-zone="chev_g" onclick="clickBodyZone2(event,'chev_g')" d="M335.5 922.5V912L359.5 904.5L381.5 912V932.5L359.5 928L339.5 938L335.5 922.5Z"><title>Cheville G</title></path>
  <path class="bz2 bz2-0" id="bz2_pied_d" data-zone="pied_d" onclick="clickBodyZone2(event,'pied_d')" d="M199 968L228 932L247 927.5L270.5 942.5L275 968L270.5 977H233H199V968Z"><title>Pied D</title></path>
  <path class="bz2 bz2-0" id="bz2_pied_g" data-zone="pied_g" onclick="clickBodyZone2(event,'pied_g')" d="M332 961.5L338 939.5L360 927L382.5 934L409.5 969V977.5H338L332 961.5Z"><title>Pied G</title></path>
  <path class="bz2 bz2-0" id="bz2_tete_b" data-zone="tete_b" onclick="clickBodyZone2(event,'tete_b')" d="M1033.5 34.5L1057 30.5L1081 38L1095 55V85.5H1102.5V97.5L1091.5 111L1081 137L1053.5 120.5L1027.5 137L1015.5 111L1009.5 97.5V85.5H1015.5V55L1033.5 34.5Z"><title>Tête</title></path>
  <path class="bz2 bz2-0" id="bz2_nuque" data-zone="nuque" onclick="clickBodyZone2(event,'nuque')" d="M1028.5 136.5L1055 122L1081.5 136.5L1087 163.5H1022.5L1028.5 136.5Z"><title>Nuque</title></path>
  <path class="bz2 bz2-0" id="bz2_omoplate_d" data-zone="omoplate_d" onclick="clickBodyZone2(event,'omoplate_d')" d="M1003.5 219L972 212.5L945.5 256L959 284.5L993 297.5H1029.5L1003.5 219Z"><title>Omoplate D</title></path>
  <path class="bz2 bz2-0" id="bz2_omoplate_g" data-zone="omoplate_g" onclick="clickBodyZone2(event,'omoplate_g')" d="M1079 296.5L1104.5 219.5L1138.5 213.5L1149.5 244L1163.5 256.5L1149.5 285.5L1122 296.5H1079Z"><title>Omoplate G</title></path>
  <path class="bz2 bz2-0" id="bz2_dorsal" data-zone="dorsal" onclick="clickBodyZone2(event,'dorsal')" d="M958.5 284L963 323L975 357.5L980.5 389L970.5 428.5H1000L1012.5 433.5L1052 453.5L1105 428.5L1136.5 433.5L1133.5 360.5L1152 311.5V284L1124.5 297.5H1081.5L1064 339.5H1044L1026.5 297.5"><title>Grand Dorsal</title></path>
  <path class="bz2 bz2-0" id="bz2_fessier_d" data-zone="fessier_d" onclick="clickBodyZone2(event,'fessier_d')" d="M961.5 489.5L972.5 435V428.5H996.5L1018 435L1051.5 455V532.5L1002.5 538.5L976.5 518L961.5 489.5Z"><title>Fessier D</title></path>
  <path class="bz2 bz2-0" id="bz2_fessier_g" data-zone="fessier_g" onclick="clickBodyZone2(event,'fessier_g')" d="M1093 542.5L1055 533.5V452L1104.5 427.5L1138.5 437L1148 492.5L1125 528.5L1093 542.5Z"><title>Fessier G</title></path>
  <path class="bz2 bz2-0" id="bz2_triceps_d" data-zone="triceps_d" onclick="clickBodyZone2(event,'triceps_d')" d="M895.5 344.5L911 268.5L945.5 255L957 286V307.5L939.5 362.5H931.5L915.5 368L904 362.5L895.5 344.5Z"><title>Triceps D</title></path>
  <path class="bz2 bz2-0" id="bz2_triceps_g" data-zone="triceps_g" onclick="clickBodyZone2(event,'triceps_g')" d="M1152.5 283.5L1163.5 257L1176 268.5H1197L1209.5 310L1214.5 345.5L1203 363.5L1189.5 368.5L1170 359L1152.5 310V283.5Z"><title>Triceps G</title></path>
  <path class="bz2 bz2-0" id="bz2_coude_d" data-zone="coude_d" onclick="clickBodyZone2(event,'coude_d')" d="M897.5 386.5L904 363.5L920 368L931.5 363.5L920 395L897.5 391V386.5Z"><title>Coude D</title></path>
  <path class="bz2 bz2-0" id="bz2_coude_g" data-zone="coude_g" onclick="clickBodyZone2(event,'coude_g')" d="M1190 393L1178 365.5L1190 370L1205 365.5L1211 393H1190Z"><title>Coude G</title></path>
  <path class="bz2 bz2-0" id="bz2_avbras_d_b" data-zone="avbras_d_b" onclick="clickBodyZone2(event,'avbras_d_b')" d="M878 377L896.5 344.5L905.5 364.5L896.5 390.5L920 396L932 364.5L940.5 361L932 400L883.5 484.5H867L857 478.5L878 377Z"><title>Avant-bras D</title></path>
  <path class="bz2 bz2-0" id="bz2_avbras_g_b" data-zone="avbras_g_b" onclick="clickBodyZone2(event,'avbras_g_b')" d="M1179.5 365.5L1171 360.5V374.5L1179.5 400.5L1226.5 485H1243L1253 476.5L1234 382L1215.5 345.5L1205 365.5L1210.5 392.5H1189.5L1179.5 365.5Z"><title>Avant-bras G</title></path>
  <path class="bz2 bz2-0" id="bz2_main_d_b" data-zone="main_d_b" onclick="clickBodyZone2(event,'main_d_b')" d="M835 490.5L856.5 478.5L869 483.5H887.5V497L873.5 558L860.5 567.5H843L835 561.5L829.5 554.5L835 516L814.5 521L808.5 516L835 490.5Z"><title>Main D</title></path>
  <path class="bz2 bz2-0" id="bz2_main_g_b" data-zone="main_g_b" onclick="clickBodyZone2(event,'main_g_b')" d="M1225.5 510V484.5H1242L1252 477.5L1280 493.5L1301 515L1294 521L1274.5 515L1280 559.5L1267.5 568H1252L1242 559.5L1236.5 554.5L1225.5 510Z"><title>Main G</title></path>
  <path class="bz2 bz2-0" id="bz2_ischio_d" data-zone="ischio_d" onclick="clickBodyZone2(event,'ischio_d')" d="M952.5 560.5L961.5 492.5L972 515L998.5 536L1028.5 541.5L1053.5 532L1049.5 595.5L1028.5 684.5L1017.5 680.5L990.5 676.5L972 684.5L957.5 637L952.5 560.5Z"><title>Ischio-jambier D</title></path>
  <path class="bz2 bz2-0" id="bz2_ischio_g" data-zone="ischio_g" onclick="clickBodyZone2(event,'ischio_g')" d="M1059 589.5V536.5L1095 543.5L1123 530L1150 492.5L1159.5 577.5L1140 682L1123 676.5L1088.5 682L1082.5 695L1059 589.5Z"><title>Ischio-jambier G</title></path>
  <path class="bz2 bz2-0" id="bz2_poplit_d" data-zone="poplit_d" onclick="clickBodyZone2(event,'poplit_d')" d="M967 717.5L972 686L988.5 678H1003.5L1030.5 686V704L1023.5 721.5L1018 717.5V712L999 704L982 717.5H967Z"><title>Creux Poplité D</title></path>
  <path class="bz2 bz2-0" id="bz2_poplit_g" data-zone="poplit_g" onclick="clickBodyZone2(event,'poplit_g')" d="M1085.5 724L1081.5 692.5L1088.5 682.5L1123 678.5L1140 685.5L1143.5 699V719.5L1129 715L1119 705.5H1110L1091.5 715V724H1085.5Z"><title>Creux Poplité G</title></path>
  <path class="bz2 bz2-0" id="bz2_genou_d_b" data-zone="genou_d_b" onclick="clickBodyZone2(event,'genou_d_b')" d="M998 733L982 718L998 706L1019.5 713V722H1014L998 733Z"><title>Genou D</title></path>
  <path class="bz2 bz2-0" id="bz2_genou_g_b" data-zone="genou_g_b" onclick="clickBodyZone2(event,'genou_g_b')" d="M1106 723H1092.5V713.5L1106 708H1120L1128.5 717.5L1115 736.5L1106 723Z"><title>Genou G</title></path>
  <path class="bz2 bz2-0" id="bz2_mollet_d" data-zone="mollet_d" onclick="clickBodyZone2(event,'mollet_d')" d="M959.5 767L967.5 718H984L998 731L1019.5 718L1024.5 725.5L1034 758.5L1030 816L1024.5 888.5V912V926.5L1005.5 912H998L988.5 926.5L984 917V888.5L967.5 816L959.5 767Z"><title>Mollet D</title></path>
  <path class="bz2 bz2-0" id="bz2_mollet_g" data-zone="mollet_g" onclick="clickBodyZone2(event,'mollet_g')" d="M1106 725H1085.5L1079 760V801.5L1085.5 857.5V911V926L1106 911L1127 926L1130.5 919L1127 896L1138 844L1152.5 772L1142.5 719H1127L1113 733L1106 725Z"><title>Mollet G</title></path>
  <path class="bz2 bz2-0" id="bz2_chev_d_b" data-zone="chev_d_b" onclick="clickBodyZone2(event,'chev_d_b')" d="M991 935.5L986 928L1003.5 911L1028 925.5L1025.5 935.5H991Z"><title>Cheville D</title></path>
  <path class="bz2 bz2-0" id="bz2_chev_g_b" data-zone="chev_g_b" onclick="clickBodyZone2(event,'chev_g_b')" d="M1085.5 938.5V928L1105 912.5L1126.5 928L1122 938.5L1105 934.5L1085.5 938.5Z"><title>Cheville G</title></path>
  <path class="bz2 bz2-0" id="bz2_pied_d_b" data-zone="pied_d_b" onclick="clickBodyZone2(event,'pied_d_b')" d="M975 942L986.5 928.5L990.5 938H1022.5H1029.5V950V967.5L1004 978L981 967.5H968.5L959 957V950L975 942Z"><title>Pied D</title></path>
  <path class="bz2 bz2-0" id="bz2_pied_g_b" data-zone="pied_g_b" onclick="clickBodyZone2(event,'pied_g_b')" d="M1083 959.5L1087.5 939.5L1095 936H1110L1124 939.5L1129 930.5L1139.5 947.5H1148.5L1155.5 953.5V959.5L1148.5 967H1134.5L1124 971.5L1110 977.5H1095L1083 971.5V959.5Z"><title>Pied G</title></path>
  <path class="bz2 bz2-0" id="bz2_trap_b" data-zone="trap_b" onclick="clickBodyZone2(event,'trap_b')" d="M955 200L1023.5 163.5H1086.5L1154.5 200L1102 221L1061.5 339.5H1043.5L1003.5 216.5L955 200Z"><title>Trapèze</title></path>
  <path class="bz2 bz2-0" id="bz2_epaule_d_b" data-zone="epaule_d_b" onclick="clickBodyZone2(event,'epaule_d_b')" d="M929.5 208.5L953 201.5L971 213L947.5 252L909.5 268.5L913.5 238.5L929.5 208.5Z"><title>Épaule D</title></path>
  <path class="bz2 bz2-0" id="bz2_epaule_g_b" data-zone="epaule_g_b" onclick="clickBodyZone2(event,'epaule_g_b')" d="M1154.5 202L1137.5 213L1150.5 244L1175.5 266L1200.5 270.5V258.5L1191.5 224.5L1175.5 207L1154.5 202Z"><title>Épaule G</title></path>
</svg>
      </div>
      <div id="bm2Legend" class="bm2-legend">
        ${(()=>{ const bc=p.bodyChart||{}; const active=Object.entries(bc).filter(([,l])=>l>0).sort(([,a],[,b])=>b-a); return active.map(([zid,lvl])=>{ const m=ZONES_META2[zid]; const lbl=lvl===1?'Gêne':lvl===2?'Douleur':'Vive douleur'; return m?`<span class="bm2-legend-item bm2-lv${lvl}">● ${m.l} — ${lbl}</span>`:''; }).join(''); })()}
      </div>
    </div>
  </div>`;

  // ⑤ TEST SECTIONS
  h += `<div style="font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:2.5px;
    color:var(--cyan);padding:6px 2px 8px;display:flex;align-items:center;gap:10px">
    <span class="section-badge badge-mob">⑤ TESTS PHYSIQUES</span>
    <span style="flex:1;height:1px;background:linear-gradient(to right,var(--cyan),transparent)"></span>
  </div>`;

  TESTS.forEach(sec=>{
    const op = secSt[sec.id]!==false;
    const filled = sec.tests.reduce((a,t)=>{
      const keys = t.bilateral?[t.id+'_g',t.id+'_d']:[t.id];
      return a+keys.filter(k=>p.d[k]!==null&&p.d[k]!==undefined&&p.d[k]!=='').length;
    },0);
    const total = sec.tests.reduce((a,t)=>a+(t.bilateral?2:1),0);
    const pct = Math.round(filled/total*100);

    h += `<div class="test-section">
      <div class="section-header ${sec.sh}" onclick="togSec('${sec.id}')">
        <span class="section-badge ${sec.badge}">${sec.label}</span>
        <span class="section-title">${sec.title}</span>
        <div class="section-prog-wrap">
          <div class="section-prog-bar"><div class="section-prog-fill" style="width:${pct}%"></div></div>
          <span class="section-prog-text">${filled}/${total}</span>
        </div>
        <span class="section-chevron${op?' open':''}" style="margin-left:8px">▼</span>
      </div>
      <div class="section-body${op?'':' collapsed'}" id="sec_${sec.id}">
      <table class="test-table">
        <thead><tr>
          <th style="width:32px">#</th><th>Test</th>
          <th class="center" style="width:130px">Gauche</th>
          <th class="center" style="width:130px">Droite</th>
        </tr></thead>
        <tbody>`;

    sec.tests.forEach(t=>{
      const sg=p.d[t.id+'_g'], sd=p.d[t.id+'_d'], sv=p.d[t.id];
      const rawG=p.d[t.id+'_g_raw']||'', rawD=p.d[t.id+'_d_raw']||'', rawV=p.d[t.id+'_raw']||'';
      const nt=p.d[t.id+'_nt']||'';
      const scoreBtns=(key,curVal)=>{
        const cur = curVal!==null&&curVal!==undefined&&curVal!=='' ? parseInt(curVal) : null;
        return `<div class="score-btns">${[0,1,2,3].map(s=>`<button class="sb sb-${s}${cur===s?' sel':''}" onclick="uScore('${key}',${s},'${t.id}')">${s}</button>`).join('')}</div>`;
      };
      const numCell=(scoreKey,rawKey,curVal,rawVal)=>{
        let html='';
        if(t.thr){
          html+=`<div class="raw-unit">${t.unit}</div>`;
          html+=`<input type="number" class="raw-input" value="${rawVal}" placeholder="${t.unit}" onchange="uRaw('${scoreKey}','${rawKey}',this.value,'${t.id}')">`;
        }
        html+=scoreBtns(scoreKey,curVal);
        if(t.thr){
          html+=`<div style="display:flex;gap:2px;flex-wrap:wrap;justify-content:center;margin-top:4px">`;
          t.thr.forEach(th=>{ html+=`<span style="font-size:9px;color:var(--${th.s===0?'red':th.s===1?'orange':th.s===2?'yellow':'green'})">${th.s}=${th.l}</span>`; });
          html+=`</div>`;
        }
        return html;
      };
      let gCell, dCell;
      if(t.type==='score'){
        gCell=scoreBtns(t.id+(t.bilateral?'_g':''),t.bilateral?sg:sv);
        dCell=t.bilateral?scoreBtns(t.id+'_d',sd):`<span style="color:var(--text-3);font-size:11px">—</span>`;
      } else {
        gCell=t.bilateral?numCell(t.id+'_g',t.id+'_g_raw',sg,rawG):numCell(t.id,t.id+'_raw',sv,rawV);
        dCell=t.bilateral?numCell(t.id+'_d',t.id+'_d_raw',sd,rawD):`<span style="color:var(--text-3);font-size:11px">—</span>`;
      }
      const critOpen=openCrit[t.id]||false;
      const critBtn=t.crit?`<button class="toggle-crit-btn${critOpen?' active':''}" onclick="togCrit('${t.id}')" id="crtbtn_${t.id}">${critOpen?'▲':'📖'} Critères</button>`:'';
      h+=`<tr class="test-row">
        <td class="test-num">${t.num}</td>
        <td><div class="test-name">${t.name}</div><div class="test-desc">${t.desc}</div>${critBtn}</td>
        <td class="score-cell">${gCell}</td>
        <td class="score-cell">${dCell}</td>
      </tr>
      <tr class="notes-row">
        <td></td>
        <td colspan="3" style="padding:2px 14px 10px">
          <textarea class="notes-input" placeholder="✏️ Remarques…" onchange="uScore('${t.id}_nt',this.value,'${t.id}',true)">${nt}</textarea>
        </td>
      </tr>`;
      if(t.crit){
        const critColors=['c-0','c-1','c-2','c-3'];
        const critBadges=['b-0','b-1','b-2','b-3'];
        h+=`<tr class="crit-row-tr${critOpen?' open':''}" id="crit_${t.id}">
          <td colspan="5" style="padding:0">
            <div class="crit-panel">
              <div class="crit-panel-title">CRITÈRES D'ÉVALUATION</div>
              <div class="crit-items">
                ${t.crit.map(c=>`<div class="crit-item ${critColors[c.s]}"><span class="crit-badge ${critBadges[c.s]}">${c.s}</span><span class="crit-text">${c.t}</span></div>`).join('')}
              </div>
            </div>
          </td>
        </tr>`;
      }
    });
    h+=`</tbody></table></div></div></div>`;
  });

  // ⑥ Bilan par catégorie
  h+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:2.5px;
    color:var(--gold);padding:6px 2px 8px;display:flex;align-items:center;gap:10px">
    <span class="section-badge badge-puiss">⑥ BILAN PAR CATÉGORIE</span>
    <span style="flex:1;height:1px;background:linear-gradient(to right,var(--gold),transparent)"></span>
  </div>`;

  // Score recap by section
  const sr=calcScore(_p.id, sidx);
  const secDefs=[
    {id:'mob_inf', label:'Mobilité Membre Inférieur', max:18, cls:'src-mob-inf'},
    {id:'mob_sup', label:'Mobilité Membre Supérieur', max:12, cls:'src-mob-sup'},
    {id:'stab',    label:'Stabilité Articulaire',     max:18, cls:'src-stab'},
    {id:'fonc',    label:'Mvts Fonctionnels',          max:12, cls:'src-fonc'},
  ];
  const totalMax=60;
  const totalPts=secDefs.reduce((a,sd)=>a+(sr.secs[sd.id]?sr.secs[sd.id].pts:0),0);
  const totalPct=Math.round(totalPts/totalMax*100);
  const ptColor=(pts,id)=>{
    if(id==='mob_inf'||id==='stab'){
      if(pts<6)  return 'var(--red)';
      if(pts<12) return 'var(--orange)';
      if(pts<15) return 'var(--yellow)';
      return 'var(--green)';
    } else {
      if(pts<4)  return 'var(--red)';
      if(pts<8)  return 'var(--orange)';
      if(pts<10) return 'var(--yellow)';
      return 'var(--green)';
    }
  };

  h+=`<div class="score-recap">
    <div class="score-recap-title">📊 Bilan par Catégorie</div>
    <div class="score-recap-grid">`;

  secDefs.forEach(sd=>{
    const sec=sr.secs[sd.id]||{pts:0,max:sd.max,filled:0};
    const pts=Math.round(sec.pts*10)/10;
    const pct=Math.round(pts/sd.max*100);
    const col=ptColor(pts,sd.id);
    const missing=sec.filled<TESTS.find(s=>s.id===sd.id).tests.length;
    h+=`<div class="src-card ${sd.cls}">
      <div class="src-label">${sd.label}</div>
      <div class="src-score" style="color:${col}">${pts}</div>
      <div class="src-max">/ ${sd.max} pts</div>
      <div class="src-bar"><div class="src-bar-fill" style="width:${pct}%"></div></div>
      ${missing?'<div class="src-missing">tests incomplets</div>':`<span class="src-pct-chip" style="background:${col}22;color:${col}">${pct}%</span>`}
    </div>`;
  });

  h+=`</div>
    <div class="src-total-row">
      <span class="src-total-label">SCORE GLOBAL</span>
      <div class="src-total-bar"><div class="src-total-fill" style="width:${totalPct}%"></div></div>
      <span class="src-total-score">${Math.round(totalPts*10)/10}</span>
      <span class="src-total-pct">/ ${totalMax} pts &nbsp;(${totalPct}%)</span>
    </div>
  </div>`;

  // ⑦ Analyse IA + Notes
  h+=`<div style="font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:2.5px;
    color:#a78bfa;padding:6px 2px 8px;display:flex;align-items:center;gap:10px">
    <span class="section-badge" style="background:rgba(139,92,246,.15);color:#a78bfa;border:1px solid rgba(139,92,246,.3)">⑦ ANALYSE & NOTES</span>
    <span style="flex:1;height:1px;background:linear-gradient(to right,#a78bfa,transparent)"></span>
  </div>`;

  // Prevention / AI section
  h+=renderPreventionSection(p);

  // Global notes
  h+=`<div class="notes-section">
    <div class="notes-section-title">📝 Notes Générales</div>
    <textarea class="notes-global" placeholder="Observations générales, contexte de la séance…" onchange="uf('gn',this.value)">${p.gn||''}</textarea>
  </div>`;

  document.getElementById('mainContent').innerHTML=h;
  // Appliquer les classes du body map apres rendu DOM
  (function(){
    const _rp=players.find(function(x){return x.id===_p.id;});
    if(_rp) refreshBodyMap2Classes(getSess(_rp,getCurrSidx(_rp)), getInjZoneIds(_rp));
  })();
}
