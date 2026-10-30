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
- Report view (Diagram | Report in the editor's header): the whole process as one document, from the model
  being edited: its elements in flow order (sub-processes inside their parent), with their documentation, how
  bpmn-server reads them (the engine's description, as on the instance page's Model documentation) and their
  problems, then the conditions. An element opens in the diagram; Print saves it as PDF. The model check
  (`POST /model/verify`) returns the engine's descriptions with the issues.
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

