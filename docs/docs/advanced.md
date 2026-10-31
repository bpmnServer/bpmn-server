# Advanced Topics
## command line interface

```sh
>npm run cli
```
```{.text hl_lines="15-16"}
server started..
Commands:
        q       to quit
        s       start process
        lo      list outstanding items
        li      list items
        l       list instances for a process
        di      display Instance information
        i       Invoke Task
        sgl     Signal Task
        msg     Message Task
        d       delete instnaces
        lm      List of Models
        lme     List of Models
        ck      Check locked instnaces
        re      Recover hung processes
        lu      List Users
        spw     Set User Password
        ?       repeat this list
Enter Command, q to quit, or ? to list commands
>
```

## Instance Locking

Instance Locking is provided to ensure concurrencies supporting multiple nodeJS servers running against same MongoDB.
This is also useful, when having one server, since there is a potential of multiple requests can be running against the same instance.

The intent is to ensure that only one process/executing is running against the instance, others have to wait till completion.

This is acomplished through `wf-locks` MongoDB collection.

When a server encounter failure, running instances may remain locked, this scenario can be repaired through `cli` command as above

## Scalability Feature

Scalability feature works out the box, no additional action on your part.

- define servers pointing to same MongoDB
- set SERVER_ID to unique values for each server
- Only one server should have CRON (timers on), others should be:

```
const server = new BPMNServer(configuration, logger,{cron:false});

```
## Concurrency Implementation
- Workflow instances are database bound; retrieved and saved all the time
- Before retrieving the instance, a lock is issued against it in collection `wf-locks`
- After execution of an instance is complete and data is saved, lock is released.
- This to ensure only one operation can be performed against the workflow at any time, other operations will have to wait for the lock to be released.
- The scope of the lock is the workflow instance only, other instances of same model or different models can still be executed

# Hung Tasks

When running long running tasks and a system failure occures, bpmn-server saves the activity state at start and recognize the hung task on restart

`cli` provides with an option to recover, however, you can write your own code :

To detect hung instances:

```js
	var list = await server.dataStore.findItems({ "items.status": "start" });
```
To recover:

```js
		let ret = await api.engine.invoke({ "items.id": item.id }, {}, null, { recover: true });
```

# Data Archiving

`scripts/archive` tools takes 2 parameters
1.  days to archive :   ex: 30      - all instances completed more than 30 days will be moved to archive
2.  days to clean archive:  ex: 120 - all instances completed more than 120 days will erased from archive

```sh
PS C:/bp/dev/bpmn-web> node dist/scripts/archive 30 120
```
```text
BPMNServer from  C:\bp\dev\bpmn-server\dist\server\BPMNServer.js
appDelegate from  C:\bp\dev\bpmn-web\dist\WorkflowApp\appDelegate.js
bpmn-server version 2.1.12
server started..
****Security is disabled as requested in .env****
Require 2 parameters: 1) daysToArchive 2) daysToCleanArchive
```

# Restarting Completed Workflow

Restarting an already completed instance at a particular node is acheived by calling [api.engine.restart](./api/classes/APIEngine.md/#restart)

 this function requires dataStore.enableSavePoints to be true in configuration.ts

 ```ts
 		dataStore: function (server) {
			let ds=new DataStore(server);
			ds.enableSavePoints=true;
			return ds;
		},
 ```
 
 this add a savePoint for each item, allowing you to select that item to restore it.

see test scenario `/src/test/feature/restart1.js`


# Performance Benchmark

To run your own benchmark, change `.env`
```.env
ENABLE_PROFILER=true
```
As a result mongoDB operations will be timed as below 

To run a complete benchmark, see `src/examples/stress.ts` in the bpmn-web 
```text
------------- at start after cleaning the data
-- only 100 instances and 100 items in wait state
   
start Buy Used Car
>mongo.insert:wf_locks: 0.636ms
>mongo.insert:wf_instances: 0.597ms
>mongo.update:wf_instances: 0.762ms
>mongo.remove:wf_locks: 0.667ms
>mongo.find:wf_instances: 0.038ms
>mongo.insert:wf_locks: 0.294ms
>mongo.find:wf_instances: 0.029ms
>mongo.update:wf_instances: 0.86ms
>mongo.update:wf_instances: 0.889ms
>mongo.remove:wf_locks: 0.336ms
invoke: 6.654ms
>mongo.find:wf_instances: 0.033ms
>mongo.insert:wf_locks: 0.254ms
>mongo.find:wf_instances: 0.024ms
>mongo.update:wf_instances: 3.013ms
>mongo.remove:wf_locks: 0.716ms
>mongo.find:wf_instances: 0.057ms
>mongo.insert:wf_locks: 0.43ms
>mongo.find:wf_instances: 0.064ms
>mongo.update:wf_instances: 3.861ms
>mongo.remove:wf_locks: 1.455ms
invoke: 13.06ms
>mongo.find:wf_instances: 0.09ms
find: 40.099ms
find returned  102
>mongo.find:wf_instances: 0.042ms
>mongo.insert:wf_locks: 0.329ms
>mongo.find:wf_instances: 0.026ms
>mongo.update:wf_instances: 2.094ms
>mongo.update:wf_instances: 1.636ms
>mongo.remove:wf_locks: 0.414ms
invoke: 9.778ms
car-0: 84.167ms

   
start Buy Used Car
>mongo.insert:wf_locks: 0.31ms
>mongo.insert:wf_instances: 0.409ms
>mongo.update:wf_instances: 1.852ms
>mongo.remove:wf_locks: 0.408ms
>mongo.find:wf_instances: 0.034ms
>mongo.insert:wf_locks: 0.291ms
>mongo.find:wf_instances: 0.011ms
>mongo.update:wf_instances: 1.629ms
>mongo.update:wf_instances: 4.226ms
>mongo.remove:wf_locks: 0.489ms
invoke: 25.918ms
>mongo.find:wf_instances: 0.017ms
>mongo.insert:wf_locks: 0.332ms
>mongo.find:wf_instances: 0.012ms
>mongo.update:wf_instances: 2.148ms
>mongo.remove:wf_locks: 0.421ms
>mongo.find:wf_instances: 0.019ms
>mongo.insert:wf_locks: 0.291ms
>mongo.find:wf_instances: 0.011ms
>mongo.update:wf_instances: 2.885ms
>mongo.remove:wf_locks: 0.648ms
invoke: 15.015ms
>mongo.find:wf_instances: 0.018ms
find: 78.44ms
find returned  102
>mongo.find:wf_instances: 0.026ms
>mongo.insert:wf_locks: 0.512ms
>mongo.find:wf_instances: 0.018ms
>mongo.update:wf_instances: 4.985ms
>mongo.update:wf_instances: 3.111ms
>mongo.remove:wf_locks: 0.753ms
invoke: 51.493ms
car-7074: 200.918ms


start Buy Used Car
>mongo.insert:wf_locks: 0.236ms
>mongo.insert:wf_instances: 0.356ms
>mongo.update:wf_instances: 1.753ms
>mongo.remove:wf_locks: 0.401ms
>mongo.find:wf_instances: 0.018ms
>mongo.insert:wf_locks: 0.262ms
>mongo.find:wf_instances: 0.009ms
>mongo.update:wf_instances: 1.711ms
>mongo.update:wf_instances: 1.899ms
>mongo.remove:wf_locks: 0.71ms
invoke: 24.353ms
>mongo.find:wf_instances: 0.021ms
>mongo.insert:wf_locks: 0.22ms
>mongo.find:wf_instances: 0.01ms
>mongo.update:wf_instances: 2.041ms
>mongo.remove:wf_locks: 0.333ms
>mongo.find:wf_instances: 0.016ms
>mongo.insert:wf_locks: 0.19ms
>mongo.find:wf_instances: 0.008ms
>mongo.update:wf_instances: 2.282ms
>mongo.remove:wf_locks: 0.349ms
invoke: 15.213ms
>mongo.find:wf_instances: 0.015ms
find: 66.448ms
find returned  102
>mongo.find:wf_instances: 0.019ms
>mongo.insert:wf_locks: 0.272ms
>mongo.find:wf_instances: 0.009ms
>mongo.update:wf_instances: 2.736ms
>mongo.update:wf_instances: 2.598ms
>mongo.remove:wf_locks: 0.506ms
invoke: 29.052ms
car-10000: 170.839ms
STRESS: 23:03.831 (m:ss.mmm)
```