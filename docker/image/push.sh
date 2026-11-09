#!/bin/sh
# Publish tags after successfully running test.mjs.
set -eu
docker push --all-tags ralphhanna/bpmn-server
