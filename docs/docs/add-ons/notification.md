# Notifications (add-on)

The **Notifications** add-on tells people what happens to their work. Turn it on or off on its page of the
[Settings page](../integration-settings.md) (**Dashboard ▸ Settings ▸ Notifications**).

## What it does

- [Notification policies](../notification-policies.md) (`owf:notificationPolicy`): decision tables whose rules say
  whom to tell, and with what message, as tasks start and end and as a case ends.
- Each notification is kept (**Dashboard ▸ Notifications**), and delivered by the application's `notify`, or by
  email.

## Its settings

| Setting | |
|---|---|
| `NOTIFICATIONS` | How notifications are delivered, or only kept (`record`) |
| `EMAIL_ENABLE`, `EMAIL_FROM`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_LOG` | Email, when the application has no `notify` |

## When it is off

A model keeps its notification policy; the engine ignores it, and the model's checks say so (`add-on-off`). The
Notifications page is not there.
