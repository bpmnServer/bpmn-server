// The HR application, on its own: its sign-in, REST API at /api/hr and pages at /hr. The workflows are OWF's, on a
// server beside this one (OWF_URL, OWF_SERVICE_KEY): /api/v3 passes the pages' calls on to it as the person signed in
// here (server/owf.js). npm start; HR_PORT (default 3101).
import express from 'express';
import { hrRoutes } from './routes.js';
import { hrPages } from './pages.js';
import { HrUserManager } from './userManager.js';
import { owfProxy, owfOpenTask } from './owf.js';

const app = express();
const userManager = new HrUserManager();
userManager.init(app);
userManager.setup(app);
app.use(express.json());
app.use('/api/v3', owfProxy());
app.get('/api/hr/owf/task/:id', owfOpenTask());
hrRoutes(app);
hrPages(app);
app.get('/', (req, res) => res.redirect('/hr/'));

const port = Number(process.env.HR_PORT || process.env.PORT || 3101);
app.listen(port, () => console.log(`HR demo: http://localhost:${port}/hr/ (its API at /api/hr)`));
