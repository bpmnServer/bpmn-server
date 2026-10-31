[bpmn-server](../readme.md) / DataHandler

# Class: DataHandler

## Table of contents

### Constructors

- [constructor](DataHandler.md#constructor)

### Methods

- [appendData](DataHandler.md#appenddata)
- [getData](DataHandler.md#getdata)
- [getAndCreateData](DataHandler.md#getandcreatedata)

## Constructors

### constructor

• **new DataHandler**(): [`DataHandler`](DataHandler.md)

#### Returns

[`DataHandler`](DataHandler.md)

## Methods

### appendData

▸ **appendData**(`instanceData`, `inputData`, `item`, `dataPath?`, `assignment?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `instanceData` | `any` | `undefined` |
| `inputData` | `any` | `undefined` |
| `item` | `any` | `undefined` |
| `dataPath` | `any` | `null` |
| `assignment` | `any` | `null` |

#### Returns

`void`

#### Defined in

[engine/DataHandler.ts:7](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DataHandler.ts#L7)

___

### getData

▸ **getData**(`instanceData`, `dataPath`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceData` | `any` |
| `dataPath` | `any` |

#### Returns

`any`

#### Defined in

[engine/DataHandler.ts:43](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DataHandler.ts#L43)

___

### getAndCreateData

▸ **getAndCreateData**(`instanceData`, `dataPath`, `asArray?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `instanceData` | `any` | `undefined` |
| `dataPath` | `any` | `undefined` |
| `asArray` | `boolean` | `false` |

#### Returns

`any`

#### Defined in

[engine/DataHandler.ts:56](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DataHandler.ts#L56)
