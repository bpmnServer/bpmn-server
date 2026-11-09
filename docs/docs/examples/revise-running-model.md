# Revise a model with running instances

Try this 3.5.2 example on a local app with model history enabled. Set `SAVE_SOURCE=true` in the app’s
`.env` before starting it so each test instance keeps a copy of its source.

1. Save a model called **Plan** with **Start → Review (user task) → Record (script task) → End**.
   Set the script to `data.version = 1;`.
2. Start **Plan** twice. Leave one instance at **Review** and complete the other. Confirm that the completed
   instance has `data.version = 1`.
3. Edit the script to `data.version = 2;` and save. Keep the existing **Review** element and its ID.
   In the model editor's **History** tab, compare the two saved versions. The report shows the script change.
4. From your host app, preview the upgrade and inspect the report.

   ```ts
   const preview = await server.engine.upgradeRunning(['Plan'], { dryRun: true });
   console.dir(preview, { depth: null });
   ```

   Expect `would-upgrade` for the waiting instance. If you remove the open **Review** element from the new
   model, the preview reports `stranded` instead. Restore the original element ID before continuing.

5. Apply with `await server.engine.upgradeRunning(['Plan'])` and check for `upgraded`. Complete **Review**
   on the waiting instance. Its script now sets `data.version = 2`. The ended instance still shows
   `data.version = 1`.

See [Model history](../modeler.md#where-models-tests-and-history-are-kept) and the
[executable upgrade cases](https://github.com/bpmnServer/bpmn-server/blob/v3.5.2/packages/bpmn-server/test/upgrade-running.test.mjs).
