# Design: labels that say what their values are

Status: **draft for discussion.** 2026-11-04, on branch `labels-rebuild`. Labels only: roles, assignment and
approvals are separate designs.

## The problem

A case is known by its business identity: *Client 5001*, *Order 1234*. The labels branch gives every case and task
a label, but the label is free text. A pattern like `${data.clientId}` shows **5001**, and nothing says what 5001
is. The meaning exists only if the person writing the pattern types it, and even then the system can't tell which
word is the name and which is the value, so it can't offer a *Client* column or filter.

## Decisions so far

1. **The model defines its labels,** for the case and for each activity. Only the model knows what its process is
   about and where its data is.
2. **The application defines what is shared across its models, later:** roles, data objects and data stores. Not
   labels. So labels need no application configuration; the configuration file (and its name) comes with roles.
3. **A label is a display template saved in the model,** with its values **named in their placeholders**:
   `Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}`. The template gives the text exactly as
   the modeler wrote it, and the named placeholders give the structure.
4. **Nothing is stored.** A label is computed **when it is shown**, from the case's data. Change a model's label
   and every case shows the new one.
5. **Filters work on the data paths** the named placeholders read (`data.clientId`), queried in the database on
   the data that is already there.

## What changes on the branch

| Piece | The branch today | With this design |
|---|---|---|
| A case's label | `camunda:label` pattern, else the `instanceLabel` hook, else `labels.instance` in `app.config.json`, else `<model> #<caseId>`; computed at save, stored as `instance.label` | `camunda:label` template with named placeholders, else the hook, else `<model> #<caseId>`; computed when shown, not stored |
| An activity's label | `camunda:label`, `camunda:endLabel`; computed at save, kept when it ends | The same attributes, as templates; computed when shown |
| A user task with no label | Its name and the case's label | The same |
| Extra columns (#281) | `views.*.columns` in `app.config.json` | Columns from the named placeholders of the models listed; `views` goes |
| Stored `instance.label`, `item.label`, `labelKept`, their indexes | Yes | Removed |
| `app.config.json`, `APP_CONFIG`, `labels.*` | Read at start | Removed from the labels PR; the file comes back with roles |

## Proposal

### 1. The template

`camunda:label` on the process (the case), and `camunda:label` and `camunda:endLabel` on any activity, are display
templates:

```xml
<bpmn:process id="Expense" camunda:label="Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}">
<bpmn:userTask id="Approve" camunda:label="Approve ${Amount = data.amount} for ${instance.Client}"
                            camunda:endLabel="Approved by ${completedBy}">
<bpmn:process id="Onboarding" camunda:label="New hire: ${data.name}">
```

- **`${Name = path}`** is a **named value**: shown in the text, and offered as a column and a filter under its
  name, querying its path.
- **`${path}`** is plain text: shown, not named.
- **Text around the placeholders** is shown as written: the modeler decides the format.
- **A missing named value** takes the text just before it along: if `data.clientId` is empty, `Client: ` is left
  out too, so the label reads `Order: 1234`, not `Client:  · Order: 1234`. When everything is missing, the default
  applies.

### 2. What a placeholder may contain

Templates are filled in on every list, for every viewer, so placeholders are **data, never scripts**:

| Placeholder | Value |
|---|---|
| `data.…` | The case's data; for an activity, its own data (a loop round's or a subprocess's) |
| `completedBy`, `assignee`, `status`, `startedAt`, `endedAt` | The activity's own fields |
| `instance.<Name>` | A named value of the case's label, in an activity's label: `${instance.Client}` |
| `model` | The model's name |

Paths are plain names only: no `__proto__`, `prototype` or `constructor`, and own fields only (the checks PR #281
introduced). `verifyModel` reports a placeholder that isn't one, and a name used twice in one template.

Values are shown as text: a date as a date, a list joined, an object as JSON, everything escaped.

### 3. When and where it is computed

- **When it is shown:** by the page or the API that lists the cases or tasks, from the data it already reads.
- **From the case's own model version:** a case keeps its model's source, so an old case is labeled by the
  template it ran with, and doesn't break when a newer version renames a path.
- **Ended activities** show `endLabel` when they have one, filled from their own fields (`completedBy`) and their
  own data. A value taken from the case's data shows the data as it is now, not as it was when the activity
  ended; labels that must stay as they were should use the activity's own fields or data.

### 4. The defaults

| Element | With no `camunda:label` |
|---|---|
| A case | The application's `instanceLabel(instance)` hook (the delegate: an optional escape hatch for labels computed in code), else `<model> #<caseId>`, else the model's name |
| A user task | Its name and its case's label: *Approve · Client: abc · Order: 1234* |
| Any other element | No label |

## How it looks

Three models and two tasks, as an example:

| Model | `camunda:label` on the process |
|---|---|
| Expense | `Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}` |
| Change Request | `${Project = data.project} (${Priority = data.priority})` |
| Onboarding | `New hire: ${data.name}` |

| Task | `camunda:label` | `camunda:endLabel` |
|---|---|---|
| Expense → Approve | `Amount: ${Amount = data.amount} · Level: ${Level = data.level} of ${data.levels}` | `Approved by ${completedBy}` |
| Change Request → Review | none (the default) | none |

### Instances, all models

The filter bar is built from the named values of the models listed.

```
┌ Instances ───────────────────────────────────────────────────────────────────────────┐
│ Model [All ▾]   Field [Any ▾]   Value [            ]   🔍 Search everything [       ] │
├──────────────────┬────────────────────────────────────┬──────────┬──────────────────┤
│ Model            │ Case                               │ Started  │                  │
├──────────────────┼────────────────────────────────────┼──────────┼──────────────────┤
│ Expense          │ Client: abc · Order: 1234          │ 2 h ago  │ Examine          │
│ Change Request   │ Upgrade (High)                     │ 3 h ago  │ Examine          │
│ Expense          │ Client: xyz · Order: 1240          │ 1 d ago  │ Examine          │
│ Onboarding       │ New hire: Ann Lee                  │ 1 d ago  │ Examine          │
└──────────────────┴────────────────────────────────────┴──────────┴──────────────────┘
```

*Field* offers each named value with the path it queries:

```
Field ▾
  Client     (Expense: data.clientId)
  Order      (Expense: data.orderNo)
  Project    (Change Request: data.project)
  Priority   (Change Request: data.priority)
```

### Filtered by a field

```
│ Model [All ▾]   Field [Client ▾]   Value [contains ▾ "ab"]                [× Clear]  │
├──────────────────┬────────────────────────────────────┬──────────┤
│ Expense          │ Client: abc · Order: 1234          │ 2 h ago  │
│ Expense          │ Client: abby-co · Order: 1188      │ 4 d ago  │
```

The query is on `data.clientId` of the Expense cases. Two models that name `Client` from the same path share the
entry; from different paths, the entry queries each model's own.

### One model

Its named values become columns, in the template's order.

```
┌ Instances · Expense ─────────────────────────────────────────────────────┐
│ Field [Any ▾]   Value [      ]                                           │
├──────────┬────────┬──────────────────────────────────────┬───────────────┤
│ Client ▲ │ Order  │ Case                                 │ Started       │
├──────────┼────────┼──────────────────────────────────────┼───────────────┤
│ abc      │ 1234   │ Client: abc · Order: 1234            │ 2 h ago       │
│ xyz      │ 1240   │ Client: xyz · Order: 1240            │ 1 d ago       │
└──────────┴────────┴──────────────────────────────────────┴───────────────┘
```

### Search everything

One box, matching any named value's path of any model listed:

```
│ 🔍 Search everything [ upgrade        ]
│ Change Request │ Upgrade (High)                         ← found in data.project
│ Expense        │ Client: upgrade-labs · Order: 1302     ← found in data.clientId
```

### Pending Tasks

```
┌ Pending Tasks ────────────────────────────────────────────────────────────────────────┐
│ Model [All ▾]   Field [Any ▾]   Value [            ]   🔍 Search everything [       ] │
├──────────┬────────────────────────────────────────────────────────────┬──────────────┤
│ Task     │ Label                                                      │ Assignee     │
├──────────┼────────────────────────────────────────────────────────────┼──────────────┤
│ Approve  │ Amount: 240 · Level: 1 of 2 — Client: abc · Order: 1234    │ manager      │
│ Approve  │ Amount: 9000 · Level: 2 of 3 — Client: xyz · Order: 1240   │ director     │
│ Review   │ Review · Upgrade (High)                                    │ (cab)        │
└──────────┴────────────────────────────────────────────────────────────┴──────────────┘
```

### The instance page

```
┌ Expense ─────────────────────────────────────────────────────────────────┐
│ Client: abc · Order: 1234                              running · 2 h ago │
├─────┬─────────────────────┬──────────────────────────────────┬───────────┤
│ Seq │ Element             │ Label                            │ Status    │
├─────┼─────────────────────┼──────────────────────────────────┼───────────┤
│ 1   │ Start               │                                  │ end       │
│ 3   │ Approve             │ Approved by ann                  │ end       │
│ 6   │ Approve             │ Amount: 240 · Level: 2 of 2      │ wait      │
└─────┴─────────────────────┴──────────────────────────────────┴───────────┘
```

### How the filters behave

- **The field list** comes from the templates of the models listed: each named value, with its path. It follows
  the model filter.
- **The value control:** *contains* and *is* for text; *from–to* for numbers and dates; a pick list for a value
  with a few known choices.
- **Where it is:** on the Workbench, one bar in the Instances section and one in Pending Tasks, each filtering its
  own list, each kept in the URL under its own names; on My work, a bar for the tasks listed. Tasks are filtered by
  their cases' named values; a task's own (*Task: Amount*) are not offered yet.
- **Every value a label shows is a field,** text-only labels (Onboarding) too: the field filter and *search
  everything* reach any `${data.…}` placeholder: a named one by its name, a plain one by its path's last
  name; a model with no case label through *caseId*. Field *Any* with a value looks in every field.
- **Filters combine,** with each other and with the model filter, and become one database query on the cases'
  data (per model, on its own paths), with paging.
- **The URL keeps the filter** (`?field=Client&op=contains&value=ab`), so a filtered list can be bookmarked and
  shared.

The **APIs** return each case's and task's label, computed the same way, and accept the same filters.

**A note on indexing.** Filters query the cases' data paths as they are; they work without indexes. On large
numbers of cases, indexes on the paths that are filtered most will matter, but indexing is a separate issue:
which paths to index, in which store, is configuration (the installation's or the application's), and is not part
of this design.

## The editor

On the process and on any activity, a **Label** group:
- the template, with a **preview** filled from the Test tab's data;
- a bad path, or a name used twice, marked as you type.

## Security and data

- Templates hold data paths, never scripts, so filling them in for any viewer runs no model code.
- Named values are shown wherever the case or task is listed. Anyone who can see it sees them, as with Case Id
  today. The docs should say not to put a private value in a label.
- Values are escaped when shown.

## How this answers PR #281

PR #281 added columns of instance data to the Instances list and Pending Tasks, configured in `.env`
(`INSTANCE_COLUMNS`, `TASK_COLUMNS`). The discussion on it asked broader questions. This design is the labels
part of the answer; roles and assignment are a separate design.

| Raised on #281 | Answer here |
|---|---|
| A case needs a human-readable **business identity** (*Order 1234 — Acme*), not only a case id | The model's label template, with named values: `Client: ${Client = data.clientId}` |
| Distinguish **display identity** (one label everywhere) from **additional columns** (a view's preference) | The label is the case's, the same in every list and API. Columns are its named values, offered by the lists |
| Should the **application** define labels, the **model** declare them, or the model override an application default? | The model defines them. The application's only part is the optional `instanceLabel` hook, for labels computed in code |
| Missing values, changes over time, **stored or live** labels | Live: computed when shown, from the case's own model version. A missing named value is left out with the text before it |
| **`.env` for installation only**; application behavior in its own configuration; process behavior in the model | Labels are process behavior, so they are in the model; nothing in `.env`. The application's configuration is for roles, data objects and data stores, later |
| A future server hosting **several applications** | Labels are per model, and models belong to an application, so nothing here is global |

What #281 contributed still matters: reading values safely (plain names; no `__proto__`, `prototype` or
`constructor`; own fields only), showing lists, objects and dates as text, escaping, and the tests of both. Labels
and their columns are filled in with that code. #281's `.env` settings, and the `views` setting the branch moved
them to, are replaced by the named values of the models' labels.

The end-user portal stays open, as on #281: its filters find columns by position, and need to find them by name
before named-value columns can be added there.

## Open questions

1. **Columns across models.** With several models listed, should every named value be a column, or only the names
   more than one model uses? The others stay visible in the label either way.
2. **Pick lists.** Where do a value's few choices come from: the values the listed cases have, or a list in the
   model (a form's choices)?

## Phases

1. Templates with named values for `camunda:label` and `camunda:endLabel`, filled in when shown; the defaults;
   `verifyModel` checks; the stored labels, `app.config.json` and `views` out of the labels PR.
2. The lists: the Case and Label columns, per-model columns, the filter bar and search everything, as database
   queries on the named paths; the filter in the URL.
3. The APIs: labels in results, the same filters. *Done in API v3* (`routes/api/labels.ts`); `/api` and `/api2`
   stay as they are.
4. The editor's Label group. *Done:* the template checked as typed, and its preview from the Test tab's scenario.
   A table of named values was tried and left out: a label is one expression.
