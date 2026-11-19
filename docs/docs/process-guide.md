# A process explained: the guide

Every process has a guide for the people who work in it: **How this process goes**, at `/guide/<process>`. It's
linked from My Work's *Start a process* and from each case's page. It explains the process without opening the model
editor.

## What it shows

- **What it is for:** the model's description (its documentation), and its diagram.
- **Its steps,** in the order a case meets them:
  - who does each task: its lane, groups, people, or *decided when it runs* (an expression or an assignment policy);
  - what each form asks, and which fields are required;
  - where it goes next, and for a decision, each way with its name.
- **Its rules:** the policies that decide who a task goes to, who is told what, and who sees what.
- **Examples:** the scenarios of its tests (its `.feature`), in plain words: who signs in, what they start and
  complete with which values, and what comes of it. A simulated service is said so. Each example links to **the case
  it made**, its [test case](environments.md#test-cases), marked *passed* or *failed*, and *before the last change*
  when the model changed since it ran.

Scripts, expressions, connectors and keys are left out.

## Writing for it

The guide is only as clear as the model:

- give the process, and each task and decision, a **documentation** text (the editor's Documentation);
- name each decision's ways (the sequence flows' names);
- name the scenarios as what happens: *A long leave goes to HR, not to a manager*. A feature's description is shown
  above the examples.

## Who may read it

Whoever may start the process, or works in it (a task offered to one of their groups, or one of their lanes), and
designers and administrators. Anyone else gets the same answer as for a process that doesn't exist. Its test cases
follow the same rule.

## For an application

API v3 gives the same: `GET /api/v3/processes/{name}/guide`, as the person. An application with its own pages can
show the guide in its own layout.
