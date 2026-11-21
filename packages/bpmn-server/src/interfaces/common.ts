import type { IDocumentStore, ILockManager } from './storage.js';
import { NODE_ACTION, FLOW_ACTION } from './Enums.js';
import type { IModelsDatastore, IDataStore } from './datastore.js';
import type { IExecution, IItem, IScriptHandler } from './engine.js';
import type { ICacheManager } from './server.js';
import type { IAddOn, IAddOnManifest } from '../engine/AddOns.js';


interface IConfiguration 
{
    definitionsPath?: string,
    templatesPath?: string,
    timers: {
        forceTimersDelay?: number,
        precision?: number,
        /** Milliseconds between re-reads of waiting timers, so a timer another server scheduled is fired here when that server is gone (0: never; default 60000). */
        pollInterval?: number,
    },
    database: IMongoDBDatabaseConfiguration | ISQLiteDatabaseConfiguration,
    apiKey: string,
    /** Extensions to the BPMN model's types (bpmn-moddle's); reading a model needs them, in and out of the engine. */
    moddleOptions?: any;
    /** Where the application's delegate's source is, read at start for its services' names (default delegates/appDelegate.ts). */
    delegateFile?: string;
    /**
     * The names of the application's services, read from the delegate's source at start (bpmn-web: runtime/serviceNames.ts),
     * for what checks models outside the engine; null when it could not be read (the engine is asked instead).
     */
    serviceNames?: string[] | null | Promise<string[] | null>;
    /** No longer read (before 3.7.2: a services.json the scan wrote); the names come from the delegate's source. */
    servicesFile?: string;
    logger: ILogger,
    definitions(server): IModelsDatastore,
    appDelegate(server): IAppDelegate,
    dataStore(server): IDataStore,
    scriptHandler(server): IScriptHandler,
    cacheManager(server): ICacheManager,
    /** The storage adapter both data stores use (MongoDB when absent): an in-memory store, an application's database. */
    documentStore?(server): IDocumentStore,
    /** The lock adapter (the data store's own when absent). */
    locker?(server): ILockManager,
    /**
     * What is built on the engine and plugs into its hooks (engine/AddOns.ts): by default the policies (assignment,
     * notification, security). `() => []`: the engine alone.
     */
    addOns?(server): IAddOn[],
    /** Every add-on bpmn-server comes with, on or off: their manifests (which attributes each reads). */
    addOnManifests?(): IAddOnManifest[],
    /** Where the application's app-config.json is (which add-ons are on); the working folder's by default. */
    appConfig?: string,
    /** This process's identity as a lock owner (default `SERVER_ID`, else host, process id and a random suffix). */
    serverId?: string,
    locks?: {
        /** Milliseconds between lock tries (1500). */
        retryDelay?: number,
        /** Tries before a lock gives up (20). */
        maxTries?: number,
        /** Milliseconds after which a lock or a timer claim is stale (300000). */
        staleAfter?: number,
    },
    /** How long `shutdown()` waits for running executions, in milliseconds (10000). */
    shutdownTimeout?: number,
    /**
     * false: timers are never scheduled: a timer event waits until it is invoked, and no process starts on a timer. It
     * says so in the run's decisions. Default true.
     */
    runTimers?: boolean,
    /** false: service tasks call nothing: they end with no output, and say so in the run's decisions. Default true. */
    runServiceTasks?: boolean,
    /** @deprecated Both of the above false. Set them instead. */
    demo?: boolean,
    /** Each save of a model keeps a version in `.history/<name>/` beside it, for the editor's History tab (default true). */
    modelHistory?: boolean,
    /**
     * false: a form's rules (a field's type, its constraints, a list's choices: elements/FormRules.ts) are not checked
     * when a user task is completed (the validate event still runs). Default true.
     */
    formRules?: boolean,
    /** Connectors' calls (docs/docs/connectors.md): the defaults a connector's own timeout and retries override. */
    connectors?: IConnectorsConfiguration,
}

interface IConnectorsConfiguration {
    /** ms a call waits for its answer; default 30000 */
    timeout?: number;
    /** further tries of an idempotent call (GET, HEAD, PUT, DELETE) after a network error, 429 or 5xx; default 2 */
    retries?: number;
    /** ms before the first retry, doubled for each next one; default 200 */
    retryDelay?: number;
    /** the largest answer read, in bytes; default 5 MB */
    maxResponseBytes?: number;
}

interface IDatabaseConfigurationBase {
    loopbackRepositories?:any
}
interface IMongoDBDatabaseConfiguration extends IDatabaseConfigurationBase {
    MongoDB: {
        db_url: string,
        db: string,
        Locks_collection:string,
        Instance_collection:string,
        Archive_collection:string
    }
}
interface ISQLiteDatabaseConfiguration extends IDatabaseConfigurationBase {
    SQLite: {
        db_connection: string,
    },
}


/**
 * A logging tool to take various message for monitoring and debugging
 * 
 * it can also keep the message in memory till saved later through saveToFile
 * msgs can be cleared by the clean method
 * 
 * */
interface ILogger {
    /**
     * 
     * @param toConsole boolean 
     *  writes to the output console
     * @param toFile string 
     * writes to file
     *
     */

    setOptions({ toConsole, toFile, callback }: {
        toConsole: any;
        toFile: any;
        callback: any;
    }): void;
    clear(): void;
    get(): any[];
    debug(...message: any): void;
    warn(...message: any): void;
    log(...message: any): void;
    /** Why the engine took a path (an instance log entry of type 'decision'); optional for older loggers. */
    decision?(...message: any): any;
    error(err: any): void;
    reportError(err: any): void;
    save(filename: any): Promise<void>;
    saveForInstance(instanceId:string);
}

/**
 * Object to respond to all named services
 */
interface IServiceProvider {
    [serviceName: string]: CallableFunction | IServiceProvider;
}

/**
 *  Application Delegate Object to respond to various events and services:
 *  
 *  1.  receive all events from workflow
 *  2.  receive service calls
 *  3.  receive message and signal calls 
 *  4.  execute scripts 
 *  
 * */
interface IAppDelegate {
    moddleOptions;
    /**
     * Get the service task handlers, default to `this`, so you can add handlers on this class directly.
     */
    /** `context`: the call's (docs/design/context-object.md), added in 3.7.5; the execution, as before, first. */
    getServicesProvider(execution: IExecution, context?: any): IServiceProvider | Promise<IServiceProvider>;
    sendEmail(to, msg, body);
    /** `context`: the process's (docs/design/context-object.md), added in 3.7.5. */
    executionStarted(execution: IExecution, context?: any);
    startUp(options); // start of server
    messageThrown(signalId: string, data, messageMatchingKey: any, item: IItem, context?: any);
    signalThrown(signalId: string, data, messageMatchingKey: any, item: IItem, context?: any);
    /**
     * 
     * is called when an event throws a message that can not be answered by another process
     * 
     * @param messageId
     * @param data
     */
    issueMessage(messageId: string, data);
    issueSignal(messageId: string, data);
    /**
     * is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.
     * 
     * @param item
     */
    serviceCalled(input: Record<string, unknown>, execution: IExecution, item: IItem, context?: any): unknown;
    /**
     * Optional. Loads a data object of the model (a BPMN data object or data store, by its name) when an element
     * connected to it runs (a data association, either way, e.g. a start event or a service task). The value is
     * put in the instance data under the name (`data.client`) and saved with the instance like any data.
     *
     * @param name  the data object's name
     * @param item  the running item: its element, token and the instance data (item.data)
     */
    loadDataObject?(name: string, item: IItem, context?: any): unknown | Promise<unknown>;

    /**
     * Optional. The application's facts for a decision table (a business rule task's decision, an assignment policy,
     * a security policy: engine/DecisionContext.ts), before it is evaluated: what it returns is added to what the
     * table reads (`{ managerOf: true }`; `userGroups`, the user's groups when only the application knows them). Called
     * for each decision, a security policy's once per case and task it decides on; keep it quick. A failure is
     * logged, and the table decides without the application's facts.
     *
     * @param context  what the table reads so far (docs/design/expressions.md): the data's fields, the task's prepared
     *                 inputs, data, user, actors, task, decision, item, instance, appServices
     * @param about    what is deciding (kind: decision, assignment or security; name), for whom, on what case and task
     */
    decisionContext?(context: Record<string, any>, about: { kind: 'decision' | 'assignment' | 'security'; name?: string; user: { userName?: string | null; userGroups?: string[] }; instance?: any; task?: string }): Record<string, any> | void | Promise<Record<string, any> | void>;

    /**
     * Optional. Delivers a notification a notification policy decided on (addons/policies/notification/NotificationPolicy.ts,
     * docs/design/notification-policies.md): whom (`to`: user names and groups), `subject`, `message`, `channel`.
     * It is kept in wf_notifications either way; not called for a test run's instance, nor with NOTIFICATIONS=record.
     * A failure is kept with the notification and said in the Rationale; the process goes on.
     */
    notify?(notification: { id: string; instanceId: string; event: string; to: string[]; subject: string; message: string; channel?: string; [more: string]: any }): void | Promise<void>;

    /**
     * Optional. The application's own checks on a model, run by verifyModel (the model editor's check, the
     * import checks, `bpmn-server verify` with a server) after its own, on a model the engine could load.
     * Returns issues in verifyModel's form; `severity` defaults to 'error'. Called without a running execution.
     *
     * @param model  the model's name, its XML and the loaded Definition
     */
    verifyModel?(model: { name: string; source: string; definition: any }): IAppModelIssue[] | Promise<IAppModelIssue[]>;

    /**
     * Optional. A case's label, for a model that has no camunda:label of its own (addons/labels/Labels.ts): computed in
     * code when it is shown. Undefined: the default, `<model> #<caseId>`.
     */
    instanceLabel?(instance: any): string | undefined | Promise<string | undefined>;
}

/** An issue an application's verifyModel reports (verifyModel's IModelIssue). */
interface IAppModelIssue {
    severity?: 'error' | 'warning' | 'info';
    /** stable identifier of the check, e.g. 'ambiguous-route' */
    code: string;
    message: string;
    elementId?: string;
    elementName?: string;
}

export { ILogger, IAppDelegate, IAppModelIssue, IConfiguration, IConnectorsConfiguration, IServiceProvider }
