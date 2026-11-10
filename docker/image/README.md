# Build and publish BPMN Server

The published image is `bpmnserver/bpmn-server`. It packages matching releases of `bpmn-server` and `bpmn-web`.

## Build locally

Run from `docker/image`:

```sh
sh build.sh                 # latest published npm release
sh build.sh 3.6.0           # a specific npm release (tagged latest too when it is npm's latest)
node test.mjs               # test before publishing
```

Windows: use `build.cmd`. See `../README.md` for an interactive install that can download image sources and build them locally.

Or clone the repository, edit `docker/image/Dockerfile` and `docker/image/docker-entrypoint.sh`, and from `docker/` run:

```sh
sh setup.sh                 # choose "local" when prompted
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
```

This rebuilds the Dockerfile using **npm-published packages**, not edits to `packages/` in the Git checkout. The base image uses Debian for MongoDB Memory Server compatibility. Memory mode needs internet access to download its MongoDB executable on first start.

## Publish yourself

After testing:

```sh
docker login
docker image ls bpmnserver/bpmn-server
sh push.sh                   # npm's latest, as built (or: sh push.sh 3.6.0); latest too when it is the same image
```

On Windows use `push.cmd`.

Verify published metadata:

```sh
docker pull bpmnserver/bpmn-server:latest
docker image inspect bpmnserver/bpmn-server:latest --format '{{json .Config.Cmd}}'
```

Expected command: `["npm","start"]`. A normal build produces the host architecture only; use Buildx for additional platforms.
