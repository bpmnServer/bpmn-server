# 3.8: application integration

**Status:** scope agreed November 25, 2026. This page replaces the 3.8 items scattered through other notes; the
architecture it serves is [target-architecture.md](target-architecture.md), the contract it extends is
[integration-protocol.md](integration-protocol.md) (on `main`).

## Scope

3.8 is about **one thing: integrating an existing application with OWF, side by side**. The application keeps its users,
authentication and business data. OWF runs beside it, not inside it, and the two meet through an identity the application
vouches for, OWF's API and pages, and connectors OWF uses to call the application back.

**Held past 3.8:** tenants and quotas, workspaces per user, fencing, the console and backup per workspace
([multi-app-tenants.md](multi-app-tenants.md)), and Work Management with its own store and a unified My Work page. The
engine's isolation from the host is done in 3.7 ([engine-isolation.md](engine-isolation.md)), but for its step 6, the console on the API.

## What 3.8 contains

| # | Item | State today | To do |
|---|---|---|---|
| 1 | **A portable package** (export and import of several models with their dependencies; 3.7.6) | Designed ([target-architecture.md](target-architecture.md) section 8) | Built in 3.7.6, before 3.8 |
| 2 | **An identity adapter**: the application's signed, short-lived token (or a shared identity provider, or a server-to-server call for a user) validated for issuer, audience, signature and expiry; no user id or role from a browser is trusted | Part: API v3 tokens for a user, the user manager, the service key | A validating adapter, and its settings |
| 3 | **The OWF Host beside the application**: OWF's pages embedded in or linked from the application, its API called by the application's back end | Part: the separated deployment (host and engine apart), API v3, embedded pages by link | The composition: how pages are embedded (an open decision, below) |
| 4 | **The application contract as the one entry point**: the functions, roles, forms, events and permitted operations an application offers, referring to OpenAPI operations rather than copying them | Part: `app-contract.json` (functions, roles, pages), connectors with an operations allowlist, `verify` against the contract | The integration configuration that binds them ([integration-protocol.md](integration-protocol.md) section 3) |
| 5 | **The Integration Workbench**, version 1: application URL or OpenAPI, connection test, operation allowlist, roles, the contract written; manual, or with the user's own AI agent through MCP | Not built; the pieces exist (contract, connectors, `verify`, test stubs, the AI add-on and MCP) | The guided flow |
| 6 | **Progressive integration**: each capability proposed, simulated (a stub tied to a real or proposed interface) or connected; no production writes by default | Part: Gherkin test stubs | Interactive simulation, the state per capability |
| 7 | **A small module in the application**: it calls OWF for events (start a process, send a message or signal, complete a task) as the signed-in user, hands OWF the identity it vouches for (item 2), and answers the pages OWF sends a person to (the identifiers in the address, the task read and completed through the API, then back to `returnTo`) | Part: `BPMNClient3` (a token per user, every API v3 operation), the form-key page protocol, `AssignmentForm.jsx` in the HR demo as the example | The module itself, small and in one package (bpmn-client, or beside it); events from OWF back to the application (task events, webhooks) are the part not designed yet |
| 8 | **Documents and journeys**: model-first and application-first | Part: the integration guide, `building-workflows.md` for agents | One path in the docs for each |

## The working prototype: two servers, side by side

`apps/hrdemo2` (the business application, on its own) and `apps/sampleApp2` (OWF beside it) establish the communication
first, in both directions:

- **Application to OWF:** hrdemo2 asks OWF for a token for the person signed in (with OWF's service key, which stays on
  its server) and passes its pages' calls on to OWF's API v3 as that person (`server/owf.js`: only tasks, cases, the
  processes to start and who they are). Its To do panel lists the tasks that way. Checked: signed in as an HR user, it
  starts *Leave Application* and lists the task, and `/users` and a call with no session are refused.
- **OWF to application:** sampleApp2's connector `hr` is made from the application's own `/api/hr/openapi.json`, with the key
  `HR_SERVICE_KEY` kept by OWF. Checked: the model *List Employees* returns the application's employees.

- **A person sent to OWF's own form, with no second sign-in** ([handoffs](../docs/handoffs.md)): a task with no HR form opens
  through `GET /api/hr/owf/task/:id` on hrdemo2, which asks OWF for a one-visit link (`POST /api/v3/handoffs`) and sends the
  browser to it; OWF shows the form with no menu, completes it as that person and sends them back. Checked end to end: the
  link is spent, the form's fields are drawn, the submit moves the case on, and the session ends.

- **Start forms the same way:** hrdemo2's **Start a process** page lists what the person may start (OWF's API v3 through its
  proxy) and opens a start form in OWF by a handoff (`GET /api/hr/owf/start/:process`); OWF starts it as that person and sends
  them back with `?instance=`. `BPMNClient3.handoffs.task` and `.start` are the application-side call.

Not in the prototype yet: a page in a frame, and OWF's other pages (a case's diagram, the guide) from the application. Events
are out of scope for now (the outbox later), and sending notifications is the application's.

## Open decisions

- **Workbench scope in 3.8:** the whole of item 5, or manual discovery only, with the AI route documented?
- **Embedding the pages:** an iframe (a shared site or cookie arrangement) or a link with a token; this decides items 2 and 3.
- **The token format** the adapter accepts first: a signed JWT with a shared secret or key set, or a shared identity provider.
- **API v3:** it stays as it is (the identity adapter is additive).

## What is not in 3.8, and why

Tenants and quotas serve a shared public server, not an application integrating with OWF. Work Management is an optional
second subsystem with its own store; the architecture does not need it to release 3.8. Both stay in the design notes and
come after.
