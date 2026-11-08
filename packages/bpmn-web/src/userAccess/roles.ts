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

/**
 * DISABLE_DESIGN=true turns model design off in the web pages for everyone, administrators included: no model
 * editor, no design dashboard, catalog or model test runs. For a server whose models arrive only through the
 * admin REST APIs (/admin/api, /admin/api2: a review or release process elsewhere), which stay on.
 */
export const designDisabled = () => process.env.DISABLE_DESIGN === 'true';

/** DISABLE_SIGNUP=true: no self-registration; administrators add the accounts (dashboard, npm run cli). */
export const signupDisabled = () => process.env.DISABLE_SIGNUP === 'true';

export const isAdminGroups = (userGroups) => !adminDisabled() && inGroups(userGroups, ADMIN_GROUPS);
export const isDesignerGroups = (userGroups) => !designDisabled() && inGroups(userGroups, DESIGNER_GROUPS);
/** May this request's user design models (REQUIRE_AUTHENTICATION=false: everyone, unless DISABLE_DESIGN). */
export const canDesign = (user) => !designDisabled()
    && (process.env.REQUIRE_AUTHENTICATION === 'false' || isDesignerGroups(user?.userGroups));

/**
 * Where someone goes after starting a process or completing a task: administrators and designers to the instance, to
 * see what ran; everyone else back to My work, where their next task is.
 */
export const afterWork = (user, instanceId) => isAdminGroups(user?.userGroups) || canDesign(user)
    ? '/instanceDetails?id=' + encodeURIComponent(instanceId)
    : '/dashboard';

/** SIGNUP_VERIFY_EMAIL=true: sign-up sends a verification email, and SIGNUP_GROUPS come only once it is verified. */
export const signupVerifiesEmail = () => process.env.SIGNUP_VERIFY_EMAIL === 'true';
/** SIGNUP_GROUPS: the user groups of an account that signs up (DESIGNER: it can design). Default none. */
export const signupGroups = () => (process.env.SIGNUP_GROUPS ?? '').split(',').map(group => group.trim()).filter(Boolean);

