// Records a read-only HRDemo walkthrough on the running server (default: http://localhost:3100):
// My Work, the Leave Application start list, and the process guide with its steps, rules and examples.
// It does not start or complete a case.
//
//   npm run demo:video --prefix apps/hrdemo
//   node apps/hrdemo/scripts/record-my-work-video.mjs [output-folder]
//
// Set HR_URL, HR_USER and HR_PASSWORD when the local server uses different values.
// MP4 is written when ffmpeg is available; otherwise the WebM is kept.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const base = (process.env.HR_URL || 'http://localhost:3100').replace(/\/$/, '');
const user = process.env.HR_USER || 'david.kim';
const password = process.env.HR_PASSWORD || 'demo1234';
const outDir = path.resolve(process.argv[2] || path.join(import.meta.dirname, 'out'));
const target = path.join(outDir, 'hrdemo-my-work-process-guide');
const SIZE = { width: 1280, height: 720 };

fs.mkdirSync(outDir, { recursive: true });
const fail = error => {
    fs.writeFileSync(path.join(outDir, 'error.txt'), String(error?.stack || error));
    process.exit(1);
};
process.prependListener('unhandledRejection', fail);
process.prependListener('uncaughtException', fail);

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: SIZE, recordVideo: { dir: outDir, size: SIZE } });
const page = await context.newPage();
page.setDefaultTimeout(30000);
page.on('dialog', dialog => dialog.accept());

await page.addInitScript(() => {
    const install = () => {
        if (document.getElementById('demo-overlay')) return;
        const style = document.createElement('style');
        style.textContent = `
            #demo-overlay { position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; }
            #demo-cursor { position: absolute; width: 18px; height: 18px; margin: -2px 0 0 -2px;
                background: no-repeat url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18'><path d='M1 1 L1 15 L5 11 L8 17 L10 16 L7 10 L13 10 Z' fill='black' stroke='white' stroke-width='1.2'/></svg>"); }
            .demo-ring { position: absolute; width: 28px; height: 28px; margin: -14px 0 0 -14px; border-radius: 50%;
                border: 3px solid #1f62c8; animation: demo-ring .5s ease-out forwards; }
            @keyframes demo-ring { from { transform: scale(.3); opacity: 1 } to { transform: scale(1.4); opacity: 0 } }
            #demo-caption { position: absolute; left: 50%; top: 58px; transform: translateX(-50%); max-width: 80%;
                padding: 10px 18px; border-radius: 8px; background: rgba(20, 24, 33, .88); color: #fff;
                font: 600 17px/1.35 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center;
                transition: opacity .3s; opacity: 0; }
            #demo-caption.on { opacity: 1; }
            #demo-card { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center;
                justify-content: center; background: #0f1a2e; color: #fff; font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            #demo-card h1 { font-size: 40px; margin: 0 0 12px; } #demo-card p { font-size: 20px; margin: 4px; color: #c9d4e8; }`;
        document.head.append(style);
        const overlay = document.createElement('div');
        overlay.id = 'demo-overlay';
        overlay.innerHTML = '<div id="demo-cursor"></div><div id="demo-caption"></div>';
        document.body.append(overlay);
        document.addEventListener('mousedown', event => {
            const ring = document.createElement('div');
            ring.className = 'demo-ring';
            ring.style.left = `${event.clientX}px`;
            ring.style.top = `${event.clientY}px`;
            overlay.append(ring);
            setTimeout(() => ring.remove(), 600);
        }, true);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
});

const wait = ms => page.waitForTimeout(ms);
async function moveTo(locator) {
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    if (!box) return;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 20 });
}
async function click(locator) {
    await moveTo(locator);
    await wait(250);
    // The guide link is inside the same-origin workflow iframe. Its browser visibility check can report false
    // while the link is at the iframe's lower edge, even though its bounding box is on screen.
    await locator.click({ force: true });
    await wait(500);
}
async function caption(text, hold = 0) {
    await page.evaluate(text => {
        const element = document.getElementById('demo-caption');
        if (!element) return;
        element.textContent = text || '';
        element.classList.toggle('on', Boolean(text));
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
        document.getElementById('demo-overlay')?.append(card);
    }, [title, lines]);
    await wait(hold);
    await page.evaluate(() => document.getElementById('demo-card')?.remove());
}
async function workflowFrame(pathname) {
    for (let attempt = 0; attempt < 30; attempt++) {
        const frame = page.frames().find(frame => {
            try { return new URL(frame.url()).pathname === pathname; } catch { return false; }
        });
        if (frame) return frame;
        await wait(1000);
    }
    throw new Error(`Workflow frame did not reach ${pathname}`);
}
async function scrollFrame(frame, locator, amount) {
    await locator.scrollIntoViewIfNeeded();
    await frame.evaluate(amount => document.scrollingElement?.scrollBy({ top: amount, behavior: 'smooth' }), amount);
    await wait(1200);
}

// Login before the first visible scene. The title card hides the sign-in form.
await page.goto(`${base}/hr/login`);
await card('HRDemo', ['My Work and the process guide', 'A leave request, explained from the person who works in it'], 2800);
await page.fill('#userName', user);
await page.fill('#password', password);
await page.click('button[type=submit]');
await page.waitForURL(url => url.pathname === '/hr/' || url.pathname === '/hr');

// ---- 1. My Work
await page.goto(`${base}/hr/workflow/dashboard`, { waitUntil: 'domcontentloaded' }).catch(() => {});
const work = await workflowFrame('/dashboard');
await work.locator('h1').filter({ hasText: 'My work' }).waitFor();
await caption('My Work: tasks waiting, recently completed, and processes this person can start', 3000);
const startHeading = work.locator('h2').filter({ hasText: 'Start a process' }).last();
await scrollFrame(work, startHeading, 260);
await caption('The employee can start Leave Application and open its process guide', 3000);
const guideLink = work.locator('a.guide-link[href*="Leave%20Application"]').first();
await guideLink.scrollIntoViewIfNeeded();
await moveTo(guideLink);
await wait(1400);

// ---- 2. Process guide
// The HR frame keeps its own navigation state; go to the linked guide directly after showing the link.
await page.goto(`${base}/hr/workflow/guide/${encodeURIComponent('Leave Application')}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
const guide = await workflowFrame('/guide/Leave%20Application');
await guide.locator('h1').filter({ hasText: 'Leave Application' }).waitFor();
await caption('Process guide: purpose, diagram, steps, forms, responsibilities and examples', 3500);
await scrollFrame(guide, guide.locator('h2').filter({ hasText: 'Its steps' }), 180);
await caption('Each step explains who does it, what the form asks, and where the process goes next', 3500);
await scrollFrame(guide, guide.locator('h2').filter({ hasText: 'Rules' }), 460);
await caption('The guide also documents assignment, notification and security policies', 3000);
await scrollFrame(guide, guide.locator('h2').filter({ hasText: 'Examples' }), 380);
await caption('Examples show the paths the process can take without exposing implementation code', 3500);

await caption('HRDemo · My Work · Leave Application process guide', 0);
await card('HRDemo', ['My Work shows the work; the guide explains the process', 'localhost:3100'], 3000);

const video = page.video();
await context.close();
const webm = await video.path();
await browser.close();
fs.renameSync(webm, `${target}.webm`);
try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `${target}.webm`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', `${target}.mp4`]);
    fs.rmSync(`${target}.webm`);
    console.log(`Video: ${target}.mp4`);
} catch {
    console.log(`Video: ${target}.webm (ffmpeg was not found: no MP4)`);
}
