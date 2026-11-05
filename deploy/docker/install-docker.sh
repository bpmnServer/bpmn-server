#!/usr/bin/env bash
# Install Docker Engine and the Compose plugin on Ubuntu 22.04/24.04 (AWS Lightsail).
set -euo pipefail
if [[ $(id -u) -ne 0 ]]; then echo "Run with sudo: sudo bash deploy/docker/install-docker.sh" >&2; exit 1; fi
. /etc/os-release
[[ "$ID" == ubuntu && ( "$VERSION_ID" == 22.04 || "$VERSION_ID" == 24.04 ) ]] || { echo "Supported: Ubuntu 22.04 / 24.04" >&2; exit 1; }
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
arch=$(dpkg --print-architecture)
printf 'deb [arch=%s signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu %s stable\n' "$arch" "$VERSION_CODENAME" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
docker version --format 'Docker server: {{.Server.Version}}'
docker compose version
echo 'Docker is ready. Keep users OUT of the docker group: membership grants host-root-equivalent access.'
