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

[interfaces/elements.ts:11](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L11)

___

### flows

• **flows**: `any`[]

#### Defined in

[interfaces/elements.ts:8](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L8)

___

### logger

• **logger**: `any`

#### Defined in

[interfaces/elements.ts:10](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L10)

___

### name

• **name**: `any`

#### Defined in

[interfaces/elements.ts:4](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L4)

___

### nodes

• **nodes**: `Map`\<`any`, `any`\>

#### Defined in

[interfaces/elements.ts:7](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L7)

___

### processes

• **processes**: `Map`\<`any`, `any`\>

#### Defined in

[interfaces/elements.ts:5](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L5)

___

### rootElements

• **rootElements**: `any`

#### Defined in

[interfaces/elements.ts:6](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L6)

___

### source

• **source**: `any`

#### Defined in

[interfaces/elements.ts:9](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L9)

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

[interfaces/elements.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L14)

___

### getJson

▸ **getJson**(): `string`

#### Returns

`string`

#### Defined in

[interfaces/elements.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L13)

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

[interfaces/elements.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L16)

___

### getStartNode

▸ **getStartNode**(): [`Node`](../classes/Node.md)

#### Returns

[`Node`](../classes/Node.md)

#### Defined in

[interfaces/elements.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L15)

___

### load

▸ **load**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[interfaces/elements.ts:12](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/elements.ts#L12)
