import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const emptyForm = { name: '', industry: '', contactName: '', contactEmail: '', status: 'Active' };

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const reload = () => fetch('/api/hr/clients').then(r => r.json()).then(setClients);
  useEffect(() => { reload(); }, []);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return !q || `${c.name} ${c.industry} ${c.contactName}`.toLowerCase().includes(q);
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c) => { setEditing(c.clientId); setForm({ name: c.name, industry: c.industry, contactName: c.contactName, contactEmail: c.contactEmail, status: c.status }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/hr/clients/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/hr/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this client?')) return;
    await fetch(`/api/hr/clients/${id}`, { method: 'DELETE' });
    reload();
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Clients</h1>
            <p>{clients.filter(c => c.status === 'Active').length} active clients</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Client</button>
        </div>
      </div>
      <div className="page-body">
        <div className="toolbar">
          <input className="search-input" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Industry</th>
                <th>Contact</th>
                <th>Projects</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.clientId}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.industry}</td>
                  <td>
                    <div>{c.contactName}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{c.contactEmail}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{c.activeProjects}</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}> / {c.projectCount}</span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginLeft: 4 }}>active</span>
                  </td>
                  <td><StatusBadge value={c.status} /></td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(c)}>&#9998;</button>
                      <button className="btn-icon danger" title="Delete" onClick={() => handleDelete(c.clientId)}>&times;</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-secondary)' }}>No clients found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Client' : 'Add Client'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Company Name</label>
              <input required value={form.name} onChange={set('name')} />
            </div>
            <div className="form-group">
              <label>Industry</label>
              <input required value={form.industry} onChange={set('industry')} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Name</label>
                <input required value={form.contactName} onChange={set('contactName')} />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" required value={form.contactEmail} onChange={set('contactEmail')} />
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add Client'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
