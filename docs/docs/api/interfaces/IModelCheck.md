[bpmn-server](../readme.md) / IModelCheck

# Interface: IModelCheck

A model check an add-on registers: of each element, of each process, and the decision files the model uses through it.

## Table of contents

### Properties

- [name](IModelCheck.md#name)

### Methods

- [verifyNode](IModelCheck.md#verifynode)
- [verifyProcess](IModelCheck.md#verifyprocess)
- [decisionFiles](IModelCheck.md#decisionfiles)
- [verifyModel](IModelCheck.md#verifymodel)

## Properties

### name

• **name**: `string`

whose, for a check that fails

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:76](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L76)

## Methods

### verifyNode

▸ **verifyNode**(`check`, `node`, `def`): `void` \| `Promise`\<`void`\>

Checks of a process's element (`node` the engine's, `def` its model element) when a model is verified.

#### Parameters

| Name | Type |
| :------ | :------ |
| `check` | [`IAddOnModelCheck`](IAddOnModelCheck.md) |
| `node` | `any` |
| `def` | `any` |

#### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:78](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L78)

___

### verifyProcess

▸ **verifyProcess**(`check`, `proc`, `def`): `void` \| `Promise`\<`void`\>

Checks of a process (`proc` the engine's, `def` its model element).

#### Parameters

| Name | Type |
| :------ | :------ |
| `check` | [`IAddOnModelCheck`](IAddOnModelCheck.md) |
| `proc` | `any` |
| `def` | `any` |

#### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:80](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L80)

___

### decisionFiles

▸ **decisionFiles**(`definition`, `folder`): [`IAddOnDecisionFile`](IAddOnDecisionFile.md)[] \| `Promise`\<[`IAddOnDecisionFile`](IAddOnDecisionFile.md)[]\>

The decision files a model uses through it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | `any` |
| `folder` | `string` |

#### Returns

[`IAddOnDecisionFile`](IAddOnDecisionFile.md)[] \| `Promise`\<[`IAddOnDecisionFile`](IAddOnDecisionFile.md)[]\>

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:82](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L82)

___

### verifyModel

▸ **verifyModel**(`check`, `model`): `void` \| `Promise`\<`void`\>

Checks of the whole model, once: its source, its definition, and the decision files it uses (its business rule
tasks' and the add-ons'), each with its text, those whose actors are read.

#### Parameters

| Name | Type |
| :------ | :------ |
| `check` | [`IAddOnModelCheck`](IAddOnModelCheck.md) |
| `model` | `Object` |
| `model.source` | `string` |
| `model.definition` | `any` |
| `model.decisions` | \{ `what`: `string` ; `text`: `string`  }[] |

#### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:87](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L87)
