# One context object

**Status:** survey and proposal, for review (branch `addons`). Part of 4.0, with [add-ons](add-ons.md) and the
packages' new OWF names.

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

One object, made for each call, the same wherever it's handed out:

```ts
interface IContext {
    instance: { id; name; status; data; startedAt; endedAt; initiator; ... };  // the case, as data
    item?: { id; elementId; name; type; status; data; input; output; assignee; ... };  // the item this call is about
    user: { userName: string | null; userGroups: string[] };     // who acts
    event?: string;                                              // for an event: its name and details
    details?: unknown;
    input?: any;                                                 // a service's input, a script's
    appServices; appVars;                                        // the application's
    names(): Record<string, any>;                                // what scripts and decisions see: data, item, instance, user, and what add-ons register (actors)
    log(message: string): void;                                  // into the instance's log
    decision(entry): void;                                       // into its Rationale
    engine: { start; throwMessage; throwSignal; ... };           // what may be asked of the engine from here
    /** @deprecated inside the engine only: the live execution, for code not yet moved */
    execution?: IExecution;
}
```

- **Made per call.** `item` is the item of this call, and stays so: no shared field that changes.
- **Data, with a few calls.** What it reads is data; what it does goes through its methods (`log`, `decision`,
  `engine.*`). The data parts can cross to a separate process as they are.
- **One set of names.** Scripts, expressions, decisions and the services all get their names from `names()`, so
  `actors` (registered by the Policies add-on) and `appVars` are the same everywhere.
- **Add-ons get it** in their events and checks, and the delegate's hooks get it in place of the execution or item.

## Compatibility

- **Services** keep `(input, context)`. The new context has `item`, `instance` and `user`, so what the apps read
  today (`context.item.id`, `context.instance.tenantId`) keeps working. `context.item.token.execution` and other
  engine internals are reachable through the deprecated `execution`, inside the engine only, until 5.0.
- **Delegate hooks** take the context. `executionStarted(execution)` and `serviceCalled(input, execution, item)` get
  the context in the first place; its `execution` is the old argument, for one major version.
- **Listeners and `executionEvent(context, event)`**: `context` is the new object; `context.item` is the event's item.
- **Scripts and expressions**: unchanged, their names come from `names()`.

## Impact

| | |
|---|---|
| Engine | The context made per call (`Token`, `Item`, `Execution`); every place that hands out the execution or an item hands it out instead; `ScriptHandler` and `DecisionContext` build from `names()` |
| bpmn-web | Its delegate (`WebAppDelegate`), its listeners, the pages that read `execution.item` |
| Add-ons | Built on it from the start (do this first) |
| Apps | Their services mostly unchanged; their delegates' hooks take the context |
| Docs | Scripting, services, the delegate, events |
| Tests | The engine's tests of services, listeners and the delegate; new tests that the context is the same shape inside and across |

## Order, with the other 4.0 changes

1. **Settle the context's shape** (this doc).
2. **Add-ons**, their events and checks taking it.
3. **Move the engine's other hand-outs to it**, in steps, with `execution` there meanwhile.
4. **Rename the packages to OWF.**
5. **Release 4.0.**

## Open

- How much of the engine `context.engine` offers: start, messages, signals, and the application's own calls (#294).
- Whether `execution` stays reachable outside the engine at all, or only inside it.
- Whether listeners keep the old `on(event, ({ context }))` form, with the new context in it, or move to `subscribe` only.
