import express from 'express';
import { door } from './api/door.js';
import { TaskOperations, TaskError, DEFAULT_LIMIT } from './api/tasks.js';

/*
 * The task API (/api2/tasks): an application lists, claims and completes tasks for its users, whom it has authenticated
 * itself, and starts processes for them. Off unless API_ACTING_USER_KEY is set; that key opens these routes and no
 * other, and API_KEY does not open these. The operations are routes/api/tasks.ts's (v3 has them too); this is their v2
 * mapping: `after` for a page's bookmark, answers as they were, errors as { errors, code }.
 */

/** An error as v2 answers it: its status, { errors, code }. */
export function v2TaskError(error): [number, object] {
    if (error instanceof TaskError)
        return [error.status, { errors: error.message, code: error.code }];
    // the engine's own check, under the instance's lock: another call got there first
    if (error?.code === 'ITEM_NOT_WAITING')
        return [409, { errors: error.message, code: error.code }];
    if (/^failed to lock instance/.test(error?.message ?? ''))
        return [503, { errors: 'The instance is busy: try again', code: 'INSTANCE_BUSY' }];
    console.error('task API:', error);
    return [500, { errors: String(error?.message ?? error), code: 'TASK_FAILED' }];
}

export function taskApi(server) {
    const router = express.Router();
    const tasks = new TaskOperations(server);

    // who calls: the acting-user key, then the user it speaks for (routes/api/door.ts, way acting)
    router.use(door('acting'));

    const handler = fn => async (req, res) => {
        try {
            res.json(await fn(req, req.apiUser));
        }
        catch (error) {
            const [status, body] = v2TaskError(error);
            res.status(status).json(body);
        }
    };

    router.get('/', handler((req, user) => tasks.list(user, {
        limit: req.query.limit === undefined ? DEFAULT_LIMIT : Number(req.query.limit),
        after: req.query.after,
    })));
    // start a process as the acting user, at a start event they may use; the instance, and their first task in it
    router.post('/start/:name', handler((req, user) => tasks.start(user, req.params.name, { data: req.body?.data ?? {}, startNodeId: req.body?.startNodeId })));
    router.get('/:id', handler((req, user) => tasks.get(user, req.params.id)));
    router.post('/:id/claim', handler((req, user) => tasks.claim(user, req.params.id)));
    router.post('/:id/complete', handler((req, user) => tasks.complete(user, req.params.id, req.body?.data ?? {})));

    router.use((req, res) => { res.status(404).json({ errors: `No task API route ${req.method} ${req.originalUrl}`, code: 'NO_ROUTE' }); });
    return router;
}
