# Fenix Toulouse — Testing Physique

Application web de suivi des tests physiques pour le staff du Fenix Toulouse Handball.

## Lancer l'application

Ouvrir `index.html` dans un navigateur (hébergé sur GitHub Pages).

---

## Architecture

```
fenix_testing/
├── index.html                    ← point d'entrée unique
├── _archive/                     ← fichiers originaux (non chargés)
└── assets/
    ├── css/
    │   ├── base.css              ← variables CSS, layout, sidebar, topbar
    │   ├── components.css        ← cartes, tableaux, boutons, sections
    │   ├── reports.css           ← rapport athlète, export, comparaison
    │   └── forms-bodychart.css   ← fiche joueur, blessures, body chart
    └── js/
        ├── core/                 ← fondations (chargées en premier)
        │   ├── data-tests.js     ← définition des tests et zones anatomiques
        │   ├── state.js          ← état global, joueurs, sessions, migrations
        │   └── utils.js          ← calcul scores, rendu liste, helpers
        ├── ui/                   ← composants d'interface
        │   ├── bodychart.js      ← body chart interactif, formulaire blessures
        │   ├── form.js           ← rendu principal et interactions formulaire
        │   └── players.js        ← CRUD joueurs, upload photo, modal création
        ├── views/                ← vues complètes
        │   ├── analysis.js       ← prévention, analyse IA, profil morphologique
        │   ├── report.js         ← rapport athlète, mise en page A4
        │   └── comparison.js     ← comparaison 1v1, vue équipe, récapitulatif
        └── app/                  ← initialisation et export
            ├── export.js         ← export PDF (html2canvas + jsPDF), export email
            └── init.js           ← persistance localStorage, reset, démarrage
```

### Ordre de chargement des scripts (index.html)

```
core/data-tests → core/state → core/utils
↓
ui/bodychart → ui/form → ui/players
↓
views/analysis → views/report → views/comparison
↓
app/export → app/init   ← derniers : peuvent appeler tout ce qui précède
```

> **Important** : les fichiers JS utilisent des variables globales. L'ordre des `<script>` dans `index.html` est fonctionnel — ne pas le modifier sans vérifier les dépendances.

---

## Guide de modification

### Ajouter un nouveau test physique
→ `core/data-tests.js` : ajouter dans le tableau `TESTS` de la bonne section

### Modifier le calcul des scores
→ `core/utils.js` : fonctions `calcScore`, `calcScoreFromData`

### Modifier l'affichage de la fiche joueur
→ `ui/form.js` : fonction `renderForm`

### Modifier le body chart ou le formulaire blessures
→ `ui/bodychart.js`

### Modifier la création / suppression de joueurs
→ `ui/players.js`

### Modifier l'analyse IA ou la prévention des blessures
→ `views/analysis.js`

### Modifier le rapport PDF (mise en page)
→ `views/report.js`

### Modifier la comparaison 1v1 ou la vue équipe
→ `views/comparison.js`

### Modifier l'export PDF (paramètres html2canvas / jsPDF)
→ `app/export.js` : fonction `exportPDF`

### Modifier la sauvegarde ou la migration des données
→ `app/init.js` (persistance) + `core/state.js` (migration v1/v2/v3)

---

## Dépendances CDN

Chargées depuis `index.html` :

| Librairie | Version | Usage |
|-----------|---------|-------|
| html2canvas | 1.4.1 | Capture DOM → PDF |
| jsPDF | 2.5.1 | Génération PDF |
| Chart.js | 4.4.1 | Graphique d'évolution |
| Google Fonts | — | Bebas Neue, Barlow, DM Mono |

---

## Données

- Stockage : `localStorage` clé `ftph_v3`
- Migration automatique depuis `ftph_v2` et `ftph_v1` au démarrage
- Sauvegarde manuelle : bouton **💾 Sauvegarder** → fichier `.json`
- Récupération : bouton **🔄 Récupérer données** (fusionne v1/v2 dans v3)


## Claude optimization
This copy was automatically optimized to reduce AI context size:
- extracted inline base64 images from HTML/JS into `assets/img/`
- updated references in `index.html`, `assets/js/ui/form.js`, and `assets/js/ui/bodychart.js`

Extracted files:
- `datauri_1.png` from `index.html` (31616 base64 chars)
- `datauri_2.png` from `assets/js/ui/form.js` (262536 base64 chars)
- `datauri_3.png` from `assets/js/ui/form.js` (254868 base64 chars)
- `datauri_4.png` from `assets/js/ui/bodychart.js` (218184 base64 chars)
- `datauri_5.png` from `assets/js/ui/bodychart.js` (222060 base64 chars)
