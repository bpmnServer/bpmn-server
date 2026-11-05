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

/** SIGNUP_VERIFY_EMAIL=true: sign-up sends a verification email, and SIGNUP_GROUPS come only once it is verified. */
export const signupVerifiesEmail = () => process.env.SIGNUP_VERIFY_EMAIL === 'true';
/** SIGNUP_GROUPS: the user groups of an account that signs up (DESIGNER: it can design). Default none. */
export const signupGroups = () => (process.env.SIGNUP_GROUPS ?? '').split(',').map(group => group.trim()).filter(Boolean);

/** A guest of a public demo (GUEST_ACCESS=true): a visitor who did not sign in. */
export const isGuest = (user) => inGroups(user?.userGroups, ['GUEST']);
/** GUEST_SAVE=false: a guest saves nothing: it runs the models as they are, and downloads what it edits. */
export const guestReadOnly = (user) => isGuest(user) && process.env.GUEST_SAVE === 'false';
export const GUEST_CANNOT_SAVE = 'Sign up to save: you can download what you made, and sign up to keep and run it here.';
/** Signed up on a server with guests: models and instances of its own, as a guest has. */
export const workspaceUser = (user) => /^user-[0-9a-f]{12}$/.test(user?.tenantId ?? '');

/**
 * The groups the engine sees for a user. A guest's and a workspace user's include ADMIN, so it sees every task of its own instances
 * whatever group they are for: its tenant holds only its own instances. (The web app's administration is off
 * wherever there are guests: DISABLE_ADMIN.)
 */
export const engineGroups = (user) => isGuest(user) || workspaceUser(user) ? [...(user.userGroups ?? []), 'ADMIN'] : user?.userGroups;
