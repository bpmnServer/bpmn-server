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

- [describe](Process.md#describe)
- [doEvent](Process.md#doevent)
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

[elements/Process.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-22)

## Properties

### childrenNodes

• **childrenNodes**: [`Node`](Node.md)[]

#### Defined in

[elements/Process.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-17)

___

### def

• **def**: [`Definition`](Definition.md)

#### Defined in

[elements/Process.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-15)

___

### eventSubProcesses

• **eventSubProcesses**: `any`[]

#### Defined in

[elements/Process.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-18)

___

### id

• **id**: `any`

#### Defined in

[elements/Process.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-12)

___

### isExecutable

• **isExecutable**: `any`

#### Defined in

[elements/Process.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-14)

___

### name

• **name**: `any`

#### Defined in

[elements/Process.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-13)

___

### parent

• **parent**: [`Process`](Process.md)

#### Defined in

[elements/Process.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-16)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Defined in

[elements/Process.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-20)

___

### subProcessEvents

• **subProcessEvents**: `any`[]

#### Defined in

[elements/Process.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-19)

## Methods

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Defined in

[elements/Process.ts:111](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-111)

___

### doEvent

▸ **doEvent**(`execution`, `event`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |
| `event` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/Process.ts:100](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-100)

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

[elements/Process.ts:57](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-57)

___

### getEventSubProcessStart

▸ **getEventSubProcessStart**(): [`Node`](Node.md)[]

#### Returns

[`Node`](Node.md)[]

#### Defined in

[elements/Process.ts:87](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-87)

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

[elements/Process.ts:67](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-67)

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

[elements/Process.ts:70](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-70)

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

[elements/Process.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-29)

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

[elements/Process.ts:36](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Process.ts#lines-36)
