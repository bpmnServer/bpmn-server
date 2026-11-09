#!/bin/sh
# Start an existing installation, applying mode saved in local .env.
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
  mongodb://mongo:*) [ -f docker-compose.mongo.yml ] || { echo "Missing docker-compose.mongo.yml; run setup.sh --reconfigure" >&2; exit 1; }
    set -- "$@" -f docker-compose.mongo.yml ;;
  *) echo "Use docker compose directly for an external database URL." >&2; exit 2 ;;
esac
case "$(get_setting BPMN_IMAGE)" in
  *:local) [ -f docker-compose.build.yml ] || { echo "Missing docker-compose.build.yml; run setup.sh --reconfigure" >&2; exit 1; }
    set -- "$@" -f docker-compose.build.yml ;;
esac
docker compose "$@" up -d --remove-orphans
if [ ! -f status.sh ]; then
  curl -fL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/status.sh -o status.sh
fi
sh status.sh "$@"
