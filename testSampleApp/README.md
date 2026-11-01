# testSampleApp

The working application of bpmnServer4: the sample processes, connectors and delegates on bpmn-web, the
app to start and debug from, and the home of bpmn-web's tests.

## Run

```sh
cp .env.example .env      # then set MONGO_DB_URL
npm run setup             # the database's indexes and the first user (admin / admin)
npm start                 # or npm run debug (Node inspector); from the repository root: npm start
npm run cli               # the console
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

The tests use their own database and a copy of `test/processes`; they reach bpmn-web's built modules in
`../packages/bpmn-web/dist`, so build bpmn-web first (`npm run build` at the root).
