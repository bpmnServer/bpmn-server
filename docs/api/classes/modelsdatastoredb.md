[bpmn-server](../README.md) › [ModelsDatastoreDB](modelsdatastoredb.md)

# Class: ModelsDatastoreDB

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **ModelsDatastoreDB**

  ↳ [ModelsDatastore](modelsdatastore.md)

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

* [acl](modelsdatastoredb.md#acl)
* [appDelegate](modelsdatastoredb.md#appdelegate)
* [cache](modelsdatastoredb.md#cache)
* [configuration](modelsdatastoredb.md#configuration)
* [cron](modelsdatastoredb.md#cron)
* [dataStore](modelsdatastoredb.md#datastore)
* [definitions](modelsdatastoredb.md#definitions)
* [engine](modelsdatastoredb.md#engine)
* [iam](modelsdatastoredb.md#iam)
* [listener](modelsdatastoredb.md#listener)
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
* [updateTimer](modelsdatastoredb.md#updatetimer)

## Constructors

###  constructor

\+ **new ModelsDatastoreDB**(`server`: [BPMNServer](bpmnserver.md)): *[ModelsDatastoreDB](modelsdatastoredb.md)*

*Overrides [ServerComponent](servercomponent.md).[constructor](servercomponent.md#constructor)*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[ModelsDatastoreDB](modelsdatastoredb.md)*

## Properties

###  db

• **db**: *any*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:25

___

###  dbConfiguration

• **dbConfiguration**: *any*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:24

___

###  server

• **server**: *any*

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

###  deleteModel

▸ **deleteModel**(`name`: any): *Promise‹void›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:189

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹void›*

___

###  export

▸ **export**(`name`: any, `folderPath`: any): *Promise‹void›*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:212

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

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:89

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹[IEventData](../interfaces/ieventdata.md)[]›*

___

###  getList

▸ **getList**(): *Promise‹string[]›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:34

**Returns:** *Promise‹string[]›*

___

###  getSVG

▸ **getSVG**(`name`: any): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:59

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹any›*

___

###  getSource

▸ **getSource**(`name`: any): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:54

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹any›*

___

###  import

▸ **import**(`data`: any): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:137

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

___

###  install

▸ **install**(): *Promise‹any›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:134

first time installation of DB

creates a new collection and add an index

**Returns:** *Promise‹any›*

___

###  load

▸ **load**(`name`: any): *Promise‹[Definition](definition.md)›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[Definition](definition.md)›*

___

###  loadModel

▸ **loadModel**(`name`: any): *Promise‹[BpmnModelData](bpmnmodeldata.md)›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[BpmnModelData](bpmnmodeldata.md)›*

___

###  renameModel

▸ **renameModel**(`name`: any, `newName`: any): *Promise‹boolean›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:194

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

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:78

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

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`model` | [IBpmnModelData](../interfaces/ibpmnmodeldata.md) |

**Returns:** *Promise‹boolean›*

___

###  updateTimer

▸ **updateTimer**(`name`: any): *Promise‹boolean›*

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:143

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹boolean›*
