# Decisions (DMN)

!!! warning "Draft"
    For the release after bpmn-server 3.2. Not published until then.

A business rule task evaluates a DMN decision: a decision table (or a literal expression) kept in its own file,
next to the models. The process passes it data, and saves its result in the instance data.

## A business rule task

```xml
<bpmn:businessRuleTask id="check" name="Check the loan"
    camunda:decisionRef="loanApproval" camunda:resultVariable="loan">
  <bpmn:extensionElements>
    <camunda:inputOutput>
      <camunda:inputParameter name="credit_score">$data.creditScore</camunda:inputParameter>
      <camunda:inputParameter name="income">$data.income</camunda:inputParameter>
    </camunda:inputOutput>
  </bpmn:extensionElements>
</bpmn:businessRuleTask>
```

| Attribute | |
|---|---|
| `camunda:decisionRef` | a decision file `<name>.dmn.xml` in the models folder (`definitionsPath`), or a decision's id in one of them |
| `camunda:resultVariable` | where the result goes in the instance data (`data.loan`); without it, the result is only the item's output |
| `camunda:mapDecisionResult` | how the result is shaped (below); without it, as the hit policy returns it |

The decision's inputs are the instance data, overridden by the task's input parameters. An input parameter is an
expression when it starts with `$` (`$data.income`); without it, it is text.

## Decision tables

Each input column has an **input expression**: the name of the value it reads (`income`, or a FEEL expression
such as `applicant.age`). Its **type** (`integer`, `number`, `string`, `boolean`, `date`) converts the value
first: `"800"` from a form is 800 in an integer column.

Cells are [FEEL](https://docs.camunda.io/docs/components/modeler/feel/what-is-feel/) unary tests:

| Cell | Matches |
|---|---|
| `-` | anything |
| `>= 750` | a comparison |
| `[600..700]`, `(600..700]` | a range, `[` `]` inclusive, `(` `)` exclusive |
| `"gold","platinum"` | one of a list |
| `not("rejected")` | anything but |
| `null` | no value |

Output cells are FEEL expressions: `"Approved"`, `0.1 * income`, `income * 3`. They can use the inputs.

### Hit policies

| Policy | Result |
|---|---|
| UNIQUE (default) | the one rule that matches; more than one is an error |
| FIRST | the first rule that matches, in table order |
| PRIORITY | the matching rule whose output comes first in the output's **output values** list |
| ANY | any matching rule; they must agree |
| OUTPUT ORDER | every matching rule, ordered by output values |
| RULE ORDER | every matching rule, in table order |
| COLLECT | every matching rule; with SUM, MIN, MAX or COUNT, that one number |

A single-hit table returns an object of the outputs (`{ approvalStatus: "Approved", maxAmount: 50000 }`), or `null`
when no rule matches. A multi-hit table returns a list, empty when none matches.

### Shaping the result

`camunda:mapDecisionResult`:

| Value | Result |
|---|---|
| `singleEntry` | the first output of the one matching rule: `"Approved"` |
| `singleResult` | the one matching rule's outputs: `{ approvalStatus: "Approved", maxAmount: 50000 }` |
| `collectEntries` | the first output of each matching rule: `["Approved", "Conditional Approval"]` |
| `resultList` | each matching rule's outputs, as a list |

`singleEntry` and `singleResult` are an error when more than one rule matches.

## Several decisions in a file

A file may hold several decisions. A decision that requires others (a decision requirements diagram) is evaluated
after them, each result available to it by the required decision's id and by its name, and a single result's outputs by
their own names. A `camunda:decisionRef` naming the file
evaluates its top decision, the one no other decision requires; naming a decision id evaluates that one.

Literal expression decisions (one FEEL expression instead of a table) are evaluated too.

## Evaluating decisions from code

```ts
import { DMNEngine } from 'bpmn-server';

const found = await DMNEngine.find(definitionsPath, 'loanApproval');      // a file name or a decision id
const engine = await new DMNEngine().load(found.filePath, found.decision.id);
const result = engine.evaluate({ credit_score: 780, income: 90000 });
```

`DMNParser.check(await DMNParser.loadFile(file))` lists a file's problems without evaluating it.

## When something is wrong

- A decision that can not be found, a cell that is not FEEL, or an evaluation error stops the task with a message
  naming the decision and the rule.
- The instance log says which rules matched.
- [`verifyModel`](../verify.md) checks business rule tasks against the decision files: `decision-not-named`,
  `decision-not-found`, `decision-invalid` (an unknown hit policy, wrong cell counts, FEEL that does not parse),
  `decision-result-not-saved`, and `decision-input-from-data` (info: an input the task does not pass, read from
  the instance data). `parameter-is-text` warns of an input parameter written like an expression but without
  its `$`.

## Changed from 3.2

The earlier evaluator read columns by their label and mis-read most FEEL. Tables that relied on it may need their
input expressions set and their cells written as FEEL. When no rule matches, a single-hit table now returns
`null` (it returned `{}`).
