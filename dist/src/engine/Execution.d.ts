/// <reference types="node" />
import { Item } from './Item';
import { Token } from './Token';
import { Node } from '../elements/';
import { EXECUTION_STATUS, IDefinition, ExecutionContext } from '../../';
import { IInstanceData, IExecution, IAppDelegate } from '../../';
import { EventEmitter } from 'events';
/**
 *  is accessed two ways:
 *      execute - start process
 *      signal  - invoke a node (userTask, event, etc.)
 * */
declare class Execution implements IExecution {
    id: any;
    name: any;
    startedAt: any;
    endedAt: any;
    saved: any;
    status: EXECUTION_STATUS;
    tokens: Map<any, any>;
    definition: IDefinition;
    appDelegate: IAppDelegate;
    source: any;
    logger: any;
    data: any;
    logs: any[];
    parentItemId: any;
    listener: EventEmitter;
    executionContext: any;
    promises: any[];
    /**
     *
     * @param name          process name
     * @param source        bpmn source
     * @param executionContext
     */
    constructor(name: string, source: any, executionContext: ExecutionContext);
    getNodeById(id: any): Node;
    getToken(id: number): Token;
    tokenEnded(token: Token): void;
    end(): Promise<void>;
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
    getItems(query?: any): Item[];
    getItemsData(): any[];
    getState(): IInstanceData;
    static restore(state: IInstanceData, executionContext: any): Promise<Execution>;
    restored(): void;
    resume(): void;
    report(): void;
    uids: {};
    getNewId(scope: string): number;
    getUUID(): any;
    doExecutionEvent(event: any): Promise<void>;
    doItemEvent(item: any, event: any): Promise<void>;
    log(msg: any): void;
    applyInput(inputData: any, dataPath?: any): void;
    getData(dataPath: any): any;
    getAndCreateData(dataPath: any, asArray?: boolean): any;
}
export { Execution };
