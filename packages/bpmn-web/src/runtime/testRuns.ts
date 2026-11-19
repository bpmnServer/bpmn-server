/**
 * No tests in production (APP_ENV=production, runtime/environment.ts): running a model's scenarios or a decision's
 * tests, and the Test tab's steps, are refused here, in front of every route, pages and APIs alike, so production's
 * database holds no test cases. The test cases it shows are the files deployed with the models (testing/testCases.ts).
 */
import { testsRun } from './environment.js';

export const NO_TESTS_MESSAGE = 'Tests don\'t run in production: their cases are the files deployed with the models (Test cases)';

/** What runs a test: a change (any method but GET and HEAD) to one of these paths. */
const TEST_RUNS: RegExp[] = [
    // the Test tab: a scenario run, recorded step by step, checked, restarted, deleted (routes/model.ts)
    /^\/model\/test\/(run|feature|start|invoke|check|data|restart)$/,
    /^\/model\/test\/instance\/[^/]+$/,
    // a decision's or a policy's tests run
    /^\/model\/(decision|([a-z]+-)?policy)\/[^/]+\/tests\/run$/,
    // the Design page's Run tests
    /^\/dashboard\/design\/tests$/,
    // the APIs: a model's .feature run
    /^\/api\/v3\/models\/[^/]+\/test$/,
    /^\/(admin\/)?api2\/models\/[^/]+\/test$/,
];

/** Whether this request runs a test (refused in production). */
export function runsATest(method: string, path: string): boolean {
    if (/^(GET|HEAD|OPTIONS)$/i.test(method)) return false;
    return TEST_RUNS.some(re => re.test(path));
}

/** Express middleware: in production, a test run answers 403 TESTS_OFF (JSON for the APIs and scripts). */
export function testRunsGuard(req, res, next) {
    if (testsRun() || !runsATest(req.method, req.path)) return next();
    const api = /^\/(admin\/)?api(2)?(\/|$)/.test(req.path);
    if (api || req.is?.('application/json') || req.get?.('x-requested-with') || !req.accepts?.('html'))
        return res.status(403).json({ error: { code: 'TESTS_OFF', message: NO_TESTS_MESSAGE }, errors: NO_TESTS_MESSAGE });
    return res.status(403).render('message', { title: 'No tests in production', message: NO_TESTS_MESSAGE });
}
