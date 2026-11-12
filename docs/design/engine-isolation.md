# The host writes nothing of the engine's

Status: built in 3.7 (2026-11-11), but for step 6 (the console on the API), left for later. The Fable Review, H3; [multi-app-tenants.md](multi-app-tenants.md) §10 step 3, brought
before tenants. Related: [architecture.md](../docs/architecture.md) (Isolation), `server/LaunchedServer.ts`.

## 1. Why

`architecture.md` says the host "writes only through the engine", and that the engine, in a process of its own
(`ENGINE_AT`), is the only one with the application's data and secrets. Today only running is the engine's: the host
(bpmn-web) still has the engine's own `dataStore`, `definitions` and `connectors` (`LaunchedServer`, its known gap) and
writes through them. So a "separate engine" still needs, on the host:

- the database's credentials, with write rights;
- the models folder, writable;
- `CONNECTORS_KEY` (it encrypts a connector's key when Administration sets it).

A host that is broken into has all the engine has but running code; and 3.8's workspaces can not give each its own
engine while the host writes their data.

## 2. Who owns what

| Data | Owner | Who writes it |
|---|---|---|
| Instances, their items and data; timers | engine | the engine (already) |
| Locks (`wf_locks`) | engine | the engine; today also Administration (release), the task API (claim), the console, `WebAppDelegate` |
| Models: the folder (`.bpmn`, `.feature`, versions) and their index (`wf_models`) | engine | today the host: the editor, API v3, the Design dashboard, the catalog import |
| Connectors: their files, and each server's keys and tests (`wf_connectors`) | engine | today the host: Administration |
| Users, sessions, API tokens, the API trace | host | the host (they are the host's: its people, its doors) |

## 3. Proposal

**Every write of the engine's data is an engine call.** `LaunchedEngine` gets the calls the host needs, served by
`engineCalls` where the engine is (in the process, or at `ENGINE_AT`), as `start` and `invoke` are:

| Calls | Instead of |
|---|---|
| `models.save(name, source, svg, by)`, `models.rename`, `models.delete`, `models.deleteVersion`, `models.import` | `definitions.save`, `renameModel`, `deleteModel`, `deleteVersion` |
| `locks.release(id)`, `locks.releaseAll()`, `locks.claim(key)`, `locks.releaseClaim(key)` | `dataStore.locker.*` |
| `connectors.add`, `update`, `refresh`, `remove`, `setKey`, `clearKey`, `test` | `server.connectors.*` |
| `install()` (the stores' indexes at setup) | `dataStore.install`, `definitions.install` |

**The host keeps reading** through a **read-only** data port: `LaunchedServer.dataStore`, `definitions` and
`connectors` become read-only views (find, list, get, the model's source and SVG, the connector's operations); a write
through them throws, naming the call to use instead. Two ways for those reads, to decide (§4.1).

**What follows:**

- With the engine elsewhere, the host needs no write rights on the database, no writable models folder, no
  `CONNECTORS_KEY`: only the engine's address and key.
- In one process (the default), nothing changes for anyone: the calls are function calls.
- A test makes the host's store throw on any write of the engine's collections, and runs bpmn-web's suites against it.
- `architecture.md`'s Isolation table becomes true; the `todo` test in `engine-results.test.mjs` passes.

## 4. Decided (2026-11-11)

1. **Models are not the engine's to write.** The host reads and writes the models' files; with 3.8's workspaces a
   lighter component may hold a workspace's models, with **files only, no database**. So a model write touches no
   database: the host checks the model and writes its files; the engine keeps its own index of the models
   (`wf_models`: start events, timers, messages) and is told, by an engine call, which model changed.
2. **The host reads instances through the instance viewer, a lightweight reader**: a small read-only component over the database (find
   instances and items, count, list locks), apart from the engine and holding none of its objects; a write through it
   throws. Not through the engine: every page would be a call to it, its answers whole instances (H5), and the engine
   would carry the pages' load beside running processes. The reader can later run apart from the host, as the
   models' file-only component can.
3. **Tests run through the engine only**: a test's runs, its instances and what it records.
4. **Now, in 3.7.**
5. **The console calls the server's API**, as any client: it needs the server running, and holds none of its objects.
6. **Connectors are files** (connectors-as-files.md), so their definitions are written as the models are, by the host.
   What is still in the database, each server's key (encrypted with `CONNECTORS_KEY`) and last test, is the engine's:
   `setKey`, `clearKey` and `test` are engine calls, and the host needs no `CONNECTORS_KEY`.

## 5. Four components, apart (2026-11-11)

| Component | Holds | Reaches | The host asks it |
|---|---|---|---|
| **Engine** | running processes; instances, timers, locks; each server's connector keys and tests | the database (read and write), the models (read), the application's code | to run, to change an instance, to release a lock, to set a key (engine calls) |
| **Model access** | the models and their tests, the connectors' files | files only: no database | to read, check, write, rename and delete a model or a connector's file |
| **Instance viewer** | nothing of its own | the database, read only | to list and show instances, tasks and locks |
| **User manager** | users and sessions | its own store: bpmn-web's (the default) or the application's ([host-users.md](host-users.md)) | who is signed in, `/login`, `/logout`, the API's credential (`IUserManager`) |

The host (bpmn-web) is the web around the four: the pages, the APIs and their door, with only its API tokens and the
API trace of its own. In one process, as today, they are objects; each can run apart: the engine already
(`ENGINE_AT`), the user manager when an application gives its own, model access and the instance viewer with 3.8's
workspaces, a workspace's models and instances each behind its own.

## 6. Steps

1. **Locks**: `locks.release`, `locks.releaseAll`, `locks.claim`, `locks.releaseClaim` engine calls; Administration, the
   task API and `WebAppDelegate` use them.
2. **Connectors**: their files written by the host, as the models; `setKey`, `clearKey` and `test` engine calls, the key
   encrypted where the engine is; the host needs no `CONNECTORS_KEY`.
3. **Models**: the models' files written by a file-only part (no database), the model checked before; the engine's
   index updated by `models.changed(name)`, `models.renamed(from, to)`, `models.removed(name)`; the stores' setup
   (`install`) an engine call.
4. **Tests**: what the Test tab and `/api/v3/models/{name}/test` write, written by the engine.
5. **The instance viewer and model access**: `LaunchedServer.dataStore` becomes the instance viewer (reads only, a write throws naming the call);
   `definitions` model access; a test runs bpmn-web's suites with them so; the `todo` test passes.
6. **The console** on the API. **Left for later** (2026-11-11): until then it runs in the host's process and uses
   the engine calls (locks, a connector's key, test and removal, deleting instances). On the API it needs routes v3 does
   not have (connectors, locks, items and recovering one, the models' events, a process's instances deleted), for an
   administrator, and per workspace under `/<workspace>/api/v3` (multi-app-tenants.md).
7. **Docs**: architecture.md's Isolation, setup.md (what a host needs with the engine elsewhere).
