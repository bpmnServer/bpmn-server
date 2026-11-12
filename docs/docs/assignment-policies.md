# Assignment policies

A user task can say who works on it by naming an **assignment policy**: a decision table, kept with the models, whose
first matching rule assigns the task when it starts. A rule written once, *over 10,000 goes to a director, IT requests
to the IT manager, else the requester's manager*, serves every task that names it.

The design: `docs/design/assignment.md`. *A first try:* it may change as it is tried. The HR demo's Leave
Application uses one: `apps/hrdemo/workflow/processes/policies/LeaveApproval.dmn.xml`.

## The task

```xml
<bpmn:userTask id="approve" name="Approve" camunda:assignmentPolicy="Approval" />
```

In the model editor: select the task, and in **User assignment** choose the **Assignment policy** from the
policies of the models folder. **Open** shows it in the decision editor; **New policy** makes one (a FIRST table with
the `assignee` and `candidateGroups` outputs). Under the field, a preview with the Test tab's scenario: *Rule 1:
offered to HR · A long leave's start data*, or *No rule matches: the task stays unassigned*. A `$(...)` output is
shown as written: it is worked out when the task starts.

## The policy

A DMN decision table in the models folder, `policies/<name>.dmn.xml`: `processes/policies/Approval.dmn.xml`. Edit it
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
| `assignment-policy-not-found` | error | a task's policy isn't in `policies/` |
| `assignment-policy-invalid` | error | the policy's file can't be read as a decision |
| `assignment-policy-output` | warning | an output that isn't `assignee`, `candidateUsers` or `candidateGroups` |
| `role-unknown` | warning | a lane, or a group a policy assigns, not in `roles.json` |
| `roles-invalid` | error | `roles.json` isn't a list of names |
