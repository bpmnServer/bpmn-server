#!/bin/sh
# First time: .env with random keys for docker-compose.yml
if [ ! -f .env ]; then
  key() { od -An -N16 -tx1 /dev/urandom | tr -d ' \n'; }
  printf 'API_KEY=%s\nADMIN_API_KEY=%s\nSESSION_SECRET=%s\n' "$(key)" "$(key)" "$(key)" > .env
  echo "created .env"
fi
docker compose up -d
