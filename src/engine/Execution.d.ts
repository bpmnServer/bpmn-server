import { Item } from './Item';
import { Token } from './Token';
import { Node, Process } from '../elements/';
import { EXECUTION_STATUS, IDefinition } from '../../';
import { IInstanceData, IExecution } from '../../';
import { ServerComponent } from '../server';
import { InstanceObject } from './Model';
/**
 *  is accessed two ways:
 *      execute - start process
 *      signal  - invoke a node (userTask, event, etc.)
 * */
declare class Execution extends ServerComponent implements IExecution {
    instance: InstanceObject;
    tokens: Map<any, any>;
    definition: IDefinition;
    process: Process;
    errors: any;
    item: any;
    input: {};
    output: {};
    messageMatchingKey: any;
    worker: any;
    currentUser: any;
    promises: any[];
    get id(): any;
    get name(): any;
    get status(): EXECUTION_STATUS;
    get execution(): this;
    tillDone(): Promise<this>;
    get listener(): any;
    /**
     *
     * @param name          process name
     * @param source        bpmn source
     */
    constructor(server: any, name: string, source: any, state?: any);
    getNodeById(id: any): Node;
    getToken(id: number): Token;
    tokenEnded(token: Token): void;
    end(): Promise<void>;
    /**
     *
     * causes the execution to stop from running any further
     * */
    terminate(): void;
    /**
     *
     * causes the execution to stop from running any further
     * */
    stop(): void;
    execute(startNodeId?: any, inputData?: {}, options?: {}): Promise<void>;
    /**
     *
     * invoke scenarios:
     *      itemId
     *      elementId   - but only one is active
     *      elementId   - for a startEvent in a secondary process
     *
     * @param executionId
     * @param inputData
     *
     */
    signal(executionId: any, inputData: any): Promise<void>;
    private save;
    getItems(query?: any): Item[];
    getItemsData(): any[];
    getState(): IInstanceData;
    /**
     *  re-enstate the execution from db
     * @param state

     */
    static restore(server: any, state: IInstanceData): Promise<Execution>;
    restored(): Promise<void>;
    resume(): Promise<void>;
    report(): void;
    uids: {};
    getNewId(scope: string): number;
    getUUID(): any;
    doExecutionEvent(process: any, event: any): Promise<void>;
    doItemEvent(item: any, event: any): Promise<void>;
    log(msg: any): void;
    error(msg: any): void;
    appendData(inputData: any, dataPath?: any): void;
    getData(dataPath: any): any;
    getAndCreateData(dataPath: any, asArray?: boolean): any;
}
export { Execution };
