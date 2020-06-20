[bpmn-server](../README.md) › [IConfiguration](iconfiguration.md)

# Interface: IConfiguration

## Hierarchy

* **IConfiguration**

## Implemented by

* [Configuration](../classes/configuration.md)

## Index

### Properties

* [appDelegate](iconfiguration.md#appdelegate)
* [dataStore](iconfiguration.md#datastore)
* [database](iconfiguration.md#database)
* [definitions](iconfiguration.md#definitions)
* [definitionsPath](iconfiguration.md#definitionspath)
* [eventsRegistry](iconfiguration.md#eventsregistry)
* [logger](iconfiguration.md#logger)
* [timers](iconfiguration.md#timers)

## Properties

###  appDelegate

• **appDelegate**: *[IAppDelegate](iappdelegate.md)*

Defined in src/interfaces/common.ts:22

___

###  dataStore

• **dataStore**: *[IDataStore](idatastore.md)*

Defined in src/interfaces/common.ts:23

___

###  database

• **database**: *object*

Defined in src/interfaces/common.ts:12

#### Type declaration:

* **MongoDB**(): *object*

  * **db**: *string*

  * **db_url**: *string*

___

###  definitions

• **definitions**: *[IModelsDatastore](imodelsdatastore.md)*

Defined in src/interfaces/common.ts:21

___

###  definitionsPath

• **definitionsPath**: *string*

Defined in src/interfaces/common.ts:7

___

###  eventsRegistry

• **eventsRegistry**: *[IEventsRegistry](ieventsregistry.md)*

Defined in src/interfaces/common.ts:24

___

###  logger

• **logger**: *[ILogger](ilogger.md)*

Defined in src/interfaces/common.ts:20

___

###  timers

• **timers**: *object*

Defined in src/interfaces/common.ts:8

#### Type declaration:

* **forceTimersDelay**: *number*

* **precision**: *number*
