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

### One command, from the command line

A command after `--`, with the answers to its questions, runs just that and quits: for scripts, and for a server
(on one made by the installer, `owf cli ...` does the same). A yes/no question it does not answer is yes.

```sh
npm run cli -- lm                 # the models
npm run cli -- co                 # the connectors
npm run cli -- cod asana          # delete the connector asana
npm run cli -- spw alice N3w-pass # set alice's password
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

The console's `re` does this, and the Admin dashboard lists hung items. A restart doesn't recover them by itself.

**A recovered step runs again from its start.** bpmn-server can't know how far it got before the failure, so a service that had already sent an email or charged a card does so again. Make services that have side effects safe to repeat, for example with the instance and item ids as an idempotency key, or check before recovering. Timers aren't affected: one that falls due while the engine is down fires once when it's back.

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

For measured figures (speed, load, memory, the effect of the indexes) and the commands that reproduce them, see [Performance and test coverage](performance.md).

To time the queries of [dataStore.find](data_find.md) in your own application, set this in `.env`:
```.env
ENABLE_PROFILER=true
```
Each such query is then printed with its time, for example `find: 40.099ms`, and its count, `find-count`.
