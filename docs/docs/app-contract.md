# The application's contract: app-contract.json

An application tells OmniWorkflow what its workflows may use of it in one file, `app-contract.json`, in its folder
(the folder it runs in; the configuration's `appContract` names another). The design is in
[app-contract.md](https://github.com/bpmnServer/bpmn-server/blob/main/docs/design/app-contract.md).

**It is guidance, not execution.** A model names everything it uses, and runs as it is, with or without the file. The
contract lets the editor offer names, and the checks find a wrong one before it runs.

```json
{
  "name": "hr",
  "expressions": [
    { "kind": "var", "name": "employeeManager", "type": "string", "description": "The acting user's manager" },
    { "kind": "function", "name": "managerOf", "params": [{ "name": "userName", "type": "string" }],
      "returns": "string", "effect": "read" },
    { "kind": "function", "name": "recordLeave", "params": [{ "name": "leave", "type": "object" }], "effect": "write" }
  ],
  "types": { "Employee": { "type": "object", "properties": { "employeeId": { "type": "string" } } } },
  "roles": [{ "name": "Manager", "title": "Manager" }],
  "apis": [{ "id": "hr", "openapi": "/api/hr/openapi.json" }],
  "pages": [{ "id": "assignment", "url": "/hr/forms/assignment" }]
}
```

| Part | What |
|---|---|
| `expressions` | The **variables** an expression reads as `appVars.<name>`, and the **functions** it calls as `appServices.<name>(...)`, each with its type and description. A function's `effect` is `none`, `read` or `write`: a decision may not call a `write` one. |
| `types` | JSON Schemas the types name. |
| `roles` | The roles lanes and tasks are given to, with `roles.json`'s. |
| `apis` | The application's APIs: each a connector, from its OpenAPI document. |
| `pages` | The application's forms, by id: a task's form key `app:<id>`. |

## Variables: appVars

The delegate names a class of variables; its methods are the names:

```ts
class HrVars {
    constructor(private context) {}
    employeeManager() { return hr.managerOf(this.context.user.userName); }
    endFiscalYear() { return '2027-03-31'; }
}
class AppDelegate extends WebAppDelegate {
    appVarsClass = HrVars;
}
```

An expression reads `appVars.employeeManager`. Its values are worked out **before** the expression runs, each name it
reads once (a method that is async is awaited), so they work in every expression: a script, a condition, a parameter,
a FEEL expression, and a decision table (there, every variable of the class). The class is made for each evaluation
from its context: its `data`, `user`, `instance`, `item`, and `evaluatingSource`, what is evaluating
(`{ type: 'node', id }`, `{ type: 'flow', id }`, `{ type: 'decision', id, policy }`). A delegate can also override
`getAppVars(context)`.

## What checks it

- **The model checks** (`verifyModel`, the editor's Problems, `npm run verify`) warn about an `appServices.<name>` the
  contract doesn't declare, one called with the wrong number of arguments, an `appVars.<name>` it doesn't declare, a
  form key `app:<page>` it has no page for, a lane that is not a role; and refuse a decision the model uses (a
  business rule task's, a policy) that calls a `write` function.
- **At start**, the engine compares it with the delegate's code, in the log: a declared function or variable the code
  lacks is an error; one the code has that the contract doesn't declare, a warning.
- **The editor** offers its functions with their descriptions after `appServices.`, and its variables after `appVars.`.
- **API v3:** `GET /api/v3/application` answers it (and its problems), for an agent building a model; `/llms.txt`
  links it.

Not built yet: a delegate in another language over HTTP (`appUrl`), opening an application's page from a task (the
form protocol), the MDE adapter.

The HR demo has one: `apps/hrdemo/app-contract.json`, its variables in `workflow/delegates/appVars.ts`.
