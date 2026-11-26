import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const TABS = ['Overview', 'Assignments', 'Skills', 'Reviews'];

function Avatar({ name, size = 72 }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const palette = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706'];
  const bg = palette[name.charCodeAt(0) % palette.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
    }}>{initials}</div>
  );
}

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tab, setTab] = useState('Overview');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});

  const reload = () => fetch(`/api/hr/employees/${id}`).then(r => r.json()).then(setEmp);

  useEffect(() => {
    reload();
    fetch('/api/hr/departments').then(r => r.json()).then(setDepartments);
    fetch('/api/hr/employees').then(r => r.json()).then(setEmployees);
  }, [id]);

  const openEdit = () => { setForm({ ...emp, skills: emp.skills.join(', ') }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
    await fetch(`/api/hr/employees/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowModal(false);
    reload();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this employee?')) return;
    await fetch(`/api/hr/employees/${id}`, { method: 'DELETE' });
    navigate('/employees');
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  if (!emp) return <div className="page-body">Loading...</div>;

  const fullName = `${emp.firstName} ${emp.lastName}`;
  const activeAssignments = emp.assignments.filter(a => a.status === 'Active' || a.status === 'Proposed');
  const pastAssignments = emp.assignments.filter(a => a.status !== 'Active' && a.status !== 'Proposed');

  return (
    <>
      {/* ── Profile Hero ── */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ padding: '16px 32px 0' }}>
          <div className="breadcrumb"><Link to="/employees">Employees</Link> / {fullName}</div>
        </div>

        <div style={{ padding: '20px 32px 0', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <Avatar name={fullName} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>{fullName}</h1>
                <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {emp.jobTitle} · {emp.departmentName}
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <StatusBadge value={emp.status} />
                  <StatusBadge value={emp.employmentType} />
                  {emp.managerName && (
                    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      Reports to <strong style={{ color: 'var(--color-text)' }}>{emp.managerName}</strong>
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={openEdit}>Edit</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>

            {/* Quick-stats strip */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 32px', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              {[
                { label: 'Active Projects', value: activeAssignments.length },
                { label: 'Skills', value: emp.skills.length },
                { label: 'Reviews', value: emp.reviews.length },
                { label: 'Utilization', value: `${emp.utilization}%` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', padding: '0 32px', marginTop: 16, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 20px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: tab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: tab === t ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="page-body">

        {/* OVERVIEW */}
        {tab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="card">
              <div className="card-header">Contact & Employment</div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                  {[
                    ['Employee ID', <code key="id" style={{ fontSize: 13 }}>{emp.employeeId}</code>],
                    ['Hire Date', new Date(emp.hireDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
                    ['Email', <a key="email" href={`mailto:${emp.email}`}>{emp.email}</a>],
                    ['Phone', emp.phone],
                    ['Department', emp.departmentName],
                    ['Reports To', emp.managerName || '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="detail-field">
                      <div className="field-label">{label}</div>
                      <div className="field-value">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">Utilization</div>
              <div className="card-body">
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Current Allocation</span>
                  <span style={{ fontWeight: 700, color: emp.utilization > 100 ? 'var(--color-danger)' : 'var(--color-text)' }}>{emp.utilization}%</span>
                </div>
                <div style={{ height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(emp.utilization, 100)}%`,
                    background: emp.utilization > 100 ? 'var(--color-danger)' : emp.utilization >= 80 ? 'var(--color-warning)' : 'var(--color-primary)',
                    borderRadius: 5, transition: 'width 0.4s',
                  }} />
                </div>
                {activeAssignments.length === 0
                  ? <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>No active assignments</p>
                  : activeAssignments.map(a => (
                      <div key={a.assignmentId} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 13 }}>
                        <Link to={`/projects/${a.projectId}`}>{a.projectName}</Link>
                        <span style={{ fontWeight: 600 }}>{a.allocation}%</span>
                      </div>
                    ))
                }
              </div>
            </div>
          </div>
        )}

        {/* ASSIGNMENTS */}
        {tab === 'Assignments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card">
              <div className="card-header">Active & Proposed</div>
              <div className="card-body" style={{ padding: 0 }}>
                {activeAssignments.length === 0
                  ? <p style={{ padding: 20, fontSize: 14, color: 'var(--color-text-secondary)' }}>No active assignments</p>
                  : <table className="data-table">
                      <thead>
                        <tr><th>Project</th><th>Role</th><th>Allocation</th><th>Start</th><th>End</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {activeAssignments.map(a => (
                          <tr key={a.assignmentId}>
                            <td><Link to={`/projects/${a.projectId}`}>{a.projectName}</Link></td>
                            <td>{a.role}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 60, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${Math.min(a.allocation, 100)}%`, background: 'var(--color-primary)', borderRadius: 3 }} />
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{a.allocation}%</span>
                              </div>
                            </td>
                            <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{a.startDate}</td>
                            <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{a.endDate}</td>
                            <td><StatusBadge value={a.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                }
              </div>
            </div>

            {pastAssignments.length > 0 && (
              <div className="card">
                <div className="card-header">Past Assignments</div>
                <div className="card-body" style={{ padding: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr><th>Project</th><th>Role</th><th>Allocation</th><th>Start</th><th>End</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {pastAssignments.map(a => (
                        <tr key={a.assignmentId}>
                          <td><Link to={`/projects/${a.projectId}`}>{a.projectName}</Link></td>
                          <td>{a.role}</td>
                          <td>{a.allocation}%</td>
                          <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{a.startDate}</td>
                          <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{a.endDate}</td>
                          <td><StatusBadge value={a.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SKILLS */}
        {tab === 'Skills' && (
          <div className="card">
            <div className="card-header">Skills & Expertise</div>
            <div className="card-body">
              {emp.skills.length === 0
                ? <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>No skills listed</p>
                : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {emp.skills.map(s => (
                      <span key={s} style={{
                        padding: '8px 18px', background: '#eff6ff', color: '#1e40af',
                        border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 14, fontWeight: 500,
                      }}>{s}</span>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {tab === 'Reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {emp.reviews.length === 0
              ? <div className="card"><div className="card-body" style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>No reviews on record</div></div>
              : emp.reviews.map(r => (
                  <div key={r.reviewId} className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 700 }}>{r.period}</span>
                        <span style={{ margin: '0 8px', color: 'var(--color-text-secondary)' }}>·</span>
                        <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>by {r.reviewerName}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {r.overallRating && <StatusBadge value={r.overallRating} />}
                        <StatusBadge value={r.status} />
                        <Link to={`/reviews/${r.reviewId}`} className="btn btn-sm">View</Link>
                      </div>
                    </div>
                    <div className="card-body">
                      {r.selfAssessment && (
                        <div className="detail-field">
                          <div className="field-label">Self Assessment</div>
                          <div className="narrative">{r.selfAssessment}</div>
                        </div>
                      )}
                      {r.managerAssessment && (
                        <div className="detail-field">
                          <div className="field-label">Manager Assessment</div>
                          <div className="narrative">{r.managerAssessment}</div>
                        </div>
                      )}
                      {r.goals?.length > 0 && (
                        <div className="detail-field">
                          <div className="field-label">Goals ({r.goals.length})</div>
                          <div style={{ marginTop: 6 }}>
                            {r.goals.map(g => (
                              <div key={g.goalId} className="goal-item">
                                <div className="goal-desc">{g.description}</div>
                                <div className="goal-meta">
                                  <StatusBadge value={g.status} />
                                  <span>Due {g.targetDate}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {!r.selfAssessment && !r.managerAssessment && !r.goals?.length && (
                        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Review pending — no content yet</p>
                      )}
                    </div>
                  </div>
                ))
            }
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {showModal && (
        <Modal title="Edit Employee" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label>First Name</label><input required value={form.firstName} onChange={set('firstName')} /></div>
              <div className="form-group"><label>Last Name</label><input required value={form.lastName} onChange={set('lastName')} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Email</label><input type="email" required value={form.email} onChange={set('email')} /></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={set('phone')} /></div>
            </div>
            <div className="form-group"><label>Job Title</label><input required value={form.jobTitle} onChange={set('jobTitle')} /></div>
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
                  {employees.filter(e => e.employeeId !== id).map(e => <option key={e.employeeId} value={e.employeeId}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Hire Date</label><input type="date" required value={form.hireDate} onChange={set('hireDate')} /></div>
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
            <div className="form-group"><label>Skills (comma-separated)</label><input value={form.skills} onChange={set('skills')} /></div>
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
