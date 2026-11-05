/*
 * The Rationale: the run as it happened, from an instance's log, in its order: a row for each event of an item (started,
 * waits, ended, taken, ...) and for each decision (why a flow was taken, what a gateway chose, why a join waited). Its
 * columns are the items': the element's id, name and type. The instance page and the editor's Test tab show it.
 */
const ACTION = /^\{"seq":(\d+),"type":'([^']*)',"id":'([^']*)',"action":'([^']*)'\}$/;
const WORDS = { Started: 'started', Waiting: 'waits', Arrived: 'a branch arrived', Ended: 'ended', Taken: 'taken', Aborted: 'aborted', Cancelled: 'cancelled' };

const whyOf = d => d.action ? (String(d.message || '').split('\nwhy:\n')[1] || '').replace(/^ {4}/gm, '') : String(d.message || '');

export function rationaleEvents(logs, items, startedAt) {
    const bySeq = {}, byId = {};
    (items || []).forEach(i => { bySeq[i.seq] = i; if (!byId[i.elementId]) byId[i.elementId] = i; });
    // a decision's element, from its label ("flow 'yes' (ToApprove)", "gateway gateway_1") when it has no item
    const fromLabel = label => {
        const id = (/\(([^()]+)\)$/.exec(label || '') || /(\S+)$/.exec(label || '') || [])[1];
        const item = byId[id];
        return { id, name: item ? item.name : (/'([^']*)'/.exec(label || '') || [])[1], type: item ? item.type : /^flow /.test(label || '') ? 'bpmn:SequenceFlow' : '' };
    };
    const t0 = startedAt ? new Date(startedAt).getTime() : null;
    const elapsed = at => {
        if (!at || t0 == null) return '';
        const s = Math.max(0, (new Date(at).getTime() - t0) / 1000);
        return s < 60 ? s.toFixed(1) + 's' : Math.floor(s / 60) + 'm ' + Math.round(s % 60) + 's';
    };
    const events: any[] = [];
    (logs || []).forEach(l => {
        const m = l && l.type === 'info' && ACTION.exec(String(l.message || ''));
        if (m) {
            const item = bySeq[Number(m[1])] || byId[m[3]];
            let word = WORDS[m[4]] || m[4].toLowerCase();
            if (m[4] === 'Ended' && item && /UserTask/.test(item.type)) word = 'completed' + (item.userName ? ' by ' + item.userName : '');
            // waiting as it starts: one row, "started · waits"
            const startedRow = m[4] === 'Waiting' && [...events].reverse().find(e => e.seq === Number(m[1]) && e.raw !== 'decision');
            if (startedRow && startedRow.raw === 'Started') { startedRow.word += ' · waits'; startedRow.raw = 'Waiting'; return; }
            events.push({ id: m[3], name: item ? item.name : '', type: m[2], seq: Number(m[1]), at: elapsed(l.date), word, raw: m[4], decisions: [] });
        }
        else if (l && l.type === 'decision')
            events.push({ ...fromLabel(l.element), seq: l.seq, at: elapsed(l.date), word: '', raw: 'decision',
                decisions: [{ action: l.action, not: /^not taken|takes no flow/.test(l.action), why: whyOf(l) }] });
    });
    return events;
}
