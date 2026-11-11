// The HR demo application's REST API, under /api/hr, and the connector `hr` models call it through. Its data is in
// memory, reset on every start.
import crypto from 'node:crypto';
import fs from 'node:fs';
import { employees, departments, clients, projects, assignments, reviews } from './data.js';

const openapi = JSON.parse(fs.readFileSync(new URL('./openapi.json', import.meta.url), 'utf8'));

/** Two keys compared in constant time (hashed first: any length), so a wrong key's answer time says nothing. */
function sameKey(given, key) {
  if (typeof given !== 'string') return false;
  const hash = text => crypto.createHash('sha256').update(text).digest();
  return crypto.timingSafeEqual(hash(given), hash(key));
}

/**
 * Who may call the HR API: a person signed in to the HR application (its session), or the workflows, through the
 * connector `hr`, with the key HR_SERVICE_KEY (header x-hr-key). Its document is open: a connector is made from it.
 */
export function hrGuard(req, res, next) {
  if (req.path === '/openapi.json' || req.user) return next();
  const key = process.env.HR_SERVICE_KEY;
  if (key && sameKey(req.get('x-hr-key'), key)) return next();
  res.status(401).json({ error: 'Sign in to the HR application' });
}

/** Adds the application's routes to the server's Express application. */
export function hrRoutes(app) {
  app.use('/api/hr', hrGuard);
  // What a connector is built from: the operations a model may call.
  app.get('/api/hr/openapi.json', (req, res) => res.json(openapi));

  // Helper: enrich employee with department name and manager name
  function enrichEmployee(emp) {
    const dept = departments.find(d => d.departmentId === emp.departmentId);
    const mgr = employees.find(e => e.employeeId === emp.managerId);
    const empAssignments = assignments.filter(a => a.employeeId === emp.employeeId && a.status === 'Active');
    const totalAllocation = empAssignments.reduce((sum, a) => sum + a.allocation, 0);
    return {
      ...emp,
      departmentName: dept?.name || '',
      managerName: mgr ? `${mgr.firstName} ${mgr.lastName}` : '',
      utilization: totalAllocation,
    };
  }

  // Helper: enrich project
  function enrichProject(proj) {
    const client = clients.find(c => c.clientId === proj.clientId);
    const pm = employees.find(e => e.employeeId === proj.projectManagerId);
    const projAssignments = assignments.filter(a => a.projectId === proj.projectId);
    return {
      ...proj,
      clientName: client?.name || '',
      projectManagerName: pm ? `${pm.firstName} ${pm.lastName}` : '',
      teamSize: projAssignments.filter(a => a.status === 'Active').length,
    };
  }

  // Helper: enrich review
  function enrichReview(rev) {
    const emp = employees.find(e => e.employeeId === rev.employeeId);
    const reviewer = employees.find(e => e.employeeId === rev.reviewerId);
    return {
      ...rev,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : '',
      employeeTitle: emp?.jobTitle || '',
      reviewerName: reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : '',
    };
  }

  // Dashboard stats
  app.get('/api/hr/dashboard', (req, res) => {
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const totalEmployees = employees.length;
    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const activeClients = clients.filter(c => c.status === 'Active').length;
    const pendingReviews = reviews.filter(r => r.status !== 'Completed').length;
    const activeAssignments = assignments.filter(a => a.status === 'Active');
    const assignedEmployeeIds = [...new Set(activeAssignments.map(a => a.employeeId))];
    const avgUtilization = assignedEmployeeIds.length > 0
      ? Math.round(assignedEmployeeIds.reduce((sum, eid) => {
          return sum + activeAssignments.filter(a => a.employeeId === eid).reduce((s, a) => s + a.allocation, 0);
        }, 0) / assignedEmployeeIds.length)
      : 0;

    const deptBreakdown = departments.map(d => ({
      name: d.name,
      count: employees.filter(e => e.departmentId === d.departmentId && e.status === 'Active').length,
    }));

    const ratingDist = ['Exceptional', 'ExceedsExpectations', 'MeetsExpectations', 'NeedsImprovement', 'Unsatisfactory'].map(r => ({
      rating: r,
      count: reviews.filter(rev => rev.overallRating === r).length,
    }));

    res.json({
      activeEmployees, totalEmployees, activeProjects, activeClients,
      pendingReviews, avgUtilization, deptBreakdown, ratingDist,
    });
  });

  // Helper: generate next ID
  function nextId(arr, prefix, key) {
    const max = arr.reduce((m, item) => {
      const num = parseInt(item[key].replace(prefix + '-', ''));
      return num > m ? num : m;
    }, 0);
    return `${prefix}-${String(max + 1).padStart(3, '0')}`;
  }

  // Employees
  app.get('/api/hr/employees', (req, res) => {
    res.json(employees.map(enrichEmployee));
  });
  app.get('/api/hr/employees/:id', (req, res) => {
    const emp = employees.find(e => e.employeeId === req.params.id);
    if (!emp) return res.status(404).json({ error: 'Not found' });
    const empAssignments = assignments.filter(a => a.employeeId === emp.employeeId).map(a => {
      const proj = projects.find(p => p.projectId === a.projectId);
      return { ...a, projectName: proj?.name || '' };
    });
    const empReviews = reviews.filter(r => r.employeeId === emp.employeeId).map(enrichReview);
    res.json({ ...enrichEmployee(emp), assignments: empAssignments, reviews: empReviews });
  });
  app.post('/api/hr/employees', (req, res) => {
    const emp = { employeeId: nextId(employees, 'EMP', 'employeeId'), ...req.body, terminationDate: null };
    if (!emp.skills) emp.skills = [];
    employees.push(emp);
    res.status(201).json(enrichEmployee(emp));
  });
  app.put('/api/hr/employees/:id', (req, res) => {
    const idx = employees.findIndex(e => e.employeeId === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    employees[idx] = { ...employees[idx], ...req.body };
    res.json(enrichEmployee(employees[idx]));
  });
  app.delete('/api/hr/employees/:id', (req, res) => {
    const idx = employees.findIndex(e => e.employeeId === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    employees.splice(idx, 1);
    res.json({ success: true });
  });

  // Departments
  app.get('/api/hr/departments', (req, res) => {
    res.json(departments.map(d => {
      const mgr = employees.find(e => e.employeeId === d.managerId);
      return { ...d, managerName: mgr ? `${mgr.firstName} ${mgr.lastName}` : '', headcount: employees.filter(e => e.departmentId === d.departmentId && e.status === 'Active').length };
    }));
  });

  // Clients
  app.get('/api/hr/clients', (req, res) => {
    res.json(clients.map(c => ({
      ...c,
      projectCount: projects.filter(p => p.clientId === c.clientId).length,
      activeProjects: projects.filter(p => p.clientId === c.clientId && p.status === 'Active').length,
    })));
  });
  app.post('/api/hr/clients', (req, res) => {
    const client = { clientId: nextId(clients, 'CLI', 'clientId'), ...req.body };
    clients.push(client);
    res.status(201).json({ ...client, projectCount: 0, activeProjects: 0 });
  });
  app.put('/api/hr/clients/:id', (req, res) => {
    const idx = clients.findIndex(c => c.clientId === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    clients[idx] = { ...clients[idx], ...req.body };
    res.json({ ...clients[idx], projectCount: projects.filter(p => p.clientId === clients[idx].clientId).length, activeProjects: projects.filter(p => p.clientId === clients[idx].clientId && p.status === 'Active').length });
  });
  app.delete('/api/hr/clients/:id', (req, res) => {
    const idx = clients.findIndex(c => c.clientId === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    clients.splice(idx, 1);
    res.json({ success: true });
  });

  // Projects
  app.get('/api/hr/projects', (req, res) => {
    res.json(projects.map(enrichProject));
  });
  app.get('/api/hr/projects/:id', (req, res) => {
    const proj = projects.find(p => p.projectId === req.params.id);
    if (!proj) return res.status(404).json({ error: 'Not found' });
    const projAssignments = assignments.filter(a => a.projectId === proj.projectId).map(a => {
      const emp = employees.find(e => e.employeeId === a.employeeId);
      return { ...a, employeeName: emp ? `${emp.firstName} ${emp.lastName}` : '', employeeTitle: emp?.jobTitle || '' };
    });
    res.json({ ...enrichProject(proj), assignments: projAssignments });
  });
  app.post('/api/hr/projects', (req, res) => {
    const proj = { projectId: nextId(projects, 'PRJ', 'projectId'), ...req.body };
    projects.push(proj);
    res.status(201).json(enrichProject(proj));
  });
  app.put('/api/hr/projects/:id', (req, res) => {
    const idx = projects.findIndex(p => p.projectId === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    projects[idx] = { ...projects[idx], ...req.body };
    res.json(enrichProject(projects[idx]));
  });
  app.delete('/api/hr/projects/:id', (req, res) => {
    const idx = projects.findIndex(p => p.projectId === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    projects.splice(idx, 1);
    res.json({ success: true });
  });

  // Assignments
  app.get('/api/hr/assignments', (req, res) => {
    res.json(assignments.map(a => {
      const emp = employees.find(e => e.employeeId === a.employeeId);
      const proj = projects.find(p => p.projectId === a.projectId);
      return { ...a, employeeName: emp ? `${emp.firstName} ${emp.lastName}` : '', projectName: proj?.name || '' };
    }));
  });
  app.post('/api/hr/assignments', (req, res) => {
    const asg = { assignmentId: nextId(assignments, 'ASG', 'assignmentId'), ...req.body };
    assignments.push(asg);
    const emp = employees.find(e => e.employeeId === asg.employeeId);
    const proj = projects.find(p => p.projectId === asg.projectId);
    res.status(201).json({ ...asg, employeeName: emp ? `${emp.firstName} ${emp.lastName}` : '', projectName: proj?.name || '' });
  });
  app.put('/api/hr/assignments/:id', (req, res) => {
    const idx = assignments.findIndex(a => a.assignmentId === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    assignments[idx] = { ...assignments[idx], ...req.body };
    const a = assignments[idx];
    const emp = employees.find(e => e.employeeId === a.employeeId);
    const proj = projects.find(p => p.projectId === a.projectId);
    res.json({ ...a, employeeName: emp ? `${emp.firstName} ${emp.lastName}` : '', projectName: proj?.name || '' });
  });
  app.delete('/api/hr/assignments/:id', (req, res) => {
    const idx = assignments.findIndex(a => a.assignmentId === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    assignments.splice(idx, 1);
    res.json({ success: true });
  });

  // Reviews
  app.get('/api/hr/reviews', (req, res) => {
    res.json(reviews.map(enrichReview));
  });
  app.get('/api/hr/reviews/:id', (req, res) => {
    const rev = reviews.find(r => r.reviewId === req.params.id);
    if (!rev) return res.status(404).json({ error: 'Not found' });
    res.json(enrichReview(rev));
  });
  app.post('/api/hr/reviews', (req, res) => {
    const rev = { reviewId: nextId(reviews, 'REV', 'reviewId'), completedDate: null, overallRating: null, selfAssessment: null, managerAssessment: null, goals: [], ...req.body };
    reviews.push(rev);
    res.status(201).json(enrichReview(rev));
  });
  app.put('/api/hr/reviews/:id', (req, res) => {
    const idx = reviews.findIndex(r => r.reviewId === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    reviews[idx] = { ...reviews[idx], ...req.body };
    res.json(enrichReview(reviews[idx]));
  });
  app.delete('/api/hr/reviews/:id', (req, res) => {
    const idx = reviews.findIndex(r => r.reviewId === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    reviews.splice(idx, 1);
    res.json({ success: true });
  });
}

/**
 * The connector models call this application through: added once, pointed at this server whatever its port, with the
 * key HR_SERVICE_KEY (kept encrypted by the workflow server: CONNECTORS_KEY).
 */
export async function hrConnector(server) {
  const baseUrl = `http://localhost:${process.env.PORT || 3000}/api/hr`;
  if (await server.connectors.get('hr')) await server.connectors.update('hr', { baseUrl });
  else await server.connectors.add({ id: 'hr', document: openapi, baseUrl });
  if (!process.env.HR_SERVICE_KEY || !process.env.CONNECTORS_KEY)
    return console.warn('HR: HR_SERVICE_KEY and CONNECTORS_KEY are needed in .env for the workflows to call the HR API');
  await server.connectors.setKey('hr', process.env.HR_SERVICE_KEY, { type: 'apiKey', in: 'header', name: 'x-hr-key' });
}
