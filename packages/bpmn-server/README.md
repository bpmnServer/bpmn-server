# Overview Home

`bpmn-server` is a BPMN-based workflow engine that integrates easily into your Node.js app. It supports built-in state persistence, variable management, and concurrency across clusters—ideal for long-running processes, durable services, and scheduled tasks.

## Architecture Overview

The following diagram illustrates the core components of `bpmn-server` and how they interact:

![Architecture Diagram](https://bpmnserver.github.io/bpmn-server/images/architecture-diagram.png)

- **Modeler**: Front-end UI for designing BPMN models using bpmn.io.
- **bpmn-server Core**: Executes BPMN workflows, manages state, and interfaces with external services.
- **Datastore**: Persists workflow state, variables, and history (MongoDB by default).
- **Application Layer**: Your Node.js app that integrates with the server, handles user authentication, and invokes workflows.

## Quick Start

### Create an application

```sh
npx bpmn-server init my-app      # asks for the database; --memory to try it without MongoDB
cd my-app
npm run setup                    # the database's indexes
npm start                        # http://localhost:3000
```

Open your browser to [http://localhost:3000](http://localhost:3000). The first page asks for the administrator, with the setup token the server printed when it started.

`init` creates the sample application, with `bpmn-server` and `bpmn-web` as its dependencies;
`npx bpmn-server init --help` lists its options, and `--minimal` creates a one-model Hello application
instead. `init` ships with bpmn-server 3.5.

```
my-app/
  package.json      deps: bpmn-server, bpmn-web; scripts: start, dev, setup, cli, verify
  .env              generated keys, the database URL, what is served
  index.ts          starts bpmn-web with the settings, delegate and connectors below
  settings/         config.ts: only the settings you override; bpmn-web supplies the defaults
  processes/        the models: Hello, Buy Used Car, Leave Application, employee-onboarding, Business Rules, GitHub repository
  connectors/       the services service tasks call (appServices.ts), and element templates (*.json)
  delegates/        the app delegate (on bpmn-web's WebAppDelegate): services, data objects, events
```

### Install on a server

On a new Linux server (Ubuntu 22.04 or 24.04), one line installs everything (Node.js, MongoDB, the application,
nginx, a service; HTTPS with `--domain`) and prints the address and a generated admin password:

```sh
curl -fsSL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/install.sh | sudo bash
```

It also works as a cloud server's launch script (AWS Lightsail's "Add launch script"). See
[deploy/](https://github.com/bpmnServer/bpmn-server/tree/main/deploy).

### Call it from another application (bpmn-client)

```sh
npm install bpmn-client
npx bpmn-client-setup            # writes .env: set API_KEY to the server's, HOST and PORT to where it runs
npx bpmn-client-cli              # a console on the server: start processes, list and invoke items
```

```js
import 'dotenv/config';
import { BPMNClient2 } from 'bpmn-client';

const client = new BPMNClient2(process.env.HOST, process.env.PORT, process.env.API_KEY);
const instance = await client.engine.start('Hello', { name: 'Ada' });
```

See [bpmn-client](https://bpmnserver.github.io/bpmn-server/bpmn-client) for its API.

### Programmatic Usage Example

```js
import { BPMNServer, Logger } from 'bpmn-server';
import { configuration } from './configuration.js';

const server = await BPMNServer.create(configuration, new Logger({ toConsole: false }));

const result = await server.engine.start('invoice', { amount: 1200 });
console.log('Process started with instance id:', result.instance.id);
```

For more advanced examples, see the [API documentation](https://bpmnserver.github.io/bpmn-server/api).

---

## Modeling

`bpmn-server` provides a modeling tool based on `bpmn.io` with a customized property panel, eliminating the need to manually edit BPMN files.

![](https://bpmnserver.github.io/bpmn-server/images/Modeler.png)

You can also import BPMN models from other tools.

Each model is defined in a BPMN XML file and consists of various elements. An `element` can be a `node` (such as events, tasks, or gateways) or a `flow`.

Models are managed by `bpmn-server` and can be queried using the [Model API](https://bpmnserver.github.io/bpmn-server/api/interfaces/IAPIModel).

All BPMN 2.0 elements are supported. [See Modeling Support](https://bpmnserver.github.io/bpmn-server/examples)

## Execution

`bpmn-server` is primarily an execution engine for BPMN models.

Each time a model is started, an `instance` is created. For every `element` that is executed, an `item` is generated.

Execution follows the BPMN model logic and supports extensions such as scripting and application context access.

During execution, both Model Listeners and Application Listeners are invoked.

Access the execution engine via the [Engine API](https://bpmnserver.github.io/bpmn-server/api/interfaces/IAPIEngine).

- [Invoking the Execution Engine](https://bpmnserver.github.io/bpmn-server/invokation)
- [Execution Behavior](https://bpmnserver.github.io/bpmn-server/execution)

## Datastore

Execution data, including instances and their elements, are persisted to a datastore (MongoDB by default).

You can query this data through the [Data API](https://bpmnserver.github.io/bpmn-server/api/interfaces/IAPIData).

- [Data Management Documentation](https://bpmnserver.github.io/bpmn-server/data)

## User Management and Security

`bpmn-server` delegates authentication to the front-end application, which must pass user information via the API.

1. Model designers can define `assignee`, `candidateUsers`, and `candidateUserGroups` using static strings or JavaScript expressions.
2. The front-end must provide a `userService` implementation.
3. `bpmn-server` enforces security rules based on the current user.

The `bpmn-web` demo application demonstrates full user management using Passport and MongoDB.

- [Security Documentation](https://bpmnserver.github.io/bpmn-server/security)

## Demo Web Application

<details>
<summary>Explore the `bpmn-web` demo application.</summary>

Features include:

- Persistent modeling tool (based on `bpmn.io`)
- Property panel supporting all `bpmn-server` features
- Execution with input forms for defined fields

![](https://bpmnserver.github.io/bpmn-server/images/inputFields.png)

- Task and workflow lists
- Instance detail view

![](https://bpmnserver.github.io/bpmn-server/images/instance-details1.png)

- Model specification viewer

![](https://bpmnserver.github.io/bpmn-server/images/instance-details2.png)
</details>

## Live Demo

A live demo is available at: [https://bpmn.omniworkflow.com](https://bpmn.omniworkflow.com)

## Installation

This package requires Node.js 20 or later and MongoDB (or `--memory`, to try it without one).

If MongoDB is not installed, you can [create a free cloud account](http://bit.ly/cyd-atlas), [install it locally](https://www.mongodb.com/docs/manual/installation/), or run the one `init` puts in the application (`docker compose up -d`).

```sh
npx bpmn-server init my-app --mongo mongodb://localhost:27017/my-app
cd my-app
docker compose up -d             # a MongoDB on this machine, if you do not have one
npm run setup                    # the database's indexes and the first user
npm start
```

The application's settings are in `.env` (the database, the port, the API keys, what is served) and
`settings/config.ts`.

## Docker Installation

<details>
<summary>Install `bpmn-server` and dependencies with Docker.</summary>

### 1. Create a project folder

### 2. Add a `docker-compose.yml` file:
```yaml
version: "3.7"
name: bpmn-server
services:
  bpmn-web:
    image: ralphhanna/bpmn-web
    command: sh -c "
        npm run setup &&
        npm run start"
    ports:
      - 3000:3000
    volumes:
      - 'app:/app'
    depends_on:
      - mongo

  mongo:
    image: mongo
    ports:
      - 27017:27017
    volumes:
      - mongodb:/data/db

volumes:
  mongodb:
    driver: local
    driver_opts:
      type: 'none'
      o: 'bind'
      device: './mongodb_volume'

  app:
    driver: local
    driver_opts:
      type: 'none'
      o: 'bind'
      device: './bpmn_server_volume'
```

### 3. Start the container
```sh
docker compose up -d
```
</details>

## Command Line Interface

<details>
<summary>Use `bpmn-server` via CLI for common operations.</summary>

```sh
npm run cli

server started..
Commands:
  q     quit
  s     start process
  lo    list outstanding items
  li    list items
  l     list instances for a process
  di    display instance information
  i     invoke task
  sgl   signal task
  msg   message task
  d     delete instances
  lm    list models
  lme   list model elements
  ck    check locked instances
  re    recover hung processes
  lu    list users
  spw   set user password
  ?     show this help menu
```
</details>

## Updating to Latest Release
```sh
npm update bpmn-server bpmn-web
```

## Application Integration

`bpmn-server` is designed to be embedded into your application. [See customization guide](https://bpmnserver.github.io/bpmn-server/customization)

## Documentation

- [Invoking Workflows](https://bpmnserver.github.io/bpmn-server/invokation)
- [Execution](https://bpmnserver.github.io/bpmn-server/execution)
- [Scripting](https://bpmnserver.github.io/bpmn-server/scripting)
- [Security](https://bpmnserver.github.io/bpmn-server/security)
- [Data](https://bpmnserver.github.io/bpmn-server/data)
  - [Input/Output](https://bpmnserver.github.io/bpmn-server/data#input-output-data)
  - [Data Query](https://bpmnserver.github.io/bpmn-server/data#dataQuery)
- [Examples](https://bpmnserver.github.io/bpmn-server/examples)
- [API Summary](https://bpmnserver.github.io/bpmn-server/api-summary)
- [API Reference](https://bpmnserver.github.io/bpmn-server/api)
- [Setup](https://bpmnserver.github.io/bpmn-server/setup)
- [Application Integration](https://bpmnserver.github.io/bpmn-server/customization)

## License

Licensed under the MIT License.

## Acknowledgments

`bpmn-server` builds upon [bpmn-io/bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) by [bpmn.io](http://bpmn.io), and is inspired by [bpmn-engine](https://github.com/paed01/bpmn-engine).

