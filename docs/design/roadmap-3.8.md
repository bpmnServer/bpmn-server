# 3.8: application integration

**Status:** scope agreed November 25, 2026; delivery phases clarified November 26, 2026. This page replaces the 3.8 items scattered through other notes; the
architecture it serves is [target-architecture.md](target-architecture.md), the contract it extends is
[integration-protocol.md](integration-protocol.md) (on `main`).

## Scope

3.8 is about **one thing: integrating an existing application with OWF, side by side**. The application keeps its users,
authentication and business data. OWF runs beside it, not inside it, and the two meet through an identity the application
vouches for, OWF's API and connectors OWF uses to call the application back. UI embedding is an optional subsequent increment.

**Held past 3.8:** tenants and quotas, workspaces per user, fencing, the console and backup per workspace
([multi-app-tenants.md](multi-app-tenants.md)), and Work Management with its own store and a unified My Work page. The
engine's isolation from the host is done in 3.7 ([engine-isolation.md](engine-isolation.md)), but for its step 6, the console on the API.

## Delivery order

**Phase 1 — services only.** Deliver the two-way service integration, identity, contract, connector permissions and service-level tests first. No browser SDK, embedded pages, UI refactoring or new UI composition is needed. Workbench UI is not a Phase 1 dependency; use existing tools, manual configuration or agent-assisted discovery.

**Phase 2 — embedded OWF UI.** Use a versioned JavaScript SDK with two application-owned DOM containers: controller and details. OWF manages selection and rendering without taking over host navigation.

**Phase 3 — optional advanced composition.** Host form handoff, shared details and standalone widgets. Phase 2 and 3 release assignments are not fixed. See [Side-by-side integration design](embedded-ui-integration.md) for interfaces and acceptance criteria.

## What 3.8 contains

The table records the overall integration work; UI-dependent portions are deferred beyond the services-only first delivery.

| # | Item | State today | To do |
|---|---|---|---|
| 1 | **A portable package** (export and import of several models with their dependencies; 3.7.6) | Designed ([target-architecture.md](target-architecture.md) section 8) | Built in 3.7.6, before 3.8 |
| 2 | **An identity adapter**: the application's signed, short-lived token (or a shared identity provider, or a server-to-server call for a user) validated for issuer, audience, signature and expiry; no user id or role from a browser is trusted | Part: API v3 tokens for a user, the user manager, the service key | A validating adapter, and its settings |
| 3 | **The OWF Host beside the application**: its API called by the application's back end; optional embedded UI later | Part: the separated deployment (host and engine apart), API v3, embedded pages by link | Phase 1: services. Phase 2: controller/details SDK (decided) |
| 4 | **The application contract as the one entry point**: the functions, roles, forms, events and permitted operations an application offers, referring to OpenAPI operations rather than copying them | Part: `app-contract.json` (functions, roles, pages), connectors with an operations allowlist, `verify` against the contract | The integration configuration that binds them ([integration-protocol.md](integration-protocol.md) section 3) |
| 5 | **The Integration Workbench**, version 1: application URL or OpenAPI, connection test, operation allowlist, roles, the contract written; manual, or with the user's own AI agent through MCP | Not built; the pieces exist (contract, connectors, `verify`, test stubs, the AI add-on and MCP) | The guided flow |
| 6 | **Progressive integration**: each capability proposed, simulated (a stub tied to a real or proposed interface) or connected; no production writes by default | Part: Gherkin test stubs | Interactive simulation, the state per capability |
| 7 | **A small module in the application**: it calls OWF for events (start a process, send a message or signal, complete a task) as the signed-in user, hands OWF the identity it vouches for (item 2), and answers the pages OWF sends a person to (the identifiers in the address, the task read and completed through the API, then back to `returnTo`) | Part: `BPMNClient3` (a token per user, every API v3 operation), the form-key page protocol, `AssignmentForm.jsx` in the HR demo as the example | The module itself, small and in one package (bpmn-client, or beside it); events from OWF back to the application (task events, webhooks) are the part not designed yet |
| 8 | **Documents and journeys**: model-first and application-first | Part: the integration guide, `building-workflows.md` for agents | One path in the docs for each |

## Open decisions

- **Workbench scope in 3.8:** the whole of item 5, or manual discovery only, with the AI route documented?
- **UI embedding:** decided — two application-provided DOM containers, with OWF SDK composition in Phase 2. Existing links/form-key pages remain supported. Exact SDK implementation remains open.
- **The token format** the adapter accepts first: a signed JWT with a shared secret or key set, or a shared identity provider.
- **API v3:** it stays as it is (the identity adapter is additive).

## What is not in 3.8, and why

Tenants and quotas serve a shared public server, not an application integrating with OWF. Work Management is an optional
second subsystem with its own store; the architecture does not need it to release 3.8. Both stay in the design notes and
come after.
