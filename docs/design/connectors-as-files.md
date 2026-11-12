# Connectors as files, beside the models

Status: built (3.7, 2026-11-11). The 3.7 plan, item 10 (noted as a bug); the Fable Review, M4. Related:
[connectors.md](../docs/connectors.md), [multi-app-tenants.md](multi-app-tenants.md) (a workspace's models folder).

## 1. Why

A connector is part of the application, as its models are: Assign Employee calls `hr/getEmployee`, and without `hr` the
model can not run. It was kept in the database (`wf_connectors`), so:

- **A copied application had none.** `apps/sampleApp` copied to `apps/hrdemo` brought every model and no connector.
- **A model's tests in memory could not find it.** `GitHub repository.feature`: "No connector 'github'".
- **A new server, a test server, a fresh database started without it**, and it did not travel with the models through
  Git (Release: the tested models reach production as files).

What differs per server is the key, and the last connection test.

## 2. Decided (2026-11-11)

- **One file per connector, in the models folder's `connectors` folder**: `connectors/<id>.connector.json` (at first
  beside the models: a file left there is moved in when read), the same document the collection held
  (id, name, description, base URL, operations, groups, enabled, timeout, retries, the key's scheme, created and
  changed), with its OpenAPI document as JSON (no longer gzipped: readable in a diff).
- **Not in the file**: the key (encrypted with one server's `CONNECTORS_KEY`; another server could not read it, and a
  key has no place in a repository) and the last connection test. Each server keeps both in `wf_connectors`.
- **The same interface**: `server.connectors` keeps its methods (`list`, `get`, `add`, `update`, `refresh`, `remove`,
  `setKey`, `clearKey`, `test`, `call`, `operations`, `document`); the engine, verify, Administration, the editor's
  wizard and the console are unchanged. Writing a connector writes its file, as saving a model does.
- **Moving**: a connector kept whole in the collection (3.6) is written out to its file the first time it is read (or
  at `install`), and its collection document is cut down to its key and test. Nothing is deleted.
- The editor's element templates (`connectors/*.json`) stay where they are: they are forms for tasks, not connectors.

## 3. The file

```json
{
  "id": "hr",
  "name": "HR application",
  "baseUrl": "http://localhost:3100/api/hr",
  "operations": { "getEmployee": true, "listEmployees": true, "createAssignment": true },
  "groups": [],
  "enabled": true,
  "auth": { "type": "apiKey", "in": "header", "name": "x-hr-key" },
  "openapi": { "version": "3.0.3", "title": "HR API", "fetchedAt": "...", "bytes": 12345, "document": { "openapi": "3.0.3", ... } },
  "createdAt": "...",
  "updatedAt": "..."
}
```

A file changed by hand is read again when it changes (its time and size). Its `id` must be its file's name.

## 4. Later, not built

- **An address per server** (`baseUrl` from `.env`): a server whose API is elsewhere changes the file's address
  today (Administration). `${env:NAME}` in the file is the way, when a release needs one file for several servers.
- **A key from `.env`** instead of Administration's encrypted one.
- **A connector shared by several applications**, with 3.8's workspaces.
