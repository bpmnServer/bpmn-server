import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Who is signed in to the HR application (its own sign-in: server/userManager.js), for every page.
const Auth = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined: not known yet; null: nobody

  useEffect(() => {
    fetch('/api/hr/session').then(r => (r.ok ? r.json() : null)).then(setUser, () => setUser(null));
  }, []);

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

  return <Auth.Provider value={{ user, setUser, signIn, signOut }}>{children}</Auth.Provider>;
}

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
