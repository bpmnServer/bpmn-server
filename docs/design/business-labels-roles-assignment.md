# Business labels, task roles and assignment — design note

**Status:** Agreed in discussion on [PR #281](https://github.com/bpmnServer/bpmn-server/pull/281), and reviewed on
[PR #286](https://github.com/bpmnServer/bpmn-server/pull/286). Nothing below is implemented unless it says *today*. *Today* means 3.6.0.

**Target:** 3.7

**Related:**
- [Application integration — architecture and design proposal](../docs/application-integration-design.md)
- [Settings: `.env` and configuration](../docs/settings.md)
- [API v3](https://github.com/bpmnServer/bpmn-server/blob/api-v3/docs/design/api-v3.md) (branch `api-v3`)
- [Several applications on one server, and tenants](https://github.com/bpmnServer/bpmn-server/blob/design-multi-app/docs/design/multi-app-tenants.md)
  (draft, branch `design-multi-app`)

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
| Model | A process's own label template; a task's role (by default its lane) or assignment policy | BPMN: lanes and `camunda:properties` |
| Engine | Runs processes; works out and saves the label, the assignee and candidates; enforces lifecycle and permissions | bpmn-server |

Rules:

- `.env` and `settings/config.ts` split as [Settings](../docs/settings.md) says: `.env` for what differs per
  machine and for secrets, `settings/config.ts` for how the application behaves.
- `settings/config.ts` holds settings. Anything that has to run (a resolver) is a method on the app delegate. The
  settings may *name* a policy; they never contain code or secrets.
- Where the model and the application both set something, the model wins for its own process.
- **Nothing is global.** Every setting and hook belongs to one application, so the design fits a later
  multi-application server (§7).
- **Settings and hooks are read through the server's configuration and the delegate.** They are never read from
  module-level state, or from `process.env` at request time, so each application can have its own.
- No new `configuration.json`. This PR updates §6 and §8 of the application integration proposal to match.

### Where the code goes

The integration proposal builds integration in `bpmn-web` and asks that any `bpmn-server` change be small and called
out. Two parts of this design have to be in the engine, because they happen inside an execution:

- **Working out the label at save** (`Execution`, before its state is taken), so every store and API has it.
- **Calling `resolveAssignment` when a user task starts** (`UserTask`), under the instance's lock, so the
  assignment is saved with the task.

Both are optional calls with no effect when nothing is configured. Everything else is in `bpmn-web`: the settings'
typed object, the columns, the pages and API v3's answers.

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

**Names in a template:** the same as in any model expression (see [Scripting](../docs/scripting.md)). The label is
worked out at the instance's save, so the scope is the instance:
- `data` is the instance's data;
- `this` is the instance, so `${this.data.orderNo}` and `${data.orderNo}` are the same;
- `item` is undefined.

The docs write `${data.orderNo}`. A template should only read data. It runs at every save, so it shouldn't call
`appServices` or `appDelegate`.

**How it's evaluated, part by part:** the engine splits the template with `templateParts`, then evaluates each
`${...}` part with the script handler's `evaluateExpression`, against the instance. It doesn't use
`evaluateTemplate`, which turns `null` and `undefined` into `''`.

**Missing values:** if any part's value is `undefined`, `null` or empty text, or its evaluation throws, no label is
saved, and the pages fall back to the Case Id. No half-filled labels such as `Order  — Acme`. A failed evaluation
logs one warning per save and never fails the save.

**Stored, not live:** the engine works out the label at each save of the instance, before its state is taken, and
saves it as `instance.label`. That way it can be searched and sorted in the database, and the lists, the instance
page, the APIs and notifications all show the same text. When the data changes, the next save refreshes it. Tasks
carry no copy: they live inside the instance's document.

**History:** the Rationale and logs show the label as it was at the time of each entry; nothing is rewritten.

**Shown in:**
- **The Instances list and Pending Tasks:** the label replaces the Case Id column when the instance has one. An
  instance with no label shows its Case Id there, as today.
- **The instance page's header and the end-user task list.**
- **API v3** (`/api/v3`): `label` on an instance in `GET /instances` and `GET /instances/{id}`. Each task in
  `GET /tasks` and `GET /tasks/{id}` carries its instance's label (see §10). Both are in v3's OpenAPI document.
  `/api` and `/api2` are frozen in 3.7, so they don't gain it.

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

- They are added after the label, or after the Case Id where there's no label. A task's values come from its
  instance's data.
- The rules are #281's: dotted field paths only; `__proto__`, `prototype` and `constructor` refused; own fields
  only; dates as ISO text; lists and objects as text; values escaped; an invalid entry left out with one `[config]`
  warning.
- `INSTANCE_COLUMNS` and `TASK_COLUMNS` are **not** introduced.
- The end-user task page (`user/userTasks.pug`) keeps its columns: its filters address columns by position.

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
- **Typed access:** the settings this note adds (`display` and `assignment`, as top-level keys of `config()`) are
  read at start into a typed object on the server's configuration. The engine and the pages read them from there,
  never from module-level state or `process.env`.
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

- **Per-application settings and hooks.** Each workspace's `settings/config.ts` holds its `display` and
  `assignment` settings, and its delegate its `resolveAssignment`. The engine that runs a workspace's instances has
  that workspace's delegate and settings.
- **Saved on the instance.** Labels and assignments are saved on the instance, in the workspace's database, so the
  host's pages and APIs show them without running any workspace's code.
- **Names are the workspace's.** Role and policy names belong to a workspace: `Manager` in two workspaces are two
  different things.
- **Nothing global.** No `.env` option is added, and settings and hooks are read through the server's
  configuration and the delegate, never module-level state or `process.env` at request time (that note's §8).

## 8. Compatibility

- No change for a model without `label`, `role` or `assignmentPolicy`, or an application without the settings or
  `resolveAssignment`.
- A task in a lane keeps the lane as a candidate group, as today. Its lane is only used as its role when the
  application sets a policy for it and has `resolveAssignment`.
- `instance.label` and `item.assignment` are new, optional fields. Old instances get a label at their next save.
- `appDelegate` stays optional; `resolveAssignment` is an optional method.
- API v3 and its OpenAPI document gain fields. `/api`, `/api2` and `bpmn-client`'s calls to them are unchanged.
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

## 10. Decisions and questions

Decided on #286:

1. The application integration proposal is updated in this PR: §8 says application settings live in
   `settings/config.ts`, and §6 points to `resolveAssignment`.
2. No `.env` option moves in 3.7.
3. `display` and `assignment` are top-level keys of `config()`.
4. The label replaces the Case Id column when set; the Case Id stays when there's none.
5. A role is a candidate group of the same name unless mapped, as lanes already are.

Still open:

1. **A task's label in v3:** tasks store no copy. Should each task in `GET /tasks` carry its instance's label in
   the answer (e.g. `instanceLabel`), so a task inbox can show it without a second call?
2. **Empty text:** should an empty value count as missing, like `null` and `undefined`, so `Order  — Acme` never
   appears? This note says yes.

## 11. Increments

Each is its own PR, with tests, docs, changelogs and `docs/features.yaml` entries. Engine scenarios are
`.engine.feature` files in `testSampleApp/processes`; pages and APIs are web tests. Increments 3 and 5 add to API v3,
so they follow its routes and OpenAPI document reaching `main`.

| # | Work | Main tests |
|---|---|---|
| 1 | This note, and the integration proposal's §6 and §8 | — |
| 2 | Application settings: the typed object on the server's configuration, the `display` and `assignment` keys | invalid entries warned and left out; settings read from the configuration object, not `process.env` |
| 3 | Display label: `camunda:properties` reading, part-by-part evaluation at save, `instance.label`, the pages and API v3 | label set and refreshed; no label when a part is missing; a throwing template doesn't fail the save; the label replaces Case Id in the lists; search and sort on each store; restart keeps it; with a separate engine; v3's answers match its OpenAPI document |
| 4 | List columns from application settings (PR #281's code, rebased) | #281's tests, now from settings; no `.env` |
| 5 | Roles (from the property or the lane) and `resolveAssignment`, the decision entries, the reassignment log line, `item.assignment` in API v3 | see below |

Increment 5's tests:
- Employee → Manager approval, with a Manager lane and the HR connector, and no property on the task;
- a Client task with its own `role`;
- no match: the candidate group and the decision entry;
- the hook throws;
- reassignment and a v3 claim, logged with from and to;
- view, claim and complete permissions, in the portal and through v3's `/tasks`;
- save and restart keep the assignment.

## 12. Things found while writing this

- **The reassignment log line** (`Execution.assign`) prints the assignment as `[object Object]` and doesn't name the
  previous assignee. It's fixed in increment 5.
- **`camunda:properties` on a process isn't read today.** The process-level extension loop in
  `Definition.loadProcess` reads every extension's children as listener scripts. Increment 3 must check that a
  `camunda:properties` element isn't taken for listeners, with both the generic moddle and the camunda one.
