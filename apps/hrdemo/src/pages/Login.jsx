import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth';

// The one sign-in page of the site: the HR pages', and the workflow pages' (their /login comes here).
export default function Login() {
  const { signIn } = useAuth();
  const [params] = useSearchParams();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const { returnTo } = await signIn(userName, password, params.get('returnTo') || '/hr/');
      // a workflow page asked for the sign-in: it opens in the HR layout
      window.location.assign(returnTo.startsWith('/hr') ? returnTo : '/hr/workflow' + (returnTo === '/' ? '' : returnTo));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={submit}>
        <div className="login-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          HR System
        </div>
        <p className="login-intro">Sign in to the HR system and its workflows.</p>
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="userName">User name or email</label>
          <input id="userName" autoFocus required autoComplete="username" value={userName} onChange={e => setUserName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary login-submit">Sign in</button>
        <p className="login-more"><Link to="/welcome">About this demo, and its accounts</Link></p>
      </form>
    </div>
  );
}
