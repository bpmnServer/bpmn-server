[bpmn-server](../README.md) › [IEngine](iengine.md)

# Interface: IEngine

## Hierarchy

* [IServerComponent](iservercomponent.md)

  ↳ **IEngine**

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
* [signal](iengine.md#signal)
* [start](iengine.md#start)
* [startEvent](iengine.md#startevent)

## Properties

###  appDelegate

• **appDelegate**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[appDelegate](iservercomponent.md#appdelegate)*

Defined in src/interfaces/server.ts:37

___

###  cache

• **cache**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[cache](iservercomponent.md#cache)*

Defined in src/interfaces/server.ts:35

___

###  configuration

• **configuration**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[configuration](iservercomponent.md#configuration)*

Defined in src/interfaces/server.ts:30

___

###  cron

• **cron**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[cron](iservercomponent.md#cron)*

Defined in src/interfaces/server.ts:34

___

###  dataStore

• **dataStore**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[dataStore](iservercomponent.md#datastore)*

Defined in src/interfaces/server.ts:32

___

###  definitions

• **definitions**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[definitions](iservercomponent.md#definitions)*

Defined in src/interfaces/server.ts:36

___

###  engine

• **engine**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[engine](iservercomponent.md#engine)*

Defined in src/interfaces/server.ts:33

___

###  logger

• **logger**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[logger](iservercomponent.md#logger)*

Defined in src/interfaces/server.ts:31

___

###  server

• **server**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[server](iservercomponent.md#server)*

Defined in src/interfaces/server.ts:29

## Methods

###  get

▸ **get**(`instanceQuery`: any, `listener?`: EventEmitter): *Promise‹[IExecutionContext](iexecutioncontext.md)›*

Defined in src/interfaces/server.ts:62

restores an instance into memeory or provides you access to a running instance

this will also resume execution

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`instanceQuery` | any | criteria to fetch the instance  query example:	{ id: instanceId} 					{ data: {caseId: 1005}} 					{ items.item.id : 'abcc111322'} 					{ items.item.itemKey : 'businesskey here'}   |
`listener?` | EventEmitter | - |

**Returns:** *Promise‹[IExecutionContext](iexecutioncontext.md)›*

___

###  invoke

▸ **invoke**(`itemQuery`: any, `data?`: object, `listener?`: EventEmitter): *Promise‹[IExecutionContext](iexecutioncontext.md)›*

Defined in src/interfaces/server.ts:76

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
`listener?` | EventEmitter | - |

**Returns:** *Promise‹[IExecutionContext](iexecutioncontext.md)›*

___

###  restore

▸ **restore**(`instanceQuery`: any, `listener?`: EventEmitter): *Promise‹[IExecutionContext](iexecutioncontext.md)›*

Defined in src/interfaces/server.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`instanceQuery` | any |
`listener?` | EventEmitter |

**Returns:** *Promise‹[IExecutionContext](iexecutioncontext.md)›*

___

###  signal

▸ **signal**(`messageId`: any, `matchingKey`: any, `data?`: object, `listener?`: EventEmitter): *Promise‹[IExecutionContext](iexecutioncontext.md)›*

Defined in src/interfaces/server.ts:105

signal/message raise a signal or throw a message

will seach for a matching event/task given the signalId/messageId

that can be againt a running instance or it may start a new instance
----------------------------------------------------------------------------

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageId` | any | the id of the message or signal as per bpmn definition |
`matchingKey` | any | should match the itemKey (if specified) |
`data?` | object | message data  |
`listener?` | EventEmitter | - |

**Returns:** *Promise‹[IExecutionContext](iexecutioncontext.md)›*

___

###  start

▸ **start**(`name`: any, `data?`: any, `listener?`: EventEmitter, `startNodeId?`: string): *Promise‹[IExecutionContext](iexecutioncontext.md)›*

Defined in src/interfaces/server.ts:48

	loads a definitions  and start execution

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | any | name of the process to start |
`data?` | any | input data |
`listener?` | EventEmitter | - |
`startNodeId?` | string | in process has multiple start node; you need to specify which one  |

**Returns:** *Promise‹[IExecutionContext](iexecutioncontext.md)›*

___

###  startEvent

▸ **startEvent**(`instanceId`: any, `elementId`: any, `data?`: object, `listener?`: EventEmitter): *Promise‹[IExecutionContext](iexecutioncontext.md)›*

Defined in src/interfaces/server.ts:92

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
`listener?` | EventEmitter | - |

**Returns:** *Promise‹[IExecutionContext](iexecutioncontext.md)›*
