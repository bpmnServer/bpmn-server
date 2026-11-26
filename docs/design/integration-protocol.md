# OWF Integration Protocol

**Status:** Architecture contract / proposed extensions (2026-11-16). Existing OpenAPI connector behavior is documented in [Connectors](../docs/connectors.md); native-form lookup and entity inference described here are not yet implemented.

This is the **single entry point** for OWF's application integration contract. Other integration, connector, form and verification documents should link here rather than independently define connector permissions, discovery or lookup semantics.

## Delivery phases (decision 2026-11-26)

**Phase 1 is services only**: API v3, trusted identity, application contract, approved connector operations and service-level verification. No embedded UI, browser SDK or UI refactoring is required. The later UI phase uses two host-provided DOM containers (controller and details), with OWF managing selection and rendering. Application-specific form handoff and richer composition can follow. See [Side-by-side integration design](embedded-ui-integration.md) for the UI contract and phase acceptance criteria. The service contract remains independent of the UI.

## 1. Boundary and principle

The host application owns users, authorization of business records, authoritative business objects, API implementations, and application forms. OWF owns workflow instances, items, assignments, forms it renders, and orchestration.

**OpenAPI describes what is possible; application-scoped connector configuration declares what OWF is permitted to use; the BPMN model or OWF form declares what is actually used.**

An allowlisted operation is not a grant to see every record. The target application continues to enforce user/tenant/row permissions.

## 2. Integration surfaces

| Surface | Direction | Contract |
| --- | --- | --- |
| Workflow API and events | Application → OWF | Authenticated workflow API; optional named webhooks when implemented |
| Outbound operations | OWF → Application | Named connector + operation, `<connector>/<operationId>` |
| Human interaction | Both | Host-owned page/form referenced by BPMN start event or user task; or OWF-rendered native form |
| Business object lookup | OWF native form → Application | Approved connector list/search/get operation discovered via OpenAPI |
| Workflow/task information | Both | Workflow API, notification, or explicitly configured synchronization |
| Custom code | Both | Optional delegates / services as escape hatches |

Launching a host-owned form is already a supported integration pattern. A native OWF lookup is an additional presentation capability, not a replacement for application forms.

## 3. Single source of integration definitions

The **application integration configuration** is the entry point that binds application-visible integrations to underlying connectors and their *allowed operations*. It also scopes roles, environment-specific bindings, and optional lookup hints. OWF must resolve every design-time and runtime request through this effective application configuration.

OpenAPI connector files currently live alongside models as `<id>.connector.json` and already include an `operations` allowlist; do not create a second contradictory allowlist. In the present single-application architecture, this existing connector file supplies the operation filter. In a multi-application deployment, the effective allowed set is the intersection of the connector's enabled operations and the application's permitted operations.

Example **conceptual application-scoped configuration** (illustrative, not an existing schema):

```json
{
  "integrations": {
    "hr": {
      "connector": "hr",
      "operations": ["listEmployees", "searchEmployees", "getEmployee"]
    },
    "projects": {
      "connector": "projects",
      "operations": ["listProjects", "getProject"]
    }
  }
}
```

The existing connector file is still the source for endpoint/OpenAPI document and connector-level enabled operations, authentication scheme, etc. Secrets remain outside versioned application files. No arbitrary URL is accepted from a form field. Disabled/unlisted operations are neither discoverable nor callable, including by direct API requests or imported models.

## 4. OpenAPI operation discovery

Read the OpenAPI 3.0/3.1 specification associated with each approved connector and consider **only operations in the effective allowlist**. Infer potential entities and list, search and get capabilities using operationId, tags, route patterns, request parameters, and response schemas. This inference is heuristic: OpenAPI does not inherently declare a canonical business entity, its display property, or whether a GET operation is a search. Never silently present an uncertain inference as fact.

For each discoverable entity, derive a *view*, not an independently persisted business object model:

| Inferred capability | Evidence |
| --- | --- |
| List | Approved collection operation returning an array/page |
| Search | Approved list/search operation with filter/query parameters |
| Get by ID | Approved operation taking an identity/path parameter |
| Search criteria | Parameter schemas, descriptions, required flags, enums |
| Result columns | Response schema, including paging envelope when identifiable |
| Identifier/display | Inferred from schema; confirmed or overridden when ambiguous |

Allow small overrides for ambiguous operation mappings, value/display fields, response array paths, and pagination. Optional `x-owf-*` OpenAPI extensions may improve discovery, but must never expand the application allowlist. No requirement to alter existing host APIs.

## 5. Native-form lookup contract (proposal)

Define a reusable native-form `lookup` field. It references a discovered permitted entity/capability (or a named permitted operation) and supports three UI modes:

- **Dropdown** for a bounded list.
- **Autocomplete** for text search.
- **Search dialog** for multi-criteria search with paging and results table.

Illustrative form definition, not a current implemented format:

```json
{
  "name": "employeeId",
  "type": "lookup",
  "label": "Employee",
  "connector": "hr",
  "entity": "Employee",
  "operation": "searchEmployees",
  "mode": "autocomplete",
  "valueField": "id",
  "displayField": "name"
}
```

The lookup submits the selected **business ID** (e.g. `{"employeeId":"E101"}`) to the workflow, not a copy of the entire Employee/Project. Optional display labels are transient or explicitly captured snapshots; business records remain authoritative in the host app. Start forms and user-task forms may use the same native lookup mechanism.

At runtime: apply configured input mapping and limits → enforce effective operation allowlist → call connector through OWF backend (never expose credentials to browser) → normalize/filter/page results → render selection → submit ID. Support loading the display value for an existing ID with an approved `get` operation. A choice must be revalidated on submit where business integrity requires it.

## 6. Design-time and verification contract

The editor and `verifyModel` must use the same effective application integration definition as runtime.

- Offer only enabled, allowed connectors and operations.
- Suggest only inferable lookup entities/capabilities; prompt for mapping where metadata is ambiguous.
- Use OpenAPI inputs, output schemas, types, required fields and enums for field assistance and validation.
- Diagnose missing connectors, disallowed/disabled operations, unavailable search/list/get methods, unmapped response arrays, invalid ID/display fields, and incompatible input mappings.
- Re-check against changed connector configuration/specifications at verification and execution time; imported model/form definitions are not trusted grants.

Existing connector task verification remains authoritative for existing service/send tasks. New lookup diagnostics need a separate implementation and test coverage.

## 7. Security and operational concerns

- Enforce allowlists **server-side** both for model tasks and interactive lookup requests.
- Preserve target application's authentication and per-user/tenant authorization. A connector-level service credential alone must not leak organization-wide records to a user form; proxy delegated user identity where supported, otherwise expose only deliberately restricted lookup endpoints.
- Never deliver connector credentials or unrestricted OpenAPI endpoints to the browser.
- Bound result sizes, timeouts, rate limits, caching, logging, and paging; debounce autocomplete; avoid logging sensitive returned records.
- Prevent URL/host changes through form inputs; apply connector host restrictions.
- Treat OpenAPI changes and allowlist changes as configuration/versioned validation events.

## 8. Compatibility and rollout

1. **Baseline (existing):** OpenAPI connectors, connector operation allowlisting, designer operation selection, runtime checks and verification for service/send tasks; optional host application forms.
2. **Design extension:** expose approved-operations discovery as a shared integration metadata view for form editor and verifier.
3. **Native lookup:** dropdown, autocomplete, search dialog, response and pagination mappings, ID-only submission.
4. **Multi-application:** resolve effective permissions by application scope without broadening existing connector allowlists.

This document defines the desired protocol, not a claim that native lookups or application-scoped integration configuration are shipped.

## Related documentation

- [Application integration design](application-integration-design.md) — architecture and lifecycle.
- [Connectors](../docs/connectors.md) — implemented connector format, permissions and operations.
- [Integrate an existing application](../docs/integrate.md) — how host applications connect.
- [Connectors as files](connectors-as-files.md) — existing connector persistence decisions.
