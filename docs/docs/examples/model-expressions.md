# Use `${...}` expressions in a model

Build **Start → Needs approval? (exclusive gateway)**. Send the conditional flow to **Approve** (user task)
and the default flow to **End**. Connect **Approve** to **End** as well.

| Model field | Value | Result for the example input |
|---|---|---|
| Condition on the flow to **Approve** | `${data.amount > 1000}` | Boolean `true` |
| **Approve** assignee | `${data.owner}` | `ada` |
| **Approve** input parameter `amount` | `${data.amount}` | Number `2500` |
| **Approve** input parameter `title` | `Order ${data.id} for ${data.owner}` | String `Order 7 for ada` |

Start with `{"id":7,"amount":2500,"owner":"ada"}`, using an existing username for `owner` if task security is
enabled. The process waits at **Approve**, assigned to that user. Start again with `amount` set to 10. The
gateway takes the default flow and the process ends without creating **Approve**.

When `${...}` is the entire value, it keeps the JavaScript result's type. Inside surrounding text, it
substitutes a string. For example, a duration field of `PT${data.reminderHours}H` produces `PT2H` for
`reminderHours: 2`.

Try changing the condition to `${amount > 1000}` and check **Problems** for `expression-unknown-name`.
Use `data.amount` to read workflow data, and use JavaScript operators such as `>` and `&&`.

See [Model expressions](../scripting.md#model-expressions) and the
[executable expression example](https://github.com/bpmnServer/bpmn-server/blob/v3.5.2/packages/bpmn-server/test/expressions.test.mjs),
which checks the two parameter values on the running task.
