#!/bin/bash
# =====================================================
# WeMiix — Health check de tous les services
# Usage : ./scripts/health-check.sh
# =====================================================

set -uo pipefail

# -----------------------------------------------
# Lecture des variables d'env si disponibles
# -----------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [[ -f "$PROJECT_ROOT/.env" ]]; then
    # shellcheck disable=SC1091
    source "$PROJECT_ROOT/.env"
fi

POSTGRES_USER="${POSTGRES_USER:-wemiix_user}"
REDIS_PASSWORD="${REDIS_PASSWORD:-changeme}"

# -----------------------------------------------
# Helpers
# -----------------------------------------------
PASS="✅"
FAIL="❌"
ERRORS=0

check() {
    local label="$1"
    shift
    if "$@" &>/dev/null; then
        echo "$PASS  $label"
    else
        echo "$FAIL  $label"
        ERRORS=$((ERRORS + 1))
    fi
}

echo ""
echo "======================================"
echo "  WeMiix — Health Check"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================"
echo ""

# -----------------------------------------------
# 1. API backend via Nginx (port 80)
# -----------------------------------------------
check "API backend  (http://localhost/api/health)" \
    curl -fs --max-time 5 http://localhost/api/health

# -----------------------------------------------
# 2. Frontend Next.js (accès direct port 3000)
# -----------------------------------------------
check "Frontend     (http://localhost:3000)" \
    curl -fs --max-time 5 http://localhost:3000

# -----------------------------------------------
# 3. PostgreSQL
# -----------------------------------------------
check "PostgreSQL   (pg_isready)" \
    docker exec wemiix-postgres \
        pg_isready -U "$POSTGRES_USER"

# -----------------------------------------------
# 4. Redis
# -----------------------------------------------
check "Redis        (PING)" \
    docker exec wemiix-redis \
        redis-cli -a "$REDIS_PASSWORD" ping

# -----------------------------------------------
# 5. MongoDB
# -----------------------------------------------
check "MongoDB      (ping)" \
    docker exec wemiix-mongodb \
        mongosh --quiet --eval "db.adminCommand('ping')"

# -----------------------------------------------
# 6. Nginx (container running)
# -----------------------------------------------
check "Nginx        (container status)" \
    docker inspect --format='{{.State.Running}}' wemiix-nginx | grep -q true

# -----------------------------------------------
# Résumé
# -----------------------------------------------
echo ""
echo "======================================"
if [[ "$ERRORS" -eq 0 ]]; then
    echo "  $PASS  Tous les services sont opérationnels"
else
    echo "  $FAIL  $ERRORS service(s) en erreur"
fi
echo "======================================"
echo ""

exit "$ERRORS"
