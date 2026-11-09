# Building workflows with an AI agent

This page is for **AI agents that build workflows on BPMN Server**: a model, its forms and rules, and its tests, from a
request such as *"a workflow for employee leave requests, with manager approval"*. (Agents changing BPMN Server itself
read [AGENTS.md](https://github.com/bpmnServer/bpmn-server/blob/main/AGENTS.md) instead.)

## The loop

1. **Discover**: read the pages below and the reference example.
2. **Generate**: the BPMN XML, the forms and assignment, and a `.feature` file of tests.
3. **Check**: `verify` the model; fix every error.
4. **Test**: run the `.feature`; read what failed and why; correct, and run again.
5. **Deliver**: the model, its tests passing, and what is left undone. Report a model as deployed only when the server
   says it is.

## What to read

| For | Read |
|---|---|
| How models run: tokens, gateways, timers, events | [Workflow execution](../execution.md), [Timers](../timers.md) |
| BPMN XML as bpmn-server reads it: `camunda:` forms, assignee, candidate groups, scripts | [The model editor](../modeler.md), [Scripting](../scripting.md), [Security](../security.md) (who may do a task) |
| Calling services: an app's services, or a connector from an OpenAPI document | [Delegates](../delegates.md), [Connectors](../connectors.md) |
| Decisions (DMN) | [Decisions](../decisions.md) |
| Checking a model | [Checking models](../verify.md) |
| Tests: the `.feature` file and its steps (`@start`, `@invoke`, `@check`, `@wait`, `@stub`, ...) | [Testing](../testing.md) |
| A complete example: model, forms, rules, tests | the sample application's **Leave Application** (`sampleApp/processes/Leave Application.bpmn` and `.feature`), and the [tutorials](../tutorial/start.md), which design it step by step |

Prefer what the server provides (forms, assignment rules, timers, connectors, decisions) to scripts. Never put a key,
a password or a token in a model: a connector's key is kept by the server, encrypted.

## Working locally

No server to run, no database:

```sh
npx bpmn-server init my-app --memory          # an application with the sample models
cd my-app
# write processes/<Name>.bpmn and processes/<Name>.feature
npx bpmn-server verify processes/ --json      # errors and warnings, as JSON
npm test                                      # every model's .feature, in memory; exit code 1 when one fails
```

A failed scenario names its step and why (`task_issue_invoice in :instance: found 0 items, not one`). The editor's
Test tab shows the same run step by step: under each step, **What happened**: the items it started, ended or left
waiting, and each decision with the values it read.

## Working with a server

A server's REST API takes its key in the `x-api-key` header (`API_KEY`; see [Security](../security.md)), and runs as
its service account. Its OpenAPI document, `GET /api2/openapi.json`, needs no key: start there. The whole loop, with
no editor:

| Step | Call |
|---|---|
| List models | `GET /api2/model/list` |
| Read a model: its XML, its `.feature`, its editor URL | `GET /api2/models/<name>` |
| Check a model, without saving it | `POST /api2/models/<name>/verify`, `{ "source": "<xml>" }` (or no body: the saved model) |
| Create or change a model | `PUT /api2/models/<name>`, `{ "source": "<xml>" }`: checked first; with errors it is not saved (422, the errors) unless `?force=true`; a model without a diagram is laid out |
| Write its tests | `PUT /api2/models/<name>/feature`, `{ "text": "Feature: ..." }` (with `base`, only over that text) |
| Run them | `POST /api2/models/<name>/test` (or `{ "source": "..." }`, a `.feature` not saved): each scenario `passed` or `failed`, the failing step, the error, its instances |
| Why an instance went the way it did | `GET /api2/instances/<id>/rationale`: its status, data and Rationale by step (each operation, its outcome, each decision) |
| Start a process, complete a task | `POST /api2/engine/start/<name>`, `PUT /api2/engine/invoke` |

A failed scenario names its step and why; its instance's Rationale tells what happened before it. Correct the model or
the test, save, and run again. Changing models and running tests is design: a server with `DISABLE_DESIGN=true`
answers 404.

`bpmn-mcp` gives a local AI client the same calls as MCP tools: see its README.
