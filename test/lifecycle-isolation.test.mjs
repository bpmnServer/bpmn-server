import test from 'node:test';
import assert from 'node:assert/strict';
import { Listener } from '../dist/server/Listener.js';

test('lifecycle subscribers are awaited and can unsubscribe', async () => {
  const events = [];
  const listener = new Listener();
  const unsubscribe = listener.subscribe({ async onEvent(event) { await Promise.resolve(); events.push(event.type); } });
  const execution = { appDelegate: {} };
  await listener.doEvent('activity.created', execution);
  assert.deepEqual(events, ['activity.created']);
  unsubscribe();
  await listener.doEvent('activity.completed', execution);
  assert.deepEqual(events, ['activity.created']);
});
