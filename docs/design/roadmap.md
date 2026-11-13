# Roadmap

Work agreed and deferred: what it is, why it waits, where it starts. A design note per item when it is taken up.

## Task templates (element templates)

**Hidden in 3.7.1** (`ELEMENT_TEMPLATES=on` shows them): the code, its tests (`test/ui/templates.test.mjs`,
`test/web/templates.test.mjs`) and the sample apps' templates (`connectors/*.json`) stay as they are.

A template is a configured task a designer picks in the model editor (Camunda 7's element template format): a
service task wired to a service, a user task for a group. Checked against what bpmn-server runs
(`packages/bpmn-web/src/routes/elementTemplates.ts`). To finish:

1. **See them in the editor:** the catalog, what each template sets, the templates left out and why (today only
   `GET /model/templates` says it).
2. **Where a value came from:** each property a template filled says *from template Manager approval*, the hidden
   ones too, and when the designer changed it.
3. **The `owf:` attributes:** `owf:assignmentPolicy`, `owf:actor`, `owf:notificationPolicy`, `owf:label`,
   `owf:endLabel`, `owf:exceptionsAsErrors`; and a business rule task's `camunda:resultVariable`,
   `camunda:mapDecisionResult`. A "Manager approval" template then carries its policy, its actor and its notices.
4. **A user task's form fields** (`camunda:formData`), if the template format allows it as we need.
5. **Its documentation:** a page (what they are, the file, an example per element, what is allowed and why, testing
   one), distinct from a notification policy's message templates.

## Notification policies

Built as a first slice ([notification-policies.md](notification-policies.md)). Next: the `overdue` event (a task
past its due date) and `started`; the notifications on the instance page; the Design page's list; a scenario step
(*Then "ann" is notified with "approval-request"*).

## Security policies

Built as a first slice ([security-policies.md](security-policies.md)). Next: `verifyModel`'s own checks for them
(`security-policy-not-found`, `-invalid`, `-output`, `-input`, `-task`); "As whom" on the instance page; the
decision editor's Test tab saying what each action comes to; a task's own policy in the editor (a process's is in
its Policies group); narrowing a list's store query by the actors a rule names.

## Expressions

Built ([expressions.md](expressions.md)). Next: a warning for a FEEL name that is none of the standard names nor a
data field the model knows; `instance.data` for an item's script in the sandbox.

## On hold

- **One pool of decisions:** policies referenced by role instead of the `policies/assignment|security|notification`
  folders. Not decided.
