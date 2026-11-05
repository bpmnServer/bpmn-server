import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { cleanName, localBackend } from '../src/backends.mjs';

test('model names reject traversal', () => {
  for (const bad of ['../other', 'a/b', 'a\\b', '..', '']) {
    assert.throws(() => cleanName(bad));
  }
});
test('server mode lists, reads, and protects local models', async () => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'bpmn-mcp-'));
  try {
    await fs.writeFile(path.join(folder, 'sample.bpmn'), '<xml/>');
    const backend = localBackend(folder);
    assert.deepEqual(await backend.listModels(), ['sample']);
    assert.equal((await backend.getModel('sample')).xml, '<xml/>');
    await assert.rejects(backend.saveModel('sample', '<xml/>', true), /MCP_ALLOW_WRITES/);
  } finally {
    await fs.rm(folder, { recursive: true, force: true });
  }
});
