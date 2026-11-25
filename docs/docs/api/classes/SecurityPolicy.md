[bpmn-server](../readme.md) / SecurityPolicy

# Class: SecurityPolicy

The security policies of one models folder.

## Table of contents

### Constructors

- [constructor](SecurityPolicy.md#constructor)

### Properties

- [models](SecurityPolicy.md#models)
- [definitionsPath](SecurityPolicy.md#definitionspath)
- [appDelegate](SecurityPolicy.md#appdelegate)

### Accessors

- [on](SecurityPolicy.md#on)

### Methods

- [file](SecurityPolicy.md#file)
- [seeQuery](SecurityPolicy.md#seequery)
- [names](SecurityPolicy.md#names)
- [model](SecurityPolicy.md#model)
- [itemOf](SecurityPolicy.md#itemof)
- [actorsOf](SecurityPolicy.md#actorsof)
- [decide](SecurityPolicy.md#decide)
- [data](SecurityPolicy.md#data)
- [visibleData](SecurityPolicy.md#visibledata)
- [combine](SecurityPolicy.md#combine)
- [context](SecurityPolicy.md#context)
- [whoMay](SecurityPolicy.md#whomay)
- [ask](SecurityPolicy.md#ask)
- [builtInDefault](SecurityPolicy.md#builtindefault)

## Constructors

### constructor

• **new SecurityPolicy**(`definitionsPath`, `appDelegate?`): [`SecurityPolicy`](SecurityPolicy.md)

`appDelegate`: the application's, for its decisionContext hook (engine/DecisionContext.ts)

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitionsPath` | `string` |
| `appDelegate?` | `any` |

#### Returns

[`SecurityPolicy`](SecurityPolicy.md)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:94](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L94)

## Properties

### models

▪ `Static` `Private` **models**: `Map`\<`string`, \{ `stamp`: `string` ; `model`: [`IModelSecurity`](../interfaces/IModelSecurity.md)  }\>

models' security facts, by file, while the file is as it was (shared by every instance)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:91](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L91)

___

### definitionsPath

• `Readonly` **definitionsPath**: `string`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:94](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L94)

___

### appDelegate

• `Optional` `Readonly` **appDelegate**: `any`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:94](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L94)

## Accessors

### on

• `get` **on**(): `boolean`

Whether this folder's cases are decided by security policies.

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:97](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L97)

## Methods

### file

▸ **file**(`name`): `string`

A policy's file, or null when it isn't there.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:104](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L104)

___

### seeQuery

▸ **seeQuery**(`user`, `modelNames`): `Promise`\<`object`\>

The store's condition for the cases this user may see (SecurityQuery.ts): a superset, so a list reads fewer
cases before asking the policy for each; null when any case may be seen (no narrowing). `modelNames`: the
models whose own policy narrows its cases; any other case goes by the default's.

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`ISecurityUser`](../interfaces/ISecurityUser.md) |
| `modelNames` | `string`[] |

#### Returns

`Promise`\<`object`\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:115](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L115)

___

### names

▸ **names**(): `string`[]

The folder's policies, by name.

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:134](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L134)

___

### model

▸ **model**(`modelName`): [`IModelSecurity`](../interfaces/IModelSecurity.md)

A model's security facts, from its file.

#### Parameters

| Name | Type |
| :------ | :------ |
| `modelName` | `string` |

#### Returns

[`IModelSecurity`](../interfaces/IModelSecurity.md)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:141](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L141)

___

### itemOf

▸ **itemOf**(`instance`, `task?`): `any`

The task's item: by its id, else the element's waiting one, else its latest.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |
| `task?` | [`ISecurityTask`](../interfaces/ISecurityTask.md) |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:174](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L174)

___

### actorsOf

▸ **actorsOf**(`instance`, `task?`): `Record`\<`string`, [`Actor`](../readme.md#actor)\>

An instance's actors (engine/DecisionContext.ts), from its items and its model's owf:actor; for a task, those of
its item's branch.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |
| `task?` | [`ISecurityTask`](../interfaces/ISecurityTask.md) |

#### Returns

`Record`\<`string`, [`Actor`](../readme.md#actor)\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:186](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L186)

___

### decide

▸ **decide**(`user`, `instance`, `task?`, `errors?`): `Promise`\<[`IAccess`](../interfaces/IAccess.md)\>

What a person may do with a case (and, with `task`, one of its tasks): every rule of the policies that apply (the
process's, else the application's default, else the built-in one; and the task's own), combined. A policy that
can't be read decides nothing (its error is in `errors`), so what it would have allowed stays refused.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `user` | [`ISecurityUser`](../interfaces/ISecurityUser.md) | `undefined` |
| `instance` | `any` | `undefined` |
| `task?` | [`ISecurityTask`](../interfaces/ISecurityTask.md) | `undefined` |
| `errors` | `string`[] | `[]` |

#### Returns

`Promise`\<[`IAccess`](../interfaces/IAccess.md)\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:196](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L196)

___

### data

▸ **data**(`instance`, `access`, `taskElementId?`): `Record`\<`string`, `any`\>

A case's data as the access lets a person read it; for a task, its own form's fields too.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |
| `access` | [`IAccess`](../interfaces/IAccess.md) |
| `taskElementId?` | `string` |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:219](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L219)

___

### visibleData

▸ **visibleData**(`data`, `access`, `formFields?`, `ownFields?`): `Record`\<`string`, `any`\>

These data as the access lets a person read them: what forms entered, these paths, and `ownFields` always.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Record`\<`string`, `any`\> |
| `access` | [`IAccess`](../interfaces/IAccess.md) |
| `formFields` | `Set`\<`string`\> |
| `ownFields` | `Set`\<`string`\> |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:226](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L226)

___

### combine

▸ **combine**(`rules`): [`IAccess`](../interfaces/IAccess.md)

The matching rules' answers, combined: any deny wins; else what is allowed; else each action's default.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rules` | [`IPolicyRule`](../interfaces/IPolicyRule.md)[] |

#### Returns

[`IAccess`](../interfaces/IAccess.md)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:250](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L250)

___

### context

▸ **context**(`user`, `instance`, `task?`): `Promise`\<`Record`\<`string`, `any`\>\>

What the policies' tables read: the names every expression reads (engine/DecisionContext.ts): the user, the
actors, the task, the data (the instance's; a task's, its item's in its scope), the application's facts.

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`ISecurityUser`](../interfaces/ISecurityUser.md) |
| `instance` | `any` |
| `task?` | [`ISecurityTask`](../interfaces/ISecurityTask.md) |

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:278](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L278)

___

### whoMay

▸ **whoMay**(`instance`, `«destructured»?`): `Promise`\<[`IWhoMay`](../interfaces/IWhoMay.md)[]\>

The reverse of a policy, for one case: who may do what with it. Asked forward for everyone who could make a
difference: the people the case names (who started it, a task's assignee or candidates, who completed a step;
with `users`, everyone in the directory, with their groups), each role as a member with no relation to the case
(`roles`, and the groups its waiting tasks are offered to), and anyone else. Administrators (`admins`) are not
asked: they may do everything. For each, the case (see, data, restart, events) and each waiting user task: whether
they may claim, complete and assign it, the assignment's offer and the policy's allow or deny combined.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `instance` | `any` | `undefined` |
| `«destructured»` | `Object` | `{}` |
| › `users?` | [`ISecurityUser`](../interfaces/ISecurityUser.md)[] | `[]` |
| › `roles?` | `string`[] | `[]` |
| › `admins?` | `string`[] | `[]` |

#### Returns

`Promise`\<[`IWhoMay`](../interfaces/IWhoMay.md)[]\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:295](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L295)

___

### ask

▸ **ask**(`file`, `context`): `Promise`\<\{ `rule`: `number` ; `outputs`: `Record`\<`string`, `any`\>  }[]\>

One policy's matching rules, for this context.

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |
| `context` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<\{ `rule`: `number` ; `outputs`: `Record`\<`string`, `any`\>  }[]\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:359](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L359)

___

### builtInDefault

▸ **builtInDefault**(`user`, `instance`, `actors`): \{ `rule`: `number` ; `outputs`: `Record`\<`string`, `any`\>  }[]

The built-in default, for a folder without `default.dmn.xml` (the Fable Review's H2): designers see every case
and its data; the assignee and candidates of a task see the case as a line, and what forms entered; who started
it or completed a step of it, as a line.

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`ISecurityUser`](../interfaces/ISecurityUser.md) |
| `instance` | `any` |
| `actors` | `Record`\<`string`, [`Actor`](../readme.md#actor)\> |

#### Returns

\{ `rule`: `number` ; `outputs`: `Record`\<`string`, `any`\>  }[]

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:371](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L371)
