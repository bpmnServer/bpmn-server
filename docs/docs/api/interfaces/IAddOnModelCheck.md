[bpmn-server](../readme.md) / IAddOnModelCheck

# Interface: IAddOnModelCheck

What a model check gives an add-on: where the models are, the roles, and a way to report.

## Table of contents

### Properties

- [folder](IAddOnModelCheck.md#folder)

### Methods

- [roles](IAddOnModelCheck.md#roles)
- [add](IAddOnModelCheck.md#add)
- [hasService](IAddOnModelCheck.md#hasservice)
- [connectorOperation](IAddOnModelCheck.md#connectoroperation)

## Properties

### folder

• **folder**: `string`

the models folder (decision files, policies), or null when the model is checked alone

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L23)

## Methods

### roles

▸ **roles**(): `string`[]

the roles (roles.json and the application's contract), or null when there are none

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L25)

___

### add

▸ **add**(`severity`, `code`, `message`, `element?`): `void`

an issue about this element (its process is the one being checked)

#### Parameters

| Name | Type |
| :------ | :------ |
| `severity` | [`ModelIssueSeverity`](../readme.md#modelissueseverity) |
| `code` | `string` |
| `message` | `string` |
| `element?` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L27)

___

### hasService

▸ **hasService**(`name`): `boolean`

whether the application has a service (`billing.charge`); undefined when its services can't be known here

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L29)

___

### connectorOperation

▸ **connectorOperation**(`ref`, `element`, `fails`): `Promise`\<`any`\>

a connector's operation (`connector/operationId`), the issues of one that isn't there reported; null then

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `string` |
| `element` | `any` |
| `fails` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L31)
