# Unified Gherkin testing

Status: agreed design, not built. Branch: `testing`. Replaces the earlier proposed design, whose changes are listed at the end.

## Summary

One test format for models, decisions and applications: Gherkin `.feature` files with `@commands`, named references and JavaScript expressions.

- A test runs whole inside the engine. The host only browses, designs and asks.
- An **element** belongs to the model. An **item** belongs to the instance. A test finds an item before acting on it.
- `.feature` files replace `*.tests.json` completely.
- A test says which features it covers.

## Example

The full form, needed when several items could match:

```gherkin
@feature:order-approval
Scenario: The manager approves one order line
  When user:Johnson @login with role of "HR-Manager"
    And @start process:order-approval as :orderInstance
    And @find element:approve-order in :orderInstance as :approveItem
      | item.status  | wait |
      | item.itemKey | 5001 |
    And @invoke :approveItem
      | approved | true   |
      | date     | ${now} |
  Then @check :orderInstance status is "end"
    And @check :approveItem status is "end"
```

The short form, for a single waiting item:

```gherkin
When user:Johnson @login with role of "HR-Manager"
  And @start process:order-approval as :orderInstance
  And @invoke element:approve-order in :orderInstance as :approveItem
    | approved | true   |
    | date     | ${now} |
Then @check :orderInstance status is "end"
  And @check :approveItem status is "end"
```

## Syntax

A step is: `[subject] @command [arguments] [as :name]`, optionally followed by a data table or a doc string.

| Syntax | Meaning | Example |
|---|---|---|
| `@command` | A framework command, inside step text | `@invoke` |
| `type:name` | A named thing in the model or application | `process:order-approval` |
| `:name` | Something this scenario holds | `:approveItem` |
| `as :name` | Keep the command's result under that name | `as :orderInstance` |
| `"value"` | A literal string | `"end"` |
| `${...}` | A JavaScript expression | `${now}` |
| `@tag` on its own line | A standard Gherkin tag | `@feature:order-approval` |

Names set with `as` last for one scenario. A name always refers to the thing, not a copy: `@check :approveItem status` reads the item as it is at that moment, so it sees `end` after the invoke.

Gherkin rules that bind these files:

- Step keywords are case-sensitive: `And`, never `and`.
- Put comments on their own line, not after a table row.

## Commands

The first set, kept small on purpose:

| Command | Does | Engine equivalent |
|---|---|---|
| `@login` | Sets who the following steps act as: user name and roles | The API's user (`ISecureUser`) |
| `@start` | Starts a process | `start` |
| `@find` | Finds one item by query and keeps it | Item query |
| `@invoke` | Completes an item, with the table as data | `invoke` |
| `@check` | Fails the scenario unless a statement holds | None: reads the instance |
| `@wait` | Waits until a statement holds, for what happens later | None: reads the instance |
| `@stub` | Replaces a service or a timer for this scenario | None: see [Stubs](#stubs) |
| `@script` | Runs JavaScript statements from a doc string | None |

`@login` does not sign in to the site: there is no session or password. Steps go through the engine's API layer as that user, so the same assignment rules apply as for a real user.

Other commands are added only when a test needs one. Applications register their own commands and reference types.

### Finding an item

`@find` takes a model element, an instance and a query table. Table fields use the engine's own item fields, with `item.` standing for the engine's `items.`:

| In the table | Sent to the engine |
|---|---|
| `item.status` | `items.status` |
| `item.itemKey` | `items.itemKey` |
| `element:approve-order` | `items.elementId` |
| `in :orderInstance` | `id` |

`@find` must match exactly one item. No match, or several, fails the step and lists what was found. In a loop or multi-instance task, add fields until one item matches; `item.itemKey` is the key the engine gives each one.

`@invoke element:x in :instance` is the short form of finding that element's waiting item, then invoking it. The same exactly-one rule applies.

### Checks

```gherkin
Then @check :orderInstance status is "end"
  And @check :orderInstance data.amount > 1000
  And @check :orderInstance passed element:approve-order
  And @check ${data.amount > 1000}
```

These cover what scenario checks do today: status, data values and nodes passed.

### Waiting

`@wait` takes the same statements as `@check`, and keeps reading until the statement holds:

```gherkin
When @wait :orderInstance status is "end"
  And @wait :orderInstance status is "end" within 2 minutes
```

It fails if the time runs out, saying what it last read. `within` is optional and has a default. `@check` itself never waits. On a server with `TIMERS=false`, a timer doesn't fire, so a wait on one times out.

### Stubs

A stub replaces a service or a timer, so a test doesn't call a real system or wait three days:

```gherkin
Given @stub service:credit-check with
  """javascript
  if (input.orderId !== 5001) {
    throw new Error(`Expected orderId 5001, received ${input.orderId}`)
  }
  return { approved: true }
  """
And @stub timer:wait-3-days with 5 seconds
When user:Johnson @login with role of "HR-Manager"
And @start process:order-approval as :orderInstance
  | orderId | 5001 |
Then @wait :orderInstance status is "end"
And @check :orderInstance data.decision is "approved"
```

| Reference | Matches | Replaced by |
|---|---|---|
| `service:<name>` | Every service task calling that service (`implementation` or `delegateExpression`) | The doc string: `input` is the task's input, and what it returns is the task's output |
| `timer:<element>` | The timer event with that element id | The time given |

The `@start` table is the start data. `@wait` is needed here because `@start` returns while the process waits on the timer, and `@check` doesn't wait.

Rules:

- **A stub reaches only its own scenario's instances**, including processes they call. Other instances in the same engine, and other scenarios, still get the real service and timer.
- **Stubs can't be set from outside a test.** They are held in the engine's memory by the test run, under an instance id it chose before starting, and are not `start` options or instance flags. Otherwise an API caller could send code to run in the engine.
- **A stub service runs even with `SERVICE_TASKS=false`.** That setting prevents real calls, and a stub makes none. A stub timer still needs `TIMERS` on.
- **A stub runs like `@script`:** in the engine, under the script handler, with no operating system access.
- **A stub naming nothing in the model fails the scenario**, so a renamed service or timer can't silently leave the real one running.
- **A `throw` in a stub behaves as a real service's exception.** With `camunda:exceptionsAsErrors="true"` and an error event that catches it, it is raised there as a BPMN error and the process goes on. Otherwise the item's status is `error` and the step fails with its message. So a stub tests a model's error handling either way.
- **`fail("message")` in a stub always fails the scenario**, whatever the model does. Use it for an assertion on a task that may catch exceptions: there, a failed `throw` would become the process's own error path, and the test could pass.
- **A stub can also return `{ bpmnError: "<code>" }`**, as a real service does.

Connectors aren't covered yet: `@stub connector:<name>` is added when a test needs it.

## Where it runs

```text
Test tab or command line
        |  the feature's text
        v
      Host                    browses, designs, asks
        |  one engine call
        v
      Engine                  parses and runs every step, expressions and scripts included
        |  results as JSON
        v
      Host                    shows them
```

- This works the same with a separate engine or one in the host's process. It uses the `calls` mechanism that already carries `runScenario`.
- With no engine, the host says one is needed.
- A production server has no modeler or testing, so it has nothing to run here.

**Inside the engine, tests stay honest.** Steps use the engine's public calls and receive JSON copies. `${...}` and `@script` get copies too, plus only the values listed below, and change things only through commands. A test can't pass by reaching what real callers can't.

Expressions can read `data`, `item`, `instance`, `context` and `now`. They run under the server's script handler, in the sandbox where one is set. `@script` has no operating system access.

## Parser and results

The engine uses the standard Gherkin parser (`@cucumber/gherkin`) with its own step runner. The `cucumber-js` runner doesn't fit, because the run is an engine call and not a command-line process. Results are written in Cucumber's JSON format, so standard report tools can read them.

## Files

| Today | Becomes | Holds |
|---|---|---|
| `<model>.tests.json` | `<model>.feature` | A model's scenarios |
| `<decision>.dmn.tests.json` | `<decision>.dmn.feature` | A decision's tests |
| `runs` inside those files | `<model>.runs.json` | Last runs and what they reached |

Run history moves out because a `.feature` file should change only when the test does. Coverage reads the runs file.

A one-time conversion turns existing `*.tests.json` into `.feature` files and removes the originals only after each converted file has run. The Test tab reads and writes `.feature` files, including what it records.

Decisions need one more command, `@evaluate decision:<name> as :result`, whose table is the decision's input.

## Tests reference features

A scenario, or a whole `Feature:`, names what it covers with a tag:

```gherkin
@feature:order-approval
```

`npm run features -- --check` reads these tags alongside today's `// @features:` comments and reports a tag that names no feature. Each application keeps its own catalog in the same format as `docs/features.yaml`, and the check reads both.

## Build order

1. The parser, step runner and engine call, with the first commands.
2. `@stub`, with its two small hooks in the engine: where a service task finds its service, and where a timer works out its due time.
3. Feature tags in the catalog check.
4. The Test tab reading and writing `.feature`, and the runs file.
5. Conversion of existing test files, then removal of the JSON format.
6. Application commands and reference types.

## Open

- A name's meaning across scenarios of one feature: the design says one scenario, which keeps scenarios independent. Shared setup uses Gherkin's `Background`.
- The default time for `@wait`, and how often it reads.

## Changes from the earlier proposal

| Earlier | Now | Why |
|---|---|---|
| Runs on the server or an API client | Always in the engine | All execution is in the engine |
| `@complete element:x` | `@find` and `@invoke`, or the short `@invoke` | An element is not an item; `invoke` is the engine's word |
| `as instance:order1` | `as :orderInstance` | A scenario's names need no type |
| `@assert`, `@status` | `@check` | One command for every check |
| `@load`, `@set`, `@signal`, `@query` | Left out of the first set | Added when a test needs one |
| Cucumber parser and execution | Gherkin parser, own step runner | The run is an engine call |
