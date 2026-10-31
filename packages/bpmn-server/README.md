# Overview Home

`bpmn-server` is a BPMN-based workflow engine that integrates easily into your Node.js app. It supports built-in state persistence, variable management, and concurrency across clusters—ideal for long-running processes, durable services, and scheduled tasks.

## Architecture Overview

The following diagram illustrates the core components of `bpmn-server` and how they interact:

![Architecture Diagram](https://bpmnserver.github.io/docs/images/architecture-diagram.png)

- **Modeler**: Front-end UI for designing BPMN models using bpmn.io.
- **bpmn-server Core**: Executes BPMN workflows, manages state, and interfaces with external services.
- **Datastore**: Persists workflow state, variables, and history (MongoDB by default).
- **Application Layer**: Your Node.js app that integrates with the server, handles user authentication, and invokes workflows.

## Quick Start

### Using the Demo Project

```sh
# 1. Clone the demo app
$ git clone https://github.com/bpmnServer/bpmn-web.git
$ cd bpmn-web

# 2. Install dependencies
$ npm install

# 3. Run setup to create default install files
$ npm run setup

# 4. Edit `.env` file.

# 5. Run setup to create database and models
$ npm run setup

# 6. Start the server
$ npm run start
```

Open your browser to [http://localhost:3000](http://localhost:3000) to launch the demo.

### Programmatic Usage Example

```js
const { BPMNServer, DefaultAppDelegate } = require('bpmn-server');
const { configuration } = require('./configuration');

const server = new BPMNServer(configuration, new DefaultAppDelegate());

const processName = 'invoice';
const inputData = { amount: 1200 };

(async () => {
    const result = await server.engine.start(processName, inputData);
    console.log('Process started with instance id:', result.instance.id);
})();
```

For more advanced examples, see the [API documentation](https://bpmnserver.github.io/docs/api).

---

## Modeling

`bpmn-server` provides a modeling tool based on `bpmn.io` with a customized property panel, eliminating the need to manually edit BPMN files.

![](https://bpmnserver.github.io/docs/images/Modeler.png)

You can also import BPMN models from other tools.

Each model is defined in a BPMN XML file and consists of various elements. An `element` can be a `node` (such as events, tasks, or gateways) or a `flow`.

Models are managed by `bpmn-server` and can be queried using the [Model API](https://bpmnserver.github.io/docs/api/interfaces/IAPIModel).

All BPMN 2.0 elements are supported. [See Modeling Support](https://bpmnserver.github.io/docs/examples)

## Execution

`bpmn-server` is primarily an execution engine for BPMN models.

Each time a model is started, an `instance` is created. For every `element` that is executed, an `item` is generated.

Execution follows the BPMN model logic and supports extensions such as scripting and application context access.

During execution, both Model Listeners and Application Listeners are invoked.

Access the execution engine via the [Engine API](https://bpmnserver.github.io/docs/api/interfaces/IAPIEngine).

- [Invoking the Execution Engine](https://bpmnserver.github.io/docs/invokation)
- [Execution Behavior](https://bpmnserver.github.io/docs/execution)

## Datastore

Execution data, including instances and their elements, are persisted to a datastore (MongoDB by default).

You can query this data through the [Data API](https://bpmnserver.github.io/docs/api/interfaces/IAPIData).

- [Data Management Documentation](https://bpmnserver.github.io/docs/data)

## User Management and Security

`bpmn-server` delegates authentication to the front-end application, which must pass user information via the API.

1. Model designers can define `assignee`, `candidateUsers`, and `candidateUserGroups` using static strings or JavaScript expressions.
2. The front-end must provide a `userService` implementation.
3. `bpmn-server` enforces security rules based on the current user.

The `bpmn-web` demo application demonstrates full user management using Passport and MongoDB.

- [Security Documentation](https://bpmnserver.github.io/docs/security)

## Demo Web Application

<details>
<summary>Explore the `bpmn-web` demo application.</summary>

Features include:

- Persistent modeling tool (based on `bpmn.io`)
- Property panel supporting all `bpmn-server` features
- Execution with input forms for defined fields

![](https://bpmnserver.github.io/docs/images/inputFields.png)

- Task and workflow lists
- Instance detail view

![](https://bpmnserver.github.io/docs//images/instance-details1.png)

- Model specification viewer

![](https://bpmnserver.github.io/docs//images/instance-details2.png)
</details>

## Live Demo

A live demo is available at: [https://bpmn.omniworkflow.com](https://bpmn.omniworkflow.com)

## Installation

This package requires Node.js and MongoDB.

If MongoDB is not installed, you can [create a free cloud account](http://bit.ly/cyd-atlas) or [install it locally](https://www.mongodb.com/docs/manual/installation/).

### 1. Clone the repository
```sh
git clone https://github.com/bpmnServer/bpmn-web.git
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up the app
```sh
npm run setup
```

Edit the `.env` file to configure MongoDB:
```env
MONGO_DB_URL=mongodb://0.0.0.0:27017/bpmn
```

Run setup again to create DB objects:
```sh
npm run setup
```

### 4. Start the server
```sh
npm run start
```

Console output:
```text
bpmn-server WebApp.ts version 1.4.0
MongoDB URL mongodb://0.0.0.0:27017/bpmn
db connection open
App is running at http://localhost:3000 in development mode
Press CTRL-C to stop
```

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
npm update bpmn-server
```

## Application Integration

`bpmn-server` is designed to be embedded into your application. [See customization guide](https://bpmnserver.github.io/docs/customization)

## Documentation

- [Invoking Workflows](https://bpmnserver.github.io/docs/invokation)
- [Execution](https://bpmnserver.github.io/docs/execution)
- [Scripting](https://bpmnserver.github.io/docs/scripting)
- [Security](https://bpmnserver.github.io/docs/security)
- [Data](https://bpmnserver.github.io/docs/data)
  - [Input/Output](https://bpmnserver.github.io/docs/data#input-output-data)
  - [Data Query](https://bpmnserver.github.io/docs/data#dataQuery)
- [Examples](https://bpmnserver.github.io/docs/examples)
- [API Summary](https://bpmnserver.github.io/docs/api-summary)
- [API Reference](https://bpmnserver.github.io/docs/api)
- [Setup](https://bpmnserver.github.io/docs/setup)
- [Application Integration](https://bpmnserver.github.io/docs/customization)

## License

Licensed under the MIT License.

## Acknowledgments

`bpmn-server` builds upon [bpmn-io/bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) by [bpmn.io](http://bpmn.io), and is inspired by [bpmn-engine](https://github.com/paed01/bpmn-engine).

