# testSampleApp

The working application of bpmnServer4: the sample processes, connectors and delegates on bpmn-web, the
app to start and debug from, and the home of bpmn-web's tests.

## Run

```sh
cp .env.example .env      # then set MONGO_DB_URL
npm run setup             # the database's indexes and the first user (admin / admin)
npm start                 # or npm run debug (Node inspector); from the repository root: npm start
npm run cli               # the console
npm run dev               # from the packages' sources, restarting on changes (dev:debug: with the inspector)
```

## What is where

| | |
|---|---|
| `settings/config.ts` | bpmn-server settings that replace bpmn-web's defaults. |
| `processes/` | The sample models. |
| `connectors/` | Element templates (`*.json`) and the services they call (`appServices.ts`). |
| `delegates/` | The app delegate (`appDelegate.ts`, on bpmn-web's `WebAppDelegate`) and the logic it uses. |
| `scripts/` | `setupDemoUsers.ts` (`npm run setup:users`). |
| `index.ts` | Starts bpmn-web with the above. |
| `test/` | bpmn-web's tests, run against this app (`npm test`, `npm run test:ui`). |
| `test/scenarios/` | the engine's feature scenarios, on this app's delegate (`npm run test:scenarios`). |
| `test/custom/` | Tests of this app's models (`npm run test:custom`), in memory on its delegate and services: TypeScript (`*.test.ts`, with `test/support/testApp.ts`) and scenario files (`*.json`, the model editor's Test tab format). |

## Testing a model

In TypeScript, with `testApp()`: it starts this application in memory (no MongoDB, no timers), and `run`
drives an instance.

```ts
const app = await testApp();                       // { services: { name: stub } } replaces services
const run = await app.start('Buy Used Car', { caseId: 1 }, 'buyer');
await run.complete('task_Buy', { needsRepairs: 'No', needsCleaning: 'No' });
assert.equal(run.item('task_Drive').status, 'wait');
// also: run.waiting(), run.items(id), run.data, run.status, run.message(name), run.signal(name), run.log()
```

Or as a scenario file, `test/custom/<name>.json`: `{ "model": "...", "scenarios": [ { "name", "start", "steps",
"checks" } ] }` (see `buy-used-car.json`).

To debug, in VS Code: **Test: current file** (a `.test.ts`) or **Scenarios: current file** (a `.json`); breakpoints
work in the test, in `connectors/` and `delegates/`, and in the packages' `src`. A model's scripts are listed under
Loaded Scripts as `bpmn:///<model>/<element>/<label>.js`, and `debugger;` in a script stops there; an error in one
names that location in its stack.

The tests use their own database and a copy of `test/processes`; they reach bpmn-web's built modules in
`../packages/bpmn-web/dist`, so build bpmn-web first (`npm run build` at the root).
