# bpmn-web

HTTP integration and web UI for `bpmn-server`.

The reusable `WebApp` host is independent of any particular workflow
application. An application supplies its own workflow definitions,
configuration, persistence adapters and service implementations through a
`WorkflowApplication`. The bundled `src/sample-app` provides the standalone
demo configuration only.

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

### Standalone sample application

Start the bundled sample application with:

```bash
npm start
```

### Model editor

The model editor is built from source in `modeler/`: bpmn-js with a properties panel that shows the settings
bpmn-server runs (user assignment, who can start, service names, scripts on events, forms, inputs and outputs).
`npm start` and `npm run build` build it into `public/modeler/`; while working on it, rebuild on change with:

```bash
npm run watch:modeler
```

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
