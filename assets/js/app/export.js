// Fenix Toulouse — app/export.js
// Export PDF (html2canvas + jsPDF) et export email (Gmail / copier-coller)
// Dépendances : core/state.js (players, cPid), core/utils.js (calcScore, ini, ghostSVG)
//               core/data-tests.js (TESTS)

// ─── MODAL D'EXPORT ───────────────────────────────────────
function openExportModal(){
  const p = cPid ? players.find(x=>x.id===cPid) : null;
  if(!p){ alert('Sélectionnez d\'abord un joueur.'); return; }
  const sc = calcScore(p.id, null);
  const pos = p.facePos ? `${p.facePos.x}% ${p.facePos.y}%` : '50% 25%';
  const av = document.getElementById('exportAvatar');
  if(p.photo){
    av.innerHTML=`<img src="${p.photo}" alt="${p.pr}" style="object-position:${pos}">`;
    av.className='player-avatar has-photo';
  } else {
    av.innerHTML = p.essai ? ghostSVG(22) : ini(p.n,p.pr);
    av.className='player-avatar';
  }
  document.getElementById('exportPlayerName').textContent = `${p.pr} ${p.n}`;
  const age = p.ddn ? Math.floor((Date.now()-new Date(p.ddn))/(365.25*24*3600*1000)) : null;
  document.getElementById('exportPlayerMeta').textContent = [p.pos||'—', p.gr||'', age?`${age} ans`:''].filter(Boolean).join(' · ');
  document.getElementById('exportModalSub').textContent = `Fiche du ${p.dt ? new Date(p.dt).toLocaleDateString('fr-FR') : '—'}`;
  document.getElementById('eScoreGlobal').textContent = sc.t+'%';
  document.getElementById('eScoreTests').textContent = sc.f;
  document.getElementById('eScoreS3').textContent = sc.s3;
  const cls = sc.t>=70?'var(--green)':sc.t>=40?'var(--orange)':'var(--red)';
  document.getElementById('eScoreGlobal').style.color = cls;
  document.getElementById('exportModal').classList.add('open');
}
function closeExportModal(){ document.getElementById('exportModal').classList.remove('open'); }

// ─── PDF ──────────────────────────────────────────────────
async function exportPDF(){
  const p = cPid ? players.find(x=>x.id===cPid) : null;
  if(!p) return;
  closeExportModal();
  const prog = document.getElementById('pdfProgress');
  const bar  = document.getElementById('pdfProgressBar');
  const lbl  = document.getElementById('pdfProgressLabel');
  const setP = (pct, txt) => { bar.style.width=pct+'%'; lbl.textContent=txt; };

  prog.classList.add('active');
  setP(5, 'Préparation de la fiche…');

  const collapsedEls = document.querySelectorAll('.section-body.collapsed');
  collapsedEls.forEach(el => el.classList.remove('collapsed'));
  await new Promise(r=>setTimeout(r, 150));
  setP(20, 'Capture de la fiche joueur…');

  const content = document.getElementById('mainContent');
  const origOverflow = content.style.overflow;
  content.style.overflow = 'visible';

  try {
    const canvas = await html2canvas(content, {
      backgroundColor: '#060d1b',
      scale: 2,
      useCORS: true,
      logging: false,
      onclone: (doc) => {
        const el = doc.getElementById('mainContent');
        if(el){ el.style.overflow='visible'; el.style.height='auto'; }
      }
    });

    setP(70, 'Génération du PDF…');
    await new Promise(r=>setTimeout(r, 80));

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'p', unit:'mm', format:'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageHmm = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    let y = 0, remaining = imgH;

    while(remaining > 0) {
      if(y > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, -y, pageW, imgH);
      y += pageHmm;
      remaining -= pageHmm;
    }

    setP(90, 'Finalisation…');
    await new Promise(r=>setTimeout(r, 100));

    const fname = `FENIX_${p.n}_${p.pr}_${new Date().toISOString().split('T')[0]}.pdf`;
    const blob = pdf.output('blob');
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = fname; a.style.display='none';
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
    setP(100, 'PDF téléchargé ✓');
    await new Promise(r=>setTimeout(r, 800));

  } catch(e) {
    console.error('PDF error:', e);
    lbl.textContent = '⚠ Erreur — ' + (e.message||'inconnue');
    await new Promise(r=>setTimeout(r, 2000));
  } finally {
    content.style.overflow = origOverflow;
    collapsedEls.forEach(el => el.classList.add('collapsed'));
    prog.classList.remove('active');
    bar.style.width = '0%';
  }
}

// ─── EMAIL ────────────────────────────────────────────────
function buildEmailBody(p, sc){
  const age = p.ddn ? Math.floor((Date.now()-new Date(p.ddn))/(365.25*24*3600*1000)) : null;
  const dateTest = p.dt ? new Date(p.dt).toLocaleDateString('fr-FR') : '—';
  const scoreLvl = sc.t>=70?'✅ Satisfaisant':sc.t>=40?'⚠️ À surveiller':'🔴 Insuffisant';

  let body = `=== FENIX TOULOUSE — TESTING PHYSIQUE ===\n\n`;
  body += `JOUEUR : ${p.pr} ${p.n}\n`;
  body += `Poste : ${p.pos||'—'} | Groupe : ${p.gr||'—'}\n`;
  if(age) body += `Âge : ${age} ans\n`;
  if(p.ta||p.po) body += `Mensuration : ${p.ta?p.ta+'cm':''} ${p.po?'/ '+p.po+'kg':''}\n`;
  body += `Date du test : ${dateTest}\n\n`;
  body += `── SCORE GLOBAL ──\n`;
  body += `Score : ${sc.t}% (${scoreLvl})\n`;
  body += `Tests renseignés : ${sc.f}\n`;
  body += `Scores 3 : ${sc.s3} | Scores 2 : ${sc.s2} | Scores 1 : ${sc.s1} | Scores 0 : ${sc.s0}\n\n`;
  body += `── DÉTAIL PAR SECTION ──\n`;
  TESTS.forEach(sec=>{
    const s = sc.secs && sc.secs[sec.id];
    if(s && s.filled>0){
      const pct = Math.round(s.pts/s.max*100);
      body += `${sec.title} : ${pct}% (${s.filled} tests)\n`;
    }
  });
  if(p.injuries && p.injuries.length){
    body += `\n── ANTÉCÉDENTS (${p.injuries.length}) ──\n`;
    p.injuries.forEach(inj=>{
      const d = inj.date ? new Date(inj.date).toLocaleDateString('fr-FR',{month:'long',year:'numeric'}) : '—';
      body += `• ${d} — ${inj.desc}${inj.duration?' ('+inj.duration+')':''}\n`;
    });
  }
  if(p.gn && p.gn.trim()){
    body += `\n── NOTES COACHING ──\n${p.gn}\n`;
  }
  body += `\n---\nFenix Toulouse Handball — Testing Physique\nGénéré le ${new Date().toLocaleDateString('fr-FR')}`;
  return body;
}

function exportEmail(mode){
  const p = cPid ? players.find(x=>x.id===cPid) : null;
  if(!p){ alert('Sélectionnez d\'abord un joueur.'); return; }
  const sc = calcScore(p.id, null);
  const rawSubject = `[FENIX] Testing Physique — ${p.pr} ${p.n}`;
  const rawBody    = buildEmailBody(p, sc);

  if(mode === 'gmail'){
    closeExportModal();
    let b = rawBody;
    if(b.length > 1500) b = b.slice(0, 1500) + '\n\n[... voir la fiche complète dans l\'application]';
    const url = `https://mail.google.com/mail/?view=cm&su=${encodeURIComponent(rawSubject)}&body=${encodeURIComponent(b)}`;
    window.open(url, '_blank', 'noopener');
    return;
  }
  closeExportModal();
  showEmailPanel(rawSubject, rawBody);
}

function showEmailPanel(subject, body){
  const old = document.getElementById('emailPanel');
  if(old) old.remove();
  const overlay = document.createElement('div');
  overlay.id = 'emailPanel';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(8px);
    z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;
  `;
  overlay.innerHTML = `
    <div style="background:var(--navy-2);border:1px solid var(--border-2);border-radius:16px;
      width:100%;max-width:540px;padding:26px;box-shadow:0 24px 80px rgba(0,0,0,.6);
      display:flex;flex-direction:column;gap:14px;">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:3px;color:var(--cyan)">
          📧 Contenu du Mail
        </div>
        <button onclick="document.getElementById('emailPanel').remove()"
          style="background:none;border:none;color:var(--text-3);font-size:20px;cursor:pointer;line-height:1">✕</button>
      </div>
      <div style="font-size:12px;color:var(--text-3);font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px;
        background:var(--navy-3);border-radius:8px;padding:10px 12px;border:1px solid var(--border)">
        <span style="color:var(--text-2);font-weight:600">Objet :</span> ${subject}
      </div>
      <textarea id="emailBodyText" readonly
        style="width:100%;height:260px;background:var(--navy-3);border:1.5px solid var(--border-2);
          border-radius:10px;color:var(--text-2);font-family:'DM Mono',monospace;font-size:11px;
          line-height:1.6;padding:14px;resize:none;outline:none;">${body}</textarea>
      <div style="display:flex;gap:10px">
        <button onclick="copyEmailBody()" id="copyEmailBtn"
          style="flex:1;padding:13px;background:var(--cyan);border:none;border-radius:10px;
            color:var(--navy);font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:2px;
            cursor:pointer;transition:opacity .15s">
          📋 Copier le contenu
        </button>
        <button onclick="document.getElementById('emailPanel').remove()"
          style="padding:13px 18px;background:none;border:1.5px solid var(--border-2);border-radius:10px;
            color:var(--text-3);font-family:'Barlow',sans-serif;font-size:13px;cursor:pointer">
          Fermer
        </button>
      </div>
      <div style="font-size:11px;color:var(--text-3);text-align:center;font-family:'Barlow Condensed',sans-serif;letter-spacing:.5px">
        Copiez puis collez dans votre client mail (Mail, Outlook, etc.)
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function copyEmailBody(){
  const ta = document.getElementById('emailBodyText');
  if(!ta) return;
  ta.select();
  try {
    navigator.clipboard.writeText(ta.value).then(()=>{
      const btn = document.getElementById('copyEmailBtn');
      if(btn){ btn.textContent='✓ Copié !'; setTimeout(()=>btn.textContent='📋 Copier le contenu', 2000); }
    }).catch(()=>{
      document.execCommand('copy');
      const btn = document.getElementById('copyEmailBtn');
      if(btn){ btn.textContent='✓ Copié !'; setTimeout(()=>btn.textContent='📋 Copier le contenu', 2000); }
    });
  } catch(e) {
    document.execCommand('copy');
    const btn = document.getElementById('copyEmailBtn');
    if(btn){ btn.textContent='✓ Copié !'; setTimeout(()=>btn.textContent='📋 Copier le contenu', 2000); }
  }
}
