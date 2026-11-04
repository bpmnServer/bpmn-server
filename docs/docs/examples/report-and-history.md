# Review a model with Report and History

Use 3.5.2 with model history enabled. Open **Leave Application** from the [starter app](../setup.md),
or create **Start → Review (user task) → End** in a local development app.

## Read the Report

1. Open **Report**. Find the user task under its process, then read its settings and outgoing flow.
   In **Leave Application**, also find the reminder timer nested under the task it is attached to.
2. Click the task ID in the report to select it on the diagram. Use **Print** to export the report as a PDF.
3. Start an instance and open **Model report** on the instance page to inspect the definition that instance uses.
   To keep the original definition with each instance through later edits, set `SAVE_SOURCE=true` before starting it.

## Compare a model edit and a diagram edit

1. Save a baseline. Rename one user task to **Check request**, keeping its element ID, and save.
2. Open **History**, select the two saved versions, and choose **Compare**. The report diff shows the old
   and new task names under the same element. The newer diagram marks the task with an amber **M**.
3. Move the same task on the diagram without changing its properties. Select the most recent saved version
   and **Current**, then compare again. **Current** includes the unsaved move. Expect a separate layout entry
   and a grey **M**. A layout-only change does not alter the report text.

See [Report](../modeler.md#report), [History](../modeler.md#history), and the
[example for applying a revised model to running instances](revise-running-model.md).
