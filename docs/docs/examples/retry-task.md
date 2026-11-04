# Retry a failed task

In 3.5.2, a task that throws can stay in the instance with status `error`, ready for an administrator to retry.
The following example uses a local service whose failure you can turn on and off.

1. In your app's services, add a method such as `callOut` that throws
   `Object.assign(new Error('Service unavailable'), { code: 'ECONNREFUSED' })` while the dependency is down
   and returns `{ ok: true }` when it is available.
2. Create **Start → Call service → End**. Bind the service task to `callOut` and leave **Exceptions raise a
   BPMN error** unchecked. Start the process while the dependency is down.
3. Open the instance. It shows **failed at Call service** and the exception message. The failed item has
   `statusDetails.code` set to `ECONNREFUSED`.
4. Restore the dependency and select **Retry** on that instance as an administrator. The same task item
   runs again and the instance reaches **End**. From a host application the equivalent call is
   `await server.engine.retry({ 'items.id': failedItemId })`.

Retry runs the task's work again. If it writes to another system, use an idempotency key or check whether
the previous attempt already made the change.

To handle the outage inside the workflow, check **Exceptions raise a BPMN error**, attach an error boundary
event for `ECONNREFUSED`, and connect it to a separate path. On a fresh run while the service is down, the
boundary path runs in place of parking the task for Retry.

See [Throwing Exceptions](../execution.md#throwing-exceptions) and the
[executable failure and retry cases](https://github.com/bpmnServer/bpmn-server/blob/v3.5.2/packages/bpmn-server/test/task-exceptions.test.mjs).
