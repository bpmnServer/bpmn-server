/// <reference types="node" />
import { IEngine, BpmnCreateOptions, BpmnExecutionOptions } from './API';
import { EventEmitter } from 'events';
declare class CustomEngine implements IEngine {
    protected engine: any;
    protected logger: any;
    constructor(logger: any);
    getImplemntingEngine(): any;
    create(options: BpmnCreateOptions): any;
    execute(options: BpmnExecutionOptions): Promise<any>;
    recover(state: any): any;
    resume({ listener }: {
        listener: any;
    }, callback: any): Promise<void>;
    stop(): Promise<void>;
    invoke(task: any, data: any): void;
    eventFired(event: any, task: any, callback: any): void;
    getListener(engine: any, callback?: any): EventEmitter;
    getExtensions(): {};
    getServices(): {};
    getModdleOptions(): {};
    getState(): Promise<any>;
    get state(): string;
    getFields(taskId: any): Promise<any[]>;
    getElements(): Promise<any[]>;
}
export { CustomEngine };
