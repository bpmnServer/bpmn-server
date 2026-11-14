# The application's contract: what it publishes, and how we talk

Status: **draft for discussion**, 2026-11-13. Related: [expressions.md](expressions.md) (the names an expression
reads), [decision-context.md](decision-context.md) (the application's facts), [form-keys.md](form-keys.md) (its
forms), [connectors-as-files.md](connectors-as-files.md) (its APIs), [host-users.md](host-users.md) (its users), and
the roadmap's "With MDE-generated applications".

## 1. Why

BPMN Server runs an application's workflows, so it depends on what the application has. Today the application says
most of this nowhere:

| What we use | Where it is today | Can we check or offer it? |
|---|---|---|
| Functions an expression calls (`appServices.managerOf(...)`) | the application's code | No: a typo fails when it runs |
| Facts a decision reads (`employeeManager`, `userGroups`) | `appDelegate.decisionContext`, code | No: a typo reads as `null` |
| Roles | `roles.json` beside the models | Yes, the names only |
| Its APIs | `<id>.connector.json` (OpenAPI) | Yes |
| Its pages (form keys) | nowhere yet (form-keys.md proposes `start({ forms })`) | No |
| What we tell it (a task is waiting, a case ended) | `notifyUsers`, the delegate's hooks, code | No |

**The proposal:** the application publishes one document, **the application's contract**, that says all of it. The
model editor offers what it lists, `verifyModel` checks models against it, and tests stub what it declares. It is
the application's responsibility, like its OpenAPI document. An MDE-generated application already knows all of this
(`GET /model`) and gives it to us as it is (§7).

## 2. The document

JSON, from one of two places:

- **A file** beside the models: `processes/application.json`, in git, deployed with the models (as connectors are).
- **A URL** the application serves: setting `APP_CONTRACT_URL` (an MDE application: its `/model`, through §7's
  mapping). It is read at start and again on demand (Administration ▸ Reload, or `POST /api/v3/application/reload`).

Both are optional. Without one, everything works as today (§9).

```json
{
  "name": "hr",
  "title": "HR",
  "expressions": { "facts": [], "services": [], "types": {} },
  "roles": [],
  "apis": [],
  "forms": {},
  "events": {}
}
```

## 3. Part 1: expressions, the names that are valid

What an expression may read, in a script, a condition, an input or output parameter, or a decision table (FEEL or
JavaScript), beyond the standard names in expressions.md (`data`, `user`, `actors`, `instance`, ...):

```json
"expressions": {
  "facts": [
    { "name": "employeeManager", "type": "string", "about": "user", "description": "The acting user's manager" },
    { "name": "userGroups", "type": "string[]", "about": "user" }
  ],
  "services": [
    { "name": "managerOf", "params": [{ "name": "userName", "type": "string" }], "returns": "string",
      "async": true, "effect": "read", "description": "The user's manager, by user name" },
    { "name": "addAssignment", "params": [{ "name": "assignment", "type": "Assignment" }], "returns": "Assignment",
      "async": true, "effect": "write" }
  ],
  "types": {
    "Assignment": { "type": "object", "properties": { "employeeId": { "type": "string" },
      "projectId": { "type": "string" }, "allocation": { "type": "number" } }, "required": ["employeeId", "projectId"] }
  }
}
```

- **facts:** the names the application's `decisionContext` adds. `about` says when each one exists: `user`, `instance`
  or `task`.
- **services:** the functions of `appServices`, with their parameters, what they return, and whether they wait
  (`async`). `effect` says what a call does: `none`, `read` or `write`. A decision table may call only `none` and
  `read` services; a `write` service is refused there, and `verifyModel` says so.
- **types:** JSON Schema, for a service's parameters and results and a form's data.

**A class can declare it instead.** JavaScript can't tell us a function's types, so the JSON is the contract. An
application written in TypeScript can generate it from its class (`npx owf contract --from src/appServices.ts`, to
come). At start, the class is checked against the contract:
- a declared function the class doesn't have is an error;
- a function the class has but doesn't declare is a warning.

## 4. Part 2: roles and APIs

```json
"roles": [
  { "name": "Employee", "title": "Employee" },
  { "name": "Manager", "title": "Manager", "description": "Approves leave and assignments of their reports" },
  { "name": "ProjectCoordinator", "title": "Project coordinator" },
  { "name": "ProjectManager", "title": "Project manager" }
],
"apis": [
  { "id": "hr", "openapi": "/api/hr/openapi.json" }
]
```

- **roles:** replace `roles.json`, which is still read when there is no contract. Who holds a role is the
  application's user manager (host-users.md), not the contract.
- **apis:** each one becomes the connector `<id>`, made from the application's OpenAPI document. A connector file
  already written for it is kept as it is.

## 5. Part 3: pages, the forms a form key names

```json
"forms": {
  "assignment": {
    "title": "Assign an employee",
    "url": "/hr/forms/assignment",
    "for": "task",
    "data": { "$ref": "#/expressions/types/Assignment" }
  },
  "leave-request": { "title": "Request leave", "url": "/hr/forms/leave-request", "for": "start" }
}
```

A task names one as `camunda:formKey="app:assignment"` (form-keys.md §3). `data` says what the form gives back. With
it, tests and agents know a step's data without the page, and the data the page returns is checked against it.

## 6. The protocol: how each side calls the other

### 6.1 BPMN Server opens the application's page

1. A person opens the task (on owf's task page, in My Work, or in the application's own list). The address is the
   form's `url`, with the task added:
   - a task: `/hr/forms/assignment?task=<id>&returnTo=<where they came from>`;
   - a start form: `?process=<name>&start=<element id>&returnTo=...`.
2. The page reads the task as the person: `GET /api/v3/tasks/{id}` (its data, its form, who may complete it), with
   the application's token for that person (host-users.md).
3. The person fills in the form. The application checks it its own way, and may do its own work first, such as saving
   the assignment.
4. **The page completes the task:** `POST /api/v3/tasks/{id}/complete` with `{ data }`. A start form calls
   `POST /api/v3/processes/{name}/start`. The page then goes back to `returnTo`.

### 6.2 A page inside BPMN Server's pages (framed)

When owf shows the form in a frame, the page tells the frame what happened with `window.parent.postMessage` (only
from the application's origin):

| Message | Means |
|---|---|
| `{ type: "owf:completed", task }` | done: owf moves to the next task or back |
| `{ type: "owf:cancelled", task }` | closed without completing |
| `{ type: "owf:height", value }` | the frame takes the page's height |

### 6.3 BPMN Server tells the application (events)

The application says what it wants to hear and where. Each event is a signed POST (an HMAC of the body, with the
application's key), retried if it fails, and carries the event, the instance, the task and the person:

```json
"events": {
  "url": "/hr/workflow-events",
  "on": ["task.waiting", "task.completed", "instance.ended", "instance.failed"]
}
```

It replaces hooks in code (the delegate), so it also works for an application in another process or language.
`appDelegate` stays as the in-process way.

### 6.4 The application tells BPMN Server

Through API v3, as the person or as the service:
- start a process;
- complete a task;
- throw a message or a signal: `POST /api/v3/messages/{name}`, `POST /api/v3/signals/{name}`.

**A business event starts a process.** An application's event (for example `Assignment.requested`) can name a
process to start, in the model (a message start event of that name) or in the contract:
`"triggers": { "Assignment.requested": "Project assignment" }`.

## 7. An MDE-generated application

Its `GET /model` already has most of this. The mapping is one adapter on our side, so the application adds nothing:

| MDE's `/model` | The contract |
|---|---|
| roles (with titles) | `roles` |
| pages | `forms`: a page that edits an entity, or runs a use case, as a form |
| entities (attributes, types, enum values, required) | `expressions.types`, and the data a form returns |
| operations, use cases | `expressions.services`: reads are `read`, the rest `write` |
| business events (`/events`) | `events` and `triggers` |
| its OpenAPI | `apis` |

Not in MDE's model, and still declared by the application: `facts` (the names a decision reads) and `services`
beyond its operations.

## 8. What uses it

- **The model editor** offers the names in scripts, conditions, parameters and the decision editor; roles for
  candidate groups and lanes; forms for Form Key; services with their parameters.
- **`verifyModel`** warns about:
  - an unknown fact, service, role or form;
  - a service called with the wrong number of parameters;
  - a `write` service called in a decision.
- **Tests:** a service stubbed by its declared signature; a form step's data checked against the form's `data`.
- **Agents:** `GET /api/v3/application` answers the contract, so an agent building a model knows what it can use.

## 9. Compatibility

All of it is optional. Without a contract, everything works as today:
- `roles.json`;
- `decisionContext` and `appServices` unchecked;
- connectors as files;
- no form keys.

`appDelegate` stays the in-process way for everything. A contract only adds checks and offers, until an application
declares forms or events.

## 10. Questions

1. **Where it comes from:** a file, a URL, or both (as proposed)?
2. **Types:** JSON Schema (proposed), or a simpler list of types?
3. **Events to the application** (§6.3): in 3.7, or after form keys?
4. **The file's name:** `application.json`, or `owf.json`, following the `owf:` rule for what is ours?
5. **MDE first or HR demo first:** map an MDE application's `/model` (§7), or write the HR demo's contract by hand
   first?
