[bpmn-server](../README.md) › [TimerEvent](timerevent.md)

# Class: TimerEvent

## Hierarchy

* **TimerEvent**

## Implements

* [IEventData](../interfaces/ieventdata.md)

## Index

### Constructors

* [constructor](timerevent.md#constructor)

### Properties

* [_id](timerevent.md#_id)
* [elementId](timerevent.md#elementid)
* [processName](timerevent.md#processname)
* [timeDue](timerevent.md#timedue)

## Constructors

###  constructor

\+ **new TimerEvent**(`__namedParameters`: object): *[TimerEvent](timerevent.md)*

Defined in src/server/EventsRegistry.ts:24

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`elementId` | any | null |
`processName` | any | null |
`timeDue` | Date | null |

**Returns:** *[TimerEvent](timerevent.md)*

## Properties

###  _id

• **_id**: *any*

*Implementation of [IEventData](../interfaces/ieventdata.md).[_id](../interfaces/ieventdata.md#_id)*

Defined in src/server/EventsRegistry.ts:21

___

###  elementId

• **elementId**: *string*

*Implementation of [IEventData](../interfaces/ieventdata.md).[elementId](../interfaces/ieventdata.md#elementid)*

Defined in src/server/EventsRegistry.ts:24

___

###  processName

• **processName**: *string*

*Implementation of [IEventData](../interfaces/ieventdata.md).[processName](../interfaces/ieventdata.md#processname)*

Defined in src/server/EventsRegistry.ts:23

___

###  timeDue

• **timeDue**: *Date*

*Implementation of [IEventData](../interfaces/ieventdata.md).[timeDue](../interfaces/ieventdata.md#optional-timedue)*

Defined in src/server/EventsRegistry.ts:22
