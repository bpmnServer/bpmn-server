// @features: sandbox
// What runs on the server: a setting for each thing; DEMO_MODE only gives those not set their values for a demo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { webConfiguration, SandboxScriptHandler } from 'bpmn-web';

const NAMES = ['DEMO_MODE', 'SCRIPT_SANDBOX', 'SCRIPT_SANDBOX_SERVICES', 'TIMERS', 'SERVICE_TASKS'];

/** The configuration with these settings, and only these: [sandbox, scripts call services, timers, service tasks]. */
function withSettings(env) {
    const saved = Object.fromEntries(NAMES.map(name => [name, process.env[name]]));
    for (const name of NAMES) delete process.env[name];
    Object.assign(process.env, env);
    try {
        const configuration = webConfiguration({});
        const handler = configuration.scriptHandler();
        return [handler instanceof SandboxScriptHandler, handler.callServices ?? null, configuration.runTimers, configuration.runServiceTasks];
    } finally {
        for (const name of NAMES) {
            if (saved[name] === undefined) delete process.env[name];
            else process.env[name] = saved[name];
        }
    }
}

test('nothing set: scripts in the server, timers and service tasks run', () => {
    assert.deepEqual(withSettings({}), [false, null, true, true]);
});

test('each changes only itself', () => {
    assert.deepEqual(withSettings({ SCRIPT_SANDBOX: 'true' }), [true, true, true, true]);
    assert.deepEqual(withSettings({ SCRIPT_SANDBOX: 'true', SCRIPT_SANDBOX_SERVICES: 'false' }), [true, false, true, true]);
    assert.deepEqual(withSettings({ TIMERS: 'false' }), [false, null, false, true]);
    assert.deepEqual(withSettings({ SERVICE_TASKS: 'false' }), [false, null, true, false]);
});

test('DEMO_MODE gives those not set their values; one set wins', () => {
    assert.deepEqual(withSettings({ DEMO_MODE: 'true' }), [true, false, false, false]);
    assert.deepEqual(withSettings({ DEMO_MODE: 'true', SCRIPT_SANDBOX_SERVICES: 'true', SERVICE_TASKS: 'true' }), [true, true, false, true]);
    assert.deepEqual(withSettings({ DEMO_MODE: 'false', SCRIPT_SANDBOX: 'true' }), [true, true, true, true]);
});
