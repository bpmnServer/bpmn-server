/**
 * Guest access (GUEST_ACCESS=true): a public demo that visitors try without signing in.
 *
 * A visitor without a session becomes a guest: a user of its own (`guest-<random>`, groups DESIGNER and GUEST,
 * its own tenant), kept by a long-lived session cookie. Each guest has a folder of its own, started as a copy of
 * the application's models. Every request of a guest runs in its context (AsyncLocalStorage):
 * `configuration.definitionsPath` is then the guest's folder, so the models, decisions, lint rules and downloads
 * every route reads and writes are the guest's. Its instances carry its tenant, so it sees only its own.
 *
 * GUEST_SAVE=false: a guest saves nothing (routes/model.ts refuses it). An account that signs up here has a folder and
 * a tenant of its own, `user-<random>`, the same way: once it can design, its requests run in that context.
 *
 * Guest access requires these settings (checkGuestSettings): scripts in a sandbox, no timers, no
 * service tasks (DEMO_MODE), no administration (DISABLE_ADMIN), sign-in on (REQUIRE_AUTHENTICATION,
 * ENFORCE_SECURITY).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import { rateLimit } from 'express-rate-limit';

import User from '../userAccess/models/User.js';
import { isDesignerGroups, isGuest, workspaceUser } from '../userAccess/roles.js';
import { DEMO_MODE_SETTINGS, runSetting, type RunSetting } from '../runtime/runSettings.js';

export interface GuestContext {
    /** the guest's user name and tenant: guest-<random> */
    id: string;
    /** its models folder, ending with a separator */
    folder: string;
}

const storage = new AsyncLocalStorage<GuestContext>();

export const guestAccess = () => process.env.GUEST_ACCESS === 'true';
/** The guest whose request is running, if any. */
export const currentGuest = (): GuestContext | undefined => storage.getStore();
/** Runs fn as the guest (a test, a script). */
export const asGuest = <T>(guest: GuestContext, fn: () => T): T => storage.run(guest, fn);

/** Where the guests' folders are: GUESTS_PATH, default ./guests next to the application. */
export const guestsRoot = () => path.resolve(process.env.GUESTS_PATH || 'guests');
/** How many models a guest may have (GUEST_MAX_MODELS, default 50). */
export const maxGuestModels = () => Number(process.env.GUEST_MAX_MODELS) || 50;

const GUEST_ID = /^(guest|user)-[0-9a-f]{12}$/;

export function guestContext(id: string): GuestContext {
    if (!GUEST_ID.test(id))
        throw new Error(`not a guest: ${id}`);
    return { id, folder: path.join(guestsRoot(), id) + path.sep };
}

/** The settings guest access needs; the server does not start without them. */
export function checkGuestSettings() {
    if (!guestAccess())
        return;
    const required = { DISABLE_ADMIN: 'true', REQUIRE_AUTHENTICATION: 'true', ENFORCE_SECURITY: 'true' };
    const missing = [
        ...Object.entries(DEMO_MODE_SETTINGS).filter(([key, value]) => runSetting(key as RunSetting) !== value),
        ...Object.entries(required).filter(([key, value]) => process.env[key] !== value),
    ].map(([key, value]) => `${key}=${value}`);
    if (missing.length)
        throw new Error(`GUEST_ACCESS=true needs ${missing.join(', ')}: guests run their own models, safely only so (DEMO_MODE=true sets the first ones)`);
}

/**
 * Makes `configuration.definitionsPath` the running guest's folder (and the configured one otherwise), and
 * keeps instances' model sources in the instances, so that an instance never depends on a folder.
 */
export function guestConfiguration(configuration) {
    const base = configuration.definitionsPath;
    Object.defineProperty(configuration, 'definitionsPath', {
        get: () => currentGuest()?.folder ?? base,
        set: () => { throw new Error('definitionsPath is fixed while guests are on'); },
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(configuration, 'baseDefinitionsPath', { value: base, enumerable: false });
    return configuration;
}

/** A new guest's folder: a copy of the application's models (BPMN, diagrams, decisions, lint rules). */
function seedFolder(guest: GuestContext, base: string) {
    fs.mkdirSync(guest.folder, { recursive: true });
    for (const file of fs.readdirSync(base)) {
        const from = path.join(base, file);
        if (fs.statSync(from).isFile())
            fs.copyFileSync(from, path.join(guest.folder, file));
    }
}

/** The guest user of a new visitor, signed in; its folder made. */
async function newGuest(req, base: string) {
    const id = 'guest-' + crypto.randomBytes(6).toString('hex');
    const guest = guestContext(id);
    seedFolder(guest, base);
    const user = await User.create({
        userName: id,
        email: `${id}@guest.invalid`,
        password: crypto.randomBytes(24).toString('hex'),     // never told: a guest can not sign in with it
        userGroups: ['DESIGNER', 'GUEST'],
        tenantId: id,
        profile: { name: 'Guest' },
    });
    await new Promise<void>((resolve, reject) => req.logIn(user, { keepSessionInfo: true }, error => error ? reject(error) : resolve()));
    // the guest comes back to its models for a year
    req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
}

/** Pages a visitor may see without becoming a guest: sign-in, sign-up, files, the APIs. */
const NO_GUEST = /^\/(login|signup|logout|forgot|reset|account|healthz|api|api2|admin)(\/|$)|\.[a-z0-9]+$/i;

/**
 * The guest middleware, after the session and passport: a visitor's first page makes it a guest; every request
 * of a guest runs in its context.
 */
export function guestMiddleware(configuration) {
    const base = () => configuration.baseDefinitionsPath ?? configuration.definitionsPath;
    // new guests per address: a crawler or a script does not fill the disk
    const newGuests = rateLimit({
        windowMs: 60 * 60 * 1000,
        limit: Number(process.env.GUEST_RATE_LIMIT) || 20,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many new guests from this address; try again later.',
    });
    return [
        (req, res, next) => {
            if (req.user || req.method !== 'GET' || NO_GUEST.test(req.path))
                return next();
            newGuests(req, res, () => newGuest(req, base()).then(() => next(), next));
        },
        (req, res, next) => {
            const id = isGuest(req.user) ? req.user.userName
                : workspaceUser(req.user) && isDesignerGroups(req.user.userGroups) ? req.user.tenantId : null;
            if (!id)
                return next();
            const guest = guestContext(id);
            if (!fs.existsSync(guest.folder))
                seedFolder(guest, base());     // a guest whose folder was cleaned up starts again from the samples
            storage.run(guest, () => next());
        },
    ];
}
