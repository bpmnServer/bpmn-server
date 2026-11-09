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
- [candidateStarterGroups](Process.md#candidatestartergroups)
- [candidateStarterUsers](Process.md#candidatestarterusers)
- [historyTimeToLive](Process.md#historytimetolive)
- [isStartableInTasklist](Process.md#isstartableintasklist)

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

[packages/bpmn-server/src/elements/Process.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L26)

## Properties

### id

• **id**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L12)

___

### name

• **name**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L13)

___

### isExecutable

• **isExecutable**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L14)

___

### def

• **def**: [`Definition`](Definition.md)

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L15)

___

### parent

• **parent**: [`Process`](Process.md)

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L16)

___

### childrenNodes

• **childrenNodes**: [`Node`](Node.md)[]

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L17)

___

### eventSubProcesses

• **eventSubProcesses**: `any`[]

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L18)

___

### subProcessEvents

• **subProcessEvents**: `any`[]

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L19)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L20)

___

### candidateStarterGroups

• **candidateStarterGroups**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L21)

___

### candidateStarterUsers

• **candidateStarterUsers**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L22)

___

### historyTimeToLive

• **historyTimeToLive**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L23)

___

### isStartableInTasklist

• **isStartableInTasklist**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L24)

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

[packages/bpmn-server/src/elements/Process.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L38)

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

[packages/bpmn-server/src/elements/Process.ts:45](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L45)

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

[packages/bpmn-server/src/elements/Process.ts:68](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L68)

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

[packages/bpmn-server/src/elements/Process.ts:89](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L89)

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

[packages/bpmn-server/src/elements/Process.ts:92](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L92)

___

### getEventSubProcessStart

▸ **getEventSubProcessStart**(): [`Node`](Node.md)[]

#### Returns

[`Node`](Node.md)[]

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:109](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L109)

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

[packages/bpmn-server/src/elements/Process.ts:122](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L122)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/elements/Process.ts:134](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Process.ts#L134)
