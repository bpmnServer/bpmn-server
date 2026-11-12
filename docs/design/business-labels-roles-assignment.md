# Business labels, task roles and assignment — design note

**Status:** The overview agreed on [PR #281](https://github.com/bpmnServer/bpmn-server/pull/281) and
[PR #286](https://github.com/bpmnServer/bpmn-server/pull/286). It records who owns what, and where each part is
specified and built. The parts have their own design notes:

- **Labels:** [labels](https://github.com/bpmnServer/bpmn-server/blob/3.7.1/docs/design/labels.md)
  ([user guide](https://github.com/bpmnServer/bpmn-server/blob/3.7.1/docs/docs/labels.md));
- **Roles and assignment:** [assignment policies](https://github.com/bpmnServer/bpmn-server/blob/3.7.1/docs/design/assignment.md)
  ([user guide](https://github.com/bpmnServer/bpmn-server/blob/3.7.1/docs/docs/assignment-policies.md)).

Both are built on branch `3.7.1`, which carries all of 3.7. Assignment policies are a first try, open to change once
they've been used. The HR demo's Leave Application uses both.

**Related:** [API v3](api-v3.md); [Several applications on one server, and tenants](multi-app-tenants.md);
[Application integration](../docs/application-integration-design.md); [Settings](../docs/settings.md).

## 1. Why

The Instances list and the Pending Tasks table identified an instance by its model name and its Case Id. People
look for an order number, a customer or a reference from another system. PR #281 added extra columns from `.env`.
The review agreed the need but not the place: business meaning and presentation are not the installation's, and a
global setting would get in the way of one server hosting several applications.

It asked three questions, answered here:

1. **A display label:** one business identity for a case (`Client: abc · Order: 1234`), the same everywhere (§3).
2. **Extra list columns:** a view's preference, on the same data (§4).
3. **Task roles and assignment:** a model says *who in business terms*; something says *which users*; the engine
   saves the answer and enforces it (§5).

## 2. Ownership

| Layer | Owns | Where |
|---|---|---|
| Installation | Port, database, logging, secrets, what differs per machine | `.env` / environment |
| Model | Its case's and its elements' labels; which assignment policy a user task uses | `camunda:label`, `camunda:endLabel`, `camunda:assignmentPolicy`, lanes |
| Application | Its roles; its assignment policies; code that finds a person or labels a case | The models folder: `roles.json`, `policies/assignment/<name>.dmn.xml`. The delegate: `instanceLabel`. Its services: what a policy's `$(...)` calls |
| Engine | Fills in labels when they're shown; evaluates a policy when a task starts and saves the result; enforces lifecycle and permissions | bpmn-server |

Rules:

- **`.env` is for the installation only.** Nothing in this design is in `.env` or in `settings/config.ts`.
- **Code stays out of settings.** Code is on the delegate or in the application's services. A policy's `$(...)`
  output may call those services.
- **Nothing is global.** Labels belong to models, and roles and policies to the application's models folder, so the
  design fits a later multi-application server (§7).
- **No `configuration.json`.**
- **Security policies** are a separate design, with their own folder beside the assignment policies
  (`policies/security/`): [security policies](https://github.com/bpmnServer/bpmn-server/blob/3.7.1/docs/design/security-policies.md).

## 3. Display label

Built on `3.7.1`, as its labels design says:

- **In the model:** `camunda:label` on the process (the case), and `camunda:label` and `camunda:endLabel` on any
  element, are templates. `${Name = data.path}` is a *named value*; `${data.path}` is plain text.
- **Data, never scripts:** placeholders are data paths, with #281's checks:
  - plain names only;
  - no `__proto__`, `prototype` or `constructor`;
  - own fields only;
  - values shown as text, escaped.

  Filling a label in runs no model code. `verifyModel` reports a label that isn't a template of data paths
  (`label-template`).
- **Computed when shown, never stored:** `labelInstances()` and `labelItems()` fill labels in from the case's data
  and its own model version. A changed template relabels every case.
- **Missing values:** a value that is missing, `null`, empty or only spaces takes the text just before it along, so
  `Client: ` goes too. `0` and `false` are values. When every value is missing, the default applies.
- **The default:** the delegate's optional `instanceLabel(instance)`, else `<model> #<caseId>`.
- **In the pages:** the Instances list's Case column, Pending Tasks' Label column, My work, the instance page, and
  the editor's Label group, with a preview from the Test tab's scenario.
- **Filters by label** on the Instances, Pending Tasks and My work lists:
  - every `${data.…}` placeholder of a case label is a field;
  - a model with no case label offers `caseId`;
  - "Any" searches every field;
  - the filter runs as a database query on the values' data paths.
- **API v3:**
  - tasks return `label`, `labelValues`, `caseLabel` and `caseLabelValues`;
  - instances return `label` and `labelValues`, and on `GET /instances/{id}` their items do too;
  - `GET /tasks` and `GET /instances` take the label filter (`field`, `op`, `value`, `search`, and `model` on
    `/tasks`); a wrong `op` is a 400 `BAD_FILTER`;
  - all of it is in the OpenAPI document and `BPMNClient3`'s types;
  - `/api` and `/api2` are unchanged.

## 4. Extra list columns

#281's `.env` settings (`INSTANCE_COLUMNS`, `TASK_COLUMNS`) are not introduced, and no columns setting replaces
them. What #281 contributed is the safe reading and showing of values, which the label code uses.

The lists show each case's label (the Case column) and each task's (the Label column), and filter by the labels'
data paths.

**Open:** whether a label's named values also become list columns, decided once labels have been tried.

The end-user task page (`user/userTasks.pug`) keeps its columns: its filters address columns by position.

## 5. Task roles and assignment

Built on `3.7.1`, as its assignment policies design says. It replaces this note's earlier proposal: a `role` and
`assignmentPolicy` in `camunda:properties`, a lane as the default role, an `assignment` setting in
`settings/config.ts`, and an `appDelegate.resolveAssignment()` hook.

- **A user task names a policy:** `camunda:assignmentPolicy="Approval"` names `processes/policies/assignment/Approval.dmn.xml`,
  a DMN decision table. A policy still kept directly in `policies/` is moved there on first use.
- **The policy's rules:**
  - Inputs are FEEL on the case's data, as a business rule task's are.
  - Hit policy FIRST: the first rule that matches sets `assignee`, `candidateUsers` and `candidateGroups`.
  - Each output is a FEEL value, or a `$(...)` model expression that can call the application's services
    (`$(appServices.managerOf(data.requesterId))`).
  - An empty output leaves that field as it was.
- **When the task starts:**
  - Its own attributes and its lane are set as always, then the policy runs.
  - **The policy wins** for each field its rule sets.
  - It runs once: not on claim, not when the data changes.
- **No match, no policy, or a failing policy** assigns nobody. The task keeps what its attributes and lane gave, and
  isn't failed.
- **What decided is kept:** the item keeps `assignment: { policy, rule }`, and the instance's Rationale says who was
  assigned and why. API v3's Task returns it as `assignedBy`: v3's Element already uses `assignment` for the
  model's assignee and candidates. `assignedBy` is absent when nothing decided.
- **A claim** writes *is claimed by dora* in the Rationale, with what offered her the task, and `assignedBy` keeps
  the policy.
- **A reassignment by someone else** writes *is reassigned by mgr: assigned to ed*, with what it was and what
  decided it, and `assignedBy` becomes `{ userName: 'mgr' }`.
- **Roles:** `processes/roles.json` lists the roles. A role is the user group of the same name. Administrators edit
  them on the Administration page, which shows where each is used and how many users are in its group.
- **`verifyModel`** checks the policy is there and readable, its outputs, and that lanes and assigned groups are
  known roles.
- **Permissions are unchanged:** the result is the task's usual fields, so `SecureUser`, the task API's *has a
  part* rule and the lists work as they do.

## 6. Application settings and `.env`

- **The line** is [Settings](../docs/settings.md)'s: `.env` for what differs per machine and for secrets,
  `settings/config.ts` for application behaviour.
- **This design adds nothing to either.** Labels are in the models. Roles and policies are files in the models
  folder. Code is on the delegate and in the application's services.
- **Nothing moves out of `.env` in 3.7.**

## 7. Several applications on one server (later)

A multi-application server isn't part of 3.7. It is planned for 3.8, with tenants, in
[Several applications on one server, and tenants](multi-app-tenants.md). For 3.7 it is a design constraint: nothing
here may add something global that would block it.

This design fits that note's workspaces, each with its own database, models folder, code and engine:

- **Labels** belong to a workspace's models, and are filled in from the case's own model and data.
- **Roles and policies** are files in the workspace's models folder (`roles.json`, `policies/assignment/`), and a policy's
  `$(...)` calls that workspace's services. `Manager` in two workspaces are two different roles.
- **What's saved** is the task's usual fields and what decided them (`assignment`), in the workspace's database. The
  host's pages and APIs show it without running any workspace's code.
- **No global state:** no `.env` option or module-level state is added.

## 8. Compatibility

- No change for a model without `camunda:label`, `camunda:endLabel` or `camunda:assignmentPolicy`.
- **Lanes:** a task in a lane keeps the lane as a candidate group, as today, unless its policy sets
  `candidateGroups`.
- **Stored fields:** labels add none. `item.assignment` is a new, optional field.
- **APIs:** API v3 and its OpenAPI document gain fields and the label filter's parameters. `/api`, `/api2` and
  `bpmn-client`'s calls to them are unchanged.

## 9. Security and privacy

- **Labels are visible.** A label and its named values are shown in every list and in API results. Anyone who can
  see a case sees them, so templates should use business references, not personal data.
- **Labels run no code:** templates are data paths, never scripts.
- **A policy's `$(...)` output runs with the server's rights,** when the task starts, as the model's other
  expressions do. A slow service delays the task's start. A failing one assigns nobody; it never fails the task.

## 10. Decisions and questions

Decided:

1. The application integration proposal is updated in this PR, so its §6 and §8 point to labels and assignment
   policies.
2. No `.env` option moves in 3.7, and this design adds none.
3. Labels are computed when shown, never stored. API v3's tasks carry their own label and their case's.
4. Missing values: none, `null`, empty or only spaces is missing; `0` and `false` are values.
5. Assignment is by DMN policies (`policies/assignment/`) and `roles.json`, not settings or a delegate hook.
6. API v3's Task returns what decided as `assignedBy`, absent when nothing did.

Still open:

1. **Named values as list columns** (§4), once labels have been tried.

## 11. Status

| Part | Where |
|---|---|
| This note, and the integration proposal's §6 and §8 | This PR |
| Labels: model, pages, filters, editor, API v3 | Built on `3.7.1` |
| Assignment policies and roles: engine, editor, Administration page, checks | Built on `3.7.1` (a first try) |
| Named values as list columns | Open (§4) |
| `assignedBy` in API v3; claim and reassignment in the Rationale; the reassignment log line | Built on `3.7.1` |

PR #281 can close once this PR is merged: its need is met by labels, and its code lives on in the label code.

## 12. Found while writing this

**The reassignment log line** (`Execution.assign`) printed the assignment as `[object Object]` and didn't name the
previous assignee. Fixed on `3.7.1`: it prints the assignment and what it was before. Claims and reassignments
also write Rationale entries (§5).
