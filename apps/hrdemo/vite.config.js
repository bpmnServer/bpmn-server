// The HR demo's pages, under /hr, calling its API at /api/hr.
// npm run build: into dist, which the server serves at /hr (server/pages.js).
// npm run dev: the HR application on its own, on http://localhost:5173/hr/: the pages, changes shown as they are saved,
// and the HR API (server/routes.js) in vite's own server. With HR_API set (http://localhost:3100), the running server
// (npm start) answers everything but the pages: its HR API, with the data the workflows see, and owf's pages (Workflow).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import { hrRoutes } from './server/routes.js';

/** The HR API in vite's development server. */
const hrApi = {
  name: 'hr-api',
  configureServer(server) {
    const api = express();
    api.use(express.json());
    hrRoutes(api);
    server.middlewares.use((req, res, next) => (req.url.startsWith('/api/hr') ? api(req, res, next) : next()));
  },
};

export default defineConfig({
  base: '/hr/',
  plugins: [react(), ...(process.env.HR_API ? [] : [hrApi])],
  build: { outDir: 'dist', emptyOutDir: true },
  server: {
    port: 5173,
    // everything but /hr: the API, owf's pages and what they load
    proxy: process.env.HR_API ? { '^/(?!hr(/|$))': { target: process.env.HR_API, ws: true } } : undefined,
  },
});
