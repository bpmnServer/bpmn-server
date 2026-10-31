# What's new in the next release

!!! warning "Draft"
    For the release after bpmn-server 3.2. At release, give this page its version, move it out of drafts/, and
    add it, decisions.md, data-objects.md and modeler.md to the nav.

## Decisions (DMN)

Business rule tasks evaluate decisions as the DMN standard describes them: FEEL cells, every hit policy,
decision requirements diagrams and literal expressions; `camunda:decisionRef`, `camunda:resultVariable` and
`camunda:mapDecisionResult`. See [Decisions](decisions.md).

**Changed:** when no rule matches, a single-hit table's result is `null` (it was `{}`), and a multi-hit table's
is `[]`. Tables that relied on the earlier evaluator reading columns by their label need input expressions.

## Data objects

A data object connected to an element is loaded by the application (`appDelegate.loadDataObject`) when the
element runs, and kept in the instance data. See [Data objects](data-objects.md).

## Timers

- A timer more than 24.8 days away is waited out in steps everywhere. The scheduler did this since 3.1; a server
  without it (`cron: false`) fired such a timer at once. **3.0 and earlier fire them at once, and a start timer
  starts an instance every millisecond: upgrade.**
- A model's start timer record (`events[].timeDue`) is the first due time (it held an unawaited promise).

## Checking models

[`verifyModel`](../verify.md) also checks:

- business rule tasks against the decision files: `decision-not-named`, `decision-not-found`,
  `decision-invalid`, `decision-result-not-saved`, `decision-input-from-data` (info);
- data objects: `data-object-not-loaded`, `no-data-object-loader`;
- input and output parameters written like an expression without their `$`: `parameter-is-text`;
- multi-instance loop collections, which must compile as expressions;
- `appServices.<name>` in scripts and expressions against the application's services: calling one the services
  do not provide is an error, reading one a warning (`unknown-app-service`).

## Other

- `Definition.load()` starts over when called again (a second load listed each flow twice).
- `DMNEngine` and `DMNParser` are exported.
