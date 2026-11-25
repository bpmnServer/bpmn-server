# Calling OmniWorkflow from your application

These tutorials start where [Tutorial 1](start.md) to [Tutorial 8](review.md) end: you have the leave request, modeled,
with its services and its tests. Now your own application uses it, with its own users, its own screens and its own
services, and you release it.

Read [Integration, step by step](../integration/integration-guide.md) first. It is the roadmap: it says which of the two
ways to choose (your application **embeds** the engine, or **calls** a running server over HTTP) and what each step needs. The
tutorials below build the same thing with the leave request.

| Tutorial | You will |
|---|---|
| [9. Execute from Node.js](tutorial-script.md) | Start and complete work from application code |
| [10. Integrate an existing application](tutorial-integrate.md) | Use API v3 with your users and your interface |
| [11. Connect external services](tutorial-connectors.md) | Call your REST APIs from service tasks, with no code |
| [12. Release](release.md) | Deploy safely and keep the checks running |

You do not need all of them: a Node.js program needs 9, an existing application in any language needs 10, and a service
that already has a REST API needs 11. Everyone ends with 12.

Related: [Integrate an existing application](../integrate.md), [Embedding the engine](../embedding.md),
[The application's contract](../app-contract.md), [Calling it from your application (C#, Python, curl)](../integration-examples.md).
