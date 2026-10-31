[bpmn-server](../readme.md) / IDefinition

# Interface: IDefinition

## Implemented by

- [`Definition`](../classes/Definition.md)

## Table of contents

### Properties

- [name](IDefinition.md#name)
- [processes](IDefinition.md#processes)
- [rootElements](IDefinition.md#rootelements)
- [nodes](IDefinition.md#nodes)
- [flows](IDefinition.md#flows)
- [source](IDefinition.md#source)
- [logger](IDefinition.md#logger)
- [accessRules](IDefinition.md#accessrules)

### Methods

- [load](IDefinition.md#load)
- [getJson](IDefinition.md#getjson)
- [getDefinition](IDefinition.md#getdefinition)
- [getStartNode](IDefinition.md#getstartnode)
- [getNodeById](IDefinition.md#getnodebyid)

## Properties

### name

• **name**: `any`

#### Defined in

[interfaces/elements.ts:4](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L4)

___

### processes

• **processes**: `Map`\<`any`, `any`\>

#### Defined in

[interfaces/elements.ts:5](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L5)

___

### rootElements

• **rootElements**: `any`

#### Defined in

[interfaces/elements.ts:6](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L6)

___

### nodes

• **nodes**: `Map`\<`any`, `any`\>

#### Defined in

[interfaces/elements.ts:7](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L7)

___

### flows

• **flows**: `any`[]

#### Defined in

[interfaces/elements.ts:8](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L8)

___

### source

• **source**: `any`

#### Defined in

[interfaces/elements.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L9)

___

### logger

• **logger**: `any`

#### Defined in

[interfaces/elements.ts:10](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L10)

___

### accessRules

• **accessRules**: `any`[]

#### Defined in

[interfaces/elements.ts:11](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L11)

## Methods

### load

▸ **load**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[interfaces/elements.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L12)

___

### getJson

▸ **getJson**(): `string`

#### Returns

`string`

#### Defined in

[interfaces/elements.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L13)

___

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

[interfaces/elements.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L14)

___

### getStartNode

▸ **getStartNode**(): [`Node`](../classes/Node.md)

#### Returns

[`Node`](../classes/Node.md)

#### Defined in

[interfaces/elements.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L15)

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

[interfaces/elements.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L16)
