# 🎵 WeMiix

> Application web musicale festive — karaoké, blind test, playlists collaboratives et mini-jeux en temps réel.

---

## Description

WeMiix est une application sociale et musicale permettant à des groupes d'amis de :
- **Chanter en karaoké** avec les paroles synchronisées en temps réel (LRCLIB + lyrics.ovh)
- **Jouer au blind test** — devinez la chanson avant les autres, points à la rapidité
- **Créer des playlists collaboratives** alimentées et votées par tous les participants
- **Participer à des mini-jeux musicaux** — Name That Tune, Quiz musical, et plus
- **Se connecter via Spotify** pour accéder à des millions de titres

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT (PWA)                             │
│     Next.js 16 — TypeScript — Tailwind CSS — Mobile First        │
│                         Port 3000                                │
└──────────────────────┬───────────────────────────────────────────┘
                       │  REST API + WebSocket (STOMP)
              ┌────────▼────────┐
              │   Nginx (80)    │  ← Reverse proxy + rate limiting
              └────────┬────────┘
                       │
┌──────────────────────▼───────────────────────────────────────────┐
│                       BACKEND (API)                              │
│              Spring Boot 3.4.1 — Java 21 — Maven                 │
│                         Port 8080                                │
└────┬──────────────┬──────────────────────┬───────────────────────┘
     │              │                      │
┌────▼────┐   ┌─────▼──────┐   ┌──────────▼───────┐
│Postgres │   │   Redis    │   │    MongoDB        │
│  :5432  │   │   :6379    │   │    :27017         │
│ users,  │   │ sessions   │   │ karaoké, blind    │
│ groupes,│   │ cache      │   │ test, mini-jeux   │
│playlists│   └────────────┘   └───────────────────┘
└─────────┘
     ↑
APIs externes :
  - Spotify Web API (recherche musicale)
  - LRCLIB + lyrics.ovh (paroles karaoké)
```

---

## Démarrage rapide

### Prérequis
- [Docker](https://docs.docker.com/get-docker/) ≥ 24.x
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2.x

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/SirAdaz/WeMiix.git
cd WeMiix

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env : renseigner SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, AUTH_SECRET

# 3. Lancer tous les services (dev)
docker compose up --build

# Ou en arrière-plan :
docker compose up --build -d
```

L'application est accessible sur :
- **Frontend** : http://localhost:3000
- **Via Nginx** : http://localhost
- **API Backend** : http://localhost:8080
- **Health check** : http://localhost:8080/api/health

### Lancement en production

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Structure du projet

```
WeMiix/
├── frontend/                   # Application Next.js 16
│   ├── src/
│   │   ├── app/                # App Router (pages, layouts)
│   │   │   ├── (auth)/         # Pages auth (connexion, callback)
│   │   │   ├── (app)/          # Pages protégées (home, groupes, karaoké…)
│   │   │   └── page.tsx        # Landing page
│   │   ├── components/         # Composants réutilisables (UI, layout)
│   │   ├── contexts/           # AuthContext (état global auth)
│   │   └── lib/                # auth.ts, api.ts (clients fetch)
│   ├── public/                 # Assets statiques + manifest.json (PWA)
│   ├── Dockerfile              # Multi-stage : dev (hot-reload) + prod
│   └── package.json
│
├── backend/                    # API Spring Boot (Java 21)
│   ├── src/main/java/com/wemiix/app/
│   │   ├── config/             # Security, JWT, WebSocket
│   │   ├── controller/         # Auth, Groups, Karaoke, BlindTest, Playlists
│   │   ├── model/              # Entités JPA (User, Group…) + docs MongoDB
│   │   ├── repository/         # JPA + MongoDB repositories
│   │   ├── service/            # Auth, JWT, Spotify, Lyrics, Game services
│   │   └── websocket/          # Handlers STOMP temps réel
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── pom.xml
│   └── Dockerfile              # Multi-stage : builder Maven + runtime JRE
│
├── nginx/
│   └── nginx.conf              # Reverse proxy + rate limiting + WebSocket
├── scripts/
│   ├── backup.sh               # Sauvegarde PostgreSQL + MongoDB (rétention 7j)
│   └── health-check.sh         # Vérification état des 6 services
├── docker-compose.yml          # Orchestration dev (7 services)
├── docker-compose.prod.yml     # Override production
├── .env.example                # Template variables d'environnement
├── TODO.md                     # Suivi des fonctionnalités
└── README.md
```

---

## Fonctionnalités implémentées

- [x] **Authentification** — JWT (HmacSHA256), Spotify OAuth2, mode invité
- [x] **Groupes** — création avec QR code, invitation par lien/code, rôles hôte/membre
- [x] **Karaoké** — paroles LRCLIB (+ fallback lyrics.ovh), sync temps réel WebSocket, votes, scores
- [x] **Blind Test** — mode aléatoire/genre/année, scoring par rapidité, WebSocket
- [x] **Playlists collaboratives** — votes +1/-1, limite anti-abus, tri par score, suppression auto
- [x] **Mini-jeux** — socle commun (lobby, timer, scoring), Name That Tune, Quiz musical
- [x] **Spotify** — recherche de titres via API, lecteur UI
- [x] **PWA** — manifest.json, mobile-first
- [x] **Modes** — Mode Enfant / Adulte
- [x] **Nginx** — reverse proxy, rate limiting, headers sécurité
- [x] **Infra** — scripts backup + health-check, docker-compose prod

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| Backend | Spring Boot 3.4.1, Java 21, Maven |
| BDD principale | PostgreSQL 16 |
| BDD sessions/jeux | MongoDB 7 |
| Cache | Redis 7 |
| Auth | JWT maison (HmacSHA256) + OAuth2 Spotify |
| Temps réel | Spring WebSocket (STOMP) |
| Proxy | Nginx (reverse proxy + rate limiting) |
| API musique | Spotify Web API |
| API paroles | LRCLIB + lyrics.ovh |
| Conteneurs | Docker + Docker Compose |

---

## Variables d'environnement

| Variable | Description | Défaut dev |
|---|---|---|
| `SPOTIFY_CLIENT_ID` | Client ID Spotify Developer | — |
| `SPOTIFY_CLIENT_SECRET` | Client Secret Spotify Developer | — |
| `AUTH_SECRET` | Secret JWT (≥ 32 chars) | `changeme_at_least_32_chars_long_secret` |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | `changeme` |
| `REDIS_PASSWORD` | Mot de passe Redis | `changeme` |
| `MONGO_INITDB_ROOT_PASSWORD` | Mot de passe MongoDB | `changeme` |

> Pour obtenir les clés Spotify : [developer.spotify.com](https://developer.spotify.com/dashboard) — créer une app, ajouter `http://localhost:8080/api/auth/spotify/callback` comme Redirect URI.

---

## Commandes utiles

```bash
# Logs en direct
docker compose logs -f backend
docker compose logs -f frontend

# Redémarrer un service
docker compose restart backend

# Vérifier l'état des services
./scripts/health-check.sh

# Sauvegarder les bases de données
./scripts/backup.sh

# Arrêter tout
docker compose down

# Reset complet (supprime les données)
docker compose down -v
```

---

*WeMiix — Faites de chaque soirée une expérience musicale inoubliable* 🎤🎉
