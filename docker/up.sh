#!/bin/sh
# Start an existing installation, applying mode from local .env.
set -eu
cd "$(dirname "$0")"
if [ ! -f .env ]; then
  if [ -f setup.sh ]; then exec sh setup.sh; fi
  echo "Missing .env. Download and run setup.sh first." >&2
  exit 1
fi
get_setting() { sed -n "s/^$1=//p" .env | head -n 1; }
set -- -f docker-compose.yml
case "$(get_setting MONGO_DB_URL)" in
  memory) ;;
  mongodb://mongo:*) set -- "$@" -f docker-compose.mongo.yml ;;
  *) echo "Only memory or bundled MongoDB is supported by this launcher; use docker compose directly for an external DB." >&2; exit 2 ;;
esac
case "$(get_setting BPMN_IMAGE)" in
  *:local) set -- "$@" -f docker-compose.build.yml ;;
esac
docker compose "$@" up -d --remove-orphans "$@"
