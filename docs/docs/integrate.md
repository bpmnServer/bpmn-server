# Integrate an existing application

Journey C: your application keeps its own UI, users and data, and BPMN Server runs its processes, on a private network behind it: [Your application in control](architecture.md#your-application-in-control). The walkthrough [Integrate an existing application](tutorial/tutorial-integrate.md) does it with the leave request.

## 1. Connect

Your application talks to a running BPMN Server over its API, [API v3](api-v3.md) (`/api/v3`), from any language, with one key: the server's `API_KEY`. Keep it on your application's server. The API describes itself: `GET /api/v3/openapi.json`, with no key. `ADMIN_API_KEY` is for the administration APIs: [Settings](settings.md#rest-apis).

## 2. Map your users

Your application signs its users in, not BPMN Server. It acts for them with **tokens**:

- **A token for each user**: with the key, `POST /api/v3/tokens` `{ userName, groups, minutes }` answers a token for that user, with the groups your application gives them (never `SYSTEM`, `ADMIN` or `DESIGNER`). Each call with `Authorization: Bearer <token>` acts as that user, under the models' rules: their lanes, assignees, candidate users and groups. `DELETE /api/v3/tokens?userName=` revokes them when they sign out or leave.
- **Starting a process for a user**: `POST /api/v3/processes/{name}/start` with their token starts it as them, if the model lets them (its start event's lane or candidates), and answers their first task; they are the process's initiator. A model that gives the first task to its initiator, as the leave request does, gives it to them.
- **The key alone** (`x-api-key`, no token) acts as the server's service account (`API_SERVICE_USER_NAME`, `API_SERVICE_USER_GROUPS`), never as one of your users. Use it for system work: messages, signals, issuing tokens.

The older APIs are deprecated since 3.7 and frozen: `/api` and `/api2` act as the service account (a user a caller names is ignored, unless `API_IMPERSONATION=true`, until 4.0), and the task API, `/api2/tasks`, acts for the user named in `x-acting-user` with `API_ACTING_USER_KEY`. [The client API](client-api.md) describes them.

[Integrate an existing application](tutorial/tutorial-integrate.md) shows it with the leave request. See [Application integration](customization.md) and its [design](application-integration-design.md), and [Security](security.md) for how assignment works.

## 3. Show tasks in your UI

With a user's token: list their waiting tasks (`GET /api/v3/tasks`), show one with its instance's data and its form (`GET /api/v3/tasks/{id}`), claim it (`POST /api/v3/tasks/{id}/claim`) and complete it with the form's data (`POST /api/v3/tasks/{id}/complete`). Your UI draws the forms; the task's `form` says which fields it has. A user's list holds the tasks of all their processes: pick one by its `instanceId` and `elementId`. Every call, its answers and its error codes: [API v3 reference](api-v3.md).

## 4. Services and events

- **Calls out:** service tasks call your application's services, or REST APIs through [connectors](connectors.md) with no code: [Connect external services](tutorial/tutorial-connectors.md).
- **Events in:** your application tells a waiting process something happened by delivering a message or a signal through the API (`POST /api/v3/messages/{id}`, `POST /api/v3/signals/{id}`, with the key: the service account must be in `SYSTEM`). A message nothing waits for starts a process that has it as a start event. [Connect external services](tutorial/tutorial-connectors.md#hearing-back-from-outside) has the details. BPMN Server has no inbound webhook routes (they are [proposed](application-integration-design.md#5-inbound-webhooks-and-api)): your webhook handler calls the API.
- **Events out:** an application that embeds the engine can listen to it (the app delegate's `executionEvent` and lifecycle hooks). Over the API, poll the tasks or instances you care about.

## 5. Test and deploy

Test the processes with Gherkin, stubbing the services your application provides: [Testing](testing.md), [Tutorial 7](tutorial/tutorial-testing.md). Then deploy as in [Build an application](build.md#5-deploy).
