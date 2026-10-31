# Docker images for bpmn-web

bpmn-web (the web application, model editor and REST APIs on bpmn-server) and MongoDB, in two containers.

## Install

```sh
git clone https://github.com/bpmnServer/docker.git
cd docker
up.cmd          # Windows
sh up.sh        # Linux, macOS
```

Open http://localhost:3000 and sign in as `admin`, password `admin`. **Change the password** (your profile, or
the console: `spw`).

The first start creates `.env` next to `docker-compose.yml` with random keys: `API_KEY` (the REST API),
`ADMIN_API_KEY` (model administration through the API) and `SESSION_SECRET`. Keep it; bpmn-client and other
callers need the keys.

## Docker operations

| Action | Command |
|---|---|
| Start | `up.cmd` / `sh up.sh` (or `docker compose up -d` once `.env` exists) |
| Stop | `docker compose down` |
| View logs | `docker compose logs -f` |
| Update to the latest image | `docker compose pull`, then start |
| Shell in the container | `it.cmd` (Windows), `sh it.sh` (Linux) |
| Console (start processes, list tasks, set passwords) | `docker compose exec bpmn-web node --import tsx src/scripts/cli.ts` |

## Where the data is

- The database: `./mongodb_volume`.
- The models (the `processes` folder): the `processes` Docker volume, filled from the image the first time.

The application itself is in the image, so a new image updates it.

MongoDB is not published to the host and has no password. To reach it from your machine (MongoDB Compass), add
`ports: ["27017:27017"]` to the `mongo` service, on a machine others can not reach.

## Customize

- The containers: `docker-compose.yml`. Any setting of bpmn-web's `INSTALL.env` can be added under
  `environment` (email, `SITE_NAME`, `HTTPS`, ...).
- The image: `image/Dockerfile`. It builds bpmn-web's GitHub source; `BPMN_WEB_REF` picks a branch or tag:

```sh
cd image
docker build -t ralphhanna/bpmn-web .
docker build --build-arg BPMN_WEB_REF=<tag> -t ralphhanna/bpmn-web:<version> .
```

## Upgrading from the 2024 setup

The earlier `docker-compose.yml` kept the whole application in `./bpmn_server_volume`, so a new image never
replaced it. That folder is no longer used. Models you edited are in `./bpmn_server_volume/bpmn-web/processes`:
copy the ones you need into the new `processes` volume (`docker compose cp <file> bpmn-web:/app/processes/`).
The database in `./mongodb_volume` is used as before.
