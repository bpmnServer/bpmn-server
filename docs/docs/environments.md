# Environments, and read-only servers

## Which environment a server is

`APP_ENV` in `.env` says which environment a server is: `development`, `test` or `production`.

- **The pages show it** as a band above the menu bar: **Development** in blue, **Test** in amber. The model and
  decision editors show it as a badge in their header. The name is always written, so it doesn't rely on the colour.
  Production shows nothing.
- **`APP_ENV_LABEL`** replaces the name in the band, in any environment, production included: `Staging`,
  `Public demo`.
- **API v3's `/me`** says it (`environment`: `name`, `label`, `readOnly`, `restrictions`, `shown`), so an application's own layout
  can show it too. The HR demo shows it in its sidebar.
- **`APP_ENV=test`** also makes the sample applications use their test services: the same names, nothing sent or
  recorded. That is the application's code (its delegate reads `APP_ENV`); yours decides what each environment uses.
- **Unset**, the environment isn't declared: the server works as before 3.7.2 and shows no band. Set it on every
  server. `bpmn-server setup` asks for it, and its production profile writes `production`.

**Connectors outside production:** in development and test, a connector can answer from its OpenAPI document's
examples, or call a sandbox, instead of the real API ([Connectors](connectors.md#outside-production)). Production
always calls the real one.

## Test cases

Tests run only in development and test. Production runs none, so its database holds no test cases.

- **In development and test,** a scenario's run makes an ordinary case in the database, listed with the others and
  marked **test**, so you can examine it later. The lists don't hide them.
- **Each scenario's last case is also saved as a file** with the models: `test-cases/<model>/<scenario>.json`, when its
  run is saved (the Test tab, the Design page's **Run tests**). The file holds the case as it ran, the model it ran
  against, and its fingerprint. Commit them with the models.
- **In production** (`APP_ENV=production`), running tests is refused (403 `TESTS_OFF`), through the pages and the APIs.
  The test cases are the files deployed with the models: **Test cases** (`/test-cases`, linked from the Design page)
  lists them, and each opens on the instance page, read-only, with the scenario that ran and whether it passed. A case
  whose model has changed since it ran is marked *changed since*.
- **The people who work in a process** see its test cases too, as the examples of its guide
  ([A process explained](process-guide.md)): whoever may read the guide may open them.

## Read-only

`READ_ONLY=true` makes a server people can use but not change, such as a public demo.

**People can:**

- start cases and complete tasks, and do everything else a case does;
- open every page they may open: the models in the editor, decision tables, policies, tests, the Settings page;
- run the tests and check models.

**Refused**, with a 403 that says the server is read-only (`READ_ONLY` for the APIs):

- saving, adding, importing, renaming and deleting models, and importing from the catalog;
- saving decision tables, policies, tests and modeling rules, and deleting a model's history;
- adding or removing roles, changing connectors or their keys, saving on the Settings page;
- bpmn-web's own users and passwords (managing them, changing or resetting a password);
- restarting the server, and deleting every case at once (`/resetData`).

The refusals apply to the pages and to the APIs alike (API v3, the REST APIs and their administration forms), so
no page, client, MCP server or AI link gets around them. The editors' Save buttons are turned off, and the band says
*Read-only: you can start cases and complete tasks, not change the processes*.

An application with its own sign-in keeps its own users: the HR demo refuses changes to its users and passwords
when `READ_ONLY=true`, so visitors can't lock others out of its shared accounts.

For a public demo, combine it with `DEMO_MODE=true`: scripts run in a sandbox, and timers and service tasks don't
run.

## Related

- [Settings: `.env` and configuration](settings.md): every setting.
- [The Settings page](integration-settings.md), where an administrator changes them.
