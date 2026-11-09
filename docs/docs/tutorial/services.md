# Tutorial 6: Calling services, and failing well

**The requirement:** an approved request is recorded in HR's system. If that system refuses it, HR fixes it and it is
tried again. Reminders and the outcome reach people.

## A service task calls your code

**Record the leave** is a service task. Its **Service name** is `recordLeave`, a method of your application's
services, in `connectors/appServices.ts`:

![Record the leave](design/record-service.png)

Its **Inputs** say what it is given (`requester`, `LeaveType`, the dates, `days`, each from the data), and its
**Outputs** what is kept of the answer (`recordId`). The service:

```ts
async recordLeave({ requester, LeaveType, StartDate, EndDate, days }, context) {
    if (!requester || !(days > 0))
        return { bpmnError: 'RecordFailed' };
    const recordId = `LV-${Date.now()}`;
    console.log(`leave recorded: ${recordId} ...`);       // put your HR system's call here
    return { recordId };
}
```

**Remind the managers** and **Tell the employee** call `notify` the same way, with a recipient and a subject. In the
sample both only log what they would do: put your HR system and your email there. After adding a service, run
`npm run services` so the editor knows it, and offers it under **Service name**.

A service task can also call a **REST API** with no code, through a connector: [Connect external services](tutorial-connectors.md).

## When the service fails

A service answering `{ bpmnError: 'RecordFailed' }` raises that BPMN error. **Not recorded** is a boundary error
event on Record the leave, catching `RecordFailed`:

![Not recorded](design/record-error.png)

It leads to **Fix the record**, a task for HR, and back to Record the leave. The instance never stops halfway: either
the leave is recorded, or someone in HR has it on their list.

What is not a BPMN error is a failure of the service itself (an exception, a timeout): the item is marked failed, the
instance stops there, and an administrator can **Retry** it from its instance page. Tick **Exceptions raise a BPMN
error** on the task to raise those as BPMN errors too, with the exception's code (`ETIMEDOUT`), and catch them with an
error event of their own: one with no error catches any. See [Exceptions as BPMN errors](../execution.md#exceptions-as-bpmn-errors).

## Design choices

- **Model the failures the business knows about** (a refusal, a missing record) as BPMN errors with a path of their
  own, and leave unexpected ones to the retry.
- **Keep services small and named for the business** (`recordLeave`, not `post`): the model reads as the process.
- **Keep what a service answers** that later steps or people need (`recordId`).

Previous: [Tutorial 5](deadlines.md). Next: [Tutorial 7, testing every path](tutorial-testing.md).
