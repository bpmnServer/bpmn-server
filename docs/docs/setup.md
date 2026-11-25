# Installation

## An application on bpmn-server and bpmn-web

```sh
npx bpmn-server init my-app      # asks the folder, what to start from and the settings; --memory --yes to try it without MongoDB
cd my-app
npm start                        # http://localhost:3000: sign in as admin, with the password it prints the first time
```

`init` creates the sample application: `processes/` (Hello, Buy Used Car, Leave Application,
employee-onboarding, Business Rules, GitHub repository),
`connectors/` (the editor's element templates), `delegates/` (the app delegate, on bpmn-web's `WebAppDelegate`,
and the services the models call, `appServices.ts`), `settings/config.ts` (the settings
you change), `index.ts` (starts bpmn-web) and `.env`. `--minimal` creates a one-model Hello application instead, and `--hrdemo` starts from the HR demo (its own pages, users and
API, and the workflows that call them; from the repository only, so far). The HR demo `init` makes signs people in for
real: its home page lists the accounts and their password, and `HR_DEMO_SIGN_IN_AS=false` in its `.env` leaves out the
one-click "Sign in as" buttons the public demo has.
`npm run setup` asks the settings step by step (below), then prepares the database and stops (with no terminal, as
in a script, it only prepares the database); `npm run cli` opens the console, `npm run verify` checks the
models.

### The settings, step by step

```sh
npx bpmn-server setup my-app     # a new application, then its settings; in an application's folder: npx bpmn-server setup
```

`init`, at a terminal, asks the folder and what to start from (the sample application, or the HR demo), then the same steps
as `setup`. `setup` asks for the settings in `.env` step by step, and only what a server needs to start:

1. **The database**: MongoDB, a MongoDB in memory (nothing to install; the data goes when the server stops), or a SQLite
   file (`DATABASE=sqlite:<file>`; one writer at a time, Node 22.5 or later). Checked: when it does not answer, you are
   asked whether to keep the address anyway.
2. **The site**: its port, and the address people reach it by.

Sign-in and the security rules are switched on without a question, and the API keys, the session secret and `SECRETS_KEY` are made (`SECRETS_KEY` encrypts the secrets the server stores, a connector's own key: it is made once, never offered again, and not made where `CONNECTORS_KEY`, its name before 3.7.5, is set). The
administrator is not asked either: the server makes it the first time it starts ([The first start](#the-first-start)). Every
other setting is changed on **Dashboard > Settings** once the server runs ([Settings](settings.md)); `--explain` shows each
setting's own description beside the questions.

`init` makes a development server and does not ask what it is for. `setup` on an existing application first asks whether it
is for **production** or **development**, which suggests the values. Enter keeps the value shown, and a question asked
three times without an answer takes its default, so the dialog never loops. Nothing is written until you confirm the
summary (secrets shown as `***`), and the `.env` before is kept as `.env.bak`. `init` makes its folder last: answer no, and nothing was created. Run `setup` again any time to change them.
`--yes` asks nothing: the profile's values and new keys where there are none (`--profile production|development`,
`--no-check`). It reads the settings schema of bpmn-web 3.7 or later.

### The first start

There is no admin/admin. A new server has no users, and its first start makes one: `admin`, in the group `ADMIN`, with the
address `ADMIN_EMAIL` (`admin@example.com` when unset) and a password it makes up and **prints once, where it runs**: read the
console, or the log. Sign in as `admin`, and change the password on **My account**. No password is written to `.env`: a secret
in a file is one more place it leaks from. A server on the in-memory database, which keeps nothing, makes it again, with a new
password, each time it starts.

To choose the password instead, set `ADMIN_PASSWORD` (and `ADMIN_EMAIL`) in `.env` before the first start. The Docker files and
the server install script do, and print it.

There is no page that asks for the administrator, so nobody who reaches a new server first can make themselves one: only
someone who can read the server's console or log has the password. A server whose users were all removed makes `admin` again
the next time it starts. The tutorials use two more users, `user1` and `manager1`: add them on **Dashboard > Administration**
(groups `Employee`, and `Employee, Manager`).

### To Update

```sh
npm update bpmn-server bpmn-web bpmn-mcp
```

### On a server, in one line

On a new Linux server (Ubuntu 22.04 or 24.04), one line installs everything (Node.js, MongoDB, the application,
nginx, a service; HTTPS with `--domain`) and prints the address and a generated admin password:

```sh
curl -fsSL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/deploy/install.sh | sudo bash
```

It also works as a cloud server's launch script (AWS Lightsail's "Add launch script"). See
[deploy/](https://github.com/bpmnServer/bpmn-server/tree/main/deploy).

## AI clients (MCP)

Every application `init` creates with the REST APIs includes `bpmn-mcp`, which lets an AI client use the server: list models, start processes, complete tasks. `.mcp.json` registers it for clients that read one, such as Claude Code. It reads the application's `.env`, and the server has to be running.

!!! warning
    It gets what the keys in `.env` allow, including deleting instances and replacing models. To stop it changing models, point `BPMN_ENV_FILE` at a file of its own without `ADMIN_API_KEY`.

For Codex, Claude Desktop and other clients, or to add it to an existing application, see the [bpmn-mcp README](https://github.com/bpmnServer/bpmn-server/tree/main/packages/bpmn-mcp).

## Ways to run it

Every setting is listed in [Settings](settings.md). An application runs in one of these ways. [Architecture](architecture.md) explains the parts.

| Setup | Engine | Settings |
|---|---|---|
| **Development and test** | In the host's process | None: the default |
| **Production** | In its own process | `ENGINE_AT`, `ENGINE_KEY` |
| **Design only** | None: models can be edited and saved, but nothing runs | `ENGINE_AT=none` |

### Development and test

`npm start` is all it takes: the host and the engine share one process, with your delegate and services in it.

### Production

The engine runs in its own process, with your delegate, services and timers. The host holds none of them, and asks the engine over HTTP.

Start the engine, with a secret of your choosing as its key:

```sh
ENGINE_KEY=your-secret npm run engine
```

Then start the host, pointing at it:

```sh
ENGINE_AT=http://127.0.0.1:3001 ENGINE_KEY=your-secret npm start
```

`npm run engine` runs the application's `engine.ts`. `apps/testSampleApp/engine.ts` in the repository is the one to copy, because `npx bpmn-server init` doesn't create it yet.

| Setting | On | Means |
|---|---|---|
| `ENGINE_AT` | Host | The engine's address. Unset or `local`: in this process. `none`: no engine |
| `ENGINE_KEY` | Both | The secret the host sends and the engine checks |
| `ENGINE_PORT` | Engine | Its port. Default `3001` |
| `ENGINE_LISTEN` | Engine | The address it listens on. Default `127.0.0.1`, this machine only |

- **Give both processes the same database and models folder.** The engine reads and writes the instances; the host only reads them, and writes its own users, sessions and API tokens there. The host writes the models' and the connectors' files, and tells the engine, which updates its index of them.
- **`SECRETS_KEY` is the engine's only.** The connectors' keys are set, kept encrypted and used by the engine; the host needs no `SECRETS_KEY`.
- **Keep the engine private.** Only the host should be able to reach it. Change `ENGINE_LISTEN` only if the host is on another machine, and then only on a private network.
- **Turn design off, on both.** `DISABLE_DESIGN=true` removes the model editor, the Design dashboard and test runs from the host's pages, and the test calls from the engine. Without it, anyone with `ENGINE_KEY` can run a test's scripts on the engine. Models then arrive through the admin REST APIs, and the admin APIs stay on.
- **Leave tests out of a deployment.** A production server doesn't run them, so don't deploy `*.feature` files.
- **Check the settings the server refuses to start without.** See [Security](security.md).

### Design only

`ENGINE_AT=none` starts the host with no engine. Models can be edited and saved, and anything that would run says an engine is needed.

## The source, with the sample application

bpmn-server, bpmn-client, bpmn-web, the sample application (`sampleApp`) and the working application with the tests (`testSampleApp`) are one repository, [bpmnServer/bpmn-server](https://github.com/bpmnServer/bpmn-server):

```sh
git clone https://github.com/bpmnServer/bpmn-server.git
cd bpmn-server
npm install
npm run build
cd apps/testSampleApp
cp .env.example .env             # set MONGO_DB_URL
npm run setup
npm start
```

## bpmn-client: another application calling the server

bpmn-client calls a running bpmn-server application over its REST API, from another Node.js application (in a
new folder, or an existing project):

```sh
npm init -y && npm pkg set type=module      # a new project; skip in an existing one
npm install bpmn-client
npx bpmn-client-setup                       # writes .env: API_KEY, HOST, PORT
```

Set `.env` to the server: `API_KEY` is the server's (from its `.env`), `HOST` and `PORT` where it runs.

```sh
npx bpmn-client-cli                         # a console on the server: start processes, list and invoke items
```

```js
import 'dotenv/config';
import { BPMNClient3 } from 'bpmn-client';

const service = new BPMNClient3({ url: `http://${process.env.HOST}:${process.env.PORT}`, apiKey: process.env.API_KEY });
const ada = service.as('ada', ['staff']);              // every call acts as this person
const { instance, task } = await ada.processes.start('Hello', { name: 'Ada' });
```

See [bpmn-client](bpmn-client.md) for the API. To update: `npm update bpmn-client`.

## The engine's own configuration

An application that creates the engine itself passes a `Configuration`: the models folder, the storage, the timers
and the components. See [Configuring the engine](configuration.md).

## The packages

| Package | |
|---|---|
| [bpmn-server](https://github.com/bpmnServer/bpmn-server) | The engine: execution, storage, the API, `verifyModel` and the `bpmn-server` command |
| [bpmn-web](https://github.com/bpmnServer/bpmn-server/tree/main/packages/bpmn-web) | The web application on it: the Workbench, the model editor, Administration, the REST APIs |
| [bpmn-client](https://github.com/bpmnServer/bpmn-server/tree/main/packages/bpmn-client) | Calls a running server's API from another Node.js application |
| [bpmn-mcp](https://github.com/bpmnServer/bpmn-server/tree/main/packages/bpmn-mcp) | Connects AI clients to a running server over MCP; `npx bpmn-server init` installs it |
