// The screenshots used in the documentation, taken from a real server with the sample models.
//   cd apps/testSampleApp && node --import tsx test/ui/docs-shots.mjs
// Each one is written to docs/docs/images/ under the name the pages use. Run it again after a change to the pages
// it photographs, and look at what it wrote before committing.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.resolve(HERE, '../../../../docs/docs/images');
const only = process.argv.slice(2);

/** Sign in as this user in the browser, filling the sign-in form (userAccess/views/account/login.pug). */
async function signIn(page, base, userName) {
    await page.goto(`${base}/login`, { waitUntil: 'domcontentloaded' });
    await page.fill('#userName', userName);
    await page.fill('#password', PASSWORD);
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => { }),
        page.click('button[type="submit"]'),
    ]);
    if (new URL(page.url()).pathname === '/login') throw new Error(`sign-in as ${userName} failed`);
}

const shots = [
    {
        name: 'workbench.png',
        what: 'The Workbench: the processes to start, and the cases running',
        async take(page, base) {
            await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(600);
        },
    },
    {
        name: 'my-work.png',
        what: 'My work: the tasks waiting for this person, and the ones they completed',
        async take(page, base) {
            await page.goto(`${base}/dashboard`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(600);
        },
    },
    {
        name: 'settings-page.png',
        what: 'The Settings page: the server\'s areas, then each add-on, on or off',
        async take(page, base) {
            await page.goto(`${base}/dashboard/settings`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(600);
        },
    },
    {
        name: 'ai-key.png',
        what: 'A link for an AI agent: the level, the link, and examples of what to ask',
        async take(page, base) {
            await page.goto(`${base}/ai/key`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(400);
        },
    },
    {
        name: 'instance-rationale.png',
        what: 'A case\'s Rationale: each step, and what decided it',
        async take(page, base, { instanceId }) {
            await page.goto(`${base}/instanceDetails?id=${instanceId}`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(800);
            const tab = page.locator('a:has-text("Rationale"), button:has-text("Rationale")').first();
            if (await tab.count()) { await tab.click(); await page.waitForTimeout(500); }
        },
    },
    {
        name: 'model-editor.png',
        what: 'The model editor: the diagram, the properties panel, and the Problems and Test tabs',
        async take(page, base) {
            await page.goto(`${base}/model/edit/${encodeURIComponent('Buy Used Car')}`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.djs-container', { timeout: 20000 });
            await page.waitForTimeout(1500);
        },
    },
];

const web = await startWebApp({ env: { APP_ENV: 'test', AI_ACCESS: 'work,design,administer' } });
// the harness copies only a few fixtures; the editor's shot wants a model that is fully drawn
const FIXTURES = path.resolve(HERE, '../../processes');
for (const file of ['Buy Used Car.bpmn', 'Buy Used Car.svg'])
    fs.copyFileSync(path.join(FIXTURES, file), path.join(web.definitionsPath, file));
const browser = await chromium.launch();
try {
    // a case with some history, for the Rationale shot
    const started = await web.bpmnServer.engine.start('leave-request', { days: 8, reason: 'holiday' }, null, 'sam');
    const instanceId = started.instance.id;
    const task = started.instance.items.find(i => i.status === 'wait');
    if (task) await web.bpmnServer.engine.invoke({ 'items.id': task.id }, { days: 8, reason: 'holiday' }, 'sam');

    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await signIn(page, web.base, 'admin');

    fs.mkdirSync(IMAGES, { recursive: true });
    for (const shot of shots) {
        if (only.length && !only.includes(shot.name)) continue;
        try {
            await shot.take(page, web.base, { instanceId });
            await page.screenshot({ path: path.join(IMAGES, shot.name) });
            console.log('wrote', shot.name, '-', shot.what);
        }
        catch (error) {
            console.log('FAILED', shot.name, String(error).split('\n')[0]);
        }
    }
}
finally {
    await browser.close();
    await web.stop();
    setImmediate(() => process.exit(0));
}
