# Custom delegates

The app delegate is your application's code that the engine calls: the services service tasks call, and hooks on what the engine does. A web application's delegate extends bpmn-web's `WebAppDelegate`; an embedded engine's, `DefaultAppDelegate`. Service tasks are in [Application integration](customization.md#implement-service-tasks-in-application-code).

## AppDelegate Class

This class handles application specific calls. Extend `DefaultAppDelegate` and override what you need:

```ts
startUp(options);                       // the server starts
getServicesProvider(execution, context);         // the object whose methods service tasks call (default: the delegate)
serviceCalled(input, execution, item, context);  // a service task names no service the provider has
executionStarted(execution, context);
messageThrown(messageId, data, messageMatchingKey, item, context);
signalThrown(signalId, data, messageMatchingKey, item, context);
loadDataObject(name, item, context);
executionEvent(context, event);                  // every event
issueMessage(messageId, data);                   // a message no process is waiting for
issueSignal(signalId, data);
sendEmail(to, msg, body);
moddleOptions;
```

**The context** (3.7.5) is the call's: `source` (where it was made: `item`, `element`, `dmn`, `query`, `form`),
`user`, `instance` (its actors: `instance.actors`), `element`, `item` (the item of this call, fixed for it), `data`,
`input`. A service is called `service(input, context)`. The hooks' earlier arguments are still given first. What the
context doesn't have it reads from the execution, as the execution was what code was handed before (`context.tokens`):
deprecated, removed in 4.0; reach the execution through `context.item.token.execution`. See
`docs/design/context-object.md`.

