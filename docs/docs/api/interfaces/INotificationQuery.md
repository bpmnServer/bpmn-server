[bpmn-server](../readme.md) / INotificationQuery

# Interface: INotificationQuery

Which notifications [findNotifications](../readme.md#findnotifications) lists.

## Table of contents

### Properties

- [to](INotificationQuery.md#to)
- [instanceId](INotificationQuery.md#instanceid)
- [instanceName](INotificationQuery.md#instancename)
- [status](INotificationQuery.md#status)
- [test](INotificationQuery.md#test)
- [limit](INotificationQuery.md#limit)

## Properties

### to

• `Optional` **to**: `string`[]

to any of these (user names, groups), as the rule said whom

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:214](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L214)

___

### instanceId

• `Optional` **instanceId**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:215](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L215)

___

### instanceName

• `Optional` **instanceName**: `string`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:216](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L216)

___

### status

• `Optional` **status**: ``"failed"`` \| ``"recorded"`` \| ``"sent"``

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:217](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L217)

___

### test

• `Optional` **test**: `boolean`

test runs' (marked `test`): true only theirs, false none of them; by default listed with the others

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:219](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L219)

___

### limit

• `Optional` **limit**: `number`

at most this many, the newest (default 200, at most 1000)

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:221](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L221)
