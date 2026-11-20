# Add-ons

**Status:** in place on 3.7.5, but connectors: four add-ons (Policies, Labels, Forms and display, Modeling tools),
`app-config.json`, the manifests, the registration points, the editor's modules and the Settings page's Add-ons.

## Why

BPMN Server has become too much for someone new. The engine, the policies, the notifications, the forms' lookups, the
labels, the connectors, the model history and the scenarios all come together, and every one of them shows in the
editor and the pages. The base should be a plain engine that runs BPMN, with the application doing the rest. Each
further feature is an **add-on** that is turned on when it's needed.

## The rules

1. **The engine runs the flow, and nothing else.** A feature is standard only if the engine needs it to run the flow
   as the model says. Everything else is an add-on, even if Camunda defines it (`camunda:candidateGroups`).
2. **The engine calls no add-on.** It imports nothing from an add-on, and doesn't know which add-ons there are.
3. **An add-on registers for what it needs.** It subscribes to the engine's own events, and adds what it brings to
   the engine's registration points: checks, query filters, columns, editor properties and pages.
4. **An add-on depends on the engine only, never on another add-on.** What two add-ons share belongs to the engine.
   One add-on reads another's work only as data, such as the fields on a task.
5. **An add-on that's off isn't loaded.** Nothing is hidden. Only its manifest is read: its attributes in a model are
   kept as written, shown read-only in the model report, and verify warns that the model uses an add-on that's off.
6. **An add-on never fails a process.** A subscriber or check that throws is reported, and the engine goes on.

`test/add-ons.test.mjs` checks rules 2 and 4 by reading the sources, and rule 6 by running a broken add-on.

## Standard or add-on

| Feature | | Why |
|---|---|---|
| BPMN elements, gateways, events, timers, sub-processes, call activities | Standard | The flow |
| Service tasks calling the application's services (`appServices`) | Standard | The delegate is how an application connects to the engine |
| Script tasks, expressions, DMN business rule tasks | Standard | The flow |
| Data objects (`loadDataObject`) | Standard | A BPMN element; loading it is a delegate hook |
| Forms: fields and defaults (`camunda:formField`) | Standard | Camunda's; the task form is drawn from them |
| Form keys (`camunda:formKey`, `app:<page>`) | Standard | The engine only stores the key |
| Form rules (types, `required`, min/max, the `validate` event) | Standard | Camunda's constraints, honoured on completion; `formRules: false` turns them off |
| Storage: MongoDB, SQLite, memory | Standard | Adapters (`documentStore`), not features |
| User-chosen list columns (the picker, filters, sort) | Standard (web) | The lists themselves. Add-ons contribute columns to them |
| **Policies** | Add-on | Assignment (`assignee`, candidates, lanes as groups, roles, start permissions, the assignment policy), security and notification policies, the Notifications page, and actors (`owf:actor`, `actors.*`) |
| **Labels** | Add-on | `owf:label` and `owf:endLabel`, and their values as the lists' columns |
| **Forms and display** | Add-on | `owf:list` and `owf:lookup` on form fields |
| **Modeling tools** | Add-on | The editor's Test tab (scenarios, `@evaluate`) and History tab (the versions kept on each save) |
| **Connectors** | Add-on, later | OpenAPI operations as services, on the service catalog (see Order) |

### Assignment, in full

Assignment isn't needed to run the flow: a user task waits whether or not anyone is named for it. Who it's for only
matters to what lists tasks and decides who may act, and in the simple base that is the application.

- **Moves into the add-on:** evaluating `camunda:assignee`, `candidateUsers` and `candidateGroups`; a lane as a
  candidate group; `roles.json` and the role checks; the assignment policy; what a reassignment records; the task
  filters `SecureUser` builds from these fields; the process's `candidateStarterUsers` and `candidateStarterGroups`;
  the editor's *Assignment* group; claim, the candidate parts of My Work, the Roles page.
- **Stays in the engine:** the item's fields `assignee`, `candidateUsers` and `candidateGroups`, as plain data, since
  they are part of the storage and API contract; `engine.assign(...)`, which sets them; `dueDate`, `followUpDate`
  and `priority`, which describe the task rather than who does it.
- **Off:** a task names no one, the task lists aren't filtered, and anyone may act. The application decides.

### Labels

The labels add-on controls the display columns: it contributes the *Case* and *Task* label columns to the lists and
the label to the pages' headings. Off, the lists show the engine's own columns (process, case id, status, dates), and
a case is shown by its id.

## Registration points

An add-on is `{ name, register(app) }`. In `register` it adds what it brings. Each point is the engine's or the web's;
none names an add-on.

| Point | Whose | What an add-on adds | Used today by |
|---|---|---|---|
| Events (`listener.subscribe`) | Engine | Work on `start`, `assign`, `wait`, `end`, `process.end`, ... | Assignment, notification (done) |
| Model checks | Engine | Checks of an element or process, and the decision files it uses | Assignment, notification, security, lookups |
| Decision folders | Engine | Its decisions by their tests' name (`Leave.policy`) | The three policies |
| Query filters | Engine (API) | Narrowing what a user sees: tasks, cases, startable processes | Assignment (`SecureUser`), security (`caseAccess`) |
| Form field rules | Engine | A rule checked on completion | Lookups (a list's choices) |
| Display columns | Web | Columns for the lists, and how each is shown, filtered and sorted | Labels, assignment |
| Editor modules | Editor | A bpmn-js module: properties, model types, report section, lint rules | All with model attributes |
| Pages and menu entries | Web | Routes, views, menu entries | Notification, assignment (Roles), history, scenarios |
| Integration page sections | Web | Its section: what it has, its settings | All |
| AI guide sections | Web | What `/llms.txt` and the guide say about it | All with model attributes |

The engine already has the first two in some form (events; `verifyModel` asks each add-on). The rest are to build.
A registration point is small: a list the add-on adds to, and the engine or the web runs what's in it.

### Who works on a user task: one engine step

Who works on a task is changed in one engine step, `Execution.assignItem(item, fields, why)`, whoever decides it: it
sets the fields, records what decided it (`item.assignment`: `{ policy, rule }`, `{ userName }`) and fires `assign`.
An add-on never sets them itself, so `assign` is the one event for every change.

| Event | When | The policies |
|---|---|---|
| `start` | A user task starts, before it waits | Assignment: its attributes, its lane's group, then its policy, set once through `assignItem` |
| `assign` | Who works on it was set: as it starts, or by a person (a claim, a reassignment). Details: `before`, `assignment`, `why`, `previous`, `changed`, `by` (the person) | Notification: tells whom its policy says (`assigned`). Assignment: a person's change, in the Rationale |
| `wait` | It waits, who works on it decided | |
| `end` | An item ended. Details: `cancel` | Notification: a user task completed |
| `process.end` | An instance ended | Notification |

Deciding on `start` keeps the order the engine always had: a `start` script sees no assignee yet, a `wait` script the
final one.

## Turning add-ons on: `app-config.json`

The application's `app-config.json`, beside `app-contract.json`, says which add-ons are on:

```json
{ "addOns": ["assignment", "security", "notification", "labels"] }
```

- **No file, or no `addOns`:** every add-on bpmn-server comes with is on. Existing applications don't change.
- **`npx bpmn-server init`:** writes the file from the install options (below); a new application starts small.
- **The Integration page** has an *Add-ons* section that writes the file. As with `.env`, a change applies when the
  server restarts.
- **The configuration's `addOns(server)`** stays, for an application that builds its own list in code; it wins over
  the file.
- **With the engine apart** (`ENGINE_AT`): both sides read the same file. The engine registers the engine parts, the
  host the web and editor parts.

### Install options (`init`)

| Option | Add-ons |
|---|---|
| Sample app, everything | All |
| Sample app, simple | None: the engine, the workbench and the modeler |
| Embed into an existing app | None. An AI prompt generates the code for appServices and the API calls; to-do lists and custom forms are the app's |

The questions `init` asks (API, Workbench and Modeler, appServices from existing code, connectors) each map to a part
of the starter or to an add-on.

## Where an add-on lives: its own folder

Everything an add-on is, in one folder:

```text
addons/policies/
  engine/     what runs in the engine: its event subscribers, checks, query filters (TypeScript)
  editor/     its bpmn-js module: properties, model types, report section, lint rules
  web/        its routes, views, menu entries, Integration section, columns, guide section
  test/       its tests, run alone with the engine
  docs/       its page
  index.ts    { name, register } for each side
  addon.json  its manifest: name, title, the model attributes it owns (read even when it's off)
```

- **Open:** which package it ships in. The engine part needs only bpmn-server; the editor part needs bpmn-js and
  Preact; the web part needs bpmn-web. Either one `bpmn-addons` package that depends on both, or the add-ons ship
  inside bpmn-web, which already depends on bpmn-server. The second is simpler to start with.
- The policies move from `packages/bpmn-server/src/addons/` to their folders here.

## A model that uses an add-on that's off

Its attributes (`owf:assignmentPolicy`, `camunda:candidateGroups`, `owf:list`) are kept as written: moddle keeps
attributes it doesn't know, and saving writes them back. The editor's properties panel doesn't show them, since the
add-on's properties aren't loaded. The engine ignores them.

What says they are the add-on's is its **manifest**, `addons/<name>/addon.json`, read for every add-on bpmn-server
comes with, on or off. It has no code:

```json
{
  "name": "assignment",
  "title": "Assignment",
  "attributes": ["camunda:assignee", "camunda:candidateUsers", "camunda:candidateGroups",
                 "camunda:candidateStarterUsers", "camunda:candidateStarterGroups", "owf:assignmentPolicy"]
}
```

With the manifests:

- **The model report** shows an add-on's attributes read-only under its title, marked *add-on off*:
  *Assignment (add-on off): candidateGroups = Managers*. When the add-on is on, its report section shows them instead.
- **Verify** warns once for each add-on a model uses that is off: *This model uses Assignment (candidateGroups on
  Approve, ...), which is off; the engine ignores it.* Code `add-on-off`, a warning: the model still runs.
- **The Integration page** says, for an add-on that's off, which models use it.
- **The AI guide** can say what an attribute is for, and that its add-on is off.

An attribute no manifest claims and no loaded module reads is shown read-only under *Other attributes*.

## Order

1. **Registration points**, all of them, with the policies moved onto them. No behaviour changes.
2. **`app-config.json`** and the Integration page's *Add-ons* section.
3. **Assignment**, in full (the candidate fields, lanes, roles, start permissions, the task filters).
4. **Security** and **notification**: their editor modules and pages.
5. **Labels**, with the display columns.
6. **Model history** and **scenarios**.
7. **The service catalog** (standalone work): app services and connectors as one kind, all on the isolated side.
8. **Connectors** and **lists and lookups**, on the catalog.

Each step keeps every add-on on by default, so the test suites pass unchanged at each one. Each also adds the add-on's
own tests, run with the engine alone.

## Impact

| | Existing applications | This repository |
|---|---|---|
| Engine | Nothing to change: everything on by default | The engine parts of each add-on move out; the registration points are added |
| API | The same calls and data. Task and case lists are narrowed only by the add-ons that are on | `SecureUser`'s filters move to the assignment add-on |
| Editor | The same, with every add-on on. With one off, its properties aren't there | The modeler loads the modules of the add-ons that are on; `PolicyEntries`, `AssignmentGroups`, the lookups' entries move |
| Pages | The same, with every add-on on | Menus, the Integration page, the lists' columns and the dashboards take what the add-ons register |
| Scripts and listeners on `start` and `wait` | As before: `start` sees no assignee yet, `wait` the final one | |
| Imports of moved files | A deep import (`dist/engine/AssignmentPolicy.js`) breaks; the package's entry still exports everything | |
| Tests | | Each add-on's tests move to its folder; a test of the engine alone; the suites run with all on |
| Docs | | A page per add-on; the tutorials say which add-ons each chapter needs |

## Open

- Which package the add-ons ship in (see *Where an add-on lives*).
- Whether actors stay standard, or the `owf:actor` naming belongs to the policies that read it.
- What the minimal `init` preset includes: whether the workbench's My Work needs assignment to make sense.
