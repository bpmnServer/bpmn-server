[bpmn-server](../README.md) › [ModelsDatastoreFS](modelsdatastorefs.md)

# Class: ModelsDatastoreFS

## Hierarchy

  ↳ [ModelsDatastoreDB](modelsdatastoredb.md)

  ↳ **ModelsDatastoreFS**

## Implements

* [IModelsDatastore](../interfaces/imodelsdatastore.md)
* [IModelsDatastore](../interfaces/imodelsdatastore.md)

## Index

### Constructors

* [constructor](modelsdatastorefs.md#constructor)

### Properties

* [db](modelsdatastorefs.md#db)
* [dbConfiguration](modelsdatastorefs.md#dbconfiguration)
* [definitionsPath](modelsdatastorefs.md#definitionspath)
* [server](modelsdatastorefs.md#server)

### Accessors

* [appDelegate](modelsdatastorefs.md#appdelegate)
* [cache](modelsdatastorefs.md#cache)
* [configuration](modelsdatastorefs.md#configuration)
* [cron](modelsdatastorefs.md#cron)
* [dataStore](modelsdatastorefs.md#datastore)
* [definitions](modelsdatastorefs.md#definitions)
* [engine](modelsdatastorefs.md#engine)
* [logger](modelsdatastorefs.md#logger)

### Methods

* [deleteModel](modelsdatastorefs.md#deletemodel)
* [export](modelsdatastorefs.md#export)
* [findEvents](modelsdatastorefs.md#findevents)
* [getList](modelsdatastorefs.md#getlist)
* [getSVG](modelsdatastorefs.md#getsvg)
* [getSource](modelsdatastorefs.md#getsource)
* [import](modelsdatastorefs.md#import)
* [install](modelsdatastorefs.md#install)
* [load](modelsdatastorefs.md#load)
* [loadModel](modelsdatastorefs.md#loadmodel)
* [rebuild](modelsdatastorefs.md#rebuild)
* [renameModel](modelsdatastorefs.md#renamemodel)
* [save](modelsdatastorefs.md#save)
* [saveModel](modelsdatastorefs.md#savemodel)

## Constructors

###  constructor

\+ **new ModelsDatastoreFS**(`server`: [BPMNServer](bpmnserver.md)): *[ModelsDatastoreFS](modelsdatastorefs.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[constructor](modelsdatastoredb.md#constructor)*

Defined in src/datastore/ModelsDatastoreFS.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[ModelsDatastoreFS](modelsdatastorefs.md)*

## Properties

###  db

• **db**: *any*

*Inherited from [ModelsDatastoreFS](modelsdatastorefs.md).[db](modelsdatastorefs.md#db)*

Defined in src/datastore/ModelsDatastoreDB.ts:18

___

###  dbConfiguration

• **dbConfiguration**: *any*

*Inherited from [ModelsDatastoreFS](modelsdatastorefs.md).[dbConfiguration](modelsdatastorefs.md#dbconfiguration)*

Defined in src/datastore/ModelsDatastoreDB.ts:17

___

###  definitionsPath

• **definitionsPath**: *any*

Defined in src/datastore/ModelsDatastoreFS.ts:16

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

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[deleteModel](modelsdatastoredb.md#deletemodel)*

Defined in src/datastore/ModelsDatastoreFS.ts:96

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹void›*

___

###  export

▸ **export**(`name`: any, `folderPath`: any): *Promise‹void›*

*Inherited from [ModelsDatastoreFS](modelsdatastorefs.md).[export](modelsdatastorefs.md#export)*

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

*Inherited from [ModelsDatastoreFS](modelsdatastorefs.md).[findEvents](modelsdatastorefs.md#findevents)*

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

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[getList](modelsdatastoredb.md#getlist)*

Defined in src/datastore/ModelsDatastoreFS.ts:28

**Returns:** *Promise‹string[]›*

___

###  getSVG

▸ **getSVG**(`name`: any): *Promise‹string›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[getSVG](modelsdatastoredb.md#getsvg)*

Defined in src/datastore/ModelsDatastoreFS.ts:82

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹string›*

___

###  getSource

▸ **getSource**(`name`: any): *Promise‹string›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[getSource](modelsdatastoredb.md#getsource)*

Defined in src/datastore/ModelsDatastoreFS.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹string›*

___

###  import

▸ **import**(`data`: any): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[import](modelsdatastoredb.md#import)*

Defined in src/datastore/ModelsDatastoreFS.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

___

###  install

▸ **install**(): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Inherited from [ModelsDatastoreFS](modelsdatastorefs.md).[install](modelsdatastorefs.md#install)*

Defined in src/datastore/ModelsDatastoreDB.ts:126

first time installation of DB

creates a new collection and add an index

**Returns:** *Promise‹any›*

___

###  load

▸ **load**(`name`: any): *Promise‹[Definition](definition.md)›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[load](modelsdatastoredb.md#load)*

Defined in src/datastore/ModelsDatastoreFS.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[Definition](definition.md)›*

___

###  loadModel

▸ **loadModel**(`name`: any): *Promise‹[BpmnModelData](bpmnmodeldata.md)›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Inherited from [ModelsDatastoreFS](modelsdatastorefs.md).[loadModel](modelsdatastorefs.md#loadmodel)*

Defined in src/datastore/ModelsDatastoreDB.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[BpmnModelData](bpmnmodeldata.md)›*

___

###  rebuild

▸ **rebuild**(): *Promise‹void›*

Defined in src/datastore/ModelsDatastoreFS.ts:124

reconstruct the models database from files

use when modifying the files manually or importing new environment

**Returns:** *Promise‹void›*

___

###  renameModel

▸ **renameModel**(`name`: any, `newName`: any): *Promise‹boolean›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[renameModel](modelsdatastoredb.md#renamemodel)*

Defined in src/datastore/ModelsDatastoreFS.ts:106

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`newName` | any |

**Returns:** *Promise‹boolean›*

___

###  save

▸ **save**(`name`: any, `bpmn`: any, `svg?`: any): *Promise‹boolean›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[save](modelsdatastoredb.md#save)*

Defined in src/datastore/ModelsDatastoreFS.ts:86

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`bpmn` | any |
`svg?` | any |

**Returns:** *Promise‹boolean›*

___

###  saveModel

▸ **saveModel**(`model`: [IBpmnModelData](../interfaces/ibpmnmodeldata.md)): *Promise‹boolean›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Inherited from [ModelsDatastoreFS](modelsdatastorefs.md).[saveModel](modelsdatastorefs.md#savemodel)*

Defined in src/datastore/ModelsDatastoreDB.ts:135

**Parameters:**

Name | Type |
------ | ------ |
`model` | [IBpmnModelData](../interfaces/ibpmnmodeldata.md) |

**Returns:** *Promise‹boolean›*
