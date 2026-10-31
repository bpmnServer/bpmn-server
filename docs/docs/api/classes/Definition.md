[bpmn-server](../readme.md) / Definition

# Class: Definition

## Implements

- [`IDefinition`](../interfaces/IDefinition.md)

## Table of contents

### Constructors

- [constructor](Definition.md#constructor)

### Properties

- [name](Definition.md#name)
- [processes](Definition.md#processes)
- [rootElements](Definition.md#rootelements)
- [nodes](Definition.md#nodes)
- [flows](Definition.md#flows)
- [source](Definition.md#source)
- [logger](Definition.md#logger)
- [server](Definition.md#server)
- [moddle](Definition.md#moddle)
- [accessRules](Definition.md#accessrules)

### Methods

- [loadProcess](Definition.md#loadprocess)
- [load](Definition.md#load)
- [getJson](Definition.md#getjson)
- [getDefinition](Definition.md#getdefinition)
- [getFields](Definition.md#getfields)
- [getStartNodes](Definition.md#getstartnodes)
- [getStartNode](Definition.md#getstartnode)
- [getNodeById](Definition.md#getnodebyid)

## Constructors

### constructor

• **new Definition**(`name`, `source`, `server`): [`Definition`](Definition.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `source` | `string` |
| `server` | [`BPMNServer`](BPMNServer.md) |

#### Returns

[`Definition`](Definition.md)

#### Defined in

[elements/Definition.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L34)

## Properties

### name

• **name**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[name](../interfaces/IDefinition.md#name)

#### Defined in

[elements/Definition.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L24)

___

### processes

• **processes**: `Map`\<`any`, `any`\>

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[processes](../interfaces/IDefinition.md#processes)

#### Defined in

[elements/Definition.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L25)

___

### rootElements

• **rootElements**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[rootElements](../interfaces/IDefinition.md#rootelements)

#### Defined in

[elements/Definition.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L26)

___

### nodes

• **nodes**: `Map`\<`any`, `any`\>

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[nodes](../interfaces/IDefinition.md#nodes)

#### Defined in

[elements/Definition.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L27)

___

### flows

• **flows**: `any`[] = `[]`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[flows](../interfaces/IDefinition.md#flows)

#### Defined in

[elements/Definition.ts:28](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L28)

___

### source

• **source**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[source](../interfaces/IDefinition.md#source)

#### Defined in

[elements/Definition.ts:29](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L29)

___

### logger

• **logger**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[logger](../interfaces/IDefinition.md#logger)

#### Defined in

[elements/Definition.ts:30](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L30)

___

### server

• **server**: `any`

#### Defined in

[elements/Definition.ts:31](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L31)

___

### moddle

• **moddle**: `any`

#### Defined in

[elements/Definition.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L32)

___

### accessRules

• **accessRules**: `any`[] = `[]`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[accessRules](../interfaces/IDefinition.md#accessrules)

#### Defined in

[elements/Definition.ts:33](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L33)

## Methods

### loadProcess

▸ **loadProcess**(`definition`, `processElement`, `parentProcess`): [`Process`](Process.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | `any` |
| `processElement` | `any` |
| `parentProcess` | `any` |

#### Returns

[`Process`](Process.md)

#### Defined in

[elements/Definition.ts:44](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L44)

___

### load

▸ **load**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[load](../interfaces/IDefinition.md#load)

#### Defined in

[elements/Definition.ts:143](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L143)

___

### getJson

▸ **getJson**(): `string`

#### Returns

`string`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[getJson](../interfaces/IDefinition.md#getjson)

#### Defined in

[elements/Definition.ts:285](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L285)

___

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

[IDefinition](../interfaces/IDefinition.md).[getDefinition](../interfaces/IDefinition.md#getdefinition)

#### Defined in

[elements/Definition.ts:312](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L312)

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

[elements/Definition.ts:325](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L325)

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

[elements/Definition.ts:336](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L336)

___

### getStartNode

▸ **getStartNode**(): `any`

#### Returns

`any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[getStartNode](../interfaces/IDefinition.md#getstartnode)

#### Defined in

[elements/Definition.ts:347](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L347)

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

[IDefinition](../interfaces/IDefinition.md).[getNodeById](../interfaces/IDefinition.md#getnodebyid)

#### Defined in

[elements/Definition.ts:350](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Definition.ts#L350)
