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

[packages/bpmn-server/src/interfaces/common.ts:85](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L85)

___

### retries

• `Optional` **retries**: `number`

further tries of an idempotent call (GET, HEAD, PUT, DELETE) after a network error, 429 or 5xx; default 2

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:87](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L87)

___

### retryDelay

• `Optional` **retryDelay**: `number`

ms before the first retry, doubled for each next one; default 200

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:89](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L89)

___

### maxResponseBytes

• `Optional` **maxResponseBytes**: `number`

the largest answer read, in bytes; default 5 MB

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:91](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L91)
