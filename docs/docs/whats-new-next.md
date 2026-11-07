# What's new in the next release

This release separates the host from the engine, adds tenants, removes guest access and moves every test to Gherkin.

## Before you upgrade

- **Guest users:** on a server that had `GUEST_ACCESS` on, delete the users in the group `GUEST` first. A session they kept would otherwise sign them in as a designer of the shared models. `GUEST_ACCESS`, `GUEST_SAVE`, `GUESTS_PATH`, `GUEST_MAX_MODELS` and `GUEST_RATE_LIMIT` are gone.
- **Test files change on start-up:** each `<model>.tests.json` and `<decision>.dmn.tests.json` in the models folder becomes a `.feature` file, and the JSON is deleted. A file that wouldn't read back as the same tests stays as it is, keeps working, and is reported in the log. Keep the folder in Git or back it up first.
- **Earlier test runs aren't carried over:** every scenario shows as not run and coverage starts empty, until you run the scenarios again. The old `.runs` folder is no longer read and can be deleted.
- **Mocha is gone from the sample application:** the engine's scenarios are now `processes/<model>.engine.feature`, and `npm run test:scenarios` still runs them.

## The host and the engine

The engine can run in a process of its own, with your delegate and services inside it, while the host serves the pages and the APIs. See [Architecture](architecture.md) and [Ways to run it](setup.md#ways-to-run-it).

Nothing changes unless you ask for it: without `ENGINE_AT`, the engine runs in the host's process as before.

## Tenants

`TENANTS_FILE` turns one site into many: `site.com/acme/...`, with a database, users, sessions, models, API keys and engine for each tenant. See [Tenants](setup.md#tenants).

## Tests in Gherkin

Tests are now `.feature` files beside their models, and they run whole in the engine. They can stub a service or a timer, wait for something that happens later, find a particular item, and say which feature they cover. See [Testing and debugging models](testing.md#tests-in-gherkin).

## The Test tab

- **Edit as text** opens a model's whole `.feature` file in the tab. Text that doesn't parse isn't saved, and the error gives the line.
- A run no longer rewrites the `.feature` file, so comments you typed stay until someone changes a scenario through the form.
- **Coverage** is now under the scenarios.
- A scenario's last run is its test instance in the database, tagged with its process and scenario. **Deleting that instance deletes the run and its coverage.**
- **A decision's test runs are no longer saved.** A decision test has no instance to tag, so its runs last until the page is reloaded. The tests themselves are saved.

## The model editor

"No problems found" and **Rules** now show only on the Problems tab.

## Comments on the docs

The documentation pages now have comments, kept in the project's GitHub Discussions. Commenting needs a GitHub account.
