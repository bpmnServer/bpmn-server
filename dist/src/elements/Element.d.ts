import { Item } from '../engine/Item';
import { IElement } from '../interfaces/elements';
declare class Element implements IElement {
    id: any;
    type: any;
    subType: any;
    name: any;
    behaviours: Map<any, any>;
    isFlow: boolean;
    continue(item: Item): void;
    describe(): string[][];
    restored(item: Item): void;
    resume(item: Item): void;
    /**
     * respond by providing behaviour attributes beyond item and node information
     *  ex: timer due , input/outupt , fields
     * */
    hasBehaviour(name: any): boolean;
    getBehaviour(name: any): any;
    addBehaviour(nane: any, behavriour: any): void;
}
export { Element };
