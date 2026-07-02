// Fenix Toulouse — ui/players.js
// Gestion des joueurs : création, suppression, photo, modal
// Dépendances : core/state.js (players, cPid, save), core/utils.js (ini, ghostSVG)
//               ui/form.js (renderList, renderForm)

// ─── PHOTO ────────────────────────────────────────────────
async function detectFacePosition(dataUrl){
  return new Promise(resolve=>{
    const img=new Image();
    img.onload=async()=>{
      if('FaceDetector' in window){
        try{
          const fd=new FaceDetector({fastMode:true});
          const faces=await fd.detect(img);
          if(faces&&faces.length>0){
            const f=faces.reduce((a,b)=>(b.boundingBox.width*b.boundingBox.height>a.boundingBox.width*a.boundingBox.height)?b:a);
            resolve({x:Math.round((f.boundingBox.x+f.boundingBox.width/2)/img.naturalWidth*100),y:Math.round((f.boundingBox.y+f.boundingBox.height/2)/img.naturalHeight*100)});
            return;
          }
        }catch(e){}
      }
      resolve({x:50,y:25});
    };
    img.onerror=()=>resolve({x:50,y:25});
    img.src=dataUrl;
  });
}
function triggerPhoto(pid){ document.getElementById('photoInput')._pid=pid; document.getElementById('photoInput').value=''; document.getElementById('photoInput').click(); }
function handlePhotoUpload(e){
  const file=e.target.files[0]; if(!file) return;
  const pid=e.target._pid||cPid;
  const p=players.find(x=>x.id===pid); if(!p) return;
  const reader=new FileReader();
  reader.onload=async ev=>{
    p.photo=ev.target.result;
    const pos=await detectFacePosition(p.photo);
    p.facePos=pos; save(); renderList(); renderForm(p);
  };
  reader.readAsDataURL(file);
}
function removePhoto(pid){ const p=players.find(x=>x.id===pid); if(!p) return; delete p.photo; delete p.facePos; save(); renderList(); renderForm(p); }

// ─── MODAL & CRUD JOUEURS ─────────────────────────────────
function openModal(){ document.getElementById('modal').classList.add('open'); }
function closeModal(){ document.getElementById('modal').classList.remove('open'); }

function addPlayer(){
  const pr=document.getElementById('mPrenom').value.trim(), n=document.getElementById('mNom').value.trim();
  if(!pr||!n){ alert('Prénom et Nom requis.'); return; }
  const gr=document.getElementById('mGroupe').value.trim(), pos=document.getElementById('mPoste').value.trim();
  const ddn=document.getElementById('mDdn').value, dt=document.getElementById('mDate').value;
  const emailEl=document.getElementById('mEmail'); const email=emailEl?emailEl.value.trim():'';
  const essai=document.getElementById('mEssai').checked;
  const p={id:Date.now().toString(),pr,n,gr,pos,ddn,essai,email,
    sexe:'H',mainDom:'',
    injuries:[],
    sessions:[{sid:Date.now().toString()+'_s0',dt,ta:'',po:'',
      pliBiceps:'',pliTriceps:'',pliSousScap:'',pliSupraIli:'',
      pliPectoral:'',pliAxillaire:'',pliAbdomen:'',pliCuisse:'',
      tourCuisse:'',tourBras:'',tourTaille:'',tourBuste:'',
      mgPct:'',bodyChart:{},d:{},gn:'',aiPrevention:''}]};
  players.push(p); save(); closeModal(); renderList(); selPlayer(p.id);
  ['mPrenom','mNom','mGroupe','mPoste','mDdn','mEmail'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('mEssai').checked=false;
}

function delPlayer(id){
  if(!confirm('Supprimer ce joueur ?')) return;
  players=players.filter(p=>p.id!==id); cPid=null; save(); renderList();
  document.getElementById('mainContent').innerHTML='<div class="empty-state"><div class="empty-icon">🤾</div><div class="empty-title">Joueur Supprimé</div></div>';
  document.getElementById('topbarTitle').textContent='TESTING PHYSIQUE';
  document.getElementById('topbarMeta').textContent='Sélectionnez un joueur';
  document.getElementById('topbarAvatar').innerHTML='FT';
  document.getElementById('topbarAvatar').classList.remove('has-photo');
  document.getElementById('dateChip').textContent='—';
}
