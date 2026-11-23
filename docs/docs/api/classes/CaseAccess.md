[bpmn-server](../readme.md) / CaseAccess

# Class: CaseAccess

## Table of contents

### Constructors

- [constructor](CaseAccess.md#constructor)

### Properties

- [\_policy](CaseAccess.md#_policy)
- [server](CaseAccess.md#server)

### Accessors

- [policy](CaseAccess.md#policy)
- [on](CaseAccess.md#on)

### Methods

- [decide](CaseAccess.md#decide)
- [seeQuery](CaseAccess.md#seequery)
- [seen](CaseAccess.md#seen)
- [decideAll](CaseAccess.md#decideall)
- [casesOf](CaseAccess.md#casesof)
- [tasksAllowed](CaseAccess.md#tasksallowed)
- [data](CaseAccess.md#data)
- [requireAssignment](CaseAccess.md#requireassignment)
- [instanceAccess](CaseAccess.md#instanceaccess)
- [require](CaseAccess.md#require)

## Constructors

### constructor

• **new CaseAccess**(`server`): [`CaseAccess`](CaseAccess.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`CaseAccess`](CaseAccess.md)

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L33)

## Properties

### \_policy

• `Private` **\_policy**: [`SecurityPolicy`](SecurityPolicy.md)

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L32)

___

### server

• `Readonly` **server**: `any`

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L33)

## Accessors

### policy

• `get` **policy**(): [`SecurityPolicy`](SecurityPolicy.md)

The models folder's policies.

#### Returns

[`SecurityPolicy`](SecurityPolicy.md)

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:35](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L35)

___

### on

• `get` **on**(): `boolean`

Whether security policies decide here.

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L42)

## Methods

### decide

▸ **decide**(`user`, `instance`, `task?`): `Promise`\<[`IAccess`](../interfaces/IAccess.md)\>

What this user may do with the case, or with one of its tasks (`task.elementId`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `SecureUser` |
| `instance` | `any` |
| `task?` | `Object` |
| `task.elementId` | `string` |
| `task.itemId?` | `string` |

#### Returns

`Promise`\<[`IAccess`](../interfaces/IAccess.md)\>

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L45)

___

### seeQuery

▸ **seeQuery**(`user`): `Promise`\<`object`\>

The store's condition for the cases this user may see, from the policies (SecurityPolicy.seeQuery): a superset,
so a list reads fewer cases before asking the policy for each; null when off, or any case may be seen.

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `SecureUser` |

#### Returns

`Promise`\<`object`\>

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:57](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L57)

___

### seen

▸ **seen**\<`T`\>(`user`, `instances`): `Promise`\<`T`[]\>

The cases this user sees (`see` not none), as they were given: decided several at once (decideAll).

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `SecureUser` |
| `instances` | `T`[] |

#### Returns

`Promise`\<`T`[]\>

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:67](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L67)

___

### decideAll

▸ **decideAll**(`user`, `entries`): `Promise`\<[`IAccess`](../interfaces/IAccess.md)[]\>

Each case (and task) decided, DECIDE_AT_ONCE at a time, in their order: a list's page asks them together, so an
application's decisionContext hook that waits (it asks another system) waits for several at once
(docs/docs/performance.md#security-policies).

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `SecureUser` |
| `entries` | \{ `instance`: `any` ; `task?`: \{ `elementId`: `string` ; `itemId?`: `string`  }  }[] |

#### Returns

`Promise`\<[`IAccess`](../interfaces/IAccess.md)[]\>

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:78](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L78)

___

### casesOf

▸ **casesOf**(`items`): `Promise`\<`Map`\<`string`, `any`\>\>

The cases of these tasks, by id: what a policy decides on (their items, data and model).

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | `any`[] |

#### Returns

`Promise`\<`Map`\<`string`, `any`\>\>

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:86](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L86)

___

### tasksAllowed

▸ **tasksAllowed**\<`T`\>(`user`, `items`): `Promise`\<`T`[]\>

The waiting tasks this user may complete, as their cases' policies say (a task they are refused is left out).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `SecureUser` |
| `items` | `T`[] |

#### Returns

`Promise`\<`T`[]\>

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:94](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L94)

___

### data

▸ **data**(`instance`, `access`, `taskElementId?`): `Record`\<`string`, `any`\>

A case's data as this access lets them read it; for a task, its own form's fields too.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |
| `access` | [`IAccess`](../interfaces/IAccess.md) |
| `taskElementId?` | `string` |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:102](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L102)

___

### requireAssignment

▸ **requireAssignment**(`user`, `query`, `assignment?`): `Promise`\<`void`\>

Assigning the tasks a query finds (`assignment`: their assignee, candidates, dates): a person taking a task as
its assignee and nothing else is claiming it; any other change of who works on it is `assign`. Throws
PolicyDenied when a case's policy refuses it; without a rule, today's rule holds (the engine's: a part in it).

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `SecureUser` |
| `query` | `any` |
| `assignment` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:111](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L111)

___

### instanceAccess

▸ **instanceAccess**(`instance`, `directory?`): `Promise`\<\{ `on`: `boolean` = true; `cases`: \{ `who`: [`IWho`](../interfaces/IWho.md) = a.who; `see`: ``"none"`` \| ``"summary"`` \| ``"full"`` = a.access.see; `data`: `string` ; `restart`: `boolean` = a.access.restart; `events`: `boolean` = a.access.events; `rules`: `string`  }[] ; `tasks`: \{ `seq`: `any` = item.seq; `elementId`: `any` = item.elementId; `name`: `any` = item.name; `status`: `any` = item.status; `said`: \{ `whom`: `string` ; `by`: `string` ; `notes`: `string`[]  } ; `assignee`: `any` ; `candidateUsers`: `string`[] ; `candidateGroups`: `string`[] ; `decidedBy`: `string` ; `history`: \{ `action`: `any` = l.action; `why`: `string`  }[] ; `completedBy`: `any` ; `who`: `any`[]  }[]  }\>

The instance page's Assignment and access, and API v3's GET /instances/{id}/access: for each of its user tasks,
after the fact, who it was offered to, its assignee, what decided it (a policy's rule, or who reassigned it),
its assignment as the log tells it (offered, claimed, reassigned) and who completed it; and, while security
policies are on, the reverse of the case's policy (SecurityPolicy.whoMay): who may see the case, its data, and
who may claim, complete and assign each waiting task. `directory`: the people and roles to ask about.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |
| `directory` | `Object` |
| `directory.users?` | \{ `userName`: `string` ; `userGroups?`: `string`[]  }[] |
| `directory.roles?` | `string`[] |
| `directory.admins?` | `string`[] |

#### Returns

`Promise`\<\{ `on`: `boolean` = true; `cases`: \{ `who`: [`IWho`](../interfaces/IWho.md) = a.who; `see`: ``"none"`` \| ``"summary"`` \| ``"full"`` = a.access.see; `data`: `string` ; `restart`: `boolean` = a.access.restart; `events`: `boolean` = a.access.events; `rules`: `string`  }[] ; `tasks`: \{ `seq`: `any` = item.seq; `elementId`: `any` = item.elementId; `name`: `any` = item.name; `status`: `any` = item.status; `said`: \{ `whom`: `string` ; `by`: `string` ; `notes`: `string`[]  } ; `assignee`: `any` ; `candidateUsers`: `string`[] ; `candidateGroups`: `string`[] ; `decidedBy`: `string` ; `history`: \{ `action`: `any` = l.action; `why`: `string`  }[] ; `completedBy`: `any` ; `who`: `any`[]  }[]  }\>

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:129](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L129)

___

### require

▸ **require**(`access`, `action`, `byDefault?`): `void`

Throws PolicyDenied unless the action is allowed; `byDefault`: what it is without a rule (claim, complete, assign).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `access` | [`IAccess`](../interfaces/IAccess.md) | `undefined` |
| `action` | ``"restart"`` \| ``"assign"`` \| ``"claim"`` \| ``"complete"`` \| ``"events"`` | `undefined` |
| `byDefault` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:176](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L176)
