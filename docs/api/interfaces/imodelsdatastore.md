[bpmn-server](../README.md) › [IModelsDatastore](imodelsdatastore.md)

# Interface: IModelsDatastore

## Hierarchy

* **IModelsDatastore**

## Implemented by

* [ModelsDatastore](../classes/modelsdatastore.md)
* [ModelsDatastore](../classes/modelsdatastore.md)
* [ModelsDatastoreDB](../classes/modelsdatastoredb.md)

## Index

### Methods

* [deleteModel](imodelsdatastore.md#deletemodel)
* [findEvents](imodelsdatastore.md#findevents)
* [getList](imodelsdatastore.md#getlist)
* [getSVG](imodelsdatastore.md#getsvg)
* [getSource](imodelsdatastore.md#getsource)
* [import](imodelsdatastore.md#import)
* [install](imodelsdatastore.md#install)
* [load](imodelsdatastore.md#load)
* [loadModel](imodelsdatastore.md#loadmodel)
* [renameModel](imodelsdatastore.md#renamemodel)
* [save](imodelsdatastore.md#save)
* [saveModel](imodelsdatastore.md#savemodel)

## Methods

###  deleteModel

▸ **deleteModel**(`name`: any): *Promise‹void›*

Defined in bpmnServer/src/interfaces/datastore.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹void›*

___

###  findEvents

▸ **findEvents**(`query`: any): *Promise‹any[]›*

Defined in bpmnServer/src/interfaces/datastore.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any[]›*

___

###  getList

▸ **getList**(): *Promise‹string[]›*

Defined in bpmnServer/src/interfaces/datastore.ts:28

**Returns:** *Promise‹string[]›*

___

###  getSVG

▸ **getSVG**(`name`: any): *Promise‹string›*

Defined in bpmnServer/src/interfaces/datastore.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹string›*

___

###  getSource

▸ **getSource**(`name`: any): *Promise‹string›*

Defined in bpmnServer/src/interfaces/datastore.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹string›*

___

###  import

▸ **import**(`data`: any): *any*

Defined in bpmnServer/src/interfaces/datastore.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *any*

___

###  install

▸ **install**(): *any*

Defined in bpmnServer/src/interfaces/datastore.ts:37

**Returns:** *any*

___

###  load

▸ **load**(`name`: any): *Promise‹[IDefinition](idefinition.md)›*

Defined in bpmnServer/src/interfaces/datastore.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[IDefinition](idefinition.md)›*

___

###  loadModel

▸ **loadModel**(`name`: any): *Promise‹[IBpmnModelData](ibpmnmodeldata.md)›*

Defined in bpmnServer/src/interfaces/datastore.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹[IBpmnModelData](ibpmnmodeldata.md)›*

___

###  renameModel

▸ **renameModel**(`name`: any, `newName`: any): *Promise‹boolean›*

Defined in bpmnServer/src/interfaces/datastore.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`newName` | any |

**Returns:** *Promise‹boolean›*

___

###  save

▸ **save**(`name`: any, `bpmn`: any, `svg?`: any): *Promise‹boolean›*

Defined in bpmnServer/src/interfaces/datastore.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`bpmn` | any |
`svg?` | any |

**Returns:** *Promise‹boolean›*

___

###  saveModel

▸ **saveModel**(`model`: [IBpmnModelData](ibpmnmodeldata.md)): *Promise‹boolean›*

Defined in bpmnServer/src/interfaces/datastore.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`model` | [IBpmnModelData](ibpmnmodeldata.md) |

**Returns:** *Promise‹boolean›*
