# BPMN by example

Each page here takes one BPMN element or pattern: what it does in BPMN Server, the model's XML for it, and what the
engine does when it runs. The models are in the sample application's `apps/testSampleApp/processes/`, each with its
`.feature`, run by the test suite: open one in the model editor and run its Test tab to watch it.

| Element | What it shows |
|---|---|
| [Service task](examples/serviceTask.md) | Calling your application's service |
| [Script task](examples/scriptTask.md) | A script on the case's data |
| [Business rule task](examples/Business%20Rules.md) | A DMN decision table, called by the model |
| [Conditional flow](examples/conditionalFlow.md) | A path taken when its condition holds |
| [Script listeners](examples/scriptEvents.md) | Scripts on an element's start and end |
| [Gateways](examples/gateways.md) | Exclusive, parallel and inclusive |
| [Event-based gateway](examples/ebg.md) | Whichever event comes first |
| [Multiple start events](examples/multiStartEvent.md) | One model, several ways to start it |
| [Input fields](examples/inputFields.md) | A form's fields on a user task |
| [Boundary events](examples/boundary-events.md) | A timer, error or message on a task |
| [Messages](examples/msg-throw-catch.md) | Two processes talking, and how a message finds its instance |
| [Signals](examples/signal-throw-catch.md) | One throw, every waiting instance |
| [Errors and escalations](examples/error_events.md) | Failing a step, and catching it |
| [Call activity](examples/callProcess.md) | One process calling another |
| [Multi-instance (loops)](examples/loop.md) | A task for each item, in sequence or in parallel |
| [Subprocess](examples/subProcess.md) | Steps grouped inside a process |
| [Transactions](examples/transactions.md) | Compensation when a transaction is cancelled |
| [Ad-hoc subprocess](examples/adHoc.md) | Tasks done in any order |
| [Timers](timers.md) | Deadlines, delays and repeating timers |

Every element and attribute BPMN Server supports, with its tests: [Features](features.md).
