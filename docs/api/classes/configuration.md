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

* [appDelegate](configuration.md#appdelegate)
* [dataStore](configuration.md#datastore)
* [database](configuration.md#database)
* [definitions](configuration.md#definitions)
* [definitionsPath](configuration.md#definitionspath)
* [eventsRegistry](configuration.md#eventsregistry)
* [logger](configuration.md#logger)
* [timers](configuration.md#timers)

## Constructors

###  constructor

\+ **new Configuration**(`__namedParameters`: object): *[Configuration](configuration.md)*

Defined in src/common/DefaultConfiguration.ts:19

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`appDelegate` | any |
`dataStore` | any |
`database` | any |
`definitions` | any |
`definitionsPath` | any |
`eventsRegistry` | any |
`logger` | any |
`timers` | any |

**Returns:** *[Configuration](configuration.md)*

## Properties

###  appDelegate

• **appDelegate**: *[IAppDelegate](../interfaces/iappdelegate.md)*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[appDelegate](../interfaces/iconfiguration.md#appdelegate)*

Defined in src/common/DefaultConfiguration.ts:17

___

###  dataStore

• **dataStore**: *[IDataStore](../interfaces/idatastore.md)*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[dataStore](../interfaces/iconfiguration.md#datastore)*

Defined in src/common/DefaultConfiguration.ts:18

___

###  database

• **database**: *object*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[database](../interfaces/iconfiguration.md#database)*

Defined in src/common/DefaultConfiguration.ts:14

#### Type declaration:

* **MongoDB**(): *object*

  * **db**: *string*

  * **db_url**: *string*

___

###  definitions

• **definitions**: *[IModelsDatastore](../interfaces/imodelsdatastore.md)*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[definitions](../interfaces/iconfiguration.md#definitions)*

Defined in src/common/DefaultConfiguration.ts:16

___

###  definitionsPath

• **definitionsPath**: *string*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[definitionsPath](../interfaces/iconfiguration.md#definitionspath)*

Defined in src/common/DefaultConfiguration.ts:12

___

###  eventsRegistry

• **eventsRegistry**: *[IEventsRegistry](../interfaces/ieventsregistry.md)*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[eventsRegistry](../interfaces/iconfiguration.md#eventsregistry)*

Defined in src/common/DefaultConfiguration.ts:19

___

###  logger

• **logger**: *[ILogger](../interfaces/ilogger.md)*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[logger](../interfaces/iconfiguration.md#logger)*

Defined in src/common/DefaultConfiguration.ts:15

___

###  timers

• **timers**: *object*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[timers](../interfaces/iconfiguration.md#timers)*

Defined in src/common/DefaultConfiguration.ts:13

#### Type declaration:

* **forceTimersDelay**: *number*

* **precision**: *number*
