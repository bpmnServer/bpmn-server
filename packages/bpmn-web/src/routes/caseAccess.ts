import { SecurityPolicy, FULL_ACCESS } from '../index.js';
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
        if (this._policy?.definitionsPath !== folder) this._policy = new SecurityPolicy(folder);
        return this._policy;
    }
    /** Whether security policies decide here. */
    get on(): boolean { return this.policy.on; }

    /** What this user may do with the case, or with one of its tasks (`task.elementId`). */
    async decide(user: SecureUser, instance, task?: { elementId: string }): Promise<IAccess> {
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
        const found = await this.server.dataStore.findInstances({ id: { $in: ids } }, { projection: { id: 1, name: 1, data: 1, items: 1, userName: 1 } });
        return new Map(found.map(i => [i.id, i]));
    }

    /** The waiting tasks this user may complete, as their cases' policies say (a task they are refused is left out). */
    async tasksAllowed<T extends { instanceId?: string; elementId?: string }>(user: SecureUser, items: T[]): Promise<T[]> {
        if (!this.on) return items;
        const cases = await this.casesOf(items);
        const allowed = [];
        for (const item of items)
            if ((await this.decide(user, cases.get(item.instanceId), { elementId: item.elementId })).complete !== false) allowed.push(item);
        return allowed;
    }

    /** A case's data as this access lets them read it; for a task, its own form's fields too. */
    data(instance, access: IAccess, taskElementId?: string): Record<string, any> {
        return this.policy.data(instance, access, taskElementId);
    }

    /** Throws PolicyDenied unless the action is allowed; `byDefault`: what it is without a rule (claim, complete). */
    static require(access: IAccess, action: 'claim' | 'complete' | 'restart' | 'events', byDefault = false) {
        // a task they may not complete is not theirs to take either, unless a rule allows claiming it
        if (action === 'claim' && access.complete === false && access.claim !== true) throw new PolicyDenied('complete', access);
        const allowed = access[action];
        if (allowed === false || (allowed !== true && !byDefault)) throw new PolicyDenied(action, access);
    }
}
