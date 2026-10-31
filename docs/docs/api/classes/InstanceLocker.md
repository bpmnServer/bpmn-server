[bpmn-server](../readme.md) / InstanceLocker

# Class: InstanceLocker

## Table of contents

### Constructors

- [constructor](InstanceLocker.md#constructor)

### Properties

- [dataStore](InstanceLocker.md#datastore)

### Methods

- [lock](InstanceLocker.md#lock)
- [try](InstanceLocker.md#try)
- [release](InstanceLocker.md#release)
- [delete](InstanceLocker.md#delete)
- [list](InstanceLocker.md#list)
- [delay](InstanceLocker.md#delay)

## Constructors

### constructor

• **new InstanceLocker**(`dataStore`): [`InstanceLocker`](InstanceLocker.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataStore` | `any` |

#### Returns

[`InstanceLocker`](InstanceLocker.md)

#### Defined in

[datastore/InstanceLocker.ts:11](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/InstanceLocker.ts#L11)

## Properties

### dataStore

• **dataStore**: `any`

#### Defined in

[datastore/InstanceLocker.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/InstanceLocker.ts#L9)

## Methods

### lock

▸ **lock**(`id`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[datastore/InstanceLocker.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/InstanceLocker.ts#L14)

___

### try

▸ **try**(`id`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[datastore/InstanceLocker.ts:35](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/InstanceLocker.ts#L35)

___

### release

▸ **release**(`id`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[datastore/InstanceLocker.ts:52](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/InstanceLocker.ts#L52)

___

### delete

▸ **delete**(`query`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[datastore/InstanceLocker.ts:58](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/InstanceLocker.ts#L58)

___

### list

▸ **list**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[datastore/InstanceLocker.ts:63](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/InstanceLocker.ts#L63)

___

### delay

▸ **delay**(`time`, `result`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `any` |
| `result` | `any` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[datastore/InstanceLocker.ts:69](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/InstanceLocker.ts#L69)
