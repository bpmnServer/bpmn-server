# Several applications on one server, and tenants

Status: draft. Built in 3.8; in 3.7 a design constraint that new work must respect (§8).

Related: [API v3](api-v3.md) (the door, user tokens); [business labels, roles and
assignment](https://github.com/bpmnServer/bpmn-server/pull/286) (PR #286); the `tenants` branch (commit 74f7b2d,
with its draft page `docs/docs/drafts/tenants.md`).

## 1. What is asked

- **Several applications on one server.** An HR application and an order application, each with its own models,
  code (its delegate, services, connectors), settings, users and data, served by one BPMN Server installation.
- **Tenants.** One site serving many customers (a hosted service, the public demo), each seeing only its own.

They are the same need: **a workspace** that is a world of its own (models, code, users, data, keys), many of them
behind one site. An application is a workspace; a tenant is a workspace; a customer with two applications has two.
This note uses *workspace*, and settles the words in §9.

## 2. Two ways to build it

| | A. Shared records, an app id on each | B. A workspace is separate (the `tenants` branch) |
|---|---|---|
| Data | One database; every model, instance, item, user, token carries `appId`; every query filters by it | A database per workspace |
| Models | One folder, each model owned by an app | A models folder per workspace |
| Code | The engine loads every application's delegate, and picks one per instance | An engine per workspace, running that workspace's delegate only |
| Messages, signals, timers | Filtered by app id, or they cross workspaces | Per engine: they can not cross |
| Isolation | By every query being right, forever | By construction: there is nothing shared to leak |
| Cost | Little per workspace | An engine process and a database per workspace |

**Proposed: B**, as the `tenants` branch built it. A filter missed in one query of A is a leak between customers;
in B there is no query that could. One workspace's script can not reach another's data, because its engine has no
connection to it. The cost (a process per workspace) is acceptable for applications, which are few, and for a hosted
service with a limit on workspaces per server.

What the `tenants` branch has: `TENANTS_FILE` (each workspace's database, models folder, engine address and key, API
keys, first admin password, services file); the host routes `site.com/<workspace>/...`; users, sessions and keys per
workspace; each workspace's engine started on its own, with `ENGINE_DELEGATE` naming its delegate; tests.

## 3. What is per workspace, and what is the server's

| Per workspace | The server's |
|---|---|
| Models (its folder), instances, items, the Rationale | The host process, its pages and the API's code |
| Users, groups, sessions, user tokens (`wf_tokens` in its database) | The site's address, TLS, the port |
| API keys (service, administration, acting user) | `TENANTS_FILE` (secrets: kept apart from the code) |
| Its engine, delegate, services, connectors and their keys | Monitoring of the whole |
| `settings/config.ts`: labels, columns, roles, assignment policies (PR #286) | |
| Its test environment (`APP_ENV`, its test services) | |

## 4. Identity and the API

- The address names the workspace: `site.com/<workspace>/api/v3/...`, `site.com/<workspace>/dashboard`.
- The door (api-v3.md) first finds the workspace from the address, then the credential **in that workspace**: its
  service key, or a user token from its own `wf_tokens`. A token or key of one workspace means nothing in another.
- A user exists in one workspace. The same person in two workspaces has two accounts (or, later, a sign-in shared
  through an identity provider; not in 3.8).

## 5. PR #286 in a workspace

Business labels, roles and `resolveAssignment` (PR #286) fit B as they are:

- each workspace's `settings/config.ts` holds its `display` and `assignment` settings, and its delegate its
  `resolveAssignment`; the engine that runs a workspace's instances has that workspace's delegate and settings;
- labels and assignments are saved on the instance, in the workspace's database: the host's pages and APIs show
  them without running any workspace's code;
- role and policy names are the workspace's: `Manager` in two workspaces are two different things.

Where a workspace's settings live: today `settings/config.ts` is the application's, in the code. With B, a workspace
is an application with its own code folder (its delegate, services, settings), so each has its own
`settings/config.ts`; `TENANTS_FILE` holds only what is secret or differs per installation (§9).

## 6. Messages, signals, timers, the console

- Messages and signals reach only the instances of the engine they are sent to: one workspace.
- Timers run in each workspace's engine.
- The console (`npm run cli`) works on one workspace: it is given which (today it refuses to start with
  `TENANTS_FILE`).

## 7. Moving to it

- A server with no `TENANTS_FILE` is one workspace, as today: nothing changes for it.
- Making today's application a workspace: its database, models folder and keys go into `TENANTS_FILE` under a name;
  its address gains the prefix. A redirect from the old addresses for a release.
- Data moves between workspaces only by export and import (a backup is per workspace).

## 8. What 3.7 must respect

Built in 3.8, but these hold for everything written in 3.7, so that nothing has to be undone:

1. **No process-wide state for something that belongs to an application.** A module-level map, cache or
   singleton holding users, tokens, keys, settings or models is per server, so it is shared by every workspace.
   Today's examples to fix in 3.8: the first-start setup token (`userAccess/firstRun.ts`) and the AI link's keys
   (`routes/aiAccess.ts` on `ai/remote-api`, kept in memory).
2. **No reading `process.env` at request time for a workspace's value.** The API's door reads `API_KEY` and the
   service account from `process.env` on each call; in a workspace they come from its entry. New code takes such
   values from the server's configuration object, which a workspace can give its own.
3. **Stores through the server instance.** User tokens (`wf_tokens`) are reached through `server.documentStore` or
   the data store, never a module-level connection: each workspace's server has its own.
4. **Settings in `settings/config.ts`, not `.env`** (PR #286): per application by construction.
5. **Labels, assignments and anything shown in lists saved on the instance** (PR #286): the host never needs a
   workspace's code to show them.
6. **API v3 paths relative to a base**: v3's routes and its OpenAPI document take their address from the request
   (as `openapi.json`'s server address already does), so `/<workspace>/api/v3` works without changes.

## 9. Questions to settle

1. The word: *workspace*, *tenant* or *application* in the docs and settings (`TENANTS_FILE` today).
2. A workspace's code: its own folder (delegate, services, `settings/config.ts`) named in `TENANTS_FILE`, or one
   application's code for all workspaces (a hosted service of the same application) with only data apart? The
   `tenants` branch allows both (`ENGINE_DELEGATE`).
3. Starting engines: by hand, as now, or the host starting and supervising each workspace's engine (a separate
   process each, never in the host).
4. Limits per workspace on a shared site (models, instances, requests): the public demo needs them.
5. One person in several workspaces: separate accounts (3.8), or a shared sign-in later.

## 10. Steps (3.8)

1. Rebase the `tenants` branch on 3.7: the door and user tokens per workspace; API v3 under `/<workspace>/api/v3`.
2. The 3.7 leftovers of §8: the setup token and the AI link's keys per workspace.
3. **The host reaches a workspace's data only through that workspace's engine.** In 3.7 a launched server's
   `dataStore` and `definitions` are the engine's own objects (`server/LaunchedServer.ts`): the host reads and writes
   the database directly, and their `.server` leads to the engine when it is in the same process (the `todo` test in
   `bpmn-server/test/engine-results.test.mjs`). Give the launched server data-only stores, or engine calls for them,
   and move bpmn-web's direct uses (dashboards, the API's operations) onto them.
4. The console per workspace; per-workspace backup.
5. Limits per workspace (§9.4), for the public demo.
6. Docs: the draft page moved into Setup; this note's decisions.
