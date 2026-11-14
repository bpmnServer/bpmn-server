# The application's contract: what it publishes, and how we talk

Status: **draft for discussion**. 2026-11-13, revised 2026-11-14 with Ralph's feedback. Related:
[expressions.md](expressions.md) (the names an expression reads), [decision-context.md](decision-context.md) (the
application's facts), [form-keys.md](form-keys.md) (its pages), [connectors-as-files.md](connectors-as-files.md)
(its APIs), [host-users.md](host-users.md) (its users).

## 1. Why

BPMN Server runs an application's workflows, so it depends on what the application has: the names an expression may
use, its roles, its APIs, its pages. Today most of this is code no one can read before it runs. A typo in a function
name fails only when it runs, and an unknown fact reads as `null`. The editor can't offer these names, and
`verifyModel` can't check them.

## 2. One integration point: `appDelegate`, in two parts

The application already gives us its delegate. The delegate carries the contract too, in two parts:

| | What | Who reads it | Where |
|---|---|---|---|
| **Declarative** | what exists: the names (facts and functions, with their types), roles, APIs, pages | the editor, `verifyModel`, tests, agents; without running anything | `appDelegate.describe()`: JSON, from a file or built in code |
| **Code** | what it does: the functions, the facts' values, `notifyUsers`, the hooks | the engine, when it runs | the delegate's methods, as today |

The rule: the declarative part says **what** and never **how**. Every name it lists is carried out by the code part.

```ts
class HrDelegate extends DefaultAppDelegate {
    describe() { return JSON.parse(fs.readFileSync('processes/application.json', 'utf8')); }   // declarative
    async decisionContext(context, about) { return { employeeManager: await hr.managerOf(about.user) }; }  // code: facts
    async notifyUsers(notice) { /* send it */ }                                                       // code: hooks
}
// appServices: the functions, as today
```

`describe()` is optional. Without it, nothing is checked or offered, and everything runs as today.

## 3. The declarative part

```json
{
  "name": "hr",
  "expressions": [],
  "types": {},
  "roles": [],
  "apis": [],
  "pages": []
}
```

### 3.1 Expressions: facts and functions

The names an expression may use, in a script, a condition, a parameter or a decision table (FEEL or JavaScript),
beyond the standard ones (expressions.md).

| | A fact | A function |
|---|---|---|
| Read as | a name: `employeeManager` | a call: `appServices.managerOf(actors.initiator)` |
| Arguments | none | yes |
| Its value | worked out by the application before the expression runs; the same throughout one evaluation | worked out when the expression calls it; it may wait (`async`) and may change things |
| Its code | `decisionContext` | `appServices` |

```json
"expressions": [
  { "kind": "fact", "name": "employeeManager", "type": "string", "about": "user", "description": "The acting user's manager" },
  { "kind": "function", "name": "managerOf", "params": [{ "name": "userName", "type": "string" }],
    "returns": "string", "async": true, "effect": "read" },
  { "kind": "function", "name": "addAssignment", "params": [{ "name": "assignment", "type": "Assignment" }],
    "returns": "Assignment", "async": true, "effect": "write" }
]
```

- `about` gives a fact's scope: `user`, `instance` or `task`.
- `effect` says what a function does: `none`, `read` or `write`. A decision may not call a `write` function.
- `types` holds the JSON Schemas that parameters and results name, such as `Assignment`.

### 3.2 Roles and APIs

```json
"roles": [
  { "name": "Manager", "title": "Manager", "description": "Approves leave and assignments of their reports" },
  { "name": "ProjectCoordinator", "title": "Project coordinator" }
],
"apis": [ { "id": "hr", "openapi": "/api/hr/openapi.json" } ]
```

- **Roles** replace `roles.json`, which is still read when there is no `describe()`. Who holds a role is the user
  manager's business.
- **An API** becomes the connector `<id>`, made from its OpenAPI document.

### 3.3 Pages

```json
"pages": [
  { "id": "assignment", "url": "/hr/forms/assignment", "title": "Assign an employee" },
  { "id": "leave-request", "url": "/hr/forms/leave-request" }
]
```

A page is its `id` and `url`. Where a page is used is the model's business: a task or a start event names it as
`camunda:formKey="app:<id>"`.

## 4. The protocol

### 4.1 We open the page

1. The person opens a task with `formKey="app:assignment"`. We send them to the page's `url` with the task added:
   `?task=<id>&returnTo=<url>`. For a start event it's `?process=<name>&start=<element id>&returnTo=...`.
2. The page reads the task as that person: `GET /api/v3/tasks/{id}`.
3. The page completes it: `POST /api/v3/tasks/{id}/complete` with `{ data }`, or starts the process:
   `POST /api/v3/processes/{name}/start`.
4. It then goes back to `returnTo`.

### 4.2 A page in a frame

When our page shows the form in a frame, the page tells the frame what happened with `window.parent.postMessage`,
from the application's origin only:
- `{ type: "owf:completed", task }`
- `{ type: "owf:cancelled", task }`
- `{ type: "owf:height", value }`

### 4.3 We tell the application

Through the delegate's code, in the same process: `notifyUsers`, `executionStarted`, `messageThrown`,
`issueMessage`, ... An application in another process or language would need these as calls to its URL instead;
that is not proposed now.

### 4.4 The application tells us

Through API v3, as the person or as the service account:
- start a process;
- complete a task;
- throw a message or a signal.

## 5. What uses the declarative part

- **The model editor** offers:
  - the facts and functions in scripts, conditions, parameters and the decision editor;
  - the roles for candidate groups and lanes;
  - the pages for Form Key.
- **`verifyModel`** warns about:
  - an unknown fact, function, role or page;
  - a function called with the wrong number of arguments;
  - a `write` function in a decision.
- **At start**, the declarative part is checked against the code:
  - a function it declares that `appServices` doesn't have is an error;
  - a function `appServices` has that it doesn't declare is a warning.
- **Tests:** a function stubbed by its declared signature.
- **Agents:** `GET /api/v3/application` answers the declarative part, so an agent building a model knows what it can
  use.

## 6. An MDE-generated application

Its delegate's `describe()` maps its `GET /model` (an adapter we provide):
- its roles become `roles`;
- its pages become `pages`;
- its entities become `types`;
- its operations and use cases become functions (a read is `read`, anything else `write`);
- its OpenAPI becomes `apis`.

Its facts, if any, it declares itself.

## 7. An integration guide for AI agents

A page in `docs/docs/ai/` for an agent integrating an application with BPMN Server. It covers:
- writing the delegate's two parts;
- what each name in `describe()` means;
- the protocol of a page;
- checking the result: start-up checks and `verifyModel`.

The page sits beside `building-workflows.md` and is linked from `/llms.txt`.

## 8. Compatibility

Everything is optional and additive:
- a delegate without `describe()` runs as today;
- `roles.json` is still read when there is no `describe()`;
- `appDelegate` stays the in-process escape hatch.

## 9. Questions

1. **Types:** JSON Schema (proposed), or a simpler list?
2. **The file's name**, when `describe()` reads one: `application.json`, or `owf.json` (following the `owf:` rule)?
3. **Which first:** the HR demo's own `describe()` by hand, or the MDE adapter?
