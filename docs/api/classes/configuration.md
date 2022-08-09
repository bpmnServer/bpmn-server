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

* [apiKey](configuration.md#apikey)
* [database](configuration.md#database)
* [definitionsPath](configuration.md#definitionspath)
* [logger](configuration.md#logger)
* [sendGridAPIKey](configuration.md#sendgridapikey)
* [templatesPath](configuration.md#templatespath)
* [timers](configuration.md#timers)

### Methods

* [appDelegate](configuration.md#appdelegate)
* [dataStore](configuration.md#datastore)
* [definitions](configuration.md#definitions)

## Constructors

###  constructor

\+ **new Configuration**(`__namedParameters`: object): *[Configuration](configuration.md)*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:27

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`ACL` | any |
`IAM` | any |
`apiKey` | any |
`appDelegate` | any |
`dataStore` | any |
`database` | any |
`definitions` | any |
`definitionsPath` | any |
`logger` | any |
`templatesPath` | any |
`timers` | any |

**Returns:** *[Configuration](configuration.md)*

## Properties

###  apiKey

• **apiKey**: *string*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[apiKey](../interfaces/iconfiguration.md#apikey)*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:17

___

###  database

• **database**: *object*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[database](../interfaces/iconfiguration.md#database)*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:15

#### Type declaration:

* **MongoDB**(): *object*

  * **db**: *string*

  * **db_url**: *string*

___

###  definitionsPath

• **definitionsPath**: *string*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[definitionsPath](../interfaces/iconfiguration.md#definitionspath)*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:12

___

###  logger

• **logger**: *[ILogger](../interfaces/ilogger.md)*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[logger](../interfaces/iconfiguration.md#logger)*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:16

___

###  sendGridAPIKey

• **sendGridAPIKey**: *string*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:18

___

###  templatesPath

• **templatesPath**: *string*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[templatesPath](../interfaces/iconfiguration.md#templatespath)*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:13

___

###  timers

• **timers**: *object*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md).[timers](../interfaces/iconfiguration.md#timers)*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:14

#### Type declaration:

* **forceTimersDelay**: *number*

* **precision**: *number*

## Methods

###  appDelegate

▸ **appDelegate**(`server`: any): *[IAppDelegate](../interfaces/iappdelegate.md)*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md)*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[IAppDelegate](../interfaces/iappdelegate.md)*

___

###  dataStore

▸ **dataStore**(`server`: any): *[DataStore](datastore.md)‹›*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md)*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[DataStore](datastore.md)‹›*

___

###  definitions

▸ **definitions**(`server`: any): *[ModelsDatastoreDB](modelsdatastoredb.md)‹›*

*Implementation of [IConfiguration](../interfaces/iconfiguration.md)*

Defined in bpmnServer/src/common/DefaultConfiguration.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[ModelsDatastoreDB](modelsdatastoredb.md)‹›*
