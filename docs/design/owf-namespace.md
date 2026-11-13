# OmniWorkflow's attributes: the `owf:` namespace

**Status:** built on `3.7.1`.

A model attribute uses the `camunda:` prefix only when Camunda's own schema defines it: `camunda:assignee`,
`camunda:candidateGroups`, `camunda:inputOutput`, `camunda:initiator`. An attribute bpmn-server adds is in OmniWorkflow's
namespace:

```xml
<bpmn:definitions xmlns:owf="http://omniworkflow.com/schema/owf/1.0" ...>
  <bpmn:process id="Leave" owf:securityPolicy="LeaveCases" owf:label="Leave of ${Who = data.requester}">
    <bpmn:userTask id="Approve" owf:assignmentPolicy="Approval" owf:endLabel="Approved by ${completedBy}" />
    <bpmn:serviceTask id="Notify" implementation="notify" owf:exceptionsAsErrors="true" />
```

| Attribute | On | What it does |
|---|---|---|
| `owf:label`, `owf:endLabel` | the process, its elements | [labels](../docs/labels.md) |
| `owf:assignmentPolicy` | a user task | [assignment policies](../docs/assignment-policies.md) |
| `owf:securityPolicy` | the process, a user task, a start event | [security policies](security-policies.md) |
| `owf:exceptionsAsErrors` | a service, send or script task | [an exception raised as a BPMN error](../docs/execution.md) |

Camunda's tools ignore them, and so they don't misread them.

## Models saved before

`label`, `endLabel`, `assignmentPolicy` and `exceptionsAsErrors` were written as `camunda:` before. They still work:

- **The engine** reads `owf:<name>`, else `camunda:<name>` (`elements/owfAttributes.ts`).
- **The model editor** moves them to `owf:` when it opens a model and says so; saving the model keeps the change.
- **`verifyModel`** warns, `owf-attribute-legacy`: *camunda:label is OWF's, not Camunda's: it is read, and the model
  editor saves it as owf:label*.

The old names will be read for at least one release after this one.

## The editor

`modeler/src/moddle.js`: the `owf` moddle descriptor (prefix `owf`, the URI above) beside Camunda's, used by the
editor and the page viewers. The prefix is `owf`: the engine reads the attributes by it.
