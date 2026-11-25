// Every page template of bpmn-web compiles: a template that does not answers every visit with a 500
// (for example a code block split over several lines that pug's `with` cannot parse).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const web = path.dirname(require.resolve('bpmn-web/package.json'));
const pug = createRequire(path.join(web, 'package.json'))('pug');

const templates = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? templates(path.join(dir, entry.name)) : entry.name.endsWith('.pug') ? [path.join(dir, entry.name)] : []);

test('every page template of bpmn-web compiles', () => {
  const files = ['src/views', 'src/userAccess/views'].flatMap(dir => fs.existsSync(path.join(web, dir)) ? templates(path.join(web, dir)) : []);
  assert.ok(files.length > 20, `templates found: ${files.length}`);
  const failed = files.flatMap(file => {
    try { pug.compileFile(file, { basedir: path.join(web, 'src/views') }); return []; }
    catch (error) { return [`${path.relative(web, file)}: ${error.message.split('\n')[0]}`]; }
  });
  assert.deepEqual(failed, []);
});
