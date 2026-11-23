# OmniWorkflow (BPMN Server)

OmniWorkflow runs business processes. A process is drawn as a BPMN diagram: the steps, who does each one, the
decisions along the way and the deadlines. OmniWorkflow follows the diagram for every case: it gives tasks to the right
people, calls the services that do the automatic steps, waits for answers and timers, and keeps each case until it ends.
For every case it records what happened and why.

It is open source, written in TypeScript for Node.js, and comes as three packages:

- **bpmn-server**, the engine. It runs the processes and stores the cases.
- **bpmn-web**, the web application on top of it: the Workbench where people see and do their tasks, the model editor
  where the processes are drawn and tested, the Settings page, and the API other applications call.
- **bpmn-client**, for another application that calls a running server.

## What it does

**Runs BPMN processes.** User tasks, service and script tasks, gateways, timers, messages and signals, subprocesses,
loops, error handling and compensation: the parts of BPMN 2.0 that business processes use.

**Makes decisions with DMN.** Business rules are written as decision tables and called from the processes.

**Gives the work to the right people.** A task goes to a person or a group, by the diagram's lanes or by an assignment
policy. Access policies say who may see a case and what they may do in it.

**Connects to other systems.** A service task calls the application's own code, or a REST API described by its OpenAPI
document. Other applications start processes and complete tasks through the API.

**Tests the processes before they run for real.** The model editor checks a model as it is drawn, and runs its test
scenarios in the engine. The same tests run in a build.

**Explains each case.** Every step is recorded with what decided it, so anyone can see why a case went the way it did.

**Works with AI agents.** An agent can read what a site offers, build a process with its forms and rules, write
and run its tests, and fix what fails, all through the API. See [Working with an AI agent](#working-with-an-ai-agent).

The full list of features, each with its documentation and its tests, is on the [Features](features.md) page.

## How it is used

OmniWorkflow can be used in four ways:

- **On its own, as a workflow application.** bpmn-web is the application: people sign in, start processes and do their
  tasks in the Workbench. [Build an application](build.md) sets one up; the [tutorials](tutorial/start.md) build one
  example, a leave request, from the first diagram to its release.
- **Behind an existing application.** The application keeps its own screens and users, and calls OmniWorkflow's API to
  start processes and to list and complete its users' tasks. See
  [Integrate an existing application](integrate.md).
- **Inside a Node.js program.** The engine runs in the program's own process, with no web application. See
  [Embedding the engine](embedding.md).
- **With an AI agent doing the work.** An agent builds the processes and their tests over the API, in any of the
  three ways above: see below.

Two public sites need nothing installed: [demo.omniworkflow.com](https://demo.omniworkflow.com) is a finished HR
application with OmniWorkflow inside it, to look through, and [try.omniworkflow.com](https://try.omniworkflow.com) is
the workbench, to build your own workflows in. [Try it online](first-workflow.md) says what to do on each.

## Working with an AI agent

A workflow is a diagram, some rules and a set of tests, all of them files and API calls. An AI agent can do that work,
and OmniWorkflow is built so that it can check its own output instead of guessing.

**What an agent needs to start** is a server's address. Every server answers **`/llms.txt`** with what that site has:
its API, the services and connectors it offers, its user groups, its own rules, and a guide to building workflows on
it. An agent given nothing but the address can read that and begin.

**How an agent works, and why its output can be trusted:**

1. It reads the site's `/llms.txt`, and the guide behind it.
2. It writes a model: the steps, who does each, the forms, the decisions.
3. It asks the server to **check** the model. The answer names what is wrong or missing, and what to do about it.
4. It writes the model's **tests** as scenarios, and runs them in the engine: the same engine that will run the real
   cases.
5. It fixes what fails, and repeats until the tests pass.

Steps 3 to 5 are the point: the agent is not asked to be right the first time. The server tells it what is wrong, and
the tests say whether the process does what was asked. A person reviews a model that already checks and tests clean.

**Giving an agent access.** A person signs in and asks for a link for their agent. The link acts as that person, at a
level they choose: to work on their own tasks, to design models, or to read the settings and advise on them. It lasts
minutes, not forever, and it can be revoked. An agent never gets more than the person has. See the
[AI Agents add-on](add-ons/ai.md).

**Four things to ask an agent for.** Each of these is a prompt to paste into your agent as it is.

**Explore** an application that already uses OmniWorkflow, changing nothing:

```text
Show me how OmniWorkflow is integrated into the HR demo at https://demo.omniworkflow.com.
Explain the application and the workflow integration. Change nothing: the site is read-only.
```

**Try** building a process on the public workbench, and see the real results:

```text
Using https://try.omniworkflow.com and its API, create an employee leave approval workflow:
an employee submits the dates and a reason, a manager approves or rejects it, and an employee
cannot approve their own. Check the model, save it, write and run its tests, fix what fails,
and give me the model's link and the test results as the server reported them.
```

**Install** it on your own machine and prove it runs:

```text
Read the OmniWorkflow installation page at
https://bpmnserver.github.io/bpmn-server/setup/ and install the current release locally.
Start it, check that it is running, run one process end to end, and tell me the URL to open.
```

**Integrate** it with an application you already have:

```text
Read my application and OmniWorkflow's integration documentation at
https://bpmnserver.github.io/bpmn-server/integrate/. Recommend how to connect the two and why.
With my approval, build one small working example and show the process running.
```

Any agent that can run commands or call an API can do this: Claude Code, Codex, Cursor, Copilot and others. There is
no separate OmniWorkflow for agents; they use the same CLI, API and models that people do.

Ask an agent to report what the server actually said. A model is checked and tested by the server, so "it verified"
means the check and the tests ran and passed, not that the diagram looks right.

**Where to read more:** [Building workflows with an AI agent](ai/building-workflows.md) is the guide an agent follows,
and the one to read to understand what agents can do here. [Chatting with your server](ai/chat-assistants.md) connects
a chat assistant to a running server over MCP.

## Trying it locally

With Node.js 20 or later:

```sh
npx bpmn-server init my-app --memory
cd my-app
npm start
```

Then open **http://localhost:3000**. The first page asks for the administrator's name and password, with the setup
token the server printed when it started ([The first start](setup.md#the-first-start)). With `--memory` nothing is
kept when the server stops; without it, the application keeps its data in MongoDB or SQLite
([Installation](setup.md)).

## How the parts fit

```mermaid
flowchart LR
    People["People, in the Workbench or the application's own screens"] --> Web["bpmn-web"]
    App["Other applications"] -->|API| Web
    Web --> Engine["bpmn-server, the engine"]
    Engine --> Services["The application's code"]
    Engine --> Connectors["REST APIs"]
    Engine --> Store[("MongoDB, SQLite or memory")]
```

The engine runs the processes; bpmn-web is how people and other applications reach it. The engine can run inside the
web application or as a separate service: see [Architecture](architecture.md).

The engine keeps the processes, the cases, their tasks and the data the process needs. The business records, such as
orders, claims or employees, stay in the application's own database. A case carries their keys, calls the application
to change them and reads them when it needs them ([Data objects](data-objects.md)).

## Running it in production

A production server keeps its data in a database, signs people in (with bpmn-web's own accounts or the application's),
keeps its keys secret, and runs only processes whose tests pass. [Installation](setup.md#production),
[Security](security.md) and [Tutorial 12: Release](tutorial/release.md) cover each of these.

OmniWorkflow is [MIT-licensed on GitHub](https://github.com/bpmnServer/bpmn-server).
