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

# Usage: API v3 (bpmn-web 3.7 and later)

`BPMNClient3` is the client of [API v3](https://bpmnserver.github.io/bpmn-server/api-v3/): every call acts as one
user. The application's back end holds the service key; the client asks the server for each user's token with it,
keeps the token, and asks again before it expires.

```js
import { BPMNClient3, BPMNApiError } from 'bpmn-client';

const service = new BPMNClient3({ url: 'http://localhost:3000', apiKey: process.env.API_KEY });

// sam has signed in to the application, the application's way; their roles become the models' groups
const sam = service.as('sam', ['staff']);

const { items } = await sam.processes.startable();                 // what sam may start, with each start form
const { instance, task } = await sam.processes.start('leave-request', { requestedBy: 'sam' });
const withForm = await sam.tasks.get(task.id);                      // the task, its instance's data, its form
await sam.tasks.complete(task.id, { days: 6, reason: 'holiday' });

const mia = service.as('mia', ['manager']);
for await (const t of mia.tasks.each()) { /* every waiting task of mia's, page by page */ }

await service.signOut('sam');                                       // sam signed out: their tokens end
```

- **Credentials.** `{ apiKey }` acts as the server's service account; `as(userName, groups)` makes a client acting as
  that user (groups may not be `SYSTEM`, `ADMIN` or `DESIGNER`); `{ token }` uses a token the application got itself
  (a string, or a function giving one). The service key belongs on a server, never in a browser.
- **Calls**, by area: `me()`; `processes.startable/start`; `tasks.list/each/get/claim/complete`;
  `instances.list/each/get/rationale/startEvent/restart/delete`; `models.list/get/save/delete/rename/verify/element/
  feature/saveFeature/test`; `rules.evaluate`; `messages.throw`, `signals.throw`; `admin.users/addUser/deleteUser/
  setGroups/setPassword/settings/settingsSchema/check`; `tokens.issue/revoke`; and `call(method, path, { query, body })`
  for anything else. Their inputs and answers are the API's: [the API v3 reference](https://bpmnserver.github.io/bpmn-server/api-v3/).
- **Errors.** A refusal rejects with a `BPMNApiError`: `status`, `code` (`TASK_NOT_FOUND`, `NOT_STARTABLE`,
  `TOKEN_INVALID`, ...), `message`, `details`. A token the server no longer knows (revoked) is asked for again, once.

`BPMNClient2` and `BPMNClient` are the clients of `/api2` and `/api`, deprecated with them.
