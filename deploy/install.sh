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
# Afterwards, the `bpmn` command: bpmn status, logs, monitor, restart, update, domain, access, password (bpmn help).
set -euo pipefail

# ---- settings: edit them here, or give them as options (--domain ...) or environment variables (DOMAIN=...)
APP_NAME=${APP_NAME:-my-app}            # --app: the application's folder (/opt/bpmn/<app>) and its database
BPMN_VERSION=${BPMN_VERSION:-latest}    # --version: the bpmn-server version whose init makes the application
DOMAIN=${DOMAIN:-}                      # --domain: the site's name, for HTTPS (its DNS pointing at this server)
EMAIL=${EMAIL:-}                        # --email: where Let's Encrypt sends its notices
ADMIN_PASSWORD=${ADMIN_PASSWORD:-}      # --admin-password: the first user's (admin); empty: one is generated
PORT=${PORT:-3000}                      # --port: the application's own port, behind nginx
BPMN_DIR=${BPMN_DIR:-/opt/bpmn}         # --dir: where the application's folder is made (/opt/bpmn/<app>)
ACCESS_USER=${ACCESS_USER:-}            # --access: local editor (defaults to sudo-invoking user, else ubuntu)
INTERACTIVE=auto                        # prompts on first interactive install; --interactive or --yes override
INSTALL_MODE=${INSTALL_MODE:-production} # development for local use; production for public/cloud deployment

while [ $# -gt 0 ]; do
    case "$1" in --interactive) INTERACTIVE=yes; shift; continue;; --yes|--non-interactive) INTERACTIVE=no; shift; continue;; esac
    case "$1" in
        --app) APP_NAME=$2; shift 2 ;;
        --version) BPMN_VERSION=$2; shift 2 ;;
        --domain) DOMAIN=$2; shift 2 ;;
        --email) EMAIL=$2; shift 2 ;;
        --admin-password) ADMIN_PASSWORD=$2; shift 2 ;;
        --port) PORT=$2; shift 2 ;;
        --dir) BPMN_DIR=$2; shift 2 ;;
        --access) ACCESS_USER=$2; shift 2 ;;
        --mode) INSTALL_MODE=$2; shift 2 ;;
        -h|--help) sed -n '2,16p' "$0" 2>/dev/null | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) echo "unknown option: $1"; exit 1 ;;
    esac
done

# Prompt only on a first install from a terminal. Lightsail/user-data and piped installs remain unattended.
# /dev/tty is used because 'curl ... | sudo bash' consumes standard input for the script.
if [ "$INTERACTIVE" = auto ]; then
    if [ -r /dev/tty ] && [ -w /dev/tty ] && [ -t 2 ] && [ ! -d "${BPMN_DIR%/}/$APP_NAME" ]; then
        INTERACTIVE=yes
    else
        INTERACTIVE=no
    fi
fi
if [ "$INTERACTIVE" = yes ]; then
    [ -r /dev/tty ] && [ -w /dev/tty ] || { echo "Interactive mode requires a terminal; use --yes for automation" >&2; exit 2; }
    prompt() {
        local __name=$1 __label=$2 __default=$3 __value
        printf '%s [%s]: ' "$__label" "$__default" > /dev/tty
        IFS= read -r __value < /dev/tty || __value=
        printf -v "$__name" '%s' "${__value:-$__default}"
    }
    default_access=$ACCESS_USER
    if [ -z "$default_access" ]; then
        if [ -n "${SUDO_USER:-}" ] && [ "$SUDO_USER" != root ]; then default_access=$SUDO_USER
        elif [ -n "$(logname 2>/dev/null || true)" ] && [ "$(logname 2>/dev/null || true)" != root ]; then default_access=$(logname 2>/dev/null)
        elif id ubuntu >/dev/null 2>&1; then default_access=ubuntu
        else default_access=none
        fi
    fi
    printf '\nBPMN Server native installation (not Docker)\nPress Enter to accept each default.\n\n' > /dev/tty
    prompt APP_NAME "Application name" "$APP_NAME"
    prompt INSTALL_MODE "Mode (development/production)" "$INSTALL_MODE"
    prompt BPMN_VERSION "BPMN Server npm version" "$BPMN_VERSION"
    prompt PORT "Application port behind nginx" "$PORT"
    prompt BPMN_DIR "Application root directory" "$BPMN_DIR"
    prompt ACCESS_USER "Local user to add to bpmn group (none disables)" "$default_access"
    prompt DOMAIN "Domain for HTTPS (none to skip)" "${DOMAIN:-none}"
    prompt EMAIL "Email for Let's Encrypt (none to skip)" "${EMAIL:-none}"
    [ "$DOMAIN" = none ] && DOMAIN=
    [ "$EMAIL" = none ] && EMAIL=
    printf '\nApp: %s/%s | mode: %s | version: %s | port: %s | editor: %s | domain: %s\n' \
        "${BPMN_DIR%/}" "$APP_NAME" "$INSTALL_MODE" "$BPMN_VERSION" "$PORT" "$ACCESS_USER" "${DOMAIN:-none}" > /dev/tty
    prompt CONFIRM "Proceed with installation? (yes/no)" yes
    [ "$CONFIRM" = yes ] || { echo "Installation cancelled"; exit 0; }
fi

# the log holds the admin password: root's only
touch /var/log/bpmn-install.log && chmod 600 /var/log/bpmn-install.log
exec > >(tee -a /var/log/bpmn-install.log) 2>&1
echo "=== bpmn-server install, $(date -u +%FT%TZ)"
case "$INSTALL_MODE" in
  development|production) ;;
  *) echo "Invalid --mode: use development or production" >&2; exit 2 ;;
esac
if [ "$INSTALL_MODE" = development ] && [ -n "$DOMAIN" ]; then
    echo "Development mode is for local use only: omit --domain or choose --mode production" >&2
    exit 2
fi
APP_USER=bpmn
HOME_DIR=${BPMN_DIR%/}
APP_DIR=$HOME_DIR/$APP_NAME
SERVICE=bpmn-$APP_NAME
export DEBIAN_FRONTEND=noninteractive

command -v apt-get >/dev/null || { echo "this installer is for Ubuntu (apt-get); see the install guide for other systems"; exit 1; }
[ "$(id -u)" = 0 ] || { echo "run it as root (sudo)"; exit 1; }
[[ "$APP_NAME" =~ ^[a-z0-9][a-z0-9-]*$ ]] || { echo "APP_NAME: lowercase letters, digits and dashes"; exit 1; }
[[ "$HOME_DIR" =~ ^/[A-Za-z0-9/_.-]+$ ]] || { echo "--dir: an absolute path (letters, digits, / _ . -)"; exit 1; }
# who may edit the application's files: the one running sudo, else the cloud image's user (a launch script runs as root)
if [ -z "$ACCESS_USER" ]; then
    if [ -n "${SUDO_USER:-}" ] && [ "$SUDO_USER" != root ]; then ACCESS_USER=$SUDO_USER
    elif [ -n "$(logname 2>/dev/null || true)" ] && [ "$(logname 2>/dev/null || true)" != root ]; then ACCESS_USER=$(logname 2>/dev/null)
    elif id ubuntu >/dev/null 2>&1; then ACCESS_USER=ubuntu; fi
fi
[ "$ACCESS_USER" = none ] && ACCESS_USER=
[[ "$PORT" =~ ^[0-9]+$ ]] && ((10#$PORT >= 1 && 10#$PORT <= 65535)) || { echo "PORT must be 1-65535"; exit 1; }
if [ -n "$ACCESS_USER" ] && ! id "$ACCESS_USER" >/dev/null 2>&1; then
    echo "Access user '$ACCESS_USER' does not exist. Use --access none to skip."; exit 1
fi
case "${ADMIN_PASSWORD:-}" in
    *[\'\"\\\$\`]*) echo "ADMIN_PASSWORD: no quotes, backslashes, \$ or backticks"; exit 1 ;;
esac

# ---- before: what MongoDB 8 needs of the machine

# MongoDB 5 and later need a CPU with AVX (x86); without it mongod stops at once (an illegal instruction)
if [ "$(uname -m)" = x86_64 ] && ! grep -qw avx /proc/cpuinfo; then
    echo "This CPU has no AVX, which MongoDB 8 needs: pick another instance type (any current AWS one has it)"
    exit 1
fi
# under 2 GB of memory, MongoDB and npm together run out of it: a swap file makes room (512 MB and 1 GB sizes)
if [ "$(awk '/^MemTotal/ {print int($2/1024)}' /proc/meminfo)" -lt 1900 ] && [ "$(awk '/^SwapTotal/ {print $2}' /proc/meminfo)" = 0 ]; then
    echo "less than 2 GB of memory: adding a 2 GB swap file (/swapfile)"
    if { fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=none; } \
        && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile; then
        grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
    else
        echo "no swap file could be added here (a container?): going on without one"
        rm -f /swapfile
    fi
fi

# ---- packages: Node.js 22, MongoDB 8, nginx

apt-get update -q
apt-get install -y -q curl ca-certificates gnupg git nginx openssl lsb-release acl

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
# Linux 6.19 and newer: MongoDB 8 stops at start ("known incompatibility", SERVER-121912; its tcmalloc and the
# kernel's rseq). With glibc owning rseq, tcmalloc uses per-thread caches and mongod starts (some allocator speed
# is the cost). MongoDB's own answer is kernel 7.0.14 or later, which Ubuntu's version numbers do not always show.
if [ "$(printf '%s\n' 6.19 "$(uname -r | cut -d- -f1)" | sort -V | head -1)" = 6.19 ]; then
    echo "Linux $(uname -r): mongod runs with GLIBC_TUNABLES=glibc.pthread.rseq=1 (MongoDB and kernels 6.19+)"
    mkdir -p /etc/systemd/system/mongod.service.d
    printf '[Service]\nEnvironment="GLIBC_TUNABLES=glibc.pthread.rseq=1"\n' > /etc/systemd/system/mongod.service.d/kernel-6.19.conf
    systemctl daemon-reload
fi
mongo_up() { mongosh --quiet --eval 'db.runCommand({ ping: 1 }).ok' >/dev/null 2>&1; }
systemctl enable mongod
systemctl restart mongod || true
for _ in $(seq 90); do mongo_up && break; sleep 2; done
if ! mongo_up; then
    echo "!!! MongoDB did not start. What it says:"
    systemctl status mongod --no-pager -l 2>&1 | tail -15
    journalctl -u mongod -n 30 --no-pager 2>&1 | tail -30
    tail -20 /var/log/mongodb/mongod.log 2>/dev/null
    echo "!!! memory: $(free -m | awk '/^Mem:/ {print $2 " MB"}'), swap: $(free -m | awk '/^Swap:/ {print $2 " MB"}')"
    echo "!!! fix it and run this script again: what is done is kept"
    exit 1
fi
echo "MongoDB $(mongod --version | awk '/db version/ {print $3}') is up"

# ---- the application, made by init, run by its own user

id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --home-dir "$HOME_DIR" --shell /bin/bash "$APP_USER"
mkdir -p "$HOME_DIR" && chown "$APP_USER:$APP_USER" "$HOME_DIR"
# runuser: on every Linux, unlike sudo
as_app() { runuser -u "$APP_USER" -- env HOME="$HOME_DIR" bash -c "cd '$1' && $2"; }

if [ ! -f "$APP_DIR/package.json" ]; then
    as_app "$HOME_DIR" "npx -y bpmn-server@$BPMN_VERSION init '$APP_NAME' --yes --mongo 'mongodb://localhost:27017/$APP_NAME' --port $PORT"
fi

# its files: the bpmn user's, and its group's (with ACCESS_USER in it): new files and folders stay the group's
chgrp -R "$APP_USER" "$APP_DIR"
chmod -R g+rwX "$APP_DIR"
find "$APP_DIR" -type d -exec chmod g+s {} +
# and stay editable by the group whoever makes them, whatever their umask: a default ACL (node_modules aside)
find "$APP_DIR" -path "$APP_DIR/node_modules" -prune -o -type d -print0 \
    | xargs -0 -r setfacl -m g:"$APP_USER":rwX -m d:g:"$APP_USER":rwX 2>/dev/null || true
chmod 750 "$HOME_DIR"
# The parent path must be traversable; do not loosen permissions on /opt or shared ancestors.
if [ -n "$ACCESS_USER" ]; then
    if id "$ACCESS_USER" >/dev/null 2>&1; then
        usermod -aG "$APP_USER" "$ACCESS_USER"
        echo "$ACCESS_USER added to group $APP_USER (edit $APP_DIR after next login, or: newgrp $APP_USER)"
        echo "Check: id -nG $ACCESS_USER; ls -ld $HOME_DIR $APP_DIR"
        if runuser -u "$ACCESS_USER" -- sh -c 'test -x "$1" && test -r "$2" && test -w "$2"' sh "$HOME_DIR" "$APP_DIR"; then
            echo "ACCESS OK: $ACCESS_USER can traverse $HOME_DIR and read/write $APP_DIR after group refresh"
        else
            echo "ACCESS WARNING: $ACCESS_USER cannot yet read/write $APP_DIR; inspect: namei -l $APP_DIR"
        fi
    else
        echo "no user $ACCESS_USER: nobody else may edit $APP_DIR (bpmn access <user> adds one)"
    fi
fi

# a .env value: replaced when there, added when not
set_env() {
    local file=$APP_DIR/.env
    if grep -q "^$1=" "$file" 2>/dev/null; then sed -i "s|^$1=.*|$1=$2|" "$file"; else echo "$1=$2" >> "$file"; fi
}
# Production deployments enforce authentication; development respects local .env.
if [ "$INSTALL_MODE" = production ]; then
    set_env REQUIRE_AUTHENTICATION true
    set_env ENFORCE_SECURITY true
    set_env ALLOW_INSECURE_NO_AUTH false
    echo "Production mode: authentication and security enabled"
else
    echo "Development mode: existing authentication settings retained from .env"
    echo "WARNING: do not expose development ports to untrusted networks"
fi

# cookies marked Secure only once the site is HTTPS: a browser does not send them back over http
grep -q '^SECURE_COOKIES=true' "$APP_DIR/.env" 2>/dev/null || set_env SECURE_COOKIES false

# Admin password for first-time account creation. Keep one stable value in .env
# (the same convention as Docker); editing it later does NOT reset MongoDB users.
# On an upgrade, migrate the initial password from the legacy root-only file if present.
CREDENTIALS=$HOME_DIR/admin-password.txt
configured_password=$(sed -n 's/^ADMIN_PASSWORD=//p' "$APP_DIR/.env" | head -n 1)
if [ -n "$configured_password" ]; then
    ADMIN_PASSWORD=$configured_password
elif [ -f "$CREDENTIALS" ]; then
    ADMIN_PASSWORD=$(sed -n 's/^admin password: //p' "$CREDENTIALS" | head -n 1)
    ADMIN_PASSWORD=${ADMIN_PASSWORD:-$(cat "$CREDENTIALS")}
fi
if [ -z "$ADMIN_PASSWORD" ]; then
    ADMIN_PASSWORD=$(openssl rand -hex 16)
fi
# Avoid accidentally publishing credentials to other local accounts.
set_env ADMIN_PASSWORD "$ADMIN_PASSWORD"
chown "$APP_USER:$APP_USER" "$APP_DIR/.env"
chmod 660 "$APP_DIR/.env"
if [ ! -f "$CREDENTIALS" ]; then
    # The setup command creates the first account only when no users exist.
    as_app "$APP_DIR" "npm run setup"
    # Legacy compatibility: older bpmn-web releases did not honor ADMIN_PASSWORD.
    as_app "$APP_DIR" "node --env-file=.env --input-type=module -e \"
        import mongoose from 'mongoose'; import { UserService } from 'bpmn-web';
        await mongoose.connect(process.env.MONGO_DB_URL);
        await new UserService().setPassword('admin', process.env.ADMIN_PASSWORD);
        await mongoose.disconnect();\"" || echo "the admin password could not be set here: use the console (npm run cli)"
    umask 077
    printf 'admin password: %s\n' "$ADMIN_PASSWORD" > "$CREDENTIALS"
    chown root:root "$CREDENTIALS"
    chmod 600 "$CREDENTIALS"
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
Environment=NODE_ENV=$INSTALL_MODE
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
# what it writes (models, history, tests) its group may edit too
UMask=0002

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable "$SERVICE"
systemctl restart "$SERVICE"

# ---- nginx in front, on port 80
# Development binds nginx to loopback only. Production may listen publicly.
if [ "$INSTALL_MODE" = development ]; then
    NGINX_LISTEN='listen 127.0.0.1:80 default_server;'
else
    NGINX_LISTEN=

cat > "/etc/nginx/sites-available/$SERVICE" <<EOF
server {
    $NGINX_LISTEN
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
systemctl reload nginx 2>/dev/null || systemctl restart nginx

# a firewall on the server itself: ufw when it is on; Oracle Cloud's Ubuntu images reject all but SSH in iptables
if command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q '^Status: active'; then
    ufw allow 'Nginx Full' >/dev/null && echo "ufw: 80 and 443 open"
fi
if command -v iptables >/dev/null && iptables -S INPUT 2>/dev/null | grep -q -- '-j REJECT'; then
    for port in 80 443; do
        iptables -C INPUT -p tcp --dport $port -m state --state NEW -j ACCEPT 2>/dev/null \
            || iptables -I INPUT 1 -p tcp --dport $port -m state --state NEW -j ACCEPT
    done
    command -v netfilter-persistent >/dev/null && netfilter-persistent save >/dev/null 2>&1 || true
    echo "iptables: 80 and 443 open"
fi

# ---- the bpmn command: status, logs, monitor, restart, update, domain and HTTPS, access (bpmn help)

# a domain set before (bpmn domain) stays
KEPT_DOMAIN=$(grep -s '^DOMAIN=' /etc/bpmn.conf | cut -d= -f2- || true)
KEPT_EMAIL=$(grep -s '^EMAIL=' /etc/bpmn.conf | cut -d= -f2- || true)
rm -f /usr/local/sbin/bpmn-https      # the HTTPS script of an earlier install: bpmn https now
cat > /etc/bpmn.conf <<EOF
# the bpmn command's settings (written by install.sh; bpmn domain adds DOMAIN and EMAIL)
APP_NAME=$APP_NAME
APP_USER=$APP_USER
HOME_DIR=$HOME_DIR
APP_DIR=$APP_DIR
SERVICE=$SERVICE
PORT=$PORT
INSTALL_MODE=$INSTALL_MODE
DOMAIN=$KEPT_DOMAIN
EMAIL=$KEPT_EMAIL
EOF

cat > /usr/local/bin/bpmn <<'BPMN'
#!/usr/bin/env bash
# bpmn: the bpmn-server application on this server (installed by bpmn-server's deploy/install.sh)
set -uo pipefail
[ -f /etc/bpmn.conf ] || { echo "no /etc/bpmn.conf: bpmn-server's install.sh makes it"; exit 1; }
. /etc/bpmn.conf
# what needs root asks sudo for it
[ "$(id -u)" = 0 ] || case "${1:-help}" in help|-h|--help) ;; *) exec sudo "$0" "$@" ;; esac

conf() {        # a setting in /etc/bpmn.conf
    if grep -q "^$1=" /etc/bpmn.conf; then sed -i "s|^$1=.*|$1=$2|" /etc/bpmn.conf; else echo "$1=$2" >> /etc/bpmn.conf; fi
}
envset() {      # a setting in the application's .env
    if grep -q "^$1=" "$APP_DIR/.env"; then sed -i "s|^$1=.*|$1=$2|" "$APP_DIR/.env"; else echo "$1=$2" >> "$APP_DIR/.env"; fi
}
address() { curl -fsS --max-time 5 https://checkip.amazonaws.com 2>/dev/null | tr -d '[:space:]' || hostname -I | awk '{ print $1 }'; }
state() { printf '%-8s %s\n' "$(systemctl is-active "$1" 2>/dev/null)" "$1"; }

status() {
    echo "bpmn-server: $APP_DIR (port $PORT)"
    state "$SERVICE"; state mongod; state nginx
    local since memory restarts
    since=$(systemctl show "$SERVICE" -p ActiveEnterTimestamp --value 2>/dev/null)
    memory=$(systemctl show "$SERVICE" -p MemoryCurrent --value 2>/dev/null)
    restarts=$(systemctl show "$SERVICE" -p NRestarts --value 2>/dev/null)
    if [[ "$memory" =~ ^[0-9]+$ ]]; then memory="$((memory / 1048576)) MB"; else memory=?; fi
    echo "since ${since:-?}, memory $memory, restarts ${restarts:-0}"
    if [ -n "${DOMAIN:-}" ] && [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then echo "https://$DOMAIN/"
    elif [ -n "${DOMAIN:-}" ]; then echo "http://$(address)/   (https://$DOMAIN/ waits for its DNS: bpmn https)"
    else echo "http://$(address)/   (no domain: bpmn domain <name> [email])"; fi
    curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:$PORT/login" && echo "answering" || echo "!!! not answering on port $PORT: bpmn logs"
}

monitor() {     # a live view, every 3 seconds, until Ctrl+C
    trap 'tput cnorm 2>/dev/null; exit 0' INT
    tput civis 2>/dev/null
    while true; do
        clear
        echo "bpmn monitor  $(date '+%F %T')   (Ctrl+C to stop)"; echo
        status; echo
        top -b -n 1 | sed -n '1,5p'; echo
        ps -o pid,pcpu,pmem,rss,etime,cmd -C node,mongod --sort=-pcpu | cut -c1-110 | head -6; echo
        echo "--- the last lines of its log"
        journalctl -u "$SERVICE" -n 12 --no-pager -o cat | cut -c1-150
        sleep 3
    done
}

https_now() {   # a certificate for DOMAIN once it points here; then the cookies are Secure
    [ -n "${DOMAIN:-}" ] || { echo "no domain: bpmn domain <name> [email]"; return 1; }
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        echo "https://$DOMAIN/ has its certificate (renewed by certbot's own timer)"
        systemctl disable --now bpmn-https.timer >/dev/null 2>&1 || true
        return 0
    fi
    local here there
    here=$(address); there=$(getent ahostsv4 "$DOMAIN" | awk 'NR==1 { print $1 }')
    if [ "$here" != "$there" ]; then
        echo "$DOMAIN points at '${there:-nothing}', not this server ($here): add a DNS A record $DOMAIN -> $here"
        echo "(tried again every 5 minutes until it does)"
        return 0
    fi
    command -v certbot >/dev/null || DEBIAN_FRONTEND=noninteractive apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
    local contact="--register-unsafely-without-email"
    [ -n "${EMAIL:-}" ] && contact="-m $EMAIL"
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos $contact --redirect || return 1
    envset SECURE_COOKIES true
    systemctl restart "$SERVICE"
    systemctl disable --now bpmn-https.timer >/dev/null 2>&1 || true
    echo "https://$DOMAIN/ is ready"
}

domain() {      # bpmn domain <name> [email]
    local name=${1:-} email=${2:-${EMAIL:-}}
    [[ "$name" =~ ^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]] || { echo "usage: bpmn domain <name> [email]   e.g. bpmn domain bpmn.example.com you@example.com"; return 1; }
    conf DOMAIN "$name"; conf EMAIL "$email"; DOMAIN=$name; EMAIL=$email
    sed -i "0,/server_name .*;/s//server_name $name;/" "/etc/nginx/sites-available/$SERVICE"
    nginx -t -q && systemctl reload nginx
    if ! command -v certbot >/dev/null; then
        echo "installing certbot (Let's Encrypt)..."
        DEBIAN_FRONTEND=noninteractive apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
    fi
    cat > /etc/systemd/system/bpmn-https.service <<EOF
[Unit]
Description=HTTPS for the bpmn-server site once its domain points here
[Service]
Type=oneshot
ExecStart=/usr/local/bin/bpmn https
EOF
    cat > /etc/systemd/system/bpmn-https.timer <<EOF
[Unit]
Description=Try HTTPS for the bpmn-server site every 5 minutes until it works
[Timer]
OnBootSec=1min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
EOF
    systemctl daemon-reload
    https_now
    [ -d "/etc/letsencrypt/live/$name" ] || systemctl enable --now bpmn-https.timer >/dev/null 2>&1
}

access() {      # bpmn access <user>
    local user=${1:-${SUDO_USER:-}}
    id "$user" >/dev/null 2>&1 || { echo "usage: bpmn access <user>"; return 1; }
    usermod -aG "$APP_USER" "$user"
    echo "$user may edit $APP_DIR from its next sign-in (or now: newgrp $APP_USER)"
}

update() {      # bpmn update: the newest bpmn-server and bpmn-web, then a restart
    runuser -u "$APP_USER" -- env HOME="$HOME_DIR" bash -c "cd '$APP_DIR' && npm update bpmn-server bpmn-web" || return 1
    runuser -u "$APP_USER" -- env HOME="$HOME_DIR" bash -c "cd '$APP_DIR' && npm ls bpmn-server bpmn-web --depth=0" | tail -n +2
    systemctl restart "$SERVICE" && echo "restarted"
}

case "${1:-help}" in
    status) status ;;
    logs) shift; if [ $# -gt 0 ]; then journalctl -u "$SERVICE" --no-pager "$@"; else journalctl -u "$SERVICE" -f; fi ;;
    monitor) monitor ;;
    restart|stop|start) systemctl "$1" "$SERVICE" && echo "$1: done" ;;
    update) update ;;
    password) cat "$HOME_DIR/admin-password.txt" 2>/dev/null || echo "no password file: it was changed or never made" ;;
    domain) shift; domain "$@" ;;
    https) https_now ;;
    access) shift; access "$@" ;;
    env) ${EDITOR:-nano} "$APP_DIR/.env" && systemctl restart "$SERVICE" ;;
    cli) shift; runuser -u "$APP_USER" -- env HOME="$HOME_DIR" bash -c 'cd "$0" && npm run --silent cli -- "$@"' "$APP_DIR" "$@" ;;
    *) cat <<EOF
bpmn: the bpmn-server application in $APP_DIR (the service $SERVICE)

  bpmn status                   the app, MongoDB and nginx; its address
  bpmn logs                     its log, live (Ctrl+C); bpmn logs -n 200, bpmn logs --since "1 hour ago", bpmn logs -p err
  bpmn monitor                  a live view: status, CPU and memory, the last log lines
  bpmn restart | stop | start
  bpmn update                   the newest bpmn-server and bpmn-web, then a restart
  bpmn env                      edit its .env, then a restart
  bpmn cli [command ...]        its console (npm run cli); with a command, just that: bpmn cli cod asana
  bpmn domain <name> [email]    the site's domain name, and HTTPS for it once its DNS points here
  bpmn https                    HTTPS now (or why not yet)
  bpmn access <user>            let a user edit the application's files (the group $APP_USER)
  bpmn password                 the first admin password (until it is changed)
EOF
    ;;
esac
BPMN
chmod 755 /usr/local/bin/bpmn

# ---- the domain, and HTTPS for it as soon as it points here
if [ -n "$DOMAIN" ]; then
    /usr/local/bin/bpmn domain "$DOMAIN" "$EMAIL" || echo "HTTPS is not set yet: bpmn https tries again"
fi

# ---- ready when the application answers

for _ in $(seq 90); do
    if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/login" 2>/dev/null; then
        address=$(curl -fsS --max-time 5 https://checkip.amazonaws.com 2>/dev/null | tr -d '[:space:]' || true)
        address=${address:-$(hostname -I | awk '{ print $1 }')}
        echo
        echo "=== bpmn-server is ready: http://$address/${DOMAIN:+  (https://$DOMAIN/ once $DOMAIN points at $address)}"
        echo "    sign in as admin, $(cat "$CREDENTIALS")   (change it: your profile, top right)"
        echo "    the application: $APP_DIR${ACCESS_USER:+ (editor $ACCESS_USER in group $APP_USER; re-login or newgrp $APP_USER)}"
        echo "    bpmn status | logs | monitor | restart | update | domain <name> [email]   (bpmn help)"
        date -u +%FT%TZ > "$HOME_DIR/INSTALLED"
        exit 0
    fi
    sleep 2
done
echo "=== the application does not answer on port $PORT: journalctl -u $SERVICE"
exit 1
listen 80 default_server;\n    listen [::]:80 default_server;'
fi

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
systemctl reload nginx 2>/dev/null || systemctl restart nginx

# a firewall on the server itself: ufw when it is on; Oracle Cloud's Ubuntu images reject all but SSH in iptables
if command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q '^Status: active'; then
    ufw allow 'Nginx Full' >/dev/null && echo "ufw: 80 and 443 open"
fi
if command -v iptables >/dev/null && iptables -S INPUT 2>/dev/null | grep -q -- '-j REJECT'; then
    for port in 80 443; do
        iptables -C INPUT -p tcp --dport $port -m state --state NEW -j ACCEPT 2>/dev/null \
            || iptables -I INPUT 1 -p tcp --dport $port -m state --state NEW -j ACCEPT
    done
    command -v netfilter-persistent >/dev/null && netfilter-persistent save >/dev/null 2>&1 || true
    echo "iptables: 80 and 443 open"
fi

# ---- the bpmn command: status, logs, monitor, restart, update, domain and HTTPS, access (bpmn help)

# a domain set before (bpmn domain) stays
KEPT_DOMAIN=$(grep -s '^DOMAIN=' /etc/bpmn.conf | cut -d= -f2- || true)
KEPT_EMAIL=$(grep -s '^EMAIL=' /etc/bpmn.conf | cut -d= -f2- || true)
rm -f /usr/local/sbin/bpmn-https      # the HTTPS script of an earlier install: bpmn https now
cat > /etc/bpmn.conf <<EOF
# the bpmn command's settings (written by install.sh; bpmn domain adds DOMAIN and EMAIL)
APP_NAME=$APP_NAME
APP_USER=$APP_USER
HOME_DIR=$HOME_DIR
APP_DIR=$APP_DIR
SERVICE=$SERVICE
PORT=$PORT
DOMAIN=$KEPT_DOMAIN
EMAIL=$KEPT_EMAIL
EOF

cat > /usr/local/bin/bpmn <<'BPMN'
#!/usr/bin/env bash
# bpmn: the bpmn-server application on this server (installed by bpmn-server's deploy/install.sh)
set -uo pipefail
[ -f /etc/bpmn.conf ] || { echo "no /etc/bpmn.conf: bpmn-server's install.sh makes it"; exit 1; }
. /etc/bpmn.conf
# what needs root asks sudo for it
[ "$(id -u)" = 0 ] || case "${1:-help}" in help|-h|--help) ;; *) exec sudo "$0" "$@" ;; esac

conf() {        # a setting in /etc/bpmn.conf
    if grep -q "^$1=" /etc/bpmn.conf; then sed -i "s|^$1=.*|$1=$2|" /etc/bpmn.conf; else echo "$1=$2" >> /etc/bpmn.conf; fi
}
envset() {      # a setting in the application's .env
    if grep -q "^$1=" "$APP_DIR/.env"; then sed -i "s|^$1=.*|$1=$2|" "$APP_DIR/.env"; else echo "$1=$2" >> "$APP_DIR/.env"; fi
}
address() { curl -fsS --max-time 5 https://checkip.amazonaws.com 2>/dev/null | tr -d '[:space:]' || hostname -I | awk '{ print $1 }'; }
state() { printf '%-8s %s\n' "$(systemctl is-active "$1" 2>/dev/null)" "$1"; }

status() {
    echo "bpmn-server: $APP_DIR (port $PORT)"
    state "$SERVICE"; state mongod; state nginx
    local since memory restarts
    since=$(systemctl show "$SERVICE" -p ActiveEnterTimestamp --value 2>/dev/null)
    memory=$(systemctl show "$SERVICE" -p MemoryCurrent --value 2>/dev/null)
    restarts=$(systemctl show "$SERVICE" -p NRestarts --value 2>/dev/null)
    if [[ "$memory" =~ ^[0-9]+$ ]]; then memory="$((memory / 1048576)) MB"; else memory=?; fi
    echo "since ${since:-?}, memory $memory, restarts ${restarts:-0}"
    if [ -n "${DOMAIN:-}" ] && [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then echo "https://$DOMAIN/"
    elif [ -n "${DOMAIN:-}" ]; then echo "http://$(address)/   (https://$DOMAIN/ waits for its DNS: bpmn https)"
    else echo "http://$(address)/   (no domain: bpmn domain <name> [email])"; fi
    curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:$PORT/login" && echo "answering" || echo "!!! not answering on port $PORT: bpmn logs"
}

monitor() {     # a live view, every 3 seconds, until Ctrl+C
    trap 'tput cnorm 2>/dev/null; exit 0' INT
    tput civis 2>/dev/null
    while true; do
        clear
        echo "bpmn monitor  $(date '+%F %T')   (Ctrl+C to stop)"; echo
        status; echo
        top -b -n 1 | sed -n '1,5p'; echo
        ps -o pid,pcpu,pmem,rss,etime,cmd -C node,mongod --sort=-pcpu | cut -c1-110 | head -6; echo
        echo "--- the last lines of its log"
        journalctl -u "$SERVICE" -n 12 --no-pager -o cat | cut -c1-150
        sleep 3
    done
}

https_now() {   # a certificate for DOMAIN once it points here; then the cookies are Secure
    [ -n "${DOMAIN:-}" ] || { echo "no domain: bpmn domain <name> [email]"; return 1; }
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        echo "https://$DOMAIN/ has its certificate (renewed by certbot's own timer)"
        systemctl disable --now bpmn-https.timer >/dev/null 2>&1 || true
        return 0
    fi
    local here there
    here=$(address); there=$(getent ahostsv4 "$DOMAIN" | awk 'NR==1 { print $1 }')
    if [ "$here" != "$there" ]; then
        echo "$DOMAIN points at '${there:-nothing}', not this server ($here): add a DNS A record $DOMAIN -> $here"
        echo "(tried again every 5 minutes until it does)"
        return 0
    fi
    command -v certbot >/dev/null || DEBIAN_FRONTEND=noninteractive apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
    local contact="--register-unsafely-without-email"
    [ -n "${EMAIL:-}" ] && contact="-m $EMAIL"
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos $contact --redirect || return 1
    envset SECURE_COOKIES true
    systemctl restart "$SERVICE"
    systemctl disable --now bpmn-https.timer >/dev/null 2>&1 || true
    echo "https://$DOMAIN/ is ready"
}

domain() {      # bpmn domain <name> [email]
    local name=${1:-} email=${2:-${EMAIL:-}}
    [[ "$name" =~ ^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]] || { echo "usage: bpmn domain <name> [email]   e.g. bpmn domain bpmn.example.com you@example.com"; return 1; }
    conf DOMAIN "$name"; conf EMAIL "$email"; DOMAIN=$name; EMAIL=$email
    sed -i "0,/server_name .*;/s//server_name $name;/" "/etc/nginx/sites-available/$SERVICE"
    nginx -t -q && systemctl reload nginx
    if ! command -v certbot >/dev/null; then
        echo "installing certbot (Let's Encrypt)..."
        DEBIAN_FRONTEND=noninteractive apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
    fi
    cat > /etc/systemd/system/bpmn-https.service <<EOF
[Unit]
Description=HTTPS for the bpmn-server site once its domain points here
[Service]
Type=oneshot
ExecStart=/usr/local/bin/bpmn https
EOF
    cat > /etc/systemd/system/bpmn-https.timer <<EOF
[Unit]
Description=Try HTTPS for the bpmn-server site every 5 minutes until it works
[Timer]
OnBootSec=1min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
EOF
    systemctl daemon-reload
    https_now
    [ -d "/etc/letsencrypt/live/$name" ] || systemctl enable --now bpmn-https.timer >/dev/null 2>&1
}

access() {      # bpmn access <user>
    local user=${1:-${SUDO_USER:-}}
    id "$user" >/dev/null 2>&1 || { echo "usage: bpmn access <user>"; return 1; }
    usermod -aG "$APP_USER" "$user"
    echo "$user may edit $APP_DIR from its next sign-in (or now: newgrp $APP_USER)"
}

update() {      # bpmn update: the newest bpmn-server and bpmn-web, then a restart
    runuser -u "$APP_USER" -- env HOME="$HOME_DIR" bash -c "cd '$APP_DIR' && npm update bpmn-server bpmn-web" || return 1
    runuser -u "$APP_USER" -- env HOME="$HOME_DIR" bash -c "cd '$APP_DIR' && npm ls bpmn-server bpmn-web --depth=0" | tail -n +2
    systemctl restart "$SERVICE" && echo "restarted"
}

case "${1:-help}" in
    status) status ;;
    logs) shift; if [ $# -gt 0 ]; then journalctl -u "$SERVICE" --no-pager "$@"; else journalctl -u "$SERVICE" -f; fi ;;
    monitor) monitor ;;
    restart|stop|start) systemctl "$1" "$SERVICE" && echo "$1: done" ;;
    update) update ;;
    password) cat "$HOME_DIR/admin-password.txt" 2>/dev/null || echo "no password file: it was changed or never made" ;;
    domain) shift; domain "$@" ;;
    https) https_now ;;
    access) shift; access "$@" ;;
    env) ${EDITOR:-nano} "$APP_DIR/.env" && systemctl restart "$SERVICE" ;;
    cli) shift; runuser -u "$APP_USER" -- env HOME="$HOME_DIR" bash -c 'cd "$0" && npm run --silent cli -- "$@"' "$APP_DIR" "$@" ;;
    *) cat <<EOF
bpmn: the bpmn-server application in $APP_DIR (the service $SERVICE)

  bpmn status                   the app, MongoDB and nginx; its address
  bpmn logs                     its log, live (Ctrl+C); bpmn logs -n 200, bpmn logs --since "1 hour ago", bpmn logs -p err
  bpmn monitor                  a live view: status, CPU and memory, the last log lines
  bpmn restart | stop | start
  bpmn update                   the newest bpmn-server and bpmn-web, then a restart
  bpmn env                      edit its .env, then a restart
  bpmn cli [command ...]        its console (npm run cli); with a command, just that: bpmn cli cod asana
  bpmn domain <name> [email]    the site's domain name, and HTTPS for it once its DNS points here
  bpmn https                    HTTPS now (or why not yet)
  bpmn access <user>            let a user edit the application's files (the group $APP_USER)
  bpmn password                 the first admin password (until it is changed)
EOF
    ;;
esac
BPMN
chmod 755 /usr/local/bin/bpmn

# ---- the domain, and HTTPS for it as soon as it points here
if [ -n "$DOMAIN" ]; then
    /usr/local/bin/bpmn domain "$DOMAIN" "$EMAIL" || echo "HTTPS is not set yet: bpmn https tries again"
fi

# ---- ready when the application answers

for _ in $(seq 90); do
    if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/login" 2>/dev/null; then
        address=$(curl -fsS --max-time 5 https://checkip.amazonaws.com 2>/dev/null | tr -d '[:space:]' || true)
        address=${address:-$(hostname -I | awk '{ print $1 }')}
        echo
        echo "=== bpmn-server is ready: http://$address/${DOMAIN:+  (https://$DOMAIN/ once $DOMAIN points at $address)}"
        echo "    sign in as admin, $(cat "$CREDENTIALS")   (change it: your profile, top right)"
        echo "    the application: $APP_DIR${ACCESS_USER:+ (editor $ACCESS_USER in group $APP_USER; re-login or newgrp $APP_USER)}"
        echo "    bpmn status | logs | monitor | restart | update | domain <name> [email]   (bpmn help)"
        date -u +%FT%TZ > "$HOME_DIR/INSTALLED"
        exit 0
    fi
    sleep 2
done
echo "=== the application does not answer on port $PORT: journalctl -u $SERVICE"
exit 1
