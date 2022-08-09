Concepts
=========


## Components

1. Server
2. Web UI
3. Client to invoke server calls as webServices
 
### Server Core



| Class | Role  | Life Cycle| holds |
| ------------- |:-------------:| -----| ----------|
| **Server**	| Represent BPMN2 definition | Entire | Server Components |
| **ExecutionContext**| holds the request context| one per request | UserInfo, Execution,Process,Item Response|
| **Engine**		| API to execution | per XContext | only XContext |
| **Execution**		| process the execution and State | per Instance lifecycle ,cached, saved and restored thru Instance |execution State, tokens.. |
| **Instance**		| Instance of Process | statefull (in MongoDB) | source, items , tokens, state |
| **Definition**	| Represent BPMN2 definition | transient | |
| **Process**		| Primary Process running | transient | |

## Presistence 

## Extensions



## Workflow


Workflow is a state machine. You can imagine it as a flow chart running inside in your application, and when it reach a decision point, you can invoke a method to provide an answer that chooses the right path of execution from there. 

So workflow is a graph of control flow, and activities are its nodes. They can be as simple like an if..then..else branch, or as complex like getting data from a database and do something complicated depending on the results.

A workflow is an application running inside in your application, have its state and variables, and correlated across Node.js cluster and process instances. So if your Node.js application consists of many instances inside a cluster and many clusters across a server farm, a workflow instance will work like a single instance application within those. A workflow application could outlive Node.js applications, they have out-of-the-box persistence support to make them ideal platform to do long running business processes, durable services or scheduled backgound tasks.

Workflow is modeled using BPMN2 tools and is defined in as an XML string or stream. Each element in the model is called a <b>Node</b>, nodes are connected by <b>Flow</b>.

## Definition

## Engine

<b>Execution</b> is the processing engine of the workflow, taking in an BPMN source and executes it.

<b>Server</b> provides a complete environment through the following services:
- ModelDatastore: a mechanism to retrieve and save BPMN definitions
- DataStore to save Workflow Instances and related data
  - Execution monitor: to monitor changes to execution and save data
  - Instance loader
  - Find instances and items
- InstanceCache: to keep current instances in memory
- EventsRegistry: to handle events outside of the scope of processes
  - Timers 
  - Message and Signals calls from outside of the process

This is accomplished by providing a <b>ServerContext</b> that acts as a Service Container


```javascript
		const execution = new Execution(source,customizer, logger);

		execution.start(data,startNode);
```
Execution handles the entire definition, that can contain one or more processes.

Execution object will walk through BPMN definition starting for the startEvent and take various paths accoridng to the logic.

Execution uses tokens to walk the path, a <b>Token</b> represent a branch of the path.

Everytime a Node is executed an <b>Item</b> is created for the Node.

Therefore, you can query the execution of various items it performed:

```javascript

		let items =execution.getItems();
		items.forEach(item=>{
			console.log(`item id: ${item.id} - status: ${item.status});
		});
```

To continue with processing our example, The will invoke the Node 'Buy'

```javascript
		execution.signal({taskId:'Buy'},{
			model:'BMW' , needsCleaning: true ,needsRepairs: false);
```
Let us examine what is happening under the hood:

```javascript
    execution.getItems.forEach(i => {
        console.log(`item: ${i.id} - task Id - ${i.element.id} Type: ${i.element.type} status: ${i.status}`  );
    });

```
# Data Scope (during exectution)
The entire execution will have one data scope object, shared among all nodes except SubProcess and Loops (Multi-instances), 
each will have own item part of the data object

Example: Process input: CaseId
		  Task1 input: amountOwed
			subprocess1:	interest
		  loop instance1:	callDate
			
```javascript
    data: {
		caseId: 3421, amountOwed: 5201 ,
		subprocess1: { interest: 200 } ,
		loop { [{callDate: '01/01/2020' }
			]}
}
```


# Data Store


# Decisions

WF engine makes several decisions based on BPMN rules and definitions, the challenge is there an easy way to communicate those decisions back to the developer/support?


Everytime the engine makes a decision it attaches the appropriate decision object to item impacted

For example; If a gateway decides to select one flow over the other, you should see a record of that in the gateway item


# Process

Process is the a definition of a Workflow

# Activity

# Instance 

# Instance Item (Item)
