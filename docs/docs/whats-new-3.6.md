# What's new in 3.6

bpmn-server 3.6 separates the host from the engine, removes guest access and moves every test to Gherkin.

## Before you upgrade

- **No more admin/admin:** a new server's first page asks for the administrator, with a setup token it prints. Servers that already have users don't change. `ADMIN_PASSWORD` still makes `admin` at setup.
- **Guest users:** on a server that had `GUEST_ACCESS` on, delete the users in the group `GUEST` first. A session they kept would otherwise sign them in as a designer of the shared models. `GUEST_ACCESS`, `GUEST_SAVE`, `GUESTS_PATH`, `GUEST_MAX_MODELS` and `GUEST_RATE_LIMIT` are gone.
- **Test files change on start-up:** each `<model>.tests.json` and `<decision>.dmn.tests.json` in the models folder becomes a `.feature` file, and the JSON is deleted. A file that wouldn't read back as the same tests stays as it is, keeps working, and is reported in the log. Keep the folder in Git or back it up first.
- **Earlier test runs aren't carried over:** every scenario shows as not run and coverage starts empty, until you run the scenarios again. The old `.runs` folder is no longer read and can be deleted.
- **The Docker image is now `bpmnserver/bpmn-server`.** An installation whose `.env` names `ralphhanna/bpmn-server` or
  `ralphhanna/bpmn-web` keeps that image until you change `BPMN_IMAGE` (`bpmn env`); those images are no longer updated.
- **Passwords were written to the log at sign-in** in earlier versions. Rotate them if your logs are kept or shared.
- **Mocha and scenario files are gone from the sample application:** the engine's scenarios, and `test/custom/*.json`, are now `processes/<model>.engine.feature`, and `npm run test:scenarios` runs them. If you copied `test/custom/scenarios.test.ts` into your application, it keeps working on your own JSON files, but it is no longer maintained.

## The host and the engine

The engine can run in a process of its own, with your delegate and services inside it, while the host serves the pages and the APIs. See [Architecture](architecture.md) and [Ways to run it](setup.md#ways-to-run-it).

Nothing changes unless you ask for it: without `ENGINE_AT`, the engine runs in the host's process as before.

## AI clients (MCP)

`bpmn-mcp` is now on npm, released with the other packages, and `npx bpmn-server init` installs it and writes `.mcp.json`, so an AI client can use the server. An application made before can add it with `npm install bpmn-mcp`. See [AI clients](setup.md#ai-clients-mcp).

## Tests in Gherkin

Tests are now `.feature` files beside their models, and they run whole in the engine. They can stub a service or a timer, wait for something that happens later, find a particular item, and say which feature they cover. See [Testing and debugging models](testing.md#tests-in-gherkin).

## The Test tab

- **Edit as text** opens a model's whole `.feature` file in the tab. Text that doesn't parse isn't saved, and the error gives the line.
- A run no longer rewrites the `.feature` file, so comments you typed stay until someone changes a scenario through the form.
- **Coverage** is now under the scenarios.
- A scenario's last run is its test instance in the database, tagged with its process and scenario. **Deleting that instance deletes the run and its coverage.**
- **A decision's test runs are no longer saved.** A decision test has no instance to tag, so its runs last until the page is reloaded. The tests themselves are saved.

## The Rationale, step by step

The engine now logs each operation on an instance (`Start Process`, `Invoke Item`, `Timer Fired`, ...) and its outcome:
the instance's status, the items that changed and what waits. On the instance page the Rationale is split by these
steps, each a line that opens to what followed and why. In the Test tab, each step of the timeline has **What
happened**: its rows, **Add as a check** on an item it changed, and its checks under the rows they check. Coverage
shows one percentage, nodes and flows together. See [The model editor](modeler.md) and [Workflow execution](execution.md).

## Signing in

A user who is neither an administrator nor a designer lands on **My work**; signing in goes on to the page it
interrupted; the password is no longer written to the log. An administrator can **Force** a waiting receive task, as
an event.

## Building workflows with an AI agent

A guide for AI agents that build workflows on BPMN Server: the loop, what to read, working locally (`verify --json`,
`npm test`), and the API calls that work remotely today. See [Building workflows with AI](ai/building-workflows.md).
A new application's `npm test` runs every model's `.feature` file in memory.

## Docker on Windows

`bpmn.cmd` gives the Docker installation's `bpmn` commands (status, logs, the console, ...) in PowerShell or `cmd`,
without WSL. See [Docker](docker.md).

## The model editor

"No problems found" and **Rules** now show only on the Problems tab.

## Comments on the docs

The documentation pages now have comments, kept in the project's GitHub Discussions. Commenting needs a GitHub account.
