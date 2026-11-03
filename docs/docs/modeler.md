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

The Report tab is the whole process as one document: its elements in flow order, with their documentation, how
bpmn-server reads them, and their problems; then the conditions, decision tables and data objects. **Print**
saves it as a PDF.

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

## Decisions

`/model/decision/<name>` edits a decision file (`<name>.dmn.xml` in the models folder) with dmn-js: its decision
table, literal expressions, and the decision requirements diagram. A business rule task's **Open** button opens
its decision, or creates it when it is not there.

The decision editor has a **Test** tab, as models do: each test gives the decision's inputs and checks its
outputs, or the rules that matched. A run shows the result and why (the rules matched); **Use as checks** turns
a run's result into the test's checks. See [Decisions](decisions.md#testing-a-decision).

## The previous editor

`MODELER=classic` in `.env` brings back the previous editor.
