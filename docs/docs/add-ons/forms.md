# Forms and display (add-on)

The **Forms and display** add-on gives a form field its choices from a source, as the form is filled. Turn it on or
off in its card on the [Settings page](../integration-settings.md) (**Dashboard ▸ Settings ▸ Forms and display**).

## What it does

- A drop-down (`<owf:list>`) or a search (`<owf:lookup>`), from the application's service or a connector's
  operation: see [Lists and lookups in forms](../form-lookups.md).
- A list's value is held to its choices when a task is completed.
- Its rules and choices are handed the field's context (kind `form`).

The form's own rules (required, lengths, ranges) are not the add-on's: they are the server's
([form rules](../form-rules.md), `FORM_RULES`).

## Its settings

None of its own.

## When it is off

The model keeps its lists and lookups; the form offers no choices from them.
