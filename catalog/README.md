# The model catalog

Ready-made BPMN models that bpmn-web users browse and import (Catalog, `/dashboard/catalog`, designers).

```
catalog/
  entries.json      what you write: id, name, description, tags of each model
  models/<id>.bpmn  the models
  models/<id>.svg   their diagrams (build.mjs draws them)
  catalog.json      what bpmn-web reads (build.mjs writes it)
  build.mjs
```

## Add or change a model

1. Put the model in `models/<id>.bpmn` (`id`: lower case, dashes).
2. Add it to `entries.json`: `{ "id", "name" (the model's name once imported), "description", "tags": ["demo"] }`.
3. Build (from the repository root, after `npm run build`): `node catalog/build.mjs`.

`build.mjs` checks each model as `npx bpmn-server verify` does, and records in `catalog.json` its errors and
warnings, the services it calls (an importing application's app delegate needs them), what it is made of,
its size and its SHA-256 (bpmn-web refuses a file that does not match it).

## Publish

Copy `catalog.json` and `models/` to the web server. bpmn-web reads the catalog at `CATALOG_URL`: a web
address (default `https://catalog.omniworkflow.com/`, where `catalog.json` is then
`https://catalog.omniworkflow.com/catalog.json`) or a local folder.

## From the 2021 catalog

The 14 models of the earlier catalog (`<Name>.bpmn`, `.png`, `.svg`, `.xml`, `.zip`, and `list.txt` for the
descriptions) were brought over as they were, with one change: empty conditions on sequence flows were
removed (an empty condition is no condition; the engine refuses an empty one). Models described only as
"Testing" are tagged `test`, the others `demo`.

Five still have errors to fix in the editor: timers without a duration (Followup, Invoicing, pizza), a call
activity that does not name the process it calls (SuperProc), and a pool without a start event (Process
Invoices). The catalog shows them with their problems.
