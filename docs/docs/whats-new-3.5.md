# What's new in 3.5

bpmn-server 3.5 adds REST API connectors, SQLite storage, decisions (DMN) as the standard describes them, a new
model editor with tests for models and decisions, and `npx bpmn-server init` to start an application.

bpmn-server, bpmn-web and bpmn-client are now one repository,
[bpmnServer/bpmn-server](https://github.com/bpmnServer/bpmn-server), released together with the same version.

Upgrading from 3.2: see [What's new in 3.x](whats-new-3.md#upgrading-from-32-to-35) for what can change for a
model that ran on 3.2. The full lists are in the change logs of
[bpmn-server](https://github.com/bpmnServer/bpmn-server/blob/main/packages/bpmn-server/CHANGELOG.md) and
[bpmn-web](https://github.com/bpmnServer/bpmn-server/blob/main/packages/bpmn-web/CHANGELOG.md).

## Connectors: REST APIs without code

A service task can call a **connector** instead of a service: a REST API, described by an OpenAPI 3.0 or 3.1
document, that an administrator adds with its key. The model names `<connector>/<operation>` and maps inputs and
outputs; it never holds a URL or a credential.

- **Administration → Connectors:** add an API from a catalog or from its OpenAPI document; set its key (bearer,
  API key or basic), encrypted with `CONNECTORS_KEY`; choose the operations and the groups that may use it; test
  it; refresh its document. The console (`npm run cli`) has the same commands (`co`, `coa`, `cok`, …).
- **The model editor:** *Calls → Connector* opens a wizard: find the operation by a search, fill in its inputs
  (required ones from the data of the same name), tick the parts of the answer to keep.
- **At run time:** timeouts, retries for idempotent calls, and an HTTP error status raised as the BPMN error
  `HTTP_<status>` for a boundary error event to catch.
- **Checks:** a connector or operation the server does not have, a required input missing, a disabled connector.

See [Connectors](connectors.md).

## SQLite storage

`SqliteDocumentStore` keeps instances, models and everything else in one SQLite file, through Node's built-in
`node:sqlite` (Node 22.5 or later): no database server, for small installs, demos and desktop use. Several servers
can share the file.

```ts
import { SqliteDocumentStore } from 'bpmn-server';

const store = new SqliteDocumentStore('./bpmn.sqlite');
const configuration = new Configuration({ /* ... */ documentStore: () => store });
```

See [Setup, Storage](persistence.md). bpmn-web's dashboards and backup now go through the storage port, so they
work on MongoDB, SQLite and the in-memory store alike.

## Decisions (DMN)

Business rule tasks evaluate decisions as the DMN standard describes them: FEEL cells, every hit policy,
decision requirements diagrams and literal expressions; `camunda:decisionRef`, `camunda:resultVariable` and
`camunda:mapDecisionResult`.

- **A decision editor** (dmn-js) at `/model/decision/<name>`, opened from a business rule task.
- **Tests for decisions,** in the decision editor's Test tab: inputs, and checks on the outputs or on the rules
  matched.

**Changed:** when no rule matches, a single-hit table's result is `null` (it was `{}`), and a multi-hit table's
is `[]`. Columns are read by their input expression, not their label.

See [Decisions](decisions.md).

## The model editor

bpmn-web's editor is rebuilt on current bpmn-js, with a properties panel that offers what bpmn-server runs:

- **Fields with their meaning:** user assignment, forms, services and connectors, scripts on events, conditions,
  decisions, data objects, called models, element templates.
- **Code fields** for scripts, conditions and expressions: checked as you type, the way bpmn-server compiles them,
  and completing the model's data fields, `item`, `instance` and the application's services.
- **Problems:** bpmn-server's checks and bpmnlint's modeling rules, as the model is edited; clicking one opens
  its field. The team chooses the rules' levels.
- **Report:** the whole model as one printable document: its globals (messages, signals, errors, escalations),
  pools and lanes, and each process's elements in flow order with every setting.
- **Test:** scenarios for a model, run step by step, repeated, checked, simulated on the diagram and debugged.
- **History:** every save of a model kept; two versions compared by their report text (and what moved on the
  diagram); the history purged.

Models, their tests and their history are files in the models folder (`<model>.tests.json`, `.history/`), ready
for Git and backups: see [Where models, tests and history are kept](modeler.md#where-models-tests-and-history-are-kept).
Tests kept in the database before are moved to files when the server starts.

The **Design dashboard** shows every model's and decision's tests with their last result, and runs one model's,
or all of them.

See [Model editor](modeler.md).

## Applications: init and start()

- **`npx bpmn-server init [folder]`** creates a workflow application on bpmn-server and bpmn-web: sample models,
  services, element templates, an app delegate, `.env` with generated keys. `--memory` runs a MongoDB in the
  process, to try it without a database server; `--minimal` creates a one-model application.
- **`start({ config, appDelegate, ... })`** starts bpmn-web for an application. bpmn-web no longer bundles a
  sample application.
- **Dashboards:** tasks and processes for every user, the Design dashboard for designers, the Admin dashboard
  (instances, the server, locks, hung items, users, connectors, a backup).
- **One menu on every page:** Workbench, then Dashboard (My work; a drop-down with Design and Administration for
  designers and administrators); the editors show the same places in their header.
- **The console** (`npm run cli`): start processes, list and complete tasks, recover hung items, users,
  connectors.

See [Setup](setup.md).

## Public demos and guests

- `DEMO_MODE`: scripts run in a sandbox; timers, services and connectors do not run.
- `DISABLE_ADMIN`: no administration pages or `/admin` APIs; administer with the console.
- `GUEST_ACCESS`: visitors try the server without signing in, each with models of their own, kept for their
  browser and downloadable. Removed [in 3.6](whats-new-3.6.md): only signed-in users use a server.

See [Security, A public demo](security.md#a-public-demo).

## The engine

- **`${...}` expressions:** `${js}` as a whole value is an expression, like `$js`; a text with `${...}` parts
  has each filled in (`Order ${data.id}`, `PT${data.hours}H`).
- **Data objects:** a data object connected to an element is loaded by the application
  (`appDelegate.loadDataObject`) when the element runs, and kept in the instance data. See
  [Data objects](data-objects.md).
- **Restart with rewind:** `engine.restart(..., { rewind: true })` takes a running instance back to an earlier item.
- **Decisions in the log:** why each flow was taken or not, what a gateway waited for, which event won.
- **Scripts in the debugger:** each script and expression is named `bpmn:///<model>/<element>/<label>.js`, so a
  debugger stops at its breakpoints and an error's stack points at it. See [Testing and debugging](testing.md#debugging).
- `engine.start(..., { instanceId })` lets the caller name the instance.

### Timers

- A timer more than 24.8 days away is waited out in steps everywhere. **3.0 and earlier fire such timers at once,
  and a start timer starts an instance every millisecond: upgrade.**
- A repeating timer `R3/...` fires three times (it fired four).

## Checking models

[`verifyModel`](verify.md), `npx bpmn-server verify` and the editor's Problems tab also check:

- connector tasks: `connector-not-named`, `connector-unknown`, `connector-operation-unknown`,
  `connector-input-missing`, `connector-disabled`, and others (see [Connectors](connectors.md#checking-models));
- business rule tasks against the decision files: `decision-not-named`, `decision-not-found`,
  `decision-invalid`, `decision-result-not-saved`, `decision-input-from-data` (info);
- data objects: `data-object-not-loaded`, `no-data-object-loader`;
- `${...}` parts, JUEL operators (`expression-juel`), names an expression does not have
  (`expression-unknown-name`: `amount` is `data.amount`), and a `${` without its `}`;
- input and output parameters written like an expression without their `$`: `parameter-is-text`;
- multi-instance loop collections, which must compile as expressions;
- `appServices.<name>` in scripts and expressions against the application's services (`unknown-app-service`).

## Fixed

- Branches arriving at a parallel join together joined twice.
- A boundary timer firing while a long service task ran left `engine.start` waiting forever (#124).
- A signal reaching several boundary events in one instance was refused.
- Ad hoc sub-processes ended at once; their activities are now offered together.
- A user task whose form had no fields failed to load.
- `Definition.load()` starts over when called again (a second load listed each flow twice).

## bpmn-client

- `lm` (list models) works with the runtime key (`API_KEY`), also with administration off.
