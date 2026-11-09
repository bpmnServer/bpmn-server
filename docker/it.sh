#!/bin/sh
# A shell in the running server container.
cd "$(dirname "$0")"
docker compose exec server sh
