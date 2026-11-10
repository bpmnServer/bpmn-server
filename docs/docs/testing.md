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
`apps/testSampleApp/test/custom/`. `apps/testSampleApp/examples/` has more, one feature each (a sub-process loop, an
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
| `@start process:<p> [at element:<e>] [only] as :i` | Starts an instance, with the table as its start data. `only` runs that element by itself. `... is refused`: holds when it can not start (a listener or script throws, the engine refuses) |
| `@find element:<e> [in :i] as :x`, `@find item ...` | Finds one item, filtered by the table |
| `@invoke :x`, `@invoke [first] element:<e> [key "K"] in :i [as :x] [no wait]` | Completes an item with the table as its data. `... is refused`: holds when it can not be done (the user may not take it) |
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
  And @check :order has 0 items of element:approve-order with status "wait" for me
  And @check :order last element:approve-order status is "wait"
  And @check :result output.approvalStatus is "Approved"
  And @check :result rules is 1
```

A table's values are read as JSON too: `true` is a boolean, `5` a number, anything else text.

A path reads into what the scenario holds: `status`, `data.total`, or deeper, `data.notification.to`. A value is
JSON (`5`, `true`, `"text"`, `{ "a": 1 }`), a word (read as text), or `${...}`, an expression. `is` (or `=`) is equal:
numbers as numbers (`5` and `"5"`), an object field by field (the fields given), the rest exactly; `is not` (`<>`) is
not equal; `>`, `<`, `>=`, `<=` compare as numbers when both are numbers, else as text.

### Users and roles

`user:mary @login with role of "Manager"` makes the steps after it act as `mary`, in the one group `Manager`. Her
`@find` and `@invoke` see only the items she may take: hers (assignee), or offered to her (candidate users) or to
`Manager` (candidate groups, a lane's group among them). One she may not take is not found (`found 0 items`): a test
checks the model's assignment this way, as the end-user pages do. To check it outright, `has ... items ... for me`
counts only the items the current user may take: `has 0 items of element:Approve with status "wait" for me`, as an
employee, says they can not approve; `@invoke element:Approve in :leave is refused` says it outright. `user:mary @login` without a role acts as `mary`
with no such limit.

```gherkin
When user:emp1 @login with role of "Employee"
  And @start process:"employee-leave" as :leave
  And @invoke element:Submit in :leave
  And user:mgr1 @login with role of "Manager"
  And @invoke element:Approve in :leave
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

Each run is a real instance, its id starting with `test-`, which can be opened on the instance page. An older `<model>.tests.json` in the models folder is converted to a `.feature` file when the server starts.

## Tests in TypeScript

`testApp()` starts your application in memory: your settings, your app delegate and services, bpmn-web's
configuration, an in-memory store instead of MongoDB, and no timers. It is a small file in the bpmn-server
repository, `apps/testSampleApp/test/support/testApp.ts`: copy it into your application's `test/support/` and adjust
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

## Debugging

### In VS Code

The repository's `.vscode/launch.json` has two configurations:

| | |
|---|---|
| **testSampleApp: dev (debug)** | The application, from the TypeScript sources of bpmn-server and bpmn-web (`npm run dev`); it restarts when one of them changes, and the debugger attaches again. |
| **Test: current file** | The open test file (`*.test.ts`, `*.test.mjs`). It runs on the packages' builds: run `npm run build` first; their source maps put breakpoints set in `packages/*/src` in place. |

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
