# Decision tables: one protocol, and a security policy's reverse

**Status:** built on `3.7.1` (`engine/DecisionContext.ts`). What every expression reads, decision tables included, is
[expressions.md](expressions.md).

bpmn-server evaluates decision tables in three places: a business rule task's decision, a user task's
[assignment policy](assignment.md) and an instance's [security policy](security-policies.md). They read the same names
(expressions.md), prepared the same way. What differs is only what their outputs mean and their hit policy:

| | Its outputs | Hit policy | Asked |
|---|---|---|---|
| Business rule task | its result (`camunda:resultVariable`, `mapDecisionResult`) | the table's | when the task runs |
| Assignment policy | `assignee`, `candidateUsers`, `candidateGroups` | first rule | when the user task starts |
| Security policy | `see`, `data`, `claim`, `complete`, `assign`, `restart`, `events` | every rule, a denial wins | on every list, page and action |

**A table reads**, each over the ones before it: the data's fields by name (`amount`); the task's prepared inputs by
name (its `camunda:inputOutput`, which may call `appServices`); the names every expression reads (`data`, `user`,
`actors`, `task`, `decision`, `item`, `this`, `instance`, `appServices`), which the data can't set; then the
application's facts, from `appDelegate.decisionContext(context, about)` (a failure is logged, and the table decides
without them).

**A table's own variables:** an input column whose label is a plain name (`employeeManager`, its expression
`appServices.managerOf(actors.initiator)`) is a variable of that table: calculated in the table, once, and read by
name in its rules' outputs. It can't replace the protocol's names.

**A list input** (`user.userGroups`, an actor of several people) matches a test when the list does (`count(?) > 1`),
or one of its values does (`"Manager"`).

**An input that calls an async service** (`appServices.regionOf(data.requester)`) is awaited before the rules are
tested (`DMNEngine.evaluateAsync`). A call inside a larger expression is not.

**Who acts:** the engine knows an operation's user by name. A business rule or an assignment policy that reads the
user's groups gets them from the application's `decisionContext` (`userGroups`). A security policy is asked by the
host, which has the whole user.

## The reverse of a security policy

`SecurityPolicy.whoMay(instance, { users, roles, admins })`: who may do what with an instance. A policy decides for one
user, so the reverse asks it forward for everyone who could make a difference:

- **The people the instance names:** who started it, a waiting task's assignee and candidate users, who completed a
  step, with the actors they are. With a user directory (`users`), everyone in it, with their groups. Someone the
  instance names whom the directory doesn't know is asked with no groups, and said so.
- **Each role** (`roles`, and the groups its waiting tasks are offered to), as a member who is no actor of it.
- **Anyone else.**
- **Administrators** (`admins`): not asked; they may do everything.

For each, it gives the instance (see, data, restart, start events), and for each waiting user task whether they may
claim, complete and assign it: the assignment's offer, unless a rule denies it, or a rule's allow. A task is decided
with its item's actors and data, in its branch.

It is exact for rules on actors, groups and the data. A role is asked as a member of that one group: a rule needing
two groups shows in the people's rows, which need the directory.

**Shown:** on the instance page, under the Rationale, as **Assignment and access**. Each user task's assignment after
the fact is shown to everyone who sees the instance. Who may do what is shown to designers and administrators. In API
v3, `GET /instances/{id}/access` is for an administrator's own token or the service key.

**The directory:** bpmn-web's own users; with an application's user manager, its optional `listUsers()`.
