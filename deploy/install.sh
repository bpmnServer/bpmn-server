#!/usr/bin/env bash
# Installs bpmn-server on a new Linux server (Ubuntu 22.04 or 24.04), ready to use: Node.js 22, MongoDB 8, the
# application `npx bpmn-server init` makes (with its sample models), run as a service behind nginx on port 80;
# with a domain, HTTPS from Let's Encrypt as soon as the domain points at the server.
#
# One line, on the server:
#   curl -fsSL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/install.sh | sudo bash
#   curl -fsSL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/install.sh | sudo bash -s -- --domain bpmn.example.com --email you@example.com
#
# Or as a cloud server's launch script (AWS Lightsail: Create instance, "Add launch script"; EC2 user data;
# DigitalOcean user data): paste this whole file, and set what you want in the settings below.
#
# It can be run again: what is there is kept (the application, its data, its .env, its admin password).
# The admin password is in /opt/bpmn/admin-password.txt (root only); the log in /var/log/bpmn-install.log.
set -euo pipefail

# ---- settings: edit them here, or give them as options (--domain ...) or environment variables (DOMAIN=...)
APP_NAME=${APP_NAME:-my-app}            # --app: the application's folder (/opt/bpmn/<app>) and its database
BPMN_VERSION=${BPMN_VERSION:-latest}    # --version: the bpmn-server version whose init makes the application
DOMAIN=${DOMAIN:-}                      # --domain: the site's name, for HTTPS (its DNS pointing at this server)
EMAIL=${EMAIL:-}                        # --email: where Let's Encrypt sends its notices
ADMIN_PASSWORD=${ADMIN_PASSWORD:-}      # --admin-password: the first user's (admin); empty: one is generated
PORT=${PORT:-3000}                      # --port: the application's own port, behind nginx

while [ $# -gt 0 ]; do
    case "$1" in
        --app) APP_NAME=$2; shift 2 ;;
        --version) BPMN_VERSION=$2; shift 2 ;;
        --domain) DOMAIN=$2; shift 2 ;;
        --email) EMAIL=$2; shift 2 ;;
        --admin-password) ADMIN_PASSWORD=$2; shift 2 ;;
        --port) PORT=$2; shift 2 ;;
        -h|--help) sed -n '2,15p' "$0" 2>/dev/null | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) echo "unknown option: $1"; exit 1 ;;
    esac
done

# the log holds the admin password: root's only
touch /var/log/bpmn-install.log && chmod 600 /var/log/bpmn-install.log
exec > >(tee -a /var/log/bpmn-install.log) 2>&1
echo "=== bpmn-server install, $(date -u +%FT%TZ)"
APP_USER=bpmn
HOME_DIR=/opt/bpmn
APP_DIR=$HOME_DIR/$APP_NAME
SERVICE=bpmn-$APP_NAME
export DEBIAN_FRONTEND=noninteractive

command -v apt-get >/dev/null || { echo "this installer is for Ubuntu (apt-get); see the install guide for other systems"; exit 1; }
[ "$(id -u)" = 0 ] || { echo "run it as root (sudo)"; exit 1; }
[[ "$APP_NAME" =~ ^[a-z0-9][a-z0-9-]*$ ]] || { echo "APP_NAME: lowercase letters, digits and dashes"; exit 1; }
case "${ADMIN_PASSWORD:-}" in
    *[\'\"\\\$\`]*) echo "ADMIN_PASSWORD: no quotes, backslashes, \$ or backticks"; exit 1 ;;
esac

# ---- packages: Node.js 22, MongoDB 8, nginx

apt-get update -q
apt-get install -y -q curl ca-certificates gnupg git nginx openssl lsb-release

if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y -q nodejs
fi
echo "node $(node --version), npm $(npm --version)"

if ! command -v mongod >/dev/null; then
    codename=$(lsb_release -cs)
    case "$codename" in jammy|noble) ;; *) echo "MongoDB's repository has no Ubuntu '$codename': use 22.04 or 24.04"; exit 1 ;; esac
    curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | gpg --dearmor --yes -o /usr/share/keyrings/mongodb-server-8.0.gpg
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu $codename/mongodb-org/8.0 multiverse" \
        > /etc/apt/sources.list.d/mongodb-org-8.0.list
    apt-get update -q
    apt-get install -y -q mongodb-org
fi
systemctl enable --now mongod
for _ in $(seq 60); do mongosh --quiet --eval 'db.runCommand({ ping: 1 }).ok' >/dev/null 2>&1 && break; sleep 2; done

# ---- the application, made by init, run by its own user

id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --home-dir "$HOME_DIR" --shell /bin/bash "$APP_USER"
# runuser: on every Linux, unlike sudo
as_app() { runuser -u "$APP_USER" -- env HOME="$HOME_DIR" bash -c "cd '$1' && $2"; }

if [ ! -f "$APP_DIR/package.json" ]; then
    as_app "$HOME_DIR" "npx -y bpmn-server@$BPMN_VERSION init '$APP_NAME' --yes --mongo 'mongodb://localhost:27017/$APP_NAME' --port $PORT"
fi

# a .env value: replaced when there, added when not
set_env() {
    local file=$APP_DIR/.env
    if grep -q "^$1=" "$file" 2>/dev/null; then sed -i "s|^$1=.*|$1=$2|" "$file"; else echo "$1=$2" >> "$file"; fi
}
# cookies marked Secure only once the site is HTTPS: a browser does not send them back over http
grep -q '^SECURE_COOKIES=true' "$APP_DIR/.env" 2>/dev/null || set_env SECURE_COOKIES false

# the first user, admin, with a password of its own (never admin/admin on a public server)
CREDENTIALS=$HOME_DIR/admin-password.txt
if [ ! -f "$CREDENTIALS" ]; then
    ADMIN_PASSWORD=${ADMIN_PASSWORD:-$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 20)}
    as_app "$APP_DIR" "ADMIN_PASSWORD='$ADMIN_PASSWORD' npm run setup"
    # a bpmn-web that predates ADMIN_PASSWORD made admin/admin: set the password through its user service
    as_app "$APP_DIR" "ADMIN_PASSWORD='$ADMIN_PASSWORD' node --env-file=.env --input-type=module -e \"
        import mongoose from 'mongoose'; import { UserService } from 'bpmn-web';
        await mongoose.connect(process.env.MONGO_DB_URL);
        await new UserService().setPassword('admin', process.env.ADMIN_PASSWORD);
        await mongoose.disconnect();\"" || echo "the admin password could not be set here: the console (npm run cli) sets it"
    umask 077
    echo "admin password: $ADMIN_PASSWORD" > "$CREDENTIALS"
    chown root:root "$CREDENTIALS"
    umask 022
fi

cat > "/etc/systemd/system/$SERVICE.service" <<EOF
[Unit]
Description=bpmn-server application $APP_NAME
After=network.target mongod.service
Requires=mongod.service

[Service]
User=$APP_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable "$SERVICE"
systemctl restart "$SERVICE"

# ---- nginx in front, on port 80

cat > "/etc/nginx/sites-available/$SERVICE" <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ${DOMAIN:-_};
    client_max_body_size 20m;
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
    }
}
EOF
rm -f /etc/nginx/sites-enabled/default
ln -sf "/etc/nginx/sites-available/$SERVICE" "/etc/nginx/sites-enabled/$SERVICE"
nginx -t
systemctl enable nginx
systemctl reload nginx || systemctl restart nginx

# ---- HTTPS, when there is a domain: as soon as it points here (checked every 5 minutes until it does)

if [ -n "$DOMAIN" ]; then
    apt-get install -y -q certbot python3-certbot-nginx
    if [ -n "$EMAIL" ]; then CERTBOT_CONTACT="-m $EMAIL"; else CERTBOT_CONTACT="--register-unsafely-without-email"; fi
    cat > /usr/local/sbin/bpmn-https <<EOF
#!/usr/bin/env bash
# HTTPS for $DOMAIN once its DNS points at this server; then the app's cookies are Secure, and this stops.
set -euo pipefail
here=\$(curl -fsS https://checkip.amazonaws.com | tr -d '[:space:]')
there=\$(getent ahostsv4 "$DOMAIN" | awk 'NR==1 { print \$1 }')
if [ "\$here" != "\$there" ]; then echo "$DOMAIN points at '\$there', not this server (\$here): waiting"; exit 0; fi
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos $CERTBOT_CONTACT --redirect
sed -i 's|^SECURE_COOKIES=.*|SECURE_COOKIES=true|' "$APP_DIR/.env"
systemctl restart "$SERVICE"
systemctl disable --now bpmn-https.timer
echo "https://$DOMAIN is ready"
EOF
    chmod 755 /usr/local/sbin/bpmn-https
    cat > /etc/systemd/system/bpmn-https.service <<EOF
[Unit]
Description=HTTPS for $DOMAIN once it points here
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/bpmn-https
EOF
    cat > /etc/systemd/system/bpmn-https.timer <<EOF
[Unit]
Description=Try HTTPS for $DOMAIN every 5 minutes until it works
[Timer]
OnBootSec=1min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
EOF
    systemctl daemon-reload
    if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then systemctl enable --now bpmn-https.timer; fi
fi

# ---- ready when the application answers

for _ in $(seq 90); do
    if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/login" 2>/dev/null; then
        address=$(curl -fsS --max-time 5 https://checkip.amazonaws.com 2>/dev/null | tr -d '[:space:]' || true)
        address=${address:-$(hostname -I | awk '{ print $1 }')}
        echo
        echo "=== bpmn-server is ready: http://$address/${DOMAIN:+  (https://$DOMAIN/ once $DOMAIN points at $address)}"
        echo "    sign in as admin, $(cat "$CREDENTIALS")   (change it: your profile, top right)"
        echo "    the application: $APP_DIR; the service: systemctl restart $SERVICE; its log: journalctl -u $SERVICE"
        date -u +%FT%TZ > "$HOME_DIR/INSTALLED"
        exit 0
    fi
    sleep 2
done
echo "=== the application does not answer on port $PORT: journalctl -u $SERVICE"
exit 1
