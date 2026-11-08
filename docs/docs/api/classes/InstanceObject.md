[bpmn-server](../readme.md) / InstanceObject

# Class: InstanceObject

as stored in MongoDB

## Implements

- [`IInstanceData`](../interfaces/IInstanceData.md)

## Table of contents

### Constructors

- [constructor](InstanceObject.md#constructor)

### Properties

- [id](InstanceObject.md#id)
- [tenantId](InstanceObject.md#tenantid)
- [name](InstanceObject.md#name)
- [status](InstanceObject.md#status)
- [version](InstanceObject.md#version)
- [startedAt](InstanceObject.md#startedat)
- [endedAt](InstanceObject.md#endedat)
- [saved](InstanceObject.md#saved)
- [data](InstanceObject.md#data)
- [items](InstanceObject.md#items)
- [source](InstanceObject.md#source)
- [logs](InstanceObject.md#logs)
- [tokens](InstanceObject.md#tokens)
- [loops](InstanceObject.md#loops)
- [parentItemId](InstanceObject.md#parentitemid)
- [svg](InstanceObject.md#svg)
- [vars](InstanceObject.md#vars)
- [flags](InstanceObject.md#flags)

## Constructors

### constructor

• **new InstanceObject**(): [`InstanceObject`](InstanceObject.md)

#### Returns

[`InstanceObject`](InstanceObject.md)

## Properties

### id

• **id**: `any`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[id](../interfaces/IInstanceData.md#id)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:8](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L8)

___

### tenantId

• `Optional` **tenantId**: `string`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[tenantId](../interfaces/IInstanceData.md#tenantid)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:9](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L9)

___

### name

• **name**: `any`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[name](../interfaces/IInstanceData.md#name)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L10)

___

### status

• **status**: [`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[status](../interfaces/IInstanceData.md#status)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L11)

___

### version

• **version**: `any` = `null`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[version](../interfaces/IInstanceData.md#version)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L12)

___

### startedAt

• **startedAt**: `any`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[startedAt](../interfaces/IInstanceData.md#startedat)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L13)

___

### endedAt

• **endedAt**: `any`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[endedAt](../interfaces/IInstanceData.md#endedat)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L14)

___

### saved

• **saved**: `any`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[saved](../interfaces/IInstanceData.md#saved)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L15)

___

### data

• **data**: `any`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[data](../interfaces/IInstanceData.md#data)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L16)

___

### items

• **items**: `any`[] = `[]`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[items](../interfaces/IInstanceData.md#items)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L17)

___

### source

• **source**: `any`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[source](../interfaces/IInstanceData.md#source)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L18)

___

### logs

• **logs**: `any`[] = `[]`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[logs](../interfaces/IInstanceData.md#logs)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L19)

___

### tokens

• **tokens**: `any`[] = `[]`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[tokens](../interfaces/IInstanceData.md#tokens)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L20)

___

### loops

• **loops**: `any`[] = `[]`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[loops](../interfaces/IInstanceData.md#loops)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L21)

___

### parentItemId

• **parentItemId**: `any`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[parentItemId](../interfaces/IInstanceData.md#parentitemid)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L22)

___

### svg

• `Optional` **svg**: `any`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[svg](../interfaces/IInstanceData.md#svg)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L23)

___

### vars

• **vars**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L24)

___

### flags

• `Optional` **flags**: `any`

#### Implementation of

[IInstanceData](../interfaces/IInstanceData.md).[flags](../interfaces/IInstanceData.md#flags)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L25)
