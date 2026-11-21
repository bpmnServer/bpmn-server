# Policies (add-on)

The **Policies** add-on decides who works on each task, who may see and do what, and who is told what. Turn it on or
off, and set its settings, in its area of the [Settings page](../integration-settings.md)
(**Dashboard ▸ Settings ▸ Policies**).

## What it does

- **Assignment**: a user task's assignee and candidates (`camunda:assignee`, `camunda:candidateUsers`,
  `camunda:candidateGroups`), its lane, its roles, and [assignment policies](../assignment-policies.md)
  (`owf:assignmentPolicy`). Who may start a process (`camunda:candidateStarterUsers`, `camunda:candidateStarterGroups`).
- **Security**: who may see a case and claim, complete, assign or restart its tasks ([security policies](../security.md),
  `owf:securityPolicy`). The API asks it before each read (`pre-query`) and each action (`pre-action`).
- **Notifications**: who is told what as tasks start and end ([notification policies](../notification-policies.md),
  `owf:notificationPolicy`), kept and delivered by the application's `notify` or by email.
- **Actors**: who did what in a case (`owf:actor`), kept on it as `instance.actors` and read by expressions as
  `actors`.

## Its settings

| Setting | |
|---|---|
| `SECURITY_POLICY` | Security policies: on with `policies/security/`, or `default` |
| `NOTIFICATIONS` | How notifications are delivered, or only kept (`record`) |
| `EMAIL_ENABLE`, `EMAIL_FROM`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_LOG` | Email, when the application has no `notify` |

## When it is off

A model keeps its assignment, policy and actor attributes; the engine ignores them, and the model's checks say so
(`add-on-off`). The Design page has no Policies, Administration no Roles, and the Notifications page is gone.
