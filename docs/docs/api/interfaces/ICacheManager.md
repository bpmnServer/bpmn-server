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

[packages/bpmn-server/src/interfaces/server.ts:173](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L173)

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

[packages/bpmn-server/src/interfaces/server.ts:175](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L175)

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

[packages/bpmn-server/src/interfaces/server.ts:176](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L176)

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

[packages/bpmn-server/src/interfaces/server.ts:177](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L177)

___

### shutdown

▸ **shutdown**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:178](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L178)
