# 🎵 WeMiix

> Application web musicale festive — karaoké, blind test, playlists collaboratives et mini-jeux en temps réel.

---

## Description

WeMiix est une application sociale et musicale permettant à des groupes d'amis de :
- **Chanter en karaoké** avec les paroles synchronisées en temps réel
- **Jouer au blind test** devinez la chanson avant les autres
- **Créer des playlists collaboratives** que tout le monde peut alimenter
- **Participer à des mini-jeux musicaux** en temps réel

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT (PWA)                           │
│              Next.js 16 — Mobile First — Design Néon            │
│                          Port 3000                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │  REST API + WebSocket (STOMP)
┌─────────────────────▼───────────────────────────────────────────┐
│                      BACKEND (API)                              │
│            Spring Boot 3.4 — Java 21 — Maven                   │
│                          Port 8080                              │
└────┬──────────────┬─────────────────────┬───────────────────────┘
     │              │                     │
┌────▼────┐   ┌─────▼──────┐   ┌─────────▼────────┐
│Postgres │   │   Redis    │   │    MongoDB        │
│   :5432 │   │   :6379    │   │    :27017         │
│ (données│   │(cache/     │   │  (mini-jeux /     │
│  users, │   │ sessions)  │   │   sessions)       │
│playlists│   └────────────┘   └───────────────────┘
│  etc.)  │
└─────────┘
     ↑
APIs externes :
  - Spotify Web API (musique)
  - LRCLIB + lyrics.ovh (paroles)
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

# 2. Copier et configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs (Spotify API keys, secrets...)

# 3. Lancer tous les services
docker compose up --build

# Ou en arrière-plan :
docker compose up --build -d
```

L'application est accessible sur :
- **Frontend** : http://localhost:3000
- **API Backend** : http://localhost:8080
- **Health check** : http://localhost:8080/api/health

---

## Structure du projet

```
WeMiix/
├── frontend/                   # Application Next.js 16
│   ├── src/
│   │   ├── app/                # App Router (pages, layouts)
│   │   ├── components/         # Composants réutilisables
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utils, clients API
│   │   └── styles/             # CSS global
│   ├── public/                 # Assets statiques
│   ├── Dockerfile              # Multi-stage : dev + prod
│   └── package.json
│
├── backend/                    # API Spring Boot (Java 21)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/wemiix/app/
│   │       │   ├── config/     # WebSocket, Security, Redis
│   │       │   ├── controller/ # REST controllers
│   │       │   ├── model/      # Entités JPA / MongoDB
│   │       │   ├── repository/ # Repositories JPA / Mongo
│   │       │   ├── service/    # Logique métier
│   │       │   └── websocket/  # Handlers STOMP temps réel
│   │       └── resources/
│   │           └── application.yml
│   ├── pom.xml
│   └── Dockerfile              # Multi-stage : builder + runtime
│
├── docker-compose.yml          # Orchestration de tous les services
├── .env.example                # Template variables d'environnement
└── README.md
```

---

## Fonctionnalités MVP

- [ ] **Authentification** — Better Auth + OAuth Spotify
- [ ] **Karaoké** — affichage des paroles synchronisées (LRCLIB)
- [ ] **Blind Test** — partie en temps réel via WebSocket
- [ ] **Playlists collaboratives** — plusieurs utilisateurs, une liste
- [ ] **Intégration Spotify** — recherche et lecture de musique
- [ ] **Mini-jeux** — quiz musical, Name That Tune

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | Spring Boot 3.4, Java 21, Maven |
| BDD principale | PostgreSQL 16 |
| BDD secondaire | MongoDB 7 |
| Cache / Sessions | Redis 7 |
| Auth | Better Auth + OAuth Spotify |
| Temps réel | Spring WebSocket (STOMP) |
| API musique | Spotify Web API |
| API paroles | LRCLIB + lyrics.ovh |

---

## Commandes utiles

```bash
# Voir les logs d'un service
docker compose logs -f backend
docker compose logs -f frontend

# Redémarrer un service
docker compose restart backend

# Arrêter tout
docker compose down

# Arrêter et supprimer les volumes (reset BDD)
docker compose down -v

# Vérifier l'état des services
docker compose ps
```

---

*WeMiix — Faites de chaque soirée une expérience musicale inoubliable* 🎤🎉
