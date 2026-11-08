[bpmn-server](../readme.md) / Definition

# Class: Definition

## Implements

- [`IDefinition`](../interfaces/IDefinition.md)

## Table of contents

### Constructors

- [constructor](Definition.md#constructor)

### Properties

- [moddles](Definition.md#moddles)
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

- [moddleFor](Definition.md#moddlefor)
- [loadProcess](Definition.md#loadprocess)
- [load](Definition.md#load)
- [getJson](Definition.md#getjson)
- [getDefinition](Definition.md#getdefinition)
- [getFields](Definition.md#getfields)
- [getStartNodes](Definition.md#getstartnodes)
- [getStartNode](Definition.md#getstartnode)
- [getNodeById](Definition.md#getnodebyid)
- [getNodeInfo](Definition.md#getnodeinfo)

## Constructors

### constructor

• **new Definition**(`name`, `source`, `server`): [`Definition`](Definition.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `source` | `string` |
| `server` | [`IBPMNServer`](../interfaces/IBPMNServer.md) |

#### Returns

[`Definition`](Definition.md)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:46](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L46)

## Properties

### moddles

▪ `Static` `Private` **moddles**: `Map`\<`object`, `BpmnModdle`\>

One BpmnModdle per extension set: building one registers every BPMN type (about 190 KB and the bulk of a load's time), and parsing does not change it.

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L26)

___

### name

• **name**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[name](../interfaces/IDefinition.md#name)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L36)

___

### processes

• **processes**: `Map`\<`any`, `any`\>

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[processes](../interfaces/IDefinition.md#processes)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L37)

___

### rootElements

• **rootElements**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[rootElements](../interfaces/IDefinition.md#rootelements)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L38)

___

### nodes

• **nodes**: `Map`\<`any`, `any`\>

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[nodes](../interfaces/IDefinition.md#nodes)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L39)

___

### flows

• **flows**: `any`[] = `[]`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[flows](../interfaces/IDefinition.md#flows)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L40)

___

### source

• **source**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[source](../interfaces/IDefinition.md#source)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:41](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L41)

___

### logger

• **logger**: `any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[logger](../interfaces/IDefinition.md#logger)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:42](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L42)

___

### server

• **server**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:43](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L43)

___

### moddle

• **moddle**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L44)

___

### accessRules

• **accessRules**: `any`[] = `[]`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[accessRules](../interfaces/IDefinition.md#accessrules)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:45](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L45)

## Methods

### moddleFor

▸ **moddleFor**(`moddleOptions`): `BpmnModdle`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moddleOptions` | `any` |

#### Returns

`BpmnModdle`

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L27)

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

[packages/bpmn-server/src/elements/Definition.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L56)

___

### load

▸ **load**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[load](../interfaces/IDefinition.md#load)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:159](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L159)

___

### getJson

▸ **getJson**(): `string`

#### Returns

`string`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[getJson](../interfaces/IDefinition.md#getjson)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:308](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L308)

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

[packages/bpmn-server/src/elements/Definition.ts:336](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L336)

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

[packages/bpmn-server/src/elements/Definition.ts:349](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L349)

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

[packages/bpmn-server/src/elements/Definition.ts:360](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L360)

___

### getStartNode

▸ **getStartNode**(): `any`

Where a start with no start event named begins: one a user can start (not a message, signal, timer or error start), else the first.

#### Returns

`any`

#### Implementation of

[IDefinition](../interfaces/IDefinition.md).[getStartNode](../interfaces/IDefinition.md#getstartnode)

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:372](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L372)

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

[packages/bpmn-server/src/elements/Definition.ts:375](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L375)

___

### getNodeInfo

▸ **getNodeInfo**(`elementId`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elementId` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `node` | `any` |
| `fields` | `any` |
| `formKey` | `any` |

#### Defined in

[packages/bpmn-server/src/elements/Definition.ts:378](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Definition.ts#L378)
