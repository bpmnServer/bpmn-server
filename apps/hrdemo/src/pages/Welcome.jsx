import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';

// The demo's home page, open to anyone: what it shows, its accounts (one click signs in as one), and what to try.
export default function Welcome() {
  const { user, signIn } = useAuth();
  const [demo, setDemo] = useState({ accounts: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/hr/demo').then(r => r.json()).then(setDemo, () => {});
  }, []);

  async function signInAs(userName) {
    setError('');
    try {
      await signIn(userName, demo.password, '/hr/');
      window.location.assign('/hr/');
    } catch (err) {
      setError(`${userName}: ${err.message} (was the password changed?)`);
    }
  }

  return (
    <div className="welcome">
      <header className="welcome-head">
        <div className="login-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          HR System
        </div>
        {user
          ? <Link className="btn btn-primary" to="/">Open, as {user.name}</Link>
          : <Link className="btn btn-primary" to="/login">Sign in</Link>}
      </header>

      <section className="welcome-intro">
        <h1>A business application with workflows built in</h1>
        <p>
          This is an HR system for a consulting firm: employees, clients, projects, assignments and performance reviews.
          It has BPMN Server (OmniWorkflow) inside it. The HR application stays in charge; the workflows are part of it.
        </p>
      </section>

      <section className="welcome-grid">
        <div className="card welcome-card">
          <h3>Its own pages</h3>
          <p>The HR pages are the application's own (React). The workflow pages (tasks, the Workbench, the model editor, administration) open inside them, under Workflow in the sidebar.</p>
        </div>
        <div className="card welcome-card">
          <h3>Its own sign-in and users</h3>
          <p>People sign in to the HR application, once. Its users, their roles and their sessions are in its own database; the workflow server keeps none and takes the person the application signed in.</p>
        </div>
        <div className="card welcome-card">
          <h3>Roles become workflow groups</h3>
          <p>A role gives the groups the models use: the lanes of Leave Application (Employee, Manager, HR) decide who starts it and who takes each task; ADMIN administers the workflows.</p>
        </div>
        <div className="card welcome-card">
          <h3>Workflows that call the application</h3>
          <p>The models call the HR application's REST API through a connector, <code>hr</code>: Assign Employee reads the employee and makes the assignment, which then shows under Assignments.</p>
        </div>
      </section>

      <section className="card welcome-accounts">
        <div className="card-header"><h3>The demo's accounts</h3></div>
        <div className="card-body">
          {demo.accounts.length === 0
            ? <p>This server shows no demo accounts: ask its administrator for one.</p>
            : <>
                <p>Every account's password is <code>{demo.password}</code>. Sign in as one, or use the button.</p>
                {error && <div className="login-error">{error}</div>}
                <table className="data-table">
                  <thead><tr><th>User name</th><th>Name</th><th>Role</th><th>Workflow groups</th><th></th></tr></thead>
                  <tbody>
                    {demo.accounts.map(a => (
                      <tr key={a.userName}>
                        <td><code>{a.userName}</code></td>
                        <td>{a.name}</td>
                        <td>{a.role}</td>
                        <td>{a.userGroups.join(', ')}</td>
                        <td><button className="btn btn-sm" onClick={() => signInAs(a.userName)}>Sign in as {a.userName}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>}
        </div>
      </section>

      <section className="card welcome-try">
        <div className="card-header"><h3>Try a leave request, end to end</h3></div>
        <ol className="card-body">
          <li>Sign in as <code>david.kim</code> (an employee). Under Workflow, open <b>My Work</b> and start <b>Leave Application</b>; fill in the request.</li>
          <li>Sign out, and sign in as <code>sarah.chen</code> (a manager). Her <b>My Work</b> has <b>Approve</b>: approve it, reject it, or ask for more information.</li>
          <li>Approved, it is recorded and the employee told (here, in the server's log). As <code>admin</code>, follow it in the <b>Workbench</b>, and see the model in <b>Design</b>.</li>
          <li>As <code>admin</code>, <b>Users</b> (under Administration) adds people and sets their role: what they may do in the workflows follows.</li>
        </ol>
      </section>

      <section className="card welcome-try">
        <div className="card-header"><h3>A workflow that works in the HR application</h3></div>
        <ol className="card-body">
          <li>Signed in as anyone, start <b>Assign Employee</b> from <b>My Work</b>: an employee (<code>EMP-009</code>), a project (<code>PRJ-001</code>), a role, the allocation and the dates.</li>
          <li>It calls the HR API through the connector <code>hr</code>: it reads the employee, then makes the assignment.</li>
          <li>Open <b>Assignments</b>: the new one is there, made by the workflow.</li>
        </ol>
      </section>

      <footer className="welcome-foot">A demonstration with fictional data: the HR records reset at every start.</footer>
    </div>
  );
}
