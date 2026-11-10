
## BPMNClient/WebAPI

BPMNClient is a lightweight Node package to remotely access bpmn-server using bpmn-server WebApi

[See code Example using bpmn-clienthere](examples/BuyCar-Remote.md)

Alternatively, you can access bpmn-server through http(https) calls, [view Postman documentation](https://documenter.getpostman.com/view/11781516/Szzn7wsm)

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
