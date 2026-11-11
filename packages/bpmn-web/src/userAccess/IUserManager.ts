import type { IUserInfo } from 'bpmn-server';
import { ADMIN_GROUPS, DESIGNER_GROUPS } from './roles.js';

/**
 * Who signs in, and how: what bpmn-web asks of a user manager. bpmn-web's own (UserManager: its users, sessions, sign-in
 * pages and first-run setup) is the default; an application that has its own users and sessions passes its own to
 * start({ userManager }), and bpmn-web then keeps none of its own.
 *
 * On every request after init, bpmn-web's pages and APIs read:
 *  - req.user: the person signed in (a WebUser, see webUser()), or none;
 *  - req.isAuthenticated(): whether there is one;
 *  - req.session: a session, where the pages keep their state (their API token, messages, the CSRF secret).
 * A page that needs someone signed in sends a person without one to /login, and signing out is /logout: the user
 * manager's routes (setup) answer both, with its own pages or by sending the person to the application's.
 */
export interface IUserManager {
    /** First, before bpmn-web's middleware and every route: the sessions, and req.user and req.isAuthenticated(). */
    init(app): void;
    /** After bpmn-web's middleware, before its routes and the application's: /login, /logout and the like. */
    setup(app): void;
    /**
     * Who a call to API v3 is from, by the application's own credential (its token, its session): the person, or null
     * when it is none of the application's. The application issues the credentials; bpmn-web issues none (no tokens,
     * no AI links) with an application's user manager. Without it, only the service key (API_KEY) opens API v3.
     *
     * When the credential is a cookie (the session), API v3 refuses a call that changes something from another site
     * (CSRF: the browser's Sec-Fetch-Site and Origin; door.ts, crossSiteWrite). The application's own routes under /api
     * are not CSRF-checked by bpmn-web (its check is for its pages' forms): check them the same way (crossSiteWrite is
     * exported), and keep the session cookie SameSite=Lax or Strict.
     */
    apiUser?(req): Promise<IUserInfo | null> | IUserInfo | null;
}

/** A person signed in, as bpmn-web's pages read them (req.user). */
export interface WebUser {
    userName: string;
    userGroups: string[];
    email?: string;
    tenantId?: string;
    id: string;
    isAdmin(): boolean;
    isDesigner(): boolean;
    hasGroup(group: string): boolean;
}

/** A person, from the application's own user, as bpmn-web's pages read them. */
export function webUser(person: { userName: string; userGroups?: string[]; email?: string; tenantId?: string; id?: string }): WebUser {
    const userGroups = [...(person.userGroups ?? [])];
    return {
        userName: person.userName,
        userGroups,
        email: person.email,
        tenantId: person.tenantId,
        id: person.id ?? person.userName,
        isAdmin: () => userGroups.some(group => ADMIN_GROUPS.includes(group)),
        isDesigner: () => userGroups.some(group => DESIGNER_GROUPS.includes(group)),
        hasGroup: (group: string) => userGroups.includes(group),
    };
}

