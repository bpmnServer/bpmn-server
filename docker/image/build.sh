#!/bin/sh
# Build bpmnserver/bpmn-server from an npm release: build.sh [version] (default: the latest on npm).
# The four packages must be on npm at that version. Tagged <version>, and latest when it is npm's latest.
set -eu
cd "$(dirname "$0")"
latest=$(npm view bpmn-server version --prefer-online)
version=${1:-$latest}
for package in bpmn-server bpmn-web bpmn-client bpmn-mcp; do
    [ "$(npm view "$package@$version" version --prefer-online 2>/dev/null)" = "$version" ] \
        || { echo "$package@$version is not on npm: publish it first" >&2; exit 1; }
done
tags="-t bpmnserver/bpmn-server:$version"
[ "$version" = "$latest" ] && tags="$tags -t bpmnserver/bpmn-server:latest"
echo "Building bpmnserver/bpmn-server:$version"
# shellcheck disable=SC2086
docker build --build-arg "BPMN_VERSION=$version" $tags .
built=$(docker run --rm --entrypoint node "bpmnserver/bpmn-server:$version" -p "require('./node_modules/bpmn-server/package.json').version")
[ "$built" = "$version" ] || { echo "The image holds bpmn-server $built, not $version" >&2; exit 1; }
echo "Built bpmnserver/bpmn-server:$version"
if [ "$version" = "$latest" ]; then echo "  and tagged latest"; else echo "  not tagged latest: npm's latest is $latest"; fi
echo "Next: node test.mjs bpmnserver/bpmn-server:$version, then sh push.sh"
