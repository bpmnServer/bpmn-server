# Business labels, task roles and assignment — design note

**Status:** Agreed in discussion on [PR #281](https://github.com/bpmnServer/bpmn-server/pull/281), and reviewed on
[PR #286](https://github.com/bpmnServer/bpmn-server/pull/286). Labels follow the `labels-rebuild` branch's design and
code; nothing below is implemented unless it says *today* or names that branch. *Today* means 3.6.0.

**Target:** 3.7

**Related:**
- [Labels: design](https://github.com/bpmnServer/bpmn-server/blob/labels-rebuild/docs/design/labels.md) and
  [user guide](https://github.com/bpmnServer/bpmn-server/blob/labels-rebuild/docs/docs/labels.md) (branch `labels-rebuild`)
- [Application integration — architecture and design proposal](../docs/application-integration-design.md)
- [Settings: `.env` and configuration](../docs/settings.md)
- [API v3](https://github.com/bpmnServer/bpmn-server/blob/api-v3/docs/design/api-v3.md) (branch `api-v3`)
- [Several applications on one server, and tenants](https://github.com/bpmnServer/bpmn-server/blob/design-multi-app/docs/design/multi-app-tenants.md)
  (draft, branch `design-multi-app`)

## 1. Why

The Instances list and the Pending Tasks table identify an instance by its model name and its Case Id. People look
for an order number, a customer or a reference from another system. PR #281 added extra columns from `.env`. The
review agreed the need but not the place: business meaning and presentation are not the installation's, and a
global setting would get in the way of one server hosting several applications.

This note settles who owns what for three related things, and the smallest contracts between them:

1. **A display label**: one business identity for a case (e.g. `Client: abc · Order: 1234`), the same everywhere.
2. **Extra list columns**: the label's named values, offered by the lists.
3. **Task roles and assignment**: a model says *who in business terms* (Manager, Client); the application says
   *which users*; the engine saves the answer and enforces it.

The labels part is designed and built on `labels-rebuild` (§3). This note records how it fits with the rest, and
what API v3 adds to it. Roles and assignment (§5) are this note's own design.

## 2. Ownership

| Layer | Owns | Where |
|---|---|---|
| Installation | Port, database, logging, secrets, what differs per machine | `.env` / environment |
| Application | Default assignment policies (as settings); the user directory, the resolvers and an optional label hook (as code) | `settings/config.ts` (settings, typed, in Git); the app delegate (code) |
| Model | Its case's and its activities' labels; a task's role (by default its lane) or assignment policy | BPMN: `camunda:label`, `camunda:endLabel`, lanes and `camunda:properties` |
| Engine | Runs processes; fills in labels when they're shown; works out and saves the assignee and candidates; enforces lifecycle and permissions | bpmn-server |

Rules:

- `.env` and `settings/config.ts` split as [Settings](../docs/settings.md) says: `.env` for what differs per
  machine and for secrets, `settings/config.ts` for how the application behaves.
- **Labels are the model's.** They need no application settings, only the optional `instanceLabel` hook on the
  delegate for a case label computed in code.
- `settings/config.ts` holds settings. Anything that has to run (a resolver, the label hook) is a method on the app
  delegate. The settings may *name* a policy; they never contain code or secrets.
- **Nothing is global.** Every setting and hook belongs to one application, so the design fits a later
  multi-application server (§7).
- **Settings and hooks are read through the server's configuration and the delegate.** They are never read from
  module-level state, or from `process.env` at request time, so each application can have its own.
- No new `configuration.json`. This PR updates §6 and §8 of the application integration proposal to match.

### Where the code goes

- **Labels:** `labels-rebuild` puts the template code in the engine (`engine/LabelTemplate.ts`, `engine/Labels.ts`),
  as functions with no lifecycle hook. The pages, and API v3's answers, call `labelInstances()` and `labelItems()`
  on what they're about to return. Nothing runs at save.
- **Assignment:** the one engine change of this design is calling `resolveAssignment` when a user task starts
  (`UserTask`), under the instance's lock, so the assignment is saved with the task. It's an optional call with no
  effect when nothing is configured.
- **Everything else is in `bpmn-web`:** the settings' typed object, the pages and API v3's answers.

**With a separate engine** (`ENGINE_AT`), the host and the engine both load `settings/config.ts` and the delegate
(`webConfiguration(config(), AppDelegate)`). `resolveAssignment` is used by the engine, where the delegate and
services run. Labels are filled in by whichever process answers the page or API call. They need the case's model
source and the `instanceLabel` hook there. The prototype (§11) checks this with a separate engine.

## 3. Display label

### Today

An instance has `name` (the model's) and `data`. There is no label. The lists show the Case Id.

### On `labels-rebuild`

As its [design](https://github.com/bpmnServer/bpmn-server/blob/labels-rebuild/docs/design/labels.md) says:

- **In the model:** `camunda:label` on the process (the case), and `camunda:label` and `camunda:endLabel` on any
  activity, are display templates.

  ```xml
  <bpmn:process id="Expense" camunda:label="Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}">
  ```

  - `${Name = path}` is a *named value*. It is shown, and offered as a column and a filter under its name.
  - `${path}` is plain text.
- **Data, never scripts:** placeholders are data paths (`data.…`, an activity's own fields, `instance.<Name>`,
  `model`), with #281's checks:
  - plain names only;
  - no `__proto__`, `prototype` or `constructor`;
  - own fields only;
  - values shown as text, escaped.

  Filling a label in runs no model code.
- **Computed when shown, never stored.** The pages and APIs label what they return with `labelInstances()` (a
  case: `label`, `labelValues`; each activity: `label`, `labelValues`) and `labelItems()` (a task: `label`,
  `ownLabel`, `labelValues`, and its case's `caseLabel` and `caseLabelValues`).
  - A case is labeled from its own model version's templates.
  - A changed template relabels every case.
  - The tests check that stored instances and items have no label fields.
- **The defaults:** a case with no template, or one whose template fills in to nothing, takes the application's
  `instanceLabel(instance)` hook, else `<model> #<caseId>`, else the model's name. A user task with no label of its
  own shows its name and its case's label.
- **`verifyModel`** reports a placeholder that isn't a data path, and a name used twice.

This note's earlier proposal, a template in `camunda:properties` evaluated as an expression at each save and saved
as `instance.label`, is withdrawn.

### Added for API v3

`/api` and `/api2` are frozen in 3.7, so API v3 is where labels reach other applications. Its answers are enriched
with the same functions; nothing is stored:

- **`GET /instances`, `GET /instances/{id}`:** each case's `label` and `labelValues`, and each item's own `label`
  and `labelValues` where its element has one.
- **`GET /tasks`, `GET /tasks/{id}`:** each task's `label` and `ownLabel`, and its parent case's `caseLabel` and
  `caseLabelValues`. An inbox can then show both without a second call.
- **Filters:** `GET /instances` and `GET /tasks` take the lists' label filter as query parameters (`model`,
  `field`, `op`, `value`, `search`). They become the same database query (`labelQuery`) on the cases' data paths,
  with paging.
- **v3's OpenAPI document** describes the fields and parameters, and its check against the routes covers them.

### Missing values: open

The behaviour is not decided. `labels-rebuild`'s `fillTemplate` today treats a value that is `undefined`, `null` or
`''` as missing. A missing value takes the text just before it along, and separators left at either end are
trimmed. A label that fills in to nothing falls back to the defaults above.

The prototype (§11) shows real cases side by side before anything is decided:
- a value that is `null`;
- `''`;
- whitespace only (today it isn't treated as missing, so `Client:` can stay with nothing after it);
- `0` and `false`;
- one value of several missing;
- all of them missing, falling back to the hook and to `<model> #<caseId>`.

## 4. Extra list columns

In the labels design, the columns are a label's named values: with one model listed, its named values become
columns in the template's order. `labels-rebuild` builds the Case column and the filter bar over the named values
today; the per-model columns are its design's next phase. #281's `.env` settings and any `display` settings are not
introduced: what #281 contributed is the safe reading and showing of values, which `LabelTemplate.ts` now uses.

The end-user task page (`user/userTasks.pug`) keeps its columns: its filters address columns by position.

## 5. Task roles and assignment

### Today

- **Assignment attributes:** a user task's `camunda:assignee`, `camunda:candidateUsers` and
  `camunda:candidateGroups` are values or expressions, set when the task starts (`UserTask.setAssignVal`).
- **Lanes:** a task in a lane gets the lane's name as its `lane`, and that name joins its candidate groups. The
  guide recommends a lane per role.
- **Permissions:** `SecureUser.canInvoke` and `canAssign` check who may complete or assign a task.
- **The task API:** `/api2/tasks`, acting for the application's user, lists and acts on the tasks a user *has a
  part in*: as assignee, candidate user, in a candidate group, or on a task with no assignment. Claiming assigns
  the task to that user, through `engine.assign`. In 3.7, v3's `/tasks` takes this over and `/api2` is frozen.
- **Reassignment:** `engine.assign` changes the assignment. Its log line names who assigned, but prints the
  assignment as `[object Object]` and not the previous values (`Execution.assign`).
- **Decision entries:** the Rationale shows them by step, each as `{ seq, element, action, why[] }`. Service tasks
  already write them, e.g. when a connector answers with an error.
- **Connector calls from code:** a script, or the delegate, can call a connector operation with
  `server.connectors.call(ref, input)`. The sample application's HR connector `hr` has `getEmployee`, which
  returns an employee's `managerId`.
- **The integration proposal (§6)** suggests resolving a user or role through a connector operation, with the
  engine owning the assignment state.

### Proposed

**A task's role** is, in order:
1. its own `role` property;
2. its lane's name.

So a model drawn with a lane per role needs no property on each task. A task may also name a policy in
`camunda:properties`:

```xml
<bpmn:userTask id="approve" name="Approve">
  <bpmn:extensionElements>
    <camunda:properties>
      <camunda:property name="role" value="Manager" />                       <!-- only when it isn't the lane -->
      <camunda:property name="assignmentPolicy" value="requester-manager" />
    </camunda:properties>
  </bpmn:extensionElements>
</bpmn:userTask>
```

- `role` is a logical participant (Employee, Manager, Client). `assignmentPolicy` names how to find the people.
- The properties panel shows both as named fields.
- The existing `assignee` and `candidate*` attributes keep working unchanged.

**The application** may set a default policy per role in `settings/config.ts`. With lanes, this is usually all an
application needs:

```ts
assignment: {
    roles: { Manager: 'requester-manager', Client: 'case-client' },
},
```

**A role is a candidate group of the same name** unless the application maps it otherwise, as lanes already are.

It resolves people with one optional method on its delegate:

```ts
interface IAssignmentIntent {
    role?: string;                // the task's role: its role property, else its lane
    policy?: string;              // the task's assignmentPolicy, else the application's default for the role
    data: any;                    // a copy of the instance's data
    assignee?: string;            // what the model's own attributes gave, if anything
    candidateUsers?: string[];
    candidateGroups?: string[];
}
interface IAssignmentResult {
    assignee?: string;
    candidateUsers?: string[];
    candidateGroups?: string[];
}
// on IAppDelegate, optional
resolveAssignment?(item: IItem, intent: IAssignmentIntent): IAssignmentResult | null | Promise<IAssignmentResult | null>;
```

The method switches on `intent.policy`; a registry of named policies can come later if needed. It may call the
application's own services or a connector operation. In the sample application:

```ts
async resolveAssignment(item, intent) {
    switch (intent.policy) {
        case 'requester-manager': {
            const { output } = await this.server.connectors.call('hr/getEmployee', { id: intent.data.employeeId });
            return output?.managerId ? { assignee: output.managerId } : null;
        }
    }
    return null;
}
```

**The engine:**

1. When a user task starts, after the model's own attributes and the lane, calls `resolveAssignment`, if the
   delegate has the method and the task has a policy (its own, or the application's default for its role). It
   isn't called again on claim.
2. Saves the result on the item, along with where it came from: `item.assignment = { role, policy, resolvedAt }`.
   Unlike a label, an assignment is a fact the engine enforces and audits, so it is stored. An audit then doesn't
   depend on the directory as it was.
3. Writes a decision entry, so the instance page's Rationale shows why:

   ```ts
   // assigned
   { seq, element: "user task 'Approve' (approve)", action: 'is assigned to EMP-001',
     why: ['role Manager, policy requester-manager'] }
   // no match
   { seq, element: "user task 'Approve' (approve)", action: 'is left unassigned, for the group Manager',
     why: ['role Manager, policy requester-manager', 'the policy found nobody'] }
   ```

4. **No match** (null, or an empty result): the task stays unassigned, with its role among its candidate groups.
   For a task whose role is its lane, that's what happens today.
5. **The hook throws:** treated as no match, with the error as a second `why`. A task never fails because its
   assignee couldn't be found.
6. **Permissions** are checked against the saved values, as today, by `SecureUser` and by the task operations'
   *has a part* rule (v3's `/tasks`, and the frozen `/api2/tasks`). The hook doesn't change who may see, claim or
   complete a task.

**Reassignment** is through `engine.assign`, as today. Its log line is fixed to name the previous and the new
assignee and candidates, and it writes a decision entry too. A claim (v3's `POST /tasks/{id}/claim`) is a
reassignment.

**In API v3:**
- `item.assignment` is on a task in `GET /tasks` and `GET /tasks/{id}`, and on each item of `GET /instances/{id}`;
- `role` and `assignmentPolicy` are among a task element's assignment in `GET /models/{name}/elements/{id}`;
- all of them are in v3's OpenAPI document.

**`verifyModel` warns** about:
- a task whose `assignmentPolicy` isn't one the application declares (if it declares a list);
- a role used in a model that has no policy and isn't a known group.

## 6. Application settings and `.env`

- **The line** is [Settings](../docs/settings.md)'s: `.env` for what differs per machine and for secrets,
  `settings/config.ts` for application behaviour. A value in `settings/config.ts` already wins over bpmn-web's
  defaults, including those from `.env`.
- **What this note adds:** only `assignment`, as a top-level key of `config()`. Labels need no settings.
- **Typed access:** `assignment` is read at start into a typed object on the server's configuration. The engine
  reads it from there, never from module-level state or `process.env`.
- **Nothing moves out of `.env` in 3.7.** None of these features adds a `.env` option, and no existing option needs
  to move.
- **Failures:** an invalid entry is left out with a `[config]` warning, as #281 does. Settings that make the
  application unsafe still stop the start in production, as today.
- **Changes take effect on restart.** No hot reload.

## 7. Several applications on one server (later)

A multi-application server isn't part of 3.7. It is planned for 3.8, together with tenants, in
[Several applications on one server, and tenants](https://github.com/bpmnServer/bpmn-server/blob/design-multi-app/docs/design/multi-app-tenants.md).
For 3.7 it is a design constraint: nothing here may add something global that would block it.

That note's workspaces (an application, or a tenant) are isolated by construction: each has its own database,
models folder, code and engine. This design fits that as it is:

- **Per-application settings and hooks.** Each workspace's `settings/config.ts` holds its `assignment` settings.
  Its delegate has its `resolveAssignment` and `instanceLabel`. The engine that runs a workspace's instances has
  that workspace's delegate and settings.
- **Labels belong to models.** A model belongs to a workspace, and a label is filled in from the case's own model
  and data, so nothing about labels is shared.
- **Assignments are saved on the instance.** They are kept in the workspace's database, so the host's pages and
  APIs show them without running any workspace's code.
- **Names are the workspace's.** Role and policy names belong to a workspace: `Manager` in two workspaces are two
  different things.
- **Nothing global.** No `.env` option is added, and settings and hooks are read through the server's
  configuration and the delegate, never module-level state or `process.env` at request time (that note's §8).

## 8. Compatibility

- No change for a model without `camunda:label`, `role` or `assignmentPolicy`, or an application without the
  settings, `resolveAssignment` or `instanceLabel`.
- **Lanes:** a task in a lane keeps the lane as a candidate group, as today. Its lane is only used as its role when
  the application sets a policy for it and has `resolveAssignment`.
- **Stored fields:** labels add none. `item.assignment` is a new, optional field.
- **The delegate:** `appDelegate` stays optional. `resolveAssignment` and `instanceLabel` are optional methods.
- **APIs:** API v3 and its OpenAPI document gain fields and the label filter's parameters. `/api`, `/api2` and
  `bpmn-client`'s calls to them are unchanged.
- **Stores:** label filters are queries on the cases' data paths, so they need the store's `$regex`, which
  `labels-rebuild` adds and tests.

## 9. Security and privacy

- **Labels are visible.** A label and its named values are shown in every list and in API results. Anyone who can
  see a case sees them, so templates should use business references, not personal data. The docs say so.
- **Labels run no code.** Templates are data paths, never scripts, so filling one in for any viewer runs no model
  code.
- **`resolveAssignment` runs with the server's rights,** inside the execution and under the instance's lock, as a
  connector call from a script does.
  - A slow directory delays the task's start, so it should use the connector's timeout.
  - The engine trusts the hook's answer, but never lets it widen who may act on a task beyond the saved assignee
    and candidates.

## 10. Decisions and questions

Decided on #286:

1. The application integration proposal is updated in this PR: §8 says application settings live in
   `settings/config.ts`, and §6 points to `resolveAssignment`.
2. No `.env` option moves in 3.7.
3. `assignment` is a top-level key of `config()`. Labels need no settings key.
4. Labels are computed when shown, never stored, with `labelInstances()` and `labelItems()` (`labels-rebuild`).
5. v3's `GET /tasks` carries each task's own label and its parent case's label, by response enrichment.
6. A role is a candidate group of the same name unless mapped, as lanes already are.

Still open:

1. **Missing values** (§3): `null`, `''`, whitespace only, and partly or wholly missing values, with the fallback.
   This is decided from the prototype's examples.
2. **Attributes or properties:** labels are attributes (`camunda:label`). Should a task's role and policy be too
   (`camunda:role`, `camunda:assignmentPolicy`), for one style in the editor and the XML, rather than
   `camunda:properties` as agreed earlier?

## 11. Increments

Each is its own PR, with tests, docs, changelogs and `docs/features.yaml` entries. Engine scenarios are
`.engine.feature` files in `testSampleApp/processes`; pages and APIs are web tests.

| # | Work | Main tests |
|---|---|---|
| 1 | This note, and the integration proposal's §6 and §8 | — |
| 2 | **Labels prototype, a pre-release for review, not for merging or production:** `labels-rebuild` on current main with `api-v3`; v3's label fields, task enrichment and label filters, in its OpenAPI document; a sample model showing the missing-value cases (§3) | `labels-rebuild`'s tests; v3's answers carry the labels and match the OpenAPI document; filters on `/instances` and `/tasks`, with paging; nothing stored; with a separate engine |
| 3 | Application settings: the typed object on the server's configuration, the `assignment` key | invalid entries warned and left out; settings read from the configuration object, not `process.env` |
| 4 | Roles (from the property or the lane) and `resolveAssignment`, the decision entries, the reassignment log line, `item.assignment` in API v3 | see below |

#281's columns need no increment of their own: they are the labels' named values (§4).

Increment 4's tests:
- Employee → Manager approval, with a Manager lane and the HR connector, and no property on the task;
- a Client task with its own `role`;
- no match: the candidate group and the decision entry;
- the hook throws;
- reassignment and a v3 claim, logged with from and to;
- view, claim and complete permissions, in the portal and through v3's `/tasks`;
- save and restart keep the assignment.

## 12. Things found while writing this

- **The reassignment log line** (`Execution.assign`) prints the assignment as `[object Object]` and doesn't name the
  previous assignee. It's fixed in increment 4.
- **`camunda:properties` on a task isn't read today.** Increment 4 reads `role` and `assignmentPolicy` from a user
  task's extension elements, unless question 2 makes them attributes. On a process, the extension loop in
  `Definition.loadProcess` reads every extension's children as listener scripts. That no longer matters for
  labels, which are attributes.
