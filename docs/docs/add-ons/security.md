# Access Control (add-on)

The **Access Control** add-on decides who may see a case and what they may do in it. Turn it on or off on its page of the
[Settings page](../integration-settings.md) (**Dashboard ▸ Settings ▸ Access Control**); the card says whether it is on.
Its policies are in the models folder's `security/` (before 3.7.5, `policies/security/`: moved there when first read).

## What it does

- [Security policies](../security.md) (`owf:securityPolicy`): decision tables that say who may see a case, and who may
  claim, complete, assign or restart its tasks.
- The API asks it before each read (`pre-query`: what the user may see) and each action (`pre-action`: it may
  refuse).
- **A case seen as a summary** (a rule's `see: summary`) is in the person's lists, and its page shows it as a summary:
  its name, status and dates, and the tasks they completed in it, none of its data or its other steps. For example a
  manager who approved a leave, from Recently completed. A case they don't see at all is refused, as before.

## Its settings

| Setting | |
|---|---|
| `SECURITY_POLICY` | Security policies: on with `security/`, or `default` |

## When it is off

A model keeps its security policy; the engine ignores it, and the model's checks say so (`add-on-off`). Who may see
and do what is as without security policies.
