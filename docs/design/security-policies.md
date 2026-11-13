# Design: security policies

Status: **a first slice built** (2026-11-12, branch `3.7.1`), to try before it is settled: the evaluation
(`engine/SecurityPolicy.ts`), API v3 and the pages (`routes/caseAccess.ts`), the HR demo's `LeaveCases`. Not yet: the
editor, `verifyModel`'s checks, the "as whom" preview, the `owf` moddle descriptor (the attribute is read from the XML),
and a policy giving claim or complete to someone the assignment doesn't offer the task to. A task the person may not
complete is not theirs to claim either, unless a rule allows claiming it.
Made the way assignment policies are ([assignment.md](assignment.md)): a decision table kept with the models, named by
the model. It settles what the Fable Review held for "the policies level" (H2: instance visibility), and follows the
direction of `bpmn-internal/work/model-policies-feature-views.md` §4: the server enforces before each protected
operation, a denial overrides an allowance, a protected operation is refused unless allowed, and nothing a designer
edits overrides the platform's own security.

## The problem

Who may see a case, which of its data, and what they may do with it and its tasks, is a rule of each application: an
employee sees their own leave requests; a manager sees their team's and approves them, but not their own; HR sees
all. Today it is one rule, in code, for every application (`SecureUser`): a person who isn't an administrator sees any
instance with an item that has no assignee or candidates, which is nearly every instance (start events and service
tasks have none), sees it whole (its data, every item, its Rationale), and may restart it or fire its start events on
the same check. Who completes a task is its assignee or a candidate, with nothing to say *except the requester*.

Decided already (H2, 2026-11-11): instance details are for designers and administrators; everyone else sees their
own work, and a task shows the instance's data that is theirs to see for it. What "theirs" means is the
application's, and is this note.

**Assignment is not authorization.** An assignment (its attributes, its lane, an assignment policy) says who a task
is offered to. A security policy says who may see and act. By default the two agree (a task's assignee and candidates
may claim and complete it); a security policy can take that away (the requester may not approve their own leave) or
give it to others.

## Decisions proposed

1. **A security policy is a decision table** in the models folder, as an assignment policy is, each kind in its own
   folder: `processes/policies/security/<name>.dmn.xml` (assignment policies: `policies/assignment/`).
2. **A process names one, and a task may name its own:** `owf:securityPolicy="LeaveCases"` on the process, for its
   cases and every task of them; on a user task, for that task's actions, asked together with the process's.
3. **Without one, the default policy:** `processes/policies/security/default.dmn.xml` when the application has it, else
   bpmn-web's own, built in (H2's rule, below). An application changes the default by writing one file.
4. **Every matching rule counts, and a denial wins.** Hit policy COLLECT: the server reads all the rules that match;
   for each action, any `deny` refuses it; else any `allow` allows it; else the action's default (below). The rules'
   order doesn't matter, so a rule added at the end can't open what another closes.
5. **Inputs are about the person, the case and the task,** in FEEL: who they are (`user.userName`, `groups`), their
   relation to the case (worked out by the server), the task asked about (`task`: its element id, empty for the
   case), and the case's data (`data.amount`).
6. **FEEL only, no `$(...)`:** unlike an assignment policy's outputs, a security policy can't call the application's
   code. The host asks it on every list and page, and the application's code runs only in the engine
   ([engine-isolation.md](engine-isolation.md)). What the code would know goes into the case's data or the person's
   groups.
7. **The platform's security is not the policy's:** signing in, administering users and the server, designing and
   deploying models, the tenants, and deleting cases stay with roles in code. Administrators and the system are not
   asked: they see and do everything, as today. A policy decides only about cases and their tasks, for everyone else.
8. **A new namespace, `owf:`,** for OWF's own attributes (`owf:securityPolicy`), with its moddle descriptor in
   bpmn-server and the editor. `camunda:` stays for the Camunda-compatible ones (assignee, candidates, forms).
   `camunda:` is only for what Camunda defines: `assignmentPolicy`, `label`, `endLabel` and `exceptionsAsErrors`
   moved to `owf:`, the old names still read ([the owf: namespace](owf-namespace.md)).

## The actions

| Output | Decides | Values | Without a rule that allows it |
|---|---|---|---|
| `see` | the case in the lists (`summary`), and its instance page with items and Rationale (`full`) | `"summary"`, `"full"`, `"deny"` | not seen |
| `data` | which of its data the person reads, on the instance page and in a task's form | `"all"`, `"forms"`, a list of data paths, `"deny"` | none, but a task's own form fields |
| `claim` | taking a task offered to them | `"allow"`, `"deny"` | allowed to its candidates (assignment) |
| `complete` | completing a task | `"allow"`, `"deny"` | allowed to its assignee and candidates (assignment) |
| `assign` | giving a task to someone else: its assignee, its candidates | `"allow"`, `"deny"` | allowed to those with a part in it (today's rule) |
| `restart` | running an item of the case again | `"allow"`, `"deny"` | refused |
| `events` | firing a start event of the running case | `"allow"`, `"deny"` | refused |

- **Several allows add up:** `see` is the widest allowed (`full` over `summary`); `data` the union of what is
  allowed (`all` over `forms` over paths).
- **An empty cell** says nothing about that action.
- `"forms"` is what forms put in the case's data: its start form's and its user tasks' fields, nothing a script, a
  service or a connector set.
- `claim`, `complete` and `assign` are asked with `task` set; the others with `task` empty, or set when the action
  is about a task's item (restarting it).
- **Assigning is an engine operation** (`engine.assign`: it fires the task's assign event, and the Rationale says who
  gave it to whom). Taking a task as its assignee, changing nothing else, is a claim and asks `claim`; any other change
  of its assignee or candidates asks `assign`; a change of its dates or priority alone asks neither.

## Its inputs, and its reverse

A security policy reads what every decision table reads: [one protocol](decision-context.md), the case data by name
and as `data`, the person (`user`, `groups`), their `relation` to the case, the `task`, and the application's facts.
Its reverse, who may do what with a case, is in the same note, and shown under the Rationale on the instance page.

## A policy

`processes/policies/security/LeaveCases.dmn.xml`, hit policy COLLECT:

| relation | groups | task | see | data | claim | complete | assign | restart |
|---|---|---|---|---|---|---|---|---|
| | `list contains(groups, "HR")` | | `"full"` | `"all"` | | | `"allow"` | `"allow"` |
| `"initiator"` | | | `"full"` | `"forms"` | | | | |
| `"candidate"`, `"assignee"` | `list contains(groups, "Manager")` | | `"full"` | `["LeaveType", "StartDate", "EndDate", "RequestReason"]` | | | | |
| `"participant"` | | | `"summary"` | | | | | |
| `"initiator"` | | `"Approve"` | | | `"deny"` | `"deny"` | `"deny"` | |

The last rule is separation of duties: whoever asked for the leave may not claim or approve it, even as a manager,
nor give its approval to someone of their choosing, whatever the task's candidates say. It doesn't matter where the rule is in the table.

## The person's relation to a case

Worked out by the server from the case's items, before the policy is asked. A person has every relation that holds,
and `relation` is a list: an input entry `"initiator"` matches when the list contains it, as `groups` does.

| relation | holds when |
|---|---|
| `initiator` | they started the case (its first item's `userName`, or `data.requester` from `camunda:initiator`) |
| `assignee` | a task waiting in the case is assigned to them |
| `candidate` | a task waiting in the case is offered to them or one of their groups |
| `participant` | they completed a task in it, or are its assignee or candidate |

## The default policy (bpmn-web's, built in)

H2's rule, as a table an application can copy into `policies/security/default.dmn.xml` and change:

| relation | groups | see | data |
|---|---|---|---|
| | `list contains(groups, "DESIGNER")` | `"full"` | `"all"` |
| `"assignee"`, `"candidate"` | | `"summary"` | `"forms"` |
| `"participant"`, `"initiator"` | | `"summary"` | |

`claim` and `complete` keep their defaults (the assignment's); `restart` and `events` stay refused but for
administrators. So an end user sees, in My work and the lists, the cases they started or work on, as a line; opening
a task shows its form and what earlier forms entered; the instance page is for designers and administrators.

## Where it is asked

By the host, with the instance viewer's reads ([engine-isolation.md](engine-isolation.md)), and by the API before the
engine is asked to act: the engine runs nothing new and stores nothing new.

- **Lists:** API v3's `GET /instances` and `GET /tasks`, the Workbench's Instances and Pending Tasks, My work. A case
  not seen is left out.
- **One case:** API v3's `GET /instances/:id` and its Rationale; the instance page. `summary` answers its summary
  only; not seen is the same 404 as an unknown id, as today, so an id can't be probed.
- **A task:** API v3's `GET /tasks/:id` and the task form (`invokeItem`): its data is what `data` allows, its own
  form's fields always; `claim` and `complete` (API v3, `/api2/tasks`, the task form) before the engine is asked;
  `assign` (the pages' Assign form, `/api/engine/assign` and `/api2/engine/assign`) likewise.
- **Restart and start events:** API v3, the instance page.
- **Its answer is said:** a refused action answers 403 with the rule that denied it
  (`POLICY_DENIED`: *policy LeaveCases, rule 5*), and the decision editor's preview shows which rules matched.

## Lists, and paging

A policy is asked per case, and API v3's lists page in the store (Fable Review H5). So that a page isn't emptied by
cases the policy hides afterwards:

- the relations are conditions the store can ask (`items.userName`, `items.assignee`, `items.candidateGroups`); the
  server asks the store for the cases where the person has a relation some rule allowing `see` names (a rule that
  allows `see` with no `relation` matches any case, and then nothing is narrowed);
- the policy is asked for each case of the page; the page is read again past what it hid, until it is full or there
  is no more (a bound on the reads; a page can be short when reached).

## The feature catalog

The model search and the Design dashboard's feature filter (docs/features.yaml's `xml` markers) find them, as the work
doc's §6 asks: a `security-policies` feature with `[owf:securityPolicy]` once built; `assignment-policies` has
`[camunda:assignmentPolicy]` and `labels` has `[camunda:label]`, `[camunda:endLabel]` (2026-11-12).

## Checks

`verifyModel`:

| Code | Severity | When |
|---|---|---|
| `security-policy-not-found` | error | a process's or task's policy isn't in `policies/security/` |
| `security-policy-invalid` | error | it can't be read as a decision, isn't COLLECT, or has `$(...)` in a cell |
| `security-policy-output` | warning | an output that isn't one of the actions, or a value its action doesn't take |
| `security-policy-input` | warning | an input that isn't `relation`, `groups`, `user...`, `task` or the case's `data...` |
| `security-policy-task` | warning | a rule's `task` that isn't a user task of the process |
| `role-unknown` | warning | a group a rule names that isn't in `roles.json` (as for assignment) |

## Trying it

- **The decision editor's Test tab**, as for any decision: a person (user name, groups), a relation, a task, data;
  every rule that matches, and what each action comes to.
- **"As whom" on the instance page**, for administrators: the case as a given user sees it, and the rules that decided.
- **Tests:** a model's `.feature` with `@login` already acts as a person; steps that a case is or isn't seen, which
  data a task shows, and that claiming or completing is refused, so a policy is tested where its process is.

## Compatibility

- **Nothing changes until it is on:** while an application has no security policy file and no model names one, the
  rule is today's (`SecureUser`), for a release; bpmn-web's default policy is turned on with a setting
  (`SECURITY_POLICY=default`), and becomes the default in the release after, with the change in the upgrade notes.
  H2's exposure stays until then for those who don't turn it on: the setting is in the security checklist.
- `ENFORCE_SECURITY=false` and `REQUIRE_AUTHENTICATION=false` still turn the rules off, for development.
- API v3 adds no fields; a case or data not seen is left out, as an unknown one is; a refused action is a 403
  (`POLICY_DENIED`) where it was allowed before.
- `/api` and `/api2` act as their service account, which is the system: not asked.

## Open questions

1. **Data paths in `data`:** a path shows a whole branch (`customer` shows `customer.address`); is finer needed, or a
   `deny` of paths?
2. **A task's own form fields** are always shown to whoever may complete it: could a policy need to hide one?
3. **The relation `manager-of`** (the employee's manager, whoever has the task) needs the application's code, which a
   security policy can't call. Kept as data (`data.managerId`, set when the case starts) for now.
4. **Moving the `camunda:` OWF attributes to `owf:`**: with this note, or apart (the work doc's question).
5. **Notifications** (the work doc's `@notify`) are not this note.

## Increments

1. This note, discussed.
2. The server: the `owf` namespace, the relation, the policy's evaluation (DMNEngine, COLLECT, FEEL only), the
   built-in default, behind `SECURITY_POLICY`; asked in API v3's instance and task routes, claim and complete
   included. Tests: each action, each relation, deny over allow, no rule, a missing policy; one person can't see
   another's case, and the requester can't approve their own (the negative tests H2 asked for).
3. The pages: the Workbench, the instance page, My work, the task form.
4. The editor: `owf:securityPolicy` on a process and a task, the policy list, a preview; `verifyModel`'s checks; the
   catalog's `security-policies` feature.
5. The HR demo's Leave Application with `LeaveCases`, and its scenarios as each role.
