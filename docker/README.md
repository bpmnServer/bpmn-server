# Docker images for bpmn-web

bpmn-web (the web application, model editor and REST APIs on bpmn-server) and MongoDB, in two containers.

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
with random values, and prints the password: `ADMIN_PASSWORD`, the password of `admin`, used when the first user is
made (change it later in your profile, or the console: `spw`); `API_KEY` (the REST API); `ADMIN_API_KEY` (model
administration through the API); and `SESSION_SECRET`. Keep it; bpmn-client and other callers need the keys.

## Docker operations

| Action | Command |
|---|---|
| Start | `up.cmd` / `sh up.sh` (or `docker compose up -d` once `.env` exists) |
| Stop | `docker compose down` |
| View logs | `docker compose logs -f` |
| Use another port | `PORT=3001` in `.env`, then start |
| Update to the latest image | `docker compose pull`, then start |
| Shell in the container | `docker compose exec bpmn-web sh` |
| Console (start processes, list tasks, set passwords) | `docker compose exec bpmn-web npm run cli` |

## Where the data is

- The database: the `database` Docker volume.
- The models (the `processes` folder): the `processes` Docker volume, filled from the image the first time.

The application itself is in the image, so a new image updates it.

MongoDB is not published to the host and has no password. To reach it from your machine (MongoDB Compass), add
`ports: ["27017:27017"]` to the `mongo` service, on a machine others can not reach.

## Customize

- The containers: `docker-compose.yml`. Any setting of bpmn-web's `INSTALL.env` can be added under
  `environment` (email, `SITE_NAME`, `HTTPS`, ...).
- The image: `image/Dockerfile`. It installs a release from npm, as `npx bpmn-server init` does: the sample
  application, on exactly that version of bpmn-server and bpmn-web. `BPMN_VERSION` picks the release (default:
  the latest):

```sh
cd image
sh build.sh             # the latest release, tagged with its version and latest (Windows: build.cmd)
sh build.sh 3.5.2       # that release, tagged with its version only
```

  To check which release an image holds:
  `docker compose exec bpmn-web npm ls bpmn-server bpmn-web`

## Upgrading from the 2024 setup

The 2024 setup came from the `bpmnServer/docker` repository, now retired, and kept everything in folders next to
`docker-compose.yml`. This one keeps it in Docker volumes, so it starts with an empty database until you bring your
data over. The old folders are only read, and stay as they are.

**Models.** The ones you edited are in `./bpmn_server_volume/bpmn-web/processes`. Copy the ones you need into the
new `processes` volume: `docker compose cp <file> bpmn-web:/app/processes/`.

**The database.** Copy it with a dump and a restore, not the folder: the old setup ran whichever `mongo` image was
the latest, and `mongo:8.0` may not open its files. With the old containers stopped, in the old folder:

```sh
docker run -d --name old-mongo -v "$PWD/mongodb_volume:/data/db" mongo
docker exec old-mongo mongodump --db bpmn --archive=/tmp/bpmn.archive
docker cp old-mongo:/tmp/bpmn.archive .
docker rm -f old-mongo
```

Then, where the new `docker-compose.yml` is, with `bpmn.archive` copied there:

```sh
docker compose cp bpmn.archive mongo:/tmp/bpmn.archive
docker compose exec mongo mongorestore --drop --archive=/tmp/bpmn.archive
docker compose restart bpmn-web
```

In Git Bash on Windows, run these with `MSYS_NO_PATHCONV=1` set: it otherwise rewrites `/tmp` and `/data/db` into
Windows paths.

Sign in with your old users and passwords: the first user is only made when there are none, so `ADMIN_PASSWORD`
does not apply.
