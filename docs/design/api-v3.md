# API v3: one door, operations once, versions as mappings

Status: draft for 3.7. Part 1 of the 3.7 plan; the identity tokens (part 2) are designed here too, as the door needs
them.

## The problem

bpmn-web has three ways in, each with its own identity rule, and each route file implements the operations again:

| Way in | File | Key | Acts as |
|---|---|---|---|
| `/api` | `routes/api.ts` (742 lines) | `API_KEY` | any user the caller names (`userName` in the body or options) |
| `/api2` | `routes/api2.ts` (585 lines) | `API_KEY` | always the service account (`API_SERVICE_USER_NAME`, `API_SERVICE_USER_GROUPS`) |
| `/api2/tasks` | `routes/taskApi.ts` | `API_ACTING_USER_KEY` | `x-acting-user`, with `x-acting-groups` |

What this costs:

- **Fixes made twice, and drift.** start, invoke, assign, throwMessage, throwSignal, startEvent, find, fieldInfo,
  import, rename, delete, list, load, rules/invoke are in both `api.ts` and `api2.ts`. 3.6 found `userId` sent to
  `/api` and ignored, and a task form's own fields saved as data on one path only.
- **A gap.** An application starts a process *for* one of its users only through `/api` (which trusts whatever name it
  is sent), then works on that user's tasks through `/api2/tasks`, with another key.
- **Missing for widgets and agents.** No answer has a task's form (`Definition.getNodeInfo` has the fields and
  `formKey`; bpmn-web's own pages use it; no route returns it), the processes a user may start, or `/me`.
- **No contract.** No OpenAPI document on `main` (the AI branch adds one for `/api2`), so clients and docs guess.

What is already right: **the rules are in one place.** bpmn-server's `BPMNAPI` (`API/API.ts`) takes a `SecureUser` on
every call and qualifies each query with it (`qualifyItems`, `qualifyInstances`, `qualifyStartEvents`); `isSystem()`
guards messages and signals. The routes duplicate the HTTP around it, not the security.

## The shape

```
routes/api/
  door.ts         who is calling: a token, the service key, (later) a signed identity token → a SecureUser
  operations/     each operation once: (user, input) → result; BPMNAPI underneath; no HTTP
  v3.ts           /api/v3/... → operations                (the contract, in OpenAPI)
  v2.ts           /api2/...   → operations                (frozen)
  v1.ts           /api/...    → operations                (frozen, deprecated)
  openapi/        v3.json, v2.json, v1.json: each version's document, served at <base>/openapi.json
```

- **The door** runs once per request, before any version's routes: it finds the credential, turns it into a
  `SecureUser`, and sets `req.user`. Errors, rate limits and CORS are the door's too. A route never reads a header to
  learn who is calling.
- **An operation** is a plain function, `(user, input) => result`, that throws typed errors (`NotFound`, `Refused`,
  `Invalid`, `Conflict`). It calls `BPMNAPI` (or the models datastore, the test runner) with the user. It knows nothing
  of URLs, status codes or body shapes, so a fix reaches every version.
- **A version** is a mapping: for each route, where the input comes from (path, query, body) and how the result and
  the errors are shaped. `v1.ts` and `v2.ts` reproduce today's URLs and shapes exactly, checked by today's tests.

## Identity at the door

Authentication is the application's: BPMN Server never sees a password of the application's users and signs nobody
in. Identity reaches it as a credential, once per request:

| Credential | Header | Acts as | For |
|---|---|---|---|
| **A user token** | `Authorization: Bearer <token>` | the user it was issued for, with their groups | an application's front end or back end, for its users; a person's AI agent |
| **The service key** | `x-api-key: <API_KEY>` | the service account | system work: integrations, imports, messages and signals |
| **The administration key** | `x-api-key: <ADMIN_API_KEY>` | an administrator | `/admin/api/v3` only, as today |
| Later: **an identity provider's token** | `Authorization: Bearer <JWT>` | the token's subject and its groups claim | enterprises with OIDC; checked by signature, no lookup |

A plain `x-user` or `x-acting-user` header is never trusted on v3.

**User tokens**, as 3.6's AI link (`/ai/key`, on the AI branch) already does:

1. The application's back end asks once, with the service key: `POST /api/v3/tokens`, `{ userName, groups, minutes }`.
2. BPMN Server makes a random key, keeps its SHA-256 with the user, groups and expiry, and answers the key only.
3. Every call carries it; the door looks it up. Nothing in the key can be read or changed.
4. It expires by itself; `DELETE /api/v3/tokens?userName=` revokes a user's tokens at once (sign-out, a disabled user).

The groups are the application's to map: its roles become the groups the models use (lanes, candidate groups). Tokens
are kept in the database, not in memory as the AI branch's are, so that several servers behind one address and a
restart keep them.

Which tokens may be asked for is limited: the service key may not issue a token with `SYSTEM`, `ADMIN` or `DESIGNER`
groups (as `x-acting-groups` refuses them today). A person's own token (the AI link) carries their groups, whatever
they are.

## v3's operations

v3 keeps v2's names and adds what an application, a widget and an agent need. All of them act as the caller.

| Area | Operations |
|---|---|
| Me | `GET /me`: name, groups, what the user may do (start, design, administer) |
| Start | `GET /processes/startable`: the processes this user may start, with each start form; `POST /processes/{name}/start` |
| Tasks | `GET /tasks` (mine, available to me, completed), `GET /tasks/{id}` with its form (`fields`, `formKey`), `POST /tasks/{id}/claim`, `POST /tasks/{id}/complete` |
| Instances | `GET /instances`, `GET /instances/{id}` (data, items), `GET /instances/{id}/rationale` (by step), `POST /instances/{id}/events/{elementId}`, `POST /instances/{id}/restart`, `DELETE /instances` (system) |
| Messages | `POST /messages/{id}`, `POST /signals/{id}` (system) |
| Models | `GET /models`, `GET /models/{name}` (XML, `.feature`, editor URL), `GET /models/{name}/elements/{id}` (type, name, documentation, form, assignment), `PUT /models/{name}` (checked; laid out without a diagram), `POST /models/{name}/verify`, rename, delete |
| Tests | `GET`/`PUT /models/{name}/feature`, `POST /models/{name}/test` (each scenario, the failing step, its instances) |
| Rules | `POST /rules/{name}` (a decision table) |
| Tokens | `POST /tokens`, `DELETE /tokens` (service key) |

The models and tests operations are the AI branch's `/api2` additions (`modelApi.ts`), moved onto operations.

**Conventions:** JSON in and out; errors as `{ error: { code, message, details } }` with the status the error's type
gives (400, 401, 403, 404, 409, 422); lists paged by a bookmark (decision 5); dates in ISO 8601; unknown fields ignored by
clients (said in the docs, so fields can be added without a new version).

## Versions from now on

- **A new major only for a breaking change**: a removal, a rename, a change of meaning. New routes, fields and optional
  parameters go into the current version.
- **v1 and v2 are frozen** (v1's caller-named user restricted, decision 1): no features; fixes reach them through the shared operations. They answer with
  `Deprecation` and `Sunset` headers, and the door logs who still calls them. v1 goes at bpmn-web 4.0, announced in the
  changelog; v2 later.
- **An OpenAPI document per version**, served at `/api/v3/openapi.json`, `/api2/openapi.json`, `/api/openapi.json`;
  the docs' API pages are made from them; contract tests check each route against its document.
- **The API's version is not the package's**: "API v3, since bpmn-web 3.7". bpmn-client follows the API: a v3 client;
  the older ones deprecated with their APIs.

## Steps

0. **The bridge** (decision 4): the task's form and starting as the acting user, on `/api2/tasks`.
1. **Operations behind today's tests.** Move what `api.ts` and `api2.ts` do into `operations/`, one by one, with the
   routes calling them; today's web tests (`api.test.mjs`, `api-admin.test.mjs`, `task-api.test.mjs`, ...) unchanged
   and passing after each move.
2. **The door.** Credentials to a `SecureUser` in one place; v1's and v2's identity rules expressed as door rules for
   their paths (v1: the service account, or the caller-named user with `API_IMPERSONATION=true`; v2: the service
   account; `/api2/tasks`: the acting user).
3. **Tokens.** The store, `POST`/`DELETE /tokens`, the door's lookup; the AI branch's `/ai/key` issues them.
4. **v3 and its document.** The routes above, `openapi/v3.json`, the contract tests; the conventions.
5. **v1 and v2 as mappings**, with their documents and the deprecation headers.
6. **Docs**: the API pages from the documents; the guide for agents and `/llms.txt` on v3.

Each step ends with the full web suite passing.

**Status (2026-11-10):** steps 0 to 6 are done on the 3.7 branch. Step 6 made v3's page (`docs/docs/api-v3.md`) from its
document (`npm run api-docs`; a test fails while the page is out of date); v1's and v2's stay described by hand in the
client API page, as they are frozen and their documents are made from the running routers. Next: a v3 bpmn-client.

## Decisions (2026-11-10)

1. **`/api` stops trusting a caller-named user in 3.7.** With the plain `API_KEY`, `/api` acts as the service account,
   as `/api2` does; a `userName` sent in the body or options is ignored, and the answer's `Warning` header says so.
   `API_IMPERSONATION=true` in `.env` brings the old behavior back for integrations that need time to move (to tokens);
   it goes at 4.0. A breaking change: in the changelog and the upgrade notes, with how to move.
2. **Tokens have a collection of their own** (`wf_tokens`), through the storage port: MongoDB, SQLite and memory alike.
   Each holds the key's SHA-256, the user name, groups, who issued it (the service key, or the person themselves),
   issued and expires; expired ones are removed by an index (MongoDB's TTL) or when looked up.
3. **No identity providers' tokens (OIDC/JWT) in 3.7.** An application asks BPMN Server for a user's token.
4. **The bridge on `/api2/tasks` now**, before v3, with its acting-user key and `x-acting-user`:
   - `GET /api2/tasks/:id` answers the task's form too: `form: { fields, formKey }` (`Definition.getNodeInfo`);
   - `POST /api2/tasks/start/:name` starts a process as the acting user (`qualifyStartEvents` decides if they may),
     with the start form's data, and answers the instance and the user's first task if they have one.
   v3 takes both over unchanged in meaning.
5. **Lists are paged by a bookmark**: `limit` and `cursor` in, `items` and `next` out (`next` absent on the last page).
   The cursor is opaque to the client (the last item's sort key and id). The dashboards keep their page numbers.
