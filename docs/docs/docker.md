# Docker installation

Install the BPMN Server distribution with Docker. The image name is `ralphhanna/bpmn-server` (the former `bpmn-web` image is obsolete).

## Guided installation (Linux/macOS/WSL)

```sh
mkdir -p bpmn-server && cd bpmn-server
curl -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/docker-compose.yml
curl -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/setup.sh
sh setup.sh
```

Setup asks for the **port**, the **database** (`memory` or persistent MongoDB), and the **image** (published or local build). It generates `.env` next to the Compose file with random credentials and preserves that file on repeated runs. To change choices, use `sh setup.sh --reconfigure`.

The **local build** option downloads editable image files into `./image/` and builds them. It uses the selected npm release of `bpmn-server` and `bpmn-web`; edits to the packages' source in GitHub are not automatically compiled into the image.

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

If it fails, inspect `docker compose ps -a` and `docker compose logs --tail=100 server`. With memory mode, check for missing Linux libraries (such as `libcurl.so.4`) or MongoDB binary download failures. Use `sh up.sh` to apply the saved image/database mode. On Windows, `up.cmd` starts Compose without the readiness check; `.\bpmn.cmd status` shows the container and the HTTP status.

## .env and database

```dotenv
PORT=3000
MONGO_DB_URL=memory
BPMN_IMAGE=ralphhanna/bpmn-server:latest
REQUIRE_AUTHENTICATION=true
ENFORCE_SECURITY=true
```

These are example settings; the generated file also includes API keys, the session secret and the initial admin password. Keep `.env` private. `env_file` passes the file to the container, while `PORT` controls its host mapping (the internal port is 3000). After edits, recreate the service rather than using `docker compose restart`.

Memory mode needs no MongoDB container, but loses users and workflow instances on restart. It uses `mongodb-memory-server`; the first start may need internet access to fetch a MongoDB binary. Model files persist in a Docker volume.

For persistent MongoDB, setup uses `docker-compose.mongo.yml` and sets `MONGO_DB_URL=mongodb://mongo:27017/bpmn`.

## Docker management command

The Docker distribution provides a `bpmn` command for the most common operations. In your installation directory, download the command once:

```sh
curl -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/bpmn
sh bpmn help
```

```text
bpmn status                 Container state, port and HTTP status
bpmn logs [options]         Follow logs or show a snapshot (--tail=100)
bpmn monitor                Live container stats and recent logs
bpmn start | stop | restart Start, stop, or recreate containers
bpmn update                 Pull or rebuild the configured image
bpmn env                    Edit local .env and optionally apply
bpmn cli [arguments]        Invoke the application console
bpmn password               Show the initial admin password
bpmn setup                  Configure the installation
```

For a global command, download `install-cli.sh` from the same folder and run `sudo sh install-cli.sh`. If native `bpmn` is already installed, the helper installs `bpmn-docker` instead. Native-only commands (`domain`, `https`, `access`) are managed outside Docker.

On Windows, `bpmn.cmd` has the same commands in PowerShell or `cmd`, without WSL. It runs `bpmn.ps1`, so download both:

```powershell
curl.exe -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/bpmn.cmd
curl.exe -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/bpmn.ps1
.\bpmn.cmd status
.\bpmn.cmd password
```

## The console (CLI)

The console runs inside the server container. From the installation folder:

```sh
sh bpmn cli                                  # Linux, macOS, WSL
.\bpmn.cmd cli                               # Windows
docker compose exec server npm run cli       # either, without the bpmn command
```

A command after it runs just that and quits: `bpmn cli co` lists the connectors, `bpmn cli lm` the models
(see [Advanced Topics](advanced.md)). In memory mode the console is a separate process with its own empty
database: it does not see the running server's users or instances. Use MongoDB for that.

For a shell inside the container: `docker compose exec server sh` (`it.sh`, or `it.cmd` on Windows).

Run the image through Compose, not with a plain `docker run` or Docker Desktop's Run button: without the
settings in `.env` the server refuses to start (`MONGO_DB_URL is not set`).

## Manage

In the default memory/published configuration:

```sh
docker compose up -d --force-recreate
docker compose ps -a
docker compose logs --tail=100 server
docker compose down
```

When using the MongoDB or local build overlays, include them with `-f docker-compose.yml -f docker-compose.mongo.yml` and/or `-f docker-compose.build.yml`, or run the mode-aware `up.sh` from the installation folder.

Do not use `docker compose down -v` if you want to preserve models or database volumes.

See the [detailed Docker README](https://github.com/bpmnServer/bpmn-server/blob/main/docker/README.md) for installation, configuration, and publishing instructions.
