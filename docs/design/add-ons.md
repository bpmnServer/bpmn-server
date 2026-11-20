# Add-ons

**Status:** in place in 3.7.2: the policies are add-ons.

## The rule

The engine runs BPMN and nothing else. What is built on it is an **add-on**. An add-on plugs into the engine's hooks and
does its work there.

- **The engine imports nothing from an add-on.** It doesn't know which add-ons there are, or what they do.
- **An add-on depends on the engine only**: no add-on imports another one.
- **Each add-on works alone**: with the engine and no other add-on.

`packages/bpmn-server/test/add-ons.test.mjs` checks the first two by reading the sources, and the third by running a
server with no add-ons, and with only an application's own.

Only three files put the add-ons together: the package's entry (`src/index.ts`), the default configuration
(`src/common/DefaultConfiguration.ts`) and the command line (`src/cli.ts`).

## Where they are

```text
packages/bpmn-server/src/
  engine/AddOns.ts         the hooks (IAddOn), and how the engine calls them
  addons/
    index.ts               policyAddOns(): the three, in order
    assignment/            owf:assignmentPolicy: who works on a user task
    notification/          owf:notificationPolicy: who is told what
    security/              owf:securityPolicy: what each user may do with a case
```

What the add-ons need of each other belongs to the engine instead:

- the roles (`roles.json`): `engine/Roles.ts`;
- a decision cell that is a model expression (`isExpression`): `engine/Expressions.ts`;
- a user task's assignment fields (`ASSIGNMENT_FIELDS`): `engine/AddOns.ts`.

## The hooks

| Hook | When | What the add-on may do |
|---|---|---|
| `taskStarting(item, node)` | A user task starts, before it waits and is saved | Change who works on it (`ASSIGNMENT_FIELDS`) |
| `taskWaiting(item, node)` | Then, its assignment decided | Side effects: tell someone |
| `taskCompleted(item, node)` | A user task was completed (not cancelled) | Side effects |
| `taskReassigned(execution, item, before, changed, userName)` | A person changed who works on a waiting task | Record it |
| `executionEnded(execution)` | An instance ended | Side effects |
| `verifyNode(check, node, def)`, `verifyProcess(check, proc, def)` | A model is checked | Report issues (`check.add`) |
| `decisionFiles(definition, folder)` | A model is checked | Name the decision files it uses, for the actor and contract checks |
| `decisionByName(ref, folder)` | A decision is evaluated by name (a test's `@evaluate`) | Find its own: `LeaveApproval.policy` |

The engine awaits each hook. One that throws is logged as a warning, and the process goes on: an add-on never fails a
process. Hooks are called in the add-ons' order, so the assignment comes before the notifications that name whom.

The security policy has no runtime hook. The engine doesn't ask it: the host does. bpmn-web's `routes/caseAccess.ts`
asks the policy what a user may do, and adds the policy's condition to its own list queries. The engine's store
doesn't know there is a policy.

## Which add-ons a server has

The configuration's `addOns(server)`. By default it is the policies, so an existing application keeps them. Some
examples:

```ts
new Configuration({ ...settings, addOns: () => [] });                        // the engine alone
new Configuration({ ...settings, addOns: () => [...policyAddOns(), mine] });  // and the application's own
```

A model checked without a server (`verifyModel(source, undefined, name, options)`) has no add-ons unless
`options.addOns` gives them. The command line's `verify` gives the policies.

## Compatibility

- Everything the package exported is still exported from its entry: `applyPolicy`, `SecurityPolicy`,
  `notifyEvent`, `roleNames` and the rest. Only their files moved.
- A configuration that isn't a `Configuration` (an object of the application's own, with every factory) has no
  `addOns`, so it has no policies. Add `addOns: () => policyAddOns()` to keep them.
- A user task's description shows every `owf:` attribute the engine doesn't read itself, not only
  `assignmentPolicy`.
