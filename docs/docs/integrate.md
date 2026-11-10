# Integrate an existing application

Journey C: your application keeps its own UI, users and data, and BPMN Server runs its processes, on a private network behind it: [Your application in control](architecture.md#your-application-in-control). The walkthrough [Integrate an existing application](tutorial/tutorial-integrate.md) does it with the leave request.

## 1. Connect

Your application talks to a running BPMN Server over its REST APIs, from any language. From Node.js, [bpmn-client](bpmn-client.md) wraps them. `API_KEY` lets it start and complete processes; `ADMIN_API_KEY` also changes models: [Settings](settings.md#rest-apis).

## 2. Map your users

Your application signs its users in, not BPMN Server. Two ways to act for them:

- **Starting a process for a user**: `POST /api2/tasks/start/:name`, with `API_ACTING_USER_KEY` and the user in `x-acting-user`, starts it as that user, if the model lets them (its start event's lane or candidates), and answers their first task; that user is the process's initiator. (`/api`'s `engine.start` with `API_KEY` also takes a user, but trusts whatever name it is sent: it is restricted in 3.7.) A model that gives the first task to its initiator, as the leave request does, gives it to them.
- **`/api2`** runs every call as one service account (`API_SERVICE_USER_NAME`, `API_SERVICE_USER_GROUPS`), and ignores any user a caller names: a process it starts has the service account as its initiator. Use it for system work.
- **`/api2/tasks`** acts for one of your users, named in each call (`x-acting-user`, `x-acting-groups`), with its own key, `API_ACTING_USER_KEY`. A task is shown to, claimed and completed by the user it is for, by its assignee, candidate users and candidate groups.

[Integrate an existing application](tutorial/tutorial-integrate.md) shows each. See [Application integration](customization.md) and its [design](application-integration-design.md), and [Security](security.md) for how assignment works.

## 3. Show tasks in your UI

List a user's waiting tasks (`GET /api2/tasks`), show one with its instance's data (`GET /api2/tasks/:id`), claim it (`POST /api2/tasks/:id/claim`) and complete it with the form's data (`POST /api2/tasks/:id/complete`). Your UI draws the forms; the model says which fields a task has. A user's list holds the tasks of all their processes: pick one by its `instanceId` and `elementId`. Every answer and error code: [the task API](client-api.md#the-task-api-an-application-acting-for-its-users).

## 4. Services and events

- **Calls out:** service tasks call your application's services, or REST APIs through [connectors](connectors.md) with no code: [Connect external services](tutorial/tutorial-connectors.md).
- **Events in:** your application tells a waiting process something happened by delivering a message or a signal through the API (`engine.throwMessage`, `engine.throwSignal`). A message nothing waits for starts a process that has it as a start event; errors come back as HTTP 200 with an `errors` body; through `/api2` the service account must be in `SYSTEM`. [Connect external services](tutorial/tutorial-connectors.md#hearing-back-from-outside) has the details. BPMN Server has no inbound webhook routes (they are [proposed](application-integration-design.md#5-inbound-webhooks-and-api)): your webhook handler calls the API.
- **Events out:** an application that embeds the engine can listen to it (the app delegate's `executionEvent` and lifecycle hooks). Over the API, poll the tasks or instances you care about.

## 5. Test and deploy

Test the processes with Gherkin, stubbing the services your application provides: [Testing](testing.md), [Tutorial 7](tutorial/tutorial-testing.md). Then deploy as in [Build an application](build.md#5-deploy).
