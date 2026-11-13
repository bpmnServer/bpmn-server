# Notification policies

**Status:** built on `3.7.1` (`engine/NotificationPolicy.ts`), a first slice. How to use them, with the HR demo's
`LeaveNotices`: [docs/docs/notification-policies.md](../docs/notification-policies.md).

The third policy, beside [assignment](assignment.md) and [security](security-policies.md): who is told what, and when.
A decision table reading the names every expression reads ([expressions.md](expressions.md)); **every rule that
matches notifies** (hit policy COLLECT), so one event can tell several people several things.

| Policy | Rules that count | What its outputs say |
|---|---|---|
| Assignment | the first | who a task is assigned or offered to |
| Security | every one; a denial wins | who may see or do what |
| Notification | every one | whom to notify, with what message, by what channel |

## The model

```xml
<bpmn:process id="Leave" owf:notificationPolicy="LeaveNotices">
  <bpmn:userTask id="Approve" owf:notificationPolicy="ApprovalNotices" />
```

The process's policy is asked at every event of its instances; a user task's own, at that task's events, besides.
In the model editor: a process's **Policies** group (its security and notification policies), a user task's **User
assignment** group. The Model report says them.

## When it is asked

The table's `event` input says which:

| event | when | the table's `task`, `item`, `data` |
|---|---|---|
| `assigned` | a user task waits for someone: its assignee and candidates set (its policy applied) | that task, its item, its data |
| `completed` | a user task is completed (asked once it has ended: who completed it is its actor) | that task, its item, its data, `item.userName` who completed it |
| `ended` | the instance ends | empty, none, the instance's data |

*Not built yet:* `overdue` (a task past its due date), `started`.

## The policy

`policies/notification/<name>.dmn.xml`, hit policy COLLECT:

| event | task | notify | template | channel |
|---|---|---|---|---|
| `"assigned"` | `"Approve"` | `actors.assignee, actors.candidate` | `"approval-request"` | `"email"` |
| `"completed"` | `"Approve"` | `actors.initiator` | `"Your leave is ${data.decision}"` | `"inbox"` |
| `"ended"` | - | `actors.initiator, actors.approver` | `"case-closed"` | |

- **`notify`:** whom: user names and groups, as FEEL (`actors.initiator`, `"HR"`, a list), or a model expression
  `$(...)` evaluated as the model's others are (`$(appServices.managerOf(data.requester))`). Text with commas is a list.
  A rule whose `notify` comes to nobody notifies no one, and the Rationale says so.
- **`template`:** a template's name, or the message itself. A name is a file of the models folder,
  `policies/notification/templates/<name>.md` (or `.txt`): its first line is the subject, the rest the message.
  Otherwise the text is the message, and its first line the subject. Either way `${...}` parts are filled in, as a
  model's text is (`${data.days}`, `${item.name}`, `${actors.initiator}`).
- **`channel`:** optional, passed as it is (`email`, `inbox`, `sms`): what it means is the application's.

## Delivered, and kept

bpmn-server works out who and what; **the application delivers**: `appDelegate.notify(notification)`, when it has
one. Every notification is **kept**, delivered or not, in the store's `wf_notifications`:

| field | |
|---|---|
| `id`, `createdAt` | |
| `instanceId`, `instanceName`, `itemId`, `elementId`, `event` | what it is about |
| `policy`, `rule` | what decided it |
| `to` | whom (as the rule said: users and groups) |
| `template`, `subject`, `message`, `channel` | what |
| `status` | `recorded` (kept, not delivered), `sent`, `failed` (with `error`) |
| `test` | a test run's |

**In tests, nothing is delivered:** a test run's instance (the model editor's Test tab, its scenarios), and every
instance when the server says so (`NOTIFICATIONS=record`), has its notifications kept as `recorded`, and
`appDelegate.notify` is not called. A test reads them in the store.

**A notification never fails the process:** a policy that is not there or fails, a template that can't be filled, an
application's `notify` that throws: the Rationale says it, the notification is kept as `failed`, and the process goes on.

**Shown:** the Rationale (*notified ann: approval-request — policy LeaveNotices, rule 1*); API v3's
`GET /instances/{id}/notifications`, for whoever sees the instance fully.

## Checks

`verifyModel`:

| Code | Severity | When |
|---|---|---|
| `notification-policy-not-found` | error | a process's or task's policy isn't in `policies/notification/` |
| `notification-policy-invalid` | error | it can't be read as a decision |
| `notification-policy-output` | warning | an output that isn't `notify`, `template` or `channel` |
| `notification-template-not-found` | warning | a template cell that is a name (`"approval-request"`) with no file of that name |

## Not built yet

`overdue` and `started` events; the instance page's list; the Design page's list of notification policies; a
scenario step to say who was notified.
