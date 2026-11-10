// Records a demo video of the model editor on Buy Used Car: properties, a condition broken and fixed (Problems),
// the Report, a Test scenario recorded step by step, a check from the run, and Simulate. Played by Playwright with a visible cursor and
// captions, against the test web app (a temporary models folder with processes/Buy Used Car.bpmn, the test
// database), so no real data is touched. Converted to MP4 when ffmpeg is on the path; otherwise the .webm is kept.
//   npm run demo:video                      writes test/demo/out/buy-used-car-demo.mp4
//   node test/demo/record-demo.mjs <folder>  writes there instead
// The scenes name Buy Used Car's elements (task_Buy, flow_gw1_repair, ...): a change to the model may need them changed.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const webRoot = path.resolve(import.meta.dirname, '..', '..');
const outDir = path.resolve(process.argv[2] || path.join(import.meta.dirname, 'out'));

const SIZE = { width: 1280, height: 720 };
const MODEL = 'Buy Used Car';

fs.mkdirSync(outDir, { recursive: true });
const fail = e => { fs.writeFileSync(path.join(outDir, 'error.txt'), String(e && e.stack || e)); process.exit(1); };
process.prependListener('unhandledRejection', fail);
process.prependListener('uncaughtException', fail);
const web = await startWebApp();
fs.copyFileSync(path.join(webRoot, 'processes', MODEL + '.bpmn'), path.join(web.definitionsPath, MODEL + '.bpmn'));
await web.bpmnServer.definitions.rebuild();

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: SIZE, recordVideo: { dir: outDir, size: SIZE } });
await context.addInitScript(() => {
    try { localStorage.setItem('bpmn-web.modeler.panel', JSON.stringify({ dockHeight: 300, panelWidth: 340 })); } catch { }
    // a visible cursor, a ring on each click, and a caption bar: video shows none of these by itself
    const install = () => {
        if (document.getElementById('demo-cursor')) return;
        const style = document.createElement('style');
        style.textContent = `
            #demo-cursor { position: fixed; z-index: 2147483647; width: 18px; height: 18px; margin: -2px 0 0 -2px; pointer-events: none;
                background: no-repeat url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18'><path d='M1 1 L1 15 L5 11 L8 17 L10 16 L7 10 L13 10 Z' fill='black' stroke='white' stroke-width='1.2'/></svg>"); }
            .demo-ring { position: fixed; z-index: 2147483646; width: 28px; height: 28px; margin: -14px 0 0 -14px; border-radius: 50%;
                border: 3px solid #1f62c8; pointer-events: none; animation: demo-ring .5s ease-out forwards; }
            @keyframes demo-ring { from { transform: scale(.3); opacity: 1 } to { transform: scale(1.4); opacity: 0 } }
            #demo-caption { position: fixed; z-index: 2147483645; left: 50%; top: 58px; transform: translateX(-50%); max-width: 80%;
                padding: 10px 18px; border-radius: 8px; background: rgba(20, 24, 33, .88); color: #fff; pointer-events: none;
                font: 600 17px/1.35 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center;
                transition: opacity .3s; opacity: 0; }
            #demo-caption.on { opacity: 1; }
            #demo-card { position: fixed; inset: 0; z-index: 2147483647; display: flex; flex-direction: column; align-items: center;
                justify-content: center; background: #0f1a2e; color: #fff; font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            #demo-card h1 { font-size: 40px; margin: 0 0 12px; } #demo-card p { font-size: 20px; margin: 4px; color: #c9d4e8; }`;
        document.head.append(style);
        const cursor = document.createElement('div');
        cursor.id = 'demo-cursor';
        cursor.style.left = '640px'; cursor.style.top = '360px';
        const caption = document.createElement('div');
        caption.id = 'demo-caption';
        document.body.append(cursor, caption);
        document.addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }, true);
        document.addEventListener('mousedown', e => {
            const ring = document.createElement('div');
            ring.className = 'demo-ring';
            ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
            document.body.append(ring);
            setTimeout(() => ring.remove(), 600);
        }, true);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
});

const page = await context.newPage();
page.setDefaultTimeout(30000);
page.on('dialog', d => d.accept());
const wait = ms => page.waitForTimeout(ms);
let mouse = { x: 640, y: 360 };

async function moveTo(x, y, steps = 30) {
    await page.mouse.move(x, y, { steps });
    mouse = { x, y };
}
async function moveToLocator(locator) {
    await locator.scrollIntoViewIfNeeded();
    const b = await locator.boundingBox();
    await moveTo(b.x + b.width / 2, b.y + b.height / 2);
}
async function click(locator) {
    await moveToLocator(locator);
    await wait(200);
    await locator.click();
    await wait(300);
}
/** Point at a diagram element (a shape's centre, a flow's middle) and select it. */
async function pick(id) {
    const at = await page.evaluate(id => {
        const m = window.bpmnModeler, el = m.get('elementRegistry').get(id);
        const gfx = m.get('elementRegistry').getGraphics(el).getBoundingClientRect();
        if (el.waypoints) {
            const [a, b] = el.waypoints.length > 2 ? [el.waypoints[1], el.waypoints[2]] : el.waypoints;
            const vb = m.get('canvas').viewbox();
            const box = document.querySelector('#js-canvas').getBoundingClientRect();
            return { x: box.left + ((a.x + b.x) / 2 - vb.x) * vb.scale, y: box.top + ((a.y + b.y) / 2 - vb.y) * vb.scale };
        }
        return { x: gfx.left + gfx.width / 2, y: gfx.top + gfx.height / 2 };
    }, id);
    await moveTo(at.x, at.y);
    await wait(200);
    await page.mouse.down(); await page.mouse.up();
    await page.evaluate(id => { const m = window.bpmnModeler; m.get('selection').select(m.get('elementRegistry').get(id)); }, id);
    await wait(500);
}
async function caption(text, hold = 0) {
    await page.evaluate(text => {
        const c = document.getElementById('demo-caption');
        if (!c) return;
        c.textContent = text || '';
        c.classList.toggle('on', Boolean(text));
    }, text);
    if (hold) await wait(hold);
}
async function card(title, lines, hold) {
    await page.evaluate(([title, lines]) => {
        document.getElementById('demo-card')?.remove();
        const card = document.createElement('div');
        card.id = 'demo-card';
        card.innerHTML = `<h1></h1>${lines.map(() => '<p></p>').join('')}`;
        card.querySelector('h1').textContent = title;
        card.querySelectorAll('p').forEach((p, i) => { p.textContent = lines[i]; });
        document.body.append(card);
    }, [title, lines]);
    await wait(hold);
    await page.evaluate(() => document.getElementById('demo-card')?.remove());
}
async function openGroup(label) {
    const header = page.locator('.bio-properties-panel-group-header', { hasText: label }).first();
    if (!/\bopen\b/.test(await header.getAttribute('class')))
        await click(header);
}

// ---- log in (not recorded as a scene: the first card covers it)
await page.goto(web.base + '/login');
await page.fill('#userName', 'designer');
await page.fill('#password', PASSWORD);
await Promise.all([page.waitForURL(u => !u.pathname.startsWith('/login')), page.click('button[type=submit]')]);
await page.goto(`${web.base}/model/edit/${encodeURIComponent(MODEL)}`);
await page.waitForSelector('#js-problems-counts .count, #js-problems-status:text("No problems")');
await page.waitForFunction(() => window.bpmnModeler.get('scriptContext').services.length > 0);
await page.evaluate(() => window.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto'));

// ---- 1. the model
await card('bpmn-web model editor', ['Buy Used Car: model, check, document and test a process', 'in one editor'], 3500);
await caption('Buy Used Car: buy, then repair and/or clean, then drive', 3000);
await caption('bpmn-server checks the model as it is edited: no problems', 2500);
await moveToLocator(page.locator('#js-tab-problems'));
await wait(1200);

// ---- 2. properties
await caption('The properties panel shows what bpmn-server runs');
await pick('task_Buy');
await openGroup('Form fields');
await wait(800);
await caption('Buy asks two questions: Repairs required? Cleaning required?', 3000);
await moveToLocator(page.locator('#js-properties-panel .bio-properties-panel-group-header', { hasText: 'Form fields' }).first());
await wait(1500);

// ---- 3. a condition, checked as it is typed
await caption('Each branch has a condition: JavaScript, checked as you type');
await pick('flow_gw1_repair');
await openGroup('Condition');
const condition = page.locator('#bio-properties-panel-conditionExpression');
await click(condition);
await page.keyboard.press('Control+End');
await wait(600);
await caption('Break it on purpose...');
await page.keyboard.type(' &&', { delay: 180 });
await page.waitForSelector('[data-entry-id="conditionExpression"] .cm-lint-marker-error');
await page.waitForSelector('#js-problems .problem.severity-error');
await caption('...it is marked in the field, on the diagram, and under Problems', 3500);
await moveToLocator(page.locator('#js-problems .problem.severity-error').first());
await wait(1500);
await click(condition);
await page.keyboard.press('Control+End');
for (let i = 0; i < 3; i++) { await page.keyboard.press('Backspace'); await wait(180); }
await page.waitForSelector('#js-problems .problem.severity-error', { state: 'detached' });
await caption('Fixed: the problem goes away', 2500);
await page.evaluate(() => window.bpmnModeler.get('selection').select([]));

// ---- 4. the report
await caption('Report: the whole process as one document');
await click(page.locator('#js-tab-report'));
await page.waitForSelector('.report-element');
await wait(1200);
const report = page.locator('#js-report');
await moveToLocator(report);
for (let i = 0; i < 6; i++) { await report.evaluate(r => r.scrollBy({ top: 140, behavior: 'smooth' })); await wait(700); }
await caption('Conditions, forms and scripts, in flow order', 2500);

// ---- 5. a test scenario, step by step
await caption('Test: record a run of the process in the editor, step by step');
await click(page.locator('#js-tab-test'));
await page.waitForSelector('#js-test .test-panel');
await click(page.locator('.test-new-menu summary'));
await click(page.locator('.test-new'));
await click(page.locator('.test-name'));
await page.locator('.test-name').fill('');
await page.keyboard.type('Repair and clean', { delay: 70 });
await click(page.locator('.test-run'));
await click(page.locator('.test-start-go'));
await page.waitForSelector('.test-step.pending');
await caption('Record: Buy waits, with its form', 2500);

const step = id => page.locator(`.test-step.pending[data-element-id="${id}"]`);
await click(step('task_Buy').locator('[data-field="needsRepairs"]'));
await step('task_Buy').locator('[data-field="needsRepairs"]').selectOption('Yes');
await wait(400);
await click(step('task_Buy').locator('[data-field="needsCleaning"]'));
await step('task_Buy').locator('[data-field="needsCleaning"]').selectOption('Yes');
await wait(400);
await caption('Repairs: Yes, Cleaning: Yes');
await click(step('task_Buy').locator('.test-step-run'));
await step('task_repair').waitFor();
await caption('Both branches are taken: Repair and Clean wait', 3000);

await click(step('task_clean').locator('.test-step-run'));
await page.waitForFunction(() => !document.querySelector('.test-step.pending[data-element-id="task_clean"]'));
await caption('Clean done; the join waits for Repair', 2500);
await click(step('task_repair').locator('.test-step-run'));
await step('task_Drive').waitFor();
await caption('Both done: Drive waits', 2000);
await click(step('task_Drive').locator('.test-step-run'));
await page.waitForSelector('.test-summary.ok');
await caption('It closes by itself: Passed; the steps are saved as the scenario', 3500);
await caption('Add as a check: what the run shows becomes a check');
await click(page.locator('.test-items tbody tr[data-element-id="task_Drive"] .test-add-check'));
await caption('It reads as a sentence, with Edit', 2500);

// ---- 6. simulate
await caption('Simulate replays the run on the diagram');
await click(page.locator('.test-simulate'));
await wait(600);
await click(page.locator('.test-sim-play'));
await caption('Blue: started  ·  Green: done  ·  Orange: waiting');
await page.locator('.test-sim-text', { hasText: 'Done (' }).waitFor({ timeout: 60000 });
await wait(1500);
await caption('', 0);

await card('bpmn-web', ['Properties  ·  Problems  ·  Report  ·  Test  ·  Simulate', 'github.com/bpmnServer'], 3500);

// ---- save
const video = page.video();
await context.close();
const webm = await video.path();
await browser.close();
await web.stop();
const target = path.join(outDir, 'buy-used-car-demo');
fs.renameSync(webm, target + '.webm');
try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', target + '.webm', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', target + '.mp4']);
    fs.rmSync(target + '.webm');
    console.log('Video: ' + target + '.mp4');
} catch {
    console.log('Video: ' + target + '.webm (ffmpeg was not found: no MP4)');
}
process.exit(0);
