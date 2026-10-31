import { IDefinition, IExecution, IItem } from "./";

class BaseProcessDelegate {
    definition;
    execution;
    get data() {
        return this.execution ? this.execution.instance.data : {};}
    constructor() {
    }

    async definition_loaded(definition: IDefinition) {
        this.definition = definition;
    }
    async execution_started(execution: IExecution) {
        this.execution= execution;
    }
    async execution_stopped(execution) { }
    async execution_restored(execution) {
        this.execution = execution;
    }
    async execution_saving(execution) { }
    async execution_saved(execution) { }
    async execution_ended(execution) { }

    async item_started(execution: IExecution, item: IItem) { }
    async item_ended(execution, item) { }

    async item_validate(execution, item, data) { }
    async item_perform(execution, item, data) { }

}

export class BuyUsedCarDelegate extends BaseProcessDelegate {
    accessRules = [
        {
            "type": "DesignateRule",
            "id": "1",
            "event": "process.start",
            "user": "$current",
            "assignActor": "owner"
        },
        {
            "type": "AuthorizeRule",
            "id": "2",
            "event": "process.start",
            "userGroup": "Admin",
            "privilege": "View"
        },
        {
            "type": "AuthorizeRule",
            "id": "3",
            "event": "start",
            "actor": "owner",
            "privilege": "Perform",
            "element": "task_Buy"
        },
        {
            "type": "NotifyRule",
            "id": "4",
            "event": "wait",
            "actor": "owner",
            "element": "task_Buy",
            "template": "test"
        },
        {
            "type": "NotifyRule",
            "id": "5",
            "event": "end",
            "user": "user1",
            "element": "task_Buy",
            "template": "test"
        },
        {
            "type": "AssignRule",
            "id": "6",
            "event": "start",
            "actor": "owner",
            "element": "task_Buy"
        },
        {
            "type": "AssignRule",
            "id": "7",
            "event": "start",
            "userGroup": "cleaner",
            "element": "task_Clean"
        },
        {
            "type": "AssignRule",
            "id": "8",
            "event": "start",
            "userGroup": "driver",
            "element": "task_Drive"
        }
    ];
    constructor() {
        super();
    } 

    async definition_loaded(definition: IDefinition) {
        definition.accessRules = this.accessRules;
    }


}
/** 
 *  Is called by Definition.delegateLoader
*/
export function definitionDelegate () {
    return new BuyUsedCarDelegate();
}
