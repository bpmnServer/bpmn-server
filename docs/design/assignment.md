# Design: assignment policies

Status: **draft for discussion.** 2026-11-11, on branch `3.7.1`. A first try, to prototype before it is settled.
It replaces the role and policy part of PR #286 (`camunda:properties`, `settings/config.ts`, `resolveAssignment`).

## The problem

A user task says who works on it with `camunda:assignee`, `camunda:candidateUsers` and `camunda:candidateGroups`,
or with its lane. Each is a value or an expression, written into each model. A rule such as *over 10,000 goes to a
director; IT requests to the IT manager; else the requester's manager* is written again in every model that needs
it, as code a report or the editor can't read.

## Decisions so far

1. **The application holds its roles and its policies,** in its models folder, next to its models:
   - `processes/roles.json`: the roles' names, `["Manager", "Director", "ITManager", "HR"]`. A role is the user
     group of the same name.
   - `processes/policies/assignment/<name>.dmn.xml`: a policy, as a DMN decision table. Each kind of policy has
     its folder in `policies/`: `assignment/`, and `security/` ([security-policies.md](security-policies.md)).
2. **A task picks a policy,** by its name: `owf:assignmentPolicy="Approval"`.
3. **A policy is a decision table** (DMN, hit policy FIRST): conditions on the case's data in FEEL, the first rule
   that matches assigns. The DMN support already there evaluates it (`dmn/DMNEngine.ts`).
4. **What a rule assigns is an expression:** a FEEL value (`"Director"`, `requesterId`), or a model expression
   `$(...)`, evaluated as the model's other expressions are, so it can find a person through the application's
   code (`$(appServices.managerOf(data.requesterId))`).
5. **The result is the task's usual fields:** `assignee`, `candidateUsers`, `candidateGroups`. Nothing new to read:
   permissions, the task API and the lists work as they do.
6. **It runs once, when the task starts.** Not on claim, not when the data changes later.

## A policy

`processes/policies/assignment/Approval.dmn.xml`:

| amount | department | assignee | candidateGroups |
|---|---|---|---|
| > 10000 | | | `"Director"` |
| | `"IT"` | | `"ITManager"` |
| | | `$(appServices.managerOf(data.requesterId))` | |
| | | | `"Manager"` |

- **Inputs** are FEEL over the case's data, as a business rule task's are (`amount` is `data.amount`).
- **Outputs**, any of `assignee`, `candidateUsers`, `candidateGroups`. A list is a FEEL list or text with commas.
  A cell starting `$(` is a model expression; an empty cell leaves the field alone.
- **Hit policy FIRST**, the rules in order. Another single-hit policy (UNIQUE, PRIORITY, ANY) works too.
- Its *who would get it* can be asked without a task, as with any decision (the Test tab, the rules API).

## The task

```xml
<bpmn:userTask id="approve" name="Approve" owf:assignmentPolicy="Approval" />
```

In the editor, the User assignment group has **Assignment policy**: a list of the application's policies, and a
preview with the Test tab's data, as labels have: *offered to Director (rule 1)*.

## When the task starts

1. The model's own attributes and its lane are set, as today.
2. The policy is evaluated with the case's data. **The policy wins:** each field its rule sets replaces what the
   model's attributes and lane gave (`candidateGroups` included); a field the rule leaves empty stays as it was.
3. The item keeps what decided: `item.assignment = { policy: 'Approval', rule: 1 }`.
4. A Rationale entry says it:
   `user task 'Approve' (approve) is offered to Director — policy Approval, rule 1 (amount > 10000)`.
5. **No rule matches, the policy isn't there, or it fails:** the policy assigns nothing. The task **stays
   unassigned** (what its own attributes or lane gave, if any, stays), and a Rationale entry says why. A task never
   fails because of its policy. The Test tab's scenarios explore what that means for a process.

## Afterwards: a claim, a reassignment

`Execution.assign` (claim, and a reassignment through any API) changes the fields, and says so in the Rationale
(`reassigned` in `engine/AssignmentPolicy.ts`):

- **A claim**, a person taking an unassigned task as its assignee and changing nothing else, keeps `item.assignment`:
  the policy still explains why it was offered to them. Entry: `is claimed by dora`, why: what it was, and what decided.
- **Any other change** of `assignee`, `candidateUsers` or `candidateGroups` is that person's: `item.assignment =
  { userName }`. Entry: `is reassigned by mgr: assigned to ed`, why: what it was, and what decided it before.
- A change of other fields (a due date) is not a reassignment.

API v3's Task returns `item.assignment` as `assignedBy`. (Not `assignment`: v3's Element uses that name for the
model's assignee and candidates.)

## Checks

`verifyModel`:
- a task's policy that isn't in `processes/policies/assignment/` is an error;
- a group a policy assigns that isn't in `roles.json` is a warning (when the file exists);
- a lane whose name isn't in `roles.json` is a warning (when the file exists).

## Compatibility

- Nothing changes for a task with no `owf:assignmentPolicy`, or an application with no `policies` folder.
- `item.assignment` is a new, optional field.
- The models list, imports and exports take `roles.json` and `policies/` along with the models; a server with
  several applications has them per application, as their models are.

## Left out of the first try

- Running a policy again (on claim, restart, or a data change).
- A role that means more than its group (users, or an expression of its own).
- Policies shared across applications.

## Settled in discussion

1. **The file name** is `policies/assignment/<name>.dmn.xml` (2026-11-12: a folder per kind of policy; at first
   `policies/<name>.dmn.xml`, moved into `assignment/` when read).
2. **A policy and explicit attributes on the same task:** the policy wins, for each field its rule sets.
3. **No match:** the task stays unassigned; no fallback. The tests explore it.

## Increments

1. This note.
2. The engine: `owf:assignmentPolicy`, the evaluation, `item.assignment`, the Rationale entries; `verifyModel`'s
   checks. Engine scenarios: each rule, no match, a failing policy, an explicit attribute, a `$(...)` output.
3. The editor: the Assignment policy list, the preview; the DMN editor opens `policies/assignment/`.
4. The HR demo's Leave Application with a policy, to try.
