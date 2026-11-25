# Gateways

A gateway splits a process into branches, or brings branches back together. The symbol says which kind it is, and the
same symbol behaves differently depending on whether paths leave it (splitting) or arrive at it (joining).

| Gateway | Splitting: which paths are taken | Joining: what it waits for |
|---|---|---|
| **Exclusive** (XOR) ![exclusive](../bpmn/BPMN_exclusive_gateway-59x59.png) | One. The first path whose condition is true; the one with no condition if none is | The first branch to arrive. The others are cancelled |
| **Inclusive** ![inclusive](../bpmn/BPMN_inclusive_gateway-59x59.png) | Every path whose condition is true | Every branch that is still running |
| **Parallel** ![parallel](../bpmn/BPMN_parallel_gateway-59x59.png) | All of them, with no conditions | Every branch |
| **Event-based** ![event-based](../bpmn/BPMN_event_based_gateway-59x59.png) | It waits. Each path begins with an event, and the first event to happen wins; the others are cancelled | The first branch to arrive |

## An exclusive gateway: one path

Each path leaving it carries a condition, and the first true one is taken. Give one path no condition, so that
something always happens:

```xml
<bpmn:exclusiveGateway id="LongLeave" name="More than five days?">
  <bpmn:outgoing>ToApprove</bpmn:outgoing>
  <bpmn:outgoing>ToAutoApprove</bpmn:outgoing>
</bpmn:exclusiveGateway>

<bpmn:sequenceFlow id="ToApprove" sourceRef="LongLeave" targetRef="Approve">
  <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" language="JavaScript">data.days &gt; 5</bpmn:conditionExpression>
</bpmn:sequenceFlow>
<bpmn:sequenceFlow id="ToAutoApprove" sourceRef="LongLeave" targetRef="AutoApproved" />
```

A condition is JavaScript over the case's data unless it says `language="FEEL"`: see
[Conditional flow](conditionalFlow.md) and [Scripting](../scripting.md). When no condition is true and no path is
unconditional, the case stops there, and the model's checks warn about it before it runs.

## A parallel gateway: every path, then wait for them all

Two parallel gateways are used together: one to split, one to join. The branches run independently, and the join
waits until every one of them has arrived.

```xml
<bpmn:parallelGateway id="split" />           <!-- two or more outgoing flows -->
<bpmn:parallelGateway id="join" />            <!-- the same number incoming -->
```

A branch that waits at a user task holds the join until that task is done.

## An inclusive gateway: some paths

It splits like an exclusive gateway, except that **every** true condition is taken, so two or three branches may run.
Joining, it waits for the branches that are actually running, not for every path drawn.

## An event-based gateway: whichever happens first

Every path out of it starts with a catching event: a message, a timer, a signal. The case waits at the gateway, and
the first event to happen takes its path. The others are cancelled, so a timer makes a deadline:

- a message arrives first: the process continues along the message's path;
- nothing arrives before the timer: the timer's path is taken instead.

[Event-based gateway](ebg.md) shows one, with the model that tests it.

## What the Rationale says

A gateway records its decision in the case's Rationale, so the reason a branch was taken is not a guess:

- splitting: which paths were taken, and which conditions were true or false;
- joining: how many branches it is still waiting for and where they are;
- an exclusive join: that the first branch went on, and where the cancelled ones were.

## Models to look at

In the sample application's `apps/testSampleApp/processes/`, each with its `.feature` tests:

| Model | Shows |
|---|---|
| `leave-request.bpmn` | An exclusive gateway on the number of days |
| `Buy Used Car.bpmn` | Exclusive gateways that skip steps not needed |
| `Multi-Approval.bpmn` | Parallel branches joined again |
| `Event Based Gateway.bpmn` | An event-based gateway with a timer as the deadline |
