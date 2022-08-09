[bpmn-server](../README.md) › [IEngine](iengine.md)

# Interface: IEngine

## Hierarchy

* [IServerComponent](iservercomponent.md)

  ↳ **IEngine**

## Implemented by

* [Engine](../classes/engine.md)

## Index

### Properties

* [appDelegate](iengine.md#appdelegate)
* [cache](iengine.md#cache)
* [configuration](iengine.md#configuration)
* [cron](iengine.md#cron)
* [dataStore](iengine.md#datastore)
* [definitions](iengine.md#definitions)
* [engine](iengine.md#engine)
* [logger](iengine.md#logger)
* [server](iengine.md#server)

### Methods

* [get](iengine.md#get)
* [invoke](iengine.md#invoke)
* [restore](iengine.md#restore)
* [start](iengine.md#start)
* [startEvent](iengine.md#startevent)

## Properties

###  appDelegate

• **appDelegate**: *[IAppDelegate](iappdelegate.md)*

*Inherited from [IServerComponent](iservercomponent.md).[appDelegate](iservercomponent.md#appdelegate)*

Defined in bpmnServer/src/interfaces/server.ts:28

___

###  cache

• **cache**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[cache](iservercomponent.md#cache)*

Defined in bpmnServer/src/interfaces/server.ts:27

___

###  configuration

• **configuration**: *[IConfiguration](iconfiguration.md)*

*Inherited from [IServerComponent](iservercomponent.md).[configuration](iservercomponent.md#configuration)*

Defined in bpmnServer/src/interfaces/server.ts:24

___

###  cron

• **cron**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[cron](iservercomponent.md#cron)*

Defined in bpmnServer/src/interfaces/server.ts:26

___

###  dataStore

• **dataStore**: *[IDataStore](idatastore.md)*

*Inherited from [IServerComponent](iservercomponent.md).[dataStore](iservercomponent.md#datastore)*

Defined in bpmnServer/src/interfaces/server.ts:30

___

###  definitions

• **definitions**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[definitions](iservercomponent.md#definitions)*

Defined in bpmnServer/src/interfaces/server.ts:31

___

###  engine

• **engine**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[engine](iservercomponent.md#engine)*

Defined in bpmnServer/src/interfaces/server.ts:29

___

###  logger

• **logger**: *[ILogger](ilogger.md)*

*Inherited from [IServerComponent](iservercomponent.md).[logger](iservercomponent.md#logger)*

Defined in bpmnServer/src/interfaces/server.ts:25

___

###  server

• **server**: *[IBPMNServer](ibpmnserver.md)*

*Inherited from [IServerComponent](iservercomponent.md).[server](iservercomponent.md#server)*

Defined in bpmnServer/src/interfaces/server.ts:23

## Methods

###  get

▸ **get**(`instanceQuery`: any): *Promise‹[IExecution](iexecution.md)›*

Defined in bpmnServer/src/interfaces/server.ts:56

restores an instance into memeory or provides you access to a running instance

this will also resume execution

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`instanceQuery` | any | criteria to fetch the instance  query example:	{ id: instanceId} 					{ data: {caseId: 1005}} 					{ items.item.id : 'abcc111322'} 					{ items.item.itemKey : 'businesskey here'}   |

**Returns:** *Promise‹[IExecution](iexecution.md)›*

___

###  invoke

▸ **invoke**(`itemQuery`: any, `data?`: object, `userKey?`: string): *Promise‹[IExecution](iexecution.md)›*

Defined in bpmnServer/src/interfaces/server.ts:70

Continue an existing item that is in a wait state

-------------------------------------------------
scenario:
		itemId			{itemId: value }
		itemKey			{itemKey: value}
		instance,task	{instanceId: instanceId, elementId: value }

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`itemQuery` | any | criteria to retrieve the item |
`data?` | object |   |
`userKey?` | string | - |

**Returns:** *Promise‹[IExecution](iexecution.md)›*

___

###  restore

▸ **restore**(`instanceQuery`: any): *Promise‹[IExecution](iexecution.md)›*

Defined in bpmnServer/src/interfaces/server.ts:57

**Parameters:**

Name | Type |
------ | ------ |
`instanceQuery` | any |

**Returns:** *Promise‹[IExecution](iexecution.md)›*

___

###  start

▸ **start**(`name`: any, `data?`: any, `startNodeId?`: string, `userKey?`: string, `options?`: any): *Promise‹[IExecution](iexecution.md)›*

Defined in bpmnServer/src/interfaces/server.ts:42

	loads a definitions  and start execution

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | any | name of the process to start |
`data?` | any | input data |
`startNodeId?` | string | in process has multiple start node; you need to specify which one  |
`userKey?` | string | - |
`options?` | any | - |

**Returns:** *Promise‹[IExecution](iexecution.md)›*

___

###  startEvent

▸ **startEvent**(`instanceId`: any, `elementId`: any, `data?`: object): *Promise‹[IExecution](iexecution.md)›*

Defined in bpmnServer/src/interfaces/server.ts:86

Invoking an event (usually start event of a secondary process) against an existing instance
or
Invoking a start event (of a secondary process) against an existing instance
----------------------------------------------------------------------------
	 instance,task
```
	{instanceId: instanceId, elementId: value }
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`instanceId` | any | - |
`elementId` | any | - |
`data?` | object |   |

**Returns:** *Promise‹[IExecution](iexecution.md)›*
