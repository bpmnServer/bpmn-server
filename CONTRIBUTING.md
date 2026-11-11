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
| Work requests: one doc per M/L request (not published) | `docs/work/` |
| Designs spanning releases (not published) | `docs/design/` |
| Feature catalog (source of truth) | `docs/features.yaml` |
| Generated feature reference | `docs/docs/features.md` |
| Feature catalog generator/check | `scripts/features.mjs` |
| Examples and end-to-end tests | `apps/testSampleApp/` |
| Sample host | `apps/sampleApp/` |
| Package changelogs | `packages/*/CHANGELOG.md` |

## Work requests

Every request (a bug, an enhancement, a design, docs, a chore) follows one path from intake to release, so that what
is in a release, who decided it and why is written down, not left in a chat or a comment thread.

### 1. An issue for every request

Open a GitHub issue: the problem, what is expected, the area, and how to check it. No PR without an issue, except a
trivial fix (a typo, a broken link). Something found while working on another request (a gap, a bug, a follow-up)
becomes its own issue, not a side change.

### 2. Triage

The maintainer triages new issues weekly and gives each:

| Field | Values |
| --- | --- |
| Type | `bug`, `enhancement`, `design`, `docs`, `chore` |
| Area | the areas of `docs/features.yaml` (`api`, `engine`, `web`, `decisions`, `connectors`, ...) |
| Size | **S**: a bug or a small change, in one place. **M**: a feature in one area. **L**: changes a contract (API, storage, model, `appDelegate`, security) or spans packages |
| Milestone | a release (`3.7`, `3.8`) or `later` |

**A milestone is a release's scope.** Work is in a release because its issue is in that milestone.

### 3. The path, by size

| Size | Path |
| --- | --- |
| S | The issue, then a PR. The regression test and the changelog line are its record. |
| M | The issue and a **work doc** (below) whose Plan the maintainer agrees to before code; then a PR. |
| L | A work doc, and a **design note** in `docs/design/` agreed first in a docs-only PR. The work is split into increments, each its own M request (issue, work doc, PR). |

### 4. The work doc

One per M or L request, in `docs/work/`, named by its issue: `docs/work/0287-display-label.md`. Not by release
folder: a request that moves to another release changes its front matter, not its path.

```markdown
---
issue: 287
title: Display label on instances
type: enhancement        # bug | enhancement | design | docs | chore
size: M                  # S | M | L
area: [engine, web, api] # docs/features.yaml's areas
milestone: "3.7"         # a release, or "later"
status: proposed         # proposed | agreed | in-progress | done | deferred | rejected
owner: <GitHub login>
design: docs/design/<note>.md    # L, and an L request's increments
features: [<id>]                 # docs/features.yaml ids it adds or changes
---

## Request
The problem, in the requester's terms, and who asked.

## Scope
What is in, and what is explicitly out.

## Plan
- Acceptance criteria: what a reviewer can check.
- Contracts touched (API, storage, model, `appDelegate`) and compatibility.
- Tests: which, at what level.
- Docs: which pages.

## Decisions
- YYYY-MM-DD: what was decided, and by whom when it is not the maintainer.

## Open questions
- The question. (who answers it)

## Result
- Commits and PRs; the gates as run (PASS/FAIL/NOT RUN); what was deferred, as new issues.
```

| Status | Set by | When |
| --- | --- | --- |
| `proposed` | the requester, or the maintainer at triage | the doc has its Request and Scope |
| `agreed` | the maintainer | the Plan is approved; the change of status in a commit or PR is the approval on record |
| `in-progress` | the owner (a person or an agent) | work has started; Decisions and Open questions are kept current |
| `done` | the owner | the Result is written, in the PR that completes the work |
| `deferred` / `rejected` | the maintainer | with one line saying why; a deferred request moves milestone |

Where things live:

| Place | Holds |
| --- | --- |
| The issue | discussion, notifications, status on the board |
| `docs/work/` | the request's content: what was asked, decided and done; kept as the record |
| `docs/design/` | architecture that spans releases (e.g. `api-v3.md`, `multi-app-tenants.md`); a work doc links to it, never copies it |
| `docs/docs/`, `docs/features.yaml` | the product as it is now |
| `packages/*/CHANGELOG.md` | what changed, per release |

**Decisions are recorded in the doc, not in comments.** A PR thread is for discussion; its outcome is written into
the work doc's (or the design note's) Decisions, dated. Open questions stay in the doc, each with who answers it.

### 5. Branches

- `main` is the released code. The next release has its own branch (e.g. `3.7`), cut from `main`.
- A PR targets the release branch of its issue's milestone. Only a hotfix to a released version targets `main`.
- Design notes are merged into the release branch they are for, not kept on long-lived branches of their own.
- A release is merged to `main`, and the next release branch is cut.

### 6. Release

- **Scope freeze**: every open issue in the milestone is finished, or moved to another milestone with one line why.
- Every M/L work doc in the milestone is `done`, `deferred` or `rejected`.
- The release notes (`docs/docs/whats-new-*.md`) list the release's known gaps, each with its issue.
- Then the release steps (publishing, the install test) in the internal repository.

### 7. Who does what

| Role | Does |
| --- | --- |
| Maintainer | triages; agrees to plans and designs; decides scope and milestones; merges; releases |
| Contributor | opens issues; writes work docs and designs; opens PRs against the release branch |
| AI agent | reads the work doc first; drafts plans and designs; implements; reviews; writes its report into the Result. Commits locally, and pushes, merges or releases only when told. A finding outside the request becomes a new issue (with a work doc stub for M/L), not a side change. |

## Required development workflow

1. **Understand** the issue, its work doc, affected contracts, current implementation, documentation and related tests. Check for existing behavior before proposing replacement architecture.
2. **Define** what changes and why. For an M or L request this is the work doc's Plan (and for L its design note), agreed before implementation: decisions, compatibility impact, risks, alternatives and acceptance criteria.
3. **Implement** the smallest coherent change. Preserve public APIs, BPMN behavior, persistence compatibility, and existing extension points unless a breaking change is explicitly approved.
4. **Test** new behavior with automated regression tests, including failures, edge cases and security/authorization when applicable. Use the actual host/sample app for cross-component scenarios.
5. **Update the feature catalog** (`docs/features.yaml`) when behavior, support status, source paths, tests or examples change. Run `npm run features` to regenerate its page and managed test tags. A change to API v3's routes changes its OpenAPI document (`routes/api/openapi-v3.ts`): run `npm run api-docs` to regenerate `docs/docs/api-v3.md` (a test fails while it is out of date).
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
- [ ] The PR names its issue and targets its milestone's release branch; for an M/L request, the work doc's Decisions and Result are up to date.

The repository currently defines `build`, `test` and `features` scripts at its root. This document establishes the **policy**. Local Git hooks / CI branch protection are a separate enforcement task; written policy alone cannot technically stop a commit or push.

## Testing guidance

Use focused tests while developing and run the complete relevant suite before delivery. For an engine feature test model execution paths (start, wait, resume, errors, timers, restart and persistence where relevant); for a modeler feature test editor round-trips and model verification; for an integration feature test the connector/API contract and errors. For asynchronous notifications and data operations, check retries, correlation and duplicate side effects. Avoid test-only mocks that conceal broken end-to-end behavior.

When updating `docs/features.yaml`, its `tests` paths must refer to real test files and the generated `// @features:` tags must remain synchronized. A catalog entry is not proof of coverage: assertions must exercise the claimed behavior.

## Changelog policy

Update the changelog of every package whose externally observable behavior changes. State what changed, which users are affected and how to migrate when necessary. Do not rewrite released history. Update release notes in `docs/docs/whats-new-*.md` when preparing the corresponding release or when the maintainer explicitly requires it.

## Review expectations

A reviewer or AI assistant must be able to answer: Which request is this, and is it in the milestone of the branch it targets? What behavior was changed? Which tests prove it? Which features in the catalog were affected? What user-facing documentation changed? Is migration required? Which package changelog captures it? What remains unverified?

See [AI contributor instructions](AI-CONTRIBUTING.md) for the agent workflow, prompt contract, quality checks and prohibited shortcuts.
