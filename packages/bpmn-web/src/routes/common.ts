import { adminDisabled, designDisabled, isAdminGroups, isDesignerGroups } from '../userAccess/roles.js';

/**
 * An answer that is only a message (refused, not found): a page with the menu when a browser opens it, the plain text
 * for anything else, as the pages' scripts read it.
 */
export function answerMessage(req, res, status: number, message: string) {
    if (req.method === 'GET' && req.headers?.accept?.includes('text/html'))
        return res.status(status).render('message', { title: message, message });
    return res.status(status).send(message);
}

export class Common {
    webApp;
    constructor(webApp) {
        this.webApp = webApp;
    }

    /**
     * Session-auth gate for the UI routers. Apply router-wide
     * (`router.use(this.isAuthenticated)`) for deny-by-default.
     *
     * `REQUIRE_AUTHENTICATION=false` keeps the historical dev bypass so the
     * demo can be explored without setting up users.
     */
    isAuthenticated(req, res, next) {
        if (process.env.REQUIRE_AUTHENTICATION === 'false') return next();
        if (typeof req.isAuthenticated !== 'function' || req.isAuthenticated() !== true || !req.user) {
            return res.redirect('/login');
        }
        req.isAdmin = isAdminGroups(req.user.userGroups);
        req.isDesigner = isDesignerGroups(req.user.userGroups);
        return next();
    }

    /** Administration turned off (DISABLE_ADMIN=true): answers as if the page did not exist. */
    adminEnabled(req, res, next) {
        if (adminDisabled()) return answerMessage(req, res, 404, 'Administration is turned off on this server');
        return next();
    }

    isAdmin(req, res, next) {
        if (adminDisabled()) return answerMessage(req, res, 404, 'Administration is turned off on this server');
        if (process.env.REQUIRE_AUTHENTICATION === 'false' || req.isAdmin === true) return next();
        return answerMessage(req, res, 403, 'Administrator permission required');
    }

    /** Model design (the model routes): designers and administrators. */
    isDesigner(req, res, next) {
        if (designDisabled()) return answerMessage(req, res, 404, 'Model design is turned off on this server');
        if (process.env.REQUIRE_AUTHENTICATION === 'false' || req.isDesigner === true) return next();
        return answerMessage(req, res, 403, 'Designer permission required');
    }
}
