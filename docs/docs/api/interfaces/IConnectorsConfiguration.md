[bpmn-server](../readme.md) / IConnectorsConfiguration

# Interface: IConnectorsConfiguration

## Table of contents

### Properties

- [timeout](IConnectorsConfiguration.md#timeout)
- [retries](IConnectorsConfiguration.md#retries)
- [retryDelay](IConnectorsConfiguration.md#retrydelay)
- [maxResponseBytes](IConnectorsConfiguration.md#maxresponsebytes)

## Properties

### timeout

• `Optional` **timeout**: `number`

ms a call waits for its answer; default 30000

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L63)

___

### retries

• `Optional` **retries**: `number`

further tries of an idempotent call (GET, HEAD, PUT, DELETE) after a network error, 429 or 5xx; default 2

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:65](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L65)

___

### retryDelay

• `Optional` **retryDelay**: `number`

ms before the first retry, doubled for each next one; default 200

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L67)

___

### maxResponseBytes

• `Optional` **maxResponseBytes**: `number`

the largest answer read, in bytes; default 5 MB

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L69)
