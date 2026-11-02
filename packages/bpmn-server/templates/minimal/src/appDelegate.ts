// Your application's part of the workflow: the services models call, and what happens on engine events.
// WebAppDelegate (bpmn-web) already reports hung items on startup and sends notification emails.
import { WebAppDelegate } from 'bpmn-web';

/** The services a service task calls by name (its implementation or delegateExpression). */
class AppServices {
    /** Hello.bpmn's Greet task: input { name }, the result stored as data.greeting. */
    async greet({ name }, context) {
        return `Hello ${name || 'there'}, from ${context.instance.name}`;
    }
}

export class AppDelegate extends WebAppDelegate {
    services = new AppServices();

    async getServicesProvider(context) {
        return this.services;
    }

    // Other hooks you can add (see the bpmn-server docs, "Application delegate"):
    //   async executionStarted(execution) / executionEnded(execution)
    //   async loadDataObject(name, item)       a data object's value when an element connected to it runs
    //   async messageThrown(...) / signalThrown(...)
}
