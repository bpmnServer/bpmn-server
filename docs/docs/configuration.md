# Configuring the engine

An application that creates the engine itself gives it a `Configuration`: where the models are, where the cases are
stored, how timers behave, and which components to use. An application started by `npx bpmn-server init` has one in
`settings/config.ts`; one that [embeds the engine](embedding.md) writes its own.

A server takes one configuration object, so a test can start a server with different settings (another database,
faster timers) in the same process as another.

bpmn-server is an ES module and needs Node.js 20 or later.

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

## The models folder

`definitionsPath` is the folder holding the BPMN and DMN files, their tests and their version history. An application
made by `npx bpmn-server init` starts with a set of examples in it. `DEFINITIONS_PATH` in `.env` overrides it, which
is how tests and separate deployments point at another folder.
