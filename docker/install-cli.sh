#!/bin/sh
# Install an optional global Docker management command; never overwrite native bpmn.
set -eu
cd "$(dirname "$0")"
[ -f bpmn ] || { echo "Missing docker/bpmn" >&2; exit 1; }
target=$(readlink -f bpmn)
if [ -e /usr/local/bin/bpmn ] || [ -L /usr/local/bin/bpmn ]; then
    echo "/usr/local/bin/bpmn already exists (possibly native installation)."
    echo "Leaving it unchanged. Install Docker command as bpmn-docker instead."
    name=bpmn-docker
else
    name=bpmn
fi
ln -s "$target" "/usr/local/bin/$name"
echo "Installed /usr/local/bin/$name -> $target"
echo "Try: $name status"
