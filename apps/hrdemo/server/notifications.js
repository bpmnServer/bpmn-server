// The HR application's notifications: what the workflows' notification policies sent it to deliver
// (workflow/delegates/appDelegate.ts, notify), kept in its own database, the SQLite file of its users (HR_DATA, default
// data/hr.sqlite), table `notifications`: its inbox, by whom each is to. BPMN Server keeps its own record of them too
// (wf_notifications: the Notifications page), with what was not delivered.
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export class HrNotifications {
  constructor(file = process.env.HR_DATA || path.join(import.meta.dirname, '..', 'data', 'hr.sqlite')) {
    if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
    this.db = new DatabaseSync(file);
    // the HR server and the workflows (the engine may run in a process of its own) write to the same file
    this.db.exec(`
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, createdAt TEXT NOT NULL, recipients TEXT NOT NULL,
        subject TEXT, message TEXT, channel TEXT, event TEXT, processName TEXT, instanceId TEXT, elementId TEXT,
        policy TEXT, rule INTEGER, readAt TEXT);
      CREATE INDEX IF NOT EXISTS notifications_createdAt ON notifications (createdAt);`);
  }

  /** A notification as the engine gives it (INotification): kept once, by its id. */
  save(n) {
    this.db.prepare(`INSERT OR IGNORE INTO notifications (id, createdAt, recipients, subject, message, channel, event,
        processName, instanceId, elementId, policy, rule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      String(n.id), new Date(n.createdAt ?? Date.now()).toISOString(), JSON.stringify(n.to ?? []), n.subject ?? '',
      n.message ?? '', n.channel ?? null, n.event ?? null, n.instanceName ?? null, n.instanceId ?? null,
      n.elementId ?? null, n.policy ?? null, n.rule ?? null);
  }

  /** The newest first, to any of `whom` (a user's name and groups); every one without. */
  list(whom = null, limit = 50) {
    const rows = this.db.prepare('SELECT * FROM notifications ORDER BY createdAt DESC').all();
    const wanted = whom && new Set(whom);
    return rows.map(r => ({ ...r, to: JSON.parse(r.recipients) }))
      .filter(n => !wanted || n.to.some(t => wanted.has(t)))
      .slice(0, limit)
      .map(({ recipients, ...n }) => n);
  }
}
