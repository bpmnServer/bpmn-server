# Add-ons

**Status:** in place in 3.7.2: the policies are add-ons.

## The rule

The engine runs BPMN and nothing else. What is built on it is an **add-on**. An add-on registers for the engine's own
events and does its work there; the engine doesn't call it.

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
  engine/AddOns.ts         what an add-on is (IAddOn): register, and the model checks
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

## The events

An add-on's `register(server)` subscribes to the engine's events (`server.listener.subscribe`), as the server is
built. They are the events the engine has always had, for scripts, listeners and the delegate's `executionEvent`.
A subscriber is awaited, in turn, before the engine goes on and saves; one that throws is reported, and the process
goes on (`server/Listener.ts`).

| Event | When | The policies |
|---|---|---|
| `wait` | A user task waits, its attributes and lane applied, not saved yet | Assignment: its policy decides who works on it, and wins |
| `assigned` | A user task waits, and who works on it is decided (fired by the engine after `wait`) | Notification: tells whom its policy says |
| `assign` | A person changed who works on a waiting task; its details: `before`, `assignment`, `userName` | Assignment: the Rationale says what it was |
| `end` | An item ended; its details: `cancel` | Notification: a user task completed |
| `process.end` | An instance ended | Notification |

`assigned` is there so the order needn't be the add-ons': what tells someone whom a task waits for listens to
`assigned`, after whatever decided it on `wait`. A script or listener on `wait` sees the task before its policy
decides; one on `assigned` sees what was decided.

What has no event, an add-on says on itself, and the engine asks each in turn:

| | When | What the add-on does |
|---|---|---|
| `verifyNode(check, node, def)`, `verifyProcess(check, proc, def)` | A model is checked | Report issues (`check.add`) |
| `decisionFiles(definition, folder)` | A model is checked | Name the decision files it uses, for the actor and contract checks |
| `decisionByName(ref, folder)` | A decision is evaluated by name (a test's `@evaluate`) | Find its own: `LeaveApproval.policy` |

The security policy registers for no event. The engine doesn't ask it: the host does. bpmn-web's `routes/caseAccess.ts`
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
- The assignment policy decides on `wait`: a model's script or a listener on `wait` sees the task before it, and one on
  `assigned` after. Before, it decided in the task's start.
