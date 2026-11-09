#!/bin/sh
# Build the current npm release or a specified version of the BPMN Server image.
set -eu
cd "$(dirname "$0")"
if [ "$#" -gt 0 ]; then
    docker build --build-arg "BPMN_VERSION=$1" -t "ralphhanna/bpmn-server:$1" .
else
    version=$(npm view bpmn-server version)
    docker build --build-arg "BPMN_VERSION=$version" -t "ralphhanna/bpmn-server:$version" -t ralphhanna/bpmn-server:latest .
fi
