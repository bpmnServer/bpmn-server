# Publishing

How to release bpmn-server, bpmn-web and bpmn-client to npm, and the docs to their site. All three packages
and the docs are in this repository; run the commands below from its root unless a step says otherwise.

## 1. Before a release

1. `main` is clean and pushed: `git status` shows nothing to commit.
2. Install, build and test:

   ```sh
   npm install
   npm run build        # bpmn-server, bpmn-client, bpmn-web (bpmn-web also builds the model editor)
   npm test             # bpmn-server, bpmn-client, testSampleApp
   ```

3. Version numbers. The three packages share one version (now 3.5.0). Set it in each package:

   ```sh
   npm version 3.6.0 --no-git-tag-version -w bpmn-server -w bpmn-client -w bpmn-web
   ```

   Then raise bpmn-web's dependency on bpmn-server to the same version (`"bpmn-server": "^3.6.0"` in
   `packages/bpmn-web/package.json`) and run `npm install` so `package-lock.json` follows.
4. Changelogs: add the release's section to `CHANGELOG.md` in each package, with today's date.
5. Commit (`Release 3.6.0`) and tag it: `git tag v3.6.0`.

## 2. npm

You need an npm account with publish rights on the three packages. Check with `npm whoami`; if it answers
401, run `npm login`. With two-factor authentication on, each `npm publish` asks for a one-time code (or pass
`--otp=123456`).

Look first at what will go into each package. Nothing below uploads anything:

```sh
npm pack -w bpmn-server --dry-run    # ~350 KB, ~354 files: dist, src, templates/app, README, CHANGELOG
npm pack -w bpmn-client --dry-run    # ~18 KB: dist
npm pack -w bpmn-web --dry-run       # ~3.5 MB: dist, views, public (the built model editor), emailTemplates
```

Then install the packed packages the way users will, in a clean container (needs Docker; about 3 minutes):

```sh
sh docker/install-test/run.sh        # Windows: docker\install-test\run.cmd
```

It runs `npx bpmn-server init`, `npm install`, `setup` and `start`, then calls the application with bpmn-client.
See [docker/install-test](docker/install-test/README.md).

Publish in this order. bpmn-web depends on the bpmn-server version just published, and `npx bpmn-server init`
creates applications that install both packages:

```sh
npm publish -w bpmn-server
npm publish -w bpmn-web
npm publish -w bpmn-client
```

What happens on the way:

- **bpmn-server**: `prepack` runs `npm run build` and `npm run template`. The template step copies
  `sampleApp/` into `templates/app`, without `node_modules`, `package-lock.json` and `.env`. That copy is what
  `npx bpmn-server init` creates new applications from. `postpack` deletes `templates/app` again, so it never
  shows up in git. **Whatever is in `sampleApp/` when you publish is what new users get.**
- **bpmn-web**: `prepack` runs `npm run build`: TypeScript into `dist/` and the model editor into
  `public/modeler/`.
- **bpmn-client**: `prepack` runs `npm run build` (TypeScript into `dist/`).

Then check the published versions, and push the commit and the tag:

```sh
npm view bpmn-server version         # likewise bpmn-web, bpmn-client
git push && git push --tags
```

### Check a fresh install

After publishing, run the install test again on what is now on npm:

```sh
sh docker/install-test/run.sh npm    # or: run.sh npm 3.6.0
```

The application `sampleApp/package.json` creates depends on `"bpmn-server": "*"` and `"bpmn-web": "*"`, so it
installs whatever version is latest on npm.

### If something goes wrong

- A broken version can be withdrawn within 72 hours: `npm unpublish bpmn-web@3.6.0`. Its version number can
  never be used again, so publish the fix as 3.6.1.
- Usually it is better to deprecate the version than to unpublish it:
  `npm deprecate bpmn-web@3.6.0 "broken modeler build, use 3.6.1"`.

## 3. Docs

The docs are an MkDocs (Material theme) site in `docs/`: the pages are in `docs/docs/`, the menu is in
`docs/mkdocs.yml`. You need Python's `pip install mkdocs-material` once.

```sh
cd docs
npm run start        # mkdocs serve: preview at http://127.0.0.1:8000/
npm run build        # mkdocs build: the site in docs/site/
```

The site is https://bpmnserver.github.io/bpmn-server/. The GitHub Actions workflow
`.github/workflows/docs.yml` builds it and deploys it to GitHub Pages whenever a change under `docs/`
reaches `main`. Nothing to do at a release beyond pushing. To publish without a change, run the workflow by
hand: Actions, Docs, Run workflow; or `npm run deploy` in `docs/` (needs the `gh` CLI).

One-time setup: in the repository's Settings, Pages, set Source to **GitHub Actions**.

Pages in `docs/docs/drafts/` appear in the preview but not in the published site. At a release, move the
pages of released features out of `drafts/` and add them to the nav.

The old site, https://bpmnserver.github.io/docs/, was published from the separate repository
`bpmnServer/docs` and is no longer updated. Replace its content with a page that redirects to the new address.

The API reference in `docs/docs/api/` was last generated for 2.x; see `docs/README.md` for how to regenerate
it with typedoc.

## Checklist

- [ ] `main` clean, `npm run build` and `npm test` pass
- [ ] version raised in all three packages, and bpmn-web's bpmn-server dependency matches it
- [ ] changelogs dated, commit and tag made
- [ ] `sampleApp/` is what new applications should start from
- [ ] `npm pack --dry-run` checked for each package
- [ ] install test passes on the packed packages: `docker/install-test/run.sh`
- [ ] published: bpmn-server, then bpmn-web, then bpmn-client
- [ ] install test passes on npm: `docker/install-test/run.sh npm`
- [ ] commit and tag pushed
- [ ] Docs workflow on GitHub succeeded (Actions tab)
