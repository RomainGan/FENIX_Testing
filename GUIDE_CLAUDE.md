# Guide simple pour continuer le projet avec Claude

## Quel fichier envoyer selon ton besoin

- **Modifier l'affichage du formulaire** : `assets/js/ui/form-render.js`
- **Corriger un clic, un champ, une mise à jour** : `assets/js/ui/form-actions.js`
- **Corriger la carte du corps / blessures** : `assets/js/ui/bodychart.js`
- **Corriger un calcul / une analyse** : `assets/js/views/analysis.js`
- **Corriger le rapport PDF / export / rendu final** : `assets/js/views/report.js`
- **Comparer deux joueurs / sessions** : `assets/js/views/comparison.js`
- **Problème de structure de page** : `index.html`

## Phrase à copier dans Claude

Je ne suis pas développeur.
Voici le problème : [décris le bug ou la modification]
Voici le fichier concerné : [nom du fichier]
Travaille seulement sur ce fichier et dis-moi s'il te faut un deuxième fichier précis.

## Ce qui a été simplifié ici

- les images base64 ont été sorties du code
- `form.js` a été séparé en deux fichiers plus lisibles
- `index.html` charge maintenant les nouveaux fichiers

## Ordre de chargement

Le HTML charge maintenant :
1. `bodychart.js`
2. `form-render.js`
3. `form-actions.js`
4. `players.js`

Cet ordre est important.
