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
