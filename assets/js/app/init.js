// Fenix Toulouse — app/init.js
// Persistance (localStorage), récupération données, reset, démarrage de l'app
// Dépendances : core/state.js (players, cPid), ui/form.js (renderList, selPlayer)

// ─── THÈME CLAIR / SOMBRE ─────────────────────────────────
function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('theme-light', isLight);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = isLight ? '☀️' : '🌙';
}

function toggleTheme() {
  const current = localStorage.getItem('ftph_theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ftph_theme', next);
  applyTheme(next);
}

// Appliquer le thème sauvegardé dès le chargement
applyTheme(localStorage.getItem('ftph_theme') || 'dark');

// ─── PERSISTANCE ──────────────────────────────────────────
function save(){ localStorage.setItem('ftph_v3',JSON.stringify(players)); }

function recoverData(){
  let recovered = 0;
  const existingIds = new Set(players.map(p=>p.id));
  ['ftph_v2','ftph_v1'].forEach(key=>{
    try{
      const raw=localStorage.getItem(key);
      if(!raw) return;
      const data=JSON.parse(raw)||[];
      data.forEach(p=>{
        if(!existingIds.has(p.id)){
          if(!p.d) p.d={};
          if(!p.injuries) p.injuries=[];
          players.push(_migrateToV3(p));
          existingIds.add(p.id);
          recovered++;
        }
      });
    }catch(e){}
  });
  if(recovered>0){
    save(); renderList();
    const btn=event.currentTarget;
    btn.textContent=`✓ ${recovered} joueur(s) récupéré(s)`;
    btn.style.color='var(--green)'; btn.style.borderColor='var(--green)';
    setTimeout(()=>{ btn.textContent='🔄 Récupérer données'; btn.style.color='var(--gold)'; btn.style.borderColor='var(--gold)'; },3000);
  } else {
    const btn=event.currentTarget;
    btn.textContent='Aucune donnée à récupérer';
    setTimeout(()=>{ btn.textContent='🔄 Récupérer données'; },2500);
  }
}

let _resetPending = false;
function confirmReset(btn){
  if(!_resetPending){
    _resetPending = true;
    btn.textContent = '⚠️ Confirmer ?';
    btn.style.background = 'var(--red)';
    btn.style.color = '#fff';
    setTimeout(()=>{ _resetPending=false; btn.textContent='🗑 Reset'; btn.style.background=''; btn.style.color='var(--red)'; }, 3000);
  } else {
    resetAll();
  }
}
function resetAll(){
  localStorage.removeItem('ftph_v3');
  localStorage.removeItem('ftph_v2');
  localStorage.removeItem('ftph_v1');
  localStorage.removeItem('ftph_groups');
  location.reload();
}

function saveData(){
  // Export enrichi : joueurs + groupes de séance (compatible ancien format)
  let groups=[]; try{ groups=JSON.parse(localStorage.getItem('ftph_groups')||'[]'); }catch(e){}
  const payload={ _fenix:true, version:3, players:players, groups:groups };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='fenix_testing_'+new Date().toISOString().split('T')[0]+'.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 200);
  const btn=document.getElementById('saveBtn');
  if(btn){ btn.textContent='✓ Sauvegardé'; setTimeout(()=>btn.textContent='💾 Enregistrer',2000); }
}

// ─── IMPORT JSON ──────────────────────────────────────────
function importJSON(){
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0]; if(!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      // Deux formats acceptés : tableau direct (ancien) OU {players, groups} (nouveau)
      let data, importedGroups=null;
      if(Array.isArray(parsed)){
        data = parsed;
      } else if(parsed && Array.isArray(parsed.players)){
        data = parsed.players;
        if(Array.isArray(parsed.groups)) importedGroups = parsed.groups;
      } else {
        throw new Error('Format invalide — tableau JSON ou objet {players, groups} attendu');
      }
      const existingIds = new Set(players.map(p=>p.id));
      let added = 0, updated = 0;
      data.forEach(p => {
        if(!p.id) return;
        const migrated = _migrateToV3(p);
        // Chercher par ID d'abord, puis par nom+prénom si ID inconnu
        let existing = players.find(x=>x.id===p.id);
        if(!existing && p.n && p.pr){
          existing = players.find(x=>
            x.n.trim().toLowerCase()===p.n.trim().toLowerCase() &&
            x.pr.trim().toLowerCase()===p.pr.trim().toLowerCase()
          );
        }
        if(!existing){
          players.push(migrated);
          existingIds.add(p.id);
          added++;
        } else {
          // Fusionner sessions inconnues (par sid)
          const existingSids = new Set((existing.sessions||[]).map(s=>s.sid));
          (migrated.sessions||[]).forEach(s=>{
            if(!existingSids.has(s.sid)){ existing.sessions.push(s); updated++; }
          });
          // Fusionner blessures inconnues (par id)
          const existingInjIds = new Set((existing.injuries||[]).map(x=>x.id));
          (p.injuries||[]).forEach(inj=>{
            if(inj.id && !existingInjIds.has(inj.id)) existing.injuries.push(inj);
          });
        }
      });
      // Fusionner les groupes importés (par id ; sinon par nom)
      let grpMsg='';
      if(importedGroups){
        let existingGroups=[]; try{ existingGroups=JSON.parse(localStorage.getItem('ftph_groups')||'[]'); }catch(e){}
        const existingGrpIds=new Set(existingGroups.map(g=>g.id));
        const existingGrpNames=new Set(existingGroups.map(g=>(g.name||'').toLowerCase()));
        let addedGrp=0;
        importedGroups.forEach(g=>{
          if(!g||!g.id) return;
          if(existingGrpIds.has(g.id) || existingGrpNames.has((g.name||'').toLowerCase())) return;
          existingGroups.push(g); addedGrp++;
        });
        if(addedGrp){ localStorage.setItem('ftph_groups',JSON.stringify(existingGroups)); grpMsg=', '+addedGrp+' groupe(s)'; }
      }
      save(); renderList();
      if(players.length) selPlayer(players[0].id);
      _showImportToast('✓ JSON importé — '+added+' joueur(s) ajouté(s), '+updated+' session(s) fusionnée(s)'+grpMsg,'var(--green)');
    } catch(err) {
      _showImportToast('❌ Erreur import JSON : '+err.message,'var(--red)');
    }
  };
  input.click();
}

// ─── IMPORT PDF (via API Claude) ──────────────────────────
function importPDF(){
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.pdf';
  input.onchange = async (e) => {
    const file = e.target.files[0]; if(!file) return;
    _showImportToast("⏳ Lecture du PDF par l'IA…",'var(--cyan)',0);
    try {
      const base64 = await new Promise((res,rej)=>{
        const r = new FileReader();
        r.onload = () => res(r.result.split(',')[1]);
        r.onerror = () => rej(new Error('Lecture fichier impossible'));
        r.readAsDataURL(file);
      });

      const prompt = `Tu es un assistant qui extrait des données d'une fiche de testing physique handball.
Analyse ce PDF et extrais les données du joueur pour créer un objet JSON compatible avec la structure ftph_v3.

STRUCTURE ATTENDUE (retourne UNIQUEMENT ce JSON, sans markdown) :
{
  "id": "pdf_TIMESTAMP",
  "pr": "Prénom",
  "n": "NOM",
  "pos": "Poste",
  "gr": "Groupe/Equipe",
  "ddn": "YYYY-MM-DD ou vide",
  "essai": false,
  "injuries": [
    {
      "id": "inj_TIMESTAMP",
      "date": "YYYY-MM-01",
      "desc": "Description blessure",
      "categorie": "Traumatique|Musculaire|Tendineux|Osseux|Autre",
      "type": "type si précisé",
      "localisation": "zone anatomique",
      "cote": "G|D|B",
      "duration": "X semaine(s) ou vide",
      "perturbeEncore": false,
      "zones": []
    }
  ],
  "sessions": [
    {
      "sid": "pdf_sess_TIMESTAMP",
      "dt": "YYYY-MM-DD",
      "ta": "taille en cm",
      "po": "poids en kg",
      "mgPct": "% masse grasse si présent",
      "pliBiceps": "",
      "pliTriceps": "",
      "pliSousScap": "",
      "pliSupraIli": "",
      "bodyChart": {},
      "gn": "notes générales, objectifs, axes de travail, bilans extraits du PDF",
      "aiPrevention": "",
      "d": {}
    }
  ]
}

RÈGLES :
- Si plusieurs dates de test, crée une session par date
- Mets dans gn les objectifs, axes de travail, bilans, remarques trouvés dans le PDF
- Pour les blessures, extrais toutes celles mentionnées
- Le champ d reste vide {} car les scores seront ressaisis manuellement
- Utilise TIMESTAMP comme placeholder, il sera remplacé par le code
- Retourne UNIQUEMENT le JSON, aucun texte avant ou après`;

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: [
              { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
              { type: 'text', text: prompt }
            ]
          }]
        })
      });

      if(!resp.ok) throw new Error('Erreur API '+resp.status);
      const apiData = await resp.json();
      const raw = (apiData.content||[]).map(c=>c.text||'').join('').trim();
      const clean = raw.replace(/```json|```/g,'').trim();
      const player = JSON.parse(clean);

      const ts = Date.now().toString();
      player.id = 'pdf_'+ts;
      (player.sessions||[]).forEach((s,i)=>{ s.sid = 'pdf_sess_'+(parseInt(ts)+i); });
      (player.injuries||[]).forEach((inj,i)=>{ inj.id = 'pdf_inj_'+(parseInt(ts)+i+100); });

      const migrated = _migrateToV3(player);
      const existing = players.find(p=>p.n===player.n && p.pr===player.pr);
      if(existing){
        const existingSids = new Set((existing.sessions||[]).map(s=>s.sid));
        (migrated.sessions||[]).forEach(s=>{ if(!existingSids.has(s.sid)) existing.sessions.push(s); });
        const existingInjIds = new Set((existing.injuries||[]).map(x=>x.id));
        (migrated.injuries||[]).forEach(inj=>{ if(!existingInjIds.has(inj.id)) existing.injuries.push(inj); });
        save(); renderList(); selPlayer(existing.id);
        _showImportToast('✓ PDF fusionné avec '+existing.pr+' '+existing.n,'var(--green)');
      } else {
        players.push(migrated);
        save(); renderList(); selPlayer(migrated.id);
        _showImportToast('✓ PDF importé — '+player.pr+' '+player.n+' créé','var(--green)');
      }
    } catch(err) {
      _showImportToast('❌ Erreur import PDF : '+err.message,'var(--red)');
    }
  };
  input.click();
}

// ─── TOAST NOTIFICATION ───────────────────────────────────
function _showImportToast(msg, color, duration){
  if(duration===undefined) duration=4000;
  let toast = document.getElementById('importToast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'importToast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 22px;border-radius:10px;font-family:Barlow,sans-serif;font-size:13px;font-weight:600;z-index:9999;transition:opacity .3s;box-shadow:0 4px 20px rgba(0,0,0,.4);white-space:nowrap;';
    document.body.appendChild(toast);
  }
  toast.style.background = 'var(--navy-2)';
  toast.style.border = '1px solid '+color;
  toast.style.color = color;
  toast.style.opacity = '1';
  toast.textContent = msg;
  if(toast._timer) clearTimeout(toast._timer);
  if(duration > 0){
    toast._timer = setTimeout(function(){ toast.style.opacity='0'; }, duration);
  }
}

// ─── DÉMARRAGE ────────────────────────────────────────────
renderList();
if(players.length) selPlayer(players[0].id);
