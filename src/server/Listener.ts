import { EventEmitter } from "events";
import { IExecution } from "../interfaces";

class Listener extends EventEmitter {

    async doEvent(event,execution,item=null ) {
        execution.item = item;
        await this.delegateEvent(event, execution);        
        await this.emit(event, { event, context: execution });
        await this.emit('all', { event, context: execution });
    }
    async delegateEvent(event, execution: IExecution) {

        const app= execution.appDelegate;
        const defDelegate = null;//execution.defDelegate;

        if (app[event]) {
            // method exists in the component
            await app[event](event,execution); // call it
        }
        if (defDelegate && defDelegate[event]) {
            // method exists in the component
            await defDelegate[event](event, execution); // call it
        }

       
    }


}

export {Listener}