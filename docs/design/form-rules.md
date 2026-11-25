# Form rules

A user task's form rules are the model's (camunda:formField, as Camunda 7 writes them). They are checked when the task
is completed, in its validate step (`Node.validate`, with the `validate` event's scripts; `elements/FormRules.ts`),
before anything is saved: a form refused changes nothing. A start event's fields are not checked.

## 1. The rules

| Rule | In the model | Checked |
|---|---|---|
| Type | `type="long"`, `boolean`, `date`, `enum` | a whole number; `true`/`false` (or yes/no, any case); a date; one of the enum's `camunda:value` ids. `string` and other types: anything |
| Required | `<camunda:constraint name="required" />` | a value, sent or the case's |
| Read-only | `name="readonly"` | a value sent is the case's (sending it back is fine) |
| Length | `minlength`, `maxlength`, `config="<n>"` | the text's length |
| Range | `min`, `max`, `config="<n>"` | the number |
| A list's choices | `<owf:list>` | a value sent, not the case's already, is one of its source's choices; a source that fails refuses it |
| The validate event | `<camunda:taskListener event="validate">` | a script that returns `{ error, field? }` |
| Custom | `name="validator"` | not run: Camunda runs Java there; the validate event is bpmn-server's way |
| A lookup's choices | `<owf:lookup>` | not checked: its sources search by text, with no way to find one key |

A field's value is the one sent, else the case's. A value absent is checked only for `required`. Values from a drawn
form are text: `"12"` is a long, `"true"` a boolean.

## 2. Refused

`FormInvalidError`: code `FORM_INVALID`, status 400, `details: [{ field, rule, message }]`, one for each problem (a
validate script's: rule `validate`). Before 3.7.2 a validate script's error was thrown as a plain execution error.

- API v3 and the task API: 400, `{ error: { code: 'FORM_INVALID', message, details } }`.
- The drawn task form: a 400 page that says why. It carries the rules as its inputs' attributes (`required`,
  `minlength`, `maxlength`, `min`, `max`, `readonly`; `routes/formAttributes.ts`), so the browser stops most first; it
  shows the case's values, and a read-only drop-down is disabled (not sent).
- A launched engine sends `details` with the error.

## 3. Off

`formRules: false` in the configuration (bpmn-web: `FORM_RULES=false`): the rules are not checked; the validate event
still runs. A restart is not checked.

## 4. Not yet

- A lookup's value (it needs its source to find one key).
- A model check (`verifyModel`) of the rules themselves: a `config` that is not a number, `min` on a string.
