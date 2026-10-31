#!/bin/sh
# Runs bpmn-web's setup, then the server.
# First start: setup copies .env and the sample application's files. Every start: setup creates the database's
# indexes and the `admin` user when they are missing (both are skipped when they exist).
# The settings come from the container's environment (docker-compose.yml), which .env does not override.
set -e
cd /app
[ -f .env ] || node --import tsx src/scripts/setup.ts
node --import tsx src/scripts/setup.ts
exec "$@"
