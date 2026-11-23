[bpmn-server](../readme.md) / IAddOn

# Interface: IAddOn

## Table of contents

### Properties

- [name](IAddOn.md#name)

### Methods

- [register](IAddOn.md#register)

## Properties

### name

• **name**: `string`

its name, for the log

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:195](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L195)

## Methods

### register

▸ **register**(`server`): `void`

Registers what it brings, as the server is built: for the engine's events (`server.listener.subscribe`), and in
`server.registrations` (model checks, decision lookups). Its subscriptions end with the server.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `Object` |
| `server.listener` | `Object` |
| `server.listener.subscribe` | (`listener`: `any`) => () => `void` |
| `server.listener.on?` | (`event`: `string`, `listener`: (...`args`: `any`[]) => `any`) => `any` |
| `server.registrations` | [`Registrations`](../classes/Registrations.md) |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:201](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L201)
