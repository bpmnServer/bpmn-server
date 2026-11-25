[bpmn-server](../readme.md) / IContext

# Interface: IContext

## Indexable

▪ [more: `string`]: `any`

## Table of contents

### Properties

- [source](IContext.md#source)
- [user](IContext.md#user)
- [instance](IContext.md#instance)
- [element](IContext.md#element)
- [item](IContext.md#item)
- [data](IContext.md#data)
- [input](IContext.md#input)
- [event](IContext.md#event)
- [details](IContext.md#details)
- [decision](IContext.md#decision)
- [query](IContext.md#query)
- [field](IContext.md#field)
- [conditions](IContext.md#conditions)
- [action](IContext.md#action)
- [appVars](IContext.md#appvars)
- [appServices](IContext.md#appservices)

## Properties

### source

• **source**: [`IContextSource`](IContextSource.md)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L37)

___

### user

• `Optional` **user**: [`ISecureUser`](ISecureUser.md) \| \{ `userName`: `string` ; `userGroups?`: `string`[]  }

who acts: the user object (its userName, userGroups)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:39](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L39)

___

### instance

• `Optional` **instance**: `any`

the case; its actors are instance.actors

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L41)

___

### element

• `Optional` **element**: `any`

the model's element

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:43](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L43)

___

### item

• `Optional` **item**: `any`

the item of this call: fixed for it

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L45)

___

### data

• `Optional` **data**: `any`

the item's data (its scope of the instance's), else the instance's

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:47](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L47)

___

### input

• `Optional` **input**: `any`

what is passed in: a service's input, a message's, a form's values

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:49](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L49)

___

### event

• `Optional` **event**: `string`

an event's name and details (a listener's context)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:51](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L51)

___

### details

• `Optional` **details**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:52](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L52)

___

### decision

• `Optional` **decision**: `string`

kind dmn: the decision; kind query: the query, which a listener narrows; kind form: the field

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:54](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L54)

___

### query

• `Optional` **query**: `Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:55](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L55)

___

### field

• `Optional` **field**: `string`

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:56](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L56)

___

### conditions

• `Optional` **conditions**: `Record`\<`string`, `any`\>[]

kind query, pre-action: the conditions listeners added (ANDed), the action

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:58](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L58)

___

### action

• `Optional` **action**: `string`

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:59](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L59)

___

### appVars

• `Optional` **appVars**: `any`

the application's terms and functions

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:61](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L61)

___

### appServices

• `Optional` **appServices**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:62](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L62)
