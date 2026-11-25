import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Who is signed in to the HR application (its own sign-in: server/userManager.js), for every page.
const Auth = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined: not known yet; null: nobody

  // what the workflow pages let this user do (BPMN Server's /api/v3/me: design, administer), asked again for each
  // user; none known (no BPMN Server behind these pages), only their own work
  const [may, setMay] = useState(NOTHING);

  useEffect(() => {
    fetch('/api/hr/session').then(r => (r.ok ? r.json() : null)).then(setUser, () => setUser(null));
  }, []);

  useEffect(() => {
    setMay(NOTHING);
    if (!user) return;
    let current = true;
    fetch('/api/v3/me').then(r => (r.ok ? r.json() : null)).then(
      // environment: the server's (APP_ENV, APP_ENV_LABEL, READ_ONLY, restrictions), for the layout's badge;
      // aiLink: a link for their AI agent (the AI Agents add-on on)
      me => current && setMay({ known: true, design: !!me?.may?.design, administer: !!me?.may?.administer, aiLink: !!me?.may?.aiLink, environment: me?.environment ?? null }),
      () => current && setMay({ ...NOTHING, known: true }));
    return () => { current = false; };
  }, [user?.userName, user?.role]);

  async function signIn(userName, password, returnTo) {
    const r = await fetch('/api/hr/session', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userName, password, returnTo }),
    });
    const answer = await r.json();
    if (!r.ok) throw new Error(answer.error || 'Not signed in');
    setUser(answer.user);
    return answer;
  }

  /** Signing out of the HR application signs out of the workflow pages too: they share its session. */
  async function signOut() {
    await fetch('/api/hr/session', { method: 'DELETE' });
    setUser(null);
  }

  return <Auth.Provider value={{ user, setUser, signIn, signOut, may }}>{children}</Auth.Provider>;
}

/** known: the workflow server has answered (or could not) */
const NOTHING = { known: false, design: false, administer: false, aiLink: false, environment: null };

// May this user open a workflow page: src/workflowAccess.js, where a test checks it
export { mayOpenWorkflow } from './workflowAccess.js';

export const useAuth = () => useContext(Auth);

/** The pages that need someone signed in: anyone else goes to the sign-in page, and back here after. */
export function RequireUser({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (user === undefined) return null;
  // the home page for whoever arrives at the start; the sign-in, and back, for a page asked for
  if (!user && location.pathname === '/') return <Navigate to="/welcome" replace />;
  if (!user) return <Navigate to={`/login?returnTo=${encodeURIComponent('/hr' + location.pathname + location.search)}`} replace />;
  return children;
}

export const isHrAdmin = user => user?.role === 'HR Administrator';
