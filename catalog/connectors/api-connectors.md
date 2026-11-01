# API Connectors — BPMN Server Enhancement Design

TODO:

1.  verify should check for valid connections, input/output
2.  editor should give list
3.  cli should add: add-connector
                    test-connector
                    



**Status:** Proposed design  
**Date:** 2026-11-01  
**Scope:** OpenAPI-driven connector catalog, service-task configuration, runtime execution, CLI, web modeler, and VS Code tooling.

Generate one lightweight profile per catalog connector with:

```text
node catalog/connectors/generate-profiles.mjs
```

Profiles are written to `profiles/<id>.json`, with an aggregate `profiles/catalog.json`.
The generator fetches each OpenAPI document and emits the operations described in section 4.1:
connector reference, package version, method, base URL, path, authentication, and parameters.
It never writes credentials.

## 1. Overview

Provide BPMN Server with reusable REST API connectors generated from OpenAPI specifications. Instead of implementing a connector for each API operation, import OpenAPI operations as metadata and run them through a common HTTP executor.

**Key decision:** Reuse the independently exported parser and API catalog from `@bpmnkit/connector-gen`; **do not reuse its Camunda/Zeebe-specific template output**. Generate BPMN Server-native connector definitions and bindings instead.

```text
OpenAPI URL/file    BPMN Kit API Catalog (~100 entries)
        \                   /
         OpenAPI import + normalization
                    |
           Connector Registry
                    |
        +-----------+-----------+
        |           |           |
   BPMN Modeler    CLI      VS Code
        \           |           /
           Service Task Binding
                    |
             HTTP Executor
                    |
     Credentials / Policy / HTTP API
                    |
           Workflow Variables
```

### Intended outcomes

- Import OpenAPI 3.x JSON/YAML and, through BPMN Kit conversion, Swagger 2.0.
- Discover searchable APIs and individual operations with parameter schemas.
- Bind a BPMN service task to an operation without writing a new handler for every endpoint.
- Execute calls with safe credentials, input/output mapping, retries, and BPMN-compatible failures.
- Make the same connector functionality available to the web modeler, CLI, VS Code extension, and BPMN Script DSL.
- Preserve connector metadata and bindings through BPMN XML ↔ BPMN Script round trips.

### Non-goals for initial release

- A full iPaaS or event-streaming connector platform.
- Automatic support for every operation in the catalog regardless of body format, OAuth flow, or API idiosyncrasy.
- Coupling the runtime to Camunda element templates or Zeebe workers.
- Replacing BPMN Server's existing task execution mechanisms.

## 2. Source Investigation and Reuse Decision

Reviewed in `bpmnkit/bpmnkit`, package `packages/connector-gen`:

| Source | Finding | Decision |
| --- | --- | --- |
| `src/index.ts` | Exports `parseOpenApi`, `getOperations`, `detectDefaultAuth`, `getBaseUrl`, `resolveRef`, `CATALOG`, `getCatalogEntry` | Import these public functions |
| `src/parse-openapi.ts` | Handles JSON/YAML, upgrades Swagger 2.0, extracts operations, parameters and basic body/response schemas | Reuse with validation and normalization |
| `src/catalog.ts` | Catalog stores IDs, descriptions, URLs, prefixes, and default-auth hints | Reuse entries but cache imported specs |
| `src/build-template.ts` | Emits `zeebe:*` bindings and Camunda FEEL examples | **Do not use** for native definitions |
| `package.json` | `@bpmnkit/connector-gen` v1.1.2, MIT, Node >=20, `yaml` dependency | Start as a direct version-pinned dependency |
| `LICENSE` | MIT | Retain copyright/license notices as required |

**Limitations to account for:** The reference resolver supports local `#/...` references only; advanced multi-file specs need preprocessing. The generator concentrates on JSON request/response examples and common authentication types. Catalog entries point to remote specifications whose availability and versions may change. The catalog's operation count indicates *potential definitions*, not validated live integrations.

**Dependency policy:** Pin a tested package version; wrap public functions in our own `OpenApiImporter` adapter so a future parser can be substituted without changes to BPMN Server's registry or runtime. Do not import BPMN Kit into the execution engine itself.

## 3. Components and Boundaries

### 3.1 OpenAPI importer (build/design time)

```ts
interface OpenApiImporter {
  import(source: OpenApiSource, options?: ImportOptions): Promise<ConnectorPackage>;
}

type OpenApiSource =
  | { kind: 'file'; path: string }
  | { kind: 'url'; url: string }
  | { kind: 'catalog'; id: string };
```

Responsibilities:

1. Fetch or read the source, with limits on size, redirects, time and allowed network destinations.
2. Parse using BPMN Kit.
3. Normalize operation IDs, HTTP methods, server URLs, parameters, request/response schema references, and declared security.
4. Validate and issue warnings for unsupported constructs; do not silently imply executable support.
5. Produce a versioned `ConnectorPackage` with source URL, source checksum, import timestamp, and individual operations.
6. Cache the exact source specification for reproducibility.

Remote imports must be an explicit administrative operation and protected from SSRF (e.g., block metadata endpoints, loopback/private network destinations unless administrator allowlisted).

### 3.2 Connector catalog / registry (design time and runtime)

```ts
interface ConnectorRegistry {
  getOperation(ref: string, version?: string): Promise<ConnectorOperation | undefined>;
  search(query: string): Promise<ConnectorOperationSummary[]>;
  register(pkg: ConnectorPackage): Promise<void>;
}

interface ConnectorOperation {
  id: string;              // e.g. github.createIssue
  packageId: string;       // github
  packageVersion: string;  // immutable imported version
  displayName: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  baseUrl: string;
  path: string;
  parameters: ConnectorParameter[];
  requestBody?: ConnectorBodyDefinition;
  responses?: ConnectorResponseDefinition[];
  security?: ConnectorSecurityRequirement[];
}
```

Use stable operation references; if an OpenAPI `operationId` is absent or duplicated, derive deterministic IDs from method and path and report conflicts. Do not silently rename previously deployed operations.

**Persistence:** Connector definitions and immutable versions may reside in the BPMN Server application model store or a separate registry adapter. Credentials never live in the definition store.

### 3.3 Runtime executor

```ts
interface ConnectorExecutor {
  execute(
    operation: ConnectorOperation,
    binding: ConnectorBinding,
    context: ConnectorExecutionContext
  ): Promise<ConnectorExecutionResult>;
}

interface CredentialProvider {
  resolve(ref: string, context: ConnectorExecutionContext): Promise<Credential>;
}
```

The HTTP executor handles URL-template substitution, encoded path/query parameters, request serialization, content negotiation, authentication, timeouts, response classification, bounded retries, and result mapping. It integrates as an implementation of the existing BPMN Server service-task execution boundary, not as a new process engine.

Security requirements:

- Block arbitrary outbound destinations by default; enforce host allowlists or controlled egress and protect against DNS rebinding/redirect SSRF.
- Support per-tenant authorization for connector use and credential references.
- Redact secrets from logs, workflow variables, error messages, and test artifacts.
- Enforce connection/read timeouts, payload-size limits, concurrency limits, and rate limits.
- Support API key, Basic, Bearer, and OAuth 2 client-credentials initially; model other flows as unsupported until implemented.
- Retry only where safe: idempotent requests by default; non-idempotent operations require an idempotency key or explicit policy.
- Keep a durable invocation identifier and avoid automatic duplicate side effects after uncertain network failures.

### 3.4 Web modeler and VS Code

Both clients consume registry schemas through a shared API. Neither should parse OpenAPI independently or hold secrets in the diagram.

## 4. Example: GitHub Create Issue

### 4.1 Generated operation definition (conceptual schema)

```yaml
connector: github.createIssue, Create GitHub Issue
    packageVersion: 2026-11-01.1
    method: POST
    baseUrl: https://api.github.com
    path: /repos/{owner}/{repo}/issues
    authentication: bearer

    parameter: owner
        in: path
        required: true
    parameter: repo
        in: path
        required: true
    parameter: title
        in: body
        required: true
    parameter: body
        in: body
        required: false
```

This is **proposed BPMN Server connector metadata**, not an existing BPMN Kit or BPMN Server file format. The GitHub operation's actual imported schema must determine fields; the illustration is simplified.

### 4.2 BPMN Script service task

```yaml
process: issueProcess, GitHub Issue Management

    startEvent: start, Start
        sequenceFlow: flow1
            targetRef: createIssue

    serviceTask: createIssue, Create GitHub Issue
        connector: github.createIssue
        connectorVersion: 2026-11-01.1
        credentialRef: github-production
        input:
            owner: = projectOwner
            repo: = projectRepository
            title: = issueTitle
            body: = issueDescription
        output:
            issueNumber: = response.body.number
        sequenceFlow: flow2
            targetRef: completed

    endEvent: completed, Completed
```

**Expression convention (proposal):** `= ...` denotes a FEEL expression. Without `=`, a value is literal. The binding layer must use BPMN Server's supported FEEL evaluator; executable JavaScript, if permitted elsewhere, must be explicitly marked and never inferred from `${...}`. Avoid implicit interpolation conventions.

### 4.3 BPMN XML preservation

For XML, represent bindings under a namespaced `extensionElements` element (e.g., a proposed `bpmns:connectorBinding`). The exact schema/QName must be registered with `bpmn-moddle` and tested before finalizing it. The XML converter must preserve operation ref, version, input/output mappings, and credential reference; the nested sequence flows in BPMN Script export as normal BPMN `sequenceFlow` children of `process`.

## 5. Execution and Failure Contract

1. Service task reaches `createIssue`.
2. Runtime resolves immutable operation version and checks service-task/tenant permissions.
3. Evaluate input expressions against an explicit, read-only workflow data context.
4. Resolve credential *reference* from the credential provider.
5. Validate required inputs and types; construct and send the HTTP request.
6. Parse the response according to content type and status; validate configured outputs.
7. Commit result mappings to workflow data through existing engine persistence semantics.
8. On failures, classify into `ConfigurationError`, `AuthenticationError`, `RateLimitError`, `TimeoutError`, `HttpError`, or `MappingError`; allow configured BPMN error routing where appropriate.

Distinguish a transport timeout (remote side effect unknown) from a confirmed API rejection. Do not promise exactly-once remote execution without the remote API's idempotency support.

## 6. CLI Enhancement

Current `bpmn-server` package source already exposes `bpmn-server verify`; the following are **proposed new subcommands**:

```sh
bpmn-server connector catalog
bpmn-server connector search "github issue"
bpmn-server connector import github
bpmn-server connector import ./openapi.yaml --id my-api
bpmn-server connector show github.createIssue
bpmn-server connector validate github.createIssue
bpmn-server connector generate github --filter issues --out ./connectors
bpmn-server connector test github.createIssue --input ./sample.json --credential github-dev
bpmn-server connector refresh github --review-diff
```

| Command | Expected behavior |
| --- | --- |
| `catalog` | List catalog APIs and cached/imported status; JSON output option |
| `search` | Search names, paths, methods, descriptions, tags; support pagination |
| `import` | Read spec, normalize and validate; store immutable version, checksum, warnings |
| `show` | Display endpoint, required parameters, body schema, auth and response examples |
| `validate` | Validate operation schema and references without executing external calls |
| `generate` | Write native connector descriptors; no Camunda template output |
| `test` | Explicit opt-in real API call, sanitized input/output; `--dry-run` to inspect request |
| `refresh` | Retrieve new spec and produce breaking-change report; never silently upgrade deployed bindings |

Use nonzero exit codes for validation failures, stable `--json` output for CI, and a separate confirmation/permission policy for mutating real API calls. Keep CLI import/generation usable offline with cached specs.

## 7. Web Modeler Enhancement

Add a **Connector** section to the existing service-task property panel rather than building another editor:

1. Search catalog or imported operations.
2. Select operation and immutable version.
3. Display required/optional inputs with schema help, descriptions and examples.
4. Bind input fields to literals or FEEL expressions.
5. Select a credential alias (never display the secret).
6. Configure result mappings, timeout, retry/error behavior.
7. Validate task configuration and view generated BPMN Script/XML.
8. Optionally dry-run with mock response; real-call test requires explicit authorization.

The modeler must indicate when a selected operation version is missing, deprecated, unsupported, or incompatible with the existing binding.

## 8. VS Code Extension Enhancement

Build on the shared connector registry and language services of BPMN Script:

- Completion: connector IDs, version IDs, parameter names, enums, input/output keys.
- Hover: HTTP method/path, operation documentation, required fields, schema examples, auth requirements.
- Diagnostics: unknown operation, missing required inputs, invalid type/expression, missing version, unauthorized credential reference (when connection is available).
- Navigation: go to connector definition or cached OpenAPI source; find all BPMN tasks referencing an operation.
- Code actions: import missing API, generate required input placeholders, update a binding after reviewing a version diff.
- Tree view: imported APIs → operations → BPMN usages.
- Commands: `Import OpenAPI`, `Bind Service Task`, `Validate Connector`, `Preview HTTP Request`, `Test Connector`, `Review API Changes`.
- Testing: show sanitized response and execution diagnostics; never store secret values in workspace settings.

Use the same contract as the CLI so editor errors match CI errors. Offline editing works from cached metadata; server-backed operations require authenticated configuration.

## 9. Packaging and Repository Boundaries

Proposed layout (adjust after reviewing current adapters):

```text
packages/connectors/                 # reusable shared package (new)
    src/model/                       # typed operation and binding contracts
    src/import/OpenApiImporter.ts    # BPMN Kit adapter, caching, normalization
    src/registry/                    # catalog store + immutable versions
    src/runtime/HttpConnector.ts     # transport execution adapter
    src/runtime/CredentialProvider.ts
    src/validation/
    test/

bpmn-server/
    src/                            # integration at service-task handler boundary
    src/cli.ts                      # connector subcommands, using shared package

bpmn-web/
    src/                            # existing service-task property panel integration
```

Use dependency injection: engine depends on connector interfaces, not on the importer, web UI, HTTP implementation, or BPMN Kit package. Avoid introducing a monorepo solely for this enhancement; the shared package can be published independently if repositories remain separate.

## 10. Versioning and Lifecycle

An imported package stores: `packageId`, immutable version, OpenAPI source location, source checksum, import date, normalized operation descriptors, compatibility warnings, and an optional cached source copy.

A model binds to an **explicit operation version**. Refresh imports a new immutable version and generates a reviewable diff including:

- Removed operations or changed method/path.
- Added or removed required fields.
- Changed parameter location or authentication schemes.
- Changed response types or output fields.

Never silently migrate running process definitions; old model versions must resolve their historical connector versions. Preserve both source licensing information and provenance.

## 11. Validation and Test Plan

**Importer tests:** JSON, YAML, Swagger 2.0, duplicate operation IDs, local refs, unsupported external refs, missing server, broken spec, version changes, hostile URLs.

**Mapping tests:** Required fields, type checks, path/query encoding, literals vs FEEL, response mapping, unknown fields, XML ↔ BPMN Script round trips.

**Executor tests (mock HTTP server):** GET/POST, API key/Bearer/Basic/OAuth2 client credentials, 2xx/non-2xx, 429 with backoff, timeout, invalid JSON, binary content unsupported warning, maximum payload size, retries, secret redaction, tenant restrictions, redirect/SSRF rejection.

**End-to-end demo:** Import a small deterministic OpenAPI example, bind a service task in modeler and BPMN Script, execute against local mock API, and view outputs in instance history. Then validate real integrations against GitHub, Stripe, and one custom OpenAPI spec using test credentials and non-destructive endpoints.

**Acceptance criteria:**

1. Imported operations generate stable, versioned connector IDs.
2. Service tasks use operations without new endpoint-specific code.
3. CLI, web modeler, and VS Code share the same connector definitions and diagnostics.
4. XML ↔ BPMN Script round trips preserve all connector bindings.
5. Secrets never appear in BPMN XML, BPMN Script, logs, or test results.
6. Unsupported OpenAPI constructs are explicitly diagnosed.
7. A running process retains its pinned connector definition despite catalog refreshes.
8. Safe offline tests run without a live external API or MongoDB when possible.

## 12. Implementation Phases

| Phase | Deliverables | Gate |
| --- | --- | --- |
| 1 — Proof of concept | Adapter over BPMN Kit parser/catalog; import three specs; generate normalized descriptors | Compatibility/limitation report and deterministic IDs |
| 2 — Runtime | Registry, credential provider, HTTP executor, service-task integration | Mock-API tests and security controls pass |
| 3 — Authoring | BPMN Script XML binding, modeler property panel, shared validation | Round-trip and modeler integration tests pass |
| 4 — Developer tooling | CLI connector commands, VS Code search/completion/diagnostics | Same validation results across tools |
| 5 — Hardening | Version diffs, upgrades, observability, OAuth/token refresh as needed | Production readiness and security review |

## 13. Decisions and Open Questions

**Recommended decisions**

- Reuse `@bpmnkit/connector-gen` as a pinned import-time dependency only.
- Generate BPMN Server-native operation descriptors, not Camunda templates.
- Use a generic HTTP connector executor accessed through a service-task adapter.
- Keep secret material in a pluggable credential provider.
- Pin operation versions in BPMN models; never update active workflows implicitly.
- Use explicit FEEL expression syntax (`= ...`) in the proposed BPMN Script mapping layer.

**To resolve during implementation**

1. The exact existing BPMN Server service-task extension point and error/retry semantics.
2. XML namespace and schema for connector bindings, including BPMN moddle registration.
3. Where to persist immutable connector catalog versions given current deployment topology.
4. The credential provider integration contract and tenant scoping.
5. Whether external OpenAPI `$ref` preprocessing is required for target APIs.
6. Which body formats (JSON, URL-encoded, multipart, binary) enter initial supported scope.
7. Distribution of the shared package between existing repositories.

## 14. Source References

- BPMN Kit: `https://github.com/bpmnkit/bpmnkit/tree/main/packages/connector-gen`
- Parser: `packages/connector-gen/src/parse-openapi.ts`
- Catalog: `packages/connector-gen/src/catalog.ts`
- Template generator: `packages/connector-gen/src/build-template.ts`
- Exported API: `packages/connector-gen/src/index.ts`
- Package metadata: `packages/connector-gen/package.json`
- License: `https://github.com/bpmnkit/bpmnkit/blob/main/LICENSE`
- BPMN Server: `https://github.com/bpmnServer/bpmn-server`
- BPMN Web: `https://github.com/bpmnServer/bpmn-web`

*This is an implementation design, not a claim that the enhancements are already implemented. Source findings were reviewed against the connected GitHub files on 2026-11-01; runtime integration remains to be proven.*
