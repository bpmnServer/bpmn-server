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
## [Unreleased]
### Added
- **The start page** (`/dashboard/start/<model>`): Run on a model with several start events a user can start, or
  a start form, asks first: each start event with its form, as My work shows them. It started at once, with no
  data, at whichever start event was drawn first.
- **The instance page's Rationale:** the run as the log tells it, in order: each item's start, waits and end
  (completed by whom, a branch arriving at a join), each flow taken, and each decision with its why (a condition
  with the values it read, what a gateway chose, what a join waits for), with the time from the start. Closed at
  first.
- **Filters on the instance page:** a type of element and an element of that type, for the items, the Rationale
  and the logs (the lines that name it). At first: the user tasks.

- **A task by itself in the Test tab:** Test this task (the task selected on the diagram), or Start at → A task
  by itself: the scenario runs that task alone with the data given as its input (`start.only` in scenario files);
  its run, Debug and checks as any other.
- **Connectors list:** each connector's key with a link to set or change it (its page's key form), and Delete,
  whose confirmation names the models that use it.
- **History tab: View, Restore, Delete.** View shows one version without comparing: its diagram in the main area,
  over the editor, and its report in the tab. Restore loads a saved version into the editor, unsaved; Save keeps
  it as the newest version, and no version is removed. Delete removes one version (`DELETE
  /model/history/<model>/<version>`); the others keep their numbers.
- **History tab:** a comparison's marked diagram opens in the main area, over the editor, instead of in the tab.

### Changed
- **The Docker image** is built from the npm release, as users install it (`npx bpmn-server init`), not from a git
  clone: one version per image, no `.env` inside, production mode. `up.cmd` and `up.sh` also make a random `ADMIN_PASSWORD`
  and print it; `PORT` in `.env` picks the host's port. The database volume is now `database`: see `docker/README.md`
  to bring data over. `docker/image/test.mjs` tests the image.
- The model and decision editors have the pages' menu: Workbench, Dashboard (My work, Design, Administration),
  the user's menu and About.
- The instance page numbers items by their seq, from 1: the items table, the Rationale and the diagram's numbers
  agree (the diagram counted its items, which differed once seqs had gaps); the replay finds each element's
  number by its seq. Decision entries in the logs keep their lines.

### Fixed
- The menu with sign-in off (`REQUIRE_AUTHENTICATION=false`): every page has the same places, and none offers Sign in,
  Create account or a Sign out. It depended on the page: the dashboards, the docs and the model list showed Sign in
  and no places, the home and instance pages a "system" user. The menu goes by who is signed in (`account`,
  `signInOff`), not by the `user` a page passes.
- The editors' logo comes from the application; it was loaded from another site, and broken without it.
- `/model/list` has a title of its own, not "bpmn-server Workbench Demo WF2".
- History tab, View: the version's report shows in the tab. The tab's rule hiding the Report tab's panel
  (`.dock-report`) hid it too.
- The same menu bar on every page. The Workbench's sections (Models, Pending tasks, Instances) and the docs' pages
  (API, Examples, ReadMe) were added to the bar, and the model list showed the Workbench's sections, which it does not
  have: they are now links in the Workbench's and the docs' own pages. `/model/editNoProp` had no menu.
- Pages for "not found", "not allowed" and a failure have the menu; they were bare text. Scripts still get the plain
  text: only a browser opening a page gets the page.
- `/account` with sign-in off said Error 500; it now says there is no account, and so do the pages under it. `/user`
  and `/user/home` with sign-in off no longer fail.
- `/account/verify` said Error 500 when the email could not be sent; it now says so on the account page. Without
  `SMTP_USER` and `SMTP_PASSWORD` the mail server is not tried.
- The model list's Execute links went to `/wf/...`, which does not exist; its Select link had nothing to go to and is gone.

## Release 3.5.2 (2026-11-04)
### Added
- **One menu on every page** (`views/includes/menu.pug`): Workbench first, then Dashboard: My work for end users;
  for designers and administrators a drop-down with My work, Design and Administration. The user (My account,
  Sign out) on the right. The model and decision editors carry the same places in their header. It replaces
  the three menus the pages had (the dashboards', the Workbench's and the other pages').
- **The console from the command line:** `npm run cli -- cod asana` runs one command, its words answering its
  questions, and quits (a yes/no question it does not answer is yes).
- **Connectors** (needs bpmn-server with connectors): Administration → Connectors (`/dashboard/admin/connectors`)
  adds REST APIs from a catalog (`catalog/connectors/api-catalog.json`, or `CONNECTOR_CATALOG_URL`) or from an
  OpenAPI document, and sets each one's name, base URL, groups, timeout, retries, key (write-only), operations;
  tests, refreshes and deletes it (listing the models that use it). The Admin dashboard has a Connectors card;
  the console has `co`, `coa`, `cok`, `coe`, `cot`, `cor`, `cod`, `coc`; setup makes the index.
- **The connector wizard** in the model editor: a service or send task's *Calls → Connector* opens a window over
  the editor: the operation found by a search, its inputs (required ones from the data of the same name, enums
  offered), and the parts of the answer to keep, each with a check box and a data name. Done writes it as one
  undoable step; Cancel changes nothing. The Service group shows a summary with what is wrong, and
  **Edit connector…**. `GET /model/connectors` lists the connectors a designer may use.
- **Decision tests:** the decision editor's Test tab, as the model editor's: inputs, checks on outputs or on the
  rules matched, runs kept, **Use as checks**. `/model/decision/:name/tests`.
- **Design dashboard:** each model's and decision's tests with the last run's result (and why it failed); Run for
  one, **Run all tests**.
- **The instance page's model report** is the model editor's Report (of the instance's own model), in place of
  the older model documentation table.
- **History:** the compared versions' diagram, marked + added, M changed or moved, − removed.
- **Failed tasks:** the instance page says **failed at** the task and why, and **Retry** (administrators) runs
  its work again. The editor's **Exceptions raise a BPMN error** on service, send and script tasks.
- **History tab** in the model editor: every save of the model with when and by whom, and the editor's model;
  two compared by their report text (the lines changed, under their element and process) and their layout (the
  elements moved or resized, and how); **Purge history**. `MODEL_HISTORY=false` keeps no versions and removes the tab. `GET /model/history/:name`, `GET /model/history/:name/:version`, `DELETE /model/history/:name`.

- **The Report holds the whole model:** Globals (messages, signals, errors, escalations, with what uses each),
  Pools and lanes (pools, lanes with their elements, message flows), annotations and associations, connectors,
  and any setting it has no words of its own for as `key: value`. `report.text(definitions)` gives it as an
  indented text outline, which History compares. A test checks that every value of every sample model is in it.
- `npm run upgrade:running -- [--dry-run] [--json] [model ...]`: moves running instances onto their model's
  saved source (bpmn-server's `engine.upgradeRunning`); no names = every model with running instances. Exit
  code 1 when a model is refused or an instance is stranded, busy or failed. The existing
  `upgradeInstances.ts` (afterNode style) is unchanged.
- `npm run verify:models [--json] [model ...]`: checks the models saved in the database (not files) with
  `verifyModel`; exit code 1 when any has errors.
- `POST /admin/api/definitions/verify` `{ name }` or `{ source }`: the same check over the API, nothing saved.
- `VERIFY_MODELS_ON_IMPORT=warn|enforce|off` (default `warn`) for the model import and save APIs
  (`/admin/api/definitions/import`, `/admin/api/model/save`, `/admin/api2/model/import`): `warn` saves and logs
  the issues, `enforce` saves nothing and answers `{ errors, issues }`: on the import APIs with 200, like
  their other failures (bpmn-client rejects with that body and no HTTP status), on `model/save` with 422. The model editor's own saves are not
  checked: a model being drawn is allowed to be incomplete.
- Engine settings from the environment: `LOCK_RETRY_DELAY_MS`, `LOCK_MAX_TRIES`, `LOCK_STALE_AFTER_MS`,
  `ENGINE_SHUTDOWN_TIMEOUT_MS` and `MONGO_DB_NAME` (the database, when `MONGO_DB_URL` names none). Settings
  passed to `start({ config })` still win.
- `start({ routes })` (`WorkflowApplication.routes`): the application's own routes, mounted before bpmn-web's.
  Routes added after `start()` could not be reached: the APIs answer unknown paths with a JSON 404 and the UI
  router at `/` sends any request without a session to `/login`. `apiKeyAuth` is exported for them.
- `DISABLE_DESIGN=true`: model design off in the web pages for everyone, administrators included (no model
  editor, design dashboard, catalog or model test runs), for a server whose models arrive only through the admin
  REST APIs from a review or release process elsewhere. The admin APIs stay on.
- `DISABLE_SIGNUP=true`: no self-registration; `/signup` answers 404 and the pages drop their sign-up links.
  Administrators add accounts from the admin dashboard or `npm run cli`.
- `npm run setup` makes the first user, admin, with the password `ADMIN_PASSWORD` when it is set (else
  `admin`). The repository's `deploy/install.sh` installs a server in one line with a generated one.

### Fixed
- `start()` added the user admin (password admin, group ADMIN) on every start to any database without a user
  named `admin`, including one whose users have other names. It is now added only to a database with no users.

### Changed
- **The Test tabs' tests are files** beside what they test: `<model>.tests.json` (the scenario file format) and
  `<decision>.dmn.tests.json`; their runs in `.runs/<model>.runs.json`. They were in MongoDB (`wf_test_scenarios`): setup moves
  each set there to its file once (the collection is left as it was). The backup has them with the models
  folder's files. `npm run lint:models` skips dot folders (`.history`, `.runs`).
- The dashboards make no MongoDB calls: they work on MongoDB, SQLite and the in-memory store. The backup is
  format 2, plain JSON from each store, with the connectors (their keys encrypted).
- The editors' scripts and styles are loaded with their build's time in the URL, so a new build is used at the
  next reload.

### Fixed
- The Problems tab no longer reports a connector as a Camunda setting with no effect.

## Release 3.5.1 (2026-11-02)
### Added
- `GET /api/definitions/list`: the models' names with the runtime key (`API_KEY`), as `/api2/model/list`
  already was. A client lists models with administration off (`DISABLE_ADMIN=true`); changing models stays
  under `/admin/api`.
- `GUEST_ACCESS`: a banner tells a guest that their models are kept for this browser, with a link to download
  them.

### Changed
- `GUEST_ACCESS`: setup makes no admin user (a public demo has no account with a known password).

## Release 3.5.0 — New model editor, applications on start() (2026-11-02)
bpmn-server, bpmn-web and bpmn-client are now one repository (bpmnServer/bpmn-server) and are released
together, with the same version.

### Upgrading from 3.1
- What changes for the models (bpmn-server 3.5): see bpmn-server's change log, Upgrading from 3.2, and
  [What's new in 3.x](https://bpmnserver.github.io/docs/whats-new-3).
- If you ran bpmn-web itself as the demo application: below.

### Changed: bpmn-web is the web host, an application starts it
**Breaking** for anyone who ran bpmn-web itself as the demo application:
- bpmn-web no longer bundles a sample application (`src/sample-app`, its models, element templates and the
  `INSTALL_*` copies are gone). The sample application is what `npx bpmn-server init` creates; with more models
  and the tests, it is bpmnServer4's `testSampleApp`.
- `npm start` in bpmn-web runs it on its defaults (models in `./processes`, `WebAppDelegate`, no element
  templates); `npm run setup` is `start({ setupOnly: true })`; the console and the archive, describe and upgrade
  scripts use the default configuration. `ELEMENT_TEMPLATES_PATH` is not read: an application passes
  `elementTemplatesPath` to `start()`.
- bpmn-web's tests moved to `testSampleApp/test`, where they run against the sample application.

### Applications
- `start({ config, appDelegate, api, ui, elementTemplatesPath, setupOnly, console })` starts bpmn-web for an
  application: the configuration from bpmn-web's defaults and the application's settings, the database prepared
  (indexes, the first user), the web server listening; `webConfiguration()` and `setup()` for hosts that compose
  their own. A missing models folder is created.
- `WebAppDelegate`: the generic part of an application's delegate (startup housekeeping, notification emails);
  applications extend it.
- `MONGO_DB_URL=memory`: a MongoDB in the process (the application's mongodb-memory-server), to try bpmn-web
  without a database server; what it holds is gone when the process stops.
- The console (start processes, list and complete tasks, locks, hung items, users and passwords) is
  `src/console.ts`, published with the package: `start({ console: true })` runs it on the application's
  server (an application's `npm run cli`).
- `UserService` is exported (an application's scripts add users with it).

### Dashboards
- `/dashboard` (every user): tasks assigned to me, tasks available to me, the tasks I completed most recently,
  and every process I can start, at each start event, with its form. `/dashboard/design` (designers): each
  model with what the checks find, its test scenarios, recently changed models, the decisions and the element
  templates. `/dashboard/admin` (administrators): instances by status, the server, locks and hung items (as the
  console's `ck` and `re`), users, and a backup to download.
- The model catalog (`/dashboard/catalog`, designers): browse a catalog (`CATALOG_URL`, a web address or a
  folder) of models with their diagrams, contents, services and problems, and import one (a file that does not
  match its checksum is refused). It is not offered for now (the Catalog menu entry and the Design dashboard's
  "Browse the catalog" button are hidden) until it is fixed; `/dashboard/catalog` still answers.

### Model editor
- A model drop-down opens another model (asking first when there are unsaved changes); an element drop-down
  lists every element by name and follows the selection. The properties panel opens the groups that have
  values; a field's help shows when it is hovered or in use; above the panel, the selected element's behaviour
  (when it starts, when it completes).
- The Report is the model as an outline, as its XML reads: each element in flow order as `type: id, name` with
  its settings, the data objects it loads and its problems, its boundary events and outgoing flows under it.
- Test tab: New, Run all, Clear all; a scenario's Design (start form, steps, checks) and Runs (each kept run
  with Simulate, Debug, its instance, its steps, result and checks). Checks at the end or after a step: a node
  (how many times, in what status), a data value, the instance's status. Simulate goes one change at a time
  (Step, Back, Play); Debug shows the variables as a table that can be changed, and restarts at a step done
  (the engine's restart with rewind). The engine's reasons for each decision are shown with a run.
- Modeling rules: each rule says what it checks under its name in the Rules dialog, and for one off by default,
  why.

### Security
- nodemailer ^10.3.1 (9.1.1 had two high and ten moderate advisories).

### Fixed
- In the npm workspace: browser libraries and bpmn-server's README are looked up as Node does (node_modules
  here, else in a parent folder); `/rules/invoke` answers the decision's file name on Windows too.
- The package root is cleaned up: tests in `test/`; the broken Dockerfiles and docker-compose (the repository's
  `docker/` replaces them), IIS and Debian packaging, `src/examples` and old copies removed.

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
  lead to their fields. They need bpmn-server 3.5 or later.
- `PUT /admin/api/rules/invoke` and `/admin/api2/rules/invoke` evaluate a decision: `{ decision, data }` →
  `{ decision, file, result }`. They answered "not supported"; they need bpmn-server 3.5 and say so on an earlier one.
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

### Web host and workflow application (#1)
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

