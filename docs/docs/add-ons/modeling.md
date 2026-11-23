# Model Options (add-on)

The **Model Options** add-on decides what the model editor offers, each part switched on or off on its own. Turn the
add-on on or off, and set its options, on its page of the [Settings page](../integration-settings.md)
(**Dashboard ▸ Settings ▸ Model Options**).

## What it does

- **Test tab**: a model's scenarios, written in Gherkin and run in the engine from the editor
  ([Testing and debugging models](../testing.md)).
- **History tab**: each save kept as a version, to compare against and to restore.
- **Element templates**: configured tasks offered in the editor's palette, so a modeler picks a ready-made step
  rather than filling in its properties.
- **Extended forms**: a form field's choices taken from a source, as a drop-down or a search
  ([Lists and lookups in forms](../form-lookups.md)). This is the [Extended Forms](forms.md) add-on, switched here.

## Its settings

Each is one of the editor's options, and a designer may change them as well as an administrator.

| Setting | |
|---|---|
| `MODEL_TESTS` | The Test tab |
| `MODEL_HISTORY` | Saved versions of models kept |
| `ELEMENT_TEMPLATES` | Element templates offered in the editor |
| `EXTENDED_FORMS` | A field's choices from a list or a lookup |

## When it is off

The editor has no Test or History tab, a save keeps no version, no element templates are offered, and a form field's
choices are not read from a source. Models keep everything they hold; only the editor's offer changes.
