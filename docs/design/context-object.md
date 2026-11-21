# One context object

**Status:** built in 3.7.5 (`bpmn-server/src/engine/Context.ts`, tests `test/context.test.mjs`), with
[add-ons](add-ons.md): services, listeners and subscribers, the delegate's hooks, and the API's `pre-query` and
`pre-action` take it. Not yet: scripts and decisions build their names from it (they see `source`; their names are as
before), and a form's rules and choices are handed it. The packages' new OWF names stay for 4.0.

## Why

What the engine hands to code outside itself has grown one call at a time, and each got whatever was at hand: the
execution, an item, an instance, or a set of names. Code written against one doesn't work against another. Most of
them hand out the **live execution**, the engine's own object, so whoever gets it can do anything to the process. It
also can't cross to a separate process, which [engine isolation](engine-isolation.md) needs.

## What each gets today

| Who | Gets | Notes |
|---|---|---|
| A service (`appServices.x(input, context)`) | `context` = the **execution** (`item.context` is `token.execution`) | Apps read `context.item`, `context.instance`, `context.item.token.execution` |
| The delegate's `serviceCalled(input, execution, item)` | The execution, and the item | |
| `getServicesProvider(execution)`, `executionStarted(execution)` | The execution | |
| `messageThrown` / `signalThrown(…, item)`, `loadDataObject(name, item)` | An item | |
| `instanceLabel(instance)` | The instance (data) | |
| `decisionContext(context, about)` | The decision's names, and what it's about | |
| `notify(notification)` | A notification (data) | |
| Event listeners (`listener.on`), lifecycle subscribers, the delegate's `executionEvent(context, event)` | `context` = the execution, with `execution.item` set to the current item just before | `execution.item` is one field, overwritten for each event |
| Scripts and expressions | Names built from the item: `data`, `item`, `instance`, `input`, `appServices`, `appVars`, `actors`, `user` | Their own scope, not an object |
| Decisions (DMN) | The same names, built separately (`engine/DecisionContext.ts`) | |
| Add-ons (`register(server)`, model checks) | The server; a check object | New, unreleased |

In this repository, the execution is reached through `.execution` about 100 times, and `item.context` 32 times. The
apps' services read `context.item` (its id, element, key), `context.instance` (`tenantId`), and
`context.item.token.execution`.

## The problems

1. **No single shape.** The same thing (the item that's running, the case, the user) is reached differently in each place.
2. **Too much power.** The live execution lets a service or listener change tokens, save, or end the process.
3. **`execution.item` is shared and changing.** It's set just before each event, so code that keeps the context and
   reads `.item` later can see another item. With two branches running, it's the wrong one.
4. **It can't cross a process boundary.** With the engine apart, what reaches the host must be data. Today that is a
   second shape (`executionResult`).
5. **Scripts, decisions and services each build their names their own way**, so `actors` or `appVars` are in one
   and not another, or differ.

## The proposal

One object, the **context**, made for each call and the same wherever it's handed out: services, scripts and
expressions, decisions, add-ons, the delegate's hooks and listeners. It lives in the engine's process only (B in
[the architecture's parts](../docs/architecture.md#parts)); what leaves it is data, through the API.

### Five kinds

Every context says where it was made, its **`source`** (today's `evaluatingSource`, renamed). There are five kinds:

| # | `source.kind` | Made for | The context holds |
|---|---|---|---|
| 1 | `item` | an item that exists: its scripts, a service it calls, an event about it, an action on it | `user`, `instance`, `element`, `item`, `data`, `input` |
| 2 | `element` | an element with no item yet: a flow's condition, a start event's permission (`canStart`), a timer's expression | `user`, `element`, `input`; `instance` when there is one (a flow's condition has one, `canStart` doesn't) |
| 3 | `dmn` | a decision: a policy (assignment, security, notification) or a business-rule task | the decision, `input`; the `item` or the `instance` it was called from |
| 4 | `query` | a read: the API's `pre-query` | `user`, the kind (`instances`, `items`, `models`), the `query` |
| 5 | `form` | a form field's rules and choices | `user`, the field, `input` (the form's values); the `item`, or the `element` and the `instance` |

`source` also says which one: the element and which expression or script, the flow, the decision and which policy,
the field.

### What it is

- **Made per call.** `item` is the item of this call, and stays so: no shared field that changes (`execution.item`).
- **The live objects.** `instance`, `item` and `data` are the engine's own, as scripts use them today (`data.x = 1`).
  Nothing is copied, nothing copied back.
- **Acting.** Code that acts on the process reaches the execution through `instance`, as it does today. The context
  has no methods of its own, and code in the engine doesn't go through the API.
- **The user** is the user object (`user`): who acts. Who *calls* is `source`.
- **Actors** are the instance's: `instance.actors`, stored on the instance. An expression with no item reads them the
  same way.
- **Terms and functions** are the application's methods: `appVars.<name>` (one method of `appVarsClass` per term,
  called only for the names an expression reads, once each) and `appServices.<name>(...)`. Both are called with the
  context. Nothing is worked out in advance, so the context has no list of names: scripts, expressions and decisions
  read its fields, `appVars` and `appServices`.

```ts
interface IContext {
    source: { kind: 'item' | 'element' | 'dmn' | 'query' | 'form'; ... };  // where it was made
    user: ISecureUser;                 // who acts
    instance?: IInstance;              // the case; instance.actors its actors
    element?: IElement;                // the model's element
    item?: IItem;                      // the item of this call (kind 1; 3 and 5 when called from one)
    data?: any;                        // the instance's data, or the item's scope of it
    input?: any;                       // a service's input, a message's, a form's values
    decision?: string;                 // kind 3
    query?: object; kind?: string;     // kind 4
    field?: string;                    // kind 5
    appVars; appServices;              // the application's terms and functions
}
```

## Changing the context contract

The context is a contract between the engine and the application's code: what a service, a script, a decision, a
listener and the delegate's hooks are handed. Changing it is changing that contract, for every install. The last
release is 3.6.1; what follows is against it.

### The contract, before and after

| Who | 3.6 hands it | 3.7.5 hands it |
|---|---|---|
| A service `(input, context)` | `context` = the execution | `context` = the context |
| Listeners, `executionEvent(context, event)` | `context` = the execution, `execution.item` set just before | the context; `context.item` the event's item |
| `executionStarted(execution)`, `getServicesProvider(execution)` | the execution | the execution, then the context |
| `serviceCalled(input, execution, item)` | the execution and the item | the same, then the context |
| `messageThrown`, `signalThrown`, `loadDataObject` | an item | the item, then the context |
| Scripts, expressions, decisions | names built in two places | the context's fields, the same in both |
| What is evaluating | `evaluatingSource` | `source` |
| Actors | worked out by the policies | `instance.actors` |

### What an install sees

| A 3.6 install's code | 3.7.5 |
|---|---|
| Reads `context.item`, `context.instance` in a service | works: they are the live objects |
| Reads `context.item.token.execution` | works |
| Uses `context` as the execution (`context.tokens`, `context.save()`, `context.getNodeById(...)`) | works, deprecated: the context forwards the execution's members, and logs once that it's used so |
| Overrides a delegate hook | works: its arguments are as before, the context added at the end |
| Reads `execution.item` in a listener | works, deprecated: `context.item` is the event's own item |
| Reads `evaluatingSource` | works, deprecated: `source` |
| Stored instances, with no `actors` | work: `instance.actors` is worked out when missing; no migration |
| Overrides `SecureUser`'s `qualify*` or `can*` | works: an override is still called, beside `pre-query` / `pre-action`, and the start warns it's deprecated |

So 3.7.5 is a minor release: nothing a 3.6 install does stops working. What is deprecated is removed in 4.0.

### The rule for the contract from here

- The context is the **only** thing handed to the application's code. New hooks, events and add-on calls take the
  context, nothing else.
- Fields are added, never removed or changed in meaning, within a major version.
- What the context forwards of the execution is for 3.x only.

## Impact

| | |
|---|---|
| Engine | The context made per call (`Token`, `Item`, `Execution`); every place that hands out the execution or an item hands it out instead; `ScriptHandler` and `DecisionContext` build it the same way; `evaluatingSource` → `source`; `instance.actors` stored |
| bpmn-web | Its delegate (`WebAppDelegate`), its listeners, the pages that read `execution.item` |
| Add-ons | Their events, checks and `pre-query` / `pre-action` take it |
| Apps | Their services mostly unchanged; their delegates' hooks take the context |
| Docs | Scripting, services, the delegate, events |
| Tests | The engine's tests of services, listeners and the delegate; a test for each of the five kinds |

## Open

- Whether listeners keep the old `on(event, ({ context }))` form, with the new context in it, or move to `subscribe`
  only.
