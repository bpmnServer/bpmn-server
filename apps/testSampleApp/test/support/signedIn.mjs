// A browser context already signed in: the sign-in runs once per server and user, and each test gets a new context
// from the session it kept (Playwright's storageState), with no login page. Cheaper UI tests: a test pays for its own
// page, not for the sign-in.
//   const { page, errors, close } = await signedInPage(browser, web, 'designer');
import { PASSWORD } from './webApp.mjs';

const sessions = new Map(); // `${base}|${user}` -> Promise<storageState>

async function sessionOf(browser, web, userName) {
    const key = `${web.base}|${userName}`;
    if (!sessions.has(key)) sessions.set(key, (async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(web.base + '/login');
        await page.fill('#userName', userName);
        await page.fill('#password', PASSWORD);
        await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
        const state = await context.storageState();
        await context.close();
        return state;
    })());
    return sessions.get(key);
}

/**
 * A new context and page signed in as `userName`, local requests only, its page errors collected.
 * `options`: { viewport, init (a function run in the page before its scripts), timeout }.
 */
export async function signedInPage(browser, web, userName = 'designer', options = {}) {
    const context = await browser.newContext({
        viewport: options.viewport ?? { width: 1440, height: 1000 },
        storageState: await sessionOf(browser, web, userName),
    });
    await context.route('**/*', route => route.request().url().startsWith(web.base) ? route.continue() : route.abort());
    if (options.init) await context.addInitScript(options.init);
    const page = await context.newPage();
    page.setDefaultTimeout(options.timeout ?? 20000);
    page.on('dialog', d => d.accept());
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    return { page, errors, context, close: () => context.close() };
}
