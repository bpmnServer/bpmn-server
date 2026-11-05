#!/bin/sh
# First time: .env with random keys and the password of admin, for docker-compose.yml
if [ ! -f .env ]; then
  key() { od -An -N16 -tx1 /dev/urandom | tr -d ' \n'; }
  password=$(key)
  printf 'API_KEY=%s\nADMIN_API_KEY=%s\nSESSION_SECRET=%s\nADMIN_PASSWORD=%s\n' "$(key)" "$(key)" "$(key)" "$password" > .env
  chmod 600 .env
  echo "created .env; sign in as admin, password $password"
fi
docker compose up -d
