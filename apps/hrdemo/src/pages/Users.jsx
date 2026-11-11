import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { useAuth } from '../auth';

// The HR application's users, for HR Administrators: who may sign in, their role (and with it their workflow groups),
// their password. The workflow pages take the same people: they have no users of their own.
const emptyForm = { userName: '', name: '', email: '', role: 'Employee', employeeId: '', password: '' };

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const reload = () => fetch('/api/hr/users').then(r => r.json()).then(setUsers);
  useEffect(() => {
    reload();
    fetch('/api/hr/roles').then(r => r.json()).then(setRoles);
    fetch('/api/hr/employees').then(r => r.json()).then(setEmployees);
  }, []);

  const set = field => e => setForm({ ...form, [field]: e.target.value });
  const openAdd = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit = u => {
    setEditing(u.userName);
    setForm({ ...emptyForm, ...u, employeeId: u.employeeId ?? '', password: '' });
    setError('');
    setShowModal(true);
  };

  async function submit(e) {
    e.preventDefault();
    const body = { ...form, employeeId: form.employeeId || null };
    if (editing && !body.password) delete body.password;
    const r = await fetch(editing ? `/api/hr/users/${encodeURIComponent(editing)}` : '/api/hr/users', {
      method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!r.ok) return setError((await r.json()).error);
    setShowModal(false);
    reload();
  }

  async function remove(userName) {
    if (!confirm(`Delete the user ${userName}?`)) return;
    await fetch(`/api/hr/users/${encodeURIComponent(userName)}`, { method: 'DELETE' });
    reload();
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Users</h1>
            <p>Who signs in to the HR system and its workflows; a role gives the workflow groups</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add User</button>
        </div>
      </div>
      <div className="page-body">
        <div className="card">
          <table className="data-table">
            <thead>
              <tr><th>User</th><th>Role</th><th>Workflow groups</th><th>Employee</th><th></th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.userName}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{u.userName} · {u.email}</div>
                  </td>
                  <td>{u.role}</td>
                  <td>{u.userGroups.join(', ') || '—'}</td>
                  <td>{u.employeeId || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(u)}>&#9998;</button>
                      {u.userName !== me.userName && <button className="btn-icon danger" title="Delete" onClick={() => remove(u.userName)}>&times;</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? `Edit ${editing}` : 'Add User'} onClose={() => setShowModal(false)}>
          <form onSubmit={submit}>
            {error && <div className="login-error">{error}</div>}
            <div className="form-row">
              <div className="form-group">
                <label>User name</label>
                <input required disabled={!!editing} value={form.userName} onChange={set('userName')} />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input required value={form.name} onChange={set('name')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email ?? ''} onChange={set('email')} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={set('role')}>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Employee</label>
                <select value={form.employeeId} onChange={set('employeeId')}>
                  <option value="">—</option>
                  {employees.map(e => <option key={e.employeeId} value={e.employeeId}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{editing ? 'New password (to change it)' : 'Password'}</label>
                <input type="password" minLength={8} required={!editing} autoComplete="new-password" value={form.password} onChange={set('password')} />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add User'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
