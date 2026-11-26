import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});

  const reload = () => fetch(`/api/hr/projects/${id}`).then(r => r.json()).then(setProject);

  useEffect(() => {
    reload();
    fetch('/api/hr/clients').then(r => r.json()).then(setClients);
    fetch('/api/hr/employees').then(r => r.json()).then(setEmployees);
  }, [id]);

  const openEdit = () => {
    setForm({ name: project.name, clientId: project.clientId, startDate: project.startDate, endDate: project.endDate, status: project.status, projectManagerId: project.projectManagerId, budget: project.budget, description: project.description });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form, budget: Number(form.budget) };
    await fetch(`/api/hr/projects/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowModal(false);
    reload();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/hr/projects/${id}`, { method: 'DELETE' });
    navigate('/projects');
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  if (!project) return <div className="page-body">Loading...</div>;

  const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const totalAllocation = project.assignments
    .filter(a => a.status === 'Active')
    .reduce((sum, a) => sum + a.allocation, 0);

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="breadcrumb"><Link to="/projects">Projects</Link> / {project.name}</div>
            <h1>{project.name}</h1>
            <p>{project.clientName} &middot; <StatusBadge value={project.status} /></p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={openEdit}>Edit</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="detail-grid">
          <div className="card">
            <div className="card-header">Project Details</div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <div className="detail-field">
                  <div className="field-label">Project ID</div>
                  <div className="field-value">{project.projectId}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Status</div>
                  <div className="field-value"><StatusBadge value={project.status} /></div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Client</div>
                  <div className="field-value">{project.clientName}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Project Manager</div>
                  <div className="field-value">{project.projectManagerName}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Start Date</div>
                  <div className="field-value">{formatDate(project.startDate)}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">End Date</div>
                  <div className="field-value">{formatDate(project.endDate)}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Budget</div>
                  <div className="field-value" style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(project.budget)}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Total Team Allocation</div>
                  <div className="field-value" style={{ fontSize: 18, fontWeight: 700 }}>{totalAllocation}%</div>
                </div>
              </div>
              <div className="detail-field" style={{ marginTop: 8 }}>
                <div className="field-label">Description</div>
                <div className="field-value" style={{ marginTop: 4 }}>{project.description}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">Team Assignments ({project.assignments.length})</div>
            <div className="card-body">
              {project.assignments.length === 0
                ? <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>No assignments yet</div>
                : <table className="data-table">
                    <thead>
                      <tr><th>Team Member</th><th>Role</th><th>Allocation</th><th>Dates</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {project.assignments.map(a => (
                        <tr key={a.assignmentId}>
                          <td>
                            <Link to={`/employees/${a.employeeId}`} style={{ fontWeight: 500 }}>{a.employeeName}</Link>
                            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{a.employeeTitle}</div>
                          </td>
                          <td>{a.role}</td>
                          <td style={{ fontWeight: 600 }}>{a.allocation}%</td>
                          <td style={{ fontSize: 13 }}>
                            {new Date(a.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(a.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td><StatusBadge value={a.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal title="Edit Project" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name</label>
              <input required value={form.name} onChange={set('name')} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Client</label>
                <select required value={form.clientId} onChange={set('clientId')}>
                  <option value="">Select...</option>
                  {clients.map(c => <option key={c.clientId} value={c.clientId}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Project Manager</label>
                <select required value={form.projectManagerId} onChange={set('projectManagerId')}>
                  <option value="">Select...</option>
                  {employees.map(e => <option key={e.employeeId} value={e.employeeId}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" required value={form.startDate} onChange={set('startDate')} />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" required value={form.endDate} onChange={set('endDate')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Budget ($)</label>
                <input type="number" required value={form.budget} onChange={set('budget')} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={set('status')}>
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="OnHold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={set('description')} />
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
