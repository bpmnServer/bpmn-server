import express from 'express';
import { SecureUser } from '../index.js';
import { answerMessage } from './common.js';
import { ViewHelper } from './ViewHelper.js';
import { runProcess, ProcessRunError } from './runErrors.js';
import { pageApi, ApiError } from './api/pageClient.js';
import { Handoffs, type HandoffPage } from './api/handoffs.js';
import { tokenUser } from './api/tokens.js';
import { hasFormKey } from './formKey.js';
import { formFieldLookup } from '../index.js';
import { ruleAttributes } from './formAttributes.js';

/*
 * The pages an application hands a person to (docs/docs/handoffs.md): one task's form, or one process's start form, without
 * this server's menu, for a person the application has signed in. They arrive with a handoff (POST /api/v3/handoffs: a link
 * good for one visit), which is traded for a short session that holds the person, the one page and where to go when it is done.
 * That session opens this page and its choices and nothing else of this server: the pages' own sign-in and menu are not in the
 * way, and are not opened.
 *
 * The forms are the pages' own (the ones /invokeItem and the start page draw), completed through API v3's operations as that
 * person: the case's security policy, the form's rules, the assignment all apply as they do for any call.
 */
const SESSION_MINUTES = 15;
const serverOf = req => req.app.get('bpmnServer');
const handoffsOf = new WeakMap<object, Handoffs>();
const handoffs = req => { const server = serverOf(req); let h = handoffsOf.get(server); if (!h) handoffsOf.set(server, h = new Handoffs(server)); return h; };
const FORM_ONLY = new Set(['itemId', '_csrf', 'returnTo', 'processName', 'startNodeId']);

/** What the session holds: the person, the one page, and where to go when it is done. */
interface EmbedSession { userName: string; groups: string[]; page: HandoffPage; returnTo?: string; expiresAt: number }
/** The session, when it is for this page (a task by its id, a start form by its process) and has not lapsed. */
const held = (req, type: 'task' | 'start', name: string): EmbedSession | null => {
    const kept: EmbedSession | undefined = req.session?.embed;
    if (!kept || kept.expiresAt <= Date.now() || kept.page.type !== type) return null;
    return (kept.page.type === 'task' ? kept.page.id : kept.page.process) === name ? kept : null;
};
/** The person the session stands for, as API v3 would act for them: the pages' client takes it from the request. */
const actAs = (req, kept: EmbedSession): SecureUser =>
    (req.embedUser = tokenUser({ userName: kept.userName, groups: kept.groups, issuedBy: 'handoff', issuedAt: '', expiresAt: '' }));
/** The address with identifiers added: where the person goes when a page is done (what was made, never case data). */
const withParams = (address: string, params: Record<string, string>) => {
    const [path, query = ''] = address.split('?', 2);
    const q = new URLSearchParams(query);
    for (const [key, value] of Object.entries(params)) q.set(key, value);
    const text = q.toString();
    return text ? `${path}?${text}` : path;
};

export function embedRouter() {
    const router = express.Router();

    /**
     * The link: a handoff opens a page and is spent (the address then goes to the page without it); the session after.
     * `type` and `name` are what the address is for.
     */
    const arrive = (type: 'task' | 'start', show: (req, res, kept: EmbedSession, name: string) => Promise<any>) => async (req, res, next) => {
        try {
            const name = req.params.id ?? req.params.process;
            if (typeof req.query.handoff === 'string') {
                if (!req.session) return answerMessage(req, res, 501, 'This server has no sessions to hold a handoff');
                const taken = await handoffs(req).redeem(req.query.handoff);
                const meant = taken && taken.page.type === type && (taken.page.type === 'task' ? taken.page.id : taken.page.process) === name;
                if (!taken || !meant)
                    return answerMessage(req, res, 403, 'This link has been used, or has expired: open the page again from the application');
                (req.session as any).embed = {
                    userName: taken.userName, groups: taken.groups, page: taken.page, returnTo: taken.returnTo, expiresAt: Date.now() + SESSION_MINUTES * 60_000,
                } as EmbedSession;
                return req.session.save(error => error ? next(error) : res.redirect(`/embed/${type}/${encodeURIComponent(name)}`));
            }
            const kept = held(req, type, name);
            if (!kept) return answerMessage(req, res, 401, 'Open this page from the application');
            actAs(req, kept);
            await show(req, res, kept, name);
        }
        catch (error) { next(error); }
    };
    /** A refusal of the operations as a page; the error itself otherwise. */
    const refused = (req, res, error) => {
        const refusal = error instanceof ApiError ? error : error instanceof ProcessRunError && error.cause instanceof ApiError ? error.cause : null;
        if (!refusal || refusal.status >= 500) return false;
        answerMessage(req, res, refusal.status === 404 ? 403 : refusal.status, refusal.status === 404 ? 'This is not there, or not yours to open' : refusal.message);
        return true;
    };
    const done = (req, res, kept: EmbedSession, params: Record<string, string> = {}) => {
        delete (req.session as any).embed;
        const to = kept.returnTo ? withParams(kept.returnTo, params) : null;
        return req.session.save(() => to ? res.redirect(to) : answerMessage(req, res, 200, 'Done. You can close this page.'));
    };

    // ---- a task's form
    router.get('/task/:id', arrive('task', async (req, res, kept, id) => {
        let page;
        try { page = await (await pageApi(req, serverOf(req))).taskPage(id); }
        catch (error) { if (refused(req, res, error)) return; throw error; }
        const { node, fields, instance, formKey } = page;
        if (hasFormKey(formKey)) return answerMessage(req, res, 409, "This task has a form of the application's own: open it there");
        const lookups = Object.fromEntries((fields ?? []).map(f => [f.id, formFieldLookup(f)]).filter(([, lookup]) => lookup));
        const attrs = Object.fromEntries((fields ?? []).map(f => [f.id, ruleAttributes(f)]));
        res.render('invokeItem', {
            node, id, fields: fields ?? [], lookups, attrs, instance, vars: ViewHelper.formatData(instance.data || {}),
            processName: page.task.processName ?? instance.name, elementId: page.task.elementId, returnTo: undefined,
            embed: true, formAction: `/embed/task/${encodeURIComponent(id)}`, choicesBase: '/embed/choices/task',
        });
    }));

    // the task completed, as that person; then where the application said to go (the session ends: it was for this task)
    router.post('/task/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            const kept = held(req, 'task', id);
            if (!kept) return answerMessage(req, res, 401, 'Open this page from the application');
            actAs(req, kept);
            const data = {};
            for (const [key, value] of Object.entries(req.body ?? {}))
                if (!FORM_ONLY.has(key)) data[key] = value;
            try {
                const api = await pageApi(req, serverOf(req));
                await runProcess(serverOf(req), { itemId: id }, () => api.complete(id, data));
            }
            catch (error) { if (refused(req, res, error)) return; throw error; }
            return done(req, res, kept);
        }
        catch (error) { next(error); }
    });

    // ---- a process's start form
    router.get('/start/:process', arrive('start', async (req, res, kept, processName) => {
        let starts;
        try { starts = (await (await pageApi(req, serverOf(req))).startable()).filter(s => s.processName === processName); }
        catch (error) { if (refused(req, res, error)) return; throw error; }
        const wanted = kept.page.type === 'start' ? kept.page.startNodeId : undefined;
        const start = wanted ? starts.find(s => s.startNodeId === wanted) : starts[0];
        if (!start) return answerMessage(req, res, 403, `${processName} is not one this person may start${wanted ? ` at ${wanted}` : ''}`);
        if (hasFormKey(start.form?.formKey)) return answerMessage(req, res, 409, "This process has a start form of the application's own: open it there");
        res.render('embedStart', {
            title: start.name || processName, processName,
            start: { processName, startNodeId: start.startNodeId, name: start.name, fields: start.form?.fields ?? [] },
            embed: true, formAction: `/embed/start/${encodeURIComponent(processName)}`, choicesBase: '/embed/choices/start',
        });
    }));

    // the process started, as that person: its start form's fields are `field.<id>`, as the pages' start form has them
    router.post('/start/:process', async (req, res, next) => {
        try {
            const processName = req.params.process;
            const kept = held(req, 'start', processName);
            if (!kept) return answerMessage(req, res, 401, 'Open this page from the application');
            actAs(req, kept);
            // only the start event this page was opened for: the form's own hidden field can not choose another
            const startNodeId = kept.page.type === 'start' ? kept.page.startNodeId ?? (req.body?.startNodeId || undefined) : undefined;
            const data = {};
            for (const [key, value] of Object.entries(req.body ?? {}))
                if (key.startsWith('field.') && value !== '') data[key.substring(6)] = value;
            let started;
            try {
                const api = await pageApi(req, serverOf(req));
                started = await runProcess(serverOf(req), { processName }, () => api.start(processName, { data, startNodeId }));
            }
            catch (error) { if (refused(req, res, error)) return; throw error; }
            return done(req, res, kept, { instance: started.instance.id });
        }
        catch (error) { next(error); }
    });

    // ---- a form field's choices (<owf:list>, <owf:lookup>), as that person: the same answer the drawn forms have anywhere
    const choices = (type: 'task' | 'start', ask: (api, req) => Promise<any>) => async (req, res) => {
        const kept = held(req, type, req.params.id ?? req.params.process);
        if (!kept) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Open this page from the application' } });
        actAs(req, kept);
        try { res.json(await ask(await pageApi(req, serverOf(req)), req)); }
        catch (error) { res.status(error?.status ?? 500).json({ error: { code: error?.code ?? 'ERROR', message: error?.message ?? String(error) } }); }
    };
    router.post('/choices/task/:id/:field', choices('task', (api, req) => api.choices(req.params.id, req.params.field, req.body ?? {})));
    router.post('/choices/start/:process/:field', choices('start', (api, req) => api.startChoices(req.params.process, req.params.field, req.body ?? {})));

    return router;
}
