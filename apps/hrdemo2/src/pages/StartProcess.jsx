import React, { useEffect, useState } from 'react';

// The processes this person may start in the workflow server beside this application (its API v3, through this site's
// /api/v3: server/owf.js). A process whose model names one of HR's own forms starts on that page; any other starts in the
// workflow server's own start form, by a handoff (/api/hr/owf/start/<process>): the person is not asked to sign in again, and
// comes back here with the instance that was made (?instance=).
export default function StartProcess() {
  const [starts, setStarts] = useState(null); // null: not known yet; false: no workflow server behind this site
  const [problem, setProblem] = useState('');
  const [made, setMade] = useState(new URLSearchParams(window.location.search).get('instance'));

  useEffect(() => {
    fetch('/api/v3/processes/startable')
      .then(async r => {
        if (r.status === 404) return setStarts(false);
        const answer = await r.json();
        if (!r.ok) return setProblem(answer?.error?.message ?? `The processes could not be read (${r.status})`);
        setStarts(answer.items ?? []);
      })
      .catch(() => setStarts(false));
  }, []);

  /** HR's own form, when the model names one (its address, with what owf adds); else the workflow server's start form. */
  const open = s => {
    const key = s.form?.formKey;
    const back = encodeURIComponent('/hr' + window.location.pathname);
    if (typeof key === 'string' && key.startsWith('/'))
      return window.location.assign(`/hr${key}?process=${encodeURIComponent(s.processName)}&start=${encodeURIComponent(s.startNodeId)}&returnTo=${encodeURIComponent(window.location.pathname)}`);
    window.location.assign(`/api/hr/owf/start/${encodeURIComponent(s.processName)}?startNodeId=${encodeURIComponent(s.startNodeId)}&returnTo=${back}`);
  };

  return (
    <div>
      <div className="page-header"><div><h1>Start a process</h1><p>What you may start in the workflows</p></div></div>
      {made && <div className="card" role="status"><div className="card-body">Started. Its first task, if it is yours, is in <b>To do</b>. <button className="btn btn-sm" onClick={() => setMade(null)}>OK</button></div></div>}
      {problem && <div className="login-error">{problem}</div>}
      {starts === null && !problem && <p>Reading the processes…</p>}
      {starts === false && <p>No workflow server is connected.</p>}
      {Array.isArray(starts) && !starts.length && <p>Nothing you may start.</p>}
      {Array.isArray(starts) && starts.length > 0 && (
        <div className="card">
          <table>
            <thead><tr><th>Process</th><th>Start</th><th>Asks for</th><th></th></tr></thead>
            <tbody>
              {starts.map(s => (
                <tr key={`${s.processName}/${s.startNodeId}`}>
                  <td>{s.processName}</td>
                  <td>{s.name}</td>
                  <td>{(s.form?.fields ?? []).length ? `${s.form.fields.length} field${s.form.fields.length === 1 ? '' : 's'}` : 'nothing'}</td>
                  <td><button className="btn btn-primary btn-sm" onClick={() => open(s)}>Start</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
