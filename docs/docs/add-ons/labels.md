# Labels (add-on)

The **Labels** add-on names each case and task from its data: a case `Client: acme · Order: 1234`, a task
`Approve 90`. Turn it on or off on its page of the [Settings page](../integration-settings.md)
(**Dashboard ▸ Settings ▸ Labels**).

## What it does

- A process's `owf:label` is its cases' label; a task's `owf:label` its own, and `owf:endLabel` once it is done.
  Each is a template of the case's data: see [Labels](../labels.md).
- The values a label names are the lists' columns and filters ([list columns](../list-columns.md)).
- Without a template, the application's `instanceLabel` hook labels a case.

## Its settings

None of its own.

## When it is off

A case is shown as `<model> #<caseId>`, a task by its name. A model keeps its labels; the engine ignores them.
