[bpmn-server](../README.md) / ICacheManager

# Interface: ICacheManager

## Implemented by

- [`CacheManager`](../classes/CacheManager.md)
- [`NoCacheManager`](../classes/NoCacheManager.md)

## Table of contents

### Methods

- [add](ICacheManager.md#add)
- [list](ICacheManager.md#list)
- [remove](ICacheManager.md#remove)
- [shutdown](ICacheManager.md#shutdown)

## Methods

### add

▸ **add**(`execution`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](IExecution.md) |

#### Returns

`any`

#### Defined in

[interfaces/server.ts:120](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/server.ts#L120)

___

### list

▸ **list**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/server.ts:119](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/server.ts#L119)

___

### remove

▸ **remove**(`instanceId`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/server.ts:121](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/server.ts#L121)

___

### shutdown

▸ **shutdown**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/server.ts:122](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/server.ts#L122)
