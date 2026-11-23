[bpmn-server](../readme.md) / DMNEngine

# Class: DMNEngine

## Table of contents

### Constructors

- [constructor](DMNEngine.md#constructor)

### Properties

- [definitions](DMNEngine.md#definitions)
- [decision](DMNEngine.md#decision)
- [options](DMNEngine.md#options)
- [matched](DMNEngine.md#matched)
- [called](DMNEngine.md#called)

### Methods

- [log](DMNEngine.md#log)
- [find](DMNEngine.md#find)
- [topDecision](DMNEngine.md#topdecision)
- [load](DMNEngine.md#load)
- [evaluate](DMNEngine.md#evaluate)
- [evaluateAsync](DMNEngine.md#evaluateasync)
- [evaluateDecision](DMNEngine.md#evaluatedecision)
- [evaluateTable](DMNEngine.md#evaluatetable)
- [byPriority](DMNEngine.md#bypriority)
- [test](DMNEngine.md#test)
- [testValue](DMNEngine.md#testvalue)
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

[packages/bpmn-server/src/dmn/DMNEngine.ts:46](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L46)

## Properties

### definitions

• **definitions**: [`DMNDefinitions`](../readme.md#dmndefinitions)

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L38)

___

### decision

• **decision**: [`Decision`](../readme.md#decision)

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:39](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L39)

___

### options

• `Private` **options**: [`DMNOptions`](../readme.md#dmnoptions)

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:40](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L40)

___

### matched

• **matched**: `number`[] = `[]`

the rules the last table evaluated matched, numbered from 1

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L42)

___

### called

• `Private` **called**: `Map`\<`string`, `any`\>

input expressions that call a function, their values worked out (an async one awaited) first: evaluateAsync

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:44](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L44)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:50](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L50)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:56](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L56)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:84](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L84)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:90](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L90)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:98](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L98)

___

### evaluateAsync

▸ **evaluateAsync**(`input`): `Promise`\<`any`\>

Evaluate it, an input expression that calls a function (`appServices.crm.tierOf(customerId)`) awaited first:
once each, with these values. A call inside a larger expression (`f(x) = 1`) is not awaited.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:113](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L113)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:136](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L136)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:161](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L161)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:257](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L257)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:271](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L271)

___

### testValue

▸ **testValue**(`source`, `value`, `context`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` |
| `value` | `any` |
| `context` | `Record`\<`string`, `any`\> |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:282](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L282)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:291](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L291)
