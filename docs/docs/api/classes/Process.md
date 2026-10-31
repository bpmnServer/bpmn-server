[bpmn-server](../readme.md) / Process

# Class: Process

## Table of contents

### Constructors

- [constructor](Process.md#constructor)

### Properties

- [id](Process.md#id)
- [name](Process.md#name)
- [isExecutable](Process.md#isexecutable)
- [def](Process.md#def)
- [parent](Process.md#parent)
- [childrenNodes](Process.md#childrennodes)
- [eventSubProcesses](Process.md#eventsubprocesses)
- [subProcessEvents](Process.md#subprocessevents)
- [scripts](Process.md#scripts)

### Methods

- [init](Process.md#init)
- [start](Process.md#start)
- [end](Process.md#end)
- [getStartNode](Process.md#getstartnode)
- [getStartNodes](Process.md#getstartnodes)
- [getEventSubProcessStart](Process.md#geteventsubprocessstart)
- [doEvent](Process.md#doevent)
- [describe](Process.md#describe)

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

[elements/Process.ts:23](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L23)

## Properties

### id

• **id**: `any`

#### Defined in

[elements/Process.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L13)

___

### name

• **name**: `any`

#### Defined in

[elements/Process.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L14)

___

### isExecutable

• **isExecutable**: `any`

#### Defined in

[elements/Process.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L15)

___

### def

• **def**: [`Definition`](Definition.md)

#### Defined in

[elements/Process.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L16)

___

### parent

• **parent**: [`Process`](Process.md)

#### Defined in

[elements/Process.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L17)

___

### childrenNodes

• **childrenNodes**: [`Node`](Node.md)[]

#### Defined in

[elements/Process.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L18)

___

### eventSubProcesses

• **eventSubProcesses**: `any`[]

#### Defined in

[elements/Process.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L19)

___

### subProcessEvents

• **subProcessEvents**: `any`[]

#### Defined in

[elements/Process.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L20)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Defined in

[elements/Process.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L21)

## Methods

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

[elements/Process.ts:30](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L30)

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

[elements/Process.ts:37](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L37)

___

### end

▸ **end**(`execution`): `Promise`\<`void`\>

Notify process that it ended

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](../interfaces/IExecution.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/Process.ts:60](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L60)

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

[elements/Process.ts:81](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L81)

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

[elements/Process.ts:84](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L84)

___

### getEventSubProcessStart

▸ **getEventSubProcessStart**(): [`Node`](Node.md)[]

#### Returns

[`Node`](Node.md)[]

#### Defined in

[elements/Process.ts:101](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L101)

___

### doEvent

▸ **doEvent**(`execution`, `event`, `eventDetails?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |
| `event` | `any` |
| `eventDetails` | `Object` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/Process.ts:114](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L114)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Defined in

[elements/Process.ts:126](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Process.ts#L126)
