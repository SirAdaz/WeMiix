# WeMiix — TODO

> Basé sur le cahier des charges. Mettre à jour au fur et à mesure de l'avancement.

---

## 🔐 Authentification

- [x] JWT maison (HmacSHA256 pur Java 21) — `JwtService`, `JwtAuthFilter`, `RefreshToken`
- [x] Connexion Spotify OAuth flow complet — `GET /api/auth/spotify/authorize` + callback + redirect frontend
- [x] Mode invité (accès aux jeux sans compte) — lien "continuer en mode invité" sur `/connexion`
- [x] Context React auth — `AuthContext`, `fetchWithAuth` avec auto-refresh 401, `ProtectedRoute`
- [x] Page connexion — bouton Spotify, formulaire email/pseudo, mode invité
- [x] Page profil — avatar, badge FREE/PREMIUM, statut Spotify, déconnexion
- [ ] Connexion Deezer / Apple Music / Amazon Music *(évolution)*

---

## 👥 Groupes

- [x] Création de groupe avec lien d'invitation unique + QR code — `src/app/groupe/page.tsx` + `src/components/QRCodeDisplay.tsx`
- [x] Rejoindre un groupe via lien ou QR code (anonyme ou connecté) — formulaire code + lien direct `/groupe/[id]`
- [x] Gestion des rôles dans le groupe (créateur / participant) — rôles `host` / `guest` dans `src/app/groupe/[id]/page.tsx`

---

## 🧒 Modes Enfant / Adulte

- [x] Mode Enfant — filtrage contenu explicite, restrictions UI, interactions limitées — `src/lib/mode.ts` + `filterExplicit()`
- [x] Mode Adulte — accès complet, aucune restriction
- [x] Sécurité — isolation stricte entre les deux modes (PIN parental) — `src/app/parametres/page.tsx`

---

## 🎤 Karaoké

- [x] Intégration API LRCLIB pour la récupération des paroles — `src/lib/lyrics.ts`
- [x] Fallback lyrics.ovh si LRCLIB ne retourne rien — `fetchFromLyricsOvh()` dans `lyrics.ts`
- [x] Synchronisation des paroles en temps réel avec la musique — `getActiveLine()` + timer simulé
- [x] Système de vote pour élire le meilleur chanteur — `src/app/groupe/[id]/karaoke/page.tsx`
- [x] Attribution de points et classement interne au groupe
- [ ] Algorithme / IA de recommandation de playlists (genre, votes, écoutes récentes) *(nécessite backend + ML)*

---

## 🎵 Blind Test

- [x] Mode aléatoire (tous genres confondus) — filtre `all` dans `src/app/groupe/[id]/blind-test/page.tsx`
- [x] Filtres par genre (rap, pop, rock…) et par année de sortie
- [ ] Blind test personnalisé (créé par un membre depuis ses playlists) *(nécessite Spotify API connectée)*
- [x] Saisie texte pour deviner titre / artiste — points attribués à la rapidité
- [ ] Variante IRL (attribution manuelle des points, mode sans points) *(évolution)*

---

## 🎶 Playlists collaboratives

- [x] Ajout de titres pendant la session via recherche intégrée — `src/app/groupe/[id]/playlist/page.tsx`
- [x] Système de vote positif / négatif + classement automatique par score
- [x] Règles : limite d'ajouts par personne, pas de doublons — `MAX_ADDS_PER_PERSON` + vérif. doublons
- [x] Créateur peut retirer un titre + suppression auto si trop de votes négatifs — `AUTO_REMOVE_THRESHOLD`
- [x] Affichage : score visible, nombre de votes, auteur (option anonymisation)

---

## 🕹️ Mini-jeux

- [x] Socle commun : lobby, countdown synchronisé, timer, scoring, résultats — `src/app/groupe/[id]/mini-jeux/page.tsx`
- [x] Jeu — Name That Tune — composant `NameThatTune`
- [x] Jeu — Quiz musical — composant `MusicQuiz`
- [ ] Jeu — Chorégraphie (style Just Dance avec musiques perso) *(évolution)*
- [x] Niveaux de difficulté (facile / normal / difficile) + thèmes (80s, rap, pop, rock…)
- [ ] Bonus de rattrapage pour les joueurs en retard au classement *(évolution)*
- [ ] Récapitulatif de fin de manche (scores, stats amusantes, progression) *(partiellement fait)*

---

## 🎧 Spotify & Musique

- [x] Recherche de titres via Spotify Web API
- [x] Lecteur musical UI (barre progression, ⏮▶⏸⏭, image album) — `SpotifyPlayer.tsx`
- [ ] Lecture des morceaux réelle (Spotify Web Playback SDK — nécessite compte Premium Spotify)
- [ ] Ordre de lecture ajusté automatiquement selon les votes du groupe

---

## 🖥️ UI / UX

- [x] Landing page (charte graphique WeMiix : navy + #ff2969 + #27e965, League Spartan)
- [x] PWA — manifest.json, service worker, icônes, installation écran d'accueil — `public/manifest.json` + `public/sw.js`
- [x] Navigation principale (menu mobile bottom bar) — `src/components/BottomNav.tsx`
- [x] Accessibilité — taille de police ajustable, mode daltonien (WCAG) — `src/app/parametres/page.tsx`
- [ ] Compatibilité — Chrome, Safari, Firefox, Edge + responsive tablette/desktop *(tests à faire)*

---

## 💰 Modèle économique

- [ ] Version gratuite — publicités discrètes entre les manches *(intégration pub à faire)*
- [x] Premium 5 €/mois — sans pub, IA avancée, personnalisation poussée — section dans `/parametres`

---

## 📊 Statistiques

- [x] Stats individuelles (taux de réussite, précision blind test, artiste favori…) — `src/app/stats/page.tsx`
- [x] Stats de groupe (classement historique, genre d'excellence, records)

---

## 🔒 Sécurité & RGPD

- [x] RGPD — suppression compte/historique, email support droits — liens dans `/profil`
- [x] Rate limiting Nginx — `limit_req_zone` 10 req/s sur `/api/`
- [ ] Firewall applicatif / protection DDoS *(infrastructure cloud)*

---

## 🏗️ Infrastructure

- [x] Nginx reverse proxy — `/`, `/api/`, `/ws/` + headers sécurité + gzip — `nginx/nginx.conf`
- [x] Docker Compose production — `docker-compose.prod.yml` (builds prod, limites RAM, ports via Nginx uniquement)
- [x] Sauvegarde automatisée PostgreSQL + MongoDB — `scripts/backup.sh` (rétention 7 jours)
- [x] Script health-check — `scripts/health-check.sh` (6 services ✅/❌)
- [ ] Hébergement cloud (OVHcloud ou AWS) — déploiement en production
- [ ] Centralisation des logs + alertes sur comportements anormaux *(Loki/Grafana ou équivalent)*
