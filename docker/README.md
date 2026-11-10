# BPMN Server Docker installation

The distribution uses `bpmnserver/bpmn-server:latest`, replacing the earlier `ralphhanna/bpmn-server` and the obsolete `ralphhanna/bpmn-web` image names. It includes the server and its API/UI hosting application.

## Interactive setup (recommended)

Linux/macOS:

```sh
mkdir -p bpmn-server && cd bpmn-server
curl -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/docker-compose.yml
curl -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/setup.sh
sh setup.sh
```

The setup prompts for the **host port**, **database** (memory or persistent MongoDB), and **image** (published Docker Hub image or local build). It generates a private `.env` with secrets and remembers your choices. For a local image, it downloads editable `image/Dockerfile` and `image/docker-entrypoint.sh` along with a build override. Edit these files, then run the same Compose build command again. An existing `.env` is preserved on ordinary startup; `sh setup.sh --reconfigure` prompts again.

```sh
# Run the same mode again (after downloading up.sh)
curl -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/up.sh
sh up.sh
```

For Windows, download `docker-compose.yml` and `up.cmd` as described below, or use WSL to run the interactive `setup.sh`.

## Startup feedback and troubleshooting

`sh setup.sh` and `sh up.sh` now wait for an HTTP response after Docker reports the container started. They display either:

```text
Checking BPMN Server readiness at http://127.0.0.1:3000/login ...
READY: BPMN Server is responding (HTTP 200).
Open http://localhost:3000
```

or an error with the container status and recent application logs. Redirects and authentication responses can also count as HTTP readiness; this means the web endpoint responds, **not** that every workflow feature has passed a functional test. The check waits up to roughly 90 seconds, which may not be enough on a slow first memory-mode launch when MongoDB binaries are downloading.

For an existing installation, download the latest startup scripts:

```sh
curl -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/up.sh
curl -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/status.sh
sh up.sh
```

You can run the readiness check independently:

```sh
sh status.sh
```

For an installation using overlays, pass them to the check in the same order as Compose:

```sh
sh status.sh -f docker-compose.yml -f docker-compose.build.yml
```

If it fails, inspect `docker compose ps -a` and `docker compose logs --tail=100 server`. With memory mode, check for missing Linux libraries (such as `libcurl.so.4`) or MongoDB binary download failures. Use `sh up.sh` to apply the saved image/database mode. On Windows, `up.cmd` starts Compose without the readiness check; `.\owf.cmd status` shows the container and the HTTP status.

## Local .env

The file is next to `docker-compose.yml`. Edit it with `nano .env` or VS Code:

```dotenv
PORT=3000
MONGO_DB_URL=memory
BPMN_IMAGE=bpmnserver/bpmn-server:latest
REQUIRE_AUTHENTICATION=true
ENFORCE_SECURITY=true
API_SERVICE_USER_NAME=integration
API_SERVICE_USER_GROUPS=SYSTEM
API_KEY=...                 # generated secret
ADMIN_API_KEY=...           # generated secret
SESSION_SECRET=...          # generated secret
ADMIN_PASSWORD=...          # first admin user only
```

`env_file: .env` passes settings into the container. `PORT` sets the host-facing port only; the internal application port remains 3000. Changes to `.env` require recreating the container (not `docker compose restart`).

`MONGO_DB_URL=memory` needs no MongoDB container. It uses `mongodb-memory-server`, which downloads its MongoDB executable on first start and loses DB contents when the container stops. The image is Debian based for compatibility. Model files persist in the `processes` volume.

For persistent MongoDB, choose `mongo` during setup (or set `MONGO_DB_URL=mongodb://mongo:27017/bpmn` and use `docker-compose.mongo.yml`). The optional MongoDB service isn't exposed outside the Docker network.

## Docker `owf` management command

Docker installs have an analogous `owf` wrapper in the Docker directory (named `bpmn` before 3.7: `bpmn`, `bpmn.cmd` and `bpmn.ps1` still work until 4.0, and download `owf` the first time). It selects the same Compose overlays as your local `.env`, so you don't have to remember multiple `docker compose -f ...` arguments.

For a Git checkout, from `docker/`:

```sh
sh owf status
sh owf logs --tail=100
sh owf restart
sh owf env
sh owf cli
```

If you installed with downloaded scripts instead of cloning GitHub, fetch the wrapper:

```sh
curl -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/owf
curl -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/install-cli.sh
```

Optionally register a global command:

```sh
sudo sh install-cli.sh
```

The helper installs `owf` if that command is unused, or `owf-docker` if a native `owf` command already exists. It never overwrites the native command.

```text
$ sh owf
BPMN Server Docker management

  owf status              Container state and HTTP endpoint
  owf logs [options]      Follow server logs; --tail=100 for a snapshot
  owf monitor             Live container stats and recent logs
  owf start               Start the configured installation
  owf stop                Stop without deleting volumes
  owf restart             Recreate container to apply .env changes
  owf update              Pull or rebuild image, then recreate
  owf env                 Edit .env and optionally apply
  owf cli [arguments]     Application console in container
  owf password            Display initial admin password from .env
  owf setup               Interactive Docker setup
  owf help                This help
```

Native-only commands such as `domain`, `https`, and `access` are not offered in the Docker wrapper; configure reverse-proxy TLS and host permissions separately. In memory database mode, recreation erases account and workflow instance data, and a separate CLI process does not share the running in-memory MongoDB.

### Windows (PowerShell or cmd)

`owf.cmd` has the same commands, without WSL or Git Bash (it runs `owf.ps1`, so download both). In the installation folder:

```powershell
curl.exe -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/owf.cmd
curl.exe -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/owf.ps1
.\owf.cmd status
.\owf.cmd logs --tail=100
.\owf.cmd password
.\owf.cmd cli
```

In `cmd`, drop the `.\`: `owf status`. `owf.cmd setup` creates `.env` with random keys, as `up.cmd` does; `owf.cmd env` opens it in Notepad.

### The console (CLI)

The console runs inside the server container. Any of these opens it:

```sh
sh owf cli                                  # Linux, macOS, WSL
.\owf.cmd cli                               # Windows
docker compose exec server npm run cli       # anywhere, from the installation folder
```

A command after it runs just that and quits, e.g. `owf cli co` lists the connectors (with plain Compose: `docker compose exec server npm run cli -- co`). In memory mode the console is a separate process with its own empty database, so it does not see the running server's users or instances; use MongoDB for that.

For a shell inside the container: `sh it.sh`, or `it.cmd` on Windows (`docker compose exec server sh`).

## Commands

For a normal published memory installation:

```sh
docker compose up -d --force-recreate
docker compose ps -a
docker compose logs --tail=100 server
docker compose exec server npm run cli
docker compose down
```

For persistent MongoDB:

```sh
docker compose -f docker-compose.yml -f docker-compose.mongo.yml up -d
```

For a local build (from `docker/` with `image/` present):

```sh
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

For local build **and** bundled MongoDB, include both override files. A local build uses the selected version of *published npm packages*; changing package source in `packages/` requires a separate source-build workflow.

`docker compose config` can print secrets; redact before sharing. Do not use `docker compose down -v` unless you intend to remove stored data.

## Publish an image

See [image/README.md](image/README.md). The image must be built, tested, then pushed to Docker Hub. An image tag is not created automatically by changing a Compose file.

## Windows (without WSL)

```powershell
mkdir bpmn-server; cd bpmn-server
curl.exe -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/docker-compose.yml
curl.exe -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/up.cmd
.\up.cmd
```

This creates a local `.env` for memory mode with random secrets, then starts the published image. For an interactive installer use WSL, or edit `.env` and use the Compose overlays manually. To manage it afterwards (status, logs, password, the console), download `owf.cmd` and `owf.ps1`: see [Windows (PowerShell or cmd)](#windows-powershell-or-cmd).

Run the image through Compose, not with a plain `docker run` or Docker Desktop's Run button: without the settings in `.env` the server refuses to start (`MONGO_DB_URL is not set`).
