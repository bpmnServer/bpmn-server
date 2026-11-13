# Assignment policies

A user task can say who works on it by naming an **assignment policy**: a decision table, kept with the models, whose
first matching rule assigns the task when it starts. A rule written once, *over 10,000 goes to a director, IT requests
to the IT manager, else the requester's manager*, serves every task that names it.

The design: `docs/design/assignment.md`. *A first try:* it may change as it is tried. The HR demo's Leave
Application uses one: `apps/hrdemo/workflow/processes/policies/assignment/LeaveApproval.dmn.xml`.

## The task

```xml
<bpmn:userTask id="approve" name="Approve" owf:assignmentPolicy="Approval" />
```

In the model editor: select the task, and in **User assignment** choose the **Assignment policy** from the
policies of the models folder. **Open** shows it in the decision editor; **New policy** makes one (a FIRST table with
the `assignee` and `candidateGroups` outputs). Under the field, a preview with the Test tab's scenario: *Rule 1:
offered to HR · A long leave's start data*, or *No rule matches: the task stays unassigned*. A `$(...)` output is
shown as written: it is worked out when the task starts.

## The policy

A DMN decision table in the models folder, `policies/assignment/<name>.dmn.xml`:
`processes/policies/assignment/Approval.dmn.xml`. A policy kept directly in `policies/` (as at first) is moved into
`assignment/` when it is read. Edit it
as any other decision.

| amount | department | assignee | candidateGroups |
|---|---|---|---|
| > 10000 | - | | `"Director"` |
| - | `"IT"` | | `"ITManager,Admins"` |
| - | `"HR"` | `$(appServices.managerOf(data.requesterId))` | |
| - | `"Sales"` | `requesterId` | |

- **Hit policy FIRST:** the rules in order, the first that matches assigns. (UNIQUE, PRIORITY and ANY work too.)
- **Inputs** are FEEL on the case's data, as a business rule task's are: `amount` is `data.amount`.
- **Outputs** are the task's fields: `assignee`, `candidateUsers`, `candidateGroups`. A list is a FEEL list or text
  with commas (`"ITManager,Admins"`). Another output is not used (`verifyModel` warns).
- **An output cell** is FEEL (`"Director"`, `requesterId`), or a model expression `$(...)`, evaluated as the model's
  other expressions are: it can call the application's services
  (`$(appServices.managerOf(data.requesterId))`).
- **An empty output cell** leaves that field as it was.
- **Its tests** are a decision's: the decision editor's Test tab, kept as `<name>.policy.dmn.feature` in the models
  folder. A `$(...)` output's result is its text.

## When the task starts

1. The task's own attributes (`camunda:assignee`, `camunda:candidateUsers`, `camunda:candidateGroups`) and its lane
   are set, as always.
2. The policy is evaluated. **It wins:** each field its rule sets replaces what the attributes and the lane gave.
3. The task keeps what decided, `assignment: { policy: 'Approval', rule: 1 }`, and the instance's Rationale says it:
   *user task 'Approve' (approve) is offered to Director — policy Approval, rule 1*.

**No rule matches, the policy isn't there, or it fails** (a FEEL error, a service that throws): the policy assigns
nothing. The task keeps what its attributes and lane gave, if anything, and the Rationale says why. A task never fails
because of its policy.

The policy runs once, when the task starts: not when it is claimed, and not when the data changes later.

**What a policy reads** is what every expression reads ([expressions.md](../design/expressions.md)): the data by
name (`amount`) and as `data` (the task's, in its branch), the task's prepared inputs (its input parameters, which may
call the application's services: `$(appServices.managerOf(this.data.requester))`), `user`, `actors`
(`actors.initiator`, who started the instance; `actors.approver`, who completed the elements the model names so with
`owf:actor`), `task`, `instance`, `appServices` (an input `appServices.regionOf(data.requester)`, awaited). A rule can
say "not the one who asked": an `actors.initiator` column, `not(user.userName)`.

**After the fact**, the instance page shows each user task's assignment under the Rationale: who it was offered to
and assigned to, the policy and rule that decided it, who claimed or reassigned it, who completed it.

**API v3** returns what decided as the task's `assignedBy`: `{ policy: 'Approval', rule: 1 }`, so a client can show
why a task came to someone.

**Claimed, or reassigned by hand.** Someone taking a task they were offered keeps what offered it, and the Rationale
says *is claimed by dora — it was offered to Director (policy Approval, rule 1)*. Any other change of its assignee or
candidates is that person's: the task's `assignment` (and `assignedBy`) becomes `{ userName: 'mgr' }`, and the
Rationale says what it was and what it is now: *is reassigned by mgr: assigned to ed — it was assigned to dora (policy
Approval, rule 1)*.

## Roles

`processes/roles.json` lists the application's roles: `["Manager", "Director", "ITManager"]`. A role is the user
group of the same name.

Administrators edit them on the **Administration** page's **Roles** card: each role with where it is used (the
models' lanes, the groups a policy assigns) and how many users are in its group; **Add** and **Remove**; and the
names used but not listed, each with an **Add**. A role isn't renamed there: models and policies name it, so a new
name is a new role. Removing one that is still used says where, and the models' checks warn about it. With the file there, `verifyModel` warns about a lane, or a group a policy assigns, that
isn't one of them.

## Checks

`verifyModel` reports:

| Code | Severity | When |
|---|---|---|
| `assignment-policy-not-found` | error | a task's policy isn't in `policies/assignment/` |
| `assignment-policy-invalid` | error | the policy's file can't be read as a decision |
| `assignment-policy-output` | warning | an output that isn't `assignee`, `candidateUsers` or `candidateGroups` |
| `role-unknown` | warning | a lane, or a group a policy assigns, not in `roles.json` |
| `roles-invalid` | error | `roles.json` isn't a list of names |
