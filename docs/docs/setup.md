# Installation

## An application on bpmn-server and bpmn-web

```sh
npx bpmn-server init my-app      # asks for the settings step by step; --memory --yes to try it without MongoDB
cd my-app
npm start                        # http://localhost:3000: the first page asks for the administrator
```

`init` creates the sample application: `processes/` (Hello, Buy Used Car, Leave Application,
employee-onboarding, Business Rules, GitHub repository),
`connectors/` (the services the models call, `appServices.ts`, and element
templates), `delegates/` (the app delegate, on bpmn-web's `WebAppDelegate`), `settings/config.ts` (the settings
you change), `index.ts` (starts bpmn-web) and `.env`. `--minimal` creates a one-model Hello application instead.
`npm run setup` asks the settings step by step (below), then prepares the database and stops (with no terminal, as
in a script, it only prepares the database); `npm run cli` opens the console, `npm run verify` checks the
models. (`init` ships with bpmn-server 3.5.)

### The settings, step by step

```sh
npx bpmn-server setup my-app     # a new application, then its settings; in an application's folder: npx bpmn-server setup
```

`init`, at a terminal, asks the same steps after the folder and what the application serves. `setup` asks for the
settings in `.env` step by step: the database (checked: it answers), the first administrator,
the site's address, sign-in and model design, email, the API keys, AI access, and the environment and API trace. It
starts with a profile, **production** or **development**, which suggests the values; Enter keeps the value shown.
Nothing is written until you confirm the summary (secrets shown as `***`), and the `.env` before is kept as `.env.bak`.
Run it again any time to change them. `--yes` asks nothing: the profile's values and new keys where there are none
(`--profile production|development`, `--no-check`). It reads the settings schema of bpmn-web 3.7 or later.

### The first start

A new server has no users. When it starts, it prints a **setup token**, and its pages ask for the administrator: open it,
give the token, and choose the administrator's name, email and password. It can also add the tutorials' sample users,
`user1` and `manager1`. Then you're signed in, and the setup page is gone.

The token is there because whoever reaches a new server first could otherwise make themselves its administrator: only someone
who can read the server's console or log has it. Its REST APIs and `/healthz` work while it waits.

With `ADMIN_PASSWORD` set, the first start makes `admin` with that password instead, and asks nothing. The Docker files and
the server install script set it.

### To Update

```sh
npm update bpmn-server bpmn-web bpmn-mcp
```

### On a server, in one line

On a new Linux server (Ubuntu 22.04 or 24.04), one line installs everything (Node.js, MongoDB, the application,
nginx, a service; HTTPS with `--domain`) and prints the address and a generated admin password:

```sh
curl -fsSL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/install.sh | sudo bash
```

It also works as a cloud server's launch script (AWS Lightsail's "Add launch script"). See
[deploy/](https://github.com/bpmnServer/bpmn-server/tree/main/deploy).

## AI clients (MCP)

Every application `init` creates with the REST APIs includes `bpmn-mcp`, which lets an AI client use the server: list models, start processes, complete tasks. `.mcp.json` registers it for clients that read one, such as Claude Code. It reads the application's `.env`, and the server has to be running.

!!! warning
    It gets what the keys in `.env` allow, including deleting instances and replacing models. To stop it changing models, point `BPMN_ENV_FILE` at a file of its own without `ADMIN_API_KEY`.

For Codex, Claude Desktop and other clients, or to add it to an existing application, see the [bpmn-mcp README](https://github.com/bpmnServer/bpmn-server/tree/main/packages/bpmn-mcp).

## Ways to run it

Every setting is listed in [Settings](settings.md). An application runs in one of these ways. [Architecture](architecture.md) explains the parts.

| Setup | Engine | Settings |
|---|---|---|
| **Development and test** | In the host's process | None: the default |
| **Production** | In its own process | `ENGINE_AT`, `ENGINE_KEY` |
| **Design only** | None: models can be edited and saved, but nothing runs | `ENGINE_AT=none` |

### Development and test

`npm start` is all it takes: the host and the engine share one process, with your delegate and services in it.

### Production

The engine runs in its own process, with your delegate, services and timers. The host holds none of them, and asks the engine over HTTP.

Start the engine, with a secret of your choosing as its key:

```sh
ENGINE_KEY=your-secret npm run engine
```

Then start the host, pointing at it:

```sh
ENGINE_AT=http://127.0.0.1:3001 ENGINE_KEY=your-secret npm start
```

`npm run engine` runs the application's `engine.ts`. `apps/testSampleApp/engine.ts` in the repository is the one to copy, because `npx bpmn-server init` doesn't create it yet.

| Setting | On | Means |
|---|---|---|
| `ENGINE_AT` | Host | The engine's address. Unset or `local`: in this process. `none`: no engine |
| `ENGINE_KEY` | Both | The secret the host sends and the engine checks |
| `ENGINE_PORT` | Engine | Its port. Default `3001` |
| `ENGINE_LISTEN` | Engine | The address it listens on. Default `127.0.0.1`, this machine only |

- **Give both processes the same database and models folder.** They read and write the same instances and models.
- **Keep the engine private.** Only the host should be able to reach it. Change `ENGINE_LISTEN` only if the host is on another machine, and then only on a private network.
- **Turn design off, on both.** `DISABLE_DESIGN=true` removes the model editor, the Design dashboard and test runs from the host's pages, and the test calls from the engine. Without it, anyone with `ENGINE_KEY` can run a test's scripts on the engine. Models then arrive through the admin REST APIs, and the admin APIs stay on.
- **Leave tests out of a deployment.** A production server doesn't run them, so don't deploy `*.feature` files.
- **Check the settings the server refuses to start without.** See [Security](security.md).

### Design only

`ENGINE_AT=none` starts the host with no engine. Models can be edited and saved, and anything that would run says an engine is needed.

## The source, with the sample application

bpmn-server, bpmn-client, bpmn-web, the sample application (`sampleApp`) and the working application with the tests (`testSampleApp`) are one repository, [bpmnServer/bpmn-server](https://github.com/bpmnServer/bpmn-server):

```sh
git clone https://github.com/bpmnServer/bpmn-server.git
cd bpmn-server
npm install
npm run build
cd apps/testSampleApp
cp .env.example .env             # set MONGO_DB_URL
npm run setup
npm start
```

## bpmn-client: another application calling the server

bpmn-client calls a running bpmn-server application over its REST API, from another Node.js application (in a
new folder, or an existing project):

```sh
npm init -y && npm pkg set type=module      # a new project; skip in an existing one
npm install bpmn-client
npx bpmn-client-setup                       # writes .env: API_KEY, HOST, PORT
```

Set `.env` to the server: `API_KEY` is the server's (from its `.env`), `HOST` and `PORT` where it runs.

```sh
npx bpmn-client-cli                         # a console on the server: start processes, list and invoke items
```

```js
import 'dotenv/config';
import { BPMNClient2 } from 'bpmn-client';

const client = new BPMNClient2(process.env.HOST, process.env.PORT, process.env.API_KEY);
const instance = await client.engine.start('Hello', { name: 'Ada' });
```

See [bpmn-client](bpmn-client.md) for the API. To update: `npm update bpmn-client`.

# Setup bpmn Application with bpmn-server

## Configuration

Every project must have a configuration file that is an instance of [Configuration class](api/classes/Configuration.md)

This configuration file is passed to the BPMNServer constructor.

For testing purposes, you can have a different configuration than production in same environemnt by passign a different object.

## Example

bpmn-server 3 is an ES module and needs Node.js 20 or later.

```ts
import { Configuration, DataStore } from 'bpmn-server';
import { MyAppDelegate } from './appDelegate.js';

export const configuration = new Configuration({
    definitionsPath: import.meta.dirname + '/processes/',
    timers: {
        precision: 3000,
    },
    database: {
        MongoDB: {
            db_url: 'mongodb://localhost:27017?retryWrites=true&w=majority',
            db: 'bpmn',
        },
    },
    /* Server components: each one left out keeps its default */
    appDelegate: (server) => new MyAppDelegate(server),
    dataStore: (server) => new DataStore(server),
});
```

The components are made by factories, each given the server: `definitions` (`ModelsDatastore`), `appDelegate`
(`DefaultAppDelegate`), `dataStore` (`DataStore`), `scriptHandler` (`ScriptHandler`), `cacheManager`
(`NoCacheManager`; `CacheManager` keeps running instances in memory). The logger is the server's second argument.

Start a server with it, and stop it when your application stops:

```ts
import { BPMNServer, BPMNAPI, Logger } from 'bpmn-server';
import { configuration } from './configuration.js';

const server = await BPMNServer.create(configuration, new Logger({ toConsole: false }));
const api = new BPMNAPI(server);

// ...

await server.shutdown();
```

`BPMNServer.create` waits until the server has started (the application delegate's `startUp`, then the timers).
`new BPMNServer(...)` starts it too; `await server.ready` waits for it. Pass `{ cron: false }` as the third
argument to start a server that does not fire timers (a script or a test).

`shutdown()` refuses new engine calls, cancels the server's timers, gives running executions `shutdownTimeout`
milliseconds to finish, and closes its connections. Several servers can run in one Node.js process, each with
its own engine, cache, listeners and timers.

## Options

| Option | |
|---|---|
| `definitionsPath` | the folder of model files |
| `timers.precision` | milliseconds; timers due within it fire together |
| `timers.forceTimersDelay` | milliseconds; every timer fires after this delay (for testing). When `timers` is not given at all, the default is `{ forceTimersDelay: 1000, precision: 3000 }`: give `timers` in production |
| `timers.pollInterval` | milliseconds between re-reads of waiting timers, so a timer another server scheduled fires here when that server is gone (default 60000; 0: never) |
| `database.MongoDB` | `db_url`, `db`, and optionally the collections: `Locks_collection`, `Instance_collection`, `Archive_collection` |
| `documentStore(server)` | the storage both data stores use (MongoDB when absent); see [Storage](#storage) |
| `locker(server)` | the lock manager (the data store's own when absent) |
| `serverId` | this server's identity as a lock owner (default `SERVER_ID`, else the host, the process id and a random suffix) |
| `locks.retryDelay` | milliseconds between lock tries (1500) |
| `locks.maxTries` | tries before a lock gives up (20) |
| `locks.staleAfter` | milliseconds after which a lock or timer claim is stale and another server may take it (300000) |
| `shutdownTimeout` | how long `shutdown()` waits for running executions, in milliseconds (10000) |
| `definitions`, `appDelegate`, `dataStore`, `scriptHandler`, `cacheManager` | the server's components (factories) |

Things that usually differ between development and production: the timers (`forceTimersDelay`, `precision`) and
the database.

Storage, and the options of the data stores: [Custom persistence](persistence.md). The app delegate: [Custom delegates](delegates.md).

## Processes Folder

This is where the definition files reside, the demo WebApp contains a set of those file for you to start with.

# Packages

| Package | |
|---|---|
| [bpmn-server](https://github.com/bpmnServer/bpmn-server) | the engine: execution, persistence (MongoDB or your own storage), the API, `verifyModel` and the `bpmn-server` command line |
| [bpmn-web](https://github.com/bpmnServer/bpmn-server/tree/main/packages/bpmn-web) | a web application on bpmn-server: model editor, task lists, administration, and REST APIs |
| [bpmn-client](https://github.com/bpmnServer/bpmn-server/tree/main/packages/bpmn-client) | calls a bpmn-web server's REST API from Node.js |
| [bpmn-mcp](https://github.com/bpmnServer/bpmn-server/tree/main/packages/bpmn-mcp) | connects AI clients to a running server over MCP; `npx bpmn-server init` installs it |
