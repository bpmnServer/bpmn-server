[bpmn-server](../README.md) › [ModelsDatastoreFS](modelsdatastorefs.md)

# Class: ModelsDatastoreFS

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **ModelsDatastoreFS**

## Implements

* [IModelsDatastore](../interfaces/imodelsdatastore.md)

## Index

### Constructors

* [constructor](modelsdatastorefs.md#constructor)

### Properties

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

* [buildCollection](modelsdatastorefs.md#buildcollection)
* [deleteModel](modelsdatastorefs.md#deletemodel)
* [findEvents](modelsdatastorefs.md#findevents)
* [getList](modelsdatastorefs.md#getlist)
* [getSVG](modelsdatastorefs.md#getsvg)
* [getSource](modelsdatastorefs.md#getsource)
* [import](modelsdatastorefs.md#import)
* [install](modelsdatastorefs.md#install)
* [load](modelsdatastorefs.md#load)
* [loadModel](modelsdatastorefs.md#loadmodel)
* [renameModel](modelsdatastorefs.md#renamemodel)
* [save](modelsdatastorefs.md#save)
* [saveModel](modelsdatastorefs.md#savemodel)

## Constructors

###  constructor

\+ **new ModelsDatastoreFS**(`server`: [BPMNServer](bpmnserver.md)): *[ModelsDatastoreFS](modelsdatastorefs.md)*

*Overrides [ServerComponent](servercomponent.md).[constructor](servercomponent.md#constructor)*

Defined in src/datastore/ModelsDatastoreFS.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[ModelsDatastoreFS](modelsdatastorefs.md)*

## Properties

###  definitionsPath

• **definitionsPath**: *any*

Defined in src/datastore/ModelsDatastoreFS.ts:12

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

###  buildCollection

▸ **buildCollection**(): *Promise‹any›*

Defined in src/datastore/ModelsDatastoreFS.ts:101

**Returns:** *Promise‹any›*

___

###  deleteModel

▸ **deleteModel**(`name`: any): *Promise‹void›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreFS.ts:107

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹void›*

___

###  findEvents

▸ **findEvents**(`query`: any): *Promise‹any[]›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreFS.ts:97

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any[]›*

___

###  getList

▸ **getList**(): *Promise‹string[]›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreFS.ts:26

**Returns:** *Promise‹string[]›*

___

###  getSVG

▸ **getSVG**(`name`: any): *Promise‹string›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreFS.ts:80

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹string›*

___

###  getSource

▸ **getSource**(`name`: any): *Promise‹string›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreFS.ts:75

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹string›*

___

###  import

▸ **import**(`data`: any): *Promise‹void›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreFS.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹void›*

___

###  install

▸ **install**(): *Promise‹void›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreFS.ts:19

**Returns:** *Promise‹void›*

___

###  load

▸ **load**(`name`: any): *Promise‹[Definition](definition.md)›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreFS.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[Definition](definition.md)›*

___

###  loadModel

▸ **loadModel**(`name`: any): *Promise‹[IBpmnModelData](../interfaces/ibpmnmodeldata.md)›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreFS.ts:94

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[IBpmnModelData](../interfaces/ibpmnmodeldata.md)›*

___

###  renameModel

▸ **renameModel**(`name`: any, `newName`: any): *Promise‹boolean›*

*Implementation of [IModelsDatastore](../interfaces/imodelsdatastore.md)*

Defined in src/datastore/ModelsDatastoreFS.ts:110

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

Defined in src/datastore/ModelsDatastoreFS.ts:84

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

Defined in src/datastore/ModelsDatastoreFS.ts:104

**Parameters:**

Name | Type |
------ | ------ |
`model` | [IBpmnModelData](../interfaces/ibpmnmodeldata.md) |

**Returns:** *Promise‹boolean›*
