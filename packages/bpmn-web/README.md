# bpmn-web

HTTP integration and web UI for `bpmn-server`.

The reusable `WebApp` host is independent of any particular workflow
application. An application supplies its own workflow definitions,
configuration, persistence adapters and service implementations through a
`WorkflowApplication`, usually through `start()`. The sample application, with its processes,
connectors and delegates, and bpmn-web's tests are in `testSampleApp/` at the repository root.

## Installation

### Requirements

* Node.js >= 10.x
* NPM >= 6.x
* MongoDB >= 4.x

### Installation
Setup .env with your mongodb connection string like so:

```bash
# PORT # for express application
PORT=3000

#API_KEY is used for remote access
API_KEY=12345
API_SERVICE_USER_NAME=integration
API_SERVICE_USER_GROUPS=SYSTEM
# Optional scope for a tenant service account:
# API_SERVICE_TENANT_ID=tenant-a
# API_SERVICE_MODELS_OWNER=tenant-a

# Separate credential for definition/model administration
ADMIN_API_KEY=replace-with-a-different-secret

# MongoDB Settings
MONGO_DB_URL=mongodb://0.0.0.0:27017/bpmn
#
... more settings
```

`/api2` uses this configured service identity for every API-key request. The
`user` object in a request body is ignored. Set the groups and optional tenant
to the permissions the integration needs. The legacy `/api` routes remain a
privileged API-key interface.

Install dependencies
```bash
git clone https://github.com/bpmnServer/bpmn-web.git

npm install

npm run setup
```

## Usage

### Standalone

`npm start` runs bpmn-web on its defaults: models in `./processes`, the `WebAppDelegate`, no element
templates. The sample application is started from the repository root (`npm start`) or `testSampleApp/`.

### Command line

A console for the same server and database: start processes, list and invoke items, send messages and signals,
list models and users, set a user's password (`?` lists the commands, `q` quits):

```bash
npm run cli
```

Commands can also be piped in, e.g. `printf 'lo\nq\n' | npm run cli` lists the outstanding items.

### Model editor

The model editor is built from source in `modeler/`: bpmn-js with a properties panel that shows the settings
bpmn-server runs (user assignment, who can start, service names, scripts on events, forms, inputs and outputs),
and a Problems list: bpmn-server checks the model as it is edited (`verifyModel`), and an issue takes you to
its element and field.
`npm start` and `npm run build` build it into `public/modeler/`; while working on it, rebuild on change with:

```bash
npm run watch:modeler
```

[modeler/PROPERTIES.md](modeler/PROPERTIES.md) is the catalog of the panel's properties: by element, what each
writes to the model file and what bpmn-server does with it when the process runs.

#### Testing models

The editor's **Test** tab keeps test scenarios for the model and runs them step by step. **Start** starts the
process with the scenario's start data and shows the user tasks and events that wait as the next steps, each with
its data and the instance page's button (**Execute** a user task, **Force** an event); running a step shows what
waits next, until nothing waits. The data chooses the branches, and which
step you run first chooses between elements that wait together (events of an event-based gateway, a boundary
timer, parallel tasks). The steps you run are saved as the scenario's, so **Run** and **Run all** repeat them on a
new instance without stopping, and check what the scenario expects at the end (status, data values, elements passed and not
passed). Each scenario keeps its runs (the latest 20) with their instances, so its last
run is shown when it is opened, and any earlier run can be opened again. **Simulate** plays a run on the diagram:
an element turns blue when it starts and green when it ends (a joining gateway waits for its last branch), orange
if it still waits; numbered in the order they started; **Pause**, **Continue** and **Step** while it plays.
Test runs are ordinary instances whose ids start with `test-`.

#### Element templates

Configured tasks (a service task that calls a given service with its inputs, a user task for a given group)
are element templates in the [Camunda 7 template format](https://docs.camunda.io/docs/components/modeler/desktop-modeler/element-templates/c7-element-templates/),
one or more per `*.json` file in the application's `elementTemplatesPath` (the sample's are in
`testSampleApp/connectors/`). The editor offers them under **Template** in the
properties panel.

A template is offered only if bpmn-server runs everything it sets: `property` bindings of the attributes
the engine reads (the service name, user assignment, form key, decision, called process, script), input and
output parameters, and JavaScript execution listeners. Templates that set anything else (Java classes, field
injection, connectors, `camunda:property`, `camunda:in/out`) are left out, with the reason in the server log
and in `GET /model/templates`. A template that names a service the application does not provide is offered,
with a warning.

Models are designed by users in the `DESIGNER` group and by administrators (`ADMIN`, `SYSTEM`).

Set `MODELER=classic` to use the previous editor (the prebuilt `modeller-withPropertyPanel.js`) instead.

### Embed the web adapter in an application

```ts
import { WebApp, defineWorkflowApplication } from 'bpmn-web';
import { configuration } from './workflow/configuration.js';

const workflowApplication = defineWorkflowApplication({ configuration });
const webApp = new WebApp(workflowApplication);

webApp.start();
```

Constructing `WebApp` composes the Express application and workflow runtime.
Calling `start()` is explicit, so tests or a larger application can mount
`webApp.app` without opening another listener.
