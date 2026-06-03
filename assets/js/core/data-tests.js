// Fenix Toulouse — data-tests.js
// Extrait de app.js (lignes 1-239)

// ─── TESTS DATA ───────────────────────────────────────────
const TESTS=[
  {id:'mob_inf',title:'Mobilité — Membre Inférieur',badge:'badge-mob',label:'MOB INF',sh:'sh-mob',tests:[
    {id:'t1',num:1,name:'Knee To Wall Test',desc:'Dorsiflexion de la cheville',bilateral:true,
     type:'numeric',unit:'cm',
     thr:[{s:0,l:'Douleur'},{s:1,l:'< 10 cm'},{s:2,l:'10–12 cm'},{s:3,l:'≥ 12 cm'}],
     auto:(v)=>{const n=parseFloat(v);if(isNaN(n)||v==='')return null;if(n<0)return 0;if(n<10)return 1;if(n<=12)return 2;return 3;},
     crit:[
       {s:0,t:'Douleurs lors du test'},
       {s:1,t:'Impossible de toucher le mur au-delà de 10 cm'},
       {s:2,t:'Touche le mur entre 10 et 12 cm'},
       {s:3,t:'Touche le mur au-delà de 12 cm — Bonne mobilité de cheville en dorsiflexion'}
     ]},
    {id:'t2',num:2,name:'Active Straight Leg Raise',desc:'ASLR — mobilité de la chaîne postérieure',bilateral:true,type:'score',
     crit:[
       {s:0,t:'Douleurs sur le bas du dos. Impossible de remonter la jambe ou flexion du tronc en même temps que la flexion de la hanche'},
       {s:1,t:'Relève la jambe mais sans amplitude suffisante pour dépasser la ligne perpendiculaire au sol — manque de flexibilité chaîne postérieure'},
       {s:2,t:'Bonne amplitude mais genou du haut ou du bas qui se fléchissent lors de l\'exécution'},
       {s:3,t:'Parfait — exercice réalisé sans difficulté et avec grande amplitude'}
     ]},
    {id:'t3',num:3,name:'Quadriceps — GMC',desc:'Force quadriceps — gainage musculaire central',bilateral:true,type:'score',
     crit:[
       {s:0,t:'Douleurs et/ou impossibilité de saisir la cheville arrière'},
       {s:1,t:'Possibilité de saisir le pied arrière sans respecter l\'alignement axe du fémur et des lombaires'},
       {s:2,t:'Alignement entre l\'axe du fémur et des lombaires'},
       {s:3,t:'Angle supérieur à la norme'}
     ]},
    {id:'t4',num:4,name:'Thomas Test Modified',desc:'Souplesse fléchisseurs de hanche',bilateral:true,type:'score',
     crit:[
       {s:0,t:'Douleurs et/ou impossibilité de saisir le genou pour le coller à la poitrine'},
       {s:1,t:'Possibilité de saisir le genou sans respecter l\'alignement axe du fémur / horizontale'},
       {s:2,t:'Alignement entre l\'axe du fémur et l\'horizontale'},
       {s:3,t:'Angle supérieur à la norme'}
     ]},
    {id:'t5',num:5,name:'Grand Écart contre un mur',desc:'Mobilité adducteurs et hanche',bilateral:false,
     type:'numeric',unit:'°',
     thr:[{s:0,l:'Douleur'},{s:1,l:'< 45° / jambe'},{s:2,l:'45°–60° / jambe'},{s:3,l:'> 60° / jambe'}],
     auto:(v)=>{const n=parseFloat(v);if(isNaN(n)||v==='')return null;if(n<0)return 0;if(n<45)return 1;if(n<=60)return 2;return 3;},
     crit:[
       {s:0,t:'Douleurs lors de l\'exécution. Impossible à réaliser en respectant les consignes (jambes tendues, genoux en extension, cheville en dorsiflexion)'},
       {s:1,t:'Réalise l\'exercice avec très peu d\'amplitude — inférieur à 45° par jambe (= 90° d\'ouverture)'},
       {s:2,t:'Amplitude moyenne comprise entre 45° et 60° par jambe (= 120° d\'ouverture de hanche)'},
       {s:3,t:'Angle supérieur à la norme'}
     ]},
    {id:'t6',num:6,name:'Sit & Reach',desc:'Flexion tronc — chaîne postérieure',bilateral:false,
     type:'numeric',unit:'cm',
     thr:[{s:0,l:'1–7 cm'},{s:1,l:'8–20 cm'},{s:2,l:'21–29 cm'},{s:3,l:'≥ 29 cm'}],
     auto:(v)=>{const n=parseFloat(v);if(isNaN(n)||v==='')return null;if(n<=7)return 0;if(n<=20)return 1;if(n<=29)return 2;return 3;},
     crit:[
       {s:0,t:'Douleurs et valeurs entre 1 et 7 cm — hypertension chaîne postérieure'},
       {s:1,t:'Résultat entre 8 et 20 cm — manque de souplesse chaîne postérieure'},
       {s:2,t:'Résultat entre 21 et 29 cm — Bon'},
       {s:3,t:'Résultat supérieur à 29 cm — Parfait. Bonne souplesse chaîne postérieure'}
     ]}
  ]},
  {id:'mob_sup',title:'Mobilité — Membre Supérieur',badge:'badge-force',label:'MOB SUP',sh:'sh-force',tests:[
    {id:'t7',num:7,name:'Rotation Externe sur Compas',desc:'Amplitude rotation externe de l\'épaule',bilateral:true,
     type:'numeric',unit:'°',
     thr:[{s:0,l:'Douleur'},{s:1,l:'= 0°'},{s:2,l:'0–30°'},{s:3,l:'> 30°'}],
     auto:(v)=>{const n=parseFloat(v);if(isNaN(n)||v==='')return null;if(n<0)return 0;if(n===0)return 1;if(n<=30)return 2;return 3;},
     crit:[
       {s:0,t:'Douleurs lors du test et n\'arrive pas à placer le coude à 90°'},
       {s:1,t:'Place le coude à 90° mais ne peut aller au-delà'},
       {s:2,t:'Angle de rotation compris entre 0° et 30°'},
       {s:3,t:'Angle de rotation supérieur à 30°'}
     ]},
    {id:'t8',num:8,name:'Sleeper Shoulder Test',desc:'Mobilité rotation interne épaule en décubitus',bilateral:true,type:'score',
     crit:[
       {s:0,t:'Douleurs au niveau de l\'épaule lors de l\'exécution et très peu d\'amplitude'},
       {s:1,t:'Amplitude inférieure à 45° par rapport à l\'axe vertical'},
       {s:2,t:'Bonne amplitude — le bout des doigts touche le sol'},
       {s:3,t:'Grande amplitude — main à plat au sol'}
     ]},
    {id:'t9',num:9,name:'Chandelier',desc:'Test de mobilité en chandelier — rachis dorsal',bilateral:false,type:'score',
     crit:[
       {s:0,t:'Douleurs et impossible de placer les poignets contre le mur avec un angle de flexion de 90°'},
       {s:1,t:'Impossible de placer les poignets contre le mur dans la position du chandelier'},
       {s:2,t:'Chandelier OK'},
       {s:3,t:'Chandelier + extension des bras au-dessus de la tête en conservant tous les points de contact'}
     ]},
    {id:'t10',num:10,name:'Shoulder FMS',desc:'Mobilité globale de l\'épaule — FMS',bilateral:true,
     type:'numeric',unit:'cm',hint:'Réf: lg. de la main',
     thr:[{s:0,l:'Douleur'},{s:1,l:'> 1,5× lg main'},{s:2,l:'= lg main'},{s:3,l:'< lg main'}],
     auto:(v,sess)=>{
       const ecart=parseFloat(v);
       if(isNaN(ecart)||v==='') return null;
       if(ecart<0) return 0;
       let lgMain=parseFloat(sess&&sess.lgMainDom);
       if(isNaN(lgMain)||lgMain<=0){
         try{
           const _p=(typeof players!=='undefined'&&typeof cPid!=='undefined')?players.find(x=>x.id===cPid):null;
           const _s=_p?getCurrSess(_p):null;
           lgMain=parseFloat(_s&&_s.lgMainDom);
         }catch(e){}
       }
       if(isNaN(lgMain)||lgMain<=0) return null;
       if(ecart>lgMain*1.5) return 1;
       if(ecart>lgMain) return 2;
       return 3;
     },
     crit:[
       {s:0,t:'Douleurs et impossibilité de réaliser le test'},
       {s:1,t:'Grand manque d\'amplitude — distance représentant 1,5× la longueur de la main'},
       {s:2,t:'Distance entre les deux poings égale à la longueur de la main'},
       {s:3,t:'Écart entre les deux mains inférieur à la longueur totale de la main'}
     ]}
  ]},
  {id:'stab',title:'Stabilité Articulaire',badge:'badge-puiss',label:'STAB',sh:'sh-puiss',tests:[
    {id:'t11',num:11,name:'Siccy Squat Dynamique',desc:'Contrôle dynamique des membres inférieurs',bilateral:false,type:'score',
     crit:[
       {s:0,t:'Douleurs et/ou n\'arrive pas à maintenir la position à genoux'},
       {s:1,t:'Réalise l\'exercice avec inclinaison limitée (30°–45°) et/ou se déstructure lors de la remontée'},
       {s:2,t:'Bonne inclinaison (30°–45°) en conservant une bonne stabilité du tronc'},
       {s:3,t:'Grande inclinaison (> 45°) en conservant une bonne stabilité du tronc'}
     ]},
    {id:'t12',num:12,name:'Nordic Hamstring Dynamique',desc:'Force excentrique ischio-jambiers',bilateral:false,type:'score',
     crit:[
       {s:0,t:'Douleurs et/ou n\'arrive pas à maintenir la position à genoux'},
       {s:1,t:'Réalise l\'exercice avec inclinaison limitée (30°–45°) et/ou se déstructure lors de la remontée'},
       {s:2,t:'Bonne inclinaison (30°–45°) en conservant une bonne stabilité du tronc'},
       {s:3,t:'Grande inclinaison (> 45°) en conservant une bonne stabilité du tronc'}
     ]},
    {id:'t13',num:13,name:'Rotary Stability',desc:'Stabilité rotatoire du tronc — FMS',bilateral:true,type:'score',
     crit:[
       {s:0,t:'Douleurs et/ou impossible de réaliser l\'exercice'},
       {s:1,t:'Échec lors de la réalisation croisée et manque de contrôle moteur'},
       {s:2,t:'Maîtrise le travail en chaîne croisée sans compensation'},
       {s:3,t:'Maîtrise le travail unilatéral'}
     ]},
    {id:'t14',num:14,name:'Copenhagen Plank',desc:'Stabilité adducteurs en appui latéral',bilateral:true,
     type:'numeric',unit:'s',
     thr:[{s:0,l:'< 30s'},{s:1,l:'30–45s'},{s:2,l:'45–60s'},{s:3,l:'≥ 60s'}],
     auto:(v)=>{const n=parseFloat(v);if(isNaN(n)||v==='')return null;if(n<30)return 0;if(n<45)return 1;if(n<60)return 2;return 3;},
     crit:[
       {s:0,t:'Douleurs et impossibilité de tenir la position sur 30″'},
       {s:1,t:'Compensation technique et temps de travail inférieur à 45″'},
       {s:2,t:'Bonne exécution technique et temps de travail compris entre 45″ et 60″'},
       {s:3,t:'Bonne exécution technique et temps de travail supérieur à 60″'}
     ]},
    {id:'t15',num:15,name:'Banana Plank — 10 kg',desc:'Gainage global avec charge',bilateral:false,
     type:'numeric',unit:'s',
     thr:[{s:0,l:'< 30s'},{s:1,l:'30–45s'},{s:2,l:'45–60s'},{s:3,l:'≥ 60s'}],
     auto:(v)=>{const n=parseFloat(v);if(isNaN(n)||v==='')return null;if(n<30)return 0;if(n<45)return 1;if(n<60)return 2;return 3;},
     crit:[
       {s:0,t:'Douleurs et impossibilité de tenir la position sur 30″'},
       {s:1,t:'Compensation technique et temps de travail inférieur à 45″'},
       {s:2,t:'Bonne exécution technique et temps de travail compris entre 45″ et 60″'},
       {s:3,t:'Bonne exécution technique et temps de travail supérieur à 60″'}
     ]},
    {id:'t16',num:16,name:'GHD Sorensen — 10 kg',desc:'Extension lombaire isométrique avec charge',bilateral:false,
     type:'numeric',unit:'s',
     thr:[{s:0,l:'< 30s'},{s:1,l:'30–45s'},{s:2,l:'45–60s'},{s:3,l:'≥ 60s'}],
     auto:(v)=>{const n=parseFloat(v);if(isNaN(n)||v==='')return null;if(n<30)return 0;if(n<45)return 1;if(n<60)return 2;return 3;},
     crit:[
       {s:0,t:'Douleurs et impossibilité de tenir la position sur 30″'},
       {s:1,t:'Compensation technique et temps de travail inférieur à 45″'},
       {s:2,t:'Bonne exécution technique et temps de travail compris entre 45″ et 60″'},
       {s:3,t:'Bonne exécution technique et temps de travail supérieur à 60″'}
     ]}
  ]},
  {id:'fonc',title:'Fonctionnel',badge:'badge-cardi',label:'FONC',sh:'sh-cardi',tests:[
    {id:'t17',num:17,name:'Deep Squat FMS',desc:'Mobilité et stabilité globale — squat profond',bilateral:false,type:'score',
     crit:[
       {s:0,t:'Douleurs lors de la réalisation du test — impossible à réaliser'},
       {s:1,t:'Perte d\'équilibre, buste penché en avant et manque de profondeur dans le squat (mobilité et contrôle moteur)'},
       {s:2,t:'Mouvement réussi avec planche sous les talons'},
       {s:3,t:'Mouvement parfait — fémur sous l\'axe des 90°, pieds parallèles, genoux droits, bassin fixé, dos neutre, regard vers l\'avant'}
     ]},
    {id:'t18',num:18,name:'Trunk Push Up FMS',desc:'Stabilité du tronc en push-up — FMS',bilateral:false,type:'score',
     crit:[
       {s:0,t:'Douleurs et impossible de réaliser l\'exercice sans compensation'},
       {s:1,t:'Mouvement réalisé avec les mains au niveau des clavicules (pompe classique) sans compensation'},
       {s:2,t:'Mouvement réalisé avec les mains au niveau du menton sans compensation'},
       {s:3,t:'Mouvement parfait — mains au niveau du front, sans compensation, gainage parfait'}
     ]},
    {id:'t19',num:19,name:'Stabilité Unipodale sur Pointe',desc:'Équilibre dynamique unipodal',bilateral:true,
     type:'numeric',unit:'s',
     thr:[{s:0,l:'< 30s'},{s:1,l:'30–45s'},{s:2,l:'45–60s'},{s:3,l:'≥ 60s'}],
     auto:(v)=>{const n=parseFloat(v);if(isNaN(n)||v==='')return null;if(n<30)return 0;if(n<45)return 1;if(n<60)return 2;return 3;},
     crit:[
       {s:0,t:'Douleurs et impossibilité de tenir la position sur 30″'},
       {s:1,t:'Compensation technique et temps < 45″. Bras et buste bougent énormément pour stabiliser'},
       {s:2,t:'Bonne exécution et temps entre 45″ et 60″. Quelques compensations avec les membres libres'},
       {s:3,t:'Bonne exécution et temps > 60″. Très peu de compensations'}
     ]},
    {id:'t20',num:20,name:'Drop Valgus Step',desc:'Contrôle valgus en réception — H=20cm, Appel=50cm',bilateral:true,type:'score',
     crit:[
       {s:0,t:'Douleurs lors du test et instabilité importante'},
       {s:1,t:'Réception instable avec besoin de sursaut pour se stabiliser. Genou vers l\'intérieur sans douleur'},
       {s:2,t:'Réception stable avec accompagnement de certains segments pour verrouiller la position'},
       {s:3,t:'Réception stable sans mouvements complémentaires'}
     ]}
  ]}
];


// ─── ZONES ANATOMIQUES ───────────────────────────────────
const ZONES_META = {
  /* ── FRONT ── */
  tete:        {l:'Tête',                    v:'f'},
  cou:         {l:'Cou antérieur',           v:'f'},
  epaule_d:    {l:'Épaule droite',           v:'f'},
  epaule_g:    {l:'Épaule gauche',           v:'f'},
  pec_d:       {l:'Pectoral droit',          v:'f'},
  pec_g:       {l:'Pectoral gauche',         v:'f'},
  abdo_h:      {l:'Abdomen supérieur',       v:'f'},
  abdo_b:      {l:'Abdomen inférieur',       v:'f'},
  biceps_d:    {l:'Biceps droit',            v:'f'},
  biceps_g:    {l:'Biceps gauche',           v:'f'},
  coude_d:     {l:'Coude droit',             v:'f'},
  coude_g:     {l:'Coude gauche',            v:'f'},
  avbras_d:    {l:'Avant-bras droit',        v:'f'},
  avbras_g:    {l:'Avant-bras gauche',       v:'f'},
  main_d:      {l:'Poignet / Main droite',   v:'f'},
  main_g:      {l:'Poignet / Main gauche',   v:'f'},
  hanche_d:    {l:'Aine / Hanche droite',    v:'f'},
  hanche_g:    {l:'Aine / Hanche gauche',    v:'f'},
  adducteur_d: {l:'Adducteurs droit',        v:'f'},
  adducteur_g: {l:'Adducteurs gauche',       v:'f'},
  quad_d:      {l:'Quadriceps droit',        v:'f'},
  quad_g:      {l:'Quadriceps gauche',       v:'f'},
  genou_d:     {l:'Genou droit',             v:'f'},
  genou_g:     {l:'Genou gauche',            v:'f'},
  tibia_d:     {l:'Tibia droit',             v:'f'},
  tibia_g:     {l:'Tibia gauche',            v:'f'},
  pied_d:      {l:'Cheville / Pied droit',   v:'f'},
  pied_g:      {l:'Cheville / Pied gauche',  v:'f'},
  /* ── BACK ── */
  tete_b:      {l:'Tête',                         v:'b'},
  nuque:       {l:'Nuque',                         v:'b'},
  trap_d:      {l:'Trapèze droit',                 v:'b'},
  trap_g:      {l:'Trapèze gauche',                v:'b'},
  scapula_d:   {l:'Scapula / Dorsal droit',        v:'b'},
  scapula_g:   {l:'Scapula / Dorsal gauche',       v:'b'},
  lombaire_d:  {l:'Lombaires droit',               v:'b'},
  lombaire_g:  {l:'Lombaires gauche',              v:'b'},
  triceps_d:   {l:'Triceps droit',                 v:'b'},
  triceps_g:   {l:'Triceps gauche',                v:'b'},
  coude_db:    {l:'Coude droit arrière',           v:'b'},
  coude_gb:    {l:'Coude gauche arrière',          v:'b'},
  avbras_db:   {l:'Avant-bras droit arrière',      v:'b'},
  avbras_gb:   {l:'Avant-bras gauche arrière',     v:'b'},
  fess_d:      {l:'Fessier droit',                 v:'b'},
  fess_g:      {l:'Fessier gauche',                v:'b'},
  ischio_d:    {l:'Ischio-jambier droit',          v:'b'},
  ischio_g:    {l:'Ischio-jambier gauche',         v:'b'},
  genou_db:    {l:'Genou droit arrière',           v:'b'},
  genou_gb:    {l:'Genou gauche arrière',          v:'b'},
  mollet_d:    {l:'Mollet droit',                  v:'b'},
  mollet_g:    {l:'Mollet gauche',                 v:'b'},
  talon_d:     {l:'Cheville / Talon droit arrière',v:'b'},
  talon_g:     {l:'Cheville / Talon gauche arrière',v:'b'},
};
