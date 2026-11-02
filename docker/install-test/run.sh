#!/bin/sh
# The install test: installs bpmn-server, bpmn-web and bpmn-client in a clean container and checks they work.
#   sh run.sh                     the packages of this repository (npm pack), before publishing them
#   sh run.sh npm [version]       the published packages (default latest)
#   TEMPLATE=minimal sh run.sh    with npx bpmn-server init --minimal
set -eu
cd "$(dirname "$0")"
export SOURCE=${1:-local}
export VERSION=${2:-latest}

rm -rf packages
mkdir packages
if [ "$SOURCE" = local ]; then
    (cd ../.. && npm pack -w bpmn-server -w bpmn-web -w bpmn-client --pack-destination docker/install-test/packages)
fi

status=0
docker compose up --build --abort-on-container-exit --exit-code-from tester || status=$?
docker compose down -v
exit $status
