// The HR pages (React, built into dist by npm run build), at /hr: a file of dist, or index.html for the pages' own
// addresses (/hr/employees/EMP-001).
//
// With HR_LIVE_RELOAD=1 (npm start: scripts/start.mjs), an open page reloads by itself: when the pages are built again
// (dist changes), and when the server comes back after a restart (its code changed). Off otherwise.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(import.meta.dirname, '..', 'dist');
const live = () => process.env.HR_LIVE_RELOAD === '1';

// the page's side: reload when told to, and when the server is back after it went away
const RELOADER = `<script>(() => {
  let lost = false;
  const source = new EventSource('/hr/__reload');
  source.onmessage = () => location.reload();
  source.onerror = () => { lost = true; };
  source.onopen = () => { if (lost) location.reload(); };
})();</script>`;

/** The pages open now, told when dist changes (a build), once the build has settled. */
function reloads(app) {
  const pages = new Set();
  let timer;
  const tell = () => {
    clearTimeout(timer);
    // once the build has written its index.html: a page reloaded before that would find none
    timer = setTimeout(() => (fs.existsSync(path.join(dist, 'index.html'))
      ? pages.forEach(res => { res.write('data: reload\n\n'); res.flush?.(); })
      : tell()), 300);
  };
  try {
    fs.mkdirSync(dist, { recursive: true });
    fs.watch(dist, { recursive: true }, tell);
  } catch (error) {
    console.warn('HR: the pages do not reload by themselves:', error.message);
  }
  app.get('/hr/__reload', (req, res) => {
    // no-transform: not compressed (bpmn-web compresses its answers), so each message goes at once
    res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' });
    res.flushHeaders();
    res.write(': open\n\n');
    res.flush?.();
    pages.add(res);
    req.on('close', () => pages.delete(res));
  });
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
