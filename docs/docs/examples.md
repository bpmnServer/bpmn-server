# Feature examples

Start with [Your First Workflow](first-workflow.md) to run a model in the demo or in a local app. The examples
below show what to configure, what to run, and what to check in the result.

| Example | What you can try | Release |
|---|---|---|
| [Call a REST API](examples/github-connector.md) | Map GitHub repository data and catch an HTTP 404 in BPMN. | 3.5.2 |
| [Evaluate and test a DMN decision](examples/Business%20Rules.md) | Run the loan approval table, test its outputs, and read the result in a process. | 3.5.x (decision tests in 3.5.2) |
| [Retry a failed task](examples/retry-task.md) | Inspect a persisted failure, retry the same item, or route a known failure through BPMN. | 3.5.2 |
| [Keep a waiting instance in SQLite](examples/sqlite-resume.md) | Stop the app, restart it, and complete the same task. | 3.5.2 |
| [Revise a model with running instances](examples/revise-running-model.md) | Compare saved versions and preview which running instances can use the new model. | 3.5.2 |

For BPMN modeling patterns, use the **Examples/Features** navigation. The repository also has
[runnable examples](https://github.com/bpmnServer/bpmn-server/tree/v3.5.2/testSampleApp/examples) for
event-based gateways, escalation, parallel multi-instance voting, sub-process loops, and restarting an ended
instance from a save point.
