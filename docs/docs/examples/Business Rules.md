# Evaluate and test a DMN decision

The [Business Rules model](https://github.com/bpmnServer/bpmn-server/blob/v3.5.2/sampleApp/processes/Business%20Rules.bpmn)
and [loan approval table](https://github.com/bpmnServer/bpmn-server/blob/v3.5.2/sampleApp/processes/loanApproval.dmn.xml)
ship together in the standard [starter app](../setup.md). Keep the two files in the same definitions folder.
Use 3.5.2 for the decision editor's **Test** tab.

## Test the decision on its own

Open **Business Rules** in the model editor, then open the decision from its **Business Rule** task.
In the decision editor's **Test** tab, create a test with `credit_score` and `income` as numeric inputs.
Add equality checks for `approvalStatus` and `maxAmount`, then run it. Try these cases as separate tests.

| credit_score | income | approvalStatus | maxAmount |
|---:|---:|---|---:|
| 780 | 90000 | Approved | 5000 |
| 650 | 45000 | Conditional Approval | 4500 |

In the second case, both the conditional approval and rejection rules match. The table's PRIORITY policy
chooses **Conditional Approval** because it ranks ahead of **Rejected** in the output values list.
A score of 500 and income of 45000 match no rules, so the single-hit result is `null`. To check that case,
assert that zero rules matched.

## Run the process

Start **Business Rules** with no input. **Prepare Values** defaults `data.creditScore` to 650 and
`data.income` to 45000. The business rule task maps them to the DMN inputs `credit_score` and `income`.
In the completed instance's data, look for:

```json
{
  "loan": {
    "approvalStatus": "Conditional Approval",
    "maxAmount": 4500
  }
}
```

The task's `camunda:decisionRef="loanApproval"` selects the decision and
`camunda:resultVariable="loan"` saves its result. See [Decisions](../decisions.md) for hit policies,
result mappings, and testing options.
