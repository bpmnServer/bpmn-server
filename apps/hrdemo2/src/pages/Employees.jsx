import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import UtilBar from '../components/UtilBar';
import Modal from '../components/Modal';

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', hireDate: '', status: 'Active', departmentId: '', managerId: '', jobTitle: '', employmentType: 'FullTime', skills: '' };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const reload = () => fetch('/api/hr/employees').then(r => r.json()).then(setEmployees);

  useEffect(() => {
    reload();
    fetch('/api/hr/departments').then(r => r.json()).then(setDepartments);
  }, []);

  const deptNames = [...new Set(employees.map(e => e.departmentName))].sort();

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchesSearch = !q || `${e.firstName} ${e.lastName} ${e.email} ${e.jobTitle}`.toLowerCase().includes(q)
      || e.skills.some(s => s.toLowerCase().includes(q));
    const matchesDept = !deptFilter || e.departmentName === deptFilter;
    const matchesStatus = !statusFilter || e.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (emp) => {
    setEditing(emp.employeeId);
    setForm({ ...emp, skills: emp.skills.join(', ') });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
    if (editing) {
      await fetch(`/api/hr/employees/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch('/api/hr/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return;
    await fetch(`/api/hr/employees/${id}`, { method: 'DELETE' });
    reload();
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Employees</h1>
            <p>{employees.filter(e => e.status === 'Active').length} active employees across {deptNames.length} departments</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Employee</button>
        </div>
      </div>
      <div className="page-body">
        <div className="toolbar">
          <input className="search-input" placeholder="Search by name, title, email, or skill..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="filter-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {deptNames.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="OnLeave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>

        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Type</th>
                <th>Utilization</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.employeeId}>
                  <td>
                    <Link to={`/employees/${emp.employeeId}`} style={{ fontWeight: 600 }}>
                      {emp.firstName} {emp.lastName}
                    </Link>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{emp.email}</div>
                  </td>
                  <td>{emp.jobTitle}</td>
                  <td>{emp.departmentName}</td>
                  <td><StatusBadge value={emp.status} /></td>
                  <td><StatusBadge value={emp.employmentType} /></td>
                  <td><UtilBar value={emp.utilization} /></td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(emp)}>&#9998;</button>
                      <button className="btn-icon danger" title="Delete" onClick={() => handleDelete(emp.employeeId)}>&times;</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-secondary)' }}>No employees found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Employee' : 'Add Employee'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input required value={form.firstName} onChange={set('firstName')} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input required value={form.lastName} onChange={set('lastName')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" required value={form.email} onChange={set('email')} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input required value={form.jobTitle} onChange={set('jobTitle')} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <select required value={form.departmentId} onChange={set('departmentId')}>
                  <option value="">Select...</option>
                  {departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Manager</label>
                <select value={form.managerId || ''} onChange={set('managerId')}>
                  <option value="">None</option>
                  {employees.filter(e => e.employeeId !== editing).map(e => <option key={e.employeeId} value={e.employeeId}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Hire Date</label>
                <input type="date" required value={form.hireDate} onChange={set('hireDate')} />
              </div>
              <div className="form-group">
                <label>Employment Type</label>
                <select value={form.employmentType} onChange={set('employmentType')}>
                  <option value="FullTime">Full Time</option>
                  <option value="PartTime">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="Active">Active</option>
                <option value="OnLeave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input value={form.skills} onChange={set('skills')} placeholder="React, Node.js, TypeScript..." />
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add Employee'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
