#!/usr/bin/env bash
# Daily backup of the MySQL database and the uploads/ folder (admin images).
# Run from the project root on the server:   bash scripts/backup.sh
# Backups go to $BACKUP_DIR (default /var/backups/techbytex); the newest
# $KEEP_DAYS days are kept. Reads DB_* from .env.local (or .env).
set -euo pipefail

cd "$(dirname "$0")/.."
ENV_FILE=".env.local"
[ -f "$ENV_FILE" ] || ENV_FILE=".env"
set -a
# shellcheck disable=SC1090
. "./$ENV_FILE"
set +a

BACKUP_DIR="${BACKUP_DIR:-/var/backups/techbytex}"
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y-%m-%d_%H%M)"
mkdir -p "$BACKUP_DIR"

# Password goes through a temporary options file, never the command line.
MYCNF="$(mktemp)"
trap 'rm -f "$MYCNF"' EXIT
chmod 600 "$MYCNF"
printf '[client]\nhost=%s\nport=%s\nuser=%s\npassword=%s\n' \
  "${DB_HOST:-localhost}" "${DB_PORT:-3306}" "$DB_USER" "${DB_PASSWORD:-}" > "$MYCNF"

mysqldump --defaults-extra-file="$MYCNF" --single-transaction --routines --no-tablespaces "$DB_NAME" \
  | gzip > "$BACKUP_DIR/db_${STAMP}.sql.gz"
tar -czf "$BACKUP_DIR/uploads_${STAMP}.tar.gz" uploads

find "$BACKUP_DIR" -name 'db_*.sql.gz' -mtime +"$KEEP_DAYS" -delete
find "$BACKUP_DIR" -name 'uploads_*.tar.gz' -mtime +"$KEEP_DAYS" -delete

echo "Backup done: $BACKUP_DIR (db_${STAMP}.sql.gz, uploads_${STAMP}.tar.gz)"
