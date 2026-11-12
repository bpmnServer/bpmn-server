// The HR pages (React, built into dist by npm run build), at /hr: a file of dist, or index.html for the pages' own
// addresses (/hr/employees/EMP-001).
//
// With HR_LIVE_RELOAD=1 (npm start: scripts/start.mjs), an open page reloads by itself: when the pages are built again
// (dist's index.html changes), and when the server comes back after a restart (its code changed). Off otherwise.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(import.meta.dirname, '..', 'dist');
const live = () => process.env.HR_LIVE_RELOAD === '1';

// the page's side: asks now and then (a short request, never a connection held open: a browser allows six to a site
// over HTTP, and a page per tab held them all, so a seventh tab or a refresh waited forever) whether the server
// restarted or the pages were built again, and reloads if so. Only while it is shown.
const RELOADER = `<script>(() => {
  let seen = null;
  const check = () => {
    if (document.hidden) return setTimeout(check, 1500);
    fetch('/hr/__reload', { cache: 'no-store' }).then(r => r.json()).then(now => {
      const key = now.server + ':' + now.build;
      if (seen !== null && key !== seen && now.build) return location.reload();
      seen = key;
    }, () => { /* the server is restarting: asked again */ }).finally(() => setTimeout(check, 1500));
  };
  check();
})();</script>`;

/** What a page compares: this server's start, and the pages' build (index.html's time, once it is written). */
function reloads(app) {
  const server = Date.now().toString(36);
  const build = () => { try { return String(fs.statSync(path.join(dist, 'index.html')).mtimeMs); } catch { return ''; } };
  app.get('/hr/__reload', (req, res) => res.set('Cache-Control', 'no-store').json({ server, build: build() }));
}

/** Adds the pages to an Express application. */
export function hrPages(app) {
  if (live()) reloads(app);
  app.use('/hr', (req, res) => {
    const file = path.join(dist, decodeURIComponent(req.path));
    if (file.startsWith(dist + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile() && path.basename(file) !== 'index.html')
      return res.sendFile(file);
    const index = path.join(dist, 'index.html');
    if (!fs.existsSync(index)) return res.status(404).send('The HR pages are not built: npm run build');
    if (!live()) return res.sendFile(index);
    res.type('html').set('Cache-Control', 'no-store').send(fs.readFileSync(index, 'utf8').replace('</body>', `${RELOADER}</body>`));
  });
}
