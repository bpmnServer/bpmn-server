[bpmn-server](../readme.md) / StubSet

# Interface: StubSet

What a test replaces, by service name and by timer element id.

## Table of contents

### Properties

- [services](StubSet.md#services)
- [timers](StubSet.md#timers)

## Properties

### services

• **services**: `Record`\<`string`, (`input`: `any`, `data`: `any`) => `Promise`\<`any`\>\>

#### Defined in

[packages/bpmn-server/src/engine/TestStubs.ts:3](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/TestStubs.ts#L3)

___

### timers

• **timers**: `Record`\<`string`, `number`\>

a timer's seconds

#### Defined in

[packages/bpmn-server/src/engine/TestStubs.ts:5](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/TestStubs.ts#L5)
