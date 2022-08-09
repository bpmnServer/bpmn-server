[bpmn-server](../README.md) › [Engine](engine.md)

# Class: Engine

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **Engine**

## Implements

* [IEngine](../interfaces/iengine.md)

## Index

### Constructors

* [constructor](engine.md#constructor)

### Properties

* [server](engine.md#server)

### Accessors

* [acl](engine.md#acl)
* [appDelegate](engine.md#appdelegate)
* [cache](engine.md#cache)
* [configuration](engine.md#configuration)
* [cron](engine.md#cron)
* [dataStore](engine.md#datastore)
* [definitions](engine.md#definitions)
* [engine](engine.md#engine)
* [iam](engine.md#iam)
* [listener](engine.md#listener)
* [logger](engine.md#logger)

### Methods

* [get](engine.md#get)
* [invoke](engine.md#invoke)
* [invokeItem](engine.md#invokeitem)
* [restore](engine.md#restore)
* [start](engine.md#start)
* [startEvent](engine.md#startevent)
* [throwMessage](engine.md#throwmessage)
* [throwSignal](engine.md#throwsignal)

## Constructors

###  constructor

\+ **new Engine**(`server`: any): *[Engine](engine.md)*

*Overrides [ServerComponent](servercomponent.md).[constructor](servercomponent.md#constructor)*

Defined in bpmnServer/src/server/Engine.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[Engine](engine.md)*

## Properties

###  server

• **server**: *any*

*Implementation of [IEngine](../interfaces/iengine.md).[server](../interfaces/iengine.md#server)*

*Inherited from [ServerComponent](servercomponent.md).[server](servercomponent.md#server)*

Defined in bpmnServer/src/server/ServerComponent.ts:9

## Accessors

###  acl

• **get acl**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[acl](servercomponent.md#acl)*

Defined in bpmnServer/src/server/ServerComponent.ts:23

**Returns:** *any*

___

###  appDelegate

• **get appDelegate**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[appDelegate](servercomponent.md#appdelegate)*

Defined in bpmnServer/src/server/ServerComponent.ts:18

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

*Inherited from [ServerComponent](servercomponent.md).[cache](servercomponent.md#cache)*

Defined in bpmnServer/src/server/ServerComponent.ts:17

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[configuration](servercomponent.md#configuration)*

Defined in bpmnServer/src/server/ServerComponent.ts:14

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

*Inherited from [ServerComponent](servercomponent.md).[cron](servercomponent.md#cron)*

Defined in bpmnServer/src/server/ServerComponent.ts:16

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[dataStore](servercomponent.md#datastore)*

Defined in bpmnServer/src/server/ServerComponent.ts:20

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[definitions](servercomponent.md#definitions)*

Defined in bpmnServer/src/server/ServerComponent.ts:21

**Returns:** *any*

___

###  engine

• **get engine**(): *[IEngine](../interfaces/iengine.md)*

*Inherited from [ServerComponent](servercomponent.md).[engine](servercomponent.md#engine)*

Defined in bpmnServer/src/server/ServerComponent.ts:19

**Returns:** *[IEngine](../interfaces/iengine.md)*

___

###  iam

• **get iam**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[iam](servercomponent.md#iam)*

Defined in bpmnServer/src/server/ServerComponent.ts:24

**Returns:** *any*

___

###  listener

• **get listener**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[listener](servercomponent.md#listener)*

Defined in bpmnServer/src/server/ServerComponent.ts:22

**Returns:** *any*

___

###  logger

• **get logger**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[logger](servercomponent.md#logger)*

Defined in bpmnServer/src/server/ServerComponent.ts:15

**Returns:** *any*

## Methods

###  get

▸ **get**(`instanceQuery`: any): *Promise‹[Execution](execution.md)›*

*Implementation of [IEngine](../interfaces/iengine.md)*

Defined in bpmnServer/src/server/Engine.ts:73

restores an instance into memeory or provides you access to a running instance

this will also resume execution

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`instanceQuery` | any | criteria to fetch the instance  query example:	{ id: instanceId} 					{ data: {caseId: 1005}} 					{ items.item.id : 'abcc111322'} 					{ items.item.itemKey : 'businesskey here'}   |

**Returns:** *Promise‹[Execution](execution.md)›*

___

###  invoke

▸ **invoke**(`itemQuery`: any, `data`: object, `userKey`: string): *Promise‹[Execution](execution.md)›*

Defined in bpmnServer/src/server/Engine.ts:124

Continue an existing item that is in a wait state

-------------------------------------------------
scenario:
		itemId			{itemId: value }
		itemKey			{itemKey: value}
		instance,task	{instanceId: instanceId, elementId: value }

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`itemQuery` | any | - | criteria to retrieve the item |
`data` | object | {} |   |
`userKey` | string | null | - |

**Returns:** *Promise‹[Execution](execution.md)›*

___

###  invokeItem

▸ **invokeItem**(`itemQuery`: any, `data`: object): *Promise‹[Execution](execution.md)›*

Defined in bpmnServer/src/server/Engine.ts:108

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`itemQuery` | any | - |
`data` | object | {} |

**Returns:** *Promise‹[Execution](execution.md)›*

___

###  restore

▸ **restore**(`instanceQuery`: any): *Promise‹[Execution](execution.md)›*

*Implementation of [IEngine](../interfaces/iengine.md)*

Defined in bpmnServer/src/server/Engine.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`instanceQuery` | any |

**Returns:** *Promise‹[Execution](execution.md)›*

___

###  start

▸ **start**(`name`: any, `data`: any, `startNodeId`: string, `userKey`: string, `options`: object): *Promise‹[Execution](execution.md)›*

Defined in bpmnServer/src/server/Engine.ts:23

	loads a definitions  and start execution

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`name` | any | - | name of the process to start |
`data` | any | {} | input data |
`startNodeId` | string | null | in process has multiple start node; you need to specify which one  |
`userKey` | string | null | - |
`options` | object | {} | - |

**Returns:** *Promise‹[Execution](execution.md)›*

___

###  startEvent

▸ **startEvent**(`instanceId`: any, `elementId`: any, `data`: object): *Promise‹[Execution](execution.md)›*

Defined in bpmnServer/src/server/Engine.ts:178

Invoking an event (usually start event of a secondary process) against an existing instance
or
Invoking a start event (of a secondary process) against an existing instance
----------------------------------------------------------------------------
	 instance,task
```
	{instanceId: instanceId, elementId: value }
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`instanceId` | any | - | - |
`elementId` | any | - | - |
`data` | object | {} |   |

**Returns:** *Promise‹[Execution](execution.md)›*

___

###  throwMessage

▸ **throwMessage**(`messageId`: any, `data`: object, `matchingQuery`: object): *Promise‹[Execution](execution.md)›*

Defined in bpmnServer/src/server/Engine.ts:200

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`messageId` | any | - |
`data` | object | {} |
`matchingQuery` | object | {} |

**Returns:** *Promise‹[Execution](execution.md)›*

___

###  throwSignal

▸ **throwSignal**(`messageId`: any, `data`: object, `matchingQuery`: object): *Promise‹[Execution](execution.md)›*

Defined in bpmnServer/src/server/Engine.ts:242

signal/message raise a signal or throw a message

will seach for a matching event/task given the signalId/messageId

that can be againt a running instance or it may start a new instance
----------------------------------------------------------------------------

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`messageId` | any | - | the id of the message or signal as per bpmn definition |
`data` | object | {} | message data  |
`matchingQuery` | object | {} | should match the itemKey (if specified) |

**Returns:** *Promise‹[Execution](execution.md)›*
