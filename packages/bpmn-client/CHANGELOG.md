# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!---
your comment goes here
and here
## [Unreleased]
### Added

### Changed
-->
## [Unreleased]

## Release 3.6.0 (2026-11-10)
### Changed
- `definitions.load()` reads `/api` with `API_KEY`, so reading a model needs no administration; on an older server
  it falls back to `/admin/api`.

### Fixed
- **The user given to `engine.start`, `invoke`, `assign` and `restart` was ignored**: it was sent as `userId`, which the
  server does not read. It is sent as `userName`, so a process started for `user1` has `user1` as its initiator.
- The contract tests ran against no server in this repository, and were skipped: they find testSampleApp's harness now.

## Release 3.5.2 (2026-11-04)
No changes to bpmn-client; released with bpmn-server and bpmn-web 3.5.2, which share its version.

## Release 3.5.1 -- 2026-11-02
### Fixed
- `bpmn-client-cli`: `lm` (list models) failed with the admin key's error. `definitions.list()` now reads
  `/api` with `API_KEY`, so it works with administration off; on a server before 3.5.1 it falls back to
  `/admin/api`.
- `bpmn-client-cli` passes `ADMIN_API_KEY` from `.env` for the administration calls, and `bpmn-client-setup`
  writes it.

## Release 3.5.0 -- 2026-11-02
Released with bpmn-server and bpmn-web 3.5.0, now in one repository and with the same version; the client's
API is unchanged from 3.1.0.
### Changed
- `repository` is the bpmnServer/bpmn-server repository, folder `packages/bpmn-client` (it pointed to an earlier
  repository, with a malformed URL).
- The package's own `package-lock.json` is gone: the repository's workspace lockfile is used.
- README: installing is `npm install bpmn-client`, then `npx bpmn-client-setup` (writes `.env`) and
  `npx bpmn-client-cli`; cloning bpmn-client-sample is no longer needed (it remains a complete example).

## Release 3.1.0 -- 2026-10-29
Aligns the client with bpmn-web/bpmn-server 3.x; found by the new contract tests. Verified against
bpmn-web on bpmn-server 3.2.0 (runtime model reads: `model.list`, `findStartEvents`, `findEvents`).
### Fixed
- Failed calls reject with the server's message instead of resolving `undefined` (which made
  callers fail with "Cannot read properties of undefined"): HTTP errors (`401 ...`, `403 ...`),
  failures in a 200 answer (`{ errors }` and `{ error }`; `engine.start` reports `{ error }`), a web
  page instead of the API, and connection errors.
- `BPMNClient2.data.findItems` posts (the server's `/api2/data/findItems` is POST); it returned nothing.
- Model administration goes where the server serves it: `BPMNClient2.model.*` to `/admin/api2/model/*`
  (import was sent to `/api/model/import`), `BPMNClient.definitions.*` and
  `datastore.deleteInstances` to `/admin/api/*`.
- `BPMNClient.definitions.load` is typed as returning the XML source, which the legacy API returns.
### Added
- `BPMNClient2.model.list`, `findStartEvents`, `findEvents` read with the runtime key on servers that
  serve model reads on `/api2` (bpmn-web with bpmn-server 3.2), else from `/admin/api2` with the admin key.
- An empty `errors: []` in an answer is not a failure.
- `new BPMNClient2(host, port, apiKey, { adminApiKey })` (and `BPMNClient`): the key of the
  server's administration API; defaults to `apiKey`.
- Tests: `test/unit` (request shapes and failures against a recording server) and `test/contract`
  (every method against a real bpmn-web). `npm test` runs both; the older scenarios are `npm run test:live`.

## Release 2.2.4 -- 2024-05
- Fix api dataStore/findInstances(query,projection)
## Release 2.1.5 -- 2024-03
- added engine.startEvent
### cli enhancements
- support double quotes, so parameters like: `name "Buy Used Car" ` can now work
- support backspace on input


## Release 2.1.0 -- 2024-03
- added engine.restart
