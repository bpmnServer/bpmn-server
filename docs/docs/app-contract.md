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
| `expressions` | The **functions** an expression calls as `appServices.<name>(...)`, each with its type and description. A function's `effect` is `none`, `read` or `write`: a decision may not call a `write` one. |
| `types` | JSON Schemas the types name. |
| `roles` | The roles lanes and tasks are given to. Where roles belong since 3.7.5; a `roles.json` beside the models is read only when this declares none. A role may be given `permissions`: `user` (start the workflows it may, work its own tasks), `designer` (design models) or `administrator` (manage users, roles, credentials and the settings), ticked on **Dashboard ▸ Settings ▸ Security**. A role the contract does not mention keeps the server's default for its name (`ADMIN`, `SYSTEM`, `DESIGNER`); one it mentions decides for itself, either way. |
| `apis` | The application's APIs: each a connector, from its OpenAPI document. |
| `pages` | The application's forms, by id: a task's form key `app:<id>`. |

## What checks it

- **The model checks** (`verifyModel`, the editor's Problems, `npm run verify`) warn about an `appServices.<name>` the
  contract doesn't declare, one called with the wrong number of arguments, a
  form key `app:<page>` it has no page for, a lane that is not a role; and refuse a decision the model uses (a
  business rule task's, a policy) that calls a `write` function.
- **At start**, the engine compares it with the delegate's code, in the log: a declared function the code
  lacks is an error; one the code has that the contract doesn't declare, a warning. A contract with no `expressions` says nothing about functions, so none is compared.
- **The editor** offers its functions with their descriptions after `appServices.`.
- **API v3:** `GET /api/v3/application` answers it (and its problems), for an agent building a model; `/llms.txt`
  links it.
- **The Settings page** has a card for it (`/dashboard/settings/contract`): the contract's APIs with the connector made from
  each and how it stands, its pages, roles and functions, its problems, and how the application and this server reach each
  other ([the Settings page](integration-settings.md)).

Not built yet: a delegate in another language over HTTP (`appUrl`), opening an application's page from a task (the
form protocol), the MDE adapter.

The HR demo has one: `apps/hrdemo/app-contract.json`.
