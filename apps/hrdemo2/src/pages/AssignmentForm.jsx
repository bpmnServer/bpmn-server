import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * The HR application's own form for a workflow step (docs/design/form-keys.md, flow A/E).
 *
 * A model names this page with `camunda:formKey="/forms/assignment"`, and owf sends the person here with
 * identifiers only: a task's `?instance=&item=`, or a start event's `?process=&start=`, each with `returnTo`. No case
 * data travels in the address: this page reads what it needs through API v3, as the person signed in, and completes
 * the task (or starts the process) the same way.
 *
 * The form is HR's own: its employee and project pickers, read from HR's API, its own checks and its own look.
 */
export default function AssignmentForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const item = params.get('item');                 // a waiting task, when owf sent us from one
  const instance = params.get('instance');
  const processName = params.get('process');       // a start event, when it is a process starting
  const startNodeId = params.get('start');
  const returnTo = params.get('returnTo');

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [task, setTask] = useState(null);          // the waiting task, when there is one
  const [form, setForm] = useState({ employeeId: '', projectId: '', role: '', allocation: '', startDate: '', endDate: '' });
  const [problem, setProblem] = useState('');
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(true);

  // HR's own lists, for the pickers
  useEffect(() => {
    fetch('/api/hr/employees').then(r => r.json()).then(setEmployees).catch(() => setEmployees([]));
    fetch('/api/hr/projects').then(r => r.json()).then(setProjects).catch(() => setProjects([]));
  }, []);

  // the task, as the person: its data fills the form, so a step opened twice shows what was entered
  useEffect(() => {
    if (!item) return setReading(false);
    (async () => {
      try {
        const r = await fetch(`/api/v3/tasks/${encodeURIComponent(item)}`);
        const answer = await r.json();
        if (!r.ok) setProblem(answer?.error?.message ?? `This task could not be read (${r.status})`);
        else {
          setTask(answer);
          const data = answer.data ?? {};
          setForm(f => ({
            ...f,
            employeeId: data.employeeId ?? '', projectId: data.projectId ?? '', role: data.role ?? '',
            allocation: data.allocation ?? '', startDate: data.startDate ?? '', endDate: data.endDate ?? '',
          }));
        }
      } catch {
        setProblem('The workflow could not be reached.');
      } finally {
        setReading(false);
      }
    })();
  }, [item]);

  const set = field => e => setForm({ ...form, [field]: e.target.value });

  /** HR's own checks, before the workflow is told anything. */
  const wrong = useMemo(() => {
    if (!form.employeeId) return 'Choose an employee.';
    if (!form.projectId) return 'Choose a project.';
    if (!form.role.trim()) return 'Give the role.';
    const allocation = Number(form.allocation);
    if (!(allocation > 0 && allocation <= 100)) return 'Allocation is a percentage from 1 to 100.';
    if (form.startDate && form.endDate && form.endDate < form.startDate) return 'The end date is before the start date.';
    return '';
  }, [form]);

  const leave = () => navigate(returnTo && returnTo.startsWith('/') ? returnTo : '/assignments');

  async function submit(e) {
    e.preventDefault();
    if (wrong) return setProblem(wrong);
    setProblem('');
    setBusy(true);
    // what the process is given: the form's own values, named as the model's data expects them
    const data = { ...form, allocation: Number(form.allocation) };
    try {
      const where = item
        ? `/api/v3/tasks/${encodeURIComponent(item)}/complete`
        : `/api/v3/processes/${encodeURIComponent(processName ?? 'Assign Employee')}/start`;
      const body = item ? { data } : { data, ...(startNodeId ? { startNodeId } : {}) };
      const r = await fetch(where, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const answer = await r.json().catch(() => ({}));
      if (!r.ok) {
        setProblem(answer?.error?.message ?? `The workflow refused this (${r.status})`);
        return;
      }
      // the To do panel reads its tasks again (components/TaskPanel.jsx)
      window.dispatchEvent(new Event('workflow-changed'));
      leave();
    } catch {
      setProblem('The workflow could not be reached.');
    } finally {
      setBusy(false);
    }
  }

  if (reading) return <div className="page-body"><p>Reading the task…</p></div>;

  const field = (label, control) => <div className="form-group"><label>{label}</label>{control}</div>;

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>{task?.name || 'Assign an employee'}</h1>
            <p>
              {item
                ? <>A step of <b>{task?.processName ?? 'a workflow'}</b>, on HR's own form: completing it moves the workflow on.</>
                : <>Starting <b>{processName ?? 'Assign Employee'}</b> from HR's own form.</>}
            </p>
          </div>
        </div>
      </div>

      {problem && <div className="login-error">{problem}</div>}

      <form className="card" onSubmit={submit}>
        {field('Employee',
          <select required value={form.employeeId} onChange={set('employeeId')}>
            <option value="">Select…</option>
            {employees.map(e => <option key={e.employeeId} value={e.employeeId}>{e.firstName} {e.lastName} — {e.jobTitle}</option>)}
          </select>)}
        {field('Project',
          <select required value={form.projectId} onChange={set('projectId')}>
            <option value="">Select…</option>
            {projects.map(pr => <option key={pr.projectId} value={pr.projectId}>{pr.name}</option>)}
          </select>)}
        {field('Role', <input required value={form.role} onChange={set('role')} placeholder="Senior Consultant" />)}
        {field('Allocation %', <input required type="number" min="1" max="100" value={form.allocation} onChange={set('allocation')} />)}
        <div className="form-row">
          {field('Start date', <input type="date" value={form.startDate} onChange={set('startDate')} />)}
          {field('End date', <input type="date" value={form.endDate} onChange={set('endDate')} />)}
        </div>

        <div className="form-actions">
          <button className="btn" type="button" onClick={leave} disabled={busy}>Cancel</button>
          <button className="btn btn-primary" type="submit" disabled={busy || !!wrong} title={wrong || undefined}>
            {busy ? 'Working…' : item ? 'Complete this step' : 'Start the assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}
