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
./deploy/lightsail/create-lightsail.sh --delete                         # the instance and its static IP
```

It needs the [AWS CLI](https://aws.amazon.com/cli/), signed in (`aws configure`). Lightsail bills the instance
monthly; `--delete` stops it.
