#!/bin/sh
# The image of a bpmn-web release from npm. No version: the latest, tagged with its version and latest.
#   sh build.sh [version]
set -eu
cd "$(dirname "$0")"
if [ $# -gt 0 ]; then
    docker build --build-arg "BPMN_VERSION=$1" -t "ralphhanna/bpmn-web:$1" .
else
    version=$(npm view bpmn-web version)
    docker build --build-arg "BPMN_VERSION=$version" -t "ralphhanna/bpmn-web:$version" -t ralphhanna/bpmn-web:latest .
fi
