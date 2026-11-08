# Site map

Every page of these docs, as the menu has them. Generated from `mkdocs.yml` by `npm run map`.

## Getting Started

- [Overview](index.md): Build and run long-lived business processes inside your application.
- [Choose Your Journey](journeys.md): BPMN Server can be tried in a browser, run as your own workflow application, connected to an application you already have, or built into your own code.
- [Online Demo](first-workflow.md): Journey A: the quickest way to understand BPMN Server is to build, test, and run a small process.
- [Build an Application](build.md): Journey B: your own application on BPMN Server, with your models, users and services.
- [Integrate an Existing Application](integrate.md): Journey C: your application keeps its own UI, users and data, and BPMN Server runs its processes.
- [Installation](setup.md): init creates the sample application: processes/ (Hello, Buy Used Car, Leave Application, employee-onboarding, Business Rules, GitHub repository), connectors/ (the services the…
- [Settings: .env and configuration](settings.md): An application has two places for settings.
- [What's new in 3.6](whats-new-3.6.md): bpmn-server 3.6 separates the host from the engine, removes guest access and moves every test to Gherkin.
- [What's new in 3.5](whats-new-3.5.md): bpmn-server 3.5 adds REST API connectors, SQLite storage, decisions (DMN) as the standard describes them, a new model editor with tests for models and decisions, and npx…
- [Upgrade to 3.x](whats-new-3.md): bpmn-server 3 is a modernized engine: an ES module on current Node.js and MongoDB drivers, embeddable in a larger application, with a runtime API kept apart from model…

## Tutorials

- [1. A Workflow Ready for Production](tutorial/start.md): These tutorials design one workflow, a leave request, so that it is ready for real users: every path thought through, nothing left waiting forever, failures handled, every path…
- [2. Roles and Assignment](tutorial/roles.md): Nobody else sees those tasks, or can complete them.
- [3. Forms and Data](tutorial/forms.md): to them, before any manager sees the request.
- [4. Decisions and Paths](tutorial/paths.md): not, and a request that needs more information goes back to the employee.
- [5. Deadlines](tutorial/deadlines.md): once, after that long; a Date at that time.
- [6. Calling Services, and Failing Well](tutorial/services.md): tried again.
- [7. Testing Every Path](tutorial/tutorial-testing.md): information required, HR's system refusing the record, and the reminders.
- [8. Review Before Release](tutorial/review.md): once as its users would run it.
- [9. Release](tutorial/release.md): before it does.

## Walkthroughs

- [Execute from Node.js](tutorial/tutorial-script.md): The same leave request, from a script: start it as user1, fill in the request, and approve it as manager1.
- [Integrate an Existing Application](tutorial/tutorial-integrate.md): Your company already has an HR application, with its own users and pages.
- [Connect External Services](tutorial/tutorial-connectors.md): A process often needs another system: check a balance, create a ticket, wait for a payment.

## Core Concepts

- [Invoking Workflows](invokation.md): Since workflow require a User Interface, a web-app is required as front-end to interact with user providing at least: - Selection of Workflows to Start - Show outstanding Tasks…
- [Workflow Execution](execution.md): Execution is based on the model logic that is enhanced by various extensions that allow scripting and access to your application.
- [Data and Persistence](data.md): bpmn-server relies on a Database to store workflow information.
- [Scripting](scripting.md): BPMN-Server provides scripting throughout the workflow.
- [Security](security.md): In general Application Security deals with the following topics:

## Modeling and Integration

- [Model editor](modeler.md): bpmn-web's model editor is bpmn-js with a properties panel that offers what bpmn-server runs, checks the model as it is edited, and runs it, step by step, before it is saved…
- [Checking models](verify.md): verifyModel checks a BPMN model the way bpmn-server loads and runs it, without running it.
- [Testing and debugging models](testing.md): A model is ready when it passes three kinds of checks:
- [Connectors (REST APIs)](connectors.md): A service task can call a connector instead of a service.
- [Decisions (DMN)](decisions.md): A business rule task evaluates a DMN decision: a decision table (or a literal expression) kept in its own file, next to the models.
- [Data objects](data-objects.md): A data object in the diagram stands for data the process works on: a client, an order, a policy.

## Reference

- [Features](features.md): What bpmn-server, bpmn-web and bpmn-client do, area by area, each with where it is documented, its code and its tests.
- [Advanced Topics](advanced.md): A command after --, with the answers to its questions, runs just that and quits: for scripts, and for a server (on one made by the installer, bpmn cli ...
- [Frequently Asked Questions](faq/index.md)

## Examples/Features

- [Service Task](examples/serviceTask.md): A service task calls a service, a method of the application's services, or a connector, a REST API the administrator added (see Connectors).
- [Script Task](examples/scriptTask.md)
- [Conditional Flow](examples/conditionalFlow.md)
- [Scripts Listeners](examples/scriptEvents.md): Scripts can be added to listen to two events: - Start before the Task is executed - End after the task is executed
- [Gateways](examples/gateways.md): gateways - camunda7 manual
- [Event Based Gateway](examples/ebg.md): Event Based Gateway launches all valid outbound flows, but once on event is completed, it must cancel the rest.
- [Multiple Start Events](examples/multiStartEvent.md): When a definition/process has multiple start node, you need to specify the start node when starting the process:
- [Input Fields](examples/inputFields.md)
- [Boundary Events](examples/boundary-events.md): boundary events have started in a wait state
- [Throwing/Catching Messages](examples/msg-throw-catch.md): In this example, we will demonstrate how can two seperate processes communicate through "Messages"
- [Throwing/Catching Signals](examples/signal-throw-catch.md): Messages are directed toward a specific recipient node, Signals however are broadcast to all potential listeners.
- [Error/Escalate Events](examples/error_events.md): Also Scripts and Services Tasks can Raise BPMN Errors/Escalation/Exception
- [Call Process](examples/callProcess.md): In the above example 'loop' is the name of process to be called.
- [Multi-instances (loop)](examples/loop.md): Any Task can have multi-instance either Sequential or Parrallel
- [UserTask Assignment](security.md): In general Application Security deals with the following topics:
- [Timers](timers.md): All Timers are persisted, therefore, if the Node.js session is restared timers will pickup where they left ## Timer Types
- [SubProcess](examples/subProcess.md)
- [Transactions](examples/transactions.md): In this example:
- [Ad Hoc SubProcess](examples/adHoc.md): Ad-Hoc subprocess allow you to choose the activity you like to invoke: - On start of subprocess; all activities start in a wait state - User can Invoke 'Execute' any task -…

## API

- [API Example](examples/BuyCar-Server.md): For the model above we will walk-through how to execute it programaticaly.
- [API](api/readme.md): bpmn-server

## Advanced Development

- [Embedding the Engine](embedding.md): Journey D: run processes from your own Node.js code, with no web application.
- [Engine API](api-summary.md): The TypeDoc listing is generated from the current source (npm run _docs:generate:api in docs/): every class and interface, with its signatures.
- [Application Integration](customization.md): BPMN Server is an embeddable execution engine, not a stand-alone process server.
- [Custom Persistence](persistence.md): Where instances, models and everything else are kept, and how to change it.
- [Custom Delegates](delegates.md): The app delegate is your application's code that the engine calls: the services service tasks call, and hooks on what the engine does.
- [Runtime Architecture](architecture.md): BPMN Server has three layers: a host that people and other systems talk to, an engine that runs processes, and a core of model and data handling that both of them use.

## bpmn-web

- [install](bpmn-web.md)
- [Executing Example](examples/BuyCar-Web.md): From the WebApp home page: - Select the Process - Click [Execute] link

## bpmn-client

- [install](bpmn-client.md)
- [Executing Example](examples/BuyCar-Remote.md): For the model above we will walk-through how to execute it programaticaly.
- [Client API](client-api.md): BPMNClient is a lightweight Node package to remotely access bpmn-server using bpmn-server WebApi
