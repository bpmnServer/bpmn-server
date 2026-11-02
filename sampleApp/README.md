# sampleApp

A workflow application on [bpmn-server](https://bpmnserver.github.io/docs/) and bpmn-web, with a few sample
models, the services they call and the application delegate. `npx bpmn-server init` creates an application
from it.

## Run

```sh
docker compose up -d     # a MongoDB on this machine, if you do not have one
npm run setup            # the database's indexes and the first user (admin, password admin)
npm start                # http://localhost:3000 (PORT in .env)
```

Sign in as `admin`, password `admin`, and **change the password**.

## What is where

| | |
|---|---|
| `processes/` | The models: Hello, Buy Used Car, Leave Application, employee-onboarding, Business Rules (with its decision table `loanApproval.dmn.xml`). Edit them in the browser (Models) or any BPMN editor. |
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

## Upgrading

`npm update bpmn-server bpmn-web` brings a new engine and web application; your files stay as they are.
