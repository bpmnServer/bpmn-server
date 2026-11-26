import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const emptyForm = { employeeId: '', projectId: '', role: '', allocation: '', startDate: '', endDate: '', status: 'Active' };

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const reload = () => fetch('/api/hr/assignments').then(r => r.json()).then(setAssignments);
  useEffect(() => {
    reload();
    fetch('/api/hr/employees').then(r => r.json()).then(setEmployees);
    fetch('/api/hr/projects').then(r => r.json()).then(setProjects);
  }, []);

  const filtered = assignments.filter(a => {
    const q = search.toLowerCase();
    const matchesSearch = !q || `${a.employeeName} ${a.projectName} ${a.role}`.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (a) => {
    setEditing(a.assignmentId);
    setForm({ employeeId: a.employeeId, projectId: a.projectId, role: a.role, allocation: a.allocation, startDate: a.startDate, endDate: a.endDate, status: a.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form, allocation: Number(form.allocation) };
    if (editing) {
      await fetch(`/api/hr/assignments/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch('/api/hr/assignments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this assignment?')) return;
    await fetch(`/api/hr/assignments/${id}`, { method: 'DELETE' });
    reload();
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Assignments</h1>
            <p>{assignments.filter(a => a.status === 'Active').length} active assignments across all projects</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Assignment</button>
        </div>
      </div>
      <div className="page-body">
        <div className="toolbar">
          <input className="search-input" placeholder="Search by employee, project, or role..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Proposed">Proposed</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Project</th>
                <th>Role</th>
                <th>Allocation</th>
                <th>Period</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.assignmentId}>
                  <td>
                    <Link to={`/employees/${a.employeeId}`} style={{ fontWeight: 500 }}>{a.employeeName}</Link>
                  </td>
                  <td>
                    <Link to={`/projects/${a.projectId}`}>{a.projectName}</Link>
                  </td>
                  <td>{a.role}</td>
                  <td style={{ fontWeight: 600 }}>{a.allocation}%</td>
                  <td style={{ fontSize: 13 }}>
                    {new Date(a.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {new Date(a.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                  <td><StatusBadge value={a.status} /></td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(a)}>&#9998;</button>
                      <button className="btn-icon danger" title="Delete" onClick={() => handleDelete(a.assignmentId)}>&times;</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-secondary)' }}>No assignments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Assignment' : 'Add Assignment'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Employee</label>
                <select required value={form.employeeId} onChange={set('employeeId')}>
                  <option value="">Select...</option>
                  {employees.map(e => <option key={e.employeeId} value={e.employeeId}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Project</label>
                <select required value={form.projectId} onChange={set('projectId')}>
                  <option value="">Select...</option>
                  {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <input required value={form.role} onChange={set('role')} />
              </div>
              <div className="form-group">
                <label>Allocation (%)</label>
                <input type="number" required min="0" max="100" value={form.allocation} onChange={set('allocation')} />
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
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="Proposed">Proposed</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add Assignment'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
