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

[API/API.ts:74](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L74)

___

### noWait

• `Optional` **noWait**: `boolean`

#### Defined in

[API/API.ts:75](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L75)

___

### recover

• `Optional` **recover**: `boolean`

#### Defined in

[API/API.ts:76](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L76)
