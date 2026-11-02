bpmn-client
===========

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)

This is a light-weight package to allow remote access to [bpmn-server](https://github.com/bpmnServer/bpmn-server)

# Installation

In the application that calls bpmn-server (a new folder, or an existing Node.js project):

```sh
npm init -y && npm pkg set type=module      # a new project; skip in an existing one
npm install bpmn-client
npx bpmn-client-setup                       # writes .env: API_KEY, HOST, PORT
```

Set `.env` to the server: `API_KEY` is the server's (from its `.env`; `ADMIN_API_KEY` too, for model
administration), `HOST` and `PORT` where it runs. Then:

```sh
npx bpmn-client-cli                         # a console on the server: start processes, list and invoke items
```

A complete example application: [bpmn-client-sample](https://github.com/bpmnServer/bpmn-client-sample).

### to update to latest release

```
$ npm update bpmn-client
```

# Usage

```js
import { BPMNClient2 } from 'bpmn-client';

// apiKey: the server's API_KEY; adminApiKey (optional): its ADMIN_API_KEY, for model administration
const client = new BPMNClient2('localhost', 3000, process.env.API_KEY, { adminApiKey: process.env.ADMIN_API_KEY });

const instance = await client.engine.start('Buy Used Car', { caseId: 1001 });
const items = await client.data.findItems({ id: instance.id, 'items.status': 'wait' });
await client.engine.invoke({ id: instance.id, 'items.elementId': 'task_Buy' }, { needsRepairs: 'Yes' });

const models = await client.model.list();          // /admin/api2, with the admin key
```

`BPMNClient` is the client of the legacy `/api` (its `definitions` and `datastore.deleteInstances`
go to `/admin/api` with the admin key).

### Errors

Every call rejects when it fails, with the server's message:

- an HTTP error: `"<status> <message>"`, e.g. `401 missing or invalid "x-api-key"` (`error.status` holds the status);
- a failure the server reports in its answer (`{ errors }` or `{ error }`), e.g. `No process definition named X`;
- a web page instead of the API (wrong host, port or path);
- the connection error when the server can not be reached (e.g. `ECONNREFUSED`).

### Permissions

The API key stands for one service account on the server (`API_SERVICE_USER_NAME`/`_GROUPS`):
messages, signals and raw `data.find` need its `SYSTEM` group; deleting instances and model
administration need `ADMIN`.

# Tests

```sh
npm test                 # build, unit tests, contract tests
npm run test:unit        # what each method sends and how answers and failures come back (no server)
npm run test:contract    # every method against a real bpmn-web (BPMN_WEB_DIR, default ../bpmn-web, built;
                         # uses bpmn-web's test harness and a MongoDB of its own; skipped without it)
npm run test:live        # the older scenarios against a running server (localhost:3000, key 12345)
```

