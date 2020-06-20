[bpmn-server](../README.md) › [IModelsDatastore](imodelsdatastore.md)

# Interface: IModelsDatastore

## Hierarchy

* **IModelsDatastore**

## Index

### Properties

* [definitionsPath](imodelsdatastore.md#definitionspath)

### Methods

* [getList](imodelsdatastore.md#getlist)
* [getSVG](imodelsdatastore.md#getsvg)
* [getSource](imodelsdatastore.md#getsource)
* [save](imodelsdatastore.md#save)

## Properties

###  definitionsPath

• **definitionsPath**: *any*

Defined in src/interfaces/server.ts:71

## Methods

###  getList

▸ **getList**(): *string[]*

Defined in src/interfaces/server.ts:72

**Returns:** *string[]*

___

###  getSVG

▸ **getSVG**(`name`: any): *string*

Defined in src/interfaces/server.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *string*

___

###  getSource

▸ **getSource**(`name`: any): *string*

Defined in src/interfaces/server.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *string*

___

###  save

▸ **save**(`name`: any, `bpmn`: any, `svg?`: any): *boolean*

Defined in src/interfaces/server.ts:75

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`bpmn` | any |
`svg?` | any |

**Returns:** *boolean*
