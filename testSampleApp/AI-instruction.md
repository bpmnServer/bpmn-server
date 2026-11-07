# Instructions for AI coding agents: testSampleApp

You are working in `testSampleApp`, a workflow application on bpmn-server (the engine) and bpmn-web (the web
host). A request usually means changing a BPMN model **and** the code it calls. Edit the XML and the
TypeScript directly; check every change with the commands below before you report it as done.

## The application

| Path | What it is |
|---|---|
| `processes/<Name>.bpmn` | The models. The file name is the model's name (`engine.start('Buy Used Car')`). |
| `processes/<Name>.svg` | A model's diagram preview. It is **not** regenerated from the XML when you edit the XML. |
| `connectors/appServices.ts` | `AppServices`: the services service tasks call (`echo`, `add`, `webService`, ...). |
| `connectors/*.json` | Element templates (Camunda 7 format) the model editor offers for configured tasks. |
| `delegates/appDelegate.ts` | `AppDelegate` (extends bpmn-web's `WebAppDelegate`): returns `AppServices`, loads data objects (`loadDataObject`), engine events. |
| `delegates/ApprovalManager.ts`, `ApprovalRules.ts`, `appUtils.ts` | Logic the services and scripts use. |
| `settings/config.ts` | bpmn-server settings that replace bpmn-web's defaults (the models folder). |
| `index.ts` | Starts bpmn-web with the above (`npm start`). |
| `test/` | Tests of bpmn-web and of the engine. All the models are in `processes/`. The tests run on them, so a change to a model there can fail a test: a web test server starts with a few of them (`FIXTURE_MODELS` in `test/support/webApp.mjs`), the engine scenarios use them directly, and a model named `*-engine-test` is theirs alone. |
| `.env` | Database URL and keys. **Never read, print or change it.** |

The packages themselves are `../packages/bpmn-server` and `../packages/bpmn-web`. Change them only when the
request is about the engine or the web host, not to make an application change work.

## BPMN that bpmn-server runs

Declare `xmlns:camunda="http://camunda.org/schema/1.0/bpmn"` on `bpmn:definitions`. Keep the existing element
ids; give new elements stable, descriptive ids.

**Service tasks** name a method of `AppServices`:

```xml
<bpmn:serviceTask id="checkBackground" name="Check background" camunda:delegateExpression="checkBackground">
  <bpmn:extensionElements><camunda:inputOutput>
    <camunda:inputParameter name="applicant">${data.applicant}</camunda:inputParameter>
    <camunda:outputParameter name="backgroundOk">$output.ok</camunda:outputParameter>
  </camunda:inputOutput></bpmn:extensionElements>
</bpmn:serviceTask>
```

- `camunda:delegateExpression` or `implementation` names the method; dots walk objects (`claims.verify`).
  The method is called as `async name(input, context)`: `input` holds the input parameters,
  `context.item` is the running item (`context.item.data` the instance data). Its return value is the item's
  output.
- An input parameter without a leading `$` and without `${...}` is plain text. An output parameter's value
  is always run as JavaScript.

**User tasks**: `camunda:assignee`, `camunda:candidateUsers`, `camunda:candidateGroups`, `camunda:dueDate`,
`camunda:followUpDate`, `camunda:priority`: a literal, a comma-separated list, or an expression. The form is
`<camunda:formData>` with `<camunda:formField id="approved" label="Approved?" type="boolean" />` (types
`string`, `long`, `boolean`, `date`, `enum` with `<camunda:value id="" name="" />`); submitted values are
merged into the instance data. A user task waits until it is invoked.

**Expressions** are JavaScript, not Camunda's JUEL:

| Written as | Read as |
|---|---|
| `$js`, `$(js)`, `${js}` as the whole value | the expression's value (`${data.amount > 1000}`) |
| a text with `${...}` parts | the text with each part filled in (`Order ${data.id}`, `${data.region}-managers`) |
| anything else | the text as written |

They see `data`, `item`, `instance`, `input`, `output`, `appServices`, `appUtils`, `appDelegate`: process
variables are `data.amount`, never a bare `amount`. Write `===`, `&&`, `||`, `!`, not `eq`, `and`, `or`,
`not`, `empty`.

**Scripts** (script tasks, `<camunda:executionListener event="start|end|...">`) are JavaScript statements
with the same variables. Do not declare `data`, `item`, `instance`, `input`, `output`, `appServices`,
`appDelegate` or `appUtils` (`let data = ...` does not compile), and do not `await`. Return
`{ bpmnError: 'Code' }` or `{ escalation: 'Code' }` to raise one.

**Gateways**: every outgoing flow of an exclusive or inclusive split has a `conditionExpression` or is the
gateway's `default`; give each exclusive split a default flow. A parallel fork needs a parallel join.

**Events**: timers take ISO 8601 (`PT30M`, `P2D`, `R3/PT10H`), cron (`0 9 * * 1-5`) or an expression
(`PT${data.hours}H`). Messages and signals are matched by **name**: declare
`<bpmn:message id="Msg_Paid" name="PaymentConfirmed" />` under `bpmn:definitions` and reference it with
`messageRef`; a waiting catch resumes when the application calls `engine.throwMessage('PaymentConfirmed', ...)`.
Boundary events use `attachedToRef`; `cancelActivity="false"` makes one non-interrupting. A call activity
names another model in `processes/`: `calledElement="Model Name"`.

**Diagram**: every flow node needs a `bpmndi:BPMNShape` and every sequence flow a `bpmndi:BPMNEdge` with at
least two waypoints, placed without overlapping and with labels. When you change a model, **delete its
`.svg`**: bpmn-web then draws the preview from the XML instead of showing the old one.

The full reference: `c:\bp\github\bpmnServer-skills\references\engine-constructs.md` (the bpmn-create and
bpmn-validate skills).

## A new service or connector

1. Add the method to `AppServices` in `connectors/appServices.ts`: `async checkBackground(input, context) { ... }`.
   Read settings from `process.env` by name; never put a secret's value in code or a model.
2. Call it from the model (`camunda:delegateExpression="checkBackground"`).
3. To offer it in the model editor, add `connectors/<name>.json`, modelled on `connectors/echo.json`: a Hidden
   property bound to `camunda:delegateExpression`, one property per input bound to `camunda:inputParameter`.

A REST API with an OpenAPI document needs no service: an administrator adds it as a **connector**
(Administration, Connectors; or `coa` in `npm run cli`), and the model calls it with a `camunda:connector` naming
`<connector>/<operationId>`, with the connector's own input and output parameters. Never put its key in a model
or in code.

## Checks: run them, report their results

Build the packages once if `../packages/bpmn-web/dist` is missing: `npm run build` in the repository root.

1. **The model** (no database needed). Fix every error; fix warnings unless intended, and say why:

   ```sh
   npx bpmn-server verify "processes/<Name>.bpmn"
   ```

2. **A run of the model** through each path you changed, on the app's own delegate and services, in memory
   (no MongoDB, no timers). Add a test in `test/custom/`, either TypeScript with `testApp()`
   (`test/support/testApp.ts`; see `test/custom/leave-application.test.ts`):

   ```ts
   import { test, before, after } from 'node:test';
   import assert from 'node:assert/strict';
   import { testApp, type TestApp } from '../support/testApp.js';

   let app: TestApp;
   before(async () => { app = await testApp(); });       // testApp({ services: { name: stub } }) replaces a service
   after(async () => { await app.stop(); });

   test('Buy Used Car: bought, then driven', async () => {
       const run = await app.start('Buy Used Car', { caseId: 1 }, 'buyer');
       await run.complete('task_Buy', { needsCleaning: 'No', needsRepairs: 'No' });
       assert.deepEqual(run.waiting(), ['task_Drive']);
   });
   ```

   `run` also has `items(id)`, `item(id)`, `data`, `status`, `message(name, data)`, `signal(name, data)`,
   `log()`; `app.message(name, data)` starts a model by its message. A timer or boundary event is completed like a
   task (`run.complete('timer-event')`), without waiting for real time.

   Or a scenario file, `test/custom/<name>.json` (see `test/custom/buy-used-car.json`):
   `{ "model": "...", "scenarios": [ { "name", "start": { "data" }, "steps": [ { "element", "data" } ], "checks": [...] } ] }`.

   Run them: `npm run test:custom` (one file: `node --import tsx --test test/custom/<name>.test.ts`).

3. **Type check** what you changed in TypeScript: `npx tsc --noEmit -p .`

The other suites (`npm run test:web`, `test:ui`, `test:scenarios`) test bpmn-web and the engine and need a
local MongoDB; run them only when you changed the packages.

## When you are done

Report:

- the files changed, and for each model the elements added, changed or removed (by id);
- every service a model calls, every message or signal someone must send, every group or user a task is
  assigned to;
- the output of `bpmn-server verify` and of the tests you ran, with any warning left on purpose and why;
- what you could not check (real timer timing, external HTTP services).

Do not claim a model works without running it. Do not start the web app or change the database to test a
change: the in-memory test above is the way. A running app loads edited models when it is restarted.
