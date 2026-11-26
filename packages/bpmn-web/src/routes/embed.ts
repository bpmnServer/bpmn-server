import express from 'express';
import { SecureUser } from '../index.js';
import { answerMessage } from './common.js';
import { ViewHelper } from './ViewHelper.js';
import { runProcess, ProcessRunError } from './runErrors.js';
import { pageApi, ApiError } from './api/pageClient.js';
import { Handoffs } from './api/handoffs.js';
import { tokenUser } from './api/tokens.js';
import { hasFormKey } from './formKey.js';
import { formFieldLookup } from '../index.js';
import { ruleAttributes } from './formAttributes.js';

/*
 * The pages an application hands a person to (docs/design/roadmap-3.8.md): one task's form, without this server's menu, for
 * a person the application has signed in. They arrive with a handoff (POST /api/v3/handoffs: a link good for one visit), which
 * is traded for a short session that holds the person, the one task and where to go when it is done. That session opens this
 * page and its choices and nothing else of this server: the pages' own sign-in and menu are not in the way, and are not opened.
 *
 * The form is the task's own (the one /invokeItem draws), completed through API v3's operations as that person: the case's
 * security policy, the form's rules, the assignment all apply as they do for any call.
 */
const SESSION_MINUTES = 15;
const serverOf = req => req.app.get('bpmnServer');
const handoffsOf = new WeakMap<object, Handoffs>();
const handoffs = req => { const server = serverOf(req); let h = handoffsOf.get(server); if (!h) handoffsOf.set(server, h = new Handoffs(server)); return h; };
const FORM_ONLY = new Set(['itemId', '_csrf', 'returnTo']);

/** What the session holds: the person, the one task, and where to go when it is done. */
interface EmbedSession { userName: string; groups: string[]; taskId: string; returnTo?: string; expiresAt: number }
const held = (req, id: string): EmbedSession | null => {
    const kept: EmbedSession | undefined = req.session?.embed;
    return kept && kept.taskId === id && kept.expiresAt > Date.now() ? kept : null;
};
/** The person the session stands for, as API v3 would act for them: the pages' client takes it from the request. */
const actAs = (req, kept: EmbedSession): SecureUser =>
    (req.embedUser = tokenUser({ userName: kept.userName, groups: kept.groups, issuedBy: 'handoff', issuedAt: '', expiresAt: '' }));

export function embedRouter() {
    const router = express.Router();

    // the form: a handoff opens it (and is spent: the address then goes to the page without it); the session after
    router.get('/task/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            if (typeof req.query.handoff === 'string') {
                if (!req.session) return answerMessage(req, res, 501, 'This server has no sessions to hold a handoff');
                const taken = await handoffs(req).redeem(req.query.handoff);
                if (!taken || taken.page.id !== id)
                    return answerMessage(req, res, 403, 'This link has been used, or has expired: open the task again from the application');
                (req.session as any).embed = {
                    userName: taken.userName, groups: taken.groups, taskId: id, returnTo: taken.returnTo, expiresAt: Date.now() + SESSION_MINUTES * 60_000,
                } as EmbedSession;
                return req.session.save(error => error ? next(error) : res.redirect(`/embed/task/${encodeURIComponent(id)}`));
            }
            const kept = held(req, id);
            if (!kept) return answerMessage(req, res, 401, 'Open this task from the application');
            actAs(req, kept);
            let page;
            try { page = await (await pageApi(req, serverOf(req))).taskPage(id); }
            catch (error) {
                if (error instanceof ApiError) return answerMessage(req, res, error.status === 404 ? 403 : error.status, error.status === 404 ? 'This task is not there, or not yours to open' : error.message);
                throw error;
            }
            const { node, fields, instance, formKey } = page;
            if (hasFormKey(formKey)) return answerMessage(req, res, 409, "This task has a form of the application's own: open it there");
            const lookups = Object.fromEntries((fields ?? []).map(f => [f.id, formFieldLookup(f)]).filter(([, lookup]) => lookup));
            const attrs = Object.fromEntries((fields ?? []).map(f => [f.id, ruleAttributes(f)]));
            res.render('invokeItem', {
                node, id, fields: fields ?? [], lookups, attrs, instance, vars: ViewHelper.formatData(instance.data || {}),
                processName: page.task.processName ?? instance.name, elementId: page.task.elementId, returnTo: undefined,
                embed: true, formAction: `/embed/task/${encodeURIComponent(id)}`, choicesBase: '/embed/choices/task',
            });
        }
        catch (error) { next(error); }
    });

    // the form completed, as that person; then where the application said to go (and the session ends: it was for this task)
    router.post('/task/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            const kept = held(req, id);
            if (!kept) return answerMessage(req, res, 401, 'Open this task from the application');
            actAs(req, kept);
            const data = {};
            for (const [key, value] of Object.entries(req.body ?? {}))
                if (!FORM_ONLY.has(key)) data[key] = value;
            try {
                const api = await pageApi(req, serverOf(req));
                await runProcess(serverOf(req), { itemId: id }, () => api.complete(id, data));
            }
            catch (error) {
                const refusal = error instanceof ApiError ? error : error instanceof ProcessRunError && error.cause instanceof ApiError ? error.cause : null;
                if (refusal && refusal.status < 500)
                    return answerMessage(req, res, refusal.status === 404 ? 403 : refusal.status, refusal.message);
                throw error;
            }
            const to = kept.returnTo;
            delete (req.session as any).embed;
            if (to) return req.session.save(() => res.redirect(to));
            return req.session.save(() => answerMessage(req, res, 200, 'Done. You can close this page.'));
        }
        catch (error) { next(error); }
    });

    // a form field's choices (<owf:list>, <owf:lookup>), as that person: the same answer the drawn forms have anywhere
    router.post('/choices/task/:id/:field', async (req, res) => {
        const kept = held(req, req.params.id);
        if (!kept) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Open this task from the application' } });
        actAs(req, kept);
        try { res.json(await (await pageApi(req, serverOf(req))).choices(req.params.id, req.params.field, req.body ?? {})); }
        catch (error) { res.status(error?.status ?? 500).json({ error: { code: error?.code ?? 'ERROR', message: error?.message ?? String(error) } }); }
    });

    return router;
}
