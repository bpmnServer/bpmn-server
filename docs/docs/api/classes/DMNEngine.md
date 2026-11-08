[bpmn-server](../readme.md) / DMNEngine

# Class: DMNEngine

## Table of contents

### Constructors

- [constructor](DMNEngine.md#constructor)

### Properties

- [definitions](DMNEngine.md#definitions)
- [decision](DMNEngine.md#decision)
- [options](DMNEngine.md#options)

### Methods

- [log](DMNEngine.md#log)
- [find](DMNEngine.md#find)
- [topDecision](DMNEngine.md#topdecision)
- [load](DMNEngine.md#load)
- [evaluate](DMNEngine.md#evaluate)
- [evaluateDecision](DMNEngine.md#evaluatedecision)
- [evaluateTable](DMNEngine.md#evaluatetable)
- [byPriority](DMNEngine.md#bypriority)
- [test](DMNEngine.md#test)
- [value](DMNEngine.md#value)

## Constructors

### constructor

• **new DMNEngine**(`options?`): [`DMNEngine`](DMNEngine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`DMNOptions`](../readme.md#dmnoptions) |

#### Returns

[`DMNEngine`](DMNEngine.md)

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L32)

## Properties

### definitions

• **definitions**: [`DMNDefinitions`](../readme.md#dmndefinitions)

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L28)

___

### decision

• **decision**: [`Decision`](../readme.md#decision)

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L29)

___

### options

• `Private` **options**: [`DMNOptions`](../readme.md#dmnoptions)

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L30)

## Methods

### log

▸ **log**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L36)

___

### find

▸ **find**(`folder`, `ref`): `Promise`\<[`FoundDecision`](../readme.md#founddecision)\>

The decision a model names (camunda:decisionRef) in a folder: a file `<ref>.dmn.xml`, or a decision with that id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `folder` | `string` |
| `ref` | `string` |

#### Returns

`Promise`\<[`FoundDecision`](../readme.md#founddecision)\>

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:42](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L42)

___

### topDecision

▸ **topDecision**(`definitions`): [`Decision`](../readme.md#decision)

The decision a file is for: the first one no other decision of the file requires.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitions` | [`DMNDefinitions`](../readme.md#dmndefinitions) |

#### Returns

[`Decision`](../readme.md#decision)

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:70](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L70)

___

### load

▸ **load**(`filePath`, `decisionId?`): `Promise`\<[`DMNEngine`](DMNEngine.md)\>

Load a DMN file: its decision `decisionId`, or the decision the file is for.

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `decisionId?` | `string` |

#### Returns

`Promise`\<[`DMNEngine`](DMNEngine.md)\>

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:76](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L76)

___

### evaluate

▸ **evaluate**(`input`): `any`

Evaluate the loaded decision with these values (or, for a table, its inputs' values in order).

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `any`[] \| `Record`\<`string`, `any`\> |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:84](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L84)

___

### evaluateDecision

▸ **evaluateDecision**(`decision`, `context`, `path`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `decision` | [`Decision`](../readme.md#decision) |
| `context` | `Record`\<`string`, `any`\> |
| `path` | `string`[] |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:95](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L95)

___

### evaluateTable

▸ **evaluateTable**(`decision`, `table`, `context`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `decision` | [`Decision`](../readme.md#decision) |
| `table` | [`DecisionTable`](../readme.md#decisiontable) |
| `context` | `Record`\<`string`, `any`\> |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:120](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L120)

___

### byPriority

▸ **byPriority**(`table`, `results`, `context`): `Record`\<`string`, `any`\>[]

Results ordered by their outputs' places in the outputs' value lists (the first listed is the highest).

#### Parameters

| Name | Type |
| :------ | :------ |
| `table` | [`DecisionTable`](../readme.md#decisiontable) |
| `results` | `Record`\<`string`, `any`\>[] |
| `context` | `Record`\<`string`, `any`\> |

#### Returns

`Record`\<`string`, `any`\>[]

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:200](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L200)

___

### test

▸ **test**(`cell`, `value`, `context`): `boolean`

An input cell's test of the input's value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cell` | `string` |
| `value` | `any` |
| `context` | `Record`\<`string`, `any`\> |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:214](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L214)

___

### value

▸ **value**(`source`, `context`, `bareWordIsText?`): `any`

A FEEL expression's value.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `source` | `string` | `undefined` |
| `context` | `Record`\<`string`, `any`\> | `undefined` |
| `bareWordIsText` | `boolean` | `true` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:226](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L226)
