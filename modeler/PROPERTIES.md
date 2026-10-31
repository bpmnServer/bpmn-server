# Model properties

What the model editor's properties panel offers, by element, and what bpmn-server does with each setting
when the process runs. Each setting is written to the model file in the Camunda 7 format (the `camunda:`
namespace), so models also open in other BPMN tools.

Every setting below was checked against bpmn-server's source, and the script events by running them
(`test/web/script-events.test.mjs`).

**How to read the tables**

- **Field** is the panel's label; **Group** is the panel section it is in.
- **In the file** is the XML attribute or element written.
- Settings bpmn-server does not run are not offered. When a model has one anyway, the panel still shows it,
  and the Problems list says it has no effect. They are listed at the end, in
  [Settings bpmn-server does not run](#settings-bpmn-server-does-not-run).

## Values: text, lists, expressions and scripts

Many fields take a value that bpmn-server works out when the process runs:

| You write | bpmn-server uses | Example |
| --- | --- | --- |
| Plain text | the text | `manager` |
| Text with commas (assignment fields) | a list | `alice,bob` |
| `$` and a JavaScript expression | the expression's value | `$data.requester` |
| `#` and JavaScript (assignment fields) | what the code returns | `#data.approvers.join(',')` |

Expressions and scripts see:

| Name | What it is |
| --- | --- |
| `data` (`this.data`) | the instance data |
| `input`, `output` | the item's input (from the task's inputs) and output (a service's result) |
| `item` (`this`) | the item: the running task or event |
| `instance` | the instance (in process scripts, `this` is the execution: use `instance.data`) |
| `appServices` | the application's services |
| `appUtils`, `appDelegate` | the application's helpers |

Conditions, inputs, outputs and the `# Model properties

What the model editor's properties panel offers, by element, and what bpmn-server does with each setting
when the process runs. Each setting is written to the model file in the Camunda 7 format (the `camunda:`
namespace), so models also open in other BPMN tools.

Every setting below was checked against bpmn-server's source, and the script events by running them
(`test/web/script-events.test.mjs`).

**How to read the tables**

- **Field** is the panel's label; **Group** is the panel section it is in.
- **In the file** is the XML attribute or element written.
- Settings bpmn-server does not run are not offered. When a model has one anyway, the panel still shows it,
  and the Problems list says it has no effect. They are listed at the end, in
  [Settings bpmn-server does not run](#settings-bpmn-server-does-not-run).

## Values: text, lists, expressions and scripts

Many fields take a value that bpmn-server works out when the process runs:

| You write | bpmn-server uses | Example |
| --- | --- | --- |
| Plain text | the text | `manager` |
| Text with commas (assignment fields) | a list | `alice,bob` |
| `$` and a JavaScript expression | the expression's value | `$data.requester` |
| `#` and JavaScript (assignment fields) | what the code returns | `#data.approvers.join(',')` |

Expressions and scripts see:

| Name | What it is |
| --- | --- |
| `data` (`this.data`) | the instance data |
| `input`, `output` | the item's input (from the task's inputs) and output (a service's result) |
| `item` (`this`) | the item: the running task or event |
| `instance` | the instance (in process scripts, `this` is the execution: use `instance.data`) |
| `appServices` | the application's services |
| `appUtils`, `appDelegate` | the application's helpers |

 fields are expressions. Scripts (script tasks, Scripts on events) are
statements, which can be several lines.

Script, condition and collection fields are code editors: they mark code that does not compile as you type
(checked the way bpmn-server compiles it), and complete these names: type `data.` for the model's data
fields (its form fields, outputs and initiator), `appServices.` for the application's services, `this.` or
`item.` for the item. Ctrl+Space shows what fits where the cursor is.

## Every element

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| General | Name | `name` | Shown in task lists and logs. |
| General | ID | `id` | Identifies the element: in API queries (`items.elementId`), logs and Problems. |
| Documentation | Element documentation | `bpmn:documentation` | Shown with the model's description. |
| Scripts | (see below) | `camunda:executionListener` | Runs JavaScript on the element's events. |

### Scripts on events

Each entry is a JavaScript script run when the element reaches an event. The panel writes it as
`<camunda:executionListener event="..."><camunda:script scriptFormat="JavaScript">`. bpmn-server runs
`camunda:taskListener` scripts the same way.

| Element | Events | When |
| --- | --- | --- |
| Any task, event, gateway | `enter` | the element is reached |
| | `start` | its work starts |
| | `wait` | it starts waiting (user tasks, catching events, receive tasks) |
| | `end` | it completes |
| User task | `assign` | the task is assigned (API `assign`) |
| | `validate` | the task is about to complete. Return `{ error: 'message' }` to refuse it. |
| | `transformInput` | the submitted data arrives, before it is stored: change `this.input` |
| Process (or pool) | `start`, `end` | the instance starts or ends; `this` is the execution, so use `instance.data` |

```js
// validate on a user task: refuse a request for more than 20 days
if (this.input.days > 20) return { error: 'At most 20 days' };
```

| Field | In the file | What bpmn-server does |
| --- | --- | --- |
| Event | `event` | The event above. |
| Format | `camunda:script/@scriptFormat` | bpmn-server runs JavaScript. |
| Script | `camunda:script` body | The script. |

## Process

Select the canvas background, or the pool of a collaboration.

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| General | Name, ID | `name`, `id` | The process's name and id. Models are started by the model's (file's) name. |
| General | Executable | `isExecutable` | Recorded. bpmn-server runs the process either way. |
| General | Version tag | `camunda:versionTag` | Recorded; not used. |
| Scripts | `start`, `end` | `camunda:executionListener` | Run when an instance starts and ends. |

## Start event

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| Who can start | Candidate users | `camunda:candidateUsers` | Users who may start the process here. A list or `$` expression. |
| Who can start | Candidate groups | `camunda:candidateGroups` | Groups whose members may start the process here. |
| Start initiator | Initiator | `camunda:initiator` | A data field that receives the user who started the instance, e.g. `requester` (then `$data.requester` names them later). |
| Form | Form key | `camunda:formKey` | Passed to the application with the start event's fields (bpmn-server's `getFields`), for an application that has its own forms. bpmn-web shows the form fields. |
| Form fields | (see [Form fields](#form-fields)) | `camunda:formData` | Fields asked for when starting. |

Timer, message and signal start events: see [Events](#events).

## User task

A user task waits until someone completes it (the API's `invoke`).

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| User assignment | Assignee | `camunda:assignee` | The user the task is assigned to. Text or `$` expression. |
| User assignment | Candidate users | `camunda:candidateUsers` | Users who may take the task. List or expression. |
| User assignment | Candidate groups | `camunda:candidateGroups` | Groups whose members may take the task. A lane's name is added too. |
| User assignment | Due date | `camunda:dueDate` | When the task is due: an ISO date (`2026-06-26T09:54:00`) or an expression giving one. |
| User assignment | Follow up date | `camunda:followUpDate` | When to follow up; same format. |
| User assignment | Priority | `camunda:priority` | The task's priority, a number or expression. Shown in task lists; can be changed when assigning. |
| Form | Form key | `camunda:formKey` | Passed to the application with the task's fields (`getFields`), for an application that has its own forms. bpmn-web shows the form fields. |
| Form fields | (see [Form fields](#form-fields)) | `camunda:formData` | The fields of the task's form. |
| Inputs, Outputs | (see [Inputs and outputs](#inputs-and-outputs)) | `camunda:inputOutput` | |

Example: `Candidate groups` = `manager`, `Due date` = `$new Date(Date.now() + 2 * 24 * 3600 * 1000)`.

### Form fields

Each field is written as `<camunda:formField>` inside `<camunda:formData>`. The value submitted is stored
in the instance data under the field's ID.

| Field | In the file | What bpmn-web does with it |
| --- | --- | --- |
| ID | `id` | The data field the value is stored in. |
| Label | `label` | The field's label in the form. |
| Type | `type` | `enum`: a list to choose from; `date`: a date picker; others (`string`, `long`, `boolean`, `custom`): a text box. |
| Default value | `defaultValue` | The preselected choice of an `enum`. |
| Values | `camunda:value` | An `enum`'s choices: an ID (stored) and a name (shown). |
| Constraints, Properties | `camunda:validation`, `camunda:properties` | Recorded; bpmn-web's form does not apply them. |

## Service task (and send task)

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| Service | Service name | `camunda:delegateExpression` (or `implementation`) | Calls that function of the application's services, with the task's input. Dotted names reach into objects: `notify.email`. Without a matching service, `appDelegate.serviceCalled` handles the call. |
| Inputs | (see below) | `camunda:inputParameter` | The service's input: `service(input, context)`. |
| Outputs | (see below) | `camunda:outputParameter` | Where the service's result is stored. |

Example: Service name `add`, inputs `v1` = `2` and `v2` = `$data.fee`, output `sum` with an empty value: the
sum is stored as `data.sum`.

## Script task

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| Script | Format | `scriptFormat` | bpmn-server runs JavaScript. |
| Script | Script | `bpmn:script` | Runs the script; `this` is the item, `this.data` the instance data. |

## Business rule task

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| Decision | Decision | `camunda:decisionRef` | Evaluates the decision it names in the models folder: the file `<name>.dmn.xml` (its top decision), or a decision with that id. Its inputs are read from the instance data and the task's input parameters (which take precedence); the result is the task's output. The list offers the folder's decision files; below it, what the decision reads and gives, and a button that opens it in the decision editor (or creates it). |
| Decision | Result variable (except on business rule tasks) | `camunda:resultVariable` | Saves the result in the data, `data.<name>`. Without it (or output parameters) the result is not kept; Problems says so. |
| Decision | Result mapping | `camunda:mapDecisionResult` | Shapes the result: `singleEntry` (the one output of the one rule), `singleResult` (its outputs), `collectEntries` (the first output of each rule), `resultList` (the outputs of each rule). Unset: one rule's outputs `{ name: value }` (or `null`) for UNIQUE, FIRST, PRIORITY and ANY, a list for COLLECT, RULE ORDER and OUTPUT ORDER. |

Decision files are edited in the decision editor (`/model/decision/<name>`, dmn-js), saved as `<name>.dmn.xml`
in the models folder. Cells are FEEL: `"gold"`, `"gold","silver"`, `[600..700]`, `>= 750`, `not("blocked")`, `-`
(any), and expressions in output cells (`0.1 * income`). The Report shows each business rule task's table.

## Call activity

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| Called process | Process | `calledElement` | Starts the saved model of that name and waits for it to end. |

## Sequence flow

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| Condition | Condition | `bpmn:conditionExpression` | A JavaScript expression; the flow is taken when it is true. A leading `$` is optional. Example: `data.days > 5`. |
| Condition | Language | `conditionExpression/@language` | Recorded; bpmn-server evaluates JavaScript. |

The condition is offered on flows leaving a task or an exclusive, inclusive or complex gateway, except the
default flow. A flow from elsewhere that has a condition shows it, and bpmn-server evaluates it.

Scripts on sequence flows are not run (they are not offered; a model that has them shows them, flagged).

## Gateways

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| Default flow | Default flow | `default` | Taken when no other flow's condition is true. The diagram marks it with a slash. |

## Multi-instance (any task or sub-process)

Turn a task into a loop with the wrench menu: parallel (three vertical lines) or sequential (three
horizontal lines).

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| Multi-instance | Collection | `camunda:collection` | An expression giving the list to run once per entry (`$data.approvers`), or a number of times. |
| (diagram marker) | Sequential | `isSequential` | One after another, or all at once. |

## Events

| Kind | Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- | --- |
| Timer | Timer | Type | `timeDuration`, `timeDate` or `timeCycle` | A delay, a date, or a repeating cycle. |
| Timer | Timer | Value | the element's body | Duration: ISO 8601 (`PT2H`) or a cron expression. Date: ISO 8601. Cycle: `R3/PT10H` or cron. Each can be a `$` expression. |
| Message | Message | Global message reference, Name | `messageRef`, `bpmn:message/@name` | Waits for (or sends) the message of that name: the API's `throwMessage(name, data)`. |
| Signal | Signal | Global signal reference, Name | `signalRef`, `bpmn:signal/@name` | The same, for every instance waiting: `throwSignal(name, data)`. |
| Error | Error | Global error reference, Code | `errorRef`, `bpmn:error/@errorCode` | An error end event throws the code; a boundary or event sub-process start catches it. |
| Escalation | Escalation | Global escalation reference, Code | `escalationRef`, `bpmn:escalation/@escalationCode` | The same, for escalations. |
| Terminate | (diagram) | | `terminateEventDefinition` | Ends the whole instance. |
| Boundary | (diagram marker) | Interrupting | `cancelActivity` | Whether the boundary event cancels the task it is attached to. |

A throwing message or signal event passes its outputs with the message (to `appDelegate.messageThrown` or `signalThrown`).

## Data objects

A data object (or data store) names data the application provides, such as a client. Connect it to the
element that should load it, with a data association in either direction: a start event to load it when the
instance starts, a service task to load it when the task runs.

| Group | Field | In the file | What bpmn-server does |
| --- | --- | --- | --- |
| General | Name | the data object reference's `name` | The name it gets in the instance data: `client` is `data.client`. |
| Data object | In the instance data | | Shows `data.client`. |
| Data object | Loaded when these run | `dataInputAssociation`, `dataOutputAssociation` | When a connected element runs, bpmn-server asks the application for it (`appDelegate.loadDataObject(name, item)`) and puts the result in `data.client`, each time the element runs. |

The value is saved with the instance like any data: later elements read and change `data.client` in scripts,
conditions and inputs, and the instance page and the Test tab show it. An application without `loadDataObject`
loads nothing (the log says so, and the Problems list warns); a data object connected to nothing is never loaded.

## Inputs and outputs

On tasks and events, under **Inputs** and **Outputs**. Each is a `<camunda:inputParameter>` or
`<camunda:outputParameter>` inside `<camunda:inputOutput>`.

**Inputs** are worked out when the element is reached and passed to it as `input` (a service's first
argument, a decision's input):

| Assignment type | Example | The input's value |
| --- | --- | --- |
| String or expression | `hello`, `$data.amount` | the text, or the expression's value when it starts with `$` |
| Script | `data.amount * 1.2` | the expression's value |
| List | entries `'approved'`, `data.level` | a list; each entry is an expression, so quote text |
| Map | `level` = `data.level` | a map; each value is an expression |

**Outputs** are stored in the instance data when the element completes: the output's name is the data field,
and its value an expression such as `output.total`. An empty value stores the whole result (`output`).

## Element templates

A template fills in a task's settings in one step (Template, in the panel). See the README's
*Element templates* for the catalog and what a template may set.

## Settings bpmn-server does not run

Not offered. A model that has one shows it in the panel (Camunda's group, or **Other attributes**), and the
Problems list says it has no effect.

| Setting | In the file |
| --- | --- |
| Asynchronous continuations | `camunda:asyncBefore`, `camunda:asyncAfter`, `camunda:exclusive` |
| Job execution | `camunda:jobPriority`, `camunda:failedJobRetryTimeCycle` |
| Java implementations | `camunda:class`, `camunda:expression`, Java listeners (without a script) |
| External tasks | `camunda:type="external"`, `camunda:topic` |
| Connectors | `camunda:connector` |
| Field injection | `camunda:field` |
| Result variable | `camunda:resultVariable` |
| Script resource | `camunda:resource` |
| Camunda forms | `camunda:formRef` and its binding and version |
| Call activity mappings and binding | `camunda:in`, `camunda:out`, `camunda:calledElementBinding`, version, tenant |
| Decision binding | `camunda:decisionRefBinding`, version, tenant |
| Loop cardinality, completion condition, element variable | `loopCardinality`, `completionCondition`, `camunda:elementVariable` (bpmn-server loops over the collection) |
| Conditional events | `conditionalEventDefinition` |
| A service on a message event | `camunda:delegateExpression` on a message event definition |
| Scripts on sequence flows; `transformOutput` scripts | `camunda:executionListener` |
| Extension properties | `camunda:properties` |
| Process: candidate starters, history time to live, startable in tasklist | `camunda:candidateStarterUsers`, `camunda:candidateStarterGroups`, `camunda:historyTimeToLive`, `camunda:isStartableInTasklist` (recorded with the model, not used) |

**Other attributes** shows, read-only, attributes other tools write that bpmn-server does not use
(`gatewayDirection`, `processType`, `isClosed`, `associationDirection`) and attributes of namespaces bpmn-web
does not know.
