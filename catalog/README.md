# The model catalog

Ready-made BPMN models that bpmn-web users browse and import (Catalog, `/dashboard/catalog`, designers).

```
catalog/
  connectors/        OpenAPI connector catalog and connector design notes
  models/<id>.bpmn  the models
  models/<id>.svg   their diagrams (build.mjs draws them)
  models/catalog.json  model catalog
  build.mjs
```

## Add or change a model

Put the model files in `models/<name>.bpmn` and `models/<name>.svg`, then add `{ "name", "title", "tags" }`
to `models/catalog.json`.

`build.mjs` checks each model as `npx bpmn-server verify` does, and records in `catalog.json` its errors and
warnings, the services it calls (an importing application's app delegate needs them), what it is made of,
its size and its SHA-256 (bpmn-web refuses a file that does not match it).

## Publish

Copy `models/catalog.json` and the model files to the web server. bpmn-web reads the catalog at `CATALOG_URL`: a web
address or a local folder containing the model catalog.

## From the 2021 catalog

The 14 models of the earlier catalog (`<Name>.bpmn`, `.png`, `.svg`, `.xml`, `.zip`, and `list.txt` for the
descriptions) were brought over as they were, with one change: empty conditions on sequence flows were
removed (an empty condition is no condition; the engine refuses an empty one). Models described only as
"Testing" are tagged `test`, the others `demo`.

Five still have errors to fix in the editor: timers without a duration (Followup, Invoicing, pizza), a call
activity that does not name the process it calls (SuperProc), and a pool without a start event (Process
Invoices). The catalog shows them with their problems.
