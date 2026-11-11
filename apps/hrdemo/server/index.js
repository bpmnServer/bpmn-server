// The HR application alone, without the workflow server: its REST API at /api/hr and its pages at /hr.
// npm run hr; HR_PORT (default 3101). npm start runs both in one server instead (index.ts).
import express from 'express';
import { hrRoutes } from './routes.js';
import { hrPages } from './pages.js';

const app = express();
app.use(express.json());
hrRoutes(app);
hrPages(app);
app.get('/', (req, res) => res.redirect('/hr/'));

const port = Number(process.env.HR_PORT || 3101);
app.listen(port, () => console.log(`HR demo: http://localhost:${port}/hr/ (its API at /api/hr)`));
