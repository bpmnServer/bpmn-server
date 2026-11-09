# Docker deployment on an existing AWS Lightsail Ubuntu server

If you **already created the Lightsail instance**, use the Docker scripts below instead of `deploy/install.sh`. That older installer sets up a **non-Docker** Node.js + MongoDB + nginx installation; do not run both on the same host unless you deliberately plan port/resource allocation.

## 1. Install Docker once

SSH to your Lightsail Ubuntu 22.04/24.04 instance and run:

```bash
curl -fsSLo /tmp/bpmn-install-docker.sh https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/docker/install-docker.sh
less /tmp/bpmn-install-docker.sh
sudo bash /tmp/bpmn-install-docker.sh
```

## 2. Deploy one client

```bash
curl -fsSLo /tmp/bpmn-deploy-client.sh https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/docker/deploy-client.sh
less /tmp/bpmn-deploy-client.sh
sudo bash /tmp/bpmn-deploy-client.sh acme 3101
```

This uses the existing `ralphhanna/bpmn-server` image referenced in `docker/docker-compose.yml` plus a private MongoDB container. The script pulls the image and runs it; it **does not build a client-customized image**. Pass a reviewed/pinned custom image as the third argument when you have one:

```bash
sudo bash /tmp/bpmn-deploy-client.sh acme 3101 registry.example.com/client-bpmn:v1
```

Each client has its own Compose project, persistent `mongodb` and `processes` volumes, MongoDB not published externally, and random `API_KEY`, `ADMIN_API_KEY`, and `SESSION_SECRET` in `/opt/bpmn-clients/<client>/.env` (root-readable). The HTTP port is bound to **127.0.0.1 only**. Configure nginx/Caddy on the host to reverse-proxy each client's hostname to its local port, enable HTTPS, and open only 80/443 in Lightsail. This script deliberately does **not** create DNS records or TLS certificates.

For example: `acme.trial.omniworkflow.com → 127.0.0.1:3101`, `beta.trial.omniworkflow.com → 127.0.0.1:3102`.

**Important:** the existing Docker image may initialize a default `admin` account/password. Verify the running image and immediately set a strong admin password via its supported management interface before exposing it. This script does not automate administrator provisioning. Also, the current image is built from the older `bpmn-web` repository; validate compatibility with the current monorepo and pin a known-good image tag/digest before production use. Docker containers alone are **not** a secure sandbox for arbitrary untrusted customer JavaScript.

### MongoDB fails on kernel 6.19+ (SERVER-121912)

MongoDB 8 can refuse to start on Linux 6.19 through 7.0.13 due to a TCMalloc/rseq compatibility issue. The deployment script now configures the MongoDB container with `GLIBC_TUNABLES=glibc.pthread.rseq=1` as a temporary workaround. On an already deployed client, download the updated `deploy/docker/deploy-client.sh` and rerun it with the **same** client and port; it preserves the named volumes and secrets and recreates the unhealthy container. The long-term remedy is an OS/kernel version incorporating the fix. See [MongoDB production notes](https://www.mongodb.com/docs/manual/administration/production-notes/) and [SERVER-121912](https://jira.mongodb.org/browse/SERVER-121912).

### Operations

```bash
cd /opt/bpmn-clients/acme
sudo docker compose ps
sudo docker compose logs -f web
sudo docker compose stop
sudo docker compose start
sudo docker compose pull && sudo docker compose up -d
```

Re-running `deploy-client.sh` with the same client and port preserves stored data and secrets. Do not use `docker compose down -v` unless you intend to delete the client's database and models. For a 4 GB Lightsail host, **one MongoDB container per client is expensive**; measure `docker stats` and use fewer simultaneously running tenants, or design an authenticated shared MongoDB service with separate tenant credentials.

---

# Installing on a server

[`install.sh`](install.sh) installs bpmn-server on a new Linux server (Ubuntu 22.04 or 24.04), ready to use:

- Node.js 22 and MongoDB 8;
- the application `npx bpmn-server init` makes, with its sample models, in `/opt/bpmn/my-app`;
- run as a service (`bpmn-my-app`), restarted if it stops and when the server starts;
- behind nginx on port 80; with a domain, HTTPS from Let's Encrypt as soon as the domain points at the server;
- an `admin` user with a generated password, shown at the end (and kept in `/opt/bpmn/admin-password.txt`,
  readable by root only).

A 2 GB server is enough for a start (MongoDB and Node.js together need more than 1 GB).

## One line, on the server

Create the server (any provider), open ports 80 and 443 (22 for SSH), sign in to it, and run:

```sh
curl -fsSL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/install.sh | sudo bash
```

With a domain (point its DNS A record at the server, before or after):

```sh
curl -fsSL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/install.sh | sudo bash -s -- --domain bpmn.example.com --email you@example.com
```

It takes 5 to 10 minutes and ends with the address and the admin password:

```
=== bpmn-server is ready: http://203.0.113.10/
    sign in as admin, admin password: q8Zr2...   (change it: your profile, top right)
```

## Or as a launch script, when the server is made

Cloud providers run a script you give them on the server's first start. Paste the whole of
[`install.sh`](install.sh), and set what you want in its settings at the top (`DOMAIN=`, `EMAIL=`, ...):

- **AWS Lightsail:** Create instance, pick Linux and Ubuntu 24.04, **Add launch script**, paste; pick the size
  (2 GB). After it is made: Networking, attach a static IP, and add HTTPS (443) to the firewall.
- **AWS EC2:** Advanced details, User data. **DigitalOcean:** Advanced options, Add initialization scripts.

The install runs in the background; it is done when `http://<the server's address>/` shows the sign-in page.
The admin password is on the server: `sudo cat /opt/bpmn/admin-password.txt`.

## Options

| Option | Setting | |
|---|---|---|
| `--domain <name>` | `DOMAIN` | the site's name, for HTTPS once its DNS points at the server |
| `--email <address>` | `EMAIL` | where Let's Encrypt sends notices about the certificate |
| `--admin-password <password>` | `ADMIN_PASSWORD` | the admin's first password; default: generated |
| `--app <name>` | `APP_NAME` | the application's folder (`/opt/bpmn/<name>`) and database; default `my-app` |
| `--version <version>` | `BPMN_VERSION` | the bpmn-server version whose `init` makes the application; default `latest` |
| `--port <port>` | `PORT` | the application's own port, behind nginx; default `3000` |
| `--dir <path>` | `BPMN_DIR` | where the application's folder is made; default `/opt/bpmn` |
| `--access <user>` | `ACCESS_USER` | who may edit its files; default: the user running `sudo`, else `ubuntu`; `none`: nobody |
| `--mode development\|production` | `INSTALL_MODE` | native service mode; defaults to production |
| `--interactive` / `--yes` | | show or skip setup prompts |

Run it again at any time: what is there is kept (the application, its data, its `.env`, the admin password),
and the packages, the service and nginx are set up as above.

## On the server, afterwards: the `bpmn` command

The install adds a `bpmn` command for the everyday work (it asks for `sudo` itself where it needs it):

| | |
|---|---|
| `bpmn status` | the app, MongoDB and nginx running or not, since when, its memory, its address |
| `bpmn logs` | its log, live (Ctrl+C to stop); `bpmn logs -n 200`, `bpmn logs --since "1 hour ago"`, `bpmn logs -p err` |
| `bpmn monitor` | a live view every 3 seconds: status, CPU and memory, the processes, the last log lines |
| `bpmn restart`, `stop`, `start` | the service |
| `bpmn update` | the newest bpmn-server and bpmn-web, then a restart |
| `bpmn env` | edit its `.env`, then a restart |
| `bpmn cli [command ...]` | its console; with a command and its answers, just that, e.g. `bpmn cli co` (the connectors), `bpmn cli cod asana` (delete one) |
| `bpmn domain <name> [email]` | the site's domain name, and HTTPS for it (below) |
| `bpmn https` | HTTPS now, or why not yet |
| `bpmn access <user>` | let another user edit the application's files |
| `bpmn password` | the first admin password, as long as it was not changed |

They are systemd's own commands underneath (`systemctl status bpmn-my-app`, `journalctl -u bpmn-my-app -f`,
`systemctl restart bpmn-my-app`): no pm2. systemd restarts the app if it stops and starts it with the server, after
MongoDB; the journal keeps and rotates the logs.

| Where | |
|---|---|
| The application | `/opt/bpmn/my-app`: its models in `processes/`, its settings in `.env` |
| The install log | `sudo less /var/log/bpmn-install.log` |
| The `bpmn` command's settings | `/etc/bpmn.conf` |
| MongoDB, nginx | `journalctl -u mongod`, `sudo tail -f /var/log/nginx/error.log` |
| The console | `cd /opt/bpmn/my-app && sudo -u bpmn npm run cli` |

### Development versus production

The native installer supports `--mode development` or `--mode production` (default). The interactive installer prompts for the mode. Production deployments enforce authentication and application security. Development mode retains the project's `.env` authentication choices and runs the service with `NODE_ENV=development`; nginx binds only to `127.0.0.1:80`.

For a local test machine:

```sh
sudo bash install.sh --interactive
# Choose mode: development
```

For a noninteractive local install, pass `--mode development --yes`. Lightsail launch scripts continue to default to production. If the app is already installed, do not rerun the installer solely to change the mode; override `NODE_ENV` in its systemd unit:

```sh
sudo systemctl edit bpmn-my-app
# Add:
# [Service]
# Environment=NODE_ENV=development
sudo systemctl daemon-reload
sudo systemctl restart bpmn-my-app
```

`REQUIRE_AUTHENTICATION=false` can be used for trusted local development only. Note that the application might still listen directly on port 3000, even when nginx is loopback-only; use a firewall or bind the app to localhost to prevent network exposure. Development mode must not be used on publicly accessible hosts.

### Interactive native installation and folder access

For a local installation, download the script and run it with Bash:

```sh
curl -fLo install.sh https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/install.sh
sudo bash install.sh --interactive
```

The installer prompts for application name, version, port, directory, access user, and optional domain/email. Use `--yes` for unattended installs. It creates or reuses the `bpmn` group, adds the selected user, sets application directory group access, and checks read/write permissions. Existing installations are preserved.

After installation, **log out and back in** to refresh your group membership, or run `newgrp bpmn` as your regular user. Verify access:

```sh
id -nG
ls -ld /opt/bpmn /opt/bpmn/my-app
cd /opt/bpmn/my-app
```

If a previous installation did not grant access, run `sudo bpmn access "$USER"` and log in again. The password file `/opt/bpmn/admin-password.txt` remains root-only.

### Who may edit its files

The application runs as its own user, `bpmn`, not root and not you: a break-in through the app reaches its files
only. Its files belong to the group `bpmn` too, and the user who ran the install (with `sudo`, or `ubuntu` on a cloud
image) is put in that group: you edit the models and `.env` as yourself, without `sudo`. It takes effect from your
next sign-in (or now: `newgrp bpmn`).

```sh
bpmn access alice        # another user, the same way (sudo usermod -aG bpmn alice)
```

### A domain name and HTTPS

1. At your domain's DNS, add an **A record**: the name (`bpmn.example.com`) → the server's address (`bpmn status`
   shows it; on Lightsail, attach a static IP first, or the address changes when the instance stops).
2. Open port **443**: on Lightsail, the instance's Networking tab, add HTTPS.
3. On the server:

   ```sh
   bpmn domain bpmn.example.com you@example.com
   ```

It gets a certificate from Let's Encrypt (certbot) as soon as the name points at the server, checking every 5
minutes until it does, then sends http to https and marks the app's cookies Secure. certbot renews the certificate
by itself. `bpmn https` says where it stands. The same with `--domain` and `--email` at install.

### Keeping the models in Git

Git is installed. The models are files in `processes/` (with their tests, `*.tests.json`); the history (`.history/`)
and the test runs (`.runs/`) are best left out:

```sh
cd /opt/bpmn/my-app/processes
git init && printf '.history/
.runs/
' > .gitignore
git add . && git commit -m "the models"
git remote add origin git@github.com:you/models.git && git push -u origin main
```

Or the other way, models kept in a repository elsewhere: clone it into `processes/` before the first start, or pull
into it and restart (`git pull && bpmn restart`).

### A firewall on the server

Cloud firewalls (Lightsail's Networking tab, EC2 security groups) are set outside the server. On the server itself,
the install opens 80 and 443 in ufw when ufw is on, and in iptables when its rules reject them (as on Oracle Cloud's
Ubuntu images).

## AWS Lightsail from your computer

[`lightsail/create-lightsail.sh`](lightsail/create-lightsail.sh) does all of the above with the AWS CLI: it
creates the instance with `install.sh` as its launch script, attaches a static IP, opens ports 22, 80 and 443,
waits until the application answers, and prints the address and the admin password. On Windows,
[`create-lightsail.cmd`](lightsail/create-lightsail.cmd) runs it with Git for Windows' bash.

```sh
./deploy/lightsail/create-lightsail.sh                                  # the 2 GB size, the CLI's region
./deploy/lightsail/create-lightsail.sh --domain bpmn.example.com --email you@example.com
./deploy/lightsail/create-lightsail.sh --bundle medium_3_0 --region eu-west-2
./deploy/lightsail/create-lightsail.sh --access ubuntu                    # editable /opt/bpmn/my-app
./deploy/lightsail/create-lightsail.sh --delete                         # the instance and its static IP
```

It needs the [AWS CLI](https://aws.amazon.com/cli/), signed in (`aws configure`). Lightsail bills the instance
monthly; `--delete` stops it.

### Lightsail file access

The Lightsail launcher now passes `ACCESS_USER=ubuntu` by default to the remote native installer. It adds that user to group `bpmn`, checks access to `/opt/bpmn/my-app`, and preserves the system service account `bpmn` as owner. Use `--access <username>` for a different existing Linux account, or `--access none` to disable user access. It does not create that Linux account.

After connecting through Lightsail SSH, reconnect or run `newgrp bpmn` to pick up the new group membership. Then `cd /opt/bpmn/my-app` should work without `sudo`.

For an **existing** Lightsail server, changing `create-lightsail.sh` doesn't retroactively change its permissions. On the instance run:

```sh
sudo bpmn access ubuntu
newgrp bpmn
cd /opt/bpmn/my-app
```

Use the instance's actual login name instead of `ubuntu` if different. Cloud launch scripts remain noninteractive so instance creation cannot hang waiting for input.
