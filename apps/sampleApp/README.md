# sampleApp

A workflow application on [bpmn-server](https://bpmnserver.github.io/bpmn-server/) and bpmn-web, with a few sample
models, the services they call and the application delegate. `npx bpmn-server init` creates an application
from it.

## Run

```sh
docker compose up -d     # a MongoDB on this machine, if you do not have one
npm run setup            # the database's indexes
npm start                # http://localhost:3000 (PORT in .env)
```

The first page asks for the administrator. It needs the setup token the server prints when it starts.

## What is where

| | |
|---|---|
| `processes/` | The models: Hello, Buy Used Car, Leave Application, employee-onboarding, Business Rules (with its decision table `loanApproval.dmn.xml`), GitHub repository (calls GitHub's REST API: add GitHub from the connectors catalog first). Edit them in the browser (Models) or any BPMN editor. |
| `connectors/appServices.ts` | The services service tasks call by name (`greet`, `echo`, `add`, ...). |
| `connectors/*.json` | Element templates the model editor offers for configured tasks. |
| `delegates/appDelegate.ts` | The application delegate (on bpmn-web's `WebAppDelegate`): the services, data objects (`loadDataObject`), engine events. |
| `settings/config.ts` | bpmn-server settings that replace bpmn-web's defaults. |
| `index.ts` | Starts bpmn-web with the above. |
| `.env` | The database, the port, the keys, what is served (`SERVE`). Not committed. |

`npm run verify` checks the models. `npm run cli` opens the console: start processes, list and complete tasks,
check locks, recover hung items, list users and set passwords (`spw`). `npm run dev` restarts on changes.

## The REST API

Callers send `API_KEY` from `.env` (`x-api-key` header). From Node, use bpmn-client:

```js
import { BPMNClient } from 'bpmn-client';
const client = new BPMNClient('localhost', 3000, process.env.API_KEY);
const { instance } = await client.engine.start('Hello', { name: 'Ada' });
```

## AI clients (MCP)

`bpmn-mcp` lets an AI client use this server: list models, start processes, complete tasks. `.mcp.json` registers it for
clients that read one, such as Claude Code, which asks you to approve it the first time. It reads `.env`, and the server has
to be running.

**It gets what the keys in `.env` allow, including deleting instances and replacing models.** Take `ADMIN_API_KEY` out of what
it reads, by pointing `BPMN_ENV_FILE` at a file of its own, to stop it changing models.

For other clients, see the [bpmn-mcp README](https://github.com/bpmnServer/bpmn-server/tree/main/packages/bpmn-mcp).

## Upgrading

`npm update bpmn-server bpmn-web bpmn-mcp` brings a new engine and web application; your files stay as they are.
