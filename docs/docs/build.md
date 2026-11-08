# Build a workflow application

Journey B: your own application on BPMN Server, with your models, users and services. The [tutorials](tutorial/start.md) take you through it with one example.

## 1. Install

Install Node.js 20 or later. To avoid database setup for a first run:

```sh
npx bpmn-server init my-app --memory
cd my-app
npm start
```

Open **http://localhost:3000**. The first page asks for the administrator: give the setup token the server printed when it started, and choose a name and password. See [The first start](setup.md#the-first-start). The in-memory database is **temporary** and is cleared when the application stops.

For data that is kept, create the application without `--memory`: it uses MongoDB, or SQLite as [Custom persistence](persistence.md) shows. See [Installation](setup.md).

The generated project contains:

| Location | Role |
| --- | --- |
| `processes/` | BPMN process models and DMN decisions, with their tests |
| `connectors/appServices.ts` | TypeScript services called by service tasks |
| `delegates/appDelegate.ts` | Application lifecycle hooks and service provider |
| `settings/config.ts` | How the application behaves |
| `.env` | What differs per machine, and secrets |
| `index.ts` | Starts the host web application |

## 2. Configure

What goes in `.env` and what in `settings/config.ts`, and every setting: [Settings](settings.md). Add users and their groups from **Administration**: [Security](security.md).

## 3. Design and test

Model in the [model editor](modeler.md): its **Problems** tab checks the model as you edit, its **Test** tab records and runs scenarios. Run a process from **My work**, complete its tasks, and look at the instance and its history.

Tests are Gherkin files beside the models, run in the engine: [Testing and debugging models](testing.md), and [Tutorial 7](tutorial/tutorial-testing.md).

**Try this first:** a "Request approval" process: **Start → Submit request (user task) → Approve request (user task) → End**. Once that works, add a gateway for **Approved?** and a rejection path. It exercises most of what a real process needs.

## 4. Integrate services

Once your workflow behaves correctly, replace demonstration operations with real application behavior:

1. Connect service tasks to your TypeScript services, or to REST APIs with [connectors](connectors.md): [Connect external services](tutorial/tutorial-connectors.md).
2. Use [DMN decisions](decisions.md) for business-rule tables, or application code for complex logic.
3. Keep authoritative business records in your application database; store workflow state separately. See [Application integration](customization.md).

## 5. Deploy

Choose how it runs, with the engine in the web application's process or its own: [Ways to run it](setup.md#ways-to-run-it). Before real users reach it: sign-in and task authorization ([Security](security.md)), persistent storage, the settings production refuses to start without, and how a crashed step is recovered ([Advanced](advanced.md#hung-tasks)). Re-run model checks and tests after each change. Docker and a one-line server install: [Docker](docker.md), [Installation](setup.md#on-a-server-in-one-line).
