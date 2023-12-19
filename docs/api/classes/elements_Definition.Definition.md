[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Definition](../modules/elements_Definition.md) / Definition

# Class: Definition

[elements/Definition](../modules/elements_Definition.md).Definition

## Implements

- [`IDefinition`](../interfaces/interfaces_elements.IDefinition.md)

## Table of contents

### Constructors

- [constructor](elements_Definition.Definition.md#constructor)

### Properties

- [accessRules](elements_Definition.Definition.md#accessrules)
- [flows](elements_Definition.Definition.md#flows)
- [logger](elements_Definition.Definition.md#logger)
- [moddle](elements_Definition.Definition.md#moddle)
- [name](elements_Definition.Definition.md#name)
- [nodes](elements_Definition.Definition.md#nodes)
- [processes](elements_Definition.Definition.md#processes)
- [rootElements](elements_Definition.Definition.md#rootelements)
- [server](elements_Definition.Definition.md#server)
- [source](elements_Definition.Definition.md#source)

### Methods

- [getDefinition](elements_Definition.Definition.md#getdefinition)
- [getFields](elements_Definition.Definition.md#getfields)
- [getJson](elements_Definition.Definition.md#getjson)
- [getNodeById](elements_Definition.Definition.md#getnodebyid)
- [getStartNode](elements_Definition.Definition.md#getstartnode)
- [getStartNodes](elements_Definition.Definition.md#getstartnodes)
- [load](elements_Definition.Definition.md#load)
- [loadProcess](elements_Definition.Definition.md#loadprocess)

## Constructors

### constructor

• **new Definition**(`name`, `source`, `server`): [`Definition`](elements_Definition.Definition.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `source` | `string` |
| `server` | [`BPMNServer`](server_BPMNServer.BPMNServer.md) |

#### Returns

[`Definition`](elements_Definition.Definition.md)

#### Defined in

[src/elements/Definition.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L34)

## Properties

### accessRules

• **accessRules**: `any`[] = `[]`

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[accessRules](../interfaces/interfaces_elements.IDefinition.md#accessrules)

#### Defined in

[src/elements/Definition.ts:33](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L33)

___

### flows

• **flows**: `any`[] = `[]`

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[flows](../interfaces/interfaces_elements.IDefinition.md#flows)

#### Defined in

[src/elements/Definition.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L28)

___

### logger

• **logger**: `any`

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[logger](../interfaces/interfaces_elements.IDefinition.md#logger)

#### Defined in

[src/elements/Definition.ts:30](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L30)

___

### moddle

• **moddle**: `any`

#### Defined in

[src/elements/Definition.ts:32](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L32)

___

### name

• **name**: `any`

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[name](../interfaces/interfaces_elements.IDefinition.md#name)

#### Defined in

[src/elements/Definition.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L24)

___

### nodes

• **nodes**: `Map`\<`any`, `any`\>

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[nodes](../interfaces/interfaces_elements.IDefinition.md#nodes)

#### Defined in

[src/elements/Definition.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L27)

___

### processes

• **processes**: `Map`\<`any`, `any`\>

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[processes](../interfaces/interfaces_elements.IDefinition.md#processes)

#### Defined in

[src/elements/Definition.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L25)

___

### rootElements

• **rootElements**: `any`

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[rootElements](../interfaces/interfaces_elements.IDefinition.md#rootelements)

#### Defined in

[src/elements/Definition.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L26)

___

### server

• **server**: `any`

#### Defined in

[src/elements/Definition.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L31)

___

### source

• **source**: `any`

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[source](../interfaces/interfaces_elements.IDefinition.md#source)

#### Defined in

[src/elements/Definition.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L29)

## Methods

### getDefinition

▸ **getDefinition**(`source`, `logger`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `any` |
| `logger` | `any` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[getDefinition](../interfaces/interfaces_elements.IDefinition.md#getdefinition)

#### Defined in

[src/elements/Definition.ts:301](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L301)

___

### getFields

▸ **getFields**(`elementId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `elementId` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/elements/Definition.ts:314](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L314)

___

### getJson

▸ **getJson**(): `string`

#### Returns

`string`

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[getJson](../interfaces/interfaces_elements.IDefinition.md#getjson)

#### Defined in

[src/elements/Definition.ts:274](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L274)

___

### getNodeById

▸ **getNodeById**(`id`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`any`

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[getNodeById](../interfaces/interfaces_elements.IDefinition.md#getnodebyid)

#### Defined in

[src/elements/Definition.ts:339](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L339)

___

### getStartNode

▸ **getStartNode**(): `any`

#### Returns

`any`

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[getStartNode](../interfaces/interfaces_elements.IDefinition.md#getstartnode)

#### Defined in

[src/elements/Definition.ts:336](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L336)

___

### getStartNodes

▸ **getStartNodes**(`userInvokable?`): `any`[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `userInvokable` | `boolean` | `false` |

#### Returns

`any`[]

#### Defined in

[src/elements/Definition.ts:325](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L325)

___

### load

▸ **load**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IDefinition](../interfaces/interfaces_elements.IDefinition.md).[load](../interfaces/interfaces_elements.IDefinition.md#load)

#### Defined in

[src/elements/Definition.ts:133](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L133)

___

### loadProcess

▸ **loadProcess**(`definition`, `processElement`, `parentProcess`): [`Process`](elements_Process.Process.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | `any` |
| `processElement` | `any` |
| `parentProcess` | `any` |

#### Returns

[`Process`](elements_Process.Process.md)

#### Defined in

[src/elements/Definition.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Definition.ts#L44)
