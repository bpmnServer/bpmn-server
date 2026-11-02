# What's new in 3.x

bpmn-server 3 is a modernized engine: an ES module on current Node.js and MongoDB drivers, embeddable in a larger
application, with a runtime API kept apart from model administration, a model checker, and a much faster step.

This page lists what changed since 2.3, and what to change when upgrading.
The full list is in the [change log](https://github.com/bpmnServer/bpmn-server/blob/main/packages/bpmn-server/CHANGELOG.md).

## Upgrading from 3.2 to 3.5

An application on bpmn-web 3.1 gets bpmn-server 3.5 on its next install (it accepts `^3.2.0`). Most models run
as before, so check a copy of your models first:

```sh
npx bpmn-server verify processes/
```

| | 3.2 | 3.5 |
|---|---|---|
| A text with `${...}` in it (an input parameter, an assignment, a timer) | kept as written | each `${...}` is evaluated: `Order ${data.id}` becomes `Order 7`. A Camunda-style bare name, `${id}`, now fails the run (`id is not defined`): write `${data.id}`. The check lists them as `expression-unknown-name`. |
| Decision table columns | read by their label | read by their input expression |
| A decision table with no matching rule | `{}` | `null` (single hit) or `[]` (multi hit) |
| A missing decision | the task failed on a file not found | the task stops with a message naming the decision |
| `item.userName` of a completed task | the user who created the item | the user who completed it |
| A failing script or expression | `new Error(...)` made from it | its own error (type, message), its stack naming `bpmn:///<model>/<element>/<label>.js:<line>` |
| The model check (`verify`, the editor's Problems) | | more checks: input parameters, `${...}` parts, JUEL operators, names an expression does not have, decisions, data objects, `appServices` references, parameters written without their `$`. Models that checked clean may now show issues. |

bpmn-web 3.5 no longer bundles a sample application: `npx bpmn-server init` creates one; bpmn-web's own
`npm start` runs on its defaults, and `ELEMENT_TEMPLATES_PATH` is not read (an application passes
`elementTemplatesPath` to `start()`).

The source moved: bpmn-server, bpmn-web and bpmn-client are one repository,
[bpmnServer/bpmn-server](https://github.com/bpmnServer/bpmn-server), its default branch `main`, the engine in
`packages/bpmn-server`. A `file:../bpmn-server` dependency on a clone of the repository now needs
`file:../bpmn-server/packages/bpmn-server`.

### Known issue in 3.5

An inclusive gateway that takes only one of its several outgoing flows (for example only its default flow)
stops the run with `this.currentNode.getOutbounds is not a function`. It is not new in 3.5 (3.2 does the same).
The `employee-onboarding` model of the sample application runs into it.

## Upgrading from 2.x

| | 2.x | 3.x |
|---|---|---|
| Node.js | 12 and later | **20 and later** |
| Module format | CommonJS (`require`) | **ES modules** (`import`) |
| MongoDB driver | 3.x | 7.x |
| Runtime API (`BPMNAPI`) | could change models | reads models; changing them needs `BPMNAdminAPI` |
| User on API calls | optional (a default user was used) | **required**: a principal your application trusts |
| Servers per Node.js process | one | several, each with its own engine, cache and timers |

### Import, don't require

```ts
import { BPMNServer, BPMNAPI, Configuration, Logger, SecureUser } from 'bpmn-server';
```

A CommonJS application can load it with `await import('bpmn-server')`.

### Wait for the server, and stop it

The constructor starts the server; `server.ready` settles when it has started (the application delegate's
`startUp`, then the timers). `BPMNServer.create` builds a server and waits for it:

```ts
const server = await BPMNServer.create(configuration, new Logger({ toConsole: false }));
// ...
await server.shutdown();   // refuses new calls, cancels its timers, lets running executions finish, closes connections
```

`BPMNServer.getInstance()` still works, but is deprecated: keep the server you created.

### Pass a user on every call

Every `api.engine` call takes the user it runs for. Your application authenticates the user and builds the
principal; the engine does not fall back to a default user.

```ts
const user = new SecureUser({ userName: 'jane', userGroups: ['Employee'], tenantId: 'acme' });
await api.engine.start('Leave Application', { days: 3 }, user);
```

Use `SystemUser` for system work (scheduled jobs, setup scripts). See [Security](security.md).

### Change models through the admin API

`BPMNAPI.model` reads: `get`, `list`, `findEvents`, `findStartEvents`, `getSource`, `load`, `verifyModel`.
Saving, deleting, renaming and exporting models is on `BPMNAdminAPI`:

```ts
import { BPMNAdminAPI } from 'bpmn-server';

const admin = new BPMNAdminAPI(server);
await admin.model.save('Leave Application', xml, svg, SystemUser);
```

Give the runtime API to the parts of your application that run processes (task lists, forms, integrations),
and the admin API only to deployment and model administration.

## New in 3.x

### Check a model before it runs (3.2)

`verifyModel` checks a model the way the engine loads and runs it, without running it: references,
structure, gateways, the diagram, scripts, conditions, timers, services and called processes.
It is also on the command line: `npx bpmn-server verify model.bpmn`. See [Checking models](verify.md).

### Speed and memory (3.2)

- A step no longer waits a fixed 10 ms (added in 2.3.3): a process runs about 10× faster.
- The logger no longer keeps every message in memory for the life of the server; it keeps them only when asked
  (`new Logger({ keepMessages: true })`) or when per-instance log files are written.
- Models share one BPMN type registry: loading a model takes a fraction of the time and memory.

| (expense process, in-memory store) | 3.1 | 3.2 |
|---|---|---|
| CPU per process | 21.6 ms | 9–14 ms |
| a waiting instance in the live-instance cache | 316 KB | 49 KB |

### Embedding: storage, locks, lifecycle (3.1)

- **Storage port.** Both data stores use one storage adapter: MongoDB by default, `MemoryDocumentStore` for tests
  and demos, or your own through the configuration's `documentStore`. See [Setup](setup.md#storage).
- **Lock port.** Instances are locked while they run (`locker`), with an owner (`serverId`) and a stale age
  (`locks.staleAfter`) after which another server takes over a lock its owner left.
- **Several servers per process,** each with its own engine, cache, listeners, timers and connections.
- **Timers belong to their server:** cancelled when it stops, claimed so only one server fires each, and re-read
  (`timers.pollInterval`) so another server fires the timers of a server that is gone.
- **Lifecycle:** `server.ready`, `BPMNServer.create`, `shutdown()`, and `server.onLifecycle(listener)` for
  subscribers.
- **`engine.cancel(query, user)`** ends an instance and keeps it.
- Errors reach the caller as themselves (`ItemNotWaitingError`, `ReentrantCallError`, `DuplicateKeyError`).

### Fixes worth knowing (3.1)

- A message goes to the instance waiting for it before it starts a new one.
- A called process that ends advances its caller before returning.
- `process.exception` listeners run after a failure, and lifecycle subscribers are notified.
- Timers more than 24.8 days away are waited out in steps by the scheduler. **Earlier releases fire them
  at once.**
