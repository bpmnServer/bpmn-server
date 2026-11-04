# Model editor

bpmn-web's model editor is bpmn-js with a properties panel that offers what bpmn-server runs, checks the model
as it is edited, and runs it, step by step, before it is saved for real use.

Models are edited by users in the `DESIGNER` group and by administrators (`ADMIN`, `SYSTEM`). Designers list,
create, import, edit, check, save, rename and delete models; administration (users, resetting data) stays with
administrators.

## The properties panel

Each field is one bpmn-server reads, with what it means when the process runs:

- **User tasks:** assignee, candidate users and groups, due date, follow-up date, priority; a form key or form
  fields.
- **Service and send tasks:** **Calls** a service the application provides (listed from its services), with
  inputs and outputs; or a **connector**, a REST API the administrator added, set up in the connector wizard:
  the operation found by a search, its inputs, and the parts of the answer to keep. See [Connectors](connectors.md).
- **Script tasks, scripts on events, conditions, loop collections:** code fields that mark code that does not
  compile as you type, checked the way bpmn-server compiles it, and complete the names a script can use: the
  model's data fields, `item`, `instance`, and the application's services.
- **Scripts on events:** one list for the events bpmn-server fires (enter, start, wait, end, assign,
  validate, take, …).
- **Business rule tasks:** the decision (listed from the decision files), what it reads and gives, the result
  variable and the result mapping. See [Decisions](decisions.md).
- **Data objects:** the field the object fills in the instance data (`data.client`), and the elements that load
  it. See [Data objects](data-objects.md).
- **Call activities:** the model they start.
- **Templates:** configured tasks (a service task that calls a given service with its inputs, a user task for a
  given group), from the application's element templates (Camunda 7 template format).

Camunda engine settings bpmn-server does not run (asynchronous continuations, Java classes, external tasks,
field injection, …) are not offered. When a model has one, the panel still shows it, and Problems
says it has no effect.

## Problems

Under the diagram, the Problems tab lists what is wrong, as the model is edited:

- **bpmn-server's checks** ([`verifyModel`](verify.md)): structure, gateways, scripts, conditions, timers,
  services, connectors, called models, decisions, data objects.
- **Modeling rules** ([bpmnlint](https://github.com/bpmn-io/bpmnlint)): implicit splits, fake joins, superfluous
  gateways, duplicate flows, and others. Each finding names its rule, linked to the rule's documentation.

Clicking a problem selects its element and opens its field. Elements with problems are outlined and badged.

### Choosing the rules

A finding's **Turn off** button, or the **Rules** dialog under the diagram, sets a rule's level: off,
information, warning or error. The levels are the team's: they apply to every designer, and are saved in
`bpmnlint.json` in the models folder.

The same rules check a folder of models from the command line:

```sh
npm run lint:models [folder]
```

## Report

The Report tab is the whole model as one document, everything in it but the diagram's layout. An instance's
page shows the same report of its model (under **Model report**), and the History tab compares versions by it:

- **Globals:** the messages, signals, errors (with their codes) and escalations, each with the elements that
  throw, catch, send or receive it, or "not used".
- **Pools and lanes:** each pool with its process, each lane with the elements in it, and the message flows
  between pools.
- **Each process:** its settings, then its elements in flow order, each with its documentation, its settings as
  `key: value` lines (scripts in full) and its problems; nested under an element, its boundary events, a
  sub-process's elements and its outgoing flows with their conditions. Then the data objects and annotations.

A setting the report has no words of its own for (another tool's extension, a form field's validation) is still
there, as `key: value`. A business rule task shows its decision's table. Clicking an id selects the element on the
diagram. **Print** saves the report as a PDF.

The report is also what [History](#history) compares: as text, the model's problems and the decisions' tables
left out (they are not in the model file).

## Testing a model

The **Test** tab keeps test scenarios for the model and runs them:

1. **Start** starts the process with the scenario's start data, and shows what waits as the next steps: user
   tasks (**Execute**) and events (**Force**), each with its data.
2. Running a step shows what waits next, until nothing waits. The data chooses the branches; which step you run
   first chooses between elements that wait together (the events after an event-based gateway, a boundary
   timer, parallel tasks).
3. The steps you ran are saved as the scenario's. **Run** and **Run all** repeat them on a new instance without
   stopping, and check what the scenario expects at the end: the status, data values, and the elements passed
   and not passed.

Each scenario keeps its latest 20 runs with their instances. **Simulate** plays a run on the diagram: an element
turns blue when it starts and green when it ends, orange if it still waits, numbered in the order they started;
**Pause**, **Continue** and **Step** while it plays.

Test runs are ordinary instances whose ids start with `test-`: run tests on a development or test server.

The **Design dashboard** (`/dashboard/design`) shows each model's and decision's tests with the last run's result
(and why it failed), runs one model's or decision's tests, or **Run all tests**.

The scenarios are saved in the models folder, beside the model: `<model>.tests.json` (see below).

## History

Every save of a model is kept. The **History** tab lists the saved versions, newest first, with when and by whom
each was saved, and **Current**: the model in the editor, unsaved changes included. A save that changes nothing
adds no version; the first save of a model saved before there was a history keeps the file as it was first.

- **Compare:** tick two versions. The older is compared with the newer by their [report](#report) as text: the
  lines removed and added, each shown under the element and the process it is in. What the text does not hold,
  the diagram's layout, is listed apart: the elements **moved or resized**, each with what changed (moved,
  resized, path changed, label moved) and a flow by its two ends. Clicking one selects it on the diagram.
  Below, the newer version's diagram is marked: **+** added, **M** changed (amber) or only moved or resized
  (grey), and the removed elements drawn dashed in red, with **−**, where they were.
- **Purge history** deletes every saved version of the model. The model itself stays.

Renaming a model takes its history along; deleting a model deletes its history.

Each version is one file, `.history/<model>/0002.ann.bpmn`: its number, who saved it (when known), and the model as
saved; when it was saved and its size are the file's own. `MODEL_HISTORY=false` in `.env` (or `modelHistory:
false` in the configuration) keeps no versions and removes the History tab; versions already kept stay as they
are.

## Where models, tests and history are kept

Everything a designer makes is a file in the models folder, so it can be copied, kept in Git and backed up as a
folder:

```
processes/
  Leave Application.bpmn          the model
  Leave Application.svg           its diagram
  Leave Application.tests.json    its Test tab scenarios
  loan.dmn.xml                    a decision
  loan.dmn.tests.json             its tests
  bpmnlint.json                   the team's modeling rules
  .history/Leave Application/     every save of the model: 0001.bpmn, 0002.ann.bpmn (ann saved it), ...
  .runs/Leave Application.runs.json   the Test tab's runs (they point at instances of this server)
```

A `*.tests.json` file has the format of a [scenario file](testing.md#scenario-files). `.runs/` is best left out of
Git. Test sets kept in the database before 3.5 are moved to these files when the server starts.

## Decisions

`/model/decision/<name>` edits a decision file (`<name>.dmn.xml` in the models folder) with dmn-js: its decision
table, literal expressions, and the decision requirements diagram. A business rule task's **Open** button opens
its decision, or creates it when it is not there.

The decision editor has a **Test** tab, as models do: each test gives the decision's inputs and checks its
outputs, or the rules that matched. A run shows the result and why (the rules matched); **Use as checks** turns
a run's result into the test's checks. See [Decisions](decisions.md#testing-a-decision).

## The previous editor

`MODELER=classic` in `.env` brings back the previous editor.
