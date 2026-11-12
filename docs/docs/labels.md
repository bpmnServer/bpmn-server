# Labels

A case is known by what identifies it: *Car: Porsche 911 · Buyer: staff*, not only by its case id. Its model says
what that is, with a **label**: a template saved in the model, with its values named. The pages show each case and
task by its label: the Instances and Pending Tasks lists, My work, and the instance page; and the lists can be
filtered by its named values.

The pictures on this page are the sample application's *Buy Used Car*, whose model has these labels:

| Element | Label | Label once done |
|---|---|---|
| The process | `Car: ${Car = data.carModel} · Buyer: ${Buyer = data.starterUserId}` | |
| Buy | `Buy the ${data.carModel}` | `Bought by ${completedBy}` |
| Repair | `Repair the ${data.carModel}` | `Repaired by ${completedBy}` |
| Clean | `Clean the ${data.carModel}` | `Cleaned by ${completedBy}` |
| Drive | `Test drive the ${data.carModel}` | `Driven by ${completedBy}` |

## A case's label

On the process, in the editor's **Label** group (*Case label*), or in the XML:

```xml
<bpmn:process id="Expense" camunda:label="Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}">
```

![The process selected: its Label group, Case label](images/labels/editor-case-label.png)

- **`${Name = data.path}`** is a **named value**: shown in the text, and known by its name.
- **`${data.path}`** is plain text: shown, not named.
- **The text around the placeholders** is shown as written.

A case with `{ clientId: 'abc', orderNo: 1234 }` is shown as `Client: abc · Order: 1234`.

**A missing value takes its name along.** If `data.clientId` is missing (none, null, empty, or only spaces),
`Client: ` goes too, and the case is shown as `Order: 1234`. Zero and `false` are values. When every value is
missing, the default applies.

## An element's label

Any element on the diagram may have its own, in the **Label** group:

- **Label**, while it runs: `Approve ${Amount = data.amount} for ${instance.Client}`.
- **Label once done**, once it has ended: `Approved by ${completedBy}`.

![Drive selected: its Label and Label once done](images/labels/editor-element-label.png)

### In the editor

Under each label field:

- **A preview:** the label filled in from the Test tab's scenario: its last run's data, else its start data
  (*Client: acme · Order: 1234 · Acme claim's start data*). An element's label sees its fields from that run, and
  the case's named values as `instance.*`. With no scenario open in the Test tab, it says so.
- **Its named values**, a row each: change a name (a caption that says the old name, `Order: `, follows) or a path
  in place; × removes one with its caption; *Add* appends one, captioned (`· Amount: ${Amount = data.amount}`). A
  name used twice, or a path that isn't one, is marked before it can be added.

### Where labels are shown

**Instances:** the Case column.

![The Instances list: the Case column](images/labels/instances.png)

**Pending Tasks:** the Label column, the task's own label and its case's. A task with no label of its own shows its
name and its case's label: *Approve · Client: abc · Order: 1234*.

![Pending Tasks: the Label column](images/labels/pending-tasks.png)

**My work:** each task's own label under its name, and its case's label in the Case column.

![My work: the Case column, a task's label under its name](images/labels/my-work.png)

**The instance page:** the case's label at the top, and each element's under its name: a waiting one's label, an
ended one's *label once done*.

![The instance page: the case's label](images/labels/instance-header.png)

![The instance page's items: Bought by staff, Repair the Porsche 911, Cleaned by manager](images/labels/instance-items.png)

## What a placeholder can name

Placeholders are **data, never scripts**:

| In | Placeholder | Value |
|---|---|---|
| A case's label | `data.…` | The case's data |
| | `model` | The model's name |
| An element's label | `data.…` | Its data: the case's, or a loop round's or a sub-process's own |
| | `completedBy`, `assignee`, `userName`, `status`, `startedAt`, `endedAt`, `name` | Its own fields |
| | `instance.<Name>` | A named value of its case's label: `${instance.Client}` |

Paths are names separated by dots; `__proto__`, `prototype` and `constructor` are refused. The editor marks a
placeholder that isn't a path, or a name used twice, as you type, and `verifyModel` (Problems) reports it
(`label-template`).

A value is shown as text: a date in ISO form, a list joined with commas, an object as JSON.

## When labels are filled in

When they are shown, from the case's data and from **the model the case runs**: with `SAVE_SOURCE=true` a case
keeps the model it started with, so a later version of the model doesn't relabel it; without it, a case runs (and
is labeled by) the model's current version. Nothing is stored. An element that has ended shows its
*Label once done* filled from its data as it is now; a label that must stay as it was should use the element's own
fields (`completedBy`).

## The defaults

| Element | Without a label |
|---|---|
| A case | The application's `instanceLabel(instance)`, else `<model> #<caseId>`, else the model's name |
| A user task | Its name and its case's label |
| Any other element | None |

`instanceLabel` is an optional method of the application's delegate, for labels that must be computed in code:

```ts
class AppDelegate extends WebAppDelegate {
    instanceLabel(instance) {
        return `Claim ${instance.data.claimNo}`;
    }
}
```

## In code

The pages fill labels in with `labelInstances(server, instances)` and `labelItems(server, items)` (bpmn-server):
each case gets `label` and `labelValues` (its named values), each task `label`, `ownLabel`, `caseLabel` and
`labelValues`. `fillTemplate(template, scope)` and `templateProblems(template)` fill in and check one template.

## Filters

The Workbench's Instances and Pending Tasks sections each have a filter bar, and so does My work. Each filters its own
list, and using one doesn't clear the other. Tasks are filtered by the named values of their cases:

![The filter bar: Car contains porsche](images/labels/filter-bar.png)

- **Model:** only that model's cases.
- **Field:** a named value of the models' case labels (*Car*, *Buyer*), which **contains** or **is** a value. Its
  tooltip says where each model reads it from (`Buy Used Car: data.carModel`).
- **Search everything:** any named value of any model.

The filter is a database query on the data paths the named values read: *Car contains porsche* is `data.carModel`
contains "porsche" (any case) for Buy Used Car's cases, and on each model's own path when several models name a
*Car*. A number matches as a number too (*Order is 1234*). It's in the URL (`/?field=Car&op=contains&value=porsche#instances`),
so a filtered list can be bookmarked and shared.

![Instances, filtered: Car contains porsche](images/labels/instances-filtered.png)

![Pending Tasks, filtered: Car contains porsche](images/labels/pending-tasks-filtered.png)

Pending Tasks' settings have their own names in the URL: `/?task_field=Car&task_op=contains&task_value=porsche#tasks`.

Filters query the data as it is; they need no index. On many cases, indexes on the paths filtered most will matter,
but indexing is configuration, apart from labels.

In code: `labelFields(server)` lists the named values the models offer, and `labelQuery(fields, filter)` makes the
query (`{ model, field, op, value, search }`), to add to `findInstances` or `findItems`.

## In API v3

Every task and instance API v3 answers carries its label, filled in the same way when it is answered:

- **A task** (`GET /tasks`, `GET /tasks/{id}`, a claim, a completion, a start's first task): `label` (its own, else
  its name, then its case's), `labelValues` (its own named values), `caseLabel` and `caseLabelValues`.
- **An instance** (`GET /instances`, `GET /instances/{id}`, a start's and a completion's): `label` and
  `labelValues`; on `GET /instances/{id}`, each item with a label of its own has `label` and `labelValues` too.

A named value is `{ name, path, value }`. `GET /tasks` and `GET /instances` take the lists' filter:
`field`, `op` (`contains`, the default, or `is`), `value`, and `search`; `model` on `/tasks` and `name` on
`/instances` limit it to one model. An `op` other than those two is a 400 `BAD_FILTER`.

```
GET /api/v3/tasks?field=Client&op=is&value=acme
GET /api/v3/instances?name=Buy%20Used%20Car&search=porsche
```

`/api` and `/api2` are unchanged: they answer no labels.

Columns of named values in the lists are next. See the design, `docs/design/labels.md`.
