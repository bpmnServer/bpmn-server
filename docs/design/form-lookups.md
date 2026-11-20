# Form lookups: a field's choices from a source

Status: **built on `3.7.2`**. Decided 2026-11-18 with Ralph. Related: [app-contract.md](app-contract.md) (the model is
self-contained; the contract is guidance), [connectors-as-files.md](connectors-as-files.md),
[engine-isolation.md](engine-isolation.md).

## 1. What it is

A form field whose value must be one of a set of choices. Each choice has a **key**, which is saved as the field's
value, and a **display**, which is shown. The choices come from a **source** and are asked for **on demand**, while
the person fills the form. Nothing but the chosen value is saved.

Two kinds, each its own element on the field:

| | `<owf:list>` | `<owf:lookup>` |
|---|---|---|
| Shown as | a drop-down | a search box |
| Asks the source | once, with no text | each time the person types, with the text |

A fixed set of choices needs nothing new: Camunda's `type="enum"` with `camunda:value` children.

## 2. The syntax

```xml
<camunda:formField id="Department" label="Department" type="string">
  <owf:list source="service:departments" key="departmentId" display="name" />
</camunda:formField>

<camunda:formField id="CoveredBy" label="Covered by" type="string">
  <owf:lookup source="service:employees" key="userName" display="name" filter="${data.Department}" />
</camunda:formField>
```

| Attribute | Meaning | Default |
|---|---|---|
| `source` | `service:<name>`: a function of the application's services. `connector:<connector>/<operationId>`: a connector's operation | required |
| `key` | the row's field saved as the value (a dotted path) | `id` |
| `display` | the row's field shown | the key |
| `filter` | more criteria: a data path, `${data.<field>}`, read from the form's values, then the case's data | none |
| `text` | a connector lookup's input that takes the text typed | none: the whole answer is read and searched by the server |
| `filterInput` | a connector's input that takes the filter's value | none |
| `items` | where the rows are in the answer (a dotted path) | the answer when it is a list, else its first list |

The element lives in the model, on the field: **the model is self-contained** ([app-contract.md](app-contract.md) §2).
The application contract may later describe the services and operations, for the editor to offer them; it is never
read to run a form.

## 3. The sources

**A service** is called as `service(criteria, context)`:
- `criteria`: `{ text }` for a lookup, `{ filter }` when the field has one;
- `context`: who asks and from where: `{ user: { userName, userGroups }, processName, elementId, instanceId?, taskId? }`.
  This becomes the standard context object when that is settled (app-contract.md §2.2).

It answers the rows, or an object holding them.

**A connector** is called with the text as its input `text` and the filter as its input `filterInput`. Its key stays
with the server.

Either way the rows become `[{ key, display }]`: rows without a plain key are left out, at most 50.

## 4. Where it runs

- **The engine calls the source** (`formChoices`, an engine call): the application's code and the connectors' keys
  are there. With the engine in its own process the host has neither ([engine-isolation.md](engine-isolation.md)).
- **The host decides who may ask, and the criteria.**
  - A task's choices: as the person who would complete it; the same 404 for a task that is not theirs.
  - A start form's: for a process they may start.
  - The filter is read by the host from the form's values and the case's data.
- **The source is the model's, never the caller's:** a caller names the field, and the engine reads its source from
  the model.

## 5. The API

| Call | Body | Answers |
|---|---|---|
| `POST /api/v3/tasks/{id}/choices/{field}` | `{ text?, data? }` | `{ items: [{ key, display }] }` |
| `POST /api/v3/processes/{name}/choices/{field}` | `{ text?, data?, startNodeId? }` | the same |

- `data` is the form's values as they are, which a filter reads first.
- Errors:
  - 404 `NO_CHOICES`: the field has no list or lookup;
  - 400 `BAD_TEXT`;
  - 502 `CHOICES_FAILED`: the source failed.

A form's description (`GET /tasks/{id}`, `GET /processes/startable`) gives each such field `list` or `lookup`:
`{ source, key, display, filter? }`.

## 6. What is saved

- **The key:** the field's value, `data.CoveredBy = 'maria.garcia'`.
- **The label:** beside it, `data.CoveredByDisplay = 'Maria Garcia'`. The form can then show it again without asking,
  and the case keeps the name as it was when chosen.

The drawn forms send both; an application's own form sends `<id>Display` itself if it wants it kept.

## 7. Checked by `verifyModel`

| Code | |
|---|---|
| `lookup-source` | no source, or not `service:` / `connector:<connector>/<operationId>` |
| `lookup-service-unknown` | the application's services have no such function |
| `connector-unknown`, `connector-operation-unknown` | as for a service task |
| `lookup-input-unknown` | `text` or `filterInput` is not an input of the operation |
| `lookup-input-missing` | the operation needs another input, or a body: a list or lookup sends only its text and filter |
| `lookup-filter` | the filter is not a data path |
| `lookup-filter-unsent` | a connector's filter with no `filterInput` |
| `lookup-no-text` (info) | a connector lookup with no `text`: the whole answer is read at each search |
| `lookup-and-list` | more than one on a field: the first is used |

## 8. The editor

Each field of the properties panel's Form fields list has **Choices** (none, List, Lookup) and, once set, Source, Key,
Display and Filter; a `connector:` source also has Text input (a lookup), Filter input and Rows at
(`modeler/src/addons/forms/FormChoicesEntries.jsx`). The editor's descriptors (`modeler/src/moddle.js`) define
`owf:List` and `owf:Lookup`: without them it dropped the elements, as unknown, when it saved the model.

## 9. Not yet

- Choosing several (`multiple`).
- Checking, when a task is completed, that the value sent is one of the choices.
- A data object or data store as a source. Decided against for now: BPMN's data objects and stores are data flow, loaded
  when a task starts and written when it completes; a lookup is interaction, asked for on demand.
