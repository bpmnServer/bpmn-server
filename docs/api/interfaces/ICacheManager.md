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

[interfaces/server.ts:127](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/interfaces/server.ts#L127)

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

[interfaces/server.ts:128](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/interfaces/server.ts#L128)

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

[interfaces/server.ts:129](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/interfaces/server.ts#L129)

___

### shutdown

▸ **shutdown**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/server.ts:130](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/interfaces/server.ts#L130)
