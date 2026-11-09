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
            // the item of this element with this seq; a seq can be another element's (a test instance, a loop)
            const atSeq = bySeq[Number(m[1])];
            const item = atSeq && atSeq.elementId === m[3] ? atSeq : byId[m[3]];
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

/** An entry the engine logs as JSON: {"type":"execution",...} opens an operation, {"type":"outcome",...} says what it did. */
const entryOf = (l, type) => {
    if (!l || l.type !== 'info' || !String(l.message || '').startsWith(`{"type":"${type}"`)) return null;
    try { return JSON.parse(l.message); } catch { return null; }
};

/**
 * The Rationale by step, from the log alone: each operation the engine logged ({"type":"execution"}: Start Process,
 * Invoke Item, Timer Fired, Invoke Event, Retry Item, ...), the rows of rationaleEvents up to the next one, and its
 * outcome as the engine logged it ({"type":"outcome"}: the instance's status, the items whose status changed, what
 * waits). A log from before outcomes were logged has none: `outcome` is null.
 */
export function rationaleSteps(logs, items, startedAt) {
    const byItemId = {};
    (items || []).forEach(i => { byItemId[i.id] = i; });
    const t0 = startedAt ? new Date(startedAt).getTime() : null;
    const elapsed = at => {
        if (!at || t0 == null) return '';
        const s = Math.max(0, (new Date(at).getTime() - t0) / 1000);
        return s < 60 ? s.toFixed(1) + 's' : Math.floor(s / 60) + 'm ' + Math.round(s % 60) + 's';
    };
    const groups: any[] = [];
    let slice = [], step = null;
    const close = () => {
        if (step || slice.length) groups.push({ ...(step ?? { label: '', element: null, data: null }), logs: slice });
        slice = [];
    };
    for (const l of logs || []) {
        const x = entryOf(l, 'execution');
        if (!x) { slice.push(l); continue; }
        close();
        const item = byItemId[x.itemId];
        step = { label: x.label, element: x.startNodeId ?? item?.elementId ?? x.id ?? null, name: item?.name ?? '',
            userName: x.userName ?? null, data: x.inputData ?? null, at: elapsed(l.date) };
    }
    close();
    let before = null;
    return groups.map(g => ({ ...g, events: rationaleEvents(g.logs, items, startedAt) }))
        .filter(g => g.label || g.events.length)
        .map((g, n) => {
            const outcomes = g.logs.map(l => entryOf(l, 'outcome')).filter(Boolean);
            // the operation's outcome: its last save's; what it changed, from all its saves
            const outcome = outcomes.length ? { status: outcomes.at(-1).status, waiting: outcomes.at(-1).waiting,
                changed: [...new Map(outcomes.flatMap(o => o.changed).map(i => [i.id, i])).values()] } : null;
            const statusBefore = before;
            if (outcome) before = outcome.status;
            const { logs: _, ...rest } = g;
            return { ...rest, n: n + 1, outcome, statusBefore };
        });
}
