/**
 * Security policies (docs/design/security-policies.md): who sees a case, which of its data, and what they may do with
 * it and its tasks. A policy is a DMN decision table in the models folder, `policies/security/<name>.dmn.xml`, named by
 * a process (`owf:securityPolicy`) and, for its tasks' actions, by a user task. Every rule that matches counts (hit
 * policy COLLECT) and a denial wins. It reads what every expression reads (docs/design/expressions.md): the user,
 * the instance's actors, the task, the data (a task's: its item's, in its scope); it is asked by the host, on every list
 * and page.
 *
 * `SecurityPolicy` is one models folder's policies; an application may subclass it and override a step (the
 * context the tables read, the built-in default, combining).
 *
 * Off until an application has `policies/security/` or SECURITY_POLICY=default: then today's rule (SecureUser) holds.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DMNEngine } from '../dmn/DMNEngine.js';
import { decisionContext, actorsOf, actorElements, actorNamesOf, dataPathOf } from './DecisionContext.js';
import type { Actor } from './DecisionContext.js';
import { DataHandler } from './DataHandler.js';

export const SECURITY_FOLDER = 'policies/security';
/** The application's default policy, for a process that names none. */
export const DEFAULT_SECURITY_POLICY = 'default';
export const SECURITY_ACTIONS = ['see', 'data', 'claim', 'complete', 'assign', 'restart', 'events'] as const;

/** Who asks: a user name and groups; administrators and the system are not asked (`unrestricted`). */
export interface ISecurityUser {
    userName: string;
    userGroups: string[];
    /** an administrator, the system, or security rules turned off (ENFORCE_SECURITY=false) */
    unrestricted?: boolean;
}

/** One matching rule: the policy, its rule number, what it said. */
export interface IPolicyRule { policy: string; rule: number; outputs: Record<string, any>; }

/** What a person may do with a case, or one of its tasks. */
export interface IAccess {
    /** none: not seen at all; summary: in the lists; full: its page, items and Rationale */
    see: 'none' | 'summary' | 'full';
    /** which of its data: all, what forms entered, these paths (each a whole branch) */
    data: { all: boolean; forms: boolean; paths: string[] };
    /** true: allowed, false: denied, null: as the assignment says (assignee, candidates) */
    claim: boolean | null;
    complete: boolean | null;
    /** giving a task to someone else (its assignee, its candidates): null, as today (those with a part in it) */
    assign: boolean | null;
    restart: boolean;
    events: boolean;
    /** the rules that matched */
    rules: IPolicyRule[];
}

/** Someone the reverse of a policy asks about (whoMay). */
export interface IWho {
    kind: 'administrators' | 'person' | 'role' | 'anyone';
    label: string;
    user?: ISecurityUser;
    /** why they are asked about: how the case names them */
    because?: string;
}

/** What one of them may do with a case, and with each of its waiting user tasks. */
export interface IWhoMay {
    who: IWho;
    access: IAccess;
    tasks: { seq: number; elementId: string; name?: string; offered: boolean; claim: boolean; complete: boolean; assign: boolean; rules: IPolicyRule[] }[];
}

/** What a model says for security: its process's policy, its tasks', the fields its forms enter, its actors (owf:actor). */
export interface IModelSecurity { policy?: string; taskPolicies: Map<string, string>; formFields: Set<string>; taskFields: Map<string, Set<string>>; actors: Map<string, string>; }

/** A task a decision is about: its element, and the item (its scope) when known; else the element's waiting item. */
export interface ISecurityTask { elementId: string; itemId?: string; }

export const FULL_ACCESS: IAccess = Object.freeze({
    see: 'full', data: { all: true, forms: true, paths: [] }, claim: null, complete: null, assign: null, restart: true, events: true, rules: [],
}) as IAccess;

const asList = (value): string[] => (Array.isArray(value) ? value : value == null || value === '' ? [] : String(value).split(','))
    .map(v => String(v ?? '').trim()).filter(Boolean);
const attr = (tag: string, name: string) => new RegExp(`\\s(?:[\\w.-]+:)?${name}\\s*=\\s*"([^"]*)"`).exec(tag)?.[1];

/** The security policies of one models folder. */
export class SecurityPolicy {
    /** models' security facts, by file, while the file is as it was (shared by every instance) */
    private static models = new Map<string, { stamp: string; model: IModelSecurity }>();

    /** `appDelegate`: the application's, for its decisionContext hook (engine/DecisionContext.ts) */
    constructor(readonly definitionsPath: string, readonly appDelegate?: any) { }

    /** Whether this folder's cases are decided by security policies. */
    get on(): boolean {
        if (process.env.SECURITY_POLICY === 'default') return true;
        if (process.env.SECURITY_POLICY === 'off') return false;
        return !!this.definitionsPath && fs.existsSync(path.join(this.definitionsPath, SECURITY_FOLDER));
    }

    /** A policy's file, or null when it isn't there. */
    file(name: string): string | null {
        if (!this.definitionsPath || !name || /[\\/]|\.\./.test(name)) return null;
        const file = path.join(this.definitionsPath, SECURITY_FOLDER, `${name}.dmn.xml`);
        return fs.existsSync(file) ? file : null;
    }

    /** The folder's policies, by name. */
    names(): string[] {
        const folder = this.definitionsPath && path.join(this.definitionsPath, SECURITY_FOLDER);
        if (!folder || !fs.existsSync(folder)) return [];
        return fs.readdirSync(folder).filter(f => /\.dmn\.xml$/i.test(f)).map(f => f.replace(/\.dmn\.xml$/i, '')).sort();
    }

    /** A model's security facts, from its file. */
    model(modelName: string): IModelSecurity {
        const model: IModelSecurity = { taskPolicies: new Map(), formFields: new Set(), taskFields: new Map(), actors: new Map() };
        const file = this.definitionsPath && modelName ? path.join(this.definitionsPath, `${modelName}.bpmn`) : null;
        let stat: fs.Stats;
        try { stat = fs.statSync(file); } catch { return model; }
        const stamp = `${stat.mtimeMs}:${stat.size}`;
        const cached = SecurityPolicy.models.get(file);
        if (cached?.stamp === stamp) return cached.model;
        const xml = fs.readFileSync(file, 'utf8');
        model.actors = actorElements(xml);
        const processTag = /<(?:[\w.-]+:)?process\b[^>]*>/.exec(xml)?.[0];
        if (processTag) model.policy = attr(processTag, 'securityPolicy');
        // each start event's and user task's: its policy, and its form's fields
        for (const m of xml.matchAll(/<(?:([\w.-]+):)?(userTask|startEvent)\b([^>]*?)(\/?)>/g)) {
            const [tag, prefix, kind, tagAttrs, selfClosing] = m;
            const id = attr(' ' + tagAttrs, 'id');
            const policy = attr(' ' + tagAttrs, 'securityPolicy');
            if (id && policy) model.taskPolicies.set(id, policy);
            // its form's fields: inside it, up to its own closing tag
            const fields = new Set<string>();
            if (!selfClosing) {
                const start = m.index + tag.length;
                const end = xml.indexOf(`</${prefix ? prefix + ':' : ''}${kind}>`, start);
                for (const f of xml.slice(start, end < 0 ? start : end).matchAll(/<(?:[\w.-]+:)?formField\b[^>]*\sid\s*=\s*"([^"]*)"/g)) fields.add(f[1]);
            }
            if (id) model.taskFields.set(id, fields);
            fields.forEach(f => model.formFields.add(f));
        }
        SecurityPolicy.models.set(file, { stamp, model });
        return model;
    }

    /** The task's item: by its id, else the element's waiting one, else its latest. */
    private itemOf(instance: any, task?: ISecurityTask): any {
        if (!task) return undefined;
        const items: any[] = instance?.items ?? [];
        return (task.itemId && items.find(i => i.id === task.itemId))
            ?? items.find(i => i.elementId === task.elementId && i.status === 'wait')
            ?? [...items].reverse().find(i => i.elementId === task.elementId);
    }

    /**
     * An instance's actors (engine/DecisionContext.ts), from its items and its model's owf:actor; for a task, those of
     * its item's branch.
     */
    actorsOf(instance: any, task?: ISecurityTask): Record<string, Actor> {
        const item = this.itemOf(instance, task);
        return actorsOf({ instance, elements: this.model(instance?.name).actors, scope: item ? dataPathOf(item, instance?.tokens) : null });
    }

    /**
     * What a person may do with a case (and, with `task`, one of its tasks): every rule of the policies that apply (the
     * process's, else the application's default, else the built-in one; and the task's own), combined. A policy that
     * can't be read decides nothing (its error is in `errors`), so what it would have allowed stays refused.
     */
    async decide(user: ISecurityUser, instance: any, task?: ISecurityTask, errors: string[] = []): Promise<IAccess> {
        if (user.unrestricted) return FULL_ACCESS;
        const model = this.model(instance?.name);
        const context = await this.context(user, instance, task);
        const rules: IPolicyRule[] = [];
        const named = [model.policy || DEFAULT_SECURITY_POLICY];
        const own = task && model.taskPolicies.get(task.elementId);
        if (own && !named.includes(own)) named.push(own);
        for (const name of named) {
            const file = this.file(name);
            if (!file) {
                if (name === DEFAULT_SECURITY_POLICY && !model.policy)
                    rules.push(...this.builtInDefault(user, instance, context.actors).map(r => ({ policy: 'built-in default', ...r })));
                else errors.push(`there is no ${SECURITY_FOLDER}/${name}.dmn.xml`);
                continue;
            }
            try { rules.push(...(await this.ask(file, context)).map(r => ({ policy: name, ...r }))); }
            catch (error) { errors.push(`policy ${name}: ${error.message}`); }
        }
        return this.combine(rules);
    }

    /** A case's data as the access lets a person read it; for a task, its own form's fields too. */
    data(instance: any, access: IAccess, taskElementId?: string): Record<string, any> {
        if (access.data.all) return instance?.data ?? {};
        const model = this.model(instance?.name);
        return this.visibleData(instance?.data ?? {}, access, model.formFields, taskElementId ? model.taskFields.get(taskElementId) : undefined);
    }

    /** These data as the access lets a person read them: what forms entered, these paths, and `ownFields` always. */
    visibleData(data: Record<string, any>, access: IAccess, formFields: Set<string> = new Set(), ownFields: Set<string> = new Set()): Record<string, any> {
        if (!data || typeof data !== 'object') return {};
        if (access.data.all) return data;
        const out: Record<string, any> = {};
        const keep = (pathText: string) => {
            const parts = String(pathText).replace(/^data\./, '').split('.').filter(Boolean);
            if (!parts.length) return;
            let from: any = data, to: any = out;
            for (let i = 0; i < parts.length; i++) {
                if (from == null || typeof from !== 'object' || !(parts[i] in from)) return;
                if (i === parts.length - 1) { to[parts[i]] = from[parts[i]]; return; }
                to = to[parts[i]] ??= {};
                from = from[parts[i]];
            }
        };
        if (access.data.forms) formFields.forEach(keep);
        access.data.paths.forEach(keep);
        ownFields.forEach(keep);
        return out;
    }

    /** The matching rules' answers, combined: any deny wins; else what is allowed; else each action's default. */
    combine(rules: IPolicyRule[]): IAccess {
        const access: IAccess = { see: 'none', data: { all: false, forms: false, paths: [] }, claim: null, complete: null, assign: null, restart: false, events: false, rules };
        const said = (name: string) => rules.map(r => r.outputs?.[name]).filter(v => v !== null && v !== undefined && v !== '');
        const is = (v, word) => String(v).trim().toLowerCase() === word;
        const see = said('see');
        if (!see.some(v => is(v, 'deny')))
            access.see = see.some(v => is(v, 'full')) ? 'full' : see.some(v => is(v, 'summary')) ? 'summary' : 'none';
        const data = said('data');
        if (!data.some(v => is(v, 'deny') || is(v, 'none')))
            for (const v of data) {
                if (Array.isArray(v)) access.data.paths.push(...v.map(String));
                else if (is(v, 'all')) access.data.all = true;
                else if (is(v, 'forms')) access.data.forms = true;
                else access.data.paths.push(...asList(v));
            }
        for (const action of ['claim', 'complete', 'assign', 'restart', 'events'] as const) {
            const values = said(action);
            const decided = values.some(v => is(v, 'deny') || v === false) ? false : values.some(v => is(v, 'allow') || v === true) ? true : null;
            if (action === 'claim' || action === 'complete' || action === 'assign') access[action] = decided;
            else access[action] = decided === true;
        }
        return access;
    }

    /**
     * What the policies' tables read: the names every expression reads (engine/DecisionContext.ts): the user, the
     * actors, the task, the data (the instance's; a task's, its item's in its scope), the application's facts.
     */
    protected async context(user: ISecurityUser, instance: any, task?: ISecurityTask): Promise<Record<string, any>> {
        const model = this.model(instance?.name);
        const item = this.itemOf(instance, task);
        const scope = item ? dataPathOf(item, instance?.tokens) : null;
        const data = scope ? DataHandler.getData(instance?.data ?? {}, scope) ?? {} : instance?.data;
        return decisionContext({ kind: 'security', name: model.policy, data, user, instance, task: task?.elementId, item,
            elements: model.actors, scope, appDelegate: this.appDelegate });
    }

    /**
     * The reverse of a policy, for one case: who may do what with it. Asked forward for everyone who could make a
     * difference: the people the case names (who started it, a task's assignee or candidates, who completed a step;
     * with `users`, everyone in the directory, with their groups), each role as a member with no relation to the case
     * (`roles`, and the groups its waiting tasks are offered to), and anyone else. Administrators (`admins`) are not
     * asked: they may do everything. For each, the case (see, data, restart, events) and each waiting user task: whether
     * they may claim, complete and assign it, the assignment's offer and the policy's allow or deny combined.
     */
    async whoMay(instance: any, { users = [], roles = [], admins = [] }: { users?: ISecurityUser[]; roles?: string[]; admins?: string[] } = {}): Promise<IWhoMay[]> {
        const items: any[] = instance?.items ?? [];
        const waiting = items.filter(i => i.type === 'bpmn:UserTask' && i.status === 'wait');
        const known = new Map(users.filter(u => u?.userName).map(u => [u.userName, u]));
        const actors = this.actorsOf(instance);
        const named = new Map<string, string[]>();     // a person the case names, and why
        const name = (userName, why: string) => {
            if (!userName) return;
            named.set(userName, [...(named.get(userName) ?? []), why]);
        };
        const label = item => item.name || item.elementId;
        for (const item of items) {
            if (item.type === 'bpmn:StartEvent' && item.userName) name(item.userName, 'started it');
            if (item.type === 'bpmn:UserTask' && item.status === 'end' && item.userName) name(item.userName, `completed ${label(item)}`);
        }
        for (const item of waiting) {
            if (item.assignee) name(item.assignee, `${label(item)}'s assignee`);
            for (const u of asList(item.candidateUsers)) name(u, `offered ${label(item)}`);
        }
        const subjects: IWho[] = [];
        const adminSet = new Set(admins);
        if (admins.length) subjects.push({ kind: 'administrators', label: admins.join(', '), because: 'administrators: not asked' });
        const people = new Set([...named.keys(), ...known.keys()]);
        for (const userName of people) {
            if (adminSet.has(userName)) continue;
            // someone the case names whom the directory doesn't know: asked with no groups, and said so
            const user = { userName, userGroups: known.get(userName)?.userGroups ?? [] };
            const roles = actorNamesOf(user, actors).filter(a => a !== 'initiator' && a !== 'assignee' && a !== 'candidate');
            subjects.push({ kind: 'person', label: userName, user,
                because: [...(named.get(userName) ?? []), ...roles.map(a => `actor ${a}`),
                    ...(known.has(userName) ? [] : ['groups unknown (not in the user directory)'])].join(', ') });
        }
        const groups = [...new Set([...roles, ...waiting.flatMap(i => asList(i.candidateGroups))])];
        for (const group of groups)
            subjects.push({ kind: 'role', label: group, user: { userName: `\u0000role:${group}`, userGroups: [group] }, because: 'a member, no actor of the instance' });
        subjects.push({ kind: 'anyone', label: 'anyone else', user: { userName: '\u0000anyone', userGroups: [] }, because: 'no part in it, none of these roles' });

        const answers: IWhoMay[] = [];
        for (const who of subjects) {
            if (who.kind === 'administrators') {
                answers.push({ who, access: FULL_ACCESS, tasks: waiting.map(item => ({ seq: item.seq, elementId: item.elementId, name: item.name, offered: true, claim: true, complete: true, assign: true, rules: [] })) });
                continue;
            }
            const access = await this.decide(who.user, instance);
            const tasks = [];
            for (const item of waiting) {
                const onTask = await this.decide(who.user, instance, { elementId: item.elementId, itemId: item.id });
                const me = who.user.userName, groupsOf = who.user.userGroups ?? [];
                const offered = item.assignee ? item.assignee === me
                    : asList(item.candidateUsers).includes(me) || asList(item.candidateGroups).some(g => groupsOf.includes(g))
                        || (!asList(item.candidateUsers).length && !asList(item.candidateGroups).length);
                // the assignment's offer, unless a rule denies it; a rule's allow besides
                const effective = (action: 'claim' | 'complete' | 'assign') => onTask[action] === true || (onTask[action] !== false && offered);
                const complete = effective('complete');
                tasks.push({ seq: item.seq, elementId: item.elementId, name: item.name, offered,
                    claim: !item.assignee && complete !== false && (onTask.claim === true || (onTask.claim !== false && onTask.complete !== false && offered)),
                    complete, assign: effective('assign'), rules: onTask.rules });
            }
            answers.push({ who, access, tasks });
        }
        return answers;
    }

    /** One policy's matching rules, for this context. */
    protected async ask(file: string, context: Record<string, any>): Promise<{ rule: number; outputs: Record<string, any> }[]> {
        const dmn = await new DMNEngine({ listInputs: true }).load(file);
        const result = await dmn.evaluateAsync(context);
        const rows: any[] = Array.isArray(result) ? result : result ? [result] : [];
        return rows.map((outputs, i) => ({ rule: dmn.matched[i] ?? i + 1, outputs: outputs ?? {} }));
    }

    /**
     * The built-in default, for a folder without `default.dmn.xml` (the Fable Review's H2): designers see every case
     * and its data; the assignee and candidates of a task see the case as a line, and what forms entered; who started
     * it or completed a step of it, as a line.
     */
    protected builtInDefault(user: ISecurityUser, instance: any, actors: Record<string, Actor>): { rule: number; outputs: Record<string, any> }[] {
        const rows = [];
        const is = actorNamesOf(user, actors ?? {});
        const completed = !!user.userName && (instance?.items ?? []).some(i => i.status === 'end' && i.userName === user.userName && i.type === 'bpmn:UserTask');
        if ((user.userGroups ?? []).includes('DESIGNER')) rows.push({ rule: 1, outputs: { see: 'full', data: 'all' } });
        if (is.includes('assignee') || is.includes('candidate')) rows.push({ rule: 2, outputs: { see: 'summary', data: 'forms' } });
        if (is.includes('initiator') || completed) rows.push({ rule: 3, outputs: { see: 'summary' } });
        return rows;
    }
}
