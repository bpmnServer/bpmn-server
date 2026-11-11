# Users belong to the host application

Status: draft for 3.7. Related: [setup-wizard.md](setup-wizard.md), [multi-app-tenants.md](multi-app-tenants.md),
`apps/hrdemo` (the first application with its own users).

## 1. Why

An application that embeds BPMN Server (owf) has its own people: an HR system signs in its employees, keeps their roles
and their sessions in its own database. Today bpmn-web brings a second set: its own users, sessions, sign-in pages,
first-run page and Administration ▸ Users. An application has to keep both in step, and its people sign in twice.

The engine does not need any of that. It needs to know **who acts**, nothing else.

## 2. What the engine needs: who acts

Each call carries an `IUserInfo` (`userName`, `userGroups`, `tenantId`, `modelsOwner`); the engine makes it an
`ISecureUser` and checks it against a task's assignee, candidate users and candidate groups, and filters its queries by
it. It never looks anyone up, so bpmn-server has no user service: `IUserService` is removed from it (3.7).

Finding, adding and changing users is bpmn-web's own user manager's (its `UserService`, §4), not something the engine
asks. The sample delegate's `getUserNamesInGroup` and `getUsersInfo` call a `server.userService`
that does not exist: an application that needs to find people (a group's emails) asks its own users.

## 3. What the web pages need: who is signed in, and where to sign in

bpmn-web's pages and APIs need, on each request:

- **the person**: `req.user`, an `IUserInfo` (with `email`), or none;
- **a session**: `req.session`, where the pages keep their state: the CSRF secret, messages, their API token;
- **where to sign in and out**: a page that needs someone sends them to `/login`; signing out is `/logout`.

These come from a **user manager**, given to `start({ userManager })`:

```ts
interface IUserManager {
    /** First: the sessions, and on each request req.user (who is signed in) and req.isAuthenticated(). */
    init(app): void;
    /** Before bpmn-web's routes: /login and /logout (its own pages, or the host's). */
    setup(app): void;
    /** Who an API call (/api/v3) is from, by the host's own credential; null: not one of the host's. */
    apiUser?(req): Promise<IUserInfo | null>;
}
```

bpmn-web adds, whatever the user manager: messages, CSRF protection, the menu, the page to go back to after signing in.

### The API: the host's credentials (decided 2026-11-11)

With the host's user manager, **the host issues the credentials**, and owf issues none:

- A call to `/api/v3` is from whoever `apiUser(req)` says, by the host's own credential (its token, its JWT, its
  session): owf asks, and acts as that person, its security rules on. One credential per person; the host's revoking
  holds at once.
- The pages call `/api/v3` (on the server, `pageClient.ts`) with the visitor's own credential (their cookie, their
  `Authorization`), not a token of owf's: the host's `apiUser` knows them the same way.
- owf's tokens are not issued or taken: `POST /api/v3/tokens` refuses (`TOKENS_ELSEWHERE`), and so does `/ai/key`, an AI
  agent's link: an agent gets its credential from the host, which gives it the access it decides.
- The service key (`API_KEY`), `/api`, `/api2` and the acting-user key are unchanged: they are the server's, not a
  person's.
- Without `apiUser`, only the service key opens `/api/v3`, and the pages that call it (My work, starting a process)
  answer that no one is signed in: a host that uses bpmn-web's pages gives `apiUser`.
- A credential that is a cookie (the session) can not change anything from another site: API v3 refuses a write whose
  `Sec-Fetch-Site` or `Origin` says another site (`CROSS_SITE`, `crossSiteWrite` in `door.ts`, exported). The host's
  own routes under `/api` are not CSRF-checked by bpmn-web: the host checks them the same way, and keeps its session
  cookie `SameSite=Lax` or `Strict`. (Fable Review H1, 2026-11-11.)

## 4. Two user managers

| | bpmn-web's own (the default) | The host's (`start({ userManager })`) |
|---|---|---|
| Users | its `users` collection (the engine's store) | the host's database |
| Sessions | its `sessions` collection | the host's |
| Sign-in | its pages: `/login`, `/signup`, `/forgot`, `/account` | the host's: bpmn-web's `/login` sends there |
| First run | the first-run page asks for the administrator | none: the host has its users |
| Administration ▸ Users, `/api/v3/users`, the console's users | manage its users | say the host manages them |
| Groups | as set in Administration | the host's: its roles become groups (`ADMIN`, `DESIGNER`, a task's `HR`) |
| API credentials | owf's tokens: the pages', `/ai/key`, `POST /api/v3/tokens` | the host's (`apiUser`); owf issues none |

bpmn-web's own keeps everything it does today, unchanged: no setting changes, no data moves.

## 5. The HR demo (`apps/hrdemo`)

- Its users and sessions in its own SQLite file (`data/hr.sqlite`), passwords hashed (scrypt); a role gives the workflow
  groups, the models' lanes (HR Administrator: `Employee`, `HR`, `ADMIN`; Manager: `Employee`, `Manager`; Employee:
  `Employee`).
- One sign-in page, `/hr/login`, for its pages and the workflow pages (their `/login` comes here); Users and My Account
  pages of its own.
- Its user manager (`server/userManager.js`) is what `start()` gets; its `apiUser` takes its session (the pages).
- Its API: an HR session from the pages, or the workflows' key (`HR_SERVICE_KEY`, header `x-hr-key`) through the
  connector `hr`.

## 6. Questions

1. **The pages' session.** bpmn-web keeps its pages' state (CSRF secret, messages, API token) in the host's session
   (`req.session`). The alternative, bpmn-web keeping a small cookie of its own, means two cookies and a second session
   to expire. Proposed: the host's.
2. **`IUserService`**: removed from bpmn-server, decided (2026-11-11). The sample delegate's calls to
   `server.userService`, which never existed, ask the application's users instead.
3. **The console's users** (`npm run cli`): bpmn-web's own users only; with the host's, the console says so.
