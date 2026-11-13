# One protocol for decision tables

**Status:** built on `3.7.1` (`engine/DecisionContext.ts`).

bpmn-server evaluates decision tables in three places: a business rule task's decision, a user task's
[assignment policy](assignment.md) and a case's [security policy](security-policies.md). They read the same inputs,
prepared the same way. What differs is only what their outputs mean and their hit policy:

| | Its outputs | Hit policy | Asked |
|---|---|---|---|
| Business rule task | its result (`camunda:resultVariable`, `mapDecisionResult`) | the table's | when the task runs |
| Assignment policy | `assignee`, `candidateUsers`, `candidateGroups` | first rule | when the user task starts |
| Security policy | `see`, `data`, `claim`, `complete`, `assign`, `restart`, `events` | every rule, a denial wins | on every list, page and action |

## What a table reads

Each layer is over the ones before it:

1. **The case data**, its fields by name: `amount`, `customer.tier`.
2. **The task's prepared inputs**: its `camunda:inputOutput` input parameters, evaluated and awaited when the task
   starts, by name. A parameter can call the application's services:
   `<camunda:inputParameter name="boss">$(appServices.managerOf(this.data.requester))</camunda:inputParameter>`.
   A business rule task and a user task (for its assignment policy) both have them.
3. **The protocol's own names**, which the case data and the prepared inputs can't set:

   | Name | What it is |
   |---|---|
   | `data` | the case data whole: `data.amount` |
   | `user` | `{ userName, groups }`: the person acting (the operation's user), or asking (a security policy) |
   | `groups` | their groups (a list) |
   | `relation` | their relations to the case (a list): `initiator`, `assignee`, `candidate`, `participant` |
   | `initiator` | who started the case |
   | `task` | the element the decision is about |
   | `decision` | `{ kind, name }`: what is deciding |

4. **The application's facts**: `appDelegate.decisionContext(context, about)`, when the application has it (awaited).
   What it returns is added: `{ managerOf: true }`, or a person's `groups` when only the application knows them.
   A failure is logged, and the table decides without them.

**A list input** (`groups`, `relation`) matches a test when the list does (`count(?) > 1`), or one of its values
does (`"Manager"`).

**Who acts:** the engine knows the operation's user by name, not their groups. A business rule or an assignment
policy that reads `groups` gets them from the application's `decisionContext`. A security policy is asked by the
host, which knows the person's groups.

## The reverse of a security policy

`SecurityPolicy.whoMay(instance, { users, roles, admins })`: who may do what with a case. A policy decides for one
person, so the reverse asks it forward for everyone who could make a difference:

- **The people the case names:** who started it, a waiting task's assignee and candidate users, who completed a step.
  With a user directory (`users`), everyone in it, with their groups. Someone the case names whom the directory
  doesn't know is asked with no groups, and said so.
- **Each role** (`roles`, and the groups its waiting tasks are offered to), as a member with no relation to the case.
- **Anyone else.**
- **Administrators** (`admins`): not asked; they may do everything.

For each, it gives the case (see, data, restart, start events), and for each waiting user task whether they may claim,
complete and assign it: the assignment's offer, unless a rule denies it, or a rule's allow.

It is exact for rules on relations, groups and the case's data. A role is asked as a member of that one group: a rule
needing two groups shows in the people's rows, which need the directory.

**Shown:** on the instance page, under the Rationale, as **Assignment and access**. Each user task's assignment after
the fact is shown to everyone who sees the case. Who may do what is shown to designers and administrators. In API v3,
`GET /instances/{id}/access` is for an administrator's own token or the service key.

**The directory:** bpmn-web's own users; with an application's user manager, its optional `listUsers()`.

## Compatibility

- A business rule table reads what it did (the data and its task's inputs by name). A data field named `data`,
  `user`, `groups`, `relation`, `initiator`, `task` or `decision` is now the protocol's, not the field.
- An assignment policy reads its task's prepared inputs, and the protocol's names, besides the data.
- A security policy reads the case data by name too, besides `data.`.
