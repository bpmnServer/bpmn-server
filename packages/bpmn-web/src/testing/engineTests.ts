import path from 'node:path';
import { engineCalls, movePolicyFolder } from 'bpmn-server';
import type { PolicyKind } from 'bpmn-server';
import { runDecisionTests } from './decisionTests.js';
import { runFeature } from './gherkin.js';
import { runScenario, setTestData } from './scenarios.js';
import { designDisabled } from '../userAccess/roles.js';

/**
 * What tests add to the engine's calls (the `calls` of BPMNServer.launch and of startEngineService): all that a test
 * runs, runs in the engine; the host browses and designs, and asks. Inside, a test goes by the engine's own calls and data
 * as anyone outside does, so it can't pass by what only the inside can reach.
 * With design off (DISABLE_DESIGN) there are none: a test runs a feature's scripts, and a key to the engine is not to run code.
 */
export function engineTests(server) {
    if (designDisabled()) return {};
    const inside = Object.create(server, { engine: { value: engineCalls(server) } });
    return {
        runScenario: async (model: string, scenario, userName?: string) => runScenario(inside, model, scenario, userName),
        runFeature: async (source: string, uri?: string) => runFeature(inside, source, uri),
        setTestData: async (instanceId: string, data) => { await setTestData(inside, instanceId, data); },
        // a file's name, in this engine's own folder of models: where the host keeps its copy is not for here
        // (a policy's: <kind>/<name>.dmn.xml, its kind assignment, notification or security; policies/<kind>/ before 3.7.5)
        runDecisionTests: async (file: string, tests) => {
            const kind = /^(?:policies[\\/])?(assignment|notification|security)[\\/][^\\/]+$/.exec(file)?.[1];
            const folder = server.configuration.definitionsPath;
            return runDecisionTests(kind ? path.join(movePolicyFolder(folder, kind as PolicyKind), path.basename(file)) : path.join(folder, path.basename(file)), tests, inside);
        },
    };
}
