
## BPMNClient/WebAPI

BPMNClient is a lightweight Node package to remotely access bpmn-server using bpmn-server WebApi

[See code Example using bpmn-clienthere](./examples/BuyCar-Remote.md)

Alternatively, you can access bpmn-server through http(https) calls, [view Postman documentation](https://documenter.getpostman.com/view/11781516/Szzn7wsm)

bpmn-server provides api calls to the following objects:

- [engine](#engine) 
- [dataStore](#datastore)
- [definitions](#definitions) 

## engine:

Perform WebAPI calls to the execution Engine 

| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
| **start** | name, input , startNodeId?,options? 	 | [Instance](api/interfaces/iinstancedata.md) | - Start a new Process execution |
| **invoke**| [itemQuery](./dataQuery.md#item-query) ,input |	[Instance](api/interfaces/iinstancedata.md) | Invoke an already started Item (waiting)  |
| **throwMessage**|messageId,input| [Instance](api/interfaces/iinstancedata.md) | Issue a signal or message|
| **throwSignal**|signalId,input| [Instance](api/interfaces/iinstancedata.md) | Issue a signal or message|
| **get**|[instanceQuery](./dataQuery.md#instance-query) |		[Instance](api/interfaces/iinstancedata.md) | Get an already running or idle Instance |


## definitions

Perform calls to BPMN defintions


| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
|		list	|- |	string[] |
|		load	| name|	definition |

## datastore

Perform calls to DataStore , accessing processes data


| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
| **findInstances** | [instanceQuery](./dataQuery.md#instance-query) 	 | [Instance[]](api/interfaces/iinstancedata.md) | |
| **findItems**| [itemQuery](./dataQuery.md#item-query)|	[Item[]](api/interfaces/iitemdata.md) | |
| **deleteInstances**| [instance](./dataQuery.md#instance-query)|	[Item[]](api/interfaces/iitemdata.md) | |

