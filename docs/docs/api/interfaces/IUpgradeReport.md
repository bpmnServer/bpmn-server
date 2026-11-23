[bpmn-server](../readme.md) / IUpgradeReport

# Interface: IUpgradeReport

## Table of contents

### Properties

- [model](IUpgradeReport.md#model)
- [refused](IUpgradeReport.md#refused)
- [instances](IUpgradeReport.md#instances)

## Properties

### model

• **model**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:160](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L160)

___

### refused

• `Optional` **refused**: `string`

why none of the model's instances was considered: no saved model, or one with errors

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:162](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L162)

___

### instances

• **instances**: [`IUpgradeInstanceReport`](IUpgradeInstanceReport.md)[]

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:163](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L163)
