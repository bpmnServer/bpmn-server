# Custom delegates

The app delegate is your application's code that the engine calls: the services service tasks call, and hooks on what the engine does. A web application's delegate extends bpmn-web's `WebAppDelegate`; an embedded engine's, `DefaultAppDelegate`. Service tasks are in [Application integration](customization.md#implement-service-tasks-in-application-code).

## AppDelegate Class

This class handles application specific calls. Extend `DefaultAppDelegate` and override what you need:

```ts
startUp(options);                       // the server starts
getServicesProvider(execution);         // the object whose methods service tasks call (default: the delegate)
serviceCalled(input, execution, item);  // a service task names no service the provider has
executionStarted(execution);
messageThrown(messageId, data, messageMatchingKey, item);
signalThrown(signalId, data, messageMatchingKey, item);
issueMessage(messageId, data);          // a message no process is waiting for
issueSignal(signalId, data);
sendEmail(to, msg, body);
moddleOptions;
```

