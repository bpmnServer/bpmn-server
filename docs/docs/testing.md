# Testing and debugging models

A model is ready when it passes three kinds of checks:

1. **It loads**: [`bpmn-server verify`](verify.md) checks the XML, the structure, and that scripts and expressions
   compile, without running anything.
2. **It runs as intended**: a test starts it, completes its tasks with data and checks the path it took. Tests
   run in memory, on your application's own delegate and services, with no database and no waiting for timers.
3. **When it does not**: run the test, or the application, under a debugger, with breakpoints in your
   services, in bpmn-server, and in the model's own scripts.

The examples below come from `testSampleApp` in the [bpmnServer/bpmn-server](https://github.com/bpmnServer/bpmn-server) repository: its tests are in
`testSampleApp/test/custom/`. `testSampleApp/examples/` has more, one feature each (a sub-process loop, an
event-based gateway, a multi-instance vote, an escalation, a restart), written to be read and run.

## Tests in TypeScript

`testApp()` starts your application in memory: your settings, your app delegate and services, bpmn-web's
configuration, an in-memory store instead of MongoDB, and no timers. It is a small file in the bpmn-server
repository, `testSampleApp/test/support/testApp.ts`: copy it into your application's `test/support/` and adjust
its two imports (your settings and your delegate).

```ts
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp, type TestApp } from '../support/testApp.js';

let app: TestApp;
before(async () => { app = await testApp(); });
after(async () => { await app.stop(); });

test('the requester requests, and an approved request is processed', async () => {
    const run = await app.start('Leave Application', {}, 'ann');
    assert.equal(run.item('Request').assignee, 'ann');

    await run.complete('Request', { days: 3 });
    await run.complete('Approve', { approval: 'Approved' });

    assert.ok(run.item('Activity_1rx1txe'), 'Process ran');
    assert.equal(run.status, 'end');
});
```

Run it with Node's test runner, through tsx:

```sh
node --import tsx --test test/custom/*.test.ts
```

### The app and the run

| | |
|---|---|
| `testApp(options)` | Starts the application. `options.services`: services that replace yours, by name (a stub for an external service); `options.models`: another models folder; `options.quiet`: silence the engine's console output. |
| `app.start(model, data, user, startNodeId)` | Starts an instance; returns its run. |
| `app.message(name, data)` | Sends a message: to the instance waiting for it, else starting the model whose start event it is. |
| `app.stop()` | Shuts the server down. |
| `run.complete(elementId, data, user)` | Completes a waiting element with data. Fails, naming what is waiting, when it is not. |
| `run.message(name, data)`, `run.signal(name, data)` | Sends a message or a signal to this instance. |
| `run.waiting()` | The ids of the waiting elements: user tasks, receive tasks, catching and boundary events. |
| `run.item(elementId)`, `run.items(elementId)` | An element's latest item, or all of them in the order they ran. |
| `run.data`, `run.status`, `run.instance` | The instance's data, status, and the whole instance. |
| `run.log()` | The engine's log of the instance: what ran, and why each gateway went the way it did. |

**Timers** are not waited for. A waiting timer, like any waiting event, is completed with `run.complete`: a
reminder on a task is tested without waiting for it. (A timer that falls due while the test runs, a few seconds,
still fires on its own.)

```ts
await run.complete('timer-event');                       // the reminder fires now
assert.ok(run.waiting().includes('Approve'), 'Approve is still waiting');
```

**Stubs** replace a service for one test app; the others are your own:

```ts
const calls = [];
app = await testApp({
    services: {
        async service1(input) { calls.push(input); return { seq: 7, text: 'from the stub' }; },
    },
});
```

## Scenario files

A scenario can also be written as data, in the format the model editor's **Test** tab uses: the Test tab saves a
model's scenarios in this format, beside the model (`<model>.tests.json` in the models folder). A file holds one
scenario with its model, or a model's list of them:

```json
{
  "model": "Buy Used Car",
  "scenarios": [
    {
      "name": "buy, no repairs",
      "start": { "data": { "caseId": 1 } },
      "steps": [
        { "element": "task_Buy", "data": { "needsCleaning": "No", "needsRepairs": "No" } },
        { "element": "task_Drive" }
      ],
      "checks": [
        { "at": "end", "kind": "status", "status": "end" },
        { "at": "after", "step": "task_Buy", "kind": "data", "path": "needsRepairs", "op": "=", "value": "No" },
        { "kind": "node", "node": "task_repair", "count": 0 }
      ]
    }
  ]
}
```

| | |
|---|---|
| `start` | `data` the instance starts with; `startNodeId` picks one of several start events, or a task, with `"only": true`, to run by itself (the run ends once it is done). |
| `steps` | In order, each a waiting `element` (by id) to complete, with its `data`. The data decides the branches a gateway takes; the order decides which of several waiting elements happens first (an event-based gateway's events, a boundary timer, parallel tasks). |
| `checks` | Each at the end (`"at": "end"`, the default), at the start (`"at": "start"`, once the process has started) or after a step (`"at": "after"`, `"step"`: its element). `status`: the instance's status. `node`: an element ran (`count` times, optionally in a `status`). `data`: a value at `path` (`a.b.c`) compared with `op` (`=`, `<>`, `>`, `<`, `>=`, `<=`) to `value`. |

`testSampleApp/test/custom/scenarios.test.ts` runs every `*.json` file of its folder as tests, on `testApp()`,
with bpmn-web's `runScenario` (exported by bpmn-web from the release after 3.1). A failure says what went wrong:

```text
✖ broken.json: wrong on purpose
  A step could not be done
  step 2 (task_repair): task_repair is not waiting; waiting: task_Drive
  check failed: data.needsRepairs is "Yes" (actual "No")
```

The Test tab keeps its scenarios in the application's database (the `wf_test_scenarios` collection), one set per
model, and runs them on the running server: each run is a real instance, its id starting with `test-`, which can
be opened on the instance page. Scenario files are the same format, kept with your code and run anywhere.

## Debugging

### In VS Code

The repository's `.vscode/launch.json` has three configurations:

| | |
|---|---|
| **testSampleApp: dev (debug)** | The application, from the TypeScript sources of bpmn-server and bpmn-web (`npm run dev`); it restarts when one of them changes, and the debugger attaches again. |
| **Test: current file** | The open test file (`*.test.ts`, `*.test.mjs`). It runs on the packages' builds: run `npm run build` first; their source maps put breakpoints set in `packages/*/src` in place. |
| **Scenarios: current file** | The open scenario file (`*.json`). |

Breakpoints work in the test, in your services and delegate, and in bpmn-server and bpmn-web.

Without VS Code: `npm run dev:debug` in testSampleApp, then `chrome://inspect` in Chrome or Edge, or any debugger
on port 9229.

### A model's scripts and expressions

Scripts (script tasks, listeners) and expressions (conditions, assignments, collections) are compiled under
names that say where they are:

```text
bpmn:///<model>/<element>/<label>.js        e.g.  bpmn:///Buy Used Car/task_Buy/start.js
```

The label is a listener's event (`start`, `end`, ...), `script` for a script task, `condition`, an assignment's
attribute (`assignee`, `dueDate`, ...) or `collection`; a process's own scripts are under `process`. Lines are
numbered from the script's own first line.

- The debugger lists them by these names under **Loaded Scripts**.
- `debugger;` in a script stops there while a debugger is attached.
- An error in one names that place in its stack: `at bpmn:///Buy%20Used%20Car/task_Buy/script.js:2:7`.

A failing script fails the call that ran it (`engine.start`, `run.complete`, ...) with the script's own
error, whose stack names this location.
