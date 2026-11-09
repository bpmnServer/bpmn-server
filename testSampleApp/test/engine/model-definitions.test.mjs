// What a model reads as, without running it: Gherkin drives processes, and this is about the definition.
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Behaviour_names, BPMNServer, Configuration, Logger, NoCacheManager } from 'bpmn-web';

test('a task\'s form fields are read from its model', async () => {
  const definitionsPath = fileURLToPath(new URL('../../processes/', import.meta.url));
  const server = new BPMNServer(new Configuration({ definitionsPath, cacheManager: s => new NoCacheManager(s) }), new Logger({ toConsole: false }), { cron: false });
  const definition = await server.definitions.load('Buy Used Car-engine-test');
  const form = definition.getNodeById('task_Buy').getBehaviour(Behaviour_names.CamundaFormData);
  assert.equal(form.fields.length, 2);
});
