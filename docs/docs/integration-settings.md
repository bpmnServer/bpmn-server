# The Integration page

**Dashboard ▸ Integration** (`/dashboard/integration`) is where administrators and designers set up how the workflows
meet the application. It has one section per integration point. Each section shows what is in place and the settings
that control it.

| Section | Shows | Settings |
|---|---|---|
| **The application** | The delegate's class, the methods it defines, its functions (`appServices`), who signs people in | `APP_ENV`, `SITE_URL` |
| **Connectors** | Each connector: enabled or not, its key (last 4 characters), the models that call it | `SERVICE_TASKS`, `CONNECTORS_KEY`, `CONNECTORS_ALLOW_HOSTS`, `CONNECTOR_CATALOG_URL` |
| **Roles and policies** | The roles, and the assignment, security and notification policies | `SECURITY_POLICY`, `ENFORCE_SECURITY` |
| **Notifications** | Who delivers them (the delegate's `notify`, or email), how many are kept, by status | `NOTIFICATIONS`, `EMAIL_ENABLE`, `EMAIL_FROM`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_LOG` |
| **The API the application calls** | API v3, and whether the task API (`/api2/tasks`) is on | `API_KEY`, `ADMIN_API_KEY`, `API_ACTING_USER_KEY`, the service account, `API_IMPERSONATION`, `API_RATE_LIMIT` |
| **Forms, scripts and the model editor** | | `FORM_RULES`, `ELEMENT_TEMPLATES`, `VERIFY_MODELS_ON_IMPORT`, `MODEL_HISTORY`, `CATALOG_URL`, `SCRIPT_SANDBOX`, `SCRIPT_SANDBOX_SERVICES`, `TIMERS` |
| **AI agents** | | `AI_ACCESS`, `AI_GUIDE` |

Each section links to where its parts are managed: the connectors, the roles (Administration), the policies (Design),
the notifications.

## Who changes what

- **Administrators** change every setting.
- **Designers** change the design-side settings, marked *designers too*: `FORM_RULES`, `ELEMENT_TEMPLATES`,
  `VERIFY_MODELS_ON_IMPORT` and `MODEL_HISTORY`. They see the other settings but cannot change them, and a form posted
  with one is refused.
- **Everyone else** can't open the page.

## How a change is saved

- A change is written to the server's `.env`. The file as it was before is kept as `.env.bak`. Other lines and
  comments are left as they are.
- **It applies when the server restarts.** Until then the page shows the running value, marked *restart to apply*.
  An administrator can restart from Administration when a supervisor (Docker, pm2, systemd) restarts the server.
- Each value is checked against the settings schema: a number, `true` or `false`, one of its choices, a minimum length.
  If any value is wrong, nothing is saved, and the page says why.
- An empty field removes the setting from `.env`, so its default applies.
- **A secret** (a key, a password) is never shown, only whether it is set. You can type a new value, have a random key
  generated, or remove it. Leaving the field empty keeps it.
- **A setting the environment gives** (Docker, systemd, the shell) wins over `.env`, so the page shows it and doesn't
  change it: change it where it is set.
- **An application that gives its own API settings** (`hostSettings`) keeps them: the API section shows them and
  doesn't change them.
- **With a separate engine** (`ENGINE_AT`), the page writes the host's `.env`. Copy the change to the engine's `.env`
  too, as [Settings](settings.md) says.

An application can name the `.env` the page writes: `envFile` in `start()` or the `WorkflowApplication`. By default it
is the `.env` of the folder the server runs in.

## Related

- [Settings: `.env` and configuration](settings.md): every setting.
- [Connectors](connectors.md), [Assignment policies](assignment-policies.md), [Security](security.md),
  [Notification policies](notification-policies.md).
- [Custom delegates](delegates.md): the application's code.
