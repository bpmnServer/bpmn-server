[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Process](../modules/elements_Process.md) / Process

# Class: Process

[elements/Process](../modules/elements_Process.md).Process

## Table of contents

### Constructors

- [constructor](elements_Process.Process.md#constructor)

### Properties

- [childrenNodes](elements_Process.Process.md#childrennodes)
- [def](elements_Process.Process.md#def)
- [eventSubProcesses](elements_Process.Process.md#eventsubprocesses)
- [id](elements_Process.Process.md#id)
- [isExecutable](elements_Process.Process.md#isexecutable)
- [name](elements_Process.Process.md#name)
- [parent](elements_Process.Process.md#parent)
- [scripts](elements_Process.Process.md#scripts)
- [subProcessEvents](elements_Process.Process.md#subprocessevents)

### Methods

- [describe](elements_Process.Process.md#describe)
- [doEvent](elements_Process.Process.md#doevent)
- [end](elements_Process.Process.md#end)
- [getEventSubProcessStart](elements_Process.Process.md#geteventsubprocessstart)
- [getStartNode](elements_Process.Process.md#getstartnode)
- [getStartNodes](elements_Process.Process.md#getstartnodes)
- [init](elements_Process.Process.md#init)
- [start](elements_Process.Process.md#start)

## Constructors

### constructor

• **new Process**(`definition`, `parent?`): [`Process`](elements_Process.Process.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `definition` | `any` | `undefined` |
| `parent` | `any` | `null` |

#### Returns

[`Process`](elements_Process.Process.md)

#### Defined in

[src/elements/Process.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L22)

## Properties

### childrenNodes

• **childrenNodes**: [`Node`](elements_Node.Node.md)[]

#### Defined in

[src/elements/Process.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L17)

___

### def

• **def**: [`Definition`](elements_Definition.Definition.md)

#### Defined in

[src/elements/Process.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L15)

___

### eventSubProcesses

• **eventSubProcesses**: `any`[]

#### Defined in

[src/elements/Process.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L18)

___

### id

• **id**: `any`

#### Defined in

[src/elements/Process.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L12)

___

### isExecutable

• **isExecutable**: `any`

#### Defined in

[src/elements/Process.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L14)

___

### name

• **name**: `any`

#### Defined in

[src/elements/Process.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L13)

___

### parent

• **parent**: [`Process`](elements_Process.Process.md)

#### Defined in

[src/elements/Process.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L16)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Defined in

[src/elements/Process.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L20)

___

### subProcessEvents

• **subProcessEvents**: `any`[]

#### Defined in

[src/elements/Process.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L19)

## Methods

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Defined in

[src/elements/Process.ts:111](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L111)

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

[src/elements/Process.ts:100](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L100)

___

### end

▸ **end**(`execution`): `Promise`\<`void`\>

Notify process that it ended

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](../interfaces/interfaces_engine.IExecution.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/elements/Process.ts:57](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L57)

___

### getEventSubProcessStart

▸ **getEventSubProcessStart**(): [`Node`](elements_Node.Node.md)[]

#### Returns

[`Node`](elements_Node.Node.md)[]

#### Defined in

[src/elements/Process.ts:87](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L87)

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

[src/elements/Process.ts:67](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L67)

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

[src/elements/Process.ts:70](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L70)

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

[src/elements/Process.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L29)

___

### start

▸ **start**(`execution`, `parentToken`): `Promise`\<`void`\>

Notify process that it started

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`Execution`](engine_Execution.Execution.md) |
| `parentToken` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/elements/Process.ts:36](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Process.ts#L36)
