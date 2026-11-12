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
- **In place of PR #281's `.env` columns** (`INSTANCE_COLUMNS`, `TASK_COLUMNS`: not added) **and PR #286's
  proposals:** a case's label says what its values are, and the lists' filter by label finds any value it shows; #281's
  safe reading and display of values is kept in `engine/LabelTemplate.ts`. Whether named values also become columns is
  open until the labels are tried. Roles and assignment policies are kept with the models (see bpmn-server's changelog).
- **Roles on the Administration page** (docs/docs/assignment-policies.md#roles): `roles.json`'s roles, each with
  where it is used and its users; add and remove; the names lanes and policies use that it doesn't list, to add.
- **Assignment policies in the editor** (docs/docs/assignment-policies.md): a user task's **Assignment policy**, in
  User assignment, chosen from the models folder's `policies/`; Open and New policy; a preview with the Test tab's
  scenario. `/model/policy/<name>` edits a policy in the decision editor, with its tests; `GET /model/policies`,
  `POST /model/policy/<name>/preview`. The decision editor's Test tab asks its own page's tests.
- **Labels in API v3** (docs/docs/labels.md#in-api-v3, `routes/api/labels.ts`): tasks answer `label`,
  `labelValues`, `caseLabel` and `caseLabelValues`; instances `label` and `labelValues` (and their items, on
  `GET /instances/{id}`). `GET /tasks` and `GET /instances` take the filter by label (`field`, `op`, `value`,
  `search`; `model` on `/tasks`); a wrong `op` is a 400 `BAD_FILTER`. Fields added only: nothing removed or renamed.
  `/api` and `/api2` are unchanged.
- **The filter bar** finds what a label shows: a plain `${data.caseId}` is a field (*caseId*), a model with no case
  label offers *caseId*, and Field *Any* with a value looks in every field (it was ignored).
- **The Label group's preview** (`properties/LabelGroup.jsx`): under each label, the label filled in from the Test
  tab's scenario (its last run, else its start data). The Test tab offers its data with `labelPreview()` and fires
  `testPanel.changed` when it is drawn.
- **Labels in the pages** (docs/docs/labels.md): the Instances list's Case column, the Pending Tasks table's Label
  column, My work (under each task's name), and the instance page (the case's label; each element's under its
  name), filled in from each case's model when shown.
- **Filters by label** on the Workbench's Instances and Pending Tasks sections (each its own) and on My work: a model; a named value of the
  cases' labels that contains, or is, a value; or search everything. A database query on the values' data paths,
  kept in the URL (`?field=Car&op=contains&value=porsche`) (`routes/labelFilter.ts`, `includes/labelFilter.pug`).
- **My work:** a Case column with each task's case's label; a task's own label under its name.
- **The model editor's Label group:** *Case label* on the process, *Label* and *Label once done* on any element of
  the diagram; a template checked as it is typed (`camunda:label`, `camunda:endLabel` declared in the editor's
  descriptor).
- **The Design dashboard finds the models that use a feature**: beside the search, **Any feature** lists the features
  the models use (user tasks, timers, connectors, forms, ...: docs/features.yaml's `xml` markers), with how many models
  use each; one chosen, only those models are listed, each with the elements where, a link that opens the model at the
  element. The editor opens at an element named in its address: `/model/edit/<model>#element=<id>`.
- **A workflow page framed by a page of the same site leaves out its menu bar** (an application's own layout around
  the workflow pages: `apps/hrdemo`), as the browser says it is framed (`Sec-Fetch-Dest: iframe`, `Sec-Fetch-Site:
  same-origin`; on HTTPS and localhost). The body has the class `framed`, a hook for the application's styles; the
  model and decision editors keep their actions. Opened by itself, or framed by another site, a page is as before.
- **`API_RATE_LIMIT`**: calls a minute one address may make to the APIs (`/api`, `/api2`, `/api/v3`, the
  administration APIs); over it, `429` (`RATE_LIMITED`, with `RateLimit` headers). Unset, no limit, as before.
- **An application's own sign-in: `start({ userManager })`.** An application that signs people in itself gives
  bpmn-web its user manager (`IUserManager`: `init(app)` for its sessions and `req.user`, `setup(app)` for `/login` and
  `/logout`, optional `apiUser(req)` for its API credential). bpmn-web then keeps no users, sessions or credentials of
  its own: the pages take the application's person; API v3 takes the application's credential, and refuses a change
  posted from another site with its cookie (`CROSS_SITE`, by the browser's `Sec-Fetch-Site` and `Origin`;
  `crossSiteWrite` is exported for the application's own routes); `POST`/`DELETE /api/v3/tokens` (`TOKENS_ELSEWHERE`)
  and `/ai/key` are refused; Administration and `/api/v3/users` (`USERS_ELSEWHERE`) say the application manages the
  users; no first-run page. bpmn-web's own sign-in is its default user manager (`UserManager`), unchanged.
  `docs/design/host-users.md`; `apps/hrdemo` is an application with its own.
- **The task API starts processes, and gives each task its form** (`/api2/tasks`, with `API_ACTING_USER_KEY` and `x-acting-user`): `POST /api2/tasks/start/:name` starts a process as the acting user, at a start event they may use (its lane or candidates), and answers their first task; `GET /api2/tasks/:id` answers `form: { fields, formKey }`, each field with its options and validation. An application no longer needs `/api` to start a process for one of its users.
- **API v3 begins: user tokens** (`/api/v3`). With the service key, an application's back end asks for a token for one of its users (`POST /api/v3/tokens`); each call with `Authorization: Bearer <token>` acts as that user, with their groups and the security rules. Tokens expire (15 minutes by default), are revoked per user (`DELETE /api/v3/tokens`), are kept hashed in `wf_tokens`, and can not have `SYSTEM`, `ADMIN` or `DESIGNER`. `GET /api/v3/me` says who a call acts as. A user's processes and tasks on v3: what they may start (with the start forms), starting as them, their tasks a page at a time (`cursor`), one with its form, claim, complete; the same operations as `/api2/tasks`. Instances on v3: those a user may see (a page at a time), one with its items, its Rationale by step, a start event, a restart; deleting (administrators), messages and signals (the system). Models and their tests on v3: list, read, save (checked; laid out without a diagram), check, an element's details, the `.feature`, run it, rename, delete; the same operations as `/api2`'s. v3's OpenAPI document at `/api/v3/openapi.json` (no credential needed), checked against the routes.
- **A link for an AI agent** (`/ai/key`, in the menu under your name): an API token that acts as its person, at the level they choose among those they have: **Work** (processes, tasks, instances), **Design** (and models and their tests), **Administer** (and the settings, read with secrets masked, and their checks; it changes nothing). It reaches no more than its level nor its person; it is not a key of `/api` or `/api2`. Kept as its hash in `wf_tokens`, masked in the request log; it expires (30 minutes, `AI_KEY_TTL_GROUPS` by group, an Administer link 10 at most) and goes when its person revokes their links or signs out. `AI_ACCESS` says which levels a server offers. The users on the API, for an administrator (never an AI link): `GET`, `POST /api/v3/users`, `PUT /users/{name}/groups`, `POST /users/{name}/password`, `DELETE /users/{name}`; changing a user's groups or deleting them ends their tokens. The settings on the API: `GET /api/v3/settings`, `/settings/schema`, `POST /settings/checks/{name}`.
- `/llms.txt` and the guide for agents advise a lane for each role, named as its user group.
- **SQLite for a whole application**: `DATABASE=sqlite:<file>` in `.env` keeps instances, models, locks, users and
  sessions in one SQLite file (Node 22.5 or later), with no database server. Unset, MongoDB at `MONGO_DB_URL`, as before.
- **The settings checked at start** against the settings schema: a value of the wrong kind (`PORT=abc`), and a name in
  `.env` close to a setting's (`SESSON_SECRET: not a setting; SESSION_SECRET?`), a `[config]` line each. Nothing stops
  the server for them; an application's own names are not reported.
- The Settings page's tables are made from the settings schema (`npm run features`), so the two can not drift; some
  descriptions in the schema now say what the page said.
- `npm run test:web:sqlite` in testSampleApp runs the web tests with each app on a SQLite file of its own.

### Changed
- **Lists read less.** `/api/v3/instances` filters, sorts and cuts its page in the database, reading only the fields
  it shows; the task lists (`/api/v3/tasks`, `/api2/tasks`, My work) read the tasks without their instances' data. The
  answers are as before. The HR demo's To do panel no longer reads the tasks every 30 seconds and on each return to the
  window: on the page's load, its Refresh button, and a task completed in the workflow pages.
- **The host changes nothing of the engine's but by asking it** (docs/design/engine-isolation.md): Administration
  releases locks, sets, tests and removes a connector's key through engine calls; claiming a task (`/api/v3`,
  `/api2/tasks`) takes the engine's claim; the model editor, the APIs and the catalog save, rename and delete models
  through model access (`server.models`: the files, then the engine told); the console uses the engine calls for locks,
  connector keys and tests, and deleting instances. The host needs no `CONNECTORS_KEY`. The console still runs in the
  host's process; moving it onto the API is left for later.
- **The log and the pages keep secrets in:** the MongoDB address is logged with its password as `***`; an operation's
  error in the workflow pages is its message, escaped, with the menu (the stack goes to the server's log, no longer to
  the browser), and the page no longer answers twice after it. A mongoose connection error is logged, and no longer
  stops the server (mongoose is only the old test sets' move and the health check now).
- **My work and the start page use API v3's operations in the server's process**, as the person API v3 would take
  (`pageClient.ts`), instead of calling the server's own address with a token held in the session. They work with
  `HTTPS=true` (the call to `http://127.0.0.1` failed there), and a person's groups changed apply at once (the token
  kept them for an hour). No token is made for the pages any more.
- **Users and sessions are kept on the engine's document store** (MongoDB, SQLite or memory), not through mongoose and
  connect-mongo. On MongoDB they stay where they were: users in `users`, in the database `MONGO_DB_URL` names (as
  mongoose had them), sessions in `sessions` in connect-mongo's shape, so nobody is signed out by the upgrade. The
  `User` model keeps its calls (`find`, `findOne`, `findById`, `countDocuments`, `create`, `updateOne`, `deleteOne`,
  `save`, `comparePassword`, `.lean()`, `.sort()`, `.collation()`); code that used other mongoose features on it needs
  changing. mongoose is still connected on MongoDB, for the test sets moved to files from before 3.5 and `/healthz`.
- Signing out no longer answers twice (`ERR_HTTP_HEADERS_SENT` in the log).
- One user per email on every store (MongoDB had a unique index; `save()` now checks), with the same error (code 11000).
- `start({ setupOnly })` (an application's `npm run setup`) with `MONGO_DB_URL=memory` says there is nothing to prepare
  and stops, instead of starting a database in memory that is gone when it stops.
- **`POST /api/v3/rules/{name}`**: a decision table of the models folder evaluated with `{ data }`, as a business rule task
  does, by anyone the door lets in (a user's token, an AI link, the service key). `404 RULE_NOT_FOUND`, `400 BAD_DATA`,
  `422 RULE_FAILED`. On `/api` and `/api2` it stays an administrator's (`PUT /admin/api/rules/invoke`).
- **API v3's reference** (`docs/docs/api-v3.md`): every operation, its parameters, body, answers and shapes, made from the
  API's OpenAPI document by `npm run api-docs`. The tutorial and the guide for integrating an application use API v3: a
  token for each of the application's users.
- `@start ... is refused` in a model's tests: holds when the start fails (a listener or script throws, the engine
  refuses), as `@invoke ... is refused` does for an item.

- **`/api` acts as its service account** (`API_SERVICE_USER_NAME`, `API_SERVICE_USER_GROUPS`, which `init` sets), as `/api2`
  does: a user a call names (`userName`, `options.userName`; bpmn-client's `userId`) is ignored, and the answer has a
  `Warning` header saying so. Before, `/api` acted as whatever user it was sent, with no security rules, so anyone with
  `API_KEY` could act as anyone. **To upgrade:** start processes for a user with the task API
  (`POST /api2/tasks/start/:name`, `API_ACTING_USER_KEY`, `x-acting-user`); or set `API_IMPERSONATION=true` to keep the
  old behavior while you move (it goes at 4.0). A server without a service account answers 500 on `/api`, naming the
  settings to set.
- **`/api` (v1) and `/api2` (v2) are deprecated**, frozen until they go (v1 at 4.0): fixes only, through the operations they share with the API (`/api/v3`). Their answers carry `Deprecation: true` and `Link: <…/api/v3/openapi.json>; rel="successor-version"`; the server logs each of their routes once, when first called, to see who still uses them. `/api/openapi.json` is new (made from its routes), and both documents mark every operation deprecated.
- The API's key checks and users are decided in one place (`routes/api/door.ts`), and `/api`, `/api2` and the
  administration APIs share their operations (`routes/api/operations.ts`): no change to their URLs or answers.
- In the repository, the applications are under `apps/`: `apps/testSampleApp` (bpmn-web's tests, `npm test` here runs
  them) and `apps/sampleApp`. The published package is unchanged.
- **A server's API settings and state are its own** (docs/design/multi-app-tenants.md §8, for 3.8's workspaces): the
  keys, the service account and impersonation are read through the request's server (`start({ hostSettings })`,
  `envHostSettings` by default: `.env`'s values when asked, as before, so a change still holds from the next call);
  the first-run setup token is kept per server; the workflow pages reach their own server through the request, not a
  module-level one. `configuredApiUser` and `tokenUser` take the settings, `.env`'s by default.
- **The pages apply the security rules one way.** My work and the start page (API v3's operations) follow
  `ENFORCE_SECURITY` as every other page does; before, they kept the rules on while the task forms and the instance
  page turned them off with `ENFORCE_SECURITY=false`. API v3 keeps them on for its clients, as before.

### Fixed
- **Signing in goes back to the page that asked for it**, and only to it: the page is kept where a page that needs a
  person sends them to `/login` (`rememberPage`), not on every page asked for while signed out. An application's own
  sign-in or welcome page (apps/hrdemo's `/hr/login`), or a page such as `/forgot`, was kept too, and signing in then
  went back there: to the sign-in form, signed in, as if it hung.
- **A sequence flow with no condition shows its Condition group as empty again** in the editor's panel: the Language
  (JavaScript, the default) counted as a value; it counts only when it is not the default (FEEL).
- **The Test tab's Run is offered for a scenario with no steps** (a start, then what is expected checked: a process that
  runs to its end by itself, or stops at its first wait); it was greyed out until steps were recorded.

### Removed
- **`/user`, a second copy of the workflow pages** (`routes/endUser.ts`, the `user/` views): nothing linked to it. Its
  addresses go to the same page of the one set (`/user/tasks` to `/tasks`, a form posted to `/user/invokeItem` sent on
  to `/invokeItem` with 307), so an old link still works.

## Release 3.6.0 (2026-11-10)
### Removed
- **Guest access**: `GUEST_ACCESS`, `GUEST_SAVE`, `GUESTS_PATH`, `GUEST_MAX_MODELS` and `GUEST_RATE_LIMIT` are gone, and only signed-in
  users use a server. **An account made on a server with guests no longer has models of its own.** Before upgrading such a server,
  delete its guest users (group `GUEST`): a kept session would otherwise sign one in as a designer of the shared models.

### Added
- **`/llms.txt`**: where an AI agent given only the site's address starts: the site's facts (its API and OpenAPI
  document, whether design is on, the services, connectors and user groups a model can use), its own guide
  (`AI_GUIDE`, default `settings/ai-guide.md`), then BPMN Server's guide for agents, shipped in the package.
- **The test environment's services**: `/llms.txt` says which environment a site is (`APP_ENV`); the sample
  application has `connectors/testServices.ts`, `TestServices`, the same service names with nothing sent or recorded,
  used when `APP_ENV=test` (`npm test` runs as the test environment). Its `notify` service is now `notifyUsers`, whom
  to tell given as `users` and `groups`.
- **`API_TRACE`**: every API call and its answer, one JSON line each, secrets masked: what a client, an AI agent, did.
- **`has ... items ... for me`** in a `.feature`: only the items the user of `@login` may take, to check who may do what
  (an employee can not approve); `@invoke ... is refused` holds when the user can not do it.
- **Models and their tests over the API**, for a client that builds workflows (an AI agent, a script), with the API
  key: `GET`/`PUT /api2/models/:name` (created or changed from XML, checked first, refused with its errors), `POST
  .../verify`, `GET`/`PUT .../feature`, `POST .../test` (each scenario's result, the failing step and why),
  `GET /api2/instances/:id/rationale`; `GET /api2/openapi.json`, without a key, describes them. See
  `docs/docs/ai/building-workflows.md`.
- **Gherkin tests**: a model's tests as a `.feature` file, run whole in the engine (`POST /model/test/feature`), with `@login`, `@start`,
  `@find`, `@invoke`, `@check`, `@wait`, `@stub` and `@script`. A stub replaces a service or a timer for its own scenario's instances.
  The Test tab and the decision editor read and write them, and `*.tests.json` files are converted when the server starts. The Mocha scenarios are now `<model>.engine.feature`. See `docs/docs/testing.md`.
- **The engine in its own process**: `npm run engine`, then `ENGINE_AT` and `ENGINE_KEY` on the host, with the delegate, services, timers and tests in the engine. See `docs/docs/architecture.md`.
- **Every flow has its Condition field**, open, in the editor; a default flow's says a condition there is not used.
- **`DISABLE_DESIGN` also removes the test calls from the engine**, so `ENGINE_KEY` can't run a test's scripts on a production engine. Set it on the engine too.
- A service a test stubbed stays uncalled if its instance outlives the test or the engine, and in what it calls: the instance keeps `flags.stubbed`.
- **Settings**, a page in the docs: what goes in `.env`, what in `settings/config.ts`, and every setting.
- A Gherkin script that never finishes fails its step after a second, with or without the sandbox. With design on in production and no sandbox, the server warns at start.
- **The first start asks for the administrator**, with a setup token the server prints: there is no admin/admin any more. `/setup` makes the administrator, and the tutorials' sample users if asked. `ADMIN_PASSWORD` still makes admin at setup, as Docker and the install script do.
- **bpmn-mcp with every application**: `npx bpmn-server init` installs it and writes `.mcp.json`. See `packages/bpmn-mcp/CHANGELOG.md`.
- **An HR application in the sample application**, embedded and called through a connector, to show application integration.
- **Edit as text**, in the Test tab: a model's whole `.feature` file, comments and all. What does not read as Gherkin is not saved, and it says which line; a file changed since it was opened is not overwritten. A run no longer rewrites the file.
- **A scenario's last run is its test instance**, tagged `{ process, scenario, run }` in the database: there is no `.runs/` folder any more, and an old one can be deleted; earlier runs show as not run. A decision's test has no instance: its runs stay with the page that ran them.
- The Test tab's coverage is under the scenarios. "No problems found" and Rules show with the Problems tab only.
- The web app launches its server (`BPMNServer.launch`), so it handles data, not running executions. **`ENGINE_AT=none`** runs it with no engine: everything but running and testing a model works, and those say an engine is needed. **`npm run services`** scans the application's source, running none of it, and keeps its services' names in `services.json`, for the editor and the model checks.
- **The Design dashboard's models** show each model's description, its saved versions and its **coverage** by its scenarios; the coverage is saved with the runs, on their test instances, and says when the model has changed since. **Run** on the dashboard now keeps each scenario's run, as the Test tab does.
- **What happened**, under each step of the Test tab's timeline: that step's part of the Rationale, as the engine
  logged it, with Add as a check on an item it changed and on the instance's status; a step no step of the scenario
  asked for (a timer the server fired) has a row of its own. A scenario written in Gherkin lists its run's steps under
  its text, with Copy check. The Test tab no longer has a separate Rationale. The instance page's Rationale is split
  by the same steps, each opening to its rows. See `docs/docs/modeler.md`.
- **Coverage** in the Test tab shows one percentage beside its heading: nodes and flows together, as the Design
  dashboard counts them.
- **Restore as copy**, in the History tab: a saved version becomes a new model, opened in its own tab; the model and its unsaved changes stay.
- The Properties panel shows a **conditional event's condition**, saying that bpmn-server does not run the event, and a condition can be added to a flow out of an **event-based gateway**, as the engine evaluates it.
- **The task API**, `/api2/tasks`: an application lists, claims and completes tasks for its users, whom it authenticates itself. Off
  unless `API_ACTING_USER_KEY` is set; that key opens no other route. Existing routes are unchanged.
- **Coverage**, in the Test tab: how many of the model's nodes and flows the scenarios' last runs have reached; on the diagram, and what is left.
- **Test all paths**, in the Test tab: tries the model's paths on real runs, with each form's choices and the values in its conditions, and saves a scenario for each that reaches something new, marked as generated until reviewed. **Fill**, on an element not reached: records a new scenario with that element as its goal.
- The Test tab can complete a **receive task**: a run stopped there, as *Also waiting, not a step here*, and could not go on.
- The Test tab's scenario list can be resized: drag the handle beside it, or use the arrow keys. The width is remembered.
- The editor's **Condition** follows its **Language**, which now offers FEEL: a FEEL condition is no longer marked as not compiling.
- `GET /api/definitions/load/<model>`: a model's BPMN XML with the runtime key, and with administration off. **Anyone
  with `API_KEY` can now read your models' logic, including their scripts;** changing models stays under `/admin/api`.
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
  by itself: the scenario runs that task alone with the data given as its input;
  its run, Debug and checks as any other.
- **Connectors list:** each connector's key with a link to set or change it (its page's key form), and Delete,
  whose confirmation names the models that use it.
- **History tab: View, Restore, Delete.** View shows one version without comparing: its diagram in the main area,
  over the editor, and its report in the tab. Restore loads a saved version into the editor, unsaved; Save keeps
  it as the newest version, and no version is removed. Delete removes one version (`DELETE
  /model/history/<model>/<version>`); the others keep their numbers.
- **History tab:** a comparison's marked diagram opens in the main area, over the editor, instead of in the tab.

### Changed
- **The Test tab is one screen**: the Design and Runs sections are gone. A scenario has **Run** and **Record** (it was
  Start, then Start the process, Execute); its result in one line; its steps with their results; one list of checks.
  A recording closes by itself at the end. Simulate, Debug and Delete are
  by the result, Simulate and Debug each with a panel of its own; Inspect this run has the data, items, decisions and
  log. New has *The whole process* and *The task selected* (was Test this task); Clear all is **Delete all runs**, Duplicate
  and Delete are under **⋯**.
- **Add as a check**, in the Test tab, on each item and each value of the run shown: a check that it is as it is there, under its step,
  where the run waits (after the last step done, or at the start), else at the end. A check can be **at the start**
  (`"at": "start"`): once the process has started, before any step.
- **Which check failed**, in the Test tab: after a run, each check's shield under its step is green or red, and a failed check
  says what was found. A scenario result's checks also carry `check`, and a node check's `actual` is always how many times it ran.
- The Test tab's **Rationale**: the same table as the instance page, from the same code (was a plain list of the engine's decisions).
  The steps are closer together.
- A scenario in the Test tab keeps **only its last run**, and each new run deletes the instance of the one before (was the latest
  20, whose older instances were never deleted). The scenarios are a plain list, without runs under them.
- The Test tab's instances (`test-...`) are no longer in the lists of instances and tasks, or in My work; they open by their id.
- **Full window** in the editor's panel: the Problems, Report, Test and History tabs over the whole page; Esc comes back.
- **A setting for each thing `DEMO_MODE` did**: `SCRIPT_SANDBOX`, `SCRIPT_SANDBOX_SERVICES`, `TIMERS` and `SERVICE_TASKS`.
  `DEMO_MODE=true` only gives those not set their demo values, as before. `SCRIPT_SANDBOX=true` alone: scripts in a sandbox,
  their calls to `appServices` and `appUtils` run, and timers and service tasks as always.
  The Test tab's Evaluate runs in the sandbox whenever scripts do.
- **Download** in the editor: the model being edited, as a `.bpmn` file.
- **`SIGNUP_VERIFY_EMAIL`, `SIGNUP_GROUPS`, `SITE_URL`**: signing up can send a verification email and give groups once verified. Sign-up no longer answers twice when
  a user name is taken, and links in emails no longer always say `http://`.
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
- **After starting a process or completing a task, a user goes back to My work**, where their next task is; only
  administrators and designers go to the instance's page. Users who are neither were sent to the Workbench (after a
  task) or to the instance's page (after a start from My work).
- **The Rationale named an event by another element's item** when a seq was another element's (a test instance's
  items): it now takes the item of the element logged.
- **Signing in lands a user on My work**, and administrators and designers on the Workbench. A user's Workbench no
  longer asks for the diagram preview, a designer's route, which answered 403 on every visit.
- **Signing in goes on to the page it interrupted**: the session made at sign-in had dropped where it was going, so
  everyone landed on the Workbench.
- **The sign-in no longer writes the password to the log.**
- **A task form's own fields were saved as the task's data**: `_csrf` and `returnTo` are left out now.
- **A user name has one rule wherever a user is added** (Administration's Add user, signing up, the first start,
  `UserService.addUser`): 2 to 64 letters, digits or `. _ @ -`, taken without the spaces around it; a name that
  differs from another only in case is refused (`User1` beside `user1`). Add user also checks the email and the
  password (4 characters or more) on the server, and keeps no empty group. Users made before keep their names.
- **`bpmn-web-services`**, a command: the services scan (`services.json`) for an application, which had no way to run it.
- **Export left a model's tests out**: the export page lists each model's `.feature` files, and Download all (.zip) includes them.
- **The Test tab's scenarios were not saved while a check was being added** ("Scenarios not saved: 500"): a check with no element,
  path or status yet could not be written to the `.feature`, and the whole save failed. A check is written once it is filled in.
- **Security:** a model's name in a URL could climb out of the models folder (`/model/edit/..%2Fx`, `/execute/..%2Fx`, `POST /api/engine/start/..%2Fx`), so a user could read or start a `.bpmn` file outside it. Every such route now answers 400.
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

