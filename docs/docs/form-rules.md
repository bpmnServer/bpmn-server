# Form rules

The engine checks a task's form rules when the task is completed. A form that breaks one is refused, and nothing is
saved. (A start event's fields are not checked.)

```xml
<camunda:formField id="days" label="Days" type="long">
  <camunda:validation>
    <camunda:constraint name="required" />
    <camunda:constraint name="max" config="30" />
  </camunda:validation>
</camunda:formField>
```

| Rule | |
|---|---|
| `type` | `long`: a whole number; `boolean`: true or false (or yes or no); `date`: a date; `enum`: one of its values |
| `required` | a value, sent or already in the case |
| `readonly` | can't be changed (the case's value may be sent back) |
| `minlength`, `maxlength` | the text's length (`config` is the limit) |
| `min`, `max` | the number (`config` is the limit) |
| `<owf:list>` | the value is one of the list's choices ([Lists and lookups](form-lookups.md)) |
| validate event | a `validate` task listener's script that returns `{ error: '...', field: '...' }` |

Not checked: a lookup's value, and Camunda's custom `validator` (use the validate event).

A refused form, from API v3:

```
POST /api/v3/tasks/{id}/complete   { "data": { "days": 40 } }
→ 400 { "error": { "code": "FORM_INVALID", "message": "...",
        "details": [ { "field": "days", "rule": "max", "message": "Days: at most 30" } ] } }
```

The drawn task form applies the same rules in the browser (`required`, lengths, limits), and shows the reason when
the server refuses one.

To turn the rules off, set `FORM_RULES=false` in `.env` (or `formRules: false` in the configuration). The validate
event still runs.
