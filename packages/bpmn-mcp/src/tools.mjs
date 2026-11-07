// The MCP's tools: what bpmn-client-cli does, and the model administration of the API, one tool each. They all call
// the running server, with the keys of .env: the server decides what those keys may do.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { verifyModel } from 'bpmn-server';
import { z } from 'zod';

const name = z.string().describe('The model\'s name, as list_models gives it');
const data = z.record(z.string(), z.any()).optional().describe('Values for the process\'s data');

/** Query operators that run code in the database: what a model's or a process's text might ask an AI to send. */
const RUNS_CODE = new Set(['$where', '$function', '$accumulator']);
const runsNoCode = value => !value || typeof value !== 'object'
  || Object.entries(value).every(([key, v]) => !RUNS_CODE.has(key) && runsNoCode(v));
const filter = () => z.record(z.string(), z.any()).refine(runsNoCode, { message: `A query can not use ${[...RUNS_CODE].join(', ')}` });

const query = filter().describe('A filter on stored fields, such as {"id":"<instance id>"}, {"name":"<model name>"}, '
  + '{"data.days":3} or {"items.status":"wait"}');
const itemQuery = filter().describe('Which waiting task: its instance and its element, such as '
  + '{"id":"<instance id>","items.elementId":"Submit"}, or {"items.id":"<item id>"}');

/** A model's name: no path, no extension. */
export function cleanName(value) {
  if (typeof value !== 'string' || !value || value.length > 160 || /[/\\]/.test(value) || value === '.' || value === '..')
    throw new Error('Invalid model name');
  return value.endsWith('.bpmn') ? value.slice(0, -5) : value;
}

const validate = (xml, model = 'model') => verifyModel(xml, undefined, cleanName(model));

async function saveModel({ v1 }, { name: model, xml }) {
  const validation = await validate(xml, model);
  if (!validation.valid) return { saved: false, validation };
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bpmn-mcp-'));
  try {
    const file = path.join(dir, cleanName(model) + '.bpmn');
    await fs.writeFile(file, xml);
    await v1.definitions.import(cleanName(model), file);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
  return { saved: true, name: cleanName(model), validation };
}

const limit = z.number().int().positive().optional().describe('How many to return, newest first (default 20)');
/** What one answer may hold, in characters: a server can hold more than an AI can read. */
const MAX_ANSWER = 100_000;

/** The newest rows, and how many there are, as many as fit. A row too large alone says so, without its data. */
function newest(rows, max = 20) {
  const sorted = rows.sort((a, b) => String(b.startedAt ?? '').localeCompare(String(a.startedAt ?? '')));
  const results = sorted.slice(0, max);
  let cut = false;
  while (results.length > 1 && JSON.stringify(results).length > MAX_ANSWER) {
    results.pop();
    cut = true;
  }
  if (results.length && JSON.stringify(results).length > MAX_ANSWER) {
    results[0] = { ...results[0], data: undefined, dataOmitted: 'too large to return' };
    cut = true;
  }
  return { total: rows.length, returned: results.length, ...(cut ? { truncated: 'cut to fit: ask for fewer, or a narrower query' } : {}), results };
}

/** An item as it is given: an item carries its instance's data as well as its own, which says it twice. */
const asItem = ({ instanceData, ...item }) => item;

/** The models' names. */
const modelNames = async v1 => (await v1.definitions.list()).map(model => model?.name ?? model);
/** A model that does not exist is an error: the server answers as if it had done it. */
async function assertModel(v1, model) {
  if (!(await modelNames(v1)).includes(model))
    throw new Error(`No model named ${model}`);
}

async function renameModel({ v1 }, { name: model, newName }) {
  const [from, to] = [cleanName(model), cleanName(newName)];
  await assertModel(v1, from);
  if ((await modelNames(v1)).includes(to))
    throw new Error(`There is already a model named ${to}`);
  return v1.definitions.rename(from, to);
}

async function deleteModel({ v1 }, { name: model }) {
  const clean = cleanName(model);
  await assertModel(v1, clean);
  await v1.definitions.delete(clean);
  return { deleted: clean };
}

/** An empty query matches every instance: only when that is what is meant. */
function deleteInstances({ v1 }, { query: matching, all }) {
  if (!Object.keys(matching).length && all !== true)
    throw new Error('An empty query deletes every instance: set all=true if the user asked for that');
  return v1.datastore.deleteInstances(matching);
}

const read = { readOnlyHint: true };
const write = { readOnlyHint: false, destructiveHint: false };
const destroy = { readOnlyHint: false, destructiveHint: true };

export const tools = [
  // ---- models
  { name: 'list_models', annotations: read, description: 'List the names of the process models on the server.',
    input: {}, run: ({ v1 }) => v1.definitions.list() },
  { name: 'get_model', annotations: read, description: 'Read a process model\'s BPMN XML, to explain it or find out why it behaves as it does.',
    input: { name }, run: ({ v1 }, a) => v1.definitions.load(cleanName(a.name)) },
  { name: 'list_model_events', annotations: read, description: 'List the events that models wait for (signals, messages, timers). '
    + 'The query filters them, such as {"events.subType":"Signal"}.',
    input: { query: query.optional() }, run: ({ v2 }, a) => v2.model.findEvents(a.query ?? {}) },
  { name: 'validate_model', annotations: read, description: 'Check BPMN XML against BPMN Server\'s rules, without saving or running it. '
    + 'Checks of connectors need the server and are not made here.',
    input: { xml: z.string(), name: name.optional() }, run: (c, a) => validate(a.xml, a.name) },
  { name: 'save_model', annotations: destroy, description: 'Validate BPMN XML and save it as a model on the server, replacing any model '
    + 'of that name. Nothing is saved if it is invalid. Needs ADMIN_API_KEY.',
    input: { name, xml: z.string() }, run: saveModel },
  { name: 'rename_model', annotations: write, description: 'Rename a model. Needs ADMIN_API_KEY.',
    input: { name, newName: z.string() }, run: renameModel },
  { name: 'delete_model', annotations: destroy, description: 'Delete a model. Needs ADMIN_API_KEY.',
    input: { name }, run: deleteModel },

  // ---- running processes
  { name: 'start_process', annotations: write, description: 'Start a new instance of a process model. Set keepSavePoints if it may need '
    + 'restart_instance later: an instance without them can only be restarted when the server keeps save points for all.',
    input: { name, data, keepSavePoints: z.boolean().optional() },
    run: ({ v1 }, a) => v1.engine.start(cleanName(a.name), a.data ?? {}, null, null, a.keepSavePoints ? { flags: { savePoints: true } } : {}) },
  { name: 'invoke_task', annotations: write, description: 'Complete a waiting task, with the data the task collects, so that its process continues.',
    input: { query: itemQuery, data }, run: ({ v1 }, a) => v1.engine.invoke(a.query, a.data ?? {}) },
  { name: 'assign_task', annotations: write, description: 'Change who a waiting task is for, without completing it.',
    input: { query: itemQuery, data,
      assignment: z.object({ assignee: z.string().optional(), candidateUsers: z.array(z.string()).optional(), candidateGroups: z.array(z.string()).optional() }) },
    run: ({ v1 }, a) => v1.engine.assign(a.query, a.data ?? {}, null, a.assignment) },
  { name: 'throw_signal', annotations: write, description: 'Throw a signal: every process waiting for it continues.',
    input: { signalId: z.string(), data, matchingKey: z.record(z.string(), z.any()).optional() },
    run: ({ v1 }, a) => v1.engine.throwSignal(a.signalId, a.data ?? {}, a.matchingKey ?? {}) },
  { name: 'throw_message', annotations: write, description: 'Send a message to the process waiting for it. '
    + 'If none waits and a model starts with this message, that starts a new instance.',
    input: { messageId: z.string(), data, matchingKey: z.record(z.string(), z.any()).optional() },
    run: ({ v1 }, a) => v1.engine.throwMessage(a.messageId, a.data ?? {}, a.matchingKey ?? {}) },
  { name: 'start_event', annotations: write, description: 'Start a secondary start event of a running instance.',
    input: { instanceId: z.string(), startNodeId: z.string(), data },
    run: ({ v1 }, a) => v1.engine.startEvent(a.instanceId, a.startNodeId, a.data ?? {}) },
  { name: 'restart_instance', annotations: destroy, description: 'Take an instance back to one of its items, which waits again; what came '
    + 'after that item is dropped. A running instance also needs rewind=true. The instance must have kept save points.',
    input: { query: filter().describe('Which item, such as {"items.id":"<item id>"}'), data, rewind: z.boolean().optional() },
    run: ({ v1 }, a) => v1.engine.restart(a.query, a.data ?? {}, '', a.rewind ? { rewind: true } : {}) },

  // ---- what has run
  { name: 'list_instances', annotations: read, description: 'Find process instances, running or ended, with their status and data: '
    + 'the newest, and the total that match. Their steps are left out unless you set steps=true; find_items is the way to find steps.',
    input: { query: query.optional(), limit, steps: z.boolean().optional().describe('Also return each instance\'s steps. These are long') },
    run: async ({ v1 }, a) => newest(await v1.datastore.findInstances(a.query ?? {},
      { projection: a.steps ? { source: 0, logs: 0 } : { source: 0, logs: 0, items: 0, tokens: 0 } }), a.limit) },
  { name: 'find_items', annotations: read, description: 'Find the steps of processes: the newest, and the total that match. '
    + '{"items.status":"wait"} gives the tasks waiting for someone.',
    input: { query: query.optional(), limit }, run: async ({ v1 }, a) => newest((await v1.datastore.findItems(a.query ?? {})).map(asItem), a.limit) },
  { name: 'delete_instances', annotations: destroy, description: 'Permanently delete the instances the query matches. '
    + 'Confirm with the user first. An empty query is refused unless all=true, which is only for when they asked to delete everything.',
    input: { query, all: z.boolean().optional().describe('With an empty query: delete every instance') }, run: deleteInstances },
  { name: 'engine_status', annotations: read, description: 'The engine\'s status: what is running now.',
    input: {}, run: ({ v1 }) => v1.engine.status() },
];
