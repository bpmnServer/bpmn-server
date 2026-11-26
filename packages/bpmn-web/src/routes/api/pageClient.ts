import { SecureUser } from '../../index.js';
import { hostUserManager } from '../../userAccess/UserManager.js';
import { TaskOperations } from './tasks.js';
import { InstanceOperations, InstanceError } from './instances.js';
import { GuideOperations, GuideError } from './guide.js';
import { v2TaskError } from '../taskApi.js';

/*
 * The pages' client of API v3's operations (the 3.7 plan, part 3: the pages use the API like any client). A page acts
 * as the person signed in, as API v3 would take them (routes/api/door.ts): the application's apiUser with its user
 * manager, else bpmn-web's own signed-in user, else (REQUIRE_AUTHENTICATION=false) the system, as it did. The operations
 * are called in this process, with the person's rights as they are now: no HTTP to this server's own address (which
 * HTTPS=true would refuse), and no token of theirs held in the session with their groups of when it was made.
 */

export class ApiError extends Error {
    constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}

/**
 * Whom the pages act for: the person API v3 would take (the application's apiUser, else the signed-in user, else the
 * system), with the security rules as every page has them (ENFORCE_SECURITY=false turns them off, for development):
 * or an ApiError 401. API v3 itself keeps them on for its clients, whatever ENFORCE_SECURITY says.
 */
export async function pageUser(req): Promise<SecureUser> {
    // a person an application handed to one page (routes/embed.ts): that page's session stands for them, nothing else does
    if (req.embedUser) return req.embedUser;
    const host = hostUserManager(req);
    if (host) {
        const info = await host.apiUser?.(req);
        if (!info?.userName) throw new ApiError(401, 'UNAUTHORIZED', 'Not signed in');
        return new SecureUser({ ...info, userGroups: info.userGroups ?? [] } as any);
    }
    const signedIn = req.user?.userName
        ? { userName: req.user.userName, userGroups: req.user.userGroups ?? [] }
        : process.env.REQUIRE_AUTHENTICATION === 'false' ? { userName: 'system', userGroups: ['SYSTEM'] } : null;
    if (!signedIn) throw new ApiError(401, 'UNAUTHORIZED', 'Not signed in');
    // as every other page has them (workflow.ts, getSecureUser): their tenant; the security rules as ENFORCE_SECURITY says
    return new SecureUser({ ...signedIn, tenantId: req.user?.tenantId } as any);
}

/** An operation's error as API v3 answers it: an ApiError with its status and code. */
async function asApi<T>(operation: () => Promise<T>): Promise<T> {
    try {
        return await operation();
    }
    catch (error) {
        if (error instanceof ApiError) throw error;
        // an instance operation's answer (404 for one not seen, 403 refused, 422 the engine's)
        if (error instanceof InstanceError || error instanceof GuideError) throw Object.assign(new ApiError(error.status, error.code, error.message), { cause: error });
        const [status, body] = v2TaskError(error) as [number, any];
        if (status === 500) throw error;
        throw Object.assign(new ApiError(status, body.code, body.errors), { cause: error });
    }
}

/** API v3's operations, as the page's user: what the pages need (My work, the Workbench, a task's and an instance's pages). */
export async function pageApi(req, server) {
    const user = await pageUser(req);
    const tasks = new TaskOperations(server);
    const instances = new InstanceOperations(server);
    const guides = new GuideOperations(server);
    return {
        user,
        /** The waiting tasks they have a part in (GET /tasks); `query`, a label filter's conditions; `view`, the person's columns and sort (routes/listView.ts). */
        waiting: (limit: number, query?: object, view: object = {}) => asApi(async () => (await tasks.list(user, { limit, query, ...view })).tasks),
        /** The ones they completed, newest first (GET /tasks?status=completed). */
        completed: (limit: number, query?: object) => asApi(() => tasks.completed(user, { limit, query })),
        /** The processes they may start, with each start form (GET /processes/startable). */
        startable: () => asApi(() => tasks.startable(user)),
        /** A task form's field's choices (POST /tasks/{id}/choices/{field}). */
        choices: (id: string, field: string, body: object) => asApi(() => tasks.choices(user, id, field, body)),
        /** A start form's field's choices (POST /processes/{name}/choices/{field}). */
        startChoices: (name: string, field: string, body: object) => asApi(() => tasks.startChoices(user, name, field, body)),
        /** The instances they may see, newest first, a page at a time (GET /instances); `query`, a label filter's conditions. */
        instances: (limit: number, after?: string, query?: object, view: object = {}) => asApi(() => instances.list(user, { limit, after, query, ...view })),
        /** An instance's page: the whole instance for whoever sees it fully, its data as the policy lets them read it. */
        instancePage: (id: string) => asApi(() => instances.page(user, id)),
        /** Its user tasks' assignment, and who may do what with it (GET /instances/{id}/access). */
        instanceAccess: (instance, directory) => instances.assignmentAndAccess(instance, directory),
        /** Every waiting task an administrator may see (the Workbench's); anyone else's, their own. */
        allWaiting: (limit: number, query?: object, view: object = {}) => asApi(async () => (await tasks.list(user, { limit, query, all: true, ...view })).tasks),
        /** A task's page: the task, its case as they may read it, its element and fields. */
        taskPage: (id: string, purpose?: 'complete' | 'assign') => asApi(() => tasks.page(user, id, { purpose })),
        /** The task completed with this data (POST /tasks/{id}/complete). */
        complete: (id: string, data: object) => asApi(() => tasks.complete(user, id, data)),
        /** The task given to someone else, as the case's policy allows: the engine's execution. */
        assign: (id: string, assignment: Record<string, any>, data: object) => asApi(() => tasks.assign(user, id, assignment, data)),
        /** A process explained, for whoever may start it or works in it (GET /processes/{name}/guide). */
        guide: (name: string) => asApi(() => guides.guide(user, name)),
        /** Its diagram, for whoever may read its guide. */
        guideDiagram: (name: string) => asApi(() => guides.diagram(user, name)),
        /** Whether they may read its guide and its test cases: a 404 ApiError when not. */
        mayReadGuide: (name: string) => asApi(async () => { await guides.access(user, name); return true; }),
        /** A process started as them (POST /processes/{name}/start). */
        start: (processName: string, options: { data?: object; startNodeId?: string }) => tasks.start(user, processName, { data: options.data ?? {}, startNodeId: options.startNodeId }),
    };
}
