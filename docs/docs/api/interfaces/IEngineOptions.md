[bpmn-server](../readme.md) / IEngineOptions

# Interface: IEngineOptions

common parameters:

- query:      MongoDB query to locate the target instance or item

- data:       input Data 

- user:       an instance of ISecureUser object 

- options:    various options, this is an open object that is based through the run-time

Returns IExecution
containing the instance and the results of the call

## Indexable

▪ [otherOptions: `string`]: `unknown`

## Table of contents

### Properties

- [startNodeId](IEngineOptions.md#startnodeid)
- [noWait](IEngineOptions.md#nowait)
- [recover](IEngineOptions.md#recover)

## Properties

### startNodeId

• `Optional` **startNodeId**: `any`

#### Defined in

[packages/bpmn-server/src/API/API.ts:90](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L90)

___

### noWait

• `Optional` **noWait**: `boolean`

#### Defined in

[packages/bpmn-server/src/API/API.ts:91](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L91)

___

### recover

• `Optional` **recover**: `boolean`

#### Defined in

[packages/bpmn-server/src/API/API.ts:92](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L92)
