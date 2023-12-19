[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/elements](../modules/interfaces_elements.md) / IDefinition

# Interface: IDefinition

[interfaces/elements](../modules/interfaces_elements.md).IDefinition

## Implemented by

- [`Definition`](../classes/elements_Definition.Definition.md)

## Table of contents

### Properties

- [accessRules](interfaces_elements.IDefinition.md#accessrules)
- [flows](interfaces_elements.IDefinition.md#flows)
- [logger](interfaces_elements.IDefinition.md#logger)
- [name](interfaces_elements.IDefinition.md#name)
- [nodes](interfaces_elements.IDefinition.md#nodes)
- [processes](interfaces_elements.IDefinition.md#processes)
- [rootElements](interfaces_elements.IDefinition.md#rootelements)
- [source](interfaces_elements.IDefinition.md#source)

### Methods

- [getDefinition](interfaces_elements.IDefinition.md#getdefinition)
- [getJson](interfaces_elements.IDefinition.md#getjson)
- [getNodeById](interfaces_elements.IDefinition.md#getnodebyid)
- [getStartNode](interfaces_elements.IDefinition.md#getstartnode)
- [load](interfaces_elements.IDefinition.md#load)

## Properties

### accessRules

• **accessRules**: `any`[]

#### Defined in

[src/interfaces/elements.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L11)

___

### flows

• **flows**: `any`[]

#### Defined in

[src/interfaces/elements.ts:8](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L8)

___

### logger

• **logger**: `any`

#### Defined in

[src/interfaces/elements.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L10)

___

### name

• **name**: `any`

#### Defined in

[src/interfaces/elements.ts:4](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L4)

___

### nodes

• **nodes**: `Map`\<`any`, `any`\>

#### Defined in

[src/interfaces/elements.ts:7](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L7)

___

### processes

• **processes**: `Map`\<`any`, `any`\>

#### Defined in

[src/interfaces/elements.ts:5](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L5)

___

### rootElements

• **rootElements**: `any`

#### Defined in

[src/interfaces/elements.ts:6](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L6)

___

### source

• **source**: `any`

#### Defined in

[src/interfaces/elements.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L9)

## Methods

### getDefinition

▸ **getDefinition**(`source`, `logger`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `any` |
| `logger` | [`ILogger`](interfaces_common.ILogger.md) |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/interfaces/elements.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L14)

___

### getJson

▸ **getJson**(): `string`

#### Returns

`string`

#### Defined in

[src/interfaces/elements.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L13)

___

### getNodeById

▸ **getNodeById**(`id`): [`Node`](../classes/elements_Node.Node.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

[`Node`](../classes/elements_Node.Node.md)

#### Defined in

[src/interfaces/elements.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L16)

___

### getStartNode

▸ **getStartNode**(): [`Node`](../classes/elements_Node.Node.md)

#### Returns

[`Node`](../classes/elements_Node.Node.md)

#### Defined in

[src/interfaces/elements.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L15)

___

### load

▸ **load**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/interfaces/elements.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L12)
