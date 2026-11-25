[bpmn-server](../readme.md) / INotification

# Interface: INotification

One notification, as kept in `wf_notifications` and given to appDelegate.notify.

## Table of contents

### Properties

- [id](INotification.md#id)
- [createdAt](INotification.md#createdat)
- [instanceId](INotification.md#instanceid)
- [instanceName](INotification.md#instancename)
- [itemId](INotification.md#itemid)
- [elementId](INotification.md#elementid)
- [event](INotification.md#event)
- [policy](INotification.md#policy)
- [rule](INotification.md#rule)
- [to](INotification.md#to)
- [template](INotification.md#template)
- [subject](INotification.md#subject)
- [message](INotification.md#message)
- [channel](INotification.md#channel)
- [status](INotification.md#status)
- [error](INotification.md#error)
- [test](INotification.md#test)

## Properties

### id

• **id**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L29)

___

### createdAt

• **createdAt**: `Date`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:30](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L30)

___

### instanceId

• **instanceId**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L31)

___

### instanceName

• **instanceName**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L32)

___

### itemId

• `Optional` **itemId**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L33)

___

### elementId

• `Optional` **elementId**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L34)

___

### event

• **event**: ``"ended"`` \| ``"assigned"`` \| ``"completed"``

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:35](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L35)

___

### policy

• **policy**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:36](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L36)

___

### rule

• **rule**: `number`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L37)

___

### to

• **to**: `string`[]

whom, as the rule said: user names and groups

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:39](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L39)

___

### template

• `Optional` **template**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:40](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L40)

___

### subject

• **subject**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L41)

___

### message

• **message**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L42)

___

### channel

• `Optional` **channel**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:43](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L43)

___

### status

• **status**: ``"failed"`` \| ``"recorded"`` \| ``"sent"``

recorded: kept, not delivered; sent: the application's notify took it; failed: it threw, or the rule did

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L45)

___

### error

• `Optional` **error**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:46](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L46)

___

### test

• **test**: `boolean`

a test run's

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:48](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L48)
