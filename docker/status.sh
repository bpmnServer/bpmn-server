#!/bin/sh
# Wait for the server HTTP endpoint, not merely "container started".
# Usage: sh status.sh [-f docker-compose.yml ...]
set -eu
cd "$(dirname "$0")"
if [ "$#" -eq 0 ]; then set -- -f docker-compose.yml; fi
compose() { docker compose "$@"; }
get_setting() { [ -f .env ] && sed -n "s/^$1=//p" .env | head -n 1 || :; }
port=$(get_setting PORT)
port=${port:-3000}
url="http://127.0.0.1:$port/login"
echo "Checking BPMN Server readiness at $url ..."
attempt=0
while [ "$attempt" -lt 45 ]; do
  id=$(compose "$@" ps -a -q server 2>/dev/null || :)
  if [ -z "$id" ]; then
    echo "ERROR: server container was not created." >&2
    break
  fi
  state=$(docker inspect --format '{{.State.Status}}' "$id" 2>/dev/null || :)
  if [ "$state" = "exited" ] || [ "$state" = "dead" ]; then
    echo "ERROR: server container is $state." >&2
    break
  fi
  if command -v curl >/dev/null 2>&1; then
    code=$(curl --noproxy '*' -sS -o /dev/null -w '%{http_code}' --max-time 2 "$url" 2>/dev/null || :)
    case "$code" in
      200|301|302|303|307|308|401|403)
        echo "READY: BPMN Server is responding (HTTP $code)."
        echo "Open http://localhost:$port"
        echo "Logs: docker compose logs --tail=100 server"
        exit 0;;
    esac
  else
    echo "WARNING: curl is not installed; cannot check HTTP readiness." >&2
    compose "$@" ps -a
    exit 2
  fi
  attempt=$((attempt + 1))
  sleep 2
done
echo "ERROR: BPMN Server did not become ready. Recent startup logs:" >&2
compose "$@" ps -a >&2 || :
compose "$@" logs --tail=80 server >&2 || :
exit 1
