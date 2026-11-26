import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const emptyForm = { employeeId: '', reviewerId: '', period: '', scheduledDate: '', status: 'Pending' };

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const reload = () => fetch('/api/hr/reviews').then(r => r.json()).then(setReviews);
  useEffect(() => {
    reload();
    fetch('/api/hr/employees').then(r => r.json()).then(setEmployees);
  }, []);

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    const matchesSearch = !q || `${r.employeeName} ${r.reviewerName} ${r.period}`.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (r) => {
    setEditing(r.reviewId);
    setForm({ employeeId: r.employeeId, reviewerId: r.reviewerId, period: r.period, scheduledDate: r.scheduledDate, status: r.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/hr/reviews/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/hr/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/hr/reviews/${id}`, { method: 'DELETE' });
    reload();
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Performance Reviews</h1>
            <p>{reviews.filter(r => r.status !== 'Completed').length} reviews pending action</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Review</button>
        </div>
      </div>
      <div className="page-body">
        <div className="toolbar">
          <input className="search-input" placeholder="Search by employee or reviewer..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="SelfAssessmentDue">Self-Assessment Due</option>
            <option value="InReview">In Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Period</th>
                <th>Reviewer</th>
                <th>Scheduled</th>
                <th>Rating</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.reviewId}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.employeeName}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{r.employeeTitle}</div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{r.period}</td>
                  <td>{r.reviewerName}</td>
                  <td>{new Date(r.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td><StatusBadge value={r.overallRating} /></td>
                  <td><StatusBadge value={r.status} /></td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/reviews/${r.reviewId}`} className="btn-icon" title="View">&#128065;</Link>
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(r)}>&#9998;</button>
                      <button className="btn-icon danger" title="Delete" onClick={() => handleDelete(r.reviewId)}>&times;</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-secondary)' }}>No reviews found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Review' : 'Add Review'} onClose={() => setShowModal(false)}>
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
                <label>Reviewer</label>
                <select required value={form.reviewerId} onChange={set('reviewerId')}>
                  <option value="">Select...</option>
                  {employees.map(e => <option key={e.employeeId} value={e.employeeId}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Period</label>
                <input required value={form.period} onChange={set('period')} placeholder="e.g. 2026-H1" />
              </div>
              <div className="form-group">
                <label>Scheduled Date</label>
                <input type="date" required value={form.scheduledDate} onChange={set('scheduledDate')} />
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option value="Pending">Pending</option>
                <option value="SelfAssessmentDue">Self-Assessment Due</option>
                <option value="InReview">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Add Review'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
