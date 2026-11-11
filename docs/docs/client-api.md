
## BPMNClient/WebAPI

bpmn-client is a lightweight Node package to remotely access bpmn-server. Its `BPMNClient3` is the client of
[API v3](#api-v3): it issues and renews each user's token with the service key ([how](bpmn-client.md#usage-api-v3-bpmn-web-37-and-later)).

[See code Example using bpmn-clienthere](examples/BuyCar-Remote.md)

Alternatively, you can call bpmn-server over HTTP(S). To try the API by hand, import its OpenAPI document,
`https://your-site/api/v3/openapi.json`, into Postman (or any OpenAPI tool): every operation, its parameters and how to
sign in, always up to date. See [the API](#api-v3) below.

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

> **`/api` and `/api2` are deprecated** since 3.7: they keep working, with fixes only, until they go (v1 at 4.0). Their
> answers say so (`Deprecation`, and a `Link` to the API's document); their documents are `/api/openapi.json` and
> `/api2/openapi.json`. New work goes to the API, below.

## API v3

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

Every call, its parameters, its body, its answers and the shapes they have: the [API v3 reference](api-v3.md), made from the API's OpenAPI document (`GET /api/v3/openapi.json`, no key needed). The calls, in short: who am I (`/me`); the processes this user may start, and starting one; their tasks (list, one with its form, claim, complete); the instances they may see, with why each went its way; models and their tests (design); rules (a decision table); messages and signals (the system); users and settings (administrators); tokens (the service key).

A token is random; the server keeps only its SHA-256 (in `wf_tokens`), so a token can not be read back, and it holds
across a restart and for every server on the same database. Errors are `{ error: { code, message } }` with a real
status: `UNAUTHORIZED`, `TOKEN_INVALID` (unknown, expired or revoked), `SERVICE_KEY_REQUIRED`, `GROUP_REFUSED`,
`BAD_USER`, `BAD_GROUPS`, `BAD_MINUTES`, and the task API's codes (`TASK_NOT_FOUND`, `TASK_ASSIGNED`, `ITEM_NOT_WAITING`,
`NOT_STARTABLE`, `BAD_DATA`, `BAD_LIMIT`, `BAD_CURSOR`, `INSTANCE_BUSY`), and the rules' (`RULE_NOT_FOUND`, `RULE_FAILED`). Changing models and running tests is design: a designer's token, or the service key (`403 DESIGN_REFUSED`; `404 DESIGN_OFF` with `DISABLE_DESIGN`).
