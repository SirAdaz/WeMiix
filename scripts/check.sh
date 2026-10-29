#!/usr/bin/env bash
# Checks locaux avant PR : lint + typecheck du frontend, tests du backend.
# Usage : ./scripts/check.sh [front|back]   (sans argument : les deux)
# Prerequis : node/npm pour le front, Docker pour le back (image Maven, pas de Java a installer).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
target="${1:-all}"

check_front() {
  echo "== frontend : lint + tsc"
  cd "$ROOT/frontend"
  [ -d node_modules ] || npm ci --no-audit --no-fund
  npm run lint
  npx tsc --noEmit
}

check_back() {
  echo "== backend : mvn test (profil test, H2)"
  mkdir -p "$HOME/.m2-wemiix"
  docker run --rm -u "$(id -u):$(id -g)" -e HOME=/tmp -e MAVEN_OPTS=-Xmx1g \
    -v "$ROOT/backend:/app" -w /app -v "$HOME/.m2-wemiix:/tmp/m2" \
    maven:3.9-eclipse-temurin-21-alpine mvn -B -q -Dmaven.repo.local=/tmp/m2 test
}

case "$target" in
  front) check_front ;;
  back) check_back ;;
  all) check_front; check_back ;;
  *) echo "usage: $0 [front|back]"; exit 2 ;;
esac
echo "OK"
