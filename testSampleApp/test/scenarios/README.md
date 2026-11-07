# Engine scenarios

The feature scenarios (a mocha suite, moved here from bpmn-server): each `feature/*.js` drives models in testSampleApp's `processes/` through the public API (start, invoke, assign, messages, signals, timers, loops, gateways, sub-processes, call activities, transactions, errors, escalations, restarts) and checks the items and data each step leaves. They run on testSampleApp's delegate (`delegates/appDelegate.ts`) and services (`connectors/appServices.ts`).

```sh
npm run build                 # at the repository root: bpmn-server and bpmn-web
npm run test:scenarios        # in testSampleApp; BPMN_TEST_MONGO_URL (default mongodb://127.0.0.1:27017); database bpmn_scenarios, emptied first
```

| | |
|---|---|
| `feature/` | the scenarios (mocha, `mocha-cakes-2`: Feature, Scenario, Given, When, Then) |
| `../../processes/` | their models, the app's own: a change to one can fail them; `*-engine-test` models are theirs alone |
| `testConfiguration.js` | the engine's configuration: MongoDB, the models folder, the app's delegate |
| `helpers/setup.js` | chai as globals; the database emptied and its indexes made before the run |
| `logs/` | what scenarios write (not kept) |
