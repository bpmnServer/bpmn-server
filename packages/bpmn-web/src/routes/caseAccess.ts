import { roleNames } from '../index.js';
import { ownUsers } from '../userAccess/UserManager.js';
import { isAdminGroups } from '../userAccess/roles.js';
// the security policies' access: the Policies add-on's (bpmn-server, addons/security/CaseAccess.ts)
export { CaseAccess, PolicyDenied, securityUser, DECIDE_AT_ONCE } from '../index.js';

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
