import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/hr/dashboard').then(r => r.json()).then(setData);
  }, []);

  if (!data) return <div className="page-body">Loading...</div>;

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Workforce overview and key metrics</p>
      </div>
      <div className="page-body">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-label">Active Employees</div>
            <div className="stat-value">{data.activeEmployees}</div>
            <div className="stat-sub">{data.totalEmployees} total</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">Active Projects</div>
            <div className="stat-value">{data.activeProjects}</div>
            <div className="stat-sub">{data.activeClients} active clients</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-label">Avg Utilization</div>
            <div className="stat-value">{data.avgUtilization}%</div>
            <div className="stat-sub">across assigned staff</div>
          </div>
          <div className="stat-card info">
            <div className="stat-label">Pending Reviews</div>
            <div className="stat-value">{data.pendingReviews}</div>
            <div className="stat-sub">require action</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header">Headcount by Department</div>
            <div className="card-body">
              {data.deptBreakdown.map(d => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 14 }}>{d.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 120, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(d.count / data.activeEmployees) * 100}%`, background: 'var(--color-primary)', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: 'right' }}>{d.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">Performance Rating Distribution</div>
            <div className="card-body">
              {data.ratingDist.filter(r => r.count > 0).map(r => {
                const colors = { Exceptional: '#16a34a', ExceedsExpectations: '#059669', MeetsExpectations: '#2563eb', NeedsImprovement: '#d97706', Unsatisfactory: '#dc2626' };
                const labels = { ExceedsExpectations: 'Exceeds Expectations', MeetsExpectations: 'Meets Expectations', NeedsImprovement: 'Needs Improvement' };
                return (
                  <div key={r.rating} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors[r.rating] || '#94a3b8' }} />
                      {labels[r.rating] || r.rating}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{r.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24 }} className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Quick Links
          </div>
          <div className="card-body" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/employees" style={{ padding: '10px 20px', background: 'var(--color-primary)', color: '#fff', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>View Employees</Link>
            <Link to="/projects" style={{ padding: '10px 20px', background: 'var(--color-surface)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>View Projects</Link>
            <Link to="/reviews" style={{ padding: '10px 20px', background: 'var(--color-surface)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>View Reviews</Link>
          </div>
        </div>
      </div>
    </>
  );
}
