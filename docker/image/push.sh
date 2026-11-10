#!/bin/sh
# Push bpmnserver/bpmn-server: push.sh [version] (default: the latest on npm, as build.sh builds).
# The image must hold that version; latest goes with it only when it is the same image.
set -eu
cd "$(dirname "$0")"
image=bpmnserver/bpmn-server
version=${1:-$(npm view bpmn-server version --prefer-online)}
id=$(docker image inspect --format '{{.Id}}' "$image:$version" 2>/dev/null) || { echo "No local image $image:$version: run build.sh $version first" >&2; exit 1; }
held=$(docker run --rm --entrypoint node "$image:$version" -p "require('./node_modules/bpmn-server/package.json').version")
[ "$held" = "$version" ] || { echo "$image:$version holds bpmn-server $held: not pushed" >&2; exit 1; }
echo "Pushing $image:$version"
docker push "$image:$version"
if [ "$(docker image inspect --format '{{.Id}}' "$image:latest" 2>/dev/null || true)" = "$id" ]; then
    docker push "$image:latest"
else
    echo "latest not pushed: it is not $image:$version"
fi
