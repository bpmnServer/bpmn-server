import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});

  const reload = () => fetch(`/api/hr/reviews/${id}`).then(r => r.json()).then(setReview);

  useEffect(() => {
    reload();
    fetch('/api/hr/employees').then(r => r.json()).then(setEmployees);
  }, [id]);

  const openEdit = () => {
    setForm({
      employeeId: review.employeeId, reviewerId: review.reviewerId, period: review.period,
      scheduledDate: review.scheduledDate, completedDate: review.completedDate || '',
      status: review.status, overallRating: review.overallRating || '',
      selfAssessment: review.selfAssessment || '', managerAssessment: review.managerAssessment || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form };
    if (!body.completedDate) body.completedDate = null;
    if (!body.overallRating) body.overallRating = null;
    if (!body.selfAssessment) body.selfAssessment = null;
    if (!body.managerAssessment) body.managerAssessment = null;
    await fetch(`/api/hr/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowModal(false);
    reload();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/hr/reviews/${id}`, { method: 'DELETE' });
    navigate('/reviews');
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  if (!review) return <div className="page-body">Loading...</div>;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="breadcrumb"><Link to="/reviews">Performance Reviews</Link> / {review.employeeName} — {review.period}</div>
            <h1>Performance Review</h1>
            <p>{review.employeeName} &middot; {review.period} &middot; <StatusBadge value={review.status} /></p>
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
            <div className="card-header">Review Information</div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <div className="detail-field">
                  <div className="field-label">Employee</div>
                  <div className="field-value">
                    <Link to={`/employees/${review.employeeId}`}>{review.employeeName}</Link>
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{review.employeeTitle}</div>
                  </div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Reviewer</div>
                  <div className="field-value">{review.reviewerName}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Review Period</div>
                  <div className="field-value">{review.period}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Status</div>
                  <div className="field-value"><StatusBadge value={review.status} /></div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Scheduled Date</div>
                  <div className="field-value">{formatDate(review.scheduledDate)}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Completed Date</div>
                  <div className="field-value">{formatDate(review.completedDate)}</div>
                </div>
                {review.overallRating && (
                  <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
                    <div className="field-label">Overall Rating</div>
                    <div className="field-value" style={{ marginTop: 4 }}><StatusBadge value={review.overallRating} /></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">Goals</div>
            <div className="card-body">
              {review.goals.length === 0
                ? <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, fontStyle: 'italic' }}>No goals set for this review period</div>
                : review.goals.map(g => (
                    <div key={g.goalId} className="goal-item">
                      <div className="goal-desc">{g.description}</div>
                      <div className="goal-meta">
                        <StatusBadge value={g.status} />
                        <span>Target: {new Date(g.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>

        <div className="detail-grid full" style={{ marginTop: 24 }}>
          <div className="card">
            <div className="card-header">Self-Assessment</div>
            <div className="card-body">
              <div className={`narrative${review.selfAssessment ? '' : ' empty'}`}>
                {review.selfAssessment || 'Self-assessment has not been submitted yet.'}
              </div>
            </div>
          </div>
        </div>

        <div className="detail-grid full" style={{ marginTop: 16 }}>
          <div className="card">
            <div className="card-header">Manager Assessment</div>
            <div className="card-body">
              <div className={`narrative${review.managerAssessment ? '' : ' empty'}`}>
                {review.managerAssessment || 'Manager assessment has not been completed yet.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal title="Edit Review" onClose={() => setShowModal(false)}>
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
                <input required value={form.period} onChange={set('period')} />
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
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Scheduled Date</label>
                <input type="date" required value={form.scheduledDate} onChange={set('scheduledDate')} />
              </div>
              <div className="form-group">
                <label>Completed Date</label>
                <input type="date" value={form.completedDate} onChange={set('completedDate')} />
              </div>
            </div>
            <div className="form-group">
              <label>Overall Rating</label>
              <select value={form.overallRating} onChange={set('overallRating')}>
                <option value="">Not Rated</option>
                <option value="Exceptional">Exceptional</option>
                <option value="ExceedsExpectations">Exceeds Expectations</option>
                <option value="MeetsExpectations">Meets Expectations</option>
                <option value="NeedsImprovement">Needs Improvement</option>
                <option value="Unsatisfactory">Unsatisfactory</option>
              </select>
            </div>
            <div className="form-group">
              <label>Self-Assessment</label>
              <textarea value={form.selfAssessment} onChange={set('selfAssessment')} rows={3} />
            </div>
            <div className="form-group">
              <label>Manager Assessment</label>
              <textarea value={form.managerAssessment} onChange={set('managerAssessment')} rows={3} />
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
