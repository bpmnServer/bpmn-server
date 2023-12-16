[bpmn-server](../README.md) / Process

# Class: Process

## Table of contents

### Constructors

- [constructor](Process.md#constructor)

### Properties

- [childrenNodes](Process.md#childrennodes)
- [def](Process.md#def)
- [eventSubProcesses](Process.md#eventsubprocesses)
- [id](Process.md#id)
- [isExecutable](Process.md#isexecutable)
- [name](Process.md#name)
- [parent](Process.md#parent)
- [scripts](Process.md#scripts)
- [subProcessEvents](Process.md#subprocessevents)

### Methods

- [end](Process.md#end)
- [getEventSubProcessStart](Process.md#geteventsubprocessstart)
- [getStartNode](Process.md#getstartnode)
- [getStartNodes](Process.md#getstartnodes)
- [init](Process.md#init)
- [start](Process.md#start)

## Constructors

### constructor

• **new Process**(`definition`, `parent?`): [`Process`](Process.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `definition` | `any` | `undefined` |
| `parent` | `any` | `null` |

#### Returns

[`Process`](Process.md)

#### Defined in

[elements/Process.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L22)

## Properties

### childrenNodes

• **childrenNodes**: [`Node`](Node.md)[]

#### Defined in

[elements/Process.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L17)

___

### def

• **def**: [`Definition`](Definition.md)

#### Defined in

[elements/Process.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L15)

___

### eventSubProcesses

• **eventSubProcesses**: `any`[]

#### Defined in

[elements/Process.ts:18](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L18)

___

### id

• **id**: `any`

#### Defined in

[elements/Process.ts:12](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L12)

___

### isExecutable

• **isExecutable**: `any`

#### Defined in

[elements/Process.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L14)

___

### name

• **name**: `any`

#### Defined in

[elements/Process.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L13)

___

### parent

• **parent**: [`Process`](Process.md)

#### Defined in

[elements/Process.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L16)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Defined in

[elements/Process.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L20)

___

### subProcessEvents

• **subProcessEvents**: `any`[]

#### Defined in

[elements/Process.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L19)

## Methods

### end

▸ **end**(): `Promise`\<`void`\>

Notify process that it ended

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/Process.ts:55](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L55)

___

### getEventSubProcessStart

▸ **getEventSubProcessStart**(): [`Node`](Node.md)[]

#### Returns

[`Node`](Node.md)[]

#### Defined in

[elements/Process.ts:84](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L84)

___

### getStartNode

▸ **getStartNode**(`userInvokable?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `userInvokable` | `boolean` | `false` |

#### Returns

`any`

#### Defined in

[elements/Process.ts:64](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L64)

___

### getStartNodes

▸ **getStartNodes**(`userInvokable?`): `any`[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `userInvokable` | `boolean` | `false` |

#### Returns

`any`[]

#### Defined in

[elements/Process.ts:67](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L67)

___

### init

▸ **init**(`children`, `eventSubProcesses`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `children` | `any` |
| `eventSubProcesses` | `any` |

#### Returns

`void`

#### Defined in

[elements/Process.ts:29](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L29)

___

### start

▸ **start**(`execution`, `parentToken`): `Promise`\<`void`\>

Notify process that it started

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`Execution`](Execution.md) |
| `parentToken` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/Process.ts:36](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Process.ts#L36)
