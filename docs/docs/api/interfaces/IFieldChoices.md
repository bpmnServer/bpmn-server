[bpmn-server](../readme.md) / IFieldChoices

# Interface: IFieldChoices

A form field's choices, asked as the form is filled (a list, a lookup): an add-on's; null when the field has none it knows.

## Table of contents

### Properties

- [name](IFieldChoices.md#name)

### Methods

- [choices](IFieldChoices.md#choices)

## Properties

### name

• **name**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:133](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L133)

## Methods

### choices

▸ **choices**(`server`, `field`, `criteria`, `context`): `any`[] \| `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `field` | `any` |
| `criteria` | `Record`\<`string`, `any`\> |
| `context` | `Record`\<`string`, `any`\> |

#### Returns

`any`[] \| `Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:134](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L134)
