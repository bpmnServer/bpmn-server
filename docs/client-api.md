
## BPMNClient/WebAPI

BPMNClient is a lightweight Node package to remotely access bpmn-server using bpmn-server WebApi

[See code Example using bpmn-clienthere](examples/BuyCar-Remote.md)

Alternatively, you can access bpmn-server through http(https) calls, [view Postman documentation](https://documenter.getpostman.com/view/11781516/Szzn7wsm)

bpmn-server provides api calls to the following objects:

- [engine](#engine) 
- [dataStore](#datastore)
- [definitions](#definitions) 

## WebServices Architecture

Web Applications can use **bpmn-server**  WebServices to manage workflow in a similar manner described here:

- App logic decides to start a Process or throw a Message
- App UI display to the User list of Processes to Start
- App UI display to the User list of outstanding User Tasks to execute and prompt user for input parameters (if required)
- Workflow App can notify involved users of new User Tasks

## engine:

Perform WebAPI calls to the execution Engine 


| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
| **start** | name, input , startNodeId?,options? 	 | [Instance](api/interfaces/IInstanceData.md) | - Start a new Process execution |
| **invoke**| [itemQuery](data.md#item-query) ,input |	[Instance](api/interfaces/IInstanceData.md) | Invoke an already started Item (waiting)  |
| **throwMessage**|messageId,input| [Instance](api/interfaces/IInstanceData.md) | Issue a signal or message|
| **throwSignal**|signalId,input| [Instance](api/interfaces/IInstanceData.md) | Issue a signal or message|
| **get**|[instanceQuery](data.md#instance-query) |		[Instance](api/interfaces/IInstanceData.md) | Get an already running or idle Instance |
| **status**| |		 | Return as list of running instances or recently completed |


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
| **findInstances** | [instanceQuery](data.md#instance-query) 	 | [Instance[]](api/interfaces/IInstanceData.md) | |
| **findItems**| [itemQuery](data.md#item-query)|	[Item[]](api/interfaces/IItemData.md) | |
| **deleteInstances**| [instance](data.md#instance-query)|	[Item[]](api/interfaces/IItemData.md) | |

