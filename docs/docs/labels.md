# Labels

A case is known by what identifies it: *Client: abc · Order: 1234*, not only by its case id. Its model says what
that is, with a **label**: a template saved in the model, with its values named. The pages show each case and task
by its label: the Instances and Pending Tasks lists, My work, and the instance page.

## A case's label

On the process, in the editor's **Label** group (*Case label*), or in the XML:

```xml
<bpmn:process id="Expense" camunda:label="Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}">
```

- **`${Name = data.path}`** is a **named value**: shown in the text, and known by its name.
- **`${data.path}`** is plain text: shown, not named.
- **The text around the placeholders** is shown as written.

A case with `{ clientId: 'abc', orderNo: 1234 }` is shown as `Client: abc · Order: 1234`.

**A missing value takes its name along.** If `data.clientId` is empty, `Client: ` goes too, and the case is shown
as `Order: 1234`. When every value is missing, the default applies.

## An element's label

Any element on the diagram may have its own, in the **Label** group:

- **Label**, while it runs: `Approve ${Amount = data.amount} for ${instance.Client}`.
- **Label once done**, once it has ended: `Approved by ${completedBy}`.

The instance page shows an element's label under its name. A task with no label of its own is shown in the lists by
its name and its case's label: *Approve · Client: abc · Order: 1234*. A task with one is shown by its label and its
case's: *Approve 240 for abc — Client: abc · Order: 1234*.

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

When they are shown, from the case's data and from **the case's own model**: a case keeps the model it started
with, so a later version of the model doesn't relabel it. Nothing is stored. An element that has ended shows its
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

## Next

Named values are known by their names and the data paths they read: the lists will offer them as columns and
filters (Client contains "ab"), querying those paths. See the design, `docs/design/labels.md`.
