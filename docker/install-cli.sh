#!/bin/sh
# Install the Docker installation's command globally, as owf; never overwrite a native install's owf (or bpmn).
set -eu
cd "$(dirname "$0")"
[ -f owf ] || { echo "Missing docker/owf" >&2; exit 1; }
target=$(readlink -f owf)
if [ -e /usr/local/bin/owf ] || [ -L /usr/local/bin/owf ]; then
    echo "/usr/local/bin/owf already exists (possibly a native installation)."
    echo "Leaving it unchanged. Installing the Docker command as owf-docker instead."
    name=owf-docker
else
    name=owf
fi
ln -s "$target" "/usr/local/bin/$name"
echo "Installed /usr/local/bin/$name -> $target"
echo "Try: $name status"
