[bpmn-server](../readme.md) / ModelHistory

# Class: ModelHistory

A model's history: every save kept, as files beside the models, in `<models folder>/.history/<name>/`: one file
per version, `0001.bpmn`, or `0001.<user>.bpmn` with who saved it. When it was saved and its size are the file's.
A save that changes nothing adds nothing. The first save of a model that has a file but no history keeps that
file first, as it was (with its time). Purging removes the model's history folder.

## Table of contents

### Constructors

- [constructor](ModelHistory.md#constructor)

### Properties

- [turns](ModelHistory.md#turns)
- [folder](ModelHistory.md#folder)

### Methods

- [dir](ModelHistory.md#dir)
- [files](ModelHistory.md#files)
- [list](ModelHistory.md#list)
- [source](ModelHistory.md#source)
- [keep](ModelHistory.md#keep)
- [keepNow](ModelHistory.md#keepnow)
- [write](ModelHistory.md#write)
- [remove](ModelHistory.md#remove)
- [purge](ModelHistory.md#purge)
- [rename](ModelHistory.md#rename)

## Constructors

### constructor

• **new ModelHistory**(`folder`): [`ModelHistory`](ModelHistory.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `folder` | `string` |

#### Returns

[`ModelHistory`](ModelHistory.md)

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L32)

## Properties

### turns

▪ `Static` `Private` `Readonly` **turns**: `Map`\<`string`, `Promise`\<`unknown`\>\>

Saves of a model's history take turns in this process, by its folder: two saves at once are two versions.

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L30)

___

### folder

• `Private` `Readonly` **folder**: `string`

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L32)

## Methods

### dir

▸ **dir**(`name`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L34)

___

### files

▸ **files**(`name`): `Promise`\<\{ `version`: `number` ; `savedBy`: `string` ; `file`: `string`  }[]\>

The version files: [{ version, savedBy, file }], newest first.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<\{ `version`: `number` ; `savedBy`: `string` ; `file`: `string`  }[]\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:43](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L43)

___

### list

▸ **list**(`name`): `Promise`\<[`IModelVersion`](../interfaces/IModelVersion.md)[]\>

The model's versions, newest first.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<[`IModelVersion`](../interfaces/IModelVersion.md)[]\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L58)

___

### source

▸ **source**(`name`, `version`): `Promise`\<`string`\>

A version's model, or null when there is no such version.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `version` | `number` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:72](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L72)

___

### keep

▸ **keep**(`name`, `source`, `savedBy?`, `before?`): `Promise`\<[`IModelVersion`](../interfaces/IModelVersion.md)\>

Keeps a save: the next version, unless the model is the latest version already. `before` is the model's
file as it was before this save (kept first when the model has no history yet). Returns the version kept,
or null.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `source` | `string` |
| `savedBy?` | `string` |
| `before?` | `Object` |
| `before.source` | `string` |
| `before.savedAt` | `Date` |

#### Returns

`Promise`\<[`IModelVersion`](../interfaces/IModelVersion.md)\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:90](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L90)

___

### keepNow

▸ **keepNow**(`dir`, `name`, `source`, `savedBy?`, `before?`): `Promise`\<[`IModelVersion`](../interfaces/IModelVersion.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir` | `string` |
| `name` | `string` |
| `source` | `string` |
| `savedBy?` | `string` |
| `before?` | `Object` |
| `before.source` | `string` |
| `before.savedAt` | `Date` |

#### Returns

`Promise`\<[`IModelVersion`](../interfaces/IModelVersion.md)\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:104](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L104)

___

### write

▸ **write**(`dir`, `name`, `version`, `source`, `savedBy?`, `savedAt?`): `Promise`\<[`IModelVersion`](../interfaces/IModelVersion.md)\>

Writes a version's file; null when the number is taken (by a save in another process), to try the next.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir` | `string` |
| `name` | `string` |
| `version` | `number` |
| `source` | `string` |
| `savedBy?` | `string` |
| `savedAt?` | `Date` |

#### Returns

`Promise`\<[`IModelVersion`](../interfaces/IModelVersion.md)\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:124](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L124)

___

### remove

▸ **remove**(`name`, `version`): `Promise`\<`boolean`\>

Removes one version; false when there is no such version. It takes its turn with the saves, so a save and a
delete at once do not cross. The other versions keep their numbers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `version` | `number` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:147](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L147)

___

### purge

▸ **purge**(`name`): `Promise`\<`number`\>

Removes the model's history; returns how many versions it had.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<`number`\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:167](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L167)

___

### rename

▸ **rename**(`name`, `newName`): `Promise`\<`void`\>

The history follows the model to its new name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `newName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:174](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelHistory.ts#L174)
