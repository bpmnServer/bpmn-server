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

[packages/bpmn-server/src/interfaces/server.ts:156](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L156)

___

### refused

• `Optional` **refused**: `string`

why none of the model's instances was considered: no saved model, or one with errors

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:158](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L158)

___

### instances

• **instances**: [`IUpgradeInstanceReport`](IUpgradeInstanceReport.md)[]

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:159](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L159)
