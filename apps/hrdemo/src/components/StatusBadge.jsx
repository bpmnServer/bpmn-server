import React from 'react';

const displayLabels = {
  ExceedsExpectations: 'Exceeds Expectations',
  MeetsExpectations: 'Meets Expectations',
  NeedsImprovement: 'Needs Improvement',
  SelfAssessmentDue: 'Self-Assessment Due',
  InReview: 'In Review',
  InProgress: 'In Progress',
  OnLeave: 'On Leave',
  OnHold: 'On Hold',
  NotStarted: 'Not Started',
  FullTime: 'Full Time',
  PartTime: 'Part Time',
};

export default function StatusBadge({ value }) {
  if (!value) return <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>—</span>;
  const cls = 'badge badge-' + value.toLowerCase().replace(/\s/g, '');
  const label = displayLabels[value] || value;
  return <span className={cls}>{label}</span>;
}
