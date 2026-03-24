// Fenix Toulouse — bodychart.js
// Extrait de app.js (lignes 546-1067)
// ─── INJURY FORM HTML ─────────────────────────────────────
let _injPerturbe = true;
function renderInjFormHTML(pid){
  return `<div class="inj-form" id="injFormBlock">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:2px;color:var(--cyan);margin-bottom:12px">${_injEditIdx!==null?'✏️ MODIFIER L\'ANTÉCÉDENT':'NOUVEL ANTÉCÉDENT'}</div>

    <!-- Ligne 1 : Date + Catégorie -->
    <div class="inj-form-grid">
      <div>
        <label>Date de la lésion</label>
        <input type="month" id="injDate">
      </div>
      <div>
        <label>Catégorie</label>
        <select id="injCategorie">
          <option value="">— Sélectionner —</option>
          <option value="Musculaire">Musculaire</option>
          <option value="Articulaire">Articulaire</option>
          <option value="Osseuse">Osseuse</option>
          <option value="Tendineuse">Tendineuse</option>
          <option value="Ligamentaire">Ligamentaire</option>
          <option value="Autre">Autre</option>
        </select>
      </div>
    </div>

    <!-- Ligne 2 : Appellation + Localisation -->
    <div class="inj-form-grid">
      <div>
        <label>Appellation</label>
        <select id="injType">
          <option value="">— Sélectionner —</option>
          <option>Entorse</option>
          <option>Luxation</option>
          <option>Fracture</option>
          <option>Fissure</option>
          <option>Élongation</option>
          <option>Déchirure musculaire</option>
          <option>Rupture ligamentaire</option>
          <option>Rupture tendineuse</option>
          <option>Tendinopathie</option>
          <option>Contusion</option>
          <option>Pubalgie</option>
          <option>Lombalgie</option>
          <option>Autre</option>
        </select>
      </div>
      <div>
        <label>Localisation</label>
        <select id="injLocalisation">
          <option value="">— Sélectionner —</option>
          <optgroup label="Membre inférieur">
            <option>Pied</option>
            <option>Cheville</option>
            <option>Tibia / Péroné</option>
            <option>Genou</option>
            <option>Cuisse</option>
            <option>Hanche</option>
            <option>Aine / Adducteurs</option>
            <option>Fessier</option>
          </optgroup>
          <optgroup label="Tronc">
            <option>Lombaires</option>
            <option>Abdominaux</option>
            <option>Côtes</option>
            <option>Colonne vertébrale</option>
          </optgroup>
          <optgroup label="Membre supérieur">
            <option>Épaule</option>
            <option>Coude</option>
            <option>Avant-bras</option>
            <option>Poignet</option>
            <option>Main / Doigts</option>
          </optgroup>
          <optgroup label="Tête / Cou">
            <option>Nuque / Cou</option>
            <option>Tête</option>
          </optgroup>
        </select>
      </div>
    </div>

    <!-- Ligne 3 : Côté + Durée -->
    <div class="inj-form-grid">
      <div>
        <label>Côté</label>
        <div style="display:flex;gap:6px;margin-top:4px">
          <button class="inj-toggle-btn" id="injCoteG" onclick="setInjCote('G')" style="flex:1">Gauche</button>
          <button class="inj-toggle-btn" id="injCoteD" onclick="setInjCote('D')" style="flex:1">Droite</button>
          <button class="inj-toggle-btn" id="injCoteB" onclick="setInjCote('B')" style="flex:1">Bilatéral</button>
        </div>
      </div>
      <div>
        <label>Durée d'indisponibilité</label>
        <div style="display:flex;gap:6px;margin-top:4px">
          <input type="number" id="injDurNb" min="0" placeholder="Ex: 3"
            style="width:70px;background:rgba(0,0,0,.3);border:1px solid var(--border-2);
              border-radius:6px;padding:7px 10px;color:var(--text);font-family:'Barlow',sans-serif;font-size:12px">
          <select id="injDurUnit" style="flex:1;background:rgba(0,0,0,.3);border:1px solid var(--border-2);
            border-radius:6px;padding:7px 10px;color:var(--text);font-family:'Barlow',sans-serif;font-size:12px">
            <option value="semaine(s)">Semaine(s)</option>
            <option value="mois">Mois</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Description libre -->
    <div>
      <label>Description / Notes complémentaires</label>
      <input type="text" id="injDesc" placeholder="Ex: Grade II, récidive, opéré…">
    </div>

    <!-- Perturbe encore -->
    <div>
      <label>Perturbe encore le fonctionnement ?</label>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div class="inj-perturbe-toggle">
          <button class="inj-toggle-btn active-oui" id="injBtn_oui" onclick="setInjPerturbe(true)">⚠ Oui</button>
          <button class="inj-toggle-btn" id="injBtn_non" onclick="setInjPerturbe(false)">✓ Non / Résolu</button>
        </div>
        <input type="text" id="injPerturbeNote" placeholder="Préciser si oui (contrainte motrice, psychologique…)"
          style="flex:1;min-width:200px;background:rgba(0,0,0,.3);border:1px solid var(--border-2);
            border-radius:6px;padding:7px 10px;color:var(--text);font-family:'Barlow',sans-serif;font-size:12px">
      </div>
    </div>

    <div style="display:flex;gap:8px;margin-top:14px">
      <button class="btn btn-cyan" onclick="saveInjury('${pid}')">✓ Enregistrer</button>
      <button class="btn btn-outline" onclick="cancelInjury()">Annuler</button>
    </div>
  </div>`;
}
function setInjPerturbe(val){
  _injPerturbe=val;
  const btn_o=document.getElementById('injBtn_oui');
  const btn_n=document.getElementById('injBtn_non');
  if(btn_o) btn_o.className='inj-toggle-btn'+(val?' active-oui':'');
  if(btn_n) btn_n.className='inj-toggle-btn'+(!val?' active-non':'');
}
let _injCote = '';
function setInjCote(val){
  _injCote = val;
  ['G','D','B'].forEach(c=>{
    const btn=document.getElementById('injCote'+c);
    if(btn) btn.className='inj-toggle-btn'+(val===c?' active-oui':'');
  });
}

// ─── BODY SVG WITH INJ ZONES ──────────────────────────────
function buildBodySVGWithInjZones(p, injZoneIds){
  return buildBodySVG(p, injZoneIds);
}

// ─── BM2 READ-ONLY (pour rapport) ─────────────────────────
// Génère le SVG BM2 face+dos côte à côte, sans interaction,
// zones colorées d'après p.bodyChart. Réutilise les mêmes paths
// que la fiche testing (form-render.js).
function buildBM2ReadOnlySVG(p, width, injZoneIds) {
  width = width || 500;
  const height = Math.round(width * 1024 / 1366);
  const bc = (p && p.bodyChart) ? p.bodyChart : {};
  const inj = injZoneIds || new Set();
  const cls = function(zid) {
    const lvl = bc[zid] || 0;
    if (lvl > 0) return 'bz2 bz2-' + lvl;
    if (inj.has(zid)) return 'bz2 bz2-inj';
    return 'bz2 bz2-0';
  };
  const z = function(zid, title) {
    return 'class="' + cls(zid) + '" title="' + title + '"';
  };
  return `<svg viewBox="0 0 1366 1024" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:100%;pointer-events:none;cursor:default">
  <image href="assets/img/datauri_2.png" x="-137" y="-7" width="768" height="1024"/>
  <image href="assets/img/datauri_3.png" x="728" y="-7" width="768" height="1024"/>
  <text x="302" y="1010" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#bbb">FACE</text>
  <text x="1068" y="1010" text-anchor="middle" font-family="sans-serif" font-size="26" fill="#bbb">DOS</text>
  <path ${z('cou_f','Cou')} d="M284.08 185.424L275 138L302.743 153.808L332 138L322.92 185.424L302.743 215L284.08 185.424Z"/>
  <path ${z('tete_f','Tête')} d="M263.5 50.5L261 83.5L255 86V95.5L258 106.5L266 110.5L275 139.5L291.5 150.5H313.5L333.5 137L339.5 110.5L349 102.5V86L342.5 83.5L339.5 50.5L327 35.5L301.5 28.5L282.5 32.5L263.5 50.5Z"/>
  <path ${z('trap_d','Trapèze D')} d="M272 163L275 138.5L283.5 185.5L299.5 212L260.5 201L236 198H216L272 163Z"/>
  <path ${z('trap_g','Trapèze G')} d="M321 205L303.5 215L323 185L332.5 138.5V154.5L338 167.5L383 195.5L343 199.5L321 205Z"/>
  <path ${z('epaule_d','Épaule D')} d="M218.5 206.5L215 200L189 206.5L170 220L158 242V279.5L179 268L186.5 258.5L206 242L218.5 220V206.5Z"/>
  <path ${z('epaule_g','Épaule G')} d="M386.5 215.5L390.5 199L417 206L436 218.5L447.5 240.5V280L428.5 267L394.5 235L386.5 215.5Z"/>
  <path ${z('pec_d','Pectoral D')} d="M207.5 271L205 243.5L215.5 226.5L219 214L215.5 201.5L221 198L264 201.5L303 214V287.5L290.5 291L247.5 294L223.5 287.5L207.5 271Z"/>
  <path ${z('pec_g','Pectoral G')} d="M320 205.5L304 215V287.5L332 293H368.5L386.5 287.5L398 272.5L400.5 242L394 234L386.5 215L390.5 200L381.5 195.5L341.5 200L320 205.5Z"/>
  <path ${z('cote_d','Côtes D')} d="M179 268L158 279L151.5 306.5L147 341.5L162 360.5H179L190 353.5L205.5 316L207.5 272.5L194 268H179Z"/>
  <path ${z('cote_g','Côtes G')} d="M408 267L398.5 274V311L411.5 348.5L421.5 358L440.5 361L448 356L458.5 340.5L448 280L427.5 267H408Z"/>
  <path ${z('avbras_d','Avant-bras D')} d="M132 365L147 343L162.5 359.5H179L189.5 354.5V379L179 405.5L155.5 446.5L132 482.5L106 474.5L118 434.5L124 394L132 365Z"/>
  <path ${z('avbras_g','Avant-bras G')} d="M415.5 375V353L420.5 358.5L440.5 360.5L449 356.5L459 342L476 370L486 412L494.5 456L500.5 476L472.5 480.5L436 421L415.5 375Z"/>
  <path ${z('poignet_d','Poignet D')} d="M133.5 483L107.5 473L99.5 479L133.5 491.5V483Z"/>
  <path ${z('poignet_g','Poignet G')} d="M499.5 476L472.5 480.5V488.5L508 480.5L499.5 476Z"/>
  <path ${z('main_d','Main D')} d="M56.5 514.5L97 480L134 493L119.5 556.5L108 566.5L81.5 556.5V514.5L61 519.5L56.5 514.5Z"/>
  <path ${z('main_g','Main G')} d="M485.5 557.5L473 488.5L505.5 480L523.5 488.5L548 513V519L523.5 513L528.5 551.5L523.5 562.5L505.5 567L485.5 557.5Z"/>
  <path ${z('oblique_d','Oblique D')} d="M251.5 327.5L228 362.5L209.5 305.5V274.5L243.5 294.5L302.5 288V305.5L251.5 327.5Z"/>
  <path ${z('oblique_g','Oblique G')} d="M304.5 306V287L327.5 293.5H369.5L384 287L398 274.5V313L375.5 358.5L354 326L304.5 306Z"/>
  <path ${z('abdomen','Abdomen')} d="M256.5 449L247 336L302 305.5L350 324L360 336L350 454L311.5 524H292L256.5 449Z"/>
  <path ${z('adduct_d','Adducteurs D')} d="M247 335L230 361.5L216 463L293 525L259 451L247 335Z"/>
  <path ${z('adduct_g','Adducteurs G')} d="M350.5 454.5L361.5 338L375 359.5V392L389.5 464.5L312 525.5L350.5 454.5Z"/>
  <path ${z('adduct_d2','Adducteurs D')} d="M277.5 669L258 495.5L298 528V571.5L277.5 669Z"/>
  <path ${z('adduct_g2','Adducteurs G')} d="M350.5 493L310 527V570.5L327.5 673.5L345.5 589L350.5 493Z"/>
  <path ${z('quad_d','Quadriceps D')} d="M259 495.5L215.5 463L200 563.5L215.5 669.5H222.5L243.5 646L279 675L259 495.5Z"/>
  <path ${z('quad_g','Quadriceps G')} d="M391 462L351.5 494L346 587L331.5 668V676.5L365.5 648.5L386 668L395.5 664.5L407.5 593.5V538L391 462Z"/>
  <path ${z('genou_d','Genou D')} d="M239 734.5L215.5 710.5V667.5H224L244 647.5L279.5 676.5L268.5 725H259L239 734.5Z"/>
  <path ${z('genou_g','Genou G')} d="M348.5 724.5H336.5L330 676.5L336.5 672.5L366 650.5L386.5 666H394V712L366 734.5L348.5 724.5Z"/>
  <path ${z('jambe_d','Tibia/Péroné D')} d="M239.5 733L216 711L211.5 747.5V811.5L231.5 915L239.5 907.5L255 903L275 915L270 876L283.5 771.5L270 723.5L239.5 733Z"/>
  <path ${z('jambe_g','Tibia/Péroné G')} d="M347 726H338L325.5 774L333 830.5L338 912.5L347 907L358 903L376.5 912.5L381.5 876.5L394 816L401.5 761.5L394 712L365.5 734.5L347 726Z"/>
  <path ${z('chev_d','Cheville D')} d="M225.5 932.5L231 913.5L239.5 904H256L274.5 913.5L268.5 938L246.5 926L225.5 932.5Z"/>
  <path ${z('chev_g','Cheville G')} d="M335.5 922.5V912L359.5 904.5L381.5 912V932.5L359.5 928L339.5 938L335.5 922.5Z"/>
  <path ${z('pied_d','Pied D')} d="M199 968L228 932L247 927.5L270.5 942.5L275 968L270.5 977H233H199V968Z"/>
  <path ${z('pied_g','Pied G')} d="M332 961.5L338 939.5L360 927L382.5 934L409.5 969V977.5H338L332 961.5Z"/>
  <path ${z('tete_b','Tête')} d="M1033.5 34.5L1057 30.5L1081 38L1095 55V85.5H1102.5V97.5L1091.5 111L1081 137L1053.5 120.5L1027.5 137L1015.5 111L1009.5 97.5V85.5H1015.5V55L1033.5 34.5Z"/>
  <path ${z('nuque','Nuque')} d="M1028.5 136.5L1055 122L1081.5 136.5L1087 163.5H1022.5L1028.5 136.5Z"/>
  <path ${z('omoplate_g','Omoplate D')} d="M1003.5 219L972 212.5L945.5 256L959 284.5L993 297.5H1029.5L1003.5 219Z"/>
  <path ${z('omoplate_d','Omoplate G')} d="M1079 296.5L1104.5 219.5L1138.5 213.5L1149.5 244L1163.5 256.5L1149.5 285.5L1122 296.5H1079Z"/>
  <path ${z('dorsal','Grand Dorsal')} d="M958.5 284L963 323L975 357.5L980.5 389L970.5 428.5H1000L1012.5 433.5L1052 453.5L1105 428.5L1136.5 433.5L1133.5 360.5L1152 311.5V284L1124.5 297.5H1081.5L1064 339.5H1044L1026.5 297.5"/>
  <path ${z('fessier_g','Fessier D')} d="M961.5 489.5L972.5 435V428.5H996.5L1018 435L1051.5 455V532.5L1002.5 538.5L976.5 518L961.5 489.5Z"/>
  <path ${z('fessier_d','Fessier G')} d="M1093 542.5L1055 533.5V452L1104.5 427.5L1138.5 437L1148 492.5L1125 528.5L1093 542.5Z"/>
  <path ${z('triceps_g','Triceps D')} d="M895.5 344.5L911 268.5L945.5 255L957 286V307.5L939.5 362.5H931.5L915.5 368L904 362.5L895.5 344.5Z"/>
  <path ${z('triceps_d','Triceps G')} d="M1152.5 283.5L1163.5 257L1176 268.5H1197L1209.5 310L1214.5 345.5L1203 363.5L1189.5 368.5L1170 359L1152.5 310V283.5Z"/>
  <path ${z('coude_g','Coude D')} d="M897.5 386.5L904 363.5L920 368L931.5 363.5L920 395L897.5 391V386.5Z"/>
  <path ${z('coude_d','Coude G')} d="M1190 393L1178 365.5L1190 370L1205 365.5L1211 393H1190Z"/>
  <path ${z('avbras_g_b','Avant-bras D')} d="M878 377L896.5 344.5L905.5 364.5L896.5 390.5L920 396L932 364.5L940.5 361L932 400L883.5 484.5H867L857 478.5L878 377Z"/>
  <path ${z('avbras_d_b','Avant-bras G')} d="M1179.5 365.5L1171 360.5V374.5L1179.5 400.5L1226.5 485H1243L1253 476.5L1234 382L1215.5 345.5L1205 365.5L1210.5 392.5H1189.5L1179.5 365.5Z"/>
  <path ${z('main_g_b','Main D')} d="M835 490.5L856.5 478.5L869 483.5H887.5V497L873.5 558L860.5 567.5H843L835 561.5L829.5 554.5L835 516L814.5 521L808.5 516L835 490.5Z"/>
  <path ${z('main_d_b','Main G')} d="M1225.5 510V484.5H1242L1252 477.5L1280 493.5L1301 515L1294 521L1274.5 515L1280 559.5L1267.5 568H1252L1242 559.5L1236.5 554.5L1225.5 510Z"/>
  <path ${z('ischio_g','Ischio-jambier D')} d="M952.5 560.5L961.5 492.5L972 515L998.5 536L1028.5 541.5L1053.5 532L1049.5 595.5L1028.5 684.5L1017.5 680.5L990.5 676.5L972 684.5L957.5 637L952.5 560.5Z"/>
  <path ${z('ischio_d','Ischio-jambier G')} d="M1059 589.5V536.5L1095 543.5L1123 530L1150 492.5L1159.5 577.5L1140 682L1123 676.5L1088.5 682L1082.5 695L1059 589.5Z"/>
  <path ${z('poplit_g','Creux Poplité D')} d="M967 717.5L972 686L988.5 678H1003.5L1030.5 686V704L1023.5 721.5L1018 717.5V712L999 704L982 717.5H967Z"/>
  <path ${z('poplit_d','Creux Poplité G')} d="M1085.5 724L1081.5 692.5L1088.5 682.5L1123 678.5L1140 685.5L1143.5 699V719.5L1129 715L1119 705.5H1110L1091.5 715V724H1085.5Z"/>
  <path ${z('genou_g_b','Genou D')} d="M998 733L982 718L998 706L1019.5 713V722H1014L998 733Z"/>
  <path ${z('genou_d_b','Genou G')} d="M1106 723H1092.5V713.5L1106 708H1120L1128.5 717.5L1115 736.5L1106 723Z"/>
  <path ${z('mollet_g','Mollet D')} d="M959.5 767L967.5 718H984L998 731L1019.5 718L1024.5 725.5L1034 758.5L1030 816L1024.5 888.5V912V926.5L1005.5 912H998L988.5 926.5L984 917V888.5L967.5 816L959.5 767Z"/>
  <path ${z('mollet_d','Mollet G')} d="M1106 725H1085.5L1079 760V801.5L1085.5 857.5V911V926L1106 911L1127 926L1130.5 919L1127 896L1138 844L1152.5 772L1142.5 719H1127L1113 733L1106 725Z"/>
  <path ${z('chev_g_b','Cheville D')} d="M991 935.5L986 928L1003.5 911L1028 925.5L1025.5 935.5H991Z"/>
  <path ${z('chev_d_b','Cheville G')} d="M1085.5 938.5V928L1105 912.5L1126.5 928L1122 938.5L1105 934.5L1085.5 938.5Z"/>
  <path ${z('pied_g_b','Pied D')} d="M975 942L986.5 928.5L990.5 938H1022.5H1029.5V950V967.5L1004 978L981 967.5H968.5L959 957V950L975 942Z"/>
  <path ${z('pied_d_b','Pied G')} d="M1083 959.5L1087.5 939.5L1095 936H1110L1124 939.5L1129 930.5L1139.5 947.5H1148.5L1155.5 953.5V959.5L1148.5 967H1134.5L1124 971.5L1110 977.5H1095L1083 971.5V959.5Z"/>
  <path ${z('trap_b','Trapèze')} d="M955 200L1023.5 163.5H1086.5L1154.5 200L1102 221L1061.5 339.5H1043.5L1003.5 216.5L955 200Z"/>
  <path ${z('epaule_g_b','Épaule D')} d="M929.5 208.5L953 201.5L971 213L947.5 252L909.5 268.5L913.5 238.5L929.5 208.5Z"/>
  <path ${z('epaule_d_b','Épaule G')} d="M1154.5 202L1137.5 213L1150.5 244L1175.5 266L1200.5 270.5V258.5L1191.5 224.5L1175.5 207L1154.5 202Z"/>
</svg>`;
}




// ─── BODY MAP 2 ──────────────────────────────────────────
const ZONES_META2 = {
  "cou_f": {l:"Cou"},
  "tete_f": {l:"Tête"},
  "trap_d": {l:"Trapèze D"},
  "trap_g": {l:"Trapèze G"},
  "epaule_d": {l:"Épaule D"},
  "epaule_g": {l:"Épaule G"},
  "pec_d": {l:"Pectoral D"},
  "pec_g": {l:"Pectoral G"},
  "cote_d": {l:"Côtes D"},
  "cote_g": {l:"Côtes G"},
  "avbras_d": {l:"Avant-bras D"},
  "avbras_g": {l:"Avant-bras G"},
  "poignet_d": {l:"Poignet D"},
  "poignet_g": {l:"Poignet G"},
  "main_d": {l:"Main D"},
  "main_g": {l:"Main G"},
  "oblique_d": {l:"Oblique D"},
  "oblique_g": {l:"Oblique G"},
  "abdomen": {l:"Abdomen"},
  "adduct_d": {l:"Adducteurs D"},
  "adduct_g": {l:"Adducteurs G"},
  "adduct_d2": {l:"Adducteurs D"},
  "adduct_g2": {l:"Adducteurs G"},
  "quad_d": {l:"Quadriceps D"},
  "quad_g": {l:"Quadriceps G"},
  "genou_d": {l:"Genou D"},
  "genou_g": {l:"Genou G"},
  "jambe_d": {l:"Tibia/Péroné D"},
  "jambe_g": {l:"Tibia/Péroné G"},
  "chev_d": {l:"Cheville D"},
  "chev_g": {l:"Cheville G"},
  "pied_d": {l:"Pied D"},
  "pied_g": {l:"Pied G"},
  "tete_b": {l:"Tête"},
  "nuque": {l:"Nuque"},
  "omoplate_d": {l:"Omoplate D"},
  "omoplate_g": {l:"Omoplate G"},
  "dorsal": {l:"Grand Dorsal"},
  "fessier_d": {l:"Fessier D"},
  "fessier_g": {l:"Fessier G"},
  "triceps_d": {l:"Triceps D"},
  "triceps_g": {l:"Triceps G"},
  "coude_d": {l:"Coude D"},
  "coude_g": {l:"Coude G"},
  "avbras_d_b": {l:"Avant-bras D"},
  "avbras_g_b": {l:"Avant-bras G"},
  "main_d_b": {l:"Main D"},
  "main_g_b": {l:"Main G"},
  "ischio_d": {l:"Ischio-jambier D"},
  "ischio_g": {l:"Ischio-jambier G"},
  "poplit_d": {l:"Creux Poplité D"},
  "poplit_g": {l:"Creux Poplité G"},
  "genou_d_b": {l:"Genou D"},
  "genou_g_b": {l:"Genou G"},
  "mollet_d": {l:"Mollet D"},
  "mollet_g": {l:"Mollet G"},
  "chev_d_b": {l:"Cheville D"},
  "chev_g_b": {l:"Cheville G"},
  "pied_d_b": {l:"Pied D"},
  "pied_g_b": {l:"Pied G"},
  "trap_b": {l:"Trapèze"},
  "epaule_d_b": {l:"Épaule D"},
  "epaule_g_b": {l:"Épaule G"}
};
const _BM2_IDS = ["cou_f", "tete_f", "trap_d", "trap_g", "epaule_d", "epaule_g", "pec_d", "pec_g", "cote_d", "cote_g", "avbras_d", "avbras_g", "poignet_d", "poignet_g", "main_d", "main_g", "oblique_d", "oblique_g", "abdomen", "adduct_d", "adduct_g", "adduct_d2", "adduct_g2", "quad_d", "quad_g", "genou_d", "genou_g", "jambe_d", "jambe_g", "chev_d", "chev_g", "pied_d", "pied_g", "tete_b", "nuque", "omoplate_d", "omoplate_g", "dorsal", "fessier_d", "fessier_g", "triceps_d", "triceps_g", "coude_d", "coude_g", "avbras_d_b", "avbras_g_b", "main_d_b", "main_g_b", "ischio_d", "ischio_g", "poplit_d", "poplit_g", "genou_d_b", "genou_g_b", "mollet_d", "mollet_g", "chev_d_b", "chev_g_b", "pied_d_b", "pied_g_b", "trap_b", "epaule_d_b", "epaule_g_b"];

function buildBodyMap2(p, injZoneIds) {
  // Le SVG est statique dans le HTML — on retourne juste un wrapper vide
  // Le SVG est déjà dans le DOM via renderForm
  return '<!-- SVG is static -->';
}

function refreshBodyMap2Classes(p, injZoneIds) {
  const bc = (p && p.bodyChart) ? p.bodyChart : {};
  const inj = injZoneIds || new Set();
  _BM2_IDS.forEach(function(zid) {
    const el = document.getElementById('bz2_' + zid);
    if(!el) return;
    const lvl = bc[zid] || 0;
    const isInj = inj.has(zid);
    el.setAttribute('class', lvl > 0 ? ('bz2 bz2-'+lvl) : (isInj ? 'bz2 bz2-inj' : 'bz2 bz2-0'));
  });
}

function clickBodyZone2(event, zid) {
  event.stopPropagation();
  if(!cPid) return;
  const _p = players.find(function(x){return x.id===cPid;}); if(!_p) return;
  const sess = getCurrSess(_p);
  if(!sess.bodyChart) sess.bodyChart = {};
  const cur = sess.bodyChart[zid] || 0;
  const next = cur >= 3 ? 0 : cur + 1;
  if(next === 0) delete sess.bodyChart[zid]; else sess.bodyChart[zid] = next;
  save();
  const el = document.getElementById('bz2_' + zid);
  if(el) {
    const injIds = getInjZoneIds(_p);
    el.setAttribute('class', next > 0 ? ('bz2 bz2-'+next) : (injIds.has(zid) ? 'bz2 bz2-inj' : 'bz2 bz2-0'));
  }
  renderBodyMap2Legend({bodyChart: sess.bodyChart});
}

function getInjZoneIds(p) {
  const ids = new Set();
  (p.injuries||[]).forEach(function(inj) { (inj.zones||[]).forEach(function(z) { ids.add(z.id); }); });
  return ids;
}

function renderBodyMap2Legend(p) {
  const el = document.getElementById('bm2Legend'); if(!el) return;
  const bc = (p && p.bodyChart) ? p.bodyChart : {};
  const active = Object.entries(bc).filter(function(e){return e[1]>0;}).sort(function(a,b){return b[1]-a[1];});
  if(!active.length) { el.innerHTML=''; return; }
  el.innerHTML = active.map(function(e) {
    const zid=e[0], lvl=e[1];
    const m = ZONES_META2[zid];
    const lbl = lvl===1?'Gêne':lvl===2?'Douleur':'Vive douleur';
    return m ? '<span class="bm2-legend-item bm2-lv'+lvl+'">● '+m.l+' — '+lbl+'</span>' : '';
  }).join('');
}

// ─── BODY CHART (zone inj CSS) ────────────────────────────
function painClass(lvl){ return 'bz bz-'+(lvl||0); }
function painLabel(lvl){ return lvl===1?'Gêne':lvl===2?'Douleur':'Vive douleur'; }

function clickBodyZone(zid){
  if(!cPid) return;
  const p = players.find(x=>x.id===cPid); if(!p) return;
  const sess=getCurrSess(p);
  if(!sess.bodyChart) sess.bodyChart={};
  const cur = sess.bodyChart[zid]||0;
  const next = cur>=3 ? 0 : cur+1;
  if(next===0) delete sess.bodyChart[zid]; else sess.bodyChart[zid]=next;
  save();
  document.querySelectorAll(`.bz[data-zone="${zid}"]`).forEach(el=>{
    el.setAttribute('class', painClass(next));
    el.setAttribute('data-zone', zid);
  });
  renderPainSummary({bodyChart:sess.bodyChart});
}

function renderPainSummary(p){
  const bar = document.getElementById('pain-summary-bar');
  if(!bar) return;
  const bc = p.bodyChart||{};
  const active = Object.entries(bc).filter(([,lvl])=>lvl>0);
  if(!active.length){ bar.innerHTML=''; return; }
  bar.innerHTML = active.map(([zid,lvl])=>{
    const m = ZONES_META[zid];
    return m ? `<span class="injury-zone-tag zt-${lvl}"><span style="font-size:9px">●</span> ${m.l}</span>` : '';
  }).join('');
}

function switchBodyView(view){
  bodyChartView = view;
  document.querySelectorAll('.bct-btn').forEach(b=> b.classList.toggle('active', b.dataset.view===view));
  const front = document.getElementById('bc-front');
  const back = document.getElementById('bc-back');
  if(front) front.style.display = view==='f'?'block':'none';
  if(back)  back.style.display  = view==='b'?'block':'none';
}

function buildBodySVG(p, injZoneIds){
  const bc = p.bodyChart||{};
  const cls = id => {
    const pain = bc[id]||0;
    if(pain>0) return 'bz bz-'+pain;
    if(injZoneIds && injZoneIds.has(id)) return 'bz bz-inj';
    return 'bz bz-0';
  };
  const z = (id,title) => `class="${cls(id)}" data-zone="${id}" onclick="clickBodyZone('${id}')" title="${title}"`;
  const dv = bodyChartView;

  const front = `<svg id="bc-front" viewBox="0 0 768 1024" xmlns="http://www.w3.org/2000/svg"
    style="width:200px;height:267px;display:${dv==='f'?'block':'none'}">
  <image href="assets/img/datauri_4.png" x="0" y="0" width="768" height="1024"/>

  <!-- HEAD -->
  <ellipse ${z('tete','Tête')} cx="384" cy="290" rx="40" ry="52"/>

  <!-- NECK -->
  <path ${z('cou','Cou antérieur')} d="M364,342 Q364,360 362,374 L384,382 L406,374 Q404,360 404,342 Q396,336 384,336 Q372,336 364,342Z"/>

  <!-- SHOULDER D (image left = patient right) -->
  <path ${z('epaule_d','Épaule droite')} d="M312,384 C290,392 268,408 264,428 C262,440 266,454 276,462 C282,452 284,436 286,420 C288,408 292,396 298,388 Q306,384 312,384Z"/>

  <!-- SHOULDER G (image right = patient left) -->
  <path ${z('epaule_g','Épaule gauche')} d="M456,384 C478,392 500,408 504,428 C506,440 502,454 492,462 C486,452 484,436 482,420 C480,408 476,396 470,388 Q462,384 456,384Z"/>

  <!-- PECTORAL D -->
  <path ${z('pec_d','Pectoral droit')} d="M298,392 C284,400 270,416 266,434 C264,448 268,462 278,468 C294,472 314,466 328,456 C340,446 346,430 342,416 C338,404 326,394 314,392 Q306,390 298,392Z"/>

  <!-- PECTORAL G -->
  <path ${z('pec_g','Pectoral gauche')} d="M470,392 C484,400 498,416 502,434 C504,448 500,462 490,468 C474,472 454,466 440,456 C428,446 422,430 426,416 C430,404 442,394 454,392 Q462,390 470,392Z"/>

  <!-- ABDOMEN SUP -->
  <path ${z('abdo_h','Abdomen supérieur')} d="M300,478 C290,490 286,506 288,522 C290,538 298,552 310,558 L384,562 L458,558 C470,552 478,538 480,522 C482,506 478,490 468,478 C450,470 418,466 384,466 C350,466 318,470 300,478Z"/>

  <!-- ABDOMEN INF -->
  <path ${z('abdo_b','Abdomen inférieur')} d="M292,564 C284,578 282,596 284,612 C286,628 296,642 310,650 L384,654 L458,650 C472,642 482,628 484,612 C486,596 484,578 476,564 L384,566Z"/>

  <!-- BICEPS D -->
  <path ${z('biceps_d','Biceps droit')} d="M236,424 C224,436 214,454 214,474 C214,490 220,506 232,514 C242,506 250,490 254,472 C258,452 256,432 248,422 Q242,420 236,424Z"/>

  <!-- BICEPS G -->
  <path ${z('biceps_g','Biceps gauche')} d="M532,424 C544,436 554,454 554,474 C554,490 548,506 536,514 C526,506 518,490 514,472 C510,452 512,432 520,422 Q526,420 532,424Z"/>

  <!-- COUDE D -->
  <ellipse ${z('coude_d','Coude droit')} cx="222" cy="534" rx="22" ry="20"/>

  <!-- COUDE G -->
  <ellipse ${z('coude_g','Coude gauche')} cx="546" cy="534" rx="22" ry="20"/>

  <!-- AVANT-BRAS D -->
  <path ${z('avbras_d','Avant-bras droit')} d="M202,554 C192,568 184,588 184,608 C184,626 190,642 202,650 C214,642 222,626 224,606 C226,586 222,566 214,554 Z"/>

  <!-- AVANT-BRAS G -->
  <path ${z('avbras_g','Avant-bras gauche')} d="M566,554 C576,568 584,588 584,608 C584,626 578,642 566,650 C554,642 546,626 544,606 C542,586 546,566 554,554 Z"/>

  <!-- MAIN D -->
  <path ${z('main_d','Poignet / Main droite')} d="M190,654 C178,666 170,682 172,700 C174,716 184,730 198,736 C214,734 226,720 230,702 C234,684 228,668 214,658 Z"/>

  <!-- MAIN G -->
  <path ${z('main_g','Poignet / Main gauche')} d="M578,654 C590,666 598,682 596,700 C594,716 584,730 570,736 C554,734 542,720 538,702 C534,684 540,668 554,658 Z"/>

  <!-- HANCHE/AINE D -->
  <path ${z('hanche_d','Aine / Hanche droite')} d="M286,654 C272,664 262,680 262,696 C262,710 268,722 280,728 L342,732 L340,656 Z"/>

  <!-- HANCHE/AINE G -->
  <path ${z('hanche_g','Aine / Hanche gauche')} d="M482,654 C496,664 506,680 506,696 C506,710 500,722 488,728 L426,732 L428,656 Z"/>

  <!-- ADDUCTEUR D -->
  <path ${z('adducteur_d','Adducteurs droit')} d="M340,730 C326,740 318,756 318,774 C318,790 326,804 338,810 L382,812 L382,730 Z"/>

  <!-- ADDUCTEUR G -->
  <path ${z('adducteur_g','Adducteurs gauche')} d="M428,730 C442,740 450,756 450,774 C450,790 442,804 430,810 L386,812 L386,730 Z"/>

  <!-- QUAD D -->
  <path ${z('quad_d','Quadriceps droit')} d="M262,698 C250,710 242,730 242,752 C242,774 250,796 262,812 C276,820 294,822 310,816 L342,812 L340,730 L306,726 Q284,716 262,698Z"/>

  <!-- QUAD G -->
  <path ${z('quad_g','Quadriceps gauche')} d="M506,698 C518,710 526,730 526,752 C526,774 518,796 506,812 C492,820 474,822 458,816 L426,812 L428,730 L462,726 Q484,716 506,698Z"/>

  <!-- GENOU D -->
  <path ${z('genou_d','Genou droit')} d="M244,816 C234,828 228,844 230,860 C232,876 242,888 256,892 C272,894 288,888 298,876 C306,864 304,848 296,838 C288,828 274,820 260,818 Z"/>

  <!-- GENOU G -->
  <path ${z('genou_g','Genou gauche')} d="M524,816 C534,828 540,844 538,860 C536,876 526,888 512,892 C496,894 480,888 470,876 C462,864 464,848 472,838 C480,828 494,820 508,818 Z"/>

  <!-- TIBIA D -->
  <path ${z('tibia_d','Tibia droit')} d="M232,896 C220,912 214,932 214,952 C214,970 220,988 232,998 C246,994 258,978 262,958 C266,938 262,916 252,900 Z"/>

  <!-- TIBIA G -->
  <path ${z('tibia_g','Tibia gauche')} d="M536,896 C548,912 554,932 554,952 C554,970 548,988 536,998 C522,994 510,978 506,958 C502,938 506,916 516,900 Z"/>

  <!-- PIED D -->
  <path ${z('pied_d','Cheville / Pied droit')} d="M212,1000 C200,1010 196,1020 200,1024 L310,1024 L316,1006 L296,984 L272,1000 Z"/>

  <!-- PIED G -->
  <path ${z('pied_g','Cheville / Pied gauche')} d="M556,1000 C568,1010 572,1020 568,1024 L458,1024 L452,1006 L472,984 L496,1000 Z"/>
</svg>`;

  const back = `<svg id="bc-back" viewBox="0 0 768 1024" xmlns="http://www.w3.org/2000/svg"
    style="width:200px;height:267px;display:${dv==='b'?'block':'none'}">
  <image href="assets/img/datauri_5.png" x="0" y="0" width="768" height="1024"/>

  <!-- HEAD BACK -->
  <ellipse ${z('tete_b','Tête')} cx="384" cy="290" rx="40" ry="52"/>

  <!-- NUQUE -->
  <path ${z('nuque','Nuque')} d="M364,342 Q364,360 362,374 L384,382 L406,374 Q404,360 404,342 Q396,336 384,336 Q372,336 364,342Z"/>

  <!-- TRAPEZE G -->
  <path ${z('trap_g','Trapèze droit')} d="M316,388 C294,396 272,412 264,430 C260,442 264,456 274,464 C282,456 286,440 290,424 C294,410 300,398 308,392 Z"/>

  <!-- TRAPEZE D -->
  <path ${z('trap_d','Trapèze gauche')} d="M452,388 C474,396 496,412 504,430 C508,442 504,456 494,464 C486,456 482,440 478,424 C474,410 468,398 460,392 Z"/>

  <!-- SCAPULA/DORSAL G -->
  <path ${z('scapula_g','Scapula / Dorsal droit')} d="M266,462 C252,476 244,496 244,516 C244,538 252,558 268,568 C286,576 306,570 320,558 C332,544 336,524 330,504 C324,484 310,468 294,462 Z"/>

  <!-- SCAPULA/DORSAL D -->
  <path ${z('scapula_d','Scapula / Dorsal gauche')} d="M502,462 C516,476 524,496 524,516 C524,538 516,558 500,568 C482,576 462,570 448,558 C436,544 432,524 438,504 C444,484 458,468 474,462 Z"/>

  <!-- LOMBAIRES G -->
  <path ${z('lombaire_g','Lombaires droit')} d="M272,568 C258,582 250,600 250,618 C250,636 258,650 272,658 L340,664 L342,570 Z"/>

  <!-- LOMBAIRES D -->
  <path ${z('lombaire_d','Lombaires gauche')} d="M496,568 C510,582 518,600 518,618 C518,636 510,650 496,658 L428,664 L426,570 Z"/>

  <!-- TRICEPS G -->
  <path ${z('triceps_g','Triceps droit')} d="M240,420 C226,432 216,452 216,472 C216,490 222,506 234,514 C244,506 252,490 256,470 C260,450 258,428 248,418 Z"/>

  <!-- TRICEPS D -->
  <path ${z('triceps_d','Triceps gauche')} d="M528,420 C542,432 552,452 552,472 C552,490 546,506 534,514 C524,506 516,490 512,470 C508,450 510,428 520,418 Z"/>

  <!-- COUDE G ARR -->
  <ellipse ${z('coude_gb','Coude droit arrière')} cx="226" cy="530" rx="22" ry="20"/>

  <!-- COUDE D ARR -->
  <ellipse ${z('coude_db','Coude gauche arrière')} cx="542" cy="530" rx="22" ry="20"/>

  <!-- AVANT-BRAS G ARR -->
  <path ${z('avbras_gb','Avant-bras droit arrière')} d="M206,550 C194,564 186,584 186,604 C186,622 192,638 204,646 C216,638 224,622 226,602 C228,582 224,562 216,550 Z"/>

  <!-- AVANT-BRAS D ARR -->
  <path ${z('avbras_db','Avant-bras gauche arrière')} d="M562,550 C574,564 582,584 582,604 C582,622 576,638 564,646 C552,638 544,622 542,602 C540,582 544,562 552,550 Z"/>

  <!-- FESSIER G -->
  <path ${z('fess_g','Fessier droit')} d="M214,648 C198,660 186,678 186,698 C186,716 196,732 212,740 L340,748 L338,650 Z"/>

  <!-- FESSIER D -->
  <path ${z('fess_d','Fessier gauche')} d="M554,648 C570,660 582,678 582,698 C582,716 572,732 556,740 L428,748 L430,650 Z"/>

  <!-- ISCHIO G -->
  <path ${z('ischio_g','Ischio-jambier droit')} d="M188,750 C174,764 166,784 168,806 C170,826 180,844 196,852 C214,858 234,852 248,838 C260,824 262,804 256,784 C250,764 236,750 218,748 Z"/>

  <!-- ISCHIO D -->
  <path ${z('ischio_d','Ischio-jambier gauche')} d="M580,750 C594,764 602,784 600,806 C598,826 588,844 572,852 C554,858 534,852 520,838 C508,824 506,804 512,784 C518,764 532,750 550,748 Z"/>

  <!-- GENOU ARR G -->
  <path ${z('genou_gb','Genou droit arrière')} d="M170,856 C160,868 156,882 158,896 C160,910 170,922 184,926 C200,928 216,922 224,910 C230,898 228,884 220,874 C212,864 198,858 184,856 Z"/>

  <!-- GENOU ARR D -->
  <path ${z('genou_db','Genou gauche arrière')} d="M598,856 C608,868 612,882 610,896 C608,910 598,922 584,926 C568,928 552,922 544,910 C538,898 540,884 548,874 C556,864 570,858 584,856 Z"/>

  <!-- MOLLET G -->
  <path ${z('mollet_g','Mollet droit')} d="M160,930 C148,946 142,966 142,986 C142,1004 148,1018 162,1024 L238,1024 L244,998 L230,968 L208,942 Z"/>

  <!-- MOLLET D -->
  <path ${z('mollet_d','Mollet gauche')} d="M608,930 C620,946 626,966 626,986 C626,1004 620,1018 606,1024 L530,1024 L524,998 L538,968 L560,942 Z"/>

  <!-- TALON G -->
  <path ${z('talon_g','Cheville / Talon droit arrière')} d="M162,1024 C158,1024 156,1024 160,1024 L296,1024 L300,1006 L280,980 L256,1000 Z"/>

  <!-- TALON D -->
  <path ${z('talon_d','Cheville / Talon gauche arrière')} d="M606,1024 C610,1024 612,1024 608,1024 L472,1024 L468,1006 L488,980 L512,1000 Z"/>
</svg>`;

  return {front, back};
}

function renderInjurySection(p){
  const injs = p.injuries||[];
  const bc = p.bodyChart||{};
  const open = secSt.injury!==false;
  const svgs = buildBodySVG(p);
  const activePain = Object.entries(bc).filter(([,lvl])=>lvl>0);

  let h = `<div class="injury-section">
  <div class="injury-header" onclick="togSec('injury')">
    <span class="section-badge badge-injury">BLESSURES</span>
    <span class="section-title" style="font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:2px">Antécédents & Douleurs</span>
    <span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text-3);margin-left:auto">${injs.length} antécédent${injs.length!==1?'s':''}</span>
    <span class="section-chevron${open?' open':''}" style="margin-left:10px;color:var(--text-3);font-size:12px;transition:transform .25s">▼</span>
  </div>
  <div class="section-body${open?'':' collapsed'}" id="sec_injury">
  <div class="injury-body">

  <!-- BODY CHART -->
  <div class="bodychart-wrap">
    <div style="display:flex;align-items:center;justify-content:space-between;width:100%;max-width:300px;margin-bottom:10px">
      <div class="bodychart-toggle">
        <button class="bct-btn${bodyChartView==='f'?' active':''}" data-view="f" onclick="switchBodyView('f')">FACE</button>
        <button class="bct-btn${bodyChartView==='b'?' active':''}" data-view="b" onclick="switchBodyView('b')">DOS</button>
      </div>
      <div class="bodychart-legend">
        <div class="bcl-item"><div class="bcl-swatch" style="background:#f6c90e"></div>Gêne</div>
        <div class="bcl-item"><div class="bcl-swatch" style="background:#f59e0b"></div>Douleur</div>
        <div class="bcl-item"><div class="bcl-swatch" style="background:#ef4444"></div>Vive</div>
      </div>
    </div>
    <div class="bodychart-svg-wrap">
      ${svgs.front}
      ${svgs.back}
    </div>
    <p style="margin-top:8px;font-size:10px;color:var(--text-3);text-align:center">
      Cliquez pour marquer — re-cliquer pour changer l'intensité — 3× pour effacer
    </p>
    <div id="pain-summary-bar" style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin-top:8px">
      ${activePain.map(([zid,lvl])=>{const m=ZONES_META[zid];return m?`<span class="injury-zone-tag zt-${lvl}"><span style="font-size:9px">●</span> ${m.l}</span>`:''}).join('')}
    </div>
  </div>`;

  // Injury list
  if(injs.length>0){
    h += `<div class="injury-list">`;
    injs.forEach((inj,idx)=>{
      const d = inj.date ? new Date(inj.date).toLocaleDateString('fr-FR',{month:'long',year:'numeric'}) : '—';
      const zones = (inj.zones||[]).map(z=>{
        const zid = typeof z==='string' ? z : z.id;
        const lvl = typeof z==='object' ? z.lvl : 0;
        const m = ZONES_META[zid];
        const label = m ? m.l : zid;
        return lvl>0
          ? `<span class="injury-zone-tag zt-${lvl}">● ${label}</span>`
          : `<span class="injury-zone-tag" style="background:var(--navy-4);border-color:var(--border-2);color:var(--text-2)">${label}</span>`;
      }).join('');
      h += `<div class="injury-card">
        <div style="width:10px;height:10px;border-radius:50%;background:var(--red);flex-shrink:0;margin-top:4px"></div>
        <div style="flex:1">
          <div class="injury-date-tag">📅 ${d}</div>
          <div style="margin-bottom:4px">${zones||'<span style="color:var(--text-3);font-size:11px">Zone non précisée</span>'}</div>
          ${inj.desc?`<div class="injury-desc-txt">${inj.desc}</div>`:''}
          ${inj.duration?`<div class="injury-duration-txt">⏱ Indisponibilité : ${inj.duration}</div>`:''}
        </div>
        <button class="injury-del-btn" onclick="delInjury('${p.id}',${idx})">✕</button>
      </div>`;
    });
    h += `</div>`;
  }

  // Form or add button
  if(injFormOpen){
    const preZones = Object.entries(bc).filter(([,lvl])=>lvl>0);
    h += `<div class="injury-form">
      <div class="injury-form-title">📋 AJOUTER UN ANTÉCÉDENT</div>
      <div class="injury-form-row">
        <div>
          <div class="field-label">Date *</div>
          <input type="month" class="field-input" id="injDate" style="width:100%">
        </div>
        <div>
          <div class="field-label">Indisponibilité</div>
          <input type="text" class="field-input" id="injDuration" placeholder="3 semaines, 2 mois…" style="width:100%">
        </div>
        <div>
          <div class="field-label">Description *</div>
          <input type="text" class="field-input" id="injDesc" placeholder="ex: Entorse cheville G…" style="width:100%">
        </div>
      </div>
      <div style="margin-bottom:12px">
        <div class="field-label" style="margin-bottom:6px">Zones (depuis le body chart)</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
          ${preZones.length>0
            ? preZones.map(([zid,lvl])=>{const m=ZONES_META[zid];return m?`<span class="injury-zone-tag zt-${lvl}">● ${m.l}</span>`:''}).join('')
            : '<span style="font-size:11px;color:var(--text-3)">Sélectionnez des zones sur le corps ci-dessus</span>'
          }
        </div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-cyan" onclick="saveInjury('${p.id}')">✓ Enregistrer</button>
        <button class="btn btn-outline" onclick="cancelInjury()">Annuler</button>
      </div>
    </div>`;
  } else {
    h += `<button class="add-injury-btn" onclick="openInjuryForm()">＋ Enregistrer un antécédent / blessure</button>`;
  }

  h += `</div></div></div>`;
  return h;
}
