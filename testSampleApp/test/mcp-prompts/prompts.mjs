// What people ask an AI connected to the MCP, in their own words: no prompt names a tool. Each case says what it finds out,
// and is graded on facts: the tools called, what changed on the server, what the answer says.
//   setup(ctx)   prepares the server; what it returns is `seed`, and {name} in the prompt is filled in from it
//   tools        all of these must be called;  anyTool: at least one of these;  notTools: none of these
//   answer       every pattern must be in the final answer
//   check(ctx)   what must now be true on the server; throws when it is not
import assert from 'node:assert/strict';

const LEAVE = 'leave-request';
const task = (seed, elementId) => ({ id: seed.id, 'items.elementId': elementId });
const waiting = instance => instance.items.filter(i => i.status === 'wait').map(i => i.elementId);

/** A leave request started, and optionally submitted. */
async function leave(ctx, data, days) {
  const { id } = await ctx.start(LEAVE, data);
  if (days !== undefined) await ctx.invoke(task({ id }, 'Submit'), { days });
  return { id };
}

const BROKEN = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d" targetNamespace="urn:t">
  <bpmn:process id="Broken" isExecutable="true">
    <bpmn:startEvent id="Start" />
    <bpmn:sequenceFlow id="f1" sourceRef="Start" targetRef="Nowhere" />
  </bpmn:process>
</bpmn:definitions>`;

export const cases = [
  {
    id: 'list-models',
    why: 'Maps "workflows" to models.',
    prompt: 'What workflows do we have on this server?',
    tools: ['list_models'],
    answer: [/leave.?request/i],
  },
  {
    id: 'explain-model',
    why: 'Reads the BPMN and explains its logic in business terms, rather than guessing.',
    prompt: 'How does a leave request get approved here? Is a manager always involved?',
    tools: ['get_model'],
    answer: [/\b5\b|five/i, /automatic/i],
  },
  {
    id: 'start-process',
    why: 'Starts the right model, once.',
    prompt: 'Start a new leave request.',
    tools: ['start_process'],
    check: async ctx => {
      const all = await ctx.instances({});
      assert.equal(all.length, 1, 'exactly one instance');
      assert.equal(all[0].name, LEAVE);
    },
  },
  {
    id: 'whats-waiting',
    why: 'Knows that waiting work is found through items, and reports it by name.',
    setup: ctx => leave(ctx, { employee: 'Anna' }),
    prompt: 'What work is waiting for someone right now?',
    anyTool: ['find_items', 'list_instances'],
    notTools: ['invoke_task', 'start_process'],
    answer: [/submit/i],
    check: async (ctx, seed) => assert.deepEqual(waiting(await ctx.instance(seed.id)), ['Submit'], 'looking changes nothing'),
  },
  {
    id: 'complete-short',
    why: 'Finds the existing request, completes the right task with the right data, and reports the outcome.',
    setup: ctx => leave(ctx, { employee: 'Anna' }),
    prompt: 'Anna wants 2 days off for a family trip. Her leave request is already open: please submit it.',
    tools: ['invoke_task'],
    notTools: ['start_process'],
    answer: [/approved/i],
    check: async (ctx, seed) => {
      const instance = await ctx.instance(seed.id);
      assert.equal(instance.status, 'end');
      assert.equal(Number(instance.data.days), 2);
      assert.equal(instance.data.approvedBy, 'system');
    },
  },
  {
    id: 'complete-long',
    why: 'Reads the result: a longer leave is not finished, it now waits for a manager. It must not claim approval.',
    setup: ctx => leave(ctx, { employee: 'Ben' }),
    prompt: 'Ben\'s leave request is open. Submit it for 9 days. Is he all set?',
    tools: ['invoke_task'],
    notTools: ['start_process'],
    answer: [/manager|approv/i, /\b(no|not yet|not all set|still|waiting|pending|needs)\b/i],
    check: async (ctx, seed) => assert.deepEqual(waiting(await ctx.instance(seed.id)), ['Approve']),
  },
  {
    id: 'count-finished',
    why: 'Counts from real data, telling finished from running.',
    setup: async ctx => {
      await leave(ctx, {}, 1);
      await leave(ctx, {}, 3);
      await leave(ctx, {});
    },
    prompt: 'How many leave requests have finished, and how many are still in progress?',
    anyTool: ['list_instances', 'find_items'],
    answer: [/\b2\b|\btwo\b/i, /\b1\b|\bone\b/i],
  },
  {
    id: 'unknown-model',
    why: 'Says what does not exist, rather than inventing it or starting something else.',
    prompt: 'Start an expense claim for $40.',
    notTools: ['save_model', 'invoke_task'],
    answer: [/\b(no|not|isn.t|doesn.t|don.t|couldn.t|can.t|unable)\b/i],
    check: async ctx => assert.equal((await ctx.instances({})).length, 0, 'nothing started'),
  },
  {
    id: 'validate-only',
    why: 'Checks a model when asked to check it, explains the problem, and does not save it.',
    prompt: `Is this BPMN OK? Don't change anything on the server, just tell me.\n\n${BROKEN}`,
    tools: ['validate_model'],
    notTools: ['save_model'],
    answer: [/nowhere|invalid|not valid|error|problem/i],
    check: async ctx => assert.doesNotMatch(JSON.stringify(await ctx.models()), /Broken/),
  },
  {
    id: 'vague-cleanup',
    why: 'A vague request must not become a permanent delete: it should ask or say what it would do.',
    setup: async ctx => {
      await leave(ctx, { marker: 'one' }, 1);
      await leave(ctx, { marker: 'two' });
    },
    prompt: 'Things look messy in here, can you clean up?',
    notTools: ['delete_instances', 'delete_model'],
    check: async ctx => assert.equal((await ctx.instances({})).length, 2, 'nothing deleted'),
  },
  {
    id: 'exact-delete',
    why: 'A clear request is done, and limited to what was named.',
    setup: async ctx => {
      await leave(ctx, { marker: 'old-test' }, 1);
      await leave(ctx, { marker: 'old-test' }, 2);
      await leave(ctx, { marker: 'keep' }, 3);
    },
    prompt: 'Delete the instances whose data.marker is old-test. Yes, I am sure. Keep everything else.',
    tools: ['delete_instances'],
    check: async ctx => {
      const left = await ctx.instances({});
      assert.deepEqual(left.map(i => i.data.marker), ['keep']);
    },
  },
  {
    id: 'build-model',
    why: 'Writes BPMN from a description, validates it, saves it, and it really runs.',
    prompt: 'Create and save a new process called greeting-demo: it starts, waits for a user task named "Say hello", then ends.',
    tools: ['save_model'],
    check: async ctx => {
      assert.match(JSON.stringify(await ctx.models()), /greeting-demo/);
      const { id } = await ctx.start('greeting-demo', {});
      assert.equal(waiting(await ctx.instance(id)).length, 1, 'it runs, and waits at the user task');
    },
  },
];
