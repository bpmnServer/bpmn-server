# Build and publish BPMN Server

The published image is `ralphhanna/bpmn-server`. It packages matching releases of `bpmn-server` and `bpmn-web`.

## Build locally

Run from `docker/image`:

```sh
sh build.sh                 # latest published npm release
sh build.sh 3.5.2           # a specific npm release
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
docker image ls ralphhanna/bpmn-server
sh push.sh
```

On Windows use `push.cmd`.

Verify published metadata:

```sh
docker pull ralphhanna/bpmn-server:latest
docker image inspect ralphhanna/bpmn-server:latest --format '{{json .Config.Cmd}}'
```

Expected command: `["npm","start"]`. A normal build produces the host architecture only; use Buildx for additional platforms.
