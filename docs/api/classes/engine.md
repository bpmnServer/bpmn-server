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
* [eventsRegistry](engine.md#eventsregistry)
* [logger](engine.md#logger)

### Methods

* [get](engine.md#get)
* [invoke](engine.md#invoke)
* [restore](engine.md#restore)
* [signal](engine.md#signal)
* [start](engine.md#start)
* [startEvent](engine.md#startevent)

## Constructors

###  constructor

\+ **new Engine**(`server`: [BPMNServer](bpmnserver.md)): *[Engine](engine.md)*

*Inherited from [Cron](cron.md).[constructor](cron.md#constructor)*

Defined in src/server/ServerContext.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[Engine](engine.md)*

## Properties

###  server

• **server**: *any*

*Inherited from [Cron](cron.md).[server](cron.md#server)*

Defined in src/server/ServerContext.ts:11

## Accessors

###  appDelegate

• **get appDelegate**(): *any*

*Inherited from [Cron](cron.md).[appDelegate](cron.md#appdelegate)*

Defined in src/server/ServerContext.ts:23

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

*Inherited from [Cron](cron.md).[cache](cron.md#cache)*

Defined in src/server/ServerContext.ts:21

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

*Inherited from [Cron](cron.md).[configuration](cron.md#configuration)*

Defined in src/server/ServerContext.ts:15

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

*Inherited from [Cron](cron.md).[cron](cron.md#cron)*

Defined in src/server/ServerContext.ts:20

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

*Inherited from [Cron](cron.md).[dataStore](cron.md#datastore)*

Defined in src/server/ServerContext.ts:17

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

*Inherited from [Cron](cron.md).[definitions](cron.md#definitions)*

Defined in src/server/ServerContext.ts:22

**Returns:** *any*

___

###  engine

• **get engine**(): *[Engine](engine.md)*

*Inherited from [Cron](cron.md).[engine](cron.md#engine)*

Defined in src/server/ServerContext.ts:19

**Returns:** *[Engine](engine.md)*

___

###  eventsRegistry

• **get eventsRegistry**(): *any*

*Inherited from [Cron](cron.md).[eventsRegistry](cron.md#eventsregistry)*

Defined in src/server/ServerContext.ts:18

**Returns:** *any*

___

###  logger

• **get logger**(): *any*

*Inherited from [Cron](cron.md).[logger](cron.md#logger)*

Defined in src/server/ServerContext.ts:16

**Returns:** *any*

## Methods

###  get

▸ **get**(`instanceQuery`: any, `listener`: EventEmitter): *Promise‹[ExecutionResponse](executionresponse.md)›*

Defined in src/server/Engine.ts:64

restores an instance into memeory or provides you access to a running instance

this will also resume execution

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`instanceQuery` | any | - | criteria to fetch the instance  query example:	{ id: instanceId} 					{ data: {caseId: 1005}} 					{ items.item.id : 'abcc111322'} 					{ items.item.itemKey : 'businesskey here'}   |
`listener` | EventEmitter | null | - |

**Returns:** *Promise‹[ExecutionResponse](executionresponse.md)›*

___

###  invoke

▸ **invoke**(`itemQuery`: any, `data`: object, `listener`: EventEmitter): *Promise‹[ExecutionResponse](executionresponse.md)›*

Defined in src/server/Engine.ts:107

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

**Returns:** *Promise‹[ExecutionResponse](executionresponse.md)›*

___

###  restore

▸ **restore**(`instanceQuery`: any, `listener`: EventEmitter): *Promise‹[ExecutionContext](executioncontext.md)›*

Defined in src/server/Engine.ts:69

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`instanceQuery` | any | - |
`listener` | EventEmitter | null |

**Returns:** *Promise‹[ExecutionContext](executioncontext.md)›*

___

###  signal

▸ **signal**(`messageId`: any, `matchingKey`: any, `data`: object, `listener`: EventEmitter): *Promise‹[ExecutionResponse](executionresponse.md)‹››*

Defined in src/server/Engine.ts:191

signal/message raise a signal or throw a message

will seach for a matching event/task given the signalId/messageId

that can be againt a running instance or it may start a new instance
----------------------------------------------------------------------------

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`messageId` | any | - | the id of the message or signal as per bpmn definition |
`matchingKey` | any | - | should match the itemKey (if specified) |
`data` | object | {} | message data  |
`listener` | EventEmitter | null | - |

**Returns:** *Promise‹[ExecutionResponse](executionresponse.md)‹››*

___

###  start

▸ **start**(`name`: any, `data`: any, `listener`: EventEmitter, `startNodeId`: string): *Promise‹[ExecutionResponse](executionresponse.md)›*

Defined in src/server/Engine.ts:22

	loads a definitions  and start execution

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`name` | any | - | name of the process to start |
`data` | any | {} | input data |
`listener` | EventEmitter | null | - |
`startNodeId` | string | null | in process has multiple start node; you need to specify which one  |

**Returns:** *Promise‹[ExecutionResponse](executionresponse.md)›*

___

###  startEvent

▸ **startEvent**(`instanceId`: any, `elementId`: any, `data`: object, `listener`: EventEmitter): *Promise‹[ExecutionResponse](executionresponse.md)›*

Defined in src/server/Engine.ts:156

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

**Returns:** *Promise‹[ExecutionResponse](executionresponse.md)›*
