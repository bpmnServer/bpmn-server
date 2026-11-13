import { SecurityPolicy, FULL_ACCESS, roleNames } from '../index.js';
import { ownUsers } from '../userAccess/UserManager.js';
import { isAdminGroups } from '../userAccess/roles.js';
import type { IAccess, ISecurityUser, SecureUser } from '../index.js';

/*
 * Security policies, as the pages and API v3 ask them (docs/design/security-policies.md, engine/SecurityPolicy.ts):
 * who sees a case, which of its data, and whether they may claim, complete, restart or fire its start events. Off
 * (every answer full, and today's rules hold) until the application has `policies/security/` or
 * SECURITY_POLICY=default.
 */

/** A refused action: 403, with the rule that denied it. */
export class PolicyDenied extends Error {
    readonly status = 403;
    readonly code = 'POLICY_DENIED';
    constructor(action: string, access: IAccess) {
        const denying = access.rules.find(r => /^deny$/i.test(String(r.outputs?.[action] ?? '')));
        super(denying ? `Not allowed to ${action}: policy ${denying.policy}, rule ${denying.rule}` : `Not allowed to ${action}: no policy rule allows it`);
    }
}

/** A user as a policy sees them: administrators, the system, and security turned off are not asked. */
export function securityUser(user: SecureUser): ISecurityUser {
    return { userName: user?.userName, userGroups: user?.userGroups ?? [], unrestricted: !user || user.isAdmin() };
}

export class CaseAccess {
    private _policy: SecurityPolicy;
    constructor(readonly server) { }
    /** The models folder's policies. */
    get policy(): SecurityPolicy {
        const folder = this.server.configuration.definitionsPath;
        // the application's delegate: its decisionContext hook adds its facts (engine/DecisionContext.ts)
        if (this._policy?.definitionsPath !== folder) this._policy = new SecurityPolicy(folder, this.server.appDelegate);
        return this._policy;
    }
    /** Whether security policies decide here. */
    get on(): boolean { return this.policy.on; }

    /** What this user may do with the case, or with one of its tasks (`task.elementId`). */
    async decide(user: SecureUser, instance, task?: { elementId: string; itemId?: string }): Promise<IAccess> {
        if (!this.on) return FULL_ACCESS;
        const errors: string[] = [];
        const access = await this.policy.decide(securityUser(user), instance, task, errors);
        for (const error of errors) this.server.logger?.log?.(`security policy: ${error}`);
        return access;
    }

    /** The cases this user sees (`see` not none), as they were given. */
    async seen<T>(user: SecureUser, instances: T[]): Promise<T[]> {
        if (!this.on) return instances;
        const shown = [];
        for (const instance of instances)
            if ((await this.decide(user, instance)).see !== 'none') shown.push(instance);
        return shown;
    }

    /** The cases of these tasks, by id: what a policy decides on (their items, data and model). */
    async casesOf(items: any[]): Promise<Map<string, any>> {
        const ids = [...new Set(items.map(i => i.instanceId).filter(Boolean))];
        if (!ids.length) return new Map();
        const found = await this.server.dataStore.findInstances({ id: { $in: ids } }, { projection: { id: 1, name: 1, data: 1, items: 1, tokens: 1, userName: 1 } });
        return new Map(found.map(i => [i.id, i]));
    }

    /** The waiting tasks this user may complete, as their cases' policies say (a task they are refused is left out). */
    async tasksAllowed<T extends { id?: string; instanceId?: string; elementId?: string }>(user: SecureUser, items: T[]): Promise<T[]> {
        if (!this.on) return items;
        const cases = await this.casesOf(items);
        const allowed = [];
        for (const item of items)
            if ((await this.decide(user, cases.get(item.instanceId), { elementId: item.elementId, itemId: item.id })).complete !== false) allowed.push(item);
        return allowed;
    }

    /** A case's data as this access lets them read it; for a task, its own form's fields too. */
    data(instance, access: IAccess, taskElementId?: string): Record<string, any> {
        return this.policy.data(instance, access, taskElementId);
    }

    /**
     * Assigning the tasks a query finds (`assignment`: their assignee, candidates, dates): a person taking a task as
     * its assignee and nothing else is claiming it; any other change of who works on it is `assign`. Throws
     * PolicyDenied when a case's policy refuses it; without a rule, today's rule holds (the engine's: a part in it).
     */
    async requireAssignment(user: SecureUser, query, assignment: Record<string, any> = {}) {
        if (!this.on || !query) return;
        const who = ['assignee', 'candidateUsers', 'candidateGroups'].filter(f => f in assignment);
        if (!who.length) return;        // its dates, its priority: not who works on it
        const claim = who.length === 1 && who[0] === 'assignee' && assignment.assignee === user?.userName;
        const items = (await this.server.dataStore.findItems(query)).filter(i => i.status === 'wait');
        const cases = await this.casesOf(items);
        for (const item of items)
            CaseAccess.require(await this.decide(user, cases.get(item.instanceId), { elementId: item.elementId, itemId: item.id }), claim ? 'claim' : 'assign', true);
    }

    /**
     * The instance page's Assignment and access, and API v3's GET /instances/{id}/access: for each of its user tasks,
     * after the fact, who it was offered to, its assignee, what decided it (a policy's rule, or who reassigned it),
     * its assignment as the log tells it (offered, claimed, reassigned) and who completed it; and, while security
     * policies are on, the reverse of the case's policy (SecurityPolicy.whoMay): who may see the case, its data, and
     * who may claim, complete and assign each waiting task. `directory`: the people and roles to ask about.
     */
    async instanceAccess(instance, directory: { users?: { userName: string; userGroups?: string[] }[]; roles?: string[]; admins?: string[] } = {}) {
        const items: any[] = instance?.items ?? [];
        const logs: any[] = instance?.logs ?? [];
        const list = value => (Array.isArray(value) ? value : value == null || value === '' ? [] : String(value).split(',')).map(v => String(v).trim()).filter(Boolean);
        const tasks = items.filter(i => i.type === 'bpmn:UserTask').sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0)).map(item => ({
            seq: item.seq, elementId: item.elementId, name: item.name, status: item.status,
            assignee: item.assignee ?? null, candidateUsers: list(item.candidateUsers), candidateGroups: list(item.candidateGroups),
            decidedBy: item.assignment?.policy ? `policy ${item.assignment.policy}, rule ${item.assignment.rule}`
                : item.assignment?.userName ? `reassigned by ${item.assignment.userName}` : null,
            // the Rationale's entries on its assignment: offered, assigned, claimed, reassigned, not assigned by its policy
            history: logs.filter(l => l?.type === 'decision' && l.seq === item.seq && /^is (offered|assigned|claimed|reassigned|not assigned)/.test(l.action ?? ''))
                .map(l => ({ action: l.action, why: (String(l.message || '').split('\nwhy:\n')[1] || '').replace(/^ {4}/gm, '').trim() })),
            completedBy: item.status === 'end' ? item.userName ?? null : null,
            who: [] as any[],
        }));
        if (!this.on) return { on: false, cases: [], tasks };
        const answers = await this.policy.whoMay(instance, { ...directory, users: (directory.users ?? []).map(u => ({ userName: u.userName, userGroups: u.userGroups ?? [] })) });
        const dataOf = (access: IAccess) => access.data.all ? 'all' : [access.data.forms ? 'what forms entered' : null, ...access.data.paths].filter(Boolean).join(', ') || 'none';
        const rulesOf = (rules: IAccess['rules']) => [...new Set(rules.map(r => `${r.policy} ${r.rule}`))].join('; ');
        const cases = answers.map(a => ({ who: a.who, see: a.access.see, data: a.access.see === 'none' ? '' : dataOf(a.access),
            restart: a.access.restart, events: a.access.events, rules: rulesOf(a.access.rules) }));
        for (const task of tasks) {
            if (task.status !== 'wait') continue;
            task.who = answers.map(a => ({ who: a.who, ...a.tasks.find(t => t.seq === task.seq) }))
                .map(t => ({ who: t.who, offered: t.offered, claim: t.claim, complete: t.complete, assign: t.assign, rules: rulesOf(t.rules ?? []) }));
        }
        return { on: true, cases, tasks };
    }

    /** Throws PolicyDenied unless the action is allowed; `byDefault`: what it is without a rule (claim, complete, assign). */
    static require(access: IAccess, action: 'claim' | 'complete' | 'assign' | 'restart' | 'events', byDefault = false) {
        // a task they may not complete is not theirs to take either, unless a rule allows claiming it
        if (action === 'claim' && access.complete === false && access.claim !== true) throw new PolicyDenied('complete', access);
        const allowed = access[action];
        if (allowed === false || (allowed !== true && !byDefault)) throw new PolicyDenied(action, access);
    }
}

/**
 * The people and roles "who may" asks about (CaseAccess.instanceAccess): the user directory (bpmn-web's own users, or
 * the application's user manager's listUsers), the roles of roles.json, and who of them are administrators.
 */
export async function accessDirectory(req, server): Promise<{ users: { userName: string; userGroups?: string[] }[]; roles: string[]; admins: string[] }> {
    const manager = req?.app?.get?.('userManager');
    let users: any[] = [];
    try {
        const own = ownUsers(manager);
        users = own ? await own.listUsers() : typeof manager?.listUsers === 'function' ? await manager.listUsers() : [];
    }
    catch { users = []; }
    users = (users ?? []).filter(u => u?.userName).map(u => ({ userName: String(u.userName), userGroups: [...(u.userGroups ?? [])].map(String) }));
    let roles: string[] = [];
    try { roles = roleNames(server.configuration.definitionsPath) ?? []; } catch { roles = []; }
    const admins = users.filter(u => isAdminGroups(u.userGroups)).map(u => u.userName);
    return { users, roles, admins };
}
