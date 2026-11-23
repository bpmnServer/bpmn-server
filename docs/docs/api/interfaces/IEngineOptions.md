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

[packages/bpmn-server/src/API/API.ts:144](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L144)

___

### noWait

• `Optional` **noWait**: `boolean`

#### Defined in

[packages/bpmn-server/src/API/API.ts:145](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L145)

___

### recover

• `Optional` **recover**: `boolean`

#### Defined in

[packages/bpmn-server/src/API/API.ts:146](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L146)
