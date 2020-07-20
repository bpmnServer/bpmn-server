[bpmn-server](../README.md) › [ModelsDatastore](modelsdatastore.md)

# Class: ModelsDatastore

## Hierarchy

  ↳ [ModelsDatastoreDB](modelsdatastoredb.md)

  ↳ **ModelsDatastore**

## Implements

* [IModelsDatastore](../interfaces/imodelsdatastore.md)
* [IModelsDatastore](../interfaces/imodelsdatastore.md)

## Index

### Constructors

* [constructor](modelsdatastore.md#constructor)

### Properties

* [db](modelsdatastore.md#db)
* [dbConfiguration](modelsdatastore.md#dbconfiguration)
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
* [logger](modelsdatastore.md#logger)

### Methods

* [deleteModel](modelsdatastore.md#deletemodel)
* [export](modelsdatastore.md#export)
* [findEvents](modelsdatastore.md#findevents)
* [getList](modelsdatastore.md#getlist)
* [getSVG](modelsdatastore.md#getsvg)
* [getSource](modelsdatastore.md#getsource)
* [import](modelsdatastore.md#import)
* [install](modelsdatastore.md#install)
* [load](modelsdatastore.md#load)
* [loadModel](modelsdatastore.md#loadmodel)
* [rebuild](modelsdatastore.md#rebuild)
* [renameModel](modelsdatastore.md#renamemodel)
* [save](modelsdatastore.md#save)
* [saveModel](modelsdatastore.md#savemodel)
* [updateTimer](modelsdatastore.md#updatetimer)

## Constructors

###  constructor

\+ **new ModelsDatastore**(`server`: [BPMNServer](bpmnserver.md)): *[ModelsDatastore](modelsdatastore.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[constructor](modelsdatastoredb.md#constructor)*

Defined in src/datastore/ModelsDatastore.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[ModelsDatastore](modelsdatastore.md)*

## Properties

###  db

• **db**: *any*

*Inherited from [ModelsDatastore](modelsdatastore.md).[db](modelsdatastore.md#db)*

Defined in src/datastore/ModelsDatastoreDB.ts:18

___

###  dbConfiguration

• **dbConfiguration**: *any*

*Inherited from [ModelsDatastore](modelsdatastore.md).[dbConfiguration](modelsdatastore.md#dbconfiguration)*

Defined in src/datastore/ModelsDatastoreDB.ts:17

___

###  definitionsPath

• **definitionsPath**: *any*

Defined in src/datastore/ModelsDatastore.ts:16

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

Defined in src/datastore/ModelsDatastore.ts:97

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹void›*

___

###  export

▸ **export**(`name`: any, `folderPath`: any): *Promise‹void›*

*Inherited from [ModelsDatastore](modelsdatastore.md).[export](modelsdatastore.md#export)*

Defined in src/datastore/ModelsDatastoreDB.ts:205

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

*Inherited from [ModelsDatastore](modelsdatastore.md).[findEvents](modelsdatastore.md#findevents)*

Defined in src/datastore/ModelsDatastoreDB.ts:82

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

Defined in src/datastore/ModelsDatastore.ts:28

**Returns:** *Promise‹string[]›*

___

###  getSVG

▸ **getSVG**(`name`: any): *Promise‹string›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[getSVG](modelsdatastoredb.md#getsvg)*

Defined in src/datastore/ModelsDatastore.ts:82

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

Defined in src/datastore/ModelsDatastore.ts:77

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

Defined in src/datastore/ModelsDatastore.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

___

###  install

▸ **install**(): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Inherited from [ModelsDatastore](modelsdatastore.md).[install](modelsdatastore.md#install)*

Defined in src/datastore/ModelsDatastoreDB.ts:127

first time installation of DB

creates a new collection and add an index

**Returns:** *Promise‹any›*

___

###  load

▸ **load**(`name`: any): *Promise‹[Definition](definition.md)›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[load](modelsdatastoredb.md#load)*

Defined in src/datastore/ModelsDatastore.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[Definition](definition.md)›*

___

###  loadModel

▸ **loadModel**(`name`: any): *Promise‹[BpmnModelData](bpmnmodeldata.md)›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Inherited from [ModelsDatastore](modelsdatastore.md).[loadModel](modelsdatastore.md#loadmodel)*

Defined in src/datastore/ModelsDatastoreDB.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[BpmnModelData](bpmnmodeldata.md)›*

___

###  rebuild

▸ **rebuild**(`model`: any): *Promise‹void›*

Defined in src/datastore/ModelsDatastore.ts:125

reconstruct the models database from files

use when modifying the files manually or importing new environment

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`model` | any | null |

**Returns:** *Promise‹void›*

___

###  renameModel

▸ **renameModel**(`name`: any, `newName`: any): *Promise‹boolean›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Overrides [ModelsDatastoreDB](modelsdatastoredb.md).[renameModel](modelsdatastoredb.md#renamemodel)*

Defined in src/datastore/ModelsDatastore.ts:107

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

Defined in src/datastore/ModelsDatastore.ts:86

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

*Inherited from [ModelsDatastore](modelsdatastore.md).[saveModel](modelsdatastore.md#savemodel)*

Defined in src/datastore/ModelsDatastoreDB.ts:162

**Parameters:**

Name | Type |
------ | ------ |
`model` | [IBpmnModelData](../interfaces/ibpmnmodeldata.md) |

**Returns:** *Promise‹boolean›*

___

###  updateTimer

▸ **updateTimer**(`name`: any): *Promise‹boolean›*

*Inherited from [ModelsDatastore](modelsdatastore.md).[updateTimer](modelsdatastore.md#updatetimer)*

Defined in src/datastore/ModelsDatastoreDB.ts:136

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹boolean›*
