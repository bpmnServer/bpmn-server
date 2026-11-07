# __NAME__

A workflow application on [bpmn-server](https://bpmnserver.github.io/bpmn-server/) and bpmn-web.

## Run

```sh
__RUN__
```

__SIGNIN__

## What is where

| | |
|---|---|
| `processes/` | Your BPMN models. Edit them in the browser (Models) or any BPMN editor. |
| `src/appDelegate.ts` | Your services (what service tasks call) and engine events. |
| `src/config.ts` | bpmn-server settings that replace bpmn-web's defaults. |
| `src/index.ts` | Starts bpmn-web: the APIs, the web pages, or both. |
| `.env` | The database, the port and the generated keys. Not committed. |

`npm run verify` checks the models in `processes/`. `npm run cli` opens the console: start processes,
list and complete tasks, check locks, recover hung items, list users and set passwords (`spw`).

## The REST API

Callers send `API_KEY` from `.env` (`x-api-key` header). From Node, use bpmn-client:

```js
import { BPMNClient } from 'bpmn-client';
const client = new BPMNClient('localhost', __PORT__, process.env.API_KEY);
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
