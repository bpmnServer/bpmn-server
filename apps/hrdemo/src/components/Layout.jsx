import React, { useEffect, useState } from 'react';
import TaskPanel from './TaskPanel';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, isHrAdmin } from '../auth';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { section: 'People' },
  { to: '/employees', label: 'Employees', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { to: '/reviews', label: 'Performance Reviews', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { section: 'Projects' },
  { to: '/clients', label: 'Clients', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { to: '/projects', label: 'Projects', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
  { to: '/assignments', label: 'Assignments', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> },
  // BPMN Server's pages, in the HR layout (pages/Workflow.jsx)
  { section: 'Workflow' },
  { to: '/workflow', label: 'Workbench', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 12h5m0 0V5h5m-5 7v7h5"/></svg> },
  { to: '/workflow/dashboard', label: 'My Work', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  { to: '/workflow/dashboard/design', label: 'Design', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg> },
  { to: '/workflow/dashboard/admin', label: 'Administration', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.2 4.2l2.9 2.9M16.9 16.9l2.9 2.9M1 12h4M19 12h4M4.2 19.8l2.9-2.9M16.9 7.1l2.9-2.9"/></svg> },
];

// for HR Administrators: who may sign in
const adminItems = [
  { section: 'Administration' },
  { to: '/users', label: 'Users', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/></svg> },
];

// the owf pages are under /workflow; a link is active on its own page only, but for the HR pages' sections
const exact = to => to === '/' || to === '/workflow' || to === '/workflow/dashboard';

export default function Layout({ children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const items = isHrAdmin(user) ? [...navItems, ...adminItems] : navItems;
  const [panelOpen, setPanelOpen] = useState(false);
  // on a phone: the menu is a drawer, opened from the top bar, closed when a page opens
  const [menuOpen, setMenuOpen] = useState(false);
  const [waiting, setWaiting] = useState(null);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location]);
  async function leave() {
    await signOut();
    navigate('/login');
  }
  return (
    <div className={`app-layout${menuOpen ? ' menu-open' : ''}`}>
      <header className="mobile-bar">
        <button className="mobile-bar-button" onClick={() => setMenuOpen(o => !o)} aria-label="Menu" aria-expanded={menuOpen}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span className="mobile-bar-title">HR System</span>
        {waiting !== null && (
          <button className="mobile-bar-button mobile-bar-tasks" onClick={() => window.dispatchEvent(new Event('task-panel-toggle'))} aria-label="Tasks to do">
            To do{waiting > 0 && <span className="task-count">{waiting}</span>}
          </button>
        )}
      </header>
      {menuOpen && <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          HR System
        </div>
        <nav className="sidebar-nav">
          {items.map((item, i) =>
            item.section
              ? <div key={i} className="sidebar-section">{item.section}</div>
              : item.href
              ? <a key={item.href} href={item.href}>{item.icon}{item.label}</a>
              : <NavLink key={item.to} to={item.to} end={exact(item.to)} className={({ isActive }) => isActive ? 'active' : ''}>
                  {item.icon}{item.label}
                </NavLink>
          )}
        </nav>
        <div className="sidebar-user">
          <NavLink to="/account" className="sidebar-user-name">
            <span>{user.name}</span>
            <small>{user.role}</small>
          </NavLink>
          <button className="sidebar-signout" onClick={leave}>Sign out</button>
        </div>
      </aside>
      <main className={`main-content${panelOpen ? ' with-tasks' : ''}`}>
        {children}
      </main>
      <TaskPanel onToggle={setPanelOpen} onCount={setWaiting} />
    </div>
  );
}
