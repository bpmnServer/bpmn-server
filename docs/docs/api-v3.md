# API v3 reference

<!-- Made from packages/bpmn-web/src/routes/api/openapi-v3.ts by `npm run api-docs`: change the document, not this page. -->

Every call acts as one user: a user's token (`Authorization: Bearer`), or the service key (`x-api-key`) for the service account. How to use it: [the client API](client-api.md#api-v3).

The address is `https://<site>/api/v3`. The server serves this document at `/api/v3/openapi.json`, with no credential: a client, or an agent, can read it there.

**Credentials**

- `token`: A user's token, from POST /tokens (`Authorization: Bearer <token>`).
- `serviceKey`: The service key (API_KEY): the service account (header `x-api-key`).

Errors are `{ "error": { "code", "message" } }`, with the status the error's kind gives. Lists are `{ "items", "next" }`: ask for the next page with `?cursor=<next>`; `next` is absent on the last page.

## Operations

| Operation | Does |
|---|---|
| [GET /me](#get-me) | Who this call acts as, and what they may do |
| [GET /processes/startable](#get-processesstartable) | The start events this user may use, with their forms |
| [POST /processes/{name}/start](#post-processesnamestart) | Start a process as this user |
| [GET /tasks](#get-tasks) | The waiting tasks this user has a part in, oldest first; with status=completed, the ones they completed, newest first |
| [GET /tasks/{id}](#get-tasksid) | One task, with its instance's data and its form |
| [POST /tasks/{id}/claim](#post-tasksidclaim) | The task becomes this user's |
| [POST /tasks/{id}/complete](#post-tasksidcomplete) | Complete the task, recording this user |
| [GET /instances](#get-instances) | The instances this user may see, newest first |
| [GET /instances/{id}](#get-instancesid) | One instance: its data and items |
| [DELETE /instances/{id}](#delete-instancesid) | Delete it (administrators) |
| [GET /instances/{id}/access](#get-instancesidaccess) | Who was given its tasks, and who may do what with it (administrators) |
| [GET /instances/{id}/rationale](#get-instancesidrationale) | Why it went the way it did, step by step |
| [POST /instances/{id}/events/{elementId}](#post-instancesideventselementid) | A start event of the running instance |
| [POST /instances/{id}/restart](#post-instancesidrestart) | Run an item again, and the instance on from it |
| [GET /models](#get-models) | The models, with where a person opens each |
| [GET /models/{name}](#get-modelsname) | A model: its BPMN XML, its .feature, where a person opens it |
| [PUT /models/{name}](#put-modelsname) | Create or change a model: checked first (with errors, refused unless force=true); laid out when it has no diagram (design) |
| [DELETE /models/{name}](#delete-modelsname) | Delete a model (design) |
| [POST /models/{name}/rename](#post-modelsnamerename) | Rename a model (design) |
| [POST /models/{name}/verify](#post-modelsnameverify) | Check a model without saving it: the source given, else the saved model |
| [GET /models/{name}/elements/{elementId}](#get-modelsnameelementselementid) | One element: its type, name, documentation, lane, assignment and form |
| [GET /models/{name}/feature](#get-modelsnamefeature) | The tests of the model: its .feature |
| [PUT /models/{name}/feature](#put-modelsnamefeature) | Write the tests of the model: a .feature that reads as tests; with base, only over the text it came from (design) |
| [POST /models/{name}/test](#post-modelsnametest) | Run the tests of the model (its .feature, or the one given), in the engine (design) |
| [POST /rules/{name}](#post-rulesname) | Evaluate a decision table of the models folder with the data given, as a business rule task does; nothing changes |
| [POST /messages/{id}](#post-messagesid) | A message, to what waits for it or starts on it (the system) |
| [POST /signals/{id}](#post-signalsid) | A signal, to everything that waits for it (the system) |
| [GET /users](#get-users) | The users (an administrator; never an AI link) |
| [POST /users](#post-users) | Add a user (an administrator) |
| [DELETE /users/{userName}](#delete-usersusername) | Delete a user, and end their tokens (an administrator; not themselves) |
| [PUT /users/{userName}/groups](#put-usersusernamegroups) | Set a user’s groups, and end their tokens (an administrator) |
| [POST /users/{userName}/password](#post-usersusernamepassword) | Set a user’s password (an administrator) |
| [GET /settings](#get-settings) | Every setting by group: its value (secrets as ***), where it comes from (an administrator; an AI link at the administer level) |
| [GET /settings/schema](#get-settingsschema) | The settings’ schema: each setting’s type, default, description, group, and whether it is a secret |
| [POST /settings/checks/{name}](#post-settingschecksname) | Run a check: database, engine, url (SITE_URL) or email |
| [POST /tokens](#post-tokens) | A token for one of the application's users (the service key) |
| [DELETE /tokens](#delete-tokens) | Revoke every token of a user (the service key) |

## Who am I

### GET /me

Who this call acts as, and what they may do.

| Answer | Means | Body |
|---|---|---|
| 200 | The user | [Me](#me) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |

## Processes

### GET /processes/startable

The start events this user may use, with their forms.

| Answer | Means | Body |
|---|---|---|
| 200 | A list | { items, next } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |

### POST /processes/{name}/start

Start a process as this user.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The model |

Body (JSON):

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | object |  |  |
| `startNodeId` | string |  |  |

| Answer | Means | Body |
|---|---|---|
| 201 | The instance, and this user's first task in it | { instance: [Instance](#instance), task: [Task](#task) or null } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

## Tasks

### GET /tasks

The waiting tasks this user has a part in, oldest first; with status=completed, the ones they completed, newest first.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `limit` | query | integer |  | default 50, at least 1, at most 200 |
| `cursor` | query | string |  | A page's `next` |
| `status` | query | `"waiting"` or `"completed"` |  | completed: the latest this user completed (limit, default 10) |
| `model` | query | string |  | Only this model's tasks; its named values for field and search |
| `field` | query | string |  | A value the models' case labels show: a named one by its name (`${Client = data.clientId}` is Client), a plain one by its path's last name (`${data.caseId}` is caseId); none: any of them |
| `op` | query | `"contains"` or `"is"` |  | contains: any case; is: exactly (a number also matches as a number); default "contains" |
| `value` | query | string |  |  |
| `search` | query | string |  | Contained in any named value |

| Answer | Means | Body |
|---|---|---|
| 200 | A page | { items, next } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |

### GET /tasks/{id}

One task, with its instance's data and its form.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The task |

| Answer | Means | Body |
|---|---|---|
| 200 | The task | [TaskWithForm](#taskwithform) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

### POST /tasks/{id}/claim

The task becomes this user's.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The task |

| Answer | Means | Body |
|---|---|---|
| 200 | The task | { task: [Task](#task) } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |
| 409 | It is not waiting, or it is someone else's | [Error](#error) |

### POST /tasks/{id}/complete

Complete the task, recording this user.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The task |

Body (JSON):

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | object |  |  |

| Answer | Means | Body |
|---|---|---|
| 200 | The task and its instance | { task: [Task](#task), instance: [Instance](#instance) } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |
| 409 | It is not waiting, or it is someone else's | [Error](#error) |

## Instances

### GET /instances

The instances this user may see, newest first.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `status` | query | string |  |  |
| `name` | query | string |  | Only this model's instances; its named values for field and search |
| `limit` | query | integer |  | default 50, at least 1, at most 200 |
| `cursor` | query | string |  | A page's `next` |
| `field` | query | string |  | A value the models' case labels show: a named one by its name (`${Client = data.clientId}` is Client), a plain one by its path's last name (`${data.caseId}` is caseId); none: any of them |
| `op` | query | `"contains"` or `"is"` |  | contains: any case; is: exactly (a number also matches as a number); default "contains" |
| `value` | query | string |  |  |
| `search` | query | string |  | Contained in any named value |

| Answer | Means | Body |
|---|---|---|
| 200 | A page | { items, next } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |

### GET /instances/{id}

One instance: its data and items.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The instance |

| Answer | Means | Body |
|---|---|---|
| 200 | The instance | [InstanceWithItems](#instancewithitems) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

### DELETE /instances/{id}

Delete it (administrators).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The instance |

| Answer | Means | Body |
|---|---|---|
| 200 | Deleted | { deleted } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

### GET /instances/{id}/access

Who was given its tasks, and who may do what with it (administrators).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The instance |

| Answer | Means | Body |
|---|---|---|
| 200 | Its assignment and access | { id, name, on, cases, tasks } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

### GET /instances/{id}/rationale

Why it went the way it did, step by step.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The instance |

| Answer | Means | Body |
|---|---|---|
| 200 | Its steps | { id, name, status, data, steps } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

### POST /instances/{id}/events/{elementId}

A start event of the running instance.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The instance |
| `elementId` | path | string | yes | The start event |

Body (JSON):

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | object |  |  |

| Answer | Means | Body |
|---|---|---|
| 200 | The instance | { instance: [Instance](#instance) } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |
| 422 | The engine refused it | [Error](#error) |

### POST /instances/{id}/restart

Run an item again, and the instance on from it.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The instance |

Body (JSON, required):

| Field | Type | Required | Description |
|---|---|---|---|
| `itemId` | string | yes |  |
| `data` | object |  |  |

| Answer | Means | Body |
|---|---|---|
| 200 | The instance | { instance: [Instance](#instance) } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |
| 422 | The engine refused it | [Error](#error) |

## Models and their tests

### GET /models

The models, with where a person opens each.

| Answer | Means | Body |
|---|---|---|
| 200 | A list | { items, next } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |

### GET /models/{name}

A model: its BPMN XML, its .feature, where a person opens it.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The model |

| Answer | Means | Body |
|---|---|---|
| 200 | The model | { name, source, feature, url } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

### PUT /models/{name}

Create or change a model: checked first (with errors, refused unless force=true); laid out when it has no diagram (design).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The model |
| `force` | query | boolean |  |  |

Body (JSON, required):

| Field | Type | Required | Description |
|---|---|---|---|
| `source` | string | yes | The BPMN XML |

| Answer | Means | Body |
|---|---|---|
| 200 | Changed | [ModelSaved](#modelsaved) |
| 201 | Created | [ModelSaved](#modelsaved) |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |
| 422 | The engine refused it | [Error](#error) |

### DELETE /models/{name}

Delete a model (design).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The model |

| Answer | Means | Body |
|---|---|---|
| 200 | Deleted | { deleted } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

### POST /models/{name}/rename

Rename a model (design).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The model |

Body (JSON, required):

| Field | Type | Required | Description |
|---|---|---|---|
| `newName` | string | yes |  |

| Answer | Means | Body |
|---|---|---|
| 200 | Renamed | { name, renamedFrom } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |
| 409 | It is not waiting, or it is someone else's | [Error](#error) |

### POST /models/{name}/verify

Check a model without saving it: the source given, else the saved model.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The model |

Body (JSON):

| Field | Type | Required | Description |
|---|---|---|---|
| `source` | string |  |  |

| Answer | Means | Body |
|---|---|---|
| 200 | Its check | [Check](#check) |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

### GET /models/{name}/elements/{elementId}

One element: its type, name, documentation, lane, assignment and form.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The model |
| `elementId` | path | string | yes | The element |

| Answer | Means | Body |
|---|---|---|
| 200 | The element | { id, type, name, documentation, lane, assignment, form: [Form](#form) } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

### GET /models/{name}/feature

The tests of the model: its .feature.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The model |

| Answer | Means | Body |
|---|---|---|
| 200 | The text | { name, text } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |

### PUT /models/{name}/feature

Write the tests of the model: a .feature that reads as tests; with base, only over the text it came from (design).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The model |

Body (JSON, required):

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | yes |  |
| `base` | string |  |  |

| Answer | Means | Body |
|---|---|---|
| 200 | Saved | { name, saved } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 409 | It is not waiting, or it is someone else's | [Error](#error) |

### POST /models/{name}/test

Run the tests of the model (its .feature, or the one given), in the engine (design).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The model |
| `raw` | query | boolean |  |  |

Body (JSON):

| Field | Type | Required | Description |
|---|---|---|---|
| `source` | string |  | A .feature, not saved |

| Answer | Means | Body |
|---|---|---|
| 200 | Each scenario | [TestRun](#testrun) |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |
| 422 | The engine refused it | [Error](#error) |

## Rules

### POST /rules/{name}

Evaluate a decision table of the models folder with the data given, as a business rule task does; nothing changes.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | A file &lt;name>.dmn.xml, or a decision's id |

Body (JSON):

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | object |  | The decision's inputs, by name |

| Answer | Means | Body |
|---|---|---|
| 200 | What it decided | [RuleResult](#ruleresult) |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |
| 422 | The engine refused it | [Error](#error) |

## Messages and signals

### POST /messages/{id}

A message, to what waits for it or starts on it (the system).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The message |

Body (JSON):

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | object |  |  |
| `matchingKey` | object |  |  |

| Answer | Means | Body |
|---|---|---|
| 200 | The instance it reached, or null | { instance: [Instance](#instance) or null } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 422 | The engine refused it | [Error](#error) |

### POST /signals/{id}

A signal, to everything that waits for it (the system).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | yes | The signal |

Body (JSON):

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | object |  |  |
| `matchingKey` | object |  |  |

| Answer | Means | Body |
|---|---|---|
| 200 | Signalled | { signalled } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |

## Users

### GET /users

The users (an administrator; never an AI link).

| Answer | Means | Body |
|---|---|---|
| 200 | A list | { items, next } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |

### POST /users

Add a user (an administrator).

Body (JSON, required):

| Field | Type | Required | Description |
|---|---|---|---|
| `userName` | string | yes |  |
| `email` | string |  |  |
| `password` | string | yes | 8 characters or more |
| `groups` | list of string |  |  |

| Answer | Means | Body |
|---|---|---|
| 201 | The user | [User](#user) |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 409 | It is not waiting, or it is someone else's | [Error](#error) |

### DELETE /users/{userName}

Delete a user, and end their tokens (an administrator; not themselves).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `userName` | path | string | yes | The user |

| Answer | Means | Body |
|---|---|---|
| 200 | Deleted | { deleted } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |
| 409 | It is not waiting, or it is someone else's | [Error](#error) |

### PUT /users/{userName}/groups

Set a user’s groups, and end their tokens (an administrator).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `userName` | path | string | yes | The user |

Body (JSON, required):

| Field | Type | Required | Description |
|---|---|---|---|
| `groups` | list of string | yes |  |

| Answer | Means | Body |
|---|---|---|
| 200 | The user | [User](#user) |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

### POST /users/{userName}/password

Set a user’s password (an administrator).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `userName` | path | string | yes | The user |

Body (JSON, required):

| Field | Type | Required | Description |
|---|---|---|---|
| `password` | string | yes | 8 characters or more |

| Answer | Means | Body |
|---|---|---|
| 200 | Set | { userName, passwordSet } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

## Settings

### GET /settings

Every setting by group: its value (secrets as ***), where it comes from (an administrator; an AI link at the administer level).

| Answer | Means | Body |
|---|---|---|
| 200 | The settings | { groups } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |

### GET /settings/schema

The settings’ schema: each setting’s type, default, description, group, and whether it is a secret.

| Answer | Means | Body |
|---|---|---|
| 200 | The JSON Schema | object |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |

### POST /settings/checks/{name}

Run a check: database, engine, url (SITE_URL) or email.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | path | string | yes | The check |

| Answer | Means | Body |
|---|---|---|
| 200 | Its result | { check, ok, message } |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |
| 404 | No such thing, or not this user's to see | [Error](#error) |

## Tokens

### POST /tokens

A token for one of the application's users (the service key).

Credential: The service key (API_KEY): the service account only.

Body (JSON, required):

| Field | Type | Required | Description |
|---|---|---|---|
| `userName` | string | yes |  |
| `groups` | list of string |  | The groups the application gives the user: not SYSTEM, ADMIN or DESIGNER |
| `minutes` | number |  | default 15, at most 1440 |

| Answer | Means | Body |
|---|---|---|
| 201 | The token: keep it secret | { token, expiresAt, userName, groups } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |

### DELETE /tokens

Revoke every token of a user (the service key).

Credential: The service key (API_KEY): the service account only.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `userName` | query | string | yes |  |

| Answer | Means | Body |
|---|---|---|
| 200 | How many went | { revoked } |
| 400 | The input is not right | [Error](#error) |
| 401 | No credential, or an unknown, expired or revoked token | [Error](#error) |
| 403 | Not this user's to do | [Error](#error) |

## Shapes

### Error

| Field | Type | Required | Description |
|---|---|---|---|
| `error` | { code, message } | yes |  |

### Me

| Field | Type | Required | Description |
|---|---|---|---|
| `userName` | string |  |  |
| `groups` | list of string |  |  |
| `credential` | `"token"` or `"service"` |  |  |
| `may` | { start, design, administer } |  |  |

### Form

| Field | Type | Required | Description |
|---|---|---|---|
| `fields` | list of { id, label, type, defaultValue, values, validation } |  |  |
| `formKey` | string |  |  |

### Startable

| Field | Type | Required | Description |
|---|---|---|---|
| `processName` | string |  |  |
| `startNodeId` | string |  |  |
| `name` | string |  |  |
| `documentation` | string |  |  |
| `form` | [Form](#form) |  |  |

### Task

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string |  |  |
| `instanceId` | string |  |  |
| `processName` | string |  |  |
| `elementId` | string |  |  |
| `name` | string |  |  |
| `status` | string |  |  |
| `assignee` | string |  |  |
| `candidateUsers` | any |  |  |
| `candidateGroups` | any |  |  |
| `startedAt` | string |  |  |
| `endedAt` | string |  |  |
| `dueDate` | string |  |  |
| `followUpDate` | string |  |  |
| `priority` | any |  |  |
| `completedBy` | string |  |  |
| `assignedBy` | { policy, rule, userName } |  | What decided who works on it, when something did: its assignment policy and rule, or who reassigned it |
| `label` | string |  | Its own label, else its name and its case's; filled in when answered |
| `labelValues` | list of [LabelValue](#labelvalue) |  |  |
| `caseLabel` | string |  | Its case's label |
| `caseLabelValues` | list of [LabelValue](#labelvalue) |  |  |

### LabelValue

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string |  |  |
| `path` | string |  | The data path it reads |
| `value` | any |  |  |

### TaskWithForm

Everything of [Task](#task), and:

| Field | Type | Required | Description |
|---|---|---|---|
| `data` | object |  |  |
| `form` | [Form](#form) |  |  |

### Instance

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string |  |  |
| `name` | string |  |  |
| `status` | string |  |  |
| `startedAt` | string |  |  |
| `endedAt` | string or null |  |  |
| `data` | object |  |  |
| `label` | string |  | Its label (the model's owf:label, the application's, else &lt;model> #&lt;caseId>): on the lists, one instance, a start and a completion |
| `labelValues` | list of [LabelValue](#labelvalue) |  |  |

### User

| Field | Type | Required | Description |
|---|---|---|---|
| `userName` | string |  |  |
| `email` | string or null |  |  |
| `groups` | list of string |  |  |

### Issue

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string |  |  |
| `element` | string or null |  |  |
| `message` | string |  |  |

### Check

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string |  |  |
| `valid` | boolean |  |  |
| `errors` | list of [Issue](#issue) |  |  |
| `warnings` | list of [Issue](#issue) |  |  |

### ModelSaved

Everything of [Check](#check), and:

| Field | Type | Required | Description |
|---|---|---|---|
| `created` | boolean |  |  |
| `laidOut` | boolean |  |  |
| `url` | string |  |  |

### TestRun

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string |  |  |
| `passed` | integer |  |  |
| `failed` | integer |  |  |
| `skipped` | integer |  |  |
| `scenarios` | list of { name, status, failedStep, error, instances } |  |  |

### RuleResult

| Field | Type | Required | Description |
|---|---|---|---|
| `decision` | string |  | The decision's id |
| `file` | string |  |  |
| `result` | any |  | Its output: an object, or a list of them for a table with several hits |

### InstanceWithItems

Everything of [Instance](#instance), and:

| Field | Type | Required | Description |
|---|---|---|---|
| `items` | list of { label, labelValues } |  |  |
