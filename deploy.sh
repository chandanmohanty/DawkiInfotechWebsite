#!/usr/bin/env bash
#
# deploy.sh — Production deployment for Dawki Infotech
# ====================================================
#
# Pulls the latest code, installs/updates dependencies, runs migrations,
# rebuilds caches, and brings the site live again — in one command.
#
# Tested on Hostinger Cloud Startup (CloudLinux + alt-nodejs). Should run
# unchanged on any LAMP-style host that has Bash, Git, PHP 8.2+, Composer
# and a Node toolchain available somewhere on $PATH.
#
# Usage
# -----
#   bash deploy.sh                # full deploy (default)
#   bash deploy.sh --skip-npm     # skip npm ci / build (CSS-only changes)
#   bash deploy.sh --skip-migrate # skip db migrations (config-only changes)
#   bash deploy.sh --no-cache     # leave production caches off (debug)
#   bash deploy.sh --dry-run      # print every step but don't execute
#
# Wire it into Hostinger Auto-Deployment by putting "bash deploy.sh" in the
# Git → Auto Deployment command field.

set -euo pipefail

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------
APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$APP_ROOT/storage/logs"
LOG_FILE="$LOG_DIR/deploy.log"
NODE_PATH_HOSTINGER="/opt/alt/alt-nodejs22/root/usr/bin"   # CloudLinux alt-nodejs
PHP_BIN="${PHP_BIN:-php}"                                  # override with PHP_BIN=/path/to/php deploy.sh

# -----------------------------------------------------------------------------
# Flag parsing
# -----------------------------------------------------------------------------
SKIP_NPM=0
SKIP_MIGRATE=0
NO_CACHE=0
DRY_RUN=0
for arg in "$@"; do
    case "$arg" in
        --skip-npm)     SKIP_NPM=1 ;;
        --skip-migrate) SKIP_MIGRATE=1 ;;
        --no-cache)     NO_CACHE=1 ;;
        --dry-run)      DRY_RUN=1 ;;
        -h|--help)
            grep '^#' "$0" | sed -E 's/^# ?//' | head -40
            exit 0
            ;;
        *)
            echo "Unknown flag: $arg" >&2
            echo "Run: bash deploy.sh --help" >&2
            exit 2
            ;;
    esac
done

# -----------------------------------------------------------------------------
# Pretty output — degrades to plain text when stdout isn't a TTY (CI / logs).
# -----------------------------------------------------------------------------
if [ -t 1 ]; then
    BOLD=$(printf '\033[1m'); DIM=$(printf '\033[2m')
    RED=$(printf '\033[31m');  GREEN=$(printf '\033[32m')
    YELLOW=$(printf '\033[33m'); BLUE=$(printf '\033[34m')
    RESET=$(printf '\033[0m')
else
    BOLD=""; DIM=""; RED=""; GREEN=""; YELLOW=""; BLUE=""; RESET=""
fi

step()   { printf "\n${BOLD}${BLUE}▸ %s${RESET}\n" "$1"; }
ok()     { printf "  ${GREEN}✓${RESET} %s\n" "$1"; }
warn()   { printf "  ${YELLOW}⚠${RESET} %s\n" "$1"; }
fail()   { printf "  ${RED}✗ %s${RESET}\n" "$1" >&2; }
say()    { printf "  ${DIM}%s${RESET}\n" "$1"; }

# -----------------------------------------------------------------------------
# Run wrapper — honours --dry-run, tees output to the log.
# -----------------------------------------------------------------------------
mkdir -p "$LOG_DIR"
run() {
    say "\$ $*"
    if [ "$DRY_RUN" -eq 1 ]; then return 0; fi
    if ! "$@" 2>&1 | tee -a "$LOG_FILE"; then
        fail "Command failed: $*"
        return 1
    fi
}

# -----------------------------------------------------------------------------
# Failure handler — always try to bring the app back out of maintenance mode
# so a half-failed deploy doesn't leave the site dark.
# -----------------------------------------------------------------------------
on_error() {
    fail "Deploy aborted at: ${BASH_COMMAND}"
    if [ -f "$APP_ROOT/storage/framework/down" ]; then
        warn "App is still in maintenance mode — attempting to bring it back up…"
        "$PHP_BIN" "$APP_ROOT/artisan" up 2>/dev/null || true
    fi
    fail "See $LOG_FILE for the last 200 lines of output."
    exit 1
}
trap on_error ERR

# =============================================================================
# Deploy starts here
# =============================================================================
{
    echo ""
    echo "===================================================="
    echo "Dawki Infotech deploy — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "===================================================="
} | tee -a "$LOG_FILE"

cd "$APP_ROOT"

# -----------------------------------------------------------------------------
# .env protection
# -----------------------------------------------------------------------------
# .env is gitignored (secrets must not be in the repo). Hostinger's native
# Git auto-deploy re-checks-out the working tree and DELETES untracked files
# on every push — which silently wipes .env and 500s the site.
#
# Defence: keep a copy in $HOME (outside public_html, never touched by git).
# Restore from it if .env went missing; refresh it whenever .env is present.
ENV_BACKUP="${ENV_BACKUP:-$HOME/dawki-env-backup}"

step "Securing .env"
if [ -f .env ]; then
    cp -f .env "$ENV_BACKUP" && chmod 600 "$ENV_BACKUP"
    ok ".env present — backup refreshed at $ENV_BACKUP"
elif [ -f "$ENV_BACKUP" ]; then
    cp -f "$ENV_BACKUP" .env
    warn ".env was missing (git deploy wiped it) — restored from $ENV_BACKUP"
else
    fail "No .env and no backup at $ENV_BACKUP."
    fail "Create .env once, then: cp .env $ENV_BACKUP"
    exit 1
fi

# -----------------------------------------------------------------------------
# Pre-flight checks
# -----------------------------------------------------------------------------
step "Pre-flight checks"

if [ ! -f artisan ]; then
    fail "No artisan file found — is this the Laravel app root?"
    exit 1
fi
ok "Laravel app root confirmed at $APP_ROOT"

if [ ! -f .env ]; then
    fail "No .env file even after restore attempt. Aborting."
    exit 1
fi
ok ".env present"

if ! command -v git >/dev/null 2>&1; then
    fail "git not on PATH"; exit 1
fi
if ! command -v composer >/dev/null 2>&1; then
    fail "composer not on PATH"; exit 1
fi
if ! command -v "$PHP_BIN" >/dev/null 2>&1; then
    fail "$PHP_BIN not on PATH"; exit 1
fi
ok "git / composer / php all callable"

# Node is the most environment-specific dep — auto-detect Hostinger's alt-nodejs
# if vanilla `node` isn't on PATH yet.
if [ "$SKIP_NPM" -eq 0 ]; then
    if ! command -v node >/dev/null 2>&1; then
        if [ -d "$NODE_PATH_HOSTINGER" ]; then
            export PATH="$NODE_PATH_HOSTINGER:$PATH"
            ok "Prepended $NODE_PATH_HOSTINGER to PATH (Hostinger alt-nodejs)"
        fi
    fi
    if ! command -v node >/dev/null 2>&1; then
        fail "node not found. Install it, or pass --skip-npm."
        exit 1
    fi
    ok "node $(node -v) / npm $(npm -v) callable"
fi

CURRENT_COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
say "Current commit: $CURRENT_COMMIT"

# -----------------------------------------------------------------------------
# Maintenance mode
# -----------------------------------------------------------------------------
step "Entering maintenance mode"
# Use a per-deploy secret so the operator can preview the new build via
# /<secret> while normal visitors see the 503 page.
DEPLOY_SECRET="$(date +%s | sha256sum | head -c 12)"
run "$PHP_BIN" artisan down \
    --render="errors::503" \
    --secret="$DEPLOY_SECRET" \
    --retry=15 \
    || warn "Couldn't enter maintenance mode (first deploy?) — continuing."
ok "Maintenance mode active. Preview at /${DEPLOY_SECRET}"

# -----------------------------------------------------------------------------
# Pull latest code
# -----------------------------------------------------------------------------
step "Pulling latest code from origin/main"
run git fetch origin main
run git reset --hard origin/main
NEW_COMMIT="$(git rev-parse --short HEAD)"
ok "Now on $NEW_COMMIT (was $CURRENT_COMMIT)"

# -----------------------------------------------------------------------------
# PHP dependencies
# -----------------------------------------------------------------------------
step "Installing PHP dependencies (no-dev, optimised)"
run composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# -----------------------------------------------------------------------------
# Frontend build
# -----------------------------------------------------------------------------
if [ "$SKIP_NPM" -eq 0 ]; then
    step "Building frontend assets"
    if [ -f package-lock.json ]; then
        run npm ci --no-audit --no-fund --silent
    else
        run npm install --no-audit --no-fund --silent
    fi
    run npm run build
    ok "Vite manifest written to public/build/manifest.json"
else
    warn "Skipped npm (--skip-npm)"
fi

# -----------------------------------------------------------------------------
# Application key — self-healing
# -----------------------------------------------------------------------------
# A fresh git clone has no usable APP_KEY (it's gitignored in .env and the
# committed .env.example ships it blank). Without this guard the very first
# deploy 500s with "No application encryption key has been specified".
step "Verifying application key"
if grep -qE '^APP_KEY=base64:.+' .env; then
    ok "APP_KEY already set"
else
    warn "APP_KEY missing or blank — generating one"
    # key:generate replaces an existing APP_KEY= line; make sure the line
    # exists first (some hand-edited .env files drop it entirely).
    grep -qE '^APP_KEY=' .env || run bash -c "echo 'APP_KEY=' >> .env"
    run "$PHP_BIN" artisan key:generate --force
    ok "Fresh APP_KEY written to .env"
fi

# -----------------------------------------------------------------------------
# Database
# -----------------------------------------------------------------------------
if [ "$SKIP_MIGRATE" -eq 0 ]; then
    step "Running database migrations"
    run "$PHP_BIN" artisan migrate --force --no-interaction
else
    warn "Skipped migrations (--skip-migrate)"
fi

# -----------------------------------------------------------------------------
# Storage symlink + writable directories
# -----------------------------------------------------------------------------
step "Filesystem housekeeping"
if [ ! -L public/storage ]; then
    run "$PHP_BIN" artisan storage:link
    ok "Created public/storage symlink"
else
    say "public/storage symlink already in place"
fi

# Make sure runtime-writable dirs really are writable — chmod is idempotent.
run chmod -R 775 storage bootstrap/cache 2>/dev/null || \
    warn "chmod on storage/bootstrap failed (non-fatal)"

# -----------------------------------------------------------------------------
# Caches
# -----------------------------------------------------------------------------
step "Refreshing application caches"
# Clear first — compiled views with old @php blocks can crash silently.
run "$PHP_BIN" artisan view:clear
run "$PHP_BIN" artisan route:clear
run "$PHP_BIN" artisan config:clear
run "$PHP_BIN" artisan cache:clear || warn "cache:clear failed (driver maybe offline)"
ok "All artisan caches cleared"

if [ "$NO_CACHE" -eq 0 ]; then
    run "$PHP_BIN" artisan config:cache
    run "$PHP_BIN" artisan route:cache
    run "$PHP_BIN" artisan view:cache
    ok "Config / route / view caches rebuilt for production"
else
    warn "Production caches NOT rebuilt (--no-cache). Site will run slower."
fi

# Storage permission second pass — composer/npm sometimes write new files
# back under the wrong group.
run chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# -----------------------------------------------------------------------------
# Optional: queue / horizon restart hook
# -----------------------------------------------------------------------------
step "Restarting workers (if any)"
"$PHP_BIN" artisan queue:restart 2>/dev/null \
    && ok "Signalled queue workers to restart" \
    || say "No queue workers running — skipped"

# -----------------------------------------------------------------------------
# Exit maintenance mode
# -----------------------------------------------------------------------------
step "Bringing site back online"
run "$PHP_BIN" artisan up

# -----------------------------------------------------------------------------
# Done
# -----------------------------------------------------------------------------
trap - ERR
echo ""
echo "${BOLD}${GREEN}════════════════════════════════════════════════════${RESET}"
echo "${BOLD}${GREEN}✓ Deploy complete${RESET}"
echo "  ${DIM}was:${RESET}  $CURRENT_COMMIT"
echo "  ${DIM}now:${RESET}  $NEW_COMMIT"
echo "  ${DIM}log:${RESET}  $LOG_FILE"
echo "${BOLD}${GREEN}════════════════════════════════════════════════════${RESET}"
echo ""
