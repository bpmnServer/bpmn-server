[bpmn-server](../readme.md) / ICacheManager

# Interface: ICacheManager

## Implemented by

- [`CacheManager`](../classes/CacheManager.md)
- [`NoCacheManager`](../classes/NoCacheManager.md)

## Table of contents

### Methods

- [list](ICacheManager.md#list)
- [add](ICacheManager.md#add)
- [remove](ICacheManager.md#remove)
- [shutdown](ICacheManager.md#shutdown)

## Methods

### list

▸ **list**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/server.ts:129](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L129)

___

### add

▸ **add**(`execution`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](IExecution.md) |

#### Returns

`any`

#### Defined in

[interfaces/server.ts:130](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L130)

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

[interfaces/server.ts:131](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L131)

___

### shutdown

▸ **shutdown**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/server.ts:132](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L132)
