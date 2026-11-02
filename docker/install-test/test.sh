#!/bin/sh
# Runs in the tester container. Follows the README's install steps on a clean machine and checks each result:
#   1. npx bpmn-server init: a new application (bpmn-server and bpmn-web as its dependencies)
#   2. npm install, npm run verify, npm run setup, npm start: the web pages answer
#   3. bpmn-client in a project of its own: models listed, a process started and completed through the API
# SOURCE=local installs the packages in /pkgs; SOURCE=npm the published VERSION.
set -eu
SOURCE=${SOURCE:-local}
VERSION=${VERSION:-latest}
TEMPLATE=${TEMPLATE:-sample}
DB=mongodb://mongo:27017/install-test
MINIMAL=$([ "$TEMPLATE" = minimal ] && echo --minimal || echo)

step() { printf '\n=== %s\n' "$*"; }
node --version
npm --version

cd /work
if [ "$SOURCE" = local ]; then
    SERVER=$(ls /pkgs/bpmn-server-*.tgz)
    WEB=$(ls /pkgs/bpmn-web-*.tgz)
    CLIENT=$(ls /pkgs/bpmn-client-*.tgz)
    step "bpmn-server init (from $(basename "$SERVER"))"
    npm exec --yes --package="$SERVER" -- bpmn-server init my-app --yes --mongo "$DB" --no-install $MINIMAL
    cd my-app
    # the packages under test instead of the published ones; bpmn-web's own bpmn-server too
    npm pkg set "dependencies.bpmn-server=file:$SERVER" "dependencies.bpmn-web=file:$WEB" 'overrides.bpmn-server=$bpmn-server'
else
    CLIENT=bpmn-client@$VERSION
    step "npx bpmn-server@$VERSION init"
    npx --yes "bpmn-server@$VERSION" init my-app --yes --mongo "$DB" --no-install $MINIMAL
    cd my-app
fi

step "npm install"
npm install --no-audit --no-fund
npm ls bpmn-server bpmn-web

step "npm run verify"
npm run verify

step "npm run setup"
npm run setup

step "npm start"
npm start > /work/app.log 2>&1 &
if ! node /test/check-web.mjs http://localhost:3000; then
    echo '--- app.log'
    cat /work/app.log
    exit 1
fi

step "bpmn-client ($CLIENT)"
mkdir /work/client
cd /work/client
npm init -y > /dev/null
npm pkg set type=module
npm install --no-audit --no-fund "$CLIENT"
# the server's keys, from the .env init wrote
set -a
. /work/my-app/.env
set +a
# in the project, so that its import finds the project's bpmn-client
cp /test/check-client.mjs .
node check-client.mjs

step "install test passed ($SOURCE, $TEMPLATE)"
