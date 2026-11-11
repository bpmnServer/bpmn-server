import { SecureUser } from '../../index.js';
import { hostUserManager } from '../../userAccess/UserManager.js';
import { TaskOperations } from './tasks.js';
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
        const [status, body] = v2TaskError(error) as [number, any];
        if (status === 500) throw error;
        throw Object.assign(new ApiError(status, body.code, body.errors), { cause: error });
    }
}

/** API v3's task operations, as the page's user: what My work and starting a process need. */
export async function pageApi(req, server) {
    const user = await pageUser(req);
    const tasks = new TaskOperations(server);
    return {
        user,
        /** The waiting tasks they have a part in (GET /tasks). */
        waiting: (limit: number) => asApi(async () => (await tasks.list(user, { limit })).tasks),
        /** The ones they completed, newest first (GET /tasks?status=completed). */
        completed: (limit: number) => asApi(() => tasks.completed(user, { limit })),
        /** The processes they may start, with each start form (GET /processes/startable). */
        startable: () => asApi(() => tasks.startable(user)),
        /** A process started as them (POST /processes/{name}/start). */
        start: (processName: string, options: { data?: object; startNodeId?: string }) => tasks.start(user, processName, { data: options.data ?? {}, startNodeId: options.startNodeId }),
    };
}
