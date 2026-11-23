[bpmn-server](../readme.md) / Registrations

# Class: Registrations

What the add-ons registered where the engine has no event: the engine runs them, and knows no add-on. One for each
server (`server.registrations`), filled as its add-ons are registered.

## Table of contents

### Constructors

- [constructor](Registrations.md#constructor)

### Properties

- [modelChecks](Registrations.md#modelchecks)
- [decisionLookups](Registrations.md#decisionlookups)
- [queryFilters](Registrations.md#queryfilters)
- [expressionNames](Registrations.md#expressionnames)
- [fieldRules](Registrations.md#fieldrules)
- [fieldChoices](Registrations.md#fieldchoices)
- [instanceReaders](Registrations.md#instancereaders)
- [apiListeners](Registrations.md#apilisteners)

### Methods

- [addInstanceReader](Registrations.md#addinstancereader)
- [addFieldRule](Registrations.md#addfieldrule)
- [addFieldChoices](Registrations.md#addfieldchoices)
- [addExpressionName](Registrations.md#addexpressionname)
- [addModelCheck](Registrations.md#addmodelcheck)
- [addQueryFilter](Registrations.md#addqueryfilter)
- [addDecisionLookup](Registrations.md#adddecisionlookup)
- [addApiListener](Registrations.md#addapilistener)

## Constructors

### constructor

• **new Registrations**(): [`Registrations`](Registrations.md)

#### Returns

[`Registrations`](Registrations.md)

## Properties

### modelChecks

• `Readonly` **modelChecks**: [`IModelCheck`](../interfaces/IModelCheck.md)[] = `[]`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:145](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L145)

___

### decisionLookups

• `Readonly` **decisionLookups**: [`DecisionLookup`](../readme.md#decisionlookup)[] = `[]`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:146](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L146)

___

### queryFilters

• `Readonly` **queryFilters**: [`IQueryFilter`](../interfaces/IQueryFilter.md)[] = `[]`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:147](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L147)

___

### expressionNames

• `Readonly` **expressionNames**: [`IExpressionName`](../interfaces/IExpressionName.md)[] = `[]`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:148](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L148)

___

### fieldRules

• `Readonly` **fieldRules**: [`IFieldRule`](../interfaces/IFieldRule.md)[] = `[]`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:149](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L149)

___

### fieldChoices

• `Readonly` **fieldChoices**: [`IFieldChoices`](../interfaces/IFieldChoices.md)[] = `[]`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:150](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L150)

___

### instanceReaders

• `Readonly` **instanceReaders**: (`instance`: `any`) => `void`[] = `[]`

What fills in an instance as it is read (the Policies add-on: `actors`, for a case saved before 3.7.5).

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:152](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L152)

___

### apiListeners

• `Readonly` **apiListeners**: `Map`\<`string`, (`context`: `any`) => `any`[]\>

The API's events' listeners of add-ons registered apart (a launched server): `pre-query`, `pre-action`.

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:161](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L161)

## Methods

### addInstanceReader

▸ **addInstanceReader**(`reader`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `reader` | (`instance`: `any`) => `void` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:153](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L153)

___

### addFieldRule

▸ **addFieldRule**(`rule`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rule` | [`IFieldRule`](../interfaces/IFieldRule.md) |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:154](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L154)

___

### addFieldChoices

▸ **addFieldChoices**(`choices`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `choices` | [`IFieldChoices`](../interfaces/IFieldChoices.md) |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:155](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L155)

___

### addExpressionName

▸ **addExpressionName**(`name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | [`IExpressionName`](../interfaces/IExpressionName.md) |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:156](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L156)

___

### addModelCheck

▸ **addModelCheck**(`check`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `check` | [`IModelCheck`](../interfaces/IModelCheck.md) |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:157](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L157)

___

### addQueryFilter

▸ **addQueryFilter**(`filter`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter` | [`IQueryFilter`](../interfaces/IQueryFilter.md) |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:158](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L158)

___

### addDecisionLookup

▸ **addDecisionLookup**(`lookup`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lookup` | [`DecisionLookup`](../readme.md#decisionlookup) |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:159](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L159)

___

### addApiListener

▸ **addApiListener**(`event`, `listener`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | (`context`: `any`) => `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:162](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L162)
