import React, { useState } from 'react';
import { useAuth } from '../auth';

// The person's own account in the HR application: who they are, and their password.
export default function Account() {
  const { user } = useAuth();
  const [form, setForm] = useState({ current: '', password: '', again: '' });
  const [message, setMessage] = useState(null);
  const set = field => e => setForm({ ...form, [field]: e.target.value });

  async function changePassword(e) {
    e.preventDefault();
    if (form.password !== form.again) return setMessage({ error: 'The new passwords differ' });
    const r = await fetch('/api/hr/session/password', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current: form.current, password: form.password }),
    });
    const answer = await r.json();
    setMessage(r.ok ? { ok: 'Your password is changed.' } : { error: answer.error });
    if (r.ok) setForm({ current: '', password: '', again: '' });
  }

  return (
    <>
      <div className="page-header">
        <h1>My Account</h1>
        <p>{user.name} · {user.role}</p>
      </div>
      <div className="page-body grid-2">
        <div className="card">
          <div className="card-header"><h3>Account</h3></div>
          <div className="card-body detail-grid">
            <div className="detail-field"><div className="field-label">User name</div><div className="field-value">{user.userName}</div></div>
            <div className="detail-field"><div className="field-label">Email</div><div className="field-value">{user.email || '—'}</div></div>
            <div className="detail-field"><div className="field-label">Role</div><div className="field-value">{user.role}</div></div>
            <div className="detail-field"><div className="field-label">Workflow groups</div><div className="field-value">{user.userGroups.join(', ') || 'none'}</div></div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Change password</h3></div>
          <form className="card-body" onSubmit={changePassword}>
            {message?.error && <div className="login-error">{message.error}</div>}
            {message?.ok && <div className="login-ok">{message.ok}</div>}
            <div className="form-group">
              <label>Current password</label>
              <input type="password" required autoComplete="current-password" value={form.current} onChange={set('current')} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>New password</label>
                <input type="password" required minLength={8} autoComplete="new-password" value={form.password} onChange={set('password')} />
              </div>
              <div className="form-group">
                <label>Again</label>
                <input type="password" required minLength={8} autoComplete="new-password" value={form.again} onChange={set('again')} />
              </div>
            </div>
            <div className="form-actions"><button type="submit" className="btn btn-primary">Change password</button></div>
          </form>
        </div>
      </div>
    </>
  );
}
