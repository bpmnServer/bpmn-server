# Architecture

BPMN Server has three layers: a **host** that people and other systems talk to, an **engine** that runs processes, and a **core** of model and data handling that both of them use. The host and the engine can share a process or run apart, and the application's code always stays with the engine.

The **workflow pages and security** are one part of their own (the dashed box): sign-in, users and groups, and the
pages people work in. bpmn-web has a set, a skeleton to start from; your own application can be that part instead,
with the same server behind it. The **model editor** is a separate application, for designers.

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
| Internet → host | Pages, the model editor, REST calls | Sign-in and sessions, CSRF, API keys, rate limits; every call then acts as a user, with that user's rights |
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
| Pages: My work, task forms, the instance page | Browsers | `BPMNAPI`, as the signed-in user |
| The model editor's routes (`/model/...`) | The model editor in the browser | The core, for models, checks and history; `BPMNAPI` for runs and tests |
| REST: `/api`, `/api2`, `/api2/tasks` | Other applications | `BPMNAPI`, as the key's service account or as the acting user |

So the pages and the REST APIs share the API and its rules, but not the HTTP contract: each door says in its own way who the
user is. A UI that is a client of the REST API, signed in with its session, would give one contract to secure and to
test, and a UI that could run apart from the host. It is on the roadmap.

## From the skeleton to your application

bpmn-web is where an application starts, not necessarily where it ends. What your application does with each part:

| Part of bpmn-web | In your application |
|---|---|
| Sign-in, users and groups, the setup page | **Replaced** by your own: your sign-in, your user directory, your roles. The engine needs only each call's user and groups |
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
- Your application starts a process **for** one of its users with `/api` and `API_KEY`, so the user is the initiator;
  `/api2` would start it as its service account. It lists, claims and completes the user's tasks with `/api2/tasks` and
  `API_ACTING_USER_KEY`. [Integrate an existing application](integrate.md) has the steps.
- Designers work on a design server of their own. A model reaches production as a file, tested, through Git: see
  [Release](tutorial/release.md).

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

### The three, side by side

| | Public door | Who signs users in | Model code runs |
|---|---|---|---|
| bpmn-web's pages and security | bpmn-web | bpmn-web | In the engine's process, private |
| Your application in control | Your application | Your application | In the engine's process, private, behind bpmn-web |
| Embedded | Your application | Your application | In your application's process |

## Ways to run it

| Setup | Host | Address | Engine | Set with |
|---|---|---|---|---|
| **Development and test** | 1 | 1 | 1, in the host's process | Nothing: this is the default |
| **Production** | 1 | 1 | 1, in its own process | `ENGINE_AT`, `ENGINE_KEY` |
| **Design only** | 1 | 1 | None | `ENGINE_AT=none` |

[Installation](setup.md#ways-to-run-it) has the settings for each one.

Your application can also embed the engine with no host at all, using `new BPMNServer(...)` or `BPMNServer.create(...)`: see [Application Integration](customization.md).

## Users

Only signed-in users use a server. There is no guest access. Each person has an account, and their groups decide what they can do: see [Security](security.md).

## Tests

Every test runs in the engine, including one started from the model editor. The host passes the test to the engine and shows the results, so a test runs your real delegate and services the way a real process does.

Tests are Gherkin `.feature` files beside their models. A scenario's last run is its test instance in the database, tagged with its process and scenario. See [Testing and debugging models](testing.md).

## Where things are kept

| What | Where |
|---|---|
| Models, decisions, their tests and version history | Files in the models folder (`DEFINITIONS_PATH`) |
| Instances, tasks, locks and test runs | The workflow store |
| Users and sessions | The application's MongoDB database |
| Your business records | Your own database. A process keeps an identifier and calls your services |

## Packages

| Package | Is |
|---|---|
| `bpmn-server` | The engine and core |
| `bpmn-web` | The host |
| `bpmn-client` | A REST client, for another Node.js application |
| `bpmn-mcp` | Connects AI clients to a running server over MCP. `npx bpmn-server init` installs it |
