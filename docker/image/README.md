# Building and publishing the image

For maintainers. `ralphhanna/bpmn-web` holds one release of bpmn-server and bpmn-web from npm, so publish the
packages to npm first. To only run the image, see the [README one folder up](../README.md).

You need Docker and Node.js, and for the push a Docker Hub login with rights on `ralphhanna/bpmn-web`. The commands
run in this folder; on Linux and macOS, use `sh build.sh` for `.\build.cmd`.

## 1. Build

```powershell
.\build.cmd             # the latest release on npm, tagged with its version and latest
.\build.cmd 3.5.2       # that release, tagged with its version only
```

## 2. Test

```powershell
node test.mjs                               # ralphhanna/bpmn-web:latest, as built here
node test.mjs ralphhanna/bpmn-web:3.5.2     # a tagged build
```

It checks the image, then runs it through `docker-compose.yml` and signs in. It uses a project and a port of its
own, so an installation on this machine is not touched, and removes what it made. It ends with the number of checks
passed; do not push unless all of them do.

| Checks | |
|---|---|
| The image | the expected release; no `.env`, so no shared keys; production mode; refuses to start without its secrets |
| The web pages | sign-in with `ADMIN_PASSWORD`, `admin`/`admin` refused, a model opens in the editor, administration pages, no pages without a sign-in |
| The API | refused without its key, lists the models with it |
| A restart | it comes back, adds no user, the password still works |
| The console | `npm run cli` runs |

It does not use a browser, so it does not show that the editor draws a model. To look for yourself:

```powershell
cd ..
.\up.cmd                # first run: prints the password of admin
```

Open http://localhost:3000, and stop it with `docker compose down`. Do not add `-v` where there is data to keep: it
deletes the database.

## 3. Push

Pushing makes the image public at once. First look at what will go up: `push.cmd` pushes every local tag of the
image, so this should list only the new version and `latest`.

```powershell
docker image ls ralphhanna/bpmn-web
docker login
.\push.cmd
```

## 4. Confirm

The version and `latest` show today's date at <https://hub.docker.com/r/ralphhanna/bpmn-web/tags>. Then test what
is really published:

```powershell
docker pull ralphhanna/bpmn-web:latest
node test.mjs
```

## ARM machines

`build.cmd` builds for your machine's platform, so from an x86 machine the image is `linux/amd64` only, and Apple
Silicon runs it under emulation, which is slower. For both, build and push in one step, after testing a normal
build:

```powershell
docker buildx build --platform linux/amd64,linux/arm64 --build-arg BPMN_VERSION=3.5.2 -t ralphhanna/bpmn-web:3.5.2 -t ralphhanna/bpmn-web:latest --push .
```
