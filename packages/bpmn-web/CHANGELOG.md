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
## Unreleased — New model editor

### Package exports
- `repository`: bpmnServer/bpmn-server, folder `packages/bpmn-web`.
- `runScenario` and `checkScenarios` (with the `Scenario`, `ScenarioStep` and `Check` types): the model editor's
  Test tab scenarios, run on any server (an application's tests run them from files, in memory).
- The `bpmn-source` condition gives the TypeScript source (`src/index.ts`) instead of the build, for running
  from the source under tsx (bpmnServer4's `npm run dev`); `./package.json` is exported.

### Command line
- `npm run cli` starts the console (`src/scripts/cli.ts`); there was no script for it. `npm run setup`, which the
  README names, runs `src/scripts/setup.ts`.
- The console reads its input with one reader: commands piped in no longer hang after the first, and the end of
  the input quits.

### Modeling rules (bpmnlint)
- The Problems list adds bpmnlint's modeling rules, checked in the browser as the model is edited: implicit
  splits, fake joins, superfluous gateways, duplicate flows, missing labels and others. Each names its rule,
  linked to the rule's documentation, and leads to its element like bpmn-server's issues.
- The configuration (`modeler/src/lint/bpmnlintrc.json`) starts from bpmnlint's recommended rules, turns off the
  ones verifyModel already checks and the inclusive gateway rule (bpmn-server runs them), makes warnings of what
  bpmn-server runs but is likely a mistake, and turns off missing labels (bpmn-server needs no names; the
  Rules dialog turns the rule on).
- The team chooses the rules: a finding's **Turn off** button, or the **Rules** dialog (under the diagram), sets
  any rule's level (off, information, warning, error) for every designer. Saved in `bpmnlint.json` in the models
  folder (GET and PUT `/model/lint-rules`, designers only).
- `npm run lint:models [folder]` checks a folder's models (`DEFINITIONS_PATH`, else `processes/`) with the same
  rules and the team's changes.

### Decisions (DMN)
- A decision editor (dmn-js): `/model/decision/<name>` opens `<name>.dmn.xml` of the models folder on its
  table (or a new one, named for the file) and saves it there. Designers only.
- Business rule tasks: the Decision field lists the decision files; below it, what the named decision reads and
  gives (hit policy, rules, inputs, outputs), and a button that opens it, or creates it when it is not there.
  Result variable and result mapping (`camunda:mapDecisionResult`) are bpmn-server fields now, not Camunda
  settings listed as not run. The result variable is a data field scripts complete.
- The Report shows each business rule task's decision table and where its result is saved.
- Problems: the decision checks of bpmn-server's verifyModel (not named, not found, invalid, result not saved)
  lead to their fields. They need bpmn-server with DMN checks (the unreleased 3.3).
- `PUT /admin/api/rules/invoke` and `/admin/api2/rules/invoke` evaluate a decision: `{ decision, data }` →
  `{ decision, file, result }`. They answered "not supported"; they need bpmn-server 3.3 and say so on an earlier one.
- Sample: Business Rules works — its decision reference, input parameters (`$data.creditScore`) and the loan
  approval table's cells (FEEL) are fixed, and the result is saved in `data.loan`.

- The model editor is rebuilt from source (`modeler/`, built with esbuild) on current bpmn-js and properties
  panel, in place of the hand-edited 7.4 MB bundle.
- The properties panel shows what bpmn-server runs. Camunda engine settings it does not run (asynchronous
  continuations, job execution, external tasks, connectors, field injection, extension properties) are gone;
  user assignment, who can start, service names and script tasks have bpmn-server's own fields and help.
- Curated fields, each with what it means when the process runs: a flow's condition is one JavaScript
  expression; a multi-instance task offers its collection only; forms are a form key and form fields (fields
  can be started on a task that has none); business rule tasks name their decision table; call activities
  name the model they start. Process settings bpmn-server only stores (candidate starters, history time to
  live, tasklist) are no longer offered.
- Camunda settings bpmn-server does not run (asynchronous continuations, Java classes and listeners, external
  tasks, connectors, field injection, loop cardinality, completion conditions, conditional events, ...) are
  listed under Problems when a model has them, so nobody expects them to work.
- Scripts on events: one list for execution and task listeners, with the events bpmn-server fires
  (enter, start, wait, end, assign, validate, take, ...).
- The panel sits beside the diagram, can be resized and hidden, and remembers both; the editor fills the
  window and opens with the diagram in view, clear of the palette. Ctrl+S saves.
- Problems: bpmn-server checks the model as it is edited (`POST /model/verify`, `verifyModel`). Issues are
  listed under the diagram, their elements outlined and badged, their fields marked in the properties panel;
  clicking an issue selects the element and opens the field (scripts, expressions, conditions, timers,
  service names, called processes).
- Administrators set a user's groups on the user's page (Admin, Edit). The page saved to the signed-in
  administrator instead and ignored the groups, and its password and delete forms acted on the administrator;
  it now edits only the user shown. Your own profile shows your groups read-only.
- Designers: users in the `DESIGNER` group (bpmn-server's USER_ROLE.DESIGNER) work on models like
  administrators do: list, create, import, edit, check, save, rename and delete them, with the model actions
  on the home page. Administration (users, resetting data) stays with `ADMIN` and `SYSTEM`.
- Nothing in a model file is hidden: settings bpmn-server does not run are not offered for new work, but
  when a model has one the panel shows it (Camunda's group, or read-only under Other attributes) and Problems
  says it has no effect. Script tasks and event scripts show their format, conditions their language, gateways
  their default flow, and conditions on any flow are shown. A test opens every model file in the repository
  and checks that each value it sets can be read in the panel (`READABLE_MODELS_EXTRA` adds another folder).
- The editor lays out a model that has no diagram information when it is opened (as import does); the file
  is saved with the layout only when the designer saves it.
- A catalog of the panel's properties (`modeler/PROPERTIES.md`): by element, the file attribute and what
  bpmn-server does with it. Writing it found that scripts on sequence flows and `transformOutput` scripts never
  run, and that process scripts see the execution (`instance.data`): the panel no longer offers those, shows
  existing ones flagged, and says so; `test/web/script-events.test.mjs` runs every offered event.
- A process that fails while running (a script or expression throws, a task is completed twice) is answered
  with a page naming the error and what bpmn-server's checks find in the model, with a link to the model for
  designers (status 422, or 409 for a task no longer waiting; JSON for API-style requests), instead of an
  error 500. The editor's Problems list leads loop collections and service references to their fields.
- A task made from a template lists the template's hidden values (the service it calls, ...) read-only.
- Problems and Report are tabs under the diagram, in a dock that can be resized and hidden (remembered per
  browser). The Report is the whole process as one document, from the model being edited: its elements in
  flow order (sub-processes inside their parent), with their documentation, how bpmn-server reads them (the
  engine's description, as on the instance page's Model documentation) and their problems, then the
  conditions. Clicking an element selects it in the diagram; Print saves the report as PDF. The model check
  (`POST /model/verify`) returns the engine's descriptions with the issues.
- Scripts and expressions are code fields (script tasks, scripts on events, conditions, loop collections):
  highlighted, checked as they are typed the way bpmn-server compiles them (a script as a function body, an
  expression as `return (...)` with an optional leading `$`), and completing the names a script can use: the
  model's data fields, the item (the execution in process scripts), the instance and the application's services
  (`GET /model/services`). Typed code is written when typing pauses and when the field is left.
- Test tab (beside Problems and Report): test scenarios per model, run step by step. Start starts the process with
  the scenario's start data and shows the user tasks and events that wait as the next steps, each with its data
  (prefilled from the scenario, else from the form fields) and the instance page's button (Execute, Force);
  running a step shows what waits next, until nothing waits. The data chooses the branches; which step is run
  first chooses between elements that wait together. The steps run are saved as the scenario's, so Run and
  Run all repeat them on a new instance without stopping; Simulate plays a run on the diagram
  (blue started, green done, orange still waiting; pause, continue, step), numbered. Each scenario keeps its runs
  (the latest 20) with their instances, so the last run is shown when it is opened, and earlier ones can be opened. What is expected at the end is optional: status, data values, elements
  passed and not passed. The result shows the checks, the data and the log, and the path is marked on the
  diagram. Scenarios are kept per model in the application's database (`wf_test_scenarios`); runs are real
  instances with ids starting `test-`.
- Data objects: a data object shows its field in the instance data (`data.client`) and the elements that load
  it; scripts complete `data.client`; the Report lists the data objects and what loads them. The sample
  application loads `client` (`appDelegate.loadDataObject`). Loading needs bpmn-server with data object support.
- Element templates: configured tasks from the application's `elementTemplatesPath` (Camunda 7 template
  format), chosen under Template in the properties panel. Templates are checked against what bpmn-server runs;
  ones that set anything else are left out with the reason (`GET /model/templates`). The sample offers Add
  two numbers, Echo, Manager approval and Review by requester.
- `MODELER=classic` keeps the previous editor.

## Unreleased — Separate web host and workflow application (#1)

- Separate reusable web-host integration from the example workflow application.
- Move application-specific configuration and workflow behavior behind explicit boundaries.
- Keep the web package focused on adapting HTTP requests to engine operations.

## Release 2.3.6
-	Fix issue with svg not reflecting instance svg
## Release 2.3.1
- Release to match bpmn-server Release 2.3.1
- added Workflow animation in InstanceDetails page
- added Show Tokens in InstanceDetails page
- Modified configuration.ts to support 
	saveLogs
	saveSource
	MongoDB collections names

## Release 2.2.19
- Release to match bpmn-server Release 2.2.19
- Fixed bug #244 
- Fixed bugs in ending flow #242
## Release 2.2.18
- Release to match bpmn-server Release 2.2.18
- Show itemKey in display
## Release 2.2.13
- Change configuration to match new Release
## Release 2.2.4
- Fix api dataStore/findInstances(query,projection)
## Release 2.2.3
- Clean up UI for security 
- Improve UI for model docs
- Moved test processes to separate folder 'src/test/processes'
- Added test scenarios
## Release 2.1.10 
- Minor change to Modeler UI: allow resizable property panel from the left side
- Added more test sceanrio
- Moved docs to github.io
## Release 2.1.5 -- 2024-03
- Added engine.startEvent to API
### Enhanced cli
- support double quotes, so parameters like: `name "Buy Used Car" ` can now work
- support backspace on input

## Release 2.1.0 -- 2024-03
- Added engine.restart

## Release 2.0.1 -- 2024-02
- Moved webApp as a separate Repo (this repo)
- New Folder structure
- src to include typescripts only, dist to include js
- Repo to include src only
- Moved routes,scripts,views under src
- Moved configuration.ts , appDelegate, appSercies under src/WorkflowApp
- .env : added port #
- .env : expanded for security
- New Installation procedure
- Use npm run setup (twice)
- cli: use npm run cli
- New API is called by api2
- UI: instance details , added Model docs
- UI: invoke item form now supports Date type
- app.ts: remove security, email to UserService class

