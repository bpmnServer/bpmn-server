# Architecture

BPMN Server has three layers: a **host** that people and other systems talk to, an **engine** that runs processes, and a **core** of model and data handling that both of them use. The host and the engine can share a process or run apart, and the application's code always stays with the engine.

The **workflow pages and security** are one part of their own (the dashed box): sign-in, users and groups, and the
pages people work in. bpmn-web has a set, a skeleton to start from; your own application can be that part instead,
with the same server behind it, or inside it (a user manager: [Your application with the server inside](#your-application-with-the-server-inside)).
The **model editor** is a separate application, for designers.

```mermaid
flowchart LR
  subgraph Internet["Internet"]
    People["Users<br/>browsers, mobile apps"]
    Others["Applications<br/>bpmn-client, bpmn-mcp"]
  end

  subgraph UIZone["Workflow pages and security: bpmn-web's, or your application's"]
    Sec["Sign-in, users, groups, sessions"]
    Pages["My work, task forms,<br/>start forms, instance page"]
    Sec --> Pages
  end

  subgraph Core["BPMN Server: secure"]
    subgraph HostZone["API host"]
      REST["REST APIs"]
      Admin["Administration"]
      API["BPMNAPI<br/>each call as a user"]
      REST --> API
      Admin --> API
    end
    subgraph EngineZone["Engine: Secure and Isolated for tenants <br/>(ENGINE_AT, ENGINE_KEY)"]
      Engine["Engine<br/>executions, timers, decisions"]
      Code["Your code<br/>delegate, services, model scripts"]
      Engine --> Code
    end
  end

  subgraph DataZone["Data"]
    Store[("Workflow store")]
    Models["Models folder"]
  end

  subgraph EditorZone["Model editor: a separate application, for designers"]
    Editor["Editor, tests, history"]
  end

  People --> Sec
  Others -- "API keys" --> REST
  Pages == "as the signed-in user" ==> API
  API == "writes" ==> Engine
  API -. "reads" .-> Store
  Engine --> Store
  Engine --> Models
  Editor -- "tested models, through Git" --> Models

  classDef outside fill:#f1f5f9,stroke:#64748b,stroke-width:1px
  classDef replace fill:#e0f2fe,stroke:#0369a1,stroke-width:2px,stroke-dasharray:6 4
  classDef private fill:#fef9c3,stroke:#a16207,stroke-width:2px
  classDef inner fill:#fffbeb,stroke:#a16207,stroke-width:1px
  classDef data fill:#ecfdf5,stroke:#047857,stroke-width:1px
  classDef design fill:#f5f3ff,stroke:#6d28d9,stroke-width:1px
  class Internet outside
  class UIZone replace
  class Core private
  class HostZone,EngineZone inner
  class DataZone data
  class EditorZone design
```

bpmn-web's pages call `BPMNAPI` in the host's process; your application's pages call the REST APIs. Either way, each
call acts as the signed-in user. In development the host and the engine are one process, with the same calls between
them. What changes when your application replaces the box: [From the skeleton to your application](#from-the-skeleton-to-your-application).

## Who does what

| Part | Does | Doesn't |
|---|---|---|
| **Host** (`bpmn-web`) | Serves the pages, the model editor and the REST APIs. Signs users in. Reads and saves models, instances and tasks. | Run a process, a timer, a decision or a test. It asks the engine. |
| **Engine** | Runs processes, timers, decisions and tests. Holds your delegate and services. | Face users. Nothing but its host should reach it. |
| **Core** (`bpmn-server`) | Reads models, checks them, and stores data, for both of the above. | Depend on the web application. |

Calls between the host and the engine carry JSON, in the same process or between processes. So code behaves the same in both setups, and a test that passes against one is testing the same calls as the other.

## Isolation

Each zone of the diagram trusts the one inside it, and only that one:

| Boundary | What crosses it | What guards it |
|---|---|---|
| Internet → host | Pages, the model editor, REST calls | Sign-in and sessions (bpmn-web's, or your application's through its user manager), CSRF, API keys and tokens, rate limits; every call then acts as a user, with that user's rights |
| Host → engine | Writes: starting, completing, assigning, tests | A private address (`ENGINE_AT`) and a key (`ENGINE_KEY`); nothing else reaches the engine |
| Engine → your systems | What your services and connectors call | Your code, and the connectors' keys, which only the engine holds |

The engine runs your code: delegates, services, and the scripts in models. Kept in a process of its own, a script that loops or a
service that crashes stops the engine, not the pages. When it restarts, the waiting tasks and the timers are in the
store as they were; a step it was in the middle of is recovered from **Administration** (see
[Hung tasks](advanced.md#hung-tasks)). The host reads the store and the models folder directly, to show them, and writes only through the engine.

The engine can also run as a user of its own, or in a container of its own, with only its private address open: what the
separation makes possible, not what a default install does.

## Why the API is on the host

The REST APIs are a public door, so they are where the other doors are guarded: sign-in, keys, rate limits, in one place.
An API call that starts or completes something is passed to the engine, and the host returns the result.

The engine stays private because it runs code a model brings with it. Put the API in the engine, and that process would face
the internet. And the public address would be the engine's: restarting it, or moving it to another machine, would change
it for every client. With the API on the host, the engine can be restarted, moved or replaced behind it.

An application that embeds the engine (`BPMNServer.create`) has no HTTP API at all: it calls `BPMNAPI` in its own process.

## The UI and the API

The host has three doors, and they meet at one API:

| Door | Used by | Reaches the engine through |
|---|---|---|
| Pages: My work, task forms, the instance page | Browsers | API v3's operations (My work, starting a process), else `BPMNAPI`; as the signed-in user |
| The model editor's routes (`/model/...`) | The model editor in the browser | The core, for models, checks and history; `BPMNAPI` for runs and tests |
| REST: `/api/v3` | Other applications, your pages, AI agents | `BPMNAPI`, as the user a token (or your application's own credential) stands for, or as the service account (`API_KEY`) |
| REST: `/api`, `/api2`, `/api2/tasks` (frozen) | Older applications | `BPMNAPI`, as the key's service account or as the acting user |

The pages are becoming clients of API v3 like any other: My work and starting a process use its operations, in the
host's process, as the person API v3 would take; the other pages still call `BPMNAPI` directly. One contract to secure and to test,
and, once every page is on it, a UI that can run apart from the host. [API v3](api-v3.md) has the contract.

## From the skeleton to your application

bpmn-web is where an application starts, not necessarily where it ends. What your application does with each part:

| Part of bpmn-web | In your application |
|---|---|
| Sign-in, users and groups, the setup page | **Replaced** by your own: your sign-in, your user directory, your roles. The engine needs only each call's user and groups (`IUserInfo`); bpmn-web takes them from your user manager when it runs inside your application |
| My work, task forms, the start form, the instance page | **Replaced** by your pages, which call the REST APIs (or `BPMNAPI`, embedded). bpmn-web's are working examples to copy from |
| The engine, `BPMNAPI`, your delegate and services | **Kept**: this is what runs your processes |
| REST APIs | **Kept**, behind your application, on a private network |
| Administration | **Kept**, for your administrators, on the private network |
| Model editor, tests, Design dashboard | **Kept** as a stand-alone application for designers: a design server, whose tested models reach production through Git |

### Your application in control

Your application is the dashed box: it signs its users in and serves its own pages, and the rest of the diagram runs
on a private network behind it, with design off (`DISABLE_DESIGN=true`): the REST APIs, Administration and the engine.
In detail:

```mermaid
flowchart LR
  subgraph Internet["Internet: your users"]
    People["Browsers, mobile apps"]
  end

  subgraph AppZone["Your application: the public door"]
    AppGuard["Your sign-in, your users,<br/>your security"]
    AppPages["Your pages and forms<br/>task lists, requests"]
    AppGuard --> AppPages
  end

  subgraph Private["Private network: only your application and your staff reach it"]
    subgraph HostZone["bpmn-web in production: REST APIs and Administration (DISABLE_DESIGN=true)"]
      REST["REST APIs<br/>/api (API_KEY): start for a user<br/>/api2/tasks (API_ACTING_USER_KEY): tasks"]
      Admin["Administration<br/>for your administrators"]
      API["BPMNAPI<br/>each call as a user"]
      REST --> API
      Admin --> API
    end
    subgraph EngineZone["Engine process (ENGINE_AT, ENGINE_KEY)"]
      Engine["Engine<br/>executions, timers, decisions"]
      Code["Your code<br/>delegate, services, model scripts"]
      Engine --> Code
    end
  end

  subgraph DesignZone["Design server: bpmn-web, stand-alone, for designers"]
    Editor["Model editor, tests,<br/>Design dashboard"]
  end

  subgraph DataZone["Data"]
    Store[("Workflow store")]
    Models["Models folder"]
    AppDb[("Your database<br/>your users, your records")]
  end

  Git["Git<br/>models, tests, services"]

  People --> AppGuard
  AppPages == "server to server: start, list tasks,<br/>complete as a user, deliver messages" ==> REST
  AppGuard --> AppDb
  API == "writes" ==> Engine
  API -. "reads" .-> Store
  Engine --> Store
  Engine --> Models
  Code --> AppDb
  Editor -- "tested models" --> Git
  Git -- "released" --> Models

  classDef outside fill:#f1f5f9,stroke:#64748b,stroke-width:1px
  classDef data fill:#ecfdf5,stroke:#047857,stroke-width:1px
  classDef private fill:#fef9c3,stroke:#a16207,stroke-width:2px
  classDef public fill:#e0f2fe,stroke:#0369a1,stroke-width:2px
  classDef inner fill:#fffbeb,stroke:#a16207,stroke-width:1px
  classDef design fill:#f5f3ff,stroke:#6d28d9,stroke-width:1px
  class Internet outside
  class AppZone public
  class Private private
  class HostZone,EngineZone inner
  class DataZone data
  class DesignZone design
```

- BPMN Server signs nobody in here: it trusts the user your application names, because your application holds its
  keys. Keep the keys on your application's server, and bpmn-web where only your application and your staff reach it.
- Your application starts a process **for** one of its users, lists, claims and completes their tasks with
  `/api2/tasks` and `API_ACTING_USER_KEY`: the user is the initiator, and each task comes with its form. `/api2` would
  start it as its service account. [Integrate an existing application](integrate.md) has the steps.
- Designers work on a design server of their own. A model reaches production as a file, tested, through Git: see
  [Release](tutorial/release.md).

### Your application with the server inside

Your application and bpmn-web are one server: bpmn-web runs in your application's process, with your routes and pages
mounted in it, and **your application signs people in**. bpmn-web keeps no users, sessions or credentials of its own:
it takes the person from your application's **user manager**. Your pages show the workflow pages (My work, the
Workbench, the model editor, Administration) in your own layout, and your models call your application's API through a
connector. `apps/hrdemo` is this setup: an HR application with the server in it.

```mermaid
flowchart LR
  subgraph Internet["Internet: your users"]
    People["Browsers, phones"]
  end

  subgraph AppProcess["One server: your application, with bpmn-web in it"]
    subgraph AppZone["Your application"]
      UM["Your user manager<br/>sign-in, users, roles, sessions"]
      AppPages["Your pages, your layout<br/>the workflow pages inside it,<br/>a To do panel"]
      AppApi["Your REST API<br/>your records"]
    end
    subgraph HostZone["bpmn-web"]
      WfPages["Workflow pages<br/>My work, task forms, Workbench,<br/>model editor, Administration"]
      V3["API v3<br/>as the person your user manager names"]
      API["BPMNAPI<br/>each call as a user"]
      WfPages --> V3
      V3 --> API
    end
    subgraph EngineZone["Engine"]
      Engine["Engine<br/>executions, timers, decisions"]
      Code["Your code, connectors"]
      Engine --> Code
    end
  end

  subgraph DataZone["Data"]
    AppDb[("Your database<br/>users, sessions, records")]
    Store[("Workflow store")]
    Models["Models folder"]
  end

  People --> UM
  UM -- "req.user, its session" --> WfPages
  UM -- "apiUser" --> V3
  AppPages -- "tasks, as the person" --> V3
  UM --> AppDb
  API == "writes" ==> Engine
  Engine --> Store
  Engine --> Models
  Code -- "connector, its own key" --> AppApi

  classDef outside fill:#f1f5f9,stroke:#64748b,stroke-width:1px
  classDef data fill:#ecfdf5,stroke:#047857,stroke-width:1px
  classDef public fill:#e0f2fe,stroke:#0369a1,stroke-width:2px
  classDef inner fill:#fffbeb,stroke:#a16207,stroke-width:1px
  class Internet outside
  class AppProcess,AppZone public
  class HostZone,EngineZone inner
  class DataZone data
```

**Who signs people in: your user manager.** bpmn-web asks one thing of your application, an `IUserManager` given to
`start({ userManager })`:

| It does | When |
|---|---|
| `init(app)`: your sessions, and on each request `req.user` (the person: `userName`, `userGroups`) | First, before bpmn-web's middleware |
| `setup(app)`: `/login` and `/logout`, your own pages or sending people to them | Before bpmn-web's routes |
| `apiUser(req)` (optional): who a call to API v3 is from, by your own credential (your session, your token) | Each call to `/api/v3` |

- **Your roles become groups.** The groups `req.user` carries are what the models name: a lane, a task's candidate
  groups, `ADMIN` and `DESIGNER` for administering and designing. The HR demo's roles give `Employee`, `Manager`,
  `HR` and `ADMIN`.
- **Your application issues the credentials.** API v3 takes the person your `apiUser` names; bpmn-web issues no tokens
  and no links for AI agents (`POST /api/v3/tokens` and `/ai/key` refuse). The service key (`API_KEY`) stays, for
  server-to-server calls. Signing out of your application signs out of the workflow pages too: they have no session
  of their own.
- **bpmn-web manages no users.** No setup page at the first start, no sign-up; Administration and `/api/v3/users` say
  your application manages them. bpmn-web's own sign-in is its default user manager, unchanged.
- **The engine is unchanged.** It needs only each call's `IUserInfo`: task assignment is by name and group, checked
  against that person. Finding people (a group's members, an email) is your application's, in its delegate.

**Your pages and the workflow pages, one site.** Your routes are mounted in bpmn-web's server (`start({ routes })`),
before its own, so your pages, your API and the workflow pages share one address and one sign-in:

- The workflow pages open inside your layout, in a frame of the same site, with bpmn-web's menu bar hidden: the HR
  demo's sidebar has a Workflow section, and `/hr/workflow/<page>` shows bpmn-web's `<page>`.
- Your pages call API v3 with the person's session: the HR demo's **To do** panel lists their tasks (assigned to them,
  available to them, recently done) on every page, and opens a task's form.
- *Planned:* a task can name one of your forms instead of its fields (`camunda:formKey="app:<name>"`): see the design
  note `docs/design/form-keys.md`.

**Your models call your application.** A connector, made from your API's OpenAPI document, is how a model reaches your
records: the HR demo's `hr` connector (Assign Employee reads an employee and creates an assignment). It calls with a
key of its own (`HR_SERVICE_KEY`, kept encrypted with `CONNECTORS_KEY`); your API takes that key or a signed-in
person, and nothing else.

The design: `docs/design/host-users.md`.

### Embedded

Your application holds the engine in its own process, with no HTTP between them: your pages call `BPMNAPI`.

```mermaid
flowchart LR
  subgraph Internet["Internet: your users"]
    People["Browsers, mobile apps"]
  end

  subgraph AppZone["Your application's process: the public door, and the engine in it"]
    AppGuard["Your sign-in, your users,<br/>your security"]
    AppPages["Your pages and forms"]
    API["BPMNAPI<br/>each call as a user (SecureUser)"]
    Engine["Engine<br/>executions, timers, decisions"]
    Code["Your code<br/>delegate, services, model scripts"]
    AppGuard --> AppPages
    AppPages -- "in-process calls" --> API
    API --> Engine
    Engine --> Code
  end

  subgraph DataZone["Data"]
    Store[("Workflow store<br/>MongoDB, SQLite or memory")]
    Models["Models folder"]
    AppDb[("Your database")]
  end

  People --> AppGuard
  API -. "reads" .-> Store
  Engine --> Store
  Engine --> Models
  Code --> AppDb
  AppGuard --> AppDb

  classDef outside fill:#f1f5f9,stroke:#64748b,stroke-width:1px
  classDef data fill:#ecfdf5,stroke:#047857,stroke-width:1px
  classDef public fill:#e0f2fe,stroke:#0369a1,stroke-width:2px
  class Internet outside
  class AppZone public
  class DataZone data
```

The simplest, and the least isolated: a model's scripts run in your web application's process. See
[Embedding the engine](embedding.md).

### The four, side by side

| | Public door | Who signs users in | Workflow pages | Model code runs |
|---|---|---|---|---|
| bpmn-web's pages and security | bpmn-web | bpmn-web | bpmn-web's | In the engine's process, private |
| Your application with the server inside | Your application, bpmn-web in its server | Your application (its user manager) | bpmn-web's in your layout, and yours | In the engine's process |
| Your application in control | Your application | Your application | Yours, through the REST APIs | In the engine's process, private, behind bpmn-web |
| Embedded | Your application | Your application | Yours, through `BPMNAPI` | In your application's process |

## Ways to run it

| Setup | Host | Address | Engine | Set with |
|---|---|---|---|---|
| **Development and test** | 1 | 1 | 1, in the host's process | Nothing: this is the default |
| **Production** | 1 | 1 | 1, in its own process | `ENGINE_AT`, `ENGINE_KEY` |
| **Design only** | 1 | 1 | None | `ENGINE_AT=none` |

[Installation](setup.md#ways-to-run-it) has the settings for each one.

Your application can also embed the engine with no host at all, using `new BPMNServer(...)` or `BPMNServer.create(...)`: see [Application Integration](customization.md).

## Users

Only signed-in users use a server. There is no guest access. Each person has an account, and their groups decide what they can do: see
[Security](security.md). The accounts are bpmn-web's own (its default user manager), or your application's when it
signs people in ([Your application with the server inside](#your-application-with-the-server-inside)).

## Tests

Every test runs in the engine, including one started from the model editor. The host passes the test to the engine and shows the results, so a test runs your real delegate and services the way a real process does.

Tests are Gherkin `.feature` files beside their models. A scenario's last run is its test instance in the database, tagged with its process and scenario. See [Testing and debugging models](testing.md).

## Where things are kept

| What | Where |
|---|---|
| Models, decisions, their tests and version history | Files in the models folder (`DEFINITIONS_PATH`) |
| Connectors | Files in the models folder (`<id>.connector.json`); their keys, encrypted, in the workflow store |
| Instances, tasks, locks and test runs | The workflow store |
| Users and sessions | bpmn-web's: the workflow store, beside the instances (MongoDB, SQLite or memory). Your application's, with its user manager: your database |
| Your business records | Your own database. A process keeps an identifier and calls your services |

## Packages

| Package | Is |
|---|---|
| `bpmn-server` | The engine and core |
| `bpmn-web` | The host |
| `bpmn-client` | A REST client, for another Node.js application |
| `bpmn-mcp` | Connects AI clients to a running server over MCP. `npx bpmn-server init` installs it |
