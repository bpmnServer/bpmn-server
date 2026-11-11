// The HR pages (React, built into dist by npm run build), at /hr: a file of dist, or index.html for the pages' own
// addresses (/hr/employees/EMP-001).
import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(import.meta.dirname, '..', 'dist');

/** Adds the pages to an Express application. */
export function hrPages(app) {
  app.use('/hr', (req, res) => {
    const file = path.join(dist, decodeURIComponent(req.path));
    if (file.startsWith(dist + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) return res.sendFile(file);
    if (!fs.existsSync(path.join(dist, 'index.html'))) return res.status(404).send('The HR pages are not built: npm run build');
    res.sendFile(path.join(dist, 'index.html'));
  });
}
