# Business labels, task roles and assignment — design note

**Status:** Agreed in discussion on [PR #281](https://github.com/bpmnServer/bpmn-server/pull/281); for review as a design. Nothing below is implemented unless it says *today*. *Today* means 3.6.0.

**Target:** 3.7

**Related:** [Application integration — architecture and design proposal](../docs/application-integration-design.md);
[Settings: `.env` and configuration](../docs/settings.md)

## 1. Why

The Instances list and the Pending Tasks table identify an instance by its model name and its Case Id. People look
for an order number, a customer or a reference from another system. PR #281 added extra columns from `.env`. The
review agreed the need but not the place: business meaning and presentation are the application's, not the
installation's, and a global setting would get in the way of one server hosting several applications.

This note settles who owns what for three related things, and the smallest contracts between them:

1. **A display label**: one business identity for an instance (e.g. `Order 1234 — Acme`), the same everywhere.
2. **Extra list columns**: a view preference, built on the same data.
3. **Task roles and assignment**: a model says *who in business terms* (Manager, Client); the application says
   *which users*; the engine saves the answer and enforces it.

## 2. Ownership

| Layer | Owns | Where |
|---|---|---|
| Installation | Port, database, logging, secrets, what differs per machine | `.env` / environment |
| Application | Default label template, list columns, assignment policies (as settings); the user directory and the resolvers (as code) | `settings/config.ts` (settings, typed, in Git); the app delegate (code) |
| Model | A process's own label template; a task's role or assignment policy | BPMN: `camunda:properties` |
| Engine | Runs processes; works out and saves the label, the assignee and candidates; enforces lifecycle and permissions | bpmn-server |

Rules:

- `.env` and `settings/config.ts` split as [Settings](../docs/settings.md) says: `.env` for what differs per
  machine and for secrets, `settings/config.ts` for how the application behaves.
- `settings/config.ts` holds settings. Anything that has to run (a resolver) is a method on the app delegate. The
  settings may *name* a policy; they never contain code or secrets.
- Where the model and the application both set something, the model wins for its own process.
- Nothing is global: every setting and hook belongs to one application (§7).
- No new `configuration.json`. For these settings, this note supersedes the `configuration.json` layout in
  §8 of the application integration proposal (see §10, question 1).

### Where the code goes

The integration proposal builds integration in `bpmn-web` and asks that any `bpmn-server` change be small and called
out. Two parts of this design have to be in the engine, because they happen inside an execution:

- **Working out the label at save** (`Execution`, before its state is taken), so every store and API has it.
- **Calling `resolveAssignment` when a user task starts** (`UserTask`), under the instance's lock, so the
  assignment is saved with the task.

Both are optional calls with no effect when nothing is configured. Everything else is in `bpmn-web`: the settings'
typed object, the columns, the pages and the API fields.

**With a separate engine** (`ENGINE_AT`), the host and the engine both load `settings/config.ts` and the delegate
(`webConfiguration(config(), AppDelegate)`). The label template and `resolveAssignment` are used by the engine,
where the delegate and services run. The columns are used by the host's pages. Saved labels and assignments reach
the host with the instance, so the host needs no resolver.

## 3. Display label

### Today

An instance has `name` (the model's) and `data`. There is no label. The lists show the Case Id.

### Proposed

**Where it's declared**, in order of precedence:

1. The process's `camunda:properties`, property `label`:

   ```xml
   <bpmn:process id="order" isExecutable="true">
     <bpmn:extensionElements>
       <camunda:properties>
         <camunda:property name="label" value="Order ${data.orderNo} — ${data.customer.name}" />
       </camunda:properties>
     </bpmn:extensionElements>
     ...
   ```

2. The application's default in `settings/config.ts`:

   ```ts
   export function config() {
       return {
           display: { label: '${data.reference}' },
           ...
       };
   }
   ```

3. Neither: no label, and the pages show the Case Id as today.

The model editor's properties panel shows `label` as a named field on the process.

**How it's evaluated:** with the same `${...}` template evaluation user tasks use today for `assignee` and
`candidateGroups` (`evaluateTemplate` in `engine/Expressions.ts`), against the instance's data.

**Stored, not live:** the engine works out the label at each save of the instance, before its state is taken, and
saves it as `instance.label`. That way it can be searched and sorted in the database, and the lists, the instance
page, the APIs and notifications all show the same text. When the data changes, the next save refreshes it. Tasks
carry no copy: they live inside the instance's document.

**Missing values:** if any part of the template is missing (undefined or null) or its evaluation throws, the label
is not saved, and the pages fall back to the Case Id. No half-filled labels such as `Order  — Acme`. A failed
evaluation logs one warning per save and never fails the save.

**History:** the Rationale and logs show the label as it was at the time of each entry; nothing is rewritten.

**Shown in:**
- the Instances list and Pending Tasks (instead of, or beside, Case Id: §10, question 4);
- the instance page's header and the end-user task list;
- the instance and item results of the REST API and `bpmn-client`, including the task API (`/api2/tasks`).

**Checked by `verifyModel`:** a `label` property that isn't a valid template is a warning.

## 4. Extra list columns

What remains of PR #281, moved from `.env` to application settings:

```ts
// settings/config.ts
display: {
    label: '${data.reference}',
    columns: {
        instances: [{ label: 'Order', field: 'orderNo' }, { label: 'Customer', field: 'customer.name' }],
        tasks: [{ label: 'Order', field: 'orderNo' }],
    },
},
```

- They are added after Case Id (or the label). A task's values come from its instance's data.
- The rules are #281's: dotted field paths only; `__proto__`, `prototype` and `constructor` refused; own fields
  only; dates as ISO text; lists and objects as text; values escaped; an invalid entry left out with one `[config]`
  warning.
- `INSTANCE_COLUMNS` and `TASK_COLUMNS` are **not** introduced.
- The end-user task page (`user/userTasks.pug`) keeps its columns: its filters address columns by position.

## 5. Task roles and assignment

### Today

- **Assignment attributes:** a user task's `camunda:assignee`, `camunda:candidateUsers` and
  `camunda:candidateGroups` are values or expressions, set when the task starts (`UserTask.setAssignVal`). A lane
  adds its name to the candidate groups.
- **Permissions:** `SecureUser.canInvoke` and `canAssign` check who may complete or assign a task.
- **The task API:** `/api2/tasks`, acting for the application's user, lists and acts on the tasks a user *has a
  part in*: as assignee, candidate user, in a candidate group, or on a task with no assignment. Claiming assigns
  the task to that user.
- **Reassignment:** `engine.assign` changes the assignment. Its log line names who assigned, but prints the
  assignment as `[object Object]` and not the previous values (`Execution.assign`).
- **Decision entries:** the Rationale shows them by step, each as `{ seq, element, action, why[] }`. Service tasks
  already write them, e.g. when a connector answers with an error.
- **Connector calls from code:** a script, or the delegate, can call a connector operation with
  `server.connectors.call(ref, input)`. The sample application's HR connector `hr` has `getEmployee`, which
  returns an employee's `managerId`.
- **The integration proposal (§6)** suggests resolving a user or role through a connector operation
  (`HR/getManager`), with the engine owning the assignment state.

### Proposed

**The model** names a role or a policy on the user task, in `camunda:properties`:

```xml
<bpmn:userTask id="approve" name="Approve">
  <bpmn:extensionElements>
    <camunda:properties>
      <camunda:property name="role" value="Manager" />
      <camunda:property name="assignmentPolicy" value="requester-manager" />
    </camunda:properties>
  </bpmn:extensionElements>
</bpmn:userTask>
```

- `role` is a logical participant (Employee, Manager, Client). `assignmentPolicy` names how to find the people.
  Either may be given alone.
- The properties panel shows both as named fields.
- The existing `assignee` and `candidate*` attributes keep working unchanged.

**The application** may set a default policy per role in `settings/config.ts`:

```ts
assignment: {
    roles: { Manager: 'requester-manager', Client: 'case-client' },
},
```

It resolves people with one optional method on its delegate:

```ts
interface IAssignmentIntent {
    role?: string;                // the task's role
    policy?: string;              // the task's assignmentPolicy, else the application's default for the role
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
            const { output } = await this.server.connectors.call('hr/getEmployee',
                { id: item.token.execution.instance.data.employeeId });
            return output?.managerId ? { assignee: output.managerId } : null;
        }
    }
    return null;
}
```

**The engine:**

1. When a user task starts, after the model's own attributes, calls `resolveAssignment` if the task has a role or a
   policy and the delegate has the method. It isn't called again on claim.
2. Saves the result on the item, along with where it came from: `item.assignment = { role, policy, resolvedAt }`.
   An audit then doesn't depend on the directory as it was.
3. Writes a decision entry, so the instance page's Rationale shows why:

   ```ts
   // assigned
   { seq, element: "user task 'Approve' (approve)", action: 'is assigned to EMP-001',
     why: ['role Manager, policy requester-manager'] }
   // no match
   { seq, element: "user task 'Approve' (approve)", action: 'is left unassigned, for the group Manager',
     why: ['role Manager, policy requester-manager', 'the policy found nobody'] }
   ```

4. **No match** (null, or an empty result): the task stays unassigned, with the role added to its candidate groups.
   A role is a group name unless the application maps it otherwise.
5. **The hook throws:** treated as no match, with the error as a second `why`. A task never fails because its
   assignee couldn't be found.
6. **Permissions** are checked against the saved values, as today, by `SecureUser` and by the task API's
   *has a part* rule. The hook doesn't change who may see, claim or complete a task.

**Reassignment** is through `engine.assign`, as today. Its log line is fixed to name the previous and the new
assignee and candidates, and it writes a decision entry too. A claim through the task API is a reassignment.

**`verifyModel` warns** about:
- a task whose `assignmentPolicy` isn't one the application declares (if it declares a list);
- a role used in a model that has no policy and isn't a known group.

## 6. Application settings and `.env`

- **The line** is [Settings](../docs/settings.md)'s: `.env` for what differs per machine and for secrets,
  `settings/config.ts` for application behaviour. A value in `settings/config.ts` already wins over bpmn-web's
  defaults, including those from `.env`.
- **Typed access:** the settings this note adds (`display`, `assignment`) are read once, at start, into a typed
  object that the engine and the pages use. Features don't read `process.env` for them.
- **None of these features adds a `.env` option**, so none has anything to migrate.
- **Migration**, for options that do move: the `.env` value stays a fallback for one release, with a deprecation
  warning at start, and `settings/config.ts` wins where both are set. Which options move is §10, question 2.
- **Failures:** an invalid entry is left out with a `[config]` warning, as #281 does. Settings that make the
  application unsafe still stop the start in production, as today.
- **Changes take effect on restart.** No hot reload.

## 7. One server, several applications (3.7)

3.7 gives models and instances an app id, and applications own identity. This design fits that:

- Each application has its own `settings/config.ts` and delegate; label defaults, columns, role defaults and
  `resolveAssignment` are looked up by the instance's app id.
- A model's `camunda:properties` travel with the model, so they belong to its application.
- Policy and role names are scoped by application: `Manager` in two applications are two different things.
- Assignment results and labels are saved on the instance, so pages and APIs don't need another application's
  resolver to show them.
- Nothing here is global, and no `.env` option is added.

## 8. Compatibility

- No change for a model without `label`, `role` or `assignmentPolicy`, or an application without the settings or
  `resolveAssignment`.
- `instance.label` and `item.assignment` are new, optional fields. Old instances get a label at their next save.
- `appDelegate` stays optional; `resolveAssignment` is an optional method.
- The REST API, the task API and `bpmn-client` gain fields; none are removed or renamed.
- MongoDB, SQLite and memory stores: `label` is a plain field. Searching and sorting by it is tested on each store.

## 9. Security and privacy

- A label is shown in every list, in notifications and in API results. Anyone who can see an instance sees its
  label. Templates should use business references, not personal data. The docs say so.
- `resolveAssignment` runs with the server's rights, inside the execution and under the instance's lock, as a
  connector call from a script does.
  - A slow directory delays the task's start, so it should use the connector's timeout.
  - The engine trusts the hook's answer, but never lets it widen who may act on a task beyond the saved assignee
    and candidates.
- Templates are evaluated by the configured script handler (the sandbox when `SCRIPT_SANDBOX` is on), like other
  model expressions.

## 10. Questions still open

1. **The application integration proposal:** should its §8 be updated to say application settings live in
   `settings/config.ts`, and its §6 point to `resolveAssignment`? I can do that in this PR.
2. **Which existing `.env` options are application behaviour?** [Settings](../docs/settings.md) already places each
   one. The only candidates I see are `MODEL_HISTORY` and `VERIFY_MODELS_ON_IMPORT`. `settings/config.ts` can
   already set `MODEL_HISTORY`. Should either move, and in its own increment?
3. **Settings shape:** `display` and `assignment` as top-level keys of `config()`, or under one `application` key?
4. **The lists:** does the label replace the Case Id column when set, or sit beside it?
5. **Role names:** is "a role is a candidate group of the same name unless mapped" the right default?

## 11. Increments

Each is its own PR, with tests, docs, changelogs and `docs/features.yaml` entries. Engine scenarios are
`.engine.feature` files in `testSampleApp/processes`; pages and APIs are web tests.

| # | Work | Main tests |
|---|---|---|
| 1 | This note | — |
| 2 | Application settings: the typed object, the `display` and `assignment` keys, the `.env` fallback mechanism (with any options agreed in §10.2) | invalid entries warned and left out; `settings/config.ts` over `.env`; deprecation warning once |
| 3 | Display label: `camunda:properties` reading, evaluation at save, `instance.label`, the pages and the APIs | label set and refreshed; fallback on a missing field; a throwing template doesn't fail the save; search and sort on each store; restart keeps it; with a separate engine |
| 4 | List columns from application settings (PR #281's code, rebased) | #281's tests, now from settings; no `.env` |
| 5 | Roles and `resolveAssignment`, the decision entries, the reassignment log line | see below |

Increment 5's tests:
- Employee → Manager approval, through the HR connector;
- a Client task;
- no match: the candidate group and the decision entry;
- the hook throws;
- reassignment and a task API claim, logged with from and to;
- view, claim and complete permissions, in the portal and through `/api2/tasks`;
- save and restart keep the assignment.

## 12. Things found while writing this

- **The reassignment log line** (`Execution.assign`) prints the assignment as `[object Object]` and doesn't name the
  previous assignee. It's fixed in increment 5.
- **`camunda:properties` on a process isn't read today.** The process-level extension loop in
  `Definition.loadProcess` reads every extension's children as listener scripts. Increment 3 must check that a
  `camunda:properties` element isn't taken for listeners, with both the generic moddle and the camunda one.
