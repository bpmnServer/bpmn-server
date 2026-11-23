# Extended Forms (add-on)

The **Extended Forms** add-on gives a form field its choices from a source, as the form is filled. It is one of
[Model Options](modeling.md)' switches, so it is turned on and off there
(**Dashboard ▸ Settings ▸ Model Options**), and it has no card of its own.

## What it does

- A drop-down (`<owf:list>`) or a search (`<owf:lookup>`), from the application's service or a connector's
  operation: see [Lists and lookups in forms](../form-lookups.md).
- A list's value is held to its choices when a task is completed.
- Its rules and choices are handed the field's context (kind `form`).

The form's own rules (required, lengths, ranges) are not the add-on's: they are the server's
([form rules](../form-rules.md), `FORM_RULES`).

## Its settings

| Setting | |
|---|---|
| `EXTENDED_FORMS` | Whether a field's choices are read from its source (a Model Options switch) |

## When it is off

The model keeps its lists and lookups; the form offers no choices from them.
