# Contributing to BPMN Server

This guide is for **developers enhancing BPMN Server itself**, including developers working with coding agents. It is not the guide for people modeling or running workflows.

Read [AI contributor instructions](AI-CONTRIBUTING.md) before using an AI assistant. The repository root [AGENTS.md](AGENTS.md) is the short, tool-independent instruction entrypoint.

## Repository map

| Area | Location |
| --- | --- |
| Workflow engine, storage, verification | `packages/bpmn-server/` |
| REST client | `packages/bpmn-client/` |
| Web host, task UI, modeler | `packages/bpmn-web/` |
| User-facing documentation | `docs/docs/` |
| Feature catalog (source of truth) | `docs/features.yaml` |
| Generated feature reference | `docs/docs/features.md` |
| Feature catalog generator/check | `scripts/features.mjs` |
| Examples and end-to-end tests | `testSampleApp/` |
| Sample host | `sampleApp/` |
| Package changelogs | `packages/*/CHANGELOG.md` |

## Required development workflow

1. **Understand** the issue, affected contracts, current implementation, documentation and related tests. Check for existing behavior before proposing replacement architecture.
2. **Define** what changes and why. For nontrivial designs record decisions, compatibility impact, risks, alternatives and acceptance criteria before implementation.
3. **Implement** the smallest coherent change. Preserve public APIs, BPMN behavior, persistence compatibility, and existing extension points unless a breaking change is explicitly approved.
4. **Test** new behavior with automated regression tests, including failures, edge cases and security/authorization when applicable. Use the actual host/sample app for cross-component scenarios.
5. **Update the feature catalog** (`docs/features.yaml`) when behavior, support status, source paths, tests or examples change. Run `npm run features` to regenerate its page and managed test tags.
6. **Update documentation and examples** for affected user-facing functionality, configuration, scripts, connectors, migrations and APIs. Keep code samples executable or clearly mark them as proposals.
7. **Update the relevant package CHANGELOG.md** for user-visible changes, fixes, deprecations or breaking changes, following the existing format. For internal-only work, state explicitly in the PR why there is no changelog entry.
8. **Validate** the changed areas and the repository gates below. Review the diff for generated files, accidental changes, secrets, dead references and version mismatches.
9. **Commit and push only after the gates pass**. Record test commands/results, docs/catalog/changelog updates and any intentionally unrun tests in the PR.

A red test or unverified change is **not** a completed task. Do not assert that tests passed without running them. If an environmental dependency prevents a mandatory check, report it explicitly and request review rather than silently bypassing it.

## Pre-commit / pre-push checklist

- [ ] New behavior has automated tests and regression coverage; relevant existing tests updated.
- [ ] `npm run build` passes.
- [ ] `npm test` passes, or the PR explicitly records a pre-existing/environmental failure with evidence and required approval.
- [ ] `npm run features` regenerated managed references when needed.
- [ ] `npm run features -- --check` passes (catalog references and test tags).
- [ ] Relevant docs, examples and API/config references updated.
- [ ] Relevant `packages/*/CHANGELOG.md` updated, or justified as internal-only.
- [ ] Compatibility, migrations, security, concurrency and data persistence considered.
- [ ] Diff inspected; no credentials, private data or unrelated edits.
- [ ] PR summary includes changes, risks and exact verification performed.

The repository currently defines `build`, `test` and `features` scripts at its root. This document establishes the **policy**. Local Git hooks / CI branch protection are a separate enforcement task; written policy alone cannot technically stop a commit or push.

## Testing guidance

Use focused tests while developing and run the complete relevant suite before delivery. For an engine feature test model execution paths (start, wait, resume, errors, timers, restart and persistence where relevant); for a modeler feature test editor round-trips and model verification; for an integration feature test the connector/API contract and errors. For asynchronous notifications and data operations, check retries, correlation and duplicate side effects. Avoid test-only mocks that conceal broken end-to-end behavior.

When updating `docs/features.yaml`, its `tests` paths must refer to real test files and the generated `// @features:` tags must remain synchronized. A catalog entry is not proof of coverage: assertions must exercise the claimed behavior.

## Changelog policy

Update the changelog of every package whose externally observable behavior changes. State what changed, which users are affected and how to migrate when necessary. Do not rewrite released history. Update release notes in `docs/docs/whats-new-*.md` when preparing the corresponding release or when the maintainer explicitly requires it.

## Review expectations

A reviewer or AI assistant must be able to answer: What behavior was changed? Which tests prove it? Which features in the catalog were affected? What user-facing documentation changed? Is migration required? Which package changelog captures it? What remains unverified?

See [AI contributor instructions](AI-CONTRIBUTING.md) for the agent workflow, prompt contract, quality checks and prohibited shortcuts.
