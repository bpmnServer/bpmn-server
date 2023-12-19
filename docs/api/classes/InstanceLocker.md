[bpmn-server](../README.md) / InstanceLocker

# Class: InstanceLocker

## Table of contents

### Constructors

- [constructor](InstanceLocker.md#constructor)

### Properties

- [dataStore](InstanceLocker.md#datastore)

### Methods

- [delay](InstanceLocker.md#delay)
- [delete](InstanceLocker.md#delete)
- [list](InstanceLocker.md#list)
- [lock](InstanceLocker.md#lock)
- [release](InstanceLocker.md#release)
- [try](InstanceLocker.md#try)

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

[datastore/InstanceLocker.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/InstanceLocker.ts#lines-11)

## Properties

### dataStore

• **dataStore**: `any`

#### Defined in

[datastore/InstanceLocker.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/InstanceLocker.ts#lines-9)

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

[datastore/InstanceLocker.ts:69](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/InstanceLocker.ts#lines-69)

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

[datastore/InstanceLocker.ts:58](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/InstanceLocker.ts#lines-58)

___

### list

▸ **list**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[datastore/InstanceLocker.ts:63](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/InstanceLocker.ts#lines-63)

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

[datastore/InstanceLocker.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/InstanceLocker.ts#lines-14)

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

[datastore/InstanceLocker.ts:52](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/InstanceLocker.ts#lines-52)

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

[datastore/InstanceLocker.ts:35](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/InstanceLocker.ts#lines-35)
