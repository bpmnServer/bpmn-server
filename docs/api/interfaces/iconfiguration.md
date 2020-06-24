[bpmn-server](../README.md) › [IConfiguration](iconfiguration.md)

# Interface: IConfiguration

## Hierarchy

* **IConfiguration**

## Implemented by

* [Configuration](../classes/configuration.md)

## Index

### Properties

* [database](iconfiguration.md#database)
* [definitionsPath](iconfiguration.md#definitionspath)
* [logger](iconfiguration.md#logger)
* [timers](iconfiguration.md#timers)

### Methods

* [appDelegate](iconfiguration.md#appdelegate)
* [dataStore](iconfiguration.md#datastore)
* [definitions](iconfiguration.md#definitions)

## Properties

###  database

• **database**: *object*

Defined in src/interfaces/common.ts:11

#### Type declaration:

* **MongoDB**(): *object*

  * **db**: *string*

  * **db_url**: *string*

___

###  definitionsPath

• **definitionsPath**: *string*

Defined in src/interfaces/common.ts:6

___

###  logger

• **logger**: *[ILogger](ilogger.md)*

Defined in src/interfaces/common.ts:19

___

###  timers

• **timers**: *object*

Defined in src/interfaces/common.ts:7

#### Type declaration:

* **forceTimersDelay**: *number*

* **precision**: *number*

## Methods

###  appDelegate

▸ **appDelegate**(`server`: any): *[IAppDelegate](iappdelegate.md)*

Defined in src/interfaces/common.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[IAppDelegate](iappdelegate.md)*

___

###  dataStore

▸ **dataStore**(`server`: any): *[IDataStore](idatastore.md)*

Defined in src/interfaces/common.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[IDataStore](idatastore.md)*

___

###  definitions

▸ **definitions**(`server`: any): *[IModelsDatastore](imodelsdatastore.md)*

Defined in src/interfaces/common.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[IModelsDatastore](imodelsdatastore.md)*
