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
