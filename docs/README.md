# BPMN Server documentation

This folder is the **source** for the current MkDocs Material site:

**https://bpmnserver.github.io/bpmn-server/**

The older **https://bpmnserver.github.io/docs/** site is a separate, legacy publishing location. The workflow in this repository deploys to `/bpmn-server/`; changing this folder alone does not update or redirect the legacy site.

- Markdown pages: `docs/`
- Navigation, theme and canonical URL: `mkdocs.yml`
- Deployment: `.github/workflows/docs.yml` (GitHub Pages; changes under `docs/` on `main`)
- Published output: `site/` (generated, not source-controlled)

## Preview and publish

From this `docs/` folder:

```sh
python -m pip install mkdocs==1.6.1 mkdocs-material==9.6.20
mkdocs serve          # http://127.0.0.1:8000
mkdocs build          # produces site/
```

After a change reaches `main`, the **Docs** GitHub Actions workflow builds and deploys the site. Check the workflow run and then verify **https://bpmnserver.github.io/bpmn-server/**. The old `/docs/` path is not deployed by this workflow.

## Writing guidelines

- Keep the [Overview](docs/index.md) short and direct users to a working example.
- Use the **current monorepo** paths (`packages/bpmn-server`, `packages/bpmn-web`, `packages/bpmn-client`, `sampleApp`).
- Demonstrate `npx bpmn-server init` for first-time users; avoid old clone/build instructions on the homepage.
- Distinguish workflow state from application-owned business records and clarify that BPMN Server needs a host.
- Cross-link conceptual guides, reference pages, and tested samples.
- Check package versions, authentication behavior, CLI flags, and code snippets against current source before publishing.

## API reference — regeneration required

**The checked-in `docs/api/` reference was generated for 2.x and is not a reliable 3.5 API reference.** Until regenerated and checked, use [API summary](docs/api-summary.md), [What's new in 3.x](docs/whats-new-3.md), and TypeScript source as the version-aware references.

The TypeDoc configuration lives at `packages/bpmn-server/typedoc.json`, with output `../../docs/docs/api`. Regenerate from a checked-out monorepo with dependencies installed:

```sh
npm install
npm run build -w bpmn-server
# Install a TypeDoc version compatible with the installed TypeScript version,
# plus typedoc-plugin-markdown, in the appropriate workspace.
cd packages/bpmn-server
npx typedoc --options typedoc.json
```

Review the generated public API shape (especially `BPMNAPI`, `BPMNAdminAPI`, `SecureUser`, and storage adapters) before publishing. Do **not** silently treat the old generated reference as up to date.

## Unreleased features

Place unreleased material in `docs/drafts/`. The configured `draft_docs` path keeps it out of the deployed build; move a page into the public documentation and add it to the navigation only when the feature ships.
