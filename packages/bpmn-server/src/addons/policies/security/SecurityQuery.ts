/**
 * A security policy as a condition of the store's query (docs/design/security-policies.md#lists-and-paging): the
 * cases a user may see, narrowed in the database before the policy is asked for each. The condition is a superset:
 * every case a rule could let them see meets it; the policy still decides each case it reads, so narrowing never shows
 * one more, it only reads fewer.
 *
 * From each rule that may grant `see` (its output a level, or an expression): its tests on the user, worked out now
 * (one that fails: the rule can't apply); its test on a task (a list asks of the case: such a rule doesn't apply); and
 * its test on an actor (`actors.initiator` is the user, ...), as a condition on the case's items. A test it can't
 * read leaves the rule wider, never narrower. A rule that may grant any case: no narrowing for that policy.
 */
import { DMNParser } from '../../../dmn/DMNParser.js';
import { DMNEngine } from '../../../dmn/DMNEngine.js';

export interface ISeeUser { userName: string; userGroups: string[]; unrestricted?: boolean }

/** A policy's narrowing: null, any case may be seen; [] none; else the case conditions, any of which. */
export type SeeConditions = null | object[];

const blank = (cell: string) => { const t = String(cell ?? '').trim(); return t === '' || t === '-'; };
/** A cell's quoted literals ("a", "b"), or null when it is anything else. */
function literals(cell: string): string[] | null {
    const t = String(cell).trim();
    const parts = t.split(',').map(p => p.trim());
    return parts.every(p => /^"[^"]*"$/.test(p)) ? parts.map(p => p.slice(1, -1)) : null;
}
/** A see level a rule's output grants: true, false (none, deny, nothing said), or true for an expression (it may). */
function grants(cell: string): boolean {
    const t = String(cell ?? '').trim();
    if (t === '' || t === '-' || t === 'null') return false;
    const lit = literals(t);
    if (!lit) return true;
    return lit.some(v => v === 'summary' || v === 'full');
}

/** The items' conditions for "the actor `name` is `who`" (the user, or a name the rule says): any of them. */
function actorConditions(name: string, who: string, user: ISeeUser): object[] {
    switch (name) {
        // who started it: the start event's user, else the first item's, else the instance's
        case 'initiator': return [{ 'items.userName': who }, { userName: who }];
        case 'assignee': return [{ 'items.assignee': who }];
        // offered to them: by name, or (the user's own test) to one of their groups
        case 'candidate': return [{ 'items.candidateUsers': who }, { 'items.candidateGroups': { $in: who === user.userName ? [who, ...user.userGroups] : [who] } }];
        // a model's own actor (owf:actor): who completed one of its elements
        default: return [{ 'items.userName': who }];
    }
}

/** One policy table's narrowing for this user. */
export async function seeConditionsOfTable(file: string, user: ISeeUser): Promise<SeeConditions> {
    let table;
    try {
        const definitions = await DMNParser.loadFile(file);
        table = DMNEngine.topDecision(definitions)?.table;
    }
    catch { return null; }
    if (!table) return null;
    const seeAt = table.outputs.findIndex(o => o.name === 'see');
    if (seeAt < 0) return [];                    // it says nothing of seeing: grants none
    const conditions: object[] = [];
    for (const rule of table.rules) {
        if (!grants(rule.outputEntries[seeAt])) continue;
        let applies = true;
        let caseCondition: object[] | null = null;
        table.inputs.forEach((input, i) => {
            const expression = String(input.expression ?? '').trim();
            const cell = rule.inputEntries[i];
            if (!applies || blank(cell)) return;
            const lit = literals(cell);
            if (expression === 'task') {
                // a list asks of the case, not a task: a rule that tests one doesn't apply
                if (!/\bnull\b/.test(cell)) applies = false;
            }
            else if (expression === 'user.userName') {
                if (lit && !lit.includes(user.userName)) applies = false;
            }
            else if (expression === 'user.userGroups') {
                if (lit && !lit.some(g => user.userGroups.includes(g))) applies = false;
            }
            else if (/^actors\.\w+$/.test(expression) && !caseCondition) {
                const name = expression.slice('actors.'.length);
                const who = String(cell).trim() === 'user.userName' ? [user.userName] : lit;
                // one actor's test narrows; the others, left out, only widen it
                if (who?.length) caseCondition = who.flatMap(w => actorConditions(name, w, user));
            }
            // anything else (data, the application's facts, an expression): read as it may hold
        });
        if (!applies) continue;
        if (!caseCondition) return null;         // it may grant any case
        conditions.push(...caseCondition);
    }
    return conditions;
}

/** The built-in default's narrowing (SecurityPolicy.builtInDefault): designers any case; the others, theirs. */
export function builtInSeeConditions(user: ISeeUser): SeeConditions {
    if ((user.userGroups ?? []).includes('DESIGNER')) return null;
    return [
        { 'items.userName': user.userName }, { userName: user.userName },
        { 'items.assignee': user.userName }, { 'items.candidateUsers': user.userName },
        { 'items.candidateGroups': { $in: [user.userName, ...(user.userGroups ?? [])] } },
    ];
}

/**
 * The store's condition for the cases this user may see, across the models: each policy's narrowing for the models
 * that name it, the default's for every case (a superset for the others). null: no narrowing (any case may be seen).
 */
export function combineSeeConditions(byPolicy: { models: string[]; conditions: SeeConditions }[], fallback: SeeConditions): object | null {
    if (fallback === null) return null;         // the default may grant any case of any model
    const branches: object[] = [];
    for (const { models, conditions } of byPolicy) {
        if (!models.length || (conditions && !conditions.length)) continue;
        branches.push(conditions === null ? { name: { $in: models } } : { name: { $in: models }, $or: conditions });
    }
    branches.push(...fallback);
    return branches.length ? { $or: branches } : { id: { $in: [] } };
}
