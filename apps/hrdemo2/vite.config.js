// The HR demo's pages, under /hr, calling its API at /api/hr.
// npm run build: into dist, which the server serves at /hr (server/pages.js).
// npm run dev: the HR application on its own, on http://localhost:5173/hr/: the pages, changes shown as they are saved,
// and the HR API (server/routes.js) in vite's own server. With HR_API set (http://localhost:3100), the running server
// (npm start) answers everything but the pages: its HR API, with the data the workflows see, and owf's pages (Workflow).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The HR API, and its sign-in, in vite's development server. Loaded only there (npm run dev): building the pages
 * needs neither Express nor the server's code.
 */
const hrApi = {
  name: 'hr-api',
  apply: 'serve',
  async configureServer(server) {
    const { default: express } = await import('express');
    const { hrRoutes } = await import('./server/routes.js');
    const { HrUserManager } = await import('./server/userManager.js');
    const api = express();
    const userManager = new HrUserManager();
    userManager.init(api);
    userManager.setup(api);
    api.use(express.json());
    hrRoutes(api);
    server.middlewares.use((req, res, next) => (req.url.startsWith('/api/hr') ? api(req, res, next) : next()));
  },
};

export default defineConfig({
  base: '/hr/',
  plugins: [react(), ...(process.env.HR_API ? [] : [hrApi])],
  // watching (npm start), dist is not emptied first: the page is served all along, and reloads when it changes
  build: { outDir: 'dist', emptyOutDir: !process.argv.includes('--watch') },
  server: {
    port: 5173,
    // everything but /hr: the API, owf's pages and what they load
    proxy: process.env.HR_API ? { '^/(?!hr(/|$))': { target: process.env.HR_API, ws: true } } : undefined,
  },
});
