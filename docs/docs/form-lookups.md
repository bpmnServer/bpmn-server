# Lists and lookups in forms

A form field can offer **choices from your application**: a drop-down of departments, or a search for an employee.
Its value is the choice's key, and the name shown is kept beside it.

## A drop-down: `owf:list`

```xml
<camunda:formField id="Department" label="Department" type="string">
  <owf:list source="service:departments" key="departmentId" display="name" />
</camunda:formField>
```

When the form opens, the server calls the application's `departments` service and shows each row's `name`. The
person's choice saves its `departmentId` as `data.Department`, and its name as `data.DepartmentDisplay`.

## A search: `owf:lookup`

```xml
<camunda:formField id="CoveredBy" label="Covered by" type="string">
  <owf:lookup source="service:employees" key="userName" display="name" filter="${data.Department}" />
</camunda:formField>
```

As the person types, the server calls `employees` with what they typed and the department chosen, and offers the
names found. Text that isn't one of them leaves the field empty, and the form will not submit.

## The source

| `source` | What is called |
|---|---|
| `service:<name>` | a function of your application's services: `name({ text, filter }, context)`, answering the rows |
| `connector:<connector>/<operationId>` | a [connector](connectors.md)'s operation; `text="q"` names the input that takes the text typed, `filterInput="dept"` the one that takes the filter |

The service, for the search above:

```ts
async employees({ text = '', filter }, context) {
    return employees
        .filter(e => (!filter || e.departmentId === filter) && e.name.toLowerCase().includes(text.toLowerCase()))
        .map(e => ({ userName: e.userName, name: e.name }));
}
```

`context` says who is asking (`context.user.userName`) and from which form (`processName`, `elementId`, and for a task
`instanceId`, `taskId`).

## The other attributes

| Attribute | |
|---|---|
| `key` | the row's field saved as the value; default `id` |
| `display` | the row's field shown; default the key |
| `filter` | `${data.<field>}`: a value from the form, or else the case, given to the source |
| `items` | where the rows are in a connector's answer, such as `results`; default the answer, or its first list |

## From your own forms and apps

API v3 answers a field's choices, as the user:

```
POST /api/v3/tasks/{id}/choices/{field}          { "text": "mar", "data": { "Department": "DEP-001" } }
POST /api/v3/processes/{name}/choices/{field}    { "text": "mar", "startNodeId": "StartEvent_1" }
→ { "items": [ { "key": "maria.garcia", "display": "Maria Garcia" } ] }
```

A task's form (`GET /api/v3/tasks/{id}`) says which fields have one: `"lookup": { "source", "key", "display", "filter" }`.

In the model editor, a form field's **Choices** (in its Form fields entry) sets these: List or Lookup, then the
source and the other attributes.

`verifyModel` checks the source: that the service or the connector's operation exists, and that the inputs named are
its own. The HR demo's Leave Application has both, on its Request form.
