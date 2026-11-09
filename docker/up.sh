#!/bin/sh
# Create a locally editable .env once; never overwrite user edits.
set -eu
cd "$(dirname "$0")"
if [ ! -f .env ]; then
  umask 077
  key() { od -An -N24 -tx1 /dev/urandom | tr -d ' \n'; }
  password=$(key)
  cat > .env <<EOF
# Host port (the container listens on 3000)
PORT=3000
# memory is ephemeral; for persistent MongoDB use mongodb://mongo:27017/bpmn
MONGO_DB_URL=memory
REQUIRE_AUTHENTICATION=true
ENFORCE_SECURITY=true
API_SERVICE_USER_NAME=integration
API_SERVICE_USER_GROUPS=SYSTEM
API_KEY=$(key)
ADMIN_API_KEY=$(key)
SESSION_SECRET=$(key)
ADMIN_PASSWORD=$password
EOF
  chmod 600 .env
  echo "Created .env in $(pwd); initial admin password: $password"
fi
docker compose up -d --remove-orphans
