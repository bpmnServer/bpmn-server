import { EventEmitter } from "events";
import { IExecution } from "../interfaces";

class Listener extends EventEmitter {

    async doEvent(event,execution,item=null ,eventDetails={}) {
        execution.item = item;
        await this.delegateEvent(event, execution,eventDetails);        
        await this.emit(event, { event, context: execution,eventDetails });
        await this.emit('all', { event, context: execution,eventDetails });
    }
    async delegateEvent(event, execution: IExecution,eventDetails) {

        const app= execution.appDelegate;
        const defDelegate = null;//execution.defDelegate;

        if (app[event]) {
            // method exists in the component
            await app[event](event,execution,eventDetails); // call it
        }
        if (defDelegate && defDelegate[event]) {
            // method exists in the component
            await defDelegate[event](event, execution,eventDetails); // call it
        }

       
    }


}

export {Listener}