# Exporting and importing models

Move models between servers: choose several at once, and what each needs comes with them in **one .zip**, or take **one
file** alone. The import reads either, shows what it would do, and writes only what you choose.

**Export** is the link on the processes list; **Import** is the button on the processes list and on the Design dashboard.
Both are for designers; a few files are an administrator's (below).

## Export

Tick what to export: **processes**, **decisions** (`.dmn`, `.dmn.xml`) and **policies** (the assignment, notification
and security decision tables). Then **Review what will be exported**. Two options apply to the review:

- **With what they need** (on): for each model it finds
    - the **models it calls** (a call activity's `calledElement`), and what those call in turn;
    - the **decisions** its business rule tasks name (`decisionRef`), and the **policies** it uses through its add-ons
      (`owf:assignmentPolicy`, `owf:notificationPolicy`, security);
    - a notification policy's **message templates** (`notification/templates/`);
    - the **connectors** a service task calls (`<connector>/<operation>`) or a form lookup names
      (`connector:<connector>/<operation>`).
- **With their tests and diagrams** (on): `<model>.svg`, `<model>.feature`, `<model>.engine.feature`,
  `<model>.tests.json`, and a decision's `.dmn.feature` and `.dmn.tests.json`. The scenarios are what a model's guide shows
  as its examples.
- **With the cases their tests made** (on): `test-cases/<model>/<scenario>.json`, the last run of each scenario, which
  the guide's "See the case it made" opens, with its passed or failed badge. A case holds the model's source as it ran and a
  fingerprint, so one whose model has changed shows as out of date. Clear it to export the scenarios alone: the examples are
  still shown, without their cases, until the tests are run on the other server.

The review lists every file, why it is there (*chosen*, or *needed by* another) and what is missing: a model that a call
activity calls, a decision or a connector that this server has no file for. A gap is told, not an error: the package is still
made. **Clear a file to leave it out.** **Download** gives one `.zip`, or, when one file is left, that file alone: the
same as the per-file links at the top of the page and **Download everything**, which has not changed.

### What a package holds

The models folder's own layout, and a `manifest.json` that says what was chosen, what came with it, and the SHA-256 of each
file:

```
Leave Application.bpmn  .svg  .feature  .engine.feature  .tests.json
test-cases/<model>/<scenario>.json
loanApproval.dmn.xml  loanApproval.dmn.feature
assignment/  notification/  security/        <policy>.dmn.xml
notification/templates/<name>.md|.txt
connectors/<id>.connector.json
manifest.json
```

**Never in a package:** users, sessions, keys and secrets (a connector's file carries how its key is sent, never the key:
the key stays with the server that holds it), instances, a model's history. A test case is the one record of a run that is
exported, and only if you leave it ticked: it holds the data the test ran with.

**An administrator's:** security policies and connectors. A designer does not see the security policies on the page, and a
connector a model needs is listed as a gap ("only an administrator exports it").

## Import

Choose a `.bpmn`, a `.dmn` / `.dmn.xml`, or a `.zip`.

- A **`.bpmn`** is imported at once, as it always was (a model without a diagram is laid out, and its diagram drawn).
- A **`.zip`** or a **decision** is **shown first**: each file is *new*, *the same* as what is here, *different* from it, or
  *refused* (with why). Nothing is written yet. Tick what to **take**; a *different* file is taken only if you also tick
  **Replace**. A diagram goes with its model. What was sent is kept for ten minutes.
- A model is saved as the editor saves it: checked, with its history kept, so a replaced model can be brought back. The other
  files are written beside the others.

### What an import refuses

- a file name that is not a package's: only the layout above, nothing hidden, nothing outside the models folder (`..`, an
  absolute or drive path, a backslash);
- a `.zip` that is damaged, encrypted, Zip64, or larger than the limits (500 files, 10 MB a file, 50 MB in all);
- a file that does not match the manifest's checksum (the package was changed after it was made);
- a package of a newer version than this server reads (version 1);
- a connector file that is not one (its id is its file's name), and a test case file that is not one;
- **for a designer:** security policies and connectors (an administrator imports them). Importing a connector gives a server
  the definition only: set its key on **Settings ▸ Connectors**.

## Not in 3.7.6

The application's contract (`app-contract.json`), which lives in the application's folder, not the models folder; export and
import from the API or the command line; models kept in a database instead of the models folder (the export reads the folder).
