// How an AI understands the MCP: each prompt of prompts.mjs goes to the Claude Code CLI, with only the MCP's tools, against a
// test server and database of its own. This spends model usage, so it is not part of `npm test`.
//   npm run test:mcp-prompts                  every prompt
//   npm run test:mcp-prompts -- --only a,b    those cases
//   npm run test:mcp-prompts -- --model <id>  another model (default: claude-opus-5-5)
//   npm run test:mcp-prompts -- --dry-run     no model: lists the cases and runs their setups
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { startWebApp, ADMIN_API_KEY, API_KEY } from '../support/webApp.mjs';
import { cases } from './prompts.mjs';

const arg = name => { const at = process.argv.indexOf('--' + name); return at < 0 ? undefined : process.argv[at + 1]; };
const MODEL = arg('model') || 'claude-opus-5-5';
const BUDGET = arg('budget') || '1';
const DRY = process.argv.includes('--dry-run');
const only = arg('only')?.split(',');
const MCP = fileURLToPath(new URL('../../../packages/bpmn-mcp/src/index.mjs', import.meta.url));
const PREFIX = 'mcp__bpmn__';

const selected = cases.filter(c => !only || only.includes(c.id));
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-mcp-prompts-'));

const web = await startWebApp({ env: { API_SERVICE_USER_GROUPS: 'staff,manager,ADMIN,SYSTEM' } });
const { dataStore, engine } = web.bpmnServer;
const startingModels = new Set((await web.bpmnServer.definitions.getList()).map(m => m.name ?? m));

/** What cases use to prepare and check the server, directly and not through the MCP. */
const ctx = {
  start: async (name, data) => ({ id: (await engine.start(name, data)).id }),
  invoke: (query, data) => engine.invoke(query, data),
  instances: query => dataStore.findInstances(query, 'full'),
  instance: async id => (await dataStore.findInstances({ id }, 'full'))[0],
  models: () => web.bpmnServer.definitions.getList(),
};
async function reset() {
  await dataStore.deleteInstances({});
  for (const model of await ctx.models()) {
    const name = model.name ?? model;
    if (!startingModels.has(name)) await web.bpmnServer.definitions.deleteModel(name);
  }
}

const { port } = new URL(web.base);
const mcpConfig = path.join(work, 'mcp.json');
fs.writeFileSync(mcpConfig, JSON.stringify({ mcpServers: { bpmn: {
  command: process.execPath, args: [MCP], env: { HOST: '127.0.0.1', PORT: port, API_KEY, ADMIN_API_KEY },
} } }));

/** One prompt, through the CLI: the tools it called and its answer. */
function ask(prompt) {
  return new Promise((resolve, reject) => {
    const args = ['-p', '--output-format', 'stream-json', '--verbose', '--model', MODEL, '--strict-mcp-config', '--mcp-config', `"${mcpConfig}"`,
      '--tools', '""', '--allowedTools', 'mcp__bpmn', '--no-session-persistence', '--max-budget-usd', BUDGET];
    const child = spawn('claude', args, { cwd: work, shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = '';
    child.stdout.on('data', d => out += d);
    child.stderr.on('data', d => err += d);
    child.on('error', reject);
    child.on('close', code => {
      const calls = [];
      let answer = '', cost = 0, failed = code !== 0 ? `exit ${code}: ${err.slice(0, 300)}` : null;
      for (const line of out.split('\n')) {
        let event;
        try { event = JSON.parse(line); } catch { continue; }
        for (const block of event.type === 'assistant' ? event.message?.content ?? [] : [])
          if (block.type === 'tool_use') calls.push({ name: block.name.replace(PREFIX, ''), input: block.input });
        if (event.type === 'result') {
          answer = event.result ?? '';
          cost = event.total_cost_usd ?? 0;
          if (event.is_error) failed = `${event.subtype}: ${answer.slice(0, 300)}`;
        }
      }
      resolve({ calls, answer, cost, failed });
    });
    child.stdin.end(prompt);
  });
}

/** What was wrong with a case's result; empty when nothing was. */
async function grade(c, result, seed) {
  const problems = [];
  const called = result.calls.map(call => call.name);
  if (result.failed) problems.push(result.failed);
  for (const tool of c.tools ?? []) if (!called.includes(tool)) problems.push(`did not call ${tool}`);
  if (c.anyTool && !c.anyTool.some(tool => called.includes(tool))) problems.push(`called none of ${c.anyTool.join(', ')}`);
  for (const tool of c.notTools ?? []) if (called.includes(tool)) problems.push(`called ${tool}, which it must not`);
  for (const pattern of c.answer ?? []) if (!pattern.test(result.answer)) problems.push(`the answer lacks ${pattern}`);
  try { await c.check?.(ctx, seed); }
  catch (error) { problems.push(`on the server: ${error.message.split('\n')[0]}`); }
  return problems;
}

const print = line => fs.writeSync(1, `${line}\n`);   // straight to stdout: console.log printed nothing here once the web app was running
const report = [];
for (const c of selected) {
  await reset();
  const seed = await c.setup?.(ctx);
  if (DRY) { print(`${c.id}: setup ok. ${c.why}\n  > ${c.prompt.split('\n')[0]}`); continue; }
  const started = Date.now();
  const result = await ask(c.prompt);
  const problems = await grade(c, result, seed);
  report.push({ id: c.id, why: c.why, prompt: c.prompt, passed: !problems.length, problems, tools: result.calls, answer: result.answer, cost: result.cost, ms: Date.now() - started });
  print(`${problems.length ? 'FAIL' : 'PASS'}  ${c.id}  [${result.calls.map(call => call.name).join(', ') || 'no tools'}]  $${result.cost.toFixed(3)}`);
  for (const problem of problems) print(`      ${problem}`);
}

await web.stop();
fs.rmSync(work, { recursive: true, force: true });
if (!DRY) {
  const file = path.join(os.tmpdir(), `bpmn-mcp-prompts-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify({ model: MODEL, report }, null, 2));
  const passed = report.filter(r => r.passed).length;
  print(`\n${passed} of ${report.length} passed with ${MODEL}, $${report.reduce((sum, r) => sum + r.cost, 0).toFixed(2)}. Answers and tool calls: ${file}`);
  process.exit(passed === report.length ? 0 : 1);
}
process.exit(0);
