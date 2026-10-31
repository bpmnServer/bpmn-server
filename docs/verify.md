# Checking models

`verifyModel` checks a BPMN model the way bpmn-server loads and runs it, without running it. Use it before saving
a model, in a build, or in a test, to find what would otherwise fail only when an instance reaches it: a gateway
with no way out, a script that does not compile, a timer that is not a valid duration, a service the
application does not provide.

Available since bpmn-server 3.2.

## From the command line

No server and no database are needed:

```sh
npx bpmn-server verify "Leave Application.bpmn"
npx bpmn-server verify processes/            # every .bpmn file in the folder
npx bpmn-server verify processes/ --json     # the results as JSON
```

```text
processes/invoice.bpmn: 2 errors, 3 warnings
  error   script-syntax remind: The script does not compile: Unexpected token ')'
  error   timer-invalid wait: Timer duration '2 days' is not a valid ISO 8601 duration or cron expression.
  warning no-end-event invoice: Process has no end event.
  warning no-outgoing wait: Element has no outgoing sequence flow; the path ends here without an end event.
  warning no-diagram: The model has no diagram information (BPMN DI); the modeler can not display it.
```

Each line is the severity, the check's code, the element's id, and the message.

The exit code is 1 when a model has errors, so a build or CI step fails on a broken model.

## From code

```ts
import { verifyModel } from 'bpmn-server';

const result = await verifyModel(xml, server);   // server is optional
if (!result.valid)
    for (const issue of result.issues.filter(i => i.severity == 'error'))
        console.log(issue.code, issue.elementId, issue.message);
```

With a server, the checks that need the application run too: whether the services a service task calls exist,
and whether a called process is a saved model.

Through the API, by model name or source:

```ts
const result = await api.model.verifyModel('Leave Application', user);
```

The result:

```ts
{
    valid: boolean,     // no errors (warnings do not make a model invalid)
    errors: number,
    warnings: number,
    issues: [{ severity: 'error' | 'warning' | 'info', code, message, elementId?, elementName?, processId? }]
}
```

`code` is stable: filter or suppress issues by it.

## What is checked

| Area | Codes |
|---|---|
| XML and references | `empty-model`, `invalid-xml` (error), `unresolved-reference` (error), `duplicate-id` (error), `xml-warning` |
| Processes | `no-process` (error), `empty-process`, `no-start-event` (error), `no-end-event` |
| Flows | `flow-missing-endpoint` (error), `empty-condition` (error), `start-event-incoming`, `end-event-outgoing`, `unreachable`, `no-outgoing` |
| Gateways | `mixed-gateway`, `default-flow-not-outgoing` (error), `flow-without-condition`, `no-default-flow` (info), `event-gateway-target` (error) |
| Diagram | `no-diagram`, `not-in-diagram` |
| The engine's load | `engine-load-failed` (error) |
| Scripts, conditions, expressions | `script-syntax` (error), `expression-syntax` (error), `empty-script` (info) |
| Timers | `timer-not-defined` (error), `timer-invalid` (error): ISO 8601 durations and dates, cron expressions |
| Services | `service-not-named` (info), `service-not-found` (info) |
| Called processes | `call-activity-no-target` (error), `called-model-missing` |

Codes not marked are warnings.
