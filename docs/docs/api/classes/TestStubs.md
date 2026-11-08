[bpmn-server](../readme.md) / TestStubs

# Class: TestStubs

The stubs of the tests running in this engine, by the instances they started and those instances' called processes.
Only a test running in here adds to them: no engine call, start option or instance flag reaches them, for a stub is code.

## Table of contents

### Constructors

- [constructor](TestStubs.md#constructor)

### Properties

- [#byInstance](TestStubs.md##byinstance)
- [server](TestStubs.md#server)

### Methods

- [add](TestStubs.md#add)
- [remove](TestStubs.md#remove)
- [of](TestStubs.md#of)

## Constructors

### constructor

• **new TestStubs**(`server`): [`TestStubs`](TestStubs.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`TestStubs`](TestStubs.md)

#### Defined in

[packages/bpmn-server/src/engine/TestStubs.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/TestStubs.ts#L15)

## Properties

### #byInstance

• `Private` **#byInstance**: `Map`\<`string`, [`StubSet`](../interfaces/StubSet.md)\>

#### Defined in

[packages/bpmn-server/src/engine/TestStubs.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/TestStubs.ts#L13)

___

### server

• `Private` `Readonly` **server**: `any`

#### Defined in

[packages/bpmn-server/src/engine/TestStubs.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/TestStubs.ts#L15)

## Methods

### add

▸ **add**(`instanceId`, `stubs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |
| `stubs` | [`StubSet`](../interfaces/StubSet.md) |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/TestStubs.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/TestStubs.ts#L17)

___

### remove

▸ **remove**(`stubs`): `void`

A test ended: its stubs are gone, from its instances and what they called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `stubs` | [`StubSet`](../interfaces/StubSet.md) |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/TestStubs.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/TestStubs.ts#L20)

___

### of

▸ **of**(`execution`): `Promise`\<[`StubSet`](../interfaces/StubSet.md)\>

The stubs of the instance an execution runs: its own, or those of the instance that called it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |

#### Returns

`Promise`\<[`StubSet`](../interfaces/StubSet.md)\>

#### Defined in

[packages/bpmn-server/src/engine/TestStubs.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/TestStubs.ts#L26)
