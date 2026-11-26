import React from 'react';

export default function UtilBar({ value }) {
  const pct = Math.min(value, 100);
  let cls = 'low';
  if (value >= 80) cls = 'high';
  else if (value >= 50) cls = 'mid';
  if (value > 100) cls = 'over';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span className="util-bar-track">
        <span className={`util-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: value > 100 ? 'var(--color-danger)' : 'var(--color-text)' }}>
        {value}%
      </span>
    </span>
  );
}
