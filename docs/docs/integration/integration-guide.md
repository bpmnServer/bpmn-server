# Integration, step by step

Two ways to put OmniWorkflow in an application: **embedded** in your own server, or **remote**, called over HTTP. Pick
one and follow its steps in order. Each step names the file, what it must provide, and the code to copy from in the HR
demo (`apps/hrdemo`), the worked example of the embedded way.

## Which way

| | **Embedded** | **Remote** |
|:--|:--|:--|
| Where the engine runs | inside your application's own server process | a server of its own, behind your application |
| Your application reaches it by | calling it in process (`start({ ... })`) | HTTP, [API v3](../api-v3.md) |
| Your users | sign in to your application, which tells OmniWorkflow who they are | sign in to your application, which acts for them with tokens |
| Your language | Node.js | any |
| Service tasks reach your code | directly, as methods | through a [connector](../connectors.md) to your REST API |
| Choose it when | you have a Node application and want one deployment | you have another language, or want the engine separate |

- **Embedded** is what the HR demo does: section A.
- **Remote** is described in [Integrate an existing application](../integrate.md) and walked through in
  [Tutorial 10](../tutorial/tutorial-integrate.md); section B is its checklist.

The tutorials that go with this guide start at [Calling OmniWorkflow from your application](../tutorial/calling-owf.md).

Either way the models, their tests and the workflows' own code live in one folder of your repository (the HR demo's
`workflow/`), and your application keeps its own interface, its users and its data.

## A. Embedded: OmniWorkflow in your own server

### A1. Install

Start from the HR demo, the worked example of this way:

```sh
npx bpmn-server init my-app --hrdemo
```

It copies the HR demo (its own pages, users and API, and the workflows that call them) as your starting point, and asks
for the database and the site ([Installation](../setup.md)). The published package does not carry the HR demo yet: from a
clone of the repository, run `node packages/bpmn-server/dist/cli.js init my-app --hrdemo` instead.

To add OmniWorkflow to an application you already have, install the two packages:

```sh
npm install bpmn-server bpmn-web
```

`bpmn-server` is the engine, `bpmn-web` the pages and APIs around it.

### A2. A folder for the workflows

Everything of the workflows in one place, as `apps/hrdemo/workflow/` has it:

```
workflow/
  processes/           the .bpmn models, their .feature tests, decisions, connectors/
  settings/config.ts
  delegates/           appDelegate.ts, appServices.ts, appVars.ts, testServices.ts
  test/
```

### A3. Settings: `workflow/settings/config.ts`

What replaces bpmn-web's defaults. Leave out what you do not change; secrets and per-machine values belong in `.env`:

```ts
export function config() {
    return {
        definitionsPath: process.env.DEFINITIONS_PATH || path.join(ROOT, 'processes') + path.sep,
        // the delegate's source: its services' names are read from it when the server starts
        delegateFile: path.join(ROOT, 'delegates', 'appDelegate.ts'),
    };
}
```

### A4. The app delegate: `workflow/delegates/appDelegate.ts`

The one object the engine asks about your application. Extend `WebAppDelegate` and give it:

| Member | What it is |
|---|---|
| `appServices` | the methods a service task calls (`appServices.recordLeave`) |
| `appVarsClass` | the class whose methods are `appVars.<name>` in an expression |
| `executionEvent` | optional: what the engine did, when you want to hear it |

Keep the services small and named for the business (`recordLeave`, not `post`), so the model reads as the process.

### A5. Your users: a user manager

Your application signs people in; OmniWorkflow keeps no users and no sessions of its own. Give
`start({ userManager })` an object with four methods:

| Method | What OmniWorkflow does with it |
|---|---|
| `init(app)` | your sessions and `req.user`, before its own routes |
| `apiUser(req)` | who an API call is from: `{ userName, userGroups, email }`, or `null` |
| `listUsers()` | your people and their groups, for "who may" in the pages |
| `setup(app)` | your sign-in and sign-out routes, and where its pages send someone to sign in |

`apps/hrdemo/server/userManager.js` is the worked example. Design:
[host-users.md](https://github.com/bpmnServer/bpmn-server/blob/main/docs/design/host-users.md).

### A6. What a model may use: `app-contract.json`

A file beside your application declaring what its models may name: the variables, functions, types, roles and APIs
([The application's contract](../app-contract.md)). The editor completes these names, `verifyModel` checks them, and
`GET /api/v3/application` answers them for an agent:

```json
{
  "name": "hr",
  "expressions": [
    { "kind": "var", "name": "hrForms", "type": "string", "description": "Where HR's own forms are served" },
    { "kind": "function", "name": "recordLeave", "params": [{ "name": "leave", "type": "object" }],
      "returns": "object", "async": true, "effect": "write", "description": "Records an approved leave" }
  ],
  "roles": [{ "name": "Manager", "title": "Manager", "description": "Approves their reports' leave" }],
  "apis": [{ "id": "hr", "openapi": "/api/hr/openapi.json" }]
}
```

A function the contract declares that your code lacks stops the start; one your code has and the contract does not is
a warning.

### A7. Wire it together: your entry point

One call, with your application's routes mounted before OmniWorkflow's (`apps/hrdemo/index.ts`):

```ts
import { start } from 'bpmn-web';

const webApp = await start({
    config: config(),
    appDelegate: AppDelegate,
    userManager: new MyUserManager(),
    elementTemplatesPath: connectorsPath,
    // your application, in this process: mounted before bpmn-web's routes
    routes: app => { myRoutes(app); myPages(app); },
    api: true,   // the REST APIs
    ui: true,    // the pages: tasks, instances, the model editor, administration
    setupOnly: process.argv.includes('--setup'),
    console: process.argv.includes('--cli'),
});
```

### A8. Your API as a connector, for service tasks with no code

Register your OpenAPI document once and a service task can call your API without code
([Connectors](../connectors.md)). The HR demo does it after `start`:

```ts
const kept = await server.connectors.get('hr');
if (!kept) await server.connectors.add({ id: 'hr', document: openapi, baseUrl });
else if (kept.baseUrl !== baseUrl) await server.connectors.update('hr', { baseUrl });
await server.connectors.setScheme('hr', { type: 'apiKey', in: 'header', name: 'x-hr-key' });
await server.engine.setConnectorKey('hr', process.env.MY_SERVICE_KEY);
```

The engine keeps the key encrypted with `SECRETS_KEY`. Keep that key: backups need the same one.

### A9. Your own forms (optional)

A task or a start event may use one of your application's pages instead of the fields OmniWorkflow draws
([form-keys.md](https://github.com/bpmnServer/bpmn-server/blob/main/docs/design/form-keys.md)):

1. Serve the page on a route of your own (`/forms/assignment`).
2. Declare where your forms are as a variable of your own, so no deployment's routes end up in a model:
   `myForms(): string { return process.env.MY_FORMS_URL ?? '/forms'; }`
3. In the model: `camunda:formKey="${appVars.myForms}/assignment"`.
4. Your page is sent identifiers only, never case data: `?instance=&item=` for a task, `?process=&start=` for a start
   event, each with `returnTo`. It reads and completes the task through API v3, as the person.
5. Your own task list can open that page itself: each task's `form.formKey` in `GET /api/v3/tasks` is the address
   already worked out. `apps/hrdemo/src/pages/AssignmentForm.jsx` and its To do panel are the example.

### A10. Tests

Each model's tests are a Gherkin `.feature` file beside it, with your services stubbed: `delegates/testServices.ts`,
a class with the same service names that answers as the real ones and sends nothing. `APP_ENV=test` makes the
application use it; production never loads it. See [Testing](../testing.md).

### A11. `.env`

Per-machine values and secrets, never committed. `npx bpmn-server init` writes one with new keys, and `npm run setup`
asks step by step. At least `PORT`, `MONGO_DB_URL`, `SESSION_SECRET`, `API_KEY` and `SECRETS_KEY`, plus your own
(`MY_SERVICE_KEY`, `MY_FORMS_URL`). All of them: [Settings](../settings.md).

## B. Remote: your application calls a running server

The detail is in [Integrate an existing application](../integrate.md). The order to do it in:

1. **Run a server**, and keep its `API_KEY` on your application's server. `GET /api/v3/openapi.json` describes the
   API, with no key.
2. **A token for each user**: `POST /api/v3/tokens` with `{ userName, groups, minutes }`, then call with
   `Authorization: Bearer <token>` so every call acts as that person under the models' rules. Revoke with
   `DELETE /api/v3/tokens?userName=` when they sign out.
3. **Start a process as a user**: `POST /api/v3/processes/{name}/start` with their token.
4. **Their tasks in your interface**: `GET /api/v3/tasks`, `GET /api/v3/tasks/{id}` (its data and its form),
   `POST /api/v3/tasks/{id}/claim`, `POST /api/v3/tasks/{id}/complete`.
5. **Your services**: a [connector](../connectors.md) to your REST API, with no code.
6. **Events in**: `POST /api/v3/messages/{id}` and `POST /api/v3/signals/{id}` with the key (the service account must
   be in `SYSTEM`). There are no inbound webhook routes: your own webhook handler calls the API.
7. **Deploy** with the engine on a private network behind your application
   ([Your application in control](../architecture.md#your-application-in-control)).

## Before you call it done

- `npx bpmn-server verify <model>` reports no errors on every model.
- The contract matches the code: the start says so.
- Every model has a `.feature` test, and it passes with the services stubbed.
- Your users' groups match the models' lanes, candidate groups and the contract's roles.
- Nothing secret is in a model or in `app-contract.json`: both are in git.
- `.env` is not committed, and `SECRETS_KEY` is kept where your backups can reach it.

## Next

- [The application's contract](../app-contract.md): what a model may name of your application
- [Connectors](../connectors.md): your REST API as a service task
- [Testing](../testing.md): Gherkin tests with your services stubbed
- [Settings](../settings.md): every value in `.env`
- [Integrating OmniWorkflow into your application](../customization.md): the responsibilities either way
