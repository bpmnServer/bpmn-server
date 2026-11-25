# One set of names for every expression

**Status:** built on `3.7.1` (`engine/DecisionContext.ts`, `engine/ScriptHandler.ts`).

A model's expressions are written in two languages: JavaScript (`$(...)`, `${...}`, scripts, input parameters,
conditions) and FEEL (decision tables, assignment, security and notification policies, FEEL conditions). Today each
place sees its own names: `this.data` works in JavaScript and is a silent `null` in FEEL; a process-level script has no
`data`. From now on every expression sees the same names, built by
one function, whatever its language.

## The names

| Name | What it is |
|---|---|
| `data` | **The item's data, in its scope.** At the top, the instance's data; in a multi-instance or a sub-process with its own data, that item's part |
| `instance` | The instance: `instance.data` (all of it, whatever the scope), `instance.name` (its process), `instance.id` |
| `item` | The item: `item.element` (its BPMN element: id, name, type), `item.status`, `item.userName` |
| `input`, `output` | The item's prepared inputs and its outputs |
| `user` | The user acting or asking, as the application defines it (`IUserInfo`: `userName`, `userGroups`, and what the application adds). The engine is given only a name for an operation: in a business rule or an assignment policy `user` is `{ userName }`, unless the application's `decisionContext` adds the rest |
| `actors` | Who did what in the instance (below) |
| `task` | The element a decision is about (a decision table's input) |
| `appServices`, `appUtils` | The application's functions |

`this` is the item, in JavaScript as before, and in FEEL too (`this.data.amount` is `data.amount`). In FEEL the
data's fields are also read by name (`amount`), as decision tables always have.

**In JavaScript,** `actors` and `user` are given to a script that reads them without declaring them: a script's own
`const user = ...` stays its own. An application's script context of the same name is used instead. A process's own
script reads `data`: the instance's. In the sandbox (`SandboxScriptHandler`), an item's script reads `instance`
without its data, as before.

**In FEEL,** `appServices` is a plain view of the application's functions (FEEL can't call a class's methods): a call
to an async service, as a whole expression or a decision table's input, is awaited. A security policy, asked by the
host, has no `appServices`.

## Actors

Who did what in an instance, worked out when asked, from its items and its own model (`instance.source`). Nothing is
stored.

**An actor is the name given to the user who completes a task:** a user task, or a start event (the user who starts
the process there). The model names it, `owf:actor="approver"`, and `actors.approver` is that user, wherever an
expression reads it. Only user tasks and start events have one; on any other element `verifyModel` warns
(`actor-element`) and it is ignored.

| Actor | Who |
|---|---|
| `actors.initiator` | who started the instance: its start event's item's user |
| `actors.<name>` | the user who completed the user task, or started the process at the start event, the model names so: `<bpmn:userTask id="Approve" owf:actor="approver" />`, `<bpmn:startEvent id="Ask" owf:actor="requester" />` |
| `actors.assignee` | the assignee of a waiting task |
| `actors.candidate` | the users and groups a waiting task is offered to |

- **A list when there are several:** a multi-instance, a task done twice (a loop back, a restart), two elements naming
  the same actor. Latest first.
- **Scoped as `data` is:** asked from an item in a multi-instance, an actor is the one of the same branch (the line
  being reviewed's approver); asked about the instance (a security policy's `see`), everyone's.
- **Only the engine sets them:** an item's `userName` is the engine's, not a form's or a script's, so a policy can
  trust it. `camunda:initiator` (Camunda's) still copies the starter's name into a data field; `actors.initiator` does
  not read it.

A rule asks "is this user the approver" with the actor as the column and the user in the cell:

| `actors.initiator` | `actors.approver` | `task` | see | data | complete |
|---|---|---|---|---|---|
| `user.userName` | | | `"full"` | `"forms"` | |
| | `user.userName` | | `"full"` | `"all"` | |
| `user.userName` | | `"Approve"` | | | `"deny"` |

When the actor is a list, the cell matches when the user is in it.

**In the model editor:** an **Actor** field on a user task (User assignment) and a start event (Who can start).
**On the instance page:** its actors, under its data.

**The security policy's lists** ask the policy for each instance of a page, and read on past those it hides. Turning
an `actors.<name>` column into a store query is not built. The reverse (who may do what) names each person's actors.

## Where they are built

`engine/DecisionContext.ts`: the names for a decision (`decisionContext`, `runningDecisionContext`), the actors
(`actorsOf`, `actorElements`), the views FEEL reads (`itemView`, `instanceView`, `feelView`). The script handler's
`standardValues` and `evaluateFeel` give the same to JavaScript and FEEL conditions.

## Checks

- `verifyModel` warns, `actor-unknown`, of an `actors.<name>` that no element of the model is: in the model, the
  policies it names, its business rules' decisions.
- *Not built:* a FEEL expression reading a name that is none of these nor a data field the model knows.

## Compatibility

- JavaScript expressions read what they did; a process-level script gets `data` (it was undefined).
- FEEL gains `this`, `item`, `instance`, `actors`, `appServices`.
- The decision context built earlier on 3.7.1 (unreleased) is replaced by these names; the HR demo's policy and the
  tests move to them.
- A security policy deciding about a task reads that item's scoped `data`; about the instance, the instance's.

## Then: notification policies

The third policy (every rule that matches notifies), reading the same names: `notify` (`actors.initiator`, a group,
an expression), `template` (a name, or the text with `${...}`), `channel`. Asked at `assigned`, `completed`,
`overdue`, `ended`; the application delivers (`appDelegate.notify`); every notification is kept in
`wf_notifications`, and in tests only kept, not delivered. Its own design note.
