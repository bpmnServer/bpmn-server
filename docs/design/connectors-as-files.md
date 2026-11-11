# Connectors as files, beside the models

Status: draft for 3.7 (the 3.7 plan, item 10, noted as a bug; the Fable Review, M4). Related:
[connectors.md](../docs/connectors.md) (connectors today), [multi-app-tenants.md](multi-app-tenants.md) (a workspace's
models folder), `apps/hrdemo` (a connector to its own API).

## 1. Why

A connector is part of the application, as its models are: Assign Employee calls `hr/getEmployee`, and without `hr` the
model can not run. Today a connector lives in the database (`wf_connectors`), so:

- **A copied application has none.** `apps/sampleApp` copied to `apps/hrdemo` brought every model and no connector.
- **A model's tests in memory can not find it.** `GitHub repository.feature` fails with "No connector 'github'":
  `github` was added in one server's database.
- **A new server, a test server, a fresh database start without it.** The HR demo adds `hr` in code at every start
  (`hrConnector`), after the server already listens: an instance resumed at start can call it before it is there.
- **It does not travel with the models through Git** (Release: the tested models reach production as files).

What differs per server is only the key, and sometimes the address.

## 2. The file

A connector is a file in the models folder, beside the models that call it, released with them:

```
processes/
  Assign Employee.bpmn
  hr.connector.json         the connector
  hr.openapi.json           its OpenAPI document (JSON or YAML), as the API publishes it
```

```json
{
  "id": "hr",
  "name": "HR application",
  "description": "Employees, projects and assignments",
  "openapi": "hr.openapi.json",
  "baseUrl": "${env:HR_API_URL}",
  "operations": { "getEmployee": true, "createAssignment": true, "listEmployees": true, "listAssignments": false },
  "groups": [],
  "timeout": 10000,
  "retries": 1,
  "auth": { "type": "apiKey", "in": "header", "name": "x-hr-key", "key": "${env:HR_SERVICE_KEY}" }
}
```

- **The OpenAPI document is a file of its own**, as the API publishes it: readable in a diff, refreshed by replacing it.
  `"openapi"` may also be a URL, read when the server starts and kept as fetched until refreshed.
- **`${env:NAME}`** in a value takes it from the server's settings (`.env`): the address and the key differ per server,
  the file does not. A value missing at start is a warning naming the connector and the setting; its calls fail until
  it is set.
- **Never a secret in the file.** A key is `${env:NAME}`, or set on the server (Administration, stored encrypted with
  `CONNECTORS_KEY`, as today) and kept with that server only.
- The name `*.connector.json` keeps it apart from the editor's element templates (`connectors/*.json`, which stay
  where they are: they are forms for tasks, not connectors).

## 3. What the server keeps

| | In the file (Git, every server) | On the server (its database) |
|---|---|---|
| Id, name, description, document, operations, groups, timeout, retries, the key's scheme | yes | no |
| Address | yes, or `${env:...}` | no |
| The key | `${env:...}` | or set in Administration, encrypted |
| The last connection test | no | yes |
| Enabled | yes (`"enabled": false`) | an administrator may turn it off on this server, without changing the file |

## 4. Loading

- The server reads the models folder's `*.connector.json` **before it is ready** (`server.ready`): no instance, timer
  or test runs before the connectors are there.
- A changed or added file is read again when the models are (the editor's save, `npm run verify`, a release).
- A model's check (verify) and its tests in memory (`npm test`, the editor's Test tab) see the same connectors: they
  read the same folder. A test that must not call out still stubs (`@stub`), or is `@integration`.
- `server.connectors` keeps its interface (`list`, `get`, `call`, `operations`, `document`): the engine, verify, the
  editor and the console do not change.

## 5. Administration and the editor

- **Administration ▸ Connectors** lists them from the files: their operations, address and key (set or not, from where),
  the connection test. On a server whose models come from a release (design off, `DISABLE_DESIGN=true`) the definition
  is read-only there; the key and enabled can be set.
- **Adding a connector** (the editor's wizard, Administration on a design server) writes the two files into the models
  folder, as saving a model does; they reach production through Git with the models.
- **Refresh** replaces the OpenAPI file and says which operations came and went, as today.

## 6. Moving from the database

- At start, a connector in `wf_connectors` with no file is **written out once** to the models folder (its document as
  `<id>.openapi.json`, its key left in the database, encrypted as it was), and the log says so. Nothing is deleted.
- After that, the file is the connector; the database keeps only what §3 says. A release later, the old documents go.

## 7. The HR demo

- `workflow/processes/hr.connector.json` and `hr.openapi.json` (the copy in `server/openapi.json` goes):
  `baseUrl` `${env:HR_API_URL}` (default `http://localhost:${PORT}/api/hr`), key `${env:HR_SERVICE_KEY}`.
- `hrConnector()` goes: nothing is added in code at start.

## 8. Questions

1. **Where**: in the models folder (proposed: released and tested with the models, found by the tests that copy the
   folder), or a folder of its own (`connectorsPath`, `apis/`)?
2. **The document**: a file beside the connector (proposed), or inside it?
3. **The key**: `${env:NAME}` and Administration's encrypted key both (proposed), or only one of them?
4. **Moving**: written out at start once (proposed), or by a command (`npm run cli`, `connectors export`)?
5. **A connector of several applications** (one API, many models folders): copied into each folder, or a shared folder
   later (with 3.8's workspaces)?
