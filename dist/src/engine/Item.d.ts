import { Execution } from "./Execution";
import { ITEM_STATUS } from "./Enums";
import { Element } from '../elements';
declare class Item {
    id: any;
    element: Element;
    token: any;
    startedAt: any;
    seq: any;
    _status: ITEM_STATUS;
    _endedAt: any;
    _dbAction: 'add' | 'update' | null;
    get name(): any;
    get status(): ITEM_STATUS;
    set status(val: ITEM_STATUS);
    get endedAt(): any;
    set endedAt(val: any);
    constructor(element: any, token: any, status?: ITEM_STATUS);
    save(): {
        id: any;
        seq: any;
        tokenId: any;
        elementId: any;
        name: any;
        status: ITEM_STATUS;
        startedAt: any;
        endedAt: any;
        type: any;
    };
    static load(execution: Execution, dataObject: any, token: any): Item;
}
export { Item };
