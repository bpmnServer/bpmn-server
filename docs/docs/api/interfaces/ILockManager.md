[bpmn-server](../readme.md) / ILockManager

# Interface: ILockManager

The lock port: one owner at a time per instance, across processes. The engine locks an instance
for each operation on it and releases it afterwards, and claims a timer before firing it.

## Implemented by

- [`InstanceLocker`](../classes/InstanceLocker.md)

## Table of contents

### Properties

- [owner](ILockManager.md#owner)

### Methods

- [lock](ILockManager.md#lock)
- [release](ILockManager.md#release)
- [claim](ILockManager.md#claim)
- [list](ILockManager.md#list)

## Properties

### owner

• `Readonly` **owner**: `string`

This process's identity as a lock owner.

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:51](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L51)

## Methods

### lock

▸ **lock**(`id`): `Promise`\<`boolean`\>

Waits until `id` is locked by this owner, or throws once the configured tries are spent. A lock older than the stale age is taken over.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:53](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L53)

___

### release

▸ **release**(`id`): `Promise`\<`void`\>

Releases `id` only when this owner holds it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L55)

___

### claim

▸ **claim**(`key`): `Promise`\<`boolean`\>

Takes `key` once, without waiting: true for the one claimant, false when another (any process) holds it. Claims expire after the stale age.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L57)

___

### list

▸ **list**(): `Promise`\<`any`[]\>

Every current lock, for diagnostics.

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L59)
