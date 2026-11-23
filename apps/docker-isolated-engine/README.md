# Separated Docker deployment

This example uses `apps/hrdemo` as the application base and builds the BPMN
packages from this repository. It runs the HR demo's web/API host and workflow
engine in separate containers. The host keeps the public HTTP port; the engine
is reachable only on the private Compose network. MongoDB is shared by both
containers.

```text
client ──> host:3000 ──private──> engine:3001
                 └──────────────> mongo:27017
engine ─────────────────────────> mongo:27017
```

The engine receives the model directory read-only. Only the engine receives
`SECRETS_KEY`, so encrypted connector secrets remain an engine-side concern.
The host receives `HR_SERVICE_KEY` so it can configure the remote engine; the
engine stores and uses that connector key.
The example is intended to verify the process boundary and provide a starting
point for a production deployment; review the image, secrets, network policy,
and persistent-volume strategy before using it in production.

## Start

From this directory:

```sh
cp .env.example .env
docker compose up -d --build
docker compose ps
docker compose logs -f host engine
```

The HR demo is available at `http://localhost:3000/hr`. The engine port is not
published to the host. Its health check calls the engine endpoint from inside
the engine container, while the host waits for the engine and MongoDB to be
healthy.

The image already builds the local `bpmn-server`, `bpmn-client`, `bpmn-mcp`,
and `bpmn-web` packages before installing HRDemo. To tag or reuse it, set
`BPMN_IMAGE` in `.env`, for example:

```dotenv
BPMN_IMAGE=bpmnserver-hrdemo:dev
```

Stop the stack with `docker compose down`. Add `-v` only when you intend to
remove the MongoDB database and process volume.

## What this demonstrates

- `ENGINE_AT` makes the host use the remote engine service.
- The engine process is started from `apps/hrdemo/engine.ts`, without the web/API host.
- The model volume is mounted read-write by the host and read-only by the engine.
- HRDemo's connector points back to the host at `http://host:3000/api/hr`.
- MongoDB and the engine are internal services and are not exposed by Compose.

For the in-process default and the full Docker installation options, see the
[Docker documentation](../../docs/docs/docker.md).

## Performance comparison

The Linux comparison of native host + native MongoDB versus native host +
Docker engine is recorded in [benchmark-results.md](benchmark-results.md),
with raw measurements and diagrams in the same folder.
