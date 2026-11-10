# Integrate an existing application

Your company already has an HR application, with its own users and pages. Here it runs the leave request (the sample application's **Leave Application**) on BPMN Server over its API, [API v3](../api-v3.md): it starts requests, shows each user their tasks, and completes them. The server must be running.

## The key

Your application has one key, the server's `API_KEY` (in the server's `.env`). Keep it on your application's server, never in a browser. With it, your application asks for a **token** for each of its users; each call made with a user's token acts as that user, under the same rules as in the browser.

## Who is who

The leave request gives **Request** to whoever started it: its start event keeps the starter's user name as `requester`, and Request's assignee is `$(this.data.requester)`. So the process must be started *as* the employee, or the employee never sees the task. Its lanes say who may do what: the Employee lane starts it and requests, the Manager lane approves.

| Call | Acts as |
|---|---|
| With a user's token (`Authorization: Bearer <token>`) | That user, with the groups the token was issued with |
| With the key alone (`x-api-key`) | The server's service account (`API_SERVICE_USER_NAME`), never one of your users |

Your application signs its users in, not BPMN Server: it decides who they are and which groups they are in, then asks for their token.

## Call the API

The examples use `fetch` (Node.js 18 or later; any language works the same way):

```ts
const BASE = 'http://localhost:3000/api/v3';
const key = process.env.API_KEY;

async function call(path, { token, method = 'GET', body } = {}) {
    const response = await fetch(BASE + path, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : { 'x-api-key': key }) },
        body: body && JSON.stringify(body),
    });
    const answer = await response.json();
    if (!response.ok) throw new Error(`${response.status} ${answer.error.code}: ${answer.error.message}`);
    return answer;
}

// a token for one of your users: with the key, for 15 minutes
const tokenFor = async (userName, groups) =>
    (await call('/tokens', { method: 'POST', body: { userName, groups, minutes: 15 } })).token;
```

A call that fails throws, with the error's code and message.

## Start a request

`user1`, an employee, asks for leave. Your application starts the request as them:

```ts
const user1 = await tokenFor('user1', ['Employee']);
const { instance, task } = await call(`/processes/${encodeURIComponent('Leave Application')}/start`, { token: user1, method: 'POST' });
console.log('started', instance.id, 'for', instance.data.requester);    // for user1
```

`user1` is the requester, and `task` is their first task in it: **Request**. A user who may not start the process (not in the Employee lane) is answered `404 NOT_STARTABLE`.

## Complete the tasks

`user1` fills in Request; your page draws the form (`GET /tasks/{id}` answers the task with its `form`):

```ts
await call(`/tasks/${task.id}/complete`, {
    token: user1, method: 'POST',
    body: { data: { LeaveType: 'Vacation', StartDate: '2026-12-01', EndDate: '2026-12-05', RequestReason: 'Holidays' } },
});
```

Then a manager approves. `GET /tasks` answers the waiting tasks this user may work on: assigned to them, or offered to them or their groups. A user can have tasks of many requests, so pick the one of *this* instance, by `instanceId` and `elementId`:

```ts
const manager1 = await tokenFor('manager1', ['Employee', 'Manager']);
const { items } = await call('/tasks', { token: manager1 });
const approve = items.find(t => t.instanceId === instance.id && t.elementId === 'Approve');
await call(`/tasks/${approve.id}/complete`, { token: manager1, method: 'POST', body: { data: { approval: 'A' } } });

console.log('now', (await call(`/instances/${instance.id}`, { token: user1 })).status);    // end
```

Each completion is recorded as done by the token's user. `user1` can't complete the manager's task: to `user1` it is not there (`404 TASK_NOT_FOUND`). A task offered to a group can be claimed first (`POST /tasks/{id}/claim`), so others see it is taken. A long list comes in pages: `?limit=` and `?cursor=` (the page's `next`). Every call, and its answers and errors: [API v3 reference](../api-v3.md).

When a user signs out of your application, or leaves, revoke their tokens: `DELETE /tokens?userName=user1`, with the key.

## Events

Your application learns that a process needs it by listing tasks, or reading the instance (`GET /instances/{id}`). To tell a waiting process that something happened, it sends a message or a signal (`POST /messages/{id}`, `POST /signals/{id}`, as a service account in the `SYSTEM` group): [Connect external services](tutorial-connectors.md#hearing-back-from-outside) shows it, and what to check in the answer.

From Node.js, [bpmn-client](../bpmn-client.md) also wraps the older APIs (`/api`, `/api2`). They are deprecated since 3.7, and act as the service account: a user they are given is ignored.

More: [Integrate an existing application](../integrate.md), [Application integration](../customization.md).

One of the walkthroughs after the [tutorials](start.md): previous, [Execute from Node.js](tutorial-script.md); next, [Connect external services](tutorial-connectors.md).
