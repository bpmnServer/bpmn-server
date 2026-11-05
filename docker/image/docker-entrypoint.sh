#!/bin/sh
# Runs the application's setup, then the server.
# Every start: setup creates the database's indexes and the `admin` user when they are missing (both are skipped
# when they exist). The settings come from the container's environment (docker-compose.yml).
set -e
cd /app
npm run setup
exec "$@"
