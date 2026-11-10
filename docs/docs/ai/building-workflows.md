# Building workflows with an AI agent

On a server, start with its **`/llms.txt`** (for example `https://bpmn.omniworkflow.com/llms.txt`): what that site
has (its API, services, connectors, user groups), its own rules, then this guide.

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
| A complete example: model, forms, rules, tests | the sample application's **Leave Application**: [its model](https://github.com/bpmnServer/bpmn-server/blob/main/sampleApp/processes/Leave%20Application.bpmn) and [its tests](https://github.com/bpmnServer/bpmn-server/blob/main/sampleApp/processes/Leave%20Application.feature), and the [tutorials](../tutorial/start.md), which design it step by step |

A site says in its `/llms.txt` which environment it is. Build and test on a **test** environment: its services have
the same names as production's but reach nothing outside (no message sent, nothing recorded). On a production site,
services are real: a scenario can replace one with `@stub service:<name>`.

Prefer what the server provides (forms, assignment rules, timers, connectors, decisions) to scripts. Never put a key,
a password or a token in a model: a connector's key is kept by the server, encrypted.

## A first model: an approval

The smallest useful workflow: someone asks, a manager decides, approved or rejected. Start here and add to it; the
sample's Leave Application shows more (timers, errors, lanes, services).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="approval-definitions" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Approval" isExecutable="true">
    <bpmn:laneSet id="Roles">
      <bpmn:lane id="EmployeeLane" name="Employee">
        <bpmn:flowNodeRef>Requested</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Request</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="ManagerLane" name="Manager">
        <bpmn:flowNodeRef>Approve</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Decision</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Approved</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Rejected</bpmn:flowNodeRef>
      </bpmn:lane>
    </bpmn:laneSet>
    <bpmn:startEvent id="Requested" name="Requested" camunda:initiator="requester" />
    <bpmn:userTask id="Request" name="Request" camunda:assignee="$(this.data.requester)">
      <bpmn:extensionElements>
        <camunda:formData>
          <camunda:formField id="reason" label="Reason" type="string" />
        </camunda:formData>
      </bpmn:extensionElements>
    </bpmn:userTask>
    <bpmn:userTask id="Approve" name="Approve">
      <bpmn:extensionElements>
        <camunda:formData>
          <camunda:formField id="approved" label="Approved" type="boolean" />
        </camunda:formData>
      </bpmn:extensionElements>
    </bpmn:userTask>
    <bpmn:exclusiveGateway id="Decision" name="Approved?" default="toRejected" />
    <bpmn:endEvent id="Approved" name="Approved" />
    <bpmn:endEvent id="Rejected" name="Rejected" />
    <bpmn:sequenceFlow id="toRequest" sourceRef="Requested" targetRef="Request" />
    <bpmn:sequenceFlow id="toApprove" sourceRef="Request" targetRef="Approve" />
    <bpmn:sequenceFlow id="toDecision" sourceRef="Approve" targetRef="Decision" />
    <bpmn:sequenceFlow id="toApproved" name="yes" sourceRef="Decision" targetRef="Approved">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">$(this.data.approved === true)</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="toRejected" name="no" sourceRef="Decision" targetRef="Rejected" />
  </bpmn:process>
</bpmn:definitions>
```

- **Use a lane for each role**, named exactly as the user group that plays it. A user task in a lane is offered to
  that group: Approve, in the lane `Manager`, goes to managers. A start event in a lane lets only that group start
  the process. The diagram then shows who does what, and there is no `candidateGroups` to repeat on every task. Use
  `camunda:candidateGroups` only for a task that is offered to more than its lane's group.
- Lane names are matched exactly, case and all: on a site, use the groups its `/llms.txt` lists (`manager`, say). In a
  test, `@login ... with role of` can name any group: the user is made up for the test, with that one group.
- `camunda:initiator` keeps who started it in `data.requester`; `camunda:assignee` gives them the request. An assignee
  wins over the lane: Request stays with the person who asked, not with every employee.
- A form field's value becomes data (`data.approved`); the flow's condition reads it; `default` is taken otherwise.
- No diagram is needed: the server lays the model out when it is saved.

Its tests, `approval.feature`:

```gherkin
Feature: approval

  Scenario: approved
    When user:emp1 @login with role of "Employee"
      And @start process:approval as :request
      And @invoke element:Request in :request
        | reason | Holidays |
      And user:mgr1 @login with role of "Manager"
      And @invoke element:Approve in :request
        | approved | true |
    Then @check :request status is "end"
      And @check :request passed element:Approved
      And @check :request data.reason is "Holidays"

  Scenario: rejected
    When user:emp1 @login with role of "Employee"
      And @start process:approval as :request
      And @invoke element:Request in :request
      And user:mgr1 @login with role of "Manager"
      And @invoke element:Approve in :request
        | approved | false |
    Then @check :request passed element:Rejected

  Scenario: an employee can not approve
    When user:emp1 @login with role of "Employee"
      And @start process:approval as :request
      And @invoke element:Request in :request
    Then @check :request has 0 items of element:Approve with status "wait" for me
      And @invoke element:Approve in :request is refused
      And user:mgr1 @login with role of "Manager"
      And @check :request has 1 items of element:Approve with status "wait" for me
```

`@login ... with role of` acts as a user of that group: `for me` counts only the items they may take, and
`@invoke ... is refused` holds when the user can not do it: the third scenario checks that an employee can not approve.

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

A server's API is at `https://<site>/api/v3`. Given a person's link (`https://<site>/ai/bpt_…`), open it first: its key
acts as that person, with their groups, at the link's level, for minutes. Send it on every call as
`Authorization: Bearer <key>`. Use curl or your own HTTP calls, never a browser: the site's pages need a sign-in. The
API's OpenAPI document, `GET /api/v3/openapi.json`, needs no key: start there. `GET /api/v3/me` says who you act as.

| Level | What it allows |
|---|---|
| work | start processes, work on tasks, read instances and their Rationale |
| design | as work, and models and their tests |
| administer | as work, and read the settings (secrets as `***`) and run their checks: advise, change nothing |

The whole loop, with no editor (a design link):

| Step | Call |
|---|---|
| List models | `GET /api/v3/models` |
| Read a model: its XML, its `.feature`, its editor URL | `GET /api/v3/models/<name>` |
| Check a model, without saving it | `POST /api/v3/models/<name>/verify`, `{ "source": "<xml>" }` (or no body: the saved model) |
| Create or change a model | `PUT /api/v3/models/<name>`, `{ "source": "<xml>" }`: checked first; with errors it is not saved (`422 MODEL_INVALID`, the errors in `error.details`) unless `?force=true`; a model without a diagram is laid out |
| One element: its form, its assignment | `GET /api/v3/models/<name>/elements/<id>` |
| Write its tests | `PUT /api/v3/models/<name>/feature`, `{ "text": "Feature: ..." }` (with `base`, only over that text) |
| Run them | `POST /api/v3/models/<name>/test` (or `{ "source": "..." }`, a `.feature` not saved): each scenario `passed` or `failed`, the failing step, the error, its instances |
| Why an instance went the way it did | `GET /api/v3/instances/<id>/rationale`: its status, data and Rationale by step (each operation, its outcome, each decision) |
| Start a process, work on a task | `POST /api/v3/processes/<name>/start`; `GET /api/v3/tasks`, `GET /api/v3/tasks/<id>` (with its form), `POST /api/v3/tasks/<id>/complete` |

A failed scenario names its step and why; its instance's Rationale tells what happened before it. Correct the model or
the test, save, and run again. Changing models and running tests is design: a server with `DISABLE_DESIGN=true`
answers 404; a link without design rights, or below the design level, 403. Errors are
`{ "error": { "code", "message" } }` with a real status.

To let your users reach a server from ChatGPT or Claude, see [Chatting with your server](chat-assistants.md).

`bpmn-mcp` gives a local AI client the same calls as MCP tools: see its README.
