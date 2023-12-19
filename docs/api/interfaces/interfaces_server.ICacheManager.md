[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/server](../modules/interfaces_server.md) / ICacheManager

# Interface: ICacheManager

[interfaces/server](../modules/interfaces_server.md).ICacheManager

## Implemented by

- [`CacheManager`](../classes/server_CacheManager.CacheManager.md)
- [`NoCacheManager`](../classes/server_CacheManager.NoCacheManager.md)

## Table of contents

### Methods

- [add](interfaces_server.ICacheManager.md#add)
- [list](interfaces_server.ICacheManager.md#list)
- [remove](interfaces_server.ICacheManager.md#remove)
- [shutdown](interfaces_server.ICacheManager.md#shutdown)

## Methods

### add

▸ **add**(`execution`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](interfaces_engine.IExecution.md) |

#### Returns

`any`

#### Defined in

[src/interfaces/server.ts:120](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L120)

___

### list

▸ **list**(): `any`

#### Returns

`any`

#### Defined in

[src/interfaces/server.ts:119](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L119)

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

[src/interfaces/server.ts:121](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L121)

___

### shutdown

▸ **shutdown**(): `any`

#### Returns

`any`

#### Defined in

[src/interfaces/server.ts:122](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L122)
