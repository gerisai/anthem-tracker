#!/usr/bin/env bash
# Vercel build command (set in vercel.json, which overrides the dashboard and
# package.json). Applies migrations on production deploys only: previews use
# the production database, so they must not migrate it.
set -euo pipefail

npx prisma generate

# VERCEL_ENV is a system environment variable. If it's missing, we can't tell
# production from preview, so fail instead of silently skipping migrations.
if [ -z "${VERCEL_ENV:-}" ]; then
  echo "VERCEL_ENV is not set. Enable 'Automatically expose System Environment Variables' in the Vercel project settings." >&2
  exit 1
fi

if [ "$VERCEL_ENV" = "production" ]; then
  echo "Production deploy: applying migrations"
  npx prisma migrate deploy
else
  echo "Skipping migrations: $VERCEL_ENV deploys share the production database"
fi

npx next build
