/// <reference types="node" />
import { EventEmitter } from "events";
import { IExecution } from "../interfaces";
declare class Listener extends EventEmitter {
    doEvent(event: any, execution: any, item?: any): Promise<void>;
    delegateEvent(event: any, execution: IExecution): Promise<void>;
}
export { Listener };
