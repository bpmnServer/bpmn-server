# The engine's scenarios

`npm run test:scenarios` runs every `processes/<model>.engine.feature`, each scenario a test, through `features.test.mjs`. They are Gherkin (`docs/design/gherkin-testing.md`), beside the models they run, and the Test tab does not show them.

They use a MongoDB database of their own, which each run empties first: `BPMN_SCENARIOS_DB`, default `bpmn_scenarios`, at `BPMN_TEST_MONGO_URL`, default the local server.

| | |
|---|---|
| `features.test.mjs` | Runs them |
| `testConfiguration.js` | Their server's settings |
| `../../processes/` | Their models, the app's own: a change to one can fail them. `*-engine-test` models are theirs alone |
