import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

// The right-hand panel: the person's tasks waiting in the workflows (BPMN Server's API v3, with the HR session), on
// every HR page. A task opens in the workflow pages (pages/Workflow.jsx). It refreshes now and then, when the window
// comes back, and when a workflow page loads (a task completed there): the event 'workflow-changed'.
const REFRESH_MS = 30_000;
const KEY = 'hr.taskPanel';
const RECENT = 5;

const waited = since => {
  const minutes = Math.max(0, Math.round((Date.now() - Date.parse(since)) / 60_000));
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 48 * 60) return `${Math.round(minutes / 60)} h`;
  return `${Math.round(minutes / 1440)} days`;
};

/** A phone: the panel covers the page, so it starts closed and closes when a task is opened. */
const isPhone = () => window.matchMedia('(max-width: 768px)').matches;

function readOpen() {
  if (isPhone()) return false;
  try {
    const kept = localStorage.getItem(KEY);
    if (kept !== null) return kept === 'open';
  } catch { /* no storage here */ }
  return window.innerWidth >= 1100;
}

/**
 * onToggle(open): whether it takes room beside the page; onCount(n): the tasks waiting, for the phone's top bar, whose
 * To do button opens and closes it (the event 'task-panel-toggle').
 */
export default function TaskPanel({ onToggle, onCount }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(readOpen);
  const [tasks, setTasks] = useState(null); // null: not known yet; false: no workflows behind these pages
  const [done, setDone] = useState([]); // the ones this person completed lately, newest first
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/v3/tasks?limit=50');
      if (r.status === 404 || !(r.headers.get('content-type') ?? '').includes('json')) return setTasks(false);
      const answer = await r.json();
      if (!r.ok) return setError(answer?.error?.message ?? `The tasks could not be read (${r.status})`);
      setError('');
      setTasks(answer.items ?? []);
      const recent = await fetch(`/api/v3/tasks?status=completed&limit=${RECENT}`);
      if (recent.ok) setDone((await recent.json()).items ?? []);
    } catch {
      setTasks(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    window.addEventListener('focus', load);
    window.addEventListener('workflow-changed', load);
    return () => { clearInterval(timer); window.removeEventListener('focus', load); window.removeEventListener('workflow-changed', load); };
  }, [load]);

  useEffect(() => { onToggle?.(open && tasks !== false); }, [open, tasks, onToggle]);

  function toggle() {
    setOpen(now => {
      // a phone's choice is not kept: there the panel starts closed
      if (!isPhone()) try { localStorage.setItem(KEY, now ? 'closed' : 'open'); } catch { /* kept for this page only */ }
      return !now;
    });
  }
  useEffect(() => {
    window.addEventListener('task-panel-toggle', toggle);
    return () => window.removeEventListener('task-panel-toggle', toggle);
  }, []);

  if (tasks === false) return null;
  const list = tasks ?? [];
  // as My Work has them: assigned to me; not assigned yet, offered to me or my groups (one assigned to someone else is
  // theirs, though my groups may see it)
  const mine = list.filter(t => t.assignee === user.userName);
  const offered = list.filter(t => !t.assignee);
  const waiting = mine.length + offered.length;

  useEffect(() => { onCount?.(tasks === false ? null : waiting); }, [tasks, waiting, onCount]);
  const go = to => { if (isPhone()) setOpen(false); navigate(to); };

  const open_ = t => go(`/workflow/invokeItem?id=${encodeURIComponent(t.id)}&processName=${encodeURIComponent(t.processName)}&elementId=${encodeURIComponent(t.elementId)}`);
  const row = t => (
    <li key={t.id}>
      <button className="task-item" onClick={() => open_(t)} title={`Open ${t.name || t.elementId}`}>
        <span className="task-name">{t.name || t.elementId}</span>
        <span className="task-meta">
          {t.processName} · {waited(t.startedAt)}
          {t.dueDate && <> · due {new Date(t.dueDate).toLocaleDateString()}</>}
        </span>
      </button>
    </li>
  );

  return (
    <>
      <button className={`task-toggle${open ? ' is-open' : ''}`} onClick={toggle} aria-expanded={open} aria-controls="task-panel"
        title={open ? 'Hide the tasks' : 'Show the tasks'}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        To do
        {waiting > 0 && <span className="task-count">{waiting}</span>}
      </button>
      {open && (
        <aside id="task-panel" className="task-panel" aria-label="Tasks to do">
          <div className="task-panel-head">
            <h2>To do</h2>
            <span>
              <button className="btn-icon" onClick={load} title="Refresh">&#8635;</button>
              <button className="btn-icon task-close" onClick={toggle} title="Close" aria-label="Close the tasks">&times;</button>
            </span>
          </div>
          {error && <div className="login-error">{error}</div>}
          {tasks === null ? <p className="task-empty">Reading the tasks…</p> : (
            <>
              <h3>Assigned to me <span className="task-count">{mine.length}</span></h3>
              {mine.length ? <ul>{mine.map(row)}</ul> : <p className="task-empty">Nothing assigned to you.</p>}
              <h3>Available to me <span className="task-count">{offered.length}</span></h3>
              <p className="task-hint">Offered to you or your groups: open one to take it.</p>
              {offered.length ? <ul>{offered.map(row)}</ul> : <p className="task-empty">Nothing waiting for your groups.</p>}
              <h3>Recently done</h3>
              {done.length
                ? <ul>{done.map(t => (
                    <li key={t.id}>
                      <button className="task-item task-done" onClick={() => go(`/workflow/instanceDetails?id=${encodeURIComponent(t.instanceId)}`)}
                        title="Open its instance: where it went after">
                        <span className="task-name">{t.name || t.elementId}</span>
                        <span className="task-meta">{t.processName} · {waited(t.endedAt)} ago</span>
                      </button>
                    </li>))}</ul>
                : <p className="task-empty">Nothing completed yet.</p>}
            </>
          )}
          <button className="btn btn-sm task-all" onClick={() => go('/workflow/dashboard')}>My Work: start a process</button>
        </aside>
      )}
    </>
  );
}
