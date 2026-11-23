# Assignment (add-on)

The **Assignment** add-on decides who works on each task, and who may start a process. Turn it on or off on its page of the [Settings page](../integration-settings.md) (**Dashboard ▸ Settings ▸ Assignment**).

## What it does

- A user task's assignee and candidates (`camunda:assignee`, `camunda:candidateUsers`, `camunda:candidateGroups`),
  and its lane: the lane's role is offered the task.
- [Assignment policies](../assignment-policies.md) (`owf:assignmentPolicy`): decision tables that decide them.
- Who may start a process (`camunda:candidateStarterUsers`, `camunda:candidateStarterGroups`).
- The actors (`owf:actor`): who did what in a case, kept on it as `instance.actors` and read by expressions as
  `actors`. They are shared with the Access Control and Notifications add-ons, and are there while any of the three is on.

The roles (`roles.json`) are the server's, not this add-on's: they are always there (**Dashboard ▸ Settings ▸ Roles**,
**Administration ▸ Roles**).

## Its settings

None of its own.

## When it is off

A model keeps its assignment attributes and policies; the engine ignores them, and the model's checks say so
(`add-on-off`). The Design page lists no assignment policies.
