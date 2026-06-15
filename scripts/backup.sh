#!/bin/bash
# =====================================================
# WeMiix — Script de sauvegarde
# Usage : ./scripts/backup.sh
# Sauvegarde : PostgreSQL + MongoDB → .tar.gz
# Rétention  : 7 jours
# =====================================================

set -euo pipefail

# -----------------------------------------------
# Configuration
# -----------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_ROOT="$PROJECT_ROOT/backups"
TIMESTAMP="$(date +%Y-%m-%d_%H-%M)"
BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"
RETENTION_DAYS=7

# Lecture des variables d'env si le fichier .env existe
if [[ -f "$PROJECT_ROOT/.env" ]]; then
    # shellcheck disable=SC1091
    source "$PROJECT_ROOT/.env"
fi

POSTGRES_USER="${POSTGRES_USER:-wemiix_user}"
POSTGRES_DB="${POSTGRES_DB:-wemiix_db}"
MONGO_USER="${MONGO_INITDB_ROOT_USERNAME:-wemiix_user}"
MONGO_PASSWORD="${MONGO_INITDB_ROOT_PASSWORD:-changeme}"

# -----------------------------------------------
# Helpers
# -----------------------------------------------
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

die() {
    log "ERREUR : $*" >&2
    exit 1
}

# -----------------------------------------------
# Création du dossier de sauvegarde
# -----------------------------------------------
log "Démarrage de la sauvegarde — $TIMESTAMP"
mkdir -p "$BACKUP_DIR"
log "Dossier créé : $BACKUP_DIR"

# -----------------------------------------------
# Sauvegarde PostgreSQL
# -----------------------------------------------
log "Sauvegarde PostgreSQL..."
docker exec wemiix-postgres \
    pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
    > "$BACKUP_DIR/postgres.sql" \
    || die "Échec pg_dump PostgreSQL"
log "PostgreSQL OK → $BACKUP_DIR/postgres.sql ($(du -sh "$BACKUP_DIR/postgres.sql" | cut -f1))"

# -----------------------------------------------
# Sauvegarde MongoDB
# -----------------------------------------------
log "Sauvegarde MongoDB..."
mkdir -p "$BACKUP_DIR/mongodb"
docker exec wemiix-mongodb \
    mongodump \
        --username "$MONGO_USER" \
        --password "$MONGO_PASSWORD" \
        --authenticationDatabase admin \
        --out /tmp/mongodump_"$TIMESTAMP" \
    || die "Échec mongodump MongoDB"

# Copier le dump depuis le container vers l'hôte
docker cp wemiix-mongodb:/tmp/mongodump_"$TIMESTAMP"/. "$BACKUP_DIR/mongodb/" \
    || die "Échec copie mongodump vers l'hôte"

# Nettoyer le dump temporaire dans le container
docker exec wemiix-mongodb rm -rf /tmp/mongodump_"$TIMESTAMP" 2>/dev/null || true
log "MongoDB OK → $BACKUP_DIR/mongodb/"

# -----------------------------------------------
# Compression de l'archive
# -----------------------------------------------
ARCHIVE="$BACKUP_ROOT/wemiix_backup_${TIMESTAMP}.tar.gz"
log "Compression de l'archive..."
tar -czf "$ARCHIVE" -C "$BACKUP_ROOT" "$TIMESTAMP" \
    || die "Échec de la compression"
log "Archive créée : $ARCHIVE ($(du -sh "$ARCHIVE" | cut -f1))"

# Supprimer le dossier non compressé
rm -rf "$BACKUP_DIR"
log "Dossier temporaire supprimé"

# -----------------------------------------------
# Suppression des backups de plus de 7 jours
# -----------------------------------------------
log "Nettoyage des backups de plus de $RETENTION_DAYS jours..."
find "$BACKUP_ROOT" -maxdepth 1 -name "wemiix_backup_*.tar.gz" \
    -mtime +"$RETENTION_DAYS" -print -delete \
    | while read -r f; do log "Supprimé : $f"; done
log "Nettoyage terminé"

# -----------------------------------------------
# Résumé final
# -----------------------------------------------
log "Sauvegarde terminée avec succès !"
log "Archive : $ARCHIVE"
