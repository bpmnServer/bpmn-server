[bpmn-server](../README.md) / [Exports](../modules.md) / [datastore/InstanceLocker](../modules/datastore_InstanceLocker.md) / InstanceLocker

# Class: InstanceLocker

[datastore/InstanceLocker](../modules/datastore_InstanceLocker.md).InstanceLocker

## Table of contents

### Constructors

- [constructor](datastore_InstanceLocker.InstanceLocker.md#constructor)

### Properties

- [dataStore](datastore_InstanceLocker.InstanceLocker.md#datastore)

### Methods

- [delay](datastore_InstanceLocker.InstanceLocker.md#delay)
- [delete](datastore_InstanceLocker.InstanceLocker.md#delete)
- [list](datastore_InstanceLocker.InstanceLocker.md#list)
- [lock](datastore_InstanceLocker.InstanceLocker.md#lock)
- [release](datastore_InstanceLocker.InstanceLocker.md#release)
- [try](datastore_InstanceLocker.InstanceLocker.md#try)

## Constructors

### constructor

• **new InstanceLocker**(`dataStore`): [`InstanceLocker`](datastore_InstanceLocker.InstanceLocker.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataStore` | `any` |

#### Returns

[`InstanceLocker`](datastore_InstanceLocker.InstanceLocker.md)

#### Defined in

[src/datastore/InstanceLocker.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/InstanceLocker.ts#L11)

## Properties

### dataStore

• **dataStore**: `any`

#### Defined in

[src/datastore/InstanceLocker.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/InstanceLocker.ts#L9)

## Methods

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

[src/datastore/InstanceLocker.ts:69](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/InstanceLocker.ts#L69)

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

[src/datastore/InstanceLocker.ts:58](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/InstanceLocker.ts#L58)

___

### list

▸ **list**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/datastore/InstanceLocker.ts:63](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/InstanceLocker.ts#L63)

___

### lock

▸ **lock**(`id`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/datastore/InstanceLocker.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/InstanceLocker.ts#L14)

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

[src/datastore/InstanceLocker.ts:52](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/InstanceLocker.ts#L52)

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

[src/datastore/InstanceLocker.ts:35](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/InstanceLocker.ts#L35)
