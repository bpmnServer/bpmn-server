# Execute from Node.js

The same leave request, from a script: start it as `user1`, fill in the request, and approve it as `manager1`. The script runs the engine itself, in its own process, on the same database as your application: this needs MongoDB or SQLite, not `--memory`.

## The script

In your application's folder, create `leave.ts`:

```ts
import { BPMNServer, BPMNAPI, SecureUser, Logger } from 'bpmn-server';
import { webConfiguration } from 'bpmn-web';
import { config } from './settings/config.js';
import { AppDelegate } from './delegates/appDelegate.js';

// the application's own engine, with its settings and services; no timers here, the running server has them
const server = await BPMNServer.create(webConfiguration(config(), AppDelegate), new Logger({ toConsole: false }), { cron: false });
const api = new BPMNAPI(server);

// a script signs nobody in: it says who it acts for
const user1 = new SecureUser({ userName: 'user1', userGroups: ['Employee'] });
const manager1 = new SecureUser({ userName: 'manager1', userGroups: ['Employee', 'Manager'] });

let response = await api.engine.start('Leave Application', {}, user1);
const id = response.instance.id;
console.log('started', id, response.instance.status);

response = await api.engine.invoke({ id, 'items.elementId': 'Request', 'items.status': 'wait' },
    { LeaveType: 'Vacation', StartDate: '2026-12-01', EndDate: '2026-12-05', RequestReason: 'Holidays' }, user1);

response = await api.engine.invoke({ id, 'items.elementId': 'Approve', 'items.status': 'wait' }, { approval: 'A' }, manager1);
console.log('after approval:', response.instance.status);
for (const item of response.instance.items)
    console.log('  ', item.seq, item.elementId, item.status, item.assignee ?? '');

await server.shutdown();
```

## Run it

```sh
npx tsx --env-file=.env leave.ts
```

`--env-file` gives it your application's `.env`: its database and its settings. It prints the instance, `end` after the approval, and each step with who it was assigned to. The instance is in the Workbench too, as if people had done it in the browser.

## What it shows

- `api.engine.start` and `api.engine.invoke` are what the web pages call. A query, such as `{ id, 'items.elementId': 'Approve' }`, finds the waiting task to complete.
- Each call says who it acts for, and with `ENFORCE_SECURITY=true` the same rules apply: as `user1`, the `Approve` call would be refused.
- The engine is yours here: you create it and shut it down. That is [Embedding the engine](../embedding.md), and the API is in [Engine API](../api-summary.md).

One of the walkthroughs after the [tutorials](start.md): next, [Integrate an existing application](tutorial-integrate.md).
