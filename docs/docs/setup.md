# Installation

## An application on bpmn-server and bpmn-web

```sh
npx bpmn-server init my-app      # asks for the database; --memory to try it without MongoDB
cd my-app
npm start                        # http://localhost:3000, sign in as admin / admin
```

`init` creates the sample application: `processes/` (Hello, Buy Used Car, Leave Application,
employee-onboarding, Business Rules),
`connectors/` (the services the models call, `appServices.ts`, and element
templates), `delegates/` (the app delegate, on bpmn-web's `WebAppDelegate`), `settings/config.ts` (the settings
you change), `index.ts` (starts bpmn-web) and `.env`. `--minimal` creates a one-model Hello application instead.
`npm run setup` prepares the database and stops, `npm run cli` opens the console, `npm run verify` checks the
models. (`init` ships with bpmn-server 3.5.)

### To Update

```sh
npm update bpmn-server bpmn-web
```

## The source, with the sample application

bpmn-server, bpmn-client, bpmn-web, the sample application (`sampleApp`) and the working application with the tests (`testSampleApp`) are one repository, [bpmnServer/bpmn-server](https://github.com/bpmnServer/bpmn-server):

```sh
git clone https://github.com/bpmnServer/bpmn-server.git
cd bpmn-server
npm install
npm run build
cd testSampleApp
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

## Storage

Instances and models are kept in MongoDB by default. The configuration's `documentStore` replaces it, for both
data stores:

- `SqliteDocumentStore(file)` keeps everything in one SQLite file (Node's built-in `node:sqlite`, Node 22.5 or
  later): no database server, for small installs, demos and desktop use. Several servers may share the file.
- `MemoryDocumentStore` keeps everything in memory, for tests and demos.
- An application can implement `IDocumentStore` to use its own database.

```ts
import { SqliteDocumentStore } from 'bpmn-server';

const store = new SqliteDocumentStore('./data/bpmn.sqlite');
const configuration = new Configuration({
    // ... as above
    documentStore: () => store,
});
```

Or in memory:

```ts
import { MemoryDocumentStore } from 'bpmn-server';

const store = new MemoryDocumentStore();
const configuration = new Configuration({
    // ... as above
    documentStore: () => store,
});
```

Two servers given the same store share it, as two servers on one database do.

## Data store options

```ts
dataStore: (server) => {
    const ds = new DataStore(server);
    ds.enableSavePoints = true;  // keep a save point for each item, so an instance can be restarted from it
    ds.saveLogs = true;          // save each instance's log with it (the default)
    ds.saveSource = true;        // save the model with each instance, so it runs to the end on the model it started with
    return ds;
},
```

## Processes Folder

This is where the definition files reside, the demo WebApp contains a set of those file for you to start with.

## AppDelegate Class

This class handles application specific calls. Extend `DefaultAppDelegate` and override what you need:

```ts
startUp(options);                       // the server starts
getServicesProvider(execution);         // the object whose methods service tasks call (default: the delegate)
serviceCalled(input, execution, item);  // a service task names no service the provider has
executionStarted(execution);
messageThrown(messageId, data, messageMatchingKey, item);
signalThrown(signalId, data, messageMatchingKey, item);
issueMessage(messageId, data);          // a message no process is waiting for
issueSignal(signalId, data);
sendEmail(to, msg, body);
moddleOptions;
```

## ModelDataStore Options
### MongoDB
This the preferred and default option, models are saved and loaded in MongoDB 
Additionally, if you define a definitionsPath in configuration.ts, ModelsDatastore will monitor your path for changes, allowing you to edit bpmn files externally.
### Remote-Load-Only
This option can be used for minimal installation by having models at a remote location


# Packages

| Package | |
|---|---|
| [bpmn-server](https://github.com/bpmnServer/bpmn-server) | the engine: execution, persistence (MongoDB or your own storage), the API, `verifyModel` and the `bpmn-server` command line |
| [bpmn-web](https://github.com/bpmnServer/bpmn-web) | a web application on bpmn-server: model editor, task lists, administration, and REST APIs |
| [bpmn-client](https://github.com/bpmnServer/bpmn-client) | calls a bpmn-web server's REST API from Node.js |
