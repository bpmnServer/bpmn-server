
## BPMNClient/WebAPI

BPMNClient is a lightweight Node package to remotely access bpmn-server using bpmn-server WebApi

[See code Example using bpmn-clienthere](examples/BuyCar-Remote.md)

Alternatively, you can call bpmn-server over HTTP(S). To try the API by hand, import its OpenAPI document,
`https://your-site/api/v3/openapi.json`, into Postman (or any OpenAPI tool): every operation, its parameters and how to
sign in, always up to date. See [the API](#api-v3-user-tokens-in-progress-37) below.

bpmn-server provides api calls to the following objects:

- [engine](#engine) 
- [dataStore](#datastore)
- [definitions](#definitions) 

## WebServices Architecture

Web Applications can use **bpmn-server**  WebServices to manage workflow in a similar manner described here:

- App logic decides to start a Process or throw a Message
- App UI display to the User list of Processes to Start
- App UI display to the User list of outstanding User Tasks to execute and prompt user for input parameters (if required)
- Workflow App can notify involved users of new User Tasks

## engine:

Perform WebAPI calls to the execution Engine 


| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
| **start** | name, input , startNodeId?,options? 	 | [Instance](api/interfaces/IInstanceData.md) | - Start a new Process execution |
| **invoke**| [itemQuery](data.md#item-query) ,input |	[Instance](api/interfaces/IInstanceData.md) | Invoke an already started Item (waiting)  |
| **throwMessage**|messageId,input| [Instance](api/interfaces/IInstanceData.md) | Issue a signal or message|
| **throwSignal**|signalId,input| [Instance](api/interfaces/IInstanceData.md) | Issue a signal or message|
| **get**|[instanceQuery](data.md#instance-query) |		[Instance](api/interfaces/IInstanceData.md) | Get an already running or idle Instance |
| **status**| |		 | Return as list of running instances or recently completed |


## definitions

Perform calls to BPMN defintions


| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
|		list	|- |	string[] |
|		load	| name|	definition |

## datastore

Perform calls to DataStore , accessing processes data


| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
| **findInstances** | [instanceQuery](data.md#instance-query) 	 | [Instance[]](api/interfaces/IInstanceData.md) | |
| **findItems**| [itemQuery](data.md#item-query)|	[Item[]](api/interfaces/IItemData.md) | |
| **deleteInstances**| [instance](data.md#instance-query)|	[Item[]](api/interfaces/IItemData.md) | |

## The task API: an application acting for its users

`/api2/tasks` is for an application with its own inbox and forms, which authenticates its own users. It is off unless
`API_ACTING_USER_KEY` is set, and that key opens these routes and no other; `API_KEY` does not open them.

| Header | Meaning |
| --- | --- |
| `x-api-key` | `API_ACTING_USER_KEY` |
| `x-acting-user` | The user the application has authenticated. Required. |
| `x-acting-groups` | That user's groups, comma separated. `SYSTEM`, `ADMIN` and `DESIGNER` are refused. |

The tenant is the service account's (`API_SERVICE_TENANT_ID`), never taken from a header.

| Route | Does | Answers |
| --- | --- | --- |
| `GET /api2/tasks?limit=&after=` | The waiting user tasks this user can work on, oldest first; `after` is a list's `next`. `limit`: 1 to 200, default 50. | 200 `{ tasks, next }`, 400 |
| `POST /api2/tasks/start/:name` | Body `{ data, startNodeId }` (both optional). Starts the process as this user, at a start event they may use (its lane, candidate users and groups decide; the first one, unless `startNodeId` names it). | 200 `{ instance, task }` (`task`: this user's first waiting task in it, or `null`), 400, 404 `NOT_STARTABLE` |
| `GET /api2/tasks/:id` | One task, with its instance's data and its form: `form: { fields, formKey }`, each field `{ id, label, type, defaultValue, values, validation }` as the model has it; `formKey` when the model names the application's own form. | 200, 404 |
| `POST /api2/tasks/:id/claim` | Assigns the task to this user. | 200 `{ task }`, 404, 409, 503 |
| `POST /api2/tasks/:id/complete` | Body `{ data }`. Completes the task, recording this user. | 200 `{ task, instance }`, 400, 403, 404, 409, 503 |

- A user **has a part** in a task when they are its assignee, a candidate user, in a candidate group, or the task has no assignment.
- With no part, or no such task, or something that is not a user task: 404, the same each way, so an id cannot be probed.
- A task assigned to someone else: 403 to complete, 409 to claim. A task that has ended: 409, with the code `ITEM_NOT_WAITING`.
- Errors are `{ errors, code }`, with a real status. An instance still busy after the lock's retries is a 503: try again.

Anyone holding the key can act as any user, so it belongs on the application's server, never in a browser. The Test tab's instances are not listed.

## API v3: user tokens (in progress, 3.7)

`/api/v3` is the API the next versions build on ([its design](https://github.com/bpmnServer/bpmn-server/blob/main/docs/design/api-v3.md)).
Every call acts as one user, and says who in one of two ways:

- **A user's token**, `Authorization: Bearer <token>`: the user it was issued for, with their groups and the models'
  security rules.
- **The service key**, `x-api-key: <API_KEY>`: the service account (`API_SERVICE_USER_NAME`), for the application's own
  work, and for issuing tokens.

A header naming a user is never trusted. How an application uses it:

1. A user signs in to the application, the application's way: BPMN Server never sees their password.
2. The application's back end asks for a token for them, with the service key.
3. The application (its back end, or its pages) calls the API with that token, as that user.
4. When the user signs out, or is disabled, the back end revokes their tokens.

| Call | What it does | Answers |
|---|---|---|
| `POST /api/v3/tokens` | Service key only. Body `{ userName, groups, minutes }`: a token for that user, for `minutes` (default 15, at most 1440). `groups` can not have `SYSTEM`, `ADMIN` or `DESIGNER`. | 201 `{ token, expiresAt, userName, groups }`, 400, 403 |
| `DELETE /api/v3/tokens?userName=` | Service key only. Revokes every token of that user, at once. | 200 `{ revoked }` |
| `GET /api/v3/me` | Who this call acts as, and what they may do. | 200 `{ userName, groups, credential, may: { start, design, administer } }` |
| `GET /api/v3/processes/startable` | The start events this user may use (their lanes, candidate users and groups decide), each with its form. | 200 `{ items: [{ processName, startNodeId, name, documentation, form }] }` |
| `POST /api/v3/processes/{name}/start` | Body `{ data, startNodeId }` (both optional). Starts the process as this user. | 201 `{ instance, task }` (`task`: their first waiting task in it, or `null`), 400, 404 `NOT_STARTABLE` |
| `GET /api/v3/tasks?limit=&cursor=` | The waiting user tasks this user has a part in, oldest first. `limit` 1 to 200, default 50; `cursor` is a page's `next`. | 200 `{ items, next }` (`next` absent on the last page), 400 |
| `GET /api/v3/tasks/{id}` | One task, with its instance's data and its form: `form: { fields, formKey }`. | 200, 404 |
| `POST /api/v3/tasks/{id}/claim` | The task becomes this user's. | 200 `{ task }`, 404, 409 |
| `POST /api/v3/tasks/{id}/complete` | Body `{ data }`. Completes it, recording this user. | 200 `{ task, instance }`, 400, 403, 404, 409 |
| `GET /api/v3/instances?status=&name=&limit=&cursor=` | The instances this user may see (the models' rules: an instance with an item they have a part in, or one with no assignment), newest first. | 200 `{ items, next }`, 400 |
| `GET /api/v3/instances/{id}` | One instance: its data and its items. | 200, 404 `INSTANCE_NOT_FOUND` |
| `GET /api/v3/instances/{id}/rationale` | Why it went the way it did, step by step: each operation, its outcome, each decision. | 200 `{ id, name, status, data, steps }`, 404 |
| `POST /api/v3/instances/{id}/events/{elementId}` | Body `{ data }`. A start event of the running instance. | 200 `{ instance }`, 404, 422 `ENGINE_ERROR` |
| `POST /api/v3/instances/{id}/restart` | Body `{ itemId, data }`. Runs that item again, and the instance on from it. | 200 `{ instance }`, 400, 404, 422 |
| `DELETE /api/v3/instances/{id}` | Administrators only. | 200 `{ deleted }`, 403 `ADMIN_REQUIRED`, 404 |
| `POST /api/v3/messages/{id}`, `POST /api/v3/signals/{id}` | Body `{ data, matchingKey }`. The system only (a service account in `SYSTEM`). | 200, 403 `SYSTEM_REQUIRED` |

A token is random; the server keeps only its SHA-256 (in `wf_tokens`), so a token can not be read back, and it holds
across a restart and for every server on the same database. Errors are `{ error: { code, message } }` with a real
status: `UNAUTHORIZED`, `TOKEN_INVALID` (unknown, expired or revoked), `SERVICE_KEY_REQUIRED`, `GROUP_REFUSED`,
`BAD_USER`, `BAD_GROUPS`, `BAD_MINUTES`, and the task API's codes (`TASK_NOT_FOUND`, `TASK_ASSIGNED`, `ITEM_NOT_WAITING`,
`NOT_STARTABLE`, `BAD_DATA`, `BAD_LIMIT`, `BAD_CURSOR`, `INSTANCE_BUSY`). Models follow on v3 in 3.7.
