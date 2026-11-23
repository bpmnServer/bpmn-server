[bpmn-server](../readme.md) / ICacheManager

# Interface: ICacheManager

## Implemented by

- [`CacheManager`](../classes/CacheManager.md)
- [`NoCacheManager`](../classes/NoCacheManager.md)

## Table of contents

### Methods

- [list](ICacheManager.md#list)
- [getInstance](ICacheManager.md#getinstance)
- [add](ICacheManager.md#add)
- [remove](ICacheManager.md#remove)
- [shutdown](ICacheManager.md#shutdown)

## Methods

### list

▸ **list**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:177](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L177)

___

### getInstance

▸ **getInstance**(`instanceId`): [`IExecution`](IExecution.md)

The live execution of an instance this cache holds, or null/undefined.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |

#### Returns

[`IExecution`](IExecution.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:179](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L179)

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

[packages/bpmn-server/src/interfaces/server.ts:180](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L180)

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

[packages/bpmn-server/src/interfaces/server.ts:181](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L181)

___

### shutdown

▸ **shutdown**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:182](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L182)
