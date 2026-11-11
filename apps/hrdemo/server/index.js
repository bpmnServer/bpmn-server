// The HR application alone, without the workflow server: its sign-in, REST API at /api/hr and pages at /hr.
// npm run hr; HR_PORT (default 3101). npm start runs both in one server instead (index.ts).
import express from 'express';
import { hrRoutes } from './routes.js';
import { hrPages } from './pages.js';
import { HrUserManager } from './userManager.js';

const app = express();
const userManager = new HrUserManager();
userManager.init(app);
userManager.setup(app);
app.use(express.json());
hrRoutes(app);
hrPages(app);
app.get('/', (req, res) => res.redirect('/hr/'));

const port = Number(process.env.HR_PORT || 3101);
app.listen(port, () => console.log(`HR demo: http://localhost:${port}/hr/ (its API at /api/hr)`));
