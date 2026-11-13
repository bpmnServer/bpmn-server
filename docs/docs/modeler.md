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
- **Conditions:** every sequence flow has a **Condition** field, which suggests the model's data fields as you type (`data.`). A default flow's condition isn't used, and the field says so. **Language** appears once there is a condition.
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

A finding's **Turn off** button, or the **Rules** dialog on the Problems tab, sets a rule's level: off,
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

A setting the report has no words of its own for (another tool's extension) is still there, as `key: value`. An
element's form is a table, a field a row: its type, label, default, options, and the rest it sets (its validation).
On an instance's page, a click on an element of the diagram shows its section of the report, and what the run did
with it. bpmn-server's own settings have lines of their own: `label` and `endLabel`, a user task's
`assignmentPolicy`, a process's or a task's `securityPolicy`. A business rule task shows its decision's table, a
user task its [assignment policy](assignment-policies.md)'s, and a process its security policy's: the one it names,
else the application's default (`policies/security/default.dmn.xml`), else a line saying the built-in default
decides (only while security policies are on). Clicking an id selects the element on the diagram. **Print** saves
the report as a PDF.

The report is also what [History](#history) compares: as text, the model's problems and the decisions' and
policies' tables left out (they are not in the model file).

## Testing a model

The **Test** tab keeps test scenarios for the model and runs them. The scenarios are on the left, each with the result
of its last run; the selected one is on the right: its result, its steps and its checks.

The scenario list on the left can be made wider or narrower: drag the handle beside it, or focus the handle and use the left and right
arrow keys. The editor remembers the width.

**Coverage**, under the list, says how many of the model's nodes and flows the scenarios' last runs have reached. A scenario counts once
it has an instance: only the engine knows what comes next, so steps written down prove nothing until they run. An element is
*tested* when a run that passed reached it, and *reached* when only runs that failed or did not finish did. A boundary event or an event
sub-process's start that never fired has not been reached. An event sub-process has no count of its own: what is inside it does.
**Show on diagram** marks them, and **Not reached** lists what is left. Reaching an element does not say it was checked, and every
element reached does not mean every path through them was.

Two commands close what is left:

- **Test all paths** tries the paths by itself on the saved model, up to 200 runs. At each waiting step it tries the form's choices
  and the values the model's conditions compare with, and it saves a scenario for each path that reaches something new; the other
  runs are deleted. Service and send tasks run for real on every try, and it lists them before you start. A saved scenario is marked
  *auto*: it shows the path runs, not that it does the right thing, so what only those reach is counted apart until you add checks
  and **Mark as reviewed**. A condition that calls something, or a value only a service sets, can't be read off the model.
- **Fill**, on an element not reached, records a new scenario with that element as its goal. The data the way there asks is filled
  in, and the recording says which step is next, when the goal is reached, and when the run can no longer get there.

By the scenario's name, **Saved** or **Saving…** says whether your changes are saved; **Not saved**, with **Retry**,
stays until a save succeeds. A new scenario has no steps: **Record** is the button to start with, and **Run** waits
while a recording is on.

1. **New** adds a scenario, and **Record** starts the process with its start data and shows what waits as the next
   steps: user tasks (**Complete step**), receive tasks (**Receive**) and events (**Trigger event**), each with its data.
2. Completing a step shows what waits next, until nothing waits: the recording then closes by itself and shows its
   result. The data chooses the branches; which step you complete first chooses between elements that wait together
   (the events after an event-based gateway, a boundary timer, parallel tasks). **Stop** ends it part way.
3. The steps you completed are saved as the scenario's. **Run** and **Run all** repeat them on a new instance without
   stopping, and run its checks.
4. **Add check** adds a check, at the start, after a step or at the end, and it shows under its step, in words, with **Edit**: the instance's status, a data value, or an element passed
   (how many times, in what status). After a run its shield is green or red, and a failed check says what was found.
   A check after a step the scenario doesn't have (yet, or any more: the step removed, or recorded along another
   path) is saved as a check at the end, since the `.feature` has nowhere else to put it.

**A task by itself:** select a task on the diagram and choose **New**, *The task selected* (or choose it under
**Start at**, *A task by itself*). The scenario runs that task alone, with the data you give as its input: a script or a service
runs and the run ends; a user task waits for its step, then the run ends. Nothing before or after it runs. Its run
has the items, the data and the decisions as any other, and **Debug** changes its data and runs it again. It is
saved, repeated and checked as the other scenarios.

**The result** of the run shown: **✓ Passed** or **✗ Failed** with how many checks, and the checks that failed listed
under it with what was found; a run with no checks says **○ Ran: nothing checked** (and the list shows ○), since
it passed nothing. It says when and how the run was made, and *the scenario changed since* or *the model changed
since* when the result is no longer the scenario's as it is now. A check's shield is empty until a run checks it,
then green or red.

Each scenario keeps its last run with its instance; the next run replaces them. By its result are **Open instance**
and the commands for that run, **Simulate** and **Debug** each opening its panel under them, and **Delete**:

- **Simulate** plays the run on the diagram: an element turns blue when it starts and green when it ends, orange if it
  still waits, numbered in the order they started; **Back**, **Step**, **Play** and **Stop**. **Show details** says
  what the Rationale says of each change: who did it, with what data, and why (a flow's condition and the values it
  read, a gateway's choice). An instance's page has the same Simulate.
- **Debug** changes the instance's variables for the next steps; **Restart here**, on a step done, goes back to it.
  Debugging a kept run changes that run only: the scenario's steps and their data stay as they were.

**Inspect this run** shows its data, items, the Rationale (as on the instance page: what happened, in order, and why) and log. **Add as a check**, on an item or a value,
checks it is as it is there: its status or its value, where the run waits (after the last step done, or at the start
when none is), else at the end.

**What happened**, under each step of the timeline once the scenario has run, opens to that step's part of the
Rationale, as the engine logged it: what started, waited and ended, and why. An item the step changed has **Add as a
check** on its row, for its status as the engine logged it, and the instance's status, when the step changed it, on
the line of What happened. A step the run took that no step of the scenario asked for, such as a timer the server
fired, has a row of its own, dashed, where it ran. A scenario written in Gherkin lists its run's steps under its text
(Step 1 · Start Process, Step 2 · Invoke Item, ...), with **Copy check**, the line to paste in **Edit as text**, and its
checks under the row of the item they check.

The instance page's Rationale has the same steps: each a line (Step 1, Step 2, ..., who, the data) that opens to its
rows. Its filters open the steps with a row of what they show, and hide the others.

**Full window**, in the bar of the tabs, puts them over the whole page; **Back to the editor** or Esc returns, and so does
Simulate, which shows on the diagram.

Test runs are ordinary instances whose ids start with `test-`, tagged in the database with their process and scenario:
run tests on a development or test server. They are left out of the lists of instances and tasks; **Open instance** opens one.

The **Design dashboard** (`/dashboard/design`) shows each model's and decision's tests with the last run's result
(and why it failed), runs one model's or decision's tests, or **Run all tests**. Each model also shows its description
(its process's documentation), its saved versions, and its **coverage**: what its scenarios' last runs reached, by the
Test tab's rules. What a run reached is saved on its test instance, so deleting the instance removes the run and its
coverage; it says how many scenarios have not run, and *out of date* when the model was saved after them. A **Run** here keeps each scenario's
run, as the Test tab does.

Beside the search of the models, **Any feature** lists the [features](features.md) the models use (user tasks, timers,
connectors, forms, ...), each with how many models use it. Choose one, and only the models that use it are listed, each
with where: the elements, each a link that opens the model at that element (`/model/edit/<model>#element=<id>`). What
shows a feature in a model's XML is the catalog's (its **In the model** column); from the command line,
`npm run features -- --models <folder> --feature <id>`.

The scenarios are saved in the models folder, beside the model, as Gherkin: `<model>.feature` (see below).

**Edit as text**, in the list's **⋯** menu, opens the whole `.feature` file in the tab, with its comments. **Save** keeps it only if
it reads as tests: otherwise the error gives the line and your text stays. If the file changed since you opened it, it isn't
overwritten. A scenario the form can't show, such as one with a `@stub` or an expression, stays as written and has an **Edit as text**
button of its own. A run leaves the file as it is, but changing a scenario through the form rewrites the file and drops its comments.
See [Tests in Gherkin](testing.md#tests-in-gherkin).

## History

Every save of a model is kept. The **History** tab lists the saved versions, newest first, with when and by whom
each was saved, and **Current**: the model in the editor, unsaved changes included. A save that changes nothing
adds no version; the first save of a model saved before there was a history keeps the file as it was first.

- **View** shows one version, read only: its diagram in the main area, over the editor, and its
  [report](#report) in the tab. **Close** returns to the editor.
- **Compare:** tick two versions. The older is compared with the newer by their [report](#report) as text: the
  lines removed and added, each shown under the element and the process it is in. What the text does not hold,
  the diagram's layout, is listed apart: the elements **moved or resized**, each with what changed (moved,
  resized, path changed, label moved) and a flow by its two ends. Clicking one selects it on the diagram.
  The newer version's diagram opens in the main area, marked: **+** added, **M** changed (amber) or only moved or resized
  (grey), and the removed elements drawn dashed in red, with **−**, where they were. **Close** returns to the
  editor.
- **Restore** loads a saved version into the editor in place of its model, unsaved: the status says so, and the
  editor's unsaved changes are replaced (you are asked first). **Save** keeps it as the newest version; nothing in
  the history is removed, so a restore is undone by restoring the version before it.
- **Copy** (**Restore as copy** when viewing a version) makes a saved version a new model, under a name you give, and opens it in its own tab. This
  model, its history and the editor's unsaved changes stay as they are; a name already in use is refused.
- **Delete** removes one saved version (you are asked first). The other versions keep their numbers, and the model
  stays as it is.
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
  Leave Application.feature       its Test tab scenarios
  loan.dmn.xml                    a decision
  loan.dmn.feature                its tests
  bpmnlint.json                   the team's modeling rules
  .history/Leave Application/     every save of the model: 0001.bpmn, 0002.ann.bpmn (ann saved it), ...
```

A `.feature` file is [Gherkin](testing.md#tests-in-gherkin). A scenario's last run isn't in it: it is the scenario's test
instance in the database. Test sets kept in the database before 3.5, and older `*.tests.json` files, become these files when the server starts.

## Decisions

`/model/decision/<name>` edits a decision file (`<name>.dmn.xml` in the models folder) with dmn-js: its decision
table, literal expressions, and the decision requirements diagram. A business rule task's **Open** button opens
its decision, or creates it when it is not there.

The decision editor has a **Test** tab, as models do: each test gives the decision's inputs and checks its
outputs, or the rules that matched. A run shows the result and why (the rules matched); **Use as checks** turns
a run's result into the test's checks. See [Decisions](decisions.md#testing-a-decision).

## The previous editor

`MODELER=classic` in `.env` brings back the previous editor.
