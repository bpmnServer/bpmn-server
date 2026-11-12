/**
 * Security policies (docs/design/security-policies.md): who sees a case, which of its data, and what they may do with
 * it and its tasks. A policy is a DMN decision table in the models folder, `policies/security/<name>.dmn.xml`, named by
 * a process (`owf:securityPolicy`) and, for its tasks' actions, by a user task. Every rule that matches counts (hit
 * policy COLLECT) and a denial wins. Its inputs are the person, their relation to the case, the task and the case's
 * data, in FEEL only: it is asked by the host, on every list and page.
 *
 * `SecurityPolicy` is one models folder's policies; an application may subclass it and override a step (the
 * relations, the context the tables read, the built-in default, combining).
 *
 * Off until an application has `policies/security/` or SECURITY_POLICY=default: then today's rule (SecureUser) holds.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DMNEngine } from '../dmn/DMNEngine.js';

export const SECURITY_FOLDER = 'policies/security';
/** The application's default policy, for a process that names none. */
export const DEFAULT_SECURITY_POLICY = 'default';
export const SECURITY_ACTIONS = ['see', 'data', 'claim', 'complete', 'restart', 'events'] as const;

export type Relation = 'initiator' | 'assignee' | 'candidate' | 'participant';

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
    restart: boolean;
    events: boolean;
    /** the rules that matched */
    rules: IPolicyRule[];
}

/** What a model says for security: its process's policy, its tasks', and the fields its forms enter. */
export interface IModelSecurity { policy?: string; taskPolicies: Map<string, string>; formFields: Set<string>; taskFields: Map<string, Set<string>>; }

export const FULL_ACCESS: IAccess = Object.freeze({
    see: 'full', data: { all: true, forms: true, paths: [] }, claim: null, complete: null, restart: true, events: true, rules: [],
}) as IAccess;

const asList = (value): string[] => (Array.isArray(value) ? value : value == null || value === '' ? [] : String(value).split(','))
    .map(v => String(v ?? '').trim()).filter(Boolean);
const attr = (tag: string, name: string) => new RegExp(`\\s(?:[\\w.-]+:)?${name}\\s*=\\s*"([^"]*)"`).exec(tag)?.[1];

/** The security policies of one models folder. */
export class SecurityPolicy {
    /** models' security facts, by file, while the file is as it was (shared by every instance) */
    private static models = new Map<string, { stamp: string; model: IModelSecurity }>();

    constructor(readonly definitionsPath: string) { }

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
        const model: IModelSecurity = { taskPolicies: new Map(), formFields: new Set(), taskFields: new Map() };
        const file = this.definitionsPath && modelName ? path.join(this.definitionsPath, `${modelName}.bpmn`) : null;
        let stat: fs.Stats;
        try { stat = fs.statSync(file); } catch { return model; }
        const stamp = `${stat.mtimeMs}:${stat.size}`;
        const cached = SecurityPolicy.models.get(file);
        if (cached?.stamp === stamp) return cached.model;
        const xml = fs.readFileSync(file, 'utf8');
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

    /** The relations a person has to a case, from its items (and who started it). */
    relationsOf(user: ISecurityUser, instance: any): Relation[] {
        const relations = new Set<Relation>();
        const items: any[] = instance?.items ?? [];
        const me = user.userName, groups = user.userGroups ?? [];
        const first = [...items].sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))[0];
        if (items.some(i => i.type === 'bpmn:StartEvent' && i.userName === me) || first?.userName === me || instance?.userName === me)
            relations.add('initiator');
        for (const item of items) {
            if (item.type !== 'bpmn:UserTask') continue;
            const waiting = item.status === 'wait';
            if (waiting && item.assignee === me) relations.add('assignee');
            if (waiting && (!item.assignee || item.assignee === me)
                && (asList(item.candidateUsers).includes(me) || asList(item.candidateGroups).some(g => groups.includes(g))))
                relations.add('candidate');
            if (item.status === 'end' && item.userName === me) relations.add('participant');
        }
        if (relations.has('assignee') || relations.has('candidate')) relations.add('participant');
        return [...relations];
    }

    /**
     * What a person may do with a case (and, with `task`, one of its tasks): every rule of the policies that apply (the
     * process's, else the application's default, else the built-in one; and the task's own), combined. A policy that
     * can't be read decides nothing (its error is in `errors`), so what it would have allowed stays refused.
     */
    async decide(user: ISecurityUser, instance: any, task?: { elementId: string }, errors: string[] = []): Promise<IAccess> {
        if (user.unrestricted) return FULL_ACCESS;
        const model = this.model(instance?.name);
        const relations = this.relationsOf(user, instance);
        const context = await this.context(user, instance, task, relations);
        const rules: IPolicyRule[] = [];
        const named = [model.policy || DEFAULT_SECURITY_POLICY];
        const own = task && model.taskPolicies.get(task.elementId);
        if (own && !named.includes(own)) named.push(own);
        for (const name of named) {
            const file = this.file(name);
            if (!file) {
                if (name === DEFAULT_SECURITY_POLICY && !model.policy)
                    rules.push(...this.builtInDefault(user, relations).map(r => ({ policy: 'built-in default', ...r })));
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
        const access: IAccess = { see: 'none', data: { all: false, forms: false, paths: [] }, claim: null, complete: null, restart: false, events: false, rules };
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
        for (const action of ['claim', 'complete', 'restart', 'events'] as const) {
            const values = said(action);
            const decided = values.some(v => is(v, 'deny') || v === false) ? false : values.some(v => is(v, 'allow') || v === true) ? true : null;
            if (action === 'claim' || action === 'complete') access[action] = decided;
            else access[action] = decided === true;
        }
        return access;
    }

    /** What the policies' tables read: the person, their relations, the task, the case's data. */
    protected async context(user: ISecurityUser, instance: any, task: { elementId: string } | undefined, relations: Relation[]): Promise<Record<string, any>> {
        return {
            user: { userName: user.userName, groups: user.userGroups ?? [] },
            groups: user.userGroups ?? [],
            relation: relations,
            task: task?.elementId ?? '',
            data: instance?.data ?? {},
        };
    }

    /** One policy's matching rules, for this context. */
    protected async ask(file: string, context: Record<string, any>): Promise<{ rule: number; outputs: Record<string, any> }[]> {
        const dmn = await new DMNEngine({ listInputs: true }).load(file);
        const result = dmn.evaluate(context);
        const rows: any[] = Array.isArray(result) ? result : result ? [result] : [];
        return rows.map((outputs, i) => ({ rule: dmn.matched[i] ?? i + 1, outputs: outputs ?? {} }));
    }

    /**
     * The built-in default, for a folder without `default.dmn.xml` (the Fable Review's H2): designers see every case
     * and its data; the assignee and candidates of a task see the case as a line, and what forms entered; those who
     * started it or worked on it, as a line.
     */
    protected builtInDefault(user: ISecurityUser, relations: Relation[]): { rule: number; outputs: Record<string, any> }[] {
        const rows = [];
        if ((user.userGroups ?? []).includes('DESIGNER')) rows.push({ rule: 1, outputs: { see: 'full', data: 'all' } });
        if (relations.includes('assignee') || relations.includes('candidate')) rows.push({ rule: 2, outputs: { see: 'summary', data: 'forms' } });
        if (relations.includes('participant') || relations.includes('initiator')) rows.push({ rule: 3, outputs: { see: 'summary' } });
        return rows;
    }
}
