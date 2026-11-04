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

Run it again at any time: what is there is kept (the application, its data, its `.env`, the admin password),
and the packages, the service and nginx are set up as above.

## On the server, afterwards

| | |
|---|---|
| The application | `/opt/bpmn/my-app`: its models in `processes/`, its settings in `.env` (run by the user `bpmn`) |
| The service | `sudo systemctl restart bpmn-my-app`, `journalctl -u bpmn-my-app -f` |
| The install log | `sudo less /var/log/bpmn-install.log` |
| HTTPS | waits for the domain: `systemctl status bpmn-https.timer` (tries every 5 minutes); then the app's cookies are Secure |
| The console | `cd /opt/bpmn/my-app && sudo -u bpmn npm run cli` |

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
