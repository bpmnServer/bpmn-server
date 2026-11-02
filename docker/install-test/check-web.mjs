// Waits for the new application's web server, then checks it serves the sign-in page and keeps other pages
// behind it. Usage: node check-web.mjs <base url>
const base = process.argv[2];
const deadline = Date.now() + 120_000;

async function get(path) {
    return fetch(base + path, { redirect: 'manual' });
}

let login;
while (Date.now() < deadline) {
    try {
        login = await get('/login');
        if (login.status < 500) break;
    } catch { /* not listening yet */ }
    await new Promise(resolve => setTimeout(resolve, 1000));
}
if (!login) {
    console.error(`no answer from ${base} within 2 minutes`);
    process.exit(1);
}

const failures = [];
const check = (ok, message) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${message}`); if (!ok) failures.push(message); };

check(login.status === 200 && /password/i.test(await login.text()), `GET /login: the sign-in page (${login.status})`);
const home = await get('/dashboard');
check(home.status === 302 && /\/login$/.test(home.headers.get('location') ?? ''), `GET /dashboard: sends to /login (${home.status})`);
const modeler = await get('/modeler/modeler.js');
check(modeler.status === 200, `GET /modeler/modeler.js: the model editor's bundle is in the package (${modeler.status})`);

process.exit(failures.length ? 1 : 0);
