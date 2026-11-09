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

A server's REST API takes its key in the `x-api-key` header (`API_KEY`; see [Security](../security.md)). What an agent
can do with it today:

| Step | Call |
|---|---|
| List models | `GET /api2/model/list` |
| Check a model | `POST /api/definitions/verify` with `{ "source": "<xml>" }` (or `{ "name" }` for a saved one): `{ valid, errors, warnings }` |
| Deploy a model | `POST /api2/model/import/<name>`, the `.bpmn` file as a multipart upload |
| Start a process | `POST /api2/engine/start/<name>` with its data |
| Find its tasks | `GET /api2/tasks`, `POST /api2/data/findItems` |
| Complete a task | `PUT /api2/engine/invoke` |
| Read an instance | `GET /api2/data/findInstances` |

Not yet over the API: running a `.feature` (the Test tab and `npm test` run it), reading an instance's Rationale step
by step, and a published OpenAPI document of these calls. They are planned with the next API version; until then,
test locally and deploy the model that passes.

`bpmn-mcp` gives a local AI client the same calls as MCP tools: see its README.
