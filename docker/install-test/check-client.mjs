// Calls the new application through bpmn-client, as the README shows: lists the models, runs Hello to its end.
// The keys come from the application's .env (API_KEY, ADMIN_API_KEY, PORT).
import { BPMNClient2 } from 'bpmn-client';

const client = new BPMNClient2('localhost', Number(process.env.PORT || 3000), process.env.API_KEY,
    { adminApiKey: process.env.ADMIN_API_KEY });

const failures = [];
const check = (ok, message) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${message}`); if (!ok) failures.push(message); };

try {
    const models = await client.model.list();
    const names = models.map(model => model.name ?? model);
    check(names.includes('Hello'), `model.list: ${names.join(', ')}`);

    const started = await client.engine.start('Hello', { name: 'install test' });
    check(started.status === 'running', `engine.start('Hello'): instance ${started.id}, ${started.status}`);

    const waiting = await client.data.findItems({ id: started.id, 'items.status': 'wait' });
    check(waiting.some(item => item.elementId === 'Read'), `data.findItems: waits at ${waiting.map(item => item.elementId).join(', ')}`);

    const done = await client.engine.invoke({ id: started.id, 'items.elementId': 'Read' }, {});
    check(done.status === 'end', `engine.invoke(Read): instance ${done.status}`);
} catch (error) {
    check(false, `bpmn-client: ${error.message}`);
}

process.exit(failures.length ? 1 : 0);
