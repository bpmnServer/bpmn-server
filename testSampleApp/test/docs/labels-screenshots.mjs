// Screenshots for docs/docs/labels.md (docs/docs/images/labels/): the sample's Buy Used Car with its labels, on a
// test database. Not a test; run it again after the pages change:
//   node --import tsx test/docs/labels-screenshots.mjs
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const OUT = path.join(import.meta.dirname, '..', '..', '..', 'docs', 'docs', 'images', 'labels');
fs.mkdirSync(OUT, { recursive: true });
const MODEL = 'Buy Used Car';

const web = await startWebApp();
fs.copyFileSync(path.join(import.meta.dirname, '..', '..', 'processes', MODEL + '.bpmn'), path.join(web.definitionsPath, MODEL + '.bpmn'));
await web.bpmnServer.definitions.rebuild();
const engine = web.bpmnServer.engine;
const wait = (run, id) => run.instance.items.find(i => i.elementId === id && i.status === 'wait');

let porsche = await engine.start(MODEL, { carModel: 'Porsche 911', caseId: 101 }, null, 'staff');
porsche = await engine.invoke({ id: porsche.id, 'items.id': wait(porsche, 'task_Buy').id }, { needsRepairs: 'Yes', needsCleaning: 'Yes' }, 'staff');
porsche = await engine.invoke({ id: porsche.id, 'items.id': wait(porsche, 'task_clean').id }, {}, 'manager');
let thunderbird = await engine.start(MODEL, { carModel: 'Thunderbird', caseId: 102 }, null, 'staff');
thunderbird = await engine.invoke({ id: thunderbird.id, 'items.id': wait(thunderbird, 'task_Buy').id }, { needsRepairs: 'No', needsCleaning: 'No' }, 'staff');
await engine.start(MODEL, { carModel: 'Mustang', caseId: 103 }, null, 'staff');

const browser = await chromium.launch();
async function signedIn(user) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    await page.goto(web.base + '/login');
    await page.fill('#userName', user);
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    return { page, close: () => context.close() };
}
const shot = (page, name, options = {}) => page.screenshot({ path: path.join(OUT, name + '.png'), ...options });

// the editor: the case label on the pool, the labels of Drive
{
    const { page, close } = await signedIn('designer');
    await page.goto(`${web.base}/model/edit/${encodeURIComponent(MODEL)}`);
    await page.waitForSelector('#js-canvas .djs-shape');
    const select = id => page.evaluate(id => { document.activeElement?.blur(); const m = window.bpmnModeler; m.get('selection').select(m.get('elementRegistry').get(id)); }, id);
    const openLabel = async () => {
        const header = page.locator('.bio-properties-panel-group-header', { hasText: 'Label' }).first();
        await page.waitForTimeout(200);
        if (!/\bopen\b/.test(await header.getAttribute('class'))) await header.click();
        await header.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
    };
    await select('Participant_1c0lpx5');
    await openLabel();
    await shot(page, 'editor-case-label');
    await select('task_Drive');
    await openLabel();
    await shot(page, 'editor-element-label');
    await close();
}

// the lists, filtered, My work, the instance page
{
    const { page, close } = await signedIn('admin');
    await page.goto(web.base + '/');
    await page.locator('#tasks').scrollIntoViewIfNeeded();
    await page.locator('#tasks').screenshot({ path: path.join(OUT, 'pending-tasks.png') });
    await page.locator('#instances').screenshot({ path: path.join(OUT, 'instances.png') });
    await page.goto(web.base + '/?field=Car&op=contains&value=porsche');
    await page.locator('#instances .label-filter').screenshot({ path: path.join(OUT, 'filter-bar.png') });
    await page.locator('#instances').screenshot({ path: path.join(OUT, 'instances-filtered.png') });
    await page.goto(web.base + '/?task_field=Car&task_op=contains&task_value=porsche');
    await page.locator('#tasks').screenshot({ path: path.join(OUT, 'pending-tasks-filtered.png') });
    await page.goto(`${web.base}/instanceDetails?id=${porsche.id}`);
    await page.locator('.instance-page-header').screenshot({ path: path.join(OUT, 'instance-header.png') });
    await page.locator('#dataTable').screenshot({ path: path.join(OUT, 'instance-items.png') });
    await close();
}
{
    const { page, close } = await signedIn('staff');
    await page.goto(web.base + '/dashboard');
    await page.locator('.dash-grid').first().screenshot({ path: path.join(OUT, 'my-work.png') });
    await close();
}

await browser.close();
await web.stop();
console.log('SHOTS', fs.readdirSync(OUT).join(' '));
setImmediate(() => process.exit(0));
