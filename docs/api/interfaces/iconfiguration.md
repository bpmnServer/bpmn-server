[bpmn-server](../README.md) › [IConfiguration](iconfiguration.md)

# Interface: IConfiguration

## Hierarchy

* **IConfiguration**

## Implemented by

* [Configuration](../classes/configuration.md)

## Index

### Properties

* [apiKey](iconfiguration.md#apikey)
* [database](iconfiguration.md#database)
* [definitionsPath](iconfiguration.md#definitionspath)
* [logger](iconfiguration.md#logger)
* [templatesPath](iconfiguration.md#templatespath)
* [timers](iconfiguration.md#timers)

### Methods

* [appDelegate](iconfiguration.md#appdelegate)
* [dataStore](iconfiguration.md#datastore)
* [definitions](iconfiguration.md#definitions)

## Properties

###  apiKey

• **apiKey**: *string*

Defined in bpmnServer/src/interfaces/common.ts:19

___

###  database

• **database**: *object*

Defined in bpmnServer/src/interfaces/common.ts:12

#### Type declaration:

* **MongoDB**(): *object*

  * **db**: *string*

  * **db_url**: *string*

___

###  definitionsPath

• **definitionsPath**: *string*

Defined in bpmnServer/src/interfaces/common.ts:6

___

###  logger

• **logger**: *[ILogger](ilogger.md)*

Defined in bpmnServer/src/interfaces/common.ts:20

___

###  templatesPath

• **templatesPath**: *string*

Defined in bpmnServer/src/interfaces/common.ts:7

___

###  timers

• **timers**: *object*

Defined in bpmnServer/src/interfaces/common.ts:8

#### Type declaration:

* **forceTimersDelay**: *number*

* **precision**: *number*

## Methods

###  appDelegate

▸ **appDelegate**(`server`: any): *[IAppDelegate](iappdelegate.md)*

Defined in bpmnServer/src/interfaces/common.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[IAppDelegate](iappdelegate.md)*

___

###  dataStore

▸ **dataStore**(`server`: any): *[IDataStore](idatastore.md)*

Defined in bpmnServer/src/interfaces/common.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[IDataStore](idatastore.md)*

___

###  definitions

▸ **definitions**(`server`: any): *[IModelsDatastore](imodelsdatastore.md)*

Defined in bpmnServer/src/interfaces/common.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[IModelsDatastore](imodelsdatastore.md)*
