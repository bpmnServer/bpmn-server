[bpmn-server](../README.md) / IDefinition

# Interface: IDefinition

## Implemented by

- [`Definition`](../classes/Definition.md)

## Table of contents

### Properties

- [accessRules](IDefinition.md#accessrules)
- [flows](IDefinition.md#flows)
- [logger](IDefinition.md#logger)
- [name](IDefinition.md#name)
- [nodes](IDefinition.md#nodes)
- [processes](IDefinition.md#processes)
- [rootElements](IDefinition.md#rootelements)
- [source](IDefinition.md#source)

### Methods

- [getDefinition](IDefinition.md#getdefinition)
- [getJson](IDefinition.md#getjson)
- [getNodeById](IDefinition.md#getnodebyid)
- [getStartNode](IDefinition.md#getstartnode)
- [load](IDefinition.md#load)

## Properties

### accessRules

• **accessRules**: `any`[]

#### Defined in

[interfaces/elements.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-11)

___

### flows

• **flows**: `any`[]

#### Defined in

[interfaces/elements.ts:8](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-8)

___

### logger

• **logger**: `any`

#### Defined in

[interfaces/elements.ts:10](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-10)

___

### name

• **name**: `any`

#### Defined in

[interfaces/elements.ts:4](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-4)

___

### nodes

• **nodes**: `Map`\<`any`, `any`\>

#### Defined in

[interfaces/elements.ts:7](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-7)

___

### processes

• **processes**: `Map`\<`any`, `any`\>

#### Defined in

[interfaces/elements.ts:5](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-5)

___

### rootElements

• **rootElements**: `any`

#### Defined in

[interfaces/elements.ts:6](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-6)

___

### source

• **source**: `any`

#### Defined in

[interfaces/elements.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-9)

## Methods

### getDefinition

▸ **getDefinition**(`source`, `logger`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `any` |
| `logger` | [`ILogger`](ILogger.md) |

#### Returns

`Promise`\<`any`\>

#### Defined in

[interfaces/elements.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-14)

___

### getJson

▸ **getJson**(): `string`

#### Returns

`string`

#### Defined in

[interfaces/elements.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-13)

___

### getNodeById

▸ **getNodeById**(`id`): [`Node`](../classes/Node.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

[`Node`](../classes/Node.md)

#### Defined in

[interfaces/elements.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-16)

___

### getStartNode

▸ **getStartNode**(): [`Node`](../classes/Node.md)

#### Returns

[`Node`](../classes/Node.md)

#### Defined in

[interfaces/elements.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-15)

___

### load

▸ **load**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[interfaces/elements.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-12)
