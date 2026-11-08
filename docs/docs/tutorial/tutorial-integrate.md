# Integrate an existing application

Your company already has an HR application, with its own users and pages. Here it runs the leave request on BPMN Server over the REST APIs: it starts requests, shows each user their tasks, and completes them. The server must be running.

## The keys

In the server's `.env`:

| | |
|---|---|
| `API_KEY` | Lets your application start processes and read them |
| `API_ACTING_USER_KEY` | Lets it act for one of its users on their tasks. Add one: any long random text, not the same as `API_KEY` |

Restart the server after adding it. Your application keeps both keys as secrets.

## Who is who

The leave request gives **Request** to whoever started it: its start event keeps the starter's user name as `requester`, and Request's assignee is `$(this.data.requester)`. So the process must be started *for* the employee, or the employee never sees the task.

| Call | Runs as |
|---|---|
| `engine.start` of [bpmn-client](../bpmn-client.md)'s `BPMNClient` (`/api`, `API_KEY`) | The user it is given: here `user1`, who becomes the requester |
| `/api2` (`BPMNClient2`) | Always its one service account (`API_SERVICE_USER_NAME`): it ignores any user a caller names, so it would be the requester |
| The task API, `/api2/tasks` (`API_ACTING_USER_KEY`) | The user named in `x-acting-user`, with the groups in `x-acting-groups` |

`API_KEY` is trusted to name a user: keep it on your application's server, never in a browser.

## Start a request

From Node.js, `npm install bpmn-client`. Your application starts the request for the employee who asked:

```ts
import { BPMNClient } from 'bpmn-client';

const server = new BPMNClient('localhost', 3000, process.env.API_KEY);
const instance = await server.engine.start('Leave Application', {}, null, 'user1');
console.log('started', instance.id, 'for', instance.data.requester);    // for user1
```

A call that fails throws, with the server's message.

## Show a user their tasks

Your application signed `user1` in, not BPMN Server. It names them on each call to the task API, with the acting-user key, and checks each answer:

```ts
const BASE = 'http://localhost:3000/api2/tasks';
const as = (userName, groups) => ({
    'x-api-key': process.env.API_ACTING_USER_KEY,
    'x-acting-user': userName,
    'x-acting-groups': groups.join(','),
    'Content-Type': 'application/json',
});
async function call(url, init) {
    const response = await fetch(url, init);
    const body = await response.json();
    if (!response.ok) throw new Error(`${response.status}: ${body.errors}`);
    return body;
}

const { tasks } = await call(BASE, { headers: as('user1', ['Employee']) });
const request = tasks.find(task => task.instanceId === instance.id && task.elementId === 'Request');
```

`GET /api2/tasks` answers the waiting tasks this user may work on: assigned to them, or offered to them or their groups. A user can have tasks of many requests, so pick the one of *this* instance: by `instanceId` and `elementId`. Your page shows them with its own forms.

## Complete them

```ts
await call(`${BASE}/${request.id}/complete`, {
    method: 'POST', headers: as('user1', ['Employee']),
    body: JSON.stringify({ data: { LeaveType: 'Vacation', StartDate: '2026-12-01', EndDate: '2026-12-05', RequestReason: 'Holidays' } }),
});

const forManager = (await call(BASE, { headers: as('manager1', ['Employee', 'Manager']) })).tasks;
const approve = forManager.find(task => task.instanceId === instance.id && task.elementId === 'Approve');
await call(`${BASE}/${approve.id}/complete`, {
    method: 'POST', headers: as('manager1', ['Employee', 'Manager']),
    body: JSON.stringify({ data: { approval: 'A' } }),
});

console.log('now', (await server.engine.get({ id: instance.id })).status);    // end
```

Each completion is recorded as done by the user named, under the same rules as in the browser: `user1` can't complete `manager1`'s task: to `user1` it is not there (404, `TASK_NOT_FOUND`). A task offered to a group can be claimed first (`POST /api2/tasks/:id/claim`), so others see it is taken. The error answers and their codes: [Client API](../client-api.md).

## Events

Your application learns that a process needs it by listing tasks, or reading the instance (`server.engine.get`). To tell a waiting process that something happened, it throws a message or a signal through the API: [Connect external services](tutorial-connectors.md#hearing-back-from-outside) shows it, and what to check in the answer.

More: [Integrate an existing application](../integrate.md), [Application integration](../customization.md).

One of the walkthroughs after the [tutorials](start.md): previous, [Execute from Node.js](tutorial-script.md); next, [Connect external services](tutorial-connectors.md).
