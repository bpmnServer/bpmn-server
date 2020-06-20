import { IExecution, Item, NODE_ACTION, FLOW_ACTION, IAppDelegate , IDefinition, IExecutionContext } from "../..";

var seq = 1;

class DefaultAppDelegate implements IAppDelegate {
    constructor(logger = null) {
    }
    executionStarted(execution: IExecutionContext) {

        let self = this;
        execution.listener.on('all',async function (eventApi) {
            await self.executionEvent(eventApi);
        });
    }
    async executionEvent({ event, item, execution }) {
        let object;
        if (event.startsWith('execution.'))
            object = execution;
        else
            object = item;
    }
    messageIssued( item: Item) { }
    signalIssued(item: Item) { }
    serviceCalled(item: Item) { }

    scopeEval(scope, script) {
        let result;
        try {
            result = Function('"use strict";return (' + script + ')').bind(scope)();
        }
        catch (exc) {
            console.log(exc);
        }
        return result;
    }
    async scopeJS(scope, script) {
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

        let result;
        try {
            scope.token.log("..executing js " + scope.id);
            result = await new AsyncFunction('"use strict";' + script).bind(scope)();
            scope.token.log("..executing js is done " + scope.id);
        }
        catch (exc) {
            console.log(exc);
        }
        return result;

    }
}


async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}
export { DefaultAppDelegate }


