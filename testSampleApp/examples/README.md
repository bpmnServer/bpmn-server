# Examples

One feature each, on a model of `processes/`, written to be read top to bottom and run. Each is a test on
`testApp()` (`test/support/testApp.ts`): the application in memory, on its own delegate and services.

```sh
npm run test:examples                                   # all of them
node --import tsx --test examples/invoice.test.ts       # one
```

In VS Code, **Test: current file** runs the open one under the debugger.

| Example | Model | Shows |
|---|---|---|
| [invoice](invoice.test.ts) | Invoice | an event-based gateway, a receive task, a terminate end event |
| [multi-instance-vote](multi-instance-vote.test.ts) | multi-inst | a parallel multi-instance sub-process, an item by its `itemKey`, each instance's data |
| [escalation](escalation.test.ts) | test-escalation | an escalation thrown in a sub-process, caught without interrupting it |
| [restart](restart.test.ts) | Buy Used Car | `engine.restart` of an ended instance, save points |
| [connector](connector.test.ts) | (none) | a REST API added as a connector (`connectors.add`, `setKey`) and called from code (`connectors.call('crm/getCustomer', ...)`); a 404 as a `ConnectorError` (`HTTP_404`) |

More in `test/custom/`, which is also where your own tests go: Buy Used Car (and as a scenario file), Leave
Application (a reminder timer), messages and signals, services and stubs, a sub-process.

The engine's own feature scenarios are in `test/scenarios/`, and the reported GitHub issues in `test/issues/`.
