// Who may do what in the web app, by user group. Administrators manage the app (users, data); designers
// work on models: list, create, import, edit, check (verify), save, rename and delete them.
// Administrators are designers too. bpmn-server names these groups in USER_ROLE.

export const ADMIN_GROUPS = ['ADMIN', 'SYSTEM'];
export const DESIGNER_GROUPS = [...ADMIN_GROUPS, 'DESIGNER'];

export function inGroups(userGroups, groups: string[]): boolean {
    return Array.isArray(userGroups) && userGroups.some(group => groups.includes(group));
}

export const isAdminGroups = (userGroups) => inGroups(userGroups, ADMIN_GROUPS);
export const isDesignerGroups = (userGroups) => inGroups(userGroups, DESIGNER_GROUPS);
