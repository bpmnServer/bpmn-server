# Keep a waiting instance in SQLite

Use a 3.5.2 [starter app](../setup.md) and Node.js 22.5 or later. Configure SQLite before starting the app for
this example. Use a fresh app or database file so the run is easy to identify.

1. In `settings/config.ts`, import `SqliteDocumentStore` from `bpmn-server`. Below the existing
   `ROOT` declaration, add:

   ```ts
   const store = new SqliteDocumentStore(path.join(ROOT, 'workflow.sqlite'));
   ```

   Add `documentStore: () => store` to the object returned by `config()` and keep the existing
   `definitionsPath`.

2. Set `MONGO_DB_URL=mongodb://127.0.0.1:27017/bpmn` in `.env`. The 3.5.2 web launcher requires a value
   here. With the SQLite store configured, that URL is unused. The special value `memory` would start
   an embedded MongoDB before the web launcher applies the store setting.

3. Run `npm run setup` and then `npm start`. In the model editor, save a simple
   **Start → Review (user task) → End** process. Start it and record its instance ID when it waits at **Review**.
4. Stop the app and run `npm start` again. Open the instance with the same ID, complete **Review**, and
   check that the instance reaches **End**.

Keep `workflow.sqlite` and the definitions directory between runs. Model source, tests, and history have
their own [file locations](../modeler.md#where-models-tests-and-history-are-kept). See [Storage](../setup.md#storage)
for the store configuration.
