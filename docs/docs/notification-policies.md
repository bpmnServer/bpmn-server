# Notification policies

A process can say who is told what, and when, by naming a **notification policy**: a decision table, kept with the
models, whose every matching rule sends a notification. One table covers a whole process: *when Approve waits, tell
those it is offered to; when it is approved, tell the employee; when the leave is recorded, tell HR*.

The design: `docs/design/notification-policies.md`. *A first slice:* it may change as it is tried. The HR demo's
Leave Application uses one: `apps/hrdemo/workflow/processes/policies/notification/LeaveNotices.dmn.xml`.

## The process

```xml
<bpmn:process id="LeaveProcess" owf:notificationPolicy="LeaveNotices">
```

In the model editor: select the process (click the canvas), and in **Policies** write the **Notification policy**.
A user task can name its own too (**User assignment**, **Notification policy**), asked at that task's events besides
the process's.

## The policy

A DMN decision table in the models folder, `policies/notification/<name>.dmn.xml`, hit policy **COLLECT**: every rule
that matches notifies. The HR demo's `LeaveNotices`:

| event | task | data.approval | data.recordId | notify | template | channel |
|---|---|---|---|---|---|---|
| `"assigned"` | `"Approve"` | - | - | `actors.candidate` | `"approval-request"` | `"email"` |
| `"completed"` | `"Approve"` | `"A"` | - | `actors.initiator` | `"leave-approved"` | `"email"` |
| `"completed"` | `"Approve"` | `"Reject"` | - | `actors.initiator` | `"Your ${data.LeaveType} leave was not approved: ${data.comment}"` | `"inbox"` |
| `"ended"` | - | - | `not(null)` | `["HR", actors.approver]` | `"Leave ${data.recordId} recorded for ${actors.initiator}, approved by ${actors.approver}"` | `"inbox"` |

1. A request waits for approval: tell those it is offered to (the Manager or HR group, as the assignment policy said).
2. Approved: tell the employee who asked, with the `leave-approved` template.
3. Not approved: tell the employee, with the approver's comment.
4. Recorded in HR's system: tell HR, and the manager who approved it.

### When it is asked: `event`

| event | when | `task`, `data` |
|---|---|---|
| `"assigned"` | a user task waits for someone (its assignee and candidates set, its assignment policy applied) | that task; its data |
| `"completed"` | a user task is completed | that task; its data, with what its form entered |
| `"ended"` | the instance ends | empty; the instance's data |

### What a rule reads

What every expression reads ([expressions.md](../design/expressions.md)): the data by name (`days`) and as `data`,
`event`, `task`, `item` (`item.userName`: who completed it), `instance`, `user`, and the instance's **actors**:

| | who |
|---|---|
| `actors.initiator` | who started the instance |
| `actors.assignee`, `actors.candidate` | a waiting task's assignee; the users and groups it is offered to |
| `actors.approver` | who completed the elements the model names so: `<bpmn:userTask id="Approve" owf:actor="approver">` |

### Its outputs

- **`notify`:** whom. Users and groups, as FEEL: an actor (`actors.initiator`), a name (`"HR"`), a list
  (`["HR", actors.approver]`). Or a model expression, `$(appServices.managerOf(data.requester))`, through the
  application's services. Text with commas is a list. A rule whose `notify` comes to nobody notifies no one, and the
  Rationale says so.
- **`template`:** a template's name, or the message itself.
  - **A name** is a file of the models folder, `policies/notification/templates/<name>.md` (or `.txt`). Its first line
    is the subject (a leading `#` is dropped), the rest the message. `approval-request.md`:
    ```markdown
    # Leave to approve: ${data.LeaveType}, ${data.days} days

    ${actors.initiator} asks for ${data.LeaveType} leave from ${data.StartDate} to ${data.EndDate} (${data.days} days).

    Reason: ${data.RequestReason}
    ```
  - **Any other text** is the message, and its first line the subject.
  - Either way, its `${...}` parts are filled in as a model's text is: `${data.days}`, `${item.name}`,
    `${actors.approver}`. A value that isn't there is left empty.
- **`channel`:** optional, passed as it is (`email`, `inbox`, `sms`). What it means is the application's.

## Delivering them

bpmn-server works out whom and what; **the application delivers**, with its delegate's `notify`:

```ts
class AppDelegate extends WebAppDelegate {
    async notify(notification) {
        // notification: { to, subject, message, channel, event, instanceId, elementId, policy, rule, ... }
        if (notification.channel === 'email')
            await this.mailer.send({ to: await this.addressesOf(notification.to), subject: notification.subject, text: notification.message });
        else
            await this.inbox.add(notification);
    }
}
```

`to` holds what the rule said, users and groups alike: the application knows its directory. The HR demo's `notify`
writes each notification to the console.

**Every notification is kept**, delivered or not, in the store's `wf_notifications`, with its `status`:

| status | |
|---|---|
| `sent` | the application's `notify` took it |
| `recorded` | kept, not delivered: a test run's, `NOTIFICATIONS=record`, or no `notify` |
| `failed` | its `notify` threw, or its rule failed; `error` says why |

**A notification never fails the process.** A policy that isn't there, a rule that fails, a `notify` that throws:
the Rationale says it, and the process goes on. The Rationale says each one sent: *notified Manager — policy
LeaveNotices, rule 1, template approval-request, delivered*.

## Testing them

Nothing is delivered in tests: an instance the model editor's Test tab runs has its notifications kept as `recorded`,
and its delegate's `notify` is not called. On a test or staging server, `NOTIFICATIONS=record` does so for every
instance.

What an instance notified: API v3's `GET /api/v3/instances/{id}/notifications`, for whoever sees the instance fully.

```json
{ "id": "…", "name": "Leave Application", "items": [
  { "event": "assigned", "elementId": "Approve", "policy": "LeaveNotices", "rule": 1, "to": ["Manager"],
    "template": "approval-request", "subject": "Leave to approve: Vacation, 5 days",
    "message": "user1 asks for Vacation leave from 2026-12-01 to 2026-12-05 (5 days).\n\nReason: Holidays",
    "channel": "email", "status": "sent" } ] }
```

## Checks

`verifyModel` reports:

| Code | Severity | When |
|---|---|---|
| `notification-policy-not-found` | error | a process's or task's policy isn't in `policies/notification/` |
| `notification-policy-invalid` | error | the policy's file can't be read as a decision |
| `notification-policy-output` | warning | an output that isn't `notify`, `template` or `channel` |
| `notification-template-not-found` | warning | a template cell that is a name (`"approval-request"`) with no file of that name |
| `actor-unknown` | warning | an `actors.<name>` that no element of the model is (`owf:actor`) |

## Not yet

The `overdue` (a task past its due date) and `started` events; the notifications on the instance page; a scenario
step to say who was notified.
