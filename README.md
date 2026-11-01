# bpmnServer4

bpmn-server, its client, its web host, the documentation, the Docker images and the sample application,
in one repository.

| | |
|---|---|
| `packages/bpmn-server` | The workflow engine (npm `bpmn-server`), and `npx bpmn-server init`. |
| `packages/bpmn-client` | The REST client (npm `bpmn-client`). |
| `packages/bpmn-web` | The web host: tasks, instances, the model editor, administration, the REST APIs, `start()` (npm `bpmn-web`). |
| `testSampleApp` | The sample application (processes, connectors, delegates) on bpmn-web: the app to start and debug from, and the tests of bpmn-web and the engine's scenarios. |
| `docs` | The documentation site. |
| `docker` | Docker images. |
| `catalog` | The model catalog bpmn-web browses and imports from. |

## Start an application

```sh
npx bpmn-server init my-app      # asks for the database; --memory to try it without MongoDB
cd my-app
npm start                        # http://localhost:3000, sign in as admin / admin
```

`init` creates the application (settings, an app delegate, a sample model, `.env`) with bpmn-server and
bpmn-web as its dependencies; `bpmn-server init --help` lists its options. It ships with the next release of
bpmn-server (the published 3.2.0 does not have it yet).

```
my-app/
  package.json      deps: bpmn-server, bpmn-web; scripts: start, setup, cli, verify
  .env              generated keys, the database URL
  src/
    config.ts       only the settings you override; bpmn-web supplies the defaults
    appDelegate.ts  extends bpmn-web's WebAppDelegate (services, loadDataObject, ...)
    index.ts        start({ config, appDelegate, api, ui })
  processes/        your models
```

## Work on the source

```sh
git clone <repository URL> bpmnServer4
cd bpmnServer4
npm install                      # every package, linked to each other (npm workspaces)
npm run build                    # bpmn-server, bpmn-client, bpmn-web

cd testSampleApp
cp .env.example .env             # set MONGO_DB_URL
npm run setup                    # the database's indexes and the first user (admin / admin)
npm start                        # or npm run debug (Node inspector); npm start at the root runs it too
```

| Tests | |
|---|---|
| `npm test` (root) | bpmn-server, bpmn-client and testSampleApp |
| `npm test` (testSampleApp) | bpmn-web's unit, client, engine and web tests, and the engine's scenarios |
| `npm run test:ui` (testSampleApp) | the browser tests (Playwright) |
| `npm run test:scenarios` (testSampleApp) | the engine's feature scenarios alone |

The tests use databases of their own on a local MongoDB (`mongodb://localhost:27017`; `TEST_MONGO_URL` and
`BPMN_TEST_MONGO_URL` change it): bpmn-web's tests one per run, dropped when they end; the scenarios
`bpmn_scenarios`, emptied before each run.

Publishing: `npm publish -w bpmn-server` (or `-w bpmn-client`, `-w bpmn-web`) after `npm run build`.
