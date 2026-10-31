# __NAME__

A workflow application on [bpmn-server](https://bpmnserver.github.io/docs/) and bpmn-web.

## Run

```sh
docker compose up -d     # a MongoDB, if you do not have one (MONGO_DB_URL in .env)
npm run setup            # once: the database's indexes and the first user
npm start                # http://localhost:__PORT__
```

Sign in as `admin`, password `admin`, and **change the password**.

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

## Upgrading

`npm update bpmn-server bpmn-web` brings a new engine and web application; your files stay as they are.
