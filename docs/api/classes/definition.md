[bpmn-server](../README.md) / Definition

# Class: Definition

## Implements

- [`IDefinition`](../interfaces/IDefinition.md)

## Table of contents

### Constructors

- [constructor](Definition.md#constructor)

### Properties

- [accessRules](Definition.md#accessrules)
- [flows](Definition.md#flows)
- [logger](Definition.md#logger)
- [moddle](Definition.md#moddle)
- [name](Definition.md#name)
- [nodes](Definition.md#nodes)
- [processes](Definition.md#processes)
- [rootElements](Definition.md#rootelements)
- [server](Definition.md#server)
- [source](Definition.md#source)

### Methods

- [getDefinition](Definition.md#getdefinition)
- [getFields](Definition.md#getfields)
- [getJson](Definition.md#getjson)
- [getNodeById](Definition.md#getnodebyid)
- [getStartNode](Definition.md#getstartnode)
- [getStartNodes](Definition.md#getstartnodes)
- [load](Definition.md#load)
- [loadProcess](Definition.md#loadprocess)

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

[elements/Definition.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-34)

## Properties

### accessRules

• **accessRules**: `any`[] = `[]`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[accessRules](../interfaces/IDefinition.md#accessrules)

#### Defined in

[elements/Definition.ts:33](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-33)

___

### flows

• **flows**: `any`[] = `[]`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[flows](../interfaces/IDefinition.md#flows)

#### Defined in

[elements/Definition.ts:28](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-28)

___

### logger

• **logger**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[logger](../interfaces/IDefinition.md#logger)

#### Defined in

[elements/Definition.ts:30](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-30)

___

### moddle

• **moddle**: `any`

#### Defined in

[elements/Definition.ts:32](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-32)

___

### name

• **name**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[name](../interfaces/IDefinition.md#name)

#### Defined in

[elements/Definition.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-24)

___

### nodes

• **nodes**: `Map`\<`any`, `any`\>

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[nodes](../interfaces/IDefinition.md#nodes)

#### Defined in

[elements/Definition.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-27)

___

### processes

• **processes**: `Map`\<`any`, `any`\>

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[processes](../interfaces/IDefinition.md#processes)

#### Defined in

[elements/Definition.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-25)

___

### rootElements

• **rootElements**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[rootElements](../interfaces/IDefinition.md#rootelements)

#### Defined in

[elements/Definition.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-26)

___

### server

• **server**: `any`

#### Defined in

[elements/Definition.ts:31](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-31)

___

### source

• **source**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[source](../interfaces/IDefinition.md#source)

#### Defined in

[elements/Definition.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-29)

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

[IDefinition](../interfaces/IDefinition.md).[getDefinition](../interfaces/IDefinition.md#getdefinition)

#### Defined in

[elements/Definition.ts:301](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-301)

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

[elements/Definition.ts:314](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-314)

___

### getJson

▸ **getJson**(): `string`

#### Returns

`string`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[getJson](../interfaces/IDefinition.md#getjson)

#### Defined in

[elements/Definition.ts:274](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-274)

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

[elements/Definition.ts:339](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-339)

___

### getStartNode

▸ **getStartNode**(): `any`

#### Returns

`any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[getStartNode](../interfaces/IDefinition.md#getstartnode)

#### Defined in

[elements/Definition.ts:336](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-336)

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

[elements/Definition.ts:325](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-325)

___

### load

▸ **load**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[load](../interfaces/IDefinition.md#load)

#### Defined in

[elements/Definition.ts:133](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-133)

___

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

[elements/Definition.ts:44](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Definition.ts#lines-44)
