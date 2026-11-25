# Frequently asked questions

## How do I pass one task's output to another?

Have the task write what it produces into the case's data under a name of your choosing, and let later tasks read
that name. Don't have a task hunt through the case for another task's output: a task can run many times (in a loop,
or as a multi-instance), so "the output of task1" is not one thing.

**1. The task produces its output.** A service task's output is what its service returns:

```ts
async getQuote(input, context) {
    return { price: 120, currency: 'EUR' };
}
```

**2. Put it into the case's data under a name.** An output mapping on the task, or a line in its end listener, gives
it a name that the rest of the model can rely on:

```js
data.quote = item.output;
```

**3. Later tasks read that name:**

```js
$data.quote.price
```

If the task can run more than once, give each run its own name, for example by including the item's key:
`data['quote_' + item.itemKey] = item.output`.

See [Managing data](../data.md), [Data objects](../data-objects.md) and [Scripting](../scripting.md).

## How do I find out why a step failed?

Open the case and read its **Rationale**: every step, in order, with what decided it. A failed step shows the error
it raised and where it stopped. The instance's log holds the detail.

Over the API, `GET /api/v3/instances/{id}/rationale` answers the same, which is how an AI agent inspects a failing
test: [API v3](../api-v3.md).

## How do I raise a BPMN error from my own code?

Return `{ bpmnError: 'TheErrorName' }` from a service rather than throwing. The engine then raises that BPMN error,
and an error boundary event on the task catches it, so the model decides what happens next.
Throwing an ordinary error fails the step instead, and the case stops there.

See [Errors and escalations](../examples/error_events.md) and [Service task](../examples/serviceTask.md).

## A task is stuck. How do I get the case moving again?

A step that was running when a server stopped can be left holding its lock. [Advanced topics](../advanced.md#hung-tasks)
covers finding and releasing those.

## Can I change a model while cases are running on it?

Yes. Running cases keep the version of the model they started on, and new cases use the saved one. The model editor
keeps the previous versions when Model History is on: [Model Options](../add-ons/modeling.md).

## What is kept in the workflow database, and what should stay in mine?

The engine keeps the models, the cases, their items and the data a process needs to run. Your business records, such
as orders, claims and employees, belong in your own database. A case carries their keys and calls your services.
See [Overview](../index.md#how-the-parts-fit) and [Data objects](../data-objects.md).

## Which database should I use?

MongoDB for a server that several processes or people use, SQLite for a single server or a small installation, and
memory only for trying things or for tests, since it keeps nothing when the server stops. See
[Installation](../setup.md) and [Custom persistence](../persistence.md).

## How do I stop timers or service tasks from running on a demo server?

`TIMERS=false` and `SERVICE_TASKS=false` in `.env`, and `SCRIPT_SANDBOX=true` to run scripts in a sandbox. The band at
the top of every page then says what is turned off, so nobody mistakes it for a normal server:
[Environments](../environments.md).
