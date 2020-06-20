[bpmn-server](../README.md) › [ModelsDatastore](modelsdatastore.md)

# Class: ModelsDatastore

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **ModelsDatastore**

## Index

### Constructors

* [constructor](modelsdatastore.md#constructor)

### Properties

* [definitionsPath](modelsdatastore.md#definitionspath)
* [server](modelsdatastore.md#server)

### Accessors

* [appDelegate](modelsdatastore.md#appdelegate)
* [cache](modelsdatastore.md#cache)
* [configuration](modelsdatastore.md#configuration)
* [cron](modelsdatastore.md#cron)
* [dataStore](modelsdatastore.md#datastore)
* [definitions](modelsdatastore.md#definitions)
* [engine](modelsdatastore.md#engine)
* [eventsRegistry](modelsdatastore.md#eventsregistry)
* [logger](modelsdatastore.md#logger)

### Methods

* [getList](modelsdatastore.md#getlist)
* [getSVG](modelsdatastore.md#getsvg)
* [getSource](modelsdatastore.md#getsource)
* [load](modelsdatastore.md#load)
* [save](modelsdatastore.md#save)

## Constructors

###  constructor

\+ **new ModelsDatastore**(`server`: [BPMNServer](bpmnserver.md)): *[ModelsDatastore](modelsdatastore.md)*

*Overrides [Cron](cron.md).[constructor](cron.md#constructor)*

Defined in src/server/ModelsDatastore.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[ModelsDatastore](modelsdatastore.md)*

## Properties

###  definitionsPath

• **definitionsPath**: *any*

Defined in src/server/ModelsDatastore.ts:13

___

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

###  getList

▸ **getList**(): *string[]*

Defined in src/server/ModelsDatastore.ts:19

**Returns:** *string[]*

___

###  getSVG

▸ **getSVG**(`name`: any): *string*

Defined in src/server/ModelsDatastore.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *string*

___

###  getSource

▸ **getSource**(`name`: any): *string*

Defined in src/server/ModelsDatastore.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *string*

___

###  load

▸ **load**(`name`: any): *Promise‹[Definition](definition.md)›*

Defined in src/server/ModelsDatastore.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[Definition](definition.md)›*

___

###  save

▸ **save**(`name`: any, `bpmn`: any, `svg?`: any): *boolean*

Defined in src/server/ModelsDatastore.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`bpmn` | any |
`svg?` | any |

**Returns:** *boolean*
