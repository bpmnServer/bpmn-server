import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const emptyForm = { name: '', clientId: '', startDate: '', endDate: '', status: 'Planning', projectManagerId: '', budget: '', description: '' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const reload = () => fetch('/api/hr/projects').then(r => r.json()).then(setProjects);
  useEffect(() => {
    reload();
    fetch('/api/hr/clients').then(r => r.json()).then(setClients);
    fetch('/api/hr/employees').then(r => r.json()).then(setEmployees);
  }, []);

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch = !q || `${p.name} ${p.clientName} ${p.projectManagerName}`.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p.projectId);
    setForm({ name: p.name, clientId: p.clientId, startDate: p.startDate, endDate: p.endDate, status: p.status, projectManagerId: p.projectManagerId, budget: p.budget, description: p.description });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form, budget: Number(form.budget) };
    if (editing) {
      await fetch(`/api/hr/projects/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch('/api/hr/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/hr/projects/${id}`, { method: 'DELETE' });
    reload();
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Projects</h1>
            <p>{projects.filter(p => p.status === 'Active').length} active projects</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Project</button>
        </div>
      </div>
      <div className="page-body">
        <div className="toolbar">
          <input className="search-input" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="OnHold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Project Manager</th>
                <th>Timeline</th>
                <th>Budget</th>
                <th>Team</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.projectId}>
                  <td>
                    <Link to={`/projects/${p.projectId}`} style={{ fontWeight: 600 }}>{p.name}</Link>
                  </td>
                  <td>{p.clientName}</td>
                  <td>{p.projectManagerName}</td>
                  <td style={{ fontSize: 13 }}>
                    {new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {new Date(p.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ fontWeight: 500 }}>{formatCurrency(p.budget)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ background: '#eff6ff', color: '#1e40af', padding: '2px 10px', borderRadius: 9999, fontSize: 13, fontWeight: 600 }}>
                      {p.teamSize}
                    </span>
                  </td>
                  <td><StatusBadge value={p.status} /></td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(p)}>&#9998;</button>
                      <button className="btn-icon danger" title="Delete" onClick={() => handleDelete(p.projectId)}>&times;</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-secondary)' }}>No projects found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Project' : 'Add Project'} onClose={() => setShowModal(false)}>
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
              <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add Project'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
