[bpmn-server](../README.md) › [Configuration](configuration.md)

# Class: Configuration

## Hierarchy

* **Configuration**

## Implements

* [IConfiguration](../interfaces/iconfiguration.md)

## Index

### Constructors

* [constructor](configuration.md#constructor)

### Properties

* [database](configuration.md#database)
* [definitionsPath](configuration.md#definitionspath)
* [logger](configuration.md#logger)
* [timers](configuration.md#timers)

### Methods

* [appDelegate](configuration.md#appdelegate)
* [dataStore](configuration.md#datastore)
* [definitions](configuration.md#definitions)

## Constructors

###  constructor

\+ **new Configuration**(`__namedParameters`: object): *[Configuration](configuration.md)*

Defined in src/common/DefaultConfiguration.ts:23

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`appDelegate` | any |
`dataStore` | any |
`database` | any |
`definitions` | any |
`definitionsPath` | any |
`logger` | any |
`timers` | any |

**Returns:** *[Configuration](configuration.md)*

## Properties

###  database

• **database**: *object*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[database](../interfaces/iconfiguration.md#database)*

Defined in src/common/DefaultConfiguration.ts:13

#### Type declaration:

* **MongoDB**(): *object*

  * **db**: *string*

  * **db_url**: *string*

___

###  definitionsPath

• **definitionsPath**: *string*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[definitionsPath](../interfaces/iconfiguration.md#definitionspath)*

Defined in src/common/DefaultConfiguration.ts:11

___

###  logger

• **logger**: *[ILogger](../interfaces/ilogger.md)*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[logger](../interfaces/iconfiguration.md#logger)*

Defined in src/common/DefaultConfiguration.ts:14

___

###  timers

• **timers**: *object*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[timers](../interfaces/iconfiguration.md#timers)*

Defined in src/common/DefaultConfiguration.ts:12

#### Type declaration:

* **forceTimersDelay**: *number*

* **precision**: *number*

## Methods

###  appDelegate

▸ **appDelegate**(`server`: any): *[DefaultAppDelegate](defaultappdelegate.md)‹›*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md)*

Defined in src/common/DefaultConfiguration.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[DefaultAppDelegate](defaultappdelegate.md)‹›*

___

###  dataStore

▸ **dataStore**(`server`: any): *[DataStore](datastore.md)‹›*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md)*

Defined in src/common/DefaultConfiguration.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[DataStore](datastore.md)‹›*

___

###  definitions

▸ **definitions**(`server`: any): *[ModelsDatastoreDB](modelsdatastoredb.md)‹›*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md)*

Defined in src/common/DefaultConfiguration.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[ModelsDatastoreDB](modelsdatastoredb.md)‹›*
