# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!---
your comment goes here
and here
## [Unreleased]
### Added
- `engine.start(..., options.instanceId)`: the caller may name the instance (an application whose record of it shares its id).

### Changed
-->
## Release 3.5.0 — init, ${...} expressions, scripts in the debugger (2026-11-02)
bpmn-server, bpmn-web and bpmn-client are now one repository (bpmnServer/bpmn-server) and are released
together, with the same version.

### Upgrading from 3.2
Applications on bpmn-web 3.1 get this release on their next install. What can change for a model that ran on
3.2 (details: [What's new in 3.x](https://bpmnserver.github.io/docs/whats-new-3), Upgrading from 3.2):
- A text with `${...}` in it is evaluated: a Camunda-style bare name (`${id}`) now fails the run; write
  `${data.id}`. `bpmn-server verify` lists them (`expression-unknown-name`).
- Decision tables: columns are read by their input expression (not their label); no matching rule gives `null`
  or `[]` (not `{}`); a missing decision stops the task with a message naming it.
- `item.userName` of a completed task is the user who completed it.
- A failing script or expression throws its own error, not a new `Error` made from it.
- The model check has more checks: models that checked clean may show issues.

**Known issue:** an inclusive gateway that takes only one of its several outgoing flows stops the run
(`this.currentNode.getOutbounds is not a function`); 3.2 does the same.
The sample application leaves out its `employee-onboarding` model, which runs into it, until this is fixed.

### init: an application on bpmn-server and bpmn-web
- `npx bpmn-server init [folder]` creates a workflow application with bpmn-server and bpmn-web as its
  dependencies, then runs `npm install`. It asks what it is not told: `--mongo <url>` or `--memory` (a
  MongoDB in the application's process, mongodb-memory-server, to try it without a database server),
  `--port`, `--api-only` / `--ui-only`, `--no-auth` (no sign-in and no security rules, for development);
  `--no-install`, `--yes`. `.env` gets generated keys; `docker-compose.yml` runs a MongoDB when one is needed.
- It creates the sample application (bpmnServer4's `sampleApp`): models (Hello, Buy Used
  Car, Leave Application, Business Rules with its decision table), the services they call
  and element templates (`connectors/`), the app delegate (`delegates/`), `settings/config.ts`, `index.ts`.
  `--minimal` creates a one-model Hello application.
- The application's `package.json` takes the template's scripts and dependencies; `bpmn-server` and
  `bpmn-web` are this bpmn-server's version (the two are released together, with the same version).
  `.env` has `SERVE` (both, api or ui) for `--api-only` / `--ui-only`.
- Packing bpmn-server copies `sampleApp` into `templates/app` (`npm run template`, run by `prepack`;
  `postpack` removes it); in the repository, `init` reads `sampleApp` itself.

### Engine
- `engine.restart(..., { rewind: true })`: an instance that has not ended goes back to an item too, from the
  save point where it waited: a waiting task waits again, another element runs again.
- Instance flags, `engine.start(..., { flags })`, saved with the instance: `savePoints`, `saveLogs`; unset, the
  data store's `enableSavePoints` and `saveLogs` apply.
- Decisions in the log (entries of type `decision`; `Logger.decision`): a flow's condition with the values it
  read and whether it was taken; the flows a gateway took and why (the default flow, several conditions held at
  an exclusive gateway, none could be taken); a joining gateway waiting for its branches; the event that won at
  an event-based gateway; a timer's due time and what set it.
- An invoked item's `userName` is the user who invoked it (it kept the user of the call that created it), so
  completed tasks can be listed by who completed them.

### Fixed
- A user task whose form has no fields (`<camunda:formData />`) failed to load (`Cannot read properties of
  undefined (reading 'forEach')`): saving the model failed, and so did the pages that load it, such as the
  instance page.

### Tests
- The engine's feature scenarios (`test/scenarios`, mocha) moved to bpmnServer4's `testSampleApp`, where they
  run on the sample application's delegate; mocha, chai and mocha-cakes-2 are no longer dev dependencies.

### Scripts and expressions in the debugger
- A model's scripts and expressions are compiled under names that say where they are,
  `bpmn:///<model>/<element>/<label>.js` (labels: the event of a listener, `script`, `condition`, an
  assignment's attribute, `collection`; a process's own scripts under `process`), numbered from their own first
  line. A debugger lists them by name and stops at their breakpoints and at `debugger;`; an error's stack points
  at the element and line.
- A failing script or expression throws its own error (its type, message and stack), not a new `Error` made from
  it; the error log names the script instead of printing the generated code.
- `IScriptHandler.evaluateExpression` and `executeScript` take an optional `label`.

### Package exports
- `repository`: bpmnServer/bpmn-server, folder `packages/bpmn-server` (the repository holds bpmn-server,
  bpmn-web, bpmn-client, the docs and the sample application).
- `exports`: `.` is the build as before (`dist/index.js`, its types); with the `bpmn-source` condition it is
  the TypeScript source (`src/index.ts`), for running from the source under tsx (bpmnServer4's `npm run dev`).
  `./*` keeps every other path of the package importable, as it was without an `exports` map.

### Expressions: ${...}
- `${js}` as a whole value is an expression, like `$js` and `$(js)`: conditions, assignments, timers,
  input parameters, loop collections.
- A text with `${...}` parts has each part's value filled in: `Order ${data.id} for ${data.customer}` (input
  parameters), `${data.region}-managers,auditors` (assignments, split at commas after), `PT${data.hours}H` (timers).
  An application's own script handler gets each part through its `evaluateExpression`.
- The model check compiles the `${...}` parts too, and reports Camunda habits: JUEL operators
  (`expression-juel`: `gt`, `and`, `eq`, ... with the JavaScript to write), names an expression does not have
  (`expression-unknown-name`: `amount` is `data.amount`), and a `${` without its `}` (`template-not-closed`).
  Input parameters are now checked as well.

### Data objects
- A data object (or data store) connected to an element by a data association, either way, is loaded by the
  application when the element runs: `appDelegate.loadDataObject(name, item)` (optional), its result put in the
  instance data under the name the diagram shows (`data.client`) and saved with the instance. Later elements
  read and change it like any data.
- `verifyModel`: `data-object-not-loaded` (a data object connected to nothing) and `no-data-object-loader`
  (the application has no `loadDataObject`).

### Decisions (DMN)
- Business rule tasks evaluate decisions as the DMN standard describes them, with FEEL (feelin) for input
  expressions and cells: quoted text, ranges (`[600..700]`), lists (`"gold","platinum"`), `not(...)`,
  comparisons, and FEEL expressions in output cells (`0.1 * income`). The earlier evaluator mis-read most of these.
- Hit policies: UNIQUE (the default; more than one match is an error), FIRST, PRIORITY and OUTPUT ORDER (by the
  output values' order), ANY, COLLECT with SUM, MIN, MAX or COUNT, RULE ORDER.
- Columns are read by their input expression (they were read by their label). Values arrive typed by the
  column (`"800"` from a form is 800 in an integer column).
- A file may hold several decisions; decisions that require others (DRDs) and literal expression decisions
  are evaluated.
- `camunda:decisionRef` names a file (`<name>.dmn.xml`) or a decision id in the models folder.
- The task's inputs are the instance data, overridden by its input parameters. `camunda:resultVariable` saves the
  result in the data; `camunda:mapDecisionResult` (singleEntry, singleResult, collectEntries, resultList)
  shapes it.
- **Changed:** when no rule matches, a single-hit table's result is `null` (it was `{}`) and a multi-hit
  table's is `[]`.
- Parsed files are kept until they change. The log says which rules matched; a missing decision or a cell that
  is not FEEL stops the task with a message that names it. No more console output.
- `DMNEngine` and `DMNParser` are exported.
- `verifyModel` checks business rule tasks against the models folder (or `options.decisionsFolder`; the CLI uses
  the model's folder): `decision-not-named`, `decision-not-found`, `decision-invalid` (unknown hit policy,
  cell counts, FEEL that does not parse), `decision-result-not-saved`, and `decision-input-from-data` (info).
- `verifyModel`: `parameter-is-text`, an input or output parameter written like an expression without its `$`.
- Samples: the Business Rules model and its loan approval table work (inputs had no `$`, the table had cells that
  were not FEEL).

### Timers
- Timers more than 24.8 days away (setTimeout's limit, 2^31-1 ms) are waited out in steps everywhere. Cron did
  this since 3.1.0; the timer's own fallback (a server without Cron) still passed the whole delay, which Node
  runs after 1 ms. A test now covers start timers and waiting timers of 30 and 40 days. **3.0.x and earlier fire
  such timers at once, and a start timer starts an instance every millisecond: upgrade.**
- A model's start timer record (`events[].timeDue`) held a promise (the timer's async timeDue(), not awaited):
  stored as `{}` by MongoDB, refused by the in-memory store, and an unhandled rejection for a `$` expression. It
  is now the first due time, or null for an expression.

### Definition
- `Definition.load()` starts over when called again; a second load listed each flow twice.

### verifyModel
- Checks multi-instance loop collections: they must compile as expressions (they are always evaluated).
- Checks `appServices.<name>` in scripts and expressions against the application's services (when the services
  provider can be had without a running execution): calling one the services do not provide is an error,
  reading one is a warning (`unknown-app-service`). A model looping over `Object.keys(appServices.rules)`
  with no `rules` in the services failed only when it ran; it is now reported before.

## Release 3.2.0 — Speed and memory (2026-10-28)

Measured with `npm run bench` (the expense process: start and two user tasks, in-memory store), before → after:

| | before | after |
|---|---|---|
| CPU per process | 21.6 ms | 9–14 ms |
| a process end to end (wall, machine-dependent) | 84–102 ms | 5–20 ms |
| a waiting instance, live-instance cache on | 316 KB | 49 KB (29 KB without saved logs) |
| a waiting instance, no cache | 41 KB | 28 KB |
| logger messages kept in memory | every message, never freed | none (unless asked) |

### Fixed
- **A fixed 10 ms pause on every step** (release 2.3.3, "avoid code blocking"): it made a process about 10× slower
  than its work. A step now yields with `setImmediate`, which keeps other work running without the wait.
- **The logger kept every message in memory**, for the life of the server, even when not printed or saved (about 90
  per process); it keeps them only when asked (`new Logger({ keepMessages: true })`) or when per-instance log files
  are written (`logFolder`).
- **Each definition built its own BPMN type registry** (`BpmnModdle`, about 190 KB and most of a load's time): one
  is shared (`Definition.moddleFor`); parsing a model takes 0.3 ms instead of 2.4 ms.
- **An instance collected its log lines even when they were not saved**: it keeps them only with
  `dataStore.saveLogs` (the default, so nothing changes by default).

### Added
- `test/perf.test.mjs` (in `npm test`): no fixed waits between steps, other work runs while a process runs, nothing
  accumulates in the logger, one shared type registry, logs kept only when saved, a memory ceiling per cached
  instance. `npm run bench`: speed (median of several rounds) and memory per waiting instance.
- `npm run test:load` (`test/load/`, not in `npm test`; about 3 minutes in memory, 6 on MongoDB). On the in-memory
  store, or on MongoDB with `LOAD_MONGO_URL` (database `bpmn_load_test`, dropped first); `LOAD_SCALE` multiplies
  every count.
  - stress: hundreds of processes at once, each keeping its own data; mixed processes with service tasks awaiting
    I/O; I/O waits overlapping across instances; many callers for one task, exactly one going through; three
    servers on one database; throughput and latency at 1, 10, 50 and 200 requests in flight.
  - speed: CPU budgets for a process and for a model load; a process costing the same as the store grows (MongoDB;
    a known limit of the in-memory store, which checks every document); finding waiting tasks among many instances.
  - memory: nothing held after instances are deleted, after servers stop, or after cached instances end; heap per
    waiting instance; peak heap of a burst of 500 requests.

## Release 3.2.0 — Runtime model reads, consistent instance visibility, verifyModel (2026-10-28)

3.1.0 restricted the runtime API further than its security rules required, which broke task
portals and end-user applications for non-admin users (bpmn-web among them).

### Changed
- `BPMNAPI.model` is back, **read-only** (`APIModelReader`): `get`, `list`, `findEvents`,
  `findStartEvents` (candidate rules of the start event apply), `getSource`, `load`, `verifyModel`,
  scoped to the principal's tenant. 3.1.0 had moved all model calls to `BPMNAdminAPI`, so a client
  that only needed to list startable processes or read a task form had to hold the API that also
  saves, deletes and renames models.
- `BPMNAdminAPI.model` (`APIModel`) extends the reader with `save`, `delete`, `rename`, `export`.
- `api.data.findInstances` returns the instances a principal may see whole again, as `findItems`
  does. 3.1.0 stripped data and items for non-admins, but `findItems` still returned the same data,
  so the stripping protected nothing and broke task and assignment forms.

### Fixed
- Model reads called without a query (`list(undefined, user)`) no longer fail; reads no longer
  change the caller's query object.

### Added
- `verifyModel(source, server?)` and `api.model.verifyModel(nameOrSource, user)`: checks a model without running it (XML and references, structure, gateways, diagram, the engine's own load, script/condition/expression syntax, timers, services, called models) and returns `{ valid, errors, warnings, issues }`.
- `bpmn-server verify <file-or-folder>... [--json]` (`npx bpmn-server verify model.bpmn`): `verifyModel` from the
  command line, no server or database; one line per issue, exit code 1 when a model has errors.
- Tests: `test/runtime-api.test.mjs` drives the runtime API as a task portal does, with non-admin
  principals (start events, forms, tasks, data, completion, tenant isolation); API boundary and
  security tests for the reader/admin split.

### Not changed (documented by a test)
- Instance visibility: `qualifyInstances` admits an instance when any of its items has no assignee
  and no candidates (e.g. its start event), so any principal of the tenant sees every instance.
  Tasks stay restricted to their candidates. Tightening this is a separate decision.

## Release 3.1.0 — Embeddable engine: ports, lifecycle, independent servers (2026-10-23)

Each change is described, as a future upstream pull request, in [UPSTREAM.md](UPSTREAM.md).

### Added
- Storage port `IDocumentStore` (MongoDB the default adapter; `MemoryDocumentStore`; any other through the configuration's `documentStore`), with `DuplicateKeyError` and the shared query semantics `DocumentQuery`.
- Lock port `ILockManager` (`lock`, `release`, `claim`), injectable (`locker`); owner identity (`serverId`), stale takeover (`locks.staleAfter`).
- `server.ready`, `BPMNServer.create(...)`, an idempotent `shutdown()` that waits for running executions; `onLifecycle(listener)` subscribers, awaited and isolated.
- `engine.cancel(query, user)`: terminates an instance and keeps it.
- `IDataStore.updateInstanceSource`; `DataStore.find` on any storage adapter (`DocumentPager`).
- Configuration: `documentStore`, `locker`, `serverId`, `locks`, `shutdownTimeout`, `timers.pollInterval`.
- `ItemNotWaitingError`, `ReentrantCallError`.
- Tests: `test/` (the engine on memory and MongoDB) and `test/scenarios` (bpmn-web's feature suite, `npm run test:scenarios`).

### Changed
- Several servers per process, each with its own engine, cache, listeners, timers and connections; `BPMNServer.getInstance()` and `BPMNServer.engine` kept, deprecated.
- No process-wide `uncaughtException` handler.
- Timers are the server's: cancelled on shutdown or cancellation, claimed so one server fires each, re-read so another server fires a stopped server's.
- Errors reach the caller as themselves; an ended item is not invoked again; a call on an instance its caller holds is refused.
- Services are called with their provider as `this`.
- The security bypass of `REQUIRE_AUTHENTICATION` / `ENFORCE_SECURITY` is each user's own, not latched for the process.
- Each save is one version (0 first); model files are written whole; modules import from their defining modules, not barrels.
- Package renamed `@ai-mde/bpmn-server` (private) in this repository.

### Fixed
- A message goes to the instance waiting for it before a start event: a waiting instance is never passed over for a new one (`throwMessage`; `waitingFor(kind, name, query)` finds every waiting item). A message start no longer passes the element id as the user.
- A data store's `db` replaced after it was made (an in-memory one, in a test) is the one its locker uses.
- `signalThrown` is awaited, as `messageThrown` is: the delegate's decision and its failure are part of the step.
- Queries on items: a dotted path into an item without its parent is no value (it threw); `$exists: false` holds (it never did).
- A called process ending advances its caller before returning (the CallTask race).
- Lifecycle subscribers were never notified; `process.exception` never ran after a failure.
- A lost connection was retried as lock contention; locks could be released by another owner.
- `timers.forceTimersDelay` left timers without a due time.
- `upgrade`'s `$nor` query (`elemMatch` without `$`); `saveInstance` kept every update promise for the store's life.
- The paged search opened a database the configuration does not name.
- A configuration factory not given was set to `undefined`.

## Unreleased — Require trusted workflow principals (#4)

- Require authenticated principals for workflow execution operations.
- Remove the runtime API's implicit default-user fallback.
- Reject engine calls when the integration layer has not supplied a trusted principal.

## Unreleased — Separate runtime and administration APIs (#2)

- Keep workflow execution operations on `BPMNAPI`.
- Move workflow-definition administration to the explicit `BPMNAdminAPI` surface.
- Add boundary tests preventing runtime clients from acquiring model-management capabilities.

## Release 2.3.8  -- 2026-3-15
Fix NPM i
## Release 2.3.7  -- 2026-02-04
Fix #257
## Release 2.3.6  -- 2026-01-27

- Fix Issue with displaying wrong svg
-  with saveSource option = true, started workflow should continue with the definition it started, however, svg was not refreshed, this release fixes this issue
-  fix design: svg is now saved with the instance in db


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
