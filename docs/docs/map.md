# Site map

Every page of these docs, as the menu has them. Generated from `mkdocs.yml` by `npm run map`.

## Get Started

- [Overview](index.md): OmniWorkflow runs business processes.
- [Try it online](first-workflow.md): Two sites run OmniWorkflow with nothing to install.
- [Build an application](build.md): Journey B: your own application on OmniWorkflow, with your models, users and services.
- [Integrate an existing application](integrate.md): Journey C: your application keeps its own UI, users and data, and OmniWorkflow runs its processes, on a private network behind it: Your application in control.
- [Embed the engine](embedding.md): Journey D: run processes from your own Node.js code, with no web application.
- **With an AI agent**
  - [Building workflows with an AI agent](ai/building-workflows.md): On a server, start with its /llms.txt (for example https://try.omniworkflow.com/llms.txt): what that site has (its API, services, connectors, user groups), its own rules, then…
  - [Chatting with your server](ai/chat-assistants.md): Your users can build and test workflows by chatting with an AI assistant (ChatGPT, Claude, ...) that works on your OmniWorkflow for them: it reads the site's guide, writes the…
- **What's new**
  - [What's new in 3.6](whats-new-3.6.md): bpmn-server 3.6 separates the host from the engine, removes guest access and moves every test to Gherkin.
  - [What's new in 3.5](whats-new-3.5.md): bpmn-server 3.5 adds REST API connectors, SQLite storage, decisions (DMN) as the standard describes them, a new model editor with tests for models and decisions, and npx…
  - [Upgrade to 3.x](whats-new-3.md): bpmn-server 3 is a modernized engine: an ES module on current Node.js and MongoDB drivers, embeddable in a larger application, with a runtime API kept apart from model…

## Tutorials

- **Part 1: Modeling — straight BPMN**
  - [1. Build a Workflow Brief](tutorial/start.md): These tutorials are for developers building a production workflow.
  - [2. Roles and Assignment](tutorial/roles.md): decide, HR can repair rejected records, and unrelated users cannot see or complete those tasks.
  - [3. Forms and Data](tutorial/forms.md): The example form captures leave type, dates, and reason; invalid dates are refused, and the request waits for the requester.
  - [4. Decisions and Paths](tutorial/paths.md): not, and a request that needs more information goes back to the employee.
  - [5. Deadlines](tutorial/deadlines.md): once, after that long; a Date at that time.
- **Part 2: Adding Logic — JavaScript and FEEL**
  - [6. Calling Services, and Failing Well](tutorial/services.md): tried again.
  - [7. Testing Every Path](tutorial/tutorial-testing.md): system refusing the record, and reminders.
  - [8. Review Before Release](tutorial/review.md): an end-to-end acceptance check using representative user identities.
- **Part 3: Integration — Application and Deployment**
  - [9. Execute from Node.js](tutorial/tutorial-script.md): The same leave request, from a script: start it as user1, fill in the request, and approve it as manager1.
  - [10. Integrate an Existing Application](tutorial/tutorial-integrate.md): Your company already has an HR application, with its own users and pages.
  - [11. Connect External Services](tutorial/tutorial-connectors.md): A process often needs another system: check a balance, create a ticket, wait for a payment.
  - [12. Release](tutorial/release.md): the same checks running for every later change.

## Concepts

- [Architecture](architecture.md): OmniWorkflow has three layers: a host that people and other systems talk to, an engine that runs processes, and a core of model and data handling that both of them use.
- [How a workflow runs](execution.md): Execution is based on the model logic that is enhanced by various extensions that allow scripting and access to your application.
- [Workflow data](data.md): bpmn-server relies on a Database to store workflow information.
- [Finding instances](data_find.md): server.dataStore.find reads a page of instances from the store: a filter chooses them, a sort orders them, and a cursor walks through them a page at a time.
- [Data objects](data-objects.md): A data object in the diagram stands for data the process works on: a client, an order, a policy.
- [Who may do what](security.md): In general Application Security deals with the following topics:
- [Environments and read-only servers](environments.md): APP_ENV in .env says which environment a server is: development, test or production.

## Modeling

- [The model editor](modeler.md): bpmn-web's model editor is bpmn-js with a properties panel that offers what bpmn-server runs, checks the model as it is edited, and runs it, step by step, before it is saved…
- [Checking models](verify.md): verifyModel checks a BPMN model the way bpmn-server loads and runs it, without running it.
- [Testing and debugging](testing.md): A model is ready when it passes three kinds of checks:
- [Scripts and expressions](scripting.md): BPMN-Server provides scripting throughout the workflow.
- [Decisions (DMN)](decisions.md): A business rule task evaluates a DMN decision: a decision table (or a literal expression) kept in its own file, next to the models.
- [Labels](labels.md): A case is known by what identifies it: Car: Porsche 911 · Buyer: staff, not only by its case id.
- [Form rules](form-rules.md): The engine checks a task's form rules when the task is completed.
- [Lists and lookups in forms](form-lookups.md): A form field can offer choices from your application: a drop-down of departments, or a search for an employee.
- [A process explained](process-guide.md): Every process has a guide for the people who work in it: How this process goes, at /guide/<process>.
- [Timers](timers.md): All Timers are persisted, therefore, if the Node.js session is restared timers will pickup where they left ## Timer Types
- **BPMN by example**
  - [Overview](examples.md): Each page here takes one BPMN element or pattern: what it does in OmniWorkflow, the model's XML for it, and what the engine does when it runs.
  - [Service task](examples/serviceTask.md): A service task is a step the process does by itself, with no person involved.
  - [Script task](examples/scriptTask.md): A script task runs a small piece of JavaScript on the case's data, with no person and no outside call.
  - [Business rule task](examples/Business Rules.md): P.S.
  - [Conditional flow](examples/conditionalFlow.md): A sequence flow can carry a condition, so the path is taken only when the condition is true.
  - [Script listeners](examples/scriptEvents.md): Any element can carry listeners: small scripts the engine runs just before the element starts and just after it ends.
  - [Gateways](examples/gateways.md): A gateway splits a process into branches, or brings branches back together.
  - [Event-based gateway](examples/ebg.md): Event Based Gateway launches all valid outbound flows, but once on event is completed, it must cancel the rest.
  - [Multiple start events](examples/multiStartEvent.md): A process can have more than one start event, so the same model can be entered in different ways: a person starting it, a message arriving, a timer firing.
  - [Input fields](examples/inputFields.md): A user task can carry a form: the fields the person fills in to complete it.
  - [Boundary events](examples/boundary-events.md): boundary events have started in a wait state
  - [Messages](examples/msg-throw-catch.md): Two separate processes can talk to each other with messages.
  - [Signals](examples/signal-throw-catch.md): Messages are directed toward a specific recipient node, Signals however are broadcast to all potential listeners.
  - [Errors and escalations](examples/error_events.md): Also Scripts and Services Tasks can Raise BPMN Errors/Escalation/Exception
  - [Call activity](examples/callProcess.md): A call activity runs another process as a step.
  - [Multi-instance (loops)](examples/loop.md): Any Task can have multi-instance either Sequential or Parrallel
  - [Subprocess](examples/subProcess.md): A subprocess groups steps inside a process.
  - [Transactions](examples/transactions.md): In this example:
  - [Ad-hoc subprocess](examples/adHoc.md): Ad-Hoc subprocess allow you to choose the activity you like to invoke: - On start of subprocess; all activities start in a wait state - User can Invoke 'Execute' any task -…

## Integration

- [Integrating your application](customization.md): OmniWorkflow is an embeddable execution engine, not a stand-alone process server.
- [Connectors (REST APIs)](connectors.md): A service task can call a connector instead of a service.
- [The application's contract](app-contract.md): An application tells OmniWorkflow what its workflows may use of it in one file, app-contract.json, in its folder (the folder it runs in; the configuration's appContract names…
- [Custom delegates](delegates.md): The app delegate is your application's code that the engine calls: the services service tasks call, and hooks on what the engine does.
- [Custom persistence](persistence.md): Where instances, models and everything else are kept, and how to change it.
- [Invoking workflows](invokation.md): Since workflow require a User Interface, a web-app is required as front-end to interact with user providing at least: - Selection of Workflows to Start - Show outstanding Tasks…
- [The engine's API](api-summary.md): The TypeDoc listing is generated from the current source (npm run _docs:generate:api in docs/): every class and interface, with its signatures.
- **bpmn-client**
  - [Installing it](bpmn-client.md)
  - [The client API](client-api.md): bpmn-client is a lightweight Node package to remotely access bpmn-server.
- [Example: Buy Used Car, three ways](examples/buy-used-car.md): One small process, run three ways: in the web application, from code in the engine's own process, and from another application over the API.

## Add-ons

- [Assignment](add-ons/assignment.md): The Assignment add-on decides who works on each task, and who may start a process.
- [Assignment policies](assignment-policies.md): A user task can say who works on it by naming an assignment policy: a decision table, kept with the models, whose first matching rule assigns the task when it starts.
- [Notifications](add-ons/notification.md): The Notifications add-on tells people what happens to their work.
- [Notification policies](notification-policies.md): A process can say who is told what, and when, by naming a notification policy: a decision table, kept with the models, whose every matching rule sends a notification.
- [Access Control](add-ons/security.md): The Access Control add-on decides who may see a case and what they may do in it.
- [Labels](add-ons/labels.md): The Labels add-on names each case and task from its data: a case Client: acme · Order: 1234, a task Approve 90.
- [Model Options](add-ons/modeling.md): The Model History add-on gives the model editor its Test and History tabs.
- [Extended Forms](add-ons/forms.md): The Extended Forms add-on gives a form field its choices from a source, as the form is filled.
- [AI Agents](add-ons/ai.md): The AI Agents add-on lets a person give their AI agent a link to this site: the agent then works as them.

## Operate

- [Installation](setup.md): init creates the sample application: processes/ (Hello, Buy Used Car, Leave Application, employee-onboarding, Business Rules, GitHub repository), connectors/ (the editor's…
- [Configuring the engine](configuration.md): An application that creates the engine itself gives it a Configuration: where the models are, where the cases are stored, how timers behave, and which components to use.
- [Docker](docker.md): Install the OmniWorkflow distribution with Docker.
- [The web application](bpmn-web.md): bpmn-web is the web host for bpmn-server: it provides the Workbench, task lists, model and decision editors, administration pages, and REST APIs.
- [The Settings page](integration-settings.md): where administrators and designers set up the server, and turn the add-ons on and off.
- [Lists, columns and filters](list-columns.md): Each person chooses what the lists show.
- [Performance and test coverage](performance.md): This page gives the speed, load and memory figures from OmniWorkflow's own test suites, the effect of the database indexes, and how much of the code the tests run.
- [Advanced topics](advanced.md): A command after --, with the answers to its questions, runs just that and quits: for scripts, and for a server (on one made by the installer, owf cli ...
- [Frequently asked questions](faq/index.md)

## Reference

- [Features](features.md): What bpmn-server, bpmn-web and bpmn-client do, area by area, each with where it is documented, its code and its tests.
- [Settings (.env)](settings.md): An application has two places for settings.
- [API v3](api-v3.md): Every call acts as one user: a user's token (Authorization: Bearer), or the service key (x-api-key) for the service account.
- [Engine and client classes](api/readme.md): bpmn-server
- [Contributing](Development.md): bpmn-server, bpmn-client, bpmn-web, the docs and the sample application are one repository, bpmnServer/bpmn-server; npm workspaces link the packages to each other, so a change…
