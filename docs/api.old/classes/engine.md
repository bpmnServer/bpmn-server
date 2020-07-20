[bpmn-server](../README.md) › [Engine](engine.md)

# Class: Engine

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **Engine**

## Index

### Constructors

* [constructor](engine.md#constructor)

### Properties

* [server](engine.md#server)

### Accessors

* [appDelegate](engine.md#appdelegate)
* [cache](engine.md#cache)
* [configuration](engine.md#configuration)
* [cron](engine.md#cron)
* [dataStore](engine.md#datastore)
* [definitions](engine.md#definitions)
* [engine](engine.md#engine)
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

\+ **new Engine**(`server`: [IBPMNServer](../interfaces/ibpmnserver.md)): *[Engine](engine.md)*

*Inherited from [ServerComponent](servercomponent.md).[constructor](servercomponent.md#constructor)*

Defined in src/server/ServerContext.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | [IBPMNServer](../interfaces/ibpmnserver.md) |

**Returns:** *[Engine](engine.md)*

## Properties

###  server

• **server**: *any*

*Inherited from [ServerComponent](servercomponent.md).[server](servercomponent.md#server)*

Defined in src/server/ServerContext.ts:9

## Accessors

###  appDelegate

• **get appDelegate**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[appDelegate](servercomponent.md#appdelegate)*

Defined in src/server/ServerContext.ts:20

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

*Inherited from [ServerComponent](servercomponent.md).[cache](servercomponent.md#cache)*

Defined in src/server/ServerContext.ts:18

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[configuration](servercomponent.md#configuration)*

Defined in src/server/ServerContext.ts:13

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

*Inherited from [ServerComponent](servercomponent.md).[cron](servercomponent.md#cron)*

Defined in src/server/ServerContext.ts:17

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[dataStore](servercomponent.md#datastore)*

Defined in src/server/ServerContext.ts:15

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[definitions](servercomponent.md#definitions)*

Defined in src/server/ServerContext.ts:19

**Returns:** *any*

___

###  engine

• **get engine**(): *[IEngine](../interfaces/iengine.md)*

*Inherited from [ServerComponent](servercomponent.md).[engine](servercomponent.md#engine)*

Defined in src/server/ServerContext.ts:16

**Returns:** *[IEngine](../interfaces/iengine.md)*

___

###  logger

• **get logger**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[logger](servercomponent.md#logger)*

Defined in src/server/ServerContext.ts:14

**Returns:** *any*

## Methods

###  get

▸ **get**(`instanceQuery`: any, `listener`: EventEmitter): *Promise‹[ExecutionContext](executioncontext.md)›*

Defined in src/server/Engine.ts:65

restores an instance into memeory or provides you access to a running instance

this will also resume execution

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`instanceQuery` | any | - | criteria to fetch the instance  query example:	{ id: instanceId} 					{ data: {caseId: 1005}} 					{ items.item.id : 'abcc111322'} 					{ items.item.itemKey : 'businesskey here'}   |
`listener` | EventEmitter | null | - |

**Returns:** *Promise‹[ExecutionContext](executioncontext.md)›*

___

###  invoke

▸ **invoke**(`itemQuery`: any, `data`: object, `listener`: EventEmitter): *Promise‹[ExecutionContext](executioncontext.md)›*

Defined in src/server/Engine.ts:117

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
`listener` | EventEmitter | null | - |

**Returns:** *Promise‹[ExecutionContext](executioncontext.md)›*

___

###  invokeItem

▸ **invokeItem**(`itemQuery`: any, `data`: object, `listener`: EventEmitter): *Promise‹[ExecutionContext](executioncontext.md)›*

Defined in src/server/Engine.ts:101

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`itemQuery` | any | - |
`data` | object | {} |
`listener` | EventEmitter | null |

**Returns:** *Promise‹[ExecutionContext](executioncontext.md)›*

___

###  restore

▸ **restore**(`instanceQuery`: any, `listener`: EventEmitter): *Promise‹[ExecutionContext](executioncontext.md)›*

Defined in src/server/Engine.ts:70

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`instanceQuery` | any | - |
`listener` | EventEmitter | null |

**Returns:** *Promise‹[ExecutionContext](executioncontext.md)›*

___

###  start

▸ **start**(`name`: any, `data`: any, `listener`: EventEmitter, `startNodeId`: string): *Promise‹[ExecutionContext](executioncontext.md)›*

Defined in src/server/Engine.ts:18

	loads a definitions  and start execution

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`name` | any | - | name of the process to start |
`data` | any | {} | input data |
`listener` | EventEmitter | null | - |
`startNodeId` | string | null | in process has multiple start node; you need to specify which one  |

**Returns:** *Promise‹[ExecutionContext](executioncontext.md)›*

___

###  startEvent

▸ **startEvent**(`instanceId`: any, `elementId`: any, `data`: object, `listener`: EventEmitter): *Promise‹[ExecutionContext](executioncontext.md)›*

Defined in src/server/Engine.ts:167

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
`listener` | EventEmitter | null | - |

**Returns:** *Promise‹[ExecutionContext](executioncontext.md)›*

___

###  throwMessage

▸ **throwMessage**(`messageId`: any, `data`: object, `matchingQuery`: object, `listener`: EventEmitter): *Promise‹[ExecutionContext](executioncontext.md)›*

Defined in src/server/Engine.ts:191

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`messageId` | any | - |
`data` | object | {} |
`matchingQuery` | object | {} |
`listener` | EventEmitter | null |

**Returns:** *Promise‹[ExecutionContext](executioncontext.md)›*

___

###  throwSignal

▸ **throwSignal**(`messageId`: any, `data`: object, `matchingQuery`: object, `listener`: EventEmitter): *Promise‹[ExecutionContext](executioncontext.md)›*

Defined in src/server/Engine.ts:233

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
`listener` | EventEmitter | null | - |

**Returns:** *Promise‹[ExecutionContext](executioncontext.md)›*
