// Who may do what in the web app, by user group. Administrators manage the app (users, data); designers
// work on models: list, create, import, edit, check (verify), save, rename and delete them.
// Administrators are designers too. bpmn-server names these groups in USER_ROLE.

export const ADMIN_GROUPS = ['ADMIN', 'SYSTEM'];
export const DESIGNER_GROUPS = [...ADMIN_GROUPS, 'DESIGNER'];

export function inGroups(userGroups, groups: string[]): boolean {
    return Array.isArray(userGroups) && userGroups.some(group => groups.includes(group));
}

/**
 * DISABLE_ADMIN=true turns administration off for everyone, administrators included: no administration pages,
 * no /admin REST APIs (a public demo). Administer such a server with its console (npm run cli).
 */
export const adminDisabled = () => process.env.DISABLE_ADMIN === 'true';

export const isAdminGroups = (userGroups) => !adminDisabled() && inGroups(userGroups, ADMIN_GROUPS);
export const isDesignerGroups = (userGroups) => inGroups(userGroups, DESIGNER_GROUPS);

/** A guest of a public demo (GUEST_ACCESS=true): a visitor who did not sign in. */
export const isGuest = (user) => inGroups(user?.userGroups, ['GUEST']);

/**
 * The groups the engine sees for a user. A guest's include ADMIN, so it sees every task of its own instances
 * whatever group they are for: its tenant holds only its own instances. (The web app's administration is off
 * wherever there are guests: DISABLE_ADMIN.)
 */
export const engineGroups = (user) => isGuest(user) ? [...(user.userGroups ?? []), 'ADMIN'] : user?.userGroups;
