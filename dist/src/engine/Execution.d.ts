/// <reference types="node" />
import { Item } from './Item';
import { Token } from './Token';
import { EXECUTION_STATUS, IHandler } from './Enums';
import { EventEmitter } from 'events';
import { Definition } from '../elements/Definition';
/**
 *  is accessed two ways:
 *      execute - start process
 *      signal  - invoke a node (userTask, event, etc.)
 * */
declare class Execution {
    id: any;
    name: any;
    startedAt: any;
    endedAt: any;
    saved: any;
    status: EXECUTION_STATUS;
    tokens: Map<any, any>;
    definition: Definition;
    handler: any;
    source: any;
    logger: any;
    data: any;
    logs: any[];
    listener: EventEmitter;
    /**
     *
     * @param name          process name
     * @param source        bpmn source
     * @param handler       a delegate object to handle services
     * @param logger        to capture log messages
     * @param listener      an event listener
     */
    constructor(name: string, source: any, handler?: IHandler, logger?: any, listener?: EventEmitter);
    getNodeById(id: any): any;
    getToken(id: number): Token;
    tokenEnded(token: Token): void;
    end(): Promise<void>;
    execute(startNode?: any, inputData?: {}): Promise<void>;
    signal(executionId: any, inputData: any): Promise<void>;
    getItems(query?: any): Item[];
    getState(): {
        source: any;
        items: any[];
        tokens: any[];
        loops: any[];
        id: any;
        name: any;
        startedAt: any;
        endedAt: any;
        status: EXECUTION_STATUS;
        saved: any;
        data: any;
        logs: any[];
    };
    static restore(state: any, handler: any, logger: any): Promise<Execution>;
    resume(): void;
    report(): void;
    uids: {};
    getNewId(scope: string): number;
    getUUID(): any;
    doExecutionEvent(event: any): Promise<void>;
    doTokenEvent(token: any, event: any): void;
    doItemEvent(item: any, event: any): void;
    log(msg: any): void;
    static scopeEval(scope: any, script: any): any;
    applyInput(inputData: any, dataPath?: any): void;
    getData(dataPath: any): any;
    getAndCreateData(dataPath: any, asArray?: boolean): any;
}
export { Execution };
