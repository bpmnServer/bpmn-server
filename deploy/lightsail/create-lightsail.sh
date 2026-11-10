#!/usr/bin/env bash
# A bpmn-server on AWS Lightsail in one step: a new Ubuntu 24.04 instance with a static IP, ports 22, 80 and 443
# open, and install.sh as its launch script (Node.js, MongoDB, the application of `npx bpmn-server init`, nginx;
# HTTPS with --domain). It waits until the application answers, then says where it is and the admin password.
#
#   ./create-lightsail.sh                                   http://<static ip>/
#   ./create-lightsail.sh --domain bpmn.example.com --email you@example.com
#   ./create-lightsail.sh --delete                          the instance and its static IP, gone
#
# Needs the AWS CLI (v2), signed in (`aws configure`) as a user allowed to use Lightsail. Lightsail bills the
# instance by the month (the 2 GB size is about USD 12): --delete stops it.
set -euo pipefail

NAME=bpmn-server
REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-}}
BUNDLE=small_3_0            # 2 GB memory: room for MongoDB and Node
BLUEPRINT=ubuntu_24_04
APP_NAME=my-app
ACCESS_USER=ubuntu             # default login account on Lightsail Ubuntu images
BPMN_VERSION=latest
DOMAIN=
EMAIL=
DELETE=
WAIT_MINUTES=25

usage() {
    sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
    cat <<EOF

Options:
  --name <name>          the instance (and its static IP: <name>-ip)            default $NAME
  --region <region>      an AWS region (us-east-1, eu-west-2, ...)             default: the CLI's region
  --bundle <id>          the size (aws lightsail get-bundles)                  default $BUNDLE
  --app <name>           the application's folder and database                default $APP_NAME
  --access <user>        grant local folder access through group owf           default $ACCESS_USER (none to skip)
  --version <version>    the bpmn-server version whose init makes the app      default $BPMN_VERSION
  --domain <name>        the site's domain: HTTPS once its DNS points at the static IP
  --email <address>      for Let's Encrypt's notices (with --domain)
  --delete               delete the instance and release its static IP
EOF
}

while [ $# -gt 0 ]; do
    case "$1" in
        --name) NAME=$2; shift 2 ;;
        --region) REGION=$2; shift 2 ;;
        --bundle) BUNDLE=$2; shift 2 ;;
        --app) APP_NAME=$2; shift 2 ;;
        --access) ACCESS_USER=$2; shift 2 ;;
        --version) BPMN_VERSION=$2; shift 2 ;;
        --domain) DOMAIN=$2; shift 2 ;;
        --email) EMAIL=$2; shift 2 ;;
        --delete) DELETE=1; shift ;;
        -h|--help) usage; exit 0 ;;
        *) echo "unknown option: $1 (--help lists them)"; exit 1 ;;
    esac
done

if [ "$ACCESS_USER" != none ] && [[ ! "$ACCESS_USER" =~ ^[a-z_][a-z0-9_-]*$ ]]; then
    echo "Invalid --access user name" >&2
    exit 2
fi

command -v aws >/dev/null || { echo "The AWS CLI is not installed: https://aws.amazon.com/cli/ , then aws configure"; exit 1; }
REGION=${REGION:-$(aws configure get region 2>/dev/null || true)}
REGION=${REGION:-us-east-1}
ls_() { aws lightsail --region "$REGION" "$@"; }
aws sts get-caller-identity --query Account --output text >/dev/null || { echo "The AWS CLI is not signed in: aws configure"; exit 1; }
IP_NAME=$NAME-ip

if [ -n "$DELETE" ]; then
    echo "Deleting the instance '$NAME' and the static IP '$IP_NAME' in $REGION"
    ls_ delete-instance --instance-name "$NAME" --output text >/dev/null && echo "  instance deleted" || echo "  no instance '$NAME'"
    ls_ release-static-ip --static-ip-name "$IP_NAME" --output text >/dev/null && echo "  static IP released" || echo "  no static IP '$IP_NAME'"
    exit 0
fi

if ls_ get-instance --instance-name "$NAME" >/dev/null 2>&1; then
    echo "An instance '$NAME' is there already in $REGION: --name another, or --delete it first"
    exit 1
fi

HERE=$(cd "$(dirname "$0")" && pwd)
[ -f "$HERE/../install.sh" ] || { echo "deploy/install.sh is not found next to this folder"; exit 1; }
ADMIN_PASSWORD=$( (openssl rand -base64 30 2>/dev/null || head -c 30 /dev/urandom | base64) | tr -dc 'A-Za-z0-9' | head -c 20)

# the launch script: the settings, then install.sh
LAUNCH=$(mktemp)
trap 'rm -f "$LAUNCH"' EXIT
{
    echo '#!/bin/bash'
    printf 'export APP_NAME=%q BPMN_VERSION=%q DOMAIN=%q EMAIL=%q ADMIN_PASSWORD=%q ACCESS_USER=%q\n' "$APP_NAME" "$BPMN_VERSION" "$DOMAIN" "$EMAIL" "$ADMIN_PASSWORD" "$ACCESS_USER"
    tail -n +2 "$HERE/../install.sh" | tr -d '\r'
} > "$LAUNCH"

echo "Creating '$NAME' in $REGION (${REGION}a): $BLUEPRINT, $BUNDLE"
ls_ create-instances --instance-names "$NAME" --availability-zone "${REGION}a" \
    --blueprint-id "$BLUEPRINT" --bundle-id "$BUNDLE" --user-data "file://$LAUNCH" \
    --tags key=app,value=bpmn-server --output text >/dev/null

printf 'Waiting for it to run'
for _ in $(seq 60); do
    [ "$(ls_ get-instance-state --instance-name "$NAME" --query state.name --output text)" = running ] && break
    printf '.'; sleep 5
done
echo

if ! ls_ get-static-ip --static-ip-name "$IP_NAME" >/dev/null 2>&1; then
    ls_ allocate-static-ip --static-ip-name "$IP_NAME" --output text >/dev/null
fi
ls_ attach-static-ip --static-ip-name "$IP_NAME" --instance-name "$NAME" --output text >/dev/null
IP=$(ls_ get-static-ip --static-ip-name "$IP_NAME" --query staticIp.ipAddress --output text)
ls_ put-instance-public-ports --instance-name "$NAME" --output text >/dev/null --port-infos \
    fromPort=22,toPort=22,protocol=tcp fromPort=80,toPort=80,protocol=tcp fromPort=443,toPort=443,protocol=tcp
echo "Static IP $IP; ports 22, 80 and 443 open"
[ -n "$DOMAIN" ] && echo "Point $DOMAIN at $IP now (a DNS A record): HTTPS follows by itself once it does"

printf 'Installing (Node.js, MongoDB, the application, nginx: about 5 to 10 minutes)'
deadline=$(( $(date +%s) + WAIT_MINUTES * 60 ))
until [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "http://$IP/login" || true)" = 200 ]; do
    if [ "$(date +%s)" -gt "$deadline" ]; then
        echo
        echo "No answer after $WAIT_MINUTES minutes. On the instance (Lightsail console, Connect using SSH):"
        echo "  sudo tail -50 /var/log/owf-install.log; journalctl -u owf-$APP_NAME"
        exit 1
    fi
    printf '.'; sleep 15
done
echo

cat <<EOF

bpmn-server is ready:
  http://$IP/${DOMAIN:+   (and https://$DOMAIN/ once its DNS points at $IP)}
  sign in as admin, password $ADMIN_PASSWORD   (change it: your profile, top right)

On the instance (Lightsail console: https://lightsail.aws.amazon.com/ls/webapp/$REGION/instances/$NAME/connect):
  the application  /opt/owf/$APP_NAME   (its models: processes/; settings: .env)
  folder access     $ACCESS_USER (owf group; reconnect SSH or run newgrp owf)
  the service      sudo systemctl restart owf-$APP_NAME ; journalctl -u owf-$APP_NAME -f
  the install log  /var/log/owf-install.log

Delete it all:  $0 --name $NAME --region $REGION --delete
EOF
