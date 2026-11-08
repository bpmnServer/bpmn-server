# Custom persistence

Where instances, models and everything else are kept, and how to change it. The application's configuration, in `settings/config.ts` or an embedded server's own, takes these options.

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

## ModelDataStore Options
### MongoDB
This the preferred and default option, models are saved and loaded in MongoDB 
Additionally, if you define a definitionsPath in configuration.ts, ModelsDatastore will monitor your path for changes, allowing you to edit bpmn files externally.
### Remote-Load-Only
This option can be used for minimal installation by having models at a remote location


