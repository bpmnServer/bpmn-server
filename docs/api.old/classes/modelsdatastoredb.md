[bpmn-server](../README.md) › [ModelsDatastoreDB](modelsdatastoredb.md)

# Class: ModelsDatastoreDB

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **ModelsDatastoreDB**

  ↳ [ModelsDatastoreFS](modelsdatastorefs.md)

## Implements

* [IModelsDatastore](../interfaces/imodelsdatastore.md)

## Index

### Constructors

* [constructor](modelsdatastoredb.md#constructor)

### Properties

* [db](modelsdatastoredb.md#db)
* [dbConfiguration](modelsdatastoredb.md#dbconfiguration)
* [server](modelsdatastoredb.md#server)

### Accessors

* [appDelegate](modelsdatastoredb.md#appdelegate)
* [cache](modelsdatastoredb.md#cache)
* [configuration](modelsdatastoredb.md#configuration)
* [cron](modelsdatastoredb.md#cron)
* [dataStore](modelsdatastoredb.md#datastore)
* [definitions](modelsdatastoredb.md#definitions)
* [engine](modelsdatastoredb.md#engine)
* [logger](modelsdatastoredb.md#logger)

### Methods

* [deleteModel](modelsdatastoredb.md#deletemodel)
* [export](modelsdatastoredb.md#export)
* [findEvents](modelsdatastoredb.md#findevents)
* [getList](modelsdatastoredb.md#getlist)
* [getSVG](modelsdatastoredb.md#getsvg)
* [getSource](modelsdatastoredb.md#getsource)
* [import](modelsdatastoredb.md#import)
* [install](modelsdatastoredb.md#install)
* [load](modelsdatastoredb.md#load)
* [loadModel](modelsdatastoredb.md#loadmodel)
* [renameModel](modelsdatastoredb.md#renamemodel)
* [save](modelsdatastoredb.md#save)
* [saveModel](modelsdatastoredb.md#savemodel)

## Constructors

###  constructor

\+ **new ModelsDatastoreDB**(`server`: [BPMNServer](bpmnserver.md)): *[ModelsDatastoreDB](modelsdatastoredb.md)*

*Overrides [ServerComponent](servercomponent.md).[constructor](servercomponent.md#constructor)*

Defined in src/datastore/ModelsDatastoreDB.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[ModelsDatastoreDB](modelsdatastoredb.md)*

## Properties

###  db

• **db**: *any*

Defined in src/datastore/ModelsDatastoreDB.ts:18

___

###  dbConfiguration

• **dbConfiguration**: *any*

Defined in src/datastore/ModelsDatastoreDB.ts:17

___

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

###  deleteModel

▸ **deleteModel**(`name`: any): *Promise‹void›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:159

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹void›*

___

###  export

▸ **export**(`name`: any, `folderPath`: any): *Promise‹void›*

Defined in src/datastore/ModelsDatastoreDB.ts:182

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`folderPath` | any |

**Returns:** *Promise‹void›*

___

###  findEvents

▸ **findEvents**(`query`: any): *Promise‹[IEventData](../interfaces/ieventdata.md)[]›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:81

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹[IEventData](../interfaces/ieventdata.md)[]›*

___

###  getList

▸ **getList**(): *Promise‹string[]›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:27

**Returns:** *Promise‹string[]›*

___

###  getSVG

▸ **getSVG**(`name`: any): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹any›*

___

###  getSource

▸ **getSource**(`name`: any): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹any›*

___

###  import

▸ **import**(`data`: any): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:129

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

___

###  install

▸ **install**(): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:126

first time installation of DB

creates a new collection and add an index

**Returns:** *Promise‹any›*

___

###  load

▸ **load**(`name`: any): *Promise‹[Definition](definition.md)›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[Definition](definition.md)›*

___

###  loadModel

▸ **loadModel**(`name`: any): *Promise‹[BpmnModelData](bpmnmodeldata.md)›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[BpmnModelData](bpmnmodeldata.md)›*

___

###  renameModel

▸ **renameModel**(`name`: any, `newName`: any): *Promise‹boolean›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:164

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`newName` | any |

**Returns:** *Promise‹boolean›*

___

###  save

▸ **save**(`name`: any, `source`: any, `svg`: any): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`source` | any |
`svg` | any |

**Returns:** *Promise‹any›*

___

###  saveModel

▸ **saveModel**(`model`: [IBpmnModelData](../interfaces/ibpmnmodeldata.md)): *Promise‹boolean›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreDB.ts:135

**Parameters:**

Name | Type |
------ | ------ |
`model` | [IBpmnModelData](../interfaces/ibpmnmodeldata.md) |

**Returns:** *Promise‹boolean›*
