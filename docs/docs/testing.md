# Testing and debugging models

A model is ready when it passes three kinds of checks:

1. **It loads**: [`bpmn-server verify`](verify.md) checks the XML, the structure, and that scripts and expressions
   compile, without running anything.
2. **It runs as intended**: a test starts it, completes its tasks with data and checks the path it took. Write it
   [in Gherkin](#tests-in-gherkin), to run in the engine on a real server, or [in TypeScript](#tests-in-typescript),
   to run in memory with no database and no waiting for timers.
3. **When it does not**: run the test, or the application, under a debugger, with breakpoints in your
   services, in bpmn-server, and in the model's own scripts.

The examples below come from `testSampleApp` in the [bpmnServer/bpmn-server](https://github.com/bpmnServer/bpmn-server) repository: its tests are in
`testSampleApp/test/custom/`. `testSampleApp/examples/` has more, one feature each (a sub-process loop, an
event-based gateway, a multi-instance vote, an escalation, a restart), written to be read and run.

## Tests in Gherkin

A test is a scenario in a `.feature` file beside its model. It runs whole in the engine, on your real delegate and services, whether you start it from the model editor or the command line.

```gherkin
@feature:order-approval
Scenario: The manager approves one order line
  When user:Johnson @login with role of "HR-Manager"
    And @start process:order-approval as :order
    And @find element:approve-order in :order as :approval
      | item.status  | wait |
      | item.itemKey | 5001 |
    And @invoke :approval
      | approved | true   |
      | date     | ${now} |
  Then @check :order status is "end"
    And @check :approval status is "end"
```

An **element** belongs to the model and an **item** belongs to the instance, so a test finds an item before acting on it. With one waiting item, the short form does both: `@invoke element:approve-order in :order`.

### Files

| File | Holds | Shown in the Test tab |
|---|---|---|
| `<model>.feature` | A model's scenarios | Yes |
| `<decision>.dmn.feature` | A decision's tests | In the decision editor |
| `<model>.engine.feature` | Tests of the engine itself, run by `npm run test:scenarios` | No |

### How a step is written

A step is `[subject] @command [arguments] [as :name]`, followed by a table or a doc string if the command needs one.

| Written | Means |
|---|---|
| `@invoke` | A command |
| `process:order-approval` | Something named in the model or application |
| `:order` | Something this scenario holds, kept with `as :order` for the rest of the scenario |
| `"end"` | A literal string |
| `${now}` | A JavaScript expression. It can read `data`, `item`, `instance`, `context` and `now` |

### Commands

| Command | Does |
|---|---|
| `user:<name> @login [with role of "<role>"]` | Acts as that user |
| `@start process:<p> [at element:<e>] [only] as :i` | Starts an instance, with the table as its start data. `only` runs that element by itself |
| `@find element:<e> [in :i] as :x`, `@find item ...` | Finds one item, filtered by the table |
| `@invoke :x`, `@invoke [first] element:<e> [key "K"] in :i [as :x] [no wait]` | Completes an item with the table as its data |
| `@check <statement>` | Checks something now |
| `@wait <statement> [within N seconds\|minutes\|hours]` | Waits until the statement holds. The default limit is 30 seconds |
| `@stub service:<s> with`, `@stub timer:<t> with 5 seconds` | Replaces a service or a timer, for this scenario's instances only |
| `@evaluate decision:<d> as :result` | Evaluates a decision, with the table as its input |
| `@script` | Runs JavaScript from a doc string |
| `@assign :x`, `@restart :x`, `@startEvent element:<e> in :i [restart]` | Assigns an item, restarts at it, or starts at an event |

A step fails if `@invoke` or `@find` doesn't match exactly one item. Use `first` or a `key`, or add to the table, to pick one.

### Statements

`@check` and `@wait` take the same statements:

```gherkin
Then @check ${data.total > 100}
  And @check :order status is "end"
  And @check :order data.total > 100
  And @check :order passed element:approve-order 2 times with status "end"
  And @check :order has 3 items of element:approve-order with status "wait"
  And @check :order last element:approve-order status is "wait"
  And @check :result output.approvalStatus is "Approved"
  And @check :result rules is 1
```

### Stubs

A stub replaces a service or a timer for its own scenario's instances, and for the processes they call. Nothing outside a test can set one.

```gherkin
Given @stub service:credit-check with
  """javascript
  return { score: input.amount > 1000 ? 500 : 800 };
  """
  And @stub timer:wait-3-days with 5 seconds
When @start process:order-approval as :order
Then @wait :order status is "end"
```

| In a stub | Behaves |
|---|---|
| `input`, `data` | The task's mapped input (empty without a mapping) and the instance's data |
| `throw new Error(...)` | As a real service throwing: `camunda:exceptionsAsErrors` decides what happens |
| `return { bpmnError: "code" }` | As a real service returning a BPMN error |
| `fail("message")` | Always fails the scenario |

A stubbed service runs even with `SERVICE_TASKS=false`. A stubbed timer needs timers on.

### Tags

- `@feature:<id>` on a scenario or a `Feature:` says which feature it covers. `npm run features -- --check` reports one that names no feature.
- `@skip` keeps a scenario without running it.

### In the model editor

The [Test tab](modeler.md#testing-a-model) reads and writes `<model>.feature`. A scenario made of a start, steps and checks opens in its form. Anything else, such as a `@stub` or an expression, stays as written: you can run it and change it with **Edit as text**.

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

For tests in memory, a scenario can also be written as data, in `test/custom/<name>.json`. A file holds one scenario
with its model, or a model's list of them:

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

The Test tab's scenarios are `.feature` files instead, and they run on the running server: each run is a real instance,
its id starting with `test-`, which can be opened on the instance page. An older `<model>.tests.json` in the models
folder is converted to a `.feature` file when the server starts.

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
