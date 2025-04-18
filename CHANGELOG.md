# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!---
your comment goes here
and here
## [Unreleased]
### Added

### Changed
-->
## Release 2.3.5  -- 2025-04-09
= enhance `dataStore.find` added more scenarios see docs/data_find.md

## Release 2.3.4  -- 2025-04-09
= enhance `dataStore.find` to ignore items 

## Release 2.3.3  -- 2025-03-27
- Avoid code blocking, adding puase() between operations
- Minor changes to logging
- Fix bugs in input/output parameters
## Release 2.3.2  -- 2025-03-26
- Added method `dataStore.find` to use mongodb aggregate function #247
- Added support for `python scripts`, now scripts stating with `$py` are treated as python, see `engine.ScriptHandler.ts` #248
## Release 2.3.1  -- 2025-03-20
- Fix bug, savePoints not saved
- Improved logging to help with animation
- Added variable `instance` to all javascript triggers to access root data: so 
```js
  instance.data // now refers to root data available to all subprocesses or loop items
```
## Release 2.3.0  -- 2025-03-14
Added Support for DMN 1.3 Rules Engine

## Release 2.2.23  -- 2025-03-10

Enhance Datastore Configuration #246
- change collection names from default
- saving of logs is optional
- saving of source bpmn xml is optional

## Release 2.2.22  -- 2025-03-10
- Fix Bug # 245:
    Error Event causes process status to be ended , while still other tokens active, error cancel events first then process its flow
    Fix: move Token.TokenEnded(token) to Execution.CheckEnd()

## Release 2.2.21  -- 2025-03-03
- Patch fixes for previous release, fixing problems with loop and subprocessing ending

## Release 2.2.20  -- 2025-03-02
- Adjust parentToken for escalation to be parent of subprocess

## Release 2.2.19  -- 2025-02-24
- Fix bug that signalId, messageId are not being saved in item
- Change response signature of engine.throwSignal now returns array of {instanceId,itemId}
## Release 2.2.18  -- 2025-02-18
- Fix bugs with Loop , completed counter is now correct
- Fix bug with loop subprocess not proceeding
- Fix bug with standard loop
Issue #233 , Issue #237 , Issue #238 , Issue #235
## Release 2.2.17  -- 2025-01-24
- Fix bugs with escalation, also cancels pending items
## Release 2.2.16  -- 2025-01-23
- Fix bugs with loop firing twice
## Release 2.2.15  -- 2025-01-22
- Fix error when token.currentItem is missing
## Release 2.2.14  -- 2024-11-13
  To fix issue #231
- engine.invoke noWait option changed behaviour:
  Old Behaviour:  engine.invoke complete the target node and continue execution till a wait state of end of process
  New Behaviour:  with 'noWait' option now it will complete the target node and return before continue with the rest of the process till wait state
  Example:
```ts
    let res = await api.engine.start('test-wait-invoke', {},user);

    console.log('about to invoke with noWait option')
    res=await api.engine.invoke({ "id": res.instance.id, "items.elementId": 'Activity_0z113lq'},{},user,{noWait:true}),
    console.log(`invoked`,res.item.element.type,res.item.status);

    report(res.instance);
```
## Release 2.2.13  -- 2024-09-20
- All JavaScript triggers are now async
- ScriptHandler can be assigned to a different class at configuration.ts
- This release require changes configuration.ts to add scriptHandler, add the following to new Configuration call
```ts
		scriptHandler: function(server) {
			return new ScriptHandler();
		},
```

## Release 2.2.12  -- 2024-09-19
Fix bug #227 - Erorr Handler from direct boundary event

## Release 2.2.11  -- 2024-0822
Fix bug #222

## Release 2.2.10  -- 2024-08-10
1.  Added item.statusDetails to contail bpmnError code 
2.  item.output is now saved to the db

## Release 2.2.9  -- 2024-08-09
  Minor changes

## Release 2.2.7  -- 2024-06-19
  data.findItems: Added $in condition
  Fixed Bug with query in items.vars.<varname>
## Release 2.2.6  -- 2024-06-12
  rollback last commit
## Release 2.2.5  -- 2024-06-12
  fixed bug, instance.data is now impacted by change on item.input during validate
## Release 2.2.4  -- 2024-05-30
### engine:
  added api.engine.upgrade()
  ade(model:string,afterNodeIds:string[]):Promise<string[]|{errors}>;

### ModelsData
    added the following to process:
            candidateStarterGroups
            candidateStarterUsers
            historyTimeToLive
            isStartableInTasklist
## Release 2.2.3  -- 2014-05
- Fixed bug with callTask
- JavaScript events errors now throw exceptions
- Logger.log  is now optional:  {includeLog: true}
- DataStore.findInstances now accepts sort as an option

```
	 * @param option
	 * 		-'summary'	minimal data
	 * 		- 'full'
	 * 		- {projection,sort} 
	async findInstances(query, option: 'summary' | 'full' | any = 'summary'): Promise<IInstanceData[]>{

```
- Added execution option: 'parentItemId' for callService
```
		if (options['parentItemId']) {
			execution.instance.parentItemId=options['parentItemId'];
		}
```
- Fix issue with async scripts for 'Task Assignment' by adding return

```
        else if (exp.startsWith('#')) {
            val = await ScriptHandler.executeScript(item, 'return '+exp.substring(1));
        }
```
## Release 2.2.1  -- 2014-04
### Fix Issue 186 
-  Loops/SubProcess/Transactions directly after gateways caused error of a token without any items, since loops create own tokens, fix: borrow item for subprocess
## Release 2.2.0  -- 2014-04
### API - no changes
### Events
- Added eventsDetails to event to include more details
### Logging:
-  some improved logging , log level
### Datastore:
-  findInstnaces options accepts projection
### Cancel/End processing
- almost total rewrite of the Cancel/End processing for nodes, loops
### Testing
- More test cases focusing in Loops, Transactions
## Release 2.1.13 -- 20414-04
Fix Issue #194 , loops inside loops 
## Release 2.1.10  -- 2024-03
- Now support escalation and error code in defining the catchEvent
- Added return { bpmnError:'code'}
- Added return {  escalation:'code'}
- Added process.exception event
- Added data sanitanizer 
- Fixed bug with gateway, added test scenario
- Fixed bug with loop and subprocess, loop and subprocess have own item now 
- Moved docs to mkDocs host at github.io
## Release 2.1.6  -- 2024-03
### Added
- .env.ENABLE_PROFILER will display MONGODB timing on console
- server.dataStore.archive(query)

## Release 2.1.5  -- 2024-03
- Add support to ad-hoc subprocesses
- Removed reference to UserService from back-end, kept in front-end only
- Fixed bug with subprocess not ending correctly
### Loop Changes:
- Change itemKey to contain entire dataPath
- Change Data Structure for loop from Array to Object
- Fixed bug with loop info not loaded on restore

## Release 2.1.0  -- 2024-03
### API model:
- Add: ```get(query:any ,user: ISecureUser): Promise<object[]>```  returns full model data, including documentation
- Change: ```getList(..)``` returns only names
### API engine

- Add: ```   restart(itemQuery, data:any,user:ISecureUser, options?:IEngineOptions) :Promise<IExecution>``` 
    restarting an already completed instance at a particular node
 


## Release 2.0.1 -- 2024-02
- Moved webApp as a separate Repo 
- Changed install procedure 
- Compile src into dist , repos only include src (TS)
- Re-Write docs 
- Added Docusaruas
- Configuration.ts: - Added UserService
- AppServices.ts is the location for all services
- Logger: added `info` to summarize actions
- Support TaskListener 
- Input/Output Variables now supports multiple types
- Timer: now supports timeDate type and repeat
- Process: supports script events
- ServiceName can now include child objects
- UserService: added `validate` Event

## Release 1.5.0 -- 2023-11
- New API
- Added User Authentication for WebApp
- Added User Management; Signup and Admin
- Added Assign function, users can Assign other users to the task
- Improved Users Interface to support above changes 

## Release 1.4.1 -- 2023-10-2
- Added Instance Locking, supporting multiple nodeJS servers running against same MongoDB
- Support lanes as role see [userAssignment](security.md#Pool-as-a-role) 
- Improve documentation

## Release 1.4.0 -- 2023-09-20

- Removes ACL/IAM and relies on the front-end to provide user authentication
- Uses UserTask assignment fields to capture assignment information
-- Add assignment fields to Item class
-- see [userAssignment](security.md) for details


## Release 1.3.22 -- 2023-05-18
-Fixed Issue with DataObject interface 
-Added item.vars to storage
## Release 1.3.21 -- 2023-05-16
-Fixed Issue Exclusive Gateway Convergence #87
## Release 1.3.18 -- 2023-05-07
- Fixed Issue # 84 https://github.com/ralphhanna/bpmn-server/issues/84
- Fixed Issue with Input Parameters #85
- Fixed Request to update dependencies #79   

## Release 1.3.15 -- 2022-11-20

- Added to .env
    definitions_path
- Timer now supports Repeat format R3PT15M
- Fixed bug with gateway converge
- Added the following to API
  - definitions/import
  - definitions/delete
  - definitions/rename


## Release 1.3.10 -- 2022-09-20
- SendTask is working same as Service Task - Issue #58
- Support Repeat Timers using format R3/PT3S
- Improved support for Error Event
    need to support errorId
- Added Escalation Event Type
- Added Transaction support
-   Cancel Transaction
-   Compensate Transaction
- Added Color scheme for Activity Status


## Release 1.3.9    - 2022-07-09

- SendTask now behaves same as ServiceTask
- BoundaryEvents
  - Handle interrupting and non-interrupting
  - Interrupting cancel the parent task and its flow

## Release 1.3.8    - 2022-07-09

- Fix errors in throwSignal/throwMessage in bpmn-client
- Fix errors in throwSignal/throwMessage in api [#52](https://github.com/bpmnServer/bpmn-server/issues/52)
- Fix bug showing instance 'end' while still running when in gateway
- Fix issue with editing element name in property panel [#54](https://github.com/bpmnServer/bpmn-server/issues/54)
- Include tmp folder in install [#56](https://github.com/bpmnServer/bpmn-server/issues/56)
- Minor changes to UI - preserve the last process



## Release 1.3.4    - 2022-01-09

Fix bugs with Throwing Messages and Signals

## Release 1.3.3    - 2022-31-08

### [Issue #41](https://github.com/ralphhanna/bpmn-server/issues/41) Fixed - configuring service task in BPMN-Properties-Panel

No need to edit the bpmn file.

### [Issue #42](https://github.com/ralphhanna/bpmn-server/issues/42) Fixed - running engines after processes end

Now engines are removed as they complete

### [Issue #43](https://github.com/ralphhanna/bpmn-server/issues/43) Fixed - Discrepancy with findItems

Now FindItems returns all the items within the instance that meet the condition



## Release 1.3.2    - 2022-30-08

Fixed import process error due to old version of connect-busboy


## Release 1.3.1    - 2022-30-08

Fixed compile error with updated tsc


## Release 1.3.0    - 2022-21-08

This is a major release, requires an upgrade and changes to existing code base.

### Support bpmnjs properties-panel

Provides a UI to edit bpmn definition, therefore, no longer a need to edit the bpmn file

In order to provide this, changes to bpmn specification to be more compliant as follows:

#### Event Script definition

- the only events are: start,end 
- old format:

```xml

    <bpmn:startEvent id="StartEvent_1ohx91b">
      <bpmn:extensionElements>
        <camunda:script event="start"><![CDATA[
        console.log("This is the start event");
          this.applyInput({records:[1,2,3]});
          console.log(this.data);
          console.log("This is the start event");]]></camunda:script>
      </bpmn:extensionElements>
      <bpmn:outgoing>Flow_18xinq3</bpmn:outgoing>
    </bpmn:startEvent>
    
```
- New format:
```xml
      <bpmn2:extensionElements>
        <camunda:executionListener event="start">
          <camunda:script scriptFormat="JavaScript">
			script1
		  </camunda:script>
        </camunda:executionListener>
        <camunda:executionListener event="end">
          <camunda:script scriptFormat="JavaScript">
			script2
			</camunda:script>
        </camunda:executionListener>
      </bpmn2:extensionElements>
```


#### Input/Output Definition

Handling Input and Output has changed please [this for details](data.md#Input-Output_Data)

#### Conditional Flow
- Old Format:
```xml
    <bpmn:conditionExpression xsi:type="bpmn:tExpression">
		<![CDATA[(this.needsCleaning=="Yes")]]>
	</bpmn:conditionExpression>
```
- New Format:
```xml 
    <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" language="JavaScript">
		(item.data.needsCleaning=="Yes")
	</bpmn:conditionExpression>
```


## Release 1.2.5    - 2022-16-08
Added API
    engine/status


## Release 1.2.4    - 2022-08-08
### Added:

- Access Control Rules 
- Client API can specify the userId 
- Improved documentation


## Release 1.2.0    - 2022-08-08

Added WebAPI calls
Added Remote access through bpmn-client package
improved documentation

## Release 1.1.4    - 2020-07-21

### Added
- docs\examples.md add lot more examples
- engine.start(...,options)
- AppDelegate now has serviceProvider class as a separate object
- 

### Changed
- signature to service calls
  - old format: service(item);
  - new format: return=service(input,executionContext);

### Removed
-   server.cron.checktimers();