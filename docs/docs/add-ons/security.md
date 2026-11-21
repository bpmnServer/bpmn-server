# Security (add-on)

The **Security** add-on decides who may see a case and what they may do in it. Turn it on or off on its card on the
[Settings page](../integration-settings.md) (**Dashboard ▸ Settings ▸ Security**).

## What it does

- [Security policies](../security.md) (`owf:securityPolicy`): decision tables that say who may see a case, and who may
  claim, complete, assign or restart its tasks.
- The API asks it before each read (`pre-query`: what the user may see) and each action (`pre-action`: it may
  refuse).

## Its settings

| Setting | |
|---|---|
| `SECURITY_POLICY` | Security policies: on with `policies/security/`, or `default` |

## When it is off

A model keeps its security policy; the engine ignores it, and the model's checks say so (`add-on-off`). Who may see
and do what is as without security policies.
