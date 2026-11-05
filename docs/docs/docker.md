# Docker images for bpmn-web

bpmn-web and MongoDB in two containers. The image `ralphhanna/bpmn-web` holds a release from npm.

## Install

Docker is all you need, and two files. On Linux or macOS:

```sh
mkdir bpmn-web && cd bpmn-web
curl -O https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/docker-compose.yml
curl -O https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/up.sh
sh up.sh
```

On Windows (PowerShell):

```powershell
mkdir bpmn-web; cd bpmn-web
curl.exe -O https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/docker-compose.yml
curl.exe -O https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/up.cmd
.\up.cmd
```

Open http://localhost:3000 and sign in as `admin`. The first start creates `.env` next to `docker-compose.yml`
with random keys and the password of `admin`, and prints the password. Keep the file.

## Docker operations

| Action | Command |
|---|---|
| Start | `sh up.sh` or `up.cmd` (or `docker compose up -d` once `.env` exists) |
| Stop | `docker compose down` |
| View logs | `docker compose logs -f` |
| Update to the latest image | `docker compose pull`, then start |
| Shell in the container | `docker compose exec bpmn-web sh` |
| Console (start processes, list tasks, set passwords) | `docker compose exec bpmn-web npm run cli` |

## Customize

- The containers: edit `docker-compose.yml`.
- The image: [docker/image](https://github.com/bpmnServer/bpmn-server/tree/main/docker/image) in this repository
  builds a release from npm.

More, and upgrading from the 2024 setup: the
[README](https://github.com/bpmnServer/bpmn-server/blob/main/docker/README.md).
