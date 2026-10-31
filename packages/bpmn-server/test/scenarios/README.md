# Engine scenarios

The feature scenarios of bpmn-web (its mocha suite), moved here to ship and run with the engine: each `feature/*.js` drives models in `processes/` through the public API (start, invoke, assign, messages, signals, timers, loops, gateways, sub-processes, call activities, transactions, errors, escalations, restarts) and checks the items and data each step leaves.

```sh
npm run build                 # the engine, from vendor/bpmn-server
npm run test:scenarios        # BPMN_TEST_MONGO_URL (default mongodb://127.0.0.1:27017); database bpmn_scenarios, emptied first
```

| | |
|---|---|
| `feature/` | the scenarios (mocha, `mocha-cakes-2`: Feature, Scenario, Given, When, Then) |
| `processes/` | their models |
| `app/` | the application delegate the models call (services, `appUtils`), in plain JavaScript |
| `testConfiguration.js` | the engine's configuration: MongoDB, the models folder, the delegate |
| `helpers/setup.js` | chai as globals; the database emptied and its indexes made before the run |
| `logs/` | what scenarios write (not kept) |
