# AI contributor instructions

This file applies to the entire repository. Its audience is **coding agents enhancing BPMN Server itself**, not BPMN product users.

**Building a workflow on BPMN Server** (a model, its forms, its tests), not changing BPMN Server? Read [docs/docs/ai/building-workflows.md](docs/docs/ai/building-workflows.md) instead.

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [AI-CONTRIBUTING.md](AI-CONTRIBUTING.md) before editing.

Mandatory pre-commit/pre-push requirements:
1. Inspect implementation, existing tests, related documentation and `docs/features.yaml` before coding.
2. Preserve API/model/storage contracts, backwards compatibility and `appDelegate` as an optional escape hatch.
3. Add or update automated regression tests for behavioral changes.
4. Update relevant documentation/examples and affected package `CHANGELOG.md` files.
5. Maintain `docs/features.yaml`; run `npm run features` to regenerate `docs/docs/features.md` and test tags; do not hand-edit generated page.
6. Run `npm run build`, `npm test`, `npm run features -- --check`, `git diff --check`; inspect results and diff.
7. Report actual PASS/FAIL/NOT RUN checks, compatibility implications and outstanding risks. Do not claim unrun tests passed or invented functionality exists.
8. Commit and push only after required gates pass; when blocked, disclose the blocker and seek review rather than silently skipping checks.

Follow the fuller change workflow and PR handoff contract in [AI-CONTRIBUTING.md](AI-CONTRIBUTING.md).
